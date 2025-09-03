"use client";
import { useEffect, useMemo, useState } from "react";
import AdCard from "@/components/AdCard";
import DebugPanel from "@/components/DebugPanel";
import { queryToCategory } from "@/lib/match";
import type { Catalog } from "@/lib/types";
import { recordImpression } from "@/lib/metrics";

const placements = ["inline_answer","followup_prompt","card","results_list","voice_slate"] as const;

export default function Home() {
  const [q, setQ] = useState("best running shoes under $120");
  const [placement, setPlacement] = useState<(typeof placements)[number]>("inline_answer");
  const [country, setCountry] = useState("US");
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [ad, setAd] = useState<any>(null);
  const [resolved, setResolved] = useState({ category: "", decision: "no_fill" });

  useEffect(() => {
    fetch("/catalog.json").then(r => r.json()).then(setCatalog);
  }, []);

  const doFetch = () => {
    if (!catalog) return;
    const category = queryToCategory(q);
    if (category && catalog[category]?.length) {
      const ad = catalog[category][0];
      setAd(ad);
      setResolved({ category, decision: "serve" });
      recordImpression({ category, query: q, placement, country, ts: Date.now() });
    } else {
      setAd(null);
      setResolved({ category: "", decision: "no_fill" });
    }
  };

  const answer = useMemo(() =>
    `Here's a concise, neutral overview for: "${q}". In a full system, this would be your model's editorial answer.`, [q]);

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-2">AI Display MVP (Frontend-Only)</h1>
      <p className="text-sm text-gray-600 mb-6">
        Fake data only. No backend. All ads are clearly labeled as <strong>Sponsored</strong>.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <input className="border rounded p-2 sm:col-span-2" value={q} onChange={e=>setQ(e.target.value)} placeholder="Enter a query…" />
        <select className="border rounded p-2" value={placement} onChange={e=>setPlacement(e.target.value as typeof placement)}>
          {placements.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <select className="border rounded p-2" value={country} onChange={e=>setCountry(e.target.value)}>
          {["US","CA","UK","AU","DE","FR","ES","IT"].map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <button className="mt-3 border rounded px-3 py-2" onClick={doFetch}>Fetch Ad</button>

      <div className="mt-6">
        <h2 className="font-semibold mb-1">Editorial Answer (placeholder)</h2>
        <p className="text-sm">{answer}</p>
      </div>

      {ad ? (
        <>
          {placement === "voice_slate" && (
            <div className="text-xs text-gray-500 mt-2">
              (Voice slate demo: the following Sponsored unit would be read aloud first.)
            </div>
          )}
          <AdCard ad={ad} query={q} placement={placement} country={country} category={resolved.category} />
        </>
      ) : resolved.decision === "no_fill" ? <p className="mt-4 text-sm text-gray-600">No ad.</p> : null}

      <DebugPanel data={{ placement, country, resolved, q, ad }} />

      <div className="mt-8 text-xs text-gray-500">
        Safety: Always labeled <strong>Sponsored</strong>. No sensitive categories. No personalization/PII.
      </div>
    </main>
  );
}
