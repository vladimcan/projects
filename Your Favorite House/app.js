const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const ejs = require("ejs");
var path = require("path");
var __dirname = path.resolve();
const mongoose = require("mongoose");

const app = express();
// add EJS
app.set('view engine', 'ejs');
// add Parser, public files
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

main().catch(err => console.log(err));

async function main(){
  await mongoose.connect('mongodb://localhost:27017/housesDB',{useNewUrlParser: true, useUnifiedTopology: true});
//  mongodb://localhost:27017/housesDB?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false
  const propertySchema = new mongoose.Schema({
    address: String,
    price: Number,
    publishDate: Date,
    removeDate: Date,
    typeHouse: String,
    bed: Number,
    bath: Number,
    bultYear: Number,
    sq: Number  
  });

  const propertyTmpSchema = new mongoose.Schema({
    address: String,
    price: Number,
    publishDate: Date,
    removeDate: Date,
    typeHouse: String,
    bed: Number,
    bath: Number,
    bultYear: Number,
    sq: Number  
  });
  /* const housesSchema = new mongoose.Schema({
    address: String,
    price: String,
    publishDate: String,
    removeDate: String,
    typeHouse: String,
    bed: String,
    bath: String,
    bultYear: String,
    sq: String  
  });
  const housesTmpSchema = new mongoose.Schema({
    address: String,
    price: String,
    publishDate: String,
    removeDate: String,
    typeHouse: String,
    bed: String,
    bath: String,
    bultYear: String,
    sq: String 
  }); */

  const Property = mongoose.model('Property', propertySchema);
  const Propertytmp = mongoose.model('Propertytmp', propertyTmpSchema);
  /* const House = mongoose.model('House', housesSchema);
  const Housetmp = mongoose.model('Housetmp', housesTmpSchema); */

  let sortObj = {};
  let searchObj = {};

  // wait a request from Client's Browser
  app.get("/", function(req,res){
    /* console.log(sortObj); */
    Property.find(searchObj).
    sort(sortObj).
    exec(function (err, properties) {
      if (err) return handleError(err);
      res.render("home",{allHouses:arrayDbInStr(properties)});
    })
  });

  // sort by type, address, published, discarded, building year
  /* app.get("/year", function(req,res){
    sortObj= {};
    sortObj.bultYear = 1;
    res.redirect("/");
  }); */

  app.get("/sort/:sortType", function(req,res){
    sortObj= {};
    switch(req.params.sortType) {
      case "type":
        sortObj.typeHouse = 1;
        break;
      case "addresslh":
        sortObj.address = 1;
        break;
        case "addresshl":
        sortObj.address = -1;
        break;
      case "published":
        sortObj.publishDate = 1;
        break;
      case "discarded":
        sortObj.removeDate = 1;
        break;
      case "bed":
        sortObj.bed = 1;
        break;
      case "bath":
        sortObj.bath= 1;
        break;
      case "year":
        sortObj.bultYear = 1;
        break;
      case "square":
        sortObj.sq = 1;
        break;
    default:
    }
    res.redirect("/");
  });
  

  // seach by all 
  app.get("/all", function(req,res){
    searchObj = {};
    res.redirect("/");
  });

  // seach condos
  app.get("/condo", function(req,res){ 
    searchObj= {};
    searchObj.typeHouse = 'Condo';
    res.redirect("/");  
  });

  // seach houses
  app.get("/house", function(req,res){
    searchObj= {};
    searchObj.typeHouse = 'House';
    res.redirect("/");    
  });

  // seach townhouses
  app.get("/townhouse", function(req,res){ 
    searchObj= {};
    searchObj.typeHouse = 'Townhouse';
    res.redirect("/");  
  });

  // seach discharged
  app.get("/discharged", function(req,res){ 
    searchObj= {};
    searchObj.removeDate = {$ne:null};
    res.redirect("/"); 
  });

  app.get("/bed/:num", function(req,res){ 
    let num = req.params.num;
    searchObj.bed = {$eq:num};
    res.redirect("/"); 
  });
  app.get("/bath/:num", function(req,res){ 
    let num = req.params.num;
    searchObj.bath = {$gte:num};
    res.redirect("/"); 
  });
  
  app.post("/seachaddress", function(req,res){
    let text = req.body.seach;
    searchObj= {};
    searchObj.address = { $regex: text, $options: 'i' };
    res.redirect("/");
  });

// sort by house type 



// from house tp prorerty
/* app.get("/fixdb", async function(req,res){
  const houses = await House.find({}).exec();    // read houses
    for(let i=0; i < houses.length; i++) {
      let removeDate = null, bed = 0, bath = 0, bultYear = 0, sq = 0;
      if(houses[i].removeDate !== "") removeDate = new Date(houses[i].removeDate);
      if(houses[i].bed !== "") bed = (houses[i].bed.split(' ')[1])*1;
      if(houses[i].bath !== "") bath = (houses[i].bath.split(' ')[1])*1;
      if(houses[i].bultYear !== "") bultYear = (houses[i].bultYear.split(' ')[2])*1;
      if(houses[i].sq !== "") sq = (houses[i].sq.split(' ')[0])*1;
      
      const property = new Property({
        address: houses[i].address,
        price: toNumber(houses[i].price.split(' ')[1]),
        publishDate: new Date(houses[i].publishDate),
        removeDate: removeDate,
        typeHouse: houses[i].typeHouse,
        bed: bed,
        bath: bath,
        bultYear: bultYear,
        sq: sq  
      });
      await property.save();
    } 
    Property.find({}).exec(function (err, properties) {
      if (err) return handleError(err);
      res.render("home",{allHouses:arrayDbInStr(properties)});
    })
}); */

  // write site page
  app.get("/write", function(req,res){
    // send writepage.html
    res.sendFile(__dirname + "/writepage.html");
  });
  
  // wait post from Client's Browser
  app.post("/write", async function(req,res){
    let text = req.body.site;
    
    let a = text.split('?');
    a.pop();  /* delet the last element of array */
    
    let houseArray = [];
    let i=0;
    let price = "", address = "", typeHouse = "", bed = "", bath = "", bultYear = "", sq = "", publish = "";
    
    for(item of a){
      let [priceStr, addressStr, typeHouseStr, bedStr, bathStr, bultYearStr, sqStr, publishStr] = item.split('=');
      /* console.log(++i,": ",price, address, typeHouse, bed, bath, bultYear, sq, publish); */
      /* houseArray.push({price, address, typeHouse, bed, bath, bultYear, sq, publish });  */

      let recTmp = await Propertytmp.findOne({ address: addressStr }).exec();
      if (recTmp === null) {
        let removeDate = null, bed = 0, bath = 0, bultYear = 0, sq = 0;
        if(bedStr !== "") bed = (bedStr.split(' ')[1])*1;
        if(bathStr !== "") bath = (bathStr.split(' ')[1])*1;
        if(bultYearStr !== "") bultYear = (bultYearStr.split(' ')[2])*1;
        if(sqStr !== "") sq = (sqStr.split(' ')[0])*1;
        const propertyTmp = new Propertytmp({
          address: addressStr,
          price: toNumber(priceStr.split(' ')[1]),
          publishDate: new Date(publishStr),
          removeDate: null,
          typeHouse: typeHouseStr,
          bed: bed,
          bath: bath,
          bultYear: bultYear,
          sq: sq  
        });
        await propertyTmp.save();
      }      
    } // end for(){}
    Propertytmp.find({}).exec(function (err, properties) {
      if (err) return handleError(err);
      res.render("pagewrite",{allHouses:arrayDbInStr(properties)});
    })
  }); // end POST/write

  app.get("/compare", async function(req,res){
    let propertyTmp = await Propertytmp.find({}).exec(); // read houseTmp
    if (propertyTmp.length === 0) {
      res.render("error",{text:"Tmp DB is empty. Scan the site."});
      return;
    }

    for(let i=0; i<propertyTmp.length; i++) {
      let {price, address, typeHouse, bed, bath, bultYear, sq, publishDate} = propertyTmp[i];
      Property.findOne({ address: address, removeDate:null}).exec(async function (err, rec) {
        if (err){
          res.render("error",{text:err});
          return;
        }
        if (rec === null) {  
          const property = new Property({
            address: address,
            price: price,
            publishDate: publishDate,
            removeDate: null,
            typeHouse: typeHouse,
            bed: bed,
            bath: bath,
            bultYear: bultYear,
            sq: sq  
          });
          await property.save();
                  
          } // end if
      }); 
    } // end for()
    
    // update record
    const properties = await Property.find({}).exec();    // read properties
    for(let i=0; i < properties.length; i++) {
      if (properties[i].removeDate === null) {
        let isRemoved = false;
        for(let j = 0; j < propertyTmp.length; j++){
          if( properties[i].address === propertyTmp[j].address) {
            isRemoved = false;
            break;
          } else {
            isRemoved = true;
          }
        }  // end for() propertyTmp
        if(isRemoved) {
          const doc = await Property.findById(properties[i]._id).exec();
          doc.removeDate = new Date();
          await doc.save(); 
        } 
      }  // end if   
    } // end for() properties

    await Propertytmp.deleteMany({});
    res.redirect("/");
  });
  
  app.listen(3000, function(){
    console.log("Server is running on port 3000.")
  });
   
} /* end main */

function toNumber(str){
  let a = str.split('');
  let b ="";
  for(let i = 0; i < a.length; i++ ){
      switch (a[i]) {
          case "0":
          case "1":
          case "2":
          case "3":
          case "4":
          case "5":
          case "6":
          case "7":
          case "8":
          case "9":
              b += a[i];
              break;
          default:
      }
  }
  return parseInt(b);
} // end function toNumber()

function arrayDbInStr(arrayDb) {
  let arrayStr= [];
  
  for(let i=0; i < arrayDb.length; i++) {
    let item = {};
    item.address = arrayDb[i].address;
    item.price = price$(arrayDb[i].price);
    item.typeHouse = arrayDb[i].typeHouse;
  
    let removeDate = "", bed = "", bath = "", bultYear = "", sq = "";

    item.publishDate = new Date(arrayDb[i].publishDate).toISOString().substring(0,10);
    if(arrayDb[i].removeDate !== null) removeDate = new Date(arrayDb[i].removeDate).toISOString().substring(0,10);
    item.removeDate = removeDate;
    if(arrayDb[i].bed !== 0) bed = arrayDb[i].bed.toString();
    item.bed = bed;
    if(arrayDb[i].bath !== 0) bath = arrayDb[i].bath.toString();
    item.bath = bath;
    if(arrayDb[i].bultYear !== 0) bultYear = arrayDb[i].bultYear.toString();
    item.bultYear = bultYear;
    if(arrayDb[i].sq !== 0) sq = arrayDb[i].sq.toString();
    item.sq = sq;
    arrayStr.push(item);
    
  }
return arrayStr;
}// end function arrayDbInStr()


function price$(num){
  let n = num;
  let a = [];
  let strnum = "";
  while(n>1000){
      let q1=Math.floor(n/1000);
      let q2 = n - q1*1000;
      n=q1;
      strnum = q2.toString().padStart(3, "0");
      /* if(q2 === 0) {
        strnum = "000";
      } else {
        strnum = q2.toString().padStart(3, "0");  
      } */
      a.push(strnum);
  }
  a.push(n);
  a.reverse();
  let str = a.toString();
  return str;
}