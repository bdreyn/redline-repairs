/**
 * Sveltia CMS preview pane — renders page/home "blocks" using the same CSS
 * classes as the real site (src/_includes/blocks/*.njk) so the preview
 * looks like the published page. Kept intentionally simple: blocks whose
 * content lives outside the entry being edited (Services, Reviews, Site
 * Settings) render as a labeled placeholder rather than fetched live data.
 *
 * If you add/change a block type in admin/config.yml, mirror the change in
 * renderBlock() below and in the matching src/_includes/blocks/*.njk file
 * — they're two independent copies of the same logic (Nunjucks at build
 * time, this at CMS-preview time) and will drift if only one is updated.
 */
(function () {
  var md = window.markdownit({ html: false, breaks: true, linkify: true });

  function esc(str) {
    if (str === null || str === undefined) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function placeholder(label, note) {
    return (
      '<div style="margin:2rem auto;max-width:860px;padding:1.5rem;border:2px dashed #9ca3af;' +
      'border-radius:8px;text-align:center;color:#4b5563;font-family:sans-serif;">' +
      "<strong>" +
      esc(label) +
      "</strong><br>" +
      "<span style=\"font-size:.9rem;\">" +
      esc(note) +
      "</span></div>"
    );
  }

  function renderBlock(block) {
    var type = block.type;

    if (type === "hero") {
      return (
        '<section id="hero"><div class="hero-content container" style="position:static;">' +
        (block.badge ? '<div class="hero-badge">' + esc(block.badge) + "</div>" : "") +
        '<h1 class="hero-title" style="color:#0f1923;">' + esc(block.title) + "</h1>" +
        '<p class="hero-sub" style="color:#4b5563;">' + esc(block.subtitle) + "</p>" +
        "</div></section>"
      );
    }

    if (type === "richtext") {
      var tag = ["h2", "h3", "h4"].indexOf(block.heading_level) !== -1 ? block.heading_level : "h2";
      var align = ["left", "center", "right"].indexOf(block.align) !== -1 ? block.align : "center";
      return (
        '<section class="richtext-section"><div class="container mission-inner align-' +
        align +
        '">' +
        (block.heading ? "<" + tag + ">" + esc(block.heading) + "</" + tag + ">" : "") +
        md.render(block.body || "") +
        "</div></section>"
      );
    }

    if (type === "cta") {
      return (
        '<section class="cta-block"><div class="container cta-block-inner">' +
        "<p>" + esc(block.text) + "</p>" +
        '<a class="btn-primary" href="' + esc(block.button_link) + '">' + esc(block.button_label) + "</a>" +
        "</div></section>"
      );
    }

    if (type === "custom_html") {
      var html = typeof block.html === "string" ? block.html : (block.html && block.html.code) || "";
      return '<section class="custom-html-block"><div class="container">' + html + "</div></section>";
    }

    if (type === "areas_served") {
      var areas = block.areas || [];
      return (
        '<section id="areas-served"><div class="container">' +
        '<div class="section-header">' +
        (block.label ? '<span class="section-label">' + esc(block.label) + "</span>" : "") +
        "<h2>" + esc(block.heading) + "</h2>" +
        (block.subheading ? "<p>" + esc(block.subheading) + "</p>" : "") +
        "</div>" +
        '<div class="areas-grid">' +
        areas.map(function (a) { return '<div class="area-card"><span>' + esc(a) + "</span></div>"; }).join("") +
        "</div></div></section>"
      );
    }

    if (type === "services_list") {
      return placeholder(
        "Services List: " + (block.heading || ""),
        "Pulls live from the Services collection — not shown in this preview. Check the published page to see real service cards."
      );
    }
    if (type === "reviews_list") {
      return placeholder(
        "Reviews List: " + (block.heading || ""),
        "Pulls live from the Reviews collection (approved only) — not shown in this preview."
      );
    }
    if (type === "map_location") {
      return placeholder(
        "Map & Location: " + (block.heading || ""),
        "Pulls live from Site Settings (map, hours, contact form) — not shown in this preview."
      );
    }

    return placeholder("Unknown block type: " + type, "");
  }

  function BlocksPreview(props) {
    var data = props.entry.get("data").toJS();
    var blocks = data.blocks || [];
    var html = blocks.map(renderBlock).join("\n");
    return h("div", { dangerouslySetInnerHTML: { __html: html } });
  }

  CMS.registerPreviewStyle("/css/style.css");
  CMS.registerPreviewStyle(
    "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Barlow:wght@400;500;600&display=swap"
  );

  CMS.registerPreviewTemplate("pages", BlocksPreview);
  // Attempt the same for the "home" singleton — Sveltia's docs don't
  // explicitly confirm singleton support as of this writing, so verify
  // this one actually renders in the editor rather than assuming it works.
  CMS.registerPreviewTemplate("home", BlocksPreview);
})();
