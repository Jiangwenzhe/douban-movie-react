import React, { Component } from 'react';
import './style.css';
import data from './data.json'
import './card'
import Card from './card';

const cardInfo = data.subjects;
console.log(cardInfo);
class Panel extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return(
      <div>
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