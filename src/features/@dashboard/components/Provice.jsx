import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { memo, useCallback, useEffect, useState } from "react";
import { getDistrict, getProvince, getWard } from "~/apis";
import PropTypes from "prop-types";
import SelectForm from "./forms/SelectForm";

function Provice({
  getFieldProps,
  touched,
  errors,
  values,
  setFieldValue,
  ...others
}) {
  const [state, setState] = useState({
    provices: [],
    districts: [],
    wards: [],
  });

  const getProvinces = useCallback(async () => {
    const provices = await getProvince();
    setState((pre) => ({ ...pre, provices }));
  }, []);

  useEffect(() => {
    getProvinces();
  }, []);

  const handleChange = useCallback(async (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setFieldValue(name, value);

    let nameSelect = "districts";
    let results = [];

    if (name === "proviceCode") {
      const dicritcs = await getDistrict(value);
      results = [...dicritcs];
    }

    if (name === "distirctCode") {
      nameSelect = "wards";
      const wards = await getWard(value);
      results = [...wards];
    }

    if (results.length > 0) {
      setState((pre) => ({ ...pre, [nameSelect]: results }));
    }
  });

  return (
    <>
      <SelectForm
        value={values.proviceCode}
        error={Boolean(touched.proviceCode && errors.proviceCode)}
        helperText={touched.proviceCode && errors.proviceCode}
        label="Tỉnh thành"
        name="proviceCode"
        onChange={handleChange}
      >
        {state.provices.length > 0 &&
          state.provices.map((p) => (
            <MenuItem value={p.province_id} key={p.province_id}>
              {p.province_name}
            </MenuItem>
          ))}
      </SelectForm>

      <SelectForm
        value={values.distirctCode}
        error={Boolean(touched.distirctCode && errors.distirctCode)}
        helperText={touched.distirctCode && errors.distirctCode}
        label="Quận, huyện"
        name="distirctCode"
        onChange={handleChange}
      >
        {state.districts.length > 0 &&
          state.districts.map((p) => (
            <MenuItem value={p.district_id} key={p.district_id}>
              {p.district_name}
            </MenuItem>
          ))}
      </SelectForm>

      <SelectForm
        value={values.wardCode}
        error={Boolean(touched.wardCode && errors.wardCode)}
        helperText={touched.wardCode && errors.wardCode}
        label="Xã, phường"
        name="wardCode"
        onChange={handleChange}
      >
        {state.wards.length > 0 &&
          state.wards.map((p) => (
            <MenuItem value={p.ward_id} key={p.ward_id}>
              {p.ward_name}
            </MenuItem>
          ))}
      </SelectForm>

      <TextField
        fullWidth
        label="Địa chỉ chi tiết"
        multiline
        rows={2}
        margin="normal"
        {...getFieldProps("hotel_address")}
        error={Boolean(touched.hotel_address && errors.hotel_address)}
        helperText={touched.hotel_address && errors.hotel_address}
      />
    </>
  );
}

Provice.propTypes = {
  touched: PropTypes.any,
  errors: PropTypes.any,
  values: PropTypes.any,
  getFieldProps: PropTypes.func,
  setFieldValue: PropTypes.func,
};

export default memo(Provice);
