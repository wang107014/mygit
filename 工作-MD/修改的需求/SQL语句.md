1、根据rowid从表中查出数据存放到PLIST()数组中
	
	查询插入
	&sql(SELECT * INTO PLIST() FROM DHC_OPGroupSettings WHERE GS_RowID= :RowId) 
	
	修改字段
	&sql(update pa_person set paper_ExemptionNumber=:InPatNo where paper_rowid=:PAPMiID)

2、发票详细数据配置表

	SELECT * FROM DHC_OPGroupSettings    

3、医嘱诊断

	//病人诊断
	SELECT MRDIA_ICDCode_DR->MRCID_Desc, * FROM MR_Diagnos WHERE MRDIA_MRADM_ParRef="81"
	//诊断描述
	SELECT * FROM MRC_ICDDX
	SELECT * FROM MR_DiagType
	SELECT TYP_MRCDiagTyp->DTYP_Desc,* FROM MR_DiagType WHERE TYP_ParRef['81'
	//诊断类别
	SELECT * FROM MRC_DiagnosType

4、卡查询

	SELECT * FROM dhc_amtmag
	SELECT * FROM DHC_OPGroupSettings  WHERE GS_RowID="173"
	SELECT * FROM dhc_invoice 
	SELECT * FROM DHC_CardRef WHERE CF_CardNo="101100000080"
	SELECT * FROM PA_PatMas WHERE PAPMI_RowId1="189"

5、退号

	SELECT * FROM DHCRegistrationFee WHERE ID="387"
	//分诊标志
	SELECT * FROM DHCPerState
	//
	SELECT * FROM DHCQueue WHERE QuePaadmDr="760"
	SELECT * FROM PA_AdmExt 
	//就诊表
	SELECT * FROM PA_Adm WHERE PAADM_RowID="760"

	//挂号表
	SELECT * FROM DHCRegistrationFee

	//排班记录表
	SELECT * FROM RB_ApptSchedule WHERE AS_RowId='221||71'
	
	//排班记录扩展表
	SELECT * FROM DHC_RBApptSchedule WHERE AS_RowId='252||22'


#收费
##住院收费

	住院收费账单主表
	SELECT * FROM DHC_PatientBill WHERE PB_Adm_Dr="565"

	//账单主表
	SELECT * FROM dhc_patientbill

	//病人医嘱费用明细表
	SELECT  * FROM dhc_patbillorder WHERE PBO_PB_ParRef="266326"

	//医嘱项指针
	SELECT * FROM ARC_ItmMast	

	//病人就诊信息表
	SELECT * FROM PA_ADM	

	//病人表
	SELECT * FROM PA_PatMas	

	//病人医嘱指针
	SELECT OEORI_ItmMast_DR->ARCIM_Desc,* FROM OE_OrdItem	

	//账单收费项目明细表
	SELECT * FROM dhc_patbilldetails	

	//住院发票表
	SELECT PRT_Adm->PAADM_PAPMI_DR->PAPMI_Name, * FROM dhc_invprtzy

	//就诊表
	SELECT PAADM_PAPMI_DR->PAPMI_Name, * FROM pa_adm

	//病人表
	SELECT * FROM PA_Patmas

##根据登记号查找病人账单 

	//根据登记号查找病人表中的PAPMI_RowId1=478
	SELECT * FROM PA_PatMas	WHERE PAPMI_No="101100000436"
	
	//根据病人表中的PAPMI_RowId1查找病人就诊信息表中的PAADM_RowID=975
	SELECT * FROM PA_ADM WHERE PAADM_PAPMI_DR="478"
	
	//根据病人就诊信息表中的PAADM_RowID查找住院收费账单主表的PB_RowId=267763
	SELECT * FROM DHC_PatientBill WHERE PB_Adm_Dr="975"
	
	//根据账单主表的PB_RowId查找病人医嘱费用明细表
	SELECT  * FROM dhc_patbillorder WHERE PBO_PB_ParRef="267763"

##根据登记号查找病人医嘱

	//病人基本信息表
	SELECT * FROM PA_PatMas WHERE PAPMI_No='101100000657'
	
	//病人就诊信息表
	SELECT * FROM PA_Adm WHERE (PAADM_PAPMI_DR=536 AND PAADM_Type="I") 
	
	//医嘱表
	SELECT * FROM OE_Order WHERE OEORD_Adm_DR=935
	
	//医嘱表
	SELECT OEORI_ItmMast_DR->ARCIM_Desc,* FROM OE_OrdItem WHERE OEORI_OEORD_ParRef=877
	
	//医嘱项表
	SELECT * FROM ARC_ItmMast WHERE ARCIM_RowId IN ('2108||1')
	
	//医嘱执行表
	SELECT OEORE_OEORI_ParRef->OEORI_ItmMast_DR->ARCIM_Desc,* FROM OE_OrdExec WHERE OEORE_OEORI_ParRef IN ('877||1','877||2','877||3')
	
	//医嘱执行扩展表
	SELECT * FROM OE_OrdExecExt WHERE OEORE_OEORI_ParRef IN ('763||1','763||2')



##根据就诊id查诊断

	//就诊表
	SELECT * FROM PA_Adm WHERE PAADM_RowID="1"
	
	/就诊病历表
	SELECT * FROM MR_Adm WHERE MRADM_ADM_DR='1'
	
	//就诊诊断表
	SELECT * FROM MR_Diagnos WHERE MRDIA_MRADM_ParRef='1'
	
	//诊断表
	SELECT * FROM MRC_ICDDx WHERE MRCID_RowId='16462'

##收费日结
	//收费员日报结算表
	SELECT * FROM dhc_jfuserjk

##住院担保
	住院担保
	SELECT * FROM dhc_warrant


#门诊收费结算

	//病人表
	SELECT * FROM PA_PatMas WHERE PAPMI_No='101100000657'
	
	//收据信息主表
	SELECT * FROM DHC_INVPRT WHERE PRT_PAPMI_DR='701'
	
	//收费业务表
	SELECT * FROM ar_receipts WHERE ARRCP_RowId="1967"


#门诊日报结算流程


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