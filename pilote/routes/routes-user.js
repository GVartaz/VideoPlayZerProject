const express = require('express'),
    axios = require('axios').default;

var router = express.Router();

const { silosConfig } = require('../config/config');
const usersSilos = silosConfig.silos.users;

router.post("/connexion",function(req,response){
    axios.post('http://' + usersSilos.host + usersSilos.endpoint + "/connexion", {
        login : req.body.login,
        pwd : req.body.pwd
    }).then(function(res){
        req.session.user = res.data;
        response.status(200).json(res.data);
    }).catch(function (error) {
        response.status(500).json(error);
    });
    
})

router.post("/logout",function(req,response){
    axios.post('http://' + usersSilos.host + usersSilos.endpoint + "/logout")
    .then(function(res){
        req.session.destroy();
        response.status(200).json(true);
    }).catch(function (error) {
        response.status(500).json(error);
    });

});

router.post("/addUser",function(req,response){
    var user = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        login : req.body.login,
        pwd : req.body.pwd
    };
    axios.post('http://' + usersSilos.host + usersSilos.endpoint + "/addUser", {
        firstname: user.firstname,
        lastname: user.lastname,
        login : user.login,
        pwd : user.pwd
    }).then(function(res){
        response.status(200).json(res.data);
    }).catch(function (error) {
        response.status(500).json(error);
    });
    
})

module.exports = router;