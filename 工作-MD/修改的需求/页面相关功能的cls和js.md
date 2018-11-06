#一、门诊挂号收费处
##建卡

	在UDHCCardPatInfoRegExp.js中NewCard方法中。

##1、结算
###病人基本信息：
	udhcOPPatinfo.js

1、获取病人的PatDr

		在udhcOPPatinfo.js中的ReadPatInfo的方法中
		var PatNo = PatientID.value;
		var myExpStr = "";
		var encmeth = DHCWebD_GetObjValue('GetPAPMI');
		var PatDr = cspRunServerMethod(encmeth, PatNo, myExpStr);
2、获取病人基本信息

	在udhcOPPatinfo.js中的SetPatientInfo方法中
	var myExpStr = "";
	var encmeth = DHCWebD_GetObjValue('GetPatInfo');
	var PatInfoStr = cspRunServerMethod(encmeth, PatDr, myExpStr);
3、获取就诊AdmStr信息

	在udhcOPPatinfo.js中的GetAdmStr方法中
	var encmeth = DHCWebD_GetObjValue('GetAdmStr');
	var myExpStr = session['LOGON.CTLOCID'];
	var AdmStr = cspRunServerMethod(encmeth, PatDr, myExpStr);
4、获取费别列表信息

	在udhcOPPatinfo.js中的AddPrescTypeToList方法中
	var myExpStr = session['LOGON.GROUPID'] + "^" + session['LOGON.CTLOCID'] + "^" + session['LOGON.USERID'] + "^^";
	var encmeth = DHCWebD_GetObjValue('GetPatPresc');
	var PrescTypeStr = cspRunServerMethod(encmeth, PatDr, AdmStr, myExpStr);
5、获取就诊历史记录列表信息

	在udhcOPPatinfo.js中的SetAdmInfoToList方法中
	var myExpStr = m_HospitalDr;
	var encmeth = DHCWebD_GetObjValue('GetAdmInfo');
	var AdmDetailStr = cspRunServerMethod(encmeth, AdmStr, myExpStr);
	var AdmDetail = AdmDetailStr.split("\002");

6、费别列表和就诊历史记录列表信息的字体颜色区别

	在udhcOPPatinfo.js中的dispalyPAAdmListColor方法中
	在udhcOPPatinfo.js中的dispalyInsTypeColor中

7、在医嘱列表显示医嘱信息
	
	在udhcOPPatinfo.js中的AddOrdItemToTable方法中
	var mygLoc = session['LOGON.GROUPID'];
	var myUloadDR = session['LOGON.CTLOCID'];
	var lnk = "websys.default.csp?WEBSYS.TCOMPONENT=DHCOPOEList&PAADMRowid=" + Adm + "&AdmInsType=" + AdmReason + "&unBillStr=" + myunbillstr + "&gLoc=" + mygLoc + "&UloadDR=" + myUloadDR;
	var OEList = parent.frames['DHCOPOEList'];
	OEList.location.href = lnk;
8、在收费结算处显示信息

	在udhcOPPatinfo.js中的AddAdmListToCharge方法中
	var AdmCharge = parent.frames['udhcOPCharge'];
	AdmCharge.location.href = lnk;

9、判断是否有要做皮试的医嘱

	在udhcOPPatinfo.js中的SetPatientDetail方法中
	var SkinRtnFlag = tkMakeServerCall("web.DHCOPCashier", "GetSkinRtnFlag", AdmStr);
	if (SkinRtnFlag == "Y") {
		alert("此病人有未作皮试医嘱,请先做皮试");
	}
10、判断医嘱是否被药师审核或拒绝

	在udhcOPPatinfo.js中的SetPatientDetail方法中
	var AuditFlagStr=tkMakeServerCall("web.DHCOPCashier", "GetPrescAuditFlag", AdmStr);
	var myrtn=AuditFlagStr.split("^")
	var AuditFlag=myrtn[0]
	var PrescUnAuditNo=myrtn[1]
	var PrescRetNo=myrtn[2]
	if (AuditFlag!="Y"){
		if(PrescUnAuditNo!=""){
			alert("当前患者以下处方:"+PrescUnAuditNo+" 未做药师审核,不能收费");
			
		}
		if(PrescRetNo!=""){
			alert("当前患者以下处方:"+PrescRetNo+" 药师审核被拒绝,不能收费");
			
		}
	}
11、门诊结算时提示病人欠费总额

	在udhcOPPatinfo.js中的SetPatientInfo方法中
	var myExpStr = "";
	var encmeth = DHCWebD_GetObjValue('GetPatInfo');
	var PatInfoStr = cspRunServerMethod(encmeth, PatDr, myExpStr);
	var PatInfo = PatInfoStr.split("^");
	var QFTotal = PatInfo[21];    //add by zhl 20110704  门诊结算时提示病人欠费总额
	if (eval(QFTotal) != 0) {
		alert("此病人共欠费" + QFTotal + "元,请注意收款。");
		return;
	}
12、获取医嘱费用总额、自付金额、折扣金额、记账金额

	在udhcOPPatinfo.js中的GetAdmStrBillSum方法中
	var encmeth = DHCWebD_GetObjValue('GetAdmInsCost');
	var AdmList = document.getElementById('PAADMList');
	for (var i = 0; i < AdmList.options.length; i++) {
		AdmStrArry = AdmList.options[i].value.split("^");
		var Adm = AdmStrArry[0];
		var OrdItemStr = document.getElementById('OrdItemStr');
		var myordstr = OrdItemStr.value;
		var mygLoc = session['LOGON.GROUPID'];
		var myRecDepDR = session['LOGON.CTLOCID'];
		var myExpStr = mygLoc + "^" + myRecDepDR;
		var myCostStr = cspRunServerMethod(encmeth, Adm, InsType, myordstr, myExpStr);
		var Cost = myCostStr.split("^");
		TotalSum = TotalSum + eval(Cost[0]); //总金额
		PatShare = PatShare + eval(Cost[3]); //自付金额
		DiscAmount = DiscAmount + eval(Cost[1]); //折扣金额
		PayorShare = PayorShare + eval(Cost[2]); //记账金额

###医嘱列表
	DHCOPOEList.js
	web.DHCOPAdmFind.cls中的GetADMOrder
1、双击医嘱列表，将医嘱的信息填到补录医嘱的输入框中

	在DHCOPOEList.js中的BodyLoadHandler方法中
	var obj = document.getElementById("tDHCOPOEList");
	if (obj) {
		//双击医嘱列表，将医嘱的信息填到补录医嘱的输入框中
		obj.ondblclick = tDHCOPOEList_DblClick;
	}
2、医嘱是否全选

	在DHCOPOEList.js中的DHCWebTabCSS_InitTab方法中
	在DHCOPOEList.js中的BodyLoadHandler方法中
	var obj = document.getElementById("AllSelect");
	if (obj) {
		obj.onclick = AllSelect_OnClick;
	}
3、医嘱颜色区分

	在DHCWeb_TabCSSConfig.js中的DHCWebTabCSS_SetRowColorCycle方法中

4、医嘱是否可以勾选结算

	在在DHCOPOEList.js中的IntDoument的方法中
	
5、如何获取需要结算的医嘱

	d ##class(%ResultSet).RunQuery("web.DHCOPAdmFind","GetADMOrder","1367","1","^^","239","119")

	//1、循环取出医嘱
	set OrderRowid=$o(^OEORD(0,"Adm",+PAADMRowid,""))
	s itemsub=0 f  s itemsub=$o(^OEORD(OrderRowid,"I",itemsub)) q:(itemsub="")  d
	
	//2、将急诊转出到住院的医嘱退出
	.s OPOEOrdRowID=OrderRowid_"||"_itemsub
	.q:$d(^DHCOPIPADMCON("OPADMORDER","OPAdm",PAADMRowid,OPOEOrdRowID))'=0 
	
	//3、将自备药品退出
	.s PriorityId=$p($g(^OEORD(OrderRowid,"I",itemsub,1)),"^",8)
	.i PriorityId'="" s PriorityCode=$p(^OECPR(PriorityId),"^",1)
	.q:($g(PriorityCode)["OM")

	//4、如果医嘱未核实则为退出
	.s billed=$p($g(^OEORD(OrderRowid,"I",itemsub,3)),"^",5)	
	.q:(billed="P")!(billed="I")

	//5、获取医嘱名称
	.s ArcimRowid=$p($g(^OEORD(OrderRowid,"I",itemsub,1)),"^",2)
	.s ArcimDesc=$p($g(^ARCIM(+ArcimRowid,1,1)),"^",2)

	//6、处方上有皮试医嘱且皮试医嘱不是阴性时,该处方上的医嘱都不能缴费
	.s Prescno=$p($g(^OEORD(+OrderRowid,"I",itemsub,1)),"^",14) ;处方号
	.s myPrescnoSkinFlag=##class(web.DHCOPAdmFind).CheckPrescnoSkinFlag(Prescno,"","")   
	.i myPrescnoSkinFlag="Y" d
	..s BillFlag=0	
	..s PrescnoSkinAry($j,Prescno)=myPrescnoSkinFlag

6、判断处方上有没有皮试医嘱，如果有,是否为阴性

	w ##class(web.DHCOPAdmFind).CheckPrescnoSkinFlag("O180727000004","","")
	Set SkinFlag=""
	Quit:(PrescNo="") SkinFlag
	Set myOEORDDR=""
	For  Set myOEORDDR=$o(^OEORD(0,"PrescNo",PrescNo,myOEORDDR)) Quit:((myOEORDDR="")!(SkinFlag="Y"))  Do
	.Set myOEORDSub=""
	.For  Set myOEORDSub=$o(^OEORD(0,"PrescNo",PrescNo,myOEORDDR,myOEORDSub)) Quit:((myOEORDSub="")!(SkinFlag="Y"))  Do
	..Set myOEORIDR=myOEORDDR_"||"_myOEORDSub   //获取医嘱Rowid

	以后不能办理结算的医嘱在此加以限制w ##class(web.UDHCOEORDOPIF).ReadSkinRtnFlag("29||1")

7、根据医嘱Rowid判断该医嘱是否为皮试医嘱

	w ##class(web.UDHCOEORDOP4).ReadSkinRtnFlag2("211||20")

	w ##class(web.UDHCOEORDOP4).ReadSkinRtnFlag("48995||31")



###收费结算
	udhcOPCharge.js


1、获取当前医嘱结算的费用总额和自付金额

	在udhcOPCharge.js中的DHCWebD_CalAdm方法中，而DHCWebD_CalAdm方法在DHCWeb.OPOEData.js里面。
2、结算账单

	在udhcOPCharge.js中的Bill_Click方法中。	
    
	生成收据信息主表(Dhc_invprt) ^DHCINVPRT(226143)
	w ##class(web.DHCOPINVCons).OPBillCharge(488, 5, "", 1, 60.30, "28^^^^^^", 122, 0, "", 0, "122^303^509^Y^F^^^^^^Y")
	w ##class(web.DHCBillConsIF).ReBill()
	w ##class(web.DHCBillCons12).ReBill()
	w ##class(web.DHCBillCons12).SaveINV()
	w ##class(web.UDHCINVPRT).INVPRT(myINVPInfo)
	w ##class(web.DHCOPInvoice).INSERT()


3、 门诊收费结算失败提示

	在DHCWeb.OPCommon.js中的chargeFail_alert方法中
	
	不能结算的原因：
	1、 门诊收费患者结算需要附加条件

	2、 门诊收费取配置信息有误(104)
	w ##class(web.DHCOPConfig).GetOPBaseConfigForGroupNew(113) 

	3、 门诊收费有异常收费记录需要处理:就诊记录存在预结算状态的发票记录  (120)
	w ##class(web.DHCOPBillChargExcepiton).CheckTPFlagByEpisodeID("","")

	4、根据就诊RowID取病人的留观状态,留观病人 
	w ##class(web.UDHCJFBaseCommon).GetPatAdmStayStat(655)

	5、门诊结算没有数据(101)
	w ##class(web.DHCBillCons12).ReBill(userno, PARowid, myPayor, myPatPaySum, rbPayinfo, rbgloc, SFlag, OldINVRID, myExpStr)

	6、患者的支付金额不符,主要是判断收钱，界面显示与后台计算合一(102)
	w ##class(web.DHCBillCons12).ReBill()

	7、判断处方是否被拆分了，被拆分不能结算(132)
	w ##class(web.DHCBillCons12).IsSplitPresno(226143)

4、门诊收费结算失败查看明细
	
	dhcbill.opbill.chargeexception.csp
	dhcbill/dhcopbill/dhcbill.opbill.chargeexception.js

	1、基本设置及结算参数信息
	在dhcbill.opbill.chargeexception.js中的loadPatInfo方法中
	//前台医嘱条数^后台医嘱条数^数量差^前台金额^后台金额^差额^收费员^安全组^结算费别^^^^^^
	w ##class(web.DHCOPBillChargExcepitonAnalyse).GetChargeBasePara(6876)

	2、根据进程号获取结算的就诊信息
	在dhcbill.opbill.chargeexception.js中的initPanel方法中
	d ##class(%ResultSet).RunQuery("web.DHCOPBillChargExcepitonAnalyse","GetChargeAdmList",3492)

	3、查询结算前后记录的医嘱明细信息
	在dhcbill.opbill.chargeexception.js中的loadChargeInfo方法中
	d ##class(%ResultSet).RunQuery("web.DHCOPBillChargExcepitonAnalyse","FindOrdItem",8272,"")

	4、获取医嘱的详细信息
	在dhcbill.opbill.chargeexception.js中的loadDetailInfo方法中
	d ##class(%ResultSet).RunQuery("web.DHCOPBillChargExcepitonAnalyse","GetOrdItemProperty",8020,"264||4")


5、打印结算收费导诊单，门诊收费导诊单格式修改

	在udhcOPCharge.js中的BillPrint方法中。

	function BillPrint(){
		try {
			DHCP_GetXMLConfig("InvPrintEncrypt","DHCChargePrint");
			var PDlime=String.fromCharCode(2);
			var inlist=inlist+"1.报到提示"+"^"+""+PDlime+"2.请至****登记预约"+"^"+""+PDlime
			var MyPara="PatName"+PDlime+PatName+"^"+"PatSex"+PDlime+PatSex+
			var myobj=document.getElementById("ClsBillPrint");
			PrintFun(myobj,MyPara,inlist);
		}
		catch(e) {alert(e.message)}
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

6、支付方式

	1、在udhcOPCharge.js中的IntDocument方法中
	w ##class(web.UDHCOPGSConfig).ReadGSINSPMListTypeBroker("DHCWeb_AddToListA","PayMode","239","","")
	DHCWeb_AddToListA('PayMode','现金','1^0^CASH^1','0','1')
	DHCWeb_AddToListA('PayMode','支票','2^0^ZP^1','1','0')


###新增医嘱：
	4、DHCOPOEOrdInput.js



##2、退费

###1、门诊退费查询结果：

		udhcOPRefund.QueryIndex.js
		d ##class(%ResultSet).RunQuery("web.udhcOPQUERYExp","INVQUERY","ALL","","","","","64824","64824","","ALL","","","","","","","")

###2、红冲操作步骤：

	1、udhcoprefund.csp
	2、在udhcOPRefund.main.js中ReNumber_Click方法中
	
####在web.udhcOPRefEdit1.cls中的RefundReceipt方法中

1、取配置表,查看是否配置打印负票 

	s myBCInfo=##class(web.DHCOPConfig).GetOPBaseConfig()
	s RefundInvFlag=$p(myBCInfo,"^",31)  ;为Y，则需要打印负票，否则不打印负票

2、验证是否有发票

	s myINVNoInfo=##class(web.udhcOPBillIF).ReadReceiptNO(rUser, gloc, myFairType)
	s ReceiptNo = $p(myINVNoInfo,"^",2)

3、更新病人就诊信息表

	&sql(update SQLUser.PA_Adm
	set PAADM_VisitStatus=:vis,
	PAADM_ReadOnly=:read,
	PAADM_UpDateDate=:admdate,
	PAADM_UpDateTime=:admtime,
	PAADM_SocialWorkerName=:myUserName
	where PAADM_RowID=:AdmDR)

4、更新原来的票据

	s rtn=##class(web.UDHCINVPRT).INVPRTPark(INVPRTRowid,rUser,sFlag)

5、新增一条门诊收据信息主表信息（DHC_INVPRT）

	s parkvalue=##class(web.UDHCINVPRT).INVPRTCancel(INVPRTRowid, rUser, sFlag, myCurDate, myCurTime,$g(myReceiptNo))

	&sql(INSERT INTO DHC_INVPRT Values PLIST())

6、更新发票号

	s rtn=##class(web.udhcOPBill).UpdateReceipNO(rUser,ReceipNew, gloc,myFairType)

7、新增一条账单票据连接表信息（DHC_BillConINV）

	&sql(insert into DHC_BillConINV (DHCBCI_ADMDR,DHCBCI_INVDR,DHCBCI_PatBillDR) values (:adm,:parkinvrowid,:rebillnorid))

8、新增一条住院收费账单主表信息(DHC_PatientBill)

	s ret=##class(web.UDHCJFPBCANCEL).PBCancel(adm,Billno,rUser,"")
	&sql(INSERT INTO DHC_PatientBill Values PLIST())

9、新增一条支付方式表信息（DHC_INVPayMode）

	s rtn=##class(web.UDHCINVPRT).INVPRTPayModeCancel(INVPRTRowid, parkinvrowid, ULoadLocDR, RPayModeDR ,rUser,myDTStr)
	&sql(INSERT INTO DHC_INVPayMode Values PLIST())

10、停止医嘱，把医嘱bill状态设置为TB

	s rtn=##class(web.UDHCOEORDOP).UpdateOrderStat(StopOrdStr,INVPRTRowid,rUser)
	&SQL(Update SQLUser.OE_OrdItem set OEORI_Xdate=:CurrDate,OEORI_Xtime=:CurrTime,OEORI_Billed=:BillFlag where OEORI_rowid=:OrdItmRowId)
	
	新增一条医嘱状态表信息
	&sql(insert into SQLUser.OE_OrdStatus (ST_ParRef,ST_Date,ST_Time,ST_Status_DR,ST_User_DR )
	values (:OrdItmRowId,:CurrDate,:CurrTime,:StatusRowId,:UserRowId))	
11、检查申请单接口,修改中间表数据

	s err=##class(web.DHCEMInterface).retInvExaReqNo(stopOrdId,rUser)

12、退费后更新退费记录状态

	set rtn=##class(web.DHCOPBillOERefundQty).UpdateRefStauts(StopOrdStr,rUser,newrowid,"")
	&sql(UPDATE DHC_OERefundQty VALUES PLIST() WHERE OERQ_RowID= :RowId)


####在web.DHCBillCons12.cls的CompleteCharge方法中
1、新增一条卡支付流水账表信息

	Set rtn=##class(web.DHCBillCons12).InsertAccInfo(PrtRowID,Guser,ExpStr)
	&sql(INSERT INTO DHC_AccPayList Values PLIST())

2、插入留观账户表信息

	Set rtn=##class(web.DHCBillCons12).InsertEPMInfo(PrtRowID,Guser,ExpStr)
	&sql(INSERT INTO DHC_EPManager Values PLIST())

3、修改住院账单表的计费状态

	Set rtn=##class(web.udhcOPBill).Updatearpbl(BillDR,Guser)
	&sql(UPDATE DHC_PatientBill set PB_payedflag='Paid' WHERE PB_RowId=:billno)

4、更新挂号表中的发票数据

	Set regRtn=##class(web.DHCOPAdmReg).UpdateRegistionFeeInv(adm, prtRowID, ordList)
	&SQL(Update SQLUser.DHCRegistrationFee Set Regfeetemp1=:InvoiceId Where %Id=:RegfeeRowId)


###3、作废操作步骤：
	在udhcOPRefund.main.js中RefundSaveInfo方法中

1、退费前判断该病人是否有异常发票

	var rtn = tkMakeServerCall("web.DHCOPBillChargExcepiton", "JudgeINVTPFlag", ReceipRowid, "");

2、判断发票退费时退费数量是否大于收费数量

	var ErrNum = tkMakeServerCall("web.udhcOPRefund", "CheckOENegativeNum", InvRowid);



##3、门诊收费查询

###1、门诊退费审核
	1、udhcOPRefund.Auditing.js
	2、udhcOPRefund.AuditOrder.js

1、退费申请

	在udhcOPRefund.Auditing.js中的BVerify_Click方法中
	w ##class(web.DHCOPBillRefundRequestNew).VerifyByType()

2、取消退费申请

	在udhcOPRefund.Auditing.js中的CancelAudit方法中
	w ##class(web.udhcOPRefund).CancelAudi("220725", "PRT", 5816)
	
###2、门诊收据查询
	1、udhcOPINV.Query.js    
	d ##class(%ResultSet).RunQuery("web.udhcOPQUERY","INVQUERY","ALL","","","","",64824,64824,"","ALL","","","","","","","")




##4、退号
1、退号查询：DHCOPReturn.js中的Update_click方法中进行退号操作。
    
	//退号操作
	w ##class(web.DHCOPAdmReg).CancelOPRegistBroker("","","399","7050","239","119","N","")

2、退号操作

	在DHCOPReturn.js中的Update_click方法中
	退号在web.DHCOPAdmReg.cls中的CancelOPRegistBroker方法中
	//挂号表
	SELECT * FROM DHCRegistrationFee
	zw ^RBAS("252","22","DHC") //排班列表
	"退号不释放挂号资源,并增号"标志：^DHCOPRegConfig("ReturnNotAllowAdd")

##5、挂号
1、双击排班表中的号源。

	在DHCOPDocAppointExt.js中的dbtdclick(obj)方法。
	在DHCOPAdm.Reg.js中的AddBeforeUpdate方法

2、把号源添加到列表

	在DHCOPAdm.Reg.js中的AddToRegTbl方法中

3、挂号操作

	在DHCOPAdm.Reg.js中的UpdateClickHandler方法中。
	在web.DHCOPAdmReg.cls中的OPRegistBroker方法中
	s val=##Class(%CSP.Page).Encrypt($lb("web.DHCOPAdmReg.OPRegistBroker"))
	w ##class(web.DHCOPAdmReg).OPRegistBroker()
	w ##class(web.DHCOPAdmReg).OPRegist(""745"",""256||42"","""",""78"",""10||0||0||0||0||0||0"",""CASH"","""",""7050"",""239"","""","""","""","""","""","""","""","""","""")

	1、双击号源记录号源是否被锁定
	zw ^RBAS("NA")
	zw ^RBAS("NA",0,"RBAS","221||7")

	2、退号时解除号源的锁定
	在web.DHCRBAppointment.cls中的RestoreSeqNo方法中
	
	3、打印挂号导诊单：在DHCOPAdm.Reg.js中的PrintOut方法中。
	获取导诊单xml:DHCP_GetXMLConfig("InvPrintEncrypt","DHCOPAdmRegPrint");
	把内容打印出来：在DHCOPAdm.Reg.js中的PrintFun方法中。

	

	

4、查询号源

    zw ^wangminglong("FindSeqNo")
	zw $P($G(^RBAS(252,87,"DHC")),"^",4)
	号段
	zw $P($G(^RBAS(252,87,"DHC")),"^",24)  
	时间段
	zw $P($G(^RBAS(252,87,"DHC")),"^",25)

	获取当前时间最近有效的号源 w ##class(web.DHCRBAppointment).FindSeqNo("221||156")

5、科室选择框是如何有数据的？
    
    1、组件
		组件DHCOPAdm.Reg中的科室Lookup引用
			web.DHCOPAdmReg.cls中的OPDeptList
		需要的参数为
			UserId=%session.Data("LOGON.USERCODE");
			AdmType=%request.Get("AdmType");
            paradesc=""
    2、js
	    选择科室，点击时调用的是
	    DHCOPAdm.Reg.js中的DeptListSelectHandle方法
    3、查看
     zw ##class(%ResultSet).RunQuery("web.DHCOPAdmReg","OPDeptList","SF01","","")

6、点击科室时如何在排班列表中显示排班信息？

	1、DHCOPAdm.Reg.js中的DeptListDblClickHandler方法中
		var encmeth=DHCC_GetElementData("GetDocMethod")
        //s val=##Class(%CSP.Page).Encrypt($lb("web.DHCOPAdmReg.DocListBroker"))  调用了排班列表组件绑定的query
    2、查看
    w ##class(web.DHCOPAdmReg).DocListBroker("","","20^7050^^^1^^239^^^2^^^")

7、医生选择框是如何有数据的？

	1、组件
		组件DHCOPAdm.Reg中的医生Lookup引用
			web.DHCRBResSession.cls中的FindResDoc
		需要的参数为
			DepID="";Type="";UserID="";Group="";MarkCodeName=""			
    2、js
	    选择科室，点击时调用的是
	    DHCOPAdm.Reg.js中的MarkCodeSelectHandle方法
    3、查看
     zw ##class(%ResultSet).RunQuery("web.DHCRBResSession","FindResDoc","","","","","")

8、双击排班列表的挂号信息如何把信息传到已选挂号列表上。

     1、双击排班列表的挂号信息时调用DHCOPAdm.Reg.js中的AddToRegTbl方法。
     2、把信息传到已选挂号列表时调用DHCOPAdm.Reg.js中的AddRegToTable方法。
	 3、双击获取当前时间最近有效的号源
		w ##class(web.DHCRBAppointment).FindSeqNo("255||36","2018-08-13")


9、时段选择框的选择框是如何有数据的？

	1、DHCOPAdm.Reg.js中BodyLoadHandler()初始化
	var TimeRangeStr=DHCC_GetElementData('TimeRangeStr');  
	//zw ##Class(web.DHCOPAdmReg).GetTimeRangeStr(1)  
	combo_TimeRange=dhtmlXComboFromStr("TimeRange",TimeRangeStr);

10、单击排班

	在DHCOPAdm.Reg.js中SelectRowHandler方法中



##7、收费报表  
##门诊收费日结
	1、dhcbill.opbill.dailyhand.csp
	2、dhcbill/dhcopbill/dhcbill.opbill.dailyhand.js

1、查询的csp和js

	1、dhcbill.opbill.dailyreports.csp
	2、dhcbill/dhcopbill/dhcbill.opbill.dailyreports.js

2、报表和明细的Tab的csp和js

	1、dhcbill.dailymaintabs.csp
	2、dhcbill/dhcbill.dailymaintabs.js

3、添加tab事件

	在dhcbill.dailymaintabs.js中的initTabs()

4、tab来源：

	在web.DHCBillGroupConfig.cls中的GetGroupSettingTabs方法中
	
5、点击加载tab报表内容：

	在dhcbill.dailymaintabs.js中的loadSelTabsContent()

6、报表地址的url来源

	在web.DHCBillGroupConfig中GetBillTabsUrl方法中
	在dhcbill.dailymaintabs.js中的loadDetailsList()中
	例如报表2的url："dhccpmrunqianreportprint.csp?reportName=DHCBILL-OPBILL-门诊个人日报表2.raq&stDate=2018-07-20&stTime=09:00:26&endDate=2018-07-20&endTime=09:21:07&footId=&guser=7050&hospDR=2"

7、报表在页面上显示：

	1、在dhcbill.dailymaintabs.js中的refreshTab方法中

8、调用润乾报表(例如调用润乾日报表三)

	1、在dhccpmrunqianreportprint.csp
	2、src="http://10.65.142.202:8080/runqianReport/report/jsp/dhccpmrunqianreportprint.jsp?report=DHCBILL-OPBILL-门诊个人日报表3.raq&cspsessionid=fQe1Pvmflw&LayoutManager=cn_iptcp:10.65.142.202[1972]:DHC-APP&endDate=2018-07-20&endTime=09:21:07&footId=&guser=7050&hospDR=2&reportName=DHCBILL-OPBILL-门诊个人日报表3.raq&stDate=2018-07-20&stTime=09:00:26"

	超链接
	"javascript:cpm_showWindow('DHCEM_分诊科室统计分诊病人明细.raq','&SDate="+@SDate+"&EDate="+@EDate+"&LocDesc="+A4+"\');"



9、收费员日报结算业务

	在dhcbill.opbill.dailyhand.js中的handin_Click方法中
	w ##class(web.DHCOPBillDailyHandin).Handin("5","2","06/03/2018^20:00:00^11/03/2018^09:25:58^N^N")

10、取消收费员日报结算业务

	在dhcbill.opbill.dailyhand.js中的handin_Click方法中
	w ##class(web.DHCOPBillDailyHandin).CancelHandin(835)

##9、门诊挂号导诊单
	1、在DHCOPAdm.Reg.js中的PrintOut方法中修改。



##10、卡操作
1、卡挂失

	在custom/DHCHEALTH/scripts/UDHCCardReportLoss.js中的ReportTheLoss_Click中

	w ##class(web.DHCBL.CARD.UCardStatusChangeBuilder).CardReportOrCancelLoss()





#二、住院出入院结算
##1、住院登记
###住院确认
	在UDHCJFIPReg.js中的regsave_click方法中
	w ##class(web.UDHCJFIPReg).inspatinfo()

	不能住院确认的原因
	1. 此病人正在留观,不允许办理住院登记.
	2. 入院登记病人姓名发生变化,请先修改病人基本信息姓名再办理入院.
	3. 病人正在住院,不允许入院.
	4. 病人曾住院,不允许入院.
	5. 
	6. 不在有效日期范围内,不允许入院.
	6. 此住院证已为无效状态.
	7. 出生日期大于住院日期,不能办理入院.
	8. 该患者已经在院,不能在进行入院操作.
	9. 此病区没有可用床位,请选择其它病区.
	10. 出生日期大于当前日期,不能办理入院.
	11. 写卡信息失败
	12. 此病人的性别非本科室允许入院登记的性别,不允许办理住院登记.
	13. 此病人的年龄非本科室允许的年龄范围,不允许办理住院登记.

###退院

	在UDHCJFIPReg.js中的admcancel_click方法中
	w ##class(web.UDHCJFIPReg).getadmcancel("","",593,4632)
不能退院的原因
1. 该患者有未账单的医嘱不能办理退院
2. 病人有未停止的医嘱,不能退院.
3. 该患者有费用产生不能办理出院
4. 该患者有未退的押金不能办理退院
5. 有在院或者出院婴儿就诊,母亲不能退院.
6. 此病人有包床信息,请取消包床后退院.
7. 此病人有门诊费用转住院不允许退院.
8. 此病人目前在床，不允许退院.

###住院病人一览

1、打印exce.xls格式

	1、在UDHCJFinfro.js中的print_click方法中

	function print_click() {
	var Rows = DHCWeb_GetTBRows('tUDHCJFinfro');
	var path="http://10.65.142.202/dthealth/med/Results/Template/"
	if (Rows == 0) {
		alert("没有要打印的数据！");
		return;
	}
	if (Guser == "") {
		return;
	}
	var job = DHCWeb_GetColumnData('Tjob', 1);
	if (job == "") {
		return;
	}
	//web.UDHCJFinfro.getnum
	var encmeth = DHCWebD_GetObjValue('getnum');
	patnum = cspRunServerMethod(encmeth, Guser, job);
	var xlApp;
	var obook;
	var osheet;
	var xlBook;
	var Template = path + "JF_PATInfo.xls";
	xlApp = new ActiveXObject("Excel.Application");
	xlBook = xlApp.Workbooks.Add(Template);
	xlsheet = xlBook.ActiveSheet;
	for (i = 1; i <= patnum; i++) {
		//web.UDHCJFinfro.getdata
		var encmeth = DHCWebD_GetObjValue('getdata');
		var str = cspRunServerMethod(encmeth, i, Guser, job);
		myData1 = str.split("^");
		for (j = 0; j < myData1.length; j++) {
			xlsheet.cells(i + 3, j + 2) = myData1[j];
		}
		addgrid(xlsheet, 0, 2, 1, 13, i + 2, 2);
	}
	var stDate = websys_$V("stdate");
	var endDate = websys_$V("enddate");
	xlsheet.cells(2, 4) = stDate + "至" + endDate;
	xlsheet.cells(2, 11) = session['LOGON.USERCODE'];
	xlsheet.printout;
	xlBook.Close(savechanges = false);
	xlApp.Quit();
	xlApp = null;
	xlsheet = null;
	}
	
2、导出润乾格式报表

	1、在UDHCJFinfro.js中的outExp_click方法中

##2、住院收费

	1. dhcipbillcharge.main.csp
	2. 住院收费事件：dhcbill/dhcipbill/dhcipbillchargecontrol.js
	3. 住院收费多条件查询界面：dhcbill/dhcipbill/dhcipbillchargesearch.js
	4. 住院收费入口文件：dhcbill/dhcipbill/dhcipbillchargeview.js

###病人基本信息

	例如就诊列表
	在dhcbill/dhcipbill/dhcipbillchargeview.js中initAdmList方法和initAdmListData方法中

###病人列表下的权限操作按钮

	按钮显示在dhcbill/dhcipbill/dhcipbillchargeview.js中initAdmList方法和initToolMenu方法中
	按钮事件在dhcbill/dhcipbill/dhcipbillchargecontrol.js中loadDHCIPBillEvent方法中。

	1、账单
		在在dhcbill/dhcipbill/dhcipbillchargecontrol.js中billClick方法中
		根据就诊rowid判断病人是否是婴儿，婴儿不能生产账单
		var rtn = tkMakeServerCall("web.UDHCJFORDCHK", "getmotheradm", 155);
		病人做账单
		var rtn = tkMakeServerCall("web.UDHCJFBaseCommon", "Bill", "", "", GlobalObj.episodeId, SessionObj.guser, GlobalObj.billId, computerName);
	2、重新生成账单
		在在dhcbill/dhcipbill/dhcipbillchargecontrol.js中rebillClick方法中
		var rtn = tkMakeServerCall("web.UDHCJFREBILL", "REBILL", "", "", GlobalObj.episodeId, GlobalObj.billId, SessionObj.guser);
	3、取消中途结算
		在dhcbill/dhcipbill/dhcipbillchargecontrol.js中delHarfBillClick方法中
		var num = tkMakeServerCall("web.UDHCJFIntBill", "DINBILL", GlobalObj.billId, SessionObj.guser);
	4、封账
		在dhcbill/dhcipbill/dhcipbillchargecontrol.js中closeAcountClick方法中
		var rtn = tkMakeServerCall("web.DHCIPBillPBCloseAcount", "PaidPatientbill", episodeId, billId, SessionObj.guser, computerName);
	5、取消封账
		在dhcbill/dhcipbill/dhcipbillchargecontrol.js中uncloseAcountClick方法中
		var rtn = tkMakeServerCall("web.DHCIPBillPBCloseAcount", "UnCloseAcount", episodeId, billId, SessionObj.guser, computerName);  
	6、原号补打发票
		在dhcbill/dhcipbill/dhcipbillchargecontrol.js中rePrintInvClick方法中
		var rtn=tkMakeServerCall("web.UDHCJFPRINTINV", "GetInvflagByInvno", invNo, SessionObj.guser);
	7、打印收据
		在dhcbill/dhcipbill/dhcipbillchargecontrol.js中printFPClick方法中,
		DHCJFIPReceipt:住院发票打印模板xml,
		在udhcjfdayprint.js中的PrintFP方法中获取发票中的信息
		在DHCPrtComm.js中的DHCP_PrintFun方法中把发票信息打印出来
	8、作废收据
		在dhcbill/dhcipbill/dhcipbillchargecontrol.js中abortClick方法。
		var abortNum = tkMakeServerCall("web.UDHCJFPAY", "Abort0", "", "", p1);
	9、更多查询
		在dhcbill/dhcipbill/dhcipbillchargeview.js中的searchClick方法中。
	10、跳号
		在dhcbill/dhcipbill/dhcipbillchargecontrol.js中altVoidInvClick方法中。
		
		


###病人列表信息

	在dhcbill/dhcipbill/dhcipbillchargeview.js中的initPatListData方法和initPatListPanel方法
	w ##class(%ResultSet).RunQuery("web.DHCIPBillCashier","searchbill","","","","","","","","","","","",155,"","7050^240^121^2")
###出院结算  

	在dhcbill/dhcipbill/dhcipbillchargecontrol.js中的chargeClick方法中

	不允许出院结算的原因：
		1. 账单号为空,不允许结算
		2. 发票号和后台查询不一致 tkMakeServerCall("web.UDHCJFPAY", "getcurinvno1",SessionObj.guser, admReason);
		3. 您没有可用发票,不能结算
		4. 此就诊为医保就诊,请先做医保结算
		5. 再次收退
		6. 导致押金列表显示不完全,请再次账单
		6. 有婴儿未结算,母亲是否确认结算
		7. 病人已经取消住院
		8. 账单信息获取失败 w ##class(web.DHCIPBillCashier).getBillBaseInfo()
		9. 此账单已经红冲,不允许结算
		10. 此账单已结算或已封帐
		11. 患者正在进行费用调整,不允许结算
		12. 没有可用的收据号
	结算后台
	var rtn = tkMakeServerCall("web.UDHCJFPAY", "paybill0", "", "", p1, p2);
    w ##class(web.UDHCJFPAY).paybill0("","",^val1,^val2)

	根据global查看账单
	DHC-APP>zw ^DHCPB("268737")
	^DHCPB(268737)="1510^64861^^1^^64861^64867^1746.5^24^^9.6^1712.9^^^^B^^^64866^312^1^"


	打印出院结算发票
	在dhcbill/dhcipbill/dhcipbillchargecontrol.js中的printClick方法中
    udhcjfdayprint.js中的PrintFPbak方法中
	w ##class("web.UDHCJFPRINTINV").GetPrintInfo(5303,254519,"")

###取消结算

	在dhcbill/dhcipbill/dhcipbillchargecontrol.js中的cancelPayClick方法中

	不允许取消结算的原因
	1. 取消结算需打印负票,您没有可用发票
	2. 此账单为封帐账单，不能取消结算
	3. 账单信息获取失败
	4. 账单没有结算，不允许取消结算
	5. 该患者发票已作废，不能取消结算
	6. 欠费患者，不能取消结算
	7. 该患者没有结算，不能取消结算
	8. 该患者已经取消结算，不能再次取消
	9. 没有可用的收据号


	var rtn = tkMakeServerCall("web.UDHCJFPBCANCELIP", "DelPay", "", "", GlobalObj.episodeId, GlobalObj.billId, SessionObj.guser, Config.dhcJfConfig.refFpPrtFlag, Config.dhcJfConfig.refFpFlag);

	w ##class(web.UDHCJFPBCANCELIP).DelPay("","","565","267302","7050","Y","N")

###其他操作按钮信息
	1、交押金
		在dhcbill/dhcipbill/dhcipbillchargeview.js中的initAddDepositTab方法中
		var url = 'websys.default.csp?WEBSYS.TCOMPONENT=UDHCJFDeposit&Adm=' + GlobalObj.episodeId + '&deposittype=' + "";
	2、退押金
		在dhcbill/dhcipbill/dhcipbillchargeview.js中的initRefDepositTab方法中
		var url = 'websys.default.csp?WEBSYS.TCOMPONENT=UDHCJFRefundDeposit&Adm=' + GlobalObj.episodeId;
	3、中途结算
		在dhcbill/dhcipbill/dhcipbillchargeview.js中的initHalfBillTab方法中
		var url = 'websys.default.csp?WEBSYS.TCOMPONENT=UDHCJFIntPay&BillNo=' + GlobalObj.billId;
	4、医嘱拆分账单
		在dhcbill/dhcipbill/dhcipbillchargeview.js中的initHalfBillByOrdTab方法中
		var url = 'websys.default.csp?WEBSYS.TCOMPONENT=DHCIPBILLOEORIItemGroup&EpisodeID=' + GlobalObj.episodeId + '&BillNo=' + GlobalObj.billId + '&Guser=' + SessionObj.guser;
	5、病人费用明细
		在dhcbill/dhcipbill/dhcipbillchargeview.js中的initBillDetailTab方法中
		var url = 'websys.default.csp?WEBSYS.TCOMPONENT=UDHCJFBillDetail&BillNo=' + GlobalObj.billId;
	6、押金明细查询
		在dhcbill/dhcipbill/dhcipbillchargeview.js中的initDepDetailTab方法中
		var url = 'websys.default.csp?WEBSYS.TCOMPONENT=UDHCJFFindDeposit&BillNo=' + GlobalObj.billId + "&Adm=" + GlobalObj.episodeId;
	7、医嘱费用明细
		在dhcbill/dhcipbill/dhcipbillchargeview.js中的initOrdFeeTab方法中
		var url = 'websys.default.csp?WEBSYS.TCOMPONENT=UDHCJFOrdDetail&BillNo=' + GlobalObj.billId+"&EpisodeID=" + GlobalObj.episodeId;
	8、收费项目查询
		在dhcbill/dhcipbill/dhcipbillchargeview.js中的initTarFeeTab方法中
		var url = 'websys.default.csp?WEBSYS.TCOMPONENT=UDHCJFItmDetail&BillNo=' + GlobalObj.billId;
###分类信息

	w ##Class(%ResultSet).RunQuery("web.DHCIPBillCashier","getLedger","267321")

	
##3、押金管理
	1. UDHCJFyjfind.js
	2. UDHCJFyjfind组件
###获取住院病人基本信息

	d ##class(%ResultSet).RunQuery("web.UDHCJFinfro","findadminfro","小3","0000000024","","002628",230)
###交押金
	交押金页面在UDHCJFyjfind.js中的LinkaddDeposit方法中
	var str = 'websys.default.csp?WEBSYS.TCOMPONENT=UDHCJFDeposit&Adm=' + Adm + '&deposittype=' + deposittype;

	交押金操作在UDHCJFDeposit.js中的Add_click方法中
	var encmeth = DHCWebD_GetObjValue('Add');
	//s val=##Class(%CSP.Page).Encrypt($lb("web.UDHCJFDeposit.InsertDeposit"))
###退押金
	退押金页面在UDHCJFyjfind.js中的refunddeposit_click方法中
	var str = 'websys.default.csp?WEBSYS.TCOMPONENT=UDHCJFRefundDeposit&Adm=' + Adm;

	退押金操作在UDHCJFRefundDeposit.js中的RefundDeposit方法中

##4、住院证
	在DHCDocIPBookList.js中
	w ##Class(%ResultSet).RunQuery("web.DHCDocIPBookingCtl","QueryBookByDateLoc","64848","64852","",,"","","","1")
	

##5、住院收费查询
###封帐
	1、在UDHCJFCASHIER.js中的CloseAcount_click方法中
	2、生成账单js和cls：在UDHCJFCASHIER.js中的Bill方法和cls
	w ##class(web.UDHCJFBaseCommon).Bill("","","364","5816","259057","")
	3、封账cls:
	var RetCode = tkMakeServerCall("web.DHCIPBillPBCloseAcount", "PaidPatientbill", Adm, BillNo, Guser, computername);
###取消封帐
	1、在UDHCJFCASHIER.js中的UnCloseAcount_click方法中
	2、取消封账：
	var RetCode = tkMakeServerCall("web.DHCIPBillPBCloseAcount", "UnCloseAcount", Adm, BillNo, Guser, computername);

###打印明细
	1、在UDHCJFCASHIER.js中的LinkBillDetail方法中
	//页面显示明细信息
	d ##class(%ResultSet).RunQuery("web.UDHCJFBillDetail","FindBillDetail","268231","","","")
	//报表明细信息
	d ##class(%ResultSet).RunQuery("web.UDHCJFBillDetail","FindBillInfo","268231","9476")
###点击列表登记号
	1、dhcipbillpatordfeecheck.csp
	2、"&EpisodeID="_rs.GetDataByName("Tadm")  //就诊号
	3、医嘱费用查询：DHCIPBillOrdCheck.js
	4、医嘱执行相关记录：DHCIPBillOrdexcDetails1.js
	5、医嘱收费项：DHCIPBillOrdItem.js

##6、住院操作员日报表
	1、dhcbill.ipbill.dailyhand.csp
	2、dhcbill/dhcipbill/dhcbill.ipbill.dailyhand.js
###点击查询
	1、在dhcbill.ipbill.dailyhand.js中的find_Click方法中
	2、具体内容：在dhcbill.ipbill.dailyreports.csp和dhcbill/dhcipbill/dhcbill.ipbill.dailyreports.js中的initReportsGrid方法中。
	3、cls：web.DHCIPBillDailyHandin.cls中的FindIPHandinInfo方法中
###双击日结历史列表
	1、在dhcbill.ipbill.dailyreports.js中的initReportsGrid方法中的onDblClickRow方法中 。
###报表和明细的Tab的csp和js

	1、dhcbill.dailymaintabs.csp
	2、dhcbill/dhcbill.dailymaintabs.js

###添加tab事件

	在dhcbill.dailymaintabs.js中的initTabs()

###tab来源：

	在web.DHCBillGroupConfig.cls中的GetGroupSettingTabs方法中
	
###点击加载tab报表内容：

	在dhcbill.dailymaintabs.js中的loadSelTabsContent()

###报表地址的url来源

	在web.DHCBillGroupConfig中GetBillTabsUrl方法中
	在dhcbill.dailymaintabs.js中的loadDetailsList()中
	例如报表2的url："dhccpmrunqianreportprint.csp?reportName=DHCBILL-OPBILL-门诊个人日报表2.raq&stDate=2018-07-20&stTime=09:00:26&endDate=2018-07-20&endTime=09:21:07&footId=&guser=7050&hospDR=2"

###报表在页面上显示：

	1、在dhcbill.dailymaintabs.js中的refreshTab方法中

##7、业务查询

##8、患者住院费用核查

	dhcipbillcheckadmfee.csp
	dhcbill/dhcipbill/dhcipbillcheckadmfee.js
###输入登记号回车
	在dhcipbillcheckadmfee.js中的findPatKeyDownPatNo方法中

	1、获取患者信息
	w ##class(web.DHCIPBillCheckAdmCost).GetAdmInfo("", "", 94)
	2、查询已做医疗结算,未作最终结算的在院病人
	do ##class(%ResultSet).RunQuery("web.DHCIPBillCheckAdmCost","FindCurInPatient", "", "", "", "", "", "Y")

###选中病人列表 回调事件
	
	在dhcipbillcheckadmfee.js中的selectPatListRow方法中
	w ##class(web.DHCIPBillCheckAdmCost).GetAdmInfo("", "", 94)

###加载监控点列表

	在dhcipbillcheckadmfee.js中的loadPointList方法中
	d ##class(%ResultSet).RunQuery("web.DHCIPBillCheckAdmCost", "FindIPBillCheckFee", 1384, 15156, "")
	
	//初始化监控点列表
	在dhcipbillcheckadmfee.js中的initPointList方法中

###加载明细列表

	在dhcipbillcheckadmfee.js中的loadDetailsList方法中
	d ##class(%ResultSet).RunQuery("web.DHCIPBillCheckAdmCost", "FindIPBillCheckFeeDetails", "354","6232","","")

	//初始化明细列表
	在dhcipbillcheckadmfee.js中的initDetailsList方法中

###住院费用审核

	在dhcipbillcheckadmfee.js中的audit方法中
	w ##class(web.DHCIPBillCheckAdmCost).AuditFee("5541","5430||9^^^8^5541","671")



##9、住院处担保

###查询担保人
	
	点击查询
	var find1obj = websys_$('Find');
		if (find1obj) {
			find1obj.click();
	}
	调用后台cls
	do ##class(%ResultSet).RunQuery("web.UDHCJFZYDB","warrant","64674","","5","","I","0000000002","王伟测试","内分泌科","")

###添加担保人
	在UDHCJFZYDB.js中的add_click方法中




#三、住院医生站
##1、医嘱录入

	1. 住院患者医嘱信息总览ipdoc.patorderview.csp和dhcdoc/ipdoc/InPatOrderView.js
	2. 医嘱录入表现层oeorder.oplistcustom.show.csp和

##2、会诊管理
###1、会诊申请

	1. 会诊申请：dhcem.consultmain.csp 和 scripts/dhcnewpro/dhcem/consultmain.js
	2. 会诊申请单：dhcem.consultwrite.csp 和 scripts/dhcnewpro/dhcem/consultwrite.js
	3. 病历浏览：emr.inter
	4. face.browse.category.csp 和 scripts/emr/js/interface.browse.category.js
	4. 开启授权：epr.newfw.actionauthorize.csp、、、、epr.newfw.actionauthorizeEPR.csp、、、、emr.authorizes.actionauthorize.csp 和 scripts/emr/js/authorizes.ActionAuthorize.js
###2、会诊申请查询

	1. 申请单列表：dhcem.consultquery.csp 和 scripts/dhcnewpro/dhcem/consultquery.js
	2. 会诊申请单：dhcem.consult.csp 和 scripts/dhcnewpro/dhcem/consult.js

##3、出院患者查询
1、出院患者查询组件：UDHCJFDischQuery.js

	d ##class(%ResultSet).RunQuery("web.UDHCJFDischQuery","getdiscpat","0",1,64824,64827,"65","","",3,"","","","","","","","")

##4、诊疗与病历

	inpatientlist.inpat.csp
#四、门诊医生站
##1、开住院证

	1、开住院证的csp:dhcdocipbooknewcreat.csp  
	2、开住院证的js:DHCDocIPBookNewC.js
	录入院前医嘱OrderLinkClick()

3、填写院前医嘱返回的URL

	var url=tkMakeServerCall("web.DHCDocIPBookNew","GetOrderLink",BookIDMain)
	zw ##class(web.DHCDocIPBookNew).GetOrderLink("134")

4、医嘱录入

	医嘱录入表现层的csp： oeorder.oplistcustom.show.csp   
	医嘱录入表现层的js:dhcdoc/UDHCOEOrder.List.Custom.New.js  

5、医生站调用检查申请弹出窗

	dhcapp.docpopwin.csp
	dhcapp.reportreq.csp
	dhcnewpro/dhcapp/reportreq.js
	
	

##2、检验检查申请单

	1、检验检查申请的csp:dhcapp.mainframe.csp  
	2、检验检查申请的js:dhcnewpro/dhcapp/mainframe.js  
	3、检查方法和申请单内容csp:dhcapp.reportreq.csp  
	4、检查方法和申请单内容js:dhcnewpro/dhcapp/reportreq.js 
	5、检查方法中的检查项目列表：W ##Class(web.DHCAPPExaReportQuery).jsonExaItemListDoc("7044")
	6、点击检查项目弹出部位选择框：dhcnewpro/dhcapp/reportreq.js中的createPartPopUpWin方法
	7、检查申请单:选择检查部位时，增加根据拼音检索功能：w ##Class(web.DHCAPPExaReportQuery).GetPartTreeChildByArcNew("3861||1","2","")

1、打印检查单

	dhcnewpro/dhcapp/reportreq.js中的printExaReq方法中
	dhcnewpro/dhcapp/dhcappprintcom.js中的ExaReqPrint方法中
	获取数据
	w ##Class(web.DHCAPPPrintCom).GetExaReqPrintData("720","")
	打印数据
	dhcnewpro/dhcapp/dhcappprintcom.js中的Print_Xml方法中

2、发送

2、打印病理TCT申请单

	dhcapp.piswontct.csp 妇科TCT申请单
	dhcnewpro/dhcapp/piswontct.js
	w ##Class(web.DHCAppPisMaster).UpdateGynWon("") //更新病理TCT申请内容
	w ##Class(web.DHCAPPPrintCom).GetPisPrintCon("394")//病理申请打印内容

3、活体组织申请单

	dhcapp.pislivcells.csp 活体组织申请单
	dhcnewpro/dhcapp/pislivcells.js




#五、护士
##1、护士执行
	在DHCNurOPExec.js中SkinTestNormal方法中
	zw ##class(web.DHCNurCom).SetSkinTestResult("1293||2||1","7054","N")
http://10.146.9.10/dthealth/web/scripts/websys.menugroup.js