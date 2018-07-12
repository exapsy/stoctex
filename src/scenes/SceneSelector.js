import React, { Component } from 'react';
import axios                from   'axios';

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
          "Access-Control-Allow-Origin":      '*',
          "Access-Control-Allow-Credentials": true
        }
      }
    ).then(value => {
      this.setState({userData: value.data, isLoggedIn: value.data === false ? false : true});
      console.log(value.data);  
    });
  }
  
  componentDidMount() {
    this.isLoggedIn()
      .then(value => {
        this.setState({isLoggedIn: value})
        console.log('isLoggedIn', value);
      })
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
