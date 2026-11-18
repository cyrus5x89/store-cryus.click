# Cryus Edit store

Static price list and process page for video editing and AI video services (USD).

- `index.html` is the English page; `vi/index.html` is the Vietnamese page. The two link to each other. No build step.
- Prices are USD on both pages. Keep them in sync when you change one.
- Sample videos are Google Drive preview embeds. To switch a sample to YouTube later, replace its `iframe src` with `https://www.youtube-nocookie.com/embed/VIDEO_ID`.
- Demo video files are not stored in this repo.
- Custom domain `store-cryus.click` is not connected yet. When DNS is set on Cloudflare, add a `CNAME` file containing `store-cryus.click` and point the domain at GitHub Pages.
