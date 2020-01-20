const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://dbGV:v17003937@clustergv-ms4c6.mongodb.net/test?retryWrites=true";
const client = new MongoClient(uri, { useNewUrlParser: true });

var db;

var dataLayerVideo = {
    init : function(cb){

        client.connect(function(err){
            if(err) throw err;

            db = client.db("dbGVVideos");
            cb();
        });

    },

    getPlaylistSet : function(user,cb){

        db.collection("Playlist").find({"auteur" : user}).toArray(function(err,docs) {
            cb(docs);
        });
    },

    getVideoSetPlaylist : function(playlist,cb){
        db.collection("VideoPlaylist").find({"playlist" :playlist}).toArray(function(err,docs){
            cb(docs);
        })
    },

    getVideosById : function(liste,cb){
        ObjectID = require('mongodb').ObjectID;
        var ids = [];
        liste.forEach(function(item){
            ids.push(new ObjectID(item.video));
        })
        //})
        //cb(listes);*/
        db.collection("Videos").find({"_id" : {$in: ids}}).toArray(function(err,docs) {
            cb(docs);
        });
    },

    insertPlaylist : function(list,cb){
        db.collection("Playlist").insertOne(list,function(err,result){
            cb();
        })
    },

    insertVideoToPlaylist: function (object,cb){
        db.collection("VideoPlaylist").insertOne(object,function(err,result){
            cb();
        })
    },

    getPlaylist : function(id,cb){
        ObjectID = require('mongodb').ObjectID;
        var ident = {
            _id : new ObjectID(id)
        };
        db.collection("Playlist").findOne(ident,function(err,docs){
            cb(docs);
        })
    },

    getPlaylistByName : function(name,user,cb){
        db.collection("Playlist").findOne({"name":name,"auteur":user},function(err,docs){
            cb(""+docs["_id"]);
        })
    },

    deletePlaylist : function(id,cb){
        ObjectID = require('mongodb').ObjectID;
        var ident = {
            _id : new ObjectID(id)
        };
        db.collection("Playlist").deleteOne(ident,function(err,result){
            cb();
        })
    },

    getVideoSetVideo : function(video,cb){
        db.collection("VideoPlaylist").find({"video" :video}).toArray(function(err,docs){
            cb(docs);
        })
    },

    isVideoInPlaylist : function(video,playlist,cb){
        db.collection("VideoPlaylist").find({"video" :video,"playlist":playlist}).toArray(function(err,docs){
            cb(docs);
        })
    },

    isVideoInFav : function(id,user,cb){
        db.collection("Videos").find({"id" :id,"user":user}).toArray(function(err,docs){
            cb(docs);
        })
    },

    insertVideo : function(video,cb){
        db.collection("Videos").insertOne(video,function(err,result){
            cb();
        })
    },

    /*cherche dans la base de données les videos en rapport avec l'id
      Renvoie la liste de toutes les videos */
    getVideos : function (id,cb){
        db.collection("Videos").find({"user": id}).toArray(function(err,docs){
            cb(docs);
        })
    },

    deleteFav : function(id,cb){
        ObjectID = require('mongodb').ObjectID;
        var ident = {
            _id : new ObjectID(id)
        };
        db.collection("Videos").deleteOne(ident,function(err,result){
            cb();
        })
    },

    deleteVideoFromPlaylists : function(id,cb){
        db.collection("VideoPlaylist").deleteMany({"video":id},function(err,result){
            cb();
        })
    },

    deleteVideoFromPlaylist : function(id,playlist,cb){
        var ident = {
            _id : id,
            playlist: playlist
        }
        db.collection("VideoPlaylist").deleteOne(ident,function(err,result){
            cb();
        })
    },

    deleteVideosFromPlaylist : function(playlist,cb){
        db.collection("VideoPlaylist").deleteMany({"playlist": playlist},function(err,result){
            cb();
        })
    },

}


module.exports = dataLayerVideo;