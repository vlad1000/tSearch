import {inject, observer} from "mobx-react";
import React from "react";
import PropTypes from "prop-types";
import getLogger from "../tools/getLogger";
import blankSvg from "../assets/img/blank.svg";
import {Link} from "react-router-dom";

const Sortable = require('sortablejs');

const logger = getLogger('ProfileEditorProfile');


@observer
class ProfileEditorProfile extends React.Component {
  static propTypes = {
    profileEditorStore: PropTypes.object.isRequired,
    profileEditorProfileStore: PropTypes.object.isRequired,
  };

  state = {
    showOptions: false
  };

  /**@return ProfileEditorStore*/
  get profileEditorStore() {
    return this.props.profileEditorStore;
  }

  /**@return ProfileEditorProfileStore*/
  get profileEditorProfileStore() {
    return this.props.profileEditorProfileStore;
  }

  handleChangeName = () => {
    this.profileEditorProfileStore.setName(this.name.value);
  };

  name = null;
  refName = (element) => {
    this.name = element;
  };

  handleSearchChange = () => {
    this.profileEditorProfileStore.setFilterText(this.search.value);
    this.profileEditorProfileStore.setCategory('all');
  };

  handleSave = (e) => {
    e.preventDefault();
    this.profileEditorStore.save();
  };

  search = null;
  refSearch = (element) => {
    this.search = element;
  };

  handleShowOptions = (e) => {
    e.preventDefault();
    this.setState({
      showOptions: !this.state.showOptions
    });
  };

  render() {
    const categories = ['all', 'withoutList', 'selected'].map(type => {
      const isActive = type === this.profileEditorProfileStore.category;
      return (
        <ProfileEditorFilterButton key={`category-${type}`} profileEditorProfileStore={this.profileEditorProfileStore} isActive={isActive} type={type}/>
      );
    });

    const showOptionsClassList = ['button manager__footer__btn show-options'];
    if (this.state.showOptions) {
      showOptionsClassList.push('active');
    }

    return (
      <div className="manager">
        <div className="manager__body">
          <div className="manager__sub_header sub_header__profile">
            <div className="profile__input">
              <input ref={this.refName} className="input__input" type="text" defaultValue={this.profileEditorProfileStore.name} onChange={this.handleChangeName}/>
            </div>
          </div>
          <div className="manager__sub_header sub_header__filter">
            <div className="filter__box">{categories}</div>
            <div className="filter__search">
              <input ref={this.refSearch} className="input__input filter__input" type="text"
                     placeholder={chrome.i18n.getMessage('quickSearch')}
                     onChange={this.handleSearchChange}
              />
            </div>
          </div>
          <ProfileEditorTackerList key={this.profileEditorProfileStore.category} profileEditorProfileStore={this.profileEditorProfileStore} showOptions={this.state.showOptions}/>
        </div>
        <div className="manager__footer">
          <a onClick={this.handleShowOptions} href="#show-options" className={showOptionsClassList.join(' ')} title={chrome.i18n.getMessage('advanced_options')}/>
          <div className="space"/>
          <Link to={'/codeMaker'} target="_blank" className="button manager__footer__btn">{chrome.i18n.getMessage('createCode')}</Link>
          <Link to={'/editor/tracker'} target="_blank" className="button manager__footer__btn">{chrome.i18n.getMessage('add')}</Link>
          <a href="#save" className="button manager__footer__btn" onClick={this.handleSave}>{chrome.i18n.getMessage('save')}</a>
        </div>
      </div>
    );
  }
}

@observer
class ProfileEditorTackerList extends React.Component {
  static propTypes = {
    profileEditorProfileStore: PropTypes.object.isRequired,
    showOptions: PropTypes.bool.isRequired,
  };

  state = {
    trackerIds: []
  };

  /**@return ProfileEditorProfileStore*/
  get profileEditorProfileStore() {
    return this.props.profileEditorProfileStore;
  }

  sortable = null;
  refTrackers = (node) => {
    if (!node) {
      if (this.sortable) {
        this.sortable.destroy();
        this.sortable = null;
      }
    } else
    if (!this.sortable) {
      // fix sortable bug with checkbox
      node.getElementsByTagName = ((node, getElementsByTagName) => {
        return tagName => {
          if (tagName === 'input') {
            tagName = 'null-input';
          }
          return getElementsByTagName.call(node, tagName);
        }
      })(node, node.getElementsByTagName);

      const getPrevSelectedTracker = node => {
        node = node.previousElementSibling;
        while (node && !node.classList.contains('item__selected')) {
          node = node.previousElementSibling;
        }
        return node;
      };

      const getNextSelectedTracker = node => {
        node = node.nextElementSibling;
        while (node && !node.classList.contains('item__selected')) {
          node = node.nextElementSibling;
        }
        return node;
      };

      this.sortable = new Sortable(node, {
        group: 'trackers',
        handle: '.item__move',
        draggable: '.item',
        animation: 150,
        onStart: () => {
          node.classList.add('sorting');
        },
        onEnd: e => {
          node.classList.remove('sorting');

          const itemNode = e.item;
          const prevNode = getPrevSelectedTracker(itemNode);
          const nextNode = getNextSelectedTracker(itemNode);
          const id = itemNode.dataset.id;
          const prevId = prevNode && prevNode.dataset.id;
          const nextId = nextNode && nextNode.dataset.id;

          this.profileEditorProfileStore.moveTracker(id, prevId, nextId);
        }
      });
    }
  };

  render() {
    const trackerIds = this.state.trackerIds;
    const removedIds = trackerIds.slice(0);

    const checkedTrackerIds = this.profileEditorProfileStore.selectedTrackerIds;

    const checkedTrackers = [];
    const uncheckedTrackers = [];

    const appendTracker = (trackerStore) => {
      const checked = checkedTrackerIds.indexOf(trackerStore.id) !== -1;
      const item = (
        <ProfileEditorTrackerItem key={`tracker-${trackerStore.id}`}
                                  profileEditorProfileStore={this.profileEditorProfileStore}
                                  trackerStore={trackerStore} showOptions={this.props.showOptions} checked={checked}/>
      );
      if (checked) {
        checkedTrackers.push(item);
      } else {
        uncheckedTrackers.push(item);
      }
    };

    this.profileEditorProfileStore.categoryTrackers.forEach((trackerStore) => {
      const id = trackerStore.id;
      const pos = removedIds.indexOf(id);
      if (pos !== -1) {
        removedIds.splice(pos, 1);
      }
      if (trackerIds.indexOf(id) === -1) {
        trackerIds.push(id);
      }
      appendTracker(trackerStore);
    });

    removedIds.forEach((id) => {
      const trackerStore = this.profileEditorProfileStore.getTrackerById(id);
      if (trackerStore) {
        appendTracker(trackerStore);
      }
    });

    return (
      <div ref={this.refTrackers} className="manager__trackers">
        {checkedTrackers.concat(uncheckedTrackers)}
      </div>
    );
  }
}

@observer
class ProfileEditorFilterButton extends React.Component {
  static propTypes = {
    type: PropTypes.string.isRequired,
    isActive: PropTypes.bool.isRequired,
    profileEditorProfileStore: PropTypes.object.isRequired,
  };

  /**@return ProfileEditorProfileStore*/
  get profileEditorProfileStore() {
    return this.props.profileEditorProfileStore;
  }

  handleClick = (e) => {
    e.preventDefault();
    this.profileEditorProfileStore.setCategory(this.props.type);
  };

  render() {
    const type = this.props.type;

    const classList = ['filter__item'];
    if (this.props.isActive) {
      classList.push('item__selected');
    }

    const count = this.profileEditorProfileStore.getTrackerCountByCategory(type);

    return (
      <a className={classList.join(' ')} onClick={this.handleClick} href={'#'}>
        {chrome.i18n.getMessage('filter_' + type)}
        {' '}
        <span className="item__count">{count}</span>
      </a>
    );
  }
}

@inject('rootStore')
@observer
class ProfileEditorTrackerItem extends React.Component {
  static propTypes = {
    rootStore: PropTypes.object,
    profileEditorProfileStore: PropTypes.object.isRequired,
    trackerStore: PropTypes.object.isRequired,
    showOptions: PropTypes.bool.isRequired,
    checked: PropTypes.bool.isRequired,
  };

  /**@return RootStore*/
  get rootStore() {
    return this.props.rootStore;
  }

  /**@return TrackersStore*/
  get trackersStore() {
    return this.rootStore.trackers;
  }

  /**@return ProfileEditorProfileStore*/
  get profileEditorProfileStore() {
    return this.props.profileEditorProfileStore;
  }

  /**@return {ProfileEditorProfileTrackerStore|TrackerStore}*/
  get trackerStore() {
    return this.props.trackerStore;
  }

  /**@return ProfileEditorProfileTrackerStore*/
  get profileTrackerStore() {
    return this.props.profileEditorProfileStore.getProfileTracker(this.trackerStore.id);
  }

  handleChecked = () => {
    if (this.checkbox.checked) {
      this.profileEditorProfileStore.addTracker(this.trackerStore.id);
    } else {
      this.profileEditorProfileStore.removeTracker(this.trackerStore.id);
    }
  };

  handleClick = (e) => {
    e.preventDefault();
    this.checkbox.checked = !this.checkbox.checked;
    this.handleChecked();
  };

  handleRemove = (e) => {
    e.preventDefault();
    this.trackersStore.deleteTracker(this.trackerStore.id);
    this.trackersStore.saveTrackers();
  };

  checkbox = null;
  refCheckbox = (element) => {
    this.checkbox = element;
  };

  handleUpdate = (e) => {
    e.preventDefault();
    this.trackerStore.update();
  };

  stopPropagation = (e) => {
    e.stopPropagation();
  };

  handleProxyChange = (e) => {
    this.profileTrackerStore.options.setEnableProxy(this.enableProxy.checked);
  };

  enableProxy = null;
  refEnableProxy = (element) => {
    this.enableProxy = element;
  };

  render() {
    const tracker = this.trackerStore;
    const checked = this.props.checked;

    const classList = ['item'];
    if (checked) {
      classList.push('item__selected');
    }

    let updateBtn = null;
    let supportBtn = null;
    let homepageBtn = null;
    let deleteBtn = null;
    let author = null;

    let icon = tracker.getIconUrl() || blankSvg;

    const name = tracker.meta.name || tracker.id;

    let version = tracker.meta.version;
    if (tracker.updateState === 'pending') {
      version = '...';
    }

    if (tracker.meta.supportURL) {
      supportBtn = (
        <a href={tracker.meta.supportURL} className="item__button button-support" target="_blank"/>
      );
    }

    if (tracker.meta.updateURL || tracker.meta.downloadURL) {
      updateBtn = (
        <a onClick={this.handleUpdate} className="item__button button-update" href="#update"
           title={chrome.i18n.getMessage('update')}/>
      );
    }

    if (tracker.meta.homepageURL) {
      homepageBtn = (
        <a href={tracker.meta.homepageURL} className="item__button button-home" target="_blank"/>
      );
    }

    if (tracker.meta.author) {
      author = (
        <div className="item__cell item__author">{tracker.meta.author}</div>
      );
    }

    if (!tracker.isEditorProfileTrackerStore) {
      deleteBtn = (
        <a onClick={this.handleRemove} className="item__button button-remove" href="#remove"
           title={chrome.i18n.getMessage('remove')}/>
      );
    }

    const optionList = [];
    if (this.props.showOptions) {
      if (checked && this.profileTrackerStore) {
        optionList.push(
          <div key={'enableProxy'} className="option__item">
            <label>
              <input ref={this.refEnableProxy} defaultChecked={this.profileTrackerStore.options.enableProxy} onChange={this.handleProxyChange} type="checkbox"/>
              <span>{chrome.i18n.getMessage('enableProxy')}</span>
            </label>
          </div>
        );
      }
    }

    let options = null;
    if (optionList.length) {
      options = (
        <div onClick={this.stopPropagation} className="options">
          {optionList}
        </div>
      );
    }

    return (
      <div className={classList.join(' ')} data-id={tracker.id}>
        <div className="item__cell item__move"/>
        <div className="item__cell item__checkbox">
          <input ref={this.refCheckbox} onChange={this.handleChecked} type="checkbox" defaultChecked={checked}/>
        </div>
        <div className="item__cell item__icon">
          <img src={icon} alt=""/>
        </div>
        <div onClick={this.handleClick} className="item__cell item__name">{name}</div>
        <div onClick={this.handleClick} className="item__cell item__desc">
          <div className="desc">{tracker.meta.description || null}</div>
          {options}
        </div>
        <div className="item__cell item__version">{version}</div>
        {author}
        <div className="item__cell item__actions">
          {updateBtn}
          {supportBtn}
          {homepageBtn}
          <Link to={`/editor/tracker/${tracker.id}`} className="item__cell item__button button-edit" target="_blank"
                title={chrome.i18n.getMessage('edit')}/>
          {deleteBtn}
        </div>
      </div>
    );
  }
}

export default ProfileEditorProfile;