import React, { Component } from 'react'
import { inject, observer } from 'mobx-react';

@inject('listStore')
@observer
export default class Actions extends Component {
  render() {
    return (
      <div className='actions'>
        <span id='downloadExcel'>
          
        </span>
      </div>
    )
  }
}
