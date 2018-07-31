const moment = require('moment');

const {apiService} = require('./api-service');
const {GAME_DATE_FORMAT} = require('./consts');
const {initManager} = require('./init-manager');

class GamesRepository {

  constructor() {
    this.games = [];
    this.competitions = [];
    this.countries = [];
    this.lastUpdateId = null;
    this.date = null;
  }

  fetchGames(date = moment().format(GAME_DATE_FORMAT), force = false, sportTypes = []) {
    return initManager.fetchLocale()
      .then(({UserCountryID, DefaultLangID, DefaultTimeZoneID}) => {

        if (force) {
          this.lastUpdateId = null;
        }

        this.date = date;

        return apiService.fetchGames(DefaultLangID, UserCountryID, DefaultTimeZoneID, force ? null : this.lastUpdateId, date, sportTypes);
      })
      .then(gamesData => {
        console.time();

        return this._populateCompetitions(gamesData.Competitions)
          .then(() => this._populateCountries(gamesData.Countries))
          .then(() => {
            this.lastUpdateId = gamesData.LastUpdateID;

            return gamesData;
          });
      });
  }

  _populateCompetitions(competitions) {
    const existingCompetitions = this.competitions || [];

    if (competitions) {
      competitions.forEach((competition) => {
        const existingCompetition = existingCompetitions.filter(x => x.ID === competition.ID)[0];

        if (!existingCompetition) {
          existingCompetitions.push(competition);
        }
      });
    }

    this.competitions = existingCompetitions;

    return Promise.resolve(existingCompetitions);
  }

  _populateCountries(countries) {
    const existingCountries = this.countries || [];

    if (countries) {
      countries.forEach((country) => {
        const existingCountry = existingCountries.filter(x => x.ID === country.ID)[0];

        if (!existingCountry) {
          existingCountries.push(country);
        }
      });
    }

    this.countries = existingCountries;

    return Promise.resolve(existingCountries);
  }

  getCompetitions() {
    return this.competitions;
  }

  getGames() {
    return this.games;
  }

  setGames(gameModels) {
    this.games = gameModels;
  }

  getCountryByCountryId(countryId) {
    if (!countryId) {
      throw new Error('country id was not supplied');
    }

    if (!this.countries) {
      // throw new Error('Data was not fetched yet.');

      return null;
    }

    const country = this.countries.filter(c => c.ID === countryId)[0];

    if (!country) {
      logger.warn(`country was not found for id: ${countryId}`);
    }

    return country;
  }

  clearCache() {
    this.games = [];
    this.competitions = [];
    this.countries = [];
  }
}

const gamesRepository = new GamesRepository();

module.exports = { gamesRepository };

