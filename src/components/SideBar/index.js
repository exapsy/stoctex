/**
 * Sidebar Menu to show all the general purpose actions like Search and the account profile
 * 
 */

// Dependencies
import React, { Component } from 'react';
import axios                from 'axios';
import map                  from 'lodash/map';
import Search               from './Search';
import PageSearch           from './PageSearch';
import ProfileImage         from '../../images/germanos_prof.jpeg'
import api                  from '../../config/api';
import './style.scss'
import Actions from './Actions';
import Information from './Information';

/**
 * Grid menu and navigation component to be shown at the left side in the GUI
 * Current features:
 *  - Search
 *  - Profile Picture TODO: To be fetched from the database when available
 *  - Logout button
 *  - TODO: Online Members
 *
 * @export
 * @class SideBar
 * @extends {Component}
 */
export default class SideBar extends Component {

  /**
   *Creates an instance of SideBar.
   * @param {*} props
   * @memberof SideBar
   */
  constructor(props) {
    super(props);

    this.state = {
      displayName: 'Username',
      isLoggedIn: false,
      hasError: false,
      error: null
    };

    this.handleLogout = this.handleLogout.bind(this);
  }

  /**
   * 
   *
   * @memberof SideBar
   */
  componentDidMount() {
    // Get user's displayName and initiate the displayName's state
    this.getUserDisplayName()
      .then(value => this.setState({displayName: value}))
      .catch(err => this.triggerError(`Couldn't get display name : ${err}`));

  }

  /**
   * Handler when the user pushes the Logout button
   * @param {Event} event
   * @memberof SideBar
   */
  handleLogout(event) {
    event.preventDefault();
    axios.get(
      api.v1.http.auth.logout,
      {
        withCredentials: true,
        headers: {
          "Access-Control-Allow-Origin":      '*',
          "Access-Control-Allow-Credentials": true
        }
      }
    )
      .then(value => window.location.reload())
      .catch(err => this.triggerError(`Could not logout : ${err}`));
  }

  /**
   * Fetches the current user's display name and returns a JSX including it
   * 
   * @async
   * @returns {Promise<string>} HTML Markup for display name
   * @memberof SideBar
   */
  getUserDisplayName() {
    return new Promise((resolve, reject) => {
      axios.get(api.v1.http.auth.profile, 
        {
          withCredentials: true, 
          headers: {
            "Access-Control-Allow-Origin":      '*',
            "Access-Control-Allow-Credentials": true
          } 
        }
      )
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
            reject('Profile not existant or a CORS issue appeared');
          }
          
        })
        .catch(err => reject(err));
    });
  }

  /**
   * Changes the error state to active
   *
   * @param {string} error
   * @memberof SideBar
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
   * Renders the component
   *
   * @returns
   * @memberof SideBar
   */
  render() {
    // TODO: check wtf has happened here
    // let displayName = this.getUserDisplayName();

    // Throw error in case the state is in error mode
    if(this.state.hasError) throw new Error(this.state.error);

    return (
      <div className="sidebar w-col w-col-2">
        <div className="logo">
          <h1 className="logo-heading">STOCTEX</h1>
        </div>
        <div className="profile">
          {/* <img alt="profile" src={ProfileImage} className="profile-image"/> */}
          <h4 className="profile-heading">
            {this.state.displayName}
          </h4>
          <a href='#logout' onClick={this.handleLogout} className="link w-button">LOGOUT</a>
        </div>
        <Search updateList={this.props.updateList}/>
        <PageSearch/>
        <Actions/>
        <Information/>
        {/* <div>
          <p>
          Copyrights(c) 2017-2018<br/>
          GPSupplies
          </p>
        </div> */}
      </div>
    )
  }
}
