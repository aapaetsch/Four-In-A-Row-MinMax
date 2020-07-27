export function generateDiagonals() {
    let diagMap = {'-1': [], '-2':[]};
    let diags = [0, 1, 2, 3];
    for (const diag in diags){
        diagMap[diag.toString()] = [];
    }
    for (let i = 0; i <= 6; i++){
        let x = Number(i);
        let y = Number(i);
        for (const diag in diags){
            let newX = x + Number(diag);
            if (newX <= 6 && y <= 5){
                diagMap[diag.toString()].push([y, newX]);
            }
        }
        for (let j = -1; j > -3; j--){
            let newX = x + Number(j);
            if (newX <= 6 && y <= 5 && newX >= 0 && y >= 0){
                diagMap[j.toString()].push([y, newX]);
            }
        }
    }
    return diagMap
}
export function generateAntiDiagonals(){
    let diagMap = {'-1':[], '-2':[]};
    let diags = [0, 1, 2, 3];
    for (const diag in diags){
        diagMap[diag.toString()] = [];
    }
    for (let i = 0; i < 6; i++){
        let x = 6 - Number(i);
        let y = i;
        for (const diag in diags){
            let newX = x - Number(diag);
            if (newX <= 6 && newX >= 0 && y <= 5 && y >= 0){
                diagMap[diag.toString()].push([y, newX]);
            }
        }
        for (let j = -1; j > -3; j--){
            let newX = x - Number(j);
            if (newX <= 6 && y <= 5 && newX >= 0 && y >= 0){
                diagMap[j.toString()].push([y, newX]);
            }
        }
    }
    return diagMap;
}

function createBoard(){
    let gameArray = [];
    for (let i = 0; i < 6; i++){
        gameArray.push([0,0,0,0,0,0,0]);
    }
    return gameArray;
}

export default class Four_In_A_Row{
    constructor(diags, reverseDiags){
        this.player = 1;
        this.boardSize = [6,7];
        this.board = createBoard();
        this.isWin = false;
        this.winType = null;
        this.winner = null
        this.previousYX = null;
        this.diags = diags;
        this.reverseDiags = reverseDiags;
    }

    resetGame() {
        this.player = 1;
        this.board = createBoard();
        this.isWin = false;
        this.winType = null;
        this.winner = null;
        this.previousYX = null;

    }

    async copyState() {
        let cBoard = new Four_In_A_Row(this.diags, this.reverseDiags);
        cBoard.setCurrentPlayer(this.player);
        cBoard.isWin = this.isWin;
        cBoard.winner = this.winner;
        cBoard.winType = this.winType;
        cBoard.previousYX = this.previousYX;
        cBoard.board = [...this.board];
        return cBoard;
    }

    async checkWin(x, y){
        if (await this.checkInRow( this.board[y])){
            return [true, 'horizontal'];

        } else if (await this.checkInRow( this.board.map( (val) =>{return val[x]}))){
            return [true, 'vertical'];

        } else {

            const myLine = x - y;
            if ( -2 <= myLine && myLine <= 3 ){
                let diag = [];
                this.diags[myLine.toString()].forEach( (position) => {
                    diag.push(this.board[position[0]][position[1]]);
                });
                if (await this.checkInRow(diag)){
                    return [true, 'Diagonal LR'];
                }
            }

            const reverseLine = 6 - (y + x);
            if (-2 <= reverseLine && reverseLine <= 3){
                let reverseDiag = [];
                this.reverseDiags[reverseLine.toString()].forEach( (position) => {
                    reverseDiag.push(this.board[position[0]][position[1]]);
                });
                if (await this.checkInRow(reverseDiag)){
                    return [true, 'diagonal RL'];
                }
            }
            return [false, null];
        }
    }

    checkInRow = async (arr) => {
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

    async playMove(move){
        for (let i = this.boardSize[0] - 1; i >= 0; i--){
            if (this.board[i][move] === 0){
                this.setBoardPosition(i, move, this.player);
                this.previousYX = [i, move];
                return [i, move];
            }
        }
    }

    async turn(move){
        try{
            move = Number(move);
        } catch(error){
            return false;
        }
        if (move in await this.getValidMoves()){

            const m = await this.playMove(move);
            const winOutcome = await this.checkWin(m[1],m[0]);
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

    getWinType(){
        return this.winType;
    }

    getWinner(){
        return this.winner;
    }

    getWinStatus(){
        return this.isWin;
    }

    async getValidMoves(){
        let validMoves = [];
        for (let i = 0; i < this.boardSize[1]; i++){
            const move = this.board[0][i];
            if (move === 0){
                validMoves.push(i);
            }
        }
        return validMoves;
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

}