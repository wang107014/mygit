//记录前个登记号,以便检查前个挂号未完成时复原卡号

var PreCardNo="";
//帐户余额 
var AccAmount=0.00;
var CommonCardNo="";
var NeedReceiptNoMsg;
var HospitalCode="";
var m_CCMRowID="";
var EncryptObj=new Object();
var e;
var combo_ClinicGroup;
function GetCardTypeRowId(){
	var CardTypeRowId="";
	var CardTypeValue=combo_CardType.getSelectedValue();
	if (CardTypeValue!=""){
		var CardTypeArr=CardTypeValue.split("^")
		CardTypeRowId=CardTypeArr[0];
	}
	return CardTypeRowId;
}

function GetCardEqRowId(){
	var CardEqRowId="";
	var CardTypeValue=combo_CardType.getSelectedValue();
	
	if (CardTypeValue!=""){
		var CardTypeArr=CardTypeValue.split("^")
		CardEqRowId=CardTypeArr[14];
	}
	return CardEqRowId;
}

function GetCardTypeRegType(){
	var RegType="";
	var CardTypeValue=combo_CardType.getSelectedValue();
	if (CardTypeValue!=""){
		var CardTypeArr=CardTypeValue.split("^")
		RegType=CardTypeArr[0];
	}
	return CardTypeValue;
}

function GetCardNoLength(){
	var CardNoLength="";
	var CardTypeValue=DHCC_GetElementData("CardType");
	var CardTypeValue=combo_CardType.getSelectedValue();
	if (CardTypeValue!=""){
		var CardTypeArr=CardTypeValue.split("^");
		CardNoLength=CardTypeArr[17];
	}
	if (HospitalCode=='HXYY')	return 15;
	return CardNoLength;
}

function FormatCardNo(){
	var CardNo=DHCC_GetElementData("CardNo");
	if (CardNo!='') {
		var CardNoLength=GetCardNoLength();
		if ((CardNo.length<CardNoLength)&&(CardNoLength!=0)) {
			for (var i=(CardNoLength-CardNo.length-1); i>=0; i--) {
				CardNo="0"+CardNo;
			}
		}
	}

	return CardNo
}

function combo_CardTypeKeydownHandler(){
	var myoptval=combo_CardType.getSelectedValue();
	var myary=myoptval.split("^");
	var myCardTypeDR=myary[0];
	if (myCardTypeDR=="")	{	return;	}
	///Read Card Mode
	if (myary[16]=="Handle"){
		var myobj=document.getElementById("CardNo");
		if (myobj){myobj.readOnly = false;}
		DHCWeb_DisBtnA("ReadCard");
		DHCWeb_setfocus("CardNo");
	}else{
		m_CCMRowID=GetCardEqRowId();
		var myobj=document.getElementById("CardNo");
		//if (myobj){myobj.readOnly = true;}
		if (myobj){myobj.readOnly = false;}     //郭荣勇 支持手输卡号功能
		var obj=document.getElementById("ReadCard");
		if (obj){
			DHCC_AvailabilityBtn(obj)
			obj.onclick=ReadCardClickHandler;

		}
		DHCWeb_setfocus("ReadCard");
	}
	if (myary[16]=="Handle"){
		
		DHCWeb_setfocus("CardNo");
	}else{
		DHCWeb_setfocus("ReadCard");
	}
	
	if (combo_CardType) websys_nexttab(combo_CardType.tabIndex);
}

function combo_PayModeKeydownHandler()
{
	if (combo_PayMode) websys_nexttab(combo_PayMode.tabIndex);
}

function GetAccAmount(){
	var CardTypeRowId=GetCardTypeRowId();
	var myoptval=combo_CardType.getSelectedValue();
	var myrtn=DHCACC_GetAccInfo(CardTypeRowId,myoptval);
	var myary=myrtn.split("^");
	AccAmount=myary[3];
  return AccAmount;  
}

function ReadCardClickHandler(){
	var CardTypeRowId=GetCardTypeRowId();
	var CardEqRowId=GetCardEqRowId();
	var myoptval=combo_CardType.getSelectedValue();
	//通过读卡按钮时调用函数需要这个
	m_CCMRowID=GetCardEqRowId();
	var myrtn=DHCACC_GetAccInfo(CardTypeRowId,myoptval);
	var myary=myrtn.split("^");
	var rtn=myary[0];
	AccAmount=myary[3];
    DHCC_SetElementData("AccAmount",AccAmount);
    //alert(myrtn);
	switch (rtn){
		case "0": //卡有效
				var PatientID=myary[4];
				var PatientNo=myary[5];
				var CardNo=myary[1]
				var NewCardTypeRowId=myary[8];
				//说明先选择卡类型再读卡,华西通过读卡得到卡类型ID
				//if (NewCardTypeRowId!=CardTypeRowId) SetComboValue(combo_CardType,NewCardTypeRowId);
				//combo_CardType.setComboValue(NewCardTypeRowId);
				var RegType=GetCardTypeRegType();
				if (CardTypeRowId!=NewCardTypeRowId){
					alert(t['CardNoTypeNotMatch']);
					return;
				}
				var AppFlag=DHCC_GetElementData("AppFlag");
				if ((AppFlag==1)&&(RegType=="REG")){
					alert(t['CardOnlyForReg']);
					return;
				}
				if(AccAmount<=0){
					alert(t['Accountbalanceinsufficient']);
					DHCC_SelectOptionByCode("PayMode","CASH");
				}
				else{
					DHCC_SelectOptionByCode("PayMode","CPP");
				}
				SetPatientInfo(PatientNo,CardNo);
			break;
		case "-200": //卡无效
			alert(t['InvaildCard']);
			websys_setfocus('RegNo');
			break;
		case "-201": //现金
			//alert(t['21']);
				var PatientID=myary[4];
				var PatientNo=myary[5];
				var CardNo=myary[1]
				
				var NewCardTypeRowId=myary[8];
				//if (NewCardTypeRowId!=CardTypeRowId) SetComboValue(combo_CardType,NewCardTypeRowId);
				//combo_CardType.setComboValue(NewCardTypeRowId);
				var RegType=GetCardTypeRegType();
				if (CardTypeRowId!=NewCardTypeRowId){
					alert(t['CardNoTypeNotMatch']);
					return;
				}
				var AppFlag=DHCC_GetElementData("AppFlag");
				if ((AppFlag==1)&&(RegType=="REG")){
					alert(t['CardOnlyForReg']);
					return;
				}
				DHCC_SelectOptionByCode("PayMode","CASH")
				SetPatientInfo(PatientNo,CardNo);
			break;
		default:
	}
}
function SetPatientInfo(PatientNo,CardNo){
	var ret=CheckBeforeCardNoChange();
	if (!ret) return;

	if (PatientNo!='') {
		
		ClearPatInfo();
		//因为在ClearPatInfo()时会把PatientNo的值清空,所以要重新赋值
		DHCC_SetElementData("PatientNo",PatientNo);
		DHCC_SetElementData("CardNo",CardNo);
		DHCC_SetElementData("CardLeaving",DHCC_GetElementData("AccAmount"));
		var encmeth=DHCC_GetElementData('GetDetail');
		if (encmeth!=""){
			if (cspRunServerMethod(encmeth,'SetPatient_Sel','',PatientNo)=='0') {
				var obj=document.getElementById('CardNo');
				obj.className='clsInvalid';
				websys_setfocus('CardNo');
				return websys_cancel();
			}else{
				var obj=document.getElementById('CardNo');
				obj.className='';
				//DHCC_Nextfoucs();
				//if (combo_TimeRange) combo_TimeRange.DOMelem_input.focus();
				//if (combo_DeptList) combo_DeptList.DOMelem_input.focus();
				websys_setfocus("DeptList");  //此处不能用构造的combo_DeptList对象的聚焦方法,那样会因为科室为空而跳到医生
				return websys_cancel();				
			}
		}
	} else {
		websys_setfocus('CardNo');
		return websys_cancel();
	}
}
function SetPassCardNo(CardNo,CardType){
	DHCC_SetElementData("CardNo",CardNo);
	combo_CardType.setComboValue(CardType);
	CheckCardNo();
}
function CheckCardNo(){
		var AppFlag=DHCC_GetElementData('AppFlag');
		var CardNo=DHCC_GetElementData("CardNo");
		CardNo=FormatCardNo();
		if (CardNo=="") return;
		//alert(CardNo);
		var CardTypeRowId=GetCardTypeRowId();
		//这里判断卡是否有效
		var Rtn=DHCACC_DisabledCardType("CardType",CardNo,CardTypeRowId);
		if (!Rtn){
			if (confirm("是否跳转注册建卡界面发卡？")){
				var lnk = "websys.default.csp?WEBSYS.TCOMPONENT=UDHCCardPatInfoRegExp&RegCardNo="+CardNo+"&CardTypeDefineID="+CardTypeRowId;
				win=open(lnk,"DHCOPAdm.Reg","status=1,top=0,left=0,width=1300,height=740,resizable=yes,scrollbars=yes")
			}
			//Clear_click();       add by hcq 20180417 清屏会导致界面光标闪烁两下，然后跳转界面的效果，先关闭。 start/end 
			return;
		}
		
		//判断临时卡是否有效
		var IsTempCardAviFlag=tkMakeServerCall("web.DHCOPAdmReg","IsTempCard",CardNo);
		if(IsTempCardAviFlag=="Y"){alert("此卡为临时卡已超有效时间，不能预约或挂号！");Clear_click();return;}
		
		var myrtn=DHCACC_GetAccInfo(CardTypeRowId,CardNo,"") //DHCACC_GetAccInfo(CardTypeRowId,CardNo,"","PatInfo");
		//alert(CardTypeRowId+"!"+CardNo+"!"+myrtn)
		var myary=myrtn.split("^");
		var rtn=myary[0];
		AccAmount=myary[3];
		DHCC_SetElementData("AccAmount",AccAmount);
			switch (rtn){
			case "0": //卡有效有帐户
				var PatientID=myary[4];
				var PatientNo=myary[5];
				var CardNo=myary[1];
				var NewCardTypeRowId=myary[8];
				//通过卡号去找卡找到卡类型,如果采用这种方式1卡类型的串会丢失2多种卡类型的同一个卡号无法找到多个  NewCardTypeRowId==""说明卡有多种卡类型gry
				//if (NewCardTypeRowId!=CardTypeRowId) combo_CardType.setComboValue(NewCardTypeRowId);
				var RegType=GetCardTypeRegType();
				if (CardTypeRowId!=NewCardTypeRowId){
					alert(t['CardNoTypeNotMatch']);
					return;
				}
				var AppFlag=DHCC_GetElementData("AppFlag");
				if ((AppFlag==1)&&(RegType=="REG")){
					alert(t['CardOnlyForReg']);
					return;
				}
				if(AccAmount<=0){
					DHCC_SelectOptionByCode("PayMode","CASH");
				}
				else{
					DHCC_SelectOptionByCode("PayMode","CPP");
				}
				//DHCC_SetElementData("PayMode","CPP");
				SetPatientInfo(PatientNo,CardNo);
				break;
			case "-200": //卡无效
				alert(t['InvaildCard']);
				websys_setfocus('CardNo');
				break;
			case "-201": //卡有效无帐户
				//alert(t['21']);
				var PatientID=myary[4];
				var PatientNo=myary[5];
				var CardNo=myary[1];
				var NewCardTypeRowId=myary[8];
				//通过卡号去找卡找到卡类型
				//if (NewCardTypeRowId!=CardTypeRowId) combo_CardType.setComboValue(NewCardTypeRowId);
				var RegType=GetCardTypeRegType();
				if (CardTypeRowId!=NewCardTypeRowId){
					alert(t['CardNoTypeNotMatch']);
					return;
				}
				if ((AppFlag==1)&&(RegType=="临时医疗卡")){
					alert(t['CardOnlyForReg']);
					return;
				}
				
				//DHCC_SetElementData("PayMode","CASH");
				DHCC_SelectOptionByCode("PayMode","CASH");
				var obj=document.getElementById("PayMode");
				SetPatientInfo(PatientNo,CardNo);
				YBTypeCheck();
				break;
				default:
		}
		
}
function CardNoKeydownHandler(e) {
	//这边要与卡处理一致
	if (evtName=='CardNo') {
		window.clearTimeout(evtTimer);
		evtTimer='';
		evtName='';
	}
	var key=websys_getKey(e);
	if (key==13) {
		CheckCardNo();
	}
	
}
function AppDateKeydownHandler(e)
{
	var key=websys_getKey(e);
	if (key==13) {
		//var obj=combo_DeptList;
	    var DepRowId=DHCC_GetColumnData("DepRowId"); //obj.getActualValue();
	    if(DepRowId==""){
		    DHCC_Nextfoucs();
		}else{
			combo_DeptListKeydownhandler();
		}
	}
}
function SetComboValue(obj,val){
	if (obj) {
		var ind=obj.getIndexByValue(val);
		if (ind==-1){obj.setComboText("");return;}
		obj.selectOption(ind)
	}
}
function CardNoChangeHandler(){
	CheckBeforeCardNoChange();
}

function CheckBeforeCardNoChange(){
	var objtbl=document.getElementById('tDHCOPAdm_Reg');
	var rows=objtbl.rows.length;
	if (rows>2){
		alert(t["RegNotCompleted"]);
		DHCC_SetElementData("CardNo",PreCardNo);
		return false;
	}
	return true;
}

function SetPatient_Sel(value) {
	try {  
		var Patdetail=value.split("^");
		DHCC_SetElementData("Name",Patdetail[0]);
		DHCC_SetElementData("Age",Patdetail[1]);
		DHCC_SetElementData("Sex",Patdetail[2]);
		/*   //潍坊
		DHCC_SetElementData("ParDr",Patdetail[5]);
		DHCC_SetElementData("OldMan",Patdetail[11]);
		DHCC_SetElementData("Mentality",Patdetail[12]);
		CodeId=Patdetail[9];
		*/
		//门诊病历号和住院病历号
		DHCC_SetElementData("OPMRN",Patdetail[3]);
		DHCC_SetElementData("IPMRN",Patdetail[4]);
		//医保号
		DHCC_SetElementData("PatYBCode",Patdetail[11]);
		//医保类型
		DHCC_SetElementData("YBType",Patdetail[12]);
		//西院门诊病历号和住院病历号
		DHCC_SetElementData("PoliticalLevel",Patdetail[19]);
		DHCC_SetElementData("SecretLevel",Patdetail[20]);
		
		var PAPERSGMedicareCode1=Patdetail[13];
		var PAPERSGMedicareCode2=Patdetail[14];
		DHCC_SetElementData("SGMedicareCode1",PAPERSGMedicareCode1);
		DHCC_SetElementData("SGMedicareCode2",PAPERSGMedicareCode2);
		
		var PatCat=Patdetail[5];
		DHCC_SetElementData("PatCat",PatCat);
		
		if (PatCat==""){
			alert(t["PatCatIsNull"])
			/*bak
			ClearPatInfo();
			return;
			*/
			var CardNo=DHCC_GetElementData("CardNo");
			var lnk = "websys.default.csp?WEBSYS.TCOMPONENT=DHCPatient&CardNo="+CardNo;
			Clear_click();
			win=open(lnk,"ModPat","status=1,top=80,left=50,width=900,height=490,scrollbars=Yes");
			websys_setfocus('CardNo');
			return websys_cancel();
		}

		DHCC_SetElementData("PatientID",Patdetail[6]);
		DHCC_SetElementData("IDCardNo",Patdetail[7]);
		DHCC_SetElementData("Company",Patdetail[8]);
		DHCC_SetElementData("PatientNo",Patdetail[9]);
		DHCC_SetElementData("AppBreakCount",Patdetail[10]);
		var PatientID=Patdetail[6];
		var encmeth=DHCWebD_GetObjValue("getadmrecord");
    if (encmeth!=""){
		if(cspRunServerMethod(encmeth,PatientID)==0){
			DHCC_SetElementData("MedicalBook",true);
			DHCC_SetElementData("NeedCardFee",true);
			MedicalBookCheck();
			NeedCardFeeCheck();
			//document.getElementById('MRRecord').value='F'
		}else{
			DHCC_SetElementData("MedicalBook",false);
			DHCC_SetElementData("NeedCardFee",false);
			//document.getElementById('MRRecord').value='R';	
		}
    }
	DHCC_ClearList("BillType");
	var encmeth=DHCC_GetElementData("GetBillTypeMethod");
	if (encmeth!=""){
		var rtn=cspRunServerMethod(encmeth,"DHCWeb_AddToListA","BillType",PatientID);
	}

	SetBillTypeLabel();	
	if (PreCardNo==""){PreCardNo=DHCC_GetElementData("CardNo");}
	var PatInIPAdmission=tkMakeServerCall('web.DHCDocOrderCommon','CheckPatInIPAdmission',PatientID);
	if (PatInIPAdmission==1){alert("患者正在住院！")}
	var AppFlag=DHCC_GetElementData("AppFlag");
	if(AppFlag==1){
		var PatientID=DHCC_GetElementData("PatientID");
		var BlackFlag=tkMakeServerCall("web.DHCRBAppointment","GetLimitAppFlag",PatientID,"")
	    var BlackFlag=BlackFlag.split("^")[0] //BlackFlag.split("^")[1]为有效日期 如有维护有效日期 可在此增加提示信息
	    if (BlackFlag==1){
		      alert("存在有效黑名单记录,不允许预约")
		      var obj=document.getElementById("Name");
		      if (obj) obj.style.backgroundColor ="red";
		      return false;
		}else{
			var obj=document.getElementById("Name");
		     if (obj) obj.style.backgroundColor ="white";
		}
	}else{
		var obj=document.getElementById("Name");
		if (obj) obj.style.backgroundColor ="white";
	}
	//lxz 预约增加
	var AppSerialNo=DHCC_GetElementData("AppSerialNo");
	if (AppSerialNo!="") {
		AppSerialNoBlurHandler();
	}else{
		GetApptInfo(PatientID);
	}
	var AppFlag=DHCC_GetElementData("AppFlag");
	if(AppFlag!=1){
		//增加急诊分级
		GetEmChkInfo(PatientID);
	}
		
	} catch(e) {
		alert(e.message)
	};
}

//潍坊显示费别label
function SetBillTypeLabel()
{
	//通过医院代码判断
	if (HospitalCode!="WFRMYY") return
	if (document.getElementById('BillType')){
		document.getElementById('ShowAdmType').className='';
		var obj = document.getElementById("BillType");
		var strsel = obj.options[obj.selectedIndex].text	
		DHCC_SetElementData("ShowAdmType",strsel);
		if (strsel=='省企离休'){
			var encmeth=DHCC_GetElementData("GetGYFristMethod");
			if (encmeth!=''){
				var rtn=cspRunServerMethod(encmeth,PatientID);
			  if (rtn=='0')	DHCC_SetElementData("DeptList","YZS");
			}
	
		}
		document.getElementById('ShowAdmType').className='dhx_l';
	}
}
function NewClear_click(){
	Clear_click()
	//DHCC_SetElementData("GetAppNo",false)
}
function Clear_click()	{
	ClearPatInfo();
	SetDefaultTimeRange();
	DHCC_SetElementData("WeekDesc","")
	DHCC_ClearTable("tDHCOPAdm_Reg_MarkList");
	DHCC_ClearTable("tDHCOPAdm_Reg_MarkListCopy")
	selectedRowObj=new Object();
	selectedRowObj.rowIndex="";
    var RegConDisId="";
	var obj=document.getElementById("RegConDisList");
	if (obj){
		obj.selectedIndex=-1;
	}
	DHCC_ClearTable("tDHCOPAdm_Reg");
	websys_setfocus('CardNo');
	PreCareNo="";
	DHCC_SetElementData("FreeReg",false)
	DHCC_SetElementData("FreeCheck",false)
	GetReceiptNo();
	ReadPayMode();
	SetDefultCardType();
	var obj=document.getElementById('CardType');
	if (obj){obj.disabled=false}
	if(TimeRangeAppExt.mainpanel){
		TimeRangeAppExt.mainpanel.setVisible(false)	
	}
	var AppFlag=DHCC_GetElementData("AppFlag");
	if(AppFlag!=1){
		DHCC_SetElementData("AppDate","")
	}
	DHCC_SetElementData("AccAmount","");
	
}
function SetDefultCardType(){
	
	var DefType=tkMakeServerCall('web.UDHCOPOtherLB','getDefaultCardType');
	var DefTypeArr=DefType.split('^');
	var DefTypeId=DefTypeArr[0];
	var DefTypeDesc=DefTypeArr[2];
	combo_CardType.setComboValue(DefType);
    combo_CardTypeKeydownHandler();
}
function ClearPatInfo(){
	DHCC_SetElementData("CardNo","");
	//通过配置来决定是否显示公共卡 090312
	//DHCC_SetElementData("CardNo",CommonCardNo);
	DHCC_SetElementData("PatientID","");
	DHCC_SetElementData("PatientNo","");
	DHCC_SetElementData("Name","");
	var obj=document.getElementById("Name");
	if (obj) obj.style.backgroundColor ="white";
	DHCC_SetElementData("Age","");
	DHCC_SetElementData("Sex","");
	DHCC_SetElementData("IDCardNo","");
	DHCC_SetElementData("IPMRN","");
	DHCC_SetElementData("OPMRN","");
	DHCC_SetElementData("PatCat","");
	DHCC_SetElementData("BillType","");
	DHCC_SetElementData("Company","");
	DHCC_SetElementData("Address","");
	DHCC_SetElementData("SeqNo","");
	DHCC_SetElementData("Time","")
	DHCC_SetElementData("YBType","");
	DHCC_SetElementData("PatYBCode","");
	DHCC_SetElementData("SGMedicareCode1","");
	DHCC_SetElementData("SGMedicareCode2","");
	DHCC_SetElementData("BLFlag","");
	DHCC_SetElementData("CardLeaving","");
	DHCC_SetElementData("MedicalBook","");
	DHCC_SetElementData("NeedCardFee","");
	DHCC_SetElementData("PatCatDr","");
	DHCC_SetElementData("DiagnosCat","");
	DHCC_SetElementData("ShowAdmType","");
	DHCC_SetElementData("OldMan","");
	DHCC_SetElementData("ParDr","");
	DHCC_SetElementData("AppPatName","");
	DHCC_SetElementData("AppPatTel","");
	DHCC_SetElementData("AppPatCredNo","");
	DHCC_SetElementData("PoliticalLevel","");
	DHCC_SetElementData("SecretLevel","");
	var AppFlag=DHCC_GetElementData('AppFlag');
	if (AppFlag=="1"){
		//combo_DeptList.setComboText('');
		combo_TimeRange.setComboText('');
		if (document.getElementById('combo_DiagnosCat')){combo_DiagnosCat.setComboText('');}
		
		//因为内存清除会对速度有影响,所以暂时去掉
		//combo_MarkCode.clearAll();
		//combo_MarkCode.setComboText("");
		//var Arr=DHCC_StrToArray(AllDocStr);
		//combo_MarkCode.addOption(Arr);
	}else{
		//combo_DeptList.setComboText('');
	}
	DHCC_SetElementData('DeptList','');
	DHCC_SetElementData('DepRowId','');
	DHCC_SetElementData('DocRowId','');
	//if (combo_MarkCode) combo_MarkCode.setComboText('');
	DHCC_SetElementData("MarkCode","")
	DHCC_SetElementData("RoomCode","")
	//应收,实收,找零
	DHCC_SetElementData("BillAmount","");
	DHCC_SetElementData("GetAmount","");
	DHCC_SetElementData("ReturnAmount","");
	var obj=document.getElementById('ReturnAmount');
	if (obj) obj.className='';
	SetDefaultAppDate();
	AccAmount=0;
	//window.setTimeout("CollectGarbage()",1);

}


function QueryClickHandler(e){
	//if (combo_MarkCode){var obj=combo_MarkCode;}else{var obj=combo_DeptList;}
	//DeptListDblClickHandler(obj);
	DeptListDblClickHandler();
}
function DeptListDblClickHandler(srcobj) {
	var AppFlag=DHCC_GetElementData("AppFlag");
	var PatientID=DHCC_GetElementData('PatientID');
	/*
	if ((PatientID=="")&&(AppFlag!="1")) {
		alert(t['NotSelectPatient']);
		websys_setfocus('CardNo');
		return false;
	}
	*/
	if(TimeRangeAppExt.mainpanel){
		TimeRangeAppExt.mainpanel.setVisible(false)	
	}
	AppDate=GetAppDate();
	//if (AppFlag=="0") {AppDate="";}
	if (AppFlag=="1"){
		if (AppDate=="") {
			AppDate="0";
		}else{
			var DefaultAppDate=DHCC_GetElementData("DefaultAppDate")
			var ret=CheckOrderStartDate(AppDate,DefaultAppDate);
			//alert(ret);
			if (!ret){
				alert(t['WrongAppDate']);
				SetDefaultAppDate();
				websys_setfocus('AppDate');
				return
			}
		}
	}
	
	/*
	if ((AppFlag=="1")&&(AppDate=="")){
		alert(t['AppDateIsNull']);
		websys_setfocus('AppDate');
		return false;
	}
	*/

	//取时段代码
	//var TimeRangeRowId=DHCC_GetElementData('TimeRange');
	//var TimeRangeRowId=DHCC_GetElementData('TRRowId');
	var TimeRangeRowId=combo_TimeRange.getSelectedValue();
	if (TimeRangeRowId==""){
	var len=combo_TimeRange.optionsArr.length;
		for(var i=0;i<len;i++)	{
			var TRRowId=combo_TimeRange.optionsArr[i].value;
			if (TimeRangeRowId=="") {TimeRangeRowId=TRRowId}else{TimeRangeRowId=TimeRangeRowId+"!"+TRRowId}
		}
	}
	//var TimeRangeRowId="";
	//if(MorningTimeRangeId!="")TimeRangeRowId=MorningTimeRangeId;

 	var DepRowId=DHCC_GetElementData('DepRowId');
 
	//var DocRowId=DHCC_GetElementData('DocRowId');
	//var DepRowId=combo_DeptList.getSelectedValue();
	var DocRowId=DHCC_GetElementData('DocRowId');
	
	/*if ((srcobj)&&(typeof(srcobj)=="string")&&(srcobj.indexOf("^")!=-1)){
	    var DocDesc=srcobj.split("^")[0];
		if (DocDesc!="") DocRowId=srcobj.split("^")[1];
	}else if (combo_MarkCode) {
		var DocDesc=combo_MarkCode.getSelectedText()
		if (DocDesc!="") DocRowId=combo_MarkCode.getSelectedValue();
	}*/
	
	//如果没有选择医生或科室则不做查询,因为这样是没能意义的
	//alert(DepRowId+"^"+DocRowId+"^"+TimeRangeRowId+"^"+AppDate)
	//if (((DepRowId!="")&&(DocRowId=='')&&(AppDate=="0"))||((DepRowId=="")&&(DocRowId==''))) {
	if (((DepRowId=="")&&(DocRowId==''))) {
		if ((AppFlag=="1")&&(srcobj)) websys_nexttab(srcobj.tabIndex);
		return;
	}

	DHCC_ClearTable("tDHCOPAdm_Reg_MarkList");
	selectedRowObj=new Object();
	selectedRowObj.rowIndex="";
	var ShowStopScheFlag="";
	var ShowStopSche=DHCC_GetElementData("ShowStopSche");
	if(ShowStopSche==true){
		ShowStopScheFlag=1;
	}
	/*   //潍坊比较后台类,传入了一个AdmReason
	if (document.getElementById('BillType')){var AdmReason=DHCC_GetElementData('BillType');}else{AdmReason='1'}
	var p1=DepRowId+"^"+session['LOGON.USERID']+"^"+AppDate+"^"+PatientID+"^"+TimeRangeRowId+"^"+DocRowId+"^"+session['LOGON.GROUPID']+"^"+AdmReason;
	*/
	var ClinicGroupRowId=DHCC_GetElementData('ClinicGroupRowId');
	var RegConDisId="";
	var obj=document.getElementById("RegConDisList");
	if (obj){
		RegConDisId=obj.value;
	}
	//
	var p1=DepRowId+"^"+session['LOGON.USERID']+"^"+AppDate+"^"+PatientID+"^"+TimeRangeRowId+"^"+DocRowId+"^"+session['LOGON.GROUPID']+"^^^"+"1"+"^"+ClinicGroupRowId+"^"+ShowStopScheFlag+"^"+RegConDisId;
	var encmeth=DHCC_GetElementData("GetDocMethod")
	if (encmeth!=""){
		if (cspRunServerMethod(encmeth,'AddMarkToTable','',p1)=='0') {
			obj.className='clsInvalid';
			return websys_cancel();
		}
	}
		//分别查询上下午号
	DHCC_ClearTable("tDHCOPAdm_Reg_MarkListCopy");
	//预约日期默认第二天
	//AppDate=DefaultAppDate.substring(0,8);
	
	//在排班列表中显示排班信息 wml
	var p1=DepRowId+"^"+session['LOGON.USERID']+"^"+AppDate+"^"+PatientID+"^"+TimeRangeRowId+"^"+DocRowId+"^"+session['LOGON.GROUPID']+"^"+"^"+""+"^"+"2"+"^"+ClinicGroupRowId+"^"+ShowStopScheFlag+"^"+RegConDisId;
	var encmeth=DHCC_GetElementData("GetDocMethod")
	//s val=##Class(%CSP.Page).Encrypt($lb("web.DHCOPAdmReg.DocListBroker")) 
	if (encmeth!=""){
		if (cspRunServerMethod(encmeth,'AddMarkToCopyTable','',p1)=='0') {
			obj.className='clsInvalid';
			return websys_cancel();
		}
	}
	/*if(MorningTimeRangeId==TimeRangeDefault)
	{
		var objtbl=document.getElementById("tDHCOPAdm_Reg_MarkList");
	    //if (combo_MarkCode){
		//if (1){
		var FindRow=DHCC_FindTableRow("tDHCOPAdm_Reg_MarkList","MarkDesc","");
		if (FindRow>0){
			var ASRowId=DHCC_GetColumnData('ASRowId',FindRow);

			if (ASRowId!=""){
				//websys_setfocus("tDHCOPAdm_Reg_MarkList");
				objtbl.focus();
				HighlightRow_OnLoad("MarkDescz"+FindRow);
				var scrollTop=Math.max(document.documentElement.scrollTop,document.body.scrollTop);
				window.scrollTo(0,scrollTop);
				return false;
			}
			//}else{
			//websys_nexttab(srcobj.tabIndex);
			//}
		}else{
			//if (objtbl.rows.length==2){
			if (objtbl.rows.length>=2){
				var ASRowId=DHCC_GetColumnData('ASRowId',1);
				if (ASRowId!=""){
					//websys_setfocus("tDHCOPAdm_Reg_MarkList");
					objtbl.focus();
					HighlightRow_OnLoad("MarkDescz1");
					var scrollTop=Math.max(document.documentElement.scrollTop,document.body.scrollTop);
					window.scrollTo(0,scrollTop);
					return true;
				}
			}		
			//websys_nexttab(srcobj.tabIndex);
			websys_setfocus('RoomCode');
		}
	}else{*/
		var objtbl=document.getElementById("tDHCOPAdm_Reg_MarkList");
		var objtblc=document.getElementById("tDHCOPAdm_Reg_MarkListCopy");
	    //if (combo_MarkCode){
		//if (1){
		var FindRow=DHCC_FindTableRow("tDHCOPAdm_Reg_MarkList","MarkDesc","");
		if (FindRow>0){
			var ASRowId=DHCC_GetColumnData('ASRowId',FindRow);
			if (ASRowId!=""){
				objtbl.focus();
				HighlightRow_OnLoad("MarkDescz"+FindRow);  //弹出具体排班表 wml
				var scrollTop=Math.max(document.documentElement.scrollTop,document.body.scrollTop);
				window.scrollTo(0,scrollTop);
				return false;
			}
		}else{
			//if (objtbl.rows.length==2){
			if (objtbl.rows.length>=2){
				var ASRowId=DHCC_GetColumnData('ASRowId',1);
				if (ASRowId!=""){
					//websys_setfocus("tDHCOPAdm_Reg_MarkListCopy");
					objtbl.focus();
					HighlightRow_OnLoad("MarkDescz1");
					var scrollTop=Math.max(document.documentElement.scrollTop,document.body.scrollTop);
					window.scrollTo(0,scrollTop);
					return true;
				}
			}		
			//websys_nexttab(srcobj.tabIndex);
			websys_setfocus('RoomCode');
		}
		var FindRow=DHCC_FindTableRow("tDHCOPAdm_Reg_MarkListCopy","MarkDescC","");
		if (FindRow>0){
			var ASRowId=DHCC_GetColumnData('ASRowIdC',FindRow);

			if (ASRowId!=""){
				//websys_setfocus("tDHCOPAdm_Reg_MarkListCopy");
				objtblc.focus();
				HighlightRow_OnLoad("MarkDescCz"+FindRow);
				var scrollTop=Math.max(document.documentElement.scrollTop,document.body.scrollTop);
				window.scrollTo(0,scrollTop);
				return false;
			}
		//}else{
			//websys_nexttab(srcobj.tabIndex);
		//}
		 }else{
			//if (objtbl.rows.length==2){
			if (objtblc.rows.length>=2){
				var ASRowId=DHCC_GetColumnData('ASRowIdC',1);
				if (ASRowId!=""){
					//websys_setfocus("tDHCOPAdm_Reg_MarkListCopy");
					objtblc.focus();
					HighlightRow_OnLoad("MarkDescCz1");
					var scrollTop=Math.max(document.documentElement.scrollTop,document.body.scrollTop);
					window.scrollTo(0,scrollTop);
					return true;
				}
			}		
			//websys_nexttab(srcobj.tabIndex);
			websys_setfocus('RoomCode');
		}
	//}
	

	/*
	var objtbl=document.getElementById("tDHCOPAdm_Reg_MarkList");
	if (objtbl.rows.length==2){
		var ASRowId=DHCC_GetColumnData('ASRowId',1);
		if (ASRowId!=""){
			websys_setfocus("tDHCOPAdm_Reg_MarkList");
			HighlightRow_OnLoad("MarkDescz1");
			return true;
		}
	}
	*/
	//websys_nexttab(srcobj.tabIndex);
	return true
}


function AddMarkToTable(val) {
	try {
		var objtbl=document.getElementById("tDHCOPAdm_Reg_MarkList");
		var Arr=val.split("!");
		for (var i=0; i<Arr.length; i++) {
			//alert(Arr[i]);
			var valueAry=Arr[i].split("^");
			var ASRowId=valueAry[0];
			var MarkDesc=valueAry[1];
			var RegLoad=valueAry[2];
			var AppLoad=valueAry[3];
			var AddLoad=valueAry[4];
			var AvailSeqNoStr=valueAry[5];
			var AvailAddSeqNoStr=valueAry[6];
			var RoomDesc=valueAry[7];
			var ClinicGroupDesc=valueAry[8];
			var SessionTypeDesc=valueAry[9];
			var RegFee=valueAry[10];
			var RegFeeDr=valueAry[11];
			var ExamFee=valueAry[12];
			var ReCheckFee=valueAry[13];
			var HoliFee=valueAry[14];
			var HoliFeeDr=valueAry[15];
			var AppFee=valueAry[16];
			var OtherFee=valueAry[17];
			var RoomCode=valueAry[18];
			var DepDesc=valueAry[19];
			var RegedCount=valueAry[20];
			var AppedCount=valueAry[21];
			var AddedCount=valueAry[22];
			
			var AvailNorSeqNoStr=valueAry[23];
			var ScheduleStatus=valueAry[24];
			var ScheduleDate=valueAry[25];
			var ScheduleDateWeek=valueAry[26];
			var TimeRange=valueAry[27];
			if (RegFee=="") RegFee=0;
			if (ExamFee=="") ExamFee=0;
			if (HoliFee=="") HoliFee=0;
			if (AppFee=="") AppFee=0;
			if (OtherFee=="") OtherFee=0;

			//第一行已经有了
			if (i>0){AddRow(objtbl);}
			var Row=objtbl.rows.length-1;

			DHCC_SetColumnData("MarkDesc",Row,MarkDesc);
			DHCC_SetColumnData("Load",Row,RegLoad);
			DHCC_SetColumnData("AppLoad",Row,AppLoad);
			DHCC_SetColumnData("AddLoad",Row,AddLoad);
			DHCC_SetColumnData("AvailSeqNoStr",Row,AvailSeqNoStr);
			DHCC_SetColumnData("AvailAddSeqNoStr",Row,AvailAddSeqNoStr);
			DHCC_SetColumnData("RoomDesc",Row,RoomDesc);
			DHCC_SetColumnData("ClinicGroupDesc",Row,ClinicGroupDesc);
			DHCC_SetColumnData("SessionTypeDesc",Row,SessionTypeDesc);
			DHCC_SetColumnData("RegFee",Row,RegFee);
			DHCC_SetColumnData("ExamFee",Row,ExamFee);
			DHCC_SetColumnData("HoliFee",Row,HoliFee);
			DHCC_SetColumnData("AppFee",Row,AppFee);
			DHCC_SetColumnData("OtherFee",Row,OtherFee);
			DHCC_SetColumnData("ReCheckFee",Row,ReCheckFee);
			//DHCC_SetColumnData("AppFeeDr",Row,AppFeeDr);
			//DHCC_SetColumnData("HoliFeeDr",Row,HoliFeeDr);
			//DHCC_SetColumnData("ExamFeeDr",Row,ExamFeeDr);
			//DHCC_SetColumnData("RegFeeDr",Row,RegFeeDr);
			DHCC_SetColumnData("ASRowId",Row,ASRowId);
			DHCC_SetColumnData("RoomCode",Row,RoomCode);
			DHCC_SetColumnData("DepDesc",Row,DepDesc);
			DHCC_SetColumnData("RegedCount",Row,RegedCount);
			DHCC_SetColumnData("AppedCount",Row,AppedCount);
			DHCC_SetColumnData("AddedCount",Row,AddedCount);
			DHCC_SetColumnData("AvailNorSeqNoStr",Row,AvailNorSeqNoStr);
			DHCC_SetColumnData("ScheduleStatus",Row,ScheduleStatus);
			DHCC_SetColumnData("ScheduleDate",Row,ScheduleDate);
			DHCC_SetColumnData("ScheduleDateWeek",Row,ScheduleDateWeek);
			DHCC_SetColumnData("TimeRange",Row,TimeRange);
			SetTableitemColor("MarkDesc",Row,"")
			if (ASRowId!=""){
				var SeqNoMode=DHCC_GetElementData('SeqNoMode');
				if ((AvailSeqNoStr=="")&&(AvailAddSeqNoStr=="")&&(SeqNoMode=='')){
					//alert(AvailSeqNoStr+"^"+AvailAddSeqNoStr+"^"+SeqNoMode)
					//objtbl.rows[Row].className='SqueezedIn';
					objtbl.rows[Row].className='ScheduleFull';
					SetTableitemColor("MarkDesc",Row,"red")
				}
				if ((AvailNorSeqNoStr=="")&&(SeqNoMode=='1')){
					objtbl.rows[Row].className='ScheduleFull';
					SetTableitemColor("MarkDesc",Row,"red")
				}
				if(ScheduleStatus=="停诊"){
					objtbl.rows[Row].className='ScheduleStop';
					//SetTableitemColor("MarkDescC",Row,"red")
				}
			}
		}
	} catch(e) {alert(e.message)};
}
function AddMarkToCopyTable(val) {
	try {
		var objtb2=document.getElementById("tDHCOPAdm_Reg_MarkListCopy");
		var Arr=val.split("!");
		for (var i=0; i<Arr.length; i++) {
			//alert(Arr[i]);
			var valueAry=Arr[i].split("^");
			var ASRowId=valueAry[0];
			var MarkDesc=valueAry[1];
			var RegLoad=valueAry[2];
			var AppLoad=valueAry[3];
			var AddLoad=valueAry[4];
			var AvailSeqNoStr=valueAry[5];
			var AvailAddSeqNoStr=valueAry[6];
			var RoomDesc=valueAry[7];
			var ClinicGroupDesc=valueAry[8];
			var SessionTypeDesc=valueAry[9];
			var RegFee=valueAry[10];
			var RegFeeDr=valueAry[11];
			var ExamFee=valueAry[12];
			var ReCheckFee=valueAry[13];
			var HoliFee=valueAry[14];
			var HoliFeeDr=valueAry[15];
			var AppFee=valueAry[16];
			var OtherFee=valueAry[17];
			var RoomCode=valueAry[18];
			var DepDesc=valueAry[19];
			var RegedCount=valueAry[20];
			var AppedCount=valueAry[21];
			var AddedCount=valueAry[22];
			
			var AvailNorSeqNoStr=valueAry[23];
			var ScheduleStatus=valueAry[24];
			var ScheduleDate=valueAry[25];
			var ScheduleDateWeek=valueAry[26];
			var TimeRange=valueAry[27];
			//总费用
			var TotalFee=valueAry[valueAry.length-1];
			
			if (RegFee=="") RegFee=0;
			if (ExamFee=="") ExamFee=0;
			if (HoliFee=="") HoliFee=0;
			if (AppFee=="") AppFee=0;
			if (OtherFee=="") OtherFee=0;
			//第一行已经有了
			if (i>0){AddRow(objtb2);}
			var Row=objtb2.rows.length-1;

			DHCC_SetColumnData("MarkDescC",Row,MarkDesc);
			DHCC_SetColumnData("LoadC",Row,RegLoad);
			DHCC_SetColumnData("AppLoadC",Row,AppLoad);
			DHCC_SetColumnData("AddLoadC",Row,AddLoad);
			DHCC_SetColumnData("AvailSeqNoStrC",Row,AvailSeqNoStr);
			DHCC_SetColumnData("AvailAddSeqNoStrC",Row,AvailAddSeqNoStr);
			DHCC_SetColumnData("RoomDescC",Row,RoomDesc);
			DHCC_SetColumnData("ClinicGroupDescC",Row,ClinicGroupDesc);
			DHCC_SetColumnData("SessionTypeDescC",Row,SessionTypeDesc);
			DHCC_SetColumnData("RegFeeC",Row,RegFee);
			DHCC_SetColumnData("ExamFeeC",Row,ExamFee);
			DHCC_SetColumnData("HoliFeeC",Row,HoliFee);
			DHCC_SetColumnData("AppFeeC",Row,AppFee);
			DHCC_SetColumnData("OtherFeeC",Row,OtherFee);
			DHCC_SetColumnData("ReCheckFeeC",Row,ReCheckFee);
			//DHCC_SetColumnData("AppFeeDr",Row,AppFeeDr);
			//DHCC_SetColumnData("HoliFeeDr",Row,HoliFeeDr);
			//DHCC_SetColumnData("ExamFeeDr",Row,ExamFeeDr);
			//DHCC_SetColumnData("RegFeeDr",Row,RegFeeDr);
			DHCC_SetColumnData("ASRowIdC",Row,ASRowId);
			DHCC_SetColumnData("RoomCodeC",Row,RoomCode);
			DHCC_SetColumnData("DepDescC",Row,DepDesc);
			DHCC_SetColumnData("RegedCountC",Row,RegedCount);
			DHCC_SetColumnData("AppedCountC",Row,AppedCount);
			DHCC_SetColumnData("AddedCountC",Row,AddedCount);
			DHCC_SetColumnData("AvailNorSeqNoStrC",Row,AvailNorSeqNoStr);
			DHCC_SetColumnData("ScheduleStatusC",Row,ScheduleStatus);
			DHCC_SetColumnData("ScheduleDateC",Row,ScheduleDate);
			DHCC_SetColumnData("ScheduleDateWeekC",Row,ScheduleDateWeek);
			DHCC_SetColumnData("TimeRangeC",Row,TimeRange);
			DHCC_SetColumnData("TotalFeeC",Row,TotalFee);
			var rowObj = objtb2.getElementsByTagName("tr");
			var AppFlag=DHCC_GetElementData('AppFlag');
			var AppDate=DHCC_GetElementData('AppDate');
			//var CurrentDate=Ext.util.Format.date(new Date(), 'Y-m-d');
		    SetTableitemColor("MarkDescC",Row,"")
			if (ASRowId!=""){
				var SeqNoMode=DHCC_GetElementData('SeqNoMode');
				if ((AvailSeqNoStr=="")&&(AvailAddSeqNoStr=="")&&(SeqNoMode=='')){
					//alert(AvailSeqNoStr+"^"+AvailAddSeqNoStr+"^"+SeqNoMode)
					//objtbl.rows[Row].className='SqueezedIn';
					objtb2.rows[Row].className='ScheduleFull';
					SetTableitemColor("MarkDescC",Row,"red")
				}
				if ((AvailNorSeqNoStr=="")&&(SeqNoMode=='1')){
					objtb2.rows[Row].className='ScheduleFull';
					SetTableitemColor("MarkDescC",Row,"red")
				}
				if(ScheduleStatus=="停诊"){
					objtb2.rows[Row].className='ScheduleStop';
					//SetTableitemColor("MarkDescC",Row,"red")
				}
			}
		}

	} catch(e) {alert(e.message)}
	
}
function getDblClickRow(evt) {
	var eSrc=websys_getSrcElement(evt);
	while(eSrc.tagName != "TR") {if (eSrc.tagName == "TH") break;eSrc=websys_getParentElement(eSrc);}
	if (eSrc.tagName=="TR") {
		var gotheader=0;
		var tbl=getTable(eSrc);
		if (tbl.tHead) return eSrc.rowIndex;
		else return eSrc.rowIndex+1;
	}
	return "";
}
function MarkTableDblClickHandler(e)	{
	var selectrow=getDblClickRow(e);
	if (selectrow=="") return
	
	if (GetTableSelectRow()==""){
		var objtbl=window.document.getElementById('tDHCOPAdm_Reg_MarkList');
		var objrow=objtbl.rows[selectrow];
		objrow.click();
	}
	
  var ret=AddBeforeUpdate();
	if (ret) websys_setfocus('GetAmount');
}

function MarkTableCopyDblClickHandler(e)	{
	var selectrow=getDblClickRow(e);
	if (selectrow=="") return
	var objtbl=window.document.getElementById('tDHCOPAdm_Reg_MarkListCopy');
	if (GetTableSelectRow()==""){
		var objrow=objtbl.rows[selectrow];
		objrow.click();
	}	
  var ret=AddBeforeUpdate();
	if (ret) websys_setfocus('GetAmount');
}
function MarkTableKeyDownHandler(e)	{
	var key=websys_getKey(e);
	if (key==13) {
		//MarkTableDblClickHandler(e);
		var ret=AddBeforeUpdate();
		//配置 1可以多次挂号时 挂第二个号时聚焦到哪个元素上,2读卡或者卡号回车聚焦到哪个元素
		//websys_setfocus('MarkCode');
		websys_setfocus('GetAmount');
		if (ret==false){return false}
		return websys_cancel();
	}

	var selectrow=GetTableSelectRow();

	var objtbl=window.document.getElementById('tDHCOPAdm_Reg_MarkList');
	if (selectrow=="") return
	if (key==38){
		
		if (selectrow==1) return;
		var objrow=objtbl.rows[selectrow-1];
		objrow.click();
		//window.event.cancelBubble=true
	}
	if (key==40){
	
		if (selectrow==(objtbl.rows.length-1)) return;
		var objrow=objtbl.rows[selectrow+1];
		objrow.click();
		//window.event.cancelBubble=true
	}

	if (key==120){
		/*
		if (selectrow=="") return;
		var PatientID=DHCC_GetElementData('PatientID');
		if (PatientID=="") {
			alert(t['NotSelectPatient']);	
			websys_setfocus('CardNo');
			return false;
		}

		var ret=AddToRegTbl(selectrow);
		if (ret) {}
		*/
		var obj=document.getElementById('Update');
		if (obj) {
			UpdateClickHandler();
		}else{
			var obj=document.getElementById('Appoint');
			if (obj) {
				AppointClickHandler();
			}else{
				var obj=document.getElementById('AppointNormal');
				if (obj) {
					AppointNormalClickHandler()
				}else{
					AppointTelClickHandler();
				}
			}
		}
		return websys_cancel();
	}
}
function MarkTableCopyKeyDownHandler(e)	{
	var key=websys_getKey(e);
	if (key==13) {
		//MarkTableDblClickHandler(e);
		var objtbl=window.document.getElementById('tDHCOPAdm_Reg_MarkListCopy');
		var ret=AddBeforeUpdate();
		//配置 1可以多次挂号时 挂第二个号时聚焦到哪个元素上,2读卡或者卡号回车聚焦到哪个元素
		//websys_setfocus('MarkCode');
		websys_setfocus('GetAmount');
		 if (ret==false){return false}
		return websys_cancel();
	}

	var selectrow=GetTableSelectRow();

	if (selectrow=="") return
	if (key==38){
		var objtbl=window.document.getElementById('tDHCOPAdm_Reg_MarkListCopy');
		if (selectrow==1) return;
		var objrow=objtbl.rows[selectrow-1];
		objrow.click();
		//window.event.cancelBubble=true
	}
	if (key==40){
		var objtbl=window.document.getElementById('tDHCOPAdm_Reg_MarkListCopy');
		if (selectrow==(objtbl.rows.length-1)) return;
		var objrow=objtbl.rows[selectrow+1];
		objrow.click();
		//window.event.cancelBubble=true
	}

	if (key==120){
		/*
		if (selectrow=="") return;
		var PatientID=DHCC_GetElementData('PatientID');
		if (PatientID=="") {
			alert(t['NotSelectPatient']);	
			websys_setfocus('CardNo');
			return false;
		}

		var ret=AddToRegTbl(selectrow);
		if (ret) {}
		*/
		var obj=document.getElementById('Update');
		if (obj) {
			UpdateClickHandler();
		}else{
			var obj=document.getElementById('Appoint');
			if (obj) {
				AppointClickHandler();
			}else{
				var obj=document.getElementById('AppointNormal');
				if (obj) {
					AppointNormalClickHandler()
				}else{
					AppointTelClickHandler();
				}
			}
		}
		return websys_cancel();
	}
}
function GetTableSelectRow(e){
	if (selectedRowObj.rowIndex==""){return "";}
	var selectrow=selectedRowObj.rowIndex;
	return selectrow;
}

function SelectRowHandler(e){
	var selectrow=selectedRowObj.rowIndex;
	if (selectrow!=""){
		var tbl=getTable(selectedRowObj);
		if ((tbl.id=="tDHCOPAdm_Reg_MarkList")||(tbl.id=="tDHCOPAdm_Reg_MarkListCopy")) {
			var CopyTableEle="";
			if (tbl.id=="tDHCOPAdm_Reg_MarkListCopy") CopyTableEle="C";
			var AvailSeqNoStr=DHCC_GetColumnData('AvailSeqNoStr'+CopyTableEle,selectrow);
			var ASRowId=DHCC_GetColumnData('ASRowId'+CopyTableEle,selectrow);
			var AvailNorSeqNoStr=DHCC_GetColumnData('AvailNorSeqNoStr'+CopyTableEle,selectrow);
			var AvailAddSeqNoStr=DHCC_GetColumnData('AvailAddSeqNoStr'+CopyTableEle,selectrow);
			var SeqNoMode=DHCC_GetElementData('SeqNoMode');
			if (ASRowId!=""){
				var AppFlag=DHCC_GetElementData('AppFlag');
				//if (AppFlag==1){
					if ((AvailSeqNoStr=="")&&(AvailAddSeqNoStr=="")&&(SeqNoMode=='')){
						selectedRowObj.className='ScheduleFull';
						SetTableitemColor("MarkDesc"+CopyTableEle,selectrow,"red")
					}
					if ((AvailNorSeqNoStr=="")&&(SeqNoMode=='1')){
						selectedRowObj.className='ScheduleFull';
						SetTableitemColor("MarkDesc"+CopyTableEle,selectrow,"red")
					}
					//ShowTimeRange(ASRowId,"MarkDesc"+CopyTableEle+"z"+selectrow);
					var posElementObj=document.getElementById("MarkDesc"+CopyTableEle+'z'+selectrow);
					var posLeft=DHCC_getElementLeft(posElementObj);
					var posTop=DHCC_getElementTop(posElementObj)+20;
					var posStyle="left:"+ posLeft + "px; top : "+ posTop + "px"+"; position : absolute" + "; overflow : auto;";
					// alert(posStyle)
					//增加查看全部/可用号序功能
					var SearchAllNoFlag=0
					var Obj=document.getElementById("SearchAllNo")
					if ((Obj)&&(Obj.checked)){var SearchAllNoFlag=1}
					ShowTimeRange(ASRowId,tbl.id,"WIN",posStyle,AppFlag,SearchAllNoFlag);
					TimeRangeAppExt.mainpanel.setVisible(true);
					var DocName=DHCC_GetColumnData('MarkDesc'+CopyTableEle,selectrow);
					var MarkDate=DHCC_GetColumnData('ScheduleDate'+CopyTableEle,selectrow);
					TimeRangeAppExt.mainpanel.setTitle(DocName+" "+MarkDate)
					if(document.getElementById("AppTimeRange").rows.length==0){
						TimeRangeAppExt.mainpanel.setVisible(false)
					}
					window.setTimeout("TimeRangeN='Y'",1);
					event.stopPropagation();
				//}
			}
			//GetSelectRowPrice(selectrow);
		}
		GetSelectRowWeek(selectrow);
		
	}else{
		TimeRangeAppExt.mainpanel.setVisible(false)
	}
}

function GetSelectRowPrice(selectrow){
	var RegFee=DHCC_GetColumnData("RegFee",selectrow);
	var ExamFee=DHCC_GetColumnData("ExamFee",selectrow);
	var HoliFee=DHCC_GetColumnData("HoliFee",selectrow);
	var AppFee=DHCC_GetColumnData("AppFee",selectrow);
	var OtherFee=DHCC_GetColumnData("OtherFee",selectrow);
 
 	var AppDate=DHCC_GetColumnData("ScheduleDate",selectrow);
 	var CurrentDate=DHCC_GetElementData('CurrentDate');
 	var AppFlag=DHCC_GetElementData('AppFlag');
 
	if ((CurrentDate==AppDate)&&(AppDate!="")){AppDate="";}
	if (AppDate==""){AppFee=0;}
	var TotalFee=(parseFloat(HoliFee)+parseFloat(ExamFee)+parseFloat(RegFee)+parseFloat(AppFee)+parseFloat(OtherFee)).toFixed(2); 
 	
 	var MedicalBookVal=DHCC_GetElementData('MedicalBook');
 	if (MedicalBookVal==true){
 		var MRNoteFee=DHCC_GetElementData('MRNoteFee');
 		TotalFee=(TotalFee+parseFloat(MRNoteFee)).toFixed(2); 
 	}
 	var NeedCardFee=DHCC_GetElementData('NeedCardFee');
 	if (NeedCardFee==true){
 		var CardFee=DHCC_GetElementData('CardFee');
 		TotalFee=(TotalFee+parseFloat(CardFee)).toFixed(2); 
 	}
 	DHCC_SetElementData("BillAmount",TotalFee);
	return TotalFee
}

function GetSelectRowWeek(selectrow){
 	var ScheduleDateWeek=DHCC_GetColumnData("ScheduleDateWeek",selectrow);
 	DHCC_SetElementData("WeekDesc",ScheduleDateWeek);
	return ScheduleDateWeek
}

function GetReAdmFeeFlag(PatientID,ASRowId){
	var encmeth=DHCC_GetElementData("GetReAdmFeeFlagMethod");
	if (encmeth!=''){
		var ret=cspRunServerMethod(encmeth,PatientID,ASRowId);
		return ret;
	}
	return 0;
}

function AddToRegTbl(MarkTblSlectRow)	{
	/*
	var objtbl=window.document.getElementById('tDHCOPAdm_Reg_MarkList');
	var objrow=objtbl.rows[MarkTblSlectRow];
	objrow.click();
	*/
	
	var PatientID=DHCC_GetElementData("PatientID");
	var selectrow=MarkTblSlectRow;
	var tbl=getTable(selectedRowObj);
	var ASRowId=""
	var TotalFee=0;
	if (tbl.id=="tDHCOPAdm_Reg_MarkList"){
		var ASRowId=DHCC_GetColumnData("ASRowId",selectrow);
		var MarkDesc=DHCC_GetColumnData("MarkDesc",selectrow);
		var RegFee=DHCC_GetColumnData("RegFee",selectrow);
		var ExamFee=DHCC_GetColumnData("ExamFee",selectrow);
		var HoliFee=DHCC_GetColumnData("HoliFee",selectrow);
		var AppFee=DHCC_GetColumnData("AppFee",selectrow);
		var OtherFee=DHCC_GetColumnData("OtherFee",selectrow);
		var ReCheckFee=DHCC_GetColumnData("ReCheckFee",selectrow);

		var AvailSeqNoStr=DHCC_GetColumnData("AvailSeqNoStr",selectrow);
		var AvailAddSeqNoStr=DHCC_GetColumnData("AvailAddSeqNoStr",selectrow);
		var AvailNorSeqNoStr=DHCC_GetColumnData("AvailNorSeqNoStr",selectrow);
		var DepDesc=DHCC_GetColumnData("DepDesc",selectrow);
		//if (DepDesc=='') {DepDesc=combo_DeptList.getSelectedText();}
		if (DepDesc=='') {DepDesc=DHCC_GetColumnData("DeptList");}
		var SpecSeqNo=DHCC_GetElementData('SeqNo');
		var AppDate=DHCC_GetColumnData("ScheduleDate",selectrow);
		
		
		/*  //潍坊对特殊费用显示的处理   090312
		var OldMan=DHCC_GetElementData('OldMan');
		if (OldMan!=""){RegFee=0};
		var Mentality=DHCC_GetElementData('Mentality');
		var pDepRowId=DHCC_GetElementData('DepRowId');
		if ((Mentality!=0)&(pDepRowId!=144)){OtherFee=0};
		*/
	}else if (tbl.id=="tDHCOPAdm_Reg_MarkListCopy"){
		var ASRowId=DHCC_GetColumnData("ASRowIdC",selectrow);
		var MarkDesc=DHCC_GetColumnData("MarkDescC",selectrow);
	
		var RegFee=DHCC_GetColumnData("RegFeeC",selectrow);
		var ExamFee=DHCC_GetColumnData("ExamFeeC",selectrow);
		var HoliFee=DHCC_GetColumnData("HoliFeeC",selectrow);
		var AppFee=DHCC_GetColumnData("AppFeeC",selectrow);
		var OtherFee=DHCC_GetColumnData("OtherFeeC",selectrow);
		var ReCheckFee=DHCC_GetColumnData("ReCheckFeeC",selectrow);
	
		var AvailSeqNoStr=DHCC_GetColumnData("AvailSeqNoStrC",selectrow);
		var AvailAddSeqNoStr=DHCC_GetColumnData("AvailAddSeqNoStrC",selectrow);
		var AvailNorSeqNoStr=DHCC_GetColumnData("AvailNorSeqNoStrC",selectrow);
		var DepDesc=DHCC_GetColumnData("DepDescC",selectrow);
		//if (DepDesc=='') {DepDesc=combo_DeptList.getSelectedText();}
		if (DepDesc=='') {DepDesc=DHCC_GetColumnData("DeptList");}
	 	var AppDate=DHCC_GetColumnData("ScheduleDateC",selectrow);
	 	var TimeRange=DHCC_GetColumnData("TimeRangeC",selectrow);
		TotalFee=DHCC_GetColumnData("TotalFeeC",selectrow);
	}
	if (combo_DiagnosCat){
		var encmeth=DHCC_GetElementData("CheckASDiagnosCatMethod");
		if (encmeth!=''){
			var DiagnosCatRowId=combo_DiagnosCat.getSelectedValue();
			//看类方法同步类
			//var DiagnosCatRowId=combo_DiagnosCat.getSelectedValue().split('!')[0];
			var ret=cspRunServerMethod(encmeth,ASRowId,DiagnosCatRowId);
			if (ret==1){
				alert(t['NotInDiagnosCatLimit']);
				return false;
			}
		}
	}
	var SpecSeqNo=DHCC_GetElementData('SeqNo');
	if(TimeRangeAppExt.AppSeqNo){
		SpecSeqNo=TimeRangeAppExt.AppSeqNo
	}
	
	
	
	//var AppDate=DHCC_GetElementData('AppDate');
	var CurrentDate=DHCC_GetElementData('CurrentDate');
	var AppFlag=DHCC_GetElementData('AppFlag');
 	if (AppFlag==1){
 		if (AppDate==""){
 			/*
 			alert(t['AppDateIsNull']);
 			websys_setfocus('AppDate');
 			return false;
 			*/
 		}else{
 			if ((CurrentDate==AppDate)||(CheckOrderStartDate(CurrentDate,AppDate))){
 				alert(t['WrongAppDate']);
 				websys_setfocus('AppDate');
 				return false;
 			}
 		}
 	}

	//号别已挂完
	if ((SpecSeqNo=="+")&&(AppFlag=="1")){SpecSeqNo=""}
	if (SpecSeqNo=="+"){
		if (AvailAddSeqNoStr==""){
			//alert(t['ConfirmAddMark']);
			alert("该号别加号号源已挂完");
			return false;
			/*   //注释  决定是否允许挂号员加号  090312
			//var ContiuCheck=confirm((t['ConfirmAddMark']),false);
			var ContiuCheck=DHCC_Confirm(t['ConfirmAddMark']);
			if (ContiuCheck==false) return false;
			*/
		}
	}else{
		//AvailSeqNoStr="",AvailAddSeqNoStr=""
		if (AppFlag==0){
			if ((AvailSeqNoStr=="")&&(AvailAddSeqNoStr=="")){
				//alert(t['ConfirmAddMark']);    
                alert(t['MarkIsFull']);       				
				return false;
                /*    //注释  决定是否允许挂号员加号  090312
				//var ContiuCheck=confirm((t['ConfirmAddMark']),false);
				var ContiuCheck=DHCC_Confirm(t['ConfirmAddMark']);
				if (ContiuCheck==false) return false;	
				SpecSeqNo="+";
				*/
			}
		}else{
			var SeqNoMode=DHCC_GetElementData('SeqNoMode');
			var AdmType=DHCC_GetElementData('AdmType');
			if (AdmType!='E') {
				if ((AvailSeqNoStr=="")&&(AvailAddSeqNoStr=="")&&(SeqNoMode=='')){
					alert(t['MarkIsFull']);
					return false;
				}
				if ((AvailNorSeqNoStr=="")&&(SeqNoMode=='1')){
					alert(t['MarkIsFull']);
					return false;
				}
			}
		}
	}
	//判断界面上是否有重复挂号
	var Result=DuplReg(ASRowId);
	if (Result==1) {
		alert(t['RegSameMark']);
		//obj=document.getElementById('MarkCode');
		//if(obj) obj.value="";
		return false;
	}
	
	//添加到行记录前进行检测
	var Rtn=tkMakeServerCall('web.DHCOPAdmReg','CheckBeforeReg',ASRowId,PatientID,"");
	var RtnArry=Rtn.split("^")
	if (RtnArry[0]!=0){alert(RtnArry[1]);return false}

 	//实时从后台判断号别是否已挂完
 	//显示当日已经挂过的号
	//var ret=getolddoc(); 
	//if (!ret) return false;
 	if (CurrentDate==AppDate) {
 		AppDate="当日";
 		AppFee=0;
 	}
	//判断是否为复诊,如果是复诊价格可能会不同
	var ReAdmFeeFlag=GetReAdmFeeFlag(PatientID,ASRowId)
	if ((ReAdmFeeFlag==1)&&((ReCheckFee!="")&&(ReCheckFee!=0))){ExamFee=ReCheckFee}
	var MRNoteFee=0;CardFee=0;
	/*  //此处只显示号别相关费用不加入CheckBox勾选的费用
	var MedicalBookVal=DHCC_GetElementData('MedicalBook');
	if (MedicalBookVal) {MRNoteFee=DHCC_GetElementData('MRNoteFee')}
	var NeedCardFee=DHCC_GetElementData('NeedCardFee');
	if (NeedCardFee) {CardFee=DHCC_GetElementData('CardFee')}
	//alert(PatientID+"^"+ASRowId+"^"+parseFloat(HoliFee)+"^"+parseFloat(ExamFee)+"^"+parseFloat(RegFee)+"^"+parseFloat(AppFee)+"^"+parseFloat(OtherFee)+"^"+parseFloat(MRNoteFee))
	*/
   
	//是否是免挂号费或者诊查诊 界面checkbox选择?自动改变诊金金额  2010-06-20  guobaoping
	var FreeCheckFlag=""
	FreeCheck=DHCC_GetElementData('FreeCheck');
	if(FreeCheck) FreeCheckFlag="Y"
	if(FreeCheckFlag=="Y")
	{ 
		ExamFee=0;
	} 
	var FreeRegFlag=""
	FreeReg=DHCC_GetElementData('FreeReg');
	if(FreeReg) FreeRegFlag="Y"
	if(FreeRegFlag=="Y")
	{ 
		RegFee=0;
	} 
     //-----end
	//配置?劬龆?是否提示零费用号   090312
	var TotalFee=parseFloat(HoliFee)+parseFloat(ExamFee)+parseFloat(RegFee)+parseFloat(AppFee)+parseFloat(OtherFee)+parseFloat(MRNoteFee);
	if (TotalFee==0){
		var ContiuCheck=confirm((t['ConfirmAddZeroPriceMark']),false);
		if (ContiuCheck==false) return false;	
	}
	TotalFee=parseFloat(TotalFee).toFixed(2) 
	//已挂号累计金额
	var BillAmount=DHCC_GetElementData("BillAmount");
	var ToBillAmount=parseFloat((parseFloat(+BillAmount)+TotalFee)).toFixed(2);
	AccAmount=DHCC_GetElementData('AccAmount');
	//如果采用帐户支付要判断是否帐户余额足够
	var PayModeCode=GetPayModeCode();
	if (PayModeCode=="CPP") {
 		if (ToBillAmount>parseFloat(AccAmount)) {
   		alert(t['AccAmountNotEnough']);
   		return false;
 		}
 	} 	
 	var RegInfo=ASRowId+"^"+MarkDesc+"^"+TotalFee+"^"+ExamFee+"^"+HoliFee+"^"+AppFee+"^"+DepDesc+"^"+AppDate+"^"+SpecSeqNo+"^"+ReAdmFeeFlag+"^"+FreeRegFlag+"^"+FreeCheckFlag;
 	//alert(RegInfo)
 	AddRegToTable(RegInfo);
 	DHCC_SetElementData("BillAmount",ToBillAmount);
 	var PayModeCode=GetPayModeCode()
	if(PayModeCode!="CPP") ReCalculateAmount();
	return true
}
function AddRegToTable(val) {
	try {
		var objtbl=document.getElementById("tDHCOPAdm_Reg");
		var rows=objtbl.rows.length;

		if (rows==2){
			//第一行不为空则增加一行
		    var Row=objtbl.rows.length-1;
		    var valueAry=val.split("^");
				var ASRowId=DHCC_GetColumnData("TabASRowId",1);  //TabASRowId为一个隐藏元素
				if (ASRowId!=""){AddRowNew(objtbl);}
			}else{
				AddRowNew(objtbl);
			}

			var Row=objtbl.rows.length-1;
			var Row=GetRow(Row);
			var valueAry=val.split("^");
			var TabASRowId=valueAry[0];
			var TabMarkDesc=valueAry[1];
			var TabPrice=valueAry[2];
			var TabExamFee=valueAry[3];
			var TabHoliFee=valueAry[4];
			var TabAppFee=valueAry[5];
			var TabDepDesc=valueAry[6];
			var TabAppDate=valueAry[7];
			var TabSeqNo=valueAry[8];
			var TabReAdmFeeFlag=valueAry[9];
	        //界面选择复诊或义诊  +20100629  guo
			var TabFreeRegFlag=valueAry[10];
			var TabFreeCheckFlag=valueAry[11];
			var TAPPTRowID=""
			if (valueAry.length>=15){
				TAPPTRowID=valueAry[14];
			}
			var PCLRowID=""
			if (valueAry.length>=16){
				PCLRowID=valueAry[15];
			}
			
			DHCC_SetColumnData("TabASRowId",Row,TabASRowId);
			DHCC_SetColumnData("TabMarkDesc",Row,TabMarkDesc);
			DHCC_SetColumnData("TabPrice",Row,TabPrice);
			DHCC_SetColumnData("TabExamFee",Row,TabExamFee);
			DHCC_SetColumnData("TabHoliFee",Row,TabHoliFee);
			DHCC_SetColumnData("TabAppFee",Row,TabAppFee);
			DHCC_SetColumnData("TabDepDesc",Row,TabDepDesc);
			DHCC_SetColumnData("TabAppDate",Row,TabAppDate);
			DHCC_SetColumnData("TabSeqNo",Row,TabSeqNo);
			DHCC_SetColumnData("TabSeqNo",Row,TabSeqNo);
			DHCC_SetColumnData("TabReAdmFeeFlag",Row,TabReAdmFeeFlag);
			DHCC_SetColumnData("TabFreeRegFlag",Row,TabFreeRegFlag);
			DHCC_SetColumnData("TabFreeCheckFlag",Row,TabFreeCheckFlag);
			DHCC_SetColumnData("TAPPTRowID",Row,TAPPTRowID);
			DHCC_SetColumnData("TabPCLRowID",Row,PCLRowID);
			if (Row>1){
				//急诊分级表,此处应该循环表格记录数,判断是否重复
			   var FirstTabPCLRowID=DHCC_GetColumnData('TabPCLRowID',1);
			   var DepRowId=DHCC_GetElementData("DepRowId") //combo_DeptList.getSelectedValue();
			   if ((FirstTabPCLRowID!="")&&(FirstTabPCLRowID!=PCLRowID)) {
				   var IsEmergency=tkMakeServerCall("web.DHCOPAdmReg","IsEmergency",DepRowId);
				   if(IsEmergency=="1") DHCC_SetColumnData("TabPCLRowID",Row,FirstTabPCLRowID);
			   }
			}
			if (TimeRangeAppExt.mainpanel){
				TimeRangeAppExt.mainpanel.setVisible(false)
				TimeRangeN="N"
			}
	} catch(e) {alert(e.message)};
}

function getolddoc() {
	var PatientNo=DHCC_GetElementData('PatientNo');
	var GetDocMethod=document.getElementById('GetOldDoc');
	if (GetDocMethod) {var encmeth=GetDocMethod.value} else {var encmeth=''};
	var str=cspRunServerMethod(encmeth,'',"",PatientNo,'0')

	if (str!=0){
		var valueary1=str.split("!");
		var msg="该患者本日已经挂科室为:\n"
		for (i=0;i<valueary1.length;i++){
			var valueary2=valueary1[i].split("^");
			msg=msg+valueary2[1]+"的"+valueary2[3]+";\n"+"挂号时间为:"+valueary2[4]+"挂号人为:"+valueary2[5]+"\n";
		}
		msg=msg+"        您是否要继续?\n"
		var ContiuCheck=confirm((msg),false);
		if (ContiuCheck==false) return false;		
		websys_setfocus('CardNo');
	}
	return true;
}
function GetPayModeCode(){
	var obj=document.getElementById("PayMode");
	if (obj){
		var PayModeValue=obj.value;
		if (PayModeValue!="") {
			var pmod=PayModeValue.split("^");	
			return pmod[2];
		}
	}
	return "";
}


function DuplReg(ASRowId)	{

	var objtbl=document.getElementById('tDHCOPAdm_Reg');
	var rows=objtbl.rows.length;
     
	for (var j=1;j<rows;j++) {
		//var eSrc=objtbl.rows[j];
		//var RowObj=getRow(eSrc);
		var RowObj=objtbl.rows[j];
		var rowitems=RowObj.all;
		if (!rowitems) rowitems=RowObj.getElementsByTagName("*");		
		for (var i=0;i<rowitems.length;i++) {
			
			if (rowitems[i].id) {
				var Id=rowitems[i].id;
				var arrId=Id.split("z");
				var Row=arrId[arrId.length-1];
			}
		}
		var TabASRowId=DHCC_GetColumnData('TabASRowId',Row);
	  if (ASRowId==TabASRowId)	return 1;
	}

	return 0;
}

function tDHCOPAdmRegDblClickHandler()	{
	var eSrc=window.event.srcElement;
	if (eSrc.tagName=="IMG") eSrc=window.event.srcElement.parentElement;
	var objtbl=document.getElementById('tDHCOPAdm_Reg');
	var rows=objtbl.rows.length;
	var lastrowindex=rows - 1;
	var rowObj=getRow(eSrc);
	var selectrow=rowObj.rowIndex;
	if (!selectrow) return;
	RemoveOPAdmRegDblRow(selectrow);
}

function RemoveOPAdmRegDblRow(selectrow){
	var objtbl=document.getElementById('tDHCOPAdm_Reg');
	var rows=objtbl.rows.length;
	var lastrowindex=rows - 1;
	if(TimeRangeAppExt.mainpanel){
		TimeRangeAppExt.mainpanel.setVisible(false)	
	}
	if ((lastrowindex==1)&&(selectrow==1)) {
		DHCC_ClearTableRowByIndex(objtbl,1);
		DHCC_SetElementData("BillAmount","0.00");	
		var MedicalBookVal=DHCC_GetElementData('MedicalBook');
		var NeedCardFee=DHCC_GetElementData('NeedCardFee');
		if (MedicalBookVal==true)MedicalBookCheck();
		if (NeedCardFee==true)NeedCardFeeCheck();
		ReCalculateAmount();
		return;
	}
	if (selectrow!=0) {
	
		var TabPrice=DHCC_GetColumnData("TabPrice",selectrow);
		objtbl.deleteRow(selectrow);
		//tk_ResetRowItems(objtbl);
	  	DHCC_ResetRowItems(objtbl);
	  	//lxz 删除一个号别如果只是减去价格在判断勾选病历本,那么会造成勾选项重复添加。(所有勾选项都一样)
	  	//那么修改为删除的时候从新叠加计算就没有问题。
	  	var BillAmount=0
	  	for (i=1;i<(rows-1);i++){
		  	var TabPrice=DHCC_GetColumnData("TabPrice",i);
		  	if (TabPrice=="") continue;
		  	BillAmount=parseFloat(BillAmount)+parseFloat(TabPrice)
		}
	  	/*
		var BillAmount=DHCC_GetElementData('BillAmount');
		BillAmount=parseFloat(BillAmount)-parseFloat(TabPrice);
		*/
		DHCC_SetElementData("BillAmount",BillAmount);
		var MedicalBookVal=DHCC_GetElementData('MedicalBook');
		var NeedCardFee=DHCC_GetElementData('NeedCardFee');
		if (MedicalBookVal==true)MedicalBookCheck();
		if (NeedCardFee==true)NeedCardFeeCheck();
		var PayModeCode=GetPayModeCode()
		if(PayModeCode!="CPP")ReCalculateAmount();
	}
}
function DHCC_ResetRowItems(objtbl) {
	//alert(objtbl.rows.length);
	for (var i=0;i<objtbl.rows.length; i++) {
		var objrow=objtbl.rows[i];
		{if ((i+1)%2==0) {objrow.className="RowEven";} else {objrow.className="RowOdd";}}
		var rowitems=objrow.all; //IE only
		if (!rowitems) rowitems=objrow.getElementsByTagName("*"); //N6
		for (var j=0;j<rowitems.length;j++) {
			//alert(i+":"+j+":"+rowitems[j].id);
			if (rowitems[j].id) {
				var arrId=rowitems[j].id.split("z");
				//if (arrId[arrId.length-1]==i+1) break; //break out of j loop
				arrId[arrId.length-1]=i;
				rowitems[j].id=arrId.join("z");
				rowitems[j].name=arrId.join("z");
			}
		}
	}
}
function GetAmountChangeHandler()	{
	if (evtName=='PayQty') {
		window.clearTimeout(evtTimer);
		evtTimer='';
		evtName='';
	}

	var key=websys_getKey(e);
	if (key==13) {
		ReCalculateAmount();
		//潍坊是跳到费别选择上需要设置组件元素的焦点顺序   090312
		//DHCC_Nextfoucs();
		websys_setfocus('Update');
		
	}	
}
function GetAmountkeypresshandler(e){
	try {keycode=websys_getKey(e);} catch(e) {keycode=websys_getKey();}
	if (keycode==45){window.event.keyCode=0;return websys_cancel();}

	if (((keycode>47)&&(keycode<58))||(keycode==46)){
		//add by zhouzq 2010.11.18  如果输入金额过长导致溢出计算有误
		if (document.getElementById('GetAmount').value.length>11) {
			window.event.keyCode=0;return websys_cancel();
		}
	}else{
		window.event.keyCode=0;return websys_cancel();
	}
}
function ReCalculateAmount(){
	var BillAmount=DHCC_GetElementData('BillAmount');
	var GetAmount=DHCC_GetElementData('GetAmount');

	if ((GetAmount!="")&&(GetAmount!='0.00')){
		var ReturnAmount=parseFloat(GetAmount)-BillAmount;
		var ReturnAmount=ReturnAmount.toFixed(2)
		DHCC_SetElementData("ReturnAmount",ReturnAmount)
		var obj=document.getElementById("ReturnAmount");
		if (obj){
			if (ReturnAmount<0){obj.className="clsInvalid"}else{obj.className=""}
		}
	}
}

function AppointNormalClickHandler(e){
	var AppStFlag=ChekAppSatrtTime();
  	if (AppStFlag!="Y") return;
	var ret=AddBeforeUpdate();
	if (ret==false){return false}
	
	var objtbl=document.getElementById('tDHCOPAdm_Reg');
	var rows=objtbl.rows.length;
	if (rows==2) {
		var ASRowId=DHCC_GetColumnData('TabASRowId',1);
		if (ASRowId==''){
			alert(t['NoRegRow']);
			return false;
		}
	}

	//办理预约是否要预先分配号,取号的处理在同一界面吗
	var AppFlag=DHCC_GetElementData('AppFlag');
	var PatientID=DHCC_GetElementData('PatientID');
	var AdmReason="";
	var UserID=session['LOGON.USERID'];
	var GroupID=session['LOGON.GROUPID'];
	
	try {
		for (var j=1;j<rows;j++) {
			var TabASRowId=DHCC_GetColumnData("TabASRowId",j);
			var TabQueueNo=DHCC_GetColumnData("TabSeqNo",j);
			var encmeth=DHCC_GetElementData('OPRAppNormalEncrypt');
			if (encmeth!=''){
				var ret=cspRunServerMethod(encmeth,'','',PatientID,TabASRowId,TabQueueNo,UserID);
				if (ret=="0"){
					alert(t["AppOK"]);
					Clear_click();
				}else{
					if(ret=="-201"){ret="，此号已预约完"}
					else if(ret=="-202"){ret="，此号没有排班记录"}
					else if(ret=="-203"){ret="，此号已停止或者被替诊"}
					else if(ret=="-301"){ret="，此病人超过每天挂号限额"}
					else if(ret=="-302"){ret="，此病人超过每天挂一个医生的限额"}	
					alert(t['AppFail']+ret);
					RemoveOPAdmRegDblRow(j);
					websys_setfocus('CardNo');
					return;
				}
			}
		}
	}catch(e){alert(e.message)}			
}

function AppointClickHandler(){
	/*    //配置 如果是一次可挂多个号不走注释部分  090312
	var ret=AddBeforeUpdate();       
	if (ret==false){return false}    
	return false
	*/
	var AppStFlag=ChekAppSatrtTime();
	if (AppStFlag!="Y") return;
	
	var objtbl=document.getElementById('tDHCOPAdm_Reg');
	var rows=objtbl.rows.length;
	if (rows==2) {
		var ASRowId=DHCC_GetColumnData('TabASRowId',1);
		if (ASRowId==''){
			alert(t['NoRegRow']);
			return false;
		}
	}
	

  //办理预约是否要预先分配号,取号的处理在同一界面吗
  var AppFlag=DHCC_GetElementData('AppFlag');
  var PatientID=DHCC_GetElementData('PatientID');
  var AdmReason="";
  var UserID=session['LOGON.USERID'];
  var GroupID=session['LOGON.GROUPID'];
  //判断是否存在有效的黑名单记录，Falg为1有效，不允许预约
  var BlackFlag=tkMakeServerCall("web.DHCRBAppointment","GetLimitAppFlag",PatientID,"")
  var BlackFlag=BlackFlag.split("^")[0] //BlackFlag.split("^")[1]为有效日期 如有维护有效日期 可在此增加提示信息
  if (BlackFlag==1){
	      alert("存在有效黑名单记录,不允许预约")
	      return false
	}
  var AppPatCredNo=DHCC_GetElementData('AppPatCredNo');
  var AppPatName=DHCC_GetElementData('AppPatName');
  var AppPatTel=DHCC_GetElementData('AppPatTel');
  var AppPatAddress=DHCC_GetElementData('AppPatAddress');
  var AppRemarks=DHCC_GetElementData('Remarks');
  var AppPatInfo="";
  var CommonPatientID = tkMakeServerCall("web.DHCOPAdmReg","GetCommonPatientID")
  var CommonPatientID="^"+CommonPatientID+"^"
  if(CommonPatientID.indexOf("^"+PatientID+"^")!="-1"){
	  if((AppPatName=="")||(AppPatCredNo=="")||(AppPatTel==""))
	  {
		  alert("无卡预约的病人必须填写完整预约信息");
		  return;
	  }else{
		  if(AppPatCredNo!=""){
			    var myIsID=DHCWeb_IsIdCardNo(AppPatCredNo);
				if (!myIsID){
					websys_setfocus("AppPatCredNo");
					return false;
				}
		  }
		  if (!CheckTelOrMobile(AppPatTel,"AppPatTel","预约人")) return false;
		  AppPatInfo=AppPatName+"$"+AppPatCredNo+"$"+AppPatTel+"$"+AppPatAddress+"$"+AppRemarks
	  }
  }
	try {
		for (var loop=1;loop<rows;loop++) {
			var TabASRowId=DHCC_GetColumnData("TabASRowId",loop);
			var TabQueueNo=DHCC_GetColumnData("TabSeqNo",loop);
			var AppPatInfo="$$$$"+AppRemarks
			var encmeth=DHCC_GetElementData('OPRAppEncrypt');
			if (encmeth!=''){
				var retstr=cspRunServerMethod(encmeth,'','',PatientID,TabASRowId,TabQueueNo,UserID,AppPatInfo);
				var retArr=retstr.split("^")
				var ret=retArr[0]
				var AppARowid=retArr[1]
				if (ret=="0"){
					alert(t["AppOK"]);  
					//配置 决定是否打印预约条做单独一个函数   090312
					var AppPrinte=DHCC_GetElementData('AppPrint');
					if(AppPrinte!=""){
						//var AppPrintData=cspRunServerMethod(AppPrinte,AppARowid);
						//AppPrintOut(AppPrintData)//此处调用打印程序
					}
				}else{
					if(ret=="-201"){ret="，此号已预约完"}
					else if(ret=="-202"){ret="，此号没有排班记录"}
					else if(ret=="-203"){ret="，此号已停止或者被替诊"}
					else if(ret=="-301"){ret="，此病人超过每天挂号限额"}
					else if(ret=="-302"){ret="，此病人超过每天挂一个医生的限额"}
					else if(ret=="-303"){ret="，此病人超过每人每天挂相同科室限额"}	
					alert(t['AppFail']+ret);
					RemoveOPAdmRegDblRow(loop);
					websys_setfocus('CardNo');
					return;
				}
			}	
		}
		Clear_click();
	}catch(e){alert(e.message)}			
	
}
function AppointTelClickHandler(){
	/*    //配置 如果是一次可挂多个号不走注释部分  090312
	var ret=AddBeforeUpdate();       
	if (ret==false){return false}    
	return false
	*/
	var objtbl=document.getElementById('tDHCOPAdm_Reg');
	var rows=objtbl.rows.length;
	if (rows==2) {
		var ASRowId=DHCC_GetColumnData('TabASRowId',1);
		if (ASRowId==''){
			alert(t['NoRegRow']);
			return false;
		}
	}

	//办理预约是否要预先分配号,取号的处理在同一界面吗
	var AppFlag=DHCC_GetElementData('AppFlag');
	var PatientID=DHCC_GetElementData('PatientID');
	var AdmReason="";
	var UserID=session['LOGON.USERID'];
	var GroupID=session['LOGON.GROUPID'];
	var AppPatCredNo=DHCC_GetElementData('AppPatCredNo');
	var AppPatName=DHCC_GetElementData('AppPatName');
	var AppPatTel=DHCC_GetElementData('AppPatTel');
	var AppPatAddress=DHCC_GetElementData('AppPatAddress');
	var AppPatInfo="";
	if((AppPatName!="")||(AppPatCredNo!="")||(AppPatTel!=""))
	{
	  if((AppPatName=="")||(AppPatCredNo=="")||(AppPatTel==""))
	  {
		alert("无卡预约的病人必须填写完整预约信息");
		return;
	  }
	  AppPatInfo=AppPatName+"$"+AppPatCredNo+"$"+AppPatTel+"$"+AppPatAddress
	}

	try {
		for (var j=1;j<rows;j++) {
			var TabASRowId=DHCC_GetColumnData("TabASRowId",j);
			var TabQueueNo=DHCC_GetColumnData("TabSeqNo",j);
			
			var encmeth=DHCC_GetElementData('OPAppTelEncrypt');
			if (encmeth!=''){
				var retstr=cspRunServerMethod(encmeth,'','',PatientID,TabASRowId,TabQueueNo,UserID,AppPatInfo);
				var retArr=retstr.split("^")
				var ret=retArr[0]
				var AppARowid=retArr[1]
				if (ret=="0"){
					alert(t["AppOK"]);  
					Clear_click();
					//配置 决定是否打印预约条做单独一个函数   090312
					var AppPrinte=DHCC_GetElementData('AppPrint');
					if(AppPrinte!=""){
						//var AppPrintData=cspRunServerMethod(AppPrinte,AppARowid);
						//AppPrintOut(AppPrintData)//此处调用打印程序
					}
				}else{
					if(ret=="-201"){ret="，此号已预约完"}
					else if(ret=="-202"){ret="，此号没有排班记录"}
					else if(ret=="-203"){ret="，此号已停止或者被替诊"}
					else if(ret=="-301"){ret="，此病人超过每天挂号限额"}
					else if(ret=="-302"){ret="，此病人超过每天挂一个医生的限额"}
					alert(t['AppFail']+ret);
					RemoveOPAdmRegDblRow(j);
					websys_setfocus('CardNo');
					return;
				}
			}
		}
	}catch(e){alert(e.message)}			
	
}
function AddBeforeUpdateByASRowId(ASRowId) {
	if (ASRowId=="") return true;
	var PatientID=DHCC_GetElementData('PatientID');
	var myrtn=tkMakeServerCall("web.DHCOPAdmReg","CheckRegDeptAgeSex",ASRowId,PatientID);
	var Flag=myrtn.split(String.fromCharCode(2))[0];
	if (Flag!="0") {
		var msg="";
		var AllowSexDesc=myrtn.split(String.fromCharCode(2))[1];
		if (AllowSexDesc!="") msg="此科室支持性别【"+AllowSexDesc+"】";
		var AgeRange=myrtn.split(String.fromCharCode(2))[2];
		if (AgeRange!="") {
			if (msg=="") {msg="此科室支持年龄段:"+AgeRange;}else{msg=msg+","+"此科室支持年龄段【"+AgeRange+"】";}
		}
		alert("不允许挂此科室,"+msg);
		return false;
	}
	var myrtn=tkMakeServerCall("web.DHCOPAdmReg","CheckScheduleStatus",ASRowId);
	if (myrtn=="S") {
		alert("不允许挂此排班,该排班已停诊.");
		return false;
	}
	return true;
}
function AddBeforeUpdate(){
	var selectrow=GetTableSelectRow();
	if (selectrow=="") return;
	var PatientID=DHCC_GetElementData('PatientID');
	if (PatientID=="") {
		alert(t['NotSelectPatient']);	
		websys_setfocus('CardNo');
		return false;
	}
	var tbl=getTable(selectedRowObj);
	if (tbl.id=="tDHCOPAdm_Reg_MarkList"){
		var ASRowId=DHCC_GetColumnData("ASRowId",selectrow);
		if (ASRowId=="") return false;
		var ret=AddBeforeUpdateByASRowId(ASRowId);
		if (ret==false) return false;
		//对于界面中textbox与金额有关的都每次通过右边的列表循环计算 090312
		//DHCC_SetElementData("BillAmount","0.00");
		var ret=AddToRegTbl(selectrow);
		if (ret==false) {return false}
	}
	else if (tbl.id=="tDHCOPAdm_Reg_MarkListCopy"){
		var ASRowId=DHCC_GetColumnData("ASRowIdC",selectrow);
		if (ASRowId=="") return false;
		var ret=AddBeforeUpdateByASRowId(ASRowId);
		if (ret==false) return false;
		//对于界面中textbox与金额有关的都每次通过右边的列表循环计算 090312
		//DHCC_SetElementData("BillAmount","0.00");
		var ret=AddToRegTbl(selectrow);
		if (ret==false) {return false}
	}
	return true;
}
function SetDefaultTimeRange(){
	var encmeth=DHCC_GetElementData('GetDefaultTRMethod');
	if (encmeth!=''){
		var TRRowId=cspRunServerMethod(encmeth);
		if (TRRowId!=""){
			combo_TimeRange.setComboValue(TRRowId);
		}else{
			combo_TimeRange.setComboText('');
		}
	}
}
function MarkListkeydownHandler()
{
	/*   //潍坊对慢性病的处理要求是慢性病必须输入慢性病代码  090312
	BillTypeObj=document.getElementById("BillType");
	if (BillTypeObj){
		var BillTypeTextn=BillTypeObj.selectedIndex;
		var BillTypeText= BillTypeObj.options[BillTypeTextn].text;
		BillTypeTBFlag=BillTypeText.indexOf("慢性病"); 
		if ((BillTypeTBFlag!='-1')&&(DHCC_GetElementData('DiagnosCat')=='')){alert('请输入慢性病代码');return}
	}
	*/
	var ret=AddBeforeUpdate();
	//通过聚焦配置来处理    090312
	websys_setfocus('MarkCode');
	if (ret==false){return false}
	//return false;

}
//是否启用挂号医保实时结算
/*params*
*PatientID:患者ID
*ASRowId:出诊记录ID
*UseInsuFlag:界面医保标识(Y/N)【可选】
*[AdmReasonId]:费别ID【可选】
*[InsuReadCardInfo]:读医保卡的返回信息【可选】
*/
function IsEnableInsuBill(PatientID,ASRowId,UseInsuFlag,AdmReasonId,InsuReadCardInfo) {
	var IsEnableInsuBillFlag=false;
	var InsurFlag=tkMakeServerCall("web.DHCDocOrderCommon","GetInsurFlag",AdmReasonId,"O");
	//1.按费别优先
	if (CFEnableInsuBill==1) {
		if (InsurFlag==1){IsEnableInsuBillFlag=true}else{IsEnableInsuBillFlag=false}
	}
	//2.按界面传入参数优先
	if (CFEnableInsuBill==2) {
		if (UseInsuFlag=='Y') {
			if (InsurFlag==1){IsEnableInsuBillFlag=true}else{IsEnableInsuBillFlag=false}
		}else{
			IsEnableInsuBillFlag=false;
		}
	}
	return IsEnableInsuBillFlag;
}
function CallInsuBill(InsuBillParamsObj) {
	try {
		var myrtn="";
		var obj=document.getElementById("GetInsuBillPara");
		if(obj){var encmeth=obj.value;}else{var encmeth='';}
		myrtn=cspRunServerMethod(encmeth,"","",InsuBillParamsObj.PatientID,InsuBillParamsObj.UPatientName,InsuBillParamsObj.UserID,InsuBillParamsObj.ASRowId,InsuBillParamsObj.AdmReasonId,InsuBillParamsObj.FeeStr,InsuBillParamsObj.RegType,"",InsuBillParamsObj.FreeRegFeeFlag,InsuBillParamsObj.InsuReadCardInfo,InsuBillParamsObj.RetInsuGSInfo);

		myrtn=InsuOPReg(0,InsuBillParamsObj.UserID,"","",InsuBillParamsObj.AdmReasonId,myrtn);
		//alert("myrtn=="+myrtn);
		
		return myrtn;
	}catch(e) {
		alert("医保接口封装函数程序异常,Err:"+e.message)
		return "";
	}
}
function UpdateClickHandler(){
	/*    //配置 如果是一次可挂多个号不走注释部分,一次挂一个号时使用  090312
	var ret=AddBeforeUpdate();       
	if (ret==false){return false}
	return false;
	*/
	//初始化打印模板--如果打印发票不刷新模板重新初始化
	var obj=document.getElementById('AppFlag');
	if (obj.value==0){
		DHCP_GetXMLConfig("InvPrintEncrypt","DHCOPAdmRegPrint");
	} 
	
	var objtbl=document.getElementById('tDHCOPAdm_Reg');
	var rows=objtbl.rows.length;
	if (rows==2) {
		var ASRowId=DHCC_GetColumnData('TabASRowId',1);
		if (ASRowId==''){
			alert(t['NoRegRow']);
			return false;
		}
	}

	var BillAmount=DHCC_GetElementData('BillAmount');  //合计价格 wml
	var CardNo=DHCC_GetElementData('CardNo');    //登记号 wml
	//帐户RowId
	var AccRowId=""; 
	var PayModeCode=GetPayModeCode();  //支付方式 wml
	if (PayModeCode=="CPP") {
		var myoptval=combo_CardType.getSelectedValue();
		var myary=myoptval.split("^");
		var CardTypeRowID=myary[0];
		var ren=DHCACC_CheckMCFPay(BillAmount,CardNo,"",CardTypeRowID);
		var myary=ren.split("^");
		if (myary[0]!='0'){
			if (myary[0]=='-204'){alert(t['AccountLocked'])}
			if (myary[0]=='-205'){alert(t['AccAmountNotEnough'])}
			if (myary[0]=='-206'){alert(t['NotSameCard'])}
			return;
		}else{
			var AccRowId=myary[1];
			var AccAmount=DHCC_GetElementData('AccAmount');
			if ((AccRowId!="")&&(AccAmount=="")){
				var AccmLeftBalance=tkMakeServerCall("web.DHCOPAdmReg","GetAccmLeftBalance",AccRowId);
				DHCC_SetElementData('AccAmount',AccmLeftBalance);
			}
		}
	}	
	//当实收金额小于应收金额不允许挂号,走配置
	var CFNotNullRealAmount=GetDHCOPRegConfig("NotNullRealAmount");
	try {
		if (CFNotNullRealAmount==1) {
			var GetAmountPrice=DHCC_GetElementData('GetAmount');   //实收金额 wml
			if (GetAmountPrice==""){GetAmountPrice=0} 
			/* if ((parseFloat(GetAmountPrice)=="0")&(PayModeCode=="CASH")){
				var ContinueReg=confirm(('实收金额为零是否继续挂此号?'),false);
				if (ContinueReg==false) {websys_setfocus("GetAmount"); return ;}
			} */
			if ((PayModeCode=='CASH')&((parseFloat(GetAmountPrice))<BillAmount)){
				alert("实收金额不能小于应收金额!");
				websys_setfocus("GetAmount");
				return false;
			}
		}
	}catch(e){alert(e.message);}
	//办理预约是否要预先分配号,取号的处理在同一界面吗
	var AppFlag=DHCC_GetElementData('AppFlag');     //预约 wml
	var PatientID=DHCC_GetElementData('PatientID');  //病人id wml
	var AdmReason="";
	var UserID=session['LOGON.USERID'];    //用户id wml
	var GroupID=session['LOGON.GROUPID'];   //安全组id
	var LocID=session['LOGON.CTLOCID'];
	var AdmReason=DHCC_GetElementData('BillType');  //收费类别 wml
	var MedicalBookVal=DHCC_GetElementData('MedicalBook');    //病历本 wml
	var AdmType=DHCC_GetElementData('AdmType');   //
	
	var RegConDisId="";
	var obj=document.getElementById("RegConDisList");  //优惠 wml
	if (obj){
		RegConDisId=obj.value;
	}
	var DiagnosCatRowId="";
	if (combo_DiagnosCat) DiagnosCatRowId=combo_DiagnosCat.getSelectedValue();
	//需要对照后台的差异   090312
	//if (combo_DiagnosCat) {DiagnosCatRowId=combo_DiagnosCat.getSelectedValue();DiagnosCatRowId=DiagnosCatRowId.split('!')[0];}
	var RemoveRows=""
	try {
		for (var j=1;j<rows;j++) {
			var TabPrice=DHCC_GetColumnData("TabPrice",j);
			var TabASRowId=DHCC_GetColumnData("TabASRowId",j);
			//此时的诊查费可能是复诊诊查费
			var TabExamFee=DHCC_GetColumnData("TabExamFee",j);
			var TabHoliFee=DHCC_GetColumnData("TabHoliFee",j);
			var TabAppFee=DHCC_GetColumnData("TabAppFee",j);
			var TabQueueNo=DHCC_GetColumnData("TabSeqNo",j);
			var AppDate=DHCC_GetColumnData("TabAppDate",j);
			var TabReAdmFeeFlag=DHCC_GetColumnData('TabReAdmFeeFlag',j)
			//界面上传过来的免挂号费和免诊查费标记
			var TabFreeRegFlag=DHCC_GetColumnData('TabFreeRegFlag',j)
			var TabFreeCheckFlag=DHCC_GetColumnData('TabFreeCheckFlag',j)
			//预约ID
			var TAPPTRowID=DHCC_GetColumnData('TAPPTRowID',j); 
			//急诊分级表
			var TabPCLRowID=DHCC_GetColumnData('TabPCLRowID',j); 
			//是否传病历号
			//var obj=document.getElementById('BLFlag');
			var TabMRFee="0";var TabCardFee="0"
			//病历本费置收取1份
			if ((DHCC_GetElementData('MedicalBook')==true)&&(j==1)){TabMRFee="1"}
			if (DHCC_GetElementData('NeedCardFee')==true){TabCardFee="1"}
			//潍坊取病历本费,改成走是否收病历本费的配置   090312
			//if (DHCC_GetElementData('MedicalBook')==true){TabMRFee=1}
			//如果为复诊,且有诊查费,则重新设置穿入参数值
			var TabReCheckFee=0;
			if ((TabReAdmFeeFlag==1)&&((TabExamFee!="")&&(TabExamFee!=0))){		
				TabReCheckFee=TabExamFee;
				TabExamFee=0;
			}
		    var BLNo=0;     //是否传病历号标志?0不传病历号?1传病历号
			var FeeStr=TabPrice+"||"+TabExamFee+"||"+TabHoliFee+"||"+TabAppFee+"||"+TabMRFee+"||"+TabReCheckFee+"||"+TabCardFee;
			//控制联合门诊号只能由联合门诊医生诊间挂号，预约取号不限制
			if (TAPPTRowID==""){
				var UnOPDocFlag=tkMakeServerCall("web.DHCOPAdmReg","IsRBMedUnitDoc",TabASRowId,UserID);
				var UnOPDocFlagArr=UnOPDocFlag.split("^")
				if (UnOPDocFlagArr[0]==1){
					if (UnOPDocFlagArr[1]!=1){
						alert("联合门诊号只能由指定医疗小组内的医生挂出，请至相应诊间挂号");
						continue; 
					}
				}
			}
			
			//医保实时结算
			var InsuJoinStr="";
			var InsuAdmInfoDr="",InsuDivDr="";
			var InsuPayFeeStr="";
			var UseInsuFlag="N",UPatientName="",RegType="",FreeRegFeeFlag="",InsuReadCardInfo="",RetInsuGSInfo="";
			//开始挂号前进行锁号操作，暂不判断是否存在异常订单
			//锁号
			var PatientNo=DHCC_GetElementData('PatientNo');
			var OPRegLockInfo=TabASRowId+"^"+TabQueueNo+"^"+UserID+"^"+"Y"+"^"+PatientNo;
			//var CTLSRowId=tkMakeServerCall("web.DHCOPAdmReg","OPRegLockSepNo",OPRegLockInfo);
			//if (CTLSRowId<0){alert("锁号失败.");return;}
			var EnableInsuBillFlag=IsEnableInsuBill(PatientID,TabASRowId,UseInsuFlag,AdmReason,InsuReadCardInfo)
			if (EnableInsuBillFlag==true) {
				var InsuBillParamsObj={};
				InsuBillParamsObj.PatientID=PatientID;
				InsuBillParamsObj.UPatientName=UPatientName;
				InsuBillParamsObj.UserID=UserID;
				InsuBillParamsObj.ASRowId=TabASRowId;
				InsuBillParamsObj.AdmReasonId=AdmReason;
				//[可选]挂号组织的费用串，默认为"1||1||||||||"
				InsuBillParamsObj.FeeStr=FeeStr;
				//[可选]挂号类别，默认为空
				InsuBillParamsObj.RegType=RegType;
				//[可选]挂号费免费标识，默认为空
				InsuBillParamsObj.FreeRegFeeFlag=FreeRegFeeFlag;
				//[可选]读医保卡返回信息，默认为空
				InsuBillParamsObj.InsuReadCardInfo=InsuReadCardInfo;
				//[可选]工商医保信息，默认为空
				InsuBillParamsObj.RetInsuGSInfo=RetInsuGSInfo;
				InsuJoinStr=CallInsuBill(InsuBillParamsObj);
				
				if (InsuJoinStr!="") {
					var myAry=InsuJoinStr.split("^");
					var ConFlag=myAry[0];
					if (ConFlag==0){
						InsuAdmInfoDr=myAry[1];
						InsuDivDr=myAry[2];
						InsuPayFeeStr=InsuJoinStr.split("!")[1];
					}else{
						//alert("InsuBillError");
						//InsuFailLog(PatientID+"Z"+TabASRowId,UserID,"InsuOPReg");
						//医保挂号失败解锁
						//var ret=tkMakeServerCall("web.DHCOPAdmReg","OPRegUnLockSepNo",CTLSRowId);
						RemoveOPAdmRegDblRow(j);
						websys_setfocus('ID');
						return;
					}
		
					if (InsuPayFeeStr!=""){
						var TotalAmount=0;
						var CashFee=0;
						for (var k=0;k<InsuPayFeeStr.split(String.fromCharCode(2)).length;k++) {
							var InsuPayModeStr=InsuPayFeeStr.split(String.fromCharCode(2))[k];
							var InsuPayModeAry=InsuPayModeStr.split('^');
							var InsuPayModeId=InsuPayModeAry[0];
							var InsuPayModeAmount=InsuPayModeAry[1];
							if ((CashPayModeID!="")&&(CashPayModeID==InsuPayModeId)) {
								CashFee=parseFloat(CashFee)+parseFloat(InsuPayModeAmount);
							}
							TotalAmount=parseFloat(TotalAmount)+parseFloat(InsuPayModeAmount);
						}
						if(parseFloat(TotalAmount)!=parseFloat(TabPrice)){
							//alert("当前价格与实时结算上传总价格不一致?请确认医嘱价格!");
							//return "";
						}
						var CashAmount=DHCC_GetElementData('CashAmount');
						CashAmount=parseFloat(CashAmount)+parseFloat(CashFee);
						DHCC_SetElementData('CashAmount',CashAmount);
					}
				}
			}
			
			var PAADMMethod=document.getElementById('OPRegistEncrypt');
			//s val=##Class(%CSP.Page).Encrypt($lb("web.DHCOPAdmReg.OPRegistBroker"))  wml
			if (PAADMMethod) {var encmeth=PAADMMethod.value;} else {var encmeth=''}
			var ret=cspRunServerMethod(encmeth,PatientID,TabASRowId,AdmReason,TabQueueNo,FeeStr,PayModeCode,AccRowId,UserID,GroupID,AdmType,DiagnosCatRowId,TabFreeRegFlag,TabFreeCheckFlag,"",InsuJoinStr,"",TAPPTRowID,"",TabPCLRowID,"","",RegConDisId);
			var retarr=ret.split("$");	
			if (retarr[0]=="0"){
				var IsCardCertifyFalg=tkMakeServerCall("web.DHCOPAdmReg","IsCardCertify",PatientID);
				if(IsCardCertifyFalg=="N"){alert("此卡未实名认证，请及时到人工窗口认证！");}
				//调病案接口函数,地坛医院只判断门诊病历号  此处走配置,是否调用病案接口?各地医保接口不一致?此处外接接口需要分离  090312
				var PrintArr=retarr[1].split("^");
				var EpisodeID=PrintArr[0];
				var TabASRowId=PrintArr[22];
				var RegfeeRowID=PrintArr[42];
				//var PatientID=DHCC_GetElementData('PatientID');
				var encrype=DHCC_GetElementData("GetPatMedCode");
				//s val=##Class(%CSP.Page).Encrypt($lb("web.DHCOPAdmChang.GetPatMedCode"))
				var MedCodeArr=cspRunServerMethod(encrype,EpisodeID);
				var MedCodeStr=MedCodeArr.split("^");
				var DYOPMRN=MedCodeStr[0];
				var DYIPMRN=MedCodeStr[1];
				var SGMedicareCode1=MedCodeStr[2];
				var SGMedicareCode2=MedCodeStr[3];
				var PatientID=MedCodeStr[4];
				//alert(PatientID+"^"+TabASRowId+"^"+EpisodeID+","+DYOPMRN+","+DYIPMRN+","+SGMedicareCode1+","+SGMedicareCode2);		
				//var BLNo=cspRunServerMethod(enc,TabASRowId,UserRowId,LocID,DYOPMRN,DYIPMRN,SGMedicareCode1,SGMedicareCode2,EpisodeID);
				if(DYOPMRN!="")BLNo=1;
				if(BLNo==1){
					var BLFlag=confirm('有病历号,是否传病历号?');
					if(BLFlag==true)
					{
						var OMrType=DHCC_GetElementData('OMrType');
						var IMrType=DHCC_GetElementData('IMrType');
						var sWorkItem=DHCC_GetElementData('sWorkItem');
						var sReqType=DHCC_GetElementData('sReqType');
						//alert(PatientID+"^"+EpisodeID+"^"+OMrType+"^"+IMrType+"^"+sWorkItem+"^"+sReqType)
						WMR_NewRequest(PatientID,EpisodeID,OMrType,IMrType,sWorkItem,sReqType);
					}
					else{}
				}
				
				//票据合计增加 start
				var ReceiptCount=DHCC_GetElementData('ReceiptCount');
				ReceiptCount=parseInt(ReceiptCount)+1;
				DHCC_SetElementData('ReceiptCount',ReceiptCount);
				//打印挂号小条
				PrintOut(j,retarr[1]);
				//打印发票 --如果存在医保需要判断是调用医保接口打印发票还是调用HIS打印发票-医保修改按照项目上线自行修改
				PrintInv(RegfeeRowID)
				//RemoveOPAdmRegDblRow(j);
				//日志保存
				SavePrescEventLog(EpisodeID);
				if(RemoveRows=="") RemoveRows=j
				else  RemoveRows=RemoveRows+"^"+j
			}else{
				//HIS挂号失败解锁
				//var ret=tkMakeServerCall("web.DHCOPAdmReg","OPRegUnLockSepNo",CTLSRowId);
				//撤销医保挂号结算,如果失败则进入异常订单
				if (InsuAdmInfoDr!=""){
					var InsuRetValue=InsuOPRegStrike(0,UserID,InsuAdmInfoDr,"",AdmReason,"");
					if(InsuRetValue.split("^")[0]!="0"){
						//InsuFailLog(InsuAdmInfoDr,UserID,"InsuOPRegStrike");
						//TODO 增加异常订单
						//挂号科室和医生ID根据排班ID获取
						//信息串：病人ID^就诊ID^医保指针^操作人^订单状态^排班ID^是否挂号
						var OPRegINABInfo=PatientID+"^"+""+"^"+InsuAdmInfoDr+"^"+UserID+"^"+"N"+"^"+TabASRowId+"^"+"Y"+"^"+AdmReason;
						var ret=tkMakeServerCall("web.DHCOPAdmReg","SaveDHCOPAdmINAB",OPRegINABInfo);
						alert("回滚医保数据失败!");
					}
				}
				alert(retarr[0])
				var errmsg="";
				if (retarr[0]=="-201")  errmsg=t['ADMInsertFail'];
				if (retarr[0]=="-202")  errmsg=t['FailGetQueueNo'];
				if (retarr[0]=="-2121")  errmsg=t['UpdateAppStatusFail'];
				if (retarr[0]=="-2122")  errmsg=t['SystemBusy'];
				if (retarr[0]=="-206")  errmsg=t['PriceArcOrderInsertFail'];
				if (retarr[0]=="-207")  errmsg=t['chrhfeeOrderInsertFail'];
				if (retarr[0]=="-208")  errmsg=t['holiOrderInsertFail'];
				if (retarr[0]=="-209")  errmsg=t['AppOrderInsertFail'];
				if (retarr[0]=="-210")  errmsg=t['FailCharge'];
				if (retarr[0]=="-211")  errmsg=t['RegFeeInsertFail'];
				if (retarr[0]=="-212")  errmsg=t['QueueInsertFail'];
				if (retarr[0]=="-301")  errmsg=t['ExceedDayRegCountLimit'];
				if (retarr[0]=="-302")  errmsg=t['ExceedDayDocRegCountLimit'];
				if (retarr[0]=="-303")  errmsg=t['ExceedDayLocRegCountLimit'];
				if (retarr[0]=="-401")  errmsg=t['LessRegStartTime'];
				if (retarr[0]=="-402")  errmsg=t['LessAppStartTime'];
				if (retarr[0]=="-403")  errmsg=t['LessAddStartTime'];
				if (retarr[0]=="-404")  errmsg=t['ExceedTREndTime'];
				if (retarr[0]=="-2010") errmsg=t['UpdateINSUAdmInfoFail'];
				if(errmsg=="") errmsg=retarr
				//alert(t['RegFail']+","+errmsg+","+"ErrCode:"+retarr[0]);
				//alert(t['RegFail']+","+errmsg);
				var TabDepDesc=DHCC_GetColumnData('TabDepDesc',j); 
				var TabMarkDesc=DHCC_GetColumnData('TabMarkDesc',j);
				var ErrInfo="挂号记录科室:【"+TabDepDesc+"】,号别:【"+TabMarkDesc+"】,就诊日期:【"+AppDate+"】,序号:【"+TabQueueNo+"】"
				alert(ErrInfo+t['RegFail']+","+errmsg)
				if(RemoveRows=="") {
					RemoveOPAdmRegDblRow(j)
				}else{
					RemoveRows=RemoveRows+"^"+j
					var RemoveRowFlag=0;
					for (var m=0;m<RemoveRows.split("^").length;m++) {
						  var OneRow=RemoveRows.split("^")[m]
						  //if(RemoveRowFlag==1) OneRow=OneRow-1
						  RemoveOPAdmRegDblRow(1)
						  //RemoveRowFlag=1
					}
				}
				//RemoveOPAdmRegDblRow(j);
				websys_setfocus('CardNo');
				return;
			}
		}
		//更新金额和数量,这种方式不是很好
		/*var ReceiptCount=DHCC_GetElementData('ReceiptCount');  //因为挂多个号时这样做只能使票据加1所以改到前面
		ReceiptCount=parseInt(ReceiptCount)+1;
		DHCC_SetElementData('ReceiptCount',ReceiptCount);
		*/
		var ReceiptSum=DHCC_GetElementData('ReceiptSum');
		ReceiptSum=parseFloat(ReceiptSum)+parseFloat(TabPrice);
		DHCC_SetElementData('ReceiptSum',ReceiptSum);		
		alert(t["RegOK"]);
		Clear_click();
		if (AppFlag==0){
		   SetDefaultTimeRange();
	    }
	}catch(e){alert(e.message+","+e.name)}	

}
//挂号打印和预约打印在调用此打印函数的地方通过医院代码来区分   090312
function AppPrintOut(AppPrintData)
{
	try{
		if (AppPrintData=="") return;
		DHCP_GetXMLConfig("InvPrintEncrypt","DHCOPAppRegPrint");
		var AppPrintArr=AppPrintData.split("^");
		var CardNo=AppPrintArr[0];
		var PapmiDr=AppPrintArr[1];
		var PapmiName=AppPrintArr[2];
		var PapmiNo=AppPrintArr[13];
		//var PapmiDOB=AppPrintArr[3];
		var PamiSex=AppPrintArr[3];
		var QueueNo=AppPrintArr[4];
		var Locdesc=AppPrintArr[6];
		var Docdesc=AppPrintArr[7];
		var AppDate=AppPrintArr[8];
		var AppTime=AppPrintArr[9];
		AppTime=AppDate+" "+AppTime
		var AdmDate=AppPrintArr[10];
		var TimeRangeInfo=AppPrintArr[14];
		var UserSS=AppPrintArr[15];
		var Price=AppPrintArr[17];
		var SessionTypeDesc=AppPrintArr[18];
		var ASDateWeek=AppPrintArr[19];
		
		var PDlime=String.fromCharCode(2);
		var MyPara="CardNo"+PDlime+CardNo+"^"+"PatNo"+PDlime+PapmiNo+"^"+"PatName"+PDlime+PapmiName+"^"+"AppDep"+PDlime+Locdesc;
		var MyPara=MyPara+"^"+"MarkDesc"+PDlime+Docdesc+"^"+"PatSex"+PDlime+PamiSex+"^"+"SeqNo"+PDlime+QueueNo+"^"+"AppDate"+PDlime+AppDate;
		var MyPara=MyPara+"^"+"AdmDate"+PDlime+AdmDate+"^"+"UserCode"+PDlime+UserSS;
		var MyPara=MyPara+"^"+"APPCompDate"+PDlime+AppTime+"^"+"SessionType"+PDlime+SessionTypeDesc+"^Total"+PDlime+Price;
		var myobj=document.getElementById("ClsBillPrint");
		PrintFun(myobj,MyPara,"");	
	}
	catch(e){alert(e.message);}
}
function AppPrintOutOld(AppPrintData)
{
	try{
		if (AppPrintData="") return;
		var AppPrintArr=AppPrintData.split("^");
		var PapmiDr=AppPrintArr[0];
		var PapmiName=AppPrintArr[1];
		var PapmiNo=AppPrintArr[2];
		var PapmiDOB=AppPrintArr[3];
		var PamiSex=AppPrintArr[4];
		var QueueNo=AppPrintArr[5];
		var AppDate=AppPrintArr[6];
		var AppTime=AppPrintArr[7];
		var UserSS=AppPrintArr[8];
		var AppType=AppPrintArr[9];
		var ASDate=AppPrintArr[10];
		var objtbl=document.getElementById('tDHCOPAdm_Reg_MarkList');
		var rows=objtbl.rows.length;
		if (rows==2) {
			var ASRowId=DHCC_GetColumnData('ASRowId',1);
			
			if (ASRowId==''){
				alert(t['NoAppRow']);
				return false;
			}
		}
		var PDlime=String.fromCharCode(2);
		var MyPara="PapmiDr"+PDlime+PapmiDr+"^"+"PapmiName"+PDlime+PapmiName+"^"+"PapmiNo"+PDlime+PapmiNo;
		var MyPara=MyPara+"^"+"PapmiDOB"+PDlime+PapmiDOB+"^"+"PamiSex"+PDlime+PamiSex+"^"+"QueueNo"+PDlime+QueueNo+"AppDate"+PDlime+AppDate;
		var MyPara=MyPara+"^"+"AppTime"+PDlime+AppTime+"^"+"UserSS"+PDlime+UserSS+"^"+"AppType"+PDlime+AppType+"ASDate"+PDlime+ASDate;
		var myobj=document.getElementById("ClsBillPrint");
		PrintFun(myobj,MyPara,"");	
	}
	catch(e){alert(e.message);}
}
function PrintOut(RegTblRow,PrintData) {
	//修改 同时挂多个号时，加载的xml模板会变成发票模板
	DHCP_GetXMLConfig("InvPrintEncrypt","DHCOPAdmRegPrint");
	try {
		if (PrintData=="") return;
		var PrintArr=PrintData.split("^");
		var AdmNo=PrintArr[0];
		var PatName=PrintArr[1];
		var RegDep=PrintArr[2];
		var DocDesc=PrintArr[3];
		var SessionType=PrintArr[4];
		var MarkDesc=DocDesc
		
		var AdmDateStr=PrintArr[5];
		var TimeRange=PrintArr[6];
		var AdmDateStr=AdmDateStr+" "+TimeRange;
		
		var SeqNo=PrintArr[7];
		var RoomNo=PrintArr[8];
		var RoomFloor=PrintArr[9];
		var UserCode=PrintArr[10];
		var RegDateYear=PrintArr[12];
		var RegDateMonth=PrintArr[13];
		var RegDateDay=PrintArr[14];
		var TransactionNo=PrintArr[15];
		
		var Total=PrintArr[16];
		var RegFee=PrintArr[17];
		var AppFee=PrintArr[18];
		var OtherFee=PrintArr[19];
		var ClinicGroup=PrintArr[20];
		var RegTime=PrintArr[21];
		var ExabMemo=PrintArr[23];
		var InsuPayCash=PrintArr[24];
		var InsuPayCount=PrintArr[25];
		var InsuPayFund=PrintArr[26];
		var InsuPayOverallPlanning=PrintArr[27];
		var InsuPayOther=PrintArr[28];
		var TotalRMBDX=PrintArr[29];
		var INVPRTNo=PrintArr[30];
		var CardNo=PrintArr[31];
		var Room=PrintArr[32];
		var AdmReason=PrintArr[33];
		var Regitems=PrintArr[34];
		var AccBalance=PrintArr[35];
		var PatNo=PrintArr[36];
		var PoliticalLevel=PrintArr[43];
		var HospName=PrintArr[38];
		var MyList="";
		for (var i=0;i<Regitems.split("!").length-1;i++){
			var tempBillStr=Regitems.split("!")[i];
			if (tempBillStr=="") continue;
			var tempBillDesc=tempBillStr.split("[")[0];
			var tempBillAmount=tempBillStr.split("[")[1];
			if (MyList=="") MyList=tempBillDesc+"   "+tempBillAmount;
			else  MyList = MyList + String.fromCharCode(2)+tempBillDesc+"   "+tempBillAmount;
		}
		if (HospitalCode=="SCSFY"){
			Room=Room+"就诊";
		}
		//病人自负比例的备注
		var ProportionNote="";
		var ProportionNote1="";
		var ProportionNote2="";
		if ((HospitalCode=="SHSDFYY")&&((InsuCardType=='0')||(InsuCardType=='1'))){
			InsuPayCash="现金支付:"+InsuPayCash;
			InsuPayCount="帐户支付:"+InsuPayCount;
			InsuPayOverallPlanning="统筹支付:"+InsuPayOverallPlanning;
			InsuPayOther="附加支付:"+InsuPayOther;
			ProportionNote="(现金支付中,"+RegFee+"元"+"不属于医保报销范围)";
			ProportionNote1="医疗记录册";
			ProportionNote2="当年帐户余额:  "+ThisYearAmt+"      历年帐户余额:  "+CalendarAmt;
			
		}else{
			InsuPayCash="";
			InsuPayCount="";
			InsuPayOverallPlanning="";
			InsuPayOther="";
			ProportionNote="本收据中,"+RegFee+"元"+"不属于医保报销范围";
			ProportionNote1="";
			ProportionNote2="";
		}
		
		var NeedCardFee=DHCC_GetElementData('NeedCardFee');
		var CardFee=DHCC_GetElementData('CardFee');
 		if (NeedCardFee==true){
 			var CardFee="工本费 "+parseFloat(CardFee)+"元";
 		}else{
 			var CardFee="";
 		}
 		
		RegTime=RegDateYear+"-"+RegDateMonth+"-"+RegDateDay+" "+RegTime
		AccAmount=DHCC_GetElementData('AccAmount');
		if (GetPayModeCode()=="CPP"){
			var AccTotal=parseFloat(AccAmount)-parseFloat(Total);
		}else {
			var AccTotal=parseFloat(AccAmount);
		}

        //将AccTotal保留两位小数
    	//var AccTotal=GetAccAmount()
    	//消费后金额
		AccTotal=SaveNumbleFaxed(AccTotal);
		//消费前金额
    	AccAmount=SaveNumbleFaxed(AccAmount);
	
		var DYOPMRN=DHCC_GetElementData('OPMRN'); //门诊病案号
		var DYIPMRN=DHCC_GetElementData('IPMRN'); //住院病案号

		var ObjCard=document.getElementById('CardNo'); 
		var cardnoprint=ObjCard.value; ////界面卡号		
		if(cardnoprint==""){	
		  var cardnoprint=CardNo ; //后台卡号
		}
		var ASRowId=DHCC_GetColumnData('TabASRowId',RegTblRow);	
		if (ASRowId==''){
			alert(t['NoRegRow']);
			return false;
		}
		var objR=document.getElementById('TRRowId');
		var TRrowid=objR.value;
	
		var OBJ=document.getElementById('TimeRange');
		var TimeD=OBJ.value   
		//var Arrtime=GetArrTime()   取当前时间   

		if (AppFee!=0){AppFee="预约费:"+AppFee+"元"}else{AppFee=""}
		if (OtherFee!=0) {OtherFee=OtherFee+"元"}else{OtherFee=""}
		if (RegFee!=0){RegFee=RegFee+"元"}else{RegFee=""}
		if (Total==0){Total=""}

		var PDlime=String.fromCharCode(2);
		var MyPara="AdmNo"+PDlime+AdmNo+"^"+"PatName"+PDlime+PatName+"^"+"TransactionNo"+PDlime+TransactionNo+"^"+"AccTotal"+PDlime+AccTotal+"^"+"AccAmount"+PDlime+AccAmount+"^"+"DYOPMRN"+PDlime+DYOPMRN+"^DYIPMRN"+PDlime+DYIPMRN;
		var MyPara=MyPara+"^"+"MarkDesc"+PDlime+MarkDesc+"^"+"AdmDate"+PDlime+AdmDateStr+"^"+"SeqNo"+PDlime+SeqNo+"^RegDep"+PDlime+RegDep;
		var MyPara=MyPara+"^"+"RoomFloor"+PDlime+RoomFloor+"^"+"UserCode"+PDlime+UserCode;
		var MyPara=MyPara+"^"+"RegDateYear"+PDlime+RegDateYear+"^RegDateMonth"+PDlime+RegDateMonth+"^RegDateDay"+PDlime+RegDateDay;
		var MyPara=MyPara+"^"+"Total"+PDlime+Total+"^RegFee"+PDlime+RegFee+"^AppFee"+PDlime+AppFee+"^OtherFee"+PDlime+OtherFee+"^CardFee"+PDlime+CardFee;
		var MyPara=MyPara+"^"+"RoomNo"+PDlime+RoomNo+"^"+"ClinicGroup"+PDlime+ClinicGroup+"^"+"SessionType"+PDlime+SessionType+"^"+"TimeD"+PDlime+TimeD+"^"+"RegTime"+PDlime+RegTime+"^"+"cardnoprint"+PDlime+cardnoprint;
		var MyPara=MyPara+"^"+"ExabMemo"+PDlime+ExabMemo;
		var MyPara=MyPara+"^"+"InsuPayCash"+PDlime+InsuPayCash+"^"+"InsuPayCount"+PDlime+InsuPayCount+"^"+"InsuPayFund"+PDlime+InsuPayFund+"^"+"InsuPayOverallPlanning"+PDlime+InsuPayOverallPlanning+"^"+"InsuPayOther"+PDlime+InsuPayOther;
		var MyPara=MyPara+"^"+"ProportionNote1"+PDlime+ProportionNote1+"^"+"ProportionNote2"+PDlime+ProportionNote2;
		var MyPara=MyPara+"^"+"TotalRMBDX"+PDlime+TotalRMBDX+"^"+"INVPRTNo"+PDlime+INVPRTNo+"^"+"CardNo"+PDlime+CardNo+"^"+"Room"+PDlime+Room;
		var MyPara=MyPara+"^"+"AdmReason"+PDlime+AdmReason+"^"+"PoliticalLevel"+PDlime+PoliticalLevel;;
		var MyPara=MyPara+"^"+"PatNo"+PDlime+PatNo;       //打印登记号
		var MyPara=MyPara+"^"+"HospName"+PDlime+HospName;
		var myobj=document.getElementById("ClsBillPrint");
		PrintFun(myobj,MyPara,"");
		//打印收费项目明细列表MyList
		//PrintFun(myobj,MyPara,MyList);
		
		DHCC_SetElementData('AccAmount',AccTotal);	
	} catch(e) {alert(e.message)};
}
function PrintFun(PObj,inpara,inlist){
	////DHCPrtComm.js
	try{
		var mystr="";
		for (var i= 0; i<PrtAryData.length;i++){
			mystr=mystr + PrtAryData[i];
		}
		inpara=DHCP_TextEncoder(inpara)
		inlist=DHCP_TextEncoder(inlist)
		var docobj=new ActiveXObject("MSXML2.DOMDocument.4.0");

		docobj.async = false;    //close
		var rtn=docobj.loadXML(mystr);
		if (rtn){
		    ////ToPrintDoc(ByVal inputdata As String, ByVal ListData As String, InDoc As MSXML2.DOMDocument40)
			var rtn=PObj.ToPrintDocNew(inpara,inlist,docobj);
			//alert(rtn);
			////var rtn=PObj.ToPrintDoc(myinstr,myList,docobj);
		}
	}catch(e){
		alert(e.message);
		return;
	}
}
function SaveNumbleFaxed(str)
{
	var len,StrTemp;	
	if((str=="")||(!str)) return 0;
	if(parseInt(str)==str){
		str=str+".00";
		}else{
		StrTemp=str.toString().split(".")[1];
		len=StrTemp.length;
		if(len==1){
			str=str+"0";
		}else{
			var myAry=str.toString().split(".");
			str=myAry[0]+"."+myAry[1].substring(0,2);
		}
	}
	return str;
}

function AppFlagChangeHandler(e){
	var ret=DHCC_GetElementData('AppFlag');
	if (ret){
		var DefaultAppDate=DHCC_GetElementData('DefaultAppDate');
		DHCC_SetElementData("AppDate",DefaultAppDate);
	}else{
		DHCC_SetElementData('AppDate','');
	}
	var PatientID=DHCC_GetElementData('PatientID');
	if (PatientID!="") {
		var obj=document.getElementById('AppFlag')
		//DeptListDblClickHandler(obj);;
	}	
}

document.body.onload = BodyLoadHandler;
document.body.onunload = DocumentUnloadHandler;
function DocumentUnloadHandler(e){
	
}
function GetArrTime()
{
	var Dateprint=new Date();
	var s="";
	s=s+Dateprint.getYear()+"-";
	s=s+Dateprint.getMonth()+"-";
	s=s+Dateprint.getDate()+" ";
	s=s+Dateprint.getHours()+":";
	s=s+Dateprint.getMinutes() +":";
	s=s+Dateprint.getSeconds();
	return(s); 
}
function BodyLoadHandler() {
	if (window.event) e=window.event;
	//得到挂号条打印的参数
	//读卡
	var obj=document.getElementById('ReadCard');
	if (obj) obj.onclick=ReadCardClickHandler;
	var obj=document.getElementById('CardNo');
	if (obj) obj.onkeydown = CardNoKeydownHandler;
	
	if (obj) obj.onchange = CardNoChangeHandler;
	var obj=document.getElementById('PatientNo');
	if (obj) obj.onkeydown = PatientNoKeydownHandler;
	
	
	var obj=document.getElementById('DeptList');
	if (obj) obj.onchange = DeptListChangeHandler;
	//var	obj=document.getElementById('DeptList');
	//if (obj) obj.ondblclick = DeptListDblClickHandler;
	//if (obj) obj.onclick = DeptListClickHandler;
	//if (obj) obj.onchange = DeptListDblClickHandler;
	if (document.getElementById("Name")){document.getElementById("Name").readOnly = true;}
	document.getElementById("Sex").readOnly = true;
	document.getElementById("Age").readOnly = true;
	if (document.getElementById("ReceiptNo")){document.getElementById("ReceiptNo").readOnly = true;}
	if (document.getElementById("BillAmount")){document.getElementById("BillAmount").readOnly = true;}
	if (document.getElementById("ReturnAmount")){document.getElementById("ReturnAmount").readOnly = true;}
	//guorongyong 2008-03-03
	var obj=document.getElementById('RegExp');
	if (obj) obj.onclick=RegExp_Click;
	var obj=document.getElementById('tDHCOPAdm_Reg_MarkList');	
	if (obj&&(obj.rows.length==2))
	{
	obj.ondblclick = MarkTableDblClickHandler;
	
	//obj.onkeydown = MarkTableKeyDownHandler;

	}
	var obj=document.getElementById('tDHCOPAdm_Reg_MarkListCopy');	
	if (obj&&(obj.rows.length==2))
	{
	obj.ondblclick = MarkTableCopyDblClickHandler;
	
	//obj.onkeydown = MarkTableKeyDownHandler;

	}
	var obj=document.getElementById('Time');
	if (obj) obj.onkeydown = TimeKeydownHander;
	var obj=document.getElementById('MarkCode');
	//if (obj) obj.onkeyup = MarkCodeKeydownHandler;
	var obj=document.getElementById('Sex');
	if (obj) obj.onkeydown = DHCC_Nextfoucs;
	var obj=document.getElementById('Age');
	if (obj) obj.onkeydown = DHCC_Nextfoucs;
	var obj=document.getElementById('Name');
	if (obj) obj.onkeydown = DHCC_Nextfoucs;
	
	var obj=document.getElementById('tDHCOPAdm_Reg');
	if (obj) obj.ondblclick = tDHCOPAdmRegDblClickHandler;

	var obj=document.getElementById("GetAmount");
	if (obj) {
		obj.onkeydown = GetAmountChangeHandler;
		obj.onkeypress=GetAmountkeypresshandler;
		obj.onblur=ReCalculateAmount;
	}

	var obj=document.getElementById('Update');
	if (obj) obj.onclick=UpdateClickHandler;

	var obj=document.getElementById('Appoint');
	if (obj) obj.onclick=AppointClickHandler;

	var obj=document.getElementById('AppointNormal');
	if (obj) obj.onclick=AppointNormalClickHandler;

	var obj=document.getElementById('OPAppTel');
	if (obj) obj.onclick=AppointTelClickHandler;
	
	var obj=document.getElementById('Clear');
	if (obj) obj.onclick=NewClear_click;

	var obj=document.getElementById('Search');
	if (obj) obj.onclick=Search_Click;

	var obj=document.getElementById('CacelReg');
	if (obj) obj.onclick=CacelReg_click;

	var obj=document.getElementById('SwitchReg');
	if (obj) obj.onclick=SwitchReg_Click;

	var obj=document.getElementById('Query');
	if (obj) obj.onclick=QueryClickHandler;

	var obj=document.getElementById('RegQuery');
	if (obj) obj.onclick=RegQuery_click;

	var obj=document.getElementById('PatInfo');
	if (obj) obj.onclick=PatInfo_Click;

	var obj=document.getElementById('FindPat');
	if (obj) obj.onclick=FindPat_click;
	
	var obj=document.getElementById('AppRecords');
	if (obj) obj.onclick=AppRecord_click;
	
	var objtbl=document.getElementById("tDHCOPAdm_Reg_MarkList");
	//if (objtbl) objtbl.onkeydown=MarkListkeydownHandler;
	if(objtbl)objtbl.onkeydown = MarkTableKeyDownHandler;
	
	var objtbl=document.getElementById("tDHCOPAdm_Reg_MarkListCopy");
	//if (objtbl) objtbl.onkeydown=MarkListkeydownHandler;
	if(objtbl)objtbl.onkeydown = MarkTableCopyKeyDownHandler;
	var obj=document.getElementById('AppFlag');
	var AppFlag=DHCC_GetElementData('AppFlag');

	if (obj.value==0){
	DHCP_GetXMLConfig("InvPrintEncrypt","DHCOPAdmRegPrint");
	} 
	if (obj.value==1){
	DHCP_GetXMLConfig("InvPrintEncrypt","DHCOPAppRegPrint");
	var RtnAppFlag=ChekAppSatrtTime()
	}

	EncryptObj=new DHCBodyLoadInitEncrypt();
	EncryptObj.GetAllEncrypt("web.DHCBodyLoadInitEncrypt.GetAllEncryptStr");
	
	
	var obj=document.getElementById('AppDate');
	//if (obj) obj.onclick=AppDateCommonCreat;
	if (obj) obj.onchange=AppDateChangeHandler;
	//if (obj) obj.onkeydown=DHCC_Nextfoucs;
	if (obj) obj.onkeydown=AppDateKeydownHandler;
	//if (obj) obj.onblur=AppDate_OnBlur;
	if (obj) obj.onfocus=AppDate_OnFocus;

	var obj=document.getElementById('SeqNo');
	if (obj) obj.onkeydown=SeqNoKeydownHandler;

	var obj=document.getElementById('MedicalBook');
	if (obj) obj.onclick=MedicalBookCheck;
	var obj=document.getElementById("NeedCardFee");
	if (obj) obj.onclick=NeedCardFeeCheck;

	var obj=document.getElementById('RoomCode');
	if (obj) obj.onkeydown=RoomCodeKeydownHandler;
	
	var obj=document.getElementById('BtnLinkCardRecharge');
	if (obj) obj.onclick=LinkCardRechargHandler;
	
	var obj=document.getElementById('AppPatCredNo');
	if (obj){
		//obj.onblur=CheckIDCardNo;
		obj.onkeydown=AppPatCredNoKeydownHandler;
	}

	/*  //对病历本是否收取的处理
	var ObjtblMark=document.getElementById("tDHCOPAdm_Reg_MarkList");
	if (ObjtblMark) ObjtblMark.onkeydown=ObjtblMarkKeydownHandler;
	*/
	
	var ReceiptStr=DHCC_GetElementData('ReceiptStr');
	var arr=ReceiptStr.split('^');
	DHCC_SetElementData('ReceiptCount',arr[0]);
	DHCC_SetElementData('ReceiptSum',arr[1]);
	
	NeedReceiptNoMsg=CheckNeedReceiptNoMsg();

	GetReceiptNo();

	ReadPayMode();
	ReadCardType();
	ReadRegConDisList();
	//DHCC_SetListStyle("CardType",false);
	//卡类型
	var obj=document.getElementById('CardType');
	//因为dhtmlXComboFromSelect要判断isDefualt属性,
	if (obj) obj.setAttribute("isDefualt","true");
	combo_CardType=dhtmlXComboFromSelect("CardType");
	
	if (combo_CardType) {
		combo_CardType.enableFilteringMode(true);
		combo_CardType.selectHandle=combo_CardTypeKeydownHandler;
	}
	
	combo_CardTypeKeydownHandler();
	/*
	//支付方式
	//var obj=document.getElementById('PayMode');
	//因为dhtmlXComboFromSelect要判断isDefualt属性,
	//if (obj) obj.setAttribute("isDefualt","true");
	
	combo_PayMode=dhtmlXComboFromSelect("PayMode");
	if (combo_PayMode) {
		combo_PayMode.enableFilteringMode(true);
		combo_PayMode.selectHandle=combo_PayModeKeydownHandler;
	}
	*/
	var obj=document.getElementById('PayMode');
	if(obj){
		obj.multiple=false;;
		obj.size=1;
		//obj.onclick=combo_PayModeKeydownHandler;
	}
	var obj=document.getElementById('RegConDisList');
	if(obj){
		obj.multiple=false;;
		obj.size=1;
		obj.onchange=RegConDisListChangeHandle
	}
	
	
	/*var encmeth=DHCC_GetElementData('GetResDocEncrypt');
	AllDocStr=cspRunServerMethod(encmeth,"");
	if (AllDocStr!=""){
		var Arr=DHCC_StrToArray(AllDocStr);
		if (combo_MarkCode) combo_MarkCode.addOption(Arr);
	}*/

	//时段
	var TimeRangeStr=DHCC_GetElementData('TimeRangeStr');  //##Class(web.DHCOPAdmReg).GetTimeRangeStr(1)   wml
	combo_TimeRange=dhtmlXComboFromStr("TimeRange",TimeRangeStr);
	combo_TimeRange.enableFilteringMode(true);
	combo_TimeRange.selectHandle=combo_TimeRangeKeydownhandler;
	combo_TimeRange.attachEvent("onKeyPressed",combo_TimeRangeKeyenterhandler)
	//combo_TimeRange.keyenterHandle=combo_TimeRangeKeyenterhandler;

	if (AppFlag==0){
		//combo_TimeRange.selectOption(0,true);
		//combo_TimeRange.setComboText(combo_TimeRange.optionsArr[0].text);
		SetDefaultTimeRange();
	}
	var TRRowId=combo_TimeRange.getSelectedValue();
	DHCC_SetElementData('TRRowId',TRRowId);
	//websys_setfocus('TabDepDesc');
	

	/*var Deptobj=document.getElementById('DeptList');
	if(Deptobj){
		Deptobj.onkeydown=DeptList_lookuphandler;
		Deptobj.onclick=DeptList_lookuphandler;
	}*/
	var obj=document.getElementById('MarkCode');
	if (obj) {
		obj.onchange=MarkCode_Changehandler;
	}
	//科室	
	/*var DeptStr=DHCC_GetElementData('DeptStr');
	combo_DeptList=dhtmlXComboFromStr("DeptList",DeptStr);
	combo_DeptList.enableFilteringMode(true);
	combo_DeptList.selectHandle=combo_DeptListKeydownhandler;
	//combo_DeptList.keyenterHandle=combo_DeptListKeyenterhandler;
	combo_DeptList.attachEvent("onKeyPressed",combo_DeptListKeyenterhandler)*/

	//SetDefaultAppDate();
	
	HospitalCode=DHCC_GetElementData('HospitalCode');
	if (HospitalCode=="HXYY"){CommonCardNo="000000088888888";}
	
	DHCC_SetElementData('CardNo',CommonCardNo)

	//websys_setfocus('CardNo');
	//费别
	DHCC_SetListStyle("BillType",false);

	//特病类别
	if (document.getElementById('DiagnosCat')){
		var DiagnosCatStr=DHCC_GetElementData('DiagnosCatStr');
		combo_DiagnosCat=dhtmlXComboFromStr("DiagnosCat",DiagnosCatStr);
		combo_DiagnosCat.enableFilteringMode(true);
	}

	//guorongyong 2008-03-12
	if (document.all.DeptList){
		document.all.DeptList.style.imeMode = "disabled";
	}
	if (document.all.MarkCode){
		document.all.MarkCode.style.imeMode = "disabled";
	}
    var obj=document.getElementById('GetAppNo');
	if(obj){
		obj.onclick=GetAppNo_Click;
	}
	document.onclick=onclickfun;
	/**/
	if (document.getElementById("ClinicGroup")){
	combo_ClinicGroup=dhtmlXComboFromStr("ClinicGroup","");
	combo_ClinicGroup.enableFilteringMode(true);
	combo_ClinicGroup.selectHandle=combo_ClinicGroupKeydownhandler;
	combo_ClinicGroup.attachEvent("onKeyPressed",combo_ClinicGroupKeyenterhandler);	
}
	
}
function RegConDisListChangeHandle(){
	DeptListDblClickHandler();
	var objtbl=document.getElementById('tDHCOPAdm_Reg');
	var rows=objtbl.rows.length;
	for (var j=0;j<rows;j++) {
		RemoveOPAdmRegDblRow(j);
	}
}
function CheckIDCardNo(){
	var AppPatCredNo=DHCC_GetElementData('AppPatCredNo');
	var myIsID=DHCWeb_IsIdCardNo(AppPatCredNo);
	if (!myIsID){
		websys_setfocus("AppPatCredNo");
		return false;
	}
}

function AppPatCredNoKeydownHandler(e){
	var eSrc=window.event.srcElement;
	var key=websys_getKey(e);
	if (key==13) {	
		CheckIDCardNo();
	}
}

function LinkCardRechargHandler(){
	var lnk = "websys.default.csp?WEBSYS.TCOMPONENT=UDHCAccAddDeposit";
	win=open(lnk,"Recharg","status=1,top=0,left=0,width=1300,height=740,resizable=yes,scrollbars=yes")	
}
function DeptListChangeHandler(){
	var DeptDesc=DHCC_GetElementData('DeptList');
	if (DeptDesc==""){
		DHCC_SetElementData('DepRowId',"");
	}
}
function MarkCode_Changehandler(){
	var MarkCode=DHCC_GetElementData('MarkCode');
	if (MarkCode==""){
		DHCC_SetElementData('DocRowId',"");
		DeptListDblClickHandler();
	}
}
combo_DiagnosCat=null;
var TimeRangeN="N"
function combo_ClinicGroupKeydownhandler(e){
	var obj=combo_ClinicGroup;
	var ClinicGroupRowId=obj.getSelectedValue();
	DHCC_SetElementData('ClinicGroupRowId',ClinicGroupRowId);
	var RoomCode=DHCC_GetElementData('RoomCode');
	if (document.getElementById('RoomCode')){
		var FindRow=DHCC_FindTableRow("tDHCOPAdm_Reg_MarkList","RoomCode",RoomCode);
	}else{
		var FindRow=DHCC_FindTableRow("tDHCOPAdm_Reg_MarkList","MarkDesc","");
	}
	QueryClickHandler();
}
function combo_ClinicGroupKeyenterhandler(e){
	try {keycode=websys_getKey(e);} catch(e) {keycode=websys_getKey();}
	if (keycode==13){ 
		//websys_nexttab(combo_MarkCode.tabIndex);  //要使用诊号?则放开此句注释下面一段
		//不使用诊号?则在此就可找到医生信息 start
		var RoomCode=DHCC_GetElementData('RoomCode');
		if (document.getElementById('RoomCode')){
			var FindRow=DHCC_FindTableRow("tDHCOPAdm_Reg_MarkList","RoomCode",RoomCode);
		}else{
			var FindRow=DHCC_FindTableRow("tDHCOPAdm_Reg_MarkList","MarkDesc","");
		}
		QueryClickHandler();
		//end
	}
}
function onclickfun(e)
{
	var psw=event.clientX
	var psh=event.clientY
	if((TimeRangeAppExt.mainpanel)&&(TimeRangeN!="N")){
		var topl=TimeRangeAppExt.Ttopl
		var left=TimeRangeAppExt.Tleft
		var width=TimeRangeAppExt.mainpanel.getInnerWidth()+TimeRangeAppExt.mainpanel.getFrameWidth()
		var height=TimeRangeAppExt.mainpanel.getFrameHeight()+TimeRangeAppExt.mainpanel.getInnerHeight()
		var rightx=left+width
		var righty=topl+height
		if ((psw<left)||(psw>rightx)||(psh<topl)||(psh>righty)){
			TimeRangeAppExt.mainpanel.setVisible(false)
			TimeRangeN="N"
		}
	}
}
//by guorongyong 2008-03-03
function YBTypeCheck()
{
	//add by zhouzq 2010.09.08
	if (HospitalCode!='BJDTYY') return;

	var AppFlag=DHCC_GetElementData("AppFlag");
	if(AppFlag==1)return;
	
	var obj=document.getElementById('YBType');
	if(obj)var YBtypeV=obj.value;
	var obj=document.getElementById('PatYBCode');
	if(obj)var PatybV=obj.value;
	
	if((YBtypeV=="医保")||(YBtypeV=="医保特病")){
		if((PatybV=="")||(PatybV=="99999999999S")||(PatybV=="99999999999s"))alert("此为医保病人,但医保号为空或不正确!");
	}else{
		if(PatybV!="")alert("病人类型与医保号不符!");
	}

}


function RegExp_Click()
{
	//Clear_click();
	/*var lnk = "udhccardpatinforegexp.csp?WEBSYS.TCOMPONENT=UDHCCardPatInfoRegExp";
	win=open(lnk,"SwithOPReg","status=1,top=0,left=0,width=1300,height=740,resizable=yes,scrollbars=yes")*/
	var lnk = "udhccardpatinforegexp.csp?WEBSYS.TCOMPONENT=UDHCCardPatInfoRegExp";
	win=open(lnk,"DHCOPAdm.Reg","status=1,top=0,left=0,width=1300,height=740,resizable=yes,scrollbars=yes")
}
function TimeKeydownHander(e)
{
	var selectrow=GetTableSelectRow();
	
	var objtbl=document.getElementById('tDHCOPAdm_Reg_MarkList');
	var rows=objtbl.rows.length;
	if (selectrow>=1) {
		var ASRowId=DHCC_GetColumnData('ASRowId',selectrow);
		//alert(ASRowId);
		if (ASRowId==''){
			alert(t['NoRegRow']);
			return false;
		}
	}
	/*var objdoc=document.getElementById('DocRowId');
	var docrowid=objdoc.value;
	var objloc=document.getElementById('DepRowId');
	var locrowid=objloc.value;
	*/
	var objT=document.getElementById('Time');
	var time=objT.value;
	
	
	var objR=document.getElementById('TRRowId');
	var TRrowid=objR.value;
	//alert(docrowid+"^"+locrowid+"^"+time+"^"+TRrowid);
	var key=websys_getKey(e);
	if (key==13) {
		var time=CheckTimeFormat(time);
		if(time==false)return;
		objT.value=time
		var obj=document.getElementById('sickcall');
		if (obj) {var encmeth=obj.value} else {var encmeth=''};
		var regPHArr=cspRunServerMethod(encmeth,ASRowId,time,TRrowid)
		var objseq=document.getElementById('SeqNo');
		var str=regPHArr.split("^")
		objseq.value=str[0];
		if(str[1]!="")alert(str[1]);
		//if (cspRunServerMethod(encmeth,'SetPatient_Sel','',PatientNo)=='0') {
			obj.className='clsInvalid';
			websys_setfocus('Time');
		
		return websys_cancel();
	}
	
}
function CheckTimeFormat(Time)
{
	var len=Time.length;
	var hour="",Delimiter="",mini="",time="";
	if(len==5)
	{
		hour=Time.substr(0,2);
		Delimiter=Time.substr(2,1);
		mini=Time.substr(3,2);
		if((Delimiter!=":")||(hour>24)||(mini>60)){
			alert('时间输入错误!');
			return false;
		}
	}
	else if(len==4){
		hour=Time.substr(0,2);
		mini=Time.substr(2,2);
		Delimiter=":"
		if((hour>24)||(mini>60)){
			alert('时间输入错误!');
			return false;	
		}
	}
	else{
		alert('时间输入错误!');
		return false;
	}
	time=hour+Delimiter+mini;
	return time;
}

function CheckNeedReceiptNoMsg(){
	var obj=document.getElementById('Update');
	if (obj) {return true}else{return false}
}
function SetDefaultAppDate(){
	var AppFlag=DHCC_GetElementData("AppFlag");
	var DefaultAppDate=DHCC_GetElementData("DefaultAppDate");
	if ((DefaultAppDate!="")&&(AppFlag==1)){
		//var AppDate=DefaultAppDate.substring(0,8);
		DHCC_SetElementData('AppDate',DefaultAppDate)
	}	
}
function AppDate_OnFocus(e){
	var obj=document.getElementById('AppDate');
	var rng = obj.createTextRange(); 
	/*
	rng.moveStart("character",8);     
	rng.collapse(true);      
	rng.select();   
	*/	
	//obj.select(0);
}

function AppDate_OnBlur(){
	var obj=document.getElementById("AppDate");
	var AppDate=DHCC_GetElementData("AppDate");

	//var myrtn=DHCC_IsValidDate(obj)
	var myrtn=IsValidDate(obj);
	if (myrtn==0){
		obj.className='clsInvalid';
		/*
		var rng = obj.createTextRange(); 
		rng.moveStart("character",8);     
		rng.collapse(true);
		*/
		rng.select();  
		return websys_cancel();
	}else{
		obj.className='clsvalid';
	}
}

function GetAppDate() {
	var obj=document.getElementById('AppDate');
	if (obj){
		if ((obj)&&(obj.className=="clsInvalid")){
			//alert(t['WrongDateFormat']);
			//return false
			return 0;
		}
		var AppDate=DHCC_GetElementData('AppDate');
		if ((String(AppDate).length==8)&&(AppDate.indexOf('-')!=-1)){
			return 0
		}
		if ((String(AppDate).length==4)&&(AppDate.indexOf('-')==-1)){
			return 0
		}
		return AppDate;
	}
	return ""
}
function AppDateChangeHandler(e){
	var obj=window.event.srcElement;
	//var myrtn=DHCC_IsValidDate(obj);
	var myrtn=IsValidDate(obj);
	if (myrtn==0){
		obj.className='clsInvalid';
		//websys_setfocus("AppDate");
		//return websys_cancel();
	}else{
		obj.className='clsValid';
		var encmeth=DHCC_GetElementData('ConvertToWeekMethod');
		//modify by zhouzq 2010.11.18  忽略预约日期为空的情况
		if ((encmeth!="")&&(obj.value!="")){
			var WeekStr=cspRunServerMethod(encmeth,obj.value);
			DHCC_SetElementData('WeekDesc',WeekStr);
		}		
	}
	var PatientID=DHCC_GetElementData('PatientID');
	//if (PatientID!="") DeptListDblClickHandler(obj);;

}


function combo_TimeRangeKeydownhandler(){
		var TRRowId=combo_TimeRange.getSelectedValue();
		//var TRDesc=combo_TimeRange.getSelectedText();
		DHCC_SetElementData('TRRowId',TRRowId);
		//websys_nexttab(combo_TimeRange.tabIndex);
		//var obj=combo_DeptList; 
		//var ret=DeptListDblClickHandler(obj);
		var ret=DeptListDblClickHandler();
		//websys_setfocus('DeptList');
		return websys_cancel();
}
function combo_TimeRangeKeyenterhandler(e){
	try {keycode=websys_getKey(e);} catch(e) {keycode=websys_getKey();}
	if (keycode==13) {
		//websys_nexttab(combo_TimeRange.tabIndex);
		
		combo_TimeRange.DOMelem_input.focus();
		//combo_TimeRange.setfouce('DeptList');
		return false;
	}
}

function combo_DeptListKeydownhandler(){
	var obj=combo_DeptList;
	var DepRowId=obj.getActualValue();
	var DepDesc=obj.getSelectedText();
    if (combo_ClinicGroup){
	    combo_ClinicGroup.clearAll();
		combo_ClinicGroup.setComboText("");
		DHCC_SetElementData('ClinicGroupRowId','');
		var encmeth=DHCC_GetElementData('GetLocClinicGroup');
		if ((encmeth!="")&&(DepRowId!="")){
			combo_ClinicGroup.addOption('');
			var ClinicGroupStr=cspRunServerMethod(encmeth,DepRowId);
			if (ClinicGroupStr!=""){
				var Arr=DHCC_StrToArray(ClinicGroupStr);
				combo_ClinicGroup.addOption(Arr);
			}
		}
	}
	if (combo_MarkCode){
		/*
		combo_MarkCode.clearAll();
		combo_MarkCode.setComboText("");
		DHCC_SetElementData('DocRowId','');
		var encmeth=DHCC_GetElementData('GetResDocEncrypt');
		if ((encmeth!="")&&(DepRowId!="")){
			combo_MarkCode.addOption('');
			var DocStr=cspRunServerMethod(encmeth,DepRowId);
			if (DocStr!=""){
				var Arr=DHCC_StrToArray(DocStr);
				combo_MarkCode.addOption(Arr);
			}
		}
		
		if (DepRowId==""){
			var Arr=DHCC_StrToArray(AllDocStr);
			combo_MarkCode.addOption(Arr);
		}
		*/
	}

	DHCC_SetElementData('DepRowId',DepRowId);
	if (combo_MarkCode&&DepDesc==""){
		combo_MarkCode.DOMelem_input.focus();
		return websys_cancel();
	}else{
         
		var ret=DeptListDblClickHandler(obj);
		//if (ret){websys_nexttab(obj.tabIndex);}
	    //websys_setfocus('tDHCOPAdm_Reg_MarkList');
		//websys_setfocus('SeqNo');
		//return websys_cancel();
	
	}
	//var ret=DeptListDblClickHandler(obj);
	//if (ret){websys_nexttab(obj.tabIndex);}
}

//点击科室时调用的方法
function DeptListSelectHandle(value){
	//DeptEntrySelRowFlag=1;
	var valArr=value.split("^");
	DHCC_SetElementData('DepRowId',valArr[0]);
	DHCC_SetElementData('DeptList',valArr[1]);
	DHCC_SetElementData('DocRowId',"");
	DHCC_SetElementData('MarkCode',"");
	DeptListSelect();
}
function DeptListSelect(){
	var DepRowId=DHCC_GetElementData('DepRowId');
	var DepDesc=DHCC_GetElementData('DeptList');
    if (combo_ClinicGroup){
	    combo_ClinicGroup.clearAll();
		combo_ClinicGroup.setComboText("");
		DHCC_SetElementData('ClinicGroupRowId','');
		var encmeth=DHCC_GetElementData('GetLocClinicGroup');
		if ((encmeth!="")&&(DepRowId!="")){
			combo_ClinicGroup.addOption('');
			var ClinicGroupStr=cspRunServerMethod(encmeth,DepRowId);
			if (ClinicGroupStr!=""){
				var Arr=DHCC_StrToArray(ClinicGroupStr);
				combo_ClinicGroup.addOption(Arr);
			}
		}
	}
	DHCC_SetElementData('DepRowId',DepRowId);
	//if (combo_MarkCode&&DepDesc==""){
	if (DepDesc==""){
		//combo_MarkCode.DOMelem_input.focus();
		websys_setfocus('MarkCode')
		return websys_cancel();
	}else{
		var ret=DeptListDblClickHandler();
	}
}
/*function combo_DeptListKeyenterhandler(e){
	try {keycode=websys_getKey(e);} catch(e) {keycode=websys_getKey();}
	if (keycode==13) {
		combo_DeptListKeydownhandler();
	}
}*/
/*function combo_MarkCodeKeydownhandler(){
	var obj=combo_MarkCode;
	var DocRowId=obj.getSelectedValue();
	var DocDesc=obj.getSelectedText();
	DHCC_SetElementData('DocRowId',DocRowId);
	websys_setfocus('SeqNo');
	//guorongyong 2008-03-12 如果科室和医生都不为空则将科室置空
	var myobj=document.getElementById('DeptList');
	if((myobj.value!="")&&(DocRowId!="")){
		combo_DeptList.setComboText('');
		DHCC_SetElementData('DepRowId','');
	}
	//websys_nexttab(obj.tabIndex);
	//var ret=DeptListDblClickHandler(obj);
	//if (ret){websys_nexttab(obj.tabIndex);}
}*/

var AllDocStr=""
combo_MarkCode=null;

/*if (document.getElementById("MarkCode")){
	combo_MarkCode=dhtmlXComboFromStr("MarkCode","");
	combo_MarkCode.enableFilteringMode(true);
	combo_MarkCode.selectHandle=combo_MarkCodeKeydownhandler;
	combo_MarkCode.attachEvent("onKeyPressed",combo_MarkCodeKeyenterhandler);
	//combo_MarkCode.keyenterHandle=combo_MarkCodeKeyenterhandler;
}*/

/*function combo_MarkCodeKeyenterhandler(e){
	try {keycode=websys_getKey(e);} catch(e) {keycode=websys_getKey();}
	if (keycode==13){ 
		//websys_nexttab(combo_MarkCode.tabIndex);  //要使用诊号?则放开此句注释下面一段
		//不使用诊号?则在此就可找到医生信息 start
		var RoomCode=DHCC_GetElementData('RoomCode');
		if (document.getElementById('RoomCode')){
			var FindRow=DHCC_FindTableRow("tDHCOPAdm_Reg_MarkList","RoomCode",RoomCode);
		}else{
			var FindRow=DHCC_FindTableRow("tDHCOPAdm_Reg_MarkList","MarkDesc","");
		}
		QueryClickHandler();
		//end
	}
}*/

function TimeRangeKeyPressHandler(e){
	DHCC_Nextfoucs();
}
function GetReceiptNo(){
	var ReceiptNoObj=document.getElementById("ReceiptNo");
	if ((NeedReceiptNoMsg==true)&&ReceiptNoObj) {
		var encmeth=DHCC_GetElementData('GetreceipNO');
		var p1=session['LOGON.USERID']+"^"+"^"+session['LOGON.GROUPID']+"^"+"R"
		if (encmeth!=""){
			var rtn=cspRunServerMethod(encmeth,'SetReceipNO','',p1)
			if (rtn!='0') {
				alert(t['InvalidReceiptNo']);
				return
			}
		}
	}
}

function SeqNoKeydownHandler(e){
	var eSrc=window.event.srcElement;
	var key=websys_getKey(e);
	if (key==13) {
		var SeqNo=DHCC_GetElementData('SeqNo');
		
		var RoomCode=DHCC_GetElementData('RoomCode');
		if (document.getElementById('RoomCode')){
			var FindRow=DHCC_FindTableRow("tDHCOPAdm_Reg_MarkList","RoomCode",RoomCode);
		}else{
			var FindRow=DHCC_FindTableRow("tDHCOPAdm_Reg_MarkList","MarkDesc","");
		}
	  //走配置诊号回车后是查询还是直接挂号
	  var AppFlag=DHCC_GetElementData('AppFlag');
	  if (AppFlag==0){
		  UpdateClickHandler();
	  }
	  if (AppFlag==1){
		  AppointClickHandler();
	  }
		//QueryClickHandler();

		/*if (FindRow>0){
			var ASRowId=DHCC_GetColumnData('ASRowId',FindRow);
			if (ASRowId!=''){
				websys_setfocus("tDHCOPAdm_Reg_MarkList");
				HighlightRow_OnLoad("MarkDescz"+FindRow);
				return false;
			}
		}*/
	}
}

function isNumber(objStr){
	strRef = "+1234567890";
	for (i=0;i<objStr.length;i++) {
	tempChar= objStr.substring(i,i+1);
	if (strRef.indexOf(tempChar,0)==-1) {return false;}
	}
	return true;
}

function RoomCodeKeydownHandler(e){
	var eSrc=window.event.srcElement;
	var key=websys_getKey(e);
	if (key==13) {
		//DHCC_Nextfoucs('RoomCode');
		var RoomCode=DHCC_GetElementData('RoomCode');
		var FindRow=DHCC_FindTableRow("tDHCOPAdm_Reg_MarkList","RoomCode",RoomCode);
		if (FindRow>0){
			var ASRowId=DHCC_GetColumnData('ASRowId',FindRow);
			if (ASRowId!=''){
				websys_setfocus("tDHCOPAdm_Reg_MarkList");
				HighlightRow_OnLoad("RoomCodez"+FindRow);
			}
		}

	}	
}

function SetReceipNO(value) {
	var myary=value.split("^");
	var ls_ReceipNo=myary[0];
	var Sur_ReceipNo=myary[2];   //票据剩余张数
	DHCC_SetElementData('SurplusReceiptNo',Sur_ReceipNo);
	DHCC_SetElementData('ReceiptNo',ls_ReceipNo);
	//DHCWebD_SetObjValueA("INVLeftNum",myary[2]);
	///如果张数小于最小提示额change the Txt Color
	var obj=document.getElementById("ReceiptNo");
	if (myary[1]!="0"){	obj.className='clsInvalid';}
}

function Search_Click(){
	var PatientNo=DHCC_GetElementData('PatientNo')
	if (PatientNo!="") {
		var GetDetail=document.getElementById('GetDetail');
		if (GetDetail) {var encmeth=GetDetail.value} else {var encmeth=''};
		if (cspRunServerMethod(encmeth,'SetPatient_Sel','',PatientNo)=='0') {
			obj.className='clsInvalid';
			websys_setfocus('RegNo');
			return websys_cancel();
		}
	}
}

function FindPat_click(){
    Clear_click();
   var url="websys.default.csp?WEBSYS.TCOMPONENT=DHCCardSearch";     
   var winName="FindPatReg";       
   var awidth=screen.availWidth;       //窗口宽度,需要设置   
   var aheight=screen.availHeight;         //窗口高度,需要设置    
   var atop=(screen.availHeight - aheight)/2;  //窗口顶部位置,一般不需要改   
   var aleft=(screen.availWidth - awidth)/2;   //窗口放中央,一般不需要改   
   var param0="scrollbars=yes,status=0,menubar=0,resizable=yes,location=0"; //新窗口的参数   
   var params="top=" + atop + ",left=" + aleft + ",width=" + awidth + ",height=" + aheight + "," + param0 ;  
   win=window.open(url,winName,params); //打开新窗口   
   win.focus(); //新窗口获得焦点   
  
	//var lnk = "websys.default.csp?WEBSYS.TCOMPONENT=DHCCardSearch";
	//win=open(lnk,"FindPatReg","top=150,left=150,width=900,height=400,status=no,resizable=yes,scrollbars=yes")
}

function AppRecord_click()
{
	var PatientID=DHCC_GetElementData("PatientID");
	var Name=DHCC_GetElementData("Name");
	if(Name=="")var Name=DHCC_GetElementData("AppPatName");
	var Mobile=DHCC_GetElementData("AppPatTel");
	var IDCardNo=DHCC_GetElementData("AppPatCredNo");
	
	var lnk="websys.default.csp?WEBSYS.TCOMPONENT=DHCPatAppRecords&IDCardNo="+IDCardNo+"&Name="+Name+"&TelPhone="+Mobile+"&PatientId="+PatientID;
	websys_createWindow(lnk,"DHCOPAdmReg","top=150,left=50,width=1200,height=500,status=yes,scrollbars=yes")
	//window.parent.location=lnk;
}

function CacelReg_click(){
	Clear_click();
	var lnk = "websys.default.csp?WEBSYS.TCOMPONENT=DHCOPReturn";
	win=websys_createWindow(lnk,"CacelReg","top=150,left=50,width=1200,height=500,status=yes,scrollbars=yes")
	}
function RegQuery_click(){

	var lnk = "websys.default.csp?WEBSYS.TCOMPONENT=DHCOPDro";
	win=open(lnk,"RegQueryy","top=10,left=50,width=900,height=500");
}

function SwitchReg_Click(){
	Clear_click();
	var lnk = "websys.default.csp?WEBSYS.TCOMPONENT=DHCOPReturn";
	win=open(lnk,"SwitchReg","top=150,left=150,width=700,height=400")
}

function PatInfo_Click(){
	Clear_click();
	
   var url="websys.default.csp?WEBSYS.TCOMPONENT=DHCPatient";     
   var winName="QueryReg";       
   var awidth=screen.availWidth;       //窗口宽度,需要设置   
   var aheight=screen.availHeight;         //窗口高度,需要设置    
   var atop=(screen.availHeight - aheight)/2;  //窗口顶部位置,一般不需要改   
   var aleft=(screen.availWidth - awidth)/2;   //窗口放中央,一般不需要改   
   var param0="scrollbars=yes,status=0,menubar=0,resizable=yes,location=0"; //新窗口的参数   
   var params="top=" + atop + ",left=" + aleft + ",width=" + awidth + ",height=" + aheight + "," + param0 ;  
   win=window.open(url,winName,params); //打开新窗口   
   win.focus(); //新窗口获得焦点   
	
	//var lnk = "websys.default.csp?WEBSYS.TCOMPONENT=DHCPatient";
	//win=open(lnk,"QueryReg","top=50,left=150,width=800,height=700,status=no,resizable=yes,scrollbars=yes")
}

function ReadPayMode(){
	DHCC_ClearList("PayMode");
	var encmeth=DHCWebD_GetObjValue("PayModeEncrypt");
	var mygLoc=session['LOGON.GROUPID'];
	if (encmeth!=""){
		var rtn=cspRunServerMethod(encmeth,"DHCWeb_AddToListA","PayMode",mygLoc,"REG");
	}
}
function ReadRegConDisList(){
	DHCC_ClearList("RegConDisList");
	var encmeth=DHCWebD_GetObjValue("RegConDisListEncrypt");
	var mygLoc=session['LOGON.GROUPID'];
	if (encmeth!=""){
		var rtn=cspRunServerMethod(encmeth,"DHCWeb_AddToListA","RegConDisList");
	}
}
function ReadCardType(){
	DHCC_ClearList("CardType");
	var encmeth=DHCC_GetElementData("CardTypeEncrypt");
	if (encmeth!=""){
		var rtn=cspRunServerMethod(encmeth,"DHCWeb_AddToListA","CardType");
	}
}
//ALT-* PGUP PGDN
function documentkeydown(e) {
	var keycode;
	try {keycode=websys_getKey(e);} catch(e) {keycode=websys_getKey();}
	//alert(keycode)
	if (keycode==115){
		var obj=document.getElementById('ReadCard');
		if (obj){
			ReadCardClickHandler();
		}
	}else if (keycode==120) {
		var obj=document.getElementById('Update');
		if (obj) {
			UpdateClickHandler();
		}else{
			var obj=document.getElementById('Appoint');
			if (obj) {
				AppointClickHandler();
			}else{
				var obj=document.getElementById('AppointNormal');
				if (obj) {
					AppointNormalClickHandler()
				}else{
					AppointTelClickHandler();
				}
			}
		}
	}else if(keycode==118) {
		Clear_click();
	}else if(keycode==121) {
		CacelReg_click();
	}else if(keycode==119) {
		QueryClickHandler();
		//FindPat_click();
	}else if(keycode==117){
		PatInfo_Click();
  }else if(keycode==113){
		RegExp_Click();
		debugger;
	}else{
		websys_sckey(e)
	}
}
function websys_help(url,e) {
	return;
}
///默认为取消,重载DOM里的confirm   
///window.confirm=function(str)
function DHCC_Confirm(str){
	//execScript('s   =   msgbox("'+str+'",257,"标题")','vbscript')   
	str=str.replace(/\'/g, "'&chr(39)&'").replace(/\r\n|\n|\r/g,"'&VBCrLf&'");
	execScript("n   =   msgbox('"+str+"',257,'确认')","vbscript");
	return(n==1);
}
function PrintMedicalBook(AdmNo){
	//alert(AdmNo);
	MyPara="";
	var myobj=document.getElementById("ClsBillPrint");
	DHCP_GetXMLConfig("InvPrintEncrypt","MedicalBook");
	var PrintMedicalbencmeth=document.getElementById('PrintMedicalBookMethod').value;
	if (PrintMedicalbencmeth!=""){
		rtn=cspRunServerMethod(PrintMedicalbencmeth,AdmNo);
	}
	if (rtn!=''){
		//alert(rtn)
		rtnarry=rtn.split('^');
		PatientName=rtnarry[2];
		PatientSex=rtnarry[3];
		AgeDesc=rtnarry[4];
		PatientNo=rtnarry[1];
		PatientBirthday=rtnarry[5];
		PatientYear=PatientBirthday.split('-')[0];
		Patientmonth=PatientBirthday.split('-')[1];
		ALLERGY=rtnarry[25];
		PatientMarital=rtnarry[16];
		Tel=rtnarry[24];
		PatientComAdd=rtnarry[10];
		MyPara=MyPara+"PatientName"+String.fromCharCode(2)+PatientName;
		MyPara=MyPara+"^PatientSex"+String.fromCharCode(2)+PatientSex;
		MyPara=MyPara+"^AgeDesc"+String.fromCharCode(2)+AgeDesc;
		MyPara=MyPara+"^PatientYear"+String.fromCharCode(2)+PatientYear;
		MyPara=MyPara+"^Patientmonth"+String.fromCharCode(2)+Patientmonth;
		MyPara=MyPara+"^ALLERGY"+String.fromCharCode(2)+ALLERGY;
		MyPara=MyPara+"^PatientMarital"+String.fromCharCode(2)+PatientMarital;
		MyPara=MyPara+"^Tel"+String.fromCharCode(2)+Tel;
		MyPara=MyPara+"^PatientComAdd"+String.fromCharCode(2)+PatientComAdd;
		//PrintFun(myobj,MyPara,"")
   	    //WKZ 080225
   	    var DHCOPPrint=new ActiveXObject("DHCOP.DHCPrint");
        //DHCPrint.OutStr="430$970$医大一院^430$630$女^430$350$1975       03^500$580$未婚^500$300$62662348^580$950$沈阳市和平区"
        DHCOPPrint.OutStr="430$970$"+PatientName+"^430$630$"+PatientSex+"^430$350$"+PatientYear+"        "+Patientmonth+"^500$580$"+PatientMarital+"^500$940$"+ALLERGY+"^500$300$"+Tel+"^580$950$"+PatientComAdd+"^350$500$"+'登记号:'+PatientNo       
        DHCOPPrint.PrintStr()
	}
}
function validate(sDouble){
	var re = /^\d+(?=\.{0,1}\d+$|$)/
	return re.test(sDouble)
}

function isDigit()
{
	if(((event.keyCode >= 48) && (event.keyCode <= 57))==false){return}
	//return ((event.keyCode >= 48) && (event.keyCode <= 57));
}
function MedicalBookCheck(){
	var MRFee=DHCC_GetElementData('MRNoteFee');
	var obj=document.getElementById('MedicalBook')
	if(obj){
		objvalue=obj.checked;
	}else{
	//objvalue=""
	return	
	}
	//objvalue=document.getElementById('MedicalBook').checked;
	if (objvalue==true){
		var MedicalBookVal=DHCC_GetElementData('MedicalBook');
		var BillAmount=DHCC_GetElementData('BillAmount');
		if (BillAmount==""){BillAmount=0}
		BillAmount=(parseFloat(BillAmount)+parseFloat(MRFee)).toFixed(2);
		DHCC_SetElementData("BillAmount",BillAmount,"0.00");
	}else if (objvalue==false){
		var MedicalBookVal=DHCC_GetElementData('MedicalBook');
		var BillAmount=DHCC_GetElementData('BillAmount');
		if (BillAmount==""){BillAmount=0}
		BillAmount=(parseFloat(BillAmount)-parseFloat(MRFee)).toFixed(2); 
		DHCC_SetElementData("BillAmount",BillAmount,"0.00");
		
	}
}
function NeedCardFeeCheck(){
	var CardFee=DHCC_GetElementData('CardFee');
	var obj=document.getElementById('NeedCardFee')
	if(obj){
		objvalue=obj.checked;
	}else{
		return;	
	}
	objvalue=document.getElementById('NeedCardFee').checked;
	if (objvalue==true){
		var MedicalBookVal=DHCC_GetElementData('NeedCardFee');
		var BillAmount=DHCC_GetElementData('BillAmount');
		if (BillAmount==""){BillAmount=0}
		BillAmount=(parseFloat(BillAmount,10)+parseFloat(CardFee,10)).toFixed(2); //
		DHCC_SetElementData("BillAmount",BillAmount,"0.00");
	}else if (objvalue==false){
		var MedicalBookVal=DHCC_GetElementData('NeedCardFee');
		var BillAmount=DHCC_GetElementData('BillAmount');
		if (BillAmount==""){BillAmount=0}
		BillAmount=(parseFloat(BillAmount,10)-parseFloat(CardFee,10)).toFixed(2); //
		DHCC_SetElementData("BillAmount",BillAmount,"0.00");
		
	}
}
function PrintAppoint(RBARowId)
{
	try{
		var CardNo=DHCC_GetElementData("CardNo");
		var GetAppPrintDataMethod=DHCC_GetElementData('GetAppPrintData');
		if (GetAppPrintDataMethod=="") return;
		var PrintDataStr=cspRunServerMethod(GetAppPrintDataMethod,RBARowId,CardNo);
		if (PrintDataStr=="") return;
		DHCP_GetXMLConfig("InvPrintEncrypt","DHCOPAppointPrint");
		var myobj=document.getElementById("ClsBillPrint");
		PrintFun(myobj,PrintDataStr,"");
	}catch(e){
		alert(e.message);
	}
}

function ReturnRecp_click(){
	Clear_click();
	var lnk = "websys.default.csp?WEBSYS.TCOMPONENT=DHCOPReturn";
	win=websys_createWindow(lnk,"ReturnRecp","top=150,left=50,width=900,height=500,status=yes,scrollbars=yes")
}

function GetDHCOPRegConfig(NodeName){
	var encmeth=DHCC_GetElementData("GetDHCOPRegConfig");
	return cspRunServerMethod(encmeth,NodeName);
}
function GetDHCOPRegConfigByUniqu(NodeName,UniquValue){
	var encmeth=DHCC_GetElementData("GetDHCOPRegConfigByUniqu");
	return cspRunServerMethod(encmeth,NodeName,UniquValue);
}

function AddRowNew(objtbl) {
	//原来用的增加行的函数有问题?槿绻?表格中有多行?凵境?前面一行后?墼傩录尤胍恍楔墼蛐录拥囊恍械?D会跟别的行有重复
	var row=objtbl.rows.length;
	var objlastrow=objtbl.rows[row-1];
	//make sure objtbl is the tbody element
	objtbl=tk_getTBody(objlastrow);
	var objnewrow=objlastrow.cloneNode(true);
	var rowitems=objnewrow.all; //IE only
	if (!rowitems) rowitems=objnewrow.getElementsByTagName("*"); //N6
	for (var j=0;j<rowitems.length;j++) {
		if (rowitems[j].id) {
			var Id=rowitems[j].id;
			var arrId=Id.split("z");
			//arrId[arrId.length-1]=row;
			arrId[arrId.length-1]=parseInt(arrId[arrId.length-1])+1;
			rowitems[j].id=arrId.join("z");
			rowitems[j].name=arrId.join("z");
			rowitems[j].value="";
		}
	}
	objnewrow=objtbl.appendChild(objnewrow);
	{if ((objnewrow.rowIndex)%2==0) {objnewrow.className="RowEven";} else {objnewrow.className="RowOdd";}}
}
function GetRow(Rowindex){
	var objtbl=document.getElementById('tDHCOPAdm_Reg');
	var RowObj=objtbl.rows[Rowindex];
	var rowitems=RowObj.all;
	if (!rowitems) rowitems=RowObj.getElementsByTagName("LABEL");
	for (var j=0;j<rowitems.length;j++) {
		if (rowitems[j].id) {
			var Id=rowitems[j].id;
			var arrId=Id.split("z");
			var Row=arrId[arrId.length-1];
		}
	}
	return Row;
}
function Trim(str)
{
	return str.replace(/[\t\n\r ]/g, "");
}


///lxz-------------预约新加---------------------------------
var notClearMessage=0;
function AppSerialNoBlurHandler(e){
	var AppSerialNo=DHCC_GetElementData("AppSerialNo");
	var PatientID=DHCC_GetElementData("PatientID");
	/*
	if (PatientID!="") {
		alert("请先读卡得到病人信息.");
		return false;
	}*/
	/*
	var rtn = tkMakeServerCall("web.DHCOPAdmReg", "CheckAppSerialNo", PatientID, AppSerialNo);
	var myary = rtn.split("^");
	if (myary[0] != "0") {
	   if(myary[0]=="-102"){
	      myary[1]=myary[1].replace(/,/g,"\n");
	      if(!confirm(myary[1])) return false;
	   }else{
		alert(myary[1]);
		return false;
	   }
	}
	*/
	//得到无卡预约记录
	GetApptInfo("");
	return true;
}
function GetEmChkInfo(PatientID){
	var TimeRangeRowId=combo_TimeRange.getSelectedValue();
	var AdmReason=DHCC_GetElementData('BillType');
	var EmChkInfoRtn = tkMakeServerCall("web.DHCOPAdmReg", "GetEmChkInfo",PatientID,TimeRangeRowId,AdmReason,session['LOGON.GROUPID'])
	if (EmChkInfoRtn!=""){
		var BillAmount=DHCC_GetElementData("BillAmount");
		var InfoArr=EmChkInfoRtn.split("#")
		for(var i=0;i<InfoArr.length;i++){
			var OneListInfo=InfoArr[i];
			var InfoArr1=OneListInfo.split("^")
			var BillAmount=parseFloat(BillAmount)+parseFloat(InfoArr1[2]);
			var PCLRowID="";
			if (OneListInfo.split('^').length>=16){
				PCLRowID=OneListInfo.split('^')[15];
			}
			var RepeatFlag=CheckRowDataRepeat("TabPCLRowID",PCLRowID);
			if (RepeatFlag==1) continue;
			AddRegToTable(OneListInfo)
		}
		DHCC_SetElementData("BillAmount",BillAmount);
	}
}
function CheckRowDataRepeat(CellName,ChecKValue) {
	var RepeatFlag=0;
	if (ChecKValue=="") return RepeatFlag;
	//判断重复情况不增加
	var objtbl=document.getElementById("tDHCOPAdm_Reg");
	var rows=objtbl.rows.length;
	for (var i = 0; i < rows; i++) {
		var Row=GetRow(i);
		var CellNameVal=DHCC_GetColumnData(CellName,Row);
		if (CellNameVal=="") continue;
		if (CellNameVal==ChecKValue) RepeatFlag=1;break;
	}
	return RepeatFlag;
}
function GetApptInfo(PatientID){
	var obj=document.getElementById("GetAppNo")
	if(obj){  
		//取病人的预约信息
		if(obj.checked){
			DHCC_SetElementData("BillAmount","0.00")
			var AdmReason=DHCC_GetElementData('BillType');
			var GetAppFlag=1;
			var rtn="";
			if(notClearMessage==0){	DHCC_ClearTable("tDHCOPAdm_Reg");}
			var BillAmount=DHCC_GetElementData("BillAmount");
			if (PatientID=="") {
				var AppSerialNo=DHCC_GetElementData("AppSerialNo");
				var encmeth=DHCC_GetElementData("GetAppInfoNoCardMethod");
				if (encmeth!="") rtn=cspRunServerMethod(encmeth,AppSerialNo,AdmReason,session['LOGON.HOSPID']);
			}else{
				var encmeth=DHCC_GetElementData("GetAppInfoMethod");
				if (encmeth!="") rtn=cspRunServerMethod(encmeth,PatientID,AdmReason,session['LOGON.HOSPID']);
			}
			if(rtn!=""){
			   //没有权限提示科室和医生信息
			 //  alert(rtn);
			    if(rtn.indexOf("NoAuthority")!=-1){
				  var tipSplit=rtn.split("NoAuthority");
				  if(tipSplit.length==2){
					  var tip=rtn.split("NoAuthority")[1];
					  if(tip=="CheckCardAssociation"){
						 alert("请患者出示社保卡，否则本次就诊费用无法医保结算");
					  }else{
						alert("没有取号权限:"+tip);
					  }
					  rtn=rtn.split("NoAuthority")[0];
				  }
				  if(tipSplit.length==3){
					  var tip=rtn.split("NoAuthority")[1];
					  alert("没有取号权限:"+tip);
					  alert("请患者出示社保卡，否则本次就诊费用无法医保结算");
					  rtn=rtn.split("NoAuthority")[0];
				  }
				  //return;
				}
				if(rtn){
					var AppInfos=rtn.split(",")
					for(var i=0;i<AppInfos.length;i++){
						var AppInfo=AppInfos[i]
						var AppInfo1=AppInfo.split("^")
						var BillAmount=parseFloat(BillAmount)+parseFloat(AppInfo1[2]);

						var TAPPTRowID="";
						if (AppInfo1.length>=15){
							TAPPTRowID=AppInfo1[14];
						}
						var RepeatFlag=CheckRowDataRepeat("TAPPTRowID",TAPPTRowID);
						if (RepeatFlag==1) continue;
						AddRegToTable(AppInfo)
					}
				}
				DHCC_SetElementData("BillAmount",BillAmount);
			}
		}	
	}
}
///---------------------------------------------------------
function ChekAppSatrtTime()
{
		var RtnAppFlag=tkMakeServerCall("web.DHCOPAdmReg","CheckAppRegTime")
		if (RtnAppFlag=="N"){alert("还未到预约开始时间!")}
		return RtnAppFlag
}

///日志保存
function SavePrescEventLog(EpisodeID){
	try{
		var EventLogData=tkMakeServerCall("web.DHCDocPrescript","GetPrescEventLogInfo",EpisodeID);
		var infoarr=EventLogData.split("^");
		var ModelName="DHCOPADMREG";
		var Condition="{RegNo:"+infoarr[0]+"}";
    	var Content="{EpisodeId:"+infoarr[1]+"}";
		var SecretCode=infoarr[2];
		if (SecretCode!="") {
			var EventLogRowId=tkMakeServerCall("web.DHCEventLog","EventLog",ModelName,Condition,Content,SecretCode);
			//alert(EventLogRowId)
			//websys_EventLog(ModelName,Condition,Content,SecretCode);
			//alert("ok");
		}
	} catch (e) { alert(e.message) }
    return 0;
}
function PatientNoKeydownHandler(e) {
	var key=websys_getKey(e);
	if (key==13) {
		var PatientNo=DHCC_GetElementData("PatientNo");
		if (PatientNo!='') {
			
			//当日挂号登记号取配置 add by hcq20180409 start
			PatientNo=tkMakeServerCall("web.UDHCJFBaseCommon","regnoconboe",PatientNo,session['LOGON.HOSPID'])
			//当日挂号登记号取配置 add by hcq20180409 end
			
			/*if (PatientNo.length<10) {
				for (var i=(10-PatientNo.length-1); i>=0; i--) {
					PatientNo="0"+PatientNo;
				}
			}*/
		}
		DHCC_SetElementData("PatientNo",PatientNo);
		CheckPatientNo();
	}
	
}
//挂号发票打印
function PrintInv(RegFeeID)
{   
	var UserID=session['LOGON.USERID'];
	var Return=tkMakeServerCall("web.DHCOPAdmReg","GetPrintInvInfo","InvPrintNew","INVPrtFlag2007",RegFeeID, UserID, "","");
}

function InvPrintNew(TxtInfo,ListInfo)
{   
	DHCP_GetXMLConfig("InvPrintEncrypt","INVPrtFlag2007");
	var myobj=document.getElementById("ClsBillPrint");
	//------和收费使用同模板，解决多打印出一张空白页的情况------
	var tmpListInfo="";
	var tmpListAry=ListInfo.split(String.fromCharCode(2));
	var ListLen=tmpListAry.length;
	for (var i = 0; i < ListLen; i++) {
		if (i>7) break;
		if (tmpListInfo=="") {
			tmpListInfo=tmpListAry[i];
		}else{
			tmpListInfo=tmpListInfo+String.fromCharCode(2)+tmpListAry[i];
		}	
	}
	ListInfo=tmpListInfo;
	//------
	PrintFun(myobj,TxtInfo,ListInfo);	
}
function CheckPatientNo()
{
	   var PatientNo=DHCC_GetElementData("PatientNo");
	   var CardNoStr=tkMakeServerCall('web.DHCOPAdmReg','GetCardNoByPatientNo',PatientNo);
	    var CardNo=CardNoStr.split("^")[0]
		if (CardNo=="") {
			alert("该登记号无对应卡号信息，请建卡！");
			DHCC_SetElementData("PatientNo",PatientNo);
			DHCC_SetElementData("CardNo",""); 
			DHCC_SetElementData("Name","");
			DHCC_SetElementData("Sex","");
			DHCC_SetElementData("Age","");
			return;
		}
		var NewCardTypeRowId=CardNoStr.split("^")[1]
	    combo_CardType.setComboValue(NewCardTypeRowId);
		DHCC_SetElementData("CardNo",CardNo);
		DHCC_SetElementData("InsuCardAcc","");
		DHCC_SetElementData("BillAmount","0.00"); 
		DHCC_SetElementData("GetAmount","0.00");
		DHCC_SetElementData("ReturnAmount","0.00");
		CheckCardNo();
		
}
//检索预约勾选之后检索
function GetAppNo_Click()
{
	var obj=document.getElementById('GetAppNo');
	if (obj.checked){
		var AppSerialNo=DHCC_GetElementData("AppSerialNo");
		if (AppSerialNo!=""){
			AppSerialNoBlurHandler();
		}else{
			var PatientID=DHCC_GetElementData("PatientID");
			if (PatientID!="") 
			{
				GetApptInfo(PatientID);
			}
		}
	}
}
function SetTableitemColor(ItemName,Row,Color)
{
	var Obj=document.getElementById(ItemName+'z'+Row)
	if (Obj){
		Obj.style.color=Color
	}
}
function AppDateCommonCreat()
{
	var Obj=setDay(this)
	
}
function MarkCodeSelectHandle(value){
	MarkCodeEntrySelRowFlag=1;
	DHCC_SetElementData('DocRowId',value.split("^")[2]);
	DeptListDblClickHandler();
}
function CheckTelOrMobile(telephone,Name,Type){
	if (DHCC_IsTelOrMobile(telephone)) return true;
	if (telephone.indexOf('-')>=0){
		//if(telephone.length<12){
			alert(Type+"固定电话长度错误,固定电话区号长度为【3】或【4】位,固定电话号码长度为【7】或【8】位,并以连接符【-】连接,请核实!")
			websys_setfocus(Name);
	        return false;
		//}
	}else{
		if(telephone.length!=11){
			alert(Type+"联系电话电话长度应为【11】位,请核实!")
			websys_setfocus(Name);
	        return false;
		}else{
			alert(Type+"不存在该号段的手机号,请核实!")
			websys_setfocus(Name);
	        return false;
		}
	}
	return true;
}

