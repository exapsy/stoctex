import React, { Component } from 'react';
import axios                from 'axios';
import map                  from 'lodash/map';

// LOCAL IMPORTS
import Search       from './Search';
import ProfileImage from '../../images/harvey.jpeg'
import api          from '../../config/rest';
import './style.scss'

export default class SideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {displayName: 'Username'};
    this.handleLogout = this.handleLogout.bind(this);
  }

  componentDidMount() {
    this.getUserDisplayName()
      .then(value => {
        this.setState({displayName: value});
      });
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
        window.location.reload();
      })
  }

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
          if(!value.data) {
            reject('Profile not existant');
          }
          const displayName = 
            (
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
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  render() {
    let displayName = this.getUserDisplayName();
    return (
      <div className="sidebar w-col w-col-2">
        <div className="logo">
          <h1 className="logo-heading">STOCTEX</h1>
        </div>
        <div className="profile">
          <img src={ProfileImage} className="profile-image"/>
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
