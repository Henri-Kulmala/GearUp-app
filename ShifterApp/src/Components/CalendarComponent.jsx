import PropTypes from 'prop-types';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function CalendarComponent({ startDate, setStartDate }) {
    return (
      <DatePicker 
        selected={startDate} 
        onChange={(date) => setStartDate(date)} 
        dateFormat="dd-MM-yyyy"
      />
    );
}

CalendarComponent.propTypes = {
    startDate: PropTypes.instanceOf(Date),
    setStartDate: PropTypes.func.isRequired,
};

export default CalendarComponent;
