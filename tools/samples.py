#!/usr/bin/env python3
"""Fill the sample grid of index.html and vi/index.html from samples.json.

  python3 tools/samples.py [--manifest <drive-to-youtube manifest.json>] [--posters <dir of <driveId>.jpg>]

A sample plays from YouTube when the manifest has its link (else from Drive). Posters: posters/<slug>.jpg; a
missing one is copied from --posters/<driveId>.jpg. Writes between <!-- samples --> and <!-- /samples -->.
"""
import argparse, html, json, re, shutil
from pathlib import Path

R = Path(__file__).resolve().parent.parent
ap = argparse.ArgumentParser()
ap.add_argument("--manifest", default=str(Path.home() / "Documents/Edit/Projects/drive-to-youtube/manifest.json"))
ap.add_argument("--posters", default=str(Path.home() / "Documents/Edit/Projects/drive-to-youtube/posters"))
a = ap.parse_args()

yt = {}
if Path(a.manifest).exists():
    for r in json.load(open(a.manifest, encoding="utf-8")):
        m = re.search(r"(?:youtu\.be/|v=|shorts/)([\w-]{11})", r.get("link") or "")
        if m:
            yt[r["id"]] = m.group(1)

LABEL = {"en": "Play {}", "vi": "Phát {}"}
CAT = {"en": {"ugc": "UGC", "ads": "Ads", "ai": "AI video", "talking": "Talking head", "motion": "Motion", "asmr": "ASMR"},
       "vi": {"ugc": "UGC", "ads": "Quảng cáo", "ai": "Video AI", "talking": "Talking head", "motion": "Motion", "asmr": "ASMR"}}
# old 202x360 posters, used until a 540-wide frame from the upload exists
LEGACY = {"black-friday": "meta-ads", "vip-11-11": "tiktok-ads", "dog-seat-ai": "video-ai", "coffee-2-5d": "2-5d",
          "talking-head": "talking-head", "asmr-black-red": "asrm", "story-intro": "story-animation",
          "tesla-motion": "motion-ad", "ugc-sidney": "ugc"}
VI_FIRST = ["talking-head", "vip-11-11"]  # Vietnamese buyers see the Vietnamese samples first
samples = json.load(open(R / "samples.json", encoding="utf-8"))
poster = {}
missing = []
for s in samples:
    dst = R / "posters" / f"{s['slug']}.jpg"
    src = Path(a.posters) / f"{s['drive']}.jpg"
    if not dst.exists() and src.exists():
        shutil.copy(src, dst)
    if dst.exists():
        poster[s["slug"]] = s["slug"]
    elif (R / "posters" / f"{LEGACY.get(s['slug'], '-')}.jpg").exists():
        poster[s["slug"]] = LEGACY[s["slug"]]
    else:
        missing.append(s["slug"])

for lang, page, pre in (("en", R / "index.html", ""), ("vi", R / "vi/index.html", "../")):
    out = []
    order = samples if lang == "en" else sorted(samples, key=lambda s: VI_FIRST.index(s["slug"]) if s["slug"] in VI_FIRST else len(VI_FIRST))
    for s in order:
        if s["slug"] in missing:
            continue
        title, desc, price = (html.escape(x) for x in s[lang])
        src = f'data-yt="{yt[s["drive"]]}"' if s["drive"] in yt else f'data-drive="{s["drive"]}"'
        extra = " data-extra" if s.get("extra") else ""
        out.append(
            f'      <li class="card" data-cat="{s["cat"]}"{extra}>\n'
            f'        <button class="play" type="button" {src} aria-label="{LABEL[lang].format(title)}">'
            f'<img src="{pre}posters/{poster[s["slug"]]}.jpg" alt="" width="540" height="960" loading="lazy"></button>\n'
            f'        <h3>{title}</h3><p>{desc}</p><div class="meta"><span class="caps">{CAT[lang][s["cat"]]}</span><b>{price}</b></div>\n'
            f'      </li>')
    text = page.read_text(encoding="utf-8")
    text = re.sub(r"(<!-- samples -->\n).*?(\s*<!-- /samples -->)", lambda m: m.group(1) + "\n".join(out) + m.group(2), text, flags=re.S)
    page.write_text(text, encoding="utf-8")

print(json.dumps({"cards": len(samples) - len(missing), "youtube": sum(s["drive"] in yt for s in samples), "missing_posters": missing}))
