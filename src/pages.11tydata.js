export default {
  eleventyComputed: {
    pageTitle: (data) => data.entry.title,
    pageDescription: (data) => (data.entry.seo && data.entry.seo.description) || "",
    pageNoindex: (data) => !!(data.entry.seo && data.entry.seo.noindex),
  },
};
