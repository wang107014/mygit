
//���˻�����Ϣ��
SELECT * FROM PA_PatMas WHERE PAPMI_No='101100000080'

//���˾�����Ϣ��
SELECT * FROM PA_Adm WHERE (PAADM_PAPMI_DR=96 AND PAADM_Type="I") 

//ҽ����
SELECT * FROM OE_Order WHERE OEORD_Adm_DR=935

//ҽ����
SELECT OEORI_ItmMast_DR->ARCIM_Desc,* FROM OE_OrdItem WHERE OEORI_OEORD_ParRef=877

//ҽ�����
SELECT * FROM ARC_ItmMast WHERE ARCIM_RowId IN ('6873||1')

//ҽ��ִ�б�
SELECT OEORE_OEORI_ParRef->OEORI_ItmMast_DR->ARCIM_Desc,* FROM OE_OrdExec WHERE OEORE_OEORI_ParRef IN ('877||1','877||2','877||3')

//ҽ��ִ����չ��
SELECT * FROM OE_OrdExecExt WHERE OEORE_OEORI_ParRef IN ('763||1','763||2')



