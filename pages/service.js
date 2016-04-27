import React, { Component } from 'react';
import './root.scss';
import CategoryList from './../components/CategoryList';

export default class extends Component {
  render() {
    return (
      <div className="root">
        <h1 className="title">What service are you looking for?</h1>
        <form id="search-form">
          <CategoryList />
        </form>
      </div>
    );
  }
}
