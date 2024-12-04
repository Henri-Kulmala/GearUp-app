import { useEffect, useState } from "react";
import api from "./ApiConfig";

function EmployeeHandler() {
  const [employees, setEmployees] = useState([]);


  useEffect(() => {
    const fetchEmployees = async () => {
      try {

        const response = await api.get(`/api/employees`);
        console.log("API Response:", response.data); 
        const fetchedEmployees = response.data.map((employee) => ({
          employeeId: employee.employeeId,
          employeeFullName: employee.fullName,
          employeeQualification: employee.qualification,
        }));
        console.log("Mapped Employees:", fetchedEmployees); 
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
