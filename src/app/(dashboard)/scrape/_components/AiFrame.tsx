'use client';

import { genAI } from '@/app/api/v1/gemini-settings';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { insertScraperOutput } from '@/lib/scrape';
import { studyGuidePrompt } from '@/lib/scrape';
import { OutputSchema } from '@/schema';
import { createClient } from '@/utils/supabase/client';
import { HarmBlockThreshold, HarmCategory } from '@google/generative-ai';
import { marked } from 'marked';
import type React from 'react';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

const AiFrame: React.FC<{ topic: string; websiteData: string; uuid: string; isLoading: boolean }> =
  memo(({ topic, websiteData, uuid, isLoading: parentIsLoading }) => {
    const [htmlContent, setHtmlContent] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isInserted, setIsInserted] = useState<boolean>(false);

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

          if (!isMounted) return;

          if (error && error.code !== 'PGRST116') {
            throw error;
          }

          if (data) {
            setHtmlContent(data.text_output);
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

      return () => {
        isMounted = false;
      };
    }, [topic, websiteData, uuid, generateContent, isInserted]);

    return (
      <Card>
        <CardHeader>
          <CardTitle>{topic}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading || parentIsLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-20 z-9 backdrop-blur-sm">
              <div className="Circleloader" />
            </div>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
          )}
        </CardContent>
      </Card>
    );
  });

AiFrame.displayName = 'AiFrame';

export { AiFrame };
