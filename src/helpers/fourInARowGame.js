const nj = require('numjs');
export default class Four_In_A_Row{
    constructor(){
        this.player = 1;
        this.boardSize = [6,7];
        this.board = nj.zeros(this.boardSize, 'int32');
        this.isWin = false;
        this.winType = null;
        this.winner = null
        this.previousYX = null;
    }


    resetGame() {
        this.player = 1;
        this.board = nj.zeros(this.boardSize, 'int32');
        this.isWin = false;
        this.winType = null;
        this.winner = null;
    }

    copyState() {
        let cBoard = new Four_In_A_Row();
        cBoard.setCurrentPlayer(this.player);
        cBoard.isWin = this.isWin;
        cBoard.winner = this.winner;
        cBoard.winType = this.winType;
        cBoard.setBoard(this.board.clone());
        return cBoard;
    }

    checkWin(x, y){

        if (this.checkInRow( this.board[y] )){
            return [true, 'horizontal'];

        } else if (this.checkInRow( this.board.slice([null,x]) )){
            return [true, 'vertical'];
            //todo: fix diagonal logic...
        } else if (this.checkInRow( nj.diag(this.board[x - y]) )){
            return [true, 'diagonal Rl'];

        //} //else if (this.checkInRow()){
        //     //TODO: Add Board Flip
        //
        } else {
            return[false, null];
        }
    }
    checkInRow = (arr) => {
        let inRow = 0;

        for (let i = 0; i < arr.length; i++){

            if (arr[i] === this.player){
                inRow += 1;
            } else {
                inRow = 0;
            }

            if (inRow === 4){
                return true;
            }
        }
        return false;
    }

    playMove(move){
        for (let i = this.boardSize[1] - 1; i >= 0; i--){
            if (this.board.get(i, move) === 0){
                this.board.set(i, move, this.player);
                this.previousYX = [i, move];
                return [i, move];
            }
        }
    }

    turn(move){
        try{
            move = Number(move);
        } catch(error){
            return false;
        }

        if (move in this.getValidMoves()){

            const m = this.playMove(move);
            const winOutcome = this.checkWin(m[1],m[0]);
            this.isWin = winOutcome[0];
            this.winType = winOutcome[1];

            if (this.isWin){
                this.winner = this.player;
            }

            this.player = (1 + 2 - this.player);
            return true;
        } else {
            return false;
        }
    }

    getWin(){
        return this.isWin;
    }

    getWinType(){
        return this.winType;
    }

    getWinner(){
        return this.winner;
    }

    getValidMoves(){
        var validMoves = [];
        for (var i = 0; i < this.boardSize[0]; i++){
            const move = this.board.get(0,i);
            if (move === 0){
                validMoves.push(i);
            }
        }
        return validMoves;
    }

    getWinStatus(){
        return this.isWin;
    }

    getCurrentPlayer(){
        return this.player;
    }

    getBoard(){
        return this.board;
    }

    setCurrentPlayer(player){
        this.player = player;
    }

    setBoard(board){
        this.board = board;
    }

    setBoardPosition(y, x, state){
        this.board[y][x] = state;
    }

    showBoard(){
        console.log(this.board);
        const title = '\n Four In A Row!\n\n';
        var columns = '  ';
        for (var i = 0; i < this.boardSize[1]; i++){
            columns += i.toString() + ' ';
        }
        var board = columns;

        this.board.forEach( (row) => {
            board += ' |';
            row.forEach( (i) => {
                if (i === 0){
                    board += ' ';
                } else {
                    board += i.toString();
                }
                board += '|';
            });
            board += '\n';
        });
        return title + board;
    }
}