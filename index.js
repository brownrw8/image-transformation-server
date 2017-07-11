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

app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 },
  preserveExtension: true,
  safeFileNames: true
}));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, dirs.views, 'upload.html'));
});

app.post('/upload', function(req, res) {
  if (!req.files)
    return res.status(400).send('No files were uploaded.');
 
  for(let f in req.files){
      let file = req.files[f];
      let uniqueId = uuidv4();
      
      let imageFile = path.join(__dirname, dirs.uploads, uniqueId);
      sampleFile.mv(imageFile, function(err) {
        if (err)
          return res.status(500).send(err);
        imageFile.read(imageFile).then((image)=> {
            for(let c=0;c<=maxTranformations;c++){
                image.clone()
                     .flip(gen(100)>50, gen(100)>50)
                     .resize
                     
            }
            
        });
      });
  }

  res.send('File(s) uploaded');
});

app.listen(3000, function () {
  console.log('App listening on port 3000!')
});