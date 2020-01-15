const VimeoAPI =  require("vimeo").Vimeo;
const vimeoAPI = new VimeoAPI("3c09c013e324539dc822fdd8f2e5e1b561c3550e", "9d4whPuGHeaunDu/GApmduhH2F/S6CxvHjjJXlkaat+o5t/Rfg8ypdGSq3ONK52rU68zxXGnWzrLuxLPaboTMOZxvRTKOx2ESXqbcL+xxAaqgpZ4qrHwbyJbKAhadA+m", "4a3404cc7655a25f66eb9d375879965c");



class Vimeo {
    constructor() {
    }

    search(keyWords, maxResults, page = 1) {
        return new Promise(function (resolve, reject) {
            vimeoAPI.request({
                // This returns the first page of videos containing the term "vimeo staff".
                // These videos will be sorted by most relevant to least relevant.

                path: '/videos',
                query: {
                    page: page,
                    per_page: maxResults,
                    query: keyWords,
                    sort: 'relevant',
                    direction: 'asc'
                }
            }, function (error, body, statusCode, headers) {
                if (error) {
                    reject(error);
                } else {
                    body.data.map(function (video) {
                        video.brand = "Vimeo";
                        video.embedurl = "https://player.vimeo.com/video/"+video.id;
                        if((typeof video.description === 'string') && (video.description.length > 100)){
                            video.description = video.description.substring(0, 175).concat('', '...');
                        }
                    });
                    body.results = body['data'];
                    delete body['data'];
                    resolve(body);
                }
            });
        });
    }

    getVideoById(id){
        return new Promise(function (resolve, reject) {
            //path = '/videos/numberOfId'
            vimeoAPI.request({
                method: 'GET',
                path: '/videos/' + id
            }, function (error, body, statusCode, headers) {
                if (error) {
                    reject(error);
                } else {
                    resolve(body);
                }
            });
        });
    };

    normalize(video,user){
        var result = {};

        result.id = video.uri.replace("/videos/", "");
        result.title = video.name;
        result.description = video.description;

        result.miniatureUrl = video.pictures.sizes[2].link;
        result.miniatureWidth = video.pictures.sizes[2].width;
        result.miniatureHeight = video.pictures.sizes[2].height;

        result.channel = video.user.name;

        result.embedurl = "https://player.vimeo.com/video/"+result.id;

        result.publishedAt = video.release_time;

        result.brand = "Vimeo";

        result.user = user;
        return result;
    }
}

module.exports = new Vimeo();