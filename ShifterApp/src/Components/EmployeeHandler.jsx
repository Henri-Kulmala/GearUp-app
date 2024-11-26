import { useEffect, useState } from "react";
import axios from "axios";

function EmployeeHandler() {
  const [employees, setEmployees] = useState([]);

  const getCsrfToken = () => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; XSRF-TOKEN=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const csrfToken = getCsrfToken();
        const response = await axios.get(`http://localhost:8080/api/employees`, {
          withCredentials: true,
          headers: { "X-XSRF-TOKEN": csrfToken },
          auth: { username: "admin", password: "admin" },
        });
        console.log("API Response:", response.data); // Debug API response
        const fetchedEmployees = response.data.map((employee) => ({
          employeeId: employee.employeeId,
          employeeFullName: employee.fullName,
          employeeQualification: employee.qualification,
        }));
        console.log("Mapped Employees:", fetchedEmployees); // Debug mapped data
        setEmployees(fetchedEmployees);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, []);

  return employees;
}

export default EmployeeHandler;
