import React, { Component } from 'react';
import { Table, Space, Button } from 'antd';
import ComputerStateDrawer from "./computerStateDrawer";

export default class CPUStats extends Component {
    constructor(props){
        super(props);
        this.state = {
            moveData: [],
            showLoading: true,

        }
    }

    newGame = () =>{
        this.setState({moveData: [], showLoading: true});
    }


    formatMoveData = (data, whoCPU) => {
        console.log(data);
        let p1 = false;
        let p2 = false;

        if (whoCPU[0] === 'cpu'){
            p1 = true
        }

        if (whoCPU[1] === 'cpu'){
            p2 = true;
        }

        this.setState({player1: p1, player2: p2});
        let newMoveData = [];
        let player = {0: 1, 1: 2};
        for (let i = 0; i < data.length; i++){
            newMoveData.push({p:player[i%2], m: data[i], t:i+1})
        }
        this.setState({moveData: newMoveData, showLoading: false});
    }

    getStateHistory = () => {
        //call this function when buttons are pressed to create the state history map
        return this.props.getMoveData();
    }

    render () {
        const columns = [
            {//Maybe render the color instead later
                title: 'Player',
                dataIndex: 'p',
                width: 5,
            },
            {
                title: 'Move',
                dataIndex: 'm',
                width: 5
            },
            {
                title: 'Turn',
                dataIndex: 't',
                width:5
            }
        ]

        return (
            <div>
                <Table
                    scroll={{y:100}}
                    columns={columns}
                    dataSource={this.state.moveData}
                    loading={this.state.showLoading}
                    size='small'
                    pagation={{defaultPageSize: 42, disabled:true}}/>
                    <ComputerStateDrawer
                        getStateHistory={this.getStateHistory}
                        cpu1={this.state.player1}
                        cpu2={this.state.player2}/>
            </div>
        );
    }
}