import React, { useEffect } from "react";
import PropTypes from "prop-types";
import Page from "~/components/Page";
import { Footer, Header, MailList, NavBar } from "~/components/home";
import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ListImage from "~/components/hotels/ListImage";
import { fPrice } from "~/utils/formatNumber";
import { useDispatch, useSelector } from "react-redux";
import { hotelActions, hotelSelect } from "~/features/hotels/hotelSlice";
import { useParams } from "react-router-dom";
import { appActions, appState } from "~/features/app/appSlice";
import LoadingHotelDetail from "~/components/hotels/LoadingHotelDetail";
import { caclPriceDiscounct } from "~/utils";

function Hotel(props) {
  const { data, rooms, images } = useSelector(hotelSelect);
  const { openOverlay: loading } = useSelector(appState);
  const { hotelSlug } = useParams();
  const dispach = useDispatch();

  console.log(hotelSlug);

  useEffect(() => {
    if (!hotelSlug) return;

    dispach(appActions.setOpenOverlay(true));

    const timer = setTimeout(() => {
      dispach(hotelActions.getHotelBySlugStart(hotelSlug));
    }, 500);

    return () => clearTimeout(timer);
  }, [hotelSlug]);

  return (
    <Page title={data.hotel_name}>
      <NavBar />
      <Header />

      {loading ? (
        <LoadingHotelDetail />
      ) : (
        <Container maxWidth="lg" sx={{ mt: 2, mb: 5 }}>
          <Stack>
            <Typography variant="h4">{data.hotel_name || ""}</Typography>

            <Stack direction="row" spacing={2} mt={1}>
              <LocationOnIcon fontSize="10" color="primary" />
              <Typography
                fontSize={14}
              >{`${data.hotel_address}, ${data.ward_name}, ${data.district_name}, ${data.provice_name}`}</Typography>
            </Stack>

            <Typography fontWeight={500} mt={1}>
              Vị trí xuất sắc, cách trung tâm 500m
            </Typography>
          </Stack>

          {!rooms.length ? (
            <Typography
              color="red"
              sx={{ mt: 2 }}
              fontSize={18}
              fontWeight={700}
            >
              Khách sạn này chưa có thông tin về phòng
            </Typography>
          ) : (
            <>
              {images?.length && <ListImage data={images} />}

              <Stack
                justifyContent="space-between"
                direction={{ md: "row", xs: "column" }}
                width="100%"
                mt={3}
                spacing={2}
                mb={4}
              >
                <Box
                  sx={{
                    flexBasis: { md: "66.66667%", xs: "100%" },
                    width: { md: "66.66667%", xs: "100%" },
                    maxWidth: { md: "66.66667%", xs: "100%" },
                  }}
                >
                  <Typography fontSize={14} textAlign="justify">
                    {data.hotel_desc || ""}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    flexBasis: { md: "33.33333%", xs: "100%" },
                    width: { md: "33.33333%", xs: "100%" },
                    maxWidth: { md: "33.33333%", xs: "100%" },
                    marginLeft: "auto",
                  }}
                >
                  <Box
                    sx={{
                      marginLeft: "auto",
                      width: { md: "80%", xs: "100%" },
                      background: "#e4f4ff",
                      padding: "24px 12px 0 12px",
                    }}
                  >
                    <Typography fontSize={16} fontWeight={700}>
                      Điểm nổi bật của chỗ nghỉ
                    </Typography>

                    <Typography mt={2} fontSize={16} fontWeight={700}>
                      Hoàn hảo cho kỳ nghỉ 1 đêm!
                    </Typography>

                    <Stack direction="row" mt={2}>
                      <LocationOnIcon fontSize="20" color="primary" />
                      <Typography fontSize={14}>
                        Nằm tại khu vực được đánh giá cao nhất ở Hội An, khách
                        sạn này có điểm vị trí xuất sắc 9,3
                      </Typography>
                    </Stack>

                    <Typography mt={2} fontSize={16} fontWeight={700}>
                      Thông tin về bửa sáng
                    </Typography>

                    <Typography mt={2} fontSize={14} fontWeight={500}>
                      Tự chọn
                    </Typography>

                    <Button
                      fullWidth
                      variant="contained"
                      sx={{ mt: 2, borderRadius: "2px", mb: 3 }}
                    >
                      Đặt ngay
                    </Button>
                  </Box>
                </Box>
              </Stack>

              <hr style={{ borderTop: "1px solid #e7e7e7" }} />

              <Box mt={4}>
                <Typography variant="h4">Phòng trống</Typography>

                <Grid container mt={4} spacing={1}>
                  {rooms?.length &&
                    rooms.map((room, index) => (
                      <Grid key={index} item lg={3} md={4} xs={12}>
                        <Paper
                          sx={{
                            boxShadow: "0 0 9px 1px rgba(0,0,0,0.2)",
                            p: 2,
                            borderRadius: "2px",
                            "&:hover": {
                              boxShadow: "0 0 9px 1px #4c76b2",
                            },
                          }}
                        >
                          <Typography
                            color="#4c76b2"
                            fontWeight={700}
                            fontSize={18}
                          >
                            {room.room_name}
                          </Typography>

                          <Typography mt={3} mb={2}>
                            {room.room_desc}
                          </Typography>

                          <Typography>{room.rt_desc}</Typography>

                          <Stack direction="row" spacing={1} mt={2} mb={2}>
                            <Typography fontWeight={600}>
                              Phù hợp cho:{" "}
                            </Typography>
                            <Typography
                              fontWeight={700}
                            >{`${room.max_people} người`}</Typography>
                          </Stack>

                          <hr style={{ borderTop: "1px solid #e7e7e7" }} />

                          <Stack direction="row" spacing={1} mt={2}>
                            <Typography fontWeight={600}>
                              Giá hôm nay:{" "}
                            </Typography>
                            <Typography fontWeight={700}>
                              {room.discount === 1
                                ? fPrice(
                                    caclPriceDiscounct({
                                      price: room.price,
                                      persent_discount: room.percent_discount,
                                    })
                                  )
                                : fPrice(room.price)}
                            </Typography>
                          </Stack>

                          <Stack direction="row" spacing={1}>
                            {room.discount === 1 && (
                              <Typography
                                fontSize={15}
                                sx={{
                                  textDecoration: "line-through",
                                  fontStyle: "italic",
                                }}
                                fontWeight={700}
                                color="red"
                              >
                                {fPrice(room.price)}
                              </Typography>
                            )}

                            {room.discount === 1 && (
                              <Typography
                                sx={{
                                  fontStyle: "italic",
                                }}
                                fontWeight={700}
                                color="green"
                              >{`Tiết kiệm ${room.percent_discount}%`}</Typography>
                            )}
                          </Stack>

                          <Stack
                            direction="row"
                            spacing={1}
                            mt={2}
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Typography
                              fontSize={14}
                              fontStyle="italic"
                              color="red"
                              fontWeight={500}
                            >
                              {`Chỉ còn lại ${
                                room.room_quantity - room.room_booking
                              } phòng`}
                            </Typography>

                            <Typography
                              fontSize={14}
                              fontStyle="italic"
                              color="green"
                              fontWeight={700}
                            >
                              Miễn phí huỷ
                            </Typography>
                          </Stack>

                          <FormControl fullWidth margin="normal" size="small">
                            <InputLabel id="demo-simple-select-label">
                              Số lượng phòng
                            </InputLabel>
                            <Select
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              label="Số lượng phòng"
                            >
                              {[
                                ...Array(
                                  room.room_quantity - room.room_booking
                                ),
                              ].map((i, index) => (
                                <MenuItem value={10} key={index}>
                                  <Stack direction="row" spacing={1}>
                                    <Typography>{`${
                                      index + 1
                                    } phòng.`}</Typography>
                                    <Typography>
                                      (
                                      {room.discount === 1
                                        ? fPrice(
                                            caclPriceDiscounct({
                                              price: room.price,
                                              persent_discount:
                                                room.percent_discount,
                                            }) *
                                              (index + 1)
                                          )
                                        : fPrice(room.price * (index + 1))}
                                      )
                                    </Typography>
                                  </Stack>
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>

                          <Button variant="contained" sx={{ mt: 2 }} fullWidth>
                            Đặt phòng ngay
                          </Button>
                        </Paper>
                      </Grid>
                    ))}
                </Grid>
              </Box>
            </>
          )}
        </Container>
      )}
      <MailList />
      <Footer />
    </Page>
  );
}

Hotel.propTypes = {};

export default Hotel;
