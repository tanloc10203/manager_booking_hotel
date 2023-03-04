import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Page from "~/components/Page";
import { Footer, Header, MailList, NavBar } from "~/components/home";
import { Container } from "@mui/material";
import { useLocation } from "react-router-dom";
import ListHotelSearch from "~/components/list/ListHotelSearch";
import { useDispatch } from "react-redux";
import { hotelActions } from "~/features/hotels/hotelSlice";

function List(props) {
  const location = useLocation();
  const [destination, setDestination] = useState(location.state.destination);
  const [date, setDate] = useState(location.state.date);
  const [openDate, setOpenDate] = useState(false);
  const [options, setOptions] = useState(location.state.options);

  const dispatch = useDispatch();

  useEffect(() => {
    if (
      !location.state?.destination ||
      !location.state?.date ||
      !location.state?.options
    )
      return;

    dispatch(
      hotelActions.findHotelsStart({
        destination: location.state.destination,
        total_people:
          +location.state.options.adult + +location.state.options.children,
      })
    );
  }, [location.state]);

  const handleOption = (name, operation) => {
    setOptions((prev) => {
      return {
        ...prev,
        [name]: operation === "i" ? options[name] + 1 : options[name] - 1,
      };
    });
  };

  const handleChangeDate = (dates) => {
    setDate((pre) => [dates.selection]);
  };

  return (
    <Page title={`Khách sạn ở ${destination}`}>
      <NavBar />
      <Header />

      <ListHotelSearch
        open={openDate}
        date={date}
        options={options}
        destination={destination}
        onClickFunc={handleOption}
        onChangeDate={handleChangeDate}
      />

      <MailList />
      <Footer />
    </Page>
  );
}

List.propTypes = {};

export default List;
