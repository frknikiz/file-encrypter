var enc_files=[];
var dec_files=[];
var gui = require('nw.gui');
var win = gui.Window.get();
win.title="File Encrypter";

var encryptor = require('./assets/file-encryptor.js')
        ,path=require("path"),
        fs=require("fs");
        

var app = angular.module('StarterApp', ['ngMaterial']).config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('teal');
});

app.controller('AppCtrl', ['$scope','$mdToast', function($scope,$mdToast){
    $scope.tabNumber=1;
    $scope.dosya=null;
    $scope.isSelect= function(val)
    {
        return val==$scope.tabNumber;
    };
    $scope.tabSelect= function (val)
    {
        $scope.tabNumber=val;
    };

    $scope.closeWindow= function ()
    {
        win.close();
    };
    $scope.downWindow= function ()
    {
        win.minimize();
    }
}]);

app.controller("EncrptyCtrl",['$scope','$mdToast', function ($scope,$mdToast)
{

    $scope.password="";
    $scope.startConvert= function ()
    {

      

        enc_files.forEach(function (data)
        {

            $(data.previewElement).find(".dz-success-mark").css("opacity",0);
            var url=data.path;
            if(url==undefined) return;

            var name=path.basename(url);
            var dirname=path.dirname(url).replace(/\\/gi,"/");
            var new_url=dirname+"\\encrypted\\"+name+".dat";
            new_url=new_url.replace(/\\/gi,"/");

            if(!fs.existsSync(path.dirname(new_url))){

                fs.mkdirSync(path.dirname(new_url), 0777, function(err){
                    if(err){
                        console.log("Dosya oluşturma hatası : ",err);
                    }
                });
            }

            encryptor.encryptFile(url, new_url, $scope.password, function(count) {
                $(data.previewElement).find(".dz-progress").css("width",count);
                  if (count>=80) 
                    {
                         $(data.previewElement).find(".dz-progress").css("width",0);
                         $(data.previewElement).find(".dz-success-mark").css("opacity",1);
                    };
            });

            $(data.previewElement).find(".dz-progress").css("display","inherit").css("width","80");

        });
    }
}]);
app.controller("DecrptyCtrl",['$scope','$mdToast', function ($scope,$mdToast)
{
    $scope.password="";
    $scope.startConvert= function ()
    {        

        dec_files.forEach(function (data)
        {

            $(data.previewElement).find(".dz-success-mark").css("opacity",0);
            
            var url=data.path;
            if(url==undefined) return;

            var name=path.basename(url.replace(".dat",""));
            var dirname=path.dirname(url).replace(/\\/gi,"/");
            var new_url=dirname+"\\decrypted\\"+name;
            new_url=new_url.replace(/\\/gi,"/");


            if(!fs.existsSync(path.dirname(new_url))){

                fs.mkdirSync(path.dirname(new_url), 0777, function(err){
                    if(err){
                        console.log("Dosya oluşturma hatası : ",err);
                    }
                });
            }

            encryptor.decryptFile(url, new_url, $scope.password, function (count)
            {
                $(data.previewElement).find(".dz-progress").css("width",count);
                 if (count>=80) 
                    {
                         $(data.previewElement).find(".dz-progress").css("width",0);
                         $(data.previewElement).find(".dz-success-mark").css("opacity",1);
                    };
            });
        });
    }
}]);

document.body.addEventListener('dragover', function(e){
    e.preventDefault();
    e.stopPropagation();
}, false);
document.body.addEventListener('drop', function(e){
    e.preventDefault();
    e.stopPropagation();
}, false);

// The recommended way from within the init configuration:
Dropzone.options.encDropzone = {

    autoProcessQueue: false,
    dictDefaultMessage:"Drag here to encrypt files",
    paramName: "file",
    maxFilesize:2048,
    addRemoveLinks: true,
    init: function() {
        this.on("addedfile", function(file,b) {
            window.enc_files.push(file);
            $(file.previewElement).find(".dz-progress").css("width",0);
        });
    }
};
Dropzone.options.decDropzone = {
    autoProcessQueue: false,
    dictDefaultMessage:"Drag here to decrypt files",
    paramName: "file",
    maxFilesize:2048,
    addRemoveLinks: true,
    init: function() {
        this.on("addedfile", function(file,b) {
            window.dec_files.push(file);
            $(file.previewElement).find(".dz-progress").css("width",0);
        });
    }
};



