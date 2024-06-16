import { Button } from '@/components/ui/button';
/* eslint-disable @typescript-eslint/no-explicit-any */
/// <reference lib="dom" />
import React from 'react';
import { FaMicrophone } from 'react-icons/fa';
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
  const startButtonRef = React.useRef<HTMLButtonElement>(null);
  const resultRef = React.useRef<HTMLDivElement>(null);
  useIsomorphicLayoutEffect(() => {
    // Get references to HTML elements once the component is mounted
    const startButton = document.getElementById('startBtn')! as HTMLButtonElement;

    // Check if the browser supports the Web Speech API
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      // Create a SpeechRecognition object
      // @ts-ignore
      const SpeechRecognition: typeof SpeechRecognition | typeof webkitSpeechRecognition =
        window['SpeechRecognition'] || window['webkitSpeechRecognition'];
      const recognition = new SpeechRecognition();

      // Create a SpeechGrammarList object (optional)
      const SpeechGrammarList = window['SpeechGrammarList'] || window['webkitSpeechGrammarList'];
      const speechRecognitionList = new SpeechGrammarList();
      speechRecognitionList.addFromString('command|stop', 1);

      // Set up recognition properties
      recognition.continuous = true;
      recognition.grammars = speechRecognitionList;

      // Event fired when speech recognition starts
      recognition.onstart = () => {
        startButton.disabled = true;
        // startButton.textContent = 'Listening...';
      };

      // Event fired when speech recognition stops
      recognition.onend = () => {
        startButton.disabled = false;
        // startButton.textContent = 'Start Listening';
      };

      // Event fired when speech recognition results are available
      recognition.onresult = (event: any) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        // resultElement.textContent = transcript;

        // Check if the recognized speech contains the word "stop"
        if (transcript.includes('stop')) {
          setContent((content) => content + transcript.replace('stop', ''));
          recognition.stop();
        } else {
          setContent((content) => content + transcript);
        }
      };

      // Event fired when an error occurs in speech recognition
      recognition.onerror = (event: Event) => {
        console.error('Speech recognition error:', (event as any).error);
      };

      // Start recognition when the button is clicked
      startButton.addEventListener('click', () => {
        recognition.start();
      });
    } else {
      // Browser does not support speech recognition
      alert('Just a heads up, speech recognition is not supported in this browser.');

      startButton.disabled = true;
    }
  }, [setContent]); // Empty dependency array ensures this effect runs once after mounting.
  return (
    <>
      <Button ref={startButtonRef} id="startBtn" className="cursor-pointer">
        <FaMicrophone />
      </Button>
      <div ref={resultRef} id="result" className={`hidden`}></div>
    </>
  );
}
export default SpeechToText;
