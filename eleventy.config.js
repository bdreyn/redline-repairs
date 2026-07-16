export default function (eleventyConfig) {
  eleventyConfig.addFilter("nl2p", (value) => {
    if (!value) return "";
    const escape = (str) =>
      String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    return String(value)
      .split(/\n\s*\n/)
      .map((para) => `<p>${escape(para.trim())}</p>`)
      .join("\n");
  });

  eleventyConfig.addFilter("prettyDate", (value) => {
    if (!value) return "";
    const d = new Date(value);
    if (isNaN(d)) return value;
    return new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(d);
  });

  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/favicon.svg");
  eleventyConfig.addPassthroughCopy("admin");

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    templateFormats: ["njk", "11ty.js"],
    htmlTemplateEngine: "njk",
  };
}
