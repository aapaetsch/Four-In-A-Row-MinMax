import React, { Component, createRef } from 'react';
import {Card, Button, Col, Row, Modal} from 'antd';
import Connect4Settings from "../Components/fourInARowSettings";
import FourInARowGame from "../Components/fourInARowGame";
import 'antd/dist/antd.css';

export default class FourInARow extends Component {
    constructor(props){
        super(props);
        this.state = {
            gutterSize: [8,20],
        }
        this.gameRef = createRef();
    }


    setGameSettings = (values) =>{
        this.gameRef.current.newGame(values);
    }

    render() {

        return (
            <div className='mainDiv'>
                <br/><br/><br/>
                <Row
                    justify='center'
                    gutter={this.state.gutterSize}
                    align='middle'
                >
                    <Col className='gutter-row' span={6}>
                        <Card title='Game Settings'>
                            <Connect4Settings startGame={this.setGameSettings} />
                        </Card>
                    </Col>
                    <Col className='gutter-row' span={10}>
                        <FourInARowGame ref={this.gameRef}/>
                    </Col>
                    <Col className='gutter-row' span={6}>
                        <Card title='Computer Decisions?'>
                            <Button>
                                hello world
                            </Button>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}