'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import step01 from '../../public/assets/images/feature/card01.png';
import step02 from '../../public/assets/images/feature/card02.png';
import step03 from '../../public/assets/images/feature/card03.png';
import step04 from '../../public/assets/images/feature/card04.png';
import step05 from '../../public/assets/images/feature/card05.png';
import step06 from '../../public/assets/images/feature/card06.png';
import arrowDown from '../../public/assets/images/feature/feature02.png';
import ourFeature from '../../public/assets/images/feature/title.png';
import threeDots from '../../public/assets/images/home/feature-03.png';
import arrowCloud from '../../public/assets/images/home/features1.png';
import homeFeature1Image from '../../public/assets/images/home/home-feat-1.png';
import homeFeature2Image from '../../public/assets/images/home/home-feat-2.png';
import homeFeature3Image from '../../public/assets/images/home/home-feat-3.png';
import homeTitleImage from '../../public/assets/images/home/home-title.png';
import homeLogo1 from '../../public/assets/images/home/title 02.png';
import arrowSvg from '../../public/assets/svgs/home/arrow.svg';
import homeLogoSvg from '../../public/assets/svgs/home/main-logo.svg';
import { HomeNavigation } from './HomeNavigation';

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
              AI-Driven learning enhancement platform
            </span>
          </div>
          <div className="flex gap-4 w-full items-center justify-center ml-[-6%]">
            <Image className="w-[10%] h-auto" src={arrowCloud} alt="Arrow " />
            <Image className="w-[50%] h-auto" src={homeLogo1} alt="Home Logo" />
          </div>
          <div className="flex justify-center w-full">
            <button
              onClick={() => {
                router.push('/my-learning');
              }}
              className="bg-navy rounded-3xl text-white py-3 px-8"
            >
              Get Started
            </button>
          </div>
          <div className="flex justify-center">
            <Image className="w-[80%] h-auto" src={threeDots} alt="Three Dots " />
          </div>
          <div className="flex flex-wrap justify-center w-full mb-4 gap-4 md:gap-8 lg:gap-24">
            <Image className="w-[24%] h-auto" src={homeFeature1Image} alt="Home Feature 1" />
            <Image className="w-[24%] h-auto" src={homeFeature2Image} alt="Home Feature 2" />
            <Image className="w-[24%] h-auto" src={homeFeature3Image} alt="Home Feature 3" />
          </div>
        </div>
        <hr className="h-10 bg-black my-4" />
        {/* <div className="px-4 flex flex-col gap-8 h-screen mb-[-20%]">
          <div className=" w-full ">
            <Image
              alt="Our Feature"
              src={ourFeature}
              className="w-[20%]  h-auto"
            />
          </div>
          <div className="flex justify-between w-full">
            <Image src={step01} alt="Step 01" className="w-[35%] h-auto" />
            <Image src={step02} alt="Step 02" className="w-[60%] h-auto" />
          </div>
          <div className="flex w-full h-full">
            <div className=" h-[85%] w-[85%] gap-8">
              <div className="h-[35%] flex justify-between w-full">
                <Image src={step03} alt="Step 01" className="w-[55%] h-full" />
                <Image src={step04} alt="Step 04" className="w-[40%] h-full" />
              </div>
              <div className="h-[35%] flex justify-between w-full">
                <Image src={step05} alt="Step 05" className="w-[55%] h-full" />
                <Image src={step06} alt="Step 06" className="w-[40%] h-full" />
              </div>
            </div>
            <Image
              src={arrowDown}
              alt="Arrow Down"
              className="w-[8%] h-[60%]"
            />
          </div>
        </div> */}
      </div>
    </>
  );
}
