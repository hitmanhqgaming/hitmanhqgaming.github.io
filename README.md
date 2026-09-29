# HITMAN HEADQUARTERS — Gaming Website

A dark/red gaming website for **Hitman HQ Gaming**.

## Locked design direction

- Full Hitman HQ gaming website
- Black base with subtle dark-red texture/glow
- Large `HITMAN HEADQUARTERS` hero
- `PLAY. HUNT. CONQUER.`
- `GAMING • STREAMING • ENTERTAINMENT`
- YouTube + Discord hero buttons
- Automatically reads the public YouTube RSS feed
- Latest video featured, with fallback to latest available content
- `LIVE NOW` hero badge when a recent livestream is detected
- Gaming-style content cards
- Games section
- MP GAMING NETWORK community section
- Social cards for all supplied platforms
- Personal Instagram kept separate
- Mobile hamburger menu
- Moderate animations and hover effects
- Futuristic heading typography + modern body typography

## YouTube configuration

The channel is configured with both:

- Channel ID: `UCClntt9HBQirLO6m0klTY4g`
- Handle: `@HitmanHQGaming`

The frontend uses the channel ID for the public RSS feed and the handle for public links.

## GitHub Pages

1. Create a GitHub repository.
2. Upload `index.html`, `styles.css`, and `script.js`.
3. Open **Settings → Pages**.
4. Choose **Deploy from a branch**.
5. Select the `main` branch and `/root`.
6. Save and wait for GitHub Pages to publish.

No secret API key is required by this version.

## Note about YouTube live detection

This static version uses the public YouTube RSS feed through RSS2JSON. A livestream can be detected when it appears in the feed. For exact real-time `liveBroadcasts` status, the next version can use the official YouTube Data API through a serverless backend, without exposing the API key in the browser.
