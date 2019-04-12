import React, { Component } from 'react';
import Cards from './Cards';
import Loading from './laoding';
import josnp from 'jsonp';




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
    const { requestURL } = this.props;
    this.setState({
      isLoading: true
    });
    let url = `${requestURL}?start=${startNum}&count=${countNum}`
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
    const { cardInfo, startNum, countNum, hasMore } = this.state;
    const { subjects, total } = data;
    if(cardInfo) {
      this.setState({
        cardInfo: Array.from(new Set(cardInfo.concat(subjects))),
        hasMore: (total>=(startNum+ countNum))
      })
      console.log(hasMore)

    } else {
      this.setState({
        cardInfo: subjects
      })
    }
  }

  handleScroll(){
    const { isLoading, hasMore } = this.state;
    const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
    const body = document.body;
    const html = document.documentElement;
    const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight,  html.scrollHeight, html.offsetHeight);
    const windowBottom = windowHeight + window.pageYOffset;
    // console.log(windowBottom, "  ---   ", docHeight)
    // console.log('windowBottom: ', windowBottom)
    this.setState({
      scrollpx: window.pageYOffset
    })
    if (windowBottom >= docHeight) {
      console.log('页面到底啦')
      if(!isLoading && hasMore) {
        this.getTopMovieData();
      }
      console.log('发送请求。。。')
    }
  }

  try_restore_component() {
    const { value } = this.props
    let panelData = window.sessionStorage.getItem(`${value}`);
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
      });
    }
  }

  componentDidMount() {
    console.log('did Mount')
    const { startNum , scrollpx } = this.state;
    console.log('在did Mount中的', scrollpx);
    window.addEventListener("scroll", this.handleScroll);
    if(startNum === 0) {
      console.log('一开始获取数据')
      this.getTopMovieData();
     }
    window.scrollTo(0, scrollpx);
  }

  componentDidUpdate(prevProps) {
    if (this.props.requestURL != prevProps.requestURL) {
      this.setState({
        startNum: 0,
        cardInfo: null
      })
      this.getTopMovieData();
    }
  }

  componentWillUnmount() {
    console.log('unmount')
    window.removeEventListener("scroll", this.handleScroll);
    const { cardInfo, startNum, countNum, hasMore, scrollpx } = this.state;
    console.log('保存的电影数据', cardInfo);
    console.log('滚动的位置', scrollpx);
    let panelData = {
      cardInfo : cardInfo,
      scrollpx: scrollpx,
      startNum: startNum,
      countNum: countNum,
      hasMore: hasMore,
      isLoading: false,
    }
    window.sessionStorage.setItem(`${this.props.value}`, JSON.stringify(panelData));
  }

  render() {
    const { cardInfo, isLoading } = this.state;

    return (
      <div>
       {cardInfo && <Cards cardInfo = {cardInfo}  />}
       {isLoading && <Loading />}
      </div>
    );

  }

}

export default Panel;