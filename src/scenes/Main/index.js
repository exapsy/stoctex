// APIS & LIBRARIES
import React, { Component } from 'react';
import axios                from 'axios';

// LOCAL IMPORTS
import MainContent  from './MainContent';
import SideBar        from '../../components/SideBar';
import rest           from '../../config/rest';
import './style.scss';

export default class Main extends Component {
  render() {
    return (
      <div className='Main'>
        <div className='content'>
          <SideBar/>
          <MainContent/>
        </div>
      </div>
    )
  }
}
