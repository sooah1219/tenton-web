"use client";

import { cldImage } from "@/lib/cloudinary";
import Image from "next/image";

type Item = { name: string; img: string };

const items: Item[] = [
  { name: "Original Ramen", img: "original_ramen_cru6kh" },
  { name: "Spicy Miso Ramen", img: "spicy_miso_ramen_ivxdy2" },
  { name: "Katsu Trio Set", img: "trio_katsu_rgle8e" },
  { name: "Cheese Katsu", img: "cheese_katsu_bc2sam" },
  { name: "Curry Katsu", img: "curry_katsu_hjfr9n" },
  { name: "Black Ramen", img: "black_ramen_b1h6fd" },
  { name: "Beef Short Ribs", img: "beef_short_rib_ghqweu" },
  { name: "Pork Gyoza", img: "gyoza_ucmtoi" },
];

export default function AutoFoodCarousel() {
  const loop = [...items, ...items];

  return (
    <section className="w-full pt-4 pb-10 max-w-[1700px] mx-auto">
      {/* Title */}
      <div className="mb-1 flex items-center justify-center gap-3 px-5">
        <div className="h-px w-full max-w-[200px] bg-[#d8ccc3]" />
        <h2 className="shrink-0 font-averia-serif text-[18px] leading-none text-tenton-brown text-center">
          Popular Menu
        </h2>
        <div className="h-px w-full max-w-[200px] bg-[#d8ccc3]" />
      </div>

      {/* Carousel */}
      <div className="w-full px-4 overflow-hidden bg-white mx-auto">
        <div
          className="flex gap-3"
          style={{
            width: "max-content",
            animation: "tentonScrollX 60s linear infinite",
            willChange: "transform",
          }}
        >
          {loop.map((it, idx) => (
            <article
              key={`${it.name}-${idx}`}
              className="shrink-0 w-[clamp(140px,36vw,190px)] rounded-2xl p-2"
            >
              <div className="relative h-[100px] w-full">
                <Image
                  src={cldImage(it.img)}
                  alt={it.name}
                  fill
                  className="object-contain"
                />
              </div>

              <div className="text-center text-tenton-brown pt-1 text-[13px] sm:text-[14px]">
                {it.name}
              </div>
            </article>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes tentonScrollX {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}
