type HeroShape = "zigzag" | "diagonal-right" | "diagonal-left" | "wave" | "chevron-up" | "arrow-down" | "sharp";

const shapes: Record<HeroShape, string> = {
  "zigzag":         "polygon(0 0, 100% 0, 100% calc(100% - 44px), 50% 100%, 0 calc(100% - 44px))",
  "diagonal-right": "polygon(0 0, 100% 0, 100% 82%, 0 100%)",
  "diagonal-left":  "polygon(0 0, 100% 0, 100% 100%, 0 82%)",
  "wave":           "polygon(0 0, 100% 0, 100% 85%, 75% 100%, 50% 85%, 25% 100%, 0 85%)",
  "chevron-up":     "polygon(0 0, 100% 0, 100% 100%, 50% calc(100% - 44px), 0 100%)",
  "arrow-down":     "polygon(0 0, 100% 0, 100% calc(100% - 44px), 50% 100%, 0 calc(100% - 44px))",
  "sharp":          "polygon(0 0, 100% 0, 100% 82%, 0 100%)",
};

interface PageHeroProps {
  title: string;
  subtitle?: string;
  breadcrumb?: { label: string; href?: string }[];
  tag?: string;
  shape?: HeroShape;
}

export default function PageHero({ title, subtitle, breadcrumb, tag, shape = "zigzag" }: PageHeroProps) {
  return (
    <section
      className="banniere-sobup relative overflow-hidden text-white"
      style={{ paddingTop: "3.5rem", paddingBottom: "5rem", clipPath: shapes[shape] }}
    >
      <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-10"
        style={{ background: "#fff", filter: "blur(60px)" }} />
      <div className="absolute -bottom-10 -left-10 w-60 h-60 rounded-full opacity-10"
        style={{ background: "#31B9AE", filter: "blur(50px)" }} />

      <div className="relative mx-auto max-w-7xl px-4">
        {breadcrumb && (
          <nav className="flex items-center gap-2 text-xs text-white/60 mb-4">
            {breadcrumb.map((crumb, i) => (
              <span key={i} className="flex items-center gap-2">
                {i > 0 && <span>/</span>}
                {crumb.href
                  ? <a href={crumb.href} className="hover:text-white transition-colors">{crumb.label}</a>
                  : <span className="text-white/90">{crumb.label}</span>
                }
              </span>
            ))}
          </nav>
        )}
        {tag && (
          <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3 text-white"
            style={{ background: "rgba(49,185,174,.28)", border: "1px solid rgba(49,185,174,.45)" }}>
            {tag}
          </span>
        )}
        <h1 className="text-3xl md:text-4xl font-black leading-tight mb-3">{title}</h1>
        {subtitle && <p className="text-white/80 text-lg max-w-2xl leading-relaxed">{subtitle}</p>}
      </div>
    </section>
  );
}
