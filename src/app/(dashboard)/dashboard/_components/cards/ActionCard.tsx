'use client';

import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import axios from 'axios';
import type React from 'react';
import { useEffect, useState } from 'react';
import type { ActionCardProps, Event, TodoType } from '../interfaces';
import '@/styles/css/custom-scroll.css';
import { Calendar as Calendericon } from 'lucide-react';
import Link from 'next/link';

import '@/styles/css/Circle-loader.css';

const ActionCard: React.FC<ActionCardProps> = ({ learningId }) => {
  if (!learningId) {
    console.error('LearningId is Missing in ActionCard');
  }

  const [date, setDate] = useState<Date | undefined>(new Date());

  const [todoList, setTodoList] = useState<TodoType[]>([]);
  const [eventList, setEventList] = useState<Event[]>([]);
  const [selectedRowsidx, setSelectedRowsidx] = useState<number[]>([]);
  const [isListPreview, setListPreview] = useState<boolean>(false);
  const [initTodoList, setinitTdoLisit] = useState<TodoType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [videoNotAvailable, setVideoNotAvailable] = useState<boolean>(false);

  useEffect(() => {
    const ActionData = async () => {
      try {
        setIsLoading(true);
        if (learningId) {
          //fist check is video is uploaded on not
          const checkid = await isVideoUploaded(learningId);

          if (checkid === true) {
            const check = await getIsActionPreviewDone(learningId);
            if (check === false) {
              await getListOfEvent(learningId);
              setListPreview(true);
            } else {
              await getTodoTaskFormDB(learningId);
            }
          } else {
            setVideoNotAvailable(true);
          }
        }
      } catch (error) {
        console.error('not enough permissions to access calander : ' + (error as Error).message);
      } finally {
        setIsLoading(false);
      }
    };
    ActionData();
  }, []);

  const isVideoUploaded = async (learningid: string) => {
    const res = await axios.get('/api/v1/check-video', {
      params: { learningid: learningid },
    });

    if (res.status === 200) return res.data.exists;

    return false;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (date) {
      const filteredList = initTodoList.filter((todo) => {
        return formatDate(todo.start_dateTime) === formatDate(date.toISOString());
      });
      setTodoList(filteredList);
    }
  }, [date, initTodoList]);

  const getListOfEvent = async (LearningId: any) => {
    try {
      const eventlistRes = await axios.get('/api/v1/geteventlist', {
        params: { LearningId: LearningId },
      });

      const eventList = JSON.stringify(eventlistRes.data);

      const secnd = (await JSON.parse(eventList)) as any;
      const VSlList: Event[] = secnd.body;

      setEventList(VSlList);
    } catch (error) {
      console.error('Error creating event :', error);
      alert('Error creating event : ' + (error as Error).message);
    }
  };

  const handleCreateEvent = async () => {
    try {
      const selectedTask = selectedRowsidx.map((rowIndex) => ({
        summary: eventList[rowIndex].summary,
        description: eventList[rowIndex].description,
        start: {
          dateTime: eventList[rowIndex].start.dateTime,
          timeZone: eventList[rowIndex].start.timeZone,
        },
        end: {
          dateTime: eventList[rowIndex].end.dateTime,
          timeZone: eventList[rowIndex].end.timeZone,
        },
      }));

      const res = await axios.post('/api/v1/create-event', {
        selectedTask: selectedTask,
        learningId: learningId,
      });

      if (res.data.status === 200) {
        setTodoList(res.data.todolist);
        setinitTdoLisit(res.data.todolist);
      } else {
        alert(`Error create-event: ${res.data.message}`);
      }

      setListPreview(false);
    } catch (err) {
      console.log('Error in creating Event ' + (err as Error).message);
      return;
    }
  };

  const handleCheckboxChange = (index: number) => {
    setSelectedRowsidx((prevSelectedRows) => {
      if (prevSelectedRows.includes(index)) {
        return prevSelectedRows.filter((row) => row !== index);
      } else {
        return [...prevSelectedRows, index];
      }
    });
  };

  const getIsActionPreviewDone = async (learningid: string) => {
    const res = await axios.get('/api/v1/getaction-preview', {
      params: { learningid: learningid },
    });

    if (res.status === 200) return res.data.check;

    return false;
  };

  const getTodoTaskFormDB = async (learningId: string) => {
    try {
      const eventlistRes = await axios.get('/api/v1/todo-tasks', {
        params: { learning_id: learningId },
      });

      if (eventlistRes.status === 200) {
        setTodoList(eventlistRes.data.todo_task);
        setinitTdoLisit(eventlistRes.data.todo_task);
      } else {
        setTodoList([]);
      }
    } catch (err) {
      console.log('getTodoTaskFormDB gives error:' + (err as Error).message);
      setTodoList([]);
    }
  };

  return (
    <Card className="w-full h-[calc(100vh-56px-64px-20px-24px-56px-48px-40px)] rounded-t-3xl">
      <div className="flex flex-row h-full rounded-t-3xl w-full justify-between">
        {videoNotAvailable === true ? (
          <div className="flex h-full w-full justify-center items-center">
            <p>
              No videos were found. Please give Calendar access in the Sign-in and upload the video.
            </p>
          </div>
        ) : (
          <>
            <div className="w-full">
              {isListPreview === true ? (
                <div className="w-full pl-4 h-full overflow-y-auto">
                  <div className="flex flex-row justify-between items-center">
                    <h2 className="text-xl font-bold border-b pb-2 mb-4">List of Event</h2>
                    <button
                      onClick={() => handleCreateEvent()}
                      className="bg-navy text-white py-2 px-4 rounded mr-2 mb-2"
                    >
                      {' '}
                      Create Selected Task
                    </button>
                  </div>
                  <div className="space-y-4">
                    {eventList.map((item, index) => (
                      <div key={index} className="border-b pb-4">
                        <div className="flex flex-row items-center">
                          <input
                            type="checkbox"
                            className="form-checkbox w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 mr-2"
                            onChange={() => handleCheckboxChange(index)}
                          />
                          <p className="text-sm mr-2">
                            {item.start.dateTime.slice(0, 16).split('T')[0]}
                            {/* - {item.end.dateTime.slice(0, 16)} */}
                          </p>
                          <p className="text-orange-600">
                            {new Date(item.start.dateTime).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}{' '}
                            -{' '}
                            {new Date(item.end.dateTime).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                        <input
                          defaultValue={item.summary}
                          className="text-lg font-semibold w-96 block"
                        />
                        <textarea
                          defaultValue={item.description}
                          className="text-sm block w-full"
                        />
                        <select
                          className="w-32 focus:ring-0 mt-2 border
                                               border-[#003366] p-1 rounded-lg"
                        >
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
                    <div className="flex flex-row border-b mb-4 pb-2 items-center">
                      <h2 className="text-xl font-bold mr-2">List of Event</h2>
                      <p>(based on video input)</p>
                    </div>
                    <div className="space-y-4">
                      {todoList.map((item, index) => (
                        <div key={index} className="border-b pb-4">
                          <div className="flex flex-row items-center">
                            <p className="text-sm font-bold mr-2">
                              {item.start_dateTime.slice(0, 16).split('T')[0]}
                            </p>
                            <p className="text-orange-600 font-bold">
                              {new Date(item.start_dateTime).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}{' '}
                              -{' '}
                              {new Date(item.end_dateTime).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                          <div className="flex flex-row items-center">
                            <p className="text-lg font-semibold mr-2">{item.summary}</p>
                            <Link href={item.event_link}>
                              <Calendericon className="h-5 w-5" />
                            </Link>
                          </div>
                          <p className="text-sm">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-20 z-20 backdrop-blur-sm">
                <div className="Circleloader"></div>
              </div>
            )}
          </>
        )}
      </div>
    </Card>
  );
};

export default ActionCard;
