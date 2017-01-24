const fs = require('fs');
const readline = require('readline');

var heading=true;
var head;
const rl = readline.createInterface({input:fs.createReadStream('Indicators.csv')});
var year;
var Value;
var countDr=0;
var birthR;
var deathR;
var count=0;
var bri=[];
var sumOfMa=0;var sumOfFe=0;
var sumavg=0;var sumavg2=0;
var cn=[];
var totalExp=[];
var lifeExp=[];
rl.on('line', function(line) {
 if(heading){
head=line.split( /,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/ );
heading=false;
//console.log(head);
 }
var yearIndex=head.indexOf("Year");
var valueIndex=head.indexOf("Value");
var country=head.indexOf("CountryName");
//var currentline=line.split( /,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/ );
var countries=["ARB","AFG","ARM","AZE","BHR","BGD","BTN","BRN","KHM","CHN","CCK","IOT","GEO","HKG","IND","IDN","IRN","IRQ",
"ISR","JPN","JOR","KAZ","KWT","KGZ","LAO","LBN","MAC","MYS","MDV","MNG","MMR","NPL","PRK","OMN","PAK","TWN","TJK",
"THA","TUR","PSE","PHL","QAT","SAU","SGP","KOR","LKA","SYE","TKM","ARE","UZB","VNM","YEM"];
 
 var currentline=line.split( /,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/ );

countries.reduce(function(pre,countries){
  
  var obj={};
if(currentline.includes(countries)){
//console.log(currentline[yearIndex]);
if(currentline.indexOf("SP.DYN.LE00.MA.IN")>-1){
year=currentline[yearIndex];
count++;
male=parseFloat(currentline[valueIndex]);
//console.log(male);
sumOfMa=sumOfMa+male;
}
if(currentline.indexOf("SP.DYN.LE00.FE.IN")>-1){


female=parseFloat(currentline[valueIndex]);
//console.log(male);
sumOfFe=sumOfFe+female;
}

if(count==54){
sumavg=sumOfMa/54;
sumavg2=sumOfFe/54;
//console.log(sumavg);
        obj.Year=year;
        obj.ExpectancyOfMale = sumavg;
        obj.ExpectancyOfFemale=sumavg2;

         count=0;
         sumOfMa=0;
         sumOfFe=0;
        cn.push(obj);
        }
      }
});




currentline.filter(function(value,index,array){


if(currentline.includes("IND")){
 
      if(value==="SP.DYN.CDRT.IN"){
        year=currentline[yearIndex];
        deathR=currentline[valueIndex];
       countDr++;
        //console.log(year,value);
      }
    var objDb={};
      if(value==="SP.DYN.CBRT.IN"){
        birthR=currentline[valueIndex];
        //console.log(year,birthR);
        countDr++;
      }
     
      if(countDr==2){
        objDb.Year=year;
        objDb.birthRate=birthR;
        objDb.deathRate=deathR;
       
        countDr=0;
        bri.push(objDb);

      }
//console.log(bri);
}
});

var totalExp={};
if(currentline.includes("SP.DYN.LE00.IN")&&currentline.includes("2013")){
countryname=currentline[country];
year=currentline[yearIndex];
value=currentline[valueIndex];
totalExp.CoutryName=countryname;
totalExp.Value=value;


lifeExp.push(totalExp);

}
lifeExp.sort(function(a,b){
  return b.Value-a.Value;
});


});

rl.on('close', function() {
  var p2=JSON.stringify(bri);
 p2=p2.replace("[","[\n\t");
 p2= p2.replace(/},/g,"},\n\t");
 p2= p2.replace(/\\"/g,"");
 p2=p2.replace(/,/g,",\n\t");
 
 
 fs.writeFile("text2.JSON",p2,function(err) {
if(err){
    throw err;
}

});

 
 var p1=JSON.stringify(cn);
 p1=p1.replace("[","[\n\t");
 p1= p1.replace(/},/g,"},\n\t");
 p1= p1.replace(/\\"/g,"");
 p1=p1.replace(/,/g,",\n\t");
 //consconsole.log(p1);
 fs.writeFile("text1.JSON",p1,function(err) {
if(err){
    throw err;
}

});
 var total=lifeExp.splice(0,5);
var p3=JSON.stringify(total);
 p3=p3.replace("[","[\n\t");
 p3= p3.replace(/},/g,"},\n\t");
 p3= p3.replace(/\\"/g,"");
 //p3=p3.replace(/,/g,",\n\t");
 
 
 fs.writeFile("Total.JSON",p3,function(err) {
if(err){
    throw err;
}

});
});


   