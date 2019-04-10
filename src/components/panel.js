import React, { Component } from 'react';
import Cards from './Cards';
import Loading from './laoding';
import josnp from 'jsonp';

const PATH_BASE = 'https://api.douban.com/v2/movie/top250';


class Panel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cardInfo: null,
      startNum: 0,
      countNum: 20,
      hasMore: true,
      isLoading: false,
      scrollpx: 0
    };
    this.try_restore_component = this.try_restore_component.bind(this);
    this.try_restore_component();
    this.handleScroll = this.handleScroll.bind(this);
    this.getTopMovieData = this.getTopMovieData.bind(this);
    this.setTopMovieData = this.setTopMovieData.bind(this);
  }

  getTopMovieData() {
    const {startNum, countNum } = this.state;
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
          this.setState({
            startNum: startNum + 20,
            isLoading: false
          });
          this.setTopMovieData(data);
          console.log('get data startNum: ', startNum)
        }
    });
  }

  setTopMovieData(data) {
    const { cardInfo } = this.state;
    const { subjects } = data;
    if(cardInfo) {
      this.setState({
        cardInfo: Array.from(new Set(cardInfo.concat(subjects)))
      })

    } else {
      this.setState({
        cardInfo: subjects
      })
    }
  }

  handleScroll(){
    const { isLoading } = this.state;
    const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
    const body = document.body;
    const html = document.documentElement;
    const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight,  html.scrollHeight, html.offsetHeight);
    const windowBottom = windowHeight + window.pageYOffset;
    console.log(windowBottom, "  ---   ", docHeight)
    console.log('windowBottom: ', windowBottom)
    this.setState({
      scrollpx: window.pageYOffset
    })
    if (windowBottom >= docHeight) {
      console.log('页面到底啦')
      if(!isLoading) {
        this.getTopMovieData();
      }
      console.log('发送请求。。。')
    }
  }

  try_restore_component() {
    let panelData = window.sessionStorage.getItem('tempdata');
    console.log('try_restore_component');
    if(panelData) {
      panelData = JSON.parse(panelData);
      console.log(panelData)
      const { cardInfo, startNum, countNum, hasMore, isLoading, scrollpx } = panelData;
      this.state = ({
        cardInfo : cardInfo,
        scrollpx: scrollpx,
        startNum: startNum,
        countNum: countNum,
        hasMore: hasMore,
        isLoading: isLoading,
        scrollpx: scrollpx
      });
    }
  }

  componentDidMount() {
    console.log('did Mount')
    const { startNum, countNum, scrollpx } = this.state;
    console.log('在did Mount中的', scrollpx)
    window.addEventListener("scroll", this.handleScroll);
    if(startNum === 0) {
      console.log('一开始获取数据')
      this.getTopMovieData();
     }
    window.scrollTo(0, scrollpx);
  }

  componentWillUnmount() {
    console.log('unmount')
    window.removeEventListener("scroll", this.handleScroll);
    const { cardInfo, startNum, countNum, hasMore, isLoading, scrollpx } = this.state;
    console.log('保存的电影数据', cardInfo);
    console.log('滚动的位置', scrollpx);
    let panelData = {
      cardInfo : cardInfo,
      scrollpx: scrollpx,
      startNum: startNum,
      countNum: countNum,
      hasMore: hasMore,
      isLoading: false,
      scrollpx: scrollpx
    }
    window.sessionStorage.setItem('tempdata', JSON.stringify(panelData));
  }

  render() {
    const {cardInfo, isLoading, scrollpx} = this.state;

    return (
      <div>
       {cardInfo && <Cards value="Top250" cardInfo = {cardInfo}  />}
       {isLoading && <Loading />}
      </div>
    );

  }

}

export default Panel;