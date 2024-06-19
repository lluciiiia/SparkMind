<<<<<<< HEAD
export const app: Readonly<{
  name: string;
  url: string;
  email: string;
  description?: string;
}> = {
  name: 'SparkMind',
  url: 'https://google-gemini-competition.vercel.app',
  email: 'mikeodnis3242004@gmail.com',
  description:
    'SparkMind is a platform designed to help you learn and excel in your field. With our interactive platform, you can learn new concepts, improve your skills, and compete against other users.',
};
=======
import { getURL } from "@/utils/helpers";
export const app: Readonly<{
  name: string;
  description: string;
  url: string;
  email: string;
}> = {
  name: 'SparkMind',
  description: '.',
  url: getURL(),
  email: '', 
}
>>>>>>> 54091cb (chore: linting, and slight modifications)
