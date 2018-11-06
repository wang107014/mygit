##1、输入身份证pId,验证身份证，输出出生日期，性别，年龄。

	DHCWeb.OPCommon.js
    var myary=DHCWeb_GetInfoFromId(mypId);

##2、回车触发事件

	function PAPMINo_KeyPress(e) {
	var e = event ? event : (window.event ? window.event : null);
	var key = websys_getKey(e);
	if (key == 13) {
		//ReadPatInfo();
	}
	}


##3、点击弹出一个新窗口

	方法一：
	var str='websys.default.csp?WEBSYS.TCOMPONENT=DHCOPBillUnHanInvDetail&UserRowid='+UserRowid+'&Job='+Job
	window.open(str,'_blank','toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,copyhistory=yes,width=700,height=520,left=0,top=0')

	方法二：
	var url = 'websys.default.csp?WEBSYS.TCOMPONENT=UDHCJFDeposit&Adm=' + Adm + '&deposittype=' + t['01'];
	var iHeight = 600;
	var iWidth = 1300;
	var iTop = (window.screen.availHeight - 30 - iHeight) / 2;
	var iLeft = (window.screen.availWidth - 10 - iWidth) / 2;
	websys_createWindow(url, '_blank', 'status=yes,toolbar=no,location=no,directories=no,menubar=no,scrollbars=yes,resizable=yes,top=' + iTop + ',left=' + iLeft + ',width=' + iWidth + ',height=' + iHeight);

	方法三：
	//跳到门诊收据查询 wml
	function QueryInv() {
	var mygLocDR = session['LOGON.GROUPID'];
	var myULoadLocDR = session['LOGON.CTLOCID'];
	var lnk = "websys.default.csp?WEBSYS.TCOMPONENT=udhcOPINV.Query";
	lnk += "&FramName=udhcOPRefund_Auditing";
	lnk += "&AuditFlag=ALL&sFlag=ALL&INVStatus=N";
	lnk += "&gLocDR=" + mygLocDR + "&ULoadLocDR=" + myULoadLocDR;
	var NewWin = open(lnk, "udhcOPINV_Query", "scrollbars=yes,resizable=yes,top=100,left=50,width=1100,height=600");
	}
    window.close();

##4、默认光标位置

	websys_setfocus('id')
    DHCWeb_OtherDocsetfocus("udhcOPPatinfo", "RCardNo"); //js、id
   
    function DHCWeb_OtherDocsetfocus(frameName,objName) {
	if ((frameName=="udhcOPPatinfo")&&(objName=="RCardNo"))
	{
		window.setTimeout('DHCWeb_OtherDocsetfocus2(\''+ frameName +'\', \''+objName+'\')',1);
	}
	else{
	window.setTimeout('DHCWeb_OtherDocsetfocus2(\''+ frameName +'\', \''+objName+'\')',2000);
	}
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


##5、置灰不能点击

    var obj = document.getElementById("Abort");
	DHCWeb_DisBtn(obj);

	function DHCWeb_DisBtn(obj){
		obj.disabled=true;
		obj.style.color="gray";
		obj.onclick=function(){return false;}
	}

##6、置蓝能点击

    var obj = document.getElementById("Abort");
	DHCWeb_AvailabilityBtn(obj);

	function DHCWeb_AvailabilityBtn(obj){
		obj.disabled=false;
		obj.style.color="blue";
		obj.onclick=function(){return true;}
			
	}




##7、置底色
DHCWebTabCSS_InitTab();


	var objtbl=document.getElementById(TabName);
	var myRows=DHCWeb_GetTBRows(TabName);
	for(var i=1;i<=myRows;i++){
				var eSrc=objtbl.rows[i];
				var mycurrowobj=getRow(eSrc);
	            mycurrowobj.style.color="red";
	}
    //收费处退费，已申请退费应用红底色标明
	function InitTableStyle() {
		var Guser = session['LOGON.USERID'];
		var GroupDR = session['LOGON.GROUPID'];
		var CTLocDR = session['LOGON.CTLOCID'];
		var HospDR = session['LOGON.HOSPID'];
		var tabOPList = document.getElementById("tudhcOPRefund_QueryIndex");
		var rows = tabOPList.rows.length;
		for (var row = 1; row < rows; row++) {
			var eSrc = tabOPList.rows[row];
			var CurrowObj = getRow(eSrc);
			var TPrtRowidObj = document.getElementById('TINVRowidz' + row);
			var PrtRowid = DHCWebD_GetCellValue(TPrtRowidObj);
			var TabFlagObj = document.getElementById('TabFlagz' + row);
			var TabFlag = DHCWebD_GetCellValue(TabFlagObj);
			var ExpStr = Guser + "^" + GroupDR + "^" + CTLocDR + "^" + HospDR + "^^^^^";
			var RefundFlag = tkMakeServerCall("web.udhcOPQUERYExp", "CheckRefundPrtInv", PrtRowid, TabFlag, ExpStr);
			if (RefundFlag == "1") {
				//含允许退费医嘱
				CurrowObj.style.backgroundColor = "#FFEFD5"; //背景色
				//CurrowObj.style.color="#FA8072";	         //前景色
			}
		}
	}


##8、根据卡类型，判断卡号是否能输入

	1、
	var myoptval=myCombAry["CardTypeDefine"].getSelectedValue();
	//var myoptval=DHCWeb_GetListBoxValue("CardTypeDefine");
	var myary=myoptval.split("^");

	var myCardTypeDR=myary[0];
	m_SelectCardTypeRowID = myCardTypeDR;
	
    var myobj=document.getElementById("CardNo");
	if (myobj)
	{
		if (m_SelectCardTypeRowID==1){
			myobj.disabled = true;
		}else{
			 
			 myobj.disabled = false;
			 websys_setfocus("CardNo");
			}	
	}

	2、
	var myval=combo_CardTypeDefine.getSelectedValue();
	combo_CardTypeDefine=dhtmlXComboFromSelect("CardTypeDefine");    // xp add
  		if (combo_CardTypeDefine) {
			combo_CardTypeDefine.enableFilteringMode(true);
			combo_CardTypeDefine.selectHandle=combo_CardTypeKeydownHandler;
		}
		combo_CardTypeKeydownHandler()

##9、选择框，点击事件（引用dhtmlXCombo.js）

	combo_CardType = dhtmlXComboFromSelect("CardTypeDefine");
    if (combo_CardType) {
		combo_CardType.enableFilteringMode(true);
		combo_CardType.selectHandle = combo_CardTypeKeydownHandler;
	}

	function combo_CardTypeKeydownHandler() {
	var myoptval = combo_CardType.getSelectedValue();
	var myary = myoptval.split("^");
	}

##10、获取打印模板名称

	DHCP_GetXMLConfig("InvPrintEncrypt","DHCJFIPReceipt");




##11、弹框页面里面的js调用主页面的方法
	var par_win = parent.window.opener;
	par_win.SetPassCardNo(CardNo,m_SelectCardTypeRowID);


##12、双击排班表中的号源。

	在DHCOPDocAppointExt.js中的dbtdclick(obj)方法。


##13.根据id获取列表中选中的字段信息。

	var eSrc = window.event.srcElement;
	var rowObj = getRow(eSrc);
	var selectrow = rowObj.rowIndex;
	if (!selectrow) {
		return;
	}
	var ind = DHCWeb_GetColumnData('Tind', selectrow);


##14、$C(2)拆分
	var CH2 = String.fromCharCode(2);
	var myary = myunbillstr.split(String.fromCharCode(2));


##15、从csp传值到js获值

	var Str='dhcbill.opbill.chargeexception.csp?job='+job;
	window.open(Str, '_blank', 'toolbar=no,location=no,directories=no,status=yes,menubar=no,scrollbars=yes,resizable=yes,copyhistory=yes,width=1300,height=750,left=0,top=0');

	//csp
	<script type="text/javascript">
		var GlobalObj ={
			job: #(job)#
		};
	</script>
	
	//js
	GlobalObj.job


##16、调用后台cls

	s val=##Class(%CSP.Page).Encrypt($lb("web.UDHCJFZYDB.SaveWarrant")) //在组件中id为getadd的ValueGet中设置的值
	var encmeth = DHCWebD_GetObjValue('getadd');
	var rtn = cspRunServerMethod(encmeth, '', '', p1);

	var RegNo=tkMakeServerCall("web.UDHCJFBaseCommon","regnoconboe",RegNo,session['LOGON.HOSPID'])


##17、根据id获取值和设置值

	var CardNo=DHCC_GetElementData('CardNo'); 
	DHCC_SetElementData("CardNo","");


##18、根据id设置列表的值和取出列表的值

	//设置列表的值
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
	var Rowindex=rows-1;
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
    var TabDepDesc=valueAry[6];‘
    DHCC_SetColumnData("TabDepDesc",Row,TabDepDesc);  //如已选挂号列表中的科室
	}
    //取出列表的值
    var ASRowId=DHCC_GetColumnData('TabASRowId',1);
	
##19、组件的valueget
	tableitem
	s val=rs.GetDataByName("PAAdmBed")
	item
	s val=%request.Get("PatNo")



##20、双击列表ondblclick

	var TabListObj=document.getElementById("tudhcOPINV_Query");
	if (TabListObj){
		TabListObj.ondblclick=AdmSelect_Click;
	}


##21、从弹框里跳到父页面

	var fobj=document.getElementById("FramName");
	if (fobj){
		var framName=fobj.value;//"udhcOPRefund_Auditing"
	}
	
	var myary=framName.split("_");
	var comName=myary.join(".");
	var lnk="websys.default.csp?WEBSYS.TCOMPONENT="+comName
	lnk=lnk+"&ReceipID="+ReceipID+"&ReceipNO="+myReceipNO+"&TabFlag="+Reload ;

	var PatInfo=opener.parent.frames(framName);
	PatInfo.location.href=lnk;


##22、隔段时间执行方法

	setTimeout("fresh()",1000);

##23、刷新本页面(udhcOPRefund.Auditing)

	var lnk = "websys.default.csp?WEBSYS.TCOMPONENT=udhcOPRefund.Auditing";
	lnk += "&ReceipID=" + invPrtRowid + "&ReceipNO=" + myReceipNO + "&TabFlag=" + Reload;
	window.location.href = lnk;

##24、记录操作电脑的名字

	var WshNetwork = new ActiveXObject("WScript.NetWork");
	computername=WshNetwork.ComputerName;



##25、关闭子页面，刷新父页面

	1、父页面
	var k = window.showModalDialog(lnk, "_blank", "dialogHeight: " + (top.screen.height - 100) + "px; dialogWidth: " + (top.screen.width - 100) + "px");
	if(k == 1){//判断是否刷新
		alert(k)
		var lnk = "dhcapp.reportreq.csp?EpisodeID="+ EpisodeID;
		window.location.href = lnk;	
	}

	2、子页面
	window.returnValue = 1; //刷新父页面的条件




