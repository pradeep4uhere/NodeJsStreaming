const express = require('express');
const fs = require('fs');
const app = express();

app.get('/',function(req,res){
    res.sendFile(__dirname+'/index.html');
});

app.get('/video',function(req,res){
    const range = req.headers.range;
    if(!range){
        console.log(range);
        res.status(400).send('Request Range Header');
    }

    const viedoPath ="./06bd2440-a30641f5.mp4";
    const viedoSize = fs.statSync(viedoPath).size;
    console.log("Size OF Viedo is:"+ viedoSize);
    const CHUNK_SIZE = 10**6 //1MB
    const start = Number(range.replace(/\D/g,""));
    const end = Math.min(start + CHUNK_SIZE, viedoSize-1);
    const ContentLength = end - start +1;
    const headers = {
        "Content-Range":`bytes ${start} - ${end}/${viedoSize}`,
        "Accept-Ranges":'bytes',
        "Content-Length":ContentLength,
        "Content-Type":"viedo/mp4"
    }

    //HTTP 206 Means Sending PArtial Data To Client
    res.writeHead(206,headers);

    //Stream Viedo To Client
    const viedoStream = fs.createReadStream(viedoPath,{start, end});
    viedoStream.pipe(res);
})

app.listen(3000,function(){
    console.log('Server Listing On Port 3000');
});
