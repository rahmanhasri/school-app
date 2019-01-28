'use strict';
module.exports = (sequelize, DataTypes) => {
  const Teacher = sequelize.define('Teacher', {
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
          return Teacher.findOne( { where: { email : value } } )
            .then( data => {
              if(data) {
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
    SubjectId : DataTypes.INTEGER
  }, {});
  Teacher.associate = function(models) {
    // associations can be defined here
    
    Teacher.belongsTo( models.Subject )

    Teacher.prototype.checkSubject = function() {

      if(this.Subject == null) {
        // console.log('masukkkkk')
        return 'unassigned'
      } else {
        return this.Subject.subject_name
      }
    }

    Teacher.prototype.getFullName = function() {
      return this.first_name + ' ' + this.last_name
    }
  };
  return Teacher;
};