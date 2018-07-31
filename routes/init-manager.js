const {apiService} = require('./api-service');

class InitManager {

  constructor() {

    this.locale = {};
    this.data = [];
  }

  fetchLocale(force = false, langId) {
    let promise = null;

    promise = apiService.fetchLocale();

    return promise.then(l => {
      this.locale = l;

      if (langId) {
        l.DefaultLangID = langId;
      }

      return l;
    });
  }

  fetchInitData(force = false, ...params) {
    let promise = null;

    promise = apiService.fetchInitData(...params);

    promise.then(l => {
      this.data = l;

      return l;
    }).catch((e) => console.log('e', e));

    return promise;
  }

  getLocale() {
    return this.locale;
  }

  getInitData() {
    return this.data;
  }

  getCurrentLanguage() {
    const {DefaultLangID} = initManager.getLocale();

    const language = initManager.getInitData().Languages.filter(lang => lang.ID === DefaultLangID)[0];

    return language;
  }

  getDateformats() {
    const initData = initManager.getInitData();

    return initData.DateFormats;
  }

  getSportTypes() {
    const initData = initManager.getInitData();

    if (!initData) {
      return null;
    }

    const sportTypes = initData.SportTypes;

    return sportTypes;
  }

  getSportType(sportTypeId) {
    const sportTypes = this.getSportTypes() || [];
    const sportType = sportTypes.filter(s => s.ID === sportTypeId)[0];

    return sportType;
  }

  clearCache() {
    this.locale = {};
    this.data = [];
    this.lastUpdateId = null;
  }

}

 const initManager = new InitManager();
module.exports = { initManager };
