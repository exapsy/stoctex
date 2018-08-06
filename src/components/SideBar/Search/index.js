import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';

// LOCAL IMPORTS
import './style.scss';

@inject('listStore')
@observer
export default class Search extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.props.listStore.itemFilterCallback = ((value) => true);
  }

  handleChange(event) {
    
    RegExp.escape = function(string) {
      return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
    };

    const searchRegex = new RegExp(RegExp.escape(event.target.value), 'i');

    this.props.listStore.itemFilterCallback = ((value, index) => {

      return searchRegex.test(value.code1) 
      || searchRegex.test(value.barcode)
      || searchRegex.test(value.name)
      || searchRegex.test(value.code2);
    });
  }

  handleSubmit(event) {
    event.preventDefault();
  }

  render() {
    return (
      <form action="/search" className="search w-form" onSubmit={this.handleSubmit}>
        <input 
          type="search" 
          className="search-input w-input" 
          maxLength="256" name="query" 
          placeholder="Search…" 
          id="search" 
          required=""
          onChange={this.handleChange}/>
      </form>
    )
  }
}
