import React, { Component } from 'react';
import axios                from 'axios';

// LOCAL IMPORTS
import api from '../../../config/rest';
import './style.scss';

export default class Search extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async handleChange(event) {
    if(event.target === '') {
      await axios.get(`${api.v1.products}`)
      .then(value => {
        this.props.updateList(value.data);
      })
      .catch(err => {
        console.error(err);
      });  
    }
    await axios.get(`${api.v1.products}?search=${event.target.value}`)
      .then(value => {
        console.log('Search Results:', value.data);
        this.props.updateList(value.data);
      })
      .catch(err => {
        console.error(err);
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
