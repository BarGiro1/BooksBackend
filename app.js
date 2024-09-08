const express = require('express');

const app = express();

app.set('view engine', 'ejs');

app.use(express.static('public'))


app.use('/', (req, res) => {
    res.render('home')
});

app.listen(3000);