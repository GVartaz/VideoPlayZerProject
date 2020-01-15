const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://dbGV:v17003937@clustergv-ms4c6.mongodb.net/test?retryWrites=true";
const client = new MongoClient(uri, { useNewUrlParser: true });

var db;

var dataLayerUser = {
    init : function(cb){

        client.connect(function(err){
            if(err) throw err;

            db = client.db("dbGV");
            cb();
        });

    },

    getUser : function(user,cb){
        db.collection("Users").findOne(user,function(err,docs) {
            cb(docs);
        });
    },

    getLogin : function(login,cb){
        db.collection("Users").findOne({"login" : login},function(err,docs) {
            cb(docs);
        });
    },

    createUser : function(user,cb){
        db.collection("Users").insertOne(user,function(err,result){
            cb();
        })
    },

}


module.exports = dataLayerUser;