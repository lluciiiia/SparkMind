'use client'

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { VideoItem, VideoCardProps } from "../interfaces";
import { Calendar } from "@/components/ui/calendar"
import axios from 'axios';

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


const ActionCard: React.FC<VideoCardProps> = ({ videos }) => {

    const [date, setDate] = useState<Date | undefined>(new Date());

    const [eventList, setEventList] = useState([]);
    const [videolist, setvideoList] = useState([]);
    const [showList, setshowList] = useState<Event[]>([]);
    const [selectedRows, setSelectedRows] = useState<number[]>([]);


    const handleSubmit = async (videoid: any) => {
        try {

            const eventlistRes = await axios.get("/api/v1/geteventlist", {
                params: { videoid }
            });

            let eventList = await JSON.stringify(eventlistRes.data);
            console.log("eventList" + eventList);
            const secnd = await JSON.parse(eventList) as any;
            const VSlList: Event[] = secnd.body;

            setshowList(VSlList);

        } catch (error) {
            console.error('Error creating event:', error);
            alert('Error creating event');
        }
    };

    const handleList = async (e: any) => {
        try {
            const res = await axios.get('/api/v1/list-video');

            if (res.data.status === 200) {
                console.log("List of video input : " + res.data.videolist);
                setvideoList(res.data.videolist);
            } else {
                alert(`Error: ${res.data.message}`);
            }
        }
        catch (err) {
            console.error('Error get video list:', err);
            alert('Error get video list');
        }
    }

    const handleLogSelectedRows = async () => {
        const selectedTask = selectedRows.map(rowIndex => ({
            summary: showList[rowIndex].summary,
            description: showList[rowIndex].description,
            start: {
                dateTime: showList[rowIndex].start.dateTime,
                timeZone: showList[rowIndex].start.timeZone,
            },
            end: {
                dateTime: showList[rowIndex].end.dateTime,
                timeZone: showList[rowIndex].end.timeZone,
            }
        }));

        console.log("selectedTask : " + selectedTask);

        const res = await axios.post('/api/v1/create-event', { selectedTask });
        if (res.data.status === 200) {
            setEventList(res.data.calendarEvents);
        } else {
            alert(`Error: ${res.data.message}`);
        }
    };

    const handleCheckboxChange = (index: number) => {
        setSelectedRows(prevSelectedRows => {
            if (prevSelectedRows.includes(index)) {
                return prevSelectedRows.filter(row => row !== index);
            } else {
                return [...prevSelectedRows, index];
            }
        });
    };


    useEffect(() => {
        console.log("date : " + date);

        const data = [
            {
                summary: 'Analyze MR Rate Discrepancy',
                description: 'Investigate why the MR rate for the insect team is higher than the company-wide average. Consider factors like team size, project workload, and potential for improvement.',
                start: {
                    dateTime: '2024-08-05T00:00:00+05:30',
                    timeZone: 'Asia/Calcutta'
                },
                end: {
                    dateTime: '2024-08-12T00:00:00+05:30',
                    timeZone: 'Asia/Calcutta'
                }
            },
            {
                summary: 'Review Issue Comments',
                description: 'Check for any comments on the issue related to MR rate analysis. Determine if the analysis was helpful and identify any areas for improvement.',
                start: {
                    dateTime: '2024-08-05T00:00:00+05:30',
                    timeZone: 'Asia/Calcutta'
                },
                end: {
                    dateTime: '2024-08-05T23:59:59+05:30',
                    timeZone: 'Asia/Calcutta'
                }
            }
        ];

        setshowList(data)

    }, [date]);

    return (
        <Card className="w-full h-[calc(100vh-56px-64px-20px-24px-56px-48px-40px)] rounded-t-3xl">
            <div className="flex flex-row h-full rounded-t-3xl w-full justify-between">
                {/* {"1" === 1 ? ( */}
                <div>
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-md border"
                    />
                </div>
                <div className="w-2/5 pl-4 h-full overflow-y-auto">
                    <h2 className="text-xl font-bold border-b pb-2 mb-4">TO-DO LIST</h2>
                    <div className="space-y-4">
                        {showList.map((item, index) => (
                            <div key={index} className="border-b pb-4">
                                <input
                                    type="checkbox"
                                    className="form-checkbox"
                                    onChange={() => handleCheckboxChange(index)}
                                />
                                <p className="text-orange-600 font-bold">
                                    {new Date(item.start.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                                    {new Date(item.end.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                                <p className="text-lg font-semibold">{item.summary}</p>
                                <p className="text-sm">{item.description}</p>
                                <p className="text-sm">
                                    {new Date(item.start.dateTime).toLocaleDateString()} - {new Date(item.end.dateTime).toLocaleDateString()}
                                </p>
                                <select className="w-full border-none focus:ring-0 mt-2">
                                    <option value="Asia/Calcutta">Asia/Calcutta</option>
                                    <option value="PST">PST</option>
                                    <option value="CST">CST</option>
                                    <option value="EST">EST</option>
                                    <option value="GMT">GMT</option>
                                </select>
                            </div>
                        ))}
                    </div>
                </div>
                {/* ) : (
                    <div className="flex h-full justify-center items-center">
                        <p>No videos found</p>
                    </div>
                )} */}
            </div>

        </Card>
    );
};

export default ActionCard;
