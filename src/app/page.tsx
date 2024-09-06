'use client';

import { CustomVideo } from '@/components';
import { BentoGrid, BentoGridItem, InfiniteMovingCards } from '@/components/';
import { Footer } from '@/components/custom/Footer';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState, useRef, useEffect } from 'react';
import {
  FaBook,
  FaChevronLeft,
  FaChevronRight,
  FaEnvelope,
  FaFileAlt,
  FaHistory,
  FaPencilAlt,
  FaPhone,
  FaPuzzlePiece,
  FaRobot,
} from 'react-icons/fa';
import { HomeNavigation } from './HomeNavigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface VideoCarouselProps {
  videos: string[];
}

export function VideoCarousel({ videos }: VideoCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextVideo = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % videos.length);
  };

  const prevVideo = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + videos.length) % videos.length);
  };

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.split('v=')[1];
    return `https://www.youtube.com/embed/${videoId}`;
  };

  return (
    <div className="relative w-full h-full">
      <iframe
        src={getYouTubeEmbedUrl(videos[currentIndex])}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full rounded-xl"
      ></iframe>
      <div className="absolute inset-0 flex items-center justify-between p-4">
        <Button
          variant="outline"
          size="icon"
          onClick={prevVideo}
          className="rounded-full bg-white/80 hover:bg-white"
        >
          <ChevronLeft className="h-6 w-6" />
          <span className="sr-only">Previous video</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={nextVideo}
          className="rounded-full bg-white/80 hover:bg-white"
        >
          <ChevronRight className="h-6 w-6" />
          <span className="sr-only">Next video</span>
        </Button>
      </div>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <div className="flex space-x-2">
          {videos.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full ${index === currentIndex ? 'bg-white' : 'bg-white/50'
                }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Component() {
  const router = useRouter();

  const features = [
    {
      title: 'Diverse Learning Material Input Support',
      icon: <FaBook />,
      description: 'Accepts video, text, keywords, topics, images, and audio',
    },
    {
      title: 'Generated Study Materials',
      icon: <FaFileAlt />,
      description: 'Summaries, video recommendations, Q&A, and further information',
    },
    {
      title: 'Note-taking',
      icon: <FaPencilAlt />,
      description: 'Grammar refinement and concise versions of notes',
    },
    {
      title: 'AI-powered Discussion',
      icon: <FaRobot />,
      description: 'Engage in discussions with AI to enhance comprehension',
    },
    {
      title: 'Extended Learning Materials',
      icon: <FaPuzzlePiece />,
      description: 'Add and integrate new inputs with existing materials',
    },
    {
      title: 'Learning History',
      icon: <FaHistory />,
      description: 'Track and maintain history of all learning activities',
    },
  ];

  const pricingPlans = [
    {
      name: 'Basic AI Learning',
      price: 'Free',
      description: 'Free access to core AI-powered learning features',
    },
    {
      name: 'Pro AI Learning',
      price: '$30/month',
      description: 'Advanced AI-powered learning with personalized insights',
    },
  ];

  const notes = [
    {
      quote: 'The Krebs cycle is a key process in cellular respiration.',
      name: 'Biology Note',
      title: 'Cellular Respiration',
    },
    {
      quote: "Shakespeare's use of iambic pentameter in his sonnets.",
      name: 'Literature Note',
      title: 'Shakespearean Sonnets',
    },
    {
      quote: 'The law of conservation of energy states that energy cannot be created or destroyed.',
      name: 'Physics Note',
      title: 'Conservation of Energy',
    },
    {
      quote: 'The French Revolution began in 1789 and ended in the late 1790s.',
      name: 'History Note',
      title: 'French Revolution',
    },
    {
      quote: 'Python is a high-level, interpreted programming language.',
      name: 'Computer Science Note',
      title: 'Python Basics',
    },
    { quote: 'The Pythagorean theorem: a² + b² = c²', name: 'Math Note', title: 'Geometry' },
  ];

  const demoVideos = [
    'https://www.youtube.com/watch?v=w_CGGikqydg',
    'https://www.youtube.com/watch?v=cGZiN6gvYVg',
    'https://www.youtube.com/watch?v=MJtmCqJjejw',
  ];

  const faqItems = [
    {
      question: 'What is SparkMind?',
      answer:
        'SparkMind is an AI-driven learning hub platform that empowers learners with personalized study materials, AI-powered discussions, and comprehensive learning tools.',
    },
    {
      question: 'How does SparkMind use AI?',
      answer:
        'SparkMind uses AI to generate study materials, provide personalized learning recommendations, and facilitate intelligent discussions to enhance your learning experience.',
    },
    {
      question: 'Is SparkMind suitable for all subjects?',
      answer:
        'Yes, SparkMind is designed to support learning across a wide range of subjects, from sciences and mathematics to humanities and languages.',
    },
    {
      question: 'How much does SparkMind cost?',
      answer:
        'SparkMind offers a free Basic plan with core features, and a Pro plan at $30/month for advanced AI-powered learning and personalized insights.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <HomeNavigation />

      <main className="flex-grow container mx-auto px-4 py-8 mt-16">
        <section className="mb-16 text-center">
          <div className="flex justify-center items-center w-full mb-4">
            <span className="font-extrabold text-center text-lg text-[#003366]">
              AI-driven learning hub platform
            </span>
          </div>
          <div className="flex gap-4 w-full items-center justify-center mb-8">
            <img
              className="w-[10%] h-auto transform scale-x-[-1]"
              src="/assets/images/home/features1.png"
              alt="Arrow"
            />
            <img
              className="w-[50%] h-auto"
              src="/assets/images/home/title 02.png"
              alt="Home Logo"
            />
            <img className="w-[10%] h-auto" src="/assets/images/home/features1.png" alt="Arrow" />
          </div>
          <div className="flex justify-center w-full mb-8">
            <Button
              onClick={() => router.push('/my-learning')}
              className="bg-[#003366] rounded-3xl text-white py-3 px-8 hover:bg-[#0257AC] transition-colors duration-300"
            >
              Get Started
            </Button>
          </div>
          <div className="flex justify-center">
            <img
              className="w-[80%] h-auto"
              src="/assets/images/home/feature-03.png"
              alt="Three Dots"
            />
          </div>
        </section>

        <section id={`about`} className="py-12 md:py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-stretch gap-8 lg:gap-12">
              <div className="w-full lg:w-1/2 flex flex-col justify-between">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-[#003366] leading-tight mb-6">
                    Revolutionize Your Learning Journey
                  </h2>
                  <p className="text-base md:text-lg text-gray-700 mb-4">
                    SparkMind is an innovative AI-driven learning hub designed to transform education. Our platform adapts to your unique learning style, offering personalized study materials and AI-powered discussions across a wide range of subjects.
                  </p>
                  <p className="text-base md:text-lg text-gray-700 mb-6">
                    Whether you're a student, professional, or lifelong learner, SparkMind is here to ignite your curiosity and empower your educational journey. Join us in shaping the future of learning!
                  </p>
                </div>
                <Button className="bg-[#003366] hover:bg-[#0257AC] text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 self-start">
                  Start Your Journey
                </Button>
              </div>

              <div className="w-full lg:w-1/2 h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px]">
                <div className="h-full">
                  <VideoCarousel videos={demoVideos} />
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="mb-16">
          <h2 className="text-3xl font-bold text-center text-[#003366] mb-8">Our Features</h2>
          <BentoGrid>
            {features.map((feature, index) => (
              <BentoGridItem
                key={index}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
              />
            ))}
          </BentoGrid>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center text-[#003366] mb-8">Learning Notes</h2>
          <ScrollArea className="h-[300px] w-full rounded-md p-4">
            <InfiniteMovingCards items={notes} direction="right" speed="slow" className="py-4" />
          </ScrollArea>
        </section>

        <section id="pricing" className="mb-16">
          <h2 className="text-3xl font-bold text-center text-[#003366] mb-8">Pricing</h2>
          <div className="flex flex-col md:flex-row items-center justify-center md:space-x-8 space-y-8 md:space-y-0 mx-auto w-full">
            {pricingPlans.map((plan, index) => (
              <Card
                key={index}
                className="w-full max-w-sm bg-white shadow-lg border border-[#003366] rounded-2xl overflow-hidden"
              >
                <CardHeader>
                  <CardTitle className="text-[#003366]">{plan.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold mb-4 text-[#003366]">{plan.price}</p>
                  <CardDescription className="text-[#003366] mb-4">
                    {plan.description}
                  </CardDescription>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => router.push('/pricing')}
                    className="w-full bg-[#003366] hover:bg-[#0257AC] text-white font-bold py-2 px-4 rounded-full transition duration-300"
                  >
                    Choose Plan
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        <section id="contact" className="mb-16">
          <h2 className="text-3xl font-bold text-center text-[#003366] mb-8">Contact Us</h2>
          <div className="flex flex-col md:flex-row items-center justify-center md:space-x-8 space-y-8 md:space-y-0 mx-auto w-full">
            <Card className="w-full max-w-md bg-white shadow-lg border border-[#003366] rounded-2xl overflow-hidden">
              <CardContent className="flex flex-col items-center p-6">
                <FaEnvelope className="text-4xl text-[#003366] mb-4" />
                <CardTitle className="text-xl font-semibold mb-2 text-[#003366]">Email</CardTitle>
                <CardDescription className="text-[#003366]">
                  <Link
                    href="mailto:support@sparkmind.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    support@sparkmind.com
                  </Link>
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="w-full max-w-md bg-white shadow-lg border border-[#003366] rounded-2xl overflow-hidden">
              <CardContent className="flex flex-col items-center p-6">
                <FaPhone className="text-4xl text-[#003366] mb-4" />
                <CardTitle className="text-xl font-semibold mb-2 text-[#003366]">Phone</CardTitle>
                <CardDescription className="text-[#003366]">+1 (123) 456-7890</CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>

        <section id={`faq`} className="mb-16">
          <h2 className="text-3xl font-bold text-center text-[#003366] mb-8">FAQ</h2>
          <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-[#003366]">{item.question}</AccordionTrigger>
                <AccordionContent className="text-[#0257AC]">{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        <section className="text-center">
          <h2 className="text-3xl font-bold text-[#003366] mb-8">
            Ready to enhance your learning?
          </h2>
          <Button
            onClick={() => router.push('/my-learning')}
            className="bg-[#003366] hover:bg-[#0257AC] text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300"
          >
            Start Learning Now
          </Button>
        </section>
      </main>

      <Footer />
    </div>
  );
}
