# Cryus Edit store

Static price list and process page for video editing and AI video services (USD).

- `index.html` is the English page; `vi/index.html` is the Vietnamese page. The two link to each other. No build step.
- Prices are USD on both pages. Keep them in sync when you change one.
- Styles and script live in `site.css` and `site.js`, shared by both pages. Sample cards carry a `data-id` (Drive file ID); `open()` in `site.js` builds the preview URL and shows it in the lightbox. For YouTube, change that URL there.
- Demo video files are not stored in this repo.
- Custom domain `store-cryus.click` is not connected yet. When DNS is set on Cloudflare, add a `CNAME` file containing `store-cryus.click` and point the domain at GitHub Pages.
