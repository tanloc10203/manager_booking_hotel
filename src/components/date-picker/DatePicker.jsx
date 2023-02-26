import { vi } from "date-fns/locale";
import { useState } from "react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file

function DatePicker(props) {
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  console.log(state);

  return (
    <DateRange
      editableDateInputs={false}
      onChange={(item) => setState([item.selection])}
      moveRangeOnFirstSelection={false}
      ranges={state}
      className="date"
      minDate={new Date()}
      locale={vi}
      scroll={{ enabled: true }}
    />
  );
}

DatePicker.propTypes = {};

export default DatePicker;
