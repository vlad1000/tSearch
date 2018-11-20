import {observer} from "mobx-react";
import React from "react";
import PropTypes from "prop-types";
import Dialog from "../Dialog";

@observer
class ExplorerSectionItem extends React.Component {
  static propTypes = {
    index: PropTypes.number.isRequired,
    sectionStore: PropTypes.object.isRequired,
    itemStore: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      posterError: false,
      edit: false
    };
  }

  /**@return {ExplorerSectionStore}*/
  get sectionStore() {
    return this.props.sectionStore;
  }

  /**@return {ExplorerItemStore}*/
  get itemStore() {
    return this.props.itemStore;
  }

  handlePosterError = (e) => {
    this.setState({
      posterError: true
    });
  };

  handleEditFavorite = (e) => {
    this.setState({
      edit: true
    });
  };

  handleDialogCancel = (e) => {
    e.preventDefault();

    this.handleDialogClose();
  };

  handleDialogClose = (e) => {
    this.setState({
      posterError: false,
      edit: false
    });
  };

  handleRemoveFavorite = (e) => {
    e.preventDefault();
    this.itemStore.removeFavorite();
  };

  handleAddFavorite = (e) => {
    e.preventDefault();
    this.itemStore.addFavorite();
  };

  title = null;
  refTitle = (element) => {
    this.title = element;
  };

  titleOriginal = null;
  refTitleOriginal = (element) => {
    this.titleOriginal = element;
  };

  poster = null;
  refPoster = (element) => {
    this.poster = element;
  };

  url = null;
  refUrl = (element) => {
    this.url = element;
  };

  handleDialogSave = (e) => {
    e.preventDefault();

    this.itemStore.updateProps({
      title: this.title.value,
      titleOriginal: this.titleOriginal.value,
      poster: this.poster.value,
      url: this.url.value,
    }).then(() => {
      this.handleDialogClose();
    });
  };

  render() {
    const sectionStore = this.sectionStore;
    const itemStore = this.itemStore;

    let posterUrl = itemStore.poster;
    if (!posterUrl || this.state.posterError) {
      posterUrl = require('!url-loader!../../assets/img/no_poster.png');
    }

    const actions = [];
    if (sectionStore.id === 'favorites') {
      actions.push(
        <div key={'rmFavorite'} onClick={this.handleRemoveFavorite} title={chrome.i18n.getMessage('removeFromFavorite')}
             className="action__rmFavorite"/>
      );
      actions.push(
        <div key={'move'} title={chrome.i18n.getMessage('move')} className="action__move"/>
      );
      actions.push(
        <div key={'edit'} onClick={this.handleEditFavorite} title={chrome.i18n.getMessage('edit')}
             className="action__edit"/>
      );
    } else {
      actions.push(
        <div key={'favorite'} onClick={this.handleAddFavorite} title={chrome.i18n.getMessage('addInFavorite')}
             className="action__favorite"/>,
      );
    }

    let dialog = null;
    if (this.state.edit) {
      dialog = (
        <Dialog className={'dialog-poster_edit'} onClose={this.handleDialogClose}>
          <form onSubmit={this.handleDialogSave}>
            <span className="dialog__label">{chrome.i18n.getMessage('title')}</span>
            <input ref={this.refTitle} defaultValue={itemStore.title} className="input__input" name="title"
                   type="text"/>
            <span className="dialog__label">{chrome.i18n.getMessage('title')}</span>
            <input ref={this.refTitleOriginal} defaultValue={itemStore.titleOriginal} className="input__input"
                   name="titleOriginal" type="text"/>
            <span className="dialog__label">{chrome.i18n.getMessage('imageUrl')}</span>
            <input ref={this.refPoster} defaultValue={itemStore.poster} className="input__input" name="poster"
                   type="text"/>
            <span className="dialog__label">{chrome.i18n.getMessage('descUrl')}</span>
            <input ref={this.refUrl} defaultValue={itemStore.url} className="input__input" name="url" type="text"/>
            <div className="dialog__button_box">
              <input value={chrome.i18n.getMessage('save')} className="button button-save" type="submit"/>
              <input onClick={this.handleDialogCancel} value={chrome.i18n.getMessage('cancel')}
                     className="button button-cancel" type="button"/>
            </div>
          </form>
        </Dialog>
      );
    }

    const itemStyle = {
      zoom: sectionStore.zoom / 100
    };

    return (
      <li data-index={this.props.index} style={itemStyle} className="section__poster poster">
        {dialog}
        <div className="poster__image">
          {actions}
          <div title={chrome.i18n.getMessage('quickSearch')} className="action__quick_search">{'?'}</div>
          <a href={itemStore.url} title={chrome.i18n.getMessage('readMore')} className="image__more_link"
             target="_blank"/>
          <a title={itemStore.title} className="image__search_link" href="#">
            <img src={posterUrl} className="image__image" onError={this.handlePosterError}/>
          </a>
        </div>
        <div className="poster__title">
          <span>
            <a title={itemStore.title} className="poster__search_link" href="#">{itemStore.title}</a>
          </span>
        </div>
      </li>
    );
  }
}

export default ExplorerSectionItem;