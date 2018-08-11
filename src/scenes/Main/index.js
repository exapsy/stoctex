// APIS & LIBRARIES
import React, { Component } from 'react';

// LOCAL IMPORTS
import MainContent  from './MainContent';
import SideBar        from '../../components/SideBar';
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
