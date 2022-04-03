/*********************************************************************************
 * WEB700 – Assignment 05
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
 * of this assignment has been copied manually or electronically from any other source
 * (including 3rd party web sites) or distributed to other students.
 *
 * Name: ___Jorid_Spaha_______ Student ID: __114254204____ Date: __05-Apr-2022___
 *
 * Online (Heroku) Link: __https://boiling-stream-18157.herokuapp.com/home
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

app.get("/students", (req, res) => {
  if (req.query.course) {
    myModule
      .getStudentsByCourse(req.query.course)
      .then((dataCollection) => {
        res.render("students", { students: dataCollection });
        console.log(dataCollection);
      })
      .catch((err) => {
        res.json({ message: "no results" });
      });
  } else {
    myModule
      .getAllStudents()
      .then((dataCollection) => {
        if (dataCollection.length > 0) {
          res.render("students", { students: dataCollection });
        } else {
          res.render("students", { message: "no results" });
        }
      })
      .catch((err) => {
        res.send({ message: "no results" }); // show the error to the user
      });
  }
});

app.get("/courses", (req, res) => {
  myModule
    .getCourses()
    .then((dataCollection) => {
      if (dataCollection.length > 0) {
        res.render("courses", { courses: dataCollection });
      } else {
        res.render("courses", { message: "no results" });
      }
    })
    .catch((err) => {
      res.render("courses", { message: "no results" }); // show the error to the user
    });
});
app.get("/student/:studentNum", (req, res) => {
  // initialize an empty object to store the values
  let viewData = {};
  myModule
    .getStudentByNum(req.params.studentNum)
    .then((dataCollection) => {
      if (dataCollection) {
        viewData.student = dataCollection; //store student data in the "viewData" object as "student"
      } else {
        viewData.student = null; // set student to null if none were returned
      }
    })
    .catch(() => {
      viewData.student = null; // set student to null if there was an error
    })
    .then(myModule.getCourses)
    .then((dataCollection) => {
      viewData.courses = dataCollection;
      for (let i = 0; i < viewData.courses.length; i++) {
        if (viewData.courses[i].courseId == viewData.student.course) {
          viewData.courses[i].selected = true;
        }
      }
    })
    .catch(() => {
      viewData.courses = []; // set courses to empty if there was an error
    })
    .then(() => {
      if (viewData.student == null) {
        // if no student - return an error
        res.status(404).send("Student Not Found");
      } else {
        res.render("student", { viewData: viewData }); // render the "student" view
      }
    });
});

app.post("/student/update", (req, res) => {
  req.body.TA = req.body.TA ? true : false;
  myModule.updateStudent(req.body);
  res.redirect("/students");
});

app.get("/course/:id", (req, res) => {
  myModule
    .getCourseById(req.params.id)
    .then((dataCollection) => {
      if (dataCollection) {
        res.render("course", { course: dataCollection });
      } else {
        res.status(404).send("Course Not Found");
      }
    })
    .catch((err) => {
      res.json({ message: "no results" });
    });
});

app.get("/student/delete/:studentNum", (req, res) => {
  myModule
    .deleteStudentByNum(req.params.studentNum)
    .then(() => {
      res.redirect("/students");
    })
    .catch((err) => {
      res.status(505).send("Unable to Remove Student ( Student not found )");
    });
});

app.get("/course/delete/:id", (req, res) => {
  myModule
    .deleteCourseById(req.params.id)
    .then(() => {
      res.redirect("/courses");
    })
    .catch((err) => {
      res.status(505).send("Unable to Remove Course ( Course not found )");
    });
});

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/htmlDemo", (req, res) => {
  res.render("htmlDemo");
});

app.get("/home", (req, res) => {
  res.render("home");
});

app.get("/students/add", (req, res) => {
  myModule
    .getCourses()
    .then((dataCollection) => {
      res.render("addStudent", { courses: dataCollection });
    })
    .catch((err) => {
      res.render("addStudent", { courses: [] });
    });
});
app.get("/courses/add", (req, res) => {
  res.render("addCourse");
});

app.get("/about", (req, res) => {
  res.render("about");
});
app.post("/courses/add", (req, res) => {
  myModule
    .addCourses(req.body)
    .then(() => {
      res.redirect("/courses");
    })
    .catch((err) => {
      res.json("Error");
    });
});
app.post("/students/add", (req, res) => {
  req.body.TA = req.body.TA ? true : false;
  myModule
    .addStudent(req.body)
    .then(() => {
      res.redirect("/students");
    })
    .catch((err) => {
      res.json("Error");
    });
});

app.post("/course/update", (req, res) => {
  myModule.updateCourse(req.body);

  res.redirect("/courses");
});
app.use((req, res, next) => {
  res.status(404).render("wrongAddress");
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
