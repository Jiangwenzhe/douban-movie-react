import React, { Component}  from 'react';
import { BrowserRouter as Router, Route, Link, Redirect} from "react-router-dom";
import './style.css';
import Panel from './Panel';

const Tabs = () =>
  <Router>
    <div>
    <footer className="backdrop-blur">
      <SingleTabButton
        activeOnlyWhenExact={true}
        to={process.env.PUBLIC_URL + '/top250'}
        icon="iconfont icon-paihangbang"
        tabName="排行榜"
      />
      <SingleTabButton
        to={process.env.PUBLIC_URL + '/onTheater'}
        icon="iconfont icon-dianying"
        tabName="正在上映"
      />
      <SingleTabButton
        to={process.env.PUBLIC_URL + '/search'}
        icon="iconfont icon-search"
        tabName="搜索"
      />
      </footer>
      {/* 默认路由 */}
      <Route exact path={process.env.PUBLIC_URL + '/'} component={() => <Redirect to={process.env.PUBLIC_URL + '/top250'}/>} />
      <Route exact path={process.env.PUBLIC_URL + '/top250'} component={TopPanel} />
      <Route path={process.env.PUBLIC_URL + '/onTheater'} component={OnTheaterPanel} />
      <Route path={process.env.PUBLIC_URL + '/search'} component={SearchPanel}/>
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


const TopPanel = () =>
  <Panel requestURL="https://api.douban.com/v2/movie/top250" value="topmovie"/>


const OnTheaterPanel = () =>
  <Panel requestURL="https://api.douban.com/v2/movie/in_theaters" value="in_theater"/>

class SearchPanel extends Component {
  constructor() {
    super();
    this.state = {
      searchTerm: '',
      url: ''
    }

    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.try_restore_component = this.try_restore_component.bind(this);
    this.try_restore_component();
  }

  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  onSearchSubmit(event) {
    // event.preventDefault();
    const { searchTerm } = this.state;
    this.setState({
      url: `https://api.douban.com/v2/movie/search?q=${searchTerm}`
    });
    this.forceUpdate();
  }

  try_restore_component() {
    let searchData = window.sessionStorage.getItem('searchData');
    console.log(searchData)
    if(searchData) {
      searchData = JSON.parse(searchData);
      let { url , searchTerm} = searchData;
      this.state = {
        url: url,
        searchTerm: searchTerm
      }
    }
  }

  componentWillUnmount() {
    const { url, searchTerm } = this.state;
    console.log(url)
    let searchData = {
      url: url,
      searchTerm: searchTerm
    }
    window.sessionStorage.setItem('searchData', JSON.stringify(searchData));
  }

  render() {
    const { url , searchTerm } = this.state
    return (
      <div>
        <div className="search-area">
          <input type="text"  placeholder="搜索电影" value={searchTerm} onChange={this.onSearchChange}/>
          <span className="button" id="searchBtn" onClick={this.onSearchSubmit}> 搜索</span>
        </div>
        {url && <Panel requestURL={url} value={searchTerm}/>}
      </div>
    );
  }
}




export default Tabs