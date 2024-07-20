import rotateToken from '@/app/(misc)/_middleware/rotateToken';
import { createClient } from '@/utils/supabase/server';
import { google } from 'googleapis';
import { type NextRequest, NextResponse } from 'next/server';

//const SCOPES = 'https://www.googleapis.com/auth/calendar';

interface Event {
  summary: string;
  description: string;
  startDate: {
    dateTime: string;
    timeZone: string;
  };
  endDate: {
    dateTime: string;
    timeZone: string;
  };
}

function generateRandomString(length: number) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const createCalendarEvent = async (eventList: Event[], accessToken: any): Promise<string[]> => {
  const auth = new google.auth.OAuth2();

  auth.setCredentials({
    access_token: accessToken,
  });

  const calendar = google.calendar({ version: 'v3', auth });

  const responseArray: string[] = [];

  for (const event of eventList) {
    try {
      const response = await calendar.events.insert({
        calendarId: 'primary',
        sendNotifications: true,
        requestBody: {
          ...event,
          conferenceData: {
            createRequest: {
              requestId: generateRandomString(10),
            },
          },
        },
      });

      const data = response.data;

      if (response.status === 200 && data.htmlLink) {
        responseArray.push(data.htmlLink);
      }
    } catch (error) {
      console.log('Error while creating Calendar Event:', error);
    }
  }

  console.log('this is Repose Array : ' + responseArray);
  return responseArray;
};

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const data = (await req.json()) as { selectedTask: Event[] };

    const supabaseClient = createClient();
    const uuid = (await supabaseClient.auth.getUser()).data.user?.id;

    if (uuid === undefined) {
      return NextResponse.json({ status: 400, error: 'User not authenticated' });
    }

    const selectedTask: Event[] = data.selectedTask;

    console.log(selectedTask);

    // Use type assertion to add uuid to the request object
    (req as any).uuid = uuid;

    let accessToken;

    // rotateToken is useful for Refresh Google Access token
    await rotateToken(req, res, async () => {
      accessToken = (req as any).accessToken;
    });

    if (accessToken !== undefined) {
      const calendarEvents = await createCalendarEvent(selectedTask, accessToken);
      return NextResponse.json({ status: 200, calendarEvents });
    }

    return NextResponse.json({ status: 400, error: 'Access token might be error or undefined' });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json({ status: 500, error: 'Error creating event' });
  }
}
