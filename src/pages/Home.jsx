import { Container } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  Header,
  NavBar,
  PropertyList,
  SearchList,
  DiscoverVietnam,
  HomeStayList,
  Footer,
  MailList,
} from "~/components/home";
import Page from "~/components/Page";
import { hotelActions } from "~/features/hotels/hotelSlice";

function Home() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(hotelActions.countAreaStart());
  }, []);

  return (
    <Page title="Trang chủ">
      <NavBar />
      <Header />
      <SearchList />

      <Container sx={{ p: 6, mt: 10 }} maxWidth="lg">
        <PropertyList />
        <DiscoverVietnam />
        <HomeStayList />
      </Container>

      <MailList />
      <Footer />
    </Page>
  );
}

export default Home;
