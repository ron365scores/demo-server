const {DEV_MODE} = require('./consts');
const {routesService} = require('./routes');
const fetch = require('node-fetch');

class ApiService {
  fetchGames(DefaultLangID, UserCountryID, DefaultTimeZoneID, force, date, sportTypes) {
    return fetch(routesService.getGamesUrl(DefaultLangID, UserCountryID, DefaultTimeZoneID, force, date, sportTypes)).then(res => res.json());
  }

  fetchLocale(force, langId) {
    const  url = routesService.getLocalUrl(force, langId);

    return fetch(url).then(res => res.json());
  }

  fetchInitData(force, DefaultLangID, UserCountryID) {
    return fetch(routesService.getInitUrl(force, DefaultLangID, UserCountryID)).then(res => res.json());
  }
}

const apiService = new ApiService();
module.exports = {apiService};
