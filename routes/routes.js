const {GAME_DATE_FORMAT} = require('./consts');
const moment = require('moment');

const REACT_APP_API = 'http://ws.365scores.com/Data';

// todo: change to https
const flagUrl = 'http://imagescache.365scores.com/image/upload/';
const logosUrl = 'http://logos.365scores.com/';

class RoutesService {
  getLocalUrl() {
    return REACT_APP_API + '/init/localdata?appType=5'
  };

  getGamesUrl(lang, countryId, timeZone, uid = null, date, sportTypes = []) {
    const params = {
      appType: 5,
      sports: sportTypes.join(','),
      lang,
      tz: timeZone,
      cid: countryId,
      uid,
      startDate: moment(date, GAME_DATE_FORMAT).format('DD/MM/YYYY')
    };

    const initialRoute = `${REACT_APP_API}/Games?1=1`;
    const route = this.buildRoute(initialRoute, params);

    return route;
  };

  getInitUrl(lang, countryId) {
    return REACT_APP_API + `/init?appType=5&lang=${lang}&cid=${countryId}`
  };

  getCatalogUrl(lang, countryId) {
    return REACT_APP_API + `/Entities/?catalog=true&lang=${lang}&uc=${countryId}`
  };

  getCatalogCompetitionsUrl(lang, countryId) {
    return REACT_APP_API + `/Entities/?dataType=2&lang=${lang}&CountryID=${countryId}`
  };

  getSportTypeIconUrl(sportTypeId) {
    return logosUrl + `SportTypes/${sportTypeId}.png`;
  };

  getTVNetworkIconUrl(tvNetworkId) {
    return flagUrl + 'w_200,h_200,c_limit,q_76,d_$default/TVNetworks/' + tvNetworkId;
  };

  getGoogleMapLocationUrl(placeId) {
    return 'https://www.google.com/maps/place/?q=place_id:' + placeId;
  };

  getAthleteIconUrl(id) {
    return flagUrl + 'w_153,h_153,c_limit,d_Athletes:default.jpg,r_max,c_thumb,g_face,f_webp,q_77/Athletes/' + id;
  };

  getCountryFlagUrl(width, id, isRound) {
    return flagUrl + `w_${width * 2},h_${width * 2},c_limit,f_png,q_90,d_Countries:Round:default.png/Countries/Round/` + id;
  };

  getCompetitorFlagUrl(width, id, isRound) {
    return flagUrl + `w_${width * 2},h_${width * 2},c_limit,f_png,q_90,d_Competitors:default1.png/Competitors/` + id;
  };

  getLanguagesFlagUrl(width, id, isRound) {
    return flagUrl + `w_${width * 2},h_${width * 2},c_limit,f_png,q_90/Languages/` + id;
  };

  getEntitySearchUrl(searchText, fromCache = true) {
    return REACT_APP_API + `/Entities/?search=${searchText}&onlyFromCache=${fromCache}`;
  };

  getGameCenterData(countryId, lang, ...gamesIds) {
    return REACT_APP_API + `/Games/GameCenter/?games=${[...gamesIds].join(',')}&WithExpanded=true&uc=${countryId}&lang=${lang}`;
  };

  buildRoute(initialRoute, params) {
    let computedRoute = initialRoute;

    for (const paramName in params) {
      const paramValue = params[paramName];

      if (paramValue) {
        computedRoute += `&${paramName}=${paramValue}`;
      }
    }

    return computedRoute;
  }
}

 const routesService = new RoutesService();

module.exports = { routesService };