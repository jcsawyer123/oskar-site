var express = require('express'),
app = express()

app.use(express.static('dist'));

app.listen(3000, () => {
    console.log("Started on server 3000")
});