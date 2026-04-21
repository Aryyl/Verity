import Image from "next/image";
import { companyLogos } from "@/constants";
import { Marquee } from "../../ui/marquee";

const CompanyLogos = ({ className }: { className?: string }) => (
  <div className={className}>
    <h5 className="tagline mb-6 text-center text-n-1/50">
      Engineered for Digital Trust & Forensics
    </h5>
    <Marquee className="flex [--duration:40s] [--gap:6rem] [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      {companyLogos.map((item, index) => (
        <li
          className="flex items-center justify-center gap-6 whitespace-nowrap"
          key={index}
        >
          <div className="flex items-center gap-3">
            <Image alt={item.name} height={32} src={item.logo} width={32} />
            <span className="font-extrabold font-grotesk text-xl uppercase tracking-widest text-n-1">
              {item.name}
            </span>
          </div>
          <div className="h-8 w-[1px] bg-n-1/10" />
          <span className="font-code text-sm uppercase tracking-tighter text-n-1/40">
            {item.tagline}
          </span>
        </li>
      ))}
    </Marquee>
  </div>
);

export default CompanyLogos;
