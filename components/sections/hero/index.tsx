"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ScrollParallax } from "react-just-parallax";
import { heroIcons, images } from "@/constants";
import { cn } from "@/lib/utils";
import Button from "../../atoms/button";
import Generating from "../../atoms/generating";
import { BackgroundCircles, BottomLine, Gradient } from "../../design/hero";
import Section from "../../layout/section";
import CompanyLogos from "./company-logos";
import Notification from "./notification";
import { useUI } from "@/context/ui-context";

const Hero = () => {
  const parallaxRef = useRef(null);
  const { openAuthModal } = useUI();
  return (
    <Section
      className={cn("-mt-[5.25rem] pt-[12rem]")}
      crosses
      crossesOffset="lg:translate-y-[5.25rem]"
      customPaddings
      id="hero"
    >
      <div className="container relative" ref={parallaxRef}>
        <div className="relative z-1 mx-auto mb-16 max-w-[62rem] text-center md:mb-20 lg:mb-24">
          <h1 className="h1 mb-6 text-[2.5rem] leading-[3.25rem] md:text-[3.5rem] md:leading-[4rem] lg:text-[4rem] lg:leading-[4.5rem]">
            Your Digital Identity, Unclonable. Protect Assets with{" "}
            <span className="relative inline-block">
              Verity
              <Image
                alt="curve"
                className="xl:-mt-2 absolute top-full left-0 w-full"
                height={28}
                src={images.curve}
                width={624}
              />
            </span>
          </h1>
          <p className={cn("body-1 mx-auto mb-6 max-w-3xl text-n-2 lg:mb-8")}>
            The world's first near-real-time detection engine for deepfakes and asset misuse. Scaled to monitor over 10 million digital assets.
          </p>
          <Button white onClick={openAuthModal}>
            Try it now
          </Button>
        </div>

        <div
          className={cn("relative mx-auto max-w-[23rem] md:max-w-5xl xl:mb-24")}
        >
          <div
            className={cn("relative z-1 rounded-2xl bg-conic-gradient p-0.5")}
          >
            <div className={cn("relative rounded-[1rem] bg-n-8")}>
              <div className={cn("h-[1.4rem] rounded-t-[0.9rem] bg-n-10")} />
              <div
                className={cn(
                  "aspect-[33/40] overflow-hidden rounded-b-[0.9rem] md:aspect-[688/490] lg:aspect-[1024/490]"
                )}
              >
                <Image
                  alt="AI"
                  className="w-full translate-y-[8%] scale-[1.7] md:translate-y-[-10%] md:scale-100 lg:translate-y-[-23%]"
                  height={490}
                  src={images.robot}
                  width={1024}
                />

                <Generating className="md:-translate-x-1/2 absolute inset-x-4 bottom-5 md:right-auto md:bottom-8 md:left-1/2 md:w-[31rem] max-md:max-w-[calc(100vw-4rem)]" />

                <ScrollParallax isAbsolutelyPositioned>
                  <ul className="absolute bottom-[7.5rem] left-[-5.5rem] hidden rounded-2xl border border-n-1/10 bg-n-9/40 p-1 backdrop-blur xl:flex">
                    {heroIcons.map((icon, index) => (
                      <li className="p-5" key={index}>
                        <Image alt={icon} height={24} src={icon} width={25} />
                      </li>
                    ))}
                  </ul>
                </ScrollParallax>

                <ScrollParallax isAbsolutelyPositioned>
                  <Notification
                    className="absolute right-[-5.5rem] bottom-44 hidden w-72 xl:flex"
                    title="Deepfake Detected"
                  />
                </ScrollParallax>
              </div>
            </div>

            <Gradient />
          </div>
          <div className="-translate-x-1/2 absolute top-[-54%] left-1/2 w-[234%] md:top-[-46%] md:w-[138%] lg:top-[-104%]">
            <Image
              alt="hero"
              className="w-full"
              height={1880}
              src={images.heroBackground}
              width={1440}
            />
          </div>

          <BackgroundCircles parallaxRef={parallaxRef} />
        </div>

        <CompanyLogos className="relative z-10 mt-20" />
      </div>
      <BottomLine />
    </Section>
  );
};

export default Hero;
