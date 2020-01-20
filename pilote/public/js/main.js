'use strict';

var demoApp = angular.module('demoApp', []);

demoApp.controller('InscriptionController',function ($scope, $http){

    $scope.formLogin = {};

    $scope.createUser = function(){
        var login = document.getElementById("adresse");
        var pwd = document.getElementById("password");
        var confirmPsw = document.getElementById("confirmed_password");
        var agree = document.getElementById("agreement");
        if(login.value == ""){
            login.style.borderColor = "#FF0000";
        }
        else if(login.value.indexOf("@") == -1){
            login.style.bordercolor = "#FF0000";
            alert("Adresse invalide");
        }
        else if(pwd.value == ""){
            pwd.style.borderColor = "#FF0000";
        }
        else if(pwd.value != confirmPsw.value){
            confirmPsw.style.borderColor = "#FF0000";
            alert("Les mots de passe ne correspondent pas");
        }
        
        else if(!agree.checked){
            alert("Veuillez cocher la case pour valider les termes")
        }
         else{
            login.style.borderColor = null;
            pwd.style.borderColor = null;
            $http.post('/api/users/addUser',$scope.formLogin).then(function(resp){
                if(resp.data == false){
                    login.style.borderColor = "#FF0000";
                    alert("Identifiant déjà utilisé. Veuillez en choisir un autre");
                    login.value = "";
                    pwd.value = "";
                } else {
                    $scope.formLogin = {};
                    window.location.href = "./index.html";
                    alert("Inscription réussie");
                }
            });
        }
    };
});

demoApp.controller('LoginController',function ($scope, $http, $location){

    $scope.formLogin = {};

    $scope.guestSearch = function () {
        window.location.href = "./search.html"
    }

    $scope.connexion = function(){
        var login = document.getElementById("login");
        var pwd = document.getElementById("password");
        if(login.value == ""){
            login.style.borderColor = "#FF0000";
        }
        if(pwd.value == ""){
            pwd.style.borderColor = "#FF0000";
        }
        if(login.value != "" && pwd.value != "" ){
            login.style.borderColor = null;
            pwd.style.borderColor = null;
            $http.post('/api/users/connexion',$scope.formLogin).then(function(resp){
                if(resp.data == false){
                    alert("Identifiants incorrects");
                    login.value = "";
                    pwd.value = "";
                } else {
                    $scope.formLogin = {};
                    window.location.href = "./search.html";
                    alert("Connexion réussie");
                }
            });
        }
    };
});

demoApp.controller('SearchController',function($scope,$http){
    $scope.formVideo = {};

    $scope.createSearch = function (){
        document.getElementById("results-warning").innerHTML = "";
        document.getElementById("videos").style.display = "inline-block";
        var yt = document.getElementById("yt").checked;
        var vimeo = document.getElementById("vimeo").checked;
        var site;
        if(vimeo && yt){
            site = 3
        } else if(!vimeo && yt){
            site = 2;
        } else if(vimeo && !yt){
            site = 1;
        } else {
            site = 0;
        }
        if(site){
            $http.post('/api/videos/search/'+site,$scope.formVideo).then(function(resp){
                console.log(resp.data);
                $scope.videoSet = resp.data.videos.results;
                if(resp.data.videos.results.length == 0){
                    document.getElementById("results-warning").innerHTML = "Aucun résultat trouvé. Essayez avec d'autres mots-clés";
                } else {
                    document.getElementById("results-warning").innerHTML = "";
                }
                if(resp.data.user != false){
                    document.getElementById("divFavorites").style.display = "none";
                }
            })
        } else {
            document.getElementById("results-warning").innerHTML = "Sélectionnez au moins au des sites pour lancer une recherche";
        }
    }

    $scope.login = function(){
        window.location.href = "./index.html";
    }

    $scope.showFavorite = function(){
        window.location.reload();
    }
    
     /**Fonction qui affiche la list des favoris*/   
        $http.get('/api/videos/favorites').then(function(resp){
            if(resp.data != false){
                document.getElementById("warning").innerHTML = "";
                resp.data.videos.forEach(function(item){
                    if(item.description.length > 150){
                        item.description = item.description.substring(0,150)+"...";

                    }
                })
                $scope.user = resp.data.user;
                $scope.favoriteSet = resp.data.videos;
                $scope.playlistSet = resp.data.playlists;
            } else {
                document.getElementById("warning").innerHTML = "En tant qu'invité, vous ne pourrez pas sauvegarder "+
                "de vidéos dans vos favoris. Connectez vous ou inscrivez vous pour profiter de cette fonctionnalité";
            }
        })

    $scope.open = function (id,brand){
        $http.post('/api/videos/open/'+id+"/"+brand).then(function(resp){
            window.location.href = "./play.html";
        })
    }

    $scope.logout = function (){
        $http.post('/api/videos/logout').then(function(resp){
        })
        $http.post('/api/users/logout').then(function(resp){
            window.location.href = "./index.html";
        }
    )};

    $scope.addFav = function (id,brand){
        $http.post('/api/videos/addFav/'+id+'/'+brand).then(function(resp){
            if(resp.data.add == false){
                document.getElementById("fav"+id).innerHTML = "Cette vidéo est déjà dans vos favoris";
                document.getElementById("fav"+id).style.color = "red";
            } else {
                document.getElementById("fav"+id).innerHTML = "Vidéo ajouté à vos favoris";
                document.getElementById("fav"+id).style.color = "green";
                document.getElementById("addfav"+id).style.display = "none";
            }
                $scope.user = resp.data.user;
        })
    }

    $scope.videoToPlaylist = function(id){
         var Indata = {"id":id, "playlist":document.getElementById("select"+id).value}
         $http.post('/api/videos/addVideoToPlaylist/'+Indata.id+'/'+Indata.playlist).then(function(resp){
            if(resp.data){
                document.getElementById("addplaylist"+id).style.color = "green";
                document.getElementById("addplaylist"+id).innerHTML = "Vidéo ajouté à la playlist";
            } else {
                document.getElementById("addplaylist"+id).innerHTML = "La vidéo est déjà dans cette playlist";
                document.getElementById("addplaylist"+id).style.color = "red";
            }
        })
    }

    $scope.deleteFav = function (id){
        $http.delete('/api/videos/deleteFav/'+id).then(function(resp){
            $scope.user = resp.data;
            window.location.reload();
        }
    )};

});

demoApp.controller('PlayController',function ($scope, $http,$sce){

    $scope.trustSrc = function(src) {
        return $sce.trustAsResourceUrl(src);
    }

    $http.get('/api/videos/play').then(function(resp){
        $scope.video = resp.data.video;
        $scope.user = resp.data.user;
    })

    $scope.addFav = function (id,brand){
        $http.post('/api/videos/addFav/'+id+"/"+brand).then(function(resp){
            if(resp.data.add == false){
                document.getElementById("fav"+id).innerHTML = "Cette vidéo est déjà dans vos favoris";
                document.getElementById("fav"+id).style.color = "red";
            } else {
                document.getElementById("fav"+id).innerHTML = "Vidéo ajouté à vos favoris";
                document.getElementById("fav"+id).style.color = "green";
                document.getElementById("addfav"+id).style.display = "none";
            }
            $scope.user = resp.data.user;
        })
    }

    $scope.logout = function (){
        $http.post('/api/videos/logout').then(function(resp){
        })
        $http.post('/api/users/logout').then(function(resp){
            window.location.href = "./index.html";
        }
    )};

    $scope.login = function(){
        window.location.href = "./index.html";
    }

});

demoApp.controller('PlaylistController',function ($scope, $http){

    $scope.logout = function (){
        $http.post('/api/videos/logout').then(function(resp){
        })
        $http.post('/api/users/logout').then(function(resp){
            window.location.href = "./index.html";
        }
    )};

    $scope.createPlaylist = function (){
        if(document.getElementById("newListe").value == "") {
            document.getElementById("liste-warning").innerHTML = "Vous devez donner un nom à votre liste";
        } else {
            document.getElementById("liste-warning").innerHTML = "";
            $http.post('/api/videos/addPlaylist',$scope.formListe).then(function(resp){
                $scope.formListe = {};
                if(resp.data == true){
                    window.location.reload();
                } else {
                    document.getElementById("liste-warning").innerHTML = "Erreur lors de l'ajout";
                }
                
            });
        }
    };
    
    $scope.openPlaylist = function(id){
        var btns = document.getElementsByClassName("playlist-btn");
        for(var i=0;i<btns.length;i++){
            btns[i].setAttribute("style","color:black;background-color:none;")
        }
        document.getElementById("playlist"+id).style.backgroundColor = "rgba(32, 144, 196, 0.8)";
        document.getElementById("playlist"+id).style.color = "white";
        $http.post('/api/videos/openPlaylist/'+id).then(function(resp){
            document.getElementById("videoPlaylist").style.display = "block";
            if(resp.data.length==0){
                document.getElementById("vide").style.display = "inline-block";
            } else {
                document.getElementById("vide").style.display = "none";
            }
            $scope.videoSet = resp.data;
        })
    }

    $http.get('/api/videos/getPlaylistSet').then(function(resp){
        $scope.playlistSet = resp.data.playlistSet;
        $scope.user = resp.data.user;
    });

    $scope.open = function (id,brand){
        $http.post('/api/videos/open/'+id+"/"+brand).then(function(resp){
            window.location.href = "./play.html";
        })
    }

    $scope.deletePlaylist = function(id){
        $http.delete('/api/videos/deletePlaylist/'+id).then(function(resp){
            $scope.playlistSet = resp.data.playlistSet;
        })
        window.location.reload();
    }

    $scope.deleteFromPlaylist = function(id){
        $http.delete('/api/videos/deleteFromPlaylist/'+id).then(function(resp){
            $scope.videoSet = resp.data;
        })
    }

});