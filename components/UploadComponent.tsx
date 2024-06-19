"use client";
import React, { useState } from 'react';
import axios from 'axios';

export default function UploadComponent() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [objectURL, setObjectURL] = useState<string | null>(null);
    const [keywords, setKeywords] = useState<[]>([]);
    const [fetchedTranscript, setFetchedTranscript] = useState('');

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            const pathURL = URL.createObjectURL(file);
            setSelectedFile(file);
            setObjectURL(pathURL);
            console.log(objectURL);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return

        try {
            const formData = new FormData()
            formData.append('file', selectedFile)

            const res = await fetch('/api/extract-transcribe', {
                method: 'POST',
                body: formData
            })

            if (!res.ok) throw new Error(await res.text());

            const data = await res.json();
            console.log(data);

            setFetchedTranscript(data.transcription);
            setKeywords(data.keywords);

        } catch (err: any) {
            console.error(err)
        }
    };

    return (
        <div>
            <input type="file" name="file" accept='.mp4' onChange={handleFileChange} />
            <button onClick={handleUpload} disabled={!selectedFile} className='bg-red-400 p-4'>
                Upload File
            </button>
            {objectURL && (
                <div>
                    <p>Preview:</p>
                    <video controls src={objectURL}></video>
                    <br />
                    {/* <a href={objectURL} download="video.mp4">Download Video</a> */}
                </div>
            )}
            {keywords.length > 0 && (
                <div>
                    <h2 className='bg-green-500 inline-block text-lg font-bold mb-2 px-2'>Extracted Keywords:</h2>
                    <ul>
                        {keywords.map((keyword, index) => (
                            <li className='inline-block bg-slate-500 px-2 py-1 rounded-lg mb-2 mr-2' key={index}>{keyword}</li>
                        ))}
                    </ul>
                </div>
            )}
            {fetchedTranscript && (
                <div className="mt-4">
                    <h2 className="text-lg font-bold mb-2">Transcript:</h2>
                    <p className="bg-neutral-600 p-3 rounded-lg">{fetchedTranscript}</p>
                </div>
            )}
        </div>
    );
}
