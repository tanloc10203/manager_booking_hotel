import { useParams } from "react-router-dom";
import { FormAddEditHotel, PageLayoutAddEdit } from "../../components";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { appActions } from "~/features/app/appSlice";
import { hotelActions } from "~/features/hotels/hotelSlice";

function HotelAddEdit(props) {
  const { hotelId } = useParams();

  const isAddMode = !Boolean(hotelId);

  const dispatch = useDispatch();

  const initialValues = {
    hotel_name: "",
    hotel_desc: "",
    hotel_address: "",
    provice_code: "",
    district_code: "",
    ward_code: "",
    provice_name: "",
    district_name: "",
    ward_name: "",
  };

  const hotetAddSchema = Yup.object().shape({
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

  const handleSubmit = (values) => {
    if (!values) return;

    return new Promise((resolve, reject) => {
      try {
        dispatch(appActions.setOpenOverlay(true));

        setTimeout(() => {
          dispatch(hotelActions.createStart(values));
          resolve(true);
        }, 1500);
      } catch (error) {
        reject(error);
      }
    });
  };

  return (
    <PageLayoutAddEdit
      title={`${isAddMode ? "Thêm" : "Cập nhật"} Khách sạn`}
      backLink="/manager/hotel"
    >
      <FormAddEditHotel
        onSubmit={handleSubmit}
        initialValues={initialValues}
        schema={hotetAddSchema}
      />
    </PageLayoutAddEdit>
  );
}

export default HotelAddEdit;
