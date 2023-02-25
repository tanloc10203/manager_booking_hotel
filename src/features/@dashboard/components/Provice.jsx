import { MenuItem, TextField } from "@mui/material";
import PropTypes from "prop-types";
import { memo, useCallback, useEffect, useState } from "react";
import { getDistrict, getProvince, getWard } from "~/apis";
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

    await setFieldValue(name, value);

    let nameSelect = "districts";
    let setName = "provice_name";
    let resultName = "";
    let results = [];

    if (name === "provice_code") {
      resultName = state.provices.filter((i) => i.province_id === value)[0]
        .province_name;
      const dicritcs = await getDistrict(value);
      results = [...dicritcs];
    }

    if (name === "district_code") {
      nameSelect = "wards";
      setName = "district_name";
      resultName = state.districts.filter((i) => i.district_id === value)[0]
        .district_name;
      const wards = await getWard(value);
      results = [...wards];
    }

    if (name === "ward_code") {
      setName = "ward_name";
      resultName = state.wards.filter((i) => i.ward_id === value)[0].ward_name;
    }

    if (results.length > 0) {
      setState((pre) => ({ ...pre, [nameSelect]: results }));
    }

    if (resultName) {
      await setFieldValue(setName, resultName);
    }
  });

  return (
    <>
      <SelectForm
        value={values.provice_code}
        error={Boolean(touched.provice_code && errors.provice_code)}
        helperText={touched.provice_code && errors.provice_code}
        label="Tỉnh thành"
        name="provice_code"
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
        value={values.district_code}
        error={Boolean(touched.district_code && errors.district_code)}
        helperText={touched.district_code && errors.district_code}
        label="Quận, huyện"
        name="district_code"
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
        value={values.ward_code}
        error={Boolean(touched.ward_code && errors.ward_code)}
        helperText={touched.ward_code && errors.ward_code}
        label="Xã, phường"
        name="ward_code"
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
