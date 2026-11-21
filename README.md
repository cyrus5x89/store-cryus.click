# Cryus Edit store

Static price list and process page for video editing and AI video services (USD).

- `index.html` is the English page; `vi/index.html` is the Vietnamese page. The two link to each other. No build step.
- Prices are USD on both pages. Keep them in sync when you change one.
- Styles and script live in `site.css` and `site.js`, shared by both pages. Look: light "rate card" (paper `#F4F1EA`, ink `#14130F`, red `#C2330F`, Anton + Be Vietnam Pro).
- The sample grid is generated: edit `samples.json`, then run `python3 tools/samples.py`. It writes the cards between `<!-- samples -->` markers in both pages, plays from YouTube (unlisted, `youtube-nocookie`) when the upload manifest has the link and from Drive otherwise, and takes 540-wide posters from `posters/<slug>.jpg`. The cards show in a paged rail (3 per dot on desktop, 2 on phones); `"extra": true` only puts a card after the featured ones.
- Demo video files are not stored in this repo.
- Custom domain `store-cryus.click` is not connected yet. When DNS is set on Cloudflare, add a `CNAME` file containing `store-cryus.click` and point the domain at GitHub Pages.
