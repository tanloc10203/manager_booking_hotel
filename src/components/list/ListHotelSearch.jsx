import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SearchIcon from "@mui/icons-material/Search";
import {
  Autocomplete,
  Box,
  Button,
  Container,
  Grid,
  InputAdornment,
  Pagination,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { differenceInDays, format } from "date-fns";
import vi from "date-fns/locale/vi";
import PropTypes from "prop-types";
import { memo, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { appState } from "~/features/app/appSlice";
import { hotelState } from "~/features/hotels/hotelSlice";
import { selectProvinceOptions } from "~/features/provices/proviceSlice";
import { calcPriceDiscount } from "~/utils";
import { fPrice } from "~/utils/formatNumber";
import DatePicker from "../home/date-picker/DatePicker";
import ButtonOptions from "../home/SearchList/ButtonOptions";
import LoadingInputSearch from "../home/SearchList/LoadingInputSearch";
import LazyLoadImage from "../LazyLoadImage";
import LoadingHotel from "./LoadingHotel";

const DatePickerStyle = styled(Box)(({ theme }) => ({
  position: "absolute",
  zIndex: 9999,
  top: "100%",
  left: 0,
  boxShadow: "0px 2px 16px 0px rgba(0,0,0,0.45)",
  borderRadius: 2,
}));

const PaperStyle = styled(Paper)(({ theme }) => ({
  position: "absolute",
  zIndex: 9999,
  top: "100%",
  left: 0,
  boxShadow: "0px 2px 16px 0px rgba(0,0,0,0.45)",
  borderRadius: 2,
}));

function ListHotelSearch({
  date,
  options,
  destination,
  onClickFunc,
  onChangeDate,
  onChangeDestination,
  onInputChangeDestination,
  onSearchHotel,
  defaultValue,
}) {
  const [openOptions, setOpenOptions] = useState(false);
  const [open, setOpen] = useState(false);
  const { data } = useSelector(hotelState);
  const { openOverlay: isLoading } = useSelector(appState);
  const provices = useSelector(selectProvinceOptions);
  const navigation = useNavigate();

  const optionsList = useMemo(() => {
    return [
      {
        name: "Người lớn",
        number: options.adult,
        disabled: options.adult <= 1,
        label: "adult",
      },
      {
        name: "Trẻ em",
        number: options.children,
        disabled: options.children <= 0,
        label: "children",
      },
      {
        name: "Phòng",
        number: options.room,
        disabled: options.room <= 1,
        label: "room",
      },
    ];
  }, [options]);

  const resultCountDate = useMemo(() => {
    const result = differenceInDays(date[0]?.endDate, date[0]?.startDate);
    return result === 0 ? 1 : result;
  }, [date]);

  const handleClickNaviga = (hotel) => {
    navigation(`/hotels/${hotel.slug}`, {
      state: { destination, options, date },
    });
  };

  return (
    <Container
      sx={{
        p: {
          md: 6,
          xs: 2,
        },
      }}
      maxWidth="lg"
    >
      <Grid container spacing={2}>
        {/* Search */}
        <Grid item xs={12} md={3}>
          <Paper
            sx={{ background: "#febb02", borderRadius: "2px", padding: 1.5 }}
          >
            <Typography variant="h6">Tìm</Typography>

            <Box sx={{ mt: 1 }}>
              <Typography color="#262626" fontSize={12} fontWeight={400}>
                Tên chỗ nghỉ / điểm đến
              </Typography>
              {provices?.length ? (
                <Autocomplete
                  sx={{
                    minWidth: {
                      md: 200,
                    },
                    background: "#fff",
                    borderRadius: 0,
                    "& div": { borderRadius: 0 },
                    "& input": {
                      fontSize: 14,
                    },
                    p: 1,
                  }}
                  disablePortal
                  options={provices}
                  getOptionLabel={(option) => option.province_name || ""}
                  isOptionEqualToValue={(option, value) =>
                    option.province_name === value.province_name
                  }
                  onChange={onChangeDestination}
                  inputValue={destination}
                  onInputChange={onInputChangeDestination}
                  defaultValue={defaultValue}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Bạn muốn đến đâu?"
                      variant="standard"
                      fullWidth
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon />
                          </InputAdornment>
                        ),
                      }}
                      sx={{}}
                    />
                  )}
                />
              ) : (
                <LoadingInputSearch sx={{ height: 40 }} />
              )}
            </Box>

            <Box sx={{ position: "relative" }}>
              <Box sx={{ mt: 2 }}>
                <Typography color="#262626" fontSize={12} fontWeight={400}>
                  Ngày nhận phòng
                </Typography>
                <Stack
                  direction={"row"}
                  spacing={1}
                  alignItems="center"
                  sx={{ background: "#fff", p: 1, pl: 2, cursor: "pointer" }}
                  onClick={() => setOpen((pre) => !pre)}
                >
                  <CalendarMonthIcon sx={{ fontWeight: 400 }} />

                  <Stack>
                    <Typography fontSize={14} fontWeight={400}>
                      {`${format(date[0].startDate, "E P", {
                        locale: vi,
                      })} `}
                    </Typography>
                  </Stack>
                </Stack>

                {open && (
                  <DatePickerStyle>
                    <DatePicker date={date} onChangeDate={onChangeDate} />
                  </DatePickerStyle>
                )}
              </Box>

              <Box sx={{ mt: 2 }}>
                <Typography color="#262626" fontSize={12} fontWeight={400}>
                  Ngày trả phòng
                </Typography>
                <Stack
                  direction={"row"}
                  spacing={1}
                  alignItems="center"
                  sx={{ background: "#fff", p: 1, pl: 2, cursor: "pointer" }}
                  onClick={() => setOpen((pre) => !pre)}
                >
                  <CalendarMonthIcon />

                  <Stack>
                    <Typography fontSize={14} fontWeight={400}>
                      {`${format(date[0].endDate, "E P", {
                        locale: vi,
                      })} `}
                    </Typography>
                  </Stack>
                </Stack>
              </Box>

              {open.b && (
                <DatePickerStyle>
                  <DatePicker date={date} onChangeDate={onChangeDate} />
                </DatePickerStyle>
              )}
            </Box>

            <Box sx={{ mt: 2, position: "relative" }}>
              <Typography color="#262626" fontSize={12} fontWeight={400}>
                {`Nghỉ ${resultCountDate} đêm`}
              </Typography>
              <Stack
                direction={"row"}
                spacing={1}
                sx={{ background: "#fff", p: 1, pl: 2, cursor: "pointer" }}
                onClick={() => setOpenOptions(!openOptions)}
              >
                <Typography
                  fontSize={14}
                  fontWeight={400}
                >{`${options.adult} người lớn · ${options.children} trẻ em · ${options.room} phòng`}</Typography>
              </Stack>
              {openOptions && (
                <PaperStyle>
                  {optionsList.map((i, index) => (
                    <ButtonOptions
                      key={index}
                      disabled={i.disabled}
                      name={i.name}
                      number={i.number}
                      onClickFunc={onClickFunc}
                      label={i.label}
                    />
                  ))}
                </PaperStyle>
              )}
            </Box>

            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 2, borderRadius: "2px" }}
              onClick={onSearchHotel}
            >
              Tìm
            </Button>
          </Paper>
        </Grid>

        {/*  List Hotel  */}
        <Grid item xs={12} md={9}>
          <Typography variant="h4">{`${destination}: tìm thấy ${
            data?.length || 0
          } chỗ nghỉ`}</Typography>

          {/* <LoadingHotel /> */}

          {isLoading
            ? [1, 2, 3, 4, 5].map((i) => <LoadingHotel key={i} />)
            : data.length
            ? data.map((item, index) => (
                <div key={index}>
                  <Stack width="100%" my="16px">
                    <Stack
                      sx={{
                        border: "1px solid #c6c6c6",
                        borderRadius: "2px",
                        padding: "16px",
                      }}
                      direction={{ md: "row", xs: "column" }}
                      spacing={2}
                      width="100%"
                    >
                      <LazyLoadImage
                        src={item.hotel_image}
                        sx={{
                          width: {
                            md: 200,
                            xs: "100%",
                          },
                          height: {
                            md: 200,
                            xs: "100%",
                          },
                          borderRadius: "2px",
                        }}
                      />

                      <Box flex={2}>
                        <Stack
                          justifyContent="space-between"
                          direction={{ md: "row", xs: "column" }}
                        >
                          <Typography
                            sx={{
                              transition: "all 0.25s",
                              cursor: "pointer",
                              "&:hover": {
                                color: "#000",
                              },
                            }}
                            fontWeight={700}
                            fontSize={20}
                            color="#0071c2"
                          >
                            {item.hotel_name}
                          </Typography>

                          <Stack
                            direction="row"
                            justifyContent="center"
                            alignItems="center"
                            spacing={1}
                          >
                            <Typography fontWeight={700} lineHeight="24px">
                              {+item.hotel_rating === 0
                                ? "Chưa có đánh giá"
                                : "Xuất sắc"}
                            </Typography>
                            <Box
                              sx={{
                                background: "#003580",
                                borderRadius:
                                  "calc(32px/5.5) calc(32px/5.5) calc(32px/5.5) 0",
                                height: "32px",
                                minWidth: "32px",
                                verticalAlign: "baseline",
                                width: "32px",
                                display: "flex",
                                alignItems: "center",
                                color: "#fff",
                                justifyContent: "center",
                                fontWeight: 700,
                              }}
                            >
                              {item.hotel_rating}
                            </Box>
                          </Stack>
                        </Stack>

                        <Stack
                          spacing={1}
                          direction={{ md: "row", xs: "column" }}
                        >
                          <Typography
                            fontWeight={600}
                            color="#0071c2"
                            fontSize={12}
                            sx={{ textDecoration: "underline" }}
                          >
                            {item.provice_name}
                          </Typography>
                          <Typography fontSize={12}>
                            Cách trung tâm 9km
                          </Typography>
                        </Stack>

                        <Box
                          sx={{
                            mt: 1,
                            background: "#008009",
                            display: "inline-block",
                            color: "#fff",
                            padding: "1px 4px",
                            borderRadius: "2px",
                            lineHeight: "18px",
                          }}
                        >
                          <Typography fontSize={12}>
                            Ưu Đãi Trong Thời Gian Có Hạn
                          </Typography>
                        </Box>

                        <Stack
                          mt={2}
                          justifyContent="space-between"
                          direction={{ md: "row", xs: "column" }}
                        >
                          <Box>
                            <Typography
                              textTransform="capitalize"
                              fontSize={12}
                              fontWeight={700}
                            >
                              Căn hộ nhìn ra vườn
                            </Typography>

                            <Typography
                              textTransform="capitalize"
                              fontSize={12}
                              fontWeight={400}
                              lineHeight="18px"
                              mt="1px"
                            >
                              {item.room_desc}
                            </Typography>

                            <Typography
                              textTransform="capitalize"
                              fontSize={12}
                              fontWeight={700}
                              lineHeight="18px"
                              mt="2px"
                              color="#008009"
                            >
                              Miễn Phí hủy phòng
                            </Typography>

                            <Typography
                              textTransform="capitalize"
                              fontSize={12}
                              fontWeight={400}
                              lineHeight="18px"
                              mt="2px"
                              color="#008009"
                            >
                              Bạn có thể huỷ sau, nên hãy đặt ngay hôm nay để có
                              giá tốt.
                            </Typography>
                          </Box>

                          <Box
                            textAlign={{ md: "right", xs: "left" }}
                            minWidth={150}
                          >
                            {item.discount === 1 && (
                              <Typography
                                color="#c00"
                                fontSize={12}
                                fontWeight={400}
                                sx={{ textDecoration: "line-through" }}
                              >
                                {fPrice(item.price * resultCountDate)}
                              </Typography>
                            )}

                            <Typography fontSize={20} fontWeight={700} mt="5px">
                              {item.discount === 1
                                ? fPrice(
                                    calcPriceDiscount({
                                      price: item.price,
                                      persent_discount: item.persent_discount,
                                    }) * resultCountDate
                                  )
                                : fPrice(+item.price * resultCountDate)}
                            </Typography>

                            <Typography
                              fontSize={11}
                              fontWeight={300}
                              color="gray"
                              mt="5px"
                            >
                              Đã bao gồm thuế và phí
                            </Typography>

                            <Button
                              variant="contained"
                              sx={{ borderRadius: "2px", mt: 2 }}
                              fullWidth
                              onClick={() => handleClickNaviga(item)}
                            >
                              Xem chỗ trống
                            </Button>
                          </Box>
                        </Stack>
                      </Box>
                    </Stack>
                  </Stack>

                  {/* <Pagination count={10} /> */}
                </div>
              ))
            : null}

          {/* Pagination */}
          <Pagination count={10} />
        </Grid>
      </Grid>
    </Container>
  );
}

ListHotelSearch.propTypes = {
  open: PropTypes.bool.isRequired,
  data: PropTypes.object,
  options: PropTypes.object,
  destination: PropTypes.string,
  onClickFunc: PropTypes.func,
  onChangeDate: PropTypes.func,
  onChangeDestination: PropTypes.func,
  onInputChangeDestination: PropTypes.func,
  onSearchHotel: PropTypes.func,
  defaultValue: PropTypes.string,
};

export default memo(ListHotelSearch);
