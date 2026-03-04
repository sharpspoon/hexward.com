# Hexward Consulting Website

A static, single-page website for Hexward Consulting with a 90s-inspired design and fully crawlable HTML content.

## Project Structure

```text
hexward.com/
├── index.html          # Single-page website (all HTML/CSS inline)
├── robots.txt          # Crawler directives
├── sitemap.xml         # XML sitemap
├── robin.png           # About section profile photo
├── assets/             # Logo/brand assets (kept for compatibility)
├── css/                # Legacy styles (not required by index.html)
├── js/                 # Legacy scripts (not required by index.html)
└── README.md           # This file
```

## Current Site Design

- Single-file delivery: no external CSS, JS, frameworks, or dependencies
- 90s terminal-inspired aesthetic using inline CSS
- Static anchor navigation (`#hero`, `#services`, `#about`, `#contact`)
- Semantic HTML structure for accessibility and SEO
- All visible copy rendered directly in raw HTML
- Blinking cursor effect only (no other animations)

## SEO

- `index.html` includes:
  - Proper `<title>`
  - `<meta name="description">`
  - Semantic heading hierarchy (`h1` to `h3`)
  - Semantic page landmarks (`header`, `main`, `section`, `footer`)
- `robots.txt` allows crawling and points to sitemap
- `sitemap.xml` includes the canonical site URL

## Deployment

This is a static site and can be deployed on any static host by uploading:

- `index.html`
- `robots.txt`
- `sitemap.xml`
- `robin.png`
- optional `assets/` files
