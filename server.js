/*********************************************************************************
 * WEB700 – Assignment 05
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
 * of this assignment has been copied manually or electronically from any other source
 * (including 3rd party web sites) or distributed to other students.
 *
 * Name: ___Jorid_Spaha_______ Student ID: __114254204____ Date: __08-Mar-2022___
 *
 * Online (Heroku) Link: __https://boiling-stream-18157.herokuapp.com/______________
 *
 ********************************************************************************/
const HTTP_PORT = process.env.PORT || 8080;
const express = require("express");
const req = require("express/lib/request");
const app = express();
const path = require("path");
const myModule = require("./modules/collegeData.js");
const exphbs = require("express-handlebars");

app.use(function (req, res, next) {
  let route = req.path.substring(1);
  app.locals.activeRoute =
    "/" +
    (isNaN(route.split("/")[1])
      ? route.replace(/\/(?!.*)/, "")
      : route.replace(/\/(.*)/, ""));
  next();
});

app.engine(
  ".hbs",
  exphbs.engine({
    extname: ".hbs",
    helpers: {
      navLink: function (url, options) {
        return (
          "<li" +
          (url == app.locals.activeRoute
            ? ' class="nav-item active" '
            : ' class="nav-item" ') +
          '><a class="nav-link" href="' +
          url +
          '">' +
          options.fn(this) +
          "</a></li>"
        );
      },
      equal: function (lvalue, rvalue, options) {
        if (arguments.length < 3)
          throw new Error("Handlebars Helper equal needs 2 parameters");
        if (lvalue != rvalue) {
          return options.inverse(this);
        } else {
          return options.fn(this);
        }
      },
    },
  })
);

app.set("view engine", ".hbs");

app.use((req, res, next) => {
  // read the "user-agent" header on every request and output it to the console
  let userAgent = req.get("user-agent");
  console.log(userAgent);
  next();
});

app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));

app.get("/students/add", (req, res) => {
  // res.sendFile(path.join(__dirname, "/views/addStudent.html"));
  res.render("addStudent");
});
app.post("/students/add", (req, res) => {
  req.body.TA = req.body.TA ? true : false; // fix for checkboxes
  myModule
    .addStudent(req.body)
    .then((dataCollection) => {
      res.redirect("/students");
    })
    .catch((err) => {
      res.render("students", { message: "no results" });
    });
});
app.post("/student/update", (req, res) => {
  req.body.TA = req.body.TA ? true : false;
  myModule
    .updateStudent(req.body)
    .then((dataCollection) => {
      console.log(req.body);
      res.redirect("/students");
    })
    .catch((err) => {
      res.render("students", { message: "no results" });
    });
});
app.get("/students", (req, res) => {
  if (req.query.course) {
    myModule
      .getStudentsByCourse(req.query.course)
      .then((dataCollection) => {
        res.render("students", { student: dataCollection });
      })
      .catch((err) => {
        res.render("students", { message: "no results" });
      });
  } else {
    myModule
      .getAllStudents()
      .then((dataCollection) => {
        res.render("students", { student: dataCollection });
      })
      .catch((err) => {
        res.render("students", { message: "no results" });
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
      res.render("courses", { courses: dataCollection });
    })
    .catch((err) => {
      res.render("courses", { message: "no results" });
    });
});

app.get("/student/:num", (req, res) => {
  myModule
    .getStudentByNum(req.params.num)
    .then((dataCollection) => {
      res.render("student", { student: dataCollection });
    })
    .catch((err) => {
      res.render("student", { message: "no results" });
    });
});
app.get("/course/:id", (req, res) => {
  myModule
    .getCourseById(req.params.id)
    .then((dataCollection) => {
      res.render("course", { course: dataCollection });
    })
    .catch((err) => {
      res.render("course", { message: "no results" });
    });
});

app.get("/", (req, res) => {
  // res.sendFile(path.join(__dirname, "/views/home.html"));
  res.render("home");
});

app.get("/htmlDemo", (req, res) => {
  // res.sendFile(path.join(__dirname, "/views/htmlDemo.html"));
  res.render("htmlDemo");
});

app.get("/home", (req, res) => {
  // res.sendFile(path.join(__dirname, "/views/home.html"));
  res.render("home");
});

app.get("/about", (req, res) => {
  // res.sendFile(path.join(__dirname, "/views/about.html"));
  res.render("about");
});

app.use((req, res, next) => {
  res.status(404).render("wrongAddress"); // .sendFile(), .json(), etc or .end() (sends nothing back)
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
