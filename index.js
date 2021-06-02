const express = require('express')
const app = express()
const SocketIO = require('socket.io')
const cors = require('cors')
const Game = require('./game')


app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Rock-Paper-Scissors API'
    })
})

const http = require('http').createServer(app)

const io = SocketIO(http, {
    cors: {}
})

let game = new Game(io)

const PORT = process.env.PORT || 8081

const server = http.listen(PORT, () => {
    console.log(`Server running on port ${PORT}.`)
})