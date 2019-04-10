import React  from 'react';
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
      <Route exact path="/top250" component={Panel} />
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


const OnTheaterPanel = () =>
  <Cards
    value="onTheater"
    cardInfo = {cardInfo}
  />

const SearchPanel = () =>
  <Cards
    value="onSearch"
    cardInfo = {cardInfo}
  />


export default Tabs