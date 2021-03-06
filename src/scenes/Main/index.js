/**
 * Container of the Main Scene of the application
 * 
 */

// Dependencies
import React, { Component } from 'react';
import MainContent from './MainContent';
import SideBar from '../../components/SideBar';
import { Provider } from 'mobx-react';
import ListStore from '../../stores/ListStore';
import {
  observer,
  inject
} from 'mobx-react';
import './style.scss';

/**
 * Exports the Primary content of the Application
 *
 * @export
 * @class Main
 * @extends {Component}
 */
@inject('userStore')
@observer
export default class Main extends Component {
  render() {
    return (
      <Provider listStore={new ListStore(ListStore.modes.PRODUCTS, this.props.userStore)}>
        <div className='Main'>
          <div className='content'>
            <SideBar/>
            <MainContent/>
          </div>
        </div>
      </Provider>
    )
  }
}
