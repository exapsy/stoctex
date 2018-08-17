import React, { Component } from 'react';

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
    })
  }

  render() {
    // Style for ErrorBoundary div
    const errorBoundaryStyle = {
      width: '50%',
      margin: 'auto',
      marginTop: '32px',
      background: 'linearGradient(0, #AA4444, #CC8877)',
    };

    // If an error was catched then render an Error Block instead of Children
    if(this.state.hasError) {
      return (
        <div className='errorBoundary' style={errorBoundaryStyle}>
          <h1>Something went wrong</h1>
          <h3>Error</h3>
          <p className='errorMessage'>{this.state.error.message}</p>
        </div>
      );
    }
    return (
      <div className='errorBoundary'>
        {this.props.children}
      </div>
    )
    
  }
}
