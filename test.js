var collegeDate = require("./modules/collegeData.js");

collegeDate
  .initialize()
  .then(function () {
    console.log("It was successful");

    collegeDate
      .getAllStudents()
      .then(function (dataCollection) {
        console.log(
          "Successfully retrived " + dataCollection.length + " students"
        );
      })
      .catch(function (err) {
        console.log(
          "Something wrong happend with your getAllStudents function"
        );
      });

    collegeDate
      .getCourses()
      .then(function (dataCollection) {
        console.log(
          "Successfully retrived " + dataCollection.length + " courses"
        );
      })
      .catch(function (err) {
        console.log("Something wrong happend with your getCourses function");
      });

    collegeDate
      .getTAs()
      .then(function (dataCollection) {
        console.log("Successfully retrived " + dataCollection.length + " TAs");
      })
      .catch(function (err) {
        console.log(
          "Something wrong happend with your getAllStudents function"
        );
      });
    collegeDate
      .getStudentByNum(5)
      .then(function (dataCollection) {
        console.log(
          "Successfully retrived " + JSON.stringify(dataCollection) + " TAs"
        );
      })
      .catch(function (err) {
        console.log(
          "Something wrong happend with your getAllStudents function"
        );
      });
    collegeDate
      .getStudentsByCourse(5)
      .then(function (dataCollection) {
        console.log(
          "Successfully retrived " + JSON.stringify(dataCollection) + " TAs"
        );
      })
      .catch(function (err) {
        console.log(
          "Something wrong happend with your getAllStudents function"
        );
      });
  })
  .catch(function (err) {
    console.log("Something wrong happend with your initialize function");
  });
