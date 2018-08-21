/**
 * Container of the Main Scene of the application
 * 
 */

// Dependencies
import React, { Component } from 'react';
import MainContent  from './MainContent';
import SideBar        from '../../components/SideBar';
import './style.scss';

/**
 * Exports the Primary content of the Application
 *
 * @export
 * @class Main
 * @extends {Component}
 */
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
