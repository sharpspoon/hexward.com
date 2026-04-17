# Hexward Blog (11ty addition to hexward.com)

Eleventy-powered blog integrated into the existing GitHub Pages site at `hexward.com`.
The existing `index.html` passes through the build untouched; a new `/blog/` section is added.

## One-time setup

### 1. Merge these files into your existing repo

Drop everything in this scaffold into the repo root alongside your existing `index.html`:

```
.eleventy.js
package.json
.gitignore              # merge with existing if you have one
src/                    # blog templates + posts
.github/workflows/deploy.yml
```

### 2. Update .eleventy.js passthrough list

Edit `.eleventy.js` and make sure every existing root file/folder you want preserved
is listed in `addPassthroughCopy(...)`. The defaults cover:

- `index.html`
- `robin.png`
- `CNAME`
- `sitemap.xml`
- `robots.txt`

Add anything else at the repo root (favicon, other images, etc.).

### 3. Switch GitHub Pages to "GitHub Actions" source

In the repo: **Settings → Pages → Build and deployment → Source** → change from
"Deploy from a branch" to **"GitHub Actions"**. This disables the default branch-based
deploy and lets our workflow handle it.

### 4. Push to main

The workflow runs automatically, builds `_site/`, and deploys it to Pages.
Confirm `hexward.com` still loads normally and `hexward.com/blog/` shows the new blog.

## Writing a post

Drop a markdown file into `src/blog/`:

```yaml
---
title: "Post title"
description: "One-line summary"
date: 2026-04-16
tags: ["optional", "tags"]
---

Post body in markdown.
```

Filename becomes the slug: `src/blog/my-post.md` → `hexward.com/blog/my-post/`.

## Local preview

```bash
npm install
npm run serve    # http://localhost:8080
```

## Linking from index.html

Add a Blog entry to the nav in `index.html`:

```html
<li><a href="/blog/">Blog</a></li>
```

## Existing sitemap.xml / robots.txt

If you already have these at the repo root, they'll pass through as-is. If you want
the blog posts included in the main sitemap, either:

- Manually add blog URLs to the existing `sitemap.xml`, or
- Switch to the 11ty-generated `/blog/sitemap.xml` and reference both from robots.txt.
