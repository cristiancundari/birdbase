import { addSeconds, isFuture, parseISO } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";

import { randomBytes } from "crypto";
import { v4 } from "uuid";

export type User = {
  amazonAccessToken: string;
  amazonRefreshToken: string;
  amazonRefreshDate: string;
};

export type TokensResponse = {
  access_token: string;
  refresh_token: string;
  token_type: "bearer";
  expires_in: number;
};

type SaveTokenResponseOptions = {
  user: User;
  response: TokensResponse;
  removeState?: boolean;
};

type SkillActivationResponse = {
  skill: { stage: string; id: string };
  user: { id: string };
  accountLink: { status: "LINKED" | "NOT_LINKED" };
  status:
    | "ENABLING"
    | "ENABLING"
    | "ENABLING_FAILED"
    | "DISABLED"
    | "DISABLING"
    | "DISABLING_FAILED"
    | "NO_ASSOCIATION";
};

const {
  NEXT_PUBLIC_AMAZON_SKILL_STAGE,
  NEXT_PUBLIC_AMAZON_REDIRECT_URI,
  NEXT_PUBLIC_AMAZON_SKILL_ID,
  NEXT_PUBLIC_AMAZON_CLIENT_ID,
  AMAZON_CLIENT_SECRET,
} = process.env;
const authServiceUrl = "https://api.amazon.com/auth/o2/token";
const skillActivationAPI = `https://api.eu.amazonalexa.com/v1/users/~current/skills/${NEXT_PUBLIC_AMAZON_SKILL_ID}/enablement`;

/**
 * Saves the token response to the user
 * @param user User to save the tokens
 * @param response Tokens response
 * @returns User with the new tokens
 */
export const saveTokenResponse = ({
  user,
  response,
}: SaveTokenResponseOptions): User => {
  const { access_token, refresh_token, expires_in } = response;

  user.amazonAccessToken = access_token;
  user.amazonRefreshToken = refresh_token;
  user.amazonRefreshDate = addSeconds(new Date(), expires_in).toISOString();

  return user;
};

/**
 * Parses the ISO date string and converts it to the Berlin timezone
 * @param date ISO date string
 * @returns Date
 */
export const parseISODateString = (date: string): Date => {
  const isoDate = parseISO(date);
  return utcToZonedTime(isoDate, "Europe/Berlin");
};

/**
 * Creates random token string
 * @returns Token string
 */
export const createRandomToken = (length = 256): Promise<string> => {
  return new Promise((res) => {
    randomBytes(length, (error, buffer) => {
      if (error) {
        res(v4());
      }

      res(buffer.toString("hex"));
    });
  });
};

/**
 * Converts a fetch response into json if status is ok
 * @param res Fetch response
 * @returns Parsed response
 */
export const parseOkJson = async <T>(res: Response): Promise<T | undefined> => {
  if (!res.ok) {
    console.log("Failed request: ", await res.json());
    return;
  }

  return res.json();
};

/**
 * Creates the Amazon Login Url
 * @param state State to prevent cross site request forgery
 * @param redirectUrl Lara Url to open after amazon login
 * @returns Frontend Url
 */
export const alexaLinkingUrl = (
  state: string,
  clientId: string,
  scope: string
): string => {
  return `https://www.amazon.com/ap/oa?client_id=${clientId}&scope=${scope}&response_type=code&redirect_uri=${process.env.NEXT_PUBLIC_AMAZON_REDIRECT_URI}&state=${state}`;
};

/**
 * Exchanges the amazon code with the amazon access tokens
 * @param code Amazon Auth Code
 * @returns Response with access and refresh token
 */
export const alexaTokensByCode = async (
  code: string
): Promise<TokensResponse | undefined> => {
  const options = {
    grant_type: "authorization_code",
    code: code,
    redirect_uri: NEXT_PUBLIC_AMAZON_REDIRECT_URI,
    client_id: NEXT_PUBLIC_AMAZON_CLIENT_ID,
    client_secret: AMAZON_CLIENT_SECRET,
  };

  return fetch(authServiceUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(options),
  })
    .then((res: Response) => parseOkJson<TokensResponse>(res))
    .catch((e: any) => {
      console.log("Alexa error token exchange ", e);
      return undefined;
    });
};

/**
 * Activates and links the alexa skill
 * @param user Current user
 * @returns Skill response
 */
export const activateAlexaSkill = async (
  user: User,
  oAuthCode: string
): Promise<SkillActivationResponse | undefined> => {
  const options = {
    stage: NEXT_PUBLIC_AMAZON_SKILL_STAGE,
    accountLinkRequest: {
      redirectUri: NEXT_PUBLIC_AMAZON_REDIRECT_URI,
      authCode: oAuthCode,
      type: "AUTH_CODE",
    },
  };
  return fetch(skillActivationAPI, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + user.amazonAccessToken,
    },
    body: JSON.stringify(options),
  })
    .then((res: Response) => parseOkJson<SkillActivationResponse>(res))
    .catch((e: any) => {
      console.log("Alexa activate skill error ", e);
      return undefined;
    });
};

/**
 * Fetches the new access tokens with the refresh token.
 * @param user User to refresh token
 * @returns Response with new tokens
 */
export const refreshAmazonTokens = async (user: User): Promise<User> => {
  // dont refresh the tokens if they aren't expired
  if (
    user.amazonRefreshDate &&
    isFuture(parseISODateString(user.amazonRefreshDate))
  ) {
    return user;
  }

  return fetch(authServiceUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      grant_type: "refresh_token",
      refresh_token: user.amazonRefreshToken,
      client_id: process.env.NEXT_PUBLIC_AMAZON_CLIENT_ID,
      client_secret: process.env.AMAZON_CLIENT_SECRET,
    }),
  })
    .then((res: Response) => parseOkJson<TokensResponse>(res))
    .then((tokens) =>
      tokens ? saveTokenResponse({ user, response: tokens }) : user
    )
    .catch((e: any) => {
      console.log("Alexa refresh tokens error ", e);
      return user;
    });
};

/**
 * Fetches the current status of the account linking
 * @param user User to check status
 * @returns Skill response
 */
export const isSkillLinked = async (
  user: User
): Promise<SkillActivationResponse | undefined> => {
  return fetch(skillActivationAPI, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + user.amazonAccessToken,
    },
  })
    .then((res: Response) => parseOkJson<SkillActivationResponse>(res))
    .catch((e: any) => {
      console.log("Alexa skill linked error ", e);
      return undefined;
    });
};

/**
 * Deactivates and unlinks the alexa skill
 * @param user User to check status
 * @returns Skill response
 */
export const deactivateSkill = async (user: User): Promise<boolean> => {
  return fetch(skillActivationAPI, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + user.amazonAccessToken,
    },
  })
    .then((res: Response) => res.ok)
    .catch((e: any) => {
      console.log("Alexa deactivate skill error", e);

      return false;
    });
};

/**
 * Checks if the User has linked the alexa skill
 * @param user User
 * @returns boolean
 */
export const alexaSkillLinked = async (user: User): Promise<boolean> => {
  if (!user.amazonAccessToken && !user.amazonRefreshToken) {
    return false;
  }

  return await refreshAmazonTokens(user)
    .then((user) => {
      console.log("User", user);
      return isSkillLinked(user);
    })
    .then((response) => response?.accountLink.status === "LINKED");
};
