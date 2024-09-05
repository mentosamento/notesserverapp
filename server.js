const express = require('express');
const cookieParser = require("cookie-parser");
const fs = require("fs");

const app = express();

app.use(cookieParser());
app.use(express.json());

app.get("/create", (req, res) => {
  const data = JSON.parse(fs.readFileSync("./data.json", "utf-8"));
  if (!(req.cookies.id in data)) {
    data[req.cookies.id] = [];
    fs.writeFileSync("./data.json", JSON.stringify(data));
  }
})

app.post("/login", (req, res) => {
  const data = JSON.parse(fs.readFileSync("./data.json", "utf-8"));
  if (req.body.id in data) {
    res.status(200).send(req.body.id);
  }
  else { 
    res.status(401).send("Specified ID does not seem to exist");
  }
})

app.post("/note", (req, res) => {
  const data = JSON.parse(fs.readFileSync("./data.json", "utf-8"));
  const tosend = {
    title: req.body.title.trim() == "" ? "No title" : req.body.title.trim(),
    body: req.body.body.trim() == "" ? "No body" : req.body.body
  }
  if (req.body.id in data) {
    data[req.body.id].unshift(tosend);
    fs.writeFileSync("./data.json", JSON.stringify(data));
    res.status(200).end();
  } else {
    res.status(401).send("Server: ID does not exist");
  }
});

app.get("/mynotes", (req, res) => {
  const data = JSON.parse(fs.readFileSync("./data.json", "utf-8"));
  res.send({"result": data[req.cookies.id]});
});

app.get("/data/:id", (req, res) => {
  const data = JSON.parse(fs.readFileSync("./data.json", "utf-8"));
  const theone = data[req.cookies.id][parseInt(req.params.id)]

  res.send(theone);
})

app.post("/edit/:id", (req, res) => {
  const data = JSON.parse(fs.readFileSync("./data.json", "utf-8"));
  const theone = data[req.cookies.id]
  theone[parseInt(req.params.id)] = req.body;
  fs.writeFileSync("./data.json", JSON.stringify(data));
});

app.get("/delete/:id", (req, res) => {
  const data = JSON.parse(fs.readFileSync("./data.json", "utf-8"));
  data[req.cookies.id].splice(req.params.id, 1);
  fs.writeFileSync("./data.json", JSON.stringify(data));
})

app.listen(5000, () => {
  console.log('Server created at port 5000');
});