import { Container, Box, Button } from "@mui/material";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { NavBar } from "~/components/home";
import Page from "~/components/Page";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const steps = ["Bạn chọn", "Chi tiết về bạn", "Bước cuối"];

function Booking(props) {
  const location = useLocation();
  const [active, setActive] = useState(1);

  console.log(location.state);

  return (
    <Page title="Thông tin của bạn">
      <NavBar />

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Stepper activeStep={active} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box>{active === 1 ? "Chi tiết về bạn" : "Bước cuối"}</Box>

        <Button
          variant="contained"
          sx={{ borderRadius: "2px" }}
          endIcon={<ChevronRightIcon />}
          onClick={() => setActive(2)}
        >
          Tiếp theo: Chi tiết cuối cùng
        </Button>
      </Container>
    </Page>
  );
}

Booking.propTypes = {};

export default Booking;
