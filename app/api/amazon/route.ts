import {
  User,
  activateAlexaSkill,
  alexaLinkingUrl,
  alexaSkillLinked,
  alexaTokensByCode,
  deactivateSkill,
  saveTokenResponse,
} from "@/lib/amazon/alexaService";
import { deactivateAlexaSkill, isAmazonAccountLinked } from "@/lib/helper";
import { prisma } from "@/lib/prisma";
import { getServerUserProfile } from "@/lib/supabase/helper";
import assert from "assert";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

function decodeHTMLEntities(str: string) {
  return str.replace(/&#(\d+);/g, function (match, dec) {
    return String.fromCharCode(dec);
  });
}

const REDIRECT_URL = "/app/impostazioni";

export async function GET(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;

  try {
    const userProfile = await getServerUserProfile(cookies());
    assert(userProfile, "Non autorizzato");

    const { searchParams } = new URL(request.url);
    const paramsObj = Object.fromEntries(searchParams.entries());

    console.log(paramsObj.state && decodeURIComponent(paramsObj.state));

    // Init request.
    // Check if the user is already linked. Otherwise, redirect to the account linking page.
    if (paramsObj.state && decodeURIComponent(paramsObj.state) === "init") {
      if (await isAmazonAccountLinked(userProfile)) {
        return NextResponse.redirect(`${origin}${REDIRECT_URL}`);
      } else {
        return NextResponse.redirect(
          encodeURI(
            alexaLinkingUrl(
              JSON.stringify({ type: "profile" }),
              process.env.NEXT_PUBLIC_AMAZON_SECPROFILE_CLIENT_ID!,
              "profile"
            )
          )
        );
      }
    }

    // Unlink request.
    // Check if the user is linked and deactivate skill
    if (paramsObj.state && decodeURIComponent(paramsObj.state) === "unlink") {
      if (await deactivateAlexaSkill(userProfile)) {
        return NextResponse.redirect(`${origin}${REDIRECT_URL}?unlinked=true`);
      } else {
        return NextResponse.redirect(`${origin}${REDIRECT_URL}`);
      }
    }

    const paramsSchema = z.object({
      code: z
        .string({ required_error: "No code provided" })
        .transform(decodeURIComponent),
      state: z
        .string({ required_error: "No state provided" })
        .transform(decodeURIComponent),
    });
    const params = paramsSchema.parse(paramsObj);

    const stateObj = JSON.parse(
      decodeHTMLEntities(decodeURIComponent(params.state))
    );
    const stateSchema = z.object({
      type: z.string({ required_error: "No type provided" }),
      code: z.string().optional(),
    });
    const state = stateSchema.parse(stateObj);

    if (state.type === "profile") {
      const redirectUri = alexaLinkingUrl(
        JSON.stringify({
          type: "account_linking",
          code: params.code,
        }),
        process.env.NEXT_PUBLIC_AMAZON_CLIENT_ID!,
        "alexa::skills:account_linking alexa::ask:skills:readwrite alexa::ask:models:readwrite alexa::ask:skills:test alexa::alerts:reminders:skill:readwrite"
      );
      return NextResponse.redirect(redirectUri);
    } else if (state.type === "account_linking") {
      assert(state.code, "No code provided");
      const token = await alexaTokensByCode(params.code);
      assert(token, "No token provided");
      const user: User = saveTokenResponse({
        user: {
          amazonAccessToken: "",
          amazonRefreshToken: "",
          amazonRefreshDate: "",
        },
        response: token,
      });

      const res = await activateAlexaSkill(user, state.code);

      if (res && res.accountLink.status === "LINKED") {
        const linkAmazon = await prisma.profilo.update({
          where: { id: userProfile.id },
          data: {
            amazonAccount: {
              upsert: {
                where: { profiloId: userProfile.id },
                create: {
                  userId: res.user.id,
                  accessToken: user.amazonAccessToken,
                  refreshToken: user.amazonRefreshToken,
                  refreshDate: user.amazonRefreshDate,
                },
                update: {
                  userId: res.user.id,
                  accessToken: user.amazonAccessToken,
                  refreshToken: user.amazonRefreshToken,
                  refreshDate: user.amazonRefreshDate,
                },
              },
            },
          },
        });
        if (linkAmazon) {
          return NextResponse.redirect(`${origin}${REDIRECT_URL}?linked=true`);
        }
        return NextResponse.redirect(
          `${origin}${REDIRECT_URL}?error=${encodeURIComponent(
            "Internal DB error"
          )}`
        );
      }

      return NextResponse.redirect(
        `${origin}${REDIRECT_URL}?error=${encodeURIComponent(
          "Amazon linking error"
        )}`
      );
    }

    return NextResponse.redirect(
      `${origin}${REDIRECT_URL}?error=${encodeURIComponent(
        "Invalid state type"
      )}`
    );
  } catch (error: any) {
    return NextResponse.redirect(
      `${origin}${REDIRECT_URL}?error=${encodeURIComponent(
        `Internal server error. ${error.message}`
      )}`
    );
  }
}
