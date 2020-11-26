/// Creating a global employee payroll list-array which will contain objects read from local storage
let empPayrollList = [];
// Adding a Document Object Model content loader with add event listener
window.addEventListener("DOMContentLoaded", (event) => {
  /// Calling the get employee payroll data from storage method to populate the empPayrollList
  empPayrollList = getEmployeePayrollDataFromStorage();
  /// Selecting the emp-count class element to update the previously used static count of elements
  var element = document.querySelector(".emp-count");
  if (element) {
    element.textContent = empPayrollList.length;
  }
  /// Calling the inner HTML method to initialise a header template and then bind it with the table
  createInnerHtml();
  /// Removing data from the emp edit
  localStorage.removeItem("editEmp");
});
/// UC4 -- Using the template literal feature of ES6
const createInnerHtml = () => {
  /// If the employee payroll list is empty i.e. no data stored in the local storage then return from the method
  if (empPayrollList.length == 0) return;
  /// Defining the common header html tags for the table to be displayed at the page
  const headerHtml =
    "<th></th><th>Name</th><th>Gender</th><th>Department</th><th>Salary</th><th>Start Date</th><th>Actions</th>";
  /// Defining the inner html tag in which all the elements will be appended to populate the table
  let innerHtml = `${headerHtml}`;
  /// Iterating over the list of elements in employee payroll list
  /// Continuously appending each row structure of html page to the innerHtml tag using placeholder, template literals
  for (const empPayrollData of empPayrollList) {
    innerHtml = `${innerHtml}
    <tr>
          <td><img class="profile" alt="" src="${
            empPayrollData._profilePic
          }"></td>
          <td>${empPayrollData._name}</td>
          <td>${empPayrollData._gender}</td>
          <td>${getDeptHtml(empPayrollData._department)}
          </td>
          <td>${empPayrollData._salary}</td>
          <td>${stringifyDate(empPayrollData._startDate)}</td>
          <td><img id="${
            empPayrollData._id
          }" onclick= "remove(this)" alt="delete" src="../assets/icons/delete-black-18dp.svg">
            <img id="${
              empPayrollData._id
            }" onclick= "update(this)" alt="edit" src="../assets/icons/create-black-18dp.svg"></td>
    </tr>`;
  }
  /// Manipulating the inner Html content of the table display with the assigned value
  /// Still the page is static and has to be made dynamic in subsequent stages
  document.querySelector("#table-display").innerHTML = innerHtml;
};
/// Arrow function to iterate over all the data in the local storage as json object
/// Get item is used to fetch value in the employee payroll list using their keys
/// JSON.parse converts the data to the employee payroll class object from the JSON string
const getEmployeePayrollDataFromStorage = () => {
  return localStorage.getItem("EmployeePayrollList")
    ? JSON.parse(localStorage.getItem("EmployeePayrollList"))
    : [];
};
/// Creating a JSON Object for fetching data from the server
/// Default json file for test of the home page in early use cases
const createEmployeePayrollJSON = () => {
  let empPayrollListLocal = [
    {
      _name: "Praveen",
      _gender: "male",
      _department: ["Finance", "Engineer"],
      _salary: "477600",
      _startDate: "14 November 2020",
      _note: "",
      _profilePic: "../assets/profile-images/Ellipse -2.png",
    },
    {
      _name: "Divya",
      _gender: "female",
      _department: ["HR", "Sales"],
      _salary: "422700",
      _startDate: "19 November 2019",
      _note: "",
      _profilePic: "../assets/profile-images/Ellipse -1.png",
    },
  ];
  /// Returning the employee payroll JSON list of objects to the caller
  return empPayrollListLocal;
};
/// Method that defines the feed of multiple department to the employee payroll home page
const getDeptHtml = (deptList) => {
  let deptHtml = "";
  for (const dept of deptList) {
    deptHtml = `${deptHtml}<div class="dept-label">${dept}</div>`;
  }
  return deptHtml;
};

/// UC1 -- Remove the employee data from the local storage
const remove = (node) => {
  /// Finding whether the data is present in the employee payroll list or not
  let empPayrollData = empPayrollList.find(
    (empData) => (empData._id = node.id)
  );
  /// Alert pop up to check if the user accidently pressed the button or is sure to delete the employee payroll data
  var result = confirm("Want to delete the data for Employee : " + empPayrollData._name);
  if (result) {
    /// Finding whether the element is found or not in the local storage of the employee salary list
    if (!empPayrollData) return;
    /// Finding the index position of the employee payroll data in the employee payroll list using map and index method
    const index = empPayrollList
      .map((empData) => empData._id)
      .indexOf(empPayrollData.id);
    /// Deleting the found data from the employee salary list(Not from the local storage till)
    empPayrollList.splice(index - 1, 1);
    /// Pushing the updated data to the local storage- updation => deleting the passed node
    localStorage.setItem("EmployeePayrollList", JSON.stringify(empPayrollList));
    /// Count is updated on the web page so as to see the changed count
    document.querySelector(".emp-count").textContent = empPayrollList.length;
  }
  /// Using the create inner html to display the tabular data on the home webpage
  createInnerHtml();
};

/// UC2 -- To edit detail defining the update method with parameter as the node
const update = (node) => {
  /// Finding whether the data is present in the employee payroll list or not
  let empPayrollData = empPayrollList.find((empData) => empData._id == node.id);
  /// Finding whether the element is found or not in the local storage of the employee salary list
  if (!empPayrollData) return;
  /// Creating a different list for employee payroll data and storing it in the local storage
  localStorage.setItem("editEmp", JSON.stringify(empPayrollData));
  /// Redirecting to thee employee payroll page
  window.location.replace(site_properties.emp_payroll_page);
};