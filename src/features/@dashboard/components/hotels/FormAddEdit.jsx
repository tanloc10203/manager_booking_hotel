import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { LoadingButton } from "@mui/lab";
import {
  Autocomplete,
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Form, FormikProvider, useFormik } from "formik";
import PropTypes from "prop-types";
import { useCallback, useRef, useState } from "react";
import LazyLoadImage from "~/components/LazyLoadImage";
import { getBlobImg } from "~/utils";
import Provice from "../Provice";

const ContainedImageStyle = styled(Stack)(({ theme }) => ({
  border: "1px dotted #ddd",
  padding: 10,
  borderRadius: 7,
  height: 250,
  cursor: "pointer",
  transition: "all 0.25s",
  "&:hover": {
    opacity: 0.8,
  },
}));

const DivStyle = styled("div")(({ theme }) => ({
  position: "relative",
  width: "100%",
  height: "100%",
}));

const IconDeleteStyle = styled(HighlightOffIcon)(({ theme }) => ({
  position: "absolute",
  top: 3,
  right: 3,
  fontSize: 30,
  transition: "all 0.1s",
  "&:hover": {
    opacity: 0.5,
    color: "red",
    transform: "rotate(90deg)",
  },
}));

function FormAddEdit(props) {
  const { initialValues, schema, onSubmit } = props;
  const fileRef = useRef();

  const [imgBlob, setImgBlob] = useState("");
  const [tags, setTags] = useState([]);
  const [file, setFile] = useState(null);

  const formik = useFormik({
    initialValues,
    validationSchema: schema,
    onSubmit: (values) => {
      if (!onSubmit || !file || !tags.length) return;

      const newValues = {
        ...values,
        hotel_image: file,
        tags,
      };

      onSubmit(newValues);
    },
  });

  const top100Films = [
    { title: "Bếp" },
    { title: "Nhìn ra thành phố" },
    { title: "Sân vườn" },
    { title: "Hồ bơi" },
    { title: "Tiện nghi BBQ" },
    { title: "Máy giặt" },
    { title: "Wi-Fi miễn phí" },
    { title: "Sân hiên" },
    { title: "Ban công" },
    { title: "Bồn tắm" },
  ];

  const {
    errors,
    touched,
    handleSubmit,
    values,
    isSubmitting,
    setFieldValue,
    getFieldProps,
  } = formik;

  const handleOpenInputFile = useCallback(() => {
    if (fileRef.current) {
      fileRef.current.click();
    }
  }, []);

  const handleChangeImg = useCallback(async (event) => {
    if (!event.target.files[0]) return;

    setFile(event.target.files[0]);

    const imgBlob = await getBlobImg(event.target.files[0]);

    setImgBlob((pre) => imgBlob);
  }, []);

  const handleDeleteImgBlob = () => {
    setImgBlob("");
  };

  const handleChangeTag = useCallback((event, value) => {
    setTags((prev) => [...value]);
  }, []);

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={7} md={8}>
            <Card>
              <CardContent>
                <TextField
                  fullWidth
                  label="Tên khách sạn"
                  {...getFieldProps("hotel_name")}
                  error={Boolean(touched.hotel_name && errors.hotel_name)}
                  helperText={touched.hotel_name && errors.hotel_name}
                  margin="normal"
                />

                <TextField
                  fullWidth
                  label="Giới thiệu về khách sạn"
                  multiline
                  rows={4}
                  margin="normal"
                  {...getFieldProps("hotel_desc")}
                  error={Boolean(touched.hotel_desc && errors.hotel_desc)}
                  helperText={touched.hotel_desc && errors.hotel_desc}
                />

                <Box mt={2}>
                  <Typography variant="body1" color="#212B36">
                    Ảnh tiêu đề
                  </Typography>

                  <input
                    type="file"
                    ref={fileRef}
                    hidden
                    accept="image/*"
                    onChange={handleChangeImg}
                  />

                  <ContainedImageStyle>
                    {imgBlob ? (
                      <DivStyle>
                        <LazyLoadImage
                          src={imgBlob}
                          alt=""
                          loading="lazy"
                          sx={{ borderRadius: 2 }}
                          onClick={handleOpenInputFile}
                        />
                        <IconDeleteStyle onClick={handleDeleteImgBlob} />
                      </DivStyle>
                    ) : (
                      <Stack
                        width="100%"
                        height="100%"
                        justifyContent="center"
                        alignItems="center"
                        sx={{ background: "rgba(0,0,0,0.05)" }}
                        borderRadius={1}
                        onClick={handleOpenInputFile}
                      >
                        <AddPhotoAlternateIcon
                          sx={{
                            fontSize: 100,
                            filter: "drop-shadow(2px 4px 6px #2065D1)",
                          }}
                        />
                      </Stack>
                    )}
                  </ContainedImageStyle>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={5} md={4}>
            <Card>
              <CardContent>
                <Autocomplete
                  onChange={handleChangeTag}
                  id="size-small-filled"
                  multiple
                  value={[...tags]}
                  options={top100Films}
                  getOptionLabel={(option) => option.title}
                  isOptionEqualToValue={(option, value) =>
                    option.title === value.title
                  }
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        variant="outlined"
                        label={option.title}
                        size="small"
                        {...getTagProps({ index })}
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Tags" margin="normal" />
                  )}
                />

                <Provice
                  getFieldProps={getFieldProps}
                  touched={touched}
                  errors={errors}
                  values={values}
                  setFieldValue={setFieldValue}
                />
              </CardContent>
            </Card>

            <Card sx={{ mt: 2 }}>
              <CardContent>
                <LoadingButton
                  type="submit"
                  loading={false}
                  fullWidth
                  variant="contained"
                >
                  Tạo
                </LoadingButton>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}

FormAddEdit.propTypes = {
  initialValues: PropTypes.object.isRequired,
  schema: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default FormAddEdit;
