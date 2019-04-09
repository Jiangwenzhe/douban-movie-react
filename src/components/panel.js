import React, { Component } from 'react';
import './style.css';
import Card from './card';


class Panel extends Component {
  render() {
    const { value, cardInfo } = this.props;
    return(
      <div>
        <h1>{value}</h1>
        {cardInfo.map((item,index) =>
          <div key={index}>
            <Card info={item}/>
          </div>
        )}
      </div>
    )
  }
}
export default Panel;