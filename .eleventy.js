const rssPlugin = require("@11ty/eleventy-plugin-rss");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(rssPlugin);

// Root-level HTML pages
eleventyConfig.addPassthroughCopy("index.html");
eleventyConfig.addPassthroughCopy("case-studies.html");
eleventyConfig.addPassthroughCopy("hex.html");

// Root-level assets
eleventyConfig.addPassthroughCopy("logo.png");
eleventyConfig.addPassthroughCopy("logo.svg");
eleventyConfig.addPassthroughCopy("robin.png");

// Root-level config/SEO files
eleventyConfig.addPassthroughCopy("CNAME");
eleventyConfig.addPassthroughCopy("robots.txt");
eleventyConfig.addPassthroughCopy("sitemap.xml");

// Existing directories (entire trees copied as-is)
eleventyConfig.addPassthroughCopy("services");
eleventyConfig.addPassthroughCopy("css");
eleventyConfig.addPassthroughCopy("assets");

// Blog post images
eleventyConfig.addPassthroughCopy("src/blog/**/*.{png,jpg,jpeg,gif,svg,webp}");

  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return new Date(dateObj).toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric", timeZone: "UTC",
    });
  });

  eleventyConfig.addFilter("isoDate", (dateObj) => {
    return new Date(dateObj).toISOString();
  });

  eleventyConfig.addCollection("posts", (collection) => {
    return collection
      .getFilteredByGlob("src/blog/*.md")
      .sort((a, b) => b.date - a.date);
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
