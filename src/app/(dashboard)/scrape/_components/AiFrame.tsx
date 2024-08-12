'use client';

import { genAI } from '@/app/api/v1/gemini-settings';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { insertScraperOutput } from '@/lib/scrape';
import { studyGuidePrompt } from '@/lib/scrape';
import { OutputSchema } from '@/schema';
import { debounce } from '@/utils';
import { createClient } from '@/utils/supabase/client';
import { HarmBlockThreshold, HarmCategory } from '@google/generative-ai';
import { marked } from 'marked';
import type React from 'react';
import { memo, useCallback, useMemo, useState } from 'react';
import { useIsomorphicLayoutEffect } from 'usehooks-ts';

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
          const prompt = studyGuidePrompt(topic, websiteData);
          const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
          });
          const response = result.response;
          const text = response.text();
          const content = await marked(text);
          setHtmlContent(content);
          await insertScraperOutput(text, topic, uuid);
          setIsInserted(true);
        } catch (error) {
          console.error('Error generating content:', error);
          setHtmlContent('<p>Error generating content. Please try again.</p>');
        } finally {
          setIsLoading(false);
        }
      },
      [model, uuid, isInserted],
    );

    const debouncedGenerateContent = useMemo(
      () => debounce(generateContent, 1000),
      [generateContent],
    );

    useIsomorphicLayoutEffect(() => {
      const checkExistingData = async () => {
        if (!topic || !websiteData || !uuid) return;

        try {
          const supabase = createClient();
          const { data, error } = await supabase
            .from('scraper_output')
            .select('*')
            .eq('output_id', uuid)
            .maybeSingle();

          if (error) {
            if (error.code === 'PGRST116') {
              // No data found, proceed with content generation
              setIsInserted(false);
              debouncedGenerateContent(topic, websiteData);
            } else {
              throw error;
            }
          } else if (data) {
            setHtmlContent(data.text_output);
            setIsInserted(true);
          } else {
            setIsInserted(false);
            debouncedGenerateContent(topic, websiteData);
          }
        } catch (error) {
          console.error('Error checking existing data:', error);
          setIsInserted(false);
          debouncedGenerateContent(topic, websiteData);
        }
      };

      checkExistingData();
    }, [topic, websiteData, debouncedGenerateContent, uuid]);

    return (
      <Card>
        <CardHeader>
          <CardTitle>{topic}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading || parentIsLoading ? (
            <div>Loading...</div>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
          )}
        </CardContent>
      </Card>
    );
  });

AiFrame.displayName = 'AiFrame';

export { AiFrame };
