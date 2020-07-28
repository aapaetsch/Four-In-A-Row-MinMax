import React, { Component } from 'react';
import { Space, Button, Drawer} from "antd";

export default class ComputerStateDrawer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
        }
    }

    showDrawer = () => {
        this.setState({visible: true});
        this.showme = this.displayStateHistory();

    }

    hideDrawer = () => {
        this.setState({visible: false});
    }

    displayStateHistory = () =>{
        let gameHistory = this.props.getStateHistory();
        return gameHistory
    }


    render () {
        return (
            <div>
                <Space>
                    <Button type='primary' disabled={!this.props.cpu1} onClick={this.showDrawer}>
                        Computer 1 History
                    </Button>
                    <Button
                        type='primary'
                        onClick={this.showDrawer}
                        disabled={!this.props.cpu2}>
                        Computer 2 History
                    </Button>
                </Space>
                <Drawer
                    visible={this.state.visible}
                    width={'30%'}
                    placement='left'
                    onClose={this.hideDrawer}
                >
                </Drawer>
            </div>
        );
    }
}