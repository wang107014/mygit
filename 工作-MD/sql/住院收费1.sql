
//���˱�
SELECT * FROM PA_PatMas WHERE PAPMI_No="101100000436"

//�����
SELECT PAADM_PAPMI_DR->PAPMI_Name, * FROM PA_Adm WHERE PAADM_PAPMI_DR="478"

//�˵�����
SELECT  * FROM DHC_PatientBill WHERE PB_Adm_Dr="979"

//�˵��շ���Ŀ��ϸ��
SELECT * FROM dhc_patbilldetails WHERE PBD_TARI_DR="2163"

//����ҽ��������ϸ��
SELECT * FROM dhc_patbillorder WHERE PBO_PB_ParRef="267778"

//����ҽ��
SELECT OEORI_ItmMast_DR->ARCIM_Desc,* FROM OE_OrdItem WHERE OEORI_OEORD_ParRef="478"

//ҽ����
SELECT * FROM ARC_ItmMast

//סԺ��Ʊ��
SELECT * FROM dhc_invprtzy WHERE PRT_Adm="565"

//�շ�Ա�ձ������
SELECT * FROM dhc_jfuserjk

//סԺ����
SELECT * FROM dhc_warrant

//������Ϣ�޸ı�
SELECT * FROM dhc_jfupreport

//Ӧ�տ�����������
SELECT * FROM dhc_jffeeacount

//֧Ʊ���ʱ�
SELECT * FROM dhc_jfbankback

//��ɫͨ�������
SELECT * FROM PAC_AdmCategory

//�շ���Ŀ�ӷ���
SELECT * FROM DHC_TarSubCate

//�շ���ĿסԺ����
SELECT * FROM DHC_TarIC

//�շ���Ŀ�����ӷ���
SELECT * FROM DHC_TarOutpatCate

//������Ŀ��
SELECT * FROM DHC_TarItem

//������Ŀ�۸��
SELECT TP_PatInsType->REA_Desc, TP_TARI_ParRef->TARI_Desc, * FROM DHC_TarItemPrice

//���˱�������
SELECT * FROM PAC_AdmReason


SELECT * FROM dhc_orderlinktar

SELECT * FROM dhc_invprt

//��������λ��
SELECT CTLOC_Floor,* FROM CT_Loc WHERE CTLOC_Desc ['�ڷ���'

//
SELECT * FROM DHCRegistrationFee

SELECT * FROM DHC_RBApptSchedule WHERE AS_RowId='7||53'

//ҽ��01�Ű�
SELECT * FROM DHC_RBApptSchedule WHERE AS_RowId='221||90'

SELECT * FROM RB_ApptSchedule