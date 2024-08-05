"use client";

import React, { useEffect, useCallback } from "react";
import { ContentLayout } from "@/components/dashboard/content-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion } from "framer-motion";
import { Triangle } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { FaCaretLeft, FaCaretRight, FaTimes } from "react-icons/fa";
import { PiNoteBlankFill } from "react-icons/pi";
import { useIsomorphicLayoutEffect, useMediaQuery } from "usehooks-ts";
import { z } from "zod";
import { NewNoteSection } from "./new-note";
import {
  Transcript,
  Message,
  Props,
  Note,
  VideoItem,
  Output,
  ParsedVideoData,
} from "./interfaces";
import { retrieveData } from "../../new/_components/hash-handler";
import { useSearchParams } from "next/navigation";

//discuss with AI Imports
import { PlaceholdersAndVanishInput } from "@/components/ui/custom/placeholders-and-vanish-input";
import LoadingIndicator from "@/components/ui/custom/LoadingIndicator";
import DiscussionWithAI from "./discussion-with-ai";
import NoteCard from "./note";
import VideoCard from "./cards/video-recommendation";

import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

import {
  API_KEY,
  genAI,
  model,
  generationConfig,
  safetySettings,
} from "@/app/api/v1/gemini-settings";

import axios from "axios";
import QuestionAndAnswer from "./cards/QuestionAndAnswer";
import { create } from "domain";
import { buildQuiz } from "@/app/api/v1/create-quiz/route";
import { buildSummary } from "@/app/api/v1/create-summary/route";
import Summary from "./cards/Summary";
import { getOutputResponse } from "./api-handler";

const schema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
});

export const Dashboard = () => {
  //const apiKey = process.env.GOOGLE_AI_API_KEY as string;
  if (!API_KEY) {
    console.error("Missing API key");
  }

  const genModel = genAI.getGenerativeModel({
    model,
    generationConfig,
    safetySettings,
  });

  const [isOpen, setIsOpen] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("summary");
  const drawerRef = useRef<HTMLDivElement>(null);
  const [showText, setShowText] = useState(false);

  const [input, setInput] = useState<string>("");
  const [responses, setResponses] = useState<Message[]>([]);
  const [chatSession, setChatSession] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [frequentQue, setFrequentQue] = useState<boolean>(false);

  const [basicQuestion, setBasicQuestion] = useState<[]>([]);
  const [transcript, setTranscript] = useState<string | undefined>();

  // TODO: dynamic video id
  const video_id = "cfa0784f-d23c-4430-99b6-7851508c5fdf";

  const sampleOutput = {
    id: "ed948013-c3f1-428f-875e-51a024faa139",
    youtube:
      '{"kind":"youtube#searchListResponse","etag":"6ookvsywCPSW8fy7sFpWUX3Pd90","nextPageToken":"CAoQAA","regionCode":"VN","pageInfo":{"totalResults":1000000,"resultsPerPage":10},"items":[{"kind":"youtube#searchResult","etag":"v4Ty53uu3xFKAtyd0SbQ8QFhP6Q","id":{"kind":"youtube#video","videoId":"THqS8799JkM"},"snippet":{"publishedAt":"2024-08-05T20:30:02Z","channelId":"UCeY0bbntWzzVIaj2z3QigXg","title":"Federal judge rules against Google in massive antitrust lawsuit","description":"A federal U.S. judge ruled that Google has illegally held a monopoly in two market areas: search and text advertising. NBC News\' ...","thumbnails":{"default":{"url":"https://i.ytimg.com/vi/THqS8799JkM/default.jpg","width":120,"height":90},"medium":{"url":"https://i.ytimg.com/vi/THqS8799JkM/mqdefault.jpg","width":320,"height":180},"high":{"url":"https://i.ytimg.com/vi/THqS8799JkM/hqdefault.jpg","width":480,"height":360}},"channelTitle":"NBC News","liveBroadcastContent":"none","publishTime":"2024-08-05T20:30:02Z"}},{"kind":"youtube#searchResult","etag":"SMQ6Q-lNlANLOkiKcPfoKz5ENLw","id":{"kind":"youtube#video","videoId":"xi8Z-BdLuLo"},"snippet":{"publishedAt":"2017-10-25T06:26:13Z","channelId":"UCNTCIWeq2MG9HKm8CGWY7aw","title":"www.google.com","description":"GOOGLE: https://www.google.com/ in this video i search up google.com, i search up www.google.com , www.google.com.au ...","thumbnails":{"default":{"url":"https://i.ytimg.com/vi/xi8Z-BdLuLo/default.jpg","width":120,"height":90},"medium":{"url":"https://i.ytimg.com/vi/xi8Z-BdLuLo/mqdefault.jpg","width":320,"height":180},"high":{"url":"https://i.ytimg.com/vi/xi8Z-BdLuLo/hqdefault.jpg","width":480,"height":360}},"channelTitle":"The Gary Squad","liveBroadcastContent":"none","publishTime":"2017-10-25T06:26:13Z"}},{"kind":"youtube#searchResult","etag":"NWGn5COvRwhVh2FBuY0y_eoH6dM","id":{"kind":"youtube#video","videoId":"uSv7yFTgk7Q"},"snippet":{"publishedAt":"2024-08-05T19:49:53Z","channelId":"UCrp_UI8XtuYfpiqluWLD7Lw","title":"Google loses DOJ antitrust lawsuit over search","description":"CNBC\'s Deirdre Bosa joins \'Power Lunch\' to discuss Google losing its legal battle with the Department of Justice.","thumbnails":{"default":{"url":"https://i.ytimg.com/vi/uSv7yFTgk7Q/default.jpg","width":120,"height":90},"medium":{"url":"https://i.ytimg.com/vi/uSv7yFTgk7Q/mqdefault.jpg","width":320,"height":180},"high":{"url":"https://i.ytimg.com/vi/uSv7yFTgk7Q/hqdefault.jpg","width":480,"height":360}},"channelTitle":"CNBC Television","liveBroadcastContent":"none","publishTime":"2024-08-05T19:49:53Z"}},{"kind":"youtube#searchResult","etag":"iILtWrfT37Ms8ZDXzRKi2aXoZow","id":{"kind":"youtube#video","videoId":"Dk_kzMUeAvQ"},"snippet":{"publishedAt":"2024-05-04T16:05:06Z","channelId":"UCo8bcnLyZH8tBIH9V1mLgqQ","title":"Google Maps","description":"shorts #animation #cartoon #funny #comedy #google Emilee Dummer ➤ https://www.instagram.com/edummerart/ Kelly Jensen ...","thumbnails":{"default":{"url":"https://i.ytimg.com/vi/Dk_kzMUeAvQ/default.jpg","width":120,"height":90},"medium":{"url":"https://i.ytimg.com/vi/Dk_kzMUeAvQ/mqdefault.jpg","width":320,"height":180},"high":{"url":"https://i.ytimg.com/vi/Dk_kzMUeAvQ/hqdefault.jpg","width":480,"height":360}},"channelTitle":"TheOdd1sOut","liveBroadcastContent":"none","publishTime":"2024-05-04T16:05:06Z"}},{"kind":"youtube#searchResult","etag":"zTA7L4SBu0kwSwRKpHXhnZ6RS6U","id":{"kind":"youtube#video","videoId":"bseK-kY3h9Y"},"snippet":{"publishedAt":"2024-04-20T12:10:13Z","channelId":"UC-FDELertL7eD4olokrKOFg","title":"I Found Very Giant CatNap in Real Life On Google Earth and Google Maps 😱!","description":"I Found Very Giant CatNap in Real Life On Google Earth and Google Maps ! #youtubevideo #findwouldexploring #earth #map ...","thumbnails":{"default":{"url":"https://i.ytimg.com/vi/bseK-kY3h9Y/default.jpg","width":120,"height":90},"medium":{"url":"https://i.ytimg.com/vi/bseK-kY3h9Y/mqdefault.jpg","width":320,"height":180},"high":{"url":"https://i.ytimg.com/vi/bseK-kY3h9Y/hqdefault.jpg","width":480,"height":360}},"channelTitle":"Find would exploring","liveBroadcastContent":"none","publishTime":"2024-04-20T12:10:13Z"}},{"kind":"youtube#searchResult","etag":"4J0cs-nIQjnbAtSdzQcTGVKgNJA","id":{"kind":"youtube#video","videoId":"maYYCw_vHcA"},"snippet":{"publishedAt":"2023-03-06T15:30:11Z","channelId":"UCvz84_Q0BbvZThy75mbd-Dg","title":"Why &quot;GOOGLE&quot; Is Actually Misspelled 🤔 (EXPLAINED)","description":"","thumbnails":{"default":{"url":"https://i.ytimg.com/vi/maYYCw_vHcA/default.jpg","width":120,"height":90},"medium":{"url":"https://i.ytimg.com/vi/maYYCw_vHcA/mqdefault.jpg","width":320,"height":180},"high":{"url":"https://i.ytimg.com/vi/maYYCw_vHcA/hqdefault.jpg","width":480,"height":360}},"channelTitle":"Zack D. Films","liveBroadcastContent":"none","publishTime":"2023-03-06T15:30:11Z"}},{"kind":"youtube#searchResult","etag":"XL6MO8kb1fJVmWzDbulGGL4BIC4","id":{"kind":"youtube#video","videoId":"Rlb4mv1JY08"},"snippet":{"publishedAt":"2022-03-13T05:17:21Z","channelId":"UCXcMEuLWTxA2D8IZcfouBiA","title":"GOOGLE SECRETS YOU DIDN’T KNOW ABOUT!! #Shorts","description":"","thumbnails":{"default":{"url":"https://i.ytimg.com/vi/Rlb4mv1JY08/default.jpg","width":120,"height":90},"medium":{"url":"https://i.ytimg.com/vi/Rlb4mv1JY08/mqdefault.jpg","width":320,"height":180},"high":{"url":"https://i.ytimg.com/vi/Rlb4mv1JY08/hqdefault.jpg","width":480,"height":360}},"channelTitle":"Davidjustinn Shorts","liveBroadcastContent":"none","publishTime":"2022-03-13T05:17:21Z"}},{"kind":"youtube#searchResult","etag":"h9u9FQgLIOmoT80_tVssA8EQkJw","id":{"kind":"youtube#video","videoId":"WdMxxHMjmAM"},"snippet":{"publishedAt":"2020-12-07T12:30:05Z","channelId":"UCTAnlBGVdOuDDLy3WF_HPyw","title":"Google Google  Thuppakki Movie Songs | Star - Vijay ,Kajal Aggarwal","description":"Presenting the \\"Google Google” from “Thuppakki” Directed by AR Murugadoss Starring Vijay, Kajal Aggarwal Produced by ...","thumbnails":{"default":{"url":"https://i.ytimg.com/vi/WdMxxHMjmAM/default.jpg","width":120,"height":90},"medium":{"url":"https://i.ytimg.com/vi/WdMxxHMjmAM/mqdefault.jpg","width":320,"height":180},"high":{"url":"https://i.ytimg.com/vi/WdMxxHMjmAM/hqdefault.jpg","width":480,"height":360}},"channelTitle":"Gemini Audio","liveBroadcastContent":"none","publishTime":"2020-12-07T12:30:05Z"}},{"kind":"youtube#searchResult","etag":"eVKUn5CXhdJmX607USQjDU3Vg7Q","id":{"kind":"youtube#video","videoId":"8_U8MBYsxTw"},"snippet":{"publishedAt":"2024-08-02T16:59:29Z","channelId":"UCt7sv-NKh44rHAEb-qCCxvA","title":"Wylsa Pro: В России заблокируют Google, Android и iOS?","description":"Яндекс ТВ Станция с Алисой. Не задумывайтесь, как и где найти то, что хотите смотреть — просто скажите, и у Алисы с ...","thumbnails":{"default":{"url":"https://i.ytimg.com/vi/8_U8MBYsxTw/default.jpg","width":120,"height":90},"medium":{"url":"https://i.ytimg.com/vi/8_U8MBYsxTw/mqdefault.jpg","width":320,"height":180},"high":{"url":"https://i.ytimg.com/vi/8_U8MBYsxTw/hqdefault.jpg","width":480,"height":360}},"channelTitle":"Wylsacom","liveBroadcastContent":"none","publishTime":"2024-08-02T16:59:29Z"}},{"kind":"youtube#searchResult","etag":"RbbeWoxRAvavEZhrqef87rs245w","id":{"kind":"youtube#video","videoId":"L8etB0ReG-Q"},"snippet":{"publishedAt":"2022-05-17T13:37:54Z","channelId":"UCWC2cXaQVaN6ucNRiHl4Wjw","title":"Google Logo Evolution","description":"1997: The name \\"Google\\" is derived from the mathematical term \\"googol\\", meaning the number ten followed by one hundred ...","thumbnails":{"default":{"url":"https://i.ytimg.com/vi/L8etB0ReG-Q/default.jpg","width":120,"height":90},"medium":{"url":"https://i.ytimg.com/vi/L8etB0ReG-Q/mqdefault.jpg","width":320,"height":180},"high":{"url":"https://i.ytimg.com/vi/L8etB0ReG-Q/hqdefault.jpg","width":480,"height":360}},"channelTitle":"Hilton Animations","liveBroadcastContent":"none","publishTime":"2022-05-17T13:37:54Z"}}]}',
  };
  const searchParams = useSearchParams();
  const [videos, setVideos] = useState<VideoItem[] | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [summaryData, setSummaryData] = useState(null);
  const [output, setOutput] = useState<Output | null>(null);
  const myLearningId = searchParams.get("id");

  useEffect(() => {
    const fetchData = async (myLearningId: string) => {
      try {
        // const response = await getOutputResponse(myLearningId);
        // console.log("response in fetchData: ", response.data.body[0]);
        // setOutput(response.data.body[0]);
        setOutput(sampleOutput);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    if (myLearningId) {
      fetchData(myLearningId);
    }

    // Cleanup function if needed
    return () => {
      console.log("Output retrieved");
    };
  }, []);

  useEffect(() => {
    if (output?.youtube) {
      const parsedData = JSON.parse(output.youtube) as ParsedVideoData;
      const videoItems = parsedData.items as VideoItem[];
      console.log("Video Items:", videoItems);
      setVideos(videoItems);
    }
  }, [output]);

  useEffect(() => {
    const input = searchParams.get("input");

    if (input) {
      createSummary(input);
    }
    if (input) {
      console.log("THE INPUT", input);
      createQuiz(input);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchDiscussData = async () => {
      const response = await axios.get(
        `/api/v1/getdiscuss?videoid=${video_id}`
      );
      if (response.status === 500) {
        alert("Something Went Wrong");
      }
      console.log("this is response : " + response.data);
      setBasicQuestion(response.data.basicQue);
      console.log("the BASIC QUESTIONS", response.data.basicQue);
      setTranscript(response.data.transcript);
      console.log(response);
    };
    fetchDiscussData();
  }, [video_id]);

  useEffect(() => {
    const Session = genModel.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: transcript! }],
        },
      ],
    });

    setChatSession(Session);
  }, [transcript]);

  useEffect(() => {
    if (frequentQue === true) {
      onSubmit();
      setFrequentQue(false);
    }
  }, [frequentQue]);

  const createQuiz = async (query: string) => {
    console.log("THE QUERY", query);
    buildQuiz(query).then((quiz) => {
      console.log("THE QUIZ", quiz);
      if (quiz) {
        setQuestions(quiz);
      }
    });
  };
  const createSummary = async (query: string) => {
    buildSummary(query).then((data) => {
      console.log("THE SUMMARY", data);
      if (data) {
        setSummaryData(data as any);
      }
    });
  };

  const handleDiscussInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const onSubmit = useCallback(async () => {
    try {
      if (input.trim()) {
        setLoading(true);
        const newMessage: Message = {
          id: Date.now(),
          text: input,
          sender: "user",
        };
        setResponses((prevResponses) => [...prevResponses, newMessage]);

        const question = `Given the previous transcript, Based on the transcript, answer the user's question if related. If not, provide a general response. And here is the user's question: "${input}"`;

        const chatResponse = await chatSession.sendMessage(question);

        const aiMessage: Message = {
          id: Date.now(),
          text: chatResponse.response.text(),
          sender: "ai",
        };
        setResponses((prevResponses) => [...prevResponses, aiMessage]);

        setLoading(false);
        setInput("");
      }
    } catch (error) {
      console.log(error);
    }
  }, [input, chatSession]);

  useIsomorphicLayoutEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setShowText(true);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setShowText(false);
    }

    const handleClickOutside = (e: MouseEvent) => {
      const rect = drawerRef.current?.getBoundingClientRect();
      if (
        rect &&
        (e.clientX < rect.left || e.clientX > rect.right) &&
        (e.clientY < rect.top || e.clientY > rect.bottom)
      ) {
        setIsDrawerOpen(false);
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [drawerRef, isDrawerOpen, isOpen]);

  const isLaptop = useMediaQuery("(min-width: 1023px)");

  const handleDelete = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const handleCreate = (values: z.infer<typeof schema>) => {
    const newNote = {
      id: Date.now().toString(),
      title: values.title,
      content: "",
      createdAt: new Date(),
    };
    setNotes([...notes, newNote]);
    setIsDrawerOpen(false);
  };

  const tabs = [
    { name: "summary", label: "Summary" },
    { name: "video", label: "Video recommendation" },
    { name: "qna", label: "Q&A" },
    { name: "further-info", label: "Further Information" },
    { name: "action-items", label: "Action Items" },
  ];

  return (
    <>
      <div className="flex flex-col items-center justify-items-start absolute top-[80px] right-0 rounded-l-md rounded-r-none z-[100] w-fit">
        <motion.details
          open={isOpen}
          onToggle={() => setIsOpen(!isOpen)}
          className="w-full"
          initial={{ width: 30 }}
          animate={{ width: isOpen ? "100%" : 50 }}
          transition={{ type: "spring", stiffness: 100 }}>
          <summary
            className={`left-0 relative p-2 ${
              isOpen ? "rounded-l-md" : "rounded-md"
            } bg-navy text-white rounded-r-none w-full flex items-center justify-start ${
              isOpen ? "justify-start" : "justify-center"
            }`}>
            {isOpen ? <FaCaretLeft size={24} /> : <FaCaretRight size={24} />}
            <PiNoteBlankFill size={24} />

            {showText && <span className="ml-4">New note</span>}
          </summary>
          <NewNoteSection handleCreate={handleCreate} notes={notes} />
        </motion.details>
      </div>
      <ContentLayout title="Dashboard">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <section className="relative border-2 border-gray-400 min-h-[calc(100vh-56px-64px-20px-24px-56px-48px)] bg-gray-200 rounded-3xl mt-[56px]">
          <menu className="flex justify-start border-b border-gray-200 min-h-40px">
            {tabs.map((tab) => (
              <li key={tab.name}>
                <button
                  className={`px-6 py-2 cursor-pointer ${
                    activeTab === tab.name
                      ? "bg-navy text-white rounded-t-3xl"
                      : "text-gray"
                  }`}
                  onClick={() => setActiveTab(tab.name)}>
                  {tab.label}
                </button>
              </li>
            ))}
          </menu>
          {[
            { tab: "summary" },
            { tab: "video" },
            { tab: "qna" },
            { tab: "further-info" },
            { tab: "action-items" },
          ].map(
            ({ tab }) =>
              activeTab === tab && (
                <div className="rounded-t-3xl bg-white h-full" key={tab}>
                  {activeTab === tab && tab === "video" && (
                    <VideoCard videos={videos} />
                  )}
                  {activeTab === tab &&
                    tab === "qna" &&
                    questions.length > 0 && (
                      <QuestionAndAnswer questions={questions} />
                    )}{" "}
                  {activeTab === tab &&
                    tab === "summary" &&
                    summaryData != null && (
                      <Summary summaryData={summaryData} />
                    )}
                  {activeTab != tab && (
                    <Card
                      className={`w-full min-h-[calc(100vh-56px-64px-20px-24px-56px-48px-40px)] overflow-y-auto rounded-t-3xl`}
                    />
                  )}
                </div>
              )
          )}
        </section>
        <footer className=" w-fit flex-col bottom-0 left-0 right-0 mx-auto flex items-center justify-center">
          <motion.div
            initial={{ y: "90%" }}
            animate={{ y: isDrawerOpen ? 100 : "100%" }}
            transition={{ type: "spring", stiffness: 50 }}
            className={`
                absolute flex flex-col items-center justify-center bottom-6
              `}
            ref={drawerRef}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ type: "spring", stiffness: 100 }}
                    className={`w-5 h-5 bottom-0 cursor-pointer mb-2`}
                    onClick={() => setIsDrawerOpen(!isDrawerOpen)}>
                    <Triangle
                      className={`w-5 h-5 bottom-0 ${
                        isDrawerOpen ? "rotate-180" : ""
                      }`}
                      fill="black"
                    />
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent>
                  {isDrawerOpen ? "Close" : "Open"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Discuss with AI */}
            <DiscussionWithAI
              responses={responses}
              loading={loading}
              basicQuestion={basicQuestion}
              input={input}
              setInput={setInput}
              frequentQue={frequentQue}
              setFrequentQue={setFrequentQue}
              onSubmit={onSubmit}
              handleDiscussInputChange={handleDiscussInputChange}
            />
          </motion.div>
        </footer>
      </ContentLayout>
    </>
  );
};
