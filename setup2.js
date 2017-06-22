const Sequelize = require('sequelize');
var sequelize = new Sequelize('database','username', 'password', {
  dialect: 'sqlite',
  storage: 'database.sqlite'
});

const CoinValue = sequelize.define('CoinValue', {
  currencyPair: Sequelize.STRING,
  high: Sequelize.DOUBLE,
  highestDate: Sequelize.DATE,
  low: Sequelize.DOUBLE,
  lowestDate: Sequelize.DATE,
  highestVolume: Sequelize.DOUBLE,
  highestVolumeDate: Sequelize.DATE
});

module.exports = {
  sequelize: sequelize,
  CoinValue: CoinValue
};
// sequelize.sync()
//   .then(() => User.create({
//     username: 'janedoe',
//     birthday: new Date(1980, 6, 20)
//   }))
//   .then(jane => {
//     console.log(jane.get({
//       plain: true
//     }));
//   });