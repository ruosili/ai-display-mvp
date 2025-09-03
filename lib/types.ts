export type Ad = {
  disclosure: "Sponsored";
  advertiser: string;
  title: string;
  body: string;
  cta_label: string;
  cta_url: string;
  image_url?: string;
  safety_tags?: string[];
};

export type Catalog = Record<string, Ad[]>;
