
//病人表
SELECT * FROM PA_PatMas WHERE PAPMI_No="101100000436"

//就诊表
SELECT PAADM_PAPMI_DR->PAPMI_Name, * FROM PA_Adm WHERE PAADM_PAPMI_DR="478"

//账单主表
SELECT  * FROM DHC_PatientBill WHERE PB_Adm_Dr="979"

//账单收费项目明细表
SELECT * FROM dhc_patbilldetails WHERE PBD_TARI_DR="2163"

//病人医嘱费用明细表
SELECT * FROM dhc_patbillorder WHERE PBO_PB_ParRef="267778"

//病人医嘱
SELECT OEORI_ItmMast_DR->ARCIM_Desc,* FROM OE_OrdItem WHERE OEORI_OEORD_ParRef="478"

//医嘱项
SELECT * FROM ARC_ItmMast

//住院发票表
SELECT * FROM dhc_invprtzy WHERE PRT_Adm="565"

//收费员日报结算表
SELECT * FROM dhc_jfuserjk

//住院担保
SELECT * FROM dhc_warrant

//病人信息修改表
SELECT * FROM dhc_jfupreport

//应收款结算分类余额表
SELECT * FROM dhc_jffeeacount

//支票到帐表
SELECT * FROM dhc_jfbankback

//绿色通道代码表
SELECT * FROM PAC_AdmCategory

//收费项目子分类
SELECT * FROM DHC_TarSubCate

//收费项目住院分类
SELECT * FROM DHC_TarIC

//收费项目门诊子分类
SELECT * FROM DHC_TarOutpatCate

//费用项目表
SELECT * FROM DHC_TarItem

//费用项目价格表
SELECT TP_PatInsType->REA_Desc, TP_TARI_ParRef->TARI_Desc, * FROM DHC_TarItemPrice

//病人保险类型
SELECT * FROM PAC_AdmReason


SELECT * FROM dhc_orderlinktar

SELECT * FROM dhc_invprt

//查找门诊位置
SELECT CTLOC_Floor,* FROM CT_Loc WHERE CTLOC_Desc ['内分泌'

//
SELECT * FROM DHCRegistrationFee

SELECT * FROM DHC_RBApptSchedule WHERE AS_RowId='7||53'

//医生01排班
SELECT * FROM DHC_RBApptSchedule WHERE AS_RowId='221||90'

SELECT * FROM RB_ApptSchedule