'use strict';
module.exports = (sequelize, DataTypes) => {
  const Student = sequelize.define('Student', {
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      validate : {
        isEmail : {
          args: true,
          msg: 'Email input must be an email format'
        },
        isUnique : function(value) {
          return Student.findOne( { where: { email : value } } )
            .then( data => {
              if(data) {
                // console.log(data.id, this.id)
                if(data.id != this.id) {
                  throw new Error(`Email sudah terpakai`)
                }
              }
            })
            .catch( err => {
              throw err
            })
        }
      } 
    },
  }, {});
  Student.associate = function(models) {
    // associations can be defined here

    Student.belongsToMany(models.Subject, { through : 'StudentSubject'} )

    Student.prototype.getFullName = function() {
      return this.first_name + ' ' + this.last_name
    }

  };
  return Student;
};