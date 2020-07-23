import React, {Component} from 'react';
import {Button, Card} from 'antd';
import {Link} from 'react-router-dom';
import { UserOutlined, TeamOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';
import './pageStyles.css';


export default class Landing extends Component {
    constructor(props){
        super(props);
        this.state = {
            showComputerOptions: false,
            buttonSize: 'large'
        }
    }

    setGameMode = (cpu, players) =>{
        const gameMode = {
            players: players,
            cpuLvl: cpu
        }
        this.props.setMode(gameMode);
    }

    showComputerOptions = () =>{
        this.setState({showComputerOptions: true});
    }

    componentWillUnmount() {
        this.setState({showComputerOptions: false});
    }

    startTwoPlayerGame = () => {
        this.setGameMode('None', 2);
    }

    render() {
        return (
            <div className='mainDiv'>
                <Card title={<h1>
                    Welcome to Connect 4
                </h1>} className='verticalCenter'>
                    <br/>
                    {this.state.showComputerOptions === false ?
                        (<div>
                            <Button
                                type='primary'
                                size={this.state.buttonSize}
                                shape='round'
                                icon={<UserOutlined/>}
                                onClick={this.showComputerOptions}>
                                One Player
                            </Button><br/><br/>
                            <Link to='/fourinarow'>
                                <Button
                                    type='primary'
                                    size={this.state.buttonSize}
                                    shape='round'
                                    icon={<TeamOutlined/>}
                                    onClick={this.startTwoPlayerGame}>
                                    Two Player
                                </Button>
                            </Link>
                        </div>)
                        :
                        (<div>
                            <h2>Select A Difficulty</h2><br/>
                            <Link to='/fourinarow'>
                                <Button
                                    type='Primary'
                                    size={this.state.buttonSize}
                                    shape='round'
                                    style={{backgroundColor:'green', borderColor:'green', color: 'white'}}
                                    onClick={() => this.setGameMode('easy', 1)}>
                                    Easy
                                </Button>
                            </Link>
                            <br/>
                            <Link to='/fourinarow'>
                                <Button
                                    type='Primary'
                                    size={this.state.buttonSize}
                                    shape='round'
                                    style={{backgroundColor:'yellow', borderColor:'yellow'}}
                                    onClick={() => this.setGameMode('medium', 1)}>
                                    Medium
                                </Button>
                            </Link>
                            <br/>
                            <Link to='/fourinarow'>
                                <Button
                                    type='Primary'
                                    size={this.state.buttonSize}
                                    shape='round'
                                    style={{backgroundColor: 'Red', borderColor:'Red', color: 'white'}}
                                    onClick={() => this.setGameMode('hard', 1)}>
                                    Hard
                                </Button>
                            </Link>
                        </div>)
                    }
                </Card>
            </div>
        );
    }

}
