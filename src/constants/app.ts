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