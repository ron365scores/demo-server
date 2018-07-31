const {initManager} = require('./init-manager');

class InitService {

  fetchData(force = false, langId) {
    return initManager.fetchLocale(force, langId)
      .then(({DefaultLangID, UserCountryID}) => {
        return initManager.fetchInitData(force, DefaultLangID, UserCountryID);
      })
  }

  getAllLangs() {
    const initData = initManager.getInitData();
    const { Languages } = initData;

    return Languages || [];
  }

  getCurrentLanguage() {
    const { DefaultLangID } = initManager.getLocale();
    const defaultLang = this.getAllLangs().filter(l => l.ID === DefaultLangID)[0];

    return defaultLang;
  }

  setLanguage(langId) {
    return this.fetchData(true, langId)
      .then(() => this.getAllLangs())
      .then((langs) => {
        const currentLangObject = langs.filter(l => l.ID === langId)[0];

        return currentLangObject;
      });
  }

  getSportTypes() {
    return initManager.getSportTypes();
  }
}


const initService = new InitService();

module.exports = { initService };
