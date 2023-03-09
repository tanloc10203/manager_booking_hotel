import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { format } from "date-fns";
import Page from "~/components/Page";
import TextTrucate from "~/components/TextTrucate";
import vi from "date-fns/locale/vi";
import { fPrice } from "~/utils/formatNumber";
import { Link } from "react-router-dom";

function VNPayReturn(props) {
  return (
    <Page title="Thanh toán thành công">
      <Box>
        <Container maxWidth="lg">
          <Box
            sx={{
              height: "100vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Paper
              elevation={24}
              sx={{
                borderRadius: "2px",
                minWidth: 300,
                minHeight: 300,
                transition: "all .25s ease",
                "&:hover": {
                  boxShadow:
                    "rgb(0 0 0 / 20%) 0px 4px 5px 0px, rgb(0 0 0 / 12%) 0px 3px 14px 3px, rgb(0 0 0 / 14%) 0px 8px 10px 1px",
                },
              }}
            >
              <Stack
                justifyContent="center"
                alignItems="center"
                sx={{
                  background: "linear-gradient(to right, #249ee8 , #127cde);",
                  p: 2,
                  color: "#fff",
                }}
              >
                <CheckCircleIcon
                  fontSize="large"
                  sx={{ width: 100, color: "#19c790", height: 100 }}
                />
                <Typography mt={2} variant="h3">
                  Đặt phòng thành công
                </Typography>
                <Typography mt={2}>Chúc bạn có một kì nghỉ vui vẻ</Typography>
              </Stack>
              <Stack sx={{ p: 2 }}>
                <Stack
                  justifyContent="space-between"
                  direction={{ md: "row", xs: "column" }}
                >
                  <Typography>Khách hàng: </Typography>
                  <TextTrucate
                    text="Phan Tấn Lộc"
                    sx={{ fontWeight: 700, fontStyle: "italic" }}
                  />
                </Stack>

                <Stack
                  mt={1.5}
                  justifyContent="space-between"
                  direction={{ md: "row", xs: "column" }}
                >
                  <Typography>Khách sạn: </Typography>
                  <Tooltip
                    arrow
                    title="Maison Vui Homestay, Maison Vui Homestay, Maison Vui Homestay, Maison Vui Homestay"
                  >
                    <div>
                      <TextTrucate
                        text="Maison Vui Homestay, Maison Vui Homestay, Maison Vui Homestay, Maison Vui Homestay"
                        sx={{ fontWeight: 700 }}
                      />
                    </div>
                  </Tooltip>
                </Stack>

                <Stack
                  mt={1.5}
                  justifyContent="space-between"
                  direction={{ md: "row", xs: "column" }}
                >
                  <Typography>Số phòng đã đặt: </Typography>
                  <TextTrucate text="1 phòng" sx={{ fontWeight: 700 }} />
                </Stack>

                <Stack
                  mt={1.5}
                  justifyContent="space-between"
                  direction={{ md: "row", xs: "column" }}
                >
                  <Typography>Ngày nhận phòng: </Typography>
                  <TextTrucate
                    text={`${format(new Date(), "E P", {
                      locale: vi,
                    })} `}
                    sx={{ fontWeight: 700 }}
                  />
                </Stack>

                <Stack
                  mt={1.5}
                  justifyContent="space-between"
                  direction={{ md: "row", xs: "column" }}
                >
                  <Typography>Ngày trả phòng: </Typography>
                  <TextTrucate
                    text={`${format(new Date(), "E P", {
                      locale: vi,
                    })} `}
                    sx={{ fontWeight: 700 }}
                  />
                </Stack>

                <Stack
                  mt={1.5}
                  justifyContent="space-between"
                  direction={{ md: "row", xs: "column" }}
                >
                  <Typography>Tổng giá: </Typography>
                  <TextTrucate text={fPrice(400000)} sx={{ fontWeight: 700 }} />
                </Stack>

                <Typography mt={1.5} fontStyle="italic" color="error">
                  * Vui lòng kiểm tra email để xem chi tiết hoá đơn
                </Typography>
              </Stack>

              <Stack justifyContent="center" alignItems="center" mb={2}>
                <Button
                  component={Link}
                  to="/"
                  sx={{ borderRadius: "2px" }}
                  variant="outlined"
                >
                  Trở về trang chủ
                </Button>
              </Stack>
            </Paper>
          </Box>
        </Container>
      </Box>
    </Page>
  );
}

VNPayReturn.propTypes = {};

export default VNPayReturn;
