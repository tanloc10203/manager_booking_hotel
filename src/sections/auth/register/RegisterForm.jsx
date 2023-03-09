import { Form, FormikProvider, useFormik } from "formik";
import { useState } from "react";
// material
import { LoadingButton } from "@mui/lab";
import { IconButton, InputAdornment, Stack, TextField } from "@mui/material";
// component
import { useDispatch, useSelector } from "react-redux";
import { appActions } from "~/features/app/appSlice";
import { authActions, authState } from "~/features/authentication/authSlice";
import { RegisterSchema } from "~/utils";
import Iconify from "../../../components/Iconify";

// ----------------------------------------------------------------------

export default function RegisterForm() {
  const { isLoading } = useSelector(authState);

  // console.log(isLoading);

  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phone: "",
      username: "",
    },
    validationSchema: RegisterSchema,
    onSubmit: (values) => {
      return new Promise((resolve, reject) => {
        const newData = {
          first_name: values.firstName,
          last_name: values.lastName,
          email: values.email,
          password: values.password,
          phone: values.phone,
          username: values.username,
        };
        dispatch(appActions.setOpenOverlay(true));

        setTimeout(() => {
          dispatch(authActions.signUpStart(newData));
          resolve(true);
        }, 1000);
      });
    },
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              fullWidth
              label="Họ"
              {...getFieldProps("firstName")}
              error={Boolean(touched.firstName && errors.firstName)}
              helperText={touched.firstName && errors.firstName}
            />

            <TextField
              fullWidth
              label="Tên"
              {...getFieldProps("lastName")}
              error={Boolean(touched.lastName && errors.lastName)}
              helperText={touched.lastName && errors.lastName}
            />
          </Stack>

          <TextField
            fullWidth
            autoComplete="email"
            type="email"
            label="Địa chỉ E-mail"
            {...getFieldProps("email")}
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
          />

          <TextField
            fullWidth
            autoComplete="phone"
            type="phone"
            label="Số điện thoại"
            {...getFieldProps("phone")}
            error={Boolean(touched.phone && errors.phone)}
            helperText={touched.phone && errors.phone}
          />

          <TextField
            fullWidth
            autoComplete="username"
            type="text"
            label="Tài khoản"
            {...getFieldProps("username")}
            error={Boolean(touched.username && errors.username)}
            helperText={touched.username && errors.username}
          />

          <TextField
            fullWidth
            autoComplete="current-password"
            type={showPassword ? "text" : "password"}
            label="Mật khẩu"
            {...getFieldProps("password")}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    <Iconify
                      icon={showPassword ? "eva:eye-fill" : "eva:eye-off-fill"}
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isLoading}
          >
            Đăng ký
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
