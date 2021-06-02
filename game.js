const Player = require('./player')
const Match = require('./match')

class Game {
    constructor(io) {
        this.io = io
        this.players = new Map()
        this.loggedInPlayers = new Map()
        this.matches = new Set()

        this.io.on('connection', (socket) => {
            
            socket.on('login', (username) => {
                if (this.loginPlayer(socket, username)) {
                    socket.emit('userLoggedIn', {
                        username: username,
                        id: socket.id
                    })
                } else {
                    socket.emit('userExists', {
                        username: username,
                        id: socket.id
                    })
                }
            })

            socket.on('logout', (username) => {
                if (this.logoutPlayer(username)) {
                    socket.emit('userLoggedOut', {
                        username: username,
                        id: socket.id
                    })
                }
            })

            socket.on('requestMatch', ({opponent}) => {
                const me = this.loggedInPlayers.get(socket.id)
                const partner = this.players.get(opponent.username)
                me.matchRequest = partner
            })

            socket.on('makeTurn', ({turn}) => {
                const me = this.loggedInPlayers.get(socket.id)
                me.turn = turn.turn
            })

            socket.on('newMatch', () => {
                const me = this.loggedInPlayers.get(socket.id)
                me.inMatch = false
            })

            socket.on('disconnect', () => {
                if (this.loggedInPlayers.has(socket.id)) {
                    const me = this.loggedInPlayers.get(socket.id)
                    this.logoutPlayer(me.username)
                }
            })
        })


        setInterval(this.update.bind(this), 1000 / 30)
    }

    loginPlayer(socket, username) {
        // if there already is a player, check if it is logged in
        if (this.players.has(username)) {
            const player = this.players.get(username)

            if (player.loggedIn()) {
                return false
            }

            player.login(socket)

            this.loggedInPlayers.set(socket.id, player)
            return true
        } else {
            const player = new Player(username)
            player.login(socket)
            this.players.set(username, player)
            this.loggedInPlayers.set(socket.id, player)
            return true
        }

    }

    logoutPlayer(username) {
        if (this.players.has(username)) {
            const player = this.players.get(username)
            this.loggedInPlayers.delete(player.socket.id)
            player.logout()
            return true
        }
        return false
    }

    update() {
        const loggedInPlayers = Array.from(this.players.values())
            .filter(user => user.loggedIn())

        for (let player1 of loggedInPlayers) {
            if (player1.matchRequest) {
                let player2 = player1.matchRequest
                if (player2.matchRequest == player1) {
                    this.matches.add(new Match(player1, player2))
                    // start the match
                    player1.emit('startMatch', player2.serialize())
                    player2.emit('startMatch', player1.serialize())
                }
            }
        }

        for (let match of this.matches) {
            match.check()
            if (match.finished()) {
                this.matches.delete(match)
            }
        }

        let playerList = loggedInPlayers.map(player => player.serialize())
        this.io.emit('players', playerList)
    }
}

module.exports = Game