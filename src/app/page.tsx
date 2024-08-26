"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import step01 from "../../public/assets/images/feature/card01.png";
import step02 from "../../public/assets/images/feature/card02.png";
import step03 from "../../public/assets/images/feature/card03.png";
import step04 from "../../public/assets/images/feature/card04.png";
import step05 from "../../public/assets/images/feature/card05.png";
import step06 from "../../public/assets/images/feature/card06.png";
import arrowDown from "../../public/assets/images/feature/feature02.png";
import ourFeature from "../../public/assets/images/feature/title.png";
import threeDots from "../../public/assets/images/home/feature-03.png";
import arrowCloud from "../../public/assets/images/home/features1.png";
import homeFeature1Image from "../../public/assets/images/home/home-feat-1.png";
import homeFeature2Image from "../../public/assets/images/home/home-feat-2.png";
import homeFeature3Image from "../../public/assets/images/home/home-feat-3.png";
import homeTitleImage from "../../public/assets/images/home/home-title.png";
import homeLogo1 from "../../public/assets/images/home/title 02.png";
import arrowSvg from "../../public/assets/svgs/home/arrow.svg";
import homeLogoSvg from "../../public/assets/svgs/home/main-logo.svg";
import { HomeNavigation } from "./HomeNavigation";
import { LandingCards } from "@/components/landing";

const cards = [
  {
    title: "test 1",
    description: "description 1",
    lists: [
      {
        list_title: "list title 1",
        list_descriptioon: "list desc 1",
      },
    ],
  },
  {
    title: "test 2",
    description: "description 2",
    lists: [
      {
        list_title: "list title 2",
        list_descriptioon: "list desc 2",
      },
    ],
  },
  {
    title: "test 3",
    description: "description 3",
    lists: [
      {
        list_title: "list title 3",
        list_descriptioon: "list desc 3",
      },
    ],
  },
  {
    title: "test 4",
    description: "description 4",
    lists: [
      {
        list_title: "list title 4",
        list_descriptioon: "list desc 4",
      },
    ],
  },
  {
    title: "test 5",
    description: "description 5",
    lists: [
      {
        list_title: "list title 5",
        list_descriptioon: "list desc 5",
      },
    ],
  },
  {
    title: "test 6",
    description: "description 6",
    lists: [
      {
        list_title: "list title 6",
        list_descriptioon: "list desc 6",
      },
    ],
  },
  {
    title: "test 7",
    description: "description 7",
    lists: [
      {
        list_title: "list title 7",
        list_descriptioon: "list desc 7",
      },
    ],
  },
];

export default function Home() {
  const router = useRouter();
  return (
    <>
      <div className="bg-white flex flex-col h-screen overflow-y-auto">
        <div className="flex w-full justify-between px-4 md:px-16 lg:px-32 fixed top-0 left-0 right-0 bg-white z-10 shadow-md">
          <Image width={150} src={homeLogoSvg} alt="Home Logo" />
          <HomeNavigation />
        </div>

        {/* Content below the navbar */}
        <div className="flex-1 pt-56 md:pt-24 lg:pt-32 flex flex-col space-y-10">
          <div className="flex justify-center items-center w-full">
            <span className="font-extrabold text-center">
              AI-driven learning hub platform
            </span>
          </div>
          <div className="flex gap-4 w-full items-center justify-center ml-[-6%]">
            <Image className="w-[10%] h-auto" src={arrowCloud} alt="Arrow " />
            <Image className="w-[50%] h-auto" src={homeLogo1} alt="Home Logo" />
          </div>
          <div className="flex justify-center w-full">
            <button
              onClick={() => {
                router.push("/my-learning");
              }}
              className="bg-navy rounded-3xl text-white py-3 px-8"
            >
              Get Started
            </button>
          </div>
          <div className="flex justify-center">
            <Image
              className="w-[80%] h-auto"
              src={threeDots}
              alt="Three Dots "
            />
          </div>
          <div className="flex flex-wrap justify-center w-full mb-4 gap-4 md:gap-8 lg:gap-24">
            <Image
              className="w-[24%] h-auto"
              src={homeFeature1Image}
              alt="Home Feature 1"
            />
            <Image
              className="w-[24%] h-auto"
              src={homeFeature2Image}
              alt="Home Feature 2"
            />
            <Image
              className="w-[24%] h-auto"
              src={homeFeature3Image}
              alt="Home Feature 3"
            />
          </div>
        </div>
        <hr className="h-10 bg-black my-4" />
        <LandingCards cards={[...cards]} />
      </div>
    </>
  );
}
