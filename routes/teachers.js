const express = require('express')
const router = express.Router()
const Model = require('../models')
const Teacher = Model.Teacher

router.get('/', function(req, res) {

  Teacher.findAll({
    order : [['id', 'ASC']]
  , include : [ Model.Subject ]})
    .then( teachers => {
      res.render('data', { allData : teachers, model : 'Teacher'})
      // res.send(teachers)
    })
    .catch( err => {
      res.send(err)
    })
})

router.get('/add', function(req, res) {

  res.render('add', { model : 'Teacher', err : req.query.err})
})

router.post('/add', function(req, res) {

  let obj = 
    {
      first_name : req.body.first_name,
      last_name : req.body.last_name,
      email : req.body.email
    }

  Teacher.create(obj)
    .then( created => {
      // console.log(created,'====')
      res.redirect('/teachers')
    })
    .catch( err => {
      // console.log(err, '===========')
      if(err.errors[0].message) {
        // res.send(err.errors[0].message)
        res.redirect('/teachers/add?err=' + err.errors[0].message.split(' ').join('+'))
      } else {
        res.send(err)
      }
    })

})

router.get('/edit/:id', function(req, res) {

  let teacherData = null
  Teacher.findByPk(req.params.id)
    .then( teacher => {
      if(!teacher) {
        res.redirect('teachers')
      } else {
        teacherData = teacher
        return Model.Subject.findAll()
      }
    })
    .then( subjects => {
      res.render('edit', { data : teacherData, model : 'Teacher', subjects, err: req.query.err })
    })
    .catch( err => {
      res.send(err)
    })
})

router.post('/edit/:id', function(req, res) {
  
  // res.send(req.body)
  let teacherUpdate = {
    id : req.params.id,
    first_name : req.body.first_name,
    last_name : req.body.last_name,
    email : req.body.email,
    SubjectId : req.body.SubjectId
  }
  // res.send(teacherUpdate)
  Teacher.update(teacherUpdate , { 
      where : {
        id : req.params.id
      }
  })
    .then( () => {
      res.redirect('/teachers')
    })
    .catch( err => {
      if(err.errors[0].message) {
        res.redirect('/teachers/edit/' + req.params.id + '?err=' + err.errors[0].message.split(' ').join('+'))        
        // res.send(err.errors[0].message)
      } else {
        res.send(err)
      }
    })
})

router.get('/delete/:id', function(req, res) {

  Teacher.destroy({
    where : {
      id : req.params.id
    }
  })
    .then( deleted => {
      res.redirect('/teachers')
    })
    .catch( err => {
      res.send(err)
    })
})

module.exports = router