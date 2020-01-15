const express = require('express'),
    axios = require('axios').default;

var router = express.Router();

const { silosConfig } = require('../config/config');
const videoSilos = silosConfig.silos.videos;

router.post("/logout",function(req,response){
    axios.post('https://' + videoSilos.host + videoSilos.endpoint + "/logout")
    .then(function(res){
        req.session.destroy();
        response.status(200).json(true);
    }).catch(function (error) {
        response.status(500).json(error);
    });

});

router.post("/search/:site", function(req, response){
    axios.post('https://' + videoSilos.host + videoSilos.endpoint + "/search/"+req.params.site,{
        search : req.body.search,
        user : req.session.user,
    }).then(function (res) {
        response.status(200).json(res.data);
    }).catch(function (error) {
        response.status(500).json(error);
    });
});

router.get("/play",function(req,response){
        var result = {
            user : req.session.user,
            video : req.session.video
        }
        response.status(200).json(result);
})

router.post("/addFav/:id/:brand",function(req,response){
    axios.post('https://' + videoSilos.host + videoSilos.endpoint + "/addFav/"+req.params.id+"/"+req.params.brand,{
        _id : req.session.user._id,
        firstname : req.session.user.firstname,
    })
    .then(function (res) {
        response.status(200).json(res.data);
    }).catch(function (error) {
        response.status(500).json(error);
    });
    
})

router.post("/addVideoToPlaylist/:video/:playlist",function(req,response){
    axios.post('https://' + videoSilos.host + videoSilos.endpoint + "/addVideoToPlaylist/"+req.params.video+"/"+req.params.playlist,{
        _id : req.session.user._id,
    })
    .then(function (res) {
        response.status(200).json(res.data);
    }).catch(function (error) {
        response.status(500).json(error);
    });
})

router.post("/open/:id/:brand",function(req,response){
    axios.post('https://' + videoSilos.host + videoSilos.endpoint + "/open/"+req.params.id+"/"+req.params.brand)
    .then(function (res) {
        req.session.video = res.data;
        response.status(200).json(true);
    }).catch(function (error) {
        response.status(500).json(error);
    });
})
/*on recupere l'id des vidéos, on cherche dans la base de donnée les videos en rapport avec l'user
et on appelle youtube avec l'id des videos, on les renvoie */ 
router.get("/favorites",function(req,response){
    req.session.video = {};
    if(typeof req.session.user === 'undefined' ){
        axios.get('https://' + videoSilos.host + videoSilos.endpoint + "/favorites",{
        params: {
            _id : null
        }
        }).then(function (res) {
            response.status(200).json(res.data);
        }).catch(function (error) {
            response.status(500).json(error);
        });
    } else {
        axios.get('https://' + videoSilos.host + videoSilos.endpoint + "/favorites",{
        params: {
            _id : req.session.user._id,
            firstname : req.session.user.firstname,
        }
        }).then(function (res) {
            response.status(200).json(res.data);
        }).catch(function (error) {
            response.status(500).json(error);
        });
    }
})


router.delete("/deleteFav/:id",function(req,response){
    axios.delete('https://' + videoSilos.host + videoSilos.endpoint + "/deleteFav/"+req.params.id,{
        user :{  
            _id : req.session.user._id,
            firstname : req.session.user.firstname,
        }
    })
    .then(function (res) {
        response.status(200).json(res.data);
    }).catch(function (error) {
        response.status(500).json(error);
    });
})

router.get("/getPlaylistSet",function(req,response){
    req.session.playlist = {};
    axios.get('https://' + videoSilos.host + videoSilos.endpoint + "/getPlaylistSet",{
        params: {
            _id : req.session.user._id,
            firstname : req.session.user.firstname,
        }
    })
    .then(function (res) {
        response.status(200).json(res.data);
    }).catch(function (error) {
        response.status(500).json(error);
    });
})

router.post("/addPlaylist",function(req,response){
    axios.post('https://' + videoSilos.host + videoSilos.endpoint + "/addPlaylist",{
        name : req.body.name,
        _id : req.session.user._id,
    }).then(function (res) {
        response.status(200).json(res.data);
    }).catch(function (error) {
        response.status(500).json(error);
    });
})

router.post("/openPlaylist/:id",function(req,response){
    req.session.playlist = req.params.id;
    axios.post('https://' + videoSilos.host + videoSilos.endpoint + "/openPlaylist/"+req.params.id)
    .then(function (res) {
        response.status(200).json(res.data);;
    }).catch(function (error) {
        response.status(500).json(error);
    });
})

router.delete("/deletePlaylist/:id",function(req,response){
    axios.delete('https://' + videoSilos.host + videoSilos.endpoint + "/deletePlaylist/"+req.params.id).
    then(function (res) {
        response.status(200).json(res.data);
    }).catch(function (error) {
        response.status(500).json(error);
    });
})

router.delete("/deleteFromPlaylist/:id",function(req,response){
    axios.delete('https://' + videoSilos.host + videoSilos.endpoint + "/deleteFromPlaylist/"+req.params.id,{
        params: {
            playlist : req.session.playlist,
        },
    }).then(function (res) {
        response.status(200).json(res.data);
    }).catch(function (error) {
        response.status(500).json(error);
    });
})

module.exports = router;