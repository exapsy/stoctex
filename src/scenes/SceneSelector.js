import React, { Component } from 'react';
import axios                from  'axios';
import {
  Dimmer,
  Loader
}                           from 'semantic-ui-react';

// LOCAL IMPORTS
import Login from './Login';
import Main  from './Main';
import api from '../config/api';

export default class SceneSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {userData: {}, isLoggedIn: false};
    this.getScene          = this.getScene.bind(this);
    this.handleLoginSubmit = this.handleLoginSubmit.bind(this);

    this.state = {
      isLoading: true, 
      isLoggedIn: false,
      hasError: false,
      error: null
    };
  }

  async handleLoginSubmit(userData) {
    
    this.setState({isLoading: true});

    await axios.post(
      api.v1.http.auth.login,
      userData,
      { 
        withCredentials: true,
        headers: 
        {
          "Access-Control-Allow-Origin": 'https://localhost:8000',
        }
      }
    )
    .then(value => {
      this.setState({userData: value.data, isLoggedIn: value ? true : false, isLoading: false});
    })
    .catch(err => { this.triggerError(`Error on login request ${err.message}`) });
    //console.log('Error on login request', err)
  }
  
  componentDidMount() {
    
  }

  async login() {
    let err = false;
    this.isLoggedIn()
    .then(value => {
      this.setState({isLoggedIn: value, isLoading: false})
    })
    .catch(err => { this.triggerError(`Error on checking if logged in : ${err.message}`) });
    //console.log('Error on checking if logged in', err)
  }

  isLoggedIn() {
    
    return new Promise((resolve, reject) => {
      axios.get(
        api.v1.http.auth.isLoggedIn,
        { 
          withCredentials: true,
          
          headers: {
            "Access-Control-Allow-Origin":      '*',
            "Access-Control-Allow-Credentials": true
          }
        }
      )
      .then(value => {
        resolve(value.data);
      })
      .catch(err => {
        reject(err);
      });
    });
  }

  getScene() {
    this.login();
    const scene = this.state.isLoggedIn ? 
    <Main/> :
    <Login onSubmit={this.handleLoginSubmit}/>;
  
    return (
      <div>
          {scene}
      </div>
    );
  }

  triggerError(error) {
    this.setState({
      hasError : true,
      error: error.message ?
        error.message :
        error
    });
  }

  
  render() {
    if(this.state.hasError) throw new Error(this.state.error);

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
