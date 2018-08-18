import React from "react";
import {observer, inject} from "mobx-react/index";
import PropTypes from "prop-types";
import RootStore from "../stores/RootStore";
import Profile from "./Profile";

@inject('rootStore')
@observer
class Profiles extends React.Component {
  constructor() {
    super();

    this.handleSelect = this.handleSelect.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.refSelect = this.refSelect.bind(this);

    this.select = null;
  }

  componentDidMount() {
    if (this.props.rootStore.profiles.state === 'idle') {
      this.props.rootStore.profiles.fetchProfiles();
    }
  }

  handleSelect() {
    const rootStore = this.props.rootStore;
    const id = this.select.value;
    rootStore.profiles.setProfileId(id);
  }

  handleEdit() {

  }

  refSelect(element) {
    this.select = element;
  }

  render() {
    const rootStore = this.props.rootStore;
    const profilesStore = rootStore.profiles;
    const profileStore = rootStore.profile;

    switch (profilesStore.state) {
      case 'pending': {
        return ('Loading...');
      }
      case 'error': {
        return ('Error');
      }
      case 'done': {
        const options = [];

        let activeProfile = null;
        profilesStore.profiles.forEach(profile => {
          if (!activeProfile && (!profilesStore.profileId || profilesStore.profileId === profile.id)) {
            activeProfile = profile;
          }
          options.push(
            <option key={profile.id} value={profile.id}>{profile.name}</option>
          );
        });

        return (
          <div className="parameter_box__left">
            <div className="parameter parameter-profile">
              <div className="profile_box">
                <select ref={this.refSelect} className="profile__select" defaultValue={activeProfile.id} onChange={this.handleSelect}>
                  {options}
                </select>
                <a onClick={this.handleEdit}
                   href="#manageProfiles" title={chrome.i18n.getMessage('manageProfiles')}
                   className="button-manage-profile"/>
              </div>
            </div>
            <div className="parameter parameter-tracker">
              <Profile key={activeProfile.id} profileItem={activeProfile}/>
            </div>
          </div>
        );
      }
      default: {
        return ('Idle');
      }
    }
  }
}

Profiles.propTypes = null && {
  rootStore: PropTypes.instanceOf(RootStore)
};

export default Profiles;