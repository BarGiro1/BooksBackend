const express = require("express");

const app = express();

app.set("view engine", "ejs");

app.use(express.static("public"));

app.get(["/", "/home"], (req, res) => {
    res.render("home");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

app.get("/book/:id", (req, res) => {
    const bookId = req.params.id;
    res.render("book", { bookId: bookId })
});

app.get("/admin/users", (req, res) => {
    res.render("usersPage")
});

app.get('/cart', (req, res) => {
    res.render('cart');
});

app.get('/order', (req, res) => {
    res.render('order');
});

app.listen(3000);

