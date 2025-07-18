import { z } from 'zod';

//TODO: Solve the CORS problem from link validation

export const formSchema = z.object({
    title: z.string().min(3).max(100),
    description: z.string().min(20).max(1000),
    category: z.string().min(3).max(20),
    link: z.string()
        .url(),
        // .refine(async (url) => {
        //     try {
        //         const res = await fetch(url, { method: 'HEAD' });
        //         const contentType = res.headers.get('content-type');
        //         console.log('Content-Type:', contentType);

        //         return contentType?.startsWith('image/') || false;
        //     } catch {
        //         return false;
        //     }
        // }),
    pitch: z.string().min(20)
})