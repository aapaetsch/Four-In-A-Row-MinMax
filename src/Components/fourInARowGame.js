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
            gutterSize: [8,8],
        }
        this.fourInARowGame = new Four_In_A_Row(generateDiagonals(), generateAntiDiagonals());
        this.gameBoardRef = createRef();
        this.p1Data = [];
        this.p2Data = [];
    }

    componentDidUpdate(){
        if (this.state.currentPlayer === 1 && this.state.player1 === 'cpu' ){
            if (this.state.currentPlayer === this.fourInARowGame.getCurrentPlayer()){
                message.loading({content: `Computer ${this.state.currentPlayer} is searching....`,
                    key:'search' }, 0);

                setTimeout(() => {
                    this.computerTurn(this.state.cpu1)}, 1000);
            }

        } else if (this.state.currentPlayer === 2 && this.state.player2 === 'cpu'){
            if (this.state.currentPlayer === this.fourInARowGame.getCurrentPlayer()){
                message.loading({content: `Computer ${this.state.currentPlayer} is searching....`,
                    key:'search' }, 0);

                setTimeout( () => {
                    this.computerTurn(this.state.cpu2)}, 1000);

            }
        }
    }

    computerTurn = (cpu) => {
        console.log(this.state)
        if (this.state.winner === null){
            let searchData = cpu.findMove(this.fourInARowGame);
            if (this.fourInARowGame.getCurrentPlayer() === 1){
                this.p1Data.push(searchData[1]);
            } else {
                this.p2Data.push(searchData[1]);
            }

            let move = searchData[0];
            this.setMove(move, 'computer');
        }

    }

    newGame = (values) => {
        this.setState({...values, currentPlayer: null, cpu1: null, cpu2: null},
            () => {
                        this.fourInARowGame.resetGame();
                        console.log(this.state);
                        message.success("A new game has started!", 1);

                this.setState({cpu1: new FourInARow_AB(this.difficultyDepth(this.state.cpu1Diff), moveScores),
                                    cpu2: new FourInARow_AB(this.difficultyDepth(this.state.cpu2Diff), moveScores)},
                    () => {
                            this.setState({currentPlayer: this.fourInARowGame.getCurrentPlayer(),
                                                winner: null, typeOfWin: null, gameClickable: true
                            });
                 });
            });
    }

    difficultyDepth = (val) =>{
        if (val === 'easy'){
            return 3;
        } else if (val === 'medium'){
            return 5;
        }
        return 12;
    }

    playATurn = (move) => {
        if ((this.state.currentPlayer === 1 && this.state.player1 === 'human' ) ||
            (this.state.currentPlayer === 2 && this.state.player2 === 'human')){
            this.setMove(move, 'player', this.state.currentPlayer);
        }
    }

    setMove = (move, playerType) => {
        if (!this.checkMoveSender(playerType)){
            return
        }
        let isLegalTurn = this.fourInARowGame.turn(move);
        console.log(isLegalTurn);

        if (isLegalTurn) {
            this.setState({
                currentPlayer: this.fourInARowGame.getCurrentPlayer(),
            });

            this.gameBoardRef.current.setCurrentPlayer(this.fourInARowGame.getCurrentPlayer());

            if (this.fourInARowGame.getCurrentPlayer() === 1){
                this.p2Data.push(move);
            } else {
                this.p1Data.push(move);
            }
            this.props.getLastMove(move);
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


            if (this.fourInARowGame.getValidMoves().length === 0){
                this.setState({gameClickable: false});
                this.drawNotification();
            }
        }
    }

    checkMoveSender = (pType) => {
        if (pType === 'computer' && this.fourInARowGame.getCurrentPlayer() === 1 && this.state.player1 === 'cpu'){
            return true;
        }
        if (pType === 'computer' && this.fourInARowGame.getCurrentPlayer() === 2 && this.state.player2 === 'cpu'){
            return true;
        }
        if (pType === 'player'){
            return true;
        }
        return false

    }




    drawNotification = () => {
        notification.error({
           message: 'Draw',
           description: 'There are no remaining moves.',
            duration: null,
        });
    }

    winNotification = () => {

        let t = undefined;
        if (this.state.winner === 1){
            t = this.state.player1;
        } else {
            t = this.state.player2;
        }

        message.error({content: 'Game has ended.', key:'search'}, 1);

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

    sendMoveData = () => {
        return [this.p1Data, this.p2Data];
    }

    displayTurn = () => {
        let imgSrc = null;
        if (this.state.currentPlayer === 1){
            imgSrc = p1Token;
        } else if (this.state.currentPlayer === 2){
            imgSrc = p2Token;
        } else { return <div><br/><br/></div>}
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
                    ref={this.gameBoardRef}
                    game={this.fourInARowGame}
                    boardSize={this.fourInARowGame.boardSize}
                    handleClick={this.handleClick}/>
            </Card>

        );
    }
}