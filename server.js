const express = require("express");
const app = express();
const port = process.env.PORT || 8000;
const mongoose = require("mongoose");

//connect to a database
mongoose.connect("mongodb://localhost:27017/sastabin")
    .then(() => console.log("connected"))
    .catch(e => console.log(e));

const Document = require("./models/document");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }))

app.get("/", (req, res) => {
    const code = `Welcome to SastaBin clone
`
    res.render("index", { code, language: "plaintext" });
})

app.get("/new", (req, res) => {
    res.render("new");
})

app.post("/save", async (req, res) => {
    const value = req.body.value;
    try {
        const document = await Document.create({ value });
        res.redirect(`/${document.id}`);
    } catch (e) {
        res.render("new", { value });
    }
})

app.get("/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const document = await Document.findById(id);
        res.render("index", { code: document.value,id });
    } catch (e) {
        res.redirect("/");
    }
})

app.get("/:id/duplicate", async (req, res) => {
    const id = req.params.id;
    try {
        const document = await Document.findById(id);
        res.render("new", { value: document.value });
    } catch (e) {
        res.redirect(`/${id}`);
    }
})

app.listen(port);