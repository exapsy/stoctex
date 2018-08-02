import React, { Component } from 'react';
import axios                from  'axios';

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
      this.setState({userData: value.data, isLoggedIn: undefined});
    });
  }
  
  componentDidMount() {
    this.login();
  }

  componentDidUpdate() {
    this.login();
  }

  login() {
    this.isLoggedIn()
    .then(value => {
      this.setState({isLoggedIn: value})
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
    return this.state.isLoggedIn === undefined ? 
    null 
    : this.state.isLoggedIn === false 
    ? <Login onSubmit={this.handleLoginSubmit}/>
    : <Main/>;
  }
  render() {
    return (
      <div className='Scene'>
        {this.getScene()}
      </div>
    )
  }
}
