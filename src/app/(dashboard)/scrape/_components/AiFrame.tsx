'use client';

import { genAI } from '@/app/api/v1/gemini-settings';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { insertScraperOutput } from '@/lib/scrape';
import { studyGuidePrompt } from '@/lib/scrape';
<<<<<<< HEAD
import { debounce } from '@/utils';
=======
import { OutputSchema } from '@/schema';
>>>>>>> origin/main
import { createClient } from '@/utils/supabase/client';
import { HarmBlockThreshold, HarmCategory } from '@google/generative-ai';
import { marked } from 'marked';
import type React from 'react';
import { memo, useCallback, useMemo, useRef, useState, useEffect } from 'react';

const useDebounce = (func: Function, delay: number) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const debouncedFunc = useCallback(
    (...args: any[]) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => func(...args), delay);
    },
    [func, delay]
  );

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  return [debouncedFunc, cancel] as const;
};

const AiFrame: React.FC<{ topic: string; websiteData: string; uuid: string; isLoading: boolean }> =
  memo(({ topic, websiteData, uuid, isLoading: parentIsLoading }) => {
    const [htmlContent, setHtmlContent] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isInserted, setIsInserted] = useState<boolean>(false);
    const [sessionStorageContent, setSessionStorageContent] = useState<string>('');
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

    console.log("Model configuration:", model);

    const generateContent = useCallback(
      async (topic: string, websiteData: string) => {
        if (!topic || !websiteData || isInserted) return;
        setIsLoading(true);

        try {
          const prompt = await studyGuidePrompt(topic, websiteData);
          const result = await model.generateContent(prompt);
          const text = result.response.text();
          const content = await marked(text);
          setHtmlContent(content);
          await insertScraperOutput(text, topic, uuid);
          setIsInserted(true);
        } catch (error) {
          console.error('Error generating content:', error);
          setHtmlContent(`<p>Error generating content. Please try again.</p>`);
        } finally {
          setIsLoading(false);
        }
      },
      [model, uuid, isInserted],
    );

    useEffect(() => {
      let isMounted = true;

      const checkExistingData = async () => {
        if (!topic || !websiteData || !uuid || isInserted) return;

        try {
          const supabase = createClient();
          const { data, error } = await supabase
            .from('scraper_output')
            .select('*')
            .eq('output_id', uuid)
            .maybeSingle();

<<<<<<< HEAD
          if (error) {
            if (error.code === 'PGRST116') {
              setIsInserted(false);
              debouncedGenerateContent(topic, websiteData);
            } else {
              throw error;
            }
          } else if (data) {
=======
          if (!isMounted) return;

          if (error && error.code !== 'PGRST116') {
            throw error;
          }

          if (data) {
>>>>>>> origin/main
            setHtmlContent(data.text_output);
            setSessionStorageContent(data.text_output);
            window.sessionStorage.setItem('scraper_output', data.text_output);
            setIsInserted(true);
          } else {
            await generateContent(topic, websiteData);
          }
        } catch (error) {
          console.error('Error checking existing data:', error);
          if (isMounted) {
            setHtmlContent(`<p>Error checking existing data. Please try again.</p>`);
          }
        }
      };

      checkExistingData();
<<<<<<< HEAD
    }, [topic, websiteData, debouncedGenerateContent, uuid]);
=======

      return () => {
        isMounted = false;
      };
    }, [topic, websiteData, uuid, generateContent, isInserted]);

>>>>>>> origin/main
    return (
      <Card>
        <CardHeader>
          <CardTitle>{topic}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading || parentIsLoading ? (
            <Skeleton className="h-96 w-full" />
          ) : (
            <div dangerouslySetInnerHTML={{ __html: sessionStorageContent ? sessionStorageContent : htmlContent }} />
          )}
        </CardContent>
      </Card>
    );
  });

AiFrame.displayName = 'AiFrame';

export { AiFrame };