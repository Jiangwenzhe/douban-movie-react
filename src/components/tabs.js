import React, { Component}  from 'react';
import { BrowserRouter as Router, Route, Link, Redirect} from "react-router-dom";
import './style.css';
import Panel from './Panel';
import data from './data.json'
import Cards from './Cards';

const Tabs = () =>
  <Router>
    <div>
    <footer className="backdrop-blur">
      <SingleTabButton
        activeOnlyWhenExact={true}
        to="/top250"
        icon="iconfont icon-paihangbang"
        tabName="排行榜"
      />
      <SingleTabButton
        to="/onTheater"
        icon="iconfont icon-dianying"
        tabName="正在上映"
      />
      <SingleTabButton
        to="/search"
        icon="iconfont icon-search"
        tabName="搜索"
      />
      </footer>
      {/* 默认路由 */}
      <Route exact path="/" component={() => <Redirect to="/top250"/>} />
      <Route exact path="/top250" component={TopPanel} />
      <Route path="/onTheater" component={OnTheaterPanel} />
      <Route path="/search" component={SearchPanel }/>
    </div>
  </Router>

const SingleTabButton = ({ tabName, icon , to, activeOnlyWhenExact }) =>
  <Route
    path={to}
    exact={activeOnlyWhenExact}
    children={({ match }) => (
      <div className={match ? "active" : ""}>
        <span className={icon}></span>
        <Link style={match ? {color: '#00B51D'}: {}}  to={to}>{tabName}</Link>
      </div>
    )}
  />


const cardInfo = data.subjects;

const TopPanel = () =>
  <Panel requestURL="https://api.douban.com/v2/movie/top250" value="topmovie"/>


const OnTheaterPanel = () =>
  <Panel requestURL="https://api.douban.com/v2/movie/in_theaters" value="in_theater"/>

class SearchPanel extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div>
        <div className="search-area">
          <input type="text" id="inputvalue" placeholder="搜索电影" />
          <span className="button" id="searchBtn"> 搜索</span>
        </div>
        <Cards
            value="onSearch"
            cardInfo = {cardInfo}
          />
      </div>
    );
  }
}




export default Tabs