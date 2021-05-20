const express = require('express')
const app = express()
const cors = require('cors')
const SocketIO = require('socket.io')

// we don't need the REST functionality right now
// as communication will be based on socket.io only in the first steps
// later we will add a game statistics REST API

const corsOptions = {
    origin: 'http://localhost:8080'
}

app.use(cors(corsOptions))
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

const messages = []

io.on('connection', (socket) => {
    console.log('Got a connection')

    socket.on('message', (arg) => {
        const message = `${socket.id} is on screen ${arg.screen}`
        messages.push(message)
        io.emit('serverMessage', message)
    })

    socket.emit('serverMessages', messages)
})

const PORT = process.env.PORT || 8081

const server = http.listen(PORT, () => {
    console.log(`Server running on port ${PORT}.`)
})
