import React, { Component } from 'react';
import {Card } from 'antd';
import Four_In_A_Row from "../helpers/fourInARowGame";
import Animation from "../Components/gameBoard";
import './gameBoard.png';
import 'antd/dist/antd.css';

let parse = require("html-react-parser");


export default class FourInARow extends Component {
    constructor(props){
        super(props);
        this.state = {
            fourInARowGame: new Four_In_A_Row(),
        }
    }
    componentDidMount(){
        console.log(this.props);
        const moveScores = require('../helpers/scores.json');
        this.renderGame();
    }

    componentDidUpdate(){
        this.renderGame();
    }

    renderGame = () => {
        console.log(this.state.fourInARowGame.board);
        let myGameGUI = '<tbody>';
        for (let i = 0; i < this.state.fourInARowGame.boardSize[0]; i++){
            myGameGUI += '<tr>';
            for (let j = 0; j < this.state.fourInARowGame.boardSize[1]; j++){
                myGameGUI += '<td id=' + j.toString() + '><img src="./gameBoard.png" alt="" height=100 width=100 /></td>';
            }
            myGameGUI += '</tr>';
        }
        myGameGUI += '</tbody>';
        return myGameGUI;
    }





    render() {
        return (
            <div className='mainDiv'>
                <Card title='Four In A Row!' className='verticalCenter'>
                    <table id='myGame'>
                        {parse(this.renderGame())}
                    </table>
                    {/*<Animation board={this.state.fourInARowGame.board}/>*/}
                </Card>
            </div>
        );
    }
}