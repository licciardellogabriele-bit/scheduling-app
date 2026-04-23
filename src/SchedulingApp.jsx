import { useState, useEffect, useCallback, useMemo, useRef } from "react";

/* ═══════════ ACTIVITIES ═══════════ */
var ACT=[
{code:"222",label:"222",def:2,cat:"pc",alloc:"fix",ord:0,pair:false},
{code:"CIC",label:"CIC",def:2,cat:"com",alloc:"fix",ord:1,pair:true},
{code:"VD",label:"Visite Dirette",def:1,cat:"com",alloc:"fix",ord:3,pair:true},
{code:"NICSP",label:"NIC sperim.",def:1,cat:"com",alloc:"fix",ord:4,pair:true},
{code:"CIECHI",label:"Ciechi",def:1,cat:"com",alloc:"fix",ord:5,pair:true},
{code:"NICMIN",label:"NIC minori",def:1,cat:"com",alloc:"fix",ord:6,pair:true},
{code:"NIC",label:"NIC",def:6,cat:"com",alloc:"fix",ord:7,pair:true},
{code:"VDOM",label:"V. Domiciliari",def:0,cat:"com",alloc:"pre",ord:50,pair:true},
{code:"PU",label:"Prest.Universale",def:0,cat:"pc",alloc:"pre",ord:51,pair:true},
{code:"VALID",label:"VALIDAZIONI",def:0,cat:"pc",alloc:"dyn",ord:80,pair:false},
{code:"ASP",label:"ASP",def:0,cat:"com",alloc:"dyn",ord:81,pair:false},
{code:"EST",label:"Att.Esterna",def:0,cat:"st",alloc:"no",ord:99,pair:false},
{code:"SW",label:"Smart Working",def:0,cat:"st",alloc:"no",ord:99,pair:false},
{code:"FER",label:"Ferie",def:0,cat:"st",alloc:"no",ord:99,pair:false},
];
var OPA=ACT.filter(function(a){return a.cat!=="st";});
var DISP=["CIC","NIC","NICSP","VD","VDOM","PU","NICMIN","CIECHI","ASP","VALID","222"];
var OPD=DISP.map(function(c){return ACT.find(function(a){return a.code===c;});}).filter(Boolean);
var FIX=ACT.filter(function(a){return a.alloc==="fix";}).sort(function(a,b){return a.ord-b.ord;});
var SLOTABLE=FIX.concat([ACT.find(function(a){return a.code==="NIC";})]);
var WDS=[{n:1,l:"Lun"},{n:2,l:"Mar"},{n:3,l:"Mer"},{n:4,l:"Gio"},{n:5,l:"Ven"}];
var COL={CIC:{bg:"#fef3c7",tx:"#92400e",bd:"#fcd34d"},NIC:{bg:"#e0e7ff",tx:"#3730a3",bd:"#a5b4fc"},NICSP:{bg:"#e0f2fe",tx:"#075985",bd:"#7dd3fc"},NICMIN:{bg:"#ddd6fe",tx:"#6d28d9",bd:"#a78bfa"},VD:{bg:"#d1fae5",tx:"#065f46",bd:"#6ee7b7"},VDOM:{bg:"#a7f3d0",tx:"#064e3b",bd:"#34d399"},PU:{bg:"#fef9c3",tx:"#854d0e",bd:"#fde047"},VALID:{bg:"#fce7f3",tx:"#9d174d",bd:"#f9a8d4"},222:{bg:"#ede9fe",tx:"#5b21b6",bd:"#c4b5fd"},ASP:{bg:"#cffafe",tx:"#155e75",bd:"#67e8f9"},CIECHI:{bg:"#ffe4e6",tx:"#9f1239",bd:"#fda4af"}};
var VDOM_PAIRS=[["Costa Manuela","Arcifa Veronica"],["Ligreggi Antonella","Scifo Nicole"],["Liuzzo Ludovico","Grieco Angela"],["Di Paola Danila","Iosia Serena"],["Lo Pumo Roberta","Sofia Salvatore"],["Palmeri Andrea","Tumino Mariagrazia"]];

/* ═══════════ USERS ═══════════ */
var DU=[
["Arcifa Veronica",true,"STR",false,true,[1,2,3,4,5],null,false],
["Alberio Anna",false,"ACN",false,false,[1,3,4,5],null,false],
["Amato Chiara",false,"STR",false,false,[1,2,3,4,5],null,false],
["Bonfiglio Claudia",true,"STR",true,true,[1,2,3,4,5],4,false],
["Calabrese Giorgia",false,"STR",false,false,[1,2,3,4,5],null,false],
["Caruso Danila",false,"STR",false,false,[1,2,3,4,5],null,false],
["Costa Manuela",true,"STR",true,false,[1,2,3,4,5],3,false],
["D\u2019Angelo Mariangela",false,"ACN",false,false,[1,2,3,4],null,false],
["Di Guardo Caterina",false,"STR",false,false,[1,2,3,4,5],null,false],
["Di Paola Danila",true,"STR",false,false,[1,2,3,4,5],3,false],
["Grieco Angela",true,"STR",true,false,[1,2,3,4,5],4,false],
["Iosia Serena",true,"STR",true,false,[1,2,3,4,5],4,false],
["La Delfa Rosalba",false,"STR",false,false,[1,2,3,4,5],null,false],
["Licciardello Gabriele",true,"ACN",false,false,[1,2,3,4,5],null,false],
["Ligreggi Antonella",true,"STR",true,false,[1,2,3,4,5],1,false],
["Liuzzo Ludovico",true,"STR",true,false,[1,2,3,4,5],4,false],
["Lo Pumo Roberta",false,"STR",false,false,[1,2,3,4,5],null,false],
["Martines Annamaria",false,"ACN",false,false,[1,2,3],null,false],
["Marzullo Isabella",false,"STR",false,false,[1,2,3,4,5],3,false],
["Milana Maria Chiara",false,"STR",false,false,[1,2,3,4,5],null,false],
["Ministeri Federica",true,"STR",false,false,[1,2,3,4,5],null,false],
["Monaco Lucia",true,"ACN",false,false,[3,4,5],null,false],
["Munciv\u00EC Marina",true,"ACN",false,false,[1,2,3,4],null,false],
["Nannola Chiara",false,"STR",false,false,[1,2,3,4,5],null,false],
["Palmeri Andrea",true,"STR",true,false,[1,2,3,4,5],2,false],
["Pappalardo Elisa",true,"STR",false,false,[1,2,3,4,5],null,false],
["Pittari Veronica",false,"STR",false,false,[1,2,3,4,5],null,false],
["Prossimo Giusi",false,"STR",false,false,[1,2,3,4,5],null,false],
["Russo Ilenia",true,"ACN",false,false,[2,3,4,5],null,false],
["Scalisi Francesco",false,"STR",false,false,[1,2,3,4,5],null,false],
["Scifo Nicole",false,"STR",false,false,[1,2,3,4,5],null,true],
["Sofia Salvatore",false,"STR",false,false,[1,2,3,4,5],null,false],
["Sollima Giovanni",false,"ACN",false,false,[1,2,4],null,false],
["Spina Anna",true,"STR",true,false,[1,2,3,4,5],2,false],
["Tumino Mariagrazia",true,"STR",false,false,[1,2,3,4,5],null,true],
["Valenti Giuseppe",false,"STR",false,false,[1,2,3,4,5],null,false],
["Valenti Vincenzo",true,"ACN",true,false,[1,2,4],null,false],
];
var MN=["Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno","Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"];

/* ═══════════ HELPERS ═══════════ */
var CPX=["Di","Lo","La","De","Del","Della","Degli","Dei","Delle","Dal"];
function pS(f){var p=f.trim().split(/\s+/);if(p.length<=1)return{s:f,f:""};if(p[0].endsWith("'")||p[0].endsWith("\u2019"))return{s:p.slice(0,2).join(" "),f:p.slice(2).join(" ")};if(CPX.includes(p[0])&&p.length>2)return{s:p.slice(0,2).join(" "),f:p.slice(2).join(" ")};return{s:p[0],f:p.slice(1).join(" ")};}
function sN(users){var ps=users.map(function(u){return Object.assign({id:u.id},pS(u.name));});var c={};ps.forEach(function(p){c[p.s]=(c[p.s]||0)+1;});var r={};ps.forEach(function(p){r[p.id]=c[p.s]>1&&p.f?(p.s+" "+p.f[0]+"."):p.s;});return r;}
function dk(y,m,d){return y+"-"+String(m+1).padStart(2,"0")+"-"+String(d).padStart(2,"0");}
function nD(y,m){return new Date(y,m+1,0).getDate();}
function isWE(y,m,d){var w=new Date(y,m,d).getDay();return w===0||w===6;}
function jd(y,m,d){return new Date(y,m,d).getDay();}
function dn(y,m,d){return["Dom","Lun","Mar","Mer","Gio","Ven","Sab"][jd(y,m,d)];}
function eMon(y){var a=y%19,b=Math.floor(y/100),c=y%100,d2=Math.floor(b/4),e=b%4,f=Math.floor((b+8)/25),g=Math.floor((b-f+1)/3),h=(19*a+b-d2-g+15)%30,i=Math.floor(c/4),k=c%4,l=(32+2*e+2*i-h-k)%7,m2=Math.floor((a+11*h+22*l)/451),mo=Math.floor((h+l-7*m2+114)/31),da=((h+l-7*m2+114)%31)+1;return new Date(new Date(y,mo-1,da).getTime()+864e5);}
function isH(y,m,d){var mm=m+1;if(mm===1&&d===1)return"Capodanno";if(mm===1&&d===6)return"Epifania";if(mm===2&&d===5)return"Sant'Agata";if(mm===4&&d===25)return"Liberazione";if(mm===5&&d===1)return"Festa Lavoro";if(mm===6&&d===2)return"Repubblica";if(mm===8&&d===15)return"Ferragosto";if(mm===11&&d===1)return"Ognissanti";if(mm===12&&d===8)return"Immacolata";if(mm===12&&d===25)return"Natale";if(mm===12&&d===26)return"S.Stefano";var em=eMon(y);if(em.getMonth()===m&&em.getDate()===d)return"Pasquetta";return null;}
function isOff(y,m,d){return isWE(y,m,d)||!!isH(y,m,d);}

function mAS(vo){var s={};ACT.forEach(function(a){s[a.code]=vo?{al:false,w:0}:{al:a.code!=="222"&&a.code!=="VDOM"&&a.code!=="PU",w:1};});return s;}
function mU(nm,ml,ct,e2,ec,wd,sw,vo,id){return{id:id||("u"+Date.now()+"_"+Math.random().toString(36).slice(2,8)),name:nm,ml:ml,ct:ct,e222:e2,eCi:ec,wd:wd||[1,2,3,4,5],swDay:sw,vo:!!vo,notes:"",as:mAS(vo)};}
function mDU(){
  var NP=["Milana Maria Chiara","Calabrese Giorgia"],CP=["Licciardello Gabriele","Russo Ilenia","Sofia Salvatore"];
  return DU.map(function(r,i){
    var u=mU(r[0],r[1],r[2],r[3],r[4],r[5],r[6],r[7],"d"+i);
    if(NP.includes(u.name))u.as.NICMIN={al:true,w:3};
    if(CP.includes(u.name))u.as.CIECHI={al:true,w:3};
    if(u.e222)u.as["222"]={al:true,w:1};
    if(u.name==="Arcifa Veronica"){ACT.forEach(function(a){u.as[a.code]=(a.code==="CIECHI"||a.code==="VDOM")?{al:true,w:1}:{al:false,w:0};});}
    return u;
  });
}
function mDS(){var s={};ACT.forEach(function(a){s[a.code]=a.def;});return s;}

/* ═══════════ INDISPO ═══════════ */
function bInd(yr,mo,users,exc,swExc){
  var nd=nD(yr,mo),r={};
  for(var d=1;d<=nd;d++){
    if(isOff(yr,mo,d))continue;
    var k=dk(yr,mo,d),dow=jd(yr,mo,d);r[k]={};
    users.forEach(function(u){
      if(u.vo)return;
      if(!u.wd.includes(dow)){r[k][u.id]=["N/D"];return;}
      // SW: check month-level SW override first, then fixed swDay
      var swE=swExc[k]&&swExc[k][u.id];
      if(swE==="SW"){r[k][u.id]=["SW"];return;}
      if(swE==="NO"){}// explicitly NOT sw today, skip
      else if(u.swDay===dow){r[k][u.id]=["SW"];return;}
      var e=exc[k]&&exc[k][u.id];
      if(Array.isArray(e)&&e.length)r[k][u.id]=e;
    });
  }
  return r;
}

/* ═══════════ STORAGE ═══════════ */
var SK="cml-v9";
async function sLoad(){try{var r=localStorage.getItem(SK);if(r)return JSON.parse(r);}catch(e){}return null;}
async function sSave(st){try{localStorage.setItem(SK,JSON.stringify(st));}catch(e){console.warn(e);}}

/* ═══════════ SANITIZE ═══════════ */
function sanU(r){if(!Array.isArray(r)||!r.length)return null;return r.map(function(u){if(!u||!u.id||!u.name)return null;var b=mAS(u.vo);var as=(u.as&&typeof u.as==="object")?Object.assign({},b,u.as):b;
  if(u.e222)as["222"]={al:true,w:(as["222"]&&as["222"].w)||1};
  return{id:u.id,name:String(u.name),ml:!!u.ml,ct:u.ct||"STR",e222:!!u.e222,eCi:!!u.eCi,wd:Array.isArray(u.wd)?u.wd:[1,2,3,4,5],swDay:typeof u.swDay==="number"?u.swDay:null,vo:!!u.vo,notes:u.notes||"",as:as};}).filter(Boolean);}
function sanO(r){return(r&&typeof r==="object"&&!Array.isArray(r))?r:{};}
function sanA(r){return Array.isArray(r)?r:[];}
function sanS(r){if(!r||typeof r!=="object")return mDS();var d=mDS();Object.keys(d).forEach(function(k){if(typeof r[k]==="number")d[k]=r[k];});return d;}

/* ═══════════ ENGINE v3 — guaranteed placement ═══════════ */
function shuf(a){var r=a.slice();for(var i=r.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=r[i];r[i]=r[j];r[j]=t;}return r;}

function gen(year,month,users,gS,dayOv,eInd,inc,dRestr,locks,currentAsg){
  var nd=nD(year,month),out={},alerts={};
  var norm=users.filter(function(u){return !u.vo;});
  var tL={},aC={};
  norm.forEach(function(u){tL[u.id]=0;aC[u.id]={};DISP.forEach(function(c){aC[u.id][c]=0;});});

  var iM=new Map();(inc||[]).forEach(function(p){if(!p||p.length<2)return;if(!iM.has(p[0]))iM.set(p[0],new Set());if(!iM.has(p[1]))iM.set(p[1],new Set());iM.get(p[0]).add(p[1]);iM.get(p[1]).add(p[0]);});
  var dM=new Map();if(dRestr)Object.entries(dRestr).forEach(function(e){if(!e[1])return;var m={};Object.entries(e[1]).forEach(function(de){if(Array.isArray(de[1])&&de[1].length)m[de[0]]=new Set(de[1]);});if(Object.keys(m).length)dM.set(e[0],m);});

  var wAll=[];for(var dd=1;dd<=nd;dd++){if(!isOff(year,month,dd))wAll.push(dd);}
  var noFri=wAll.filter(function(d){return jd(year,month,d)!==5;});

  // Pre-sched VDOM
  var vdS={},vdU=new Set();var sp=Math.max(1,Math.floor(noFri.length/VDOM_PAIRS.length));
  VDOM_PAIRS.forEach(function(pair,pi){var uA=users.find(function(u){return u.name===pair[0];});var uB=users.find(function(u){return u.name===pair[1];});if(!uA||!uB)return;
    for(var at=0;at<noFri.length;at++){var idx=(pi*sp+at)%noFri.length;var d=noFri[idx];var k=dk(year,month,d);var dow=jd(year,month,d);if(vdU.has(d))continue;
      var aOk=uA.wd.includes(dow)&&uA.swDay!==dow&&!(eInd[k]&&eInd[k][uA.id]);var bOk=uB.wd.includes(dow)&&uB.swDay!==dow&&!(eInd[k]&&eInd[k][uB.id]);
      if(aOk&&bOk){if(!vdS[k])vdS[k]=[];vdS[k].push([uA.id,uB.id]);vdU.add(d);break;}}});
  // Pre-sched PU
  var puS={};var pA=users.find(function(u){return u.name==="Palmeri Andrea";});var pB=users.find(function(u){return u.name==="Di Paola Danila";});
  if(pA&&pB){var half=Math.floor(wAll.length/2);[wAll.slice(0,half),wAll.slice(half)].forEach(function(h){for(var hi=0;hi<h.length;hi++){var d=h[hi];var k=dk(year,month,d);var dow=jd(year,month,d);var aO=pA.wd.includes(dow)&&pA.swDay!==dow&&!(eInd[k]&&eInd[k][pA.id]);var bO=pB.wd.includes(dow)&&pB.swDay!==dow&&!(eInd[k]&&eInd[k][pB.id]);var nv=!vdS[k]||!vdS[k].some(function(p){return p.includes(pA.id)||p.includes(pB.id);});if(aO&&bO&&nv){puS[k]=[pA.id,pB.id];break;}}});}

  // Daily
  for(var d=1;d<=nd;d++){
    var k=dk(year,month,d);
    if(isOff(year,month,d)){out[k]={};continue;}
    out[k]={};var dow=jd(year,month,d);
    var un=new Set();var dI=eInd[k]||{};Object.entries(dI).forEach(function(e){if(Array.isArray(e[1])&&e[1].length)un.add(e[0]);});
    var dU=new Set(),dA=new Set();

    // Check if this day/activity is locked — keep existing
    var dayLockFlags=(locks&&locks[k])||{};
    var dayAsg=(currentAsg&&currentAsg[k])||{};

    // Pre-sched
    if(vdS[k]){var vp=[];vdS[k].forEach(function(p){p.forEach(function(uid){vp.push(uid);dU.add(uid);dA.add(uid);});});out[k].VDOM=vp;}else{out[k].VDOM=[];}
    if(puS[k]){out[k].PU=puS[k].slice();puS[k].forEach(function(uid){dU.add(uid);dA.add(uid);});}else{out[k].PU=[];}

    // pk: pick best candidate — heavily weighted by balance
    function pk(pool,ac,mlP){
      return shuf(pool).sort(function(a,b){
        var wa=(a.as[ac]&&a.as[ac].w)||1,wb=(b.as[ac]&&b.as[ac].w)||1;
        if(wb!==wa)return wb-wa;
        if(mlP){if(a.ml&&!b.ml)return-1;if(!a.ml&&b.ml)return 1;}
        // Heavy balance: total load * 10 + activity count * 5
        var la=(tL[a.id]||0)*5+((aC[a.id]&&aC[a.id][ac])||0)*20;
        var lb=(tL[b.id]||0)*5+((aC[b.id]&&aC[b.id][ac])||0)*20;
        return la-lb;
      })[0]||null;
    }
    function gP(ac,ef){
      return norm.filter(function(u){
        if(un.has(u.id)||dU.has(u.id))return false;
        if(!u.wd.includes(dow)||u.swDay===dow)return false;
        var st=u.as[ac];if(!st||!st.al||st.w===0)return false;
        var en=iM.get(u.id);if(en){for(var a2 of dA){if(en.has(a2))return false;}}
        var dr=dM.get(u.id);if(dr&&dr[String(dow)]&&!dr[String(dow)].has(ac))return false;
        if(ef&&!ef(u))return false;return true;
      });
    }
    function aF(uid,ac){dU.add(uid);dA.add(uid);tL[uid]=(tL[uid]||0)+1;aC[uid][ac]=(aC[uid][ac]||0)+1;}

    function sPairs(ac,n){
      var res=[];
      for(var i=0;i<n;i++){
        var mlP=gP(ac,function(u){return u.ml;});var nonP=gP(ac,function(u){return !u.ml;});
        if(mlP.length&&nonP.length){var m=pk(mlP,ac,true);if(!m)break;aF(m.id,ac);var nm=pk(gP(ac,function(u){return !u.ml;}),ac,false);if(!nm)break;aF(nm.id,ac);res.push(m.id,nm.id);}
        else if(mlP.length>=2){var m1=pk(mlP,ac,true);if(!m1)break;aF(m1.id,ac);var m2=pk(gP(ac,function(u){return u.ml;}),ac,false);if(!m2)break;aF(m2.id,ac);res.push(m1.id,m2.id);}
        else break;
      }
      return res;
    }

    // Fixed activities (skip locked)
    for(var fi=0;fi<FIX.length;fi++){
      var act=FIX[fi];var ac=act.code;
      if(dayLockFlags[ac]&&dayAsg[ac]){out[k][ac]=dayAsg[ac].slice();dayAsg[ac].forEach(function(uid){if(uid){dU.add(uid);dA.add(uid);}});continue;}
      var ov=dayOv[k]&&dayOv[k][ac];var en=ov?(ov.enabled!==false):true;
      if((ac==="NICMIN"||ac==="CIECHI")&&!ov)en=false;
      if(!en){out[k][ac]=[];continue;}
      var nP=(ov&&typeof ov.slots==="number")?ov.slots:(gS[ac]!==undefined?gS[ac]:act.def);

      if(ac==="CIC"||ac==="VD"){out[k][ac]=sPairs(ac,nP);}
      else if(ac==="NICSP"){
        var spR=[];for(var si=0;si<nP;si++){var spP=gP(ac,function(u){return u.ml&&u.ct==="STR";});if(!spP.length)spP=gP(ac,function(u){return u.ml;});if(!spP.length)spP=gP(ac,null);var s1=pk(spP,ac,true);if(!s1)break;aF(s1.id,ac);var s2=pk(gP(ac,null),ac,false);if(!s2)break;aF(s2.id,ac);spR.push(s1.id,s2.id);}
        out[k][ac]=spR;
      } else if(ac==="NICMIN"){
        var npi=function(u){return u.name==="Milana Maria Chiara"||u.name==="Calabrese Giorgia";};
        var nmR=[];for(var ni=0;ni<nP;ni++){var npP=gP(ac,npi);if(!npP.length)break;var mlP2=gP(ac,function(u){return u.ml;});if(!mlP2.length)mlP2=gP(ac,null);var ml2=pk(mlP2,ac,true);if(!ml2)break;aF(ml2.id,ac);var np2=pk(gP(ac,npi),ac,false);if(!np2)break;aF(np2.id,ac);nmR.push(ml2.id,np2.id);}
        out[k][ac]=nmR;
      } else if(ac==="CIECHI"){
        var cR=[];for(var ci=0;ci<nP;ci++){var prP=gP(ac,function(u){return u.eCi;});if(!prP.length)prP=gP(ac,null);var pr=pk(prP,ac,true);if(!pr)break;aF(pr.id,ac);var c2=pk(gP(ac,null),ac,false);if(!c2)break;aF(c2.id,ac);cR.push(pr.id,c2.id);}
        out[k][ac]=cR;
      } else if(ac==="NIC"){
        out[k][ac]=sPairs(ac,nP);
      } else if(ac==="222"){
        // 222: bypass gP — filter directly by e222 + basic availability
        var tR=[];
        for(var ti=0;ti<nP;ti++){
          var pool222=norm.filter(function(u){
            return u.e222&&!un.has(u.id)&&!dU.has(u.id)&&u.wd.includes(dow)&&u.swDay!==dow;
          });
          if(!pool222.length)break;
          var t1=pk(pool222,ac,false);
          if(t1){tR.push(t1.id);aF(t1.id,ac);}
        }
        out[k][ac]=tR;
      }

      // Track shortfall alerts
      var got=act.pair?Math.floor((out[k][ac]||[]).length/2):(out[k][ac]||[]).length;
      if(got<nP&&en){
        if(!alerts[k])alerts[k]=[];
        var avlML=norm.filter(function(u){return u.ml&&!un.has(u.id)&&!dU.has(u.id)&&u.wd.includes(dow)&&u.swDay!==dow;}).length;
        var avlNon=norm.filter(function(u){return !u.ml&&!un.has(u.id)&&!dU.has(u.id)&&u.wd.includes(dow)&&u.swDay!==dow;}).length;
        var swN=norm.filter(function(u){return u.swDay===dow&&!un.has(u.id);});
        var ferN=norm.filter(function(u){return un.has(u.id)&&!u.vo;});
        var reason="";
        if(avlML===0&&avlNon===0)reason="Nessuno disponibile";
        else if(act.pair&&avlML===0)reason="Nessun ML disponibile ("+avlNon+" non-ML rimasti)";
        else if(act.pair&&avlNon===0&&avlML<2)reason="Solo "+avlML+" ML, 0 non-ML";
        else reason="Pool insufficiente: "+avlML+" ML, "+avlNon+" non-ML disponibili";
        var swNames=swN.map(function(u){return u.name.split(" ")[0];}).slice(0,4);
        if(swNames.length)reason+=" | SW: "+swNames.join(", ")+(swN.length>4?" +":"");
        alerts[k].push({code:ac,label:act.label||ac,expected:nP,got:got,unit:act.pair?"coppie":"singoli",reason:reason});
      }
    }

    // VALID/ASP catch-all: respect activity settings
    if(dayLockFlags.VALID&&dayAsg.VALID){
      out[k].VALID=dayAsg.VALID.slice();dayAsg.VALID.forEach(function(uid){if(uid){dU.add(uid);dA.add(uid);}});
    } else {
      var vP=[];gP("VALID",function(u){return u.ct==="STR";}).forEach(function(u){vP.push(u.id);aF(u.id,"VALID");});
      out[k].VALID=vP;
    }
    if(dayLockFlags.ASP&&dayAsg.ASP){
      out[k].ASP=dayAsg.ASP.slice();dayAsg.ASP.forEach(function(uid){if(uid){dU.add(uid);dA.add(uid);}});
    } else {
      var aP=[];gP("ASP",function(u){return u.ct==="ACN";}).forEach(function(u){aP.push(u.id);aF(u.id,"ASP");});
      out[k].ASP=aP;
    }

    // FINAL CATCH-ALL: anyone still not placed goes to VALID(STR) or ASP(ACN)
    if(!out[k].VALID)out[k].VALID=[];
    if(!out[k].ASP)out[k].ASP=[];
    var still=norm.filter(function(u){return !un.has(u.id)&&!dU.has(u.id)&&u.wd.includes(dow)&&u.swDay!==dow;});
    still.forEach(function(u){
      if(u.ct==="STR"){
        var vs=u.as&&u.as.VALID;if(vs&&vs.al===false)return; // respect disabled VALID (e.g. Arcifa)
        out[k].VALID.push(u.id);aF(u.id,"VALID");
      } else {
        var as2=u.as&&u.as.ASP;if(as2&&as2.al===false)return;
        out[k].ASP.push(u.id);aF(u.id,"ASP");
      }
    });

    // TRIO PASS: promote VALID/ASP residuals into CIC (priority) then NIC
    // Max 1 extra per coppia (trio, mai quartetto). CIC first, NIC after.
    // Prefer non-ML first (rarely lead commissions)
    var residPool=out[k].VALID.concat(out[k].ASP).slice();
    residPool.sort(function(a2,b2){
      var ua=norm.find(function(x){return x.id===a2;});
      var ub=norm.find(function(x){return x.id===b2;});
      if(!ua||!ub)return 0;
      if(!ua.ml&&ub.ml)return -1;if(ua.ml&&!ub.ml)return 1;
      return (tL[a2]||0)-(tL[b2]||0);
    });
    function rmResid(uid){
      var vi=out[k].VALID.indexOf(uid);if(vi>=0)out[k].VALID.splice(vi,1);
      var ai=out[k].ASP.indexOf(uid);if(ai>=0)out[k].ASP.splice(ai,1);
    }
    if(!out[k]._trios)out[k]._trios={};
    function makeTrios(ac){
      var arr=out[k][ac];if(!arr||arr.length<2)return;
      var nPairs3=Math.floor(arr.length/2);
      var newA=[];var trioCount=0;
      for(var tp2=0;tp2<nPairs3;tp2++){
        newA.push(arr[tp2*2]);
        newA.push(arr[tp2*2+1]);
        if(residPool.length>0){
          var ex=residPool.shift();newA.push(ex);rmResid(ex);trioCount++;
        }
      }
      out[k][ac]=newA;
      out[k]._trios[ac]=trioCount;
    }
    makeTrios("CIC");
    if(residPool.length>0)makeTrios("NIC");
  }
  return {asg:out,alerts:alerts};
}

/* ═══════════ HTML EXPORT ═══════════ */
function expHTML(yr,mo,nd,sn,asg,eInd,dOv,gS){
  var title="Planning "+MN[mo]+" "+yr+" - CML Catania";
  var colH=OPD.map(function(a){var c=COL[a.code];return'<th style="padding:3px;font-size:8pt;font-weight:700;border:1px solid #bbb;text-align:center;background:'+(c?c.bg:"#f8fafc")+';color:'+(c?c.tx:"#334155")+'">'+a.code+'</th>';}).join("");
  var rows="";
  for(var d=1;d<=nd;d++){var k=dk(yr,mo,d),we=isWE(yr,mo,d),hol=isH(yr,mo,d),off=we||!!hol;var da=asg[k]||{},di=eInd[k]||{};var bg=hol?"#fee2e2":we?"#f1f5f9":(d%2===0?"#fafafc":"#fff");var dc=hol?"#dc2626":we?"#94a3b8":"#334155";var lbl=dn(yr,mo,d)+" "+d+(hol?" "+hol:"");
    var cells=OPD.map(function(a){if(off)return'<td style="border:1px solid #bbb;background:'+bg+'"></td>';var ov=dOv[k]&&dOv[k][a.code];var en=ov?(ov.enabled!==false):true;if((a.code==="NICMIN"||a.code==="CIECHI")&&!ov)en=false;if(!en)return'<td style="border:1px solid #bbb;background:#fafafa;color:#ccc;text-align:center">\u2014</td>';
      var uids=da[a.code]||[];var names=uids.map(function(uid){return sn[uid]||"?";});var c=COL[a.code];var inner="";
      if(a.pair&&names.length>=2){var canT2=(a.code==="CIC"||a.code==="NIC");var nT2=0;if(canT2){var ad2=ACT.find(function(x){return x.code===a.code;});var bp2=(ov&&typeof ov.slots==="number")?ov.slots:(gS[a.code]!==undefined?gS[a.code]:(ad2?ad2.def:0));nT2=Math.max(0,names.length-bp2*2);}var gi2=0;var gn=0;while(gi2<names.length){var gs=(canT2&&gn<nT2)?3:2;if(gi2+gs>names.length)gs=names.length-gi2;inner+='<div style="border:1px solid '+(c?c.bd:"#ddd")+';border-radius:3px;padding:1px 3px;margin-bottom:1px;background:'+(c?c.bg:"#fff")+(gs>2?';border-left:3px solid '+(c?c.bd:"#6366f1"):'')+'">';for(var gj=0;gj<gs;gj++){inner+='<div style="font-weight:'+(gj===0?'700':'400')+';font-size:7pt;color:'+(c?c.tx:"#333")+'">'+names[gi2+gj]+'</div>';}inner+='</div>';gi2+=gs;gn++;}}
      else{names.forEach(function(n){inner+='<div style="font-size:7pt;color:'+(c?c.tx:"#333")+'">'+n+'</div>';});}
      return'<td style="border:1px solid #bbb;padding:2px;background:'+(c?c.bg+"90":"#fff")+';text-align:center;vertical-align:top">'+inner+'</td>';}).join("");
    var indT=off?"":Object.entries(di).filter(function(e){return e[1]&&e[1].length;}).map(function(e){return'<b>'+(sn[e[0]]||"?")+'</b> '+e[1].join(",");}).join("<br/>");
    rows+='<tr style="background:'+bg+'"><td style="border:1px solid #bbb;padding:2px 4px;font-weight:600;white-space:nowrap;color:'+dc+';font-size:8pt">'+lbl+'</td>'+cells+'<td style="border:1px solid #bbb;padding:2px;font-size:7pt;color:#64748b;vertical-align:top">'+indT+'</td></tr>';}
  var html='<!DOCTYPE html><html><head><meta charset="utf-8"><title>'+title+'</title><style>@page{size:landscape;margin:6mm}body{font-family:Segoe UI,sans-serif;margin:6mm;-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}table{border-collapse:collapse;width:100%}</style></head><body><h2 style="text-align:center;margin:0 0 6px;font-size:13pt">'+title+'</h2><table><thead><tr><th style="padding:3px;font-size:8pt;border:1px solid #bbb;text-align:left;background:#f8fafc">Giorno</th>'+colH+'<th style="padding:3px;font-size:8pt;border:1px solid #bbb;text-align:left;background:#f8fafc">Indispo</th></tr></thead><tbody>'+rows+'</tbody></table></body></html>';
  var blob=new Blob([html],{type:"text/html;charset=utf-8"});var url=URL.createObjectURL(blob);var a=document.createElement("a");a.href=url;a.download="Planning_"+MN[mo]+"_"+yr+".html";document.body.appendChild(a);a.click();document.body.removeChild(a);setTimeout(function(){URL.revokeObjectURL(url);},1000);
}

/* ═══════════ STYLES ═══════════ */
var PCSS="@media print{.no-print{display:none!important}body{font-size:8pt;margin:4mm;-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}table{border-collapse:collapse;width:100%}th,td{border:1px solid #bbb;padding:2px 3px;font-size:7pt}@page{size:landscape;margin:6mm}}";
var cs={c:{padding:"2px 4px",fontSize:11,borderBottom:"1px solid #e2e8f0",verticalAlign:"top",lineHeight:1.3},h:{padding:"3px 4px",fontSize:10,fontWeight:700,background:"#f8fafc",borderBottom:"2px solid #cbd5e1",position:"sticky",top:0,zIndex:2,whiteSpace:"nowrap",textAlign:"center"},bp:{background:"#1e40af",color:"#fff",border:"none",borderRadius:6,padding:"7px 16px",cursor:"pointer",fontWeight:600,fontSize:13},bs:{background:"#fff",color:"#334155",border:"1px solid #cbd5e1",borderRadius:6,padding:"6px 12px",cursor:"pointer",fontSize:13},inp:{border:"1px solid #cbd5e1",borderRadius:5,padding:"4px 7px",fontSize:13,outline:"none",background:"#fff"}};
function tg(c){var o=COL[c];return{display:"inline-block",padding:"1px 6px",borderRadius:4,fontSize:10,fontWeight:600,background:o?o.bg:"#f1f5f9",color:o?o.tx:"#334155",border:"1px solid "+(o?o.bd:"#e2e8f0"),lineHeight:1.6};}
function Modal(p){if(!p.show)return null;return(<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.4)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999}} onClick={function(e){if(e.target===e.currentTarget&&p.onCancel)p.onCancel();}}><div style={{background:"#fff",borderRadius:12,padding:"24px 28px",maxWidth:420,width:"90%",boxShadow:"0 8px 32px rgba(0,0,0,.2)"}}><div style={{fontWeight:700,fontSize:15,marginBottom:8}}>{p.title}</div><div style={{fontSize:13,color:"#475569",marginBottom:20,lineHeight:1.5}}>{p.msg}</div><div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>{p.onCancel&&<button onClick={p.onCancel} style={cs.bs}>Annulla</button>}<button onClick={p.onOk} style={cs.bp}>OK</button></div></div></div>);}

/* ═══════════ MAIN ═══════════ */
var TABS=["Mese","Slot","Indispo","Utenti","Regole","Vincoli","Riepilogo"];
export default function App(){
  var now=new Date();var[yr,sYr]=useState(now.getFullYear());var[mo,sMo]=useState(now.getMonth());var[tab,sTab]=useState("Mese");var[loaded,sL]=useState(false);var[saved,sSv]=useState(true);
  var[users,sU]=useState(mDU);var[gS,sGS]=useState(mDS);var[inc,sInc]=useState(function(){var u=mDU();var n=u.find(function(x){return x.name==="Nannola Chiara";});var l=u.find(function(x){return x.name==="Licciardello Gabriele";});return (n&&l)?[[n.id,l.id]]:[];});var[dR,sDR]=useState(function(){var u=mDU();var c=u.find(function(x){return x.name==="Costa Manuela";});var o={};if(c)o[c.id]={"2":["CIC","NIC","VD"]};return o;});
  var[ovA,sOvA]=useState({});var[asA,sAsA]=useState({});var[genAlerts,sGenAlerts]=useState({});var[exA,sExA]=useState({});var[swE,sSWE]=useState({});var[ntA,sNtA]=useState({});var[locks,sLocks]=useState({});var[modal,sM]=useState(null);

  useEffect(function(){sLoad().then(function(s){if(s){var u=sanU(s.users);if(u&&u.length)sU(u);sGS(sanS(s.gS));sInc(sanA(s.inc));if(s.dR)sDR(sanO(s.dR));sOvA(sanO(s.ovA));sAsA(sanO(s.asA));sExA(sanO(s.exA));sSWE(sanO(s.swE));sNtA(sanO(s.ntA));sLocks(sanO(s.locks));}sL(true);});},[]);
  var first=useRef(true);useEffect(function(){if(first.current){first.current=false;return;}sSv(false);},[users,gS,inc,dR,ovA,asA,exA,swE,ntA,locks]);
  var doSave=useCallback(function(){sSave({users:users,gS:gS,inc:inc,dR:dR,ovA:ovA,asA:asA,exA:exA,swE:swE,ntA:ntA,locks:locks}).then(function(){sSv(true);});},[users,gS,inc,dR,ovA,asA,exA,swE,ntA,locks]);

  var fileRef=useRef(null);
  var doExpJ=useCallback(function(){var data={users:users,gS:gS,inc:inc,dR:dR,ovA:ovA,asA:asA,exA:exA,swE:swE,ntA:ntA,locks:locks,_v:"v11"};var blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});var url=URL.createObjectURL(blob);var a=document.createElement("a");a.href=url;a.download="CML_backup_"+new Date().toISOString().slice(0,10)+".json";document.body.appendChild(a);a.click();document.body.removeChild(a);},[users,gS,inc,dR,ovA,asA,exA,swE,ntA,locks]);
  var doImpJ=function(e){var file=e.target.files&&e.target.files[0];if(!file)return;var reader=new FileReader();reader.onload=function(ev){try{var d=JSON.parse(ev.target.result);var u=sanU(d.users);if(u&&u.length)sU(u);sGS(sanS(d.gS));sInc(sanA(d.inc));if(d.dR)sDR(sanO(d.dR));sOvA(sanO(d.ovA));sAsA(sanO(d.asA));sExA(sanO(d.exA));sSWE(sanO(d.swE||{}));sNtA(sanO(d.ntA));sLocks(sanO(d.locks||{}));sSv(false);sM({title:"OK",msg:"Importato. Clicca Salva.",onOk:function(){sM(null);}});}catch(err){sM({title:"Errore",msg:String(err),onOk:function(){sM(null);}});}};reader.readAsText(file);e.target.value="";};

  var mk=yr+"-"+mo;var dOv=ovA[mk]||{};var asg=asA[mk]||{};var exc=exA[mk]||{};var swExc=swE[mk]||{};var mNt=ntA[mk]||"";var mLk=locks[mk]||{};var nd=nD(yr,mo);
  var sn=useMemo(function(){return sN(users);},[users]);
  var eInd=useMemo(function(){return bInd(yr,mo,users,exc,swExc);},[yr,mo,users,exc,swExc]);

  var sDO=useCallback(function(fn){sOvA(function(p){var o=Object.assign({},p);o[mk]=typeof fn==="function"?fn(p[mk]||{}):fn;return o;});},[mk]);
  var sAS=useCallback(function(v){sAsA(function(p){var o=Object.assign({},p);o[mk]=typeof v==="function"?v(p[mk]||{}):v;return o;});},[mk]);
  var sEx=useCallback(function(fn){sExA(function(p){var o=Object.assign({},p);o[mk]=typeof fn==="function"?fn(p[mk]||{}):fn;return o;});},[mk]);
  var sSW=useCallback(function(fn){sSWE(function(p){var o=Object.assign({},p);o[mk]=typeof fn==="function"?fn(p[mk]||{}):fn;return o;});},[mk]);
  var sNt=useCallback(function(v){sNtA(function(p){var o=Object.assign({},p);o[mk]=v;return o;});},[mk]);
  var sLk=useCallback(function(fn){sLocks(function(p){var o=Object.assign({},p);o[mk]=typeof fn==="function"?fn(p[mk]||{}):fn;return o;});},[mk]);

  var doGen=useCallback(function(){sM({title:"Genera",msg:"Sovrascrive (tranne celle bloccate).",onOk:function(){var r=gen(yr,mo,users,gS,dOv,eInd,inc,dR,mLk,asg);sAS(r.asg);sGenAlerts(r.alerts||{});sM(null);}});},[yr,mo,users,gS,dOv,eInd,inc,dR,mLk,asg,sAS]);
  var doExpH=useCallback(function(){expHTML(yr,mo,nd,sn,asg,eInd,dOv,gS);},[yr,mo,nd,sn,asg,eInd,dOv,gS]);
  var doPrint=useCallback(function(){document.title="Planning "+MN[mo]+" "+yr;setTimeout(function(){try{window.print();}catch(e){doExpH();}},100);},[mo,yr,doExpH]);

  var prev=function(){if(mo===0){sMo(11);sYr(function(y){return y-1;});}else sMo(function(m){return m-1;});};
  var next=function(){if(mo===11){sMo(0);sYr(function(y){return y+1;});}else sMo(function(m){return m+1;});};

  if(!loaded)return(<div style={{padding:40,textAlign:"center",color:"#64748b"}}>Caricamento...</div>);

  return(<div style={{fontFamily:"'DM Sans','Segoe UI',system-ui,sans-serif",maxWidth:1500,margin:"0 auto",padding:"16px 20px",color:"#1e293b",fontSize:13,background:"#f8fafc",minHeight:"100vh"}}>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
    <style>{PCSS}</style>
    <Modal show={!!modal} title={modal?modal.title:""} msg={modal?modal.msg:""} onOk={modal?modal.onOk:null} onCancel={function(){sM(null);}}/>
    <div className="no-print" style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8,flexWrap:"wrap",gap:8}}>
      <div style={{display:"flex",alignItems:"baseline",gap:10}}><span style={{fontSize:20,fontWeight:800,background:"linear-gradient(135deg,#1e40af,#7c3aed)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>CML Catania</span><span style={{fontSize:12,color:"#94a3b8",fontWeight:500}}>Planning Mensile · v11</span></div>
      <div style={{display:"flex",alignItems:"center",gap:6}}>
        <button onClick={doSave} style={Object.assign({},cs.bp,{background:saved?"#16a34a":"#dc2626",padding:"5px 14px",fontSize:12})}>{saved?"\u2713 Salvato":"Salva"}</button>
        <button onClick={doExpJ} style={Object.assign({},cs.bs,{fontSize:11,padding:"4px 8px"})}>{"\u2B07"}JSON</button>
        <button onClick={function(){fileRef.current&&fileRef.current.click();}} style={Object.assign({},cs.bs,{fontSize:11,padding:"4px 8px"})}>{"\u2B06"}JSON</button>
        <input ref={fileRef} type="file" accept=".json" style={{display:"none"}} onChange={doImpJ}/>
        <span style={{color:"#e2e8f0"}}>|</span>
        <button onClick={prev} style={cs.bs}>{"\u25C0"}</button>
        <span style={{fontWeight:700,fontSize:14,minWidth:150,textAlign:"center"}}>{MN[mo]} {yr}</span>
        <button onClick={next} style={cs.bs}>{"\u25B6"}</button>
      </div>
    </div>
    <div className="no-print" style={{display:"flex",gap:1,marginBottom:12,borderBottom:"2px solid #e2e8f0",flexWrap:"wrap"}}>
      {TABS.map(function(t){return(<button key={t} onClick={function(){sTab(t);}} style={{padding:"6px 14px",border:"none",cursor:"pointer",fontWeight:tab===t?700:400,color:tab===t?"#1e40af":"#64748b",background:tab===t?"#eff6ff":"transparent",borderBottom:"none",borderRadius:20,margin:"0 2px",fontSize:13}}>{t}</button>);})}</div>

    {tab==="Mese"&&<VMese yr={yr} mo={mo} nd={nd} users={users} sn={sn} gS={gS} dOv={dOv} asg={asg} sAS={sAS} eInd={eInd} doGen={doGen} doExpH={doExpH} doPrint={doPrint} mLk={mLk} sLk={sLk} alerts={genAlerts}/>}
    {tab==="Slot"&&<VSlot gS={gS} sGS={sGS} yr={yr} mo={mo} nd={nd} dOv={dOv} sDO={sDO}/>}
    {tab==="Indispo"&&<VInd yr={yr} mo={mo} nd={nd} users={users} sn={sn} exc={exc} sEx={sEx} swExc={swExc} sSW={sSW} eInd={eInd}/>}
    {tab==="Utenti"&&<VUt users={users} sU={sU} sn={sn} sM={sM}/>}
    {tab==="Regole"&&<VReg users={users} sU={sU}/>}
    {tab==="Vincoli"&&<VVinc users={users} sn={sn} inc={inc} sInc={sInc} dR={dR} sDR={sDR} sM={sM}/>}
    {tab==="Riepilogo"&&<VRiep yr={yr} mo={mo} nd={nd} users={users} sn={sn} asg={asg} eInd={eInd} notes={mNt} sNt={sNt}/>}
  </div>);
}

/* ═══════════ MESE — drag-drop, lock, filtered dropdown ═══════════ */
function VMese(p){
  var yr=p.yr,mo=p.mo,nd=p.nd,users=p.users,sn=p.sn,gS=p.gS,dOv=p.dOv,asg=p.asg,sAS=p.sAS,eInd=p.eInd,mLk=p.mLk,sLk=p.sLk,alerts=p.alerts||{};
  var days=[];for(var i=1;i<=nd;i++)days.push(i);
  var[edit,sEdit]=useState(null);
  var[alertDay,sAlertDay]=useState(null); // dateKey for alert modal
  var dragRef=useRef(null); // ref to avoid stale closure

  var modDay=function(fn){sAS(function(prev){return fn(JSON.parse(JSON.stringify(prev)));});};
  var swapCell=function(dk2,code,idx,uid){modDay(function(o){if(!o[dk2])o[dk2]={};var a=o[dk2][code]||[];a[idx]=uid;o[dk2][code]=a;return o;});sEdit(null);};
  var rmCell=function(dk2,code,idx){modDay(function(o){if(!o[dk2])o[dk2]={};var a=o[dk2][code]||[];a.splice(idx,1);o[dk2][code]=a;return o;});sEdit(null);};
  var addCell=function(dk2,code,uid){modDay(function(o){if(!o[dk2])o[dk2]={};var a=o[dk2][code]||[];a.push(uid);o[dk2][code]=a;return o;});sEdit(null);};

  // Available: exclude unavail + already assigned that day
  var gAv=function(dk2,code,exIdx){
    var da=asg[dk2]||{};var used=new Set();Object.values(da).forEach(function(a){if(!Array.isArray(a))return;a.forEach(function(u){if(u)used.add(u);});});
    var di=eInd[dk2]||{};
    return users.filter(function(u){
      if(u.vo)return false;
      if(di[u.id])return false; // unavail/SW/N-D
      if(used.has(u.id)){return exIdx!==undefined&&(da[code]||[])[exIdx]===u.id;}
      return true;
    });
  };

  // Lock toggle for a day+activity
  var togLock=function(dk2,code){
    sLk(function(prev){
      var c=Object.assign({},prev);
      if(!c[dk2])c[dk2]={};
      c[dk2]=Object.assign({},c[dk2]);
      if(c[dk2][code]){delete c[dk2][code];}
      else{c[dk2][code]=true;}
      return c;
    });
  };

  // Drag handlers — using ref to avoid stale closure
  var onDS=function(e,dk2,code,idx,uid){
    dragRef.current={dk:dk2,code:code,idx:idx,uid:uid};
    e.dataTransfer.effectAllowed="move";
    try{e.dataTransfer.setData("text/plain",uid);}catch(ex){}
  };
  var onDO=function(e){e.preventDefault();e.dataTransfer.dropEffect="move";};
  var onDrop=function(e,tgtDk,tgtCode,tgtIdx){
    e.preventDefault();
    var dr=dragRef.current;
    if(!dr)return;
    dragRef.current=null;
    if(dr.dk===tgtDk&&dr.code===tgtCode&&dr.idx===tgtIdx)return;

    // VDOM: pair-locked drag (indissoluble pairs)
    // If source OR target is VDOM, handle as pair move between VDOM slots only
    if(dr.code==="VDOM"||tgtCode==="VDOM"){
      // Only allow VDOM ↔ VDOM pair moves
      if(dr.code!=="VDOM"||tgtCode!=="VDOM")return;
      modDay(function(o){
        if(!o[dr.dk])o[dr.dk]={};
        if(!o[tgtDk])o[tgtDk]={};
        var srcArr=(o[dr.dk].VDOM||[]).slice();
        var srcPairStart=Math.floor(dr.idx/2)*2;
        if(srcPairStart+1>=srcArr.length)return o; // incomplete pair, ignore
        var srcPair=[srcArr[srcPairStart],srcArr[srcPairStart+1]];
        // Same day swap: reorder pairs within VDOM of same day
        if(dr.dk===tgtDk){
          var arr2=srcArr;
          var tgtPairStart=Math.floor(tgtIdx/2)*2;
          if(tgtPairStart===srcPairStart)return o;
          if(tgtPairStart+1<arr2.length){
            // Swap two existing pairs
            var tgtPair=[arr2[tgtPairStart],arr2[tgtPairStart+1]];
            arr2[srcPairStart]=tgtPair[0];arr2[srcPairStart+1]=tgtPair[1];
            arr2[tgtPairStart]=srcPair[0];arr2[tgtPairStart+1]=srcPair[1];
          }
          o[dr.dk].VDOM=arr2;
        } else {
          // Cross-day: swap or move pair
          var tgtArr=(o[tgtDk].VDOM||[]).slice();
          var tgtPairStart2=Math.floor(tgtIdx/2)*2;
          if(tgtPairStart2<tgtArr.length&&tgtPairStart2+1<tgtArr.length){
            // Full pair at target → swap
            var tgtPair2=[tgtArr[tgtPairStart2],tgtArr[tgtPairStart2+1]];
            tgtArr[tgtPairStart2]=srcPair[0];tgtArr[tgtPairStart2+1]=srcPair[1];
            srcArr[srcPairStart]=tgtPair2[0];srcArr[srcPairStart+1]=tgtPair2[1];
          } else {
            // Append pair to target, remove from source
            tgtArr.push(srcPair[0]);tgtArr.push(srcPair[1]);
            srcArr.splice(srcPairStart,2);
          }
          o[dr.dk].VDOM=srcArr;
          o[tgtDk].VDOM=tgtArr;
        }
        return o;
      });
      return;
    }

    modDay(function(o){
      if(!o[dr.dk])o[dr.dk]={};
      if(!o[tgtDk])o[tgtDk]={};
      // Same day + same activity → swap within one array
      if(dr.dk===tgtDk&&dr.code===tgtCode){
        var arr=(o[dr.dk][dr.code]||[]).slice();
        var tgtUid=(tgtIdx<arr.length)?arr[tgtIdx]:null;
        if(tgtIdx<arr.length){arr[tgtIdx]=dr.uid;}
        else{arr.push(dr.uid);}
        if(tgtUid){arr[dr.idx]=tgtUid;}
        else{arr.splice(dr.idx,1);}
        o[dr.dk][dr.code]=arr;
      } else {
        // Different column/day → two separate arrays
        var srcArr2=(o[dr.dk][dr.code]||[]).slice();
        var tgtArr2=(o[tgtDk][tgtCode]||[]).slice();
        var tgtUid2=(tgtIdx<tgtArr2.length)?tgtArr2[tgtIdx]:null;
        if(tgtIdx<tgtArr2.length){tgtArr2[tgtIdx]=dr.uid;}
        else{tgtArr2.push(dr.uid);}
        if(tgtUid2){srcArr2[dr.idx]=tgtUid2;}
        else{srcArr2.splice(dr.idx,1);}
        o[dr.dk][dr.code]=srcArr2;
        o[tgtDk][tgtCode]=tgtArr2;
      }
      return o;
    });
  };

  var PA=["CIC","NIC","NICSP","NICMIN","VD","CIECHI","VDOM","PU"];

  // Alert detail modal
  var alertModal=null;
  if(alertDay){
    var dayA=alerts[alertDay]||[];
    var dayLabel=alertDay.replace(/^\d+-0?(\d+)-0?(\d+)$/,function(_,m,d){return d+"/"+m;});
    // Compute unplaced for this day
    var adDa=asg[alertDay]||{};var adDi=eInd[alertDay]||{};
    var adUsed=new Set();Object.values(adDa).forEach(function(arr){if(!Array.isArray(arr))return;arr.forEach(function(uid){if(uid)adUsed.add(uid);});});
    var adParts=alertDay.split("-");var adD=parseInt(adParts[2],10);var adDow=new Date(yr,mo,adD).getDay();
    var unplacedUsers=users.filter(function(u){
      if(u.vo)return false;if(adDi[u.id])return false;
      if(!u.wd.includes(adDow)||u.swDay===adDow)return false;
      return !adUsed.has(u.id);
    });
    alertModal=(<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.45)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999}} onClick={function(e){if(e.target===e.currentTarget)sAlertDay(null);}}>
      <div style={{background:"#fff",borderRadius:14,padding:"20px 24px",maxWidth:500,width:"92%",boxShadow:"0 12px 40px rgba(0,0,0,.25)",maxHeight:"80vh",overflow:"auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <span style={{fontWeight:700,fontSize:15,color:dayA.length>0?"#b45309":"#1e40af"}}>{dayA.length>0?"⚠":"ℹ️"} Giorno {dayLabel}</span>
          <button onClick={function(){sAlertDay(null);}} style={{background:"none",border:"none",fontSize:18,cursor:"pointer",color:"#94a3b8"}}>{"✕"}</button>
        </div>
        {dayA.length>0&&<div style={{marginBottom:12}}>
          <div style={{fontSize:12,fontWeight:600,color:"#b45309",marginBottom:6}}>Commissioni incomplete:</div>
          {dayA.map(function(al,i){
            var cl=COL[al.code];
            return(<div key={i} style={{background:cl?cl.bg+"40":"#f8fafc",border:"1px solid "+(cl?cl.bd:"#e2e8f0"),borderRadius:8,padding:"10px 14px",marginBottom:6}}>
              <div style={{fontWeight:700,fontSize:13,color:cl?cl.tx:"#334155",marginBottom:4}}>{al.code}: {al.got}/{al.expected} {al.unit}</div>
              <div style={{fontSize:12,color:"#475569",lineHeight:1.5}}>{al.reason}</div>
            </div>);
          })}
        </div>}
        {unplacedUsers.length>0&&<div>
          <div style={{fontSize:12,fontWeight:600,color:"#1e40af",marginBottom:6}}>Non assegnati ({unplacedUsers.length}):</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
            {unplacedUsers.map(function(u){
              var isStr=u.ct==="STR";
              return(<span key={u.id} style={{background:isStr?"#e0e7ff":"#cffafe",color:isStr?"#3730a3":"#155e75",fontSize:11,fontWeight:isStr?700:500,padding:"2px 8px",borderRadius:6,border:"1px solid "+(isStr?"#a5b4fc":"#67e8f9")}}>{u.ml?"ML ":""}{sn[u.id]}</span>);
            })}
          </div>
        </div>}
        {dayA.length===0&&unplacedUsers.length===0&&<div style={{color:"#16a34a",fontSize:13}}>Tutto regolare, nessun residuo.</div>}
        <p style={{fontSize:11,color:"#94a3b8",marginTop:10}}>Usa il <b>+</b> nelle celle per assegnare manualmente.</p>
      </div>
    </div>);
  }

  return(<div>
    {alertModal}
    <div className="no-print" style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:6}}>
      {OPD.filter(function(a){return COL[a.code];}).map(function(a){return(<span key={a.code} style={tg(a.code)}>{a.label}</span>);})}</div>
    <div className="no-print" style={{display:"flex",gap:8,marginBottom:6,flexWrap:"wrap"}}>
      <button onClick={p.doGen} style={cs.bp}>Genera Planning</button>
      <button onClick={p.doPrint} style={Object.assign({},cs.bp,{background:"#7c3aed"})}>Stampa PDF</button>
      <button onClick={p.doExpH} style={cs.bs}>Scarica HTML</button>
    </div>
    <p className="no-print" style={{fontSize:10,color:"#94a3b8",marginBottom:6}}>{"\uD83D\uDD12"} = blocca cella (non sovrascritta da Genera) {"\u00B7"} Trascina nomi per spostare {"\u00B7"} <b>GRASSETTO</b>=strutturato</p>
    <div style={{overflowX:"auto"}}>
      <table style={{borderCollapse:"collapse",width:"100%",minWidth:900}}>
        <thead><tr>
          <th style={Object.assign({},cs.h,{minWidth:50,textAlign:"left"})}>Giorno</th>
          {OPD.map(function(a){var c=COL[a.code];return(<th key={a.code} style={Object.assign({},cs.h,{minWidth:55,background:c?c.bg:"#f8fafc",color:c?c.tx:"#334155"})}>{a.code}</th>);})}
          <th style={Object.assign({},cs.h,{minWidth:70,textAlign:"left"})}>Indispo</th>
        </tr></thead>
        <tbody>
          {days.map(function(d){
            var k=dk(yr,mo,d),we=isWE(yr,mo,d),hol=isH(yr,mo,d),off=we||!!hol,da=asg[k]||{},di=eInd[k]||{};
            var bg=hol?"#fee2e2":we?"#f1f5f9":(d%2===0?"#fafafc":"#fff");var dc=hol?"#dc2626":we?"#94a3b8":"#334155";
            var lbl=dn(yr,mo,d)+" "+d+(hol?" "+hol:"");
            var dayAlerts=(alerts[k]||[]).slice();
            // Live: count available vs assigned
            var dayAvail=0,dayPlaced=0;
            if(!off){
              users.forEach(function(u){
                if(u.vo)return;
                if(di[u.id])return; // unavail
                var ddow=new Date(yr,mo,d).getDay();
                if(!u.wd.includes(ddow)||u.swDay===ddow)return;
                dayAvail++;
              });
              var usedSet=new Set();
              Object.values(da).forEach(function(arr){if(!Array.isArray(arr))return;arr.forEach(function(uid){if(uid)usedSet.add(uid);});});
              dayPlaced=usedSet.size;
            }
            var unplaced=Math.max(0,dayAvail-dayPlaced);
            var hasAlerts=dayAlerts.length>0;
            return(<tr key={d} style={{background:bg}}>
              <td style={Object.assign({},cs.c,{fontWeight:600,whiteSpace:"nowrap",color:dc,fontSize:hol?10:11})}>
                {lbl}
                {!off&&<span className="no-print" style={{marginLeft:4,display:"inline-flex",alignItems:"center",gap:3}}>
                  {hasAlerts?<button onClick={function(){sAlertDay(k);}} style={{background:"#fef3c7",border:"1px solid #f59e0b",borderRadius:10,color:"#b45309",fontSize:9,fontWeight:700,padding:"0 5px",cursor:"pointer",lineHeight:1.5}} title={dayAlerts.length+" commissioni incomplete"}>{"\u26A0"}{dayAlerts.length}</button>
                  :<button onClick={function(){sAlertDay(k);}} style={{background:"none",border:"none",color:"#16a34a",fontSize:11,fontWeight:700,cursor:"pointer",padding:0}}>{"\u2713"}</button>}
                  {unplaced>0&&<button onClick={function(){sAlertDay(k);}} style={{background:"#dbeafe",color:"#1e40af",fontSize:8,fontWeight:700,borderRadius:8,padding:"0 4px",lineHeight:1.5,cursor:"pointer",border:"1px solid #93c5fd"}} title={unplaced+" disponibil"+(unplaced===1?"e":"i")+" non assegnat"+(unplaced===1?"o":"i")}>{unplaced}</button>}
                </span>}
              </td>
              {OPD.map(function(a){
                if(off)return(<td key={a.code} style={Object.assign({},cs.c,{background:bg})}/>);
                var ov=dOv[k]&&dOv[k][a.code];var en=ov?(ov.enabled!==false):true;
                if((a.code==="NICMIN"||a.code==="CIECHI")&&!ov)en=false;
                if(!en)return(<td key={a.code} style={Object.assign({},cs.c,{background:"#fafafa",color:"#cbd5e1",textAlign:"center",fontSize:9})}>{"\u2014"}</td>);
                var uids=(da[a.code]||[]).filter(function(u){return u!==null&&u!==undefined;});var c=COL[a.code];
                var isLocked=mLk[k]&&mLk[k][a.code];
                var isP=PA.includes(a.code);var cc=[];

                // Render names with drag support
                var renderName=function(uid,idx){
                  var u=users.find(function(x){return x.id===uid;});
                  var isStr=u&&u.ct==="STR";
                  var isVdomCell=a.code==="VDOM";
                  var isEd=edit&&edit.dk===k&&edit.code===a.code&&edit.idx===idx;
                  if(isEd&&!isVdomCell){
                    var av=gAv(k,a.code,idx);
                    return(<select key={idx} autoFocus value={uid||""} style={Object.assign({},cs.inp,{fontSize:9,padding:"1px",width:"100%"})}
                      onChange={function(e){if(e.target.value==="_rm")rmCell(k,a.code,idx);else swapCell(k,a.code,idx,e.target.value);}}
                      onBlur={function(){setTimeout(function(){sEdit(null);},150);}}>
                      <option value={uid}>{sn[uid]||"?"}</option>
                      <option value="_rm" style={{color:"red"}}>{"\u2715"} Rimuovi</option>
                      {av.map(function(u2){return(<option key={u2.id} value={u2.id}>{sn[u2.id]}</option>);})}
                    </select>);
                  }
                  return(<div key={idx} draggable="true"
                    onDragStart={function(e){onDS(e,k,a.code,idx,uid);}}
                    onDragOver={onDO}
                    onDrop={function(e){onDrop(e,k,a.code,idx);}}
                    onClick={isVdomCell?undefined:function(){sEdit({dk:k,code:a.code,idx:idx});}}
                    title={isVdomCell?"Coppia VDOM \u2014 trascina per spostare la coppia intera":undefined}
                    style={{color:c?c.tx:"#334155",lineHeight:1.25,cursor:"grab",
                      fontWeight:isStr?700:400,
                      textTransform:isStr?"uppercase":"none",
                      fontSize:isStr?8:9}}>{sn[uid]||"?"}</div>);
                };

                if(isP&&uids.length>=2){
                  // Auto-detect trios: extras beyond configured pair slots
                  var canTrio=(a.code==="CIC"||a.code==="NIC");
                  var nTrios=0;
                  if(canTrio){
                    var actDef=ACT.find(function(x){return x.code===a.code;});
                    var basePairs=(ov&&typeof ov.slots==="number")?ov.slots:(gS[a.code]!==undefined?gS[a.code]:(actDef?actDef.def:0));
                    nTrios=Math.max(0,uids.length-basePairs*2);
                  }
                  var groups=[];var gi=0;var grpNum=0;
                  while(gi<uids.length){
                    var sz=(canTrio&&grpNum<nTrios)?3:2;
                    var grpIdx=[];for(var gg=0;gg<sz&&gi+gg<uids.length;gg++)grpIdx.push(gi+gg);
                    groups.push(grpIdx);gi+=grpIdx.length;grpNum++;
                  }
                  groups.forEach(function(grp,gIdx){
                    var isExtra=grp.length>2;
                    cc.push(<div key={gIdx+"g"} style={{border:"1px solid "+(c?c.bd:"#e2e8f0"),borderRadius:isExtra?5:3,padding:"1px 3px",marginBottom:1,background:c?c.bg:"#fff",borderLeft:isExtra?"3px solid "+(c?c.bd:"#6366f1"):"1px solid "+(c?c.bd:"#e2e8f0")}}>
                      {grp.map(function(idx){return renderName(uids[idx],idx);})}
                    </div>);
                  });
                } else {
                  uids.forEach(function(uid,idx){cc.push(renderName(uid,idx));});
                }

                // Add + lock buttons (+ hidden for VDOM: pairs are auto-managed)
                var isAddE=edit&&edit.dk===k&&edit.code===a.code&&edit.idx===-1;
                if(isAddE&&a.code!=="VDOM"){var av3=gAv(k,a.code,undefined);cc.push(<select key="add" autoFocus value="" style={Object.assign({},cs.inp,{fontSize:9,padding:"1px",width:"100%"})} onChange={function(e){if(e.target.value)addCell(k,a.code,e.target.value);}} onBlur={function(){setTimeout(function(){sEdit(null);},150);}}><option value="">Aggiungi...</option>{av3.map(function(u2){return(<option key={u2.id} value={u2.id}>{sn[u2.id]}</option>);})}</select>);}
                else{cc.push(<div key="btns" className="no-print" style={{display:"flex",justifyContent:"center",gap:4,marginTop:1}}>
                  {a.code!=="VDOM"&&<button onClick={function(){sEdit({dk:k,code:a.code,idx:-1});}} style={{background:"none",border:"none",color:"#94a3b8",cursor:"pointer",fontSize:10,padding:0}}>+</button>}
                  <button onClick={function(){togLock(k,a.code);}} style={{background:"none",border:"none",color:isLocked?"#dc2626":"#cbd5e1",cursor:"pointer",fontSize:9,padding:0}}>{isLocked?"\uD83D\uDD12":"\uD83D\uDD13"}</button>
                </div>);}

                return(<td key={a.code} style={Object.assign({},cs.c,{background:c?(c.bg+"60"):"#fff",textAlign:"center",fontSize:9,padding:"2px",
                  outline:isLocked?"2px solid #f59e0b":"none"})}
                  onDragOver={onDO} onDrop={function(e){onDrop(e,k,a.code,uids.length);}}>
                  {cc}</td>);
              })}
              <td style={Object.assign({},cs.c,{fontSize:9})}>
                {!off&&Object.entries(di).filter(function(e){return e[1]&&e[1].length;}).map(function(e){return(<div key={e[0]} style={{color:"#64748b"}}><b>{sn[e[0]]||"?"}</b> {e[1].join(",")}</div>);})}</td>
            </tr>);
          })}
        </tbody></table></div></div>);
}

/* ═══════════ SLOT ═══════════ */
function VSlot(p){
  var gS=p.gS,sGS=p.sGS,yr=p.yr,mo=p.mo,nd=p.nd,dOv=p.dOv,sDO=p.sDO;
  var wd=useMemo(function(){var r=[];for(var i=1;i<=nd;i++){if(!isOff(yr,mo,i))r.push(i);}return r;},[yr,mo,nd]);
  var chg=function(code,val){var n=parseInt(val,10);if(isNaN(n)||n<0)return;sGS(function(prev){var o=Object.assign({},prev);o[code]=n;return o;});};
  var togD=function(d,code){var k=dk(yr,mo,d);sDO(function(prev){var c=Object.assign({},prev);c[k]=Object.assign({},c[k]||{});var cur=c[k][code]||{enabled:true};c[k][code]=Object.assign({},cur,{enabled:!cur.enabled});return c;});};
  var setDS=function(d,code,val){var n=parseInt(val,10);var k=dk(yr,mo,d);sDO(function(prev){var c=Object.assign({},prev);c[k]=Object.assign({},c[k]||{});var cur=c[k][code]||{enabled:true};c[k][code]=Object.assign({},cur,{slots:isNaN(n)?undefined:n});return c;});};
  var QK=["CIECHI","NICSP","NICMIN"];
  return(<div>
    <h3 style={{fontSize:14,fontWeight:700,marginBottom:8}}>Slot <span style={{fontWeight:400,fontSize:11,color:"#64748b"}}>(coppie per comm., singoli per 222)</span></h3>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:6,marginBottom:16}}>
      {SLOTABLE.map(function(a){return(<div key={a.code} style={{display:"flex",alignItems:"center",gap:8,padding:"5px 10px",borderRadius:6,background:COL[a.code]?COL[a.code].bg:"#f8fafc",border:"1px solid "+(COL[a.code]?COL[a.code].bd:"#e2e8f0")}}>
        <span style={{fontWeight:600,fontSize:12,color:COL[a.code]?COL[a.code].tx:"#334155",flex:1}}>{a.code} <span style={{fontWeight:400,fontSize:10}}>({a.pair?"coppie":"singoli"})</span></span>
        <input type="number" min={0} max={10} value={gS[a.code]!==undefined?gS[a.code]:a.def} onChange={function(e){chg(a.code,e.target.value);}} style={Object.assign({},cs.inp,{width:46,textAlign:"center",fontSize:12})}/>
      </div>);})}</div>
    <h3 style={{fontSize:14,fontWeight:700,marginBottom:8}}>Attivazione rapida <span style={{fontWeight:400,fontSize:11,color:"#64748b"}}>(solo {MN[mo]})</span></h3>
    <div style={{overflowX:"auto",marginBottom:16}}>
      <table style={{borderCollapse:"collapse"}}><thead><tr><th style={cs.h}>Giorno</th>
        {QK.map(function(c){return(<th key={c} style={Object.assign({},cs.h,{width:70})}>{c}</th>);})}</tr></thead>
        <tbody>{wd.map(function(d){var k=dk(yr,mo,d);return(<tr key={d}><td style={cs.c}>{dn(yr,mo,d)} {d}</td>
          {QK.map(function(code){var ov=dOv[k]&&dOv[k][code];var en=ov?(ov.enabled!==false):true;if((code==="NICMIN"||code==="CIECHI")&&!ov)en=false;
            return(<td key={code} style={Object.assign({},cs.c,{textAlign:"center"})}><input type="checkbox" checked={en} onChange={function(){togD(d,code);}}/></td>);})}</tr>);})}</tbody></table></div>
    <h3 style={{fontSize:14,fontWeight:700,marginBottom:6}}>Override <span style={{fontWeight:400,fontSize:11,color:"#64748b"}}>(solo {MN[mo]})</span></h3>
    <div style={{overflowX:"auto"}}><table style={{borderCollapse:"collapse"}}><thead><tr><th style={cs.h}>Giorno</th>
      {SLOTABLE.map(function(a){return(<th key={a.code} style={Object.assign({},cs.h,{fontSize:9})}>{a.code}</th>);})}</tr></thead>
      <tbody>{wd.map(function(d){var k=dk(yr,mo,d);return(<tr key={d}><td style={cs.c}>{dn(yr,mo,d)} {d}</td>
        {SLOTABLE.map(function(a){var ov=dOv[k]&&dOv[k][a.code];return(<td key={a.code} style={Object.assign({},cs.c,{textAlign:"center"})}>
          <input type="number" min={0} max={10} value={ov&&ov.slots!==undefined?ov.slots:""} placeholder={String(gS[a.code]!==undefined?gS[a.code]:a.def)} onChange={function(e){setDS(d,a.code,e.target.value);}} style={Object.assign({},cs.inp,{width:34,textAlign:"center",fontSize:10,padding:"2px"})}/>
        </td>);})}</tr>);})}</tbody></table></div>
  </div>);
}

/* ═══════════ INDISPO — with flexible SW ═══════════ */
function VInd(p){
  var yr=p.yr,mo=p.mo,nd=p.nd,users=p.users,sn=p.sn,exc=p.exc,sEx=p.sEx,swExc=p.swExc,sSW=p.sSW,eInd=p.eInd;
  var sorted=useMemo(function(){return users.filter(function(u){return !u.vo;}).sort(function(a,b){return a.name.localeCompare(b.name);});},[users]);
  var wd=useMemo(function(){var r=[];for(var i=1;i<=nd;i++){if(!isOff(yr,mo,i))r.push(i);}return r;},[yr,mo,nd]);
  var[sel,sSel]=useState("");useEffect(function(){if(!sel&&sorted.length)sSel(sorted[0].id);},[sorted,sel]);

  var togE=function(uid,d,code){var k=dk(yr,mo,d);sEx(function(prev){var c=Object.assign({},prev);c[k]=Object.assign({},c[k]||{});var a=c[k][uid]?c[k][uid].slice():[];var ix=a.indexOf(code);if(ix>=0)a.splice(ix,1);else a.push(code);c[k][uid]=a.length?a:undefined;if(!c[k][uid])delete c[k][uid];return c;});};
  // SW toggle for flexible days
  var togSW=function(uid,d){var k=dk(yr,mo,d);sSW(function(prev){var c=Object.assign({},prev);c[k]=Object.assign({},c[k]||{});var cur=c[k][uid];if(cur==="SW")c[k][uid]="NO"; // force NOT sw
    else if(cur==="NO")delete c[k][uid]; // back to default
    else c[k][uid]="SW"; // force SW
    return c;});};

  var u=users.find(function(x){return x.id===sel;});
  return(<div>
    <h3 style={{fontSize:14,fontWeight:700,marginBottom:4}}>Indisponibilit{"\u00E0"} {"\u2014"} {MN[mo]} {yr}</h3>
    <p style={{fontSize:11,color:"#64748b",marginBottom:8}}>SW: clicca per forzare/rimuovere. <span style={{color:"#2563eb"}}>{"\u25A0"}</span>=SW fisso <span style={{color:"#f59e0b"}}>{"\u25A0"}</span>=SW forzato <span style={{color:"#d1d5db"}}>{"\u25A0"}</span>=SW rimosso</p>
    <select value={sel} onChange={function(e){sSel(e.target.value);}} style={Object.assign({},cs.inp,{minWidth:220,marginBottom:10})}>
      {sorted.map(function(u2){return(<option key={u2.id} value={u2.id}>{u2.name}{u2.swDay?" (SW fisso: "+WDS.find(function(w){return w.n===u2.swDay;}).l+")":""}</option>);})}</select>
    {sel&&u&&<div style={{overflowX:"auto",marginBottom:16}}>
      <table style={{borderCollapse:"collapse"}}><thead><tr><th style={cs.h}>Giorno</th><th style={Object.assign({},cs.h,{width:55})}>SW</th>{["FER","EST"].map(function(c){return(<th key={c} style={Object.assign({},cs.h,{width:55})}>{c}</th>);})}</tr></thead>
        <tbody>{wd.map(function(d){var k=dk(yr,mo,d);var dow=jd(yr,mo,d);
          if(!u.wd.includes(dow))return(<tr key={d} style={{background:"#f8f8f8"}}><td style={Object.assign({},cs.c,{color:"#bbb"})}>{dn(yr,mo,d)} {d}</td><td colSpan={3} style={Object.assign({},cs.c,{color:"#bbb",textAlign:"center"})}>non lavora</td></tr>);
          var swOv=swExc[k]&&swExc[k][sel];
          var isSW=(swOv==="SW")||(swOv!=="NO"&&u.swDay===dow);
          var swColor=swOv==="SW"?"#f59e0b":swOv==="NO"?"#d1d5db":(u.swDay===dow?"#2563eb":"transparent");
          if(isSW)return(<tr key={d} style={{background:"#eff6ff"}}><td style={Object.assign({},cs.c,{fontWeight:600})}>{dn(yr,mo,d)} {d}</td>
            <td style={Object.assign({},cs.c,{textAlign:"center",cursor:"pointer",background:swColor+"30"})} onClick={function(){togSW(sel,d);}}><span style={{color:swColor,fontWeight:700}}>SW</span></td>
            <td colSpan={2} style={Object.assign({},cs.c,{color:"#94a3b8",textAlign:"center"})}>in SW</td></tr>);
          var codes=(exc[k]&&exc[k][sel])||[];
          return(<tr key={d}><td style={Object.assign({},cs.c,{fontWeight:600})}>{dn(yr,mo,d)} {d}</td>
            <td style={Object.assign({},cs.c,{textAlign:"center",cursor:"pointer",background:swColor+"30"})} onClick={function(){togSW(sel,d);}}>
              {swOv==="NO"?<span style={{color:"#d1d5db",fontSize:10}}>no</span>:<span style={{color:"#94a3b8",fontSize:10}}>{"\u2014"}</span>}
            </td>
            {["FER","EST"].map(function(c){return(<td key={c} style={Object.assign({},cs.c,{textAlign:"center"})}><input type="checkbox" checked={codes.includes(c)} onChange={function(){togE(sel,d,c);}}/></td>);})}</tr>);})}</tbody></table>
    </div>}
    <h3 style={{fontSize:14,fontWeight:700,marginTop:12,marginBottom:6}}>Panoramica</h3>
    <div style={{overflowX:"auto"}}><table style={{borderCollapse:"collapse",fontSize:10}}><thead><tr>
      <th style={Object.assign({},cs.h,{fontSize:10,textAlign:"left"})}>Utente</th>
      {wd.map(function(d){return(<th key={d} style={Object.assign({},cs.h,{padding:"2px",minWidth:22,fontSize:9})}>{d}</th>);})}</tr></thead>
      <tbody>{sorted.map(function(u2){return(<tr key={u2.id}>
        <td style={Object.assign({},cs.c,{fontWeight:500,whiteSpace:"nowrap",fontSize:10})}>{sn[u2.id]}</td>
        {wd.map(function(d){var k=dk(yr,mo,d);var codes=(eInd[k]&&eInd[k][u2.id])||[];
          var txt=codes.join(",").replace("N/D","\u2022");
          var bg2=codes.includes("N/D")?"#f1f5f9":codes.includes("SW")?"#dbeafe":codes.includes("FER")?"#fef3c7":codes.includes("EST")?"#d1fae5":"#fff";
          return(<td key={d} style={Object.assign({},cs.c,{textAlign:"center",background:bg2,fontSize:8,padding:"1px"})}>{txt}</td>);})}</tr>);})}</tbody></table></div>
  </div>);
}

/* ═══════════ UTENTI ═══════════ */
function VUt(p){
  var users=p.users,sU=p.sU,sn=p.sn,sM=p.sM;
  var[nn,sNN]=useState("");var[nml,sNML]=useState(false);var[nct,sNCT]=useState("STR");
  var add=function(){var t=nn.trim();if(!t)return;sU(function(prev){return prev.concat([mU(t,nml,nct,false,false,[1,2,3,4,5],null,false)]);});sNN("");};
  var rm=function(id){sM({title:"Rimuovi",msg:"Confermi?",onOk:function(){sU(function(prev){return prev.filter(function(u){return u.id!==id;});});sM(null);}});};
  var tog=function(id,f){sU(function(prev){return prev.map(function(u){if(u.id!==id)return u;var o=Object.assign({},u);o[f]=!o[f];return o;});});};
  var togWD2=function(id,day){sU(function(prev){return prev.map(function(u){if(u.id!==id)return u;var w=u.wd.slice();var ix=w.indexOf(day);if(ix>=0)w.splice(ix,1);else{w.push(day);w.sort();}return Object.assign({},u,{wd:w});});});};
  var setSW=function(id,val){sU(function(prev){return prev.map(function(u){if(u.id!==id)return u;return Object.assign({},u,{swDay:val===""?null:parseInt(val,10)});});});};
  var sorted=useMemo(function(){return users.slice().sort(function(a,b){return a.name.localeCompare(b.name);});},[users]);
  return(<div>
    <h3 style={{fontSize:14,fontWeight:700,marginBottom:10}}>Utenti ({users.length})</h3>
    <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
      <input value={nn} onChange={function(e){sNN(e.target.value);}} placeholder="Cognome Nome" onKeyDown={function(e){if(e.key==="Enter")add();}} style={Object.assign({},cs.inp,{width:180})}/>
      <label style={{fontSize:12,display:"flex",alignItems:"center",gap:3}}><input type="checkbox" checked={nml} onChange={function(e){sNML(e.target.checked);}}/> ML</label>
      <select value={nct} onChange={function(e){sNCT(e.target.value);}} style={cs.inp}><option value="STR">STR</option><option value="ACN">ACN</option></select>
      <button onClick={add} style={cs.bp}>Aggiungi</button></div>
    <div style={{overflowX:"auto"}}><table style={{borderCollapse:"collapse",width:"100%"}}>
      <thead><tr>{["Nome","Sigla","ML","Ct","222","Ci"].map(function(h,i){return(<th key={i} style={cs.h}>{h}</th>);})}
        {WDS.map(function(w){return(<th key={w.n} style={Object.assign({},cs.h,{width:30})}>{w.l}</th>);})}
        <th style={Object.assign({},cs.h,{width:50})}>SW</th><th style={cs.h}></th></tr></thead>
      <tbody>{sorted.map(function(u){return(<tr key={u.id} style={{background:u.vo?"#fefce8":"transparent"}}>
        <td style={cs.c}>{u.name}{u.vo&&<span style={{marginLeft:4,fontSize:9,color:"#ca8a04"}}>(VDOM)</span>}</td>
        <td style={Object.assign({},cs.c,{fontWeight:600})}>{sn[u.id]}</td>
        <td style={Object.assign({},cs.c,{textAlign:"center"})}>{u.ml&&<span style={{color:"#059669",fontWeight:700,fontSize:11}}>ML</span>}</td>
        <td style={cs.c}><span style={{fontSize:10,padding:"1px 5px",borderRadius:4,background:u.ct==="ACN"?"#dbeafe":"#f1f5f9",color:u.ct==="ACN"?"#1e40af":"#475569"}}>{u.ct}</span></td>
        <td style={Object.assign({},cs.c,{textAlign:"center"})}><input type="checkbox" checked={u.e222} onChange={function(){tog(u.id,"e222");}}/></td>
        <td style={Object.assign({},cs.c,{textAlign:"center"})}><input type="checkbox" checked={u.eCi} onChange={function(){tog(u.id,"eCi");}}/></td>
        {WDS.map(function(w){var on=u.wd.includes(w.n);return(<td key={w.n} style={Object.assign({},cs.c,{textAlign:"center",background:on?"#d1fae5":"#fee2e2"})}><input type="checkbox" checked={on} onChange={function(){togWD2(u.id,w.n);}}/></td>);})}
        <td style={Object.assign({},cs.c,{textAlign:"center"})}>{!u.vo?<select value={u.swDay===null?"":String(u.swDay)} onChange={function(e){setSW(u.id,e.target.value);}} style={Object.assign({},cs.inp,{fontSize:10,padding:"1px",width:50})}><option value="">--</option>{WDS.map(function(w){return(<option key={w.n} value={String(w.n)}>{w.l}</option>);})}</select>:<span style={{fontSize:10,color:"#94a3b8"}}>--</span>}</td>
        <td style={Object.assign({},cs.c,{textAlign:"center"})}><button onClick={function(){rm(u.id);}} style={{background:"none",border:"none",color:"#ef4444",cursor:"pointer",fontSize:14,fontWeight:700}}>{"\u2715"}</button></td>
      </tr>);})}</tbody></table></div></div>);
}

/* ═══════════ REGOLE ═══════════ */
function VReg(p){var users=p.users,sU=p.sU;var sorted=useMemo(function(){return users.filter(function(u){return !u.vo;}).sort(function(a,b){return a.name.localeCompare(b.name);});},[users]);var[sel,sSel]=useState("");useEffect(function(){if(!sel&&sorted.length)sSel(sorted[0].id);},[sorted,sel]);var user=users.find(function(u){return u.id===sel;});var upd=function(code,field,val){sU(function(prev){return prev.map(function(u){if(u.id!==sel)return u;var as=Object.assign({},u.as);as[code]=Object.assign({},as[code]);as[code][field]=val;return Object.assign({},u,{as:as});});});};
  var WO=[{v:0,l:"0\u2014evita"},{v:1,l:"1\u2014neutro"},{v:2,l:"2\u2014pref."},{v:3,l:"3\u2014forte"}];
  return(<div><h3 style={{fontSize:14,fontWeight:700,marginBottom:10}}>Regole</h3>
    <select value={sel} onChange={function(e){sSel(e.target.value);}} style={Object.assign({},cs.inp,{minWidth:220,marginBottom:12})}>{sorted.map(function(u){return(<option key={u.id} value={u.id}>{u.name}</option>);})}</select>
    {user&&<div style={{overflowX:"auto"}}><table style={{borderCollapse:"collapse"}}><thead><tr><th style={cs.h}>Att.</th><th style={cs.h}>Abil.</th><th style={cs.h}>Peso</th></tr></thead>
      <tbody>{OPA.map(function(a){var r=user.as[a.code]||{al:true,w:1};return(<tr key={a.code}><td style={cs.c}><span style={tg(a.code)}>{a.code}</span> <span style={{fontSize:11,color:"#64748b"}}>{a.label}</span></td>
        <td style={Object.assign({},cs.c,{textAlign:"center"})}><input type="checkbox" checked={r.al} onChange={function(e){upd(a.code,"al",e.target.checked);}}/></td>
        <td style={Object.assign({},cs.c,{textAlign:"center"})}><select value={r.w} onChange={function(e){upd(a.code,"w",parseInt(e.target.value,10));}} style={Object.assign({},cs.inp,{width:90,fontSize:11})}>{WO.map(function(w){return(<option key={w.v} value={w.v}>{w.l}</option>);})}</select></td></tr>);})}</tbody></table></div>}</div>);
}

/* ═══════════ VINCOLI ═══════════ */
function VVinc(p){var users=p.users,sn=p.sn,inc=p.inc,sInc=p.sInc,dR=p.dR,sDR=p.sDR,sM=p.sM;
  var sorted=useMemo(function(){return users.filter(function(u){return !u.vo;}).sort(function(a,b){return a.name.localeCompare(b.name);});},[users]);
  var[ua,sUA]=useState("");var[ub,sUB]=useState("");
  var addI=function(){if(!ua||!ub||ua===ub)return;if(inc.some(function(pp){return(pp[0]===ua&&pp[1]===ub)||(pp[0]===ub&&pp[1]===ua);}))return;sInc(function(prev){return prev.concat([[ua,ub]]);});sUA("");sUB("");};
  var rmI=function(i){sM({title:"Rimuovi",msg:"Confermi?",onOk:function(){sInc(function(prev){return prev.filter(function(_,j){return j!==i;});});sM(null);}});};
  var[dU,sDU]=useState("");var[dD,sDD]=useState("2");
  var togDR2=function(uid,dow,ac){sDR(function(prev){var u=Object.assign({},prev[uid]||{});var a=u[dow]?u[dow].slice():[];var ix=a.indexOf(ac);if(ix>=0)a.splice(ix,1);else a.push(ac);if(a.length)u[dow]=a;else delete u[dow];var o=Object.assign({},prev);if(Object.keys(u).length)o[uid]=u;else delete o[uid];return o;});};
  var rmDR2=function(uid,dow){sDR(function(prev){var u=Object.assign({},prev[uid]||{});delete u[dow];var o=Object.assign({},prev);if(Object.keys(u).length)o[uid]=u;else delete o[uid];return o;});};
  var allDR=useMemo(function(){var l=[];Object.entries(dR||{}).forEach(function(e){if(!e[1])return;Object.entries(e[1]).forEach(function(de){if(de[1]&&de[1].length)l.push({uid:e[0],dow:de[0],codes:de[1]});});});return l;},[dR]);
  var WN={"1":"Lun","2":"Mar","3":"Mer","4":"Gio","5":"Ven"};
  return(<div>
    <h3 style={{fontSize:14,fontWeight:700,marginBottom:6}}>Incompatibilit{"\u00E0"}</h3>
    <div style={{display:"flex",gap:6,marginBottom:12,flexWrap:"wrap",alignItems:"center"}}>
      <select value={ua} onChange={function(e){sUA(e.target.value);}} style={Object.assign({},cs.inp,{minWidth:160})}><option value="">A</option>{sorted.map(function(u){return(<option key={u.id} value={u.id}>{u.name}</option>);})}</select>
      <span style={{color:"#94a3b8"}}>{"\u2260"}</span>
      <select value={ub} onChange={function(e){sUB(e.target.value);}} style={Object.assign({},cs.inp,{minWidth:160})}><option value="">B</option>{sorted.filter(function(u){return u.id!==ua;}).map(function(u){return(<option key={u.id} value={u.id}>{u.name}</option>);})}</select>
      <button onClick={addI} style={cs.bp} disabled={!ua||!ub||ua===ub}>Aggiungi</button></div>
    {inc.length>0&&<table style={{borderCollapse:"collapse",maxWidth:500,marginBottom:16}}><tbody>{inc.map(function(pp,i){return(<tr key={i}><td style={Object.assign({},cs.c,{fontWeight:500})}>{sn[pp[0]]||pp[0]}</td><td style={Object.assign({},cs.c,{fontWeight:500})}>{sn[pp[1]]||pp[1]}</td><td style={cs.c}><button onClick={function(){rmI(i);}} style={{background:"none",border:"none",color:"#ef4444",cursor:"pointer",fontWeight:700}}>{"\u2715"}</button></td></tr>);})}</tbody></table>}
    <h3 style={{fontSize:14,fontWeight:700,marginTop:20,marginBottom:6}}>Restrizioni giorno</h3>
    <div style={{display:"flex",gap:6,marginBottom:8,flexWrap:"wrap",alignItems:"center"}}>
      <select value={dU} onChange={function(e){sDU(e.target.value);}} style={Object.assign({},cs.inp,{minWidth:160})}><option value="">Utente</option>{sorted.map(function(u){return(<option key={u.id} value={u.id}>{u.name}</option>);})}</select>
      <select value={dD} onChange={function(e){sDD(e.target.value);}} style={cs.inp}>{WDS.map(function(w){return(<option key={w.n} value={String(w.n)}>{w.l}</option>);})}</select></div>
    {dU&&<div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:12}}>{OPA.map(function(a){var codes=(dR[dU]||{})[dD]||[];var on=codes.includes(a.code);return(<button key={a.code} onClick={function(){togDR2(dU,dD,a.code);}} style={Object.assign({},tg(a.code),{cursor:"pointer",opacity:on?1:0.3,outline:on?"2px solid #1e40af":"none",outlineOffset:1})}>{a.code}</button>);})}</div>}
    {allDR.length>0&&<table style={{borderCollapse:"collapse",maxWidth:550}}><tbody>{allDR.map(function(r,i){return(<tr key={i}><td style={Object.assign({},cs.c,{fontWeight:500})}>{sn[r.uid]||r.uid}</td><td style={cs.c}>{WN[r.dow]}</td><td style={cs.c}>{r.codes.map(function(c){return(<span key={c} style={Object.assign({},tg(c),{marginRight:2})}>{c}</span>);})}</td><td style={cs.c}><button onClick={function(){rmDR2(r.uid,r.dow);}} style={{background:"none",border:"none",color:"#ef4444",cursor:"pointer",fontWeight:700}}>{"\u2715"}</button></td></tr>);})}</tbody></table>}
  </div>);
}

/* ═══════════ RIEPILOGO ═══════════ */
function VRiep(p){var yr=p.yr,mo=p.mo,nd=p.nd,users=p.users,sn=p.sn,asg=p.asg,eInd=p.eInd,notes=p.notes,sNt=p.sNt;
  var stats=useMemo(function(){var r={};users.forEach(function(u){r[u.id]={t:0,sw:0,fer:0,est:0,ba:{}};DISP.forEach(function(c){r[u.id].ba[c]=0;});});
    for(var d=1;d<=nd;d++){var k=dk(yr,mo,d);var da=asg[k]||{};Object.entries(da).forEach(function(e){if(!Array.isArray(e[1]))return;e[1].forEach(function(uid){if(!r[uid])return;r[uid].t++;r[uid].ba[e[0]]=(r[uid].ba[e[0]]||0)+1;});});
      var di=eInd[k]||{};Object.entries(di).forEach(function(e){if(!r[e[0]]||!Array.isArray(e[1]))return;e[1].forEach(function(c){if(c==="SW")r[e[0]].sw++;else if(c==="FER")r[e[0]].fer++;else if(c==="EST")r[e[0]].est++;});});}return r;},[users,asg,eInd,yr,mo,nd]);
  var sorted=useMemo(function(){return users.slice().sort(function(a,b){return a.name.localeCompare(b.name);});},[users]);
  return(<div><h3 style={{fontSize:14,fontWeight:700,marginBottom:10}}>Riepilogo {"\u2014"} {MN[mo]} {yr}</h3>
    <div style={{overflowX:"auto",marginBottom:16}}><table style={{borderCollapse:"collapse",width:"100%"}}><thead><tr>
      <th style={cs.h}>Utente</th><th style={cs.h}>Tot</th>
      {DISP.map(function(c){var cl=COL[c];return(<th key={c} style={Object.assign({},cs.h,{fontSize:9,background:cl?cl.bg:"#f8fafc",color:cl?cl.tx:"#334155"})}>{c}</th>);})}
      <th style={cs.h}>SW</th><th style={cs.h}>FER</th><th style={cs.h}>EST</th></tr></thead>
      <tbody>{sorted.map(function(u){var s=stats[u.id]||{t:0,sw:0,fer:0,est:0,ba:{}};return(<tr key={u.id}>
        <td style={Object.assign({},cs.c,{fontWeight:500,whiteSpace:"nowrap"})}>{sn[u.id]}</td>
        <td style={Object.assign({},cs.c,{textAlign:"center",fontWeight:700})}>{s.t}</td>
        {DISP.map(function(c){return(<td key={c} style={Object.assign({},cs.c,{textAlign:"center",fontSize:10})}>{s.ba[c]||""}</td>);})}
        <td style={Object.assign({},cs.c,{textAlign:"center"})}>{s.sw||""}</td>
        <td style={Object.assign({},cs.c,{textAlign:"center"})}>{s.fer||""}</td>
        <td style={Object.assign({},cs.c,{textAlign:"center"})}>{s.est||""}</td></tr>);})}</tbody></table></div>
    <h3 style={{fontSize:14,fontWeight:700,marginBottom:6}}>Note</h3>
    <textarea value={notes} onChange={function(e){sNt(e.target.value);}} placeholder="Note..." style={Object.assign({},cs.inp,{width:"100%",minHeight:80,resize:"vertical",fontFamily:"inherit",lineHeight:1.5})}/>
  </div>);
}
