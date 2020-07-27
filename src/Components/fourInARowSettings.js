import React, { Component, createRef } from 'react';
import { message, Button, Form, Select} from 'antd';
import p1Token from '../Images/p1Token.jpeg';
import p2Token from '../Images/p2Token.jpeg';
const { Option } = Select;

export default class Connect4Settings extends Component {
    constructor(props){
        super(props);
        this.state = {
            error: null,
            showCPU1: false,
            showCPU2: false,
        }
        this.formRef = createRef();
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async handleSubmit(values){
        this.props.startGame(values);
    }
    fieldChange = (value, e) =>{
        if (e[0].value === "cpu"){
            this.setState({showCPU1: true});
        } else {
            this.setState({showCPU1: false});
        }

        if (e[3].value === 'cpu'){
            this.setState({showCPU2: true});
        } else {
            this.setState({showCPU2: false})
        }

    }

    render(){
        const onFinishFailed = errorInfo =>{
            message.error('There was an error starting the game.');
        }
        const formItemLayout ={
            labelCol: {
                xs: {span:24},
                sm: {span:8},
            },
            wrapperCol: {
                xs: {span:24},
                sm: {span:18}
            }
        }
        return (
          <Form
              {...formItemLayout}
              name='Four_In_A_Row_Settings'
              ref={this.formRef}
              initialValues={{player1: 'human', player2: 'human', cpu1Diff: 'easy', cpu2Diff: 'easy',
                                cpu1Search: 'negaAB', cpu2Search: 'negaAB'}}
              onFinish={this.handleSubmit}
              onFinishFailed={onFinishFailed}
              onFieldsChange={this.fieldChange}
          >
              <Button
                  type='primary'
                  htmlType='submit'
                  shape='round'
              >
                  New Game
              </Button>
              <br/><br/>
              <Form.Item name='player1'
                         label={<span>
                                    <img src={p1Token} alt="" width="18" height="18"/>
                                    &nbsp; Player 1
                                </span>}>
                  <Select>
                      <Option value='human'>Human</Option>
                      <Option value='cpu'>Computer</Option>
                  </Select>
              </Form.Item>
              <Form.Item name='cpu1Diff'
                         label='Cpu1 Difficulty: ' >
                  <Select disabled={!this.state.showCPU1}>
                      <Option value='easy'>Easy</Option>
                      <Option value='med'>Medium</Option>
                      <Option value='hard'>Hard</Option>
                  </Select>
              </Form.Item>
              <Form.Item name='cpu1Search'
                         label='Cpu1 Algorithm: '>
                  <Select disabled={!this.state.showCPU1}>
                      <Option value='negaAB'>NegaMax AB</Option>
                      <Option value='mcts' disabled>Monte Carlo Simulation</Option>
                      <Option value='pureRL' disabled>Pure RL</Option>
                  </Select>
              </Form.Item>
              <br/><br/>
              <Form.Item name='player2'
                         label={<span>
                                    <img src={p2Token} alt="" width="18" height="18"/>
                             &nbsp; Player 2
                                </span>}>
                  <Select>
                      <Option value='human'>Human</Option>
                      <Option value='cpu'>Computer</Option>
                  </Select>
              </Form.Item>
              <Form.Item name='cpu2Diff'
                         label='Cpu2 Difficulty: ' >
                  <Select disabled={!this.state.showCPU2}>
                      <Option value='easy'>Easy</Option>
                      <Option value='med'>Medium</Option>
                      <Option value='hard'>Hard</Option>
                  </Select>
              </Form.Item>
              <Form.Item name='cpu2Search'
                         label='Cpu2 Algorithm: '>
                  <Select disabled={!this.state.showCPU2}>
                      <Option value='negaAB'>NegaMax AB</Option>
                      <Option value='mcts' disabled>Monte Carlo Simulation</Option>
                      <Option value='pureRL' disabled>Pure RL</Option>
                  </Select>
              </Form.Item>
              <br/>
          </Form>
        );
    }

}