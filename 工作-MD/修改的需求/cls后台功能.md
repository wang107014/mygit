##一、预交金结算

	1、zw ##class(web.DHCOPINVCons).OPBillCharge(myAdmstr, Guser, unordstr, curInsType, patpaysum, myPayinfo, Guloc, "0", OldINVRID, ReadInfoType, myExpStr)
    参数global ^TMPZCZ("OP")
    zw ##class(web.DHCOPINVCons).OPBillCharge("334^","7050","$c(2)334$c(2)^^$c(2)334$c(2)","1","47.16","3^^^^","239","0","","0","239^119^37120^N^F^^^0^")
    zw ##class(web.DHCBillCons12).ReBill("7050","273","1","60.37","3^^^^","239","0","","239^119^37123^N^F^^^0^^^")
   
	2、保存前台需结算医嘱信息，记录结算医嘱数据及参数信息到进程Global
	do ##class(web.DHCOPBillChargExcepitonAnalyse).SaveChargeOrdLog(Paadminfo,Userid,UnBillOrdStr,Instype,PatPaySum,ExpStr)
    参数global  ^TMP("SaveChargeOrdLog")


##二、获取发票信息 DHC_INPVRT表的信息

	所有的发票都需要审批,可以出现假审批,当时只有=Y  时才能退费
	w ##class(web.udhcOPRefund).GetRcptinfo("SetReceipInfo","","224965")
    global:^DHCINVPRT("224943")


##三、住院收费
1、判断账单费别是否需要发票

	var qualifStatus = tkMakeServerCall("web.UDHCJFBaseCommon","GetReaQualifStatus", GlobalObj.billId); 
	w ##class(web.UDHCJFBaseCommon).GetReaQualifStatus("267246")

2、判断此账单是否为封帐账单。(Y为是,N为否)

	var acountFlag = tkMakeServerCall("web.DHCIPBillPBCloseAcount", "GetPaidCAcountFlag", GlobalObj.billId);
	w ##class(web.DHCIPBillPBCloseAcount).GetPaidCAcountFlag("267246")


3、获取账单基本字段信息

	var billBaseInfo = tkMakeServerCall("web.DHCIPBillCashier", "getBillBaseInfo", GlobalObj.billId);

	w ##class(web.DHCIPBillCashier).getBillBaseInfo("267252")


4、判断患者不能取消结算的原因
    

    pbFlag==Abort  该患者发票已作废
	pbFlag==QF 欠费患者
	pbFlag==PbNotPaid 该患者没有结算
	pbFlag==PbAlready 该患者没已经取消结算
	pbFlag==TransErr  病人结算时转过预交金,是否确认取消结算,如果取消结算预交金会虚增
	pbFlag==""  可以取消结算
	var pbFlag = tkMakeServerCall("web.UDHCJFPBCANCELIP", "getpbflag", GlobalObj.billId);

	w ##class(web.UDHCJFPBCANCELIP).getpbflag("267252")

5、账单取消结算

	//his取消结算
	//1,取消结算是否打印负票 dhcJfConfig.refFpPrtFlag
	//2,收款员未交帐取消结算是否按作废方式处理dhcJfConfig.refFpFlag	
	var rtn = tkMakeServerCall("web.UDHCJFPBCANCELIP", "DelPay", "", "", GlobalObj.episodeId, GlobalObj.billId, SessionObj.guser, Config.dhcJfConfig.refFpPrtFlag, Config.dhcJfConfig.refFpFlag);
	w ##class(web.UDHCJFPBCANCELIP).DelPay("","","565","267302","7050","Y","N")

6、后台取就诊的费别信息

	var admReasonInfo = tkMakeServerCall("web.DHCIPBillCashier", "getInsTypeInfo", GlobalObj.episodeId, "");
	w ##class(web.DHCIPBillCashier).getInsTypeInfo("565","")

7、判断有没有发票

	var currentInv = tkMakeServerCall("web.UDHCJFPAY", "getcurinvno", "setCurrentInv", "", SessionObj.guser, admReasonDesc);
	w ##class(web.UDHCJFPAY).getcurinvno("setCurrentInv","","7050","全自费")

8、分类信息

	w ##Class(%ResultSet).RunQuery("web.DHCIPBillCashier","getLedger","267321")

9、病人列表信息

	w ##class(%ResultSet).RunQuery("web.DHCIPBillCashier","searchbill","","","","","","","","","","","",565,"","7050^240^121^2")

10、支付方式数据

	d ##class(%ResultSet).RunQuery("web.DHCIPBillCashier","ReadPMSequence",7050,240,5803,267321)

11、根据就诊id取就诊的费别信息 

	var admReasonInfo = tkMakeServerCall("web.DHCIPBillCashier", "getInsTypeInfo", GlobalObj.episodeId, "");
12、判断有没有发票,后台方法用的是DESC

	var currentInv = tkMakeServerCall("web.UDHCJFPAY", "getcurinvno", "setCurrentInv", "", 7050, "全自费")

13、把金额转换为大写

	w ##class(UDHCJFYJ).RMBDXXZH(patshare)

##四、建卡挂号
1、根据登记号查找建卡信息

	var PatStr=tkMakeServerCall("web.DHCDocOrderEntry","GetPatientByNo",RegNo);

2、恢复排号,撤消挂号或预约时使用

	zw	##class(web.DHCRBAppointment).RestoreSeqNo(RBASRowId, QueueNo, StatusCode)



##五、Query模板

	Query GetPatinfo(bill As %String) As websys.Query(ROWSPEC = "GSPMRowid:%String,GSPMDesc:%String") [ SqlProc ]
	{
	}
	
	/// d ##class(%ResultSet).RunQuery("web.DHCIPBillCashier","GetIPChargePM")
	ClassMethod GetPatinfoExecute(ByRef qHandle As %Binary, bill As %String) As %Status
	{
		New repid, index
		Set repid=$I(^CacheTemp)
		Set qHandle=$lb(0,repid,0)
		Set ind=1
	
		Set Rowid=""
		For  Set Rowid=$o(^CT("CTPM",Rowid)) Quit:Rowid=""  Do
		.Quit:Rowid=0
		.Set GSPMDesc=$p(^CT("CTPM",Rowid),"^",2)
		.Set GSPMRowid=Rowid
		.Do OutputRowGSPaym
		Set qHandle=$lb(0,repid,0)
		Quit $$$OK
	OutputRowGSPaym
		Set Data=$lb(GSPMRowid,GSPMDesc)
		Set ^CacheTemp(repid,ind)=Data
		Set ind=ind+1
		Quit
	}



##六、医嘱退费
1、判断医嘱是否允许部分退费

	w ##class(web.DHCOPBillRefundRequestNew).GetOrdAllowPartRequest("51||17")

2、根据医嘱Rowid获取医嘱退费数量

	Return:总退费数量^申请退费数量^实际退费数量
	w ##class(web.DHCOPBillOERefundQty).GetRefundQTY("5438||4", "")


##七、住院确认
1、根据就诊id判断病人是否正在留观

	w ##class(web.UDHCJFBaseCommon).GetPatStayStat("52")

2、根据住院证id 判断住院证有效性,返回值不为空均为异常

	异常说明:IPBookErr:不是当天的住院证 Admission:病人正在住院 OnceAdmission:病人曾住院
	w ##class(web.DHCBillInterface).IIsIPBook()

3、计算年龄

	w ##class(web.UDHCJFIPReg).getpatage("1990-01-01", "2017-06-13")

4、获取某个科室允许的性别和年龄范围

	w ##class(web.UDHCJFIPReg).GetSexAndAgeByLoc(1,2,30,52961)
