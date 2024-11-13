import PropTypes from "prop-types";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

function CalendarComponent({ startDate, setStartDate }) {

  const handleDateChange = (date) => {
    if (date) {
      setStartDate(date); 
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar
        value={startDate}
        onChange={handleDateChange}
        sx={{
          ".MuiPickersDay-root": {
            color: "#ededed",
            "&:hover": { backgroundColor: "#4a5761" },
            fontWeight: "400",
          },
          ".MuiPickersDay-root.Mui-disabled": {
            color: "gray",
          },
          ".MuiDayCalendar-weekDayLabel": {
            color: "#ededed",
            fontWeight: "bold",
          },
          ".MuiPickersCalendarHeader-label": {
            color: "#c5ccd1",
            fontWeight: "bold",
          },

          ".MuiPickersCalendarHeader-switchViewButton": {
            color: "#c5ccd1",
            "&:hover": {
              backgroundColor: "#4a5761",
            },
          },
      
          ".MuiPickersArrowSwitcher-button": {
            color: "#c5ccd1",
            "&:hover": {
              backgroundColor: "#4a5761",
            },
          },
        }}
      />
    </LocalizationProvider>
  );
}

CalendarComponent.propTypes = {
  startDate: PropTypes.object.isRequired,
  setStartDate: PropTypes.func.isRequired,
};

export default CalendarComponent;
