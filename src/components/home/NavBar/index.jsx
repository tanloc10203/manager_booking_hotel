import { Container, Link } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import { Link as RouterLink } from "react-router-dom";

const WrapperStyle = styled(AppBar)(({ theme }) => ({
  [theme.breakpoints.down(400)]: {
    padding: 0,

    "&>div>div>button": {
      // padding:
      fontSize: 12,
      opacity: 0.7,
    },
  },
}));

export default function NavBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <WrapperStyle position="static" sx={{ background: "#003580" }}>
        <Container maxWidth="lg">
          <Toolbar>
            <Typography
              variant="h4"
              component="div"
              fontWeight={700}
              sx={{ flexGrow: 1 }}
            >
              Endcool.booking
            </Typography>

            <Link
              component={RouterLink}
              to="/sign-in"
              sx={{ color: "inherit", textDecoration: "none" }}
            >
              <Button color="inherit" sx={{ mr: 1 }}>
                Đăng nhập
              </Button>
            </Link>
            <Link
              component={RouterLink}
              to="/sign-up"
              sx={{ color: "inherit", textDecoration: "none" }}
            >
              <Button color="inherit" sx={{ mr: 1 }}>
                Đăng ký
              </Button>
            </Link>
          </Toolbar>
        </Container>
      </WrapperStyle>
    </Box>
  );
}
