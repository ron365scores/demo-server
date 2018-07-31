 const INTERVAL_UPDATE_TIME = 3000;
 const GAME_DATE_TIME_FORMAT = 'DD-MM-YYYY HH:mm';
 const GAME_DATE_FORMAT = 'DD-MM-YYYY';
 const DATE_OUTPUT_FORMAT = 'DD/MM/YYYY';
 const DEV_MODE = (true);

 const SPORT_TYPES = {
  soccer: 1,
  basketball: 2,
  tennis: 3,
  hockey: 4,
  handball: 5,
  football: 6,
  baseball: 7,
  flyball: 8,
  rogeby: 9,
};

 const SOCCER_EVENT_TYPES = {
  goal: 0,
  yellowCard: 1,
  redCard: 2,
  penaltyMiss: 3
};

 const WINNING_STATUSES = {
  winning: 1,
  draw: 0,
  loosing: 2
};

module.exports = { SPORT_TYPES, SOCCER_EVENT_TYPES, WINNING_STATUSES, INTERVAL_UPDATE_TIME, GAME_DATE_TIME_FORMAT, GAME_DATE_FORMAT, DATE_OUTPUT_FORMAT, DEV_MODE };
