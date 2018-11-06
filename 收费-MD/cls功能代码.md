#<font color=red>cls功能代码</font>

##1、账户结算时获取需要打印发票的信息

	w ##class(web.BOE.Test).GetInvIfom("37235")

	ClassMethod GetInvIfom(AccRowID As %String) As %String
	{
		s myPLRIDStr=""
		if ($d(^DHCACD("AccM",AccRowID))) d
		.b ;w
		.s mysub=0
		.f  s mysub=$o(^DHCACD("AccM",AccRowID,"AccPL",mysub)) q:(mysub="")  d
		..s myBillNo=$p((^DHCACD("AccM",AccRowID,"AccPL",mysub)),"^",4)
		..s myPAPMIDR=$p((^DHCACD("AccM",AccRowID,"AccPL",mysub)),"^",1)	;DHC_AccManager->
		..s myPRTRowID=$p((^DHCACD("AccM",AccRowID,"AccPL",mysub)),"^",2)
		..b ;w1
		..q:('$d(^DHCINVPRT(myPRTRowID)))
		..s myINVFlag=$p(^DHCINVPRT(myPRTRowID),"^",8)		    ;发票的状态N , S 
		..b ;w2
		..q:((myINVFlag'="N"))		;只打印正常的发票集合
		..s myINVPrtFlag=$p(^DHCINVPRT(myPRTRowID),"^",3)		;发票的打印标志
		..b ;w3
		..q:((myINVPrtFlag'="N"))
		..s insuDivDR=$p(^DHCINVPRT(myPRTRowID),"^",30)
		..i (insuDivDR'="") d
		...s AutoFlag=1
		..s myPLRowID=AccRowID_"||"_mysub
		..s myPLRIDStr=myPLRIDStr_"^"_myPLRowID
		b ;www
		q myPLRIDStr
	}