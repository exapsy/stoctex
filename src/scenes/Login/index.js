/**
 * Login Scenery for when the user is not logged in
 * 
 */

// Dependencies
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Dimmer, Header, Loader } from 'semantic-ui-react';
import './style.scss';

/**
 * Login Scenery to show when the user is not logged in
 *
 * @export
 * @class Login
 * @extends {Component}
 */
@inject('userStore')
@observer
export default class Login extends Component {
  /**
   *Creates an instance of Login.
   * @memberof Login
   */
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = { loginLoading: false, wrongCredentials: false };
  }

  /**
   * Handler for the Login Submit button
   * Calls the external Handler if provided
   *
   * @param {Event} event
   * @memberof Login
   */
  handleSubmit(event) {
    event.preventDefault();

    // User Credentials
    const username = event.target.username.value;
    const password = event.target.password.value;

    // Setting loader
    this.setState({loginLoading: true})

    this.props.userStore.login(username, password)
      .then(loggedIn => {
        // Resetting loader
        this.setState({loginLoading: false});

        // Show error message if credentials were unauthorized
        if(!loggedIn) {
          this.setState({wrongCredentials: true});
          setTimeout(() => {
            this.setState({wrongCredentials: false});
          }, 2000);
        }
      })
      .catch(err => {
        throw new Error('Error occured on logging in:', err);
      });
  }

  /**
   * Renders the Login scene
   *
   * @returns
   * @memberof Login
   */
  render() {
    return (
      <div className="login-body">
        <div className="container w-container">
          <div className="login-headers">
            <h1 className="heading-3">GP Hub</h1>
            <h2 className="heading-4">Services</h2>
          </div>
          <div className="login-block">
            <div className="form-block w-form">
              <form id="login-form" name="login-form" className="form" onSubmit={this.handleSubmit}>
                <input 
                  type="text" 
                  className="text-field w-input" 
                  maxLength="256" 
                  autoFocus={true} 
                  name="username" 
                  placeholder="Username" 
                  id="username"/>
                <input 
                  type="password" 
                  className="text-field-2 w-input" 
                  maxLength="256" 
                  name="password" 
                  placeholder="Password" 
                  id="password"
                  required=""/>
                <input 
                  type="submit" 
                  value="Login" 
                  className="login-button w-button"/>
              </form>
            </div>
            <div className="div-block">
              <p className="paragraph-2">Copyrights © GPSupplies 2018-2019</p>
            </div>
          </div>
        </div>
        <Dimmer className='wrong-credentials-dimmer' active={this.state.wrongCredentials}>
          <Header as='h1'>Wrong Credentials</Header>
          <p>Username or Password is wrong, try again with other credentials</p>
        </Dimmer>
        <Dimmer className='login-loader' active={this.state.loginLoading}>
          <Loader/>
        </Dimmer>
      </div>
    );
  }
}
