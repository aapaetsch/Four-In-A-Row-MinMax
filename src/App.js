import React, { Component } from 'react';
import {
    Route,
    BrowserRouter as Router,
    Switch,
    Redirect
} from "react-router-dom";
import Landing from './Pages/Landing';
import FourInARow from "./Pages/fourInARow";
import logo from './logo.svg';
import './App.css';
import {message} from "antd";

function PublicRoute({ component: Component, ...rest}){
    return (
        <Route
            {...rest}
            render={ (props) => props.mode !== null
                ? <Component {...props} {...rest}/>
                : <Redirect to={'/landing'}/>
            }
        />
    );
}


export default class App extends Component {
    constructor(){
        super();
        this.state = {
            mode: null,
        }
    }

    setMode = (mode, gamePage) => {
        this.setState({mode: mode}, () => console.log(this.state.mode));
        console.log('click');
    }

    render(){
        return (
            <div className="App">
                <Router>
                    <Switch>
                        <Route exact path='/'
                               render={(props) => <Landing setMode={this.setMode}/>}/>
                        <PublicRoute
                            path='/fourinarow'
                            component={FourInARow}
                            mode={this.state.mode}/>
                    </Switch>
                </Router>
                {/*<FourInARow mode={this.state.mode}/>*/}
            </div>
        );
    }
}

