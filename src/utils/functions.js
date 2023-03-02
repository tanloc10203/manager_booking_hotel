import _ from "lodash";
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

export const getFieldOfObject = ({ fileds = [], object = {} }) => {
  if (_.isEmpty(object)) return {};

  return _.pick(object, fileds);
};
