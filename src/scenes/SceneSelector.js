/**
 * Scene Selector to pick the appropriate scene for the application
 * 
 */

// Dependencies
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import {
  Dimmer,
  Loader,
} from 'semantic-ui-react';
import Login from './Login';
import Main from './Main';

/**
 * Picks the most appropriate scene to show depending on the Application's state
 * If not logged in picks the Login scenery,
 * Else selects the Main Application's content to be shown
 *
 * @export
 * @class SceneSelector
 * @extends {Component}
 */
@inject('userStore')
@observer
export default class SceneSelector extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false, 
      isLoggedIn: false,
      hasError: false,
      error: null
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if(!this.state.isLoading && this.props.userStore.isLoggedIn === undefined) {
      this.setState({isLoading: true});
    }
    else if(this.state.isLoading && this.props.userStore.isLoggedIn !== undefined) {
      this.setState({isLoading: false}); 
    }
  }
  
  
  /**
   * Picks the most appropriate scene depending on if the user is logged in or not
   *
   * @returns
   * @memberof SceneSelector
   */
  getScene() {
    const scene = this.props.userStore.isLoggedIn ?
      <Main/> :
      <Login/>;

    return (
      <div>
        {scene}
      </div>
    );
  }

  /**
   * Changes the component's error state to active
   *
   * @param {string} error
   * @memberof SceneSelector
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
   * Renders the most appropriate component depending on the login state
   *
   * @returns
   * @memberof SceneSelector
   */
  render() {
    if(this.state.hasError) throw new Error(this.state.error);

    return (
      <div className='scene'>
        {this.getScene()}

        <Dimmer active={this.state.isLoading && !this.state.hasError}>
          <Loader/>
        </Dimmer>
      
      </div>
    );
  }
}
