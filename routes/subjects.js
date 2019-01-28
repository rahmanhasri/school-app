const express = require('express')
const router = express.Router()
const Model = require('../models')
const Subject = require('../models').Subject

router.get('/', function(req, res) {

  let allData = null
  Subject.findAll({
    order : [['id', 'ASC']]
  })
    .then( subjects => {
      allData = subjects.map( subject => {
        return new Promise( (resolve, reject) => {
          subject.getTeachers()
            .then( teachers => {
              subject.dataValues.Teachers = teachers
              // subject.Teachers = teachers
              resolve(subject)
            })
            .catch( err => {
              reject(err)
            })
        })
      })
      
      return Promise.all(allData)
    })
    .then( data => {
      // res.send(data)
      // console.log(data[0])
      res.render('data', { allData : data, model: 'Subject' })
    })
    .catch( err => {
      res.send(err)
    })
})

router.get('/:id/enrolled-students', function(req, res) {

  // let subjectData = null
  // Subject.findByPk(req.params.id)
  //   .then( subj => {
  //     subjectData = subj
  //     return subj.getStudents()
  //   })
  //   .then( students => {
  //     subjectData.dataValues.Students = students
  //     res.send(subjectData)
  //     // res.render( 'subjectDetail', { data : subjectData })
  //   })
  //   .catch( err => {
  //     res.send(err)
  //   })

  Subject.findByPk(req.params.id, { include : [ Model.Student] })
    .then( subj => {
      // res.send(subj)
      res.render( 'subjectDetail', { data : subj })
    })
    .catch( err => {
      res.send(err)
    })
})

router.get('/:id/give-score', function(req, res) {
  
  Model.StudentSubject.findByPk(req.params.id , { include : [ Model.Student, Model.Subject] })
    .then( data => {
      // res.send(data)
      res.render('giveScore', { data } )
    })
    .catch( err => {
      res.send(err)
    })
})

router.post('/:id/give-score', function(req, res) {

  Model.StudentSubject.update( { score : req.body.score }, { where : { id : req.params.id}})
    .then( updated => {
      return Model.StudentSubject.findByPk(req.params.id)
    })
    .then( studentSubj => {
      res.redirect(`/subjects/${studentSubj.SubjectId}/enrolled-students`)      
    })
    .catch( err => {
      res.send(err)
    })
})

router.get('/add', function(req, res) {

  res.render('add', { model: 'Subject', err : req.query.err })
})

router.post('/add', function(req, res) {

  let obj = 
    {
      subject_name : req.body.subject_name
    }

  Subject.create(obj)
    .then( created => {
      res.redirect('/subjects')
    })
    .catch( err => {
      res.send(err)
    })
})

router.get('/edit/:id', function(req, res) { // Belum selesai

  let subjectData = null
  Subject.findByPk(req.params.id)
    .then( subject => {
      if(!subject) {
        res.redirect('/subjects')
      } else {
        // res.send(subject.getTeacher())
        // console.log(subject.getTeachers())
        res.render('edit', { data : subject, model: 'Subject' })
        // subjectData = subject
        // return subject.getTeachers()
      }
    })
    // .then( teachers => {
    //     // res.render('edit', { data : subjectData, model: 'Subject' })
    //     res.send(teachers)
    // })
    .catch( err => {
      res.send(err)
    })
})

router.post('/edit/:id', function(req, res) {
  
  // res.send(req.body)
  // console.log(req.body)
  let subjectUpdate = {
    id : req.params.id,
    subject_name : req.body.subject_name
  }

  Subject.update(subjectUpdate , { 
      where : {
        id : req.params.id
      } 
  })
    .then( () => {
      res.redirect('/subjects')
    })
    .catch( err => {
      res.send(err)
    })
})

router.get('/delete/:id', function(req, res) {

  Subject.destroy({
    where : {
      id : req.params.id
    }
  })
    .then( deleted => {
      res.redirect('/subjects')
    })
    .catch( err => {
      res.send(err)
    })
})

module.exports = router