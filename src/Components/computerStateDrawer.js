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
    }

    hideDrawer = () => {
        this.setState({visible: false});
    }

    displayStateHistory = () =>{
        let gameHistory = this.props.getStateHistory();

    }


    render () {
        return (
            <div>
                <Space>
                    <Button type='primary' disabled={!this.props.cpu1}>
                        Computer 1 History
                    </Button>
                    <Button type='primary' disabled={!this.props.cpu2}>
                        Computer 2 History
                    </Button>
                </Space>
                <Drawer
                    visible={this.state.visible}
                    placement='left'
                    onClose={this.hideDrawer}
                >
                    <p>some Content</p>
                </Drawer>
            </div>
        );
    }
}