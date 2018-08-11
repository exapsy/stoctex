import React, { Component } from 'react';
import axios                from 'axios';
import map                  from 'lodash/map';

// LOCAL IMPORTS
import Search       from './Search';
import ProfileImage from '../../images/germanos_prof.jpeg'
import api          from '../../config/api';
import './style.scss'

export default class SideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {displayName: 'Username'};
    this.handleLogout = this.handleLogout.bind(this);
  }

  componentDidMount() {
    // Get user's displayName and initiate the displayName's state
    this.getUserDisplayName()
      .then(value => this.setState({displayName: value}))
      .catch(err => { throw new Error('Error on getting user\'s display name')});
  }

  /**
   * Handler when the user pushes the Logout button
   * @param {Event} event 
   */
  handleLogout(event) {
    event.preventDefault();
    axios.get(
      api.v1.auth.logout,
      {
        withCredentials: true,
        headers: {
          "Access-Control-Allow-Origin":      '*',
          "Access-Control-Allow-Credentials": true
        }
      }
    )
      .then(value => window.location.reload())
      .catch(err => { throw new Error('Could not logout'); });
  }

  /**
   * @async
   * @returns {Promise<string>} HTML Markup for display name
   */
  getUserDisplayName() {
    return new Promise((resolve, reject) => {
      axios.get(api.v1.auth.profile, 
        {
        withCredentials: true, 
        headers: {
          "Access-Control-Allow-Origin":      '*',
          "Access-Control-Allow-Credentials": true
        } 
      })
        .then(value => {

          // If data is not undefined then return JSX with displayname in it
          if(value.data) {

            // User's display name
            const displayName = (
              map(
                value.data.displayName.split(' '),
                (value, index) => {
                  return (
                    <span key={index}>
                      {value}
                      <br/>
                    </span>
                  )
              })
            );

            resolve(displayName);
          } else {
            reject('Profile not existant');
          }
          
        })
        .catch(err => reject(err));
    });
  }

  render() {
    // TODO: check wtf has happened here
    // let displayName = this.getUserDisplayName();
    return (
      <div className="sidebar w-col w-col-2">
        <div className="logo">
          <h1 className="logo-heading">STOCTEX</h1>
        </div>
        <div className="profile">
          <img alt="profile" src={ProfileImage} className="profile-image"/>
          <h4 className="profile-heading">
            {this.state.displayName}
          </h4>
          <a href='#logout' onClick={this.handleLogout} className="link w-button">LOGOUT</a>
        </div>
        <Search updateList={this.props.updateList}/>
        <div className="sidebar-content">
          <div className="footer">
            <p className="paragraph">
            Copyrights(c) 2017-2018<br/>
            GPSupplies
            </p>
          </div>
        </div>
      </div>
    )
  }
}
