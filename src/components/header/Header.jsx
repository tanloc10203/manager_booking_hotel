import DirectionsCarFilledIcon from "@mui/icons-material/DirectionsCarFilled";
import EditLocationIcon from "@mui/icons-material/EditLocation";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import HotTubIcon from "@mui/icons-material/HotTub";
import LocalTaxiIcon from "@mui/icons-material/LocalTaxi";
import TimeToLeaveIcon from "@mui/icons-material/TimeToLeave";
import {
  Box,
  Button,
  Container,
  Stack,
  Tab,
  Tabs,
  Toolbar,
  Typography,
  tabsClasses,
} from "@mui/material";
import DatePicker from "../date-picker/DatePicker";

function Header(props) {
  const tabs = [
    { label: "Lưu trú", Icon: <LocalTaxiIcon /> },
    { label: "Chuyến bay", Icon: <FlightTakeoffIcon /> },
    { label: "Chuyến bay + Khách sạn", Icon: <HotTubIcon /> },
    { label: "Thuê xe", Icon: <DirectionsCarFilledIcon /> },
    { label: "Địa điểm tham quan", Icon: <EditLocationIcon /> },
    { label: "Taxi sân bay", Icon: <TimeToLeaveIcon /> },
  ];

  return (
    <Box sx={{ background: "#003580" }}>
      <Container maxWidth="lg">
        <Toolbar sx={{ color: "#fff" }}>
          <Tabs
            value={0}
            variant="scrollable"
            scrollButtons
            allowScrollButtonsMobile
            aria-label="visible arrows tabs example"
            sx={{
              [`& .${tabsClasses.scroller}`]: {
                "&.Mui-disabled": { opacity: 0.3 },
              },
            }}
          >
            {tabs.map((t, index) => (
              <Tab
                label={t.label}
                key={index}
                color="inherit"
                iconPosition="start"
                icon={t.Icon}
              />
            ))}
          </Tabs>
        </Toolbar>

        <Toolbar sx={{ color: "#fff", p: 8 }}>
          <Stack spacing={1}>
            <Typography variant="h2">Tìm chỗ nghỉ tiếp theo</Typography>
            <Typography variant="h4" fontWeight={500}>
              Tìm ưu đãi khách sạn, chỗ nghỉ dạng nhà và nhiều hơn nữa...
            </Typography>
          </Stack>
        </Toolbar>

        <DatePicker />
      </Container>
    </Box>
  );
}

export default Header;
