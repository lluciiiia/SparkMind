"use client";

import { HomeNavigation } from "./HomeNavigation";
import Image from "next/image";
import homeLogoImage from "../../public/assets/images/home-logo.png";
import homeFeaturesImage from "../../public/assets/images/home-features.png";
import homeTitleImage from "../../public/assets/images/home-title.png";

export default function Home() {
  return (
    <>
      <div className="bg-white flex flex-col">
        <div className="flex w-full justify-between mt-4">
          <Image
            width={250}
            src={homeLogoImage}
            alt="Home Logo"
            className="ml-2"
          />
          <HomeNavigation />
        </div>
        <div className="flex mt-2 justify-center items-center">
          <Image
            width={600}
            src={homeTitleImage}
            alt="Home Title"
            className="mr-16"
          />
          <button className="bg-navy h-12 px-14 py-2 text-white rounded-3xl">
            Get Started
          </button>
        </div>
        <div className="flex justify-center w-full mt-4 mb-8">
          <Image width={1000} src={homeFeaturesImage} alt="Home Features" />
        </div>
      </div>
    </>
  );
}
