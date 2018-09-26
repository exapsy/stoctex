/**
 * Scene Selector to pick the appropriate scene for the application
 * 
 */

// Dependencies
import React, { Component } from 'react';
import axios                from  'axios';
import {
  Dimmer,
  Loader,
  Header
}                           from 'semantic-ui-react';
import Login from './Login';
import Main  from './Main';
import api from '../config/api';

/**
 * Picks the most appropriate scene to show depending on the Application's state
 * If not logged in picks the Login scenery,
 * Else selects the Main Application's content to be shown
 *
 * @export
 * @class SceneSelector
 * @extends {Component}
 */
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

  /**
   * Handler for the Login button in the Login Scene
   * Depending on the success of the login request, the state of the component ought to be changed
   *
   * @param {{username: string, password: string}} userData
   * @memberof SceneSelector
   */
  async handleLoginSubmit(userData) {
    
    this.setState({isLoading: true});

    await axios.post(
      api.v1.http.auth.login,
      userData,
      { 
        withCredentials: true,
        headers: {
          "Access-Control-Allow-Origin":      '*',
          "Access-Control-Allow-Credentials": true
        }
      }
    )
    .then(value => {
      const loggedIn = value.data;

      // Show `wrong credentials` message for 3sec
      if(!loggedIn) {
        this.setState({wrongCredentialsError: true})
        setTimeout(() => this.setState({wrongCredentialsError: false}), 2000);
      }

      // Deactivates the dimmer
      this.setState({userData: loggedIn, isLoggedIn: loggedIn ? true : false, isLoading: false});
    })
    .catch(err => { this.triggerError(`Error on login request ${err.message}`) });
    //console.log('Error on login request', err)
  }
  
  /**
   *
   *
   * @memberof SceneSelector
   */
  componentDidMount() {
    if(!this.state.hasError){
      this.login();
    }
  }

  /**
   * Attempts to login with the current cookies on the client's side
   * If login is a success, then the components state changes to logged in
   * 
   * In any circumances, after the request has finished and no exception was thrown,
   *  the loading is deactivated allowing the user to enter his credentials
   *
   * @memberof SceneSelector
   */
  async login() {
    this.isLoggedIn()
    .then(value => {
      this.setState({isLoggedIn: value, isLoading: false})
    })
    .catch(err => { this.triggerError(`Error on checking if logged in : ${err.message}`) });
    //console.log('Error on checking if logged in', err)
  }

  /**
   * Checks if the user is currently logged in by making a request to the GPHub API
   *
   * @returns
   * @memberof SceneSelector
   */
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

  /**
   * Picks the most appropriate scene depending on if the user is logged in or not
   *
   * @returns
   * @memberof SceneSelector
   */
  getScene() {
    const scene = this.state.isLoggedIn ? 
    <Main/> :
    <Login onSubmit={this.handleLoginSubmit}/>;
  
    return (
      <div>
          {scene}
      </div>
    );
  }

  /**
   * Changes the component's error state to active
   *
   * @param {string} error
   * @memberof SceneSelector
   */
  triggerError(error) {
    this.setState({
      hasError : true,
      error: error.message ?
        error.message :
        error
    });
  }

  /**
   * Renders the most appropriate component depending on the login state
   *
   * @returns
   * @memberof SceneSelector
   */
  render() {
    if(this.state.hasError) throw new Error(this.state.error);

    return (
      <div className='scene'>
      
        {this.getScene()}

        <Dimmer active={this.state.isLoading && !this.state.hasError}>
          <Loader/>
        </Dimmer>
        <Dimmer active={this.state.wrongCredentialsError} style={{display: 'flex', flexDirection: 'column', textAlign: 'center', alignItems: 'center', justifyContent: 'center'}}>
          <Header as='h1' style={{color:'#f1f1f1'}}>Wrong Credentials</Header>
          <p style={{color: '#ff2222'}}>Username or Password is wrong, try again with other credentials</p>
        </Dimmer>
      </div>
    )
  }
}
