var express = require('express');
var app = express();
var fs = require("fs");
var promise = require('bluebird')
var bodyParser = require('body-parser');
var multer = require('multer');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ dest: '/tmp/' }).array('image'));

app.get('/index.htm', function (req, res) {
    res.sendFile(__dirname + "/" + "index.htm");
})

app.post('/file_upload', function (req, res) {

    // 上传的文件信息
    var responsearray=[];
    var arrayfile=[];
    for (var i = 0; i < req.files.length; i++) {
        arrayfile.push(i);
    }
    uploadmultifile(arrayfile).then(()=>{
        console.log('upload all finished');
        res.end('upload all finished');
    })
    function uploadmultifile(arrayfile){
        return new promise.map(arrayfile,i=>{
            console.log(req.files[i]);
            var des_file = __dirname + "/temp/" + req.files[i].originalname;
            fs.readFile(req.files[i].path, function (err, data) {
                fs.writeFile(des_file, data, function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        response = {
                            message: 'File uploaded successfully',
                            filename: req.files[i].originalname
                        };
                    }
                    console.log(response);
                    responsearray.push(response);
                    ;
                });
            });
        });
    }






   

})

var server = app.listen(8081, function () {

    var host = server.address().address
    var port = server.address().port

    console.log("应用实例，访问地址为 http://%s:%s", host, port)

})