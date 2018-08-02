import React, { Component } from 'react';
import axios                from 'axios';
import { observer, inject }         from 'mobx-react';

// LOCAL IMPORTS
import api from '../../../config/rest';
import './style.scss';

@inject('listStore')
@observer
export default class Search extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async handleChange(event) {

    const searchRegex = event.target;
    this.props.listStore.filterItems((value, index) => {
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
