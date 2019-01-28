const express = require('express')
const router = express.Router()
const Model = require('../models')
const Student = Model.Student

router.get('/', function(req, res) {

  Student.findAll({
    order : [['id', 'ASC']]
  })
    .then( students => {
      res.render('data', { allData : students, model : 'Student' })
    })
    .catch( err => {
      res.send(err)
    })
})

router.get('/add', function(req, res) {

  res.render('add', { model : 'Student', err : req.query.err })
})

router.post('/add', function(req, res) {

  let obj = 
    {
      first_name : req.body.first_name,
      last_name : req.body.last_name,
      email : req.body.email
    }

  Student.create(obj)
    .then( created => {
      res.redirect('/students')
    })
    .catch( err => {
      if(err.errors[0].message) {
        res.redirect('/students/add?err=' + err.errors[0].message.split(' ').join('+'))
      } else {
        res.send(err)
      }
    })

})

router.get('/:id/add-subject', function(req, res) {

  let studentData = null
  Student.findByPk(req.params.id)
    .then( stud => {
      if(!stud) {
        res.redirect('/students/')
      } else {
        // res.send(stud)
        // console.log(stud)
        studentData = stud
        return Model.Subject.findAll({ order : [[ 'id' , 'ASC' ]]})
      }
    })
    .then( subjects => {
      // console.log(subjects)
        res.render('addStudentSubject', { data : studentData, subjects : subjects })      
      // res.send(subjects)
    })
    .catch( err => {
      res.send(err)
    })
})

router.post('/:id/add-subject', function(req, res) {
  // console.log(req.params.id, req.body)
  Model.StudentSubject.findOne( { where : { StudentId : req.params.id, SubjectId : req.body.SubjectId}})
    .then( duplikat => {
      if(duplikat) {
        res.redirect('/students')
      } else {
        return Model.StudentSubject.create(
          { 
            StudentId: req.params.id, 
            SubjectId : req.body.SubjectId
          }
        )
      }
    })
    .then( created => {
      res.redirect('/students')
    })
    .catch( err => {
      res.send(err)
    })  
})
router.get('/edit/:id', function(req, res) {

  Student.findByPk(req.params.id)
    .then( student => {
      if(!student) {
        res.redirect('students')
      } else {
        res.render('edit', { data : student, model : 'Student', err : req.query.err })
      }
    })
    .catch( err => {
      res.send(err)
    })
})

router.post('/edit/:id', function(req, res) {
  
  let studentUpdate = {
    id : req.params.id,
    first_name : req.body.first_name,
    last_name : req.body.last_name,
    email : req.body.email
  }
  // console.log(studentUpdate)
  Student.update(studentUpdate , { 
      where : {
        id : req.params.id
      } 
  })
    .then( () => {
      res.redirect('/students')
    })
    .catch( err => {
      if(err.errors[0].message) {
        res.redirect('/students/edit/' + req.params.id + '?err=' + err.errors[0].message.split(' ').join('+'))
        // res.send(err.errors[0].message)
      } else {
        res.send(err)
      }
    })
})

router.get('/delete/:id', function(req, res) {

  Student.destroy({
    where : {
      id : req.params.id
    }
  })
    .then( deleted => {
      res.redirect('/students')
    })
    .catch( err => {
      res.send(err)
    })
})

module.exports = router