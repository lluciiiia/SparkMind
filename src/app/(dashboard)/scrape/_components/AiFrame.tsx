'use client';

import { genAI } from '@/app/api/v1/gemini-settings';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PONG } from '@/constants';
import { insertScraperOutput, studyGuidePrompt } from '@/lib/scrape';
import { createClient } from '@/utils/supabase/client';
import { HarmBlockThreshold, HarmCategory } from '@google/generative-ai';
import { Check, Copy } from 'lucide-react';
import { marked } from 'marked';
import type React from 'react';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useCopyToClipboard, useIsomorphicLayoutEffect } from 'usehooks-ts';

const stripHtmlTags = (html: string) => {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
};

const AiFrame: React.FC<{
  topic: string;
  websiteData: string;
  uuid: string;
  isLoading: boolean;
  resetOutputId: () => void;
}> = memo(({ topic, websiteData, uuid, isLoading: parentIsLoading, resetOutputId }) => {
  const isMounted = useRef(true);
  const prevProps = useRef({ topic, websiteData, uuid });

  const [htmlContent, setHtmlContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInserted, setIsInserted] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState(false);
  const [shouldCheckExistingData, setShouldCheckExistingData] = useState(false);
  const [copiedText, copy] = useCopyToClipboard();

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
        return;
      }
      setIsLoading(true);

      try {
        sessionStorage.removeItem('output_id');
        const prompt = await studyGuidePrompt(currentTopic, currentWebsiteData);
        const result = await model.generateContent(prompt);
        const text = await result.response.text();
        const content = await marked(text);
        setHtmlContent(content);

        // Return the generated text for Scraper.tsx to handle
        return text;
      } catch (error) {
        console.error('Error generating content:', error);
        setHtmlContent(`<p>Error generating content. Please try again.</p>`);
        toast.error('Error generating content');
      } finally {
        setIsLoading(false);
      }
    },
    [model, isInserted],
  );

  useIsomorphicLayoutEffect(() => {
    if (!isMounted.current) return;

    const hasChanged =
      prevProps.current.topic !== topic ||
      prevProps.current.websiteData !== websiteData ||
      prevProps.current.uuid !== uuid;

    if (!hasChanged) return;

    prevProps.current = { topic, websiteData, uuid };

    const checkExistingData = async () => {
      if (!topic || !websiteData || !uuid) {
        return;
      }

      resetOutputId();
      setIsInserted(false);

      try {
        const supabase = createClient();
        const storedOutputId =
          sessionStorage.getItem('output_id') ||
          new URLSearchParams(window.location.search).get('output_id');
        console.log('Stored output ID:', storedOutputId);
        if (!storedOutputId) {
          const generatedText = await generateContent(topic, websiteData);
          if (generatedText) {
            setIsInserted(true);
            sessionStorage.setItem('output_id', uuid);
            window.history.pushState({}, '', `?output_id=${uuid}`);
          }
          return;
        }

        const { data, error } = await supabase
          .from('scraper_output')
          .select('*')
          .eq('output_id', storedOutputId)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        if (data) {
          console.log('Existing data found:', data);
          const content = await marked(data.text_output);
          setHtmlContent(content);
          setIsInserted(true);
        } else {
          console.log('No existing data found, generating content');
          const generatedText = await generateContent(topic, websiteData);
          if (generatedText) {
            setIsInserted(true);
            sessionStorage.setItem('output_id', uuid);
            window.history.pushState({}, '', `?output_id=${uuid}`);
          }
        }
      } catch (error) {
        console.error('Error checking existing data:', error);
        if (isMounted.current) {
          setHtmlContent(`<p>Error checking existing data. Please try again.</p>`);
        }
      } finally {
        setShouldCheckExistingData(false);
      }
    };

    checkExistingData();

    return () => {
      isMounted.current = false;
    };
  }, [topic, websiteData, uuid, generateContent, resetOutputId]);

  const handleCopy = useCallback(() => {
    copy(stripHtmlTags(htmlContent))
      .then(() => {
        setIsCopied(true);
        toast.success('Copied to clipboard');
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch((error) => {
        toast.error(`Failed to copy! ${error instanceof Error ? error.message : error}`);
      });
  }, [htmlContent, copy]);

  useEffect(() => {
    console.log('useEffect for generateContent called', { topic, websiteData, uuid, isInserted });
    if (!topic || !websiteData || !uuid || isInserted) {
      console.log('useEffect early return', { topic, websiteData, uuid, isInserted });
      return;
    }

    generateContent(topic, websiteData);
  }, [topic, websiteData, uuid, isInserted, generateContent]);

  useEffect(() => {
    setShouldCheckExistingData(true);
  }, [uuid]);

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>{topic}</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] w-full rounded-md border p-4">
          {isLoading ? (
            <p>Generating content...</p>
          ) : (
            <pre
              className="whitespace-pre-wrap font-mono text-sm"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">{htmlContent.length} characters</div>
        <Button variant="outline" size="sm" onClick={handleCopy}>
          {isCopied ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Copied
            </>
          ) : (
            <>
              <Copy className="mr-2 h-4 w-4" />
              Copy to Clipboard
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
});

AiFrame.displayName = 'AiFrame';

export { AiFrame };
