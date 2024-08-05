"use client";

import { HomeNavigation } from "./HomeNavigation";
import Image from "next/image";
import homeLogoSvg from "../../public/assets/svgs/home/logo.svg";
import arrowSvg from "../../public/assets/svgs/home/arrow.svg";
import homeTitleImage from "../../public/assets/images/home/home-title.png";
import homeFeature1Image from "../../public/assets/images/home/home-feat-1.png";
import homeFeature2Image from "../../public/assets/images/home/home-feat-2.png";
import homeFeature3Image from "../../public/assets/images/home/home-feat-3.png";

export default function Home() {
  return (
    <>
      <div className="bg-white flex flex-col gap-8">
        <div className="flex w-full justify-between mt-3 px-32">
          <Image width={190} src={homeLogoSvg} alt="Home Logo" />
          <HomeNavigation />
        </div>
        <div className="flex ml-32 items-center">
          <Image width={600} src={homeTitleImage} alt="Home Title" />
          <button className="flex items-center bg-navy h-12 pl-14 py-2 ml-12 text-white rounded-3xl ">
            <span>Get Started</span>
            <Image width={50} src={arrowSvg} alt="Arrow" className="ml-4" />
          </button>
        </div>
        <div className="flex justify-center w-full mb-4 gap-24">
          <Image width={350} src={homeFeature1Image} alt="Home Feature 1" />
          <Image width={350} src={homeFeature2Image} alt="Home Feature 2" />
          <Image width={350} src={homeFeature3Image} alt="Home Feature 3" />
        </div>
      </div>
    </>
  );
}
