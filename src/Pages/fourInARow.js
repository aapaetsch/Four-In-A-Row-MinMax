import React, { Component } from 'react';
import {Card } from 'antd';
import {Four_In_A_Row} from "../helpers/fourInARowGame";
import 'antd/dist/antd.css';





export default class FourInARow extends Component {
    constructor(props){
        super(props);
        this.state = {

        }
    }
    componentDidMount(){
        console.log(this.props);
        const moveScores = require('./scores.json');
        const computerPlayer = new FourInARow(3, moveScores);
    }

    render() {
        return (
            <div className='mainDiv'>
                <Card title='Four In A Row!' className='verticalCenter'>

                </Card>
            </div>
        );
    }
}