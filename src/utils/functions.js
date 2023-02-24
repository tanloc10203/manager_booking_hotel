import slugify from "slugify";

export const getSlug = (slug) => {
  if (!slug) return undefined;

  return slugify(slug, {
    replacement: "-",
    remove: undefined,
    lower: true,
    strict: true,
    locale: "vi",
    trim: true,
  });
};
