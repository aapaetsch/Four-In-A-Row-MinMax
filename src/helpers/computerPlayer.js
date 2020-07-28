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

    findMove(gameState){
        this.heuristic = {0:0, 1:0, 2:0, 3:0, 4:0, 5:0, 6:0};
        this.saveData = {move: null, heuristic: null, moveData: [], board: null};

        this.tt = new TranspositionTable();
        let rootState = gameState.copyState();
        this.ComputerPlayer = rootState.getCurrentPlayer();

        this.zobristInit(rootState);
        this.moveScores = {};

        let alpha = -1000000000000000000000000000.0;
        let beta = 100000000000000000000000000000.0;
        const moveData = this.alphaBetaGetMove(alpha, beta, this.maxDepth, rootState);
        this.saveData.heuristic = this.heuristic;//Not sure if this even will show anything useful

        this.saveData.board = rootState.getBoard();
        message.success({content: 'Move Found', key:'search'}, 1);
        if (moveData[1] != null){
            this.saveData.move = moveData[1];
            return [moveData[1], this.saveData];

        } else {
            const validMoves = rootState.getValidMoves();
            const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
            this.saveData.move = randomMove;
            return [randomMove, this.saveData];
        }
    }

    alphaBetaGetMove =  (alpha, beta, depth, gameState) => {
        let legalMoves = this.getMoveOrder(gameState.getValidMoves());
        let bestMove = null;

        for (let i = 0; i < legalMoves.length; i++){
            if (legalMoves[i] === 3){
                legalMoves.splice(i,1);
                legalMoves = [3,...legalMoves];
                break;
            }
        }

        let newState = gameState.copyState();

        while (legalMoves.length !== 0){

            let move = legalMoves[0];
            legalMoves = legalMoves.slice(1,);
            let oldHash = this.hash;
            let previousYX = newState.previousYX;
            let m = newState.playMove(move);
            let y = m[0];
            let x = m[1];

            this.updateHash(this.hash, this.zobristArr[y][x][newState.getCurrentPlayer()], this.zobristArr[y][x][0]);
            this.changePlayer(newState);
            let value = -this.alphaBetaDL( -beta, -alpha, depth - 1, newState);

            if (value > alpha){
                alpha = value;
                bestMove = move;
            }

            console.log(value, move);
            this.moveScores[move.toString()] = value.toString();
            this.hash = oldHash;
            this.saveData.moveData.push([move, value]);
            this.undo(y, x, newState, previousYX);

            if (value >= beta){
                let d = this.maxDepth - (this.maxDepth - depth);
                this.heuristic[move] += Math.log(Math.pow(2, d));
                return [beta, bestMove]
            }

            legalMoves = this.getMoveOrder(legalMoves);
        }
        return [alpha, bestMove];
    }

    alphaBetaDL = (alpha, beta, depth, state) => {

        let result = this.tt.lookup(this.hash);
        if (result !== undefined){
            return result;
        }
        let legalMoves = state.getValidMoves();
        if ( this.isTerminal(legalMoves, state) || depth === 0){
            return this.evaluation(state);
        }
        legalMoves = this.getMoveOrder( state.getValidMoves());
        let gameState =  state.copyState();

        while (legalMoves.length !== 0){
            let move = legalMoves[0];
            let oldHash = this.hash;
            let previousYX = gameState.previousYX;
            let m =  gameState.playMove(move);
            let y = m[0];
            let x = m[1];

            this.updateHash(this.hash, this.zobristArr[y][x][gameState.getCurrentPlayer()], this.zobristArr[y][x][0]);
            this.changePlayer(gameState);

            let value =  -this.alphaBetaDL(-beta, -alpha, depth - 1, gameState);
            if (value > alpha){
                alpha = value;
            }

            this.hash = oldHash;
            this.undo(y, x, gameState, previousYX);

            if (value >= beta){
                let d = this.maxDepth - (this.maxDepth - depth);
                this.heuristic[move] += Math.pow(2,d);
                return this.updateTT(beta);
            }
            legalMoves = this.getMoveOrder(legalMoves.slice(1,));
        }
        return this.updateTT(alpha);
    }

    getMoveOrder =  (legalMoves) => {
        let tempHeuristic = [];
        for (let m = 0; m < legalMoves.length; m++){
            tempHeuristic.push({num: legalMoves[m], val: this.heuristic[legalMoves[m]]});
        }
        tempHeuristic.sort(function (a, b) {return a.val - b.val}).reverse();
        return tempHeuristic.map((k, v) => {
            return k.num;
        });
    }

    changePlayer = (gameState) => {
        gameState.setCurrentPlayer(3 - gameState.getCurrentPlayer());
    }

    undo =  (y, x, gameState, previous) => {
        this.changePlayer(gameState);
        gameState.board[y][x] = 0;
        gameState.previousYX = previous;
    }

    isTerminal =  (legalMoves, gameState) => {
        if (gameState.previousYX !== null){
            this.changePlayer(gameState);
            const winStatus =  gameState.checkWin(gameState.previousYX[1], gameState.previousYX[0]);
            this.changePlayer(gameState);

            if (winStatus[0] || legalMoves.length === 0){
                return true;
            }
        }
        return false;
    }

    evaluation =  (gameState) => {
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

        let s =  this.diagonalEvaluation(board, false);
        p1Score += s[0];
        p2Score += s[1];

        s =  this.diagonalEvaluation(board, true);
        p1Score += s[0];
        p2Score += s[1];

        if (cp === this.ComputerPlayer){
            if (cp === 1){
                if (p2Score >= 10000){p1Score = -p2Score}
                return parseFloat((p1Score).toFixed(3))
            } else {
                if (p1Score >= 10000){p2Score = -p1Score}
                return parseFloat((p2Score).toFixed(3));
            }
        } else {
            if (cp === 1){
                if (p2Score >= 10000){p1Score = -p2Score}
                return -parseFloat((p1Score).toFixed(3));
            }
            if (p1Score >= 10000){p2Score = -p1Score}
            return -parseFloat((p2Score).toFixed(3));
        }
    }

    diagonalEvaluation =  (board, isAnti) => {
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