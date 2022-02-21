var express = require("express");
var app = express();
var mongoose = require("mongoose");
var request = require("request");
const _ = require('underscore');
const bodyParser = require("body-parser");
const { urlencoded } = require("body-parser");
const url = 'mongodb://localhost:27017';
//const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
//const client = new MongoClient(url);
const dbName = 'MrCPU';
var ObjectId = require('mongodb').ObjectID;
const mongoDB = require('mongodb');

app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

//mongoose.connect('mongodb://localhost:27017/MrCPU');
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.SECRET;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("MrCPU").collection("Details");
  // perform actions on the collection object
  //client.close();
});


var topicSchema =new mongoose.Schema({
    name : String,
	antutu : Number,
    singleCore : Number,
    multiCore : Number,
    cpu : Number,
    gaming :Number,
    battery : Number,
    myReview : Number,
    cores :Number,
    cpuArc : [],
    cpuFreq : Number,
    instrSet : String,
    Lone : String,
    hdr: String,
    colorgamut: String,
    colorDepth: String,
    extDis: String,
    Ltwo : String,
    Lthree : String,
    process : Number,
    tdp : Number,
    gpu : String,
    gpuArc : String,
    gpuFreq : Number,
    exeunits : Number,
    shadunits : Number,
    Flops : String,
    vulkan : String,
    opencl : Number,
    directX : Number,
    memoryType : String,
    memFreq : Number,
    bus : String,
    maxBand : String,
    maxSize :Number,
    npu : String,
    memType : String,
    maxDis :String,
    maxCam : String,
    videoCap :String,
    videoPlay : String,
    videoCodec : String,
    audioCodec : String,
    modem : String,
    phones : [],
    fourg : String,
    fiveg : String,
    peakDown : String,
    peakUp : String,
    wifi : Number,
    bluetooth : String, 
    nav : String,
    class : String,
    year : Number,
    official : String,
    matter : String
});


var Details = mongoose.model("Details",topicSchema);

app.get("/",(req,res)=>{
    res.render('home');
})

app.get('/mobile',(req,res)=>{
    const db = client.db(dbName);
    const collection = db.collection('Details');

    collection.find({}).toArray(function(err,docs){
        assert.equal(err, null);
        res.render('exploreMobile',{'top':docs})
    });
})

app.get('/pc',(req,res)=>{
    const db = client.db(dbName);
    const collection = db.collection('Laps');

    collection.find({}).toArray(function(err,docs){
        assert.equal(err, null);
        //var sortedObjs = _.sortBy( docs,docs.name);
        docs.sort((a,b)=>{
            return b.name - a.name;
        })
        res.render('explorePC',{'top':docs})
    });
})



app.get("/templates",(req,res)=>{
    const db = client.db(dbName);
    const collection = db.collection('Details');

    collection.find({}).toArray(function(err,docs){
        assert.equal(err, null);
        res.render('compare',{'top':docs})
    });
})

app.get("/all",(req,res)=>{
    const db = client.db(dbName);
    const collection = db.collection('Details');

    collection.find({}).toArray(function(err,docs){
        assert.equal(err, null);
        //res.render('templates',{'top':docs})
        res.json(docs);
    });
})

app.get('/templates/:id',(req,res)=>{
    const db = client.db(dbName);
    const collection = db.collection('Details');
    var id = req.params.id;
    var hex = /[0-9A-Fa-f]{6}/g;
    id = (hex.test(id))? ObjectId(id) : id;

    collection.findOne({_id : new mongoDB.ObjectID(id)})
    .then(found =>{
        if(!found){
            return res.status(404).end();
        }
        res.render('alldet',{data: found});
    })
    .catch(err => console.log(err));
})

app.get('/comparem',(req,res)=>{
    const db = client.db(dbName);
    const collection = db.collection('Details');

    collection.find({}).toArray(function(err,docs){
        assert.equal(err, null);
        res.render('comparem',{'top':docs})
    });
})

app.get('/comparel',(req,res)=>{ res.render('comingsoon')})

app.get('/explore',(req,res)=>{
    res.render('explore');
})

app.get('/compare',(req,res)=>{
    res.render('compare');
})

app.get('/about',(req,res)=>{
    res.render('about');
})

app.get('/recent',(req,res)=>{
    res.render('comingsoon')
})
app.get('/comingsoon',(req,res)=>{
    res.render('comingsoon')
})

app.get('/toplist',(req,res)=>{
    const db = client.db(dbName);
    const collection = db.collection('Details');

    collection.find({}).toArray(function(err,docs){
        assert.equal(err, null);
        //var sortedObjs = _.sortBy( docs,docs.antutu);
        docs.sort((a,b)=>{
            return b.antutu - a.antutu;
        })
        res.render('toplist',{'top':docs})
    });
})

app.get('/comparem/:id1/:id2',(req,res)=>{
    const db = client.db(dbName);
    const collection = db.collection('Details');
    var id1 = req.params.id1;
    var id2 = req.params.id2;
    var hex = /[0-9A-Fa-f]{6}/g;
    id1 = (hex.test(id1))? ObjectId(id1) : id1;
    id2 = (hex.test(id2))? ObjectId(id2) : id2;

    collection.find({$or: [{_id : new mongoDB.ObjectID(id1)},
    {_id : new mongoDB.ObjectID(id2)}]}).toArray(function(err,docs){
        assert.equal(err, null);
        res.render('comparemobile',{'top':docs})
    });

})


app.get("*",function(req,res){
    res.send("some thing went wrong");
});
/*
app.listen(3000,()=>{
    console.log("Hey boi i'm on 3000, come!");
})*/
const port = process.env.PORT || 3000 ;
app.listen(port,process.env.IP);
