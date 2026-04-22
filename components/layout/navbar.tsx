"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { navigation } from "@/constants";
import { cn } from "@/lib/utils";
import { yourlogo as brandLogo } from "@/public/assets/index";
import Button from "../atoms/button";
import { HamburgerMenu } from "../design/navbar";
import MenuSvg from "../svg/menu-svg";
import { useUI } from "@/context/ui-context";

const Navbar = () => {
  const [hash, setHash] = useState<string>("hero");
  const [openNavigation, setOpenNavigation] = useState<boolean>(false);
  const { openAuthModal } = useUI();

  useEffect(() => {
    const dynamicNavbarHighlight = () => {
      const sections = document.querySelectorAll("section[id]");

      sections.forEach((current) => {
        if (current === null) return;

        const sectionId = current.getAttribute("id");
        // @ts-expect-error
        const sectionHeight = current.offsetHeight;
        const sectionTop =
          current.getBoundingClientRect().top - sectionHeight * 0.2;

        if (
          sectionTop < 0 &&
          sectionTop + sectionHeight > 0 &&
          hash !== sectionId
        ) {
          setHash(`#${sectionId as string}`);
        }
      });
    };

    window.addEventListener("scroll", dynamicNavbarHighlight);

    return () => window.removeEventListener("scroll", dynamicNavbarHighlight);
  }, [hash]);

  const toggleNavigation = () => setOpenNavigation(!openNavigation);
  const handleClick = () => {
    if (!openNavigation) return;

    setOpenNavigation(false);
  };

  return (
    <>
    <div
      className={cn(
        "fixed top-4 inset-x-4 z-50 mx-auto max-w-[calc(100vw-2rem)] rounded-full border border-n-1/10 bg-n-8/80 backdrop-blur-md lg:top-6 lg:max-w-[calc(1024px+16rem)]",
        openNavigation && "rounded-[2rem] bg-n-8"
      )}
    >
      <div
        className={cn("flex items-center px-5 max-lg:py-2 lg:px-7.5 xl:px-10")}
      >
        <Link
          className={cn("flex w-auto items-center gap-4 xl:mr-8")}
          href="#hero"
        >
          <Image alt="Verity" height={64} src={brandLogo} width={64} />
          <p className="font-extrabold font-grotesk text-2xl tracking-wide uppercase">
            VERITY
          </p>
        </Link>

        {/* Desktop Navigation remains inside */}
        <nav className="hidden lg:static lg:mx-auto lg:flex lg:bg-transparent">
          <div className="relative z-2 m-auto flex lg:flex-row">
            {navigation.map((item) => (
              <Link
                className={cn(
                  "relative block font-code text-2xl text-n-1 uppercase transition-colors hover:text-color-1",
                  "lg:-mr-0.25 px-6 py-6 md:py-8 lg:font-semibold lg:text-xs",
                  !!item.onlyMobile && "lg:hidden",
                  item.url === hash ? "z-2 lg:text-n-1" : "lg:text-n-1/50",
                  "lg:leading-5 lg:hover:text-n-1 xl:px-12"
                )}
                href={item.url.startsWith('#') ? item.url : '#'}
                key={item.id}
                onClick={(e) => {
                  if (item.url === '#login' || item.url === '#signup') {
                    e.preventDefault();
                    openAuthModal();
                  }
                  handleClick();
                }}
              >
                {item.title}
              </Link>
            ))}
          </div>
        </nav>

        <button
          className="button mr-8 hidden text-n-1/50 transition-colors hover:text-n-1 lg:block uppercase tracking-wider"
          onClick={openAuthModal}
        >
          Login
        </button>
        <Button className="hidden lg:flex" onClick={openAuthModal}>
          Dashboard
        </Button>

        <Button
          className="ml-auto lg:hidden"
          onClick={toggleNavigation}
          px="px-3"
        >
          <MenuSvg openNavigation={openNavigation} />
        </Button>
      </div>
    </div>

    {/* Dedicated Mobile Navigation Drawer */}
    <nav
      className={cn(
        "fixed inset-0 z-40 hidden bg-n-8 lg:hidden",
        openNavigation ? "flex" : "hidden"
      )}
    >
      <div className="relative z-2 m-auto flex flex-col items-center justify-center">
        {navigation.map((item) => (
          <Link
            className={cn(
              "relative block font-code text-2xl text-n-1 uppercase transition-colors hover:text-color-1",
              "px-6 py-6 md:py-8"
            )}
            href={item.url.startsWith('#') ? item.url : '#'}
            key={item.id}
            onClick={(e) => {
              if (item.url === '#login' || item.url === '#signup') {
                e.preventDefault();
                openAuthModal();
              }
              handleClick();
            }}
          >
            {item.title}
          </Link>
        ))}
      </div>
      <HamburgerMenu />
    </nav>
    </>
  );
};

export default Navbar;
