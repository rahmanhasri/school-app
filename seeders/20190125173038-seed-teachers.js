'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Teachers', [
      {
        first_name: 'Bambang',
        last_name : 'Suprapto',
        email : 'bambangsuprapto@sekolah.id',
        createdAt : new Date(),
        updatedAt : new Date()
      },{
        first_name: 'Rukmana',
        last_name : 'Fatmawati',
        email : 'rukmanafatmawati@sekolah.id',
        createdAt : new Date(),
        updatedAt : new Date()
      },{
        first_name: 'Butet',
        last_name : 'Naiborhu',
        email : 'butetnaiborhu@sekolah.id',
        createdAt : new Date(),
        updatedAt : new Date()
      },{
        first_name: 'Yulius',
        last_name : 'Prawiranegara',
        email : 'yuliusprawiranegara@sekolah.id',
        createdAt : new Date(),
        updatedAt : new Date()
      }
    ])
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Teachers', null, {})
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};
