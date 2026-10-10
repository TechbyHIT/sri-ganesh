"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { heroSlides } from "@/data/home-landing";

type Slide = (typeof heroSlides)[number];

export function HeroSlider({ slides }: { slides: readonly Slide[] }) {
  const [index, setIndex] = useState(0);
  const count = slides.length;

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) {
      return;
    }

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % count);
    }, 7000);

    return () => window.clearInterval(timer);
  }, [count]);

  function go(next: number) {
    setIndex((next + count) % count);
  }

  return (
    <section className="pb-12" aria-roledescription="carousel" aria-labelledby="home-hero-title">
      <div className="container">
        <p className="text-[0.82rem] font-extrabold tracking-[0.08em] text-teal uppercase">Sri Ganesha · Vijayawada first</p>
        <h1 id="home-hero-title" className="mt-2 max-w-3xl text-[clamp(2rem,5vw,3.5rem)] leading-none font-extrabold tracking-tight">
          Invisible grills, safety nets, and pigeon nets in Andhra Pradesh
        </h1>
        <ul className="mt-4 flex list-none flex-wrap gap-2 p-0">
          {["Free site inspection", "Measured quote", "Vijayawada first", "Named materials"].map((chip) => (
            <li key={chip} className="rounded-full border border-[#e7d7b8] bg-paper px-3 py-2 text-sm font-bold">
              {chip}
            </li>
          ))}
        </ul>
        <div className="relative mt-5 overflow-hidden rounded-[1.75rem] bg-navy shadow-[0_24px_60px_rgb(31_28_25_/_0.12)]">
          <div className="relative aspect-[3/4] sm:aspect-video">
            {slides.map((slide, slideIndex) => {
              const active = slideIndex === index;

              return (
                <article
                  key={slide.src}
                  className={`absolute inset-0 transition-opacity duration-700 ${active ? "opacity-100" : "pointer-events-none opacity-0"}`}
                  aria-hidden={!active}
                >
                  <Image
                    src={slide.src}
                    alt={slide.alt}
                    fill
                    priority={slideIndex === 0}
                    sizes="(min-width: 72rem) 1152px, 100vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/20" />
                  <div className="absolute inset-0 flex items-end p-5 sm:items-center sm:p-10">
                    <div className="max-w-xl text-white">
                      <h2 className="text-[clamp(1.8rem,4vw,3.4rem)] leading-tight font-extrabold tracking-tight">{slide.title}</h2>
                      <p className="mt-3 max-w-lg text-sm text-white/85 sm:text-base">{slide.text}</p>
                      <div className="mt-5 flex flex-wrap gap-3">
                        <a className="button buttonPrimary" href="#inspect">
                          Free site inspection
                        </a>
                        <Link className="button buttonOnDark" href={slide.href}>
                          {slide.cta}
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          <div className="absolute right-4 bottom-4 flex items-center gap-2">
            <button className="inline-flex size-11 items-center justify-center rounded-full bg-white/90 font-extrabold text-navy" type="button" onClick={() => go(index - 1)} aria-label="Previous slide">
              ‹
            </button>
            <button className="inline-flex size-11 items-center justify-center rounded-full bg-white/90 font-extrabold text-navy" type="button" onClick={() => go(index + 1)} aria-label="Next slide">
              ›
            </button>
          </div>
          <div className="absolute bottom-4 left-5 flex gap-1.5" aria-label="Slides">
            {slides.map((slide, slideIndex) => (
              <button
                key={slide.src}
                className={`h-2.5 rounded-full ${slideIndex === index ? "w-6 bg-[#d4b483]" : "w-2.5 bg-white/70"}`}
                type="button"
                aria-label={`Show slide ${slideIndex + 1}: ${slide.title}`}
                aria-current={slideIndex === index}
                onClick={() => go(slideIndex)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
