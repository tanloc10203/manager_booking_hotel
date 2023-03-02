import * as Yup from "yup";

export const hotetAddSchema = Yup.object().shape({
  hotel_name: Yup.string()
    .min(2, "Quá ngắn!")
    .max(50, "Quá dài!")
    .required("Vui lòng không bỏ trống!"),
  hotel_desc: Yup.string().required("Vui lòng không bỏ trống!"),
  hotel_address: Yup.string()
    .min(2, "Quá ngắn!")
    .max(50, "Quá dài!")
    .required("Vui lòng không bỏ trống!"),
  provice_code: Yup.string().required("Vui lòng chọn tỉnh thành!"),
  district_code: Yup.string().required("Vui lòng chọn quận huyện!"),
  ward_code: Yup.string().required("Vui lòng chọn xã phường!"),
  provice_name: Yup.string().required("Vui lòng chọn tỉnh thành!"),
  district_name: Yup.string().required("Vui lòng chọn quận huyện!"),
  ward_name: Yup.string().required("Vui lòng chọn xã phường!"),
});

export const florAddSchema = Yup.object().shape({
  floor_name: Yup.string()
    .min(2, "Quá ngắn!")
    .max(50, "Quá dài!")
    .required("Vui lòng không bỏ trống!"),
  floor_type: Yup.string().required("Vui lòng không bỏ trống!"),
  hotel_id: Yup.string().required("Vui lòng không bỏ trống!"),
});

export const deviceAddSchema = Yup.object().shape({
  dt_name: Yup.string()
    .min(2, "Quá ngắn!")
    .max(50, "Quá dài!")
    .required("Vui lòng không bỏ trống!"),
  dt_desc: Yup.string().required("Vui lòng không bỏ trống!"),
});

export const roomTypeAddSchema = Yup.object().shape({
  rt_name: Yup.string()
    .min(2, "Quá ngắn!")
    .max(50, "Quá dài!")
    .required("Vui lòng không bỏ trống!"),
  rt_desc: Yup.string().required("Vui lòng không bỏ trống!"),
  rt_type: Yup.string().required("Vui lòng không bỏ trống!"),
});

export const statusAddSchema = Yup.object().shape({
  type: Yup.string()
    .min(2, "Ít nhất 2 kí tự!")
    .max(10, "Nhiều nhất 10 kí tự!")
    .required("Vui lòng không bỏ trống!"),
  desc: Yup.string().required("Vui lòng không bỏ trống!"),
  key: Yup.string()
    .min(2, "Ít nhất 2 kí tự!")
    .max(5, "Nhiều nhất 6 kí tự!")
    .required("Vui lòng không bỏ trống!"),
  value: Yup.string()
    .min(2, "Ít nhất 2 kí tự!")
    .max(20, "Nhiều nhất 20 kí tự!")
    .required("Vui lòng không bỏ trống!"),
});
