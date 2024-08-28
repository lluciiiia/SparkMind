import type { LandingCardProps } from '@/components/landing';

export const cards: LandingCardProps[] = [
  {
    title: 'Diverse Learning Material input support',
    description: 'Accepts various types of input',
    lists: [
      { list_title: 'Video' },
      { list_title: 'Text' },
      { list_title: 'Keywords' },
      { list_title: 'Topics' },
      { list_title: 'Images' },
      { list_title: 'Audio' },
    ],
  },
  {
    title: 'Generated Study Materials',
    description: '',
    lists: [
      {
        list_title: 'Summary',
        list_description: 'Provides concise summaries of learning materials.',
      },
      {
        list_title: 'Video Recommendation',
        list_description: 'Suggests relevant videos for further understanding.',
      },
      {
        list_title: 'Q&A',
        list_description: 'Generates exercise questions to help master the concepts.',
      },
      {
        list_title: 'Further Information',
        list_description: 'Offers additional resources for deeper learning.',
      },
    ],
  },
  {
    title: 'Note-taking',
    description: '',
    lists: [
      {
        list_title: 'Grammar Refinement',
        list_description: 'Corrects grammatical errors in notes.',
      },
      {
        list_title: 'Concise Version',
        list_description: 'Summarizes and simplifies lengthy or disorganized notes.',
      },
    ],
  },
  {
    title: 'AI-powered Discussion',
    description:
      'Engage in further discussions with AI about the learning materials to enhance comprehension.',
    lists: [],
  },
  {
    title: 'Extended Learning Materials',
    description:
      'Allows adding extra learning materials, integrating new inputs with existing ones for comprehensive study support.',
    lists: [],
  },
  {
    title: 'Learning History',
    description: 'Tracks and maintains a history of all learning activities and materials.',
    lists: [],
  },
];
