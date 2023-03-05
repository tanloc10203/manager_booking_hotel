import _ from "lodash";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { Footer, Header, MailList, NavBar } from "~/components/home";
import ListHotelSearch from "~/components/list/ListHotelSearch";
import Page from "~/components/Page";
import { appActions } from "~/features/app/appSlice";
import { hotelActions } from "~/features/hotels/hotelSlice";
import { proviceActions } from "~/features/provices/proviceSlice";

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

    dispatch(appActions.setOpenOverlay(true));

    const timer = setTimeout(() => {
      dispatch(
        hotelActions.findHotelsStart({
          destination: location.state.destination,
          total_people:
            +location.state.options.adult + +location.state.options.children,
        })
      );
    }, 500);

    return () => clearTimeout(timer);
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

  useEffect(() => {
    dispatch(proviceActions.getProvicesStart());
  }, []);

  const handleChangeDestination = (event, value) => {
    if (!value) {
      setDestination("");
      return;
    }
    setDestination(value.province_name);
  };

  const handleOnInputChangeDestination = useCallback((event, value, reason) => {
    if (reason === "reset") return;

    setDestination(value);
  }, []);

  const handleSearchHotel = useCallback(() => {
    if (!destination || !date || _.isEmpty(options)) return;

    dispatch(appActions.setOpenOverlay(true));

    setTimeout(() => {
      dispatch(
        hotelActions.findHotelsStart({
          destination: destination,
          total_people: +options.adult + +options.children,
        })
      );
    }, 500);
  }, [destination, date, options]);

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
        onChangeDestination={handleChangeDestination}
        onSearchHotel={handleSearchHotel}
        onInputChangeDestination={handleOnInputChangeDestination}
        defaultValue={location.state.destination}
      />

      <MailList />
      <Footer />
    </Page>
  );
}

List.propTypes = {};

export default List;
