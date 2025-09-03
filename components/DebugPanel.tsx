"use client";
import { useState } from "react";
import { counters } from "@/lib/metrics";

export default function DebugPanel({ data }: { data: any }) {
  const [open, setOpen] = useState(false);
  const c = counters();
  return (
    <div className="mt-6">
      <button className="text-sm underline" onClick={() => setOpen(!open)}>
        {open ? "Hide" : "Show"} debug
      </button>
      {open && (
        <div className="mt-2 text-sm bg-gray-50 border rounded p-3 overflow-auto">
          <div className="mb-2">Impressions Total: {c.impressions_total} | Clicks Total: {c.clicks_total}</div>
          <pre className="whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
