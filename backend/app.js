const express = require("express")
const bodyBarser = require("body-parser")

const app = express()

app.use(bodyBarser.json())

app.use((req, res, next)=>{
    res.send(`You are sending a request to: ${req.url}`)
})

app.listen(5000)