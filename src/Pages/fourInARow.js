import React, { Component, createRef } from 'react';
import {Card, Button, Col, Row, Modal} from 'antd';
import Connect4Settings from "../Components/fourInARowSettings";
import FourInARowGame from "../Components/fourInARowGame";
import CPUStats from "../Components/computerStats";
import 'antd/dist/antd.css';

export default class FourInARow extends Component {
    constructor(props){
        super(props);
        this.state = {
            gutterSize: [8,20],
            moveList: [],
        }
        this.gameRef = createRef();
        this.cpuStatsRef = createRef();
    }


    setGameSettings = (values) =>{
        this.gameRef.current.newGame(values);
        this.setState({...values});
        this.cpuStatsRef.current.newGame();
    }

    getMoveData = () => {
        let moveData = this.gameRef.current.sendMoveData();
        return [this.state, moveData[0], moveData[1]];
    }

    getLastMove = (move) => {
        let mL = this.state.moveList;
        mL.push(move);
        this.setState({moveList: mL}, () => {
            this.cpuStatsRef.current.formatMoveData(this.state.moveList, [this.state.player1, this.state.player2]);
        });
    }


    render() {

        return (
            <div className='mainDiv'>
                <br/><br/><br/>
                <Row
                    justify='center'
                    gutter={this.state.gutterSize}
                >
                    <Col className='gutter-row' span={6}>
                        <Card title='Game Settings'>
                            <Connect4Settings startGame={this.setGameSettings} />
                        </Card>
                    </Col>
                    <Col className='gutter-row' span={10}>
                        <FourInARowGame ref={this.gameRef} getLastMove={this.getLastMove}/>
                    </Col>
                    {/*<Col className='gutter-row' span={6}>*/}
                    {/*    <Card title='Computer Stats'>*/}
                    {/*        <CPUStats getMoveData={this.getMoveData} ref={this.cpuStatsRef}/>*/}
                    {/*    </Card>*/}
                    {/*</Col>*/}
                </Row>
            </div>
        );
    }
}