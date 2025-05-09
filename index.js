require("dotenv").config()
const express = require("express")
const cors = require("cors")
const router = require("./Routes/route")
require('./DatabaseConnection/dbConnection')

const jobBoardServer = express()

jobBoardServer.use(cors())
jobBoardServer.use(express.json())
jobBoardServer.use(router)

const PORT = 3000 || process.dotenv.PORT

jobBoardServer.listen(PORT, () => {
    console.log(`my jobBoardServer running in port : ${PORT} and waiting for client request!!!`);
})

jobBoardServer.get('/', (req, res) => {
    res.status(200).send('<p style="color:green;">my jobBoardServer running in port and waiting for client req!!</p>')
})