class Player {
    constructor(username) {
        this.socket = null
        this.username = username
        this.matchRequest = null
        this.turn = null
        this.inMatch = false
    }

    login(socket) {
        this.socket = socket
    }

    logout() {
        this.socket = null
        this.matchRequest = null
        this.turn = null
        this.inMatch = false
    }

    loggedIn() {
        return (this.socket != null)
    }

    emit(event, data) {
        this.socket.emit(event, data)
    }

    serialize() {
        return {
            username: this.username,
            matchRequest: this.matchRequest ? this.matchRequest.username : null,
            turn: this.turn,
            inMatch: this.inMatch
        }
    }
}

module.exports = Player