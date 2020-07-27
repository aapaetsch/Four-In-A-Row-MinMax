import React, { Component, createRef } from 'react';
import {Card, notification, message} from 'antd';
import p1Token from '../Images/p1Token.jpeg';
import p2Token from '../Images/p2Token.jpeg';
import Four_In_A_Row, {generateAntiDiagonals, generateDiagonals} from "../helpers/fourInARowController";
import FourInARow_AB from '../helpers/computerPlayer';
import GameBoard from "./gameBoard";
import 'antd/dist/antd.css';

let moveScores = require('../helpers/scores.json')

export default class FourInARowGame extends Component {
    constructor(props){
        super(props);
        this.state = {
            currentPlayer: null,
            gameClickable: false,
            player1: null,
            player2: null,
            cpu1Diff: null,
            cpu2Diff: null,
            cpu1: null,
            cpu2: null,
            winner: null,
            typeOfWin: null,
            gutterSize: [8,8]
        }
        this.fourInARowGame = new Four_In_A_Row(generateDiagonals(), generateAntiDiagonals());
    }

    componentDidUpdate(){
        if (this.state.currentPlayer === 1 && this.state.player1 === 'cpu'){
            this.computerTurn(this.state.cpu1);
        } else if (this.state.currentPlayer === 2 && this.state.player2 === 'cpu'){
            this.computerTurn(this.state.cpu2);
        }
    }

    newGame = (values) => {
        this.setState({...values, currentPlayer: null, cpu1: null, cpu2: null}, () => {
            this.fourInARowGame.resetGame();
            console.log(this.state);
            this.setState({cpu1: new FourInARow_AB(this.difficultyDepth(this.state.cpu1Diff), moveScores),
                cpu2: new FourInARow_AB(this.difficultyDepth(this.state.cpu2Diff), moveScores)}, () => {
                this.setState({currentPlayer: this.fourInARowGame.getCurrentPlayer(),
                    winner: null, typeOfWin: null, gameClickable: true
                });
            });
        });
        message.success("A new game has started!");
    }

    difficultyDepth = (val) =>{
        if (val === 'easy'){
            return 1;
        } else if (val === 'medium'){
            return 5;
        }
        return 9;
    }

    playATurn = (move) => {
        if ((this.state.currentPlayer === 1 && this.state.player1 === 'human' ) ||
            (this.state.currentPlayer === 2 && this.state.player2 === 'human')){
            this.setMove(move);
        }
    }

    computerTurn = async (cpu) => {
        if (this.state.winner === null){
            cpu.findMove(this.fourInARowGame).then( (move) => {
                this.setMove(move);
            });
        }
    }

    setMove = (move) =>{
        let isLegalTurn = this.fourInARowGame.turn(move);
        if (isLegalTurn) {
            let isWin = this.fourInARowGame.getWinStatus();
            if (isWin) {
                this.setState({
                    gameClickable: false,
                    typeOfWin: this.fourInARowGame.getWinType(),
                    winner: this.fourInARowGame.getWinner()
                }, () => {
                    this.winNotification();
                });
            }
            this.setState({
                currentPlayer: this.fourInARowGame.getCurrentPlayer(),
            });
        }
    }

    winNotification = () => {
        let t = undefined;
        if (this.state.winner === 1){
            t = this.state.player1;
        } else {
            t = this.state.player2;
        }
        notification.info({
            message: `Winner is: Player ${this.state.winner}`,
            description: (
                <span>
                    Win Type: {this.state.typeOfWin}<br/>
                    Player Type: {t}
                </span>),
            duration: null,
        });
    }


    handleClick = (e) => {
        console.log('click col:', e.target.id);
        if (this.state.gameClickable && e.target.id >= 0 && e.target.id <= 6){
            this.playATurn(e.target.id);
        }
    }

    displayTurn = () => {
        let imgSrc = null;
        if (this.state.currentPlayer === 1){
            imgSrc = p1Token;
        } else if (this.state.currentPlayer === 2){
            imgSrc = p2Token;
        } else { return <div/>}
        return (
            <h2>
                <img src={imgSrc} alt='' width='40' height='40'/>
                &nbsp; Player {this.state.currentPlayer} Turn
            </h2>
        );
    }

    render() {
        const whosTurn = this.displayTurn();
        return (
            <Card title={'Four In A Row!'}>
                {whosTurn}<br/>
                <GameBoard
                    currentPlayer={this.state.currentPlayer}
                    game={this.fourInARowGame}
                    boardSize={this.fourInARowGame.boardSize}
                    handleClick={this.handleClick}/>
            </Card>

        );
    }
}