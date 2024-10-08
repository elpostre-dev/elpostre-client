// Server file
const express = require('express')
const serveStatic = require('serve-static')
const path = require('path')
const dotenv = require('dotenv');
const sslRedirect = require('heroku-ssl-redirect').default


dotenv.config();
const app = express()
// enable ssl redirect
app.use(sslRedirect())
// All urls goto to index.html in /dist folder [build folder]
app.use("/", serveStatic(path.join(__dirname, '/dist')))
app.get(/.*/, function (req, res) {
    res.sendFile(path.join(__dirname, '/dist/index.html'))
})
const port = process.env.PORT || 8081;
app.listen(port)
console.log(`App is listening on port: ${port}`)