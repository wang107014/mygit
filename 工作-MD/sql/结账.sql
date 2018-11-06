
//门诊日报结算流程


//门诊报表结算表(票据结算表)
SELECT * FROM DHC_INVPRTReports

//门诊子类及会计子类
SELECT * FROM DHC_INVPRTReportsSub

//支付方式子表
SELECT * FROM DHC_INVPRTReportsPaymode

//病人费别对应的支付方式
SELECT * FROM DHC_INVPRTReportsInsType

//门诊收据信息主表
SELECT * FROM Dhc_invprt

//综合打印发票
SELECT * FROM DHC_AccPayINV

//预交金表
SELECT * FROM DHC_AccPreDeposit

//卡支付与预交金结算流水帐对帐表
SELECT * FROM DHC_AccPFoot

//账户结算表
SELECT * FROM DHC_AccFootInfo

//卡发票表
SELECT * FROM DHC_CardINVPRT

//作废发票表
SELECT * FROM DHC_VoidInv