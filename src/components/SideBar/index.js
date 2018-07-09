import React, { Component } from 'react';
import axios                from 'axios';
import cookies              from 'react-cookies';

// LOCAL IMPORTS
import Search       from './Search';
import ProfileImage from '../../images/harvey.jpeg'
import api          from '../../config/rest';
import './style.scss'

export default class SideBar extends Component {
  constructor(props) {
    super(props);
    this.handleLogout = this.handleLogout.bind(this);
  }

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
      .then(value=> {
        cookies.remove('sessionID');
        window.location.reload();
      })
  }

  render() {
    return (
      <div className="sidebar w-col w-col-2">
        <div className="logo">
          <h1 className="logo-heading">STOCTEX</h1>
        </div>
        <div className="profile">
          <img src={ProfileImage} className="profile-image"/>
          <h4 className="profile-heading">
          Harvey<br/>
          Specter
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
