'use client';

import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import type React from 'react';
import { useEffect, useState } from 'react';
import type { ActionCardProps, Event, TodoType } from '../interfaces';
import '@/styles/css/custom-scroll.css';
import { Calendar as Calendericon } from 'lucide-react';
import Link from 'next/link';
import { createEvents } from '../../../../api-handlers/api-handler';

const ActionCard: React.FC<ActionCardProps> = ({ learningId, actionItemsData }) => {
  if (!learningId) console.error('LearningId is Missing in ActionCard');

  const [todoList, setTodoList] = useState<Event[]>([]);
  const [selectedRowsidx, setSelectedRowsidx] = useState<number[]>([]);

  useEffect(() => {
    const ActionData = async () => {
      try {
        console.log(actionItemsData);
        setTodoList(actionItemsData);
      } catch (error) {
        throw new Error('Not enough permissions to access calendar: ' + (error as Error).message);
      }
    };

    ActionData();
  }, []);

  const handleCreateEvent = async () => {
    try {
      if (!learningId) return;

      const selectedTask = selectedRowsidx.map((rowIndex) => ({
        summary: todoList[rowIndex].summary,
        description: todoList[rowIndex].description,
        start: {
          dateTime: todoList[rowIndex].start.dateTime,
          timeZone: todoList[rowIndex].start.timeZone,
        },
        end: {
          dateTime: todoList[rowIndex].end.dateTime,
          timeZone: todoList[rowIndex].end.timeZone,
        },
      }));

      const response = await createEvents(selectedTask, learningId);
      if (response.data.status == 200) {
        alert(`Successfully created a new event! Check your Google Calendar!`);
      } else {
        alert(`Error create-event: ${response.data.error}`);
      }
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

  return (
    <Card className="w-full h-[calc(100vh-56px-64px-20px-24px-56px-48px-40px)] rounded-t-3xl">
      <div className="flex flex-row h-full rounded-t-3xl w-full justify-between">
        {todoList.length > 0 ? (
          <div className="w-full">
            <div className="w-full pl-4 h-full overflow-y-auto">
              <div className="flex flex-row justify-between items-center">
                <h2 className="text-xl font-bold border-b pb-2 mb-4">List of Event</h2>
                <button
                  onClick={() => handleCreateEvent()}
                  className="bg-navy text-white py-2 px-4 rounded mr-2 mb-2"
                >
                  Create Selected Task
                </button>
              </div>
              <div className="space-y-4">
                {todoList.map((item, index) => (
                  <div key={index} className="border-b pb-4">
                    <div className="flex flex-row items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 mr-2"
                        onChange={() => handleCheckboxChange(index)}
                      />
                      <p className="text-sm mr-2">
                        {item.start.dateTime.slice(0, 16).split('T')[0]}
                      </p>
                      <p className="text-orange-600">
                        {new Date(item.start.dateTime).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                        -
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
                    <textarea defaultValue={item.description} className="text-sm block w-full" />
                    <select className="w-32 focus:ring-0 mt-2 border border-[#003366] p-1 rounded-lg">
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
          </div>
        ) : (
          <>
            <div className="flex h-full w-full justify-center items-center">
              <p>
                No videos or relevant data were found for creating the event. Please grant Calendar
                access during sign-in and upload the video.
              </p>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};

export default ActionCard;
