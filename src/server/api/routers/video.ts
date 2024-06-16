import { generationConfig, model, uploadToGemini, waitForFilesActive } from '@//server/services';
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import { writeFile } from 'fs/promises';
import { z } from 'zod';

export const videoRouter = createTRPCRouter({
  post: publicProcedure
    .input(
      z.object({
        file: z.any(),
      })
    )
    .mutation(async ({ input }) => {
      const file = input.file;
      const { buffer, originalname: filename, mimetype } = file;

      // Save the file temporarily
      const filePath = `/tmp/${filename}`;
      await writeFile(filePath, buffer);
      console.log(`open ${filePath} to see the uploaded file`);

      try {
        const uploadedFile = await uploadToGemini(filePath, mimetype);
        await waitForFilesActive([uploadedFile]);

        const chatSession = model.startChat({
          generationConfig,
          history: [
            {
              role: 'user',
              parts: [
                {
                  fileData: {
                    mimeType: uploadedFile.mimeType,
                    fileUri: uploadedFile.uri,
                  },
                },
              ],
            },
          ],
        });

        const result = await chatSession.sendMessage(`Please quickly transcribe the audio content of the provided video file into text. Include dialogue-wise transcription with speaker identification based on sound. After completing the transcription, extract the main keywords from the transcribed text. Provide the output in the following JSON format with a maximum of 10 keywords:
        {
          "transcription": [
            {"speaker": "Speaker 1", "text": "First sentence spoken by Speaker 1."},
            {"speaker": "Speaker 2", "text": "First sentence spoken by Speaker 2."},
            ...
          ],
          "keywords": ["keyword1", "keyword2", "keyword3", ...]
        }
        Ensure the keywords reflect the most important and frequently mentioned terms and phrases, with a maximum of 10 keywords. Please prioritize speed in processing.`);

        return {
          status: 200,
          data: await result.response.text(),
        };
      } catch (e: any) {
        console.log(e);
        throw new Error('Failed to process the video file');
      }
    }),
});
