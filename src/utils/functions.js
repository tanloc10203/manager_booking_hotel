import _ from "lodash";
import slugify from "slugify";
import dataImageJson from "./dataImageArea.json";

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

export const getImageArea = (code) => {
  const listImageArea = dataImageJson.data;
  return listImageArea[code] ? listImageArea[code] : listImageArea["any"];
};

export const caclPriceDiscounct = ({ price = 0, persent_discount = 0 }) => {
  const result = price - price * (persent_discount / 100);
  return result;
};
