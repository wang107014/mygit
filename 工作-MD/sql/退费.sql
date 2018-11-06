
//收据信息主表
SELECT * FROM  DHC_INVPRT WHERE PRT_Rowid=226435

SELECT * FROM DHC_INVOEItemAuthorize

//申请部位表
SELECT * FROM DHC_AppRepPart

//医嘱扩展表
SELECT * FROM DHC_OE_OrdItem WHERE DHCORI_OEORI_Dr='1698||15'

//医嘱表
SELECT * FROM OE_Orditem

//门诊退药申请子表
SELECT * FROM dhc_phreqitem

SELECT * FROM DHC_PHREQUEST

SELECT * FROM dhc_phreqcode

//门诊退费数量表
SELECT * FROM DHC_OERefundQty

SELECT * FROM PA_Person

//发票审核表
SELECT * FROM DHC_INVOEItemAuthorize


SELECT PRT_IOA_ParRef FROM DHC_INVOEItemAuthorize

SELECT * FROM PA_PatMas 


SELECT * FROM DHC_CardRef