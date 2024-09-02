'use client';

import { genAI } from '@/app/api/v1/gemini-settings';
import { usePersistedId } from '@/hooks';
import { fetchScraperOutput, insertScraperOutput, studyGuidePrompt } from '@/lib/scrape';
import { HarmBlockThreshold, HarmCategory } from '@google/generative-ai';
import { marked } from 'marked';
import type React from 'react';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

const AiFrame: React.FC<{
  topic: string;
  websiteData: string;
  isLoading: boolean;
}> = memo(({ topic, websiteData, isLoading: parentIsLoading }) => {
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [isInserted, setIsInserted] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const { id: outputId, generateNewId, clearId, setPersistedId } = usePersistedId('output_id');

  const googleGenerativeAI = useMemo(() => genAI, []);

  const model = useMemo(
    () =>
      googleGenerativeAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
          },
        ],
      }),
    [googleGenerativeAI],
  );

  const generateContent = useCallback(
    async (currentTopic: string, currentWebsiteData: string) => {
      if (!currentTopic || !currentWebsiteData || isInserted) {
        setHtmlContent('<p>Missing topic or website data.</p>');
        return null;
      }

      try {
        clearId();
        const prompt = await studyGuidePrompt(currentTopic, currentWebsiteData);
        const result = await model.generateContent(prompt);
        const text = await result.response.text();
        const content = await marked(text);
        setHtmlContent(content);
        return text;
      } catch (error) {
        console.error('Error generating content:', error);
        setHtmlContent(
          `<p>Error generating content: ${error instanceof Error ? error.message : 'Unknown error'}</p>`,
        );
        toast.error('Error generating content');
        return null;
      }
    },
    [model, isInserted, clearId],
  );

  useEffect(() => {
    if (!topic || !websiteData || isInserted || isGenerating || parentIsLoading) return;

    const checkExistingData = async () => {
      setIsGenerating(true);
      try {
        const generatedText = await generateContent(topic, websiteData);
        if (generatedText && outputId) {
          await insertScraperOutput(outputId, topic, generatedText);
          setIsInserted(true);
          const content = await marked(generatedText);
          setHtmlContent(content);
        }
      } catch (error) {
        console.error('Error checking existing data:', error);
        setHtmlContent(
          `<p>Error checking existing data: ${error instanceof Error ? error.message : 'Unknown error'}</p>`,
        );
        toast.error('Error checking existing data');
      } finally {
        setIsGenerating(false);
      }
    };

    checkExistingData();
  }, [
    topic,
    websiteData,
    outputId,
    generateContent,
    generateNewId,
    isInserted,
    isGenerating,
    parentIsLoading,
    clearId,
  ]);

  return (
    <>
      {parentIsLoading || isGenerating ? (
        <p>Generating content...</p>
      ) : htmlContent ? (
        <pre
          className="whitespace-pre-wrap font-mono text-sm"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      ) : (
        <p>No content available.</p>
      )}
    </>
  );
});

AiFrame.displayName = 'AiFrame';

export { AiFrame };
