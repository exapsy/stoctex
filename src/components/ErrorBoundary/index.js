/**
 * Handles the Exceptions when thrown and not handled
 */

// Dependencies
import React, { Component } from 'react';
import {
  Dimmer
} from 'semantic-ui-react';
import './style.scss';

/**
 * Renders an Error Block which describes the error if an error was catched
 * Otherwise, returns the children components
 *
 * @export
 * @class ErrorBoundary
 * @extends {Component}
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
      info: null
    };
  }

  /**
   *
   *
   * @param {*} error
   * @param {*} info
   * @memberof ErrorBoundary
   */
  componentDidCatch(error, info) {
    this.setState({
      hasError: true,
      error: error,
      info: info
    });

    console.error(error, info);
  }

  /**
   * Renders either the children components or the Error if any
   *
   * @returns
   * @memberof ErrorBoundary
   */
  render() {
    // Style for ErrorBoundary div
    const errorBoundaryStyle = {
      width: '50%',
      margin: 'auto',
      marginTop: '32px',
      padding: '64px',
      // backgroundImage: 'linear-gradient(0deg, #1B1B1B, #242124)',
      backgroundImage: 'linear-gradient(0deg, #FFF9, #FFF)',
      borderRadius: '12px'
    };

    const h1Style = {
      color: '#CC0800',
      letterSpacing: '4px'
    };

    const errorMessageStyle = {
      padding: '32px',
      borderRadius: '12px',
      color: '#F1F1FF',
      backgroundColor: '#212121',
      fontFamily: 'monospace'
    };

    const errorMessage = this.state.error ? 
      this.state.error.message :
      null;

    const objectToDisplay = !this.state.hasError ? 
      this.props.children : null;
      
    // If an error was catched then render an Error Block instead of Children
    return (
      <div className='errorBoundary'>
        <div className='content'>
          {objectToDisplay}
        </div>
        <Dimmer active={this.state.hasError}>
          <div className='errorCommitment' style={errorBoundaryStyle}>
          <h1 style={h1Style}>Something went wrong</h1>
          <h3 style={{color: '#ED2939'}}>Error</h3>
          <p className='errorMessage' style={errorMessageStyle}>
            {errorMessage}
          </p>
          <p>
            Contact with the administrator developer +30-6975 362321 - apostolis.anastasiou.alpha@gmail.com
          </p>
        </div>
        </Dimmer>
      </div>
    );
  }
}
