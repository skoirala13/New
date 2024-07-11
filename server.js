/*********************************************************************************
* WEB700 – Assignment 04
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name:  Student_ID:  Date: 
*
********************************************************************************/

var HTTP_PORT = process.env.PORT || 8000;
import express from 'express';
import path from "path";
import { fileURLToPath } from 'url';
var app = express();
// Use import.meta.url to get the directory name
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

import {initialize,
    getAllStudents,
    getTAs,
    getCourses,
    getStudentsByCourse,
    getStudentsByNum} from 'collegedata.js';


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'home.html'));
});

app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'about.html'));
});

app.get("/htmlDemo", (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'htmlDemo.html'));
});

app.get('/students/add', (req, res) => {
    res.sendFile(path.join(__dirname, 'views','addStudent.html'));
});



app.get("/students", (req, res) => {
    if (req.query.course) {
        getStudentsByCourse(req.query.course)
            .then((students) => {
                res.json(students);
            })
            .catch((err) => {
                res.json({ message: err });
            });
    } else {
        getAllStudents()
            .then((students) => {
                res.json(students);
            })
            .catch((err) => {
                res.json({ message: "No results" });
            });
    }
});

app.get("/tas", (req, res) => {
    getTAs()
        .then((tas) => {
            res.json(tas);
        })
        .catch((err) => {
            res.json({ message: "No results" });
        });
});

app.get('/courses', (req, res) => {
    getCourses().then(data => {
        res.json(data);
    }).catch(err => {
        res.json({ message: err });
    });
});
app.get('/courses/:num', (req, res) => {
    let num = req.params.num
    getStudentsByCourse(num).then(data => {
        res.json(data);
    }).catch(err => {
        res.json({ message: err });
    });
});

app.get('/student/:num', (req, res) => {
    let num = req.params.num
    getStudentsByNum(num).then(data => {
        res.json(data);
    }).catch(err => {
        res.json({ message: err });
    });
});

app.post('/students/add', (req, res) => {
    collegeData.addStudent(req.body).then(() => {
        res.redirect('/students');
    }).catch((err) => {
        res.status(500).send("Unable to add student");
    });
});


initialize()
    .then(() => {
        console.log("Starting...")
        app.listen(HTTP_PORT, ()=> {console.log("Server listening on port "+ HTTP_PORT)});
    })
    .catch((err) => {
        console.error(err);
    });
