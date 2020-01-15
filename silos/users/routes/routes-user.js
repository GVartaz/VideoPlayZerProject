const express = require("express");
const dataLayerUser = require("../server/dataLayerUser");
var router = express.Router();

router.post("/connexion",function(req,res){
    var user = {
        login : req.body.login,
        pwd : req.body.pwd
    };
    dataLayerUser.getUser(user,function(data){
        if(data != null) {
            req.session.user = data;
            res.send(data);
        } else {
            res.send(false);
            //console.log("Vos identifiants sont incorrects. Veuillez réssayer.");
        }
    });
})

router.post("/logout",function(req,res){
    
    req.session.destroy();
    res.send(true);

});

router.post("/addUser",function(req,res){
    var user = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        login : req.body.login,
        pwd : req.body.pwd
    };
        dataLayerUser.getLogin(user.login,function(data){
        if(data == null) {
            dataLayerUser.createUser(user,function(){
                res.send(true);
            });
        } else {
            res.send(false);
        }
    })
})

module.exports = router;