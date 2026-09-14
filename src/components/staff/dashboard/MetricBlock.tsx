import Link from "next/link";

export default function MetricBlock({
  label,
  value,
  ctaLabel,
  ctaHref,
}: {
  label: string;
  value: number | string;
  ctaLabel: string;
  ctaHref?: string;
}) {
  return (
    <div className="dash-metric">
      <div>
        <p className="text-[10px] font-medium tracking-[0.2em] text-soft-white/45 uppercase">{label}</p>
        <p className="dash-metric-value mt-2 text-[11vw] sm:text-[5vw] lg:text-[2vw] xl:text-3xl">{value}</p>
      </div>
      <div className="border-t border-line pt-3">
        {ctaHref ? (
          <Link href={ctaHref} className="dash-metric-link text-[11px] font-medium tracking-[0.1em] uppercase">
            {ctaLabel} →
          </Link>
        ) : (
          <span className="dash-metric-link text-[11px] font-medium tracking-[0.1em] uppercase opacity-40">
            {ctaLabel} →
          </span>
        )}
      </div>
    </div>
  );
}
