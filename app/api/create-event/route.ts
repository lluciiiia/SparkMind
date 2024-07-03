import { NextRequest, NextResponse } from 'next/server';
import rotateToken from '../middleware/rotateToken';
import { google } from 'googleapis';
import axios from "axios";
import { createClient } from '@/utils/supabase/server';

//const SCOPES = 'https://www.googleapis.com/auth/calendar';

interface Event {
    summary: string,
    description: string,
    start: {
        dateTime: string,
        timeZone: string,
    },
    end: {
        dateTime: string,
        timeZone: string,
    }
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

export async function createCalendarEvent(eventList: Event[], accessToken: any): Promise<string[]> {

    const auth = new google.auth.OAuth2();

    auth.setCredentials({
        access_token: accessToken,
    });

    const calendar = google.calendar({ version: 'v3', auth });

    const responseArray: string[] = [];

    for (const event of eventList) {
        try {
            let response = await calendar.events.insert({
                calendarId: 'primary',
                sendNotifications: true,
                requestBody: {
                    ...event,
                    conferenceData: {
                        createRequest: {
                            requestId: generateRandomString(10),
                            conferenceSolutionKey: {
                                type: "hangoutsMeet"
                            }
                        }
                    }
                },
                conferenceDataVersion: 1
            })

            const data = response.data;

            if (response.status === 200 && data.htmlLink) {
                if (data.hangoutLink) {
                    responseArray.push(data.hangoutLink)
                    responseArray.push(data.htmlLink);
                }
                else {
                    responseArray.push(data.htmlLink);
                }
            }

        } catch (error) {
            console.log('Error while creating Calendar Event:', error);
        }
    }

    console.log("this is Repose Array : " + responseArray);
    return responseArray;
}


export async function POST(req: any, res: NextResponse) {
    try {

        //only for testing purpose
        const supabaseClient = createClient();
        const uuid = (await supabaseClient.auth.getUser()).data.user?.id;

        if (uuid === undefined) {
            return NextResponse.json({ status: 400, error: 'User not authenticated' });
        }

        //TODO change localhost to location.origin
        const eventlistRes = await axios.get("http://localhost:3000/api/geteventlist", {
            params: { uuid }
        });

        let eventList = await JSON.stringify(eventlistRes.data);

        const secnd = await JSON.parse(eventList);

        const interable: Event[] = secnd.body;

        let accessToken = req.accessToken;
        req.uuid = uuid; // to set uuid and pass to the rotate Token

        // rotateToken is usefull for Refresh Google Accsss token
        await rotateToken(req, res, async () => {
            accessToken = await req.accessToken;
        });

        if (accessToken !== undefined) {
            const calendarEvents = await createCalendarEvent(interable, accessToken);

            return NextResponse.json({ status: 200, calendarEvents });
        }

        return NextResponse.json({ status: 400, error: 'Access tocken Might be error or undefined' });

    } catch (error) {
        console.error('Error creating event:', error);
        return NextResponse.json({ status: 500, error: 'Error creating event' });
    }
}
