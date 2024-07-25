'use client'

import React, { useCallback, useEffect, useState } from 'react';

import { PlaceholdersAndVanishInput } from '@/components';
import LoadingIndicator from './_components/LoadingIndicator';

import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} from '@google/generative-ai';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import axios from 'axios';


const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

interface Transcript {
    id: number;
    text: string;
}


interface Message {
    id: number,
    text: string;
    sender: 'user' | 'ai';
}

interface Props {
    transcript: Transcript[];
}


//todo change to process.env.GOOGLE_AI_API_KEY not work
const apiKey = 'AIzaSyCP_h8JXeV8Mw0716hKkFpiu7DLanJi8u4' as string || '';
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-pro",
});

const DiscussWithGeminiAI: React.FC<Props> = () => {

    const [input, setInput] = useState<string>('');
    const [responses, setResponses] = useState<Message[]>([]);
    const [chatSession, setChatSession] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [frequentQue, setfrequentQue] = useState<boolean>(false);

    const [basicQuestion, setBasicQuestion] = useState<[]>([]);
    const [transcript, setTranscript] = useState<string | undefined>();

    //Todo change video id to dynamic 
    const video_id = 'cfa0784f-d23c-4430-99b6-7851508c5fdf';

    useEffect(() => {
        const fetchDiscussData = async () => {
            const response = await axios.get(`/api/v1/getdiscuss?videoid=${video_id}`);
            if (response.status === 500) {
                alert('Something Goes Wrong');
            }
            console.log("this is response : " + response.data);
            setBasicQuestion(response.data.basicQue);
            setTranscript(response.data.transcript);
            console.log(response);
        }
        fetchDiscussData();
    }, [video_id]);

    useEffect(() => {
        const Session = model.startChat({
            generationConfig,
            history: [
                {
                    role: "user",
                    parts: [
                        { text: transcript! }
                    ]
                }
            ],
        });

        setChatSession(Session);

    }, [transcript]);

    useEffect(() => {
        if (frequentQue === true) {
            onSubmit();
            setfrequentQue(false);
        }
    }, [frequentQue]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    const onSubmit = useCallback(async () => {
        try {
            if (input.trim()) {

                setLoading(true);
                const newMessage: Message = { id: Date.now(), text: input, sender: 'user' };
                setResponses(prevResponses => [...prevResponses, newMessage]);

                const question = `Given the previous transcript, Based on the transcript, answer the user's question if related. If not, provide a general response. And here is the user's question: "${input}"`;

                const chatResponse = await chatSession.sendMessage(question);

                const aiMessage: Message = { id: Date.now(), text: chatResponse.response.text(), sender: 'ai' };
                setResponses(prevResponses => [...prevResponses, aiMessage]);

                setLoading(false);
                setInput('');
            }
        }
        catch (error) {
            console.log(error);
        }
    }, [input, chatSession]);

    //for feature version 
    // const deleteMessage = (id: number) => {
    //     setResponses(respo => respo.filter(message => message.id !== id));
    // }

    // const updateMessage = (id: number, newTxt: string) => {
    //     setResponses(resp =>
    //         resp.map(message =>
    //             message.id === id ? { ...message, text: newTxt } : message
    //         )
    //     );
    // };

    return (
        <div className='min-h-screen h-screen text-white flex flex-col items-center '>
            <div className='w-full max-w-4xl p-4'>
                <h1 className='text-2xl font-bold mb-4'>Discuss with Gemini AI</h1>
            </div>
            <div className="flex flex-col space-y-2 w-full max-w-4xl px-4 h-4/5 overflow-y-scroll mb-10 no-scrollbar">
                {responses.map((response, index) => (
                    response.sender === 'user' ?
                        (
                            <div className='mb-4 flex justify-end'>
                                <div className={"p-2 rounded bg-blue-500 inline-block"}>
                                    {response.text}
                                </div>
                            </div>
                        ) : (
                            <div className='mb-4 flex justify-start' key={index}>
                                <div className={"p-2 text-black dark:text-white rounded bg-[#e6e6e6] dark:bg-gray-700 inline-block"}>
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {response.text}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        )
                ))}
                {loading === true ? (
                    <div className='mb-4 flex justify-start'>
                        <div className={"p-2 rounded bg-gray-700 inline-block"}>
                            <LoadingIndicator />
                        </div>
                    </div>
                ) : (<></>)
                }
            </div>
            <div className='sticky bottom-0 h-1/5 w-full max-w-5xl bg-[#e6e6e6] dark:bg-[#1e293b] p-4 flex flex-col items-center rounded-t-lg'>
                <div className='flex flex-row overflow-x-auto no-scrollbar'>
                    {basicQuestion.map((que, index) => (
                        <button key={index} onClick={() => {
                            setInput(que);
                            setfrequentQue(true);
                        }} className='bg-gray-600 mx-4 rounded-lg p-2 flex-shrink-0'>{que}</button>
                    ))}
                </div>
                <div className='mt-4 w-3/5'>
                    <PlaceholdersAndVanishInput
                        placeholders={basicQuestion}
                        onChange={handleInputChange}
                        onSubmit={onSubmit}
                    />
                </div>
            </div>
        </div>
    );
};

export default DiscussWithGeminiAI;
