import React, { Component } from 'react';

// export default class GameBoard extends Component {
//     constructor(props) {
//         super(props);
//     }
//
//
//     render(){
//         return (
//             <canvas id='myGameBoard' width='300' height='300'/>
//         );
//     }
// }



export default class Animation extends React.Component {
    constructor(props) {
        super(props);
        this.state = { mouseX: 0, mouseY: 0 };
        this.updateAnimationState = this.updateAnimationState.bind(this);
    }

    componentDidMount() {
        this.rAF = requestAnimationFrame(this.updateAnimationState);

    }

    updateAnimationState() {
        // this.setState(prevState => ({ angle: prevState.angle + 1 }));
        this.setState({board: this.props.board });
        this.rAF = requestAnimationFrame(this.updateAnimationState);
    }

    componentWillUnmount() {
        cancelAnimationFrame(this.rAF);
    }

    render() {
        return <Canvas board={this.state.board} />;
    }
}
class Canvas extends Component {
    constructor(props){
        super(props);
        this.image = `url(../Images/gameBoard.png)`;
    }

    saveContext = (ctx) => {
        this.ctx = ctx;
        this.width = this.ctx.canvas.width;
        this.height = this.ctx.canvas.height;
    }

    componentDidUpdate() {
        // this.ctx.clearRect(0,0, this.width, this.height);
        // const { mousePos } = this.props.mouseXY;
        const { boardPositions } = this.props.board
        this.ctx.save();
        this.ctx.beginPath();
        // this.ctx.arc(mousePos[0], mousePos[1], 20, 0 , 2 * Math.PI, true);
        for (let i = 0; i < 6; i++){
            for (let j = 0; j < 7; j++){
                this.ctx.rect()
                this.ctx.addHitRegion({id: j});
            }
        }
        // this.ctx.fillStyle = '#cf1322';
        this.ctx.fill();
        // this.ctx.clearRect(0, 0, this.width, this.height);
        // this.ctx.translate(this.width / 2, this.height / 2);
        // this.ctx.rotate((angle * Math.PI) / 180);
        // this.ctx.fillStyle = '#4397AC';
        // this.ctx.fillRect(
        //     -this.width / 4,
        //     -this.height / 4,
        //     this.width / 2,
        //     this.height / 2
        // );
        this.ctx.restore();
    }

    render() {
        return <PureCanvas contextRef={this.saveContext}/>
    }


}

class PureCanvas extends Component {

    shouldComponentUpdate(){
        return false;
    }

    render() {
        return (
            <canvas
                width='300'
                height='300'
                ref={ node => node ? this.props.contextRef(node.getContext('2d')): null}
                />
        );
    }
}