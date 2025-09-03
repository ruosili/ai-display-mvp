type Common = { category: string; query: string; placement: string; country: string; ts: number };

const inc = (k: string) => {
  if (typeof window === 'undefined') return 0;
  const v = Number(localStorage.getItem(k) || "0") + 1;
  localStorage.setItem(k, String(v));
  return v;
};

export function recordImpression(c: Common) {
  console.log({ event: "impression", ...c });
  inc("ads_impressions_total");
  inc(`ads_impressions_${c.category}`);
}

export function recordClick(c: Common) {
  console.log({ event: "click", ...c });
  inc("ads_clicks_total");
  inc(`ads_clicks_${c.category}`);
}

export function counters() {
  if (typeof window === 'undefined') {
    return { impressions_total: 0, clicks_total: 0 };
  }
  const all = { ...localStorage };
  const key = (k: string) => Number(all[k] || "0");
  return {
    impressions_total: key("ads_impressions_total"),
    clicks_total: key("ads_clicks_total")
  };
}
