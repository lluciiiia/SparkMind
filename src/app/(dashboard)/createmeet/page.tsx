'use client';

import axios from 'axios';
import { useState } from 'react';

import Link from 'next/link';

import { ContentLayout } from '@/components/dashboard/content-layout';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

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

export default function Home() {
  const [eventList, setEventList] = useState([]);
  const [videolist, setvideoList] = useState([]);
  const [showList, setshowList] = useState<Event[]>([]);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  // const eventList = [
  //   {
  //     summary: 'Hand over UI designs to the development team',
  //     description:
  //       'Design team to hand over completed user interface designs to the development team.',
  //     start: {
  //       dateTime: '2024-06-28T18:30:00+05:30',
  //       timeZone: 'GMT+05:30',
  //     },
  //     end: {
  //       dateTime: '2024-06-28T19:00:00+05:30',
  //       timeZone: 'GMT+05:30',
  //     },
  //     conferenceData: {
  //       createRequest: {
  //         requestId: 'generateRandomString(10)', // Generate a unique random string
  //         conferenceSolutionKey: {
  //           type: 'hangoutsMeet',
  //         },
  //       },
  //     },
  //   },
  //   {
  //     summary: 'Begin UI integration',
  //     description:
  //       'Development team to start integrating the new user interface into the mobile app.',
  //     start: {
  //       dateTime: '2024-07-01T09:00:00+05:30',
  //       timeZone: 'GMT+05:30',
  //     },
  //     end: {
  //       dateTime: '2024-07-01T17:00:00+05:30',
  //       timeZone: 'GMT+05:30',
  //     },
  //   },
  //   {
  //     summary: 'Refine navigation flow',
  //     description:
  //       'Technical lead to refine the navigation flow for a more intuitive user experience.',
  //     start: {
  //       dateTime: '2024-06-24T09:00:00+05:30',
  //       timeZone: 'GMT+05:30',
  //     },
  //     end: {
  //       dateTime: '2024-06-24T17:00:00+05:30',
  //       timeZone: 'GMT+05:30',
  //     },
  //   },
  // ];

  // const handleSubmit = async (e: any) => {
  //   e.preventDefault();
  //   try {

  //     const eventList = await axios.get(`/api/v1/geteventlist?videoid=${videoid}`,);

  //     const res = await axios.post('/api/v1/create-event', eventList);
  //     if (res.data.status === 200) {
  //       setMeetLink(res.data.calendarEvents);
  //     } else {
  //       alert(`Error: ${res.data.message}`);
  //     }
  //   } catch (error) {
  //     console.error('Error creating event:', error);
  //     alert('Error creating event');
  //   }
  // };


  const handleSubmit = async (videoid: any) => {
    try {

      const eventlistRes = await axios.get("/api/v1/geteventlist", {
        params: { videoid }
      });

      let eventList = await JSON.stringify(eventlistRes.data);
      console.log("eventList" + eventList);
      const secnd = await JSON.parse(eventList) as any;
      const VSlList: Event[] = secnd.body;

      console.log("this is list of working : " + VSlList);

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

  return (
    <ContentLayout title="Create Meet">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Create Meet</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div>
        <h1>Create Google Calendar Event with Google Meet Link</h1>

        <button onClick={handleList} className='bg-purple-400 mx-10 my-3' type="button">Get List of Video</button>

        <h2>list of video</h2>
        {
          videolist.length > 0 && (
            <div>
              {videolist.map((video: any, idx: number) => (
                <div key={idx}>
                  <button onClick={() => handleSubmit(video.videoid)} className='bg-red-400 mx-10' type="button">Create Event - {video.videoid}</button>
                </div>
              ))}
            </div>
          )
        }

        <div className="container mx-auto p-6">
          <table className="min-w-full bg-slate-500">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="w-1/12 py-2 px-3">Select</th>
                <th className="w-2/12 py-2 px-3">Title</th>
                <th className="w-3/12 py-2 px-3">Description</th>
                <th className="w-2/12 py-2 px-3">Start Date</th>
                <th className="w-2/12 py-2 px-3">End Date</th>
                <th className="w-1/12 py-2 px-3">Time Zone</th>
              </tr>
            </thead>
            <tbody id="table-body">
              {showList.map((item, index) => (
                <tr key={index}>
                  <td className="border px-3 py-2 text-center">
                    <input type="checkbox" className="form-checkbox" onChange={() => handleCheckboxChange(index)} />
                  </td>
                  <td className="border px-3 py-2">
                    <input type="text" className="w-full border-none focus:ring-0" defaultValue={item.summary} />
                  </td>
                  <td className="border px-3 py-2">
                    <input type="text" className="w-full border-none focus:ring-0" defaultValue={item.description} />
                  </td>
                  <td className="border px-3 py-2">
                    <input type="datetime-local" className="w-full border-none focus:ring-0" defaultValue={item.start.dateTime.slice(0, 16)} />
                  </td>
                  <td className="border px-3 py-2">
                    <input type="datetime-local" className="w-full border-none focus:ring-0" defaultValue={item.end.dateTime.slice(0, 16)} />
                  </td>
                  <td className="border px-3 py-2">
                    <select className="w-full border-none focus:ring-0" defaultValue={item.start.timeZone}>
                      <option value="Asia/Calcutta">Asia/Calcutta</option>
                      <option value="PST">PST</option>
                      <option value="CST">CST</option>
                      <option value="EST">EST</option>
                      <option value="GMT">GMT</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={handleLogSelectedRows}
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
          >
            Create Selected Taks
          </button>
        </div>


        <h2>Google Calender Link:</h2>
        {
          eventList.length > 0 && (
            <div>
              {eventList.map((link, idx) => (
                <div key={idx}>
                  <a href={link} className='bg-green-500 m-8 p-2 rounded-md'>Event - {idx}</a>
                </div>
              ))}
            </div>
          )}
      </div>
    </ContentLayout>
  );
}
