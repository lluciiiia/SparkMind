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

interface VideoCarouselProps {
  videos: string[];
}

export function VideoCarousel({ videos }: VideoCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [aspectRatio, setAspectRatio] = useState(16 / 9);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const nextVideo = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % videos.length);
  };

  const prevVideo = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + videos.length) % videos.length);
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [currentIndex]);

  useEffect(() => {
    const updateAspectRatio = () => {
      if (videoRef.current) {
        const { videoWidth, videoHeight } = videoRef.current;
        if (videoWidth && videoHeight) {
          setAspectRatio(videoWidth / videoHeight);
        }
      }
    };

    const video = videoRef.current;
    if (video) {
      video.addEventListener('loadedmetadata', updateAspectRatio);
    }

    return () => {
      if (video) {
        video.removeEventListener('loadedmetadata', updateAspectRatio);
      }
    };
  }, [currentIndex]);

  return (
    <div className="relative w-full max-w-3xl mx-auto" ref={containerRef}>
      <div style={{ paddingBottom: `${(1 / aspectRatio) * 100}%` }} className="relative">
        <CustomVideo
          ref={videoRef}
          className="absolute top-0 left-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
        >
          <source src={videos[currentIndex]} type="video/mp4" />
        </CustomVideo>
      </div>
      <button
        onClick={prevVideo}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2 z-10 hover:bg-opacity-75 transition-colors duration-200"
        aria-label="Previous video"
      >
        <FaChevronLeft className="text-[#003366]" />
      </button>
      <button
        onClick={nextVideo}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2 z-10 hover:bg-opacity-75 transition-colors duration-200"
        aria-label="Next video"
      >
        <FaChevronRight className="text-[#003366]" />
      </button>
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
    '/assets/videos/revamp.mp4',
    '/assets/videos/extension.mp4',
    '/assets/videos/promotional.mov',
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

        <section id="about" className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12">
              <article className="w-full lg:w-1/2 bg-white rounded-xl overflow-hidden">
                <div className="p-8">
                  <h2 className="text-3xl font-bold text-[#003366] mb-6">
                    Revolutionize Your Learning Journey
                  </h2>
                  <p className="text-lg text-gray-700 mb-6">
                    SparkMind is an innovative AI-driven learning hub designed to transform education. Our platform adapts to your unique learning style, offering personalized study materials and AI-powered discussions across a wide range of subjects.
                  </p>
                  <p className="text-lg text-gray-700 mb-8">
                    Whether you're a student, professional, or lifelong learner, SparkMind is here to ignite your curiosity and empower your educational journey. Join us in shaping the future of learning!
                  </p>
                  <Button className="bg-[#003366] hover:bg-[#0257AC] text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300">
                    Start Your Journey
                  </Button>
                </div>
              </article>

              <div className="w-full lg:w-1/2">
                <VideoCarousel videos={demoVideos} />
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
