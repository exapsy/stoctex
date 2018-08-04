import React, { Component } from 'react';
import axios                from  'axios';
import {
  Dimmer,
  Loader
}                           from 'semantic-ui-react';

// LOCAL IMPORTS
import Login from './Login';
import Main  from './Main';
import api from '../config/rest';

export default class SceneSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {userData: {}, isLoggedIn: false};
    this.getScene          = this.getScene.bind(this);
    this.handleLoginSubmit = this.handleLoginSubmit.bind(this);

    this.state = {isLoading: true, isLoggedIn: false};
  }

  async handleLoginSubmit(userData) {
    this.setState({isLoading: true});
    await axios.post(
      api.v1.auth.login,
      userData,
      { withCredentials: true,
        headers: {
          "Access-Control-Allow-Origin": 'https://localhost:8000',
        }
      }
    ).then(value => {
      this.setState({userData: value.data, isLoggedIn: value ? true : false, isLoading: false});
    });
  }
  
  componentDidMount() {
    this.login();
  }

  login() {
    this.isLoggedIn()
    .then(value => {
      this.setState({isLoggedIn: value, isLoading: false})
    });
  }

  isLoggedIn() {
    
    return new Promise((resolve, reject) => {
      axios.get(
        api.v1.auth.isLoggedIn,
        { withCredentials: true,
          
          headers: {
            "Access-Control-Allow-Origin":      '*',
            "Access-Control-Allow-Credentials": true
          }
        }
      ).then(value => {
        resolve(value.data);
      })
      .catch(err => {
        reject(err);
      });
    });
  }

  getScene() {
    const scene = this.state.isLoggedIn ? 
      <Main/> 
      : <Login onSubmit={this.handleLoginSubmit}/>;
    
    return (
      <div>
          {scene}
      </div>
    );
  }
  render() {
    return (
        <div className='scene'>
          {this.getScene()}

          <Dimmer active={this.state.isLoading}>
            <Loader/>
          </Dimmer>
        </div>
    )
  }
}
