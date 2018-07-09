import React, { Component } from 'react';
import cookies from 'react-cookies';

// LOCAL IMPORTS
import Login from './Login';
import Main  from './Main';

export default class SceneSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {userData: {}, isLoggedIn: false};
    this.getScene          = this.getScene.bind(this);
    this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
  }

  handleLoginSubmit(userData) {
    this.setState({userData: userData, isLoggedIn: cookies.load('connect.sid') ? true : false});
  }
  
  componentDidMount() {
    this.setState({isLoggedIn: cookies.load('connect.sid') ? true : false})
  }

  componentDidUpdate(prevProps, prevState) {
    if(!cookies.load('connect.sid') && prevState.isLoggedIn) {
      this.setState({isLoggedIn: false})
    }
  }

  getScene() {
    return this.state.isLoggedIn ? <Main/> : <Login onSubmit={this.handleLoginSubmit}/>;
  }
  render() {
    return (
      <div className='Scene'>
        {this.getScene()}
      </div>
    )
  }
}
