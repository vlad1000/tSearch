import React from 'react';
import Header from "../components/Header";
import Profiles from "../components/Profiles";
import Filters from "../components/Filters";
import ScrollTop from "../components/ScrollTop";
import PropTypes from "prop-types";
import RootStore from "../stores/RootStore";
import {inject, observer} from "mobx-react";
import SearchPage from "../components/SearchPage";
import getTitle from "../tools/getTitle";


@inject('rootStore')
@observer
class Search extends React.Component {
  static propTypes = {
    rootStore: PropTypes.object,
    query: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);

    if (this.rootStore.options.state === 'idle') {
      this.rootStore.options.fetchOptions();
    }
    if (this.rootStore.history.state === 'idle') {
      this.rootStore.history.fetchHistory();
    }
    if (this.rootStore.profiles.state === 'idle') {
      this.rootStore.profiles.fetchProfiles();
    }
    if (this.rootStore.trackers.state === 'idle') {
      this.rootStore.trackers.fetchTrackers();
    }

    this.rootStore.searchForm.setQuery(this.props.query);
  }

  componentDidMount() {
    document.title = getTitle(JSON.stringify(this.props.query));
  }

  /**@return RootStore*/
  get rootStore() {
    return this.props.rootStore;
  }

  render() {
    let searchSession = null;
    if (
      this.rootStore.options.state === 'done' &&
      this.rootStore.history.state === 'done' &&
      this.rootStore.profiles.state === 'done' &&
      this.rootStore.trackers.state === 'done' &&
      this.rootStore.profiles.profile
    ) {
      searchSession = (
        <SearchSession query={this.props.query}/>
      )
    }

    return (
      <div className="page-ctr">
        <Header/>
        <div className="content content-row">
          <div className="parameter_box">
            <Profiles/>
            <Filters/>
          </div>
          <div className="main">
            {searchSession}
          </div>
        </div>
        <ScrollTop/>
      </div>
    );
  }
}

@inject('rootStore')
@observer
class SearchSession extends React.Component {
  static propTypes = {
    rootStore: PropTypes.object,
    query: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      searchId: this.rootStore.createSearch(this.props.query),
    };
  }

  /**@return RootStore*/
  get rootStore() {
    return this.props.rootStore;
  }

  /**@return SearchStore*/
  get searchStore() {
    return this.rootStore.getSearch(this.state.searchId);
  }

  componentDidMount() {
    this.searchStore.search();
    this.rootStore.history.addQuery(this.searchStore.query);
  }

  componentWillUnmount() {
    this.rootStore.destroySearch(this.state.searchId);
  }

  handleSearchNext = (e) => {
    e.preventDefault();
    if (this.searchStore.state === 'pending') return;

    this.searchStore.searchNext();
  };

  render() {
    const pages = this.searchStore.pages.map((searchPageStore, index) => {
      if (searchPageStore.results.length) {
        return (
          <SearchPage key={`page-${index}`} searchStore={this.searchStore} searchPageStore={searchPageStore}/>
        );
      } else {
        return null;
      }
    });

    let moreBtn = null;
    if (this.searchStore.hasNextQuery) {
      const classList = ['loadMore search__submit footer__loadMore'];
      if (this.searchStore.state === 'pending') {
        classList.push('loadMore-loading');
      }
      moreBtn = (
        <div key={'more'} className="footer table__footer">
          <a className={classList.join(' ')} href="#search-next" onClick={this.handleSearchNext}>{
            chrome.i18n.getMessage('loadMore')
          }</a>
        </div>
      );
    }

    return [
      pages,
      moreBtn
    ];
  }
}

export default Search;