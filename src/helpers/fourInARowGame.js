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
        var cBoard = new Four_In_A_Row();
        cBoard.setCurrentPlayer(this.player);
        cBoard.isWin = this.isWin;
        cBoard.winner = this.winner;
        cBoard.winType = this.winType;
        cBoard.setBoard(this.board.clone());
        return cBoard;
    }

    checkWin(){
        if (){

        }
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