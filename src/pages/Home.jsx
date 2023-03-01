import { Container } from "@mui/material";
import React from "react";
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

function Home() {
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
