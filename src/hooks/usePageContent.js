import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

export const DEFAULTS = {
  hero: {
    headline:        "ARTISAN\nGRILLED\nCHEESE.",
    headline_accent: "REIMAGINED.",
    subline:         "Akron, Ohio's gourmet food truck making every sandwich an experience that stops you in your tracks.",
    image_url:       "https://media.base44.com/images/public/69b410ceece31b13c728497b/5e68b0a48_generated_image.png",
    order_url:       "https://cheeziesgourmetohio.square.site/",
    review_url:      "https://maps.app.goo.gl/dUyof854YsHaKcNE9",
  },
  about: {
    eyebrow:      "Our Story",
    headline:     "More Than Just a Grilled Cheese",
    body:         "Cheezies started with one idea — take the most comforting food in the world and make it extraordinary. We blend bold flavors, premium ingredients, and a whole lot of heart into every sandwich. Born and raised in Akron, Ohio, proud to serve our community fresh to order.",
    image_url:    "https://media.base44.com/images/public/69b410ceece31b13c728497b/03ee6d0a3_generated_image.png",
    fan_fav_text: "From The Patty Meltdown to The Mac Attack — every sandwich is a showstopper. Come hungry.",
    stat1_val:    "Made Fresh",     stat1_desc: "Crafted to order.",
    stat2_val:    "Premium Cheese", stat2_desc: "Melted perfectly.",
    stat3_val:    "Akron Proud",    stat3_desc: "Community first.",
  },
  catering: {
    headline:        "Catering &",
    headline_accent: "Private Events",
    body:            "Birthday parties · Corporate lunches · Weddings · Festivals. We scale up and show up, from 25 guests to 300+.",
    stat1_val: "25-300+", stat1_label: "GUESTS",
    stat2_val: "3",       stat2_label: "PACKAGES",
    stat3_val: "24HR",    stat3_label: "RESPONSE",
  },
  video: {
    eyebrow:   "See Us in Action",
    headline:  "Truck Life",
    caption:   "From prep to plate, watch the craft behind every gourmet creation. This is Cheezies.",
    video_url: "https://media.base44.com/videos/public/69b410ceece31b13c728497b/c5456f871_attcS18sxOcDJnkfVPRyAR7tGR4pyDRz3M5DhjwM2A_b-I.mp4",
  },
};

function buildMerged(records) {
  const db = {};
  for (const r of records) {
    if (!db[r.section]) db[r.section] = {};
    db[r.section][r.field] = r.value;
  }
  const merged = {};
  for (const section of Object.keys(DEFAULTS)) {
    merged[section] = { ...DEFAULTS[section], ...(db[section] || {}) };
  }
  return merged;
}

export function usePageContent() {
  const [content, setContent] = useState(DEFAULTS);

  useEffect(() => {
    base44.entities.SiteContent.list("section", 200).then(records => {
      setContent(buildMerged(records));
    });

    const unsub = base44.entities.SiteContent.subscribe(() => {
      base44.entities.SiteContent.list("section", 200).then(records => {
        setContent(buildMerged(records));
      });
    });

    return unsub;
  }, []);

  return content;
}