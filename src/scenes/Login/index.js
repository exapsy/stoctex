// LIBRARY & APIS
import React, { Component } from 'react';

// LOCAL IMPORTS
import './style.scss';

export default class Login extends Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.onSubmit(
      {
        username: event.target.username.value, 
        password: event.target.password.value
      }
    );
    
  }
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
                  autoFocus="true" 
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
