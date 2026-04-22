"use client";

import NumberFlow from "@number-flow/react";
import Image from "next/image";
import { useState } from "react";
import Button from "@/components/atoms/button";
import { images, pricing } from "@/constants";
import { cn } from "@/lib/utils";
import { useUI } from "@/context/ui-context";
import { Tab } from "./pricing-tab";

const PricingList = () => {
  const [selected, setSelected] = useState("Monthly");
  const [activeTier, setActiveTier] = useState<string | null>(null);
  const { openAuthModal } = useUI();

  return (
    <div className="flex flex-col gap-4 max-lg:flex-wrap">
      <div className="mx-auto mb-6 flex w-fit rounded-full bg-n-6/50 p-1 shadow-sm">
        <Tab
          selected={selected === "Monthly"}
          setSelected={() => setSelected("Monthly")}
          text="Monthly"
        />
        <Tab
          discount={true}
          selected={selected === "Yearly"}
          setSelected={() => setSelected("Yearly")}
          text="Yearly"
        />
      </div>
      <div className="flex gap-4 max-lg:flex-col">
        {pricing.map((item) => {
          const price =
            selected === "Monthly"
              ? item.price
              : Number(item.price) * 12 * 0.75;

          const isActive = activeTier === item.id;

          return (
            <div
              className={cn(
                "relative h-full w-[19rem] rounded-[2rem] border bg-n-8 px-6 cursor-pointer",
                "transition-all duration-300 ease-in-out",
                "odd:my-4 odd:py-8 even:py-14",
                "max-lg:w-full lg:w-auto",
                "[&>h4]:first:text-color-2 [&>h4]:last:text-color-3 [&>h4]:even:text-color-1",
                isActive
                  ? "border-color-1 scale-[1.04] shadow-[0_0_35px_rgba(172,130,255,0.35)]"
                  : "border-n-6 hover:border-n-4"
              )}
              key={item.id}
              onClick={() => setActiveTier(isActive ? null : item.id)}
            >
              {/* Selected glow ring overlay */}
              {isActive && (
                <div className="pointer-events-none absolute inset-0 rounded-[2rem] border border-color-1/60 shadow-[inset_0_0_20px_rgba(172,130,255,0.1)]" />
              )}

              <h4 className="h4 mb-4">{item.title}</h4>
              <p className="body-2 mb-3 min-h-16 text-n-1/50">
                {item.description}
              </p>

              <div className="mb-6 flex h-[5.5rem] items-center">
                {!!item.price && (
                  <>
                    <span className="h2">$</span>
                    <span className="font-bold text-[5.5rem] leading-none">
                      <NumberFlow
                        suffix={selected === "Monthly" ? "/mo" : "/yr"}
                        value={Number(price)}
                      />
                    </span>
                  </>
                )}
              </div>

              <Button
                className="mb-6 w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  if (item.price) {
                    openAuthModal();
                  } else {
                    window.location.href = "mailto:contact@verity.ai";
                  }
                }}
                white={!!item.price}
              >
                {item.price ? "Get started" : "Contact us"}
              </Button>

              <ul>
                {item.features.map((feature, index) => (
                  <li
                    className="flex items-start border-n-6 border-t py-5"
                    key={index}
                  >
                    <Image
                      alt="check"
                      height={24}
                      src={images.check}
                      width={24}
                    />
                    <p className="body-2 ml-4">{feature}</p>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PricingList;
