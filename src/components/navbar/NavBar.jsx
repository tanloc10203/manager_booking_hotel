import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { Container } from "@mui/material";

export default function NavBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ background: "#003580" }}>
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

            <Button variant="contained" color="inherit" sx={{ mr: 1 }}>
              Đăng nhập
            </Button>
            <Button variant="contained" color="inherit">
              Đăng ký
            </Button>
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
}
