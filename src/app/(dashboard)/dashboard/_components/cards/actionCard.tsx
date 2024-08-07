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


interface TodoType {
    summary: string,
    description: string,
    start_dateTime: string,
    end_dateTime: string,
    timezone: string
}

const ActionCard: React.FC<VideoCardProps> = ({ videos }) => {

    const [date, setDate] = useState<Date | undefined>(new Date());

    const [todoList, setTodoList] = useState<TodoType[]>([]);
    const [EventList, setEventList] = useState<Event[]>([]);
    const [selectedRowsidx, setSelectedRowsidx] = useState<number[]>([]);
    const [isListPreview, setListPreview] = useState<boolean>(false);
    const [initTodoList, setinitTdoLisit] = useState<TodoType[]>([]);

    const learning_id = '6e3a87c0-d43f-443d-834f-210c1553520f';

    useEffect(() => {
        const ActionData = async () => {
            if (learning_id) {
                const check = await getIsActionPreviewDone(learning_id);

                if (check === false) {
                    await getListOfEvent(learning_id);
                    setListPreview(true);
                } else {
                    await getTodoTaskFormDB(learning_id);
                }
            }
        }
        ActionData();
    }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    useEffect(() => {

        if (date) {
            const filteredList = initTodoList.filter(todo => {
                console.log("calander date : " + formatDate(todo.start_dateTime));
                console.log("todo date : " + formatDate(date.toISOString()));
                return formatDate(todo.start_dateTime) === formatDate(date.toISOString())
            });
            setTodoList(filteredList);
        }
    }, [date]);

    const getListOfEvent = async (LearningId: any) => {
        try {
            const eventlistRes = await axios.get("/api/v1/geteventlist", {
                params: { LearningId: LearningId }
            });

            let eventList = JSON.stringify(eventlistRes.data);
            console.log("eventList" + eventList);

            const secnd = await JSON.parse(eventList) as any;
            const VSlList: Event[] = secnd.body;

            setEventList(VSlList);

        } catch (error) {
            console.error('Error creating event :', error);
            alert('Error creating event : ' + (error as Error).message);
        }
    };

    const handleCreateEvent = async () => {
        try {

            const selectedTask = selectedRowsidx.map(rowIndex => ({
                summary: EventList[rowIndex].summary,
                description: EventList[rowIndex].description,
                start: {
                    dateTime: EventList[rowIndex].start.dateTime,
                    timeZone: EventList[rowIndex].start.timeZone,
                },
                end: {
                    dateTime: EventList[rowIndex].end.dateTime,
                    timeZone: EventList[rowIndex].end.timeZone,
                }
            }));

            console.log("selectedTask : " + selectedTask);

            const res = await axios.post('/api/v1/create-event', { selectedTask: selectedTask, learningId: learning_id });

            if (res.data.status === 200) {

                const visulaTodo = selectedRowsidx.map(rowIndex => {
                    const event = EventList[rowIndex];
                    return {
                        summary: event.summary,
                        description: event.description,
                        start_dateTime: event.start.dateTime,
                        end_dateTime: event.end.dateTime,
                        timezone: event.start.timeZone
                    } as TodoType;
                });

                setTodoList(visulaTodo);
                setinitTdoLisit(visulaTodo);
            } else {
                alert(`Error create-event: ${res.data.message}`);
            }

            setListPreview(false);
        }
        catch (err) {
            console.log('Error in creating Event ' + (err as Error).message);
            return;
        }
    };

    const handleCheckboxChange = (index: number) => {
        setSelectedRowsidx(prevSelectedRows => {
            if (prevSelectedRows.includes(index)) {
                return prevSelectedRows.filter(row => row !== index);
            } else {
                return [...prevSelectedRows, index];
            }
        });
    };

    const getIsActionPreviewDone = async (learningid: string) => {
        const res = await axios.get("/api/v1/getaction-preview", {
            params: { learningid: learningid }
        });

        console.log("check check :"+JSON.stringify(res));

        if (res.status === 200) {
            console.log("this is check :" + res.data.check);
            return res.data.check;
        }
        return false;
    }

    const getTodoTaskFormDB = async (learning_id: string) => {
        try {
            const eventlistRes = await axios.get("/api/v1/get-todotask", {
                params: { learning_id: learning_id }
            });

            if (eventlistRes.status === 200) {
                console.log("todo_task : " + JSON.stringify(eventlistRes.data.todo_task));
                setTodoList(eventlistRes.data.todo_task);
                setinitTdoLisit(eventlistRes.data.todo_task);
            } else {
                setTodoList([]);
            }
        }
        catch (err) {
            console.log("getTodoTaskFormDB gives error :" + (err as Error).message);
            setTodoList([]);
        }
    }

    return (
        <Card className="w-full h-[calc(100vh-56px-64px-20px-24px-56px-48px-40px)] rounded-t-3xl">
            <div className="flex flex-row h-full rounded-t-3xl w-full justify-between">
                {1 === 1 ? (
                    <>
                        <div>
                            {isListPreview === true ? (
                                <div className="w-full pl-4 h-full overflow-y-auto">
                                    <h2 className="text-xl font-bold border-b pb-2 mb-4">List of Event</h2>
                                    <div className="space-y-4">
                                        {EventList.map((item, index) => (
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
                                                    {item.start.dateTime.slice(0, 16)}
                                                    - {item.end.dateTime.slice(0, 16)}
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
                                    <button
                                        onClick={() => handleCreateEvent()}
                                        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
                                    > Create Selected Taks</button>
                                </div>
                            ) : (
                                <div className="flex flex-row">
                                    <div>
                                        <Calendar
                                            mode="single"
                                            selected={date}
                                            onSelect={setDate}
                                            className="rounded-md border"
                                        />
                                    </div>
                                    <div className="w-full pl-4 h-full overflow-y-auto">
                                        <h2 className="text-xl font-bold border-b pb-2 mb-4">List of Event</h2>
                                        <div className="space-y-4">
                                            {todoList.map((item, index) => (
                                                <div key={index} className="border-b pb-4">
                                                    <p className="text-orange-600 font-bold">
                                                        {new Date(item.start_dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                                                        {new Date(item.end_dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                    <p className="text-lg font-semibold">{item.summary}</p>
                                                    <p className="text-sm">{item.description}</p>
                                                    <p className="text-sm">
                                                        {item.start_dateTime.slice(0, 16)}
                                                        - {item.end_dateTime.slice(0, 16)}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="flex h-full justify-center items-center">
                        <p>No videos found</p>
                    </div>
                )}
            </div>

        </Card >
    );
};

export default ActionCard;
