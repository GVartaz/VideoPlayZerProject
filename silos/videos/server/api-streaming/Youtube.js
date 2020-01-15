var searchYT = require('youtube-search');
const apiKeyYoutube = 'AIzaSyBMJSr7HrSphkNRWwYW8oG-Pedf9LcAxDE';
const YouTubeAPI  = require("simple-youtube-api");
const youtubeAPI = new YouTubeAPI(apiKeyYoutube);


class Youtube {
    constructor() {

    }

    search(keyWords, maxResults, pageToken = null){
        var opts = {
            maxResults: maxResults,
            key: apiKeyYoutube,
            regionCode: 'FR',
            pageToken : pageToken,
            type: 'video'
        };

        return new Promise(function (resolve, reject) {
            searchYT(keyWords, opts).then(function (results) {
                results.results.map(function (video) {
                    video.brand = "Youtube";
                    video.embedurl = "http://www.youtube.com/embed/"+video.id;
                });
                resolve(results);
            }).catch(function(err){
                reject(err);
            })
        })
    };

    getVideoById(id){
        return new Promise(function (resolve, reject) {
            youtubeAPI.getVideoByID(id).then(function (results) {
                results.channelTitle = results.channel.title;
                resolve(results);
            }).catch(function(err){
                reject(err);
            })
        })
    };

    normalize(video,user){
        
        var result = {};

        result.id = video.id;
        result.title = video.title;
        result.description = video.description;

        result.miniatureUrl = video.thumbnails.medium.url;
        result.miniatureWidth = video.thumbnails.medium.width;
        result.miniatureHeight = video.thumbnails.medium.height;

        result.channel = video.channelTitle;
        
        result.embedurl = "http://www.youtube.com/embed/"+video.id;

        result.publishedAt = video.publishedAt;

        result.brand = "Youtube";
        
        result.user = user;
        
        return result;
    }
}

module.exports = new Youtube();