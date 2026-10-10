export function QuickAnswer({ title, text }: { title: string; text: string }) {
  return (
    <aside className="mt-8 rounded-3xl border border-[#e7d7b8] bg-[#fbfaf7] p-5" aria-label="Quick answer">
      <p className="text-[0.82rem] font-extrabold tracking-[0.08em] text-teal uppercase">Quick answer</p>
      <h2 className="mt-2 text-2xl font-extrabold tracking-tight">{title}</h2>
      <p className="mt-2 max-w-3xl text-muted">{text}</p>
    </aside>
  );
}
