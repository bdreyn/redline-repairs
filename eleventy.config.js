import MarkdownIt from "markdown-it";

const md = new MarkdownIt({
  html: false, // literal HTML in the markdown source is escaped, not rendered —
  // raw HTML has its own dedicated "Custom HTML" block for trusted editors
  breaks: true, // a single line break becomes <br>, not just blank-line paragraphs
  linkify: true,
});

export default function (eleventyConfig) {
  eleventyConfig.addFilter("markdown", (value) => (value ? md.render(String(value)) : ""));

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
