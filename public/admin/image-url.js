(function (root, factory) {
  var convert = factory();
  if (typeof module === "object" && module.exports) module.exports = convert;
  if (root) root.teslaImageUrl = convert;
})(typeof window !== "undefined" ? window : null, function () {
  return function imageUrl(value) {
    if (typeof value !== "string") return value;
    try {
      var url = new URL(value.trim());
      if (url.protocol !== "https:" || url.hostname !== "drive.google.com") return value;
      var match = url.pathname.match(/^\/file\/d\/([\w-]+)(?:\/|$)/);
      var id = match ? match[1] : (/^\/(?:open|uc|thumbnail)$/.test(url.pathname) ? url.searchParams.get("id") : null);
      if (!id || !/^[\w-]+$/.test(id)) return value;
      var resourceKey = url.searchParams.get("resourcekey");
      return "https://drive.google.com/thumbnail?id=" + encodeURIComponent(id) + "&sz=w1600" + (resourceKey ? "&resourcekey=" + encodeURIComponent(resourceKey) : "");
    } catch (e) { return value; }
  };
});
