import React, { Component } from 'react';
import emptySquare from '../Images/boardSquareEmpty.jpeg';
import p1Square from '../Images/boardSquareP1.jpeg';
import p2Square from '../Images/boardSquareP2.jpeg';

export default class GameBoard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPlayer: null,
        }
    }

    setCurrentPlayer = (p) => {
        this.setState({currentPlayer: p});
    }

    // shouldComponentUpdate(nextProps){
    //     return this.props.currentPlayer !== nextProps.currentPlayer;
    // }

    decideSquareColor = (value) => {
        if (value === 1){
            return p1Square;
        } else if (value === 2){
            return p2Square;
        } else {
            return emptySquare;
        }
    }

    render() {
        let myGameBoard = [];
        for (let i = 0; i < this.props.boardSize[0]; i++){
            let row = [];
            for (let j = 0; j < this.props.boardSize[1]; j++){
                let imgSrc = this.decideSquareColor(this.props.game.board[i][j]);
                row.push(<td id={j} onClick={this.props.handleClick}>
                    <img id={j} src={imgSrc} alt="" height="63" width="70"/>
                </td>);
            }
            myGameBoard.push(<tr>{row}</tr>);
        }
        return(
            <table id='myGame' align="center" style={{backgroundColor: '#1e90ff'}}>
                <tbody>
                    {myGameBoard}
                </tbody>
            </table>
        );
    }
}