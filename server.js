/*********************************************************************************
 * WEB700 – Assignment 04
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
 * of this assignment has been copied manually or electronically from any other source
 * (including 3rd party web sites) or distributed to other students.
 *
 * Name: ___Jorid_Spaha_______ Student ID: __114254204____ Date: __08-Mar-2022___
 *
 * Online (Heroku) Link: ________________________________________________________
 *
 ********************************************************************************/
const HTTP_PORT = process.env.PORT || 8080;
const express = require("express");
const req = require("express/lib/request");
const app = express();
const path = require("path");
const myModule = require("./modules/collegeData.js");
// setup a 'route' to listen on the default url path

app.use((req, res, next) => {
  // read the "user-agent" header on every request and output it to the console
  let userAgent = req.get("user-agent");
  console.log(userAgent);
  next();
});

app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));

app.get("/students/add", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/addStudent.html"));
});
app.post("/students/add", (req, res) => {
  req.body.TA = req.body.TA ? true : false; // fix for checkboxes
  myModule
    .addStudent(req.body)
    .then((dataCollection) => {
      res.redirect("/students");
    })
    .catch((err) => {
      res.json("Error");
    });
});
app.get("/students", (req, res) => {
  if (req.query.course) {
    myModule
      .getStudentsByCourse(req.query.course)
      .then((dataCollection) => {
        res.json(dataCollection);
      })
      .catch((err) => {
        res.json("Error, couldn't retrieve the student by course.");
      });
  } else {
    myModule
      .getAllStudents()
      .then((dataCollection) => {
        res.json(dataCollection);
      })
      .catch((err) => {
        res.json("Something wrong happened with your getAllStudents function");
      });
  }
});

app.get("/tas", (req, res) => {
  myModule
    .getTAs()
    .then((dataCollection) => {
      res.json(dataCollection);
    })
    .catch((err) => {
      res.json("Error, couldn't retrieve any TAs.");
    });
});

app.get("/courses", (req, res) => {
  myModule
    .getCourses()
    .then((dataCollection) => {
      res.json(dataCollection);
    })
    .catch((err) => {
      res.json("Error, couldn't retrieve any courses.");
    });
});

app.get("/students/:num", (req, res) => {
  myModule
    .getStudentByNum(req.params.num)
    .then((dataCollection) => {
      res.json(dataCollection);
    })
    .catch((err) => {
      res.json("Error, couldn't retrieve the student by studentNum.");
    });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/home.html"));
});

app.get("/htmlDemo", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/htmlDemo.html"));
});

app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/home.html"));
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/about.html"));
});

app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, "/views/wrongAddress.html")); // .sendFile(), .json(), etc or .end() (sends nothing back)
});

app.use((req, res, next) => {
  res.status(404).send("404: Route not found"); // .sendFile(), .json(), etc or .end() (sends nothing back)
});

myModule
  .initialize()
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log("server listening on port: " + HTTP_PORT);
    });
  })
  .catch((err) => {
    console.log("Something wrong happened with your initialize function");
  });
