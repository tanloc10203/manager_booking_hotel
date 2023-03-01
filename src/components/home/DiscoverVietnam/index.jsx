import { Box, Grid, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import LazyLoadImage from "../../LazyLoadImage";

function DiscoverVietnam(props) {
  return (
    <Box mt={5}>
      <Typography variant="h4">Khám phá Việt Nam</Typography>
      <Typography variant="body2">
        Các điểm đến phổ biến này có nhiều điều chờ đón bạn
      </Typography>

      <Grid container mt={3} spacing={1}>
        {itemData.map((item, index) => (
          <Grid item xs={6} md={2} key={index}>
            <LazyLoadImage
              src={item.img}
              alt={item.title}
              component={Link}
              to="#"
              sx={{
                borderRadius: "4px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography fontWeight={700} mt={1}>
                Vũng Tàu
              </Typography>
              <Typography variant="caption">1.825 chỗ nghỉ</Typography>
            </LazyLoadImage>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

const itemData = [
  {
    img: "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e",
    title: "Breakfast",
  },
  {
    img: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d",
    title: "Burger",
  },
  {
    img: "https://images.unsplash.com/photo-1522770179533-24471fcdba45",
    title: "Camera",
  },
  {
    img: "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e",
    title: "Breakfast",
  },
  {
    img: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d",
    title: "Burger",
  },
  {
    img: "https://images.unsplash.com/photo-1522770179533-24471fcdba45",
    title: "Camera",
  },
];

DiscoverVietnam.propTypes = {};

export default DiscoverVietnam;
