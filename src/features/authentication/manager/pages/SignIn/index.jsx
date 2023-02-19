import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import { Box, Link, Stack } from "@mui/material";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import * as yup from "yup";
import InputField from "~/components/form/FormFields/InputField";
import { authManagerState } from "../../authManagerSlice";

const schemaLogin = yup
  .object({
    username: yup.string().required("Vui lòng điền tài khoản"),
    password: yup.string().required("Vui lòng điền mật khẩu"),
  })
  .required();

function SignIn() {
  const state = useSelector(authManagerState);

  const inititalValues = {
    username: "",
    password: "",
  };

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: inititalValues,
    resolver: yupResolver(schemaLogin),
  });

  const handleOnSubmit = useCallback((values) => {
    console.log("login value:::", values);
  }, []);

  return (
    <Box
      component="form"
      autoComplete="off"
      noValidate
      onSubmit={handleSubmit(handleOnSubmit)}
    >
      <Stack spacing={3}>
        <InputField name="username" control={control} label="Tài khoản *" />

        <InputField
          name="password"
          control={control}
          label="Mật khẩu *"
          type="password"
        />
      </Stack>

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ my: 2 }}
      >
        <Link
          component={RouterLink}
          variant="subtitle2"
          to="#"
          underline="hover"
        >
          Quên mật khẩu?
        </Link>
      </Stack>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        Đăng nhập
      </LoadingButton>
    </Box>
  );
}

export default SignIn;
