
//�ж�ҽ���Ƿ����ɹ�
//ҽ������״̬������ɹ�ΪP�����˵���δ����ΪB��δ�˵�ΪTB
SELECT OEORI_Billed, * FROM OE_OrdItem WHERE OEORI_OEORD_ParRef='149519'

//ҽ����
SELECT * FROM oe_order WHERE OEORD_RowId1='149519'

//�����
SELECT PAADM_VisitStatus, * FROM PA_Adm WHERE PAADM_RowID='160856'

//������Ϣ��
SELECT * FROM PA_Person WHERE PAPER_RowId='3238'


//�˵��������ݾ���id�����˵���¼
SELECT * FROM DHC_PatientBill WHERE PB_Adm_Dr='160856'

//�˵�ҽ���������˵������Rowid�����˵�ҽ����ϸ��Ϣ
SELECT * FROM DHC_PatBillOrder WHERE PBO_PB_ParRef='420907'

//�˵���ϸ�������˵�ҽ����Rowid�����˵���ϸ
SELECT * FROM DHC_PatBillDetails WHERE PBD_PBO_ParRef='420908||1'

//ҽ����������˵�ҽ�������ҽ��������ϸҽ��
SELECT * FROM ARC_ItmMast WHERE ARCIM_RowId='19352||1'




SELECT * FROM DHC_OPGroupSettings