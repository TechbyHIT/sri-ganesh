type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  intro?: string;
  titleId: string;
  tone?: "default" | "inverse";
};

export function SectionHeading({
  eyebrow,
  title,
  intro,
  titleId,
  tone = "default",
}: SectionHeadingProps) {
  const className = tone === "inverse" ? "text-[#f7f3ea]" : "";

  return (
    <div className={className}>
      <p className={`text-[0.82rem] font-extrabold tracking-[0.08em] uppercase ${tone === "inverse" ? "text-saffron" : "text-teal"}`}>
        {eyebrow}
      </p>
      <h2 className="mt-2 text-[clamp(1.7rem,4vw,2.6rem)] leading-tight font-extrabold tracking-tight" id={titleId}>
        {title}
      </h2>
      {intro ? <p className={`mt-3 max-w-3xl ${tone === "inverse" ? "text-white/80" : "text-muted"}`}>{intro}</p> : null}
    </div>
  );
}
