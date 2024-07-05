'use client'

import axios from 'axios';
import { useState } from 'react';

export default function Home() {
    const [meetLink, setMeetLink] = useState([]);

    const eventList = [
        {
            "summary": "Hand over UI designs to the development team",
            "description": "Design team to hand over completed user interface designs to the development team.",
            "start": {
                "dateTime": "2024-06-28T18:30:00+05:30",
                "timeZone": "GMT+05:30"
            },
            "end": {
                "dateTime": "2024-06-28T19:00:00+05:30",
                "timeZone": "GMT+05:30"
            },
            "conferenceData": {
                "createRequest": {
                    "requestId": "generateRandomString(10)", // Generate a unique random string
                    "conferenceSolutionKey": {
                        "type": 'hangoutsMeet',
                    },
                },
            },
        },
        {
            "summary": "Begin UI integration",
            "description": "Development team to start integrating the new user interface into the mobile app.",
            "start": {
                "dateTime": "2024-07-01T09:00:00+05:30",
                "timeZone": "GMT+05:30"
            },
            "end": {
                "dateTime": "2024-07-01T17:00:00+05:30",
                "timeZone": "GMT+05:30"
            },
        },
        {
            "summary": "Refine navigation flow",
            "description": "Technical lead to refine the navigation flow for a more intuitive user experience.",
            "start": {
                "dateTime": "2024-06-24T09:00:00+05:30",
                "timeZone": "GMT+05:30"
            },
            "end": {
                "dateTime": "2024-06-24T17:00:00+05:30",
                "timeZone": "GMT+05:30"
            }
        },
    ];

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/create-event', eventList);
            if (res.data.status === 200) {
                setMeetLink(res.data.calendarEvents);
            } else {
                alert(`Error: ${res.data.message}`);
            }
        } catch (error) {
            console.error('Error creating event:', error);
            alert('Error creating event');
        }
    };

    return (
        <div>
            <h1>Create Google Calendar Event with Google Meet Link</h1>
            <form onSubmit={handleSubmit}>
                <button className='bg-red-400 mx-10' type="submit">Create Event</button>
            </form>
            <h2>Google Meet Link:</h2>
            {
                meetLink.length > 0 && (
                    <div>
                        {meetLink.map((link, idx) => (
                            <div key={idx}>
                                <a href={link}>Event - idx</a>
                            </div>
                        ))}
                    </div>
                )
            }
        </div>
    );
}
