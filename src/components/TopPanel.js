import React, { Component } from 'react';
import Panel from './panel';
import Loading from './laoding';
import josnp from 'jsonp';
import throttle from 'lodash';

const PATH_BASE = 'https://api.douban.com/v2/movie/top250';


class TopPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cardInfo: null,
      startNum: 0,
      countNum: 20,
      hasMore: true,
      isLoading: false,
    };
    this.handleScroll = this.handleScroll.bind(this);
    this.setTopMovieData = this.setTopMovieData.bind(this);
    this.setTopMovieData = this.setTopMovieData.bind(this);
  }

  getTopMovieData(startNum, countNum) {
    this.setState({
      isLoading: true
    });
    let url = `${PATH_BASE}?start=${startNum}&count=${countNum}`
    josnp(url,null,
      (error, data) => {
        if(error) {
          console.log(error);
        } else {
          console.log(data.subjects);
          this.setTopMovieData(data);
          this.setState({
            startNum: startNum + 20,
            isLoading: false
          });
        }
    });
  }

  setTopMovieData(data) {
    const { cardInfo } = this.state;
    const { subjects } = data;
    if(cardInfo) {
      this.setState({
        cardInfo: cardInfo.concat(subjects)
      })
    } else {
      this.setState({
        cardInfo: subjects
      })
    }
  }
  handleScroll() {
    const { startNum, countNum } = this.state;
    const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
    const body = document.body;
    const html = document.documentElement;
    const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight,  html.scrollHeight, html.offsetHeight);
    const windowBottom = windowHeight + window.pageYOffset;
    if (windowBottom >= docHeight) {
      throttle(this.getTopMovieData(startNum, countNum),500);
    } else {
      return;
    }
  }

  componentWillMount() {
    const { startNum, countNum } = this.state;
    if(startNum === 0) {
     this.getTopMovieData(startNum, countNum);
    }
  }

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  render() {
    const {cardInfo, isLoading} = this.state;
    return (
      <div>
       {cardInfo && <Panel value="Top250" cardInfo = {cardInfo} />}
       {isLoading && <Loading />}
      </div>
    );
  }
}

export default TopPanel;