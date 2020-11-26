/// A global variable to see if any update request is made by the user
let isUpdate = false;
/// A json object is created to be used when data has to be updated in the local storage
let employeePayrollObj = {};

/// To be executed after loading the DOM content- Document Object Model i.e. the webpage
/// Attaching an event handler for the load of DOM content 
window.addEventListener("DOMContentLoaded", (event) => {

  const name = document.querySelector("#name");
  const textError = document.querySelector(".name-error");
  /// Add event handler to the name field of the main page
  name.addEventListener("input", function () {
    /// If name is empty i.e. user did not entered any value no error message
    if (name.value.length == 0) {
      textError.textContent = "";
      return;
    }
    /// Else validate the name and then print the specified error message to the screen
    /// Error message specified in the event by internally validating to the setter in EmployeePayRoll Class
    try {
      new EmployeePayRoll().name = name.value;
      textError.textContent = "";
    } catch (e) {
      textError.textContent = e;
    }
  });

  /// UC8 -- Adding the script for the salary range update when user is entering the data
  const salary = document.querySelector("#salary");
  const output = document.querySelector(".salary-output");
  output.textContent = salary.value;
  salary.addEventListener("input", function () {
    output.textContent = salary.value;
  });
 /// Validation for the date property entered by the user from the console
  dateError = document.querySelector(".date-error");
  var year = document.querySelector("#year");
  var month = document.querySelector("#month");
  var day = document.querySelector("#day");
  year.addEventListener("input", checkDate);
  month.addEventListener("input", checkDate);
  day.addEventListener("input", checkDate);
  function checkDate() {
    try {
      let dates =
        getInputValueById("#day") +
        " " +
        getInputValueById("#month") +
        " " +
        getInputValueById("#year");
      dates = new Date(Date.parse(dates));
      new EmployeePayRoll().startDate = dates;
      dateError.textContent = "";
    } catch (e) {
      dateError.textContent = e;
    }
  }
  /// Check for update request is passed or not by the user
  /// if request is passed then execute the request of the user by populating the data to be updated in the form
  checkForUpdate();
});
/// Creating save function for internally creating an employee payroll object and initialise
const save = (event) => {
  /// To be invoked in case the DOM event listener fails to validate the date or name
  event.preventDefault();
  /// To stop the form submission in case validation fails
  event.stopPropagation();
  try {
    /**
     * Earlier we had followed the algorithm to first create an employee payroll data using the employee payroll class instance
     * And then passed it to the createOrUpdateStorageMethod so as to push the data to the local storage of browser
     * * Now we will first create the employee payroll data on it's global instance
     * * Then we will update the storage and then invoke the reset form method
     * * However it is entirely dependent on user request to either edit or add the employee payroll data
     */
    setEmployeePayrollObject();
    createAndUpdateStorage();
    resetForm();
    /// Once the data is save moving to the home page to see the data directly
    /// Note that this does not mean our home button is redundant
    window.location.replace(site_properties.home_page);
  }
  catch (e) {
    /// Logging the error message if any
    alert(e);
    return;
  }
};
/// UC2 -- The code refactored from a local object based data allocation to global object data allocation
/// Now we are not working on local instance as we had the requirement of data to be pre-declared
const setEmployeePayrollObject = () => {
  employeePayrollObj._name = getInputValueById("#name");
  employeePayrollObj._profilePic = getSelectedValues("[name=profile]").pop();
  employeePayrollObj._gender = getSelectedValues("[name=gender]").pop();
  employeePayrollObj._department = getSelectedValues("[name=department]");
  employeePayrollObj._salary = getInputValueById("#salary");
  employeePayrollObj._note = getInputValueById("#notes");
  let date =
    getInputValueById("#day") +
    " " +
    getInputValueById("#month") +
    " " +
    getInputValueById("#year");
  employeePayrollObj._startDate = date;
};
/// Method to parse the input data to the lightweight json type and then push the data to the browser local storage
function createAndUpdateStorage() {
  /// Method to parse the input data to the lightweight json type and then push the data to the browser local storage
  let employeePayrollList = JSON.parse(
    localStorage.getItem("EmployeePayrollList")
  );
  /// If the employeePayrollData list is not empty i.e. already created then push the incoming data onto the local storage
  if (employeePayrollList) {
    let empPayrollData = employeePayrollList.find(
      (empData) => empData._id == employeePayrollObj._id
    );
    if (!empPayrollData) {
      employeePayrollList.push(createEmployeePayrollData());
    } else {
      /// Using map array helper function to mention the instance with the identified node id
      /// Getting the index of the element using index array helper function
      const index = employeePayrollList
        .map((empData) => empData._id)
        .indexOf(empPayrollData._id);
      /// Removing the element from the list once update request is passed
      employeePayrollList.splice(
        index,
        1,
        createEmployeePayrollData(empPayrollData._id)
      );
    }
  } else {
    employeePayrollList = [createEmployeePayrollData()];
  }
  /// Displaying the alert popup for the user one more time before the local storage has been populated
  alert(employeePayrollList.toString());
  /// Push the data to the local storage
  localStorage.setItem(
    "EmployeePayrollList",
    JSON.stringify(employeePayrollList)
  );
}
const createEmployeePayrollData = (id) => {
  let employeePayrollData = new EmployeePayRoll();
  if (!id) employeePayrollData.id = createNewEmployeeId();
  else employeePayrollData.id = id;
  setEmployeePayrollData(employeePayrollData);
  return employeePayrollData;
};

const setEmployeePayrollData = (employeePayrollData) => {
  try {
    employeePayrollData.name = employeePayrollObj._name;
  } catch (e) {
    setTextValue(".name-error", e);
    throw e;
  }
  employeePayrollData.profilePic = employeePayrollObj._profilePic;
  employeePayrollData.gender = employeePayrollObj._gender;
  employeePayrollData.department = employeePayrollObj._department;
  employeePayrollData.salary = employeePayrollObj._salary;
  employeePayrollData.note = employeePayrollObj._note;
  try {
    employeePayrollData.startDate = new Date(
      Date.parse(employeePayrollObj._startDate)
    );
  } catch (e) {
    setTextValue(".date-error", e);
    throw e;
  }
  alert(employeePayrollData.toString());
};

const createNewEmployeeId = () => {
  let empID = localStorage.getItem("EmployeeID");
  empID = !empID ? 1 : (parseInt(empID) + 1).toString();
  localStorage.setItem("EmployeeID", empID);
  return empID;
};

/// Method to fetch the result of the input from the browser input for buttons and checkboxes.
const getSelectedValues = (propertyValue) => {
  /// Selecting the value of the element in the given property
  let allItems = document.querySelectorAll(propertyValue);
  /// selItem array to store the multiple select items in the given property
  let selItems = [];
  /// Iterating over all the items and then push the individual values into the selItems array
  allItems.forEach((item) => {
    if (item.checked) selItems.push(item.value);
  });
  return selItems;
};
/// Method to fetch the result of the input from the browser input for id by the user
const getInputValueById = (id) => {
  let value = document.querySelector(id).value;
  return value;
};

/// Method to fetch the result of the input value from the browser input for id by the user
const getInputElementValue = (id) => {
  let value = document.getElementById(id).value;
  return value;
};

/// UC5 -- Defining the method to reset the form once the reset button is pressed
/// Will be called once the reset button is clicked
const resetForm = () => {
  /// Either set to empty or unset the values
  setValue("#name", "");
  //calling unset selected values to uncheck radio and checked boxes.
  unsetSelectedValues("[name=profile]");
  unsetSelectedValues("[name=gender]");
  unsetSelectedValues("[name=department]");
  setValue("#salary", "");
  setValue("#notes", "");
  setValue("#day", 1);
  setValue("#month", "January");
  setValue("#year", "2018");
};

/// To unset the values selected in the form for multiple values
const unsetSelectedValues = (propertyValue) => {
  let allItems = document.querySelectorAll(propertyValue);
  /// Setting the checked item status to false to depict that the item should not be checked
  allItems.forEach((items) => {
    items.checked = false;
  });
};

/// Either set the element value with the one passed in as value
const setTextValue = (id, value) => {
  const element = document.querySelector(id);
  element.textContent = value;
};

/// Using this method to update the element value in the document with the one passed in as value
/// will allocate the reset value to the element by the value passed
const setValue = (id, value) => {
  const element = document.querySelector(id);
  element.value = value;
};

/// Method defined to check for the update request
const checkForUpdate = () => {
  /// Getting the data stored with the edit temp key
  const employeePayrollJson = localStorage.getItem("editEmp");
  /// If the user has requested for the update then allowing the parsing process of the new data list
  /// The data to be edit was added to the local storage using editEmp as the key
  isUpdate = employeePayrollJson ? true : false;
  if (!isUpdate) return;
  employeePayrollObj = JSON.parse(employeePayrollJson);
  /// Invoking the set form method to enter the previously present data to easify the User experience
  setForm();
};

///Mehtod to put the value to the form so as to display the default present data before the user is asked to update the form
const setForm = () => {
  /// Invoking the setvalue method to set the property name to the form value
  /// Note that the object is global hence a seperate instance creation or multiple instance problem is resolved
  setValue("#name", employeePayrollObj._name);
  /// Calling the set selected method to set the values for properties with checkbox or radio-button input
  setSelectedValues("[name=profile]", employeePayrollObj._profilePic);
  setSelectedValues("[name=gender]", employeePayrollObj._gender);
  setSelectedValues("[name=department]", employeePayrollObj._department);
  setValue("#salary", employeePayrollObj._salary);
  /// Calling the set text value to modify the dropdown input to default values
  setTextValue(".salary-output", employeePayrollObj._salary);
  /// Calling the set value to put the previously entered text value into the note box
  setValue("#notes", employeePayrollObj._note);
  let date = stringifyDate(employeePayrollObj._startDate).split(" ");
  setValue("#day", date[0]);
  setValue("#month", date[1]);
  setValue("#year", date[2]);
};
/// Set selected values function to set checked values for properties with checkbox or radio-button input
const setSelectedValues = (propertyValue, value) => {
  /// Fetching the item for a property value
  let allItems = document.querySelectorAll(propertyValue);

  allItems.forEach((item) => {
    if (Array.isArray(value)) {
      if (value.includes(item.value)) {
        item.checked = true;
      }
    }
    else if (item.value === value) item.checked = true;
  });
};
