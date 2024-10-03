import { NextRequest, NextResponse } from "next/server";
import { createoAuth2Client } from "@/lib/googleapis";
import { getServerUserProfile } from "@/lib/supabase/helper";
import assert from "assert";
import { cookies } from "next/headers";
import { google } from "googleapis";
import { addMinutes, format } from "date-fns";

const funzione = async ({title, date, location, minutes}: {title: string, date: Date, location: string, minutes: number}) => {
  const cookieStore = cookies();
  const userProfile = await getServerUserProfile(cookieStore);
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
    throw new Error("Impossibile creare l'evento")
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
    return response
  } catch (error) {
    console.error(error);
    throw new Error("Errore durante la creazione dell'evento");
  }
}

export async function GET(request: NextRequest) {
  //CREARE UN EVENTO NEL CALENDARIO
  const today = new Date();

  try {
    const res = await funzione({title: "Titolo", date: today, location: "location", minutes: 30})
    return NextResponse.json({error: false, data: res.data})
  } catch (error) {
    console.error(error);
    return NextResponse.json({error: true, message: error instanceof Error ? error.message : 'Errore sconosciuto'})
  }
}
