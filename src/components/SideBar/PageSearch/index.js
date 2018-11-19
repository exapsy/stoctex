import React, { Component } from 'react';
import { 
  Button, 
  Input 
} from 'semantic-ui-react';
import { observer, inject } from 'mobx-react';
import './style.scss';

@inject("listStore")
@observer
export default class PageSearch extends Component {
  constructor(props) {
    super(props);
    this.state = { inputValue: Number(this.props.listStore.currentPage) };

    this.buttonLeftHandler = this.buttonLeftHandler.bind(this);
    this.buttonRightHandler = this.buttonRightHandler.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if(
      (prevState.inputValue === this.state.inputValue) && 
      (this.state.inputValue < 1 || 
      this.state.inputValue > this.props.listStore.totalPages)
      ) {
        this.props.listStore.setPage(1)
        this.setState({inputValue: 1})
    }
  }
  

  buttonLeftHandler(event) {
    this.props.listStore.setPage(Number(this.props.listStore.currentPage) - 1)
    this.setState({inputValue: this.props.listStore.currentPage})
  }

  buttonRightHandler(event) {
    this.props.listStore.setPage(Number(this.props.listStore.currentPage) + 1)
    this.setState({inputValue: this.props.listStore.currentPage})
  }

  render() {
    return (
      <div className='page-search'>
        <h1>Page</h1>
        <div className='page-indicator'>
          <Input onChange={(event) => {
            const newValue = event.target.value;
            if(!newValue) {
              this.setState({inputValue: ''});
            } else {
              this.props.listStore.setPage(newValue);
              this.setState({inputValue: newValue});
            }
          }} 
          fluid 
          placeholder='Page' 
          value={this.state.inputValue}
          label={'/ ' + this.props.listStore.totalPages} 
          labelPosition='right'/>
        </div>
        <div className='navigation-buttons'>
          <Button icon='arrow left'  disabled={this.props.listStore.currentPage <= 1} onClick={this.buttonLeftHandler}/>
          <Button icon='arrow right' disabled={this.props.listStore.currentPage >= this.props.listStore.totalPages} onClick={this.buttonRightHandler}/>
        </div>
      </div>
    )
  }
}
