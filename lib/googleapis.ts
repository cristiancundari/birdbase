import { ProfiloWithAllevatore } from "@/types/types";
import assert from "assert";
import { addMinutes, format } from "date-fns";
import { google } from "googleapis";

export const createoAuth2Client = () =>
  new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

export const createGoogleEvent = async ({
  userProfile,
  title,
  date,
  location,
  minutes,
}: {
  userProfile: ProfiloWithAllevatore;
  title: string;
  date: Date;
  location: string;
  minutes: number;
}) => {
  assert(userProfile, "Non autorizzato");

  const oAuth2Client = createoAuth2Client();
  oAuth2Client.setCredentials({
    refresh_token: userProfile.googleRefreshToken,
  });

  const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

  const calendarList = await calendar.calendarList.list();
  const birdbaseCalendar = calendarList.data.items?.find(
    (c) => c.summary === "Birdbase"
  );

  let birdbaseCalendarId;
  if (birdbaseCalendar) {
    birdbaseCalendarId = birdbaseCalendar.id;
  } else {
    const newCalendar = await calendar.calendars.insert({
      requestBody: {
        summary: "Birdbase",
      },
    });
    birdbaseCalendarId = newCalendar.data.id;
  }
  if (!birdbaseCalendarId) {
    throw new Error("Impossibile creare l'evento");
  }

  const event = {
    summary: title,
    location: location,
    start: {
      dateTime: format(date, "yyyy-MM-dd'T'HH:mm:ssXXX"),
    },
    end: {
      dateTime: format(addMinutes(date, minutes), "yyyy-MM-dd'T'HH:mm:ssXXX"),
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: "email", minutes: 1 },
        { method: "popup", minutes: 2 },
      ],
    },
  };

  try {
    const response = await calendar.events.insert({
      calendarId: birdbaseCalendarId,
      requestBody: event,
    });
    return response;
  } catch (error) {
    console.error(error);
    throw new Error("Errore durante la creazione dell'evento");
  }
};
