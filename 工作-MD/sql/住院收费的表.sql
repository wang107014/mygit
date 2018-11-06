//住院收费
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







