import Image from "next/image";
import Link from "next/link";
import { fitPoints, hero } from "@/data/homepage";
import { site } from "@/data/site";

export function Hero() {
  const phone = site.phoneDisplay && site.phoneTel;

  return (
    <section className="py-8 pb-12 min-[60rem]:py-12" aria-labelledby="hero-title">
      <div className="container grid items-center gap-8 min-[60rem]:grid-cols-[1.05fr_0.95fr] min-[60rem]:gap-12">
        <div>
          <p className="text-[0.82rem] font-extrabold tracking-[0.08em] text-teal uppercase">{hero.eyebrow}</p>
          <h1 className="mt-2 max-w-[14ch] text-[clamp(2.5rem,7vw,4.4rem)] leading-none font-extrabold tracking-tight" id="hero-title">
            {hero.title}
            <span className="mt-2 block text-teal">{hero.titleLine}</span>
          </h1>
          <p className="mt-4 max-w-xl text-lg text-muted">{hero.lede}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link className="button buttonPrimary" href={hero.primary.href}>
              {hero.primary.label}
            </Link>
            <Link className="button buttonGhost" href={hero.secondary.href}>
              {hero.secondary.label}
            </Link>
          </div>
          <p className="mt-4 text-sm font-bold text-muted">
            {phone ? (
              <>
                Prefer a conversation?{" "}
                <a className="text-teal" href={`tel:${site.phoneTel}`}>
                  {site.phoneDisplay}
                </a>
              </>
            ) : (
              "Prefer a conversation? Use the contact page and name the city and the opening."
            )}
          </p>
        </div>
        <figure className="m-0">
          <Image
            className="h-auto w-full rounded-2xl border border-line"
            src={hero.image.src}
            alt={hero.image.alt}
            width={hero.image.width}
            height={hero.image.height}
            preload
            fetchPriority="high"
            sizes="(max-width: 960px) 100vw, 40rem"
          />
          <figcaption className="mt-2 text-sm text-muted">Illustrative balcony scene. Gallery photos are added when a real installation is documented.</figcaption>
        </figure>
      </div>
      <div className="container mt-8">
        <ul className="grid list-none gap-3 p-0 min-[48rem]:grid-cols-3">
          {fitPoints.map((point, index) => (
            <li className="rounded-2xl border border-line bg-paper p-4" key={point.title}>
              <span className="text-[0.82rem] font-extrabold tracking-wide text-saffron-deep">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h2 className="mt-2 text-lg font-extrabold tracking-tight">{point.title}</h2>
              <p className="mt-1 text-muted">{point.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
