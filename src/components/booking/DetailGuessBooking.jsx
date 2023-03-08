import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import LockIcon from "@mui/icons-material/Lock";
import {
  Box,
  Button,
  Chip,
  FormControl,
  FormControlLabel,
  Grid,
  MenuItem,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { differenceInDays } from "date-fns";
import PropTypes from "prop-types";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import SelectForm from "~/features/@dashboard/components/forms/SelectForm";
import { authState } from "~/features/authentication/authSlice";
import { calcPriceDiscount } from "~/utils";
import LazyLoadImage from "../LazyLoadImage";
import BoxContent from "./BoxContent";
import BoxRating from "./BoxRating";
import BoxTime from "./BoxTime";
import StackIconAndText from "./StackIconAndText";
import TextAndPrice from "./TextAndPrice";
import times from "./time";

function DetailGuessBooking({
  active,
  onChangeActive,
  onFinished,
  date,
  rooms,
  hotel,
}) {
  const [value, setValue] = useState("");
  const { user } = useSelector(authState);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const resultCountDate = useMemo(() => {
    const result = differenceInDays(date[0]?.endDate, date[0]?.startDate);
    return result === 0 ? 1 : result;
  }, [date]);

  const total = useMemo(() => {
    return [...rooms].reduce((total, value) => {
      const priceTemp =
        value.discount === 1
          ? calcPriceDiscount({
              price: value.price * value.room_quantity,
              persent_discount: value.percent_discount,
            })
          : value.price * value.room_quantity;

      // * Thuế 10%
      const tax = priceTemp * (10 / 100);

      const price = priceTemp + tax;

      return (total += price);
    }, 0);
  }, [rooms]);

  return (
    <Grid container mt={5} spacing={3}>
      <Grid item lg={4} md={5} xs={12}>
        <BoxContent
          title="Chi tiết đặt phòng của bạn"
          sx={{ mt: 0 }}
          fontSize={14}
        >
          <Stack mt={2} direction="row" sx={{ width: "100%" }} spacing={2}>
            <BoxTime
              title="Nhận phòng"
              date={date[0]?.startDate}
              timeText="Từ 14:00"
            />
            <BoxTime
              sx={{
                position: "relative",

                "&:before": {
                  content: '""',
                  background: "#e7e7e7",
                  position: "absolute",
                  height: "100%",
                  left: "-15px",
                  top: 0,
                  width: "1px",
                },
              }}
              title="Trả phòng"
              date={date[0]?.endDate}
              timeText="Cho đến 12:00"
            />
          </Stack>

          <Stack mt={3} mb={2}>
            <Typography fontSize={14} fontWeight={500}>
              Tổng thời gian lưu trú:
            </Typography>
            <Typography fontWeight={700} fontSize={14}>
              {`${resultCountDate} đêm`}
            </Typography>
          </Stack>

          <hr style={{ borderTop: "1px solid #e7e7e7" }} />

          <Stack mt={3}>
            <Typography fontSize={14} fontWeight={500}>
              Bạn đã chọn:
            </Typography>
            {rooms.map((room, index) => (
              <TextAndPrice
                key={index}
                fontWeight={700}
                text={room.room_name}
                content={`x ${room.room_quantity} phòng`}
              />
            ))}
          </Stack>
        </BoxContent>

        <BoxContent title="Tóm tắt giá" fontSize={14}>
          {rooms.map((room, index) => (
            <Box key={index}>
              <TextAndPrice
                fontWeight={700}
                mt={2}
                text={room.room_name}
                price={
                  room.discount === 1
                    ? calcPriceDiscount({
                        price: room.price,
                        persent_discount: room.percent_discount,
                      })
                    : room.price
                }
              />
              <TextAndPrice
                text="10 % Thuế GTGT"
                price={
                  room.discount === 1
                    ? calcPriceDiscount({
                        price: room.price,
                        persent_discount: room.percent_discount,
                      }) *
                      (10 / 100)
                    : room.price * (10 / 100)
                }
              />
              <TextAndPrice
                sx={{ mb: 2 }}
                text="Số lượng phòng"
                content={`${room.room_quantity} phòng`}
              />
            </Box>
          ))}

          <hr style={{ borderTop: "1px solid #e7e7e7" }} />

          <TextAndPrice mt={2} text="Giá" price={total} />

          <TextAndPrice
            mt={2}
            text="Số đêm"
            sx={{ mb: 2 }}
            content={`x ${resultCountDate} đêm`}
          />

          <hr style={{ borderTop: "1px solid #e7e7e7" }} />

          <TextAndPrice
            fontSize={16}
            sxText={{ color: "red" }}
            mt={2}
            text="Tổng giá"
            price={total * resultCountDate}
          />
        </BoxContent>

        {active === 2 && (
          <BoxContent title="Bạn có mã khuyến mãi không?" fontSize={14}>
            <Typography mt={2}>Nhập mã khuyến mãi</Typography>
            <TextField
              fullWidth
              sx={{ "& > div": { borderRadius: "2px", background: "#fff" } }}
            />
            <Button sx={{ mt: 0.5, borderRadius: "2px" }} variant="outlined">
              Áp dụng
            </Button>
          </BoxContent>
        )}
      </Grid>
      <Grid item lg={8} md={7} xs={12}>
        <Box
          sx={{
            borderRadius: "2px",
            border: "1px solid #e7e7e7",
            color: "#262626",
            p: 2,
          }}
        >
          <Stack direction={{ md: "row", xs: "column" }} spacing={2}>
            <LazyLoadImage
              sx={{
                borderRadius: "2px",
                width: { md: "160px", xs: "100%" },
                height: { md: "160px", xs: "300px" },
              }}
              loading="lazy"
              src={hotel.hotel_image}
            />

            <Box>
              <Typography variant="h5">{hotel.hotel_name}</Typography>

              <Typography mt={2} fontSize={13}>
                {`${hotel.hotel_address}, ${hotel.ward_name}, ${hotel.district_name}, ${hotel.provice_name}`}
              </Typography>

              <Typography color="green" fontSize={13}>
                Vị trí xuất sắc - 10
              </Typography>
              {hotel.hotel_rating === 0 && (
                <Typography color="green" fontSize={13}>
                  Chưa có đánh giá
                </Typography>
              )}

              <BoxRating rate={hotel.hotel_rating} sx={{ mt: 1 }} />
            </Box>
          </Stack>
        </Box>

        {active === 1 && (
          <BoxContent title="Mách nhỏ:">
            <StackIconAndText text="Bạn có thể thanh toán trước bằng thẻ tín dụng!">
              <CreditCardIcon color="success" />
            </StackIconAndText>

            <StackIconAndText text="Hoặc bạn có thể thanh toán trong kì nghỉ của bạn">
              <CheckCircleOutlineIcon color="success" />
            </StackIconAndText>

            <StackIconAndText text="Miễn phí huỷ phòng và hoàn lại toàn bộ số tiền đã đặt.">
              <CheckCircleOutlineIcon color="success" />
            </StackIconAndText>

            <StackIconAndText text="Bạn sẽ nhận được buổi ăn sáng miễn phí">
              <CheckCircleOutlineIcon color="success" />
            </StackIconAndText>
          </BoxContent>
        )}

        <BoxContent
          sx={{ background: "#ebf3ff" }}
          title="Nhập thông tin chi tiết về bạn"
        >
          <Box>
            <Chip
              label="Gần xong rồi! Chỉ cần điền phần thông tin * bắt buộc"
              color="success"
              sx={{
                color: "#006607",
                background: "#d2edd5",
                borderRadius: "4px",
                mt: 1,
              }}
            />
          </Box>

          <Grid container width="100%" spacing={2}>
            <Grid item lg={6} md={6} xs={12}>
              <TextField
                fullWidth
                label="Họ (*)"
                // value={user.last_name || ""}
                margin="normal"
                sx={{ "& > div": { borderRadius: "2px", background: "#fff" } }}
              />
            </Grid>
            <Grid item lg={6} md={6} xs={12}>
              <TextField
                fullWidth
                label="Tên (*)"
                margin="normal"
                sx={{ "& > div": { borderRadius: "2px", background: "#fff" } }}
              />
            </Grid>

            <Grid item lg={6} md={6} xs={12}>
              <TextField
                fullWidth
                label="Địa chỉ email (*)"
                sx={{ "& > div": { borderRadius: "2px", background: "#fff" } }}
              />
              <Typography fontSize={12} mt={1}>
                Email xác nhận đặt phòng sẽ được gửi đến địa chỉ này
              </Typography>
            </Grid>

            <Grid item lg={6} md={6} xs={12}>
              <TextField
                fullWidth
                label="Số điện thoại (*)"
                sx={{ "& > div": { borderRadius: "2px", background: "#fff" } }}
              />
            </Grid>
          </Grid>
        </BoxContent>

        {active === 2 && (
          <BoxContent
            sx={{ background: "#ebf3ff" }}
            title="Chọn hình thức thanh toán"
          >
            <Box mt={2}>
              <FormControl>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  defaultValue="female"
                  name="radio-buttons-group"
                  value={value}
                  onChange={handleChange}
                >
                  <FormControlLabel
                    value="MoMo"
                    control={<Radio />}
                    label="Thanh toán bằng MOMO"
                  />
                  <FormControlLabel
                    value="vn_pay"
                    control={<Radio />}
                    label="Thanh toán bằng VNPay"
                  />
                  <FormControlLabel
                    value="other"
                    control={<Radio />}
                    label="Thanh toán trong kỉ nghỉ"
                  />
                </RadioGroup>
              </FormControl>
            </Box>
          </BoxContent>
        )}

        {active === 1 && (
          <>
            <BoxContent
              sx={{ background: "#ebf3ff" }}
              title="Các yêu cầu đặc biệt"
            >
              <Typography mt={2} fontSize={13}>
                Các yêu cầu đặc biệt không đảm bảo sẽ được đáp ứng – tuy nhiên,
                chỗ nghỉ sẽ cố gắng hết sức để thực hiện. Bạn luôn có thể gửi
                yêu cầu đặc biệt sau khi hoàn tất đặt phòng của mình!
              </Typography>
              <TextField
                fullWidth
                label="Vui lòng ghi yêu cầu của bạn tại đây. (không bắt buộc)"
                multiline
                rows={4}
                margin="normal"
                sx={{ "& > div": { borderRadius: "2px", background: "#fff" } }}
              />
            </BoxContent>

            <BoxContent
              sx={{ background: "#ebf3ff" }}
              title="Thời gian đến của bạn"
            >
              <StackIconAndText text="Bạn có thể nhận chỗ nghỉ lúc 14:00">
                <CheckCircleOutlineIcon color="success" />
              </StackIconAndText>

              <Stack mt={2} direction="row" spacing={0.5}>
                <Typography fontSize={14} fontWeight={700}>
                  Thêm thời gian đến dự kiến của bạn
                </Typography>
                <Typography fontSize={14}>(không bắt buộc)</Typography>
              </Stack>

              <SelectForm
                label="Thời gian đến dự kiên"
                error={false}
                helperText=""
                value={""}
                sx={{
                  width: {
                    md: "50%",
                    xs: "100%",
                  },
                  "& div ": { borderRadius: "2px" },
                }}
              >
                {times.map((item, index) => (
                  <MenuItem value={item.value + ""} key={index}>
                    {item.title}
                  </MenuItem>
                ))}
              </SelectForm>
              <Typography fontSize={14} fontWeight={500}>
                Thời gian theo múi giờ của Vũng Tàu
              </Typography>
            </BoxContent>
          </>
        )}

        <Stack mt={3} alignItems="flex-end">
          {active === 1 ? (
            <Button
              variant="contained"
              sx={{ borderRadius: "2px" }}
              endIcon={<ChevronRightIcon />}
              onClick={onChangeActive}
            >
              Tiếp theo: Chi tiết cuối cùng
            </Button>
          ) : (
            <Button
              variant="contained"
              sx={{ borderRadius: "2px" }}
              startIcon={<LockIcon />}
              onClick={onFinished}
            >
              Hoàn tất đặt chỗ
            </Button>
          )}
        </Stack>
      </Grid>
    </Grid>
  );
}

DetailGuessBooking.propTypes = {
  active: PropTypes.number.isRequired,
  onChangeActive: PropTypes.func,
  onFinished: PropTypes.func,
  date: PropTypes.any,
  hotel: PropTypes.object,
  rooms: PropTypes.array,
};

export default DetailGuessBooking;
