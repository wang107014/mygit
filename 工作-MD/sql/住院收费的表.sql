//סԺ�շ�
//�˵�����
SELECT * FROM dhc_patientbill

//����ҽ��������ϸ��
SELECT  * FROM dhc_patbillorder WHERE PBO_PB_ParRef="266326"

//ҽ����ָ��
SELECT * FROM ARC_ItmMast

//���˾�����Ϣ��
SELECT * FROM PA_ADM

//���˱�
SELECT * FROM PA_PatMas

//����ҽ��ָ��
SELECT OEORI_ItmMast_DR->ARCIM_Desc,* FROM OE_OrdItem

//�˵��շ���Ŀ��ϸ��
SELECT * FROM dhc_patbilldetails

//סԺ��Ʊ��
SELECT PRT_Adm->PAADM_PAPMI_DR->PAPMI_Name, * FROM dhc_invprtzy

//�����
SELECT PAADM_PAPMI_DR->PAPMI_Name, * FROM pa_adm

//���˱�
SELECT * FROM PA_Patmas







