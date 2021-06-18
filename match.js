class Match {
    constructor(player1, player2) {
        this.player1 = player1
        this.player2 = player2

        // cancel the match requests
        this.player1.matchRequest = null
        this.player2.matchRequest = null

        this.player1.inMatch = true
        this.player2.inMatch = true

        this.player1.turn = null
        this.player2.turn = null
    }

    check() {
        if (this.finished()) {
            const winner = this.whoWins()

            let result = {
                winner: {
                    username: winner.username,
                    turn: winner.turn
                },
                players: [
                    {
                        username: this.player1.username,
                        turn: this.player1.turn
                    },
                    {
                        username: this.player2.username,
                        turn: this.player2.turn
                    }
                ]
            }

            this.player1.emit('matchResult', result)
            this.player2.emit('matchResult', result)
        }
    }

    finished () {
        return this.player1.turn && this.player2.turn
    }

    whoWins() {
        console.log('player1', this.player1.turn)
        console.log('player2', this.player2.turn)

        /*
            Programming task: Implement the game rules
            
            - this.player1.turn can be 'rock', 'paper', or 'scissors'
            - this.player2.turn can be 'rock', 'paper', or 'scissors'

            - return this.player1 if player1 wins
            - return this.player2 if player2 wins
            - return null if there is a draw
        */

        if (this.player1.turn == 'rock') {
            if (this.player2.turn == 'rock')
                return null
            if (this.player2.turn == 'paper')
                return this.player2
            if (this.player2.turn == 'scissors')
                return this.player1
        }

        if (this.player1.turn == 'paper') {
            if (this.player2.turn == 'rock')
                return this.player1
            if (this.player2.turn == 'paper')
                return null
            if (this.player2.turn == 'scissors')
                return this.player2
        }

        if (this.player1.turn == 'scissors') {
            if (this.player2.turn == 'rock')
                return this.player2
            if (this.player2.turn == 'paper')
                return this.player1
            if (this.player2.turn == 'scissors')
                return null
        }
        
        return null
    }
}

module.exports = Match