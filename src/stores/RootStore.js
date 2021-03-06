import {resolveIdentifier, types} from 'mobx-state-tree';
import SearchForm from "./SearchFormStore";
import HistoryStore from "./HistoryStore";
import FiltersStore from "./FiltersStore";
import ProfilesStore from "./ProfilesStore";
import SearchStore from "./SearchStore";
import OptionsStore from "./OptionsStore";
import ExplorerStore from "./Explorer/ExplorerStore";
import ProfileEditorStore from "./ProfileEditorStore";
import TrackersStore from "./TrackersStore";
import EditorStore from "./EditorStore";
import CodeMakerStore from "./CodeMakerStore";
import PageStore from "./PageStore";
import storageGet from "../tools/storageGet";
import getNow from "../tools/getNow";
import storageSet from "../tools/storageSet";
import {ErrorWithCode} from "../tools/errors";
import getLogger from "../tools/getLogger";
import tracker from "../tools/tracker";
import AnalyticsStore from "./AnalyticsStore";

const deserializeError = require('deserialize-error');

const logger = getLogger('RootStore');

let searchId = 0;

/**
 * @typedef {{}} RootStore
 * @property {SearchForm} [searchForm]
 * @property {HistoryStore} [history]
 * @property {FiltersStore} [filters]
 * @property {ProfilesStore} [profiles]
 * @property {TrackersStore} [trackers]
 * @property {SearchStore[]} searches
 * @property {OptionsStore} [options]
 * @property {ExplorerStore} [explorer]
 * @property {ProfileEditorStore|undefined|null} profileEditor
 * @property {EditorStore|undefined|null} editor
 * @property {CodeMakerStore|undefined|null} codeMaker
 * @property {PageStore} [page]
 * @property {AnalyticsStore} [analytics]
 * @property {function} createSearch
 * @property {function} destroySearch
 * @property {function} createProfileEditor
 * @property {function} destroyProfileEditor
 * @property {function} createEditor
 * @property {function} destroyEditor
 * @property {function} createCodeMaker
 * @property {function} destroyCodeMaker
 * @property {function} checkForUpdate
 * @property {function} afterCreate
 * @property {function} getSearch
 */
const RootStore = types.model('RootStore', {
  searchForm: types.optional(SearchForm, {}),
  history: types.optional(HistoryStore, {}),
  filters: types.optional(FiltersStore, {}),
  profiles: types.optional(ProfilesStore, {}),
  trackers: types.optional(TrackersStore, {}),
  searches: types.array(SearchStore),
  options: types.optional(OptionsStore, {}),
  explorer: types.optional(ExplorerStore, {}),
  profileEditor: types.maybeNull(ProfileEditorStore),
  editor: types.maybeNull(EditorStore),
  codeMaker: types.maybeNull(CodeMakerStore),
  page: types.optional(PageStore, {}),
  analytics: types.optional(AnalyticsStore, {}),
}).actions(/**RootStore*/self => {
  return {
    createSearch(query) {
      const id = ++searchId;
      self.searches.push(SearchStore.create({
        id, query,
      }));
      return id;
    },
    destroySearch(id) {
      const searchStore = self.getSearch(id);
      if (searchStore) {
        const pos = self.searches.indexOf(searchStore);
        if (pos !== -1) {
          self.searches.splice(pos, 1);
        }
      }
    },
    createProfileEditor() {
      self.profileEditor = {
        profiles: JSON.parse(JSON.stringify(self.profiles.profiles))
      };
    },
    destroyProfileEditor() {
      self.profileEditor = null;
    },
    createEditor(type, id) {
      self.editor = {type, id};
    },
    destroyEditor() {
      self.editor = null;
    },
    createCodeMaker() {
      self.codeMaker = {};
    },
    destroyCodeMaker() {
      self.codeMaker = null;
    },
    checkForUpdate() {
      checkForUpdate().then(() => {
        return new Promise((resolve, reject) => {
          chrome.runtime.sendMessage({action: 'update'}, (result) => {
            if (!result) {
              reject(new Error('Result is empty'));
            }
            if (result.error) {
              reject(deserializeError(result.error));
            } else {
              resolve(result.result);
            }
          });
        });
      }).catch(err => {
        if (err.code !== 'TIMEOUT') {
          logger.error('checkForUpdate error:', err);
        }
      });
    },
    afterCreate() {
      self.page.init();
      tracker.init();
    },
  };
}).views((self) => {
  return {
    getSearch(id) {
      return resolveIdentifier(SearchStore, self, id);
    },
  };
});

const checkForUpdate = () => {
  return storageGet({lastCheckUpdateAt: 0}).then(storage => {
    if (storage.lastCheckUpdateAt + 86400 > getNow()) {
      throw new ErrorWithCode('Timeout', 'TIMEOUT');
    }
    return storageSet({lastCheckUpdateAt: getNow()}).then(() => true);
  });
};

export default RootStore;