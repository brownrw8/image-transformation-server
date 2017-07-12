const fs = require('fs');
const path = require('path');
const uuidv4 = require('uuid/v4');
const gen = require('random-seed');
const Jimp = require('jimp');
const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const dirs = {
  views: 'views',
  uploads: 'uploads',
  processed: 'processed'
};

const maxTranformations = 10;

app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 },
  preserveExtension: true,
  safeFileNames: true
}));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, dirs.views, 'upload.html'));
});

app.get('/download/:uniqueId', function(req, res) {
    let uniqueId = req.params.uniqueId;
    let imagePath = path.join(__dirname, dirs.processed, uniqueId);
    var img = fs.readFileSync(imagePath);
    res.writeHead(200, {'Content-Type': 'application/octet-stream' });
    res.end(img, 'binary');
});

app.put('/unlink/:uniqueId', function(req, res) {
    let uniqueId = req.params.uniqueId;
    let imagePath = path.join(__dirname, dirs.processed, uniqueId);
    var img = fs.unlink(imagePath);
    res.send('Unlinked ' + uniqueId);
});

app.post('/upload', function(req, res) {
  if (!req.files)
    return res.status(400).send('No files were uploaded.');
 
  for(let f in req.files){
      let file = req.files[f];
      let uniqueId = uuidv4().replace(/-/g,'_');
      let name = file.name.split('.')[0];
      let ext = file.name.split('.')[1];
      let mime = file.mimetype;
      let imageFile = path.join(__dirname, dirs.uploads, uniqueId);
      file.mv(imageFile, function(err) {
        if (err)
          return res.status(500).send(err);
        Jimp.read(imageFile).then((image)=> {
            let transFiles = [];
            for(let c=0;c<=maxTranformations;c++){
                let transFile = name + '_' + c + '.' + ext;
                let transFilePath = path.join(__dirname, dirs.processed, transFile);
                let flipH = gen.create()(100) > 50; 
                let flipV = gen.create()(100) > 50; 
                image.clone()
                     .flip(flipH, flipV)
                     .pixelate( 20 )                   
                     .write(transFilePath); 
                transFiles.push(transFile);
                console.log(transFilePath);
            }
            res.send(transFiles);
        });
      });
  }
});

app.listen(3000, function () {
  console.log('App listening on port 3000!')
});