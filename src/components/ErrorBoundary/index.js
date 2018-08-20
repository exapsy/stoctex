import React, { Component } from 'react';
import {
  Dimmer
}                           from 'semantic-ui-react';

/**
 * Renders an Error Block which describes the error if an error was catched
 * Otherwise, returns the children components
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

  componentDidCatch(error, info) {
    this.setState({
      hasError: true,
      error: error,
      info: info
    });
  }

  render() {
    // Style for ErrorBoundary div
    const errorBoundaryStyle = {
      width: '50%',
      margin: 'auto',
      marginTop: '32px',
      padding: '64px',
      // backgroundImage: 'linear-gradient(0deg, #1B1B1B, #242124)',
      borderRadius: '12px'
    };

    const h1Style = {
      color: '#FF0800',
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

    // If an error was catched then render an Error Block instead of Children
    return (
      <div className='errorBoundary'>
        <div className='errorBoundary'>
          {this.props.children}
        </div>
        <Dimmer active={this.state.hasError}>
          <div className='errorBoundary' style={errorBoundaryStyle}>
          <h1 style={h1Style}>Something went wrong</h1>
          <h3 style={{color: '#ED2939'}}>Error</h3>
          <p className='errorMessage' style={errorMessageStyle}>
            {errorMessage}
          </p>
          <p>
            Contact with the administrator developer +31-6975 362321 - apostolis.anastasiou.alpha@gmail.com
          </p>
        </div>
        </Dimmer>
      </div>
    );
  }
}
