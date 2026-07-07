import Link from "next/link";

export interface DocumentSection {
  id: string;
  title: string;
  paragraphs: string[];
}

export function DocumentPage({ title, description, sections }: { title: string; description: string; sections: DocumentSection[] }) {
  return (
    <article className="mx-auto max-w-[900px] space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-black text-ink max-md:text-2xl">{title}</h1>
        <p className="text-sm leading-6 text-muted">{description}</p>
      </header>
      <nav className="rounded-md border border-line bg-surface p-4 shadow-card" aria-label={`${title} 목차`}>
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold">
          {sections.map((section) => (
            <Link key={section.id} href={`#${section.id}`} className="text-muted hover:text-primary">
              {section.title}
            </Link>
          ))}
        </div>
      </nav>
      <div className="space-y-5 rounded-md border border-line bg-surface p-6 shadow-card">
        {sections.map((section) => (
          <section key={section.id} id={section.id} className="scroll-mt-24 border-b border-line pb-5 last:border-b-0 last:pb-0">
            <h2 className="text-xl font-black text-ink">{section.title}</h2>
            <div className="mt-3 space-y-3 text-sm leading-7 text-ink">
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}
