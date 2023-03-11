import _ from "lodash";

function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;

  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }

  str.sort();

  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }

  return sorted;
}

const getFieldOfObject = ({ fileds = [], object = {} }) => {
  if (_.isEmpty(object)) return {};

  return _.pick(object, fileds);
};

const deleteKeyObjectOrNullOrUndefinedOrEmpty = (obj) => {
  let newObj = {};

  Object.keys(obj).forEach((key) => {
    if (!obj[key]) {
      delete obj[key];
    } else {
      newObj = { ...newObj, [key]: obj[key] };
    }
  });

  return newObj;
};

export {
  sortObject,
  getFieldOfObject,
  deleteKeyObjectOrNullOrUndefinedOrEmpty,
};
