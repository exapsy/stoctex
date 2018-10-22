/**
 * Login Scenery for when the user is not logged in
 * 
 */

// Dependencies
import React, { Component } from 'react';
import './style.scss';

/**
 * Login Scenery to show when the user is not logged in
 *
 * @export
 * @class Login
 * @extends {Component}
 */
export default class Login extends Component {
  /**
   *Creates an instance of Login.
   * @memberof Login
   */
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
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
    if(this.props.onSubmit) {
      this.props.onSubmit(
        {
          username: event.target.username.value, 
          password: event.target.password.value
        }
      );
    } else {
      console.error('No external login submit button handler was provided for the Login Scene')
    }
    
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
      </div>
    );
  }
}
