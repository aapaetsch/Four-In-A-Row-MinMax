import {message} from 'antd';
let nj = require('numjs');

class TranspositionTable{
    constructor(){
        this.visited = {}
    }

    store(hashValue, score){
        this.visited[hashValue] = score;
    }

    lookup(hashValue){
        return this.visited[hashValue];
    }
}

export class FourInARow_AB{
    constructor(maxDepth, scores){
        this.maxDepth = maxDepth;
        this.moveScores = {};
        this.score = scores;
    }


    findMove(gameState){
        this.tt = new TranspositionTable();
        let rootState = gameState.copyState();
        this.ComputerPlayer = rootState.getCurrentPlayer();

        this.zobristInit(rootState);
        this.heuristic = {0:0, 1:0, 2:0, 3:0, 4:0, 5:0, 6:0};
        this.moveScores = {};

        let alpha = -1000000000000000000000000000.0;
        let beta = 100000000000000000000000000000.0;
        const moveData = this.alphaBetaGetMove(alpha, beta, this.maxDepth, rootState);
        if (moveData[0] !== null){
            return moveData[0];
        } else {
            const validMoves = rootState.getValidMoves();
            return validMoves[Math.floor(Math.random() * validMoves.length)];
        }
    }

    alphaBetaGetMoves = (alpha, beta, depth, gameState) => {
        let legalMoves = this.getMoveOrder(gameState.getValidMoves());
        let d = this.maxDepth - (this.maxDepth - depth);
        let bestMove = null;

        for (let i = 0; i < legalMoves.length; i++){
            if (legalMoves[i] === 3){
                legalMoves.splice(i,1);
                legalMoves = [3] + legalMoves;
                break;
            }
        }

        while (legalMoves.length > 0){
            let move = legalMoves.pop();
            let oldHash = this.hash;
            let previousYX = gameState.previousYX;
            let m = gameState.playMove(move);

            this.updateHash(this.hash, this.zobristArr[y][x][gameState.getCurrentPlayer()], this.zobristArr[y][x][0]);
            this.changePlayer(gameState);

            let value = -this.alphaBetaDL( -beta, -alpha, depth - 1, gameState);
            if (value > alpha){
                alpha = value;
                bestMove = move;
            }

            this.moveScores[move.toString()] = value.toString();
            this.hash = oldHash;
            this.undo(y, x, gameState, previousYX);

            if (value >= beta){
                this.heuristic[move] += Math.pow(2, d);
                return [beta, bestMove]
            } else {
                legalMoves = this.getMoveOrder(legalMoves);
            }
        }
        return [alpha, bestMove];
    }

    alphaBetaDL(alpha, beta, depth, state){
        let result = this.tt.lookup(this.hash);
        if (result !== null){
            return result;
        }

        let gameState = state.copyState();
        let d = this.maxDepth - (this.maxDepth - depth);

        let legalMoves = this.getMoveOrder(gameState.getValidMoves());
        if (this.isTerminal(legalMoves, gameState) || depth === 0){
            return -this.evaluation(gameState);
        }

        while (legalMoves.length !== 0){
            let move = legalMoves.pop();
            let oldHash = this.hash;
            let previousYX = gameState.previousYX;
            let m = gameState.playMove(move);

            this.updateHash(this.hash, this.zobristArr[y][x][gameState.getCurrentPlayer()], this.zobristArr[y][x][0]);
            this.changePlayer(gameState);

            let value = -this.alphaBetaDL(-beta, -alpha, depth - 1, gameState);
            if (value > alpha){
                alpha = value;
            }

            this.hash = oldHash;
            this.undo(y, x, gameState, previousYX);

            if (value >= beta){
                this.heuristic[move] += Math.pow(2,d);
                return this.updateTT(beta);
            }

            legalMoves = this.getMoveOrder(legalMoves);
        }
        return this.updateTT(alpha);
    }

    getMoveOrder = (legalMoves) => {
        //TODO: how to sort
    }

    changePlayer = (gameState) => {
        gameState.setCurrentPlayer(3 - gameState.getCurrentPlayer());
    }

    undo = (y, x, gameState, previous) => {
        this.changePlayer(gameState);
        gameState.setBoardPosition(y, x, 0);
        gameState.previousYX = previous;
    }

    isTerminal = (legalMoves, gameState) => {
        if (gameState.previousYX !== null){
            this.changePlayer(gameState);
            const winStatus = gameState.checkWin({...gameState.previousYX});
            this.changePlayer(gameState);

            if (winStatus[0] || legalMoves.length === 0){
                return true;
            }
        }
        return false;
    }

    evaluation = (gameState) => {
        let cp = gameState.getCurrentPlayer();
        let board = gameState.getBoard();
        let p1Score = 0;
        let p2Score = 0;

        for (let row = 0; row < gameState.boardSize[0]; row++){
            let s = this.score[gameState.boardSize[1].toString()][this.getAddress(board[row])];
            p1Score += s[0];
            p2Score += s[1];
        }

        for (let col = 0; col < gameState.boardSize[1]; col++){
            let s = this.score[gameState.boardSize[0].toString][this.getAddress(board.slice([null, col]))];
            p1Score += s[0];
            p2Score += s[1];
        }

        let s = this.diagonalEvaluation(board);
        p1Score += s[0];
        p2Score += s[1];
        //TODO:Add BoardFlip
        s = this.diagonalEvaluation();
        p1Score += s[0];
        p2Score += s[1];

        if (this.ComputerPlayer === 1){
            return parseFloat((p1Score - p2Score * 1.1).toFixed(3));
        } else {
            return parseFloat((p2Score - p1Score * 1.1).toFixed(3));
        }
    }

    diagonalEvaluation = (board) => {
        let p1Score = 0;
        let p2Score = 0;
        const lengths = ['4','5','6','6','5','4'];
        const diags = [-2,-1,0,1,2,3];
        for (let i = 0; i < 6; i++){
            let s = this.score[length[i]][this.getAddress(nj.diag(board))]
        }
    }

}