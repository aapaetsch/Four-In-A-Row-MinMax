import {message} from 'antd';
import { generateDiagonals, generateAntiDiagonals } from './fourInARowController';
import gameBoard from "../Components/gameBoard";
let bigInt = require('big-integer');

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

export default class FourInARow_AB{
    constructor(maxDepth, scores){
        this.maxDepth = maxDepth;
        this.moveScores = {};
        this.score = scores;
        this.diags = generateDiagonals();
        this.antiDiags = generateAntiDiagonals();
    }

    async findMove(gameState){
        console.log(this.diags)
        this.tt = new TranspositionTable();
        let rootState = await gameState.copyState();
        this.ComputerPlayer = rootState.getCurrentPlayer();

        this.zobristInit(rootState);
        this.heuristic = {0:0, 1:0, 2:0, 3:0, 4:0, 5:0, 6:0};
        this.moveScores = {};

        let alpha = -1000000000000000000000000000.0;
        let beta = 100000000000000000000000000000.0;
        const moveData = await this.alphaBetaGetMove(alpha, beta, this.maxDepth, rootState);
        if (moveData[1] != null){
            return moveData[1];
        } else {
            const validMoves = await rootState.getValidMoves();
            return validMoves[Math.floor(Math.random() * validMoves.length)];
        }
    }

    alphaBetaGetMove = async (alpha, beta, depth, gameState) => {
        let legalMoves = await this.getMoveOrder(await gameState.getValidMoves());
        let d = this.maxDepth - (this.maxDepth - depth);
        let bestMove = null;

        for (let i = 0; i < legalMoves.length; i++){
            if (legalMoves[i] === 3){
                legalMoves.splice(i,1);
                legalMoves = [3,...legalMoves];
                break;
            }
        }

        while (legalMoves.length > 0){
            let newState = await gameState.copyState()
            console.log(legalMoves)
            let move = legalMoves.shift();
            let oldHash = this.hash;
            let previousYX = gameState.previousYX;
            let m = await newState.playMove(move);
            let y = m[0];
            let x = m[1];

            this.updateHash(this.hash, this.zobristArr[y][x][gameState.getCurrentPlayer()], this.zobristArr[y][x][0]);
            this.changePlayer(gameState);

            let value = await this.alphaBetaDL( -beta, -alpha, depth - 1, newState);
            value = -value;
            if (value > alpha){
                alpha = value;
                bestMove = move;
            }

            this.moveScores[move.toString()] = value.toString();
            this.hash = oldHash;
            newState.board = await this.undo(y, x, gameState, previousYX);

            if (value >= beta){
                this.heuristic[move] += Math.pow(2, d);
                return [beta, bestMove]
            } else {
                legalMoves = await this.getMoveOrder(legalMoves);
            }
        }
        return [alpha, bestMove];
    }

    alphaBetaDL = async(alpha, beta, depth, state) => {
        let result = this.tt.lookup(this.hash);
        if (result !== undefined){
            return result;
        }


        let d = this.maxDepth - (this.maxDepth - depth);

        let legalMoves = await this.getMoveOrder(await state.getValidMoves());
        if (await this.isTerminal(legalMoves, state) || depth === 0){
            return - await this.evaluation(state);
        }

        while (legalMoves.length !== 0){
            let gameState = await state.copyState();
            console.log(legalMoves, gameState.board)
            let move = legalMoves.shift();
            let oldHash = this.hash;
            let previousYX = gameState.previousYX;
            let m = await gameState.playMove(move);
            console.log(gameState.board, move)
            let y = m[0];
            let x = m[1];

            this.updateHash(this.hash, this.zobristArr[y][x][gameState.getCurrentPlayer()], this.zobristArr[y][x][0]);
            this.changePlayer(gameState);

            let value = await this.alphaBetaDL(-beta, -alpha, depth - 1, gameState);
            value = -value;
            if (value > alpha){
                alpha = value;
            }

            this.hash = oldHash;
            gameState.board = await this.undo(y, x, gameState, previousYX);

            if (value >= beta){
                this.heuristic[move] += Math.pow(2,d);
                return this.updateTT(beta);
            }

            legalMoves = await this.getMoveOrder(legalMoves);

        }
        return this.updateTT(alpha);
    }

    getMoveOrder = async (legalMoves) => {
        let tempHeuristic = [];
        for (let m = 0; m < legalMoves.length; m++){
            tempHeuristic.push({num: m, val: this.heuristic[legalMoves[m]]});
        }
        tempHeuristic.sort(function (a, b) {return a.val - b.val}).reverse();
        return tempHeuristic.map((k, v) => {
            return k.num;
        });
    }

    changePlayer = (gameState) => {
        gameState.setCurrentPlayer(3 - gameState.getCurrentPlayer());
    }

    undo = async (y, x, gameState, previous) => {
        this.changePlayer(gameState);
        console.log(y,x)
        gameState.board[y][x] = 0;
        console.log(gameState.board[y][x])
        gameState.previousYX = previous;
        return gameState.board
    }

    isTerminal = async (legalMoves, gameState) => {
        if (gameState.previousYX !== null){
            this.changePlayer(gameState);
            const winStatus = await gameState.checkWin(gameState.previousYX[1], gameState.previousYX[0]);
            this.changePlayer(gameState);

            if (winStatus[0] || legalMoves.length === 0){
                return true;
            }
        }
        return false;
    }

    evaluation = async (gameState) => {
        let cp = gameState.getCurrentPlayer();
        let board = gameState.getBoard();
        let p1Score = 0;
        let p2Score = 0;

        for (let row = 0; row < gameState.boardSize[0]; row++){
            let myRow = board[row];
            let s = this.score[myRow.length.toString()][this.getAddress(myRow)];
            p1Score += s[0];
            p2Score += s[1];
        }
        for (let col = 0; col < gameState.boardSize[1]; col++){
            let myCol = board.map((row) => {
                return row[col];
            });
            let s = this.score[myCol.length.toString()][this.getAddress(myCol)];
            p1Score += s[0];
            p2Score += s[1];
        }

        let s = await this.diagonalEvaluation(board, false);
        p1Score += s[0];
        p2Score += s[1];

        s = await this.diagonalEvaluation(board, true);
        p1Score += s[0];
        p2Score += s[1];

        if (this.ComputerPlayer === 1){
            return parseFloat((p1Score - p2Score * 1.1).toFixed(3));
        } else {
            return parseFloat((p2Score - p1Score * 1.1).toFixed(3));
        }
    }

    diagonalEvaluation = async (board, isAnti) => {
        let p1Score = 0;
        let p2Score = 0;
        const lengths = ['4','5','6','6','5','4'];
        const myLine = [-2,-1,0,1,2,3];
        for (let i = 0; i < 6; i++){
            let diag = [];
            if (!isAnti){
                this.diags[myLine[i].toString()].forEach( (pos) => {
                    diag.push(board[pos[0]][pos[1]]);
                });
            } else {
                this.antiDiags[myLine[i].toString()].forEach( (pos) => {
                    diag.push(board[pos[0]][pos[1]]);
                })
            }
            let s = this.score[lengths[i]][this.getAddress(diag)];
            p1Score += s[0];
            p2Score += s[1];
        }
        return [p1Score, p2Score]
    }

    zobristInit = (gameState) =>{
        let seen = {};
        this.zobristArr = [];
        for (let i = 0; i < gameState.boardSize[0]; i++){
            let zobristInnerArr = [];
            for (let j = 0; j < gameState.boardSize[1]; j++){
                let innerInner = [];
                for (let k = 0; k < 3; k++){
                    let randomBigInt = bigInt.randBetween(bigInt('30884758937998'), bigInt('9223372036854775807'));
                    while (seen[randomBigInt] !== undefined){
                        randomBigInt = bigInt.randBetween(bigInt('30884758937998'), bigInt('9223372036854775807'));
                    }
                    seen[randomBigInt] = true;
                    innerInner.push(randomBigInt);
                }
                zobristInnerArr.push(innerInner);
            }
            this.zobristArr.push(zobristInnerArr);
        }
        let board = gameState.getBoard();
        let c = 0;
        for (let row = 0; row < gameState.boardSize[0]; row++){
            for (let col = 0; col < gameState.boardSize[1]; col++){
                if (row === 0 && col  === 0){
                    this.hash = this.zobristArr[0][0][board[row][col]];
                } else {
                    this.hash = this.hash.xor(this.zobristArr[row][col][board[row][col]]);
                }
            }
        }
    }

    updateHash = (oldHash, XORin, XORout) => {
        this.hash = oldHash.xor(XORin).xor(XORout);
    }

    updateTT = (val) => {
        this.tt.store(this.hash, val);
        return val;
    }

    getAddress = (arr) => {
        return arr.toString();
    }



}