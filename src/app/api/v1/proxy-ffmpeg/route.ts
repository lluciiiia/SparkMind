// pages/api/proxy-ffmpeg.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const response = await fetch('https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js');

        // Set appropriate headers
        res.setHeader('Content-Type', 'application/javascript');
        res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
        res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');

        // Pipe the response body to the client
        response.body.pipe(res);
    } catch (error) {
        console.error('Error fetching FFmpeg core script:', error);
        res.status(500).json({ error: 'Error fetching FFmpeg core script' });
    }
}
