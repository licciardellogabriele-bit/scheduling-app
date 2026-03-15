import { useState, useEffect, useCallback, useMemo, useRef } from "react";

/* ═══════════════════════ ACTIVITIES ═══════════════════════ */
var ACTIVITIES = [
  {code:"CIC",   label:"CIC",             defPairs:2, category:"commissione", alloc:"fixed",  order:1, paired:true},
  {code:"222",   label:"222",             defPairs:2, category:"pc",          alloc:"fixed",  order:2, paired:false},
  {code:"VD",    label:"Visite Dirette",  defPairs:1, category:"commissione", alloc:"fixed",  order:3, paired:true},
  {code:"NICSP", label:"NIC sperimentale",defPairs:1, category:"commissione", alloc:"fixed",  order:4, paired:true},
  {code:"CIECHI",label:"Ciechi",          defPairs:1, category:"commissione", alloc:"fixed",  order:5, paired:true},
  {code:"NICMIN",label:"NIC minori",      defPairs:1, category:"commissione", alloc:"fixed",  order:6, paired:true},
  {code:"NIC",   label:"NIC",             defPairs:3, category:"commissione", alloc:"nic",    order:7, paired:true},
  {code:"VDOM",  label:"V. Domiciliari",  defPairs:0, category:"commissione", alloc:"pre",    order:50,paired:true},
  {code:"PU",    label:"Prest.Universale",defPairs:0, category:"pc",          alloc:"pre",    order:51,paired:true},
  {code:"VALID", label:"VALIDAZIONI",     defPairs:0, category:"pc",          alloc:"dyn",    order:80,paired:false},
  {code:"ASP",   label:"ASP",             defPairs:0, category:"commissione", alloc:"dyn",    order:81,paired:false},
  {code:"EST",   label:"Att. Esterna",    defPairs:0, category:"stato",       alloc:"none",   order:99,paired:false},
  {code:"SW",    label:"Smart Working",   defPairs:0, category:"stato",       alloc:"none",   order:99,paired:false},
  {code:"FER",   label:"Ferie",           defPairs:0, category:"stato",       alloc:"none",   order:99,paired:false},
];
var OP_ACT=ACTIVITIES.filter(function(a){return a.category!=="stato";});
var DISP=["CIC","NIC","NICSP","VD","VDOM","PU","NICMIN","CIECHI","ASP","VALID","222"];
var OP_DISP=DISP.map(function(c){return ACTIVITIES.find(function(a){return a.code===c;});}).filter(Boolean);
var STAT=["SW","FER","EST"];
var SCHED=OP_ACT.map(function(a){return a.code;});
var WD=[{n:1,l:"Lun"},{n:2,l:"Mar"},{n:3,l:"Mer"},{n:4,l:"Gio"},{n:5,l:"Ven"}];
var FIXED=ACTIVITIES.filter(function(a){return a.alloc==="fixed";}).sort(function(a,b){return a.order-b.order;});

var COL={CIC:{bg:"#fef3c7",tx:"#92400e",bd:"#fcd34d"},NIC:{bg:"#e0e7ff",tx:"#3730a3",bd:"#a5b4fc"},NICSP:{bg:"#e0f2fe",tx:"#075985",bd:"#7dd3fc"},NICMIN:{bg:"#ddd6fe",tx:"#6d28d9",bd:"#a78bfa"},VD:{bg:"#d1fae5",tx:"#065f46",bd:"#6ee7b7"},VDOM:{bg:"#a7f3d0",tx:"#064e3b",bd:"#34d399"},PU:{bg:"#fef9c3",tx:"#854d0e",bd:"#fde047"},VALID:{bg:"#fce7f3",tx:"#9d174d",bd:"#f9a8d4"},222:{bg:"#ede9fe",tx:"#5b21b6",bd:"#c4b5fd"},ASP:{bg:"#cffafe",tx:"#155e75",bd:"#67e8f9"},CIECHI:{bg:"#ffe4e6",tx:"#9f1239",bd:"#fda4af"}};

var VDOM_PAIRS=[["Costa Manuela","Arcifa Veronica"],["Ligreggi Antonella","Scifo Nicole"],["Liuzzo Ludovico","Grieco Angela"],["Di Paola Danila","Iosia Serena"],["Palmeri Andrea","Tumino Mariagrazia"]];

/* ═══════════════════════ USERS ═══════════════════════ */
// [name, ML, contract, e222, presCiechi, workDays, swDay(1-5 or null), vdomOnly]
var DU=[
["Arcifa Veronica",true,"STR",false,true,[1,2,3,4,5],null,false],
["Alberio Anna",false,"ACN",false,false,[1,3,4,5],null,false],
["Bonfiglio Claudia",true,"STR",true,true,[1,2,3,4,5],4,false],
["Calabrese Giorgia",false,"STR",false,false,[1,2,3,4,5],null,false],
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
["Monaco Lucia",true,"ACN",false,false,[3,4,5],null,false],
["Munciv\u00EC Marina",true,"ACN",false,false,[1,2,3,4],null,false],
["Palmeri Andrea",true,"STR",true,false,[1,2,3,4,5],2,false],
["Russo Ilenia",true,"ACN",false,false,[2,3,4,5],null,false],
["Scifo Nicole",false,"STR",false,false,[1,2,3,4,5],null,true],
["Sofia Salvatore",false,"STR",false,false,[1,2,3,4,5],null,false],
["Sollima Giovanni",false,"ACN",false,false,[1,2,4],null,false],
["Spina Anna",true,"STR",true,false,[1,2,3,4,5],2,false],
["Tumino Mariagrazia",true,"STR",false,false,[1,2,3,4,5],null,true],
["Valenti Giuseppe",false,"STR",false,false,[1,2,3,4,5],null,false],
["Valenti Vincenzo",true,"ACN",true,false,[1,2,4],null,false],
];

var MN=["Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno","Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"];

/* ═══════════════════════ HELPERS ═══════════════════════ */
var CPX=["Di","Lo","La","De","Del","Della","Degli","Dei","Delle","Dal"];
function parseSur(f){var p=f.trim().split(/\s+/);if(p.length<=1)return{s:f,f:""};if(p[0].endsWith("'")||p[0].endsWith("\u2019"))return{s:p.slice(0,2).join(" "),f:p.slice(2).join(" ")};if(CPX.includes(p[0])&&p.length>2)return{s:p.slice(0,2).join(" "),f:p.slice(2).join(" ")};return{s:p[0],f:p.slice(1).join(" ")};}
function sNames(users){var ps=users.map(function(u){return Object.assign({id:u.id},parseSur(u.name));});var cnt={};ps.forEach(function(p){cnt[p.s]=(cnt[p.s]||0)+1;});var r={};ps.forEach(function(p){r[p.id]=cnt[p.s]>1&&p.f?(p.s+" "+p.f[0]+"."):p.s;});return r;}
function dk(y,m,d){return y+"-"+String(m+1).padStart(2,"0")+"-"+String(d).padStart(2,"0");}
function nDays(y,m){return new Date(y,m+1,0).getDate();}
function isWE(y,m,d){var w=new Date(y,m,d).getDay();return w===0||w===6;}
function jd(y,m,d){return new Date(y,m,d).getDay();}
function dn(y,m,d){return["Dom","Lun","Mar","Mer","Gio","Ven","Sab"][jd(y,m,d)];}
function easterMon(y){var a=y%19,b=Math.floor(y/100),c=y%100,d2=Math.floor(b/4),e=b%4,f=Math.floor((b+8)/25),g=Math.floor((b-f+1)/3),h=(19*a+b-d2-g+15)%30,i=Math.floor(c/4),k=c%4,l=(32+2*e+2*i-h-k)%7,m2=Math.floor((a+11*h+22*l)/451),mo=Math.floor((h+l-7*m2+114)/31),da=((h+l-7*m2+114)%31)+1;return new Date(new Date(y,mo-1,da).getTime()+864e5);}
function isHol(y,m,d){var mm=m+1;if(mm===1&&d===1)return"Capodanno";if(mm===1&&d===6)return"Epifania";if(mm===2&&d===5)return"Sant'Agata";if(mm===4&&d===25)return"Liberazione";if(mm===5&&d===1)return"Festa Lavoro";if(mm===6&&d===2)return"Repubblica";if(mm===8&&d===15)return"Ferragosto";if(mm===11&&d===1)return"Ognissanti";if(mm===12&&d===8)return"Immacolata";if(mm===12&&d===25)return"Natale";if(mm===12&&d===26)return"S.Stefano";var em=easterMon(y);if(em.getMonth()===m&&em.getDate()===d)return"Pasquetta";return null;}
function isOff(y,m,d){return isWE(y,m,d)||!!isHol(y,m,d);}

function mkAS(vo){var s={};ACTIVITIES.forEach(function(a){s[a.code]=vo?{al:false,w:0}:{al:a.code!=="222"&&a.code!=="VDOM"&&a.code!=="PU",w:1};});return s;}
function mkU(nm,ml,ct,e2,ec,wd,sw,vo,id){return{id:id||("u"+Date.now()+"_"+Math.random().toString(36).slice(2,8)),name:nm,ml:ml,ct:ct,e222:e2,eCi:ec,wd:wd||[1,2,3,4,5],swDay:sw,vo:!!vo,notes:"",as:mkAS(vo)};}
function mkDU(){
  var NP=["Milana Maria Chiara","Calabrese Giorgia"];
  var CP=["Licciardello Gabriele","Russo Ilenia","Sofia Salvatore"];
  return DU.map(function(r,i){
    var u=mkU(r[0],r[1],r[2],r[3],r[4],r[5],r[6],r[7],"d"+i);
    if(NP.includes(u.name))u.as.NICMIN={al:true,w:3};
    if(CP.includes(u.name))u.as.CIECHI={al:true,w:3};
    // Arcifa: solo VDOM e CIECHI
    if(u.name==="Arcifa Veronica"){
      ACTIVITIES.forEach(function(a){
        if(a.code==="CIECHI"||a.code==="VDOM")u.as[a.code]={al:true,w:1};
        else u.as[a.code]={al:false,w:0};
      });
    }
    return u;
  });
}
function mkDS(){var s={};ACTIVITIES.forEach(function(a){s[a.code]=a.defPairs;});return s;}

/* ═══════════════════════ INDISPO ═══════════════════════ */
function buildInd(yr,mo,users,exc){
  var nd=nDays(yr,mo),r={};
  for(var d=1;d<=nd;d++){
    if(isOff(yr,mo,d))continue;
    var k=dk(yr,mo,d),dow=jd(yr,mo,d);
    r[k]={};
    users.forEach(function(u){
      if(u.vo)return;
      if(!u.wd.includes(dow)){r[k][u.id]=["N/D"];return;}
      if(u.swDay===dow){r[k][u.id]=["SW"];return;}
      var e=exc[k]&&exc[k][u.id];
      if(Array.isArray(e)&&e.length)r[k][u.id]=e;
    });
  }
  return r;
}

/* ═══════════════════════ STORAGE ═══════════════════════ */
var SK="cml-v8";
async function sLoad(){try{var raw=localStorage.getItem(SK);if(raw)return JSON.parse(raw);}catch(e){console.warn("load err",e);}return null;}
async function sSave(st){try{localStorage.setItem(SK,JSON.stringify(st));}catch(e){console.warn("save err",e);}}

/* ═══════════════════════ SANITIZE ═══════════════════════ */
function sanU(r){if(!Array.isArray(r)||!r.length)return null;return r.map(function(u){if(!u||!u.id||!u.name)return null;var b=mkAS(u.vo);var as=(u.as&&typeof u.as==="object")?Object.assign({},b,u.as):b;return{id:u.id,name:String(u.name),ml:!!u.ml,ct:u.ct||"STR",e222:!!u.e222,eCi:!!u.eCi,wd:Array.isArray(u.wd)?u.wd:[1,2,3,4,5],swDay:typeof u.swDay==="number"?u.swDay:null,vo:!!u.vo,notes:u.notes||"",as:as};}).filter(Boolean);}
function sanO(r){return(r&&typeof r==="object"&&!Array.isArray(r))?r:{};}
function sanA(r){return Array.isArray(r)?r:[];}
function sanS(r){if(!r||typeof r!=="object")return mkDS();var d=mkDS();Object.keys(d).forEach(function(k){if(typeof r[k]==="number")d[k]=r[k];});return d;}

/* ═══════════════════════ ENGINE ═══════════════════════ */
function shuf(a){var r=a.slice();for(var i=r.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=r[i];r[i]=r[j];r[j]=t;}return r;}

function gen(year,month,users,gS,dayOv,eInd,inc,dRestr){
  var nd=nDays(year,month),out={};
  var norm=users.filter(function(u){return !u.vo;});
  var tL={},aC={},fC={};
  norm.forEach(function(u){tL[u.id]=0;aC[u.id]={};fC[u.id]={};SCHED.forEach(function(c){aC[u.id][c]=0;fC[u.id][c]=0;});});

  var iM=new Map();
  (inc||[]).forEach(function(p){if(!p||p.length<2)return;if(!iM.has(p[0]))iM.set(p[0],new Set());if(!iM.has(p[1]))iM.set(p[1],new Set());iM.get(p[0]).add(p[1]);iM.get(p[1]).add(p[0]);});
  var dM=new Map();
  if(dRestr)Object.entries(dRestr).forEach(function(e){var uid=e[0],days=e[1];if(!days)return;var m={};Object.entries(days).forEach(function(de){if(Array.isArray(de[1])&&de[1].length)m[de[0]]=new Set(de[1]);});if(Object.keys(m).length)dM.set(uid,m);});

  var wdAll=[];for(var dd=1;dd<=nd;dd++){if(!isOff(year,month,dd))wdAll.push(dd);}
  var noFri=wdAll.filter(function(d){return jd(year,month,d)!==5;});

  // Pre-schedule VDOM
  var vdSch={},vdUsed=new Set();
  var sp=Math.max(1,Math.floor(noFri.length/VDOM_PAIRS.length));
  VDOM_PAIRS.forEach(function(pair,pi){
    var uA=users.find(function(u){return u.name===pair[0];});
    var uB=users.find(function(u){return u.name===pair[1];});
    if(!uA||!uB)return;
    for(var at=0;at<noFri.length;at++){
      var idx=(pi*sp+at)%noFri.length;var d=noFri[idx];var k=dk(year,month,d);var dow=jd(year,month,d);
      if(vdUsed.has(d))continue;
      var aOk=uA.wd.includes(dow)&&uA.swDay!==dow&&!(eInd[k]&&eInd[k][uA.id]);
      var bOk=uB.wd.includes(dow)&&uB.swDay!==dow&&!(eInd[k]&&eInd[k][uB.id]);
      if(aOk&&bOk){if(!vdSch[k])vdSch[k]=[];vdSch[k].push([uA.id,uB.id]);vdUsed.add(d);break;}
    }
  });

  // Pre-schedule PU
  var puSch={};
  var pA=users.find(function(u){return u.name==="Palmeri Andrea";});
  var pB=users.find(function(u){return u.name==="Di Paola Danila";});
  if(pA&&pB){
    var half=Math.floor(wdAll.length/2);
    [wdAll.slice(0,half),wdAll.slice(half)].forEach(function(h){
      for(var hi=0;hi<h.length;hi++){
        var d=h[hi];var k=dk(year,month,d);var dow=jd(year,month,d);
        var aO=pA.wd.includes(dow)&&pA.swDay!==dow&&!(eInd[k]&&eInd[k][pA.id]);
        var bO=pB.wd.includes(dow)&&pB.swDay!==dow&&!(eInd[k]&&eInd[k][pB.id]);
        var nv=!vdSch[k]||!vdSch[k].some(function(p){return p.includes(pA.id)||p.includes(pB.id);});
        if(aO&&bO&&nv){puSch[k]=[pA.id,pB.id];break;}
      }
    });
  }

  // Daily
  for(var d=1;d<=nd;d++){
    var k=dk(year,month,d);
    if(isOff(year,month,d)){out[k]={};continue;}
    out[k]={};var dow=jd(year,month,d);
    var un=new Set();var dI=eInd[k]||{};
    Object.entries(dI).forEach(function(e){if(Array.isArray(e[1])&&e[1].length)un.add(e[0]);});
    var dU=new Set(),dA=new Set();

    // Pre-sched
    if(vdSch[k]){var vp=[];vdSch[k].forEach(function(p){p.forEach(function(uid){vp.push(uid);dU.add(uid);dA.add(uid);});});out[k].VDOM=vp;}else{out[k].VDOM=[];}
    if(puSch[k]){out[k].PU=puSch[k].slice();puSch[k].forEach(function(uid){dU.add(uid);dA.add(uid);});}else{out[k].PU=[];}

    function pk(pool,ac,mlP){
      return shuf(pool).sort(function(a,b){
        var wa=(a.as[ac]&&a.as[ac].w)||1,wb=(b.as[ac]&&b.as[ac].w)||1;
        if(wb!==wa)return wb-wa;
        if(mlP){if(a.ml&&!b.ml)return-1;if(!a.ml&&b.ml)return 1;}
        var la=tL[a.id]||0,lb=tL[b.id]||0;if(la!==lb)return la-lb;
        return((aC[a.id]&&aC[a.id][ac])||0)-((aC[b.id]&&aC[b.id][ac])||0);
      })[0]||null;
    }
    function gP(ac,ef){
      return norm.filter(function(u){
        if(un.has(u.id)||dU.has(u.id))return false;
        if(!u.wd.includes(dow))return false;
        if(u.swDay===dow)return false;
        var st=u.as[ac];if(!st||!st.al||st.w===0)return false;
        var en=iM.get(u.id);if(en){for(var a2 of dA){if(en.has(a2))return false;}}
        var dr=dM.get(u.id);if(dr&&dr[String(dow)]&&!dr[String(dow)].has(ac))return false;
        if(ef&&!ef(u))return false;
        return true;
      });
    }
    function aF(uid,ac){dU.add(uid);dA.add(uid);tL[uid]=(tL[uid]||0)+1;aC[uid][ac]=(aC[uid][ac]||0)+1;}

    // Smart pairs: ML+nonML, then ML+ML
    function sPairs(ac,n){
      var res=[];
      for(var i=0;i<n;i++){
        var mlP=gP(ac,function(u){return u.ml;});
        var nonP=gP(ac,function(u){return !u.ml;});
        if(mlP.length&&nonP.length){
          var m=pk(mlP,ac,true);if(!m)break;aF(m.id,ac);
          var nm=pk(gP(ac,function(u){return !u.ml;}),ac,false);if(!nm)break;aF(nm.id,ac);
          res.push(m.id,nm.id);
        } else if(mlP.length>=2){
          var m1=pk(mlP,ac,true);if(!m1)break;aF(m1.id,ac);
          var m2=pk(gP(ac,function(u){return u.ml;}),ac,false);if(!m2)break;aF(m2.id,ac);
          res.push(m1.id,m2.id);
        } else break;
      }
      return res;
    }

    // Fixed activities
    for(var fi=0;fi<FIXED.length;fi++){
      var act=FIXED[fi];var ac=act.code;
      var ov=dayOv[k]&&dayOv[k][ac];
      var en=ov?(ov.enabled!==false):true;
      if((ac==="NICMIN"||ac==="CIECHI")&&!ov)en=false;
      if(!en){out[k][ac]=[];continue;}
      var nP=(ov&&typeof ov.slots==="number")?ov.slots:(gS[ac]!==undefined?gS[ac]:act.defPairs);
      var picked=[];

      if(ac==="CIC"||ac==="VD"){
        picked=sPairs(ac,nP);
      } else if(ac==="NICSP"){
        // ML strutturato preferred + any
        for(var spi=0;spi<nP;spi++){
          var spP=gP(ac,function(u){return u.ml&&u.ct==="STR";});
          if(!spP.length)spP=gP(ac,function(u){return u.ml;});
          if(!spP.length)spP=gP(ac,null);
          var s1=pk(spP,ac,true);if(!s1)break;aF(s1.id,ac);
          var s2=pk(gP(ac,null),ac,false);if(!s2)break;aF(s2.id,ac);
          picked.push(s1.id,s2.id);
        }
      } else if(ac==="NICMIN"){
        var npi=function(u){return u.name==="Milana Maria Chiara"||u.name==="Calabrese Giorgia";};
        for(var ni=0;ni<nP;ni++){
          var npP=gP(ac,npi);if(!npP.length)break;
          var mlP2=gP(ac,function(u){return u.ml;});if(!mlP2.length)mlP2=gP(ac,null);
          var ml2=pk(mlP2,ac,true);if(!ml2)break;aF(ml2.id,ac);
          var np2=pk(gP(ac,npi),ac,false);if(!np2)break;aF(np2.id,ac);
          picked.push(ml2.id,np2.id);
        }
      } else if(ac==="CIECHI"){
        for(var ci=0;ci<nP;ci++){
          var prP=gP(ac,function(u){return u.eCi;});if(!prP.length)prP=gP(ac,null);
          var pr=pk(prP,ac,true);if(!pr)break;aF(pr.id,ac);
          var c2=pk(gP(ac,null),ac,false);if(!c2)break;aF(c2.id,ac);
          picked.push(pr.id,c2.id);
        }
      } else if(ac==="222"){
        for(var ti=0;ti<nP;ti++){
          var tP=gP(ac,function(u){return u.e222;});if(!tP.length)continue;
          var t1=pk(tP,ac,false);if(t1){picked.push(t1.id);aF(t1.id,ac);}
        }
      }
      out[k][ac]=picked;
    }

    // NIC: configured pairs only (no extra — remainder goes to VALID/ASP)
    var nOv=dayOv[k]&&dayOv[k].NIC;
    var nEn=nOv?(nOv.enabled!==false):true;
    if(nEn){
      var nMin=(nOv&&typeof nOv.slots==="number")?nOv.slots:(gS.NIC!==undefined?gS.NIC:3);
      var nicP=sPairs("NIC",nMin);
      out[k].NIC=nicP;
    } else {out[k].NIC=[];}

    // VALID/ASP: remaining placed respecting activity settings
    // Users with VALID/ASP disabled in their profile are excluded (e.g. Arcifa)
    var remaining=norm.filter(function(u){
      if(un.has(u.id)||dU.has(u.id))return false;
      if(!u.wd.includes(dow))return false;
      if(u.swDay===dow)return false;
      return true;
    });
    var vP=[];var aP2=[];
    remaining.forEach(function(u){
      if(u.ct==="STR"){
        var vs=u.as.VALID;
        if(vs&&vs.al===false)return; // respect disabled
        vP.push(u.id);aF(u.id,"VALID");
      } else {
        var ap=u.as.ASP;
        if(ap&&ap.al===false)return;
        aP2.push(u.id);aF(u.id,"ASP");
      }
    });
    out[k].VALID=vP;
    out[k].ASP=aP2;
  }
  return out;
}

/* ═══════════════════════ STYLES ═══════════════════════ */
var PCSS="@media print{.no-print{display:none!important}body{font-size:8pt;margin:4mm;-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important;color-adjust:exact!important}table{border-collapse:collapse;width:100%;page-break-inside:auto}th,td{border:1px solid #bbb;padding:2px 3px;font-size:7pt}tr{page-break-inside:avoid}@page{size:landscape;margin:6mm}}";
var cs={
  c:{padding:"2px 4px",fontSize:11,borderBottom:"1px solid #e2e8f0",verticalAlign:"top",lineHeight:1.3},
  h:{padding:"3px 4px",fontSize:10,fontWeight:700,background:"#f8fafc",borderBottom:"2px solid #cbd5e1",position:"sticky",top:0,zIndex:2,whiteSpace:"nowrap",textAlign:"center"},
  bp:{background:"#1e40af",color:"#fff",border:"none",borderRadius:6,padding:"7px 16px",cursor:"pointer",fontWeight:600,fontSize:13},
  bs:{background:"#fff",color:"#334155",border:"1px solid #cbd5e1",borderRadius:6,padding:"6px 12px",cursor:"pointer",fontSize:13},
  inp:{border:"1px solid #cbd5e1",borderRadius:5,padding:"4px 7px",fontSize:13,outline:"none",background:"#fff"},
};
function tg(c){var o=COL[c];return{display:"inline-block",padding:"1px 6px",borderRadius:4,fontSize:10,fontWeight:600,background:o?o.bg:"#f1f5f9",color:o?o.tx:"#334155",border:"1px solid "+(o?o.bd:"#e2e8f0"),lineHeight:1.6};}

function Modal(p){if(!p.show)return null;return(<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.4)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999}} onClick={function(e){if(e.target===e.currentTarget&&p.onCancel)p.onCancel();}}>
<div style={{background:"#fff",borderRadius:12,padding:"24px 28px",maxWidth:420,width:"90%",boxShadow:"0 8px 32px rgba(0,0,0,.2)"}}>
<div style={{fontWeight:700,fontSize:15,marginBottom:8}}>{p.title}</div>
<div style={{fontSize:13,color:"#475569",marginBottom:20,lineHeight:1.5}}>{p.msg}</div>
<div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>{p.onCancel&&<button onClick={p.onCancel} style={cs.bs}>Annulla</button>}<button onClick={p.onOk} style={cs.bp}>Conferma</button></div>
</div></div>);}

/* ═══════════════════════ EXPORT HTML ═══════════════════════ */
function exportHTML(yr,mo,nd,sn,asg,eInd,dOv){
  var title="Planning "+MN[mo]+" "+yr+" - CML Catania";
  var colH=OP_DISP.map(function(a){var c=COL[a.code];return'<th style="padding:3px 4px;font-size:8pt;font-weight:700;border:1px solid #bbb;text-align:center;background:'+(c?c.bg:"#f8fafc")+';color:'+(c?c.tx:"#334155")+'">'+a.code+'</th>';}).join("");
  var rows="";
  for(var d=1;d<=nd;d++){
    var k=dk(yr,mo,d),we=isWE(yr,mo,d),hol=isHol(yr,mo,d),off=we||!!hol;
    var da=asg[k]||{},di=eInd[k]||{};
    var bg=hol?"#fee2e2":we?"#f1f5f9":(d%2===0?"#fafafc":"#fff");
    var dc=hol?"#dc2626":we?"#94a3b8":"#334155";
    var lbl=dn(yr,mo,d)+" "+d+(hol?" "+hol:"");
    var cells=OP_DISP.map(function(a){
      if(off)return'<td style="border:1px solid #bbb;background:'+bg+'"></td>';
      var ov=dOv[k]&&dOv[k][a.code];var en=ov?(ov.enabled!==false):true;
      if((a.code==="NICMIN"||a.code==="CIECHI")&&!ov)en=false;
      if(!en)return'<td style="border:1px solid #bbb;background:#fafafa;color:#ccc;text-align:center">\u2014</td>';
      var uids=da[a.code]||[];var names=uids.map(function(uid){return sn[uid]||"?";});var c=COL[a.code];
      var inner="";
      if(a.paired&&names.length>=2){
        for(var pi=0;pi<names.length;pi+=2){inner+='<div style="border:1px solid '+(c?c.bd:"#ddd")+';border-radius:3px;padding:1px 3px;margin-bottom:1px;background:'+(c?c.bg:"#fff")+'"><div style="font-weight:700;font-size:7pt;color:'+(c?c.tx:"#333")+'">'+names[pi]+'</div>'+(pi+1<names.length?'<div style="font-size:7pt;color:'+(c?c.tx:"#333")+'">'+names[pi+1]+'</div>':"")+'</div>';}
      } else {names.forEach(function(n){inner+='<div style="font-size:7pt;color:'+(c?c.tx:"#333")+'">'+n+'</div>';});}
      return'<td style="border:1px solid #bbb;padding:2px;background:'+(c?c.bg+"90":"#fff")+';text-align:center;vertical-align:top">'+inner+'</td>';
    }).join("");
    var indT=off?"":Object.entries(di).filter(function(e){return e[1]&&e[1].length;}).map(function(e){return'<b>'+(sn[e[0]]||"?")+'</b> '+e[1].join(",");}).join("<br/>");
    rows+='<tr style="background:'+bg+'"><td style="border:1px solid #bbb;padding:2px 4px;font-weight:600;white-space:nowrap;color:'+dc+';font-size:8pt">'+lbl+'</td>'+cells+'<td style="border:1px solid #bbb;padding:2px;font-size:7pt;color:#64748b;vertical-align:top">'+indT+'</td></tr>';
  }
  var html='<!DOCTYPE html><html><head><meta charset="utf-8"><title>'+title+'</title><style>@page{size:landscape;margin:6mm}body{font-family:Segoe UI,system-ui,sans-serif;margin:6mm;-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}table{border-collapse:collapse;width:100%}</style></head><body><h2 style="text-align:center;margin:0 0 6px;font-size:13pt">'+title+'</h2><table><thead><tr><th style="padding:3px;font-size:8pt;border:1px solid #bbb;text-align:left;background:#f8fafc">Giorno</th>'+colH+'<th style="padding:3px;font-size:8pt;border:1px solid #bbb;text-align:left;background:#f8fafc">Indispo</th></tr></thead><tbody>'+rows+'</tbody></table><p style="margin-top:6px;font-size:8pt;color:#888">Generato il '+new Date().toLocaleDateString("it-IT")+'</p></body></html>';
  var blob=new Blob([html],{type:"text/html;charset=utf-8"});var url=URL.createObjectURL(blob);var a=document.createElement("a");a.href=url;a.download="Planning_"+MN[mo]+"_"+yr+".html";document.body.appendChild(a);a.click();document.body.removeChild(a);setTimeout(function(){URL.revokeObjectURL(url);},1000);
}

/* ═══════════════════════ MAIN ═══════════════════════ */
var TABS=["Mese","Slot","Indispo","Utenti","Regole","Vincoli","Riepilogo"];

export default function App(){
  var now=new Date();
  var[yr,sYr]=useState(now.getFullYear());
  var[mo,sMo]=useState(now.getMonth());
  var[tab,sTab]=useState("Mese");
  var[loaded,sLoaded]=useState(false);
  var[saved,sSaved]=useState(true);

  var[users,sUsers]=useState(mkDU);
  var[gS,sGS]=useState(mkDS);
  var[inc,sInc]=useState([]);
  var[dR,sDR]=useState(function(){return{"d4":{"2":["CIC","NIC","VD"]}};});
  var[ovA,sOvA]=useState({});
  var[asA,sAsA]=useState({});
  var[exA,sExA]=useState({});
  var[ntA,sNtA]=useState({});
  var[modal,sModal]=useState(null);

  useEffect(function(){sLoad().then(function(s){
    if(s){var u=sanU(s.users);if(u&&u.length)sUsers(u);sGS(sanS(s.gS));sInc(sanA(s.inc));if(s.dR)sDR(sanO(s.dR));sOvA(sanO(s.ovA));sAsA(sanO(s.asA));sExA(sanO(s.exA));sNtA(sanO(s.ntA));}
    sLoaded(true);
  });},[]);

  // Mark unsaved on any change
  var first=useRef(true);
  useEffect(function(){if(first.current){first.current=false;return;}sSaved(false);},[users,gS,inc,dR,ovA,asA,exA,ntA]);

  var doSave=useCallback(function(){
    sSave({users:users,gS:gS,inc:inc,dR:dR,ovA:ovA,asA:asA,exA:exA,ntA:ntA}).then(function(){sSaved(true);});
  },[users,gS,inc,dR,ovA,asA,exA,ntA]);

  var doExportJSON=useCallback(function(){
    var data={users:users,gS:gS,inc:inc,dR:dR,ovA:ovA,asA:asA,exA:exA,ntA:ntA,_v:"v8",_date:new Date().toISOString()};
    var blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
    var url=URL.createObjectURL(blob);var a=document.createElement("a");
    a.href=url;a.download="CML_Planning_backup_"+new Date().toISOString().slice(0,10)+".json";
    document.body.appendChild(a);a.click();document.body.removeChild(a);
    setTimeout(function(){URL.revokeObjectURL(url);},1000);
  },[users,gS,inc,dR,ovA,asA,exA,ntA]);

  var fileRef=useRef(null);
  var doImportJSON=useCallback(function(){
    if(fileRef.current)fileRef.current.click();
  },[]);
  var handleImportFile=useCallback(function(e){
    var file=e.target.files&&e.target.files[0];
    if(!file)return;
    var reader=new FileReader();
    reader.onload=function(ev){
      try{
        var data=JSON.parse(ev.target.result);
        var u=sanU(data.users);if(u&&u.length)sUsers(u);
        sGS(sanS(data.gS));sInc(sanA(data.inc));
        if(data.dR)sDR(sanO(data.dR));
        sOvA(sanO(data.ovA));sAsA(sanO(data.asA));
        sExA(sanO(data.exA));sNtA(sanO(data.ntA));
        sSaved(false);
        sModal({title:"Importato",msg:"Dati caricati. Clicca Salva per confermare.",onOk:function(){sModal(null);}});
      }catch(err){sModal({title:"Errore",msg:"File non valido: "+err.message,onOk:function(){sModal(null);}});}
    };
    reader.readAsText(file);
    e.target.value="";
  },[]);

  var mk=yr+"-"+mo;
  var dOv=ovA[mk]||{};
  var asg=asA[mk]||{};
  var exc=exA[mk]||{};
  var mNt=ntA[mk]||"";
  var nd=nDays(yr,mo);
  var sn=useMemo(function(){return sNames(users);},[users]);
  var eInd=useMemo(function(){return buildInd(yr,mo,users,exc);},[yr,mo,users,exc]);

  var sDO=useCallback(function(fn){sOvA(function(p){var o=Object.assign({},p);o[mk]=typeof fn==="function"?fn(p[mk]||{}):fn;return o;});},[mk]);
  var sAS=useCallback(function(v){sAsA(function(p){var o=Object.assign({},p);o[mk]=typeof v==="function"?v(p[mk]||{}):v;return o;});},[mk]);
  var sEx=useCallback(function(fn){sExA(function(p){var o=Object.assign({},p);o[mk]=typeof fn==="function"?fn(p[mk]||{}):fn;return o;});},[mk]);
  var sNt=useCallback(function(v){sNtA(function(p){var o=Object.assign({},p);o[mk]=v;return o;});},[mk]);

  var doGen=useCallback(function(){sModal({title:"Genera",msg:"Sovrascrive le assegnazioni.",onOk:function(){sAS(gen(yr,mo,users,gS,dOv,eInd,inc,dR));sModal(null);}});},[yr,mo,users,gS,dOv,eInd,inc,dR,sAS]);
  var doExp=useCallback(function(){exportHTML(yr,mo,nd,sn,asg,eInd,dOv);},[yr,mo,nd,sn,asg,eInd,dOv]);
  var doPrint=useCallback(function(){document.title="Planning "+MN[mo]+" "+yr;setTimeout(function(){try{window.print();}catch(e){doExp();}},100);},[mo,yr,doExp]);

  var prev=function(){if(mo===0){sMo(11);sYr(function(y){return y-1;});}else sMo(function(m){return m-1;});};
  var next=function(){if(mo===11){sMo(0);sYr(function(y){return y+1;});}else sMo(function(m){return m+1;});};

  if(!loaded)return(<div style={{padding:40,textAlign:"center",color:"#64748b"}}>Caricamento...</div>);

  return(
    <div style={{fontFamily:"'Segoe UI',system-ui,sans-serif",maxWidth:1500,margin:"0 auto",padding:"10px 14px",color:"#1e293b",fontSize:13}}>
      <style>{PCSS}</style>
      <Modal show={!!modal} title={modal?modal.title:""} msg={modal?modal.msg:""} onOk={modal?modal.onOk:null} onCancel={function(){sModal(null);}}/>

      <div className="no-print" style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8,flexWrap:"wrap",gap:8}}>
        <div style={{display:"flex",alignItems:"baseline",gap:10}}>
          <span style={{fontSize:18,fontWeight:800,letterSpacing:-0.5}}>CML Catania</span>
          <span style={{fontSize:12,color:"#64748b"}}>Planning Mensile</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          <button onClick={doSave} style={Object.assign({},cs.bp,{background:saved?"#16a34a":"#dc2626",padding:"6px 16px",fontSize:12})}>
            {saved?"\u2713 Salvato":"Salva"}
          </button>
          <button onClick={doExportJSON} style={Object.assign({},cs.bs,{fontSize:11,padding:"5px 10px"})} title="Esporta backup JSON">{"\u2B07"} Backup</button>
          <button onClick={doImportJSON} style={Object.assign({},cs.bs,{fontSize:11,padding:"5px 10px"})} title="Importa backup JSON">{"\u2B06"} Carica</button>
          <input ref={fileRef} type="file" accept=".json" style={{display:"none"}} onChange={handleImportFile}/>
          <span style={{color:"#cbd5e1"}}>|</span>
          <button onClick={prev} style={cs.bs}>{"\u25C0"}</button>
          <span style={{fontWeight:700,fontSize:14,minWidth:150,textAlign:"center"}}>{MN[mo]} {yr}</span>
          <button onClick={next} style={cs.bs}>{"\u25B6"}</button>
        </div>
      </div>

      <div className="no-print" style={{display:"flex",gap:1,marginBottom:12,borderBottom:"2px solid #e2e8f0",flexWrap:"wrap"}}>
        {TABS.map(function(t){var isG=["Slot","Utenti","Regole","Vincoli"].includes(t);return(
          <button key={t} onClick={function(){sTab(t);}} style={{padding:"6px 14px",border:"none",cursor:"pointer",fontWeight:tab===t?700:400,color:tab===t?"#1e40af":"#64748b",background:tab===t?"#eff6ff":"transparent",borderBottom:tab===t?"2px solid #1e40af":"2px solid transparent",borderRadius:"6px 6px 0 0",fontSize:13}}>
            {t}{isG&&<span style={{marginLeft:3,fontSize:8,verticalAlign:"super",color:"#94a3b8"}}>{"\u25CF"}</span>}
          </button>);})}
      </div>

      <div style={{display:"none"}}><style>{"@media print{.print-hdr{display:block!important}}"}</style></div>
      <div className="print-hdr" style={{display:"none",textAlign:"center",marginBottom:8,fontWeight:700,fontSize:14}}>CML Catania {"\u2014"} Planning {MN[mo]} {yr}</div>

      {tab==="Mese"&&<VMese yr={yr} mo={mo} nd={nd} users={users} sn={sn} gS={gS} dOv={dOv} asg={asg} sAS={sAS} eInd={eInd} doGen={doGen} doExp={doExp} doPrint={doPrint}/>}
      {tab==="Slot"&&<VSlot gS={gS} sGS={sGS} yr={yr} mo={mo} nd={nd} dOv={dOv} sDO={sDO}/>}
      {tab==="Indispo"&&<VInd yr={yr} mo={mo} nd={nd} users={users} sn={sn} exc={exc} sEx={sEx} eInd={eInd}/>}
      {tab==="Utenti"&&<VUt users={users} sUsers={sUsers} sn={sn} sModal={sModal}/>}
      {tab==="Regole"&&<VReg users={users} sUsers={sUsers}/>}
      {tab==="Vincoli"&&<VVinc users={users} sn={sn} inc={inc} sInc={sInc} dR={dR} sDR={sDR} sModal={sModal}/>}
      {tab==="Riepilogo"&&<VRiep yr={yr} mo={mo} nd={nd} users={users} sn={sn} asg={asg} eInd={eInd} notes={mNt} sNt={sNt}/>}
    </div>
  );
}

/* ═══════════════════════ MESE ═══════════════════════ */
function VMese(p){
  var yr=p.yr,mo=p.mo,nd=p.nd,users=p.users,sn=p.sn,dOv=p.dOv,asg=p.asg,sAS=p.sAS,eInd=p.eInd;
  var days=[];for(var i=1;i<=nd;i++)days.push(i);
  var[edit,sEdit]=useState(null);

  var swap=function(dk2,code,idx,uid){sAS(function(prev){var d=Object.assign({},prev[dk2]||{});var a=(d[code]||[]).slice();if(idx<a.length)a[idx]=uid;else a.push(uid);d[code]=a;var o=Object.assign({},prev);o[dk2]=d;return o;});sEdit(null);};
  var rmSlot=function(dk2,code,idx){sAS(function(prev){var d=Object.assign({},prev[dk2]||{});var a=(d[code]||[]).slice();a.splice(idx,1);d[code]=a;var o=Object.assign({},prev);o[dk2]=d;return o;});sEdit(null);};
  var addSlot=function(dk2,code,uid){sAS(function(prev){var d=Object.assign({},prev[dk2]||{});var a=(d[code]||[]).slice();a.push(uid);d[code]=a;var o=Object.assign({},prev);o[dk2]=d;return o;});sEdit(null);};
  var gDU=function(dk2){var da=asg[dk2]||{};var s=new Set();Object.values(da).forEach(function(a){(a||[]).forEach(function(u){s.add(u);});});return s;};
  var gAv=function(dk2,code,exIdx){var du=gDU(dk2);var cur=(asg[dk2]&&asg[dk2][code])||[];return users.filter(function(u){if(u.vo)return false;if(du.has(u.id)){return exIdx!==undefined&&cur[exIdx]===u.id;}return true;});};

  var PA=["CIC","NIC","NICSP","NICMIN","VD","CIECHI","VDOM","PU"];

  return(<div>
    <div className="no-print" style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:6}}>
      {OP_DISP.filter(function(a){return COL[a.code];}).map(function(a){return(<span key={a.code} style={tg(a.code)}>{a.label}</span>);})}
    </div>
    <div className="no-print" style={{display:"flex",gap:8,marginBottom:10}}>
      <button onClick={p.doGen} style={cs.bp}>Genera Planning</button>
      <button onClick={p.doPrint} style={Object.assign({},cs.bp,{background:"#7c3aed"})}>Stampa PDF</button>
      <button onClick={p.doExp} style={Object.assign({},cs.bs,{})}>Scarica HTML</button>
    </div>
    <div style={{overflowX:"auto"}}>
      <table style={{borderCollapse:"collapse",width:"100%",minWidth:900}}>
        <thead><tr>
          <th style={Object.assign({},cs.h,{minWidth:50,textAlign:"left"})}>Giorno</th>
          {OP_DISP.map(function(a){var c=COL[a.code];return(<th key={a.code} style={Object.assign({},cs.h,{minWidth:55,background:c?c.bg:"#f8fafc",color:c?c.tx:"#334155"})}>{a.code}</th>);})}
          <th style={Object.assign({},cs.h,{minWidth:80,textAlign:"left"})}>Indispo</th>
        </tr></thead>
        <tbody>
          {days.map(function(d){
            var k=dk(yr,mo,d),we=isWE(yr,mo,d),hol=isHol(yr,mo,d),off=we||!!hol,da=asg[k]||{},di=eInd[k]||{};
            var bg=hol?"#fee2e2":we?"#f1f5f9":(d%2===0?"#fafafc":"#fff");
            var dc=hol?"#dc2626":we?"#94a3b8":"#334155";
            var lbl=dn(yr,mo,d)+" "+d+(hol?" "+hol:"");
            return(<tr key={d} style={{background:bg}}>
              <td style={Object.assign({},cs.c,{fontWeight:600,whiteSpace:"nowrap",color:dc,fontSize:hol?10:11})}>{lbl}</td>
              {OP_DISP.map(function(a){
                if(off)return(<td key={a.code} style={Object.assign({},cs.c,{background:bg})}/>);
                var ov=dOv[k]&&dOv[k][a.code];var en=ov?(ov.enabled!==false):true;
                if((a.code==="NICMIN"||a.code==="CIECHI")&&!ov)en=false;
                if(!en)return(<td key={a.code} style={Object.assign({},cs.c,{background:"#fafafa",color:"#cbd5e1",textAlign:"center",fontSize:9})}>{"\u2014"}</td>);
                var uids=da[a.code]||[];var names=uids.map(function(uid){return sn[uid]||"?";});var c=COL[a.code];
                var isP=PA.includes(a.code);
                var cc=[];
                if(isP&&names.length>=2){
                  for(var pi=0;pi<names.length;pi+=2){(function(pi2){
                    var pair=pi2+1<names.length?[pi2,pi2+1]:[pi2];
                    cc.push(<div key={pi2} style={{border:"1px solid "+(c?c.bd:"#e2e8f0"),borderRadius:3,padding:"1px 3px",marginBottom:pi2+2<=names.length?2:0,background:c?c.bg:"#fff"}}>
                      {pair.map(function(idx){
                        var isEd=edit&&edit.dk===k&&edit.code===a.code&&edit.idx===idx;
                        if(isEd){var av=gAv(k,a.code,idx);return(<select key={idx} autoFocus value={uids[idx]||""} style={Object.assign({},cs.inp,{fontSize:9,padding:"1px",width:"100%"})} onChange={function(e){if(e.target.value==="_rm")rmSlot(k,a.code,idx);else swap(k,a.code,idx,e.target.value);}} onBlur={function(){setTimeout(function(){sEdit(null);},150);}}>
                          <option value={uids[idx]}>{names[idx]}</option><option value="_rm" style={{color:"red"}}>{"\u2715"} Rimuovi</option>
                          {av.map(function(u){return(<option key={u.id} value={u.id}>{sn[u.id]}</option>);})}
                        </select>);}
                        return(<div key={idx} style={{color:c?c.tx:"#334155",lineHeight:1.25,fontWeight:idx%2===0?600:400,cursor:"pointer"}} onClick={function(){sEdit({dk:k,code:a.code,idx:idx});}}>{names[idx]}</div>);
                      })}
                    </div>);
                  })(pi);}
                } else {
                  names.forEach(function(n,idx){(function(idx2){
                    var isEd=edit&&edit.dk===k&&edit.code===a.code&&edit.idx===idx2;
                    if(isEd){var av=gAv(k,a.code,idx2);cc.push(<select key={idx2} autoFocus value={uids[idx2]||""} style={Object.assign({},cs.inp,{fontSize:9,padding:"1px",width:"100%"})} onChange={function(e){if(e.target.value==="_rm")rmSlot(k,a.code,idx2);else swap(k,a.code,idx2,e.target.value);}} onBlur={function(){setTimeout(function(){sEdit(null);},150);}}>
                      <option value={uids[idx2]}>{names[idx2]}</option><option value="_rm" style={{color:"red"}}>{"\u2715"} Rimuovi</option>
                      {av.map(function(u){return(<option key={u.id} value={u.id}>{sn[u.id]}</option>);})}
                    </select>);}
                    else cc.push(<div key={idx2} style={{color:c?c.tx:"#334155",lineHeight:1.3,cursor:"pointer"}} onClick={function(){sEdit({dk:k,code:a.code,idx:idx2});}}>{n}</div>);
                  })(idx);});
                }
                // add btn
                var isAdd=edit&&edit.dk===k&&edit.code===a.code&&edit.idx===-1;
                if(isAdd){var av3=gAv(k,a.code,undefined);cc.push(<select key="add" autoFocus value="" style={Object.assign({},cs.inp,{fontSize:9,padding:"1px",width:"100%"})} onChange={function(e){if(e.target.value)addSlot(k,a.code,e.target.value);}} onBlur={function(){setTimeout(function(){sEdit(null);},150);}}><option value="">Aggiungi...</option>{av3.map(function(u){return(<option key={u.id} value={u.id}>{sn[u.id]}</option>);})}</select>);}
                else cc.push(<div key="ab" className="no-print" style={{textAlign:"center",marginTop:1}}><button onClick={function(){sEdit({dk:k,code:a.code,idx:-1});}} style={{background:"none",border:"none",color:"#94a3b8",cursor:"pointer",fontSize:10,padding:0}}>+</button></div>);

                return(<td key={a.code} style={Object.assign({},cs.c,{background:c?(c.bg+"60"):"#fff",textAlign:"center",fontSize:9,padding:"2px"})}>
                  {cc}</td>);
              })}
              <td style={Object.assign({},cs.c,{fontSize:9})}>
                {!off&&Object.entries(di).filter(function(e){return e[1]&&e[1].length;}).map(function(e){return(<div key={e[0]} style={{color:"#64748b"}}><b>{sn[e[0]]||"?"}</b> {e[1].join(",")}</div>);})}
              </td>
            </tr>);
          })}
        </tbody></table></div></div>);
}

/* ═══════════════════════ SLOT ═══════════════════════ */
function VSlot(p){
  var gS=p.gS,sGS=p.sGS,yr=p.yr,mo=p.mo,nd=p.nd,dOv=p.dOv,sDO=p.sDO;
  var wd=useMemo(function(){var r=[];for(var i=1;i<=nd;i++){if(!isOff(yr,mo,i))r.push(i);}return r;},[yr,mo,nd]);
  var chg=function(code,val){var n=parseInt(val,10);if(isNaN(n)||n<0)return;sGS(function(prev){var o=Object.assign({},prev);o[code]=n;return o;});};
  var togD=function(d,code){var k=dk(yr,mo,d);sDO(function(prev){var c=Object.assign({},prev);c[k]=Object.assign({},c[k]||{});var cur=c[k][code]||{enabled:true};c[k][code]=Object.assign({},cur,{enabled:!cur.enabled});return c;});};
  var setDS=function(d,code,val){var n=parseInt(val,10);var k=dk(yr,mo,d);sDO(function(prev){var c=Object.assign({},prev);c[k]=Object.assign({},c[k]||{});var cur=c[k][code]||{enabled:true};c[k][code]=Object.assign({},cur,{slots:isNaN(n)?undefined:n});return c;});};
  var QK=["CIECHI","NICSP","NICMIN"];
  // All slot-configurable activities: fixed + NIC
  var SLOT_ACTS=FIXED.concat([ACTIVITIES.find(function(a){return a.code==="NIC";})]);
  return(<div>
    <h3 style={{fontSize:14,fontWeight:700,marginBottom:8}}>Slot <span style={{fontWeight:400,fontSize:11,color:"#64748b"}}>(globali {"\u2014"} valori = coppie per commissioni, singoli per 222)</span></h3>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(230px,1fr))",gap:6,marginBottom:16}}>
      {SLOT_ACTS.map(function(a){return(
        <div key={a.code} style={{display:"flex",alignItems:"center",gap:8,padding:"5px 10px",borderRadius:6,background:COL[a.code]?COL[a.code].bg:"#f8fafc",border:"1px solid "+(COL[a.code]?COL[a.code].bd:"#e2e8f0")}}>
          <span style={{fontWeight:600,fontSize:12,color:COL[a.code]?COL[a.code].tx:"#334155",flex:1}}>{a.code} <span style={{fontWeight:400,fontSize:10}}>({a.paired?"coppie":"singoli"})</span></span>
          <input type="number" min={0} max={10} value={gS[a.code]!==undefined?gS[a.code]:a.defPairs} onChange={function(e){chg(a.code,e.target.value);}} style={Object.assign({},cs.inp,{width:46,textAlign:"center",fontSize:12})}/>
        </div>);})}
    </div>
    <div style={{padding:"8px 12px",background:"#f0fdf4",borderRadius:6,marginBottom:16,fontSize:12,color:"#166534",border:"1px solid #bbf7d0"}}>
      <b>Automatici:</b> VALID = strutturati residui {"\u00B7"} ASP = ACN residui {"\u00B7"} VDOM = coppie fisse 1/mese {"\u00B7"} PU = 2/mese Palmeri+Di Paola
    </div>
    <h3 style={{fontSize:14,fontWeight:700,marginBottom:8}}>Attivazione rapida <span style={{fontWeight:400,fontSize:11,color:"#64748b"}}>(solo {MN[mo]})</span></h3>
    <div style={{overflowX:"auto",marginBottom:16}}>
      <table style={{borderCollapse:"collapse"}}><thead><tr><th style={cs.h}>Giorno</th>
        {QK.map(function(c){return(<th key={c} style={Object.assign({},cs.h,{width:70})}>{c}</th>);})}</tr></thead>
        <tbody>{wd.map(function(d){var k=dk(yr,mo,d);return(<tr key={d}><td style={cs.c}>{dn(yr,mo,d)} {d}</td>
          {QK.map(function(code){var ov=dOv[k]&&dOv[k][code];var en=ov?(ov.enabled!==false):true;if((code==="NICMIN"||code==="CIECHI")&&!ov)en=false;
            return(<td key={code} style={Object.assign({},cs.c,{textAlign:"center"})}><input type="checkbox" checked={en} onChange={function(){togD(d,code);}}/></td>);})}</tr>);})}</tbody></table>
    </div>
    <h3 style={{fontSize:14,fontWeight:700,marginBottom:6}}>Override giornalieri <span style={{fontWeight:400,fontSize:11,color:"#64748b"}}>(coppie/singoli {"\u2014"} solo {MN[mo]})</span></h3>
    <div style={{overflowX:"auto"}}>
      <table style={{borderCollapse:"collapse"}}><thead><tr><th style={cs.h}>Giorno</th>
        {SLOT_ACTS.map(function(a){return(<th key={a.code} style={Object.assign({},cs.h,{fontSize:9})}>{a.code}</th>);})}</tr></thead>
        <tbody>{wd.map(function(d){var k=dk(yr,mo,d);return(<tr key={d}><td style={cs.c}>{dn(yr,mo,d)} {d}</td>
          {SLOT_ACTS.map(function(a){var ov=dOv[k]&&dOv[k][a.code];return(<td key={a.code} style={Object.assign({},cs.c,{textAlign:"center"})}>
            <input type="number" min={0} max={10} value={ov&&ov.slots!==undefined?ov.slots:""} placeholder={String(gS[a.code]!==undefined?gS[a.code]:a.defPairs)} onChange={function(e){setDS(d,a.code,e.target.value);}} style={Object.assign({},cs.inp,{width:34,textAlign:"center",fontSize:10,padding:"2px"})}/>
          </td>);})}</tr>);})}</tbody></table>
    </div>
  </div>);
}

/* ═══════════════════════ INDISPO ═══════════════════════ */
function VInd(p){
  var yr=p.yr,mo=p.mo,nd=p.nd,users=p.users,sn=p.sn,exc=p.exc,sEx=p.sEx,eInd=p.eInd;
  var sorted=useMemo(function(){return users.filter(function(u){return !u.vo;}).sort(function(a,b){return a.name.localeCompare(b.name);});},[users]);
  var wd=useMemo(function(){var r=[];for(var i=1;i<=nd;i++){if(!isOff(yr,mo,i))r.push(i);}return r;},[yr,mo,nd]);
  var[sel,sSel]=useState("");
  useEffect(function(){if(!sel&&sorted.length)sSel(sorted[0].id);},[sorted,sel]);
  var togE=function(uid,d,code){var k=dk(yr,mo,d);sEx(function(prev){var c=Object.assign({},prev);c[k]=Object.assign({},c[k]||{});var a=c[k][uid]?c[k][uid].slice():[];var ix=a.indexOf(code);if(ix>=0)a.splice(ix,1);else a.push(code);c[k][uid]=a.length?a:undefined;if(!c[k][uid])delete c[k][uid];return c;});};

  return(<div>
    <h3 style={{fontSize:14,fontWeight:700,marginBottom:4}}>Eccezioni mensili {"\u2014"} {MN[mo]} {yr}</h3>
    <p style={{fontSize:11,color:"#64748b",marginBottom:10}}>I giorni lavorativi e SW sono nel profilo utente. Qui solo ferie/esterno extra per questo mese.</p>
    <select value={sel} onChange={function(e){sSel(e.target.value);}} style={Object.assign({},cs.inp,{minWidth:220,marginBottom:10})}>
      {sorted.map(function(u){var wds=u.wd.map(function(w){var f=WD.find(function(x){return x.n===w;});return f?f.l:"";}).join(",");return(<option key={u.id} value={u.id}>{u.name} ({wds}){u.swDay?(" SW:"+WD.find(function(x){return x.n===u.swDay;}).l):""}</option>);})}</select>
    {sel&&<div style={{overflowX:"auto",marginBottom:16}}>
      <table style={{borderCollapse:"collapse"}}><thead><tr><th style={cs.h}>Giorno</th>{["FER","EST"].map(function(c){return(<th key={c} style={Object.assign({},cs.h,{width:55})}>{c}</th>);})}</tr></thead>
        <tbody>{wd.map(function(d){var k=dk(yr,mo,d);var dow=jd(yr,mo,d);var u=users.find(function(x){return x.id===sel;});
          if(!u||!u.wd.includes(dow))return(<tr key={d} style={{background:"#f8f8f8"}}><td style={Object.assign({},cs.c,{color:"#bbb"})}>{dn(yr,mo,d)} {d}</td><td colSpan={2} style={Object.assign({},cs.c,{color:"#bbb",textAlign:"center"})}>non lavora</td></tr>);
          if(u.swDay===dow)return(<tr key={d} style={{background:"#dbeafe"}}><td style={Object.assign({},cs.c,{color:"#1e40af"})}>{dn(yr,mo,d)} {d}</td><td colSpan={2} style={Object.assign({},cs.c,{color:"#1e40af",textAlign:"center"})}>SW</td></tr>);
          var codes=(exc[k]&&exc[k][sel])||[];
          return(<tr key={d}><td style={Object.assign({},cs.c,{fontWeight:600})}>{dn(yr,mo,d)} {d}</td>
            {["FER","EST"].map(function(c){return(<td key={c} style={Object.assign({},cs.c,{textAlign:"center"})}><input type="checkbox" checked={codes.includes(c)} onChange={function(){togE(sel,d,c);}}/></td>);})}</tr>);})}</tbody></table>
    </div>}
    <h3 style={{fontSize:14,fontWeight:700,marginTop:12,marginBottom:6}}>Panoramica {"\u2014"} {MN[mo]}</h3>
    <div style={{overflowX:"auto"}}>
      <table style={{borderCollapse:"collapse",fontSize:10}}><thead><tr>
        <th style={Object.assign({},cs.h,{fontSize:10,textAlign:"left"})}>Utente</th>
        {wd.map(function(d){return(<th key={d} style={Object.assign({},cs.h,{padding:"2px",minWidth:22,fontSize:9})}>{d}</th>);})}</tr></thead>
        <tbody>{sorted.map(function(u){return(<tr key={u.id}>
          <td style={Object.assign({},cs.c,{fontWeight:500,whiteSpace:"nowrap",fontSize:10})}>{sn[u.id]}</td>
          {wd.map(function(d){var k=dk(yr,mo,d);var codes=(eInd[k]&&eInd[k][u.id])||[];
            var txt=codes.join(",").replace("N/D","\u2022");
            var bg2=codes.includes("N/D")?"#f1f5f9":codes.includes("SW")?"#dbeafe":codes.includes("FER")?"#fef3c7":codes.includes("EST")?"#d1fae5":"#fff";
            return(<td key={d} style={Object.assign({},cs.c,{textAlign:"center",background:bg2,fontSize:8,padding:"1px"})}>{txt}</td>);})}</tr>);})}</tbody></table>
      <p style={{fontSize:10,color:"#94a3b8",marginTop:4}}>{"\u2022"}=non lavora | SW=smart working</p>
    </div>
  </div>);
}

/* ═══════════════════════ UTENTI ═══════════════════════ */
function VUt(p){
  var users=p.users,sUsers=p.sUsers,sn=p.sn,sModal=p.sModal;
  var[nn,sNN]=useState("");var[nml,sNML]=useState(false);var[nct,sNCT]=useState("STR");
  var add=function(){var t=nn.trim();if(!t)return;sUsers(function(prev){return prev.concat([mkU(t,nml,nct,false,false,[1,2,3,4,5],null,false)]);});sNN("");};
  var rm=function(id){sModal({title:"Rimuovi",msg:"Confermi?",onOk:function(){sUsers(function(prev){return prev.filter(function(u){return u.id!==id;});});sModal(null);}});};
  var tog=function(id,f){sUsers(function(prev){return prev.map(function(u){if(u.id!==id)return u;var o=Object.assign({},u);o[f]=!o[f];return o;});});};
  var togWD2=function(id,day){sUsers(function(prev){return prev.map(function(u){if(u.id!==id)return u;var w=u.wd.slice();var ix=w.indexOf(day);if(ix>=0)w.splice(ix,1);else{w.push(day);w.sort();}return Object.assign({},u,{wd:w});});});};
  var setSW=function(id,val){sUsers(function(prev){return prev.map(function(u){if(u.id!==id)return u;return Object.assign({},u,{swDay:val===""?null:parseInt(val,10)});});});};
  var sorted=useMemo(function(){return users.slice().sort(function(a,b){return a.name.localeCompare(b.name);});},[users]);
  return(<div>
    <h3 style={{fontSize:14,fontWeight:700,marginBottom:10}}>Utenti ({users.length})</h3>
    <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
      <input value={nn} onChange={function(e){sNN(e.target.value);}} placeholder="Cognome Nome" onKeyDown={function(e){if(e.key==="Enter")add();}} style={Object.assign({},cs.inp,{width:180})}/>
      <label style={{fontSize:12,display:"flex",alignItems:"center",gap:3}}><input type="checkbox" checked={nml} onChange={function(e){sNML(e.target.checked);}}/> ML</label>
      <select value={nct} onChange={function(e){sNCT(e.target.value);}} style={cs.inp}><option value="STR">STR</option><option value="ACN">ACN</option></select>
      <button onClick={add} style={cs.bp}>Aggiungi</button>
    </div>
    <div style={{overflowX:"auto"}}>
      <table style={{borderCollapse:"collapse",width:"100%"}}>
        <thead><tr>
          {["Nome","Sigla","ML","Ct","222","Pr.Ci"].map(function(h,i){return(<th key={i} style={cs.h}>{h}</th>);})}
          {WD.map(function(w){return(<th key={w.n} style={Object.assign({},cs.h,{width:30})}>{w.l}</th>);})}
          <th style={Object.assign({},cs.h,{width:50})}>SW</th>
          <th style={cs.h}></th>
        </tr></thead>
        <tbody>{sorted.map(function(u){return(
          <tr key={u.id} style={{background:u.vo?"#fefce8":"transparent"}}>
            <td style={cs.c}>{u.name}{u.vo&&<span style={{marginLeft:4,fontSize:9,color:"#ca8a04"}}>(VDOM)</span>}</td>
            <td style={Object.assign({},cs.c,{fontWeight:600})}>{sn[u.id]}</td>
            <td style={Object.assign({},cs.c,{textAlign:"center"})}>{u.ml&&<span style={{color:"#059669",fontWeight:700,fontSize:11}}>ML</span>}</td>
            <td style={cs.c}><span style={{fontSize:10,padding:"1px 5px",borderRadius:4,background:u.ct==="ACN"?"#dbeafe":"#f1f5f9",color:u.ct==="ACN"?"#1e40af":"#475569"}}>{u.ct}</span></td>
            <td style={Object.assign({},cs.c,{textAlign:"center"})}><input type="checkbox" checked={u.e222} onChange={function(){tog(u.id,"e222");}}/></td>
            <td style={Object.assign({},cs.c,{textAlign:"center"})}><input type="checkbox" checked={u.eCi} onChange={function(){tog(u.id,"eCi");}}/></td>
            {WD.map(function(w){var on=u.wd.includes(w.n);return(<td key={w.n} style={Object.assign({},cs.c,{textAlign:"center",background:on?"#d1fae5":"#fee2e2"})}><input type="checkbox" checked={on} onChange={function(){togWD2(u.id,w.n);}}/></td>);})}
            <td style={Object.assign({},cs.c,{textAlign:"center"})}>
              {u.ct==="STR"&&!u.vo?<select value={u.swDay===null?"":String(u.swDay)} onChange={function(e){setSW(u.id,e.target.value);}} style={Object.assign({},cs.inp,{fontSize:10,padding:"1px 2px",width:50})}>
                <option value="">--</option>{WD.map(function(w){return(<option key={w.n} value={String(w.n)}>{w.l}</option>);})}
              </select>:<span style={{color:"#94a3b8",fontSize:10}}>--</span>}
            </td>
            <td style={Object.assign({},cs.c,{textAlign:"center"})}><button onClick={function(){rm(u.id);}} style={{background:"none",border:"none",color:"#ef4444",cursor:"pointer",fontSize:14,fontWeight:700}}>{"\u2715"}</button></td>
          </tr>);})}</tbody></table></div></div>);
}

/* ═══════════════════════ REGOLE ═══════════════════════ */
function VReg(p){
  var users=p.users,sUsers=p.sUsers;
  var sorted=useMemo(function(){return users.filter(function(u){return !u.vo;}).sort(function(a,b){return a.name.localeCompare(b.name);});},[users]);
  var[sel,sSel]=useState("");useEffect(function(){if(!sel&&sorted.length)sSel(sorted[0].id);},[sorted,sel]);
  var user=users.find(function(u){return u.id===sel;});
  var upd=function(code,field,val){sUsers(function(prev){return prev.map(function(u){if(u.id!==sel)return u;var as=Object.assign({},u.as);as[code]=Object.assign({},as[code]);as[code][field]=val;return Object.assign({},u,{as:as});});});};
  var WO=[{v:0,l:"0\u2014evita"},{v:1,l:"1\u2014neutro"},{v:2,l:"2\u2014pref."},{v:3,l:"3\u2014forte"}];
  return(<div>
    <h3 style={{fontSize:14,fontWeight:700,marginBottom:10}}>Regole</h3>
    <select value={sel} onChange={function(e){sSel(e.target.value);}} style={Object.assign({},cs.inp,{minWidth:220,marginBottom:12})}>
      {sorted.map(function(u){return(<option key={u.id} value={u.id}>{u.name}</option>);})}</select>
    {user&&<div style={{overflowX:"auto"}}>
      <table style={{borderCollapse:"collapse"}}><thead><tr><th style={cs.h}>Att.</th><th style={Object.assign({},cs.h,{textAlign:"center"})}>Abil.</th><th style={Object.assign({},cs.h,{textAlign:"center"})}>Peso</th></tr></thead>
        <tbody>{OP_ACT.map(function(a){var r=user.as[a.code]||{al:true,w:1};return(<tr key={a.code}>
          <td style={cs.c}><span style={tg(a.code)}>{a.code}</span><span style={{marginLeft:6,fontSize:11,color:"#64748b"}}>{a.label}</span></td>
          <td style={Object.assign({},cs.c,{textAlign:"center"})}><input type="checkbox" checked={r.al} onChange={function(e){upd(a.code,"al",e.target.checked);}}/></td>
          <td style={Object.assign({},cs.c,{textAlign:"center"})}><select value={r.w} onChange={function(e){upd(a.code,"w",parseInt(e.target.value,10));}} style={Object.assign({},cs.inp,{width:90,fontSize:11})}>
            {WO.map(function(w){return(<option key={w.v} value={w.v}>{w.l}</option>);})}</select></td>
        </tr>);})}</tbody></table></div>}
  </div>);
}

/* ═══════════════════════ VINCOLI ═══════════════════════ */
function VVinc(p){
  var users=p.users,sn=p.sn,inc=p.inc,sInc=p.sInc,dR=p.dR,sDR=p.sDR,sModal=p.sModal;
  var sorted=useMemo(function(){return users.filter(function(u){return !u.vo;}).sort(function(a,b){return a.name.localeCompare(b.name);});},[users]);
  var[ua,sUA]=useState("");var[ub,sUB]=useState("");
  var addI=function(){if(!ua||!ub||ua===ub)return;if(inc.some(function(pp){return(pp[0]===ua&&pp[1]===ub)||(pp[0]===ub&&pp[1]===ua);}))return;sInc(function(prev){return prev.concat([[ua,ub]]);});sUA("");sUB("");};
  var rmI=function(i){sModal({title:"Rimuovi",msg:"Confermi?",onOk:function(){sInc(function(prev){return prev.filter(function(_,j){return j!==i;});});sModal(null);}});};
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
      <button onClick={addI} style={cs.bp} disabled={!ua||!ub||ua===ub}>Aggiungi</button>
    </div>
    {inc.length>0&&<table style={{borderCollapse:"collapse",maxWidth:500,marginBottom:16}}><tbody>{inc.map(function(pp,i){return(<tr key={i}><td style={Object.assign({},cs.c,{fontWeight:500})}>{sn[pp[0]]||pp[0]}</td><td style={Object.assign({},cs.c,{fontWeight:500})}>{sn[pp[1]]||pp[1]}</td><td style={Object.assign({},cs.c,{textAlign:"center"})}><button onClick={function(){rmI(i);}} style={{background:"none",border:"none",color:"#ef4444",cursor:"pointer",fontWeight:700}}>{"\u2715"}</button></td></tr>);})}</tbody></table>}
    <h3 style={{fontSize:14,fontWeight:700,marginTop:20,marginBottom:6}}>Restrizioni giorno</h3>
    <div style={{display:"flex",gap:6,marginBottom:8,flexWrap:"wrap",alignItems:"center"}}>
      <select value={dU} onChange={function(e){sDU(e.target.value);}} style={Object.assign({},cs.inp,{minWidth:160})}><option value="">Utente</option>{sorted.map(function(u){return(<option key={u.id} value={u.id}>{u.name}</option>);})}</select>
      <select value={dD} onChange={function(e){sDD(e.target.value);}} style={cs.inp}>{WD.map(function(w){return(<option key={w.n} value={String(w.n)}>{w.l}</option>);})}</select>
    </div>
    {dU&&<div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:12}}>{OP_ACT.map(function(a){var codes=(dR[dU]||{})[dD]||[];var on=codes.includes(a.code);return(<button key={a.code} onClick={function(){togDR2(dU,dD,a.code);}} style={Object.assign({},tg(a.code),{cursor:"pointer",opacity:on?1:0.3,outline:on?"2px solid #1e40af":"none",outlineOffset:1})}>{a.code}</button>);})}</div>}
    {allDR.length>0&&<table style={{borderCollapse:"collapse",maxWidth:550}}><tbody>{allDR.map(function(r,i){return(<tr key={i}><td style={Object.assign({},cs.c,{fontWeight:500})}>{sn[r.uid]||r.uid}</td><td style={cs.c}>{WN[r.dow]}</td><td style={cs.c}>{r.codes.map(function(c){return(<span key={c} style={Object.assign({},tg(c),{marginRight:2})}>{c}</span>);})}</td><td style={Object.assign({},cs.c,{textAlign:"center"})}><button onClick={function(){rmDR2(r.uid,r.dow);}} style={{background:"none",border:"none",color:"#ef4444",cursor:"pointer",fontWeight:700}}>{"\u2715"}</button></td></tr>);})}</tbody></table>}
  </div>);
}

/* ═══════════════════════ RIEPILOGO ═══════════════════════ */
function VRiep(p){
  var yr=p.yr,mo=p.mo,nd=p.nd,users=p.users,sn=p.sn,asg=p.asg,eInd=p.eInd,notes=p.notes,sNt=p.sNt;
  var stats=useMemo(function(){
    var r={};users.forEach(function(u){r[u.id]={t:0,sw:0,fer:0,est:0,ba:{}};SCHED.forEach(function(c){r[u.id].ba[c]=0;});});
    for(var d=1;d<=nd;d++){var k=dk(yr,mo,d);var da=asg[k]||{};Object.entries(da).forEach(function(e){(e[1]||[]).forEach(function(uid){if(!r[uid])return;r[uid].t++;r[uid].ba[e[0]]=(r[uid].ba[e[0]]||0)+1;});});
      var di=eInd[k]||{};Object.entries(di).forEach(function(e){if(!r[e[0]]||!Array.isArray(e[1]))return;e[1].forEach(function(c){if(c==="SW")r[e[0]].sw++;else if(c==="FER")r[e[0]].fer++;else if(c==="EST")r[e[0]].est++;});});}
    return r;
  },[users,asg,eInd,yr,mo,nd]);
  var sorted=useMemo(function(){return users.slice().sort(function(a,b){return a.name.localeCompare(b.name);});},[users]);
  return(<div>
    <h3 style={{fontSize:14,fontWeight:700,marginBottom:10}}>Riepilogo {"\u2014"} {MN[mo]} {yr}</h3>
    <div style={{overflowX:"auto",marginBottom:16}}>
      <table style={{borderCollapse:"collapse",width:"100%"}}><thead><tr>
        <th style={cs.h}>Utente</th><th style={cs.h}>Tot</th>
        {DISP.map(function(c){var cl=COL[c];return(<th key={c} style={Object.assign({},cs.h,{fontSize:9,background:cl?cl.bg:"#f8fafc",color:cl?cl.tx:"#334155"})}>{c}</th>);})}
        <th style={cs.h}>SW</th><th style={cs.h}>FER</th><th style={cs.h}>EST</th>
      </tr></thead>
        <tbody>{sorted.map(function(u){var s=stats[u.id]||{t:0,sw:0,fer:0,est:0,ba:{}};return(<tr key={u.id}>
          <td style={Object.assign({},cs.c,{fontWeight:500,whiteSpace:"nowrap"})}>{sn[u.id]}</td>
          <td style={Object.assign({},cs.c,{textAlign:"center",fontWeight:700})}>{s.t}</td>
          {DISP.map(function(c){return(<td key={c} style={Object.assign({},cs.c,{textAlign:"center",fontSize:10})}>{s.ba[c]||""}</td>);})}
          <td style={Object.assign({},cs.c,{textAlign:"center"})}>{s.sw||""}</td>
          <td style={Object.assign({},cs.c,{textAlign:"center"})}>{s.fer||""}</td>
          <td style={Object.assign({},cs.c,{textAlign:"center"})}>{s.est||""}</td>
        </tr>);})}</tbody></table></div>
    <h3 style={{fontSize:14,fontWeight:700,marginBottom:6}}>Note</h3>
    <textarea value={notes} onChange={function(e){sNt(e.target.value);}} placeholder="Note libere..."
      style={Object.assign({},cs.inp,{width:"100%",minHeight:80,resize:"vertical",fontFamily:"inherit",lineHeight:1.5})}/>
  </div>);
}
