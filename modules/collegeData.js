class data {
  students;
  courses;
  constructor(stud, cours) {
    this.students = stud;
    this.courses = cours;
  }
}
const fs = require("fs"); // responsible for obtaining the data
const { resolve } = require("path");

const studentsPath = "./data/students.json";
const coursesPath = "./data/courses.json";

module.exports.dataCollection = null;
let studentDataFromFile = [];
let courseDataFromFile = [];

module.exports.initialize = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(studentsPath, "utf8", (err, dataFromStudents) => {
      if (err) {
        reject(err.msg); // or reject the promise (if used in a promise)
        return;
      }
      studentDataFromFile = JSON.parse(dataFromStudents); // convert the JSON from the file into an array of objects

      fs.readFile(coursesPath, "utf8", (err, dataFromCourses) => {
        if (err) {
          reject(err.msg); // or reject the promise (if used in a promise)
          return;
        }
        courseDataFromFile = JSON.parse(dataFromCourses); // convert the JSON from the file into an array of objects
        dataCollection = new data(studentDataFromFile, courseDataFromFile);
        resolve(dataCollection);
      });
    });
  });
};

module.exports.getAllStudents = () => {
  return new Promise((resolve, reject) => {
    if (dataCollection.students.length == 0) {
      reject("no results returned");
      return;
    } else {
      resolve(dataCollection.students);
    }
  });
};

module.exports.getTAs = () => {
  var studentArray = [];
  return new Promise((resolve, reject) => {
    if (dataCollection.students.length == 0) {
      reject("no results returned");
      return;
    } else {
      dataCollection.students.forEach((item) => {
        if (item.TA == true) {
          studentArray.push(item);
        }
      });
      resolve(studentArray);
    }
  });
};

module.exports.getCourses = () => {
  return new Promise((resolve, reject) => {
    if (dataCollection.courses.length == 0) {
      reject("no results returned");
      return;
    } else {
      resolve(dataCollection.courses);
    }
  });
};

module.exports.getStudentsByCourse = (course) => {
  var student = [];

  return new Promise((resolve, reject) => {
    dataCollection.students.forEach((item) => {
      if (item.course == course) {
        student.push(item);
      }
    });

    if (student.length == 0) {
      reject("no results returned");
    } else {
      resolve(student);
    }
  });
};

module.exports.getStudentByNum = (num) => {
  var student = [];

  return new Promise((resolve, reject) => {
    dataCollection.students.forEach((item) => {
      if (item.studentNum == num) {
        student.push(item);
      }
    });

    if (student.length == 0) {
      reject("no results returned");
    } else {
      resolve(student);
    }
  });
};

module.exports.addStudent = (studentData) => {
  return new Promise((resolve, reject) => {
    studentData.studentNum = dataCollection.students.length + 1;

    if (studentData.TA == undefined) {
      studentData.TA = false;
    }
    if (dataCollection.students.push(studentData)) {
      resolve(dataCollection.students);
      return;
    } else {
      reject("error");
    }
  });
};
