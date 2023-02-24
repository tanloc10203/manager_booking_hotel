import { useParams } from "react-router-dom";
import { FormAddEditHotel, PageLayoutAddEdit } from "../../components";
import * as Yup from "yup";

function HotelAddEdit(props) {
  const { hotelId } = useParams();

  const isAddMode = !Boolean(hotelId);

  const initialValues = {
    hotel_name: "",
    hotel_desc: "",
    hotel_address: "",
    proviceCode: "",
    distirctCode: "",
    wardCode: "",
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
    proviceCode: Yup.string().required("Vui lòng chọn tỉnh thành!"),
    distirctCode: Yup.string().required("Vui lòng chọn quận huyện!"),
    wardCode: Yup.string().required("Vui lòng chọn xã phường!"),
  });

  const handleSubmit = (values) => {
    if (!values) return;

    console.log("check values:::", values);
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
