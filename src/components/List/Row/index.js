import React, { Component } from 'react'

// LOCAL IMPORTS


export default class Row extends Component {
  constructor(props) {
    super(props);

    this.getList = this.getList.bind(this);
  }

  getList() {
    return (
      <div>
        Not Implemented
      </div>
    )
  }

  render() {
    return (
      <div className='Footer'>
        {this.getList()}
      </div>
    )
  }
}
