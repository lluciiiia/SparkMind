'use client';

import { HomeNavigation } from "./HomeNavigation";
import Image from "next/image";
import homeLogoSvg from "../../public/assets/svgs/home/logo.svg";
import arrowSvg from "../../public/assets/svgs/home/arrow.svg";
import homeTitleImage from "../../public/assets/images/home/home-title.png";
import homeFeature1Image from "../../public/assets/images/home/home-feat-1.png";
import homeFeature2Image from "../../public/assets/images/home/home-feat-2.png";
import homeFeature3Image from "../../public/assets/images/home/home-feat-3.png";
import arrowCloud from "../../public/assets/images/home/features1.png";
import homeLogo1 from "../../public/assets/images/home/title 02.png";
import threeDots from "../../public/assets/images/home/feature-03.png";
export default function Home() {
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
              AI-Driven learning enhancement platform
            </span>
          </div>
          <div className="flex gap-4 w-full items-center justify-center ml-[-6%]">
            <Image className="w-[10%] h-auto" src={arrowCloud} alt="Arrow " />
            <Image className="w-[50%] h-auto" src={homeLogo1} alt="Home Logo" />
          </div>
          <div className="flex justify-center w-full">
            <button className="bg-navy rounded-3xl text-white py-3 px-8">
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
      </div>
    </>
  );
}
