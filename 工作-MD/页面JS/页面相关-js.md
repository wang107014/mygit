#一、门诊挂号收费处
##1、结算
1. 病人基本信息：udhcOPPatinfo.js
2. 医嘱列表：DHCOPOEList.js
3. 收费结算：udhcOPCharge.js
4. 新增医嘱：DHCOPOEOrdInput.js
##2、门诊退费审核
1. 门诊退费审核：udhcOPRefund.Auditing.js
2. 门诊退费审核明细：udhcOPRefund.AuditOrder.js
3. 门诊收据查询：udhcOPINV.Query.js    

	 	d ##class(%ResultSet).RunQuery("web.udhcOPQUERY","INVQUERY","ALL","","","","",64824,64824,"","ALL","","","","","","","")

##3、退费
1. 门诊退费查询结果：udhcOPRefund.QueryIndex.js

		d ##class(%ResultSet).RunQuery("web.udhcOPQUERYExp","INVQUERY","ALL","","","","","64824","64824","","ALL","","","","","","","")

#二、住院出入院结算
##1、住院收费
1. dhcipbillcharge.main.csp
2. 住院收费事件：dhcbill/dhcipbill/dhcipbillchargecontrol.js
3. 住院收费多条件查询界面：dhcbill/dhcipbill/dhcipbillchargesearch.js
4. 住院收费入口文件：dhcbill/dhcipbill/dhcipbillchargeview.js


#三、住院医生站
##1、医嘱录入
1. 住院患者医嘱信息总览ipdoc.patorderview.csp和InPatOrderView.js
2. 医嘱录入表现层oeorder.oplistcustom.show.csp和

##2、会诊管理
###会诊申请
1. 会诊申请：dhcem.consultmain.csp 和 scripts/dhcnewpro/dhcem/consultmain.js
2. 会诊申请单：dhcem.consultwrite.csp 和 scripts/dhcnewpro/dhcem/consultwrite.js
3. 病历浏览：emr.interface.browse.category.csp 和 scripts/emr/js/interface.browse.category.js
4. 开启授权：epr.newfw.actionauthorize.csp、、、、epr.newfw.actionauthorizeEPR.csp、、、、emr.authorizes.actionauthorize.csp 和 scripts/emr/js/authorizes.ActionAuthorize.js
###会诊申请查询
1. 申请单列表：dhcem.consultquery.csp 和 scripts/dhcnewpro/dhcem/consultquery.js
2. 会诊申请单：dhcem.consult.csp 和 scripts/dhcnewpro/dhcem/consult.js

##3、出院患者查询
1、出院患者查询组件：UDHCJFDischQuery.js

	d ##class(%ResultSet).RunQuery("web.UDHCJFDischQuery","getdiscpat","0",1,64824,64827,"65","","",3,"","","","","","","","")




