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
    this.state = {userData: {}, isLoggedIn: false, isLoading: true, };
    this.getScene          = this.getScene.bind(this);
    this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
  }

  async handleLoginSubmit(userData) {
    await axios.post(
      api.v1.auth.login,
      userData,
      { withCredentials: true,
        headers: {
          "Access-Control-Allow-Origin": 'https://localhost:8000',
        }
      }
    ).then(value => {
      this.setState({userData: value.data, isLoggedIn: value ? true : false});
    });
  }
  
  componentDidMount() {
    this.isLoggedIn()
      .then(isLoggedIn => {
        this.setState({isLoading: false, isLoggedIn})
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
    if(this.state.isLoading) {
      return (
        <div>
          <Dimmer active>
            <Loader />
          </Dimmer>
        </div>
      )
    }
    else if(this.state.isLoggedIn) {
      return (
        <Login/>
      )
    }
    else {
      return(
        <Main/>
      )
    }
  }
  render() {
    return (
      <div className='Scene'>
        <div>
          <Dimmer active>
            <Loader />
          </Dimmer>
        </div>
      </div>
    )
  }
}
