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
