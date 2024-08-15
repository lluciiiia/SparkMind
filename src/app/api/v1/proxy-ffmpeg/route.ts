import type { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const url = 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js';

    try {
        const response = await fetch(url);

        // Set headers you want to apply
        res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
        res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');

        // Copy the response headers from the fetched resource
        response.headers.forEach((value: any, name: any) => {
            res.setHeader(name, value);
        });

        // Pipe the response from the CDN to the client
        return response.body?.pipe(res);
    } catch (error) {
        console.error('Error fetching file:', error);
        res.status(500).send('Internal Server Error');
    }
}
