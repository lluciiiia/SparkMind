'use client';
import { Button } from '@/components/ui/button';
/// <reference lib="dom" />
import React, { useState } from 'react';
import { FaMicrophone, FaStop } from 'react-icons/fa';
import { toast } from 'sonner';
import { useIsomorphicLayoutEffect } from 'usehooks-ts';

/*
 * Intakes a state setter where the component
 * will store the result of speech to text into
 * the respective state
 */
function SpeechToText({
  setContent,
}: {
  setContent: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [isRecording, setIsRecording] = useState(false);
  const startButtonRef = React.useRef<HTMLButtonElement>(null);
  const resultRef = React.useRef<HTMLDivElement>(null);
  const recognitionRef = React.useRef<any>(null);

  useIsomorphicLayoutEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition =
        (window as any)['SpeechRecognition'] || (window as any)['webkitSpeechRecognition'];
      recognitionRef.current = new SpeechRecognition();

      const recognition = recognitionRef.current;

      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsRecording(true);
        toast.success('Listening... Speak now!', {
          description: 'Click the stop button to end recording.',
          duration: 3000,
        });
      };

      recognition.onend = () => {
        setIsRecording(false);
        toast.info('Speech recognition ended.', {
          description: 'Click the microphone to start again.',
          duration: 3000,
        });
      };

      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }

        if (finalTranscript) {
          if (finalTranscript.toLowerCase().includes('stop')) {
            setContent((content) => content + ' ' + finalTranscript.replace(/stop/gi, '').trim());
            recognition.stop();
          } else {
            setContent((content) => content + ' ' + finalTranscript.trim());
          }
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', (event as any).error);
        toast.error('Speech recognition error', {
          description: event.error,
          duration: 5000,
        });
      };
    } else {
      toast.error('Speech recognition not supported 🥲', {
        description: 'Your browser does not support speech recognition.',
        duration: 5000,
      });

      if (startButtonRef.current) {
        startButtonRef.current.disabled = true;
      }
    }
  }, [setContent]);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
    }
  };

  return (
    <>
      <Button
        ref={startButtonRef}
        id="startBtn"
        className="cursor-pointer"
        onClick={toggleRecording}
      >
        {isRecording ? <FaStop /> : <FaMicrophone />}
      </Button>
      <div ref={resultRef} id="result" className={`hidden`}></div>
    </>
  );
}

export default SpeechToText;
