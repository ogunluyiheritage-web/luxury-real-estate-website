# Aurelia Estates
`npm install && npm run build && npm start`. Deploy: push to GitHub, import in Vercel (framework auto-detected). Optional env: NEXT_PUBLIC_SITE_URL.

## Real photography
Drop JPGs at `public/photos/<property-slug>/<kind>.jpg` (kinds: exterior, living, kitchen, bedroom, bath, pool, terrace, garden) and set `NEXT_PUBLIC_USE_PHOTOS=1` in Vercel. Without it, the built-in illustrated fallbacks are used.
