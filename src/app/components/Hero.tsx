import React from 'react';
import { Button } from "./ui/button";
import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

// Images
import imgImage32 from "figma:asset/aec638c9feff1763487a4fcc9a3059837847abb6.png";
import imgImage33 from "figma:asset/57c6f167ffbade0d6a81a593f7914d9dcfdd185b.png";
import imgImage34 from "figma:asset/8317b69287cc1e9f0d31c3065f1856f365838804.png";
import imgImage35 from "figma:asset/2414b304ee5a181b6230c26417fe9337dc0d494b.png";
import imgImage36 from "figma:asset/44bda96bc5ddc65373d482dcfd195d473e3fe2f1.png";
import imgImage37 from "figma:asset/ffd9a66f3b8eab0f2d03717d34be181ad8e68b18.png";
import imgImage38 from "figma:asset/4762cc154d468c1608c0ca13367aaae957c3df5c.png";
import imgImage39 from "figma:asset/50d08adf778d9f68893c35b52b1a8b121c815de3.png";
import imgImage40 from "figma:asset/10c3e2866a2ac26f4121a35b03ad8988e46e8593.png";
import imgImage41 from "figma:asset/60bde194e561318841e3492901de8ae31cad6b93.png";
import imgImage42 from "figma:asset/b9fb622878ef07917d75bd23653b174d05b65ce7.png";

import { Lines } from "./ui/Lines";

const col1 = [imgImage32, imgImage33, imgImage34, imgImage35, imgImage36];
const col2 = [imgImage37, imgImage38, imgImage39, imgImage41, imgImage42];

const MarqueeColumn = ({ images, duration = 20, reverse = false }: { images: string[], duration?: number, reverse?: boolean }) => {
    return (
        <div className="relative h-[600px] overflow-hidden flex-1">
            <motion.div
                className="flex flex-col gap-4 absolute w-full"
                animate={{ y: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
                transition={{
                    repeat: Infinity,
                    duration: duration,
                    ease: "linear",
                }}
            >
                {[...images, ...images].map((src, i) => (
                    <div key={i} className="w-full h-[225px] rounded-[20px] overflow-hidden shrink-0 relative">
                        <img src={src} alt="Hero" className="w-full h-full object-cover" />
                    </div>
                ))}
            </motion.div>
        </div>
    );
};

export function Hero() {
  return (
    <div className="relative w-full min-h-[800px] bg-white overflow-hidden flex flex-col md:flex-row items-center justify-between px-4 md:px-20 max-w-[1440px] mx-auto py-10 md:py-0 gap-10">
      <Lines />
      
      {/* Text Content */}
      <div className="flex-1 z-10 space-y-8 max-w-[600px]">
        <div className="space-y-2">
            <h1 className="font-['M_PLUS_1p'] text-5xl md:text-6xl font-normal text-black leading-tight">
                Where Focus Meets Growth
            </h1>
            <div className="text-4xl md:text-5xl flex flex-wrap gap-x-3 items-baseline">
                <span className="font-['M_PLUS_1p'] font-medium text-[#0967bd]">LEARN</span>
                <span className="font-['M_PLUS_1p'] font-medium text-black">,</span>
                <span className="font-['M_PLUS_1p'] font-medium text-[#0967bd]">CONNECT</span>
                <span className="font-['M_PLUS_1p'] font-normal text-black text-3xl md:text-4xl">and</span>
                <span className="font-['M_PLUS_1p'] font-medium text-[#0967bd] uppercase">Thrive</span>
            </div>
        </div>

        <p className="font-['M_PLUS_1p'] text-lg text-black/70 max-w-lg">
            Personalized study spaces, real mentor guidance, and a vibrant learning community — all in one platform designed to help you stay consistent, focused, and inspired.
        </p>

        <div className="flex items-center gap-4">
            <Button className="bg-[#003566] hover:bg-[#00284d] text-white rounded-[20px] px-8 h-[52px] font-['Poppins'] font-medium text-base gap-2">
                Get Started <ArrowRight className="w-4 h-4" />
            </Button>
            <Button variant="secondary" className="bg-[#f0f0f0]/80 backdrop-blur-sm hover:bg-[#e0e0e0] text-black rounded-[20px] px-8 h-[52px] font-['Poppins'] text-base">
                Know more
            </Button>
        </div>

        <div className="flex items-start gap-12 pt-10">
            <div>
                <h3 className="font-['Poppins'] text-3xl font-extralight text-black">5000<span className="font-medium text-[#0967bd]">+</span></h3>
                <div className="w-full h-[3px] bg-[#0967bd] mt-1 mb-2 rounded-full"></div>
                <p className="font-['Poppins'] text-sm font-medium">Active Learners</p>
            </div>
             <div>
                <h3 className="font-['Poppins'] text-3xl font-extralight text-black">200<span className="font-medium text-[#0967bd]">+</span></h3>
                <div className="w-full h-[3px] bg-[#0967bd] mt-1 mb-2 rounded-full"></div>
                <p className="font-['Poppins'] text-sm font-medium">Verified Mentors</p>
            </div>
             <div>
                <h3 className="font-['Poppins'] text-3xl font-extralight text-black">100<span className="font-medium text-[#0967bd]">+</span></h3>
                <div className="w-full h-[3px] bg-[#0967bd] mt-1 mb-2 rounded-full"></div>
                <p className="font-['Poppins'] text-sm font-medium">Study Rooms Live</p>
            </div>
        </div>
      </div>

      {/* Image Grid */}
      <div className="flex-1 h-[600px] flex gap-4 mt-10 md:mt-0 relative w-full max-w-[500px] justify-end">
          <MarqueeColumn images={col1} duration={30} />
          <MarqueeColumn images={col2} duration={35} reverse />
      </div>

    </div>
  );
}
