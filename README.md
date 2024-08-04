<a href="https://sparkmind.vercel.app/">
<!--   <img alt="SparkMind - AI-driven learning enhancement platform" src="https://demo-nextjs-with-supabase.vercel.app/opengraph-image.png"> -->
  <h1 align="center">SparkMind</h1> 
</a>

<p align="center">
 AI-driven learning enhancement platform providing diverse input support, personalized study aids, refined notes, and comprehensive history.
</p>

<p align="center">
  <a href="#team"><strong>Team</strong></a> ·
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#demo"><strong>Demo</strong></a> ·
  <a href="#clone-and-run-locally"><strong>Clone and run locally</strong></a> ·
  <a href="#feedback-and-issues"><strong>Feedback and issues</strong></a>
</p>
<br/>

## Team
- [Seokyung Kim - 0617lucia@gmail.com](https://github.com/lluciiiia)
- [Krishna - @gmail.com](https://github.com/KRISHNA-DHARSANDIA)
- [Mike - @gmail.com](https://github.com/WomB0ComB0)
- [Lovinson - @gmail.com](https://github.com/Wisesofthemall)
- [Hyejin Kim - haejinkim2020@gmail.com]

## Features

- **Diverse Learning Material Input Support**
  - Accepts various types of input: Video, Text, Keywords, Topics, Images, and Audio.

- **Generated Study Materials**
  - **Summary**: Provides concise summaries of learning materials.
  - **Video Recommendations**: Suggests relevant videos for further understanding.
  - **Q&A**: Generates exercise questions to help master the concepts.
  - **Further Information**: Offers additional resources for deeper learning.

- **Note Taking**
  - **Grammar Refinement**: Corrects grammatical errors in notes.
  - **Concise Version**: Summarizes and simplifies lengthy or disorganized notes.

- **AI-Powered Discussion**
  - Engage in further discussions with AI about the learning materials to enhance comprehension.

- **Extended Learning Materials**
  - Allows adding extra learning materials, integrating new inputs with existing ones for comprehensive study support.

- **Learning History**
  - Tracks and maintains a history of all learning activities and materials.

## Demo

You can view a fully working demo at [demo-nextjs-with-supabase.vercel.app](https://demo-nextjs-with-supabase.vercel.app/).


## Clone and run locally

1. You'll first need a Supabase project which can be made [via the Supabase dashboard](https://database.new)

2. Create a Next.js app using the Supabase Starter template npx command

   ```bash
   npx create-next-app -e with-supabase
   ```

3. Use `cd` to change into the app's directory

   ```bash
   cd name-of-new-app
   ```

4. Rename `.env.local.example` to `.env.local` and update the following:

   ```
   NEXT_PUBLIC_SUPABASE_URL=[INSERT SUPABASE PROJECT URL]
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[INSERT SUPABASE PROJECT API ANON KEY]
   ```

   Both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` can be found in [your Supabase project's API settings](https://app.supabase.com/project/_/settings/api)

5. You can now run the Next.js local development server:

   ```bash
   npm run dev
   ```

   The starter kit should now be running on [localhost:3000](http://localhost:3000/).

## Feedback and issues

Please file feedback and issues over on the [Supabase GitHub org](https://github.com/supabase/supabase/issues/new/choose).
