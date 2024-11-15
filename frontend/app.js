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

app.get("/admin/orders", (req, res) => {
    res.render("ordersPage")
});

app.get("/admin/books", (req, res) => {
    res.render("booksPage")
});

app.get("/admin/statistics", (req, res) => {
    res.render("statistics");
});
  
app.get('/admin/branches', (req, res) => {
    res.render('branches');
});

app.get('/cart', (req, res) => {
    res.render('cart');
});

app.get('/order', (req, res) => {
    res.render('order');
});

app.get('/orders', (req, res) => {
    res.render('userOrders');
});

const mapRoutes = require('./routes/map');
app.use(mapRoutes);

app.listen(3000);

