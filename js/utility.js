/// StringifyDate is defined to convert the date to a user acceptable format
const stringifyDate=(date)=>{
    const options={day:'numeric', month: 'long',year:'numeric'};
    const newDate= date===undefined?"undefined":new Date(Date.parse(date)).toLocaleDateString('en-GB',options);
    return newDate;
};
const checkName = (name) => { 
    let nameRegex = RegExp('^[A-Z]{1}[a-zA-Z\\s]{2,}$');
    if (!nameRegex.test(name)) throw 'Name is Incorrect!';
};

const checkStartDate = (startDate) => { 
    let now = new Date();
    if (startDate > now) throw 'Start Date is a Future Date!';
    var diff = Math.abs(now.getTime() - startDate.getTime());
    if (diff / (1000 * 60 * 60 * 24) > 30) 
      throw 'Start Date is beyond 30 Days!';
};

/// Defining toString method for aggregrating the data entered by the user
const toString = (object) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    const empDate = object._startDate == null? "undefined" : object._startDate;
    return (
      "id -->" +
      object.id +
      ", name -->" +
      object._name +
      ", gender= -->'" +
      object._gender +
      ", profilePic= -->" +
      object._profilePic +
      ", department= -->" +
      object._department +
      ", salary= -->" +
      object._salary +
      ", startDate= -->" +
      empDate +
      ", note= -->" +
      object._note
    );
  }