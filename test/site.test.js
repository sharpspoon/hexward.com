const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const siteRoot = path.join(__dirname, "..", "_site");

function readBuiltFile(relativePath) {
  const filePath = path.join(siteRoot, relativePath);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Built file not found: ${relativePath}. Run "npm run build" before "npm test".`);
  }

  return fs.readFileSync(filePath, "utf8");
}

test("primary site pages include a blog link in navigation", () => {
  for (const relativePath of [
    "index.html",
    "case-studies.html",
    "services/backend.html",
    "services/devops.html",
    "services/database.html",
    "services/ai-automation.html",
  ]) {
    assert.match(
      readBuiltFile(relativePath),
      /<a href="\/blog\/">Blog<\/a>/,
      `${relativePath} is missing the blog nav link`
    );
  }
});

test("blog index uses the shared stylesheet and no legacy inline theme", () => {
  const blogIndex = readBuiltFile("blog/index.html");

  assert.match(blogIndex, /<link rel="stylesheet" href="\/css\/style\.css">/);
  assert.doesNotMatch(blogIndex, /<style>/);
  assert.match(blogIndex, /class="blog-list"/);
});

test("published posts render the shared blog chrome and exclude drafts", () => {
  const postHtml = readBuiltFile("blog/hello-world/index.html");
  const blogIndex = readBuiltFile("blog/index.html");

  assert.match(postHtml, /Hexward Consulting/);
  assert.match(postHtml, /Need help with something like this\?/);
  assert.doesNotMatch(blogIndex, /why-i-built-hex/i);
  assert.equal(fs.existsSync(path.join(siteRoot, "blog", "why-i-built-hex", "index.html")), false);
});
