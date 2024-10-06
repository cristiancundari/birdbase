import { addMinutes, format } from "date-fns";
import { google } from "googleapis";

export const createoAuth2Client = () =>
  new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

export const createGoogleEvent = async ({
  googleToken,
  title,
  date,
  location,
  minutes,
}: {
  googleToken: string;
  title: string;
  date: Date;
  location: string;
  minutes: number;
}) => {
  const oAuth2Client = createoAuth2Client();
  oAuth2Client.setCredentials({
    refresh_token: googleToken,
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
    return {
      error: true,
      message: "Non è stato possibile creare il calendario Birdbase!",
    };
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
    return { error: false, data: response };
  } catch (error) {
    console.error(error);
    return {
      error: true,
      message: "Errore durante l'inserimento dell'evento!",
    };
  }
};

export const deleteGoogleEvent = async ({
  eventId,
  googleToken,
}: {
  eventId: string;
  googleToken: string;
}) => {
  const oAuth2Client = createoAuth2Client();
  oAuth2Client.setCredentials({
    refresh_token: googleToken,
  });

  try {
    const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

    const listaCalendars = await calendar.calendarList.list();
    const calendarBirdbase = listaCalendars.data.items?.find(
      (c) => c.summary == "Birdbase"
    );

    if (!calendarBirdbase?.id)
      return {
        error: true,
        message: "Il calendario di Google non è stato trovato!",
      };

    const eventDeleted = await calendar.events.delete({
      eventId: eventId,
      calendarId: calendarBirdbase.id,
    });

    return {
      error: false,
      data: eventDeleted,
    };
  } catch (error) {
    return {
      error: true,
      message: "Errore durante la cancellazione dell'evento!",
    };
  }
};

export const editGoogleEvent = async ({
  googleToken,
  title,
  date,
  location,
  minutes,
  eventId,
}: {
  googleToken: string;
  title: string;
  date: Date;
  location: string;
  minutes: number;
  eventId: string;
}) => {
  const oAuth2Client = createoAuth2Client();
  oAuth2Client.setCredentials({
    refresh_token: googleToken,
  });

  const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

  const calendarList = await calendar.calendarList.list();
  const birdbaseCalendar = calendarList.data.items?.find(
    (c) => c.summary === "Birdbase"
  );

  if (!birdbaseCalendar?.id) {
    return {
      error: true,
      message:
        "L'evento non può essere modificato in quanto non è presente il calendario",
    };
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
    const response = await calendar.events.update({
      calendarId: birdbaseCalendar.id,
      requestBody: event,
      eventId: eventId,
    });
    return { error: false, data: response };
  } catch (error) {
    console.error(error);
    return {
      error: true,
      message: "Errore durante la modifica dell'evento!",
    };
  }
};
