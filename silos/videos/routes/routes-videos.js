const express = require("express");

const dataLayerVideo = require("../server/dataLayerVideo");
const Youtube = require("../server/api-streaming/Youtube");
const Vimeo = require("../server/api-streaming/Vimeo");
const router = express.Router();


    router.post("/logout",function(req,res){
        
        req.session.destroy();
        res.send(true);

    });

        router.post("/search/:site", function(req, res){
            var that = this;
            //get param
            var slug = req.body.search;
            if(slug){
                var i;
                switch(req.params.site) {
                    case '1':
                        Vimeo.search(slug.toString().toLowerCase(),10).then(function (data) {
                            for(i=0;i<data.results.length;i++){
                                data.results[i] = Vimeo.normalize(data.results[i],null);
                            }
                            if(typeof req.body.user === 'undefined'){
                                res.send({videos : data,user:false});
                            } else {
                                var user = {
                                    _id : req.body.user._id,
                                    firstname : req.body.user.firstname
                                }
                                res.send({videos : data,user:user});
                            }
                        }).catch(function (err) {
                            res.send(err);
                        })
                        break;
                    case '2':
                        Youtube.search(slug.toString().toLowerCase(),10).then(function (data) {
                            
                            for(i=0;i<data.results.length;i++){
                                data.results[i] = Youtube.normalize(data.results[i],null);
                            }
                            if(typeof req.body.user === 'undefined'){
                                res.send({videos : data,user:false});
                            } else {
                                var user = {
                                    _id : req.body.user._id,
                                    firstname : req.body.user.firstname
                                }
                                res.send({videos : data,user:user});
                            }
                        }).catch(function (err) {
                            res.send(err);
                        })
                        break;
                    case '3':
                        Promise.all([Vimeo.search(slug.toString().toLowerCase(), 10), Youtube.search(slug.toString().toLowerCase(),10)]).then(function (data) {
                            for(i=0;i<10;i++){
                                data[0].results[i] = Vimeo.normalize(data[0].results[i],null);
                            }
                            for(i=0;i<10;i++){
                                data[1].results[i] = Youtube.normalize(data[1].results[i],null);
                            }
                            var videos = {};
                            videos.results = data[0].results.concat(data[1].results);
                            if(typeof req.body.user === 'undefined'){
                                res.send({videos : videos,user:false});
                            } else {
                                var user = {
                                    _id : req.body.user._id,
                                    firstname : req.body.user.firstname
                                }
                                res.send({videos : videos,user:user});
                            }
                        }).catch(function (err) {
                            res.send(err);
                        })
                        break;
                    default:
                        console.log("default");
                        break;
                }
            }
        
        });

        router.post("/addFav/:id/:brand",function(req,res){
            var u = req.body;
            var brand = req.params.brand;
            if(brand == "Youtube"){
                Youtube.getVideoById(req.params.id).then(function(video) {
                    dataLayerVideo.isVideoInFav(req.params.id,u._id,function(data){
                        if(data.length > 0){
                            res.send({user:u,add:false});
                        } else {
                            dataLayerVideo.insertVideo(Youtube.normalize(video,u._id),function(){
                                res.send({user:u,add:true});
                            })
                        }
                    })
                }).catch(function (err) {
                    res.send(err);
                })
            } else if(brand == "Vimeo"){
                Vimeo.getVideoById(req.params.id).then(function(video) {
                    dataLayerVideo.isVideoInFav(req.params.id,u._id,function(data){
                        if(data.length > 0){
                            res.send({user:u,add:false});
                        } else {
                            dataLayerVideo.insertVideo(Vimeo.normalize(video,u._id),function(){
                                res.send({user:u,add:true});
                            })
                        }
                    })
                }).catch(function (err) {
                    res.send(err);
                })
            }
            
        })
        
        router.post("/addVideoToPlaylist/:video/:playlist",function(req,res){
            dataLayerVideo.getPlaylistByName(req.params.playlist,req.body._id,function(data){
                var objet = {
                    video : req.params.video,
                    playlist: data
                };
                dataLayerVideo.isVideoInPlaylist(req.params.video,data,function(data){
                    if(data.length > 0){
                        res.send(false);
                    } else {
                        dataLayerVideo.insertVideoToPlaylist(objet,function(){
                            res.send(true);  
                        })
                    }
                })
            })
        })
        
        router.post("/open/:id/:brand",function(req,res){
            var brand = req.params.brand;
            if(brand == "Youtube"){
                Youtube.getVideoById(req.params.id).then(function(video) {
                    var video = Youtube.normalize(video,null);
                    res.send(video);
                }).catch(function (err) {
                    res.send(err);
                })
            } else if(brand =="Vimeo"){
                Vimeo.getVideoById(req.params.id).then(function(video) {
                    var video = Vimeo.normalize(video,null);
                    res.send(video);
                }).catch(function (err) {
                    res.send(err);
                })
            }
            
        })
        /*on recupere l'id des vidéos, on cherche dans la base de donnée les videos en rapport avec l'user
        et on appelle youtube avec l'id des videos, on les renvoie */ 
        router.get("/favorites", function(req,res){
            var user = req.query._id;
            if(user == null ){
                res.send(false);
            } else {
                dataLayerVideo.getPlaylistSet(user,function(data){
                    liste = data;
                    dataLayerVideo.getVideos(user,function(data){
                        res.send({videos:data, playlists : liste,user: req.query});
                    })
                });
            }
        })
        
        
        router.delete("/deleteFav/:id",function(req,res){
            var id = req.params.id;
            dataLayerVideo.deleteFav(id,function(){
                dataLayerVideo.deleteVideoFromPlaylists(id,function(){
                    res.send(req.body);
                })
            })
        })
        
        router.get("/getPlaylistSet",function(req,res){
            req.session.playlist = {};
            var user = req.query;
            dataLayerVideo.getPlaylistSet(user._id,function(data){
                res.send({playlistSet: data,user: user});
            });
        })
        
        router.post("/addPlaylist",function(req,res){
            var list = {
                name : req.body.name,
                auteur : req.body._id
            };
            dataLayerVideo.insertPlaylist(list,function(){
                res.send(true);
            });
        })
        
        router.post("/openPlaylist/:id",function(req,res){
            var id = req.params.id;
            req.session.playlist = id;
            dataLayerVideo.getVideoSetPlaylist(id,function(data){
                var liste = data;
                dataLayerVideo.getVideosById(liste,function(data){
                    res.send(data);
                })
            })
        })
        
        router.delete("/deletePlaylist/:id",function(req,res){
            var id = req.params.id;
                dataLayerVideo.deleteVideosFromPlaylist(id,function(){
                    dataLayerVideo.deletePlaylist(id,function(){
                        dataLayerVideo.getPlaylistSet(id,function(data){
                            res.send(data);
                        });
                    });
                });
        })
        
        router.delete("/deleteFromPlaylist/:id",function(req,res){
            var id = req.params.id;
            dataLayerVideo.getVideoSetVideo(id,function(data){
                data = data[0]._id;
                dataLayerVideo.deleteVideoFromPlaylist(data,req.query.playlist,function(){
                    dataLayerVideo.getVideoSetPlaylist(id,function(data){
                        var liste = data;
                        dataLayerVideo.getVideosById(liste,function(data){
                            res.send(data);
                        })
                    })
                })
            })
        })
	
module.exports = router;