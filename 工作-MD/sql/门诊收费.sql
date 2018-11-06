
//判断医嘱是否结算成功
//医嘱结算状态，结算成功为P，已账单但未结算为B，未账单为TB
SELECT OEORI_Billed, * FROM OE_OrdItem WHERE OEORI_OEORD_ParRef='149519'

//医嘱表
SELECT * FROM oe_order WHERE OEORD_RowId1='149519'

//就诊表
SELECT PAADM_VisitStatus, * FROM PA_Adm WHERE PAADM_RowID='160856'

//病人信息表
SELECT * FROM PA_Person WHERE PAPER_RowId='3238'


//账单主表：根据就诊id查找账单记录
SELECT * FROM DHC_PatientBill WHERE PB_Adm_Dr='160856'

//账单医嘱表：根据账单主表的Rowid查找账单医嘱详细信息
SELECT * FROM DHC_PatBillOrder WHERE PBO_PB_ParRef='420907'

//账单明细表：根据账单医嘱的Rowid查找账单明细
SELECT * FROM DHC_PatBillDetails WHERE PBD_PBO_ParRef='420908||1'

//医嘱项表：根据账单医嘱表查找医嘱项表的详细医嘱
SELECT * FROM ARC_ItmMast WHERE ARCIM_RowId='19352||1'




SELECT * FROM DHC_OPGroupSettings