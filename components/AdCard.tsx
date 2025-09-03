"use client";
import { Ad } from "@/lib/types";
import { recordClick } from "@/lib/metrics";

type Props = {
  ad: Ad;
  query: string;
  country: string;
  placement: string;
  category: string;
};

export default function AdCard({ ad, query, country, placement, category }: Props) {
  const onClick = () => {
    recordClick({ category, query, placement, country, ts: Date.now() });
  };

  return (
    <div className="rounded-lg border p-4 mt-4">
      <div className="text-xs uppercase tracking-wide text-gray-500">
        <strong>Sponsored</strong> — {ad.advertiser}
      </div>
      <div className="text-lg font-semibold mt-1">{ad.title}</div>
      <p className="mt-1 mb-3 text-sm">{ad.body}</p>
      {ad.image_url && <img src={ad.image_url} alt="" className="rounded mb-3" />}
      <a
        className="inline-block underline"
        href={ad.cta_url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
      >
        {ad.cta_label}
      </a>
    </div>
  );
}
