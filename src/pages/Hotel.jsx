import React from "react";
import PropTypes from "prop-types";
import Page from "~/components/Page";
import { Footer, Header, MailList, NavBar } from "~/components/home";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ListImage from "~/components/hotels/ListImage";

function Hotel(props) {
  return (
    <Page>
      <NavBar />
      <Header />

      <Container maxWidth="lg" sx={{ mt: 2 }}>
        <Stack>
          <Typography variant="h4">Tower Street Apartments</Typography>

          <Stack direction="row" spacing={2} mt={1}>
            <LocationOnIcon fontSize="10" color="primary" />
            <Typography fontSize={14}>
              116 Hung Vuong, Thanh Ha, Cẩm Phô, Hội An, Việt Nam
            </Typography>
          </Stack>

          <Typography fontWeight={500} mt={1}>
            Vị trí xuất sắc, cách trung tâm 500m
          </Typography>
        </Stack>

        <ListImage />

        <Stack
          justifyContent="space-between"
          direction={{ md: "row", xs: "column" }}
          width="100%"
          mt={3}
          spacing={2}
        >
          <Box
            sx={{
              flexBasis: { md: "66.66667%", xs: "100%" },
              width: { md: "66.66667%", xs: "100%" },
              maxWidth: { md: "66.66667%", xs: "100%" },
            }}
          >
            <Typography fontSize={14} textAlign="justify">
              Located a 5-minute walk from St. Florian's Gate in Krakow, Tower
              Street Apartments has accommodations with air conditioning and
              free WiFi. The units come with hardwood floors and feature a fully
              equipped kitchenette with a microwave, a flat-screen TV, and a
              private bathroom with shower and a hairdryer. A fridge is also
              offered, as well as an electric tea pot and a coffee machine.
              Popular points of interest near the apartment include Cloth Hall,
              Main Market Square and Town Hall Tower. The nearest airport is
              John Paul II International Kraków–Balice, 16.1 km from Tower
              Street Apartments, and the property offers a paid airport shuttle
              service.
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
                  Nằm tại khu vực được đánh giá cao nhất ở Hội An, khách sạn này
                  có điểm vị trí xuất sắc 9,3
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
      </Container>

      <MailList />
      <Footer />
    </Page>
  );
}

Hotel.propTypes = {};

export default Hotel;
