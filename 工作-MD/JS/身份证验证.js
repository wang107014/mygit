/// DHCWeb.OPCommon.js
//

///document.onkeydown = DHCWeb_EStopSpaceKey;
//alert("DHCWeb.OPCommon.js");
function DHCWeb_GetInfoFromId(pId){
    ////var myrtn=DHCWeb_IsIdCardNo(pId)
    var pId=DHCWeb_Get18IdFromCardNo(pId)
    if (pId==""){
			return ["0","","","","","",""];
		}
	
    var id=String(pId);
    if (id.length==18){
	    var sex=id.slice(14,17)%2?"男":"女";
			///prov=areaCode[id.slice(0,6)] || areaCode[id.slice(0,4)] || areaCode[id.slice(0,2)] || "未知地区";
	    var prov="";
	    ///var birthday=(new Date(id.slice(6,10),id.slice(10,12)-1,id.slice(12,14))).toLocaleDateString();
	    var myMM=(id.slice(10,12)).toString();
	    var myDD=id.slice(12,14).toString();
	    var myYY=id.slice(6,10).toString();
	  }else{
	  	var prov="";
	  	var sex=id.slice(14,15)%2?"男":"女";
	    var myMM=(id.slice(8,10)).toString();
	    var myDD=id.slice(10,12).toString();
	    var myYY=id.slice(6,8).toString();
			if(parseInt(myYY)<10)	{
				myYY = '20'+myYY;
			}else{
				myYY = '19'+myYY;
			}	    
	    
	  }
    var myMM=myMM.length==1?("0"+myMM):myMM;
    var myDD=myDD.length==1?("0"+myDD):myDD;
    var sysDateFormat=tkMakeServerCall('websys.Conversions','DateFormat');
    if (sysDateFormat=="3"){
	    var birthday=myYY+"-"+ myMM +"-"+myDD;
	}
    if (sysDateFormat=="4"){
	    var birthday=myDD+"/"+ myMM +"/"+myYY;
	}
    var myAge=DHCWeb_GetAgeFromBirthDayA(birthday);
    
    return ["1",prov,birthday,sex, myAge];
}

function DHCWeb_Get18IdFromCardNo(pId){
	pId=pId.toLowerCase();
    var arrVerifyCode = [1,0,"x",9,8,7,6,5,4,3,2];  
    var Wi = [7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2];  
    var Checker = [1,9,8,7,6,5,4,3,2,1,1];  

    if(pId.length != 15 && pId.length != 18){
		alert("身份证号共有 15位或18位"); 
		return "";
    }
	if (pId.length == 18){
		if(!validId18(pId)){
			alert("身份证号码有误,请检查!");
			return "";
		}
	}
	if (pId.length == 15){
		if(!validId15(pId)){
			alert("身份证号码有误,请检查!");
			return "";
		}
	}
    var Ai=pId.length==18?pId.substring(0,17):pId.slice(0,6)+"19"+pId.slice(6,15);  
    
    if (!/^\d+$/.test(Ai))
    {
    	alert("身份证除最后一位外必须为数字");
    	return "";
    }
    var yyyy=Ai.slice(6,10),  mm=Ai.slice(10,12)-1,  dd=Ai.slice(12,14);
    var d=new Date(yyyy,mm,dd) ,  now=new Date();  
    var year=d.getFullYear() ,  mon=d.getMonth() , day=d.getDate();
    if (year!=yyyy||mon!=mm||day!=dd||d>now||year<1901){
	    alert( "身份证输入错误");
	    return "";
    }
    
    
	for(var i=0,ret=0;i<17;i++)  ret+=Ai.charAt(i)*Wi[i];      
	Ai+=arrVerifyCode[ret%=11];
	
	return Ai;
}

function DHCWeb_IsIdCardNo(pId){
	pId=pId.toLowerCase();
    var arrVerifyCode = [1,0,"x",9,8,7,6,5,4,3,2];  
    var Wi = [7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2];  
    var Checker = [1,9,8,7,6,5,4,3,2,1,1];  
    if(pId.length != 15 && pId.length != 18){
		alert("身份证号共有 15 码或18位"); 
		return false;
    }
    var Ai=pId.length==18?pId.substring(0,17):pId.slice(0,6)+"19"+pId.slice(6,15);  
    
    if (!/^\d+$/.test(Ai))
    {
    	alert("身份证除最后一位外必须为数字");
    	return false;
    }
    var yyyy=Ai.slice(6,10),  mm=Ai.slice(10,12)-1,  dd=Ai.slice(12,14);
    var d=new Date(yyyy,mm,dd) ,  now=new Date();  
    var year=d.getFullYear() ,  mon=d.getMonth() , day=d.getDate();
    if (year!=yyyy||mon!=mm||day!=dd||d>now||year<1901){
	    alert( "身份证输入错误");
	    return false;
    }
	for(var i=0,ret=0;i<17;i++)  ret+=Ai.charAt(i)*Wi[i];      
	Ai+=arrVerifyCode[ret%=11];
	
	if (pId.length == 18){
		if(!validId18(pId)){
			alert("身份证号码有误,请检查!");
			return false;
		}
	}
	if (pId.length == 15){
		if(!validId15(pId)){
			alert("身份证号码有误,请检查!");
			return false;
		}
	}
	return true;
}

function DHCWeb_ValidateEmail(v)
{
	var str = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/i;
	return str.test(v);
}

/////Get Age from BirthDay
function DHCWeb_GetAgeFromBirthDay(BirthName)
{
	var myAge="";
	var myobj=document.getElementById(BirthName);
	var strBirthday=myobj.value;
	return GetAgeFromBirth(strBirthday);
	
	
	var myAge="";
	var myobj=document.getElementById(BirthName);
	if (myobj)
	{
		var bage=myobj.value;
		bage=bage.substring(0,4);
		var now = new Date();
        var yy = now.getFullYear();
		var myAge=yy-bage;
	}
	return myAge;
}

///获取一个月有多少天
function DayNumOfMonth(Year,Month)
{
	var Month=Month-1
    var d = new Date(Year,Month,0);
    return d.getDate();
}
///只获得年计算的年龄
function GetAgeForYear(strBirthday)
{
		var AgeDesc=GetAgeNew(strBirthday,"")
		return AgeDesc
		var returnAge="";
	    var strBirthdayArr=strBirthday.split("-");
	    var birthYear = strBirthdayArr[0];
	    var birthMonth = strBirthdayArr[1];
	    var birthDay = strBirthdayArr[2];
	    d = new Date();
	    var nowYear = d.getFullYear();
	    var nowMonth = d.getMonth() + 1;
	    var nowDay = d.getDate();
		var ageDiff = nowYear - birthYear ; //年之差
		if(nowMonth == birthMonth)
		{
			var dayDiff = nowDay - birthDay;//日之差
			if(dayDiff < 0)
			{
				returnAge = ageDiff - 1;
			}
			else
			{
				returnAge = ageDiff ;
			}
		}
		else
		{
			var monthDiff = nowMonth - birthMonth;//月之差
			if(monthDiff < 0)
			{
				returnAge = ageDiff - 1;
			}
			else
			{
				returnAge = ageDiff ;
			}
		}
	    return returnAge;

}
//获取年龄计算
function GetAgeFromBirth(strBirthday)
{
		var AgeDesc=GetAgeNew(strBirthday,"")
		return AgeDesc
		var returnAge="";
	    var strBirthdayArr=strBirthday.split("-");
	    var birthYear = strBirthdayArr[0];
	    var birthMonth = strBirthdayArr[1];
	    var birthDay = strBirthdayArr[2];
	    d = new Date();
	    var nowYear = d.getFullYear();
	    var nowMonth = d.getMonth() + 1;
	    var nowDay = d.getDate();
	    if(nowYear == birthYear)
	    {	//同年
	        returnAge = 0;//同年 则为0岁
	        if (nowMonth<birthMonth){returnAge=0}  //月份错误返回0
			var DiffMonth=nowMonth-birthMonth 
			
			if (DiffMonth==1){
				//跨月判断出生天数是否满月
				var Mothday=DayNumOfMonth(nowYear,birthMonth)
				var DateDiff=nowDay + (Mothday-birthDay+1);
				if (DateDiff>30){returnAge=DiffMonth+"个月"}
				else{returnAge=DateDiff+"天"}
			}
	        else if (nowMonth>birthMonth){
				//不是跨月返回月份
				returnAge=(nowMonth-birthMonth)+"个月"
			}
	        if (nowMonth==birthMonth){
				//同月的返回天
				returnAge=(nowDay-birthDay)+"天"
			}
	    }
	    else
	    {	
	        var ageDiff = nowYear - birthYear ; //年之差
			if (ageDiff==1)
			{
				//跨年的
				var MonthDiff=(nowMonth+(12-birthMonth+1))
				if (MonthDiff<12){
					if (MonthDiff==2){
						var DateDiff=nowDay + (31-birthDay+1);
						if (DateDiff>30){returnAge=MonthDiff+"个月"}
						else{returnAge=DateDiff+"天"}
					}else{
						returnAge=MonthDiff+"个月"
					}
				}
				else{returnAge=ageDiff} 
			}
	        else if(ageDiff > 0)
	        {	//非夸年
	            if(nowMonth == birthMonth)
	            {	//
	                var dayDiff = nowDay - birthDay;//日之差
	                if(dayDiff < 0)
	                {
	                    returnAge = ageDiff - 1;
	                }
	                else
	                {
	                    returnAge = ageDiff ;
	                }
	            }
	            else
	            {
	                var monthDiff = nowMonth - birthMonth;//月之差
	                if(monthDiff < 0)
	                {
	                    returnAge = ageDiff - 1;
	                }
	                else
	                {
	                    returnAge = ageDiff ;
	                }
	            }
	            return returnAge;
	        }
	        else
	        {
	            returnAge = -1;//返回-1 表示出生日期输入错误 晚于今天
	        }
	    }
	    return returnAge;
}
function DHCWeb_GetAgeFromBirthDayA(BirthDay)
{
	return GetAgeFromBirth(BirthDay);
	
	
	var myAge="";
	if (BirthDay==""){
		return "";
	}
	var bage=BirthDay;
	bage=bage.substring(0,4);
	var now = new Date();
    var yy = now.getFullYear();
	var myAge=yy-bage;
	return myAge;
}

function DHCWeb_GetAgeFromBirthDayB(BirthName)
{
	var myAge="",myMonth="",myDay="";
	var myobj=document.getElementById(BirthName);
	if (myobj)
	{
		var bage=myobj.value;
		var yybage=bage.substring(0,4);
		var mmbage=bage.substring(5,7);
		var ddbage=bage.substring(8,10);
    
		var now = new Date();
    var yy = now.getFullYear();
    var mm = parseInt(now.getMonth()) + 1;
    var dd = now.getDate();
		var myAge=yy-yybage;
		var myMonth=Math.abs(mm-mmbage);
		var myDay=Math.abs(dd-ddbage);	
	}
	return myAge+"-"+myMonth+"-"+myDay;
}

///Get BirthDay from Age
function DHCWeb_GetBirthDayFromAge(AgeName)
{
	var myBirthDay=""
	var myobj=document.getElementById(AgeName);
	if (myobj)
	{
		var myage=myobj.value;
		if (isNaN(myage)){myage=0;}
		
		if (myage==""){
			return myBirthDay;
		}
		var mynow = new Date();
        var yy = mynow.getFullYear();
		var myYear=yy-myage;
		var myMonth = mynow.getMonth()+1;
		if (myMonth.toString().length==1){
			myMonth="0"+myMonth;
		}
		var myDate = mynow.getDate();
		if (myDate.toString().length==1){
			myDate="0"+myDate;
		}
		myBirthDay=myYear + "-"+ myMonth + "-" + myDate;
	}
	return myBirthDay;
}

function DHCWeb_EStopSpaceKey()
{
	if(event.keyCode == 8)
    {
        if(event.srcElement.tagName.toLowerCase() != "input"
           && event.srcElement.tagName.toLowerCase() != "textarea")
            event.returnValue = false;
	}
}

function DHCWeb_SetLimitNumABC(e)
{
	if(!e){
		var e = event?event:(window.event?window.event:null);
	}
	var key=e.keyCode;
	
	////if ((((key>47)&&(key<58))||(key==46)||(key==8)))
	
	if ((((key>47)&&(key<58))||(key==46)||(key==8)||((key>95)&&(key<106))||(key==37)||(key==38)||(key==39)||(key==40)))
	{}
	else
	{
		///event.returnValue=false;
		e.keyCode=0;
	}
}

function SetLimitNum(e)
{
	if(!e){
		var e = event?event:(window.event?window.event:null);
	}
	var key=e.keyCode;
	if (((key>47)&&(key<58))||(key==46)||(key==8)) 
	{}
	else
	{
		///event.returnValue=false;
		e.keyCode=0;
	}
}

function DHCWeb_SetLimitNum(){
	var mykey=event.keyCode;
	////||(mykey==44)
	if (mykey==13){
		return;
	}
	if ((mykey>57)||(mykey<48)){
		event.keyCode=0;
		return;
	}
}

function DHCWeb_SetLimitFloat(){
	var mykey=event.keyCode;
	////||(mykey==44)
	if (mykey==13){
		return;
	}
	if ((mykey>57)||(mykey<46)||(mykey==47)){
		event.keyCode=0;
		return;
	}
}


function DHCWeb_nextfocus(ename) {
	//alert(ename);
	for (var j=0;j<document.all.length;j++) {
		//alert(document.all[j].name);
		if ((websys_canfocus(document.all(j)))&&(document.all[j].name==ename) ) {
			websys_nextfocus(j);
			break;
		}
	}
}


function DHCWeb_Calobj(obj1,obj2,resobj,caloption)
{
	if ((obj1)&&(obj2))   //+-*%
	{
		var mynum1=parseFloat(obj1.value);
		if (isNaN(mynum1)) {var mynum1=0;}
		var mynum2=parseFloat(obj2.value);
		if (isNaN(mynum2)) {mynum2=0;}
		switch (caloption)
		{
			case "-":
				var myres=mynum1-mynum2;
				break;
			case "+":
				var myres=mynum1+mynum2;
				break;
			case "*":
				var myres=mynum1*mynum2;
				break;
			case "%":
				var myres=mynum2/mynum1;
				break;
			default:
				var myres=mynum1*mynum2;
				break;
		}
		myres=parseFloat(myres)+0.0000001;
		resobj.value =myres.toFixed(2).toString();
		return myres.toFixed(2);
	}
}

function DHCWeb_CalobjA(Num1,Num2,caloption)
{
	var mynum1=parseFloat(Num1);
	if (isNaN(mynum1)) {var mynum1=0;}
	var mynum2=parseFloat(Num2);
	if (isNaN(mynum2)) {mynum2=0;}
	switch (caloption)
	{
		case "-":
			var myres=mynum1-mynum2;
			break;
		case "+":
			var myres=mynum1+mynum2;
			break;
		case "*":
			var myres=mynum1*mynum2;
			break;
		case "%":
			var myres=mynum2/mynum1;
			break;
		default:
			var myres=mynum1*mynum2;
			break;
	}
	myres=parseFloat(myres)+0.00001;
	//resobj.value = myres.toFixed(2).toString();
	return myres.toFixed(2);
}

Number.prototype.toFixed=function(len) 
{
	///4  Re  5  to 10
	if(isNaN(len)||len==null) 
	{
		len = 0;
	}else {
		if(len<0){
			len = 0;
		}
	}
    return Math.round(this * Math.pow(10,len))/Math.pow(10,len); 
} 

Number.prototype.toRound=function(len,RNum)
{
	///5  Re  6  to 10
	if(isNaN(len)||len==null) 
	{
		len = 0;
	}else {
		if(len<0){
			len = 0;
		}
	}
	
    return Math.round(((this * Math.pow(10,len+1))-(RNum-5)+0.5)/Math.pow(10,1))/Math.pow(10,len);
}


String.prototype.Trim=function(){   
  return this.replace(/(^\s*)|(\s*$)/g,"");   
}

Array.prototype.indexOf = function(v)
{
	for(var i = this.length; i-- && this[i] !== v;);
	return i; 
}
	 

//Number.prototype.toFixed=function(len)
function DD()
{
    var add = 0;
    var s,temp;
    var s1 = this + "";
    var start = s1.indexOf(".");
    if(s1.substr(start+len+1,1)>=5)add=1;
    var temp = Math.pow(10,len);
    s = Math.floor(this * temp) + add;
    return s/temp;
}


function DHCWeb_SetListStyle(SObj,TObj)	{
		Stop=parseInt(SObj.style.top,10);
		if (isNaN(Stop)) {var Stop=0};
		Sleft=parseInt(SObj.style.left,10);
		if (isNaN(Sleft)) {var Sleft=0};
		Swidth=parseInt(SObj.style.width,10);
		if (isNaN(Swidth)) {var Swidth=0};
		Sheight=parseInt(SObj.style.height,10);
		if (isNaN(Sheight)) {var Sheight=0};
		//
		//if (TObj) alert(TObj.style.top);
		Ttop=parseInt(TObj.style.top,10);
		if (isNaN(Ttop)) {var Ttop=0};
		Tleft=parseInt(TObj.style.left,10);
		if (isNaN(Tleft)) {var Tleft=0};
		Twidth=parseInt(TObj.style.width,10);
		if (isNaN(Twidth)) {var Twidth=0};
		Theight=parseInt(TObj.style.height,10);
		if (isNaN(Theight)) {var Theight=0};
		//
		Ttop=Stop;
		Tleft=Sleft;
		Twidth=Swidth+330;
		Theight=100;
		//
		Ttop=Ttop.toString(10)+"px";
		Tleft=Tleft.toString(10)+"px";
		Twidth=Twidth.toString(10)+"px";
		Theight=Theight.toString(10)+"px";
		//
		TObj.style.top=Ttop;
		TObj.style.left=Tleft;
		TObj.style.width=Twidth;
		TObj.style.height=Theight;
}
function DHCWeb_ResetStyle(Obj)	{
		Obj.style.width="0px";
		Obj.style.height="0px";
}

function DHCWeb_ChkRead(objName)
{
	var obj=document.getElementById(objName);
	if (obj) {
		try {
			//obj.focus();
			if (obj.readOnly){return true;}
			else{return false;}
		} catch(e) {}
	}
}

function DHCWeb_GetRowIdx(wobj)
{
	try{
		var eSrc=wobj.event.srcElement;
		if (eSrc.tagName=="IMG") eSrc=wobj.event.srcElement.parentElement;
		var rowObj=getRow(eSrc);
		var selectrow=rowObj.rowIndex;
		return 	selectrow
	}catch(e)
	{
		alert(e.toString());
		return -1;
	}
}

function DHCWeb_GetRowCount(wobj)
{
	try{
		var tabOPList=wobj.document.getElementById('tDHCOPOEList');
		var rows=tabOPList.rows.length-1;
		return 	rows
	}catch(e)
	{
		alert(e.toString());
		return -1;
	}
}

function DHCWeb_GetTBRows(TbName)
{
	try{
		var myrows=0;
		var tabObj=document.getElementById(TbName);
		if (tabObj){
			var myrows=tabObj.rows.length-1;
		}
		return myrows;
	}catch(e){
		alert(e.toString);
		return 0;
	}
}

function DHCWeb_WPPrint(){
	
	var teststr="\\\\192.168.2.188\\TrakCareP5\\web\\config.xml"
	var mystr="";
	

	var myobj=document.getElementById("ClsBillPrint");
	//alert(teststr+":::::"+mystr);
	var rtn=myobj.ToPrint(teststr,mystr);
	//alert(rtn);
	return rtn;
}

function DHCWeb_LoadCLSID()
{
	var mywin=parent.window.open("","","width=0,height=0");
	var mydoc=mywin.document;
	mydoc.write("<object ID='ClsBillPrint' WIDTH=0 HEIGHT=0 CLASSID='CLSID:F30DC1D4-5E29-4B89-902F-2E3DC81AE46D' CODEBASE='../addins/client/DHCOPPrint.CAB#version=1,0,0,0' VIEWASTEXT>");
	mydoc.write("</object>");

	var teststr="E:\config.xml"
	var mystr="PatName" +String.fromCharCode(2) + "Check^";
	mystr+="FeeSum" +String.fromCharCode(2) + "100^";
	mystr+="FeeCapSum" +String.fromCharCode(2) + "1000^";
	
	var myobj=mydoc.getElementById("ClsBillPrint");
	var rtn=myobj.ToPrint(teststr,mystr);
	mywin.opener=null;
	mywin.close();
	
}

function convertCurrency(currencyDigits) {
 	var MAXIMUM_NUMBER = 99999999999.99;
 	// Predefine the radix characters and currency symbols for output:
 
// Variables:
 var integral; // Represent integral part of digit number.
 var decimal; // Represent decimal part of digit number.
 var outputCharacters; // The output result.
 var parts;
 var digits, radices, bigRadices, decimals;
 var zeroCount;
 var i, p, d;
 var quotient, modulus;
 
// Validate input string:
 currencyDigits = currencyDigits.toString();
 if (currencyDigits == "") {
  alert("Empty input!");
  return "";
 }
 if (currencyDigits.match(/[^,.\d]/) != null) {
  alert("Invalid characters in the input string!");
  return "";
 }
 if ((currencyDigits).match(/^((\d{1,3}(,\d{3})*(.((\d{3},)*\d{1,3}))?)|(\d+(.\d+)?))$/) == null) {
  alert("Illegal format of digit number!");
  return "";
 }
 
// Normalize the format of input digits:
 currencyDigits = currencyDigits.replace(/,/g, ""); // Remove comma delimiters.
 currencyDigits = currencyDigits.replace(/^0+/, ""); // Trim zeros at the beginning.
 // Assert the number is not greater than the maximum number.
 if (Number(currencyDigits) > MAXIMUM_NUMBER) {
  alert("Too large a number to convert!");
  return "";
 }
 
// Process the coversion from currency digits to characters:
 // Separate integral and decimal parts before processing coversion:
 parts = currencyDigits.split(".");
 if (parts.length > 1) {
  integral = parts[0];
  decimal = parts[1];
  // Cut down redundant decimal digits that are after the second.
  decimal = decimal.substr(0, 2);
 }
 else {
  integral = parts[0];
  decimal = "";
 }
 // Prepare the characters corresponding to the digits:
 digits = new Array(CN_ZERO, CN_ONE, CN_TWO, CN_THREE, CN_FOUR, CN_FIVE, CN_SIX, CN_SEVEN, CN_EIGHT, CN_NINE);
 radices = new Array("", CN_TEN, CN_HUNDRED, CN_THOUSAND);
 bigRadices = new Array("", CN_TEN_THOUSAND, CN_HUNDRED_MILLION);
 decimals = new Array(CN_TEN_CENT, CN_CENT);
 // Start processing:
 outputCharacters = "";
 // Process integral part if it is larger than 0:
 if (Number(integral) > 0) {
  zeroCount = 0;
  for (i = 0; i < integral.length; i++) {
   p = integral.length - i - 1;
   d = integral.substr(i, 1);
   quotient = p / 4;
   modulus = p % 4;
   if (d == "0") {
    zeroCount++;
   }
   else {
    if (zeroCount > 0)
    {
     outputCharacters += digits[0];
    }
    zeroCount = 0;
    outputCharacters += digits[Number(d)] + radices[modulus];
   }
   if (modulus == 0 && zeroCount < 4) {
    outputCharacters += bigRadices[quotient];
   }
  }
  outputCharacters += CN_DOLLAR;
 }
 // Process decimal part if there is:
 if (decimal != "") {
  for (i = 0; i < decimal.length; i++) {
   d = decimal.substr(i, 1);
   if (d != "0") {
    outputCharacters += digits[Number(d)] + decimals[i];
   }
  }
 }
 // Confirm and return the final output string:
 if (outputCharacters == "") {
  outputCharacters = CN_ZERO + CN_DOLLAR;
 }
 if (decimal == "") {
  outputCharacters += CN_INTEGER;
 }
 outputCharacters = CN_SYMBOL + outputCharacters;
 return outputCharacters;
}

function DHCWeb_replaceAll(src,fnd,rep) 
{ 
	//rep:replace
	//src:source
	//fnd:find
	if (src.length==0) 
	{ 
		return ""; 
	} 
	try{
		var myary=src.split(fnd);
		var dst=myary.join(rep);
	}catch(e){
		alert(e.message);
		return ""
	}
	return dst; 
} 

function DHCWeb_TextEncoder(transtr){
	if (transtr.length==0){
		return "";
	}
	var dst=transtr;
	try{
		dst = DHCWeb_replaceAll(dst, '\\"', '\"');
		dst = DHCWeb_replaceAll(dst, "\\r\\n", "\r\t");
		dst = DHCWeb_replaceAll(dst, "\\r", "\r");
		dst = DHCWeb_replaceAll(dst, "\\n", "\n");
		dst = DHCWeb_replaceAll(dst, "\\t", "\t");
	}catch(e){
		alert(e.message);
		return "";
	}
	return dst;
}

function DHCWeb_setfocus(objName) {
	window.setTimeout('DHCWeb_setfocus2(\''+objName+'\')',500);
}

function DHCWeb_setfocus2(objName) {
	///alert(objName);
	var obj=document.getElementById(objName);
	if (obj) {
		try {
			obj.focus();
			obj.select();
		} catch(e) {}
	}
}

function DHCWeb_OtherDocsetfocus(frameName,objName) {
	window.setTimeout('DHCWeb_OtherDocsetfocus2(\''+ frameName +'\', \''+objName+'\')',2000);
}

function DHCWeb_OtherDocsetfocus2(frameName, objName) {
	var obj = parent.frames[frameName].document.getElementById(objName);
	if (obj) {
		try {
			obj.focus();
			obj.select();
		} catch(e) {}
	}
}
///Lid
///2011-09-15
///设置其他Document上元素的值
function DHCWeb_OtherDocSetObjValue(frameName,objName,value){
	try{
		var obj=parent.frames[frameName].document.getElementById(objName);
		if(obj){
			switch (obj.type){
				case "select-one":
				DHCWebD_ClearAllList(obj);
				var myrows=obj.options.length;
				obj.options[myrows]=new Option(value,"");
				obj.selectedIndex=0;
				break;
			case "checkbox":
				obj.checked=value;
				break;
			case "text":
				obj.value=value;
				break;
			default:
				obj.value=value;
				break;		
			};	
		}	
	}catch(e){
		
	}
}
///Lid
///2011-09-15
///获取其他Document上元素的值
function DHCWeb_OtherDocGetObjValue(frameName,objName){
	try{
		var transval=""
		var obj=parent.frames[frameName].document.getElementById(objName);
		if(obj){
			switch (obj.type){
				case "select-one":
					myidx=obj.selectedIndex;
					transval=obj.options[myidx].text;
					break;
				case "checkbox":
					transval=obj.checked;
					break;
				case "dhtmlXCombo":
					transval=obj.getSelectedValue();
					break;
				default:
					transval=obj.value;
					break;
			}	
		}
		return transval;	
	}catch(e){
		return "";
	}
}
////Disable the Button;
function DHCWeb_DisBtn(obj){
	obj.disabled=true;
	obj.style.color="gray";
	obj.onclick=function(){return false;}
}
//Lid 2010-07-19 Availability the Button
function DHCWeb_AvailabilityBtn(obj){
	obj.disabled=false;
	obj.style.color="blue";
	obj.onclick=function(){return true;}
		
}
////Disable the Button;
function DHCWeb_DisBtnA(objName){
	var obj=document.getElementById(objName);
	if (obj){
		obj.disabled=true;
		obj.style.color="gray";
		obj.onclick=function(){return false;}
	}
}

function DHCWeb_AvailabilityBtnA(obj,fun){
	obj.disabled=false;
	obj.style.color="blue";
	if(fun) obj.onclick = fun; 		
}

function DHCWeb_AddToList(ListName,txtdesc,valdesc,ListIdx)	{
	var ListObj=document.getElementById(ListName);
	if (!ListObj){
		return;
	}
	var aryitmdes=txtdesc		//.split("^");
	var aryitminfo=valdesc		//.split("^");
	if (aryitmdes.length>0)	{
		ListObj.options[ListIdx] = new Option(aryitmdes,aryitminfo);	//,aryval[i]	
	}
}

function DHCWeb_AddToListA(ListName,txtdesc,valdesc,ListIdx,SelFlag)	{
	var ListObj=document.getElementById(ListName);
	if (!ListObj){
		return;
	}
	var aryitmdes=txtdesc		//.split("^");
	var aryitminfo=valdesc		//.split("^");
	if (aryitmdes.length>0)	{
		ListObj.options[ListIdx] = new Option(aryitmdes,aryitminfo);	//,aryval[i]	
		if (isNaN(SelFlag)){ SelFlag=0;}
		if (SelFlag==1){
			ListObj.options[ListIdx].selected=true;
			
			///ListObj.selectedIndex=ListIdx;
		}
	}
}

function DHCWeb_GetListBoxValue(ObjName)
{
	///get ListBox Control Current Value;
	
	var myValue="";
	var obj=document.getElementById(ObjName);
	if (obj){
		var myIdx=obj.options.selectedIndex;
		if(myIdx<0){
			return myValue;
		}
		myValue=obj.options[myIdx].value;
	}
	return myValue;
	
}

function DHCWeb_SetListDefaultValue(ObjName,DefValue,SplitVal,DefIdx)
{
	///Set Default Value by Default Value;
	///DefIdx:  Default Value Position
	///
	if (SplitVal==""){
		return;
	}
	
	var myValue="";
	var obj=document.getElementById(ObjName);
	if (obj){
		var mylen=obj.options.length;
		for (var myIdx=0;myIdx<mylen;myIdx++){
			myValue=obj.options[myIdx].value;
			var myary=myValue.split(SplitVal);
			if (myary[DefIdx]==DefValue){
				obj.options.selectedIndex=myIdx;
				break;
			}
		}
	}
}

function DHCWeb_TransListData(SName,TName)
{
	try{
		var sobj=document.getElementById(SName);
		var tobj=document.getElementById(TName);
		if((sobj)&&(tobj)){
			var myIdx=sobj.options.selectedIndex;
			if (myIdx>=0){
				var myoptobj=sobj.options[myIdx];
				var myListIdx=tobj.length;
				tobj.options[myListIdx]=new Option(myoptobj.text, myoptobj.value);
				sobj.options[myIdx]= null;
				if ((myIdx+1)<sobj.options.length){
					sobj.options[myIdx].selected=true;
				}else{
					//考虑第一行选中情况
					if ((myIdx==0)||(myIdx-1<0))
					{
						var Lsobj=sobj.options.length;
						for (var jLindex=0; jLindex<Lsobj;jLindex++ )
						{
							if (sobj.options(jLindex))
							{
								sobj.options(jLindex).selected=true;
								break;
							}
						}
					}
					else{
						sobj.options[myIdx-1].selected=true;
					}
				}
			}
		}
	}catch(e){}
}



function nextfocus(e) {
	if(!e){
		var e = event?event:(window.event?window.event:null);
	}
	var eSrc=window.event.srcElement;
	//alert(eSrc.tabIndex);
	var key=websys_getKey(e);
	if (key==13) {
		websys_nexttab(eSrc.tabIndex);
	}
}

function DHCWeb_Nextfocus(e){
	if(!e){
		var e = event?event:(window.event?window.event:null);
	}
	var eSrc=window.event.srcElement;
	//alert(eSrc.tabIndex);
	var key=websys_getKey(e);
	if (key==13) {
		websys_nexttab(eSrc.tabIndex);
	}
}

function DHCWeb_NextfocusA(e){
	if(!e){
		var e = event?event:(window.event?window.event:null);
	}
	var eSrc=window.event.srcElement;
	//alert(eSrc.tabIndex);
	var key=websys_getKey(e);
	if (key==13) {
		websys_nexttab(eSrc.tabIndex);
	}
}


function DHCWeb_IsDate(DateString,Dilimeter) 
{
	if (DateString==null) return false; 
	if (Dilimeter=='' || Dilimeter==null) 
	Dilimeter ='-'; 
	var tempy=''; 
	var tempm=''; 
	var tempd=''; 
	var tempArray; 
	if (DateString.length<8 && DateString.length>10) 
		return false;  
	tempArray = DateString.split(Dilimeter); 
	if (tempArray.length!=3) 
		return false; 
	if (tempArray[0].length==4) 
	{ 
		tempy = tempArray[0]; 
		tempd = tempArray[2]; 
	} else 
	{ 
		tempy = tempArray[2]; 
		tempd = tempArray[1]; 
	} 
	tempm = tempArray[1]; 
	var tDateString = tempy + '/'+tempm + '/'+tempd+' 8:0:0';//加八小时是因为我们处于东八区 
	//alert(tempy+"^"+tempd)
	//alert(tDateString)
	var tempDate = new Date(tDateString); 
	//if (isNaN(tempDate)) 
	//return false; 
	tempm=eval(tempm)-1
	tempd=eval(tempd)
	//alert(tempDate.getUTCFullYear().toString()+"^"+tempy+"  "+tempDate.getMonth()+"^"+tempm+"  "+tempDate.getDate()+"^"+tempd)
	if (((tempDate.getUTCFullYear()).toString()==tempy) && (tempDate.getMonth()==tempm) && (tempDate.getDate()==parseInt(tempd))) 
	{ 
		return true; 
	} 
	else 
	{ 
		return false; 
	} 
}

function DHCWebD_AutoSetDocValue(InfoStr,Spt1,Spt2){
	if (InfoStr==""){
		return;
	}
	
	var myAry=InfoStr.split(Spt1);
	var myCount=myAry.length;
	for(var i=0;i<myCount;i++){
		var myinfoary=myAry[i].split(Spt2);
		
		DHCWebD_SetObjValueC(myinfoary[0],myinfoary[1]);
	}
	
}

////Look Up Item Trans Keypress event
function DHCWeb_LookUpItemTransKeyPress(e)
{
	if(!e){
		var e = event?event:(window.event?window.event:null);
	}
	var type=websys_getType(e);
	var key=websys_getKey(e);
	///alert(type+ "  "+key);
	///evtName
	if ((type=='keypress')&&(key==13)){
		var eSrc=window.event.srcElement;
		var myobj=document.getElementById(eSrc.name);
		if ((myobj)&&(myobj.onkeydown)) {
			var myNewEvent=document.createEventObject();
			myNewEvent.keyCode = 117;
			myobj.fireEvent("onkeydown",myNewEvent);
			event.cancleBubble=true;
		}
	}
}


////Auto Exec
//DHCWebD_SetStatusTip();

function DHCWebD_SetStatusTip(){
	window.defaultStatus=session['LOGON.USERCODE']+"     "+session['LOGON.USERNAME'] + "    "+session['LOGON.GROUPDESC'];
	////top.document.title+ "    "+
	var myStatusTip="^"+session['LOGON.USERCODE']+"     "+session['LOGON.USERNAME'] + "    "+session['LOGON.GROUPDESC'];
	var myary=top.document.title.split("^");
	top.document.title=myary[0]+ "    "+myStatusTip
	//window.status=session['LOGON.USERCODE']+"     "+session['LOGON.USERNAME'] + "    "+session['LOGON.GROUPDESC'];
}

function DHCWeb_GetSessionPara()
{
	var mystr="";
	///session['LOGON.SITECODE']='DHCHealth';
	/////session['LOGON.USERID']='2';
	////session['LOGON.USERCODE']='cashier';
	////session['LOGON.USERNAME']='cashier';
	////session['LOGON.GROUPID']='5';
	////session['LOGON.GROUPDESC']='Outpatient Cashier';
	////session['LOGON.LANGID']='101';
	////session['LOGON.CTLOCID']='207';
	////session['XMONTHSSHORT']='Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec';
	////session['CONTEXT']='';
	
	mystr+="^";			///IP
	mystr+=session['LOGON.USERID']+"^";
	mystr+=session['LOGON.CTLOCID']+"^";
	mystr+=session['LOGON.GROUPID']+"^";
	mystr+="^";
	mystr+=session['LOGON.SITECODE']+"^";
	
	return mystr;
}

///Lid
	///验证是否为小数
	function isNumeric(strValue){   
	       var objExp=/(^-?\d\d*\.\d*$)|(^-?\d\d*$)|(^-?\.\d\d*$)/;     
	       return   objExp.test(strValue);   
	} 
	///Lid
	///验证是否为整数  
	function isInteger(strValue)     
	{   
	      var objExp=/(^-?\d\d*$)/;   
	      return objExp.test(strValue);   
	} 
///显示图片
//根据病人ID和显示图片按钮ID
function ShowPicByPatientID(PatientID,PicElementName)
{
	var picType=".jpg"
	var PicFilePath="D:\\"
	var src="ftp://administrator:123456@10.72.16.158:21/picture/"+PatientID+picType
	ShowPicBySrc(src,PicElementName);
}
//根据图片路径和显示图片按钮ID
function ShowPicBySrc(src,PicElementName)
{
	var NoExistSrc="ftp://administrator:123456@10.72.16.158:21/picture/blank.jpg"; //没有保存照片时显示的图片
	var obj=document.getElementById(PicElementName);
	if (obj) obj.innerHTML='<img SRC='+src+' BORDER="0" width=90 height=140 onerror=this.src="'+NoExistSrc+'">'
	//alert(document.getElementById(PicElementName).innerHTML)
	//document.getElementById(PicElementName).innerHTML='<img SRC='+src+' BORDER="0" width=90 height=140>'
  
}
function ShowPicBySrcNew(src,PicElementName){
	var obj=document.getElementById(PicElementName);
	if (obj) obj.src=src;
}
//判断文件是否存在
function PicFileIsExist(filespec) 
{ 
      var   fso,   s   =   filespec; 
      fso   =   new   ActiveXObject( "Scripting.FileSystemObject"); 
      if   (fso.FileExists(filespec)) 
           return true;
      else   
           return false; 
}
/*
*转换Base64的串为图片
document.write("<OBJECT ID='Photo' CLASSID='CLSID:6939ADA2-0045-453B-946F-44F0D6424D8A' CODEBASE='../addins/client/Photo.CAB#version=2,0,0,20'></OBJECT>");
function ChangeStrToPhoto(PAPMIDR)
{
	try{
		//var Photo= new ActiveXObject("PhotoProject.Photo");
		var FileName="c:\\"+PAPMIDR+".bmp"
		Photo.FileName=FileName; //保存图片的名称包括后缀
		Photo.PatientID=PAPMIDR //PA_PatMas表的ID
		Photo.ChangePicture()
		if (PicFileIsExist(FileName)){
			Photo.AppName="picture/" //ftp目录
			Photo.DBFlag="1"  //是否保存到数据库  0  1
			Photo.FTPFlag="1" //是否上传到ftp服务器  0  1 
			Photo.SaveFile() //对于已经存在图片保存到数据库同时上传FTP的标志有效
		}
	}catch(e){}
}
**/
/**
*wanghc
*@param: idString
*@param: type=[T,null] 当type为T字符串时,当tableitem处理,否则当item处理
*/
function DHCWeb_GetValue(idName){
     var obj = document.getElementById(idName);
     if (!obj) return "" ;
     var v = "";
     switch (obj.tagName){
          case "INPUT":
               v = obj.value;
               if(obj.type=="checkbox"){
                       v = obj.checked;
                 }else if(obj.type=="select-one"){
                       v = obj.options[obj.selectedIndex].text
                 }else if(obj.type=="dhtmlXCombo"){
                       v = obj.getSelectedValue();
                 }
             break;
          case "LABEL":
               v = obj.innerText; //table item
             break;
          case "SELECT":
               v = obj.options[obj.selectedIndex].value;
             break;
          default:
               v = obj.value;
             break;
             }
       return v;
}
//对比日期
function CompareDate(DateFrom,DateTo)
{
	DateFrom=DateFrom.replace(/(^\s*)|(\s*$)/g, "")
	DateTo=DateTo.replace(/(^\s*)|(\s*$)/g, "")
	if ((DateFrom=="")||(DateTo=="")) {return true}
	var FlagCompare=tkMakeServerCall('web.DHCDocOrderCommon','CompareDate',DateFrom,DateTo);
	if  ((FlagCompare==1)||(FlagCompare==2)){return true}
	else{return false}
}

///----------------根据身份证获取性别，并且检测身份证信息有效性
var powers=new Array("7","9","10","5","8","4","2","1","6","3","7","9","10","5","8","4","2");
var parityBit=new Array("1","0","X","9","8","7","6","5","4","3","2");
var SexByID="";
function validId(_id){
    if(_id=="")return;
    var _valid=false;
    if(_id.length==15){
        _valid=validId15(_id);
    }else if(_id.length==18){
        _valid=validId18(_id);
    }
    if(!_valid){
        alert("身份证号码有误,请检查!");
        return -1;
    }
    //设置性别
	return SexByID
}   
//18位的身份证号码验证
function validId18(_id){
    _id=_id+"";
	var CheckIdRtn=CheckIdCard(_id);
	if (CheckIdRtn!="0") {
		return false;
	}else{
		return true;
	}
	
	//--------------------------------以下不用----------------------
    var _num=_id.substr(0,17);
    var _parityBit=_id.substr(17);
    var _power=0;
    for(var i=0;i< 17;i++){
        //校验每一位号码的合法性
        if(_num.charAt(i)<'0'||_num.charAt(i)>'9'){
            return false;
            break;
        }else{
            //加权
            _power+=parseInt(_num.charAt(i))*parseInt(powers[i]);
            //设置性别
            if(i==16&&parseInt(_num.charAt(i))%2==0){
                SexByID="女";
            }else{
                SexByID="男";
            }
        }
    }
    //取模
    var mod=parseInt(_power)%11;
    if(parityBit[mod]==_parityBit){
        return true;
    }
    return false;
}
//15位身份证校验
function validId15(_id){
    _id=_id+"";
	var CheckIdRtn=CheckIdCard(_id);
	if (CheckIdRtn!="0") {
		return false;
	}else{
		return true;
	}
	
	//--------------------------------以下不用----------------------
    for(var i=0;i<_id.length;i++){
        //校验每一位身份证号码的合法性
        if(_id.charAt(i)<'0'||_id.charAt(i)>'9'){
            return false;
            break;
        }
    }
    var year=_id.substr(6,2);
    var month=_id.substr(8,2);
    var day=_id.substr(10,2);
    var sexBit=_id.substr(14);
    //校验年份位
    if(year<'01'||year >'90')return false;
    //校验月份
    if(month<'01'||month >'12')return false;
    //校验日
    if(day<'01'||day >'31')return false;
    //设置性别
    if(sexBit%2==0){
        SexByID="女";
    }else{
        SexByID="男";
    }
    return true;
}

//----------------------------------------------------------
//    功能：检查身份证号码
//    参数：idcard 
//    返回值：
//----------------------------------------------------------
function CheckIdCard(idcard){ 
	var Errors=new Array( 
		"0",
		"身份证号码位数不对!", 
		"身份证号码出生日期超出范围或含有非法字符!", 
		"身份证号码校验错误!", 
		"身份证地区非法!" 
	); 
	var area={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江",
　　　　　　31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",
　　　　　　41:"河南",42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏",
　　　　　　61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"} 

	var idcard,Y,JYM; 
	var S,M; 
	var idcard_array = new Array(); 
　　idcard_array = idcard.split(""); 
　　//地区检验 
	if(area[parseInt(idcard.substr(0,2))]==null) return Errors[4]; 
　　//身份号码位数及格式检验 
	switch(idcard.length){ 
		case 15:
			//15位身份号码检测 
			if ( (parseInt(idcard.substr(6,2))+1900) % 4 == 0 || ((parseInt(idcard.substr(6,2))+1900) % 100 == 0 && (parseInt(idcard.substr(6,2))+1900) % 4 == 0 )){
					ereg=/^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/;//测试出生日期的合法性 
			} else { 
　　　　　　　　ereg=/^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/;//测试出生日期的合法性 
　　　　　　} 
			if(ereg.test(idcard)) {return Errors[0];}else{return Errors[2];}
　　　　　　break; 
		case 18:
		　　//18位身份号码检测 
		　　//出生日期的合法性检查 
		　　//闰年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9])) 
		　　//平年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8])) 
			if ( parseInt(idcard.substr(6,4)) % 4 == 0 || (parseInt(idcard.substr(6,4)) % 100 == 0 && parseInt(idcard.substr(6,4))%4 == 0 )){
				ereg=/^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/;//闰年出生日期的合法性正则表达式 
　　　　　　} else { 
　　　　　　　　ereg=/^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/;//平年出生日期的合法性正则表达式 
　　　　　　} 
			if(ereg.test(idcard)){
			//测试出生日期的合法性 
　　　　　　//计算校验位 
　　　　　　S = (parseInt(idcard_array[0]) + parseInt(idcard_array[10])) * 7 
　　　　　　　　+ (parseInt(idcard_array[1]) + parseInt(idcard_array[11])) * 9 
　　　　　　　　+ (parseInt(idcard_array[2]) + parseInt(idcard_array[12])) * 10 
　　　　　　　　+ (parseInt(idcard_array[3]) + parseInt(idcard_array[13])) * 5 
　　　　　　　　+ (parseInt(idcard_array[4]) + parseInt(idcard_array[14])) * 8 
　　　　　　　　+ (parseInt(idcard_array[5]) + parseInt(idcard_array[15])) * 4 
　　　　　　　　+ (parseInt(idcard_array[6]) + parseInt(idcard_array[16])) * 2 
　　　　　　　　+ parseInt(idcard_array[7]) * 1 
　　　　　　　　+ parseInt(idcard_array[8]) * 6 
　　　　　　　　+ parseInt(idcard_array[9]) * 3 ; 
　　　　　　　　Y = S % 11; 
　　　　　　　　M = "F"; 
　　　　　　　　JYM = "10x98765432"; 
　　　　　　　　M = JYM.substr(Y,1);//判断校验位 
			if(M == idcard_array[17]) return Errors[0]; //检测ID的校验位 
			else return Errors[3]; 
　　　　}else {
			return Errors[2];
		}
			break; 
　　　　default: 
			return Errors[1]; 
			break; 
　　} 

}

//通过出生日期获取到今天的年龄-调用计费组接口
function GetAgeNew(Bob,Date)
{
	var AgeDesc=tkMakeServerCall('web.DHCDocCommon','GetAgeDescNew',Bob,Date);
	return AgeDesc
}

function DHCWeb_GetColumnData(ColName,Row){
	var CellObj=document.getElementById(ColName+"z"+Row);
	if (CellObj){ 
		if (CellObj.tagName=='LABEL'){
			return CellObj.innerText;
		}else{
			if (CellObj.type=="checkbox"){
				return CellObj.checked;
			}else{
				return CellObj.value;
			}
		}
	}
	return "";
}
function DHCWeb_SetColumnData(ColName,Row,Val){
	var CellObj=document.getElementById(ColName+"z"+Row);
	if (CellObj){
		if (CellObj.tagName=='LABEL'){
			CellObj.innerText=Val;
		}else{
			if (CellObj.type=="checkbox"){
				CellObj.checked=Val;
			}else{
				CellObj.value=Val;
			}
		}
	}
}

/**
 * Creator: ZhYW
 * CreatDate: 2017-12-19
 * Description: 门诊收费结算失败提示
 */
function chargeFail_alert(flag, errCode, job) {
	var errMsg = '';
	switch (flag) {
		case 'preChargeFail':
			errMsg = '预结算失败 ';
			break;
		case 'completeFail':
			errMsg = '确认完成失败 ';
			break;
		case 'refundFail':
			errMsg = '退费失败 ';
			break;
		default:
		
	}
	switch (+errCode) {
		case 101:
			//alert(errMsg + '门诊结算没有数据' + ': ' + errCode);
			var myrtn = window.confirm(errMsg + '门诊结算没有数据' + ': ' + errCode + ",是否查看明细");
			if (myrtn) {
				var Str='dhcbill.opbill.chargeexception.csp?job='+job;
				window.open(Str, '_blank', 'toolbar=no,location=no,directories=no,status=yes,menubar=no,scrollbars=yes,resizable=yes,copyhistory=yes,width=1300,height=750,left=0,top=0');
			}
			break;
		case 102:
			//alert(errMsg + '患者的支付金额不符' + ': ' + errCode);
			var myrtn = window.confirm(errMsg + '患者的支付金额不符' + ': ' + errCode + ",是否查看明细");
			if (myrtn) {
				var Str='dhcbill.opbill.chargeexception.csp?job='+job;
				window.open(Str, '_blank', 'toolbar=no,location=no,directories=no,status=yes,menubar=no,scrollbars=yes,resizable=yes,copyhistory=yes,width=1300,height=750,left=0,top=0');
			}
			break;
		case 103:
			alert(errMsg + '门诊收费重新生成账单错误' + ': ' + errCode);
			break;
		case 104:
			alert(errMsg + '门诊收费取配置信息有误' + ': ' + errCode);
			break;
		case 105:
			alert(errMsg + '门诊收费支付方式输入为空' + ': ' + errCode);
			break;
		case 107:
			alert(errMsg + '门诊收费院内账户不存在' + ': ' + errCode);
			break;
		case 109:
			alert(errMsg + '门诊收费员没有可用票据' + ': ' + errCode);
			break;
		case 112:
			alert(errMsg + '门诊收费四舍五入舍入金额过大，请分批结算' + ': ' + errCode);
			break;
		case 113:
			alert(errMsg + '门诊收费院内账户与患者身份不符' + ': ' + errCode);
			break;
		case 114:
			alert(errMsg + '医嘱被执行，不能退费' + ': ' + errCode);
			break;
		case 120:
			alert(errMsg + '门诊收费有异常收费记录需要处理' + ': ' + errCode);
			break;
		case 123:
			alert(errMsg + '门诊收费欠费结算异常' + ': ' + errCode);
			break;
		case 125:
			alert(errMsg + '账户余额不足' + ': ' + errCode);
			break;
		case 129:
			alert(errMsg + '门诊收费减材料库存失败' + ': ' + errCode);
			break;
		case 130:
			alert(errMsg + '门诊收费挂号费与处方不能一起结算' + ': ' + errCode);
			break;
		case 131:
			alert(errMsg + '门诊收费患者结算需要附加条件' + ': ' + errCode);
			break;
		case 132:
			alert(errMsg + '门诊收费同一个处方被拆分' + ': ' + errCode);
			break;
		case 133:
			alert(errMsg + '门诊收费账单表金额不平，请核查' + ': ' + errCode);
			break;
		case 134:
			alert(errMsg + '门诊收费发票表与账单表金额不平，请核查' + ': ' + errCode);
			break;
		default:
			alert(errMsg + ': ' + errCode);
	}
}

/*
//删除左右两端的空格
function DHCWeb_Trim(str){   
	 return str.replace(/(^\s*)|(\s*$)/g, "");  
}  
//删除左边的空格
function DHCWeb_LTrim(str){   
	return str.replace(/(^\s*)/g,"");  
}  
//删除右边的空格
function DHCWeb_RTrim(str){   
	return str.replace(/(\s*$)/g,"");  
}  
*/
