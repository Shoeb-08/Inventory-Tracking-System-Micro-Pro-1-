const express=require('express');
const app=express();
//connecting server file for awt
let server=require('./server');
let middleware=require('./middleware');
// bodyparser
const bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//for mongodb
const MongoClient=require('mongodb').MongoClient;
//data base colletion

const url='mongodb://127.0.0.1:27017';
const dbName='hospitalManagement';
let db
MongoClient.connect(url,{useUnifiedTopology:true},(err,client)=>{
    if(err) return console.log(err);
    db=client.db(dbName);
    console.log(`Connected Mongodb: ${url}`);
    console.log(`DataBase: ${dbName}`);
})
//fetching Hospital Details
app.get('/hospitaldetails',middleware.checkToken,function(req,res){
    console.log("Fetching data from hospital collection");
    var data=db.collection('hospitaldetails').find().toArray()
        .then(result=>res.json(result));
});
//ventillators details
app.get('/ventilatordetails',middleware.checkToken,(req,res)=>{
    console.log("Ventilators Information");
    var ventilatordetails=db.collection('ventilatordetails').find().toArray().then(result=>res.json(result));
});
//search ventilators by status
app.post('/searchventbystatus',middleware.checkToken,(req,res)=>{
    var status=req.body.status;
    console.log(status);
    var ventilatordetails=db.collection('ventilatordetails')
    .find({"status":status}).toArray().then(result=>res.json(result)); 
});
//search vent by hosptital name
app.post('/searchventbyname',middleware.checkToken,(req,res)=>{
    var name=req.query.name;
    console.log(name);
    var ventilatordetails=db.collection('ventilatordetails')
    .find({"name":new RegExp(name,'i')}).toArray().then(result=>res.json(result)); 
});
// search  hospital by name
app.post('/searchhospital',middleware.checkToken,(req,res)=>{
    var name=req.query.name;
    console.log(name);
    var hospitaldetails=db.collection('hospitaldetails')
    .find({"name":new RegExp(name,'i')}).toArray().then(result=>res.json(result)); 
});
//update ventillator
app.put('/updateventilator',middleware.checkToken,(req,res)=>{
    var ventid={ventilatorId:req.body.ventilatorId};
    console.log(ventid);
    var newvalues = {$set:{status:req.body.status}};
    db.collection("ventilatordetails").updateOne(venid,newvalues,function(err,result){
        res.json('1 document updated');
        if(err) throw err;
        //console.log(document updated);
    })

});
//add ventilator
app.post('/addventilatorbyuser',middleware.checkToken,(req,res)=>{
        var hId=req.body.hId;
        var ventilatorId=req.body.ventilatorId;
        var status=req.body.status;
        var name=req.body.name;
    
    var item=
    {
        hId:hId,ventilatorId:ventilatorId,status,name:name
    };
    db.collection('ventilatordetails').insertOnce(item,function(err,result){
        res.json('Item inserted');
    });
});
//delete ventilator by ventilator id
app.delete('/delete',middleware.checkToken,(req,res)=>{
    var myquery=req.query.ventilatorId;
    console.log(myquery);

    var myquery1={ventilatorId:myquery};
     db.collection('ventilatordetails').deleteOne(myquery1,function(err,obj){
         if(err) throw err;
         res.json("1 document deleted");
     });
});
app.listen(1100);
