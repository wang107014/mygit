#如何查找数据？
1、zn "dhc-data"
2、d ^%msql
3、输入账号_system 密码：SYS

进入基础表界面查询
1、先通过表去找它的子索引，把它的global结构找到。
 
2、找到global的层次结构，再去找它的字段的上箭头位置有没有附加节点


    set SetDr = $p(^CT("SEX",SetDr),"^",2)

#获取rowid为3的就诊（PA_Adm)的病人（PA_PatMas)的性别描述。
1、首先找到PA_Adm就诊表，根据AdmRowId找到它的global的值

2、找到该表中病人字段的值。

3、根据病人字段的值找到病人表中的global的值

4、找到病人表中的性别字段的值。

5、根据性别字段的值，找到性别表的global的值。

6、找到性别表中的描述字段。

7、输出它的性别描述。


	ClassMethod GetPAAdmSexDesc(AdmRowId)
    {
		Set AdmStr =  ^PAADM(AdmRowId)  /// 拿到就诊表global的值
		Set PapmiDr = $p(AdmStr,"^",1)  /// 拿到病人字段的值
		Set PapmiStr = ^PAPER(PapmiDr,"ALL")   /// 拿到病人表的global的值
		Set SexDr = $P(PapmiStr,"^",7)   ///拿到病人的性别字段的值
		Set SexStr = ^CT("SEX",SexDr)    ///拿到性别表的global的值
		Set SexDesc = $p(SexStr,"^",2)   ///拿到性别描述字段的值
		Quit SexDesc    ///输出性别描述。
    }

8、使用sql语句查性别描述。

    selcet PAADM_PAPMI_DR->PAPMI_Sex_DR->CTSEX_DEsc,* from pa_adm where paadm_rowid=3



#如何创建实体类？
1、建持久类的表，默认持久类，改成显示类。如：

    Class wml.DHCWangMingLong Extends %Persistent [ ClassType = persistent, SqlTableName = DHC_WangMingLong ]{

    }

2、创建属性,如下:

    Property TestCode As %String;
    Property TestAddUser As User.SSUser;//指向某个表

3、把字段名使用下划线表示：

    Property TestCode As %String [ SqlFieldName = Test_Code ];

4、修改rowId的字段名。

    inspector-->SqlRowIdName-->rowId的字段名

5、字段列表结构的位置SqlColumnNumber,从2开始,1为rowid的：

    Property TestCode As %String [ SqlFieldName = Test_Code,SqlColumnNumber = 2 ];

6、数据存在global里面，所以global结构在哪里？

    inspector-->storage-->DataLocation-->global的位置

7、如何重新定义一个新的global？
7.1、删除原来的storage。

7.2、新建一个storage,设置Map Name(DataMap)和Global Name(^DHCWANGMINGLONG)和Population Type(nonnull)。

7.3、设置subscripts下标,为了方便不需要区分，第一个节点设为RowId的字段名。

7.4、设置RowId,指定7.3设置的字段的层级，指定它是在哪一层位置如{L1}。

7.5、设置Data,那是字段的位置。

8、插入时出现的问题
    
    //表示插入数据时没有指定rowId的增长
    >%SQLInsert+13^wml.DHCWangMingLong.1 *%d(1)'>]

9、如何指定rowId的表达式:
   ^mdata:mdata类型的global。
   ^mdata(表名)
   $I自增

    inspector-->Storage-->SqlIdExpression-->$I(^mdata("DHCWangMingLong"))

10、如何从Terminal查找新建的数据？   
    ZW global的名字
   
    DHC-APP>zw ^DHCWANGMINGLONG
    ^DHCWANGMINGLONG(2)="wang^王明龙^57960^73080^0"


#M基础知识
##一、时间
1、$h包含了日期和时间。

    DHC-APP>w $h
    64746,33566
2、$zd转换成日期格式

	DHC-APP>w $zd($h,1)
	04/08/2018
	DHC-APP>w $zd($h,2)
	08 Apr 2018
	DHC-APP>w $zd($h,3)
	2018-04-08
	DHC-APP>w $zd($p($h,",",1),3)
	2018-04-08

3、$zdh反转换日期格式

	DHC-APP>w $zdh("2018-04-12",3)
	64750

4、$zt转换时分秒

	DHC-APP>w $zt(33566)
	09:19:26

5、$zth反转换时分秒

    DHC-APP>w $zth("23:59:59")
    86399

6、$zts含有时间和时间（精确到秒）

	DHC-APP>w $zts
	64746,5744.172

##二、基本运算符
1、算术运算符+、-、*、/、\、#、**（加、减、乘、除、整除、求余、次方）

	DHC-APP>w 4+2
	6
	DHC-APP>w 5-3
	2
	DHC-APP>w 5*2
	10
	DHC-APP>w 6/3
	2
	DHC-APP>w 5\3
	1
	DHC-APP>w 5#2
	1
	DHC-APP>w 7#5
	2
	DHC-APP>w 2**3
	8
    DHC-APP>w 2+5*3  //从左到右依次运算
	21
	DHC-APP>w 2+(5*3)
	17

2、算术比较运算符<、>(大于、小于)，true返回1，false返回0

	DHC-APP>w 3>2
	1
	DHC-APP>w 3<2
	0

3、字符串比较运算符=、[、] (等于、包含)

	DHC-APP>if (1=1) w 1   //等于
	1
	DHC-APP>if (1'=0) w 1  //不等于
	1
    //包含
    DHC-APP>s a = "abcd"
	DHC-APP>s b = "cd"
	DHC-APP>w a[b
	1
	DHC-APP>w b[a
	0
	DHC-APP>w a]b
	0
	DHC-APP>w b]a
	1

4、连接符_

	DHC-APP>s a="abcd"
	 
	DHC-APP>s b="efg"
	 
	DHC-APP>w a_b
	abcdefg
    
5、&、！、'(与、或、非)

	DHC-APP>if a=a w 1
	1
	DHC-APP>if 1&&1 w 1
	1
	DHC-APP>if 1||1 w 1
	1
	DHC-APP>if 1||0 w 1
	1
	DHC-APP>if 1'=0 w 1
	1
6、$fn 取小数位，也可以四舍五入

	DHC-APP>w $fn(1.226,"",2)
	 1.23

##三、常见的命令
1、set给一个或多个变量赋值

	DHC-APP>s x=5,n(1)=2,dd=5
	 
	DHC-APP>w x
	5
	DHC-APP>zw x
	x=5
	 
	DHC-APP>w
	 
	a="abcd"
	b="efg"
	dd=5
	n(1)=2
	x=5

2、merge拷贝变量数

	DHC-APP>s n(1)=1
	 
	DHC-APP>s n(2)=2
	 
	DHC-APP>s n(2,1)=21
	 
	DHC-APP>s n(2,2)=22
	 
	DHC-APP>zw n
	n(1)=1
	n(2)=2
	n(2,1)=21
	n(2,2)=22

    //整体拷贝
	DHC-APP>m c=n 
	DHC-APP>zw c
	c(1)=1
	c(2)=2
	c(2,1)=21
	c(2,2)=22

    //部分拷贝
    DHC-APP>m d=c(2)
    DHC-APP>zw d
	d=2
	d(1)=21
	d(2)=22

3、new初始化变量
  new a,b
  new (x1,y2) 初始化除了x1,y2之外的变量

4、生成索引命令

    d ##class(wml.DHCWangMingLong).%BuildIndices()

5、生成大写命令 $$ALPHAUP^SSUTIL4()

	DHC-APP>w $$ALPHAUP^SSUTIL4("sdkjf")
	SDKJF

##四、程序流程控制命令

if 条件判断语句  
else(e) 当判断条件不通过时,执行后面的命令  
for(f) 循环命令  
quit(q) 结束执行一个函数并返回一个值  
do(d) 执行命令  
goto(g) 跳转命令   
break(b) 在跳转的时候中断一个routine的执行  
write(w) 输出信息到当前设备  
read(r) 从当前的设备读信息  
open(o) 开启一个设备以备使用   

例如：Test2018.mac
	Test2018.mac
	
	 ;d Sum^Test2018(2,3)
	 //w $$Sum^Test2018(2,3)
	 /*w $$Sum^Test2018(2,3)*/
	Sum(a,b)
	read "输入数字>",a,!
	read "输入数字>",b,!
 	Quit a+b
    
    DHC-APP>w $$Sum^Test2018()
	输入数字>10
	输入数字>34
	44
  
##五、常用函数
1、$Piece($p)
格式：$Piece(expression,delimiter[,from[,to]])  
返回一个或多个被分隔符分开的子串

	DHC-APP>s a="1^2^3^4"
	 
	DHC-APP>w $p(a,"^",1)
	1
	DHC-APP>w $p(a,"^",2)
	2
	DHC-APP>w $p(a,"^",1,4)
	1^2^3^4
	DHC-APP>w $p(a,"^",2,4)
	2^3^4

2、$get($g)
返回一个变量的值，如果变量存在则返回变量本身，不存在则返回空。


	DHC-APP>w $g(a)
	1^2^3^4
	DHC-APP>w $g(c)
	 
3、$data($d)是一个节点的判断，判断变量是否存在。
   
    DHC-APP>s n(1)=1
 
	DHC-APP>s n(1,1)=1
	 
	DHC-APP>w $d(n(2))  //n(2)节点不存在返回0
	0
	DHC-APP>w $d(n(1))  //n(1)存在有值，并且子节点存在有值返回11
	11
	DHC-APP>w $d(n(1,1)) //n(1,1)存在有值返回1
	1
    DHC-APP>k n(1)
 
	DHC-APP>zw n
	 
	DHC-APP>s n(1,2)=12
	 
	DHC-APP>w $d(n(1))  //n(1)没有值，但是存在子节点且有值
	10

4、$extract($e)返回字符串的指定部分

    DHC-APP>w $e("abcd",2,3) //从第二个位置开始取3个
    bcd   

5、$justify($j)返回一个右对齐的值，并可以改变它的格式。

	DHC-APP>w $j("abcde",5)
	abcde
	DHC-APP>w $j("abcde",6)
 	 abcde
   	$ JOB($j)包含当前进程的ID号。此ID号是主机操作系统的实际进程ID（pid）。此ID号对于每个进程都是唯一的。

6、$Length($L)返回字符串的长度，或者是被分隔符的子串个数。

	DHC-APP>w $l("abcd")
	4
	DHC-APP>w $l("a/b/c/d/e/f","/")
	6

7、$Translate($tr)字符串替换和$zcvt(str,"U")字符串换成大写

	DHC-APP>w $tr("ABCDEFGAB","A","a")
	aBCDEFGaB
	DHC-APP>w $tr("ABCDEFGAB","A","b")
	bBCDEFGbB
    DHC-APP>w $zcvt("abcd","U")
    ABCD

    DHC-APP>w $zcvt("<TAG>","O","HTML") //按照html格式输出。
    &lt;TAG&gt;  //  <转换为&lt;  >转换为&gt;

8、$Order($O)按照指定的方向返回一个变量的上一个或下一个索引。

	DHC-APP>S n("code","A",3)=""
	 
	DHC-APP>s n("code","C",4)=""
	 
	DHC-APP>s n("code","M",5)=""
	 
	DHC-APP>w $o(n("code","A"))  //A的下一个索引
	C
	DHC-APP>w $o(n("code","C"))
	M
	DHC-APP>w $o(n("code","C"),-1)  //C的上一个索引
	A
    DHC-APP>w $o(n("code","A",""))  //A的下一个节点
    3  

#编写简单的M程序
1、for循环

	/// 三种for循环
	ClassMethod ForTest()
	{
		Set Count = 10
	For i=1:2:Count d   //必须有d, 不然不会执行
	.w i  //w之前必须有. 不然只会输出最后一个数据
	w ! //换行
	
	set i = 0
	for {
		set i = i+1
		quit:(i>Count)  //当i>Count时结束执行函数
		w i
		}
	w !
	
	set i = 1
	while(i<(Count+1)){
		w i
		set i = i+1
		}
	}

    ///验证类方法
	DHC-APP>d ##class(wml.test).ForTest()
	13579
	12345678910
	12345678910


2、验证class的方法和mac的方法。

    ///验证clss类方法
	DHC-APP>d ##class(wml.test).ForTest()
	13579
	12345678910
	12345678910
    
    ///验证mac的方法
    注释类型如下
    ;d Sum^Test2018()
    //w $$Sum^Test2018()
    /*w $$Sum^Test2018()*/
	Sum()    //mac的方法
	 read "输入数字>",a,!
	 read "输入数字>",b,!
     Quit a+b
 
    DHC-APP>d Sum^Test2018()  //只执行没有把结果显示出来
	输入数字>2
	输入数字>4
	 
    DHC-APP>W $$Sum^Test2018()  //w执行方法，并把结果输出到当前设备
	输入数字>6
	输入数字>7
	13



#表的增、删、查、改
##1、表的新增数据（三种方法）

	/// 插入数据
	/// w ##class(wmlweb.DHCWangMingLong).Insert("453446","王维","2018-05-18","20:10:23","6")
	ClassMethod Insert(Code, Desc, AddDate, AddTime, AddUser)
	{
		Set AddDate = $zdh(AddDate,3) //转换日期
		Set AddTime = $zth(AddTime)  //转换时间
		&sql(
		  insert into dhc_wangminglong(Test_Code,Test_Desc,Test_AddDate,Test_AddTime,Test_AddUser)
		  values(:Code,:Desc,:AddDate,:AddTime,:AddUser))
		  if SQLCODE=0{
			  quit "插入成功^"_%ROWID
		  }else{
			  quit "插入失败"
			  }
	}
	
	/// 插入数据(plist形式)
	/// w ##class(wmlweb.DHCWangMingLong).InsertPlist("56789","李白","2018-10-20","21:20:30","345")
	ClassMethod InsertPlist(Code, Desc, AddDate, AddTime, AddUser)
	{
		Set AddDate = $zdh(AddDate,3) //转换日期
		Set AddTime = $zth(AddTime)  //转换时间
		Set PLIST(2) = Code
		Set PLIST(3) = Desc
		Set PLIST(4) = AddDate
		Set PLIST(5) = AddTime
		Set PLIST(6) = AddUser
		&sql(
		  insert into dhc_wangminglong values :PLIST()
		  )
		  if SQLCODE=0{
			  quit "插入成功^"_%ROWID
		  }else{
			  quit "插入失败"
			  }
	}

	/// 对象插入数据
	/// w ##class(wmlweb.DHCWangMingLong).InsertByObj("1014","anyang","2014-11-13","14:34:15","1")
	ClassMethod InsertByObj(Code, Desc, AddDate, AddTime, SetDr)
	{
		;初始化对象,新建对象
		set obj = ##class(wml.DHCWangMingLong).%New()
		;为属性赋值
		set obj.TestCode= Code
		set obj.TestDesc= Desc
		set obj.TestAddDate= $zdh(AddDate,3)
		set obj.TestAddTime= $zth(AddTime)
		do obj.TestSetDrSetObjectId(SetDr) //把Id插入到对象的字段中,不需要重建一个对象
		;set obj.TestSetDr = ##class(User.CTSex).%OpenId(SetDr)  //重新建立一个对象
		;b //断点
		;持久化对象
		set sc = obj.%Save()
		do obj.%Close()
		set obj = ""
		if $$$ISERR(sc){
			quit "插入错误"
		}else{
			quit "插入成功"	
			}
	}
		

##2、表的删除数据

	/// 删除数据
	/// w ##class(wmlweb.DHCWangMingLong).Delete(12)
	ClassMethod Delete(RowId)
	{
		&sql(
		   delete from dhc_wangminglong where test_rowid = :RowId
		)
		if SQLCODE=0{
			quit "删除成功^"_%ROWID
			}else{
			quit "删除失败"	
			}
	}


	/// 根据对象删除数据
	/// w ##class(wmlweb.DHCWangMingLong).DeleteByObj(21)
	ClassMethod DeleteByObj(Id)
	{
		;初始化对象,根据id删除对象
		set sc = ##class(wml.DHCWangMingLong).%DeleteId(Id)
		if $$$ISERR(sc){
			quit "删除错误"_$$$ISERR(sc)
		}else{
			quit "删除成功"_$$$ISERR(sc)	
			}
	}

##3、表的修改数据（三种方法）

	/// 修改数据
	/// w ##class(wmlweb.DHCWangMingLong).Update(8,"56789","李白","2018-10-20","21:20:30","345")
	ClassMethod Update(RowId, Code, Desc, AddDate, AddTime, AddUser)
	{
		Set AddDate = $zdh(AddDate,3)
		Set AddTime = $zth(AddTime)
		&sql(
		   update dhc_wangminglong
		   set test_code = :Code,
		   test_desc = :Desc,
		   test_adddate = :AddDate,
		   test_addtime = :AddTime,
		   test_adduser = :AddUser
		   where test_rowid = :RowId
		)
		if SQLCODE=0{
			quit "更新成功^"_%ROWID
			}else{
			quit "更新失败"	
			}
	}
	
	/// 修改数据(plist形式)
	/// w ##class(wmlweb.DHCWangMingLong).UpdatePlist(9,"24324","杜甫","2018-03-22","12:34:30","755")
	ClassMethod UpdatePlist(RowId, Code, Desc, AddDate, AddTime, AddUser)
	{
		Set AddDate = $zdh(AddDate,3)
		Set AddTime = $zth(AddTime)
		Set PLIST(2) = Code
		Set PLIST(3) = Desc
		Set PLIST(4) = AddDate
		Set PLIST(5) = AddTime
		Set PLIST(6) = AddUser
		&sql(
		   update dhc_wangminglong values :PLIST()
		   where test_rowid = :RowId
		)
		if SQLCODE=0{
			quit "更新成功^"_%ROWID
			}else{
			quit "更新失败"	
			}
	}

	/// 对象修改数据
	/// w ##class(wmlweb.DHCWangMingLong).UpdateByObj(24,"1013","yangzhi","2013-11-13","12:24:13","2")
	ClassMethod UpdateByObj(Id, Code, Desc, AddDate, AddTime, SetDr)
	{
		;初始化对象,根据id打开对象
		; %OpenId的运行过程：根据Id,Open一个对象,则先要序列化成一个对象
		;1、首先到包里面找到相应的表
		;2、去查表对应id哪行的数据
		;3、把查到的数据和属性进行组合,然后生成一个对象
		set obj = ##class(wml.DHCWangMingLong).%OpenId(Id)
		;为属性赋值
		set obj.TestCode= Code
		set obj.TestDesc= Desc
		set obj.TestAddDate= $zdh(AddDate,3)
		set obj.TestAddTime= $zth(AddTime)
		do obj.TestSetDrSetObjectId(SetDr) //把Id插入到对象的字段中,不需要重建一个对象
		;set obj.TestSetDr = ##class(User.CTSex).%OpenId(SetDr)  //重新建立一个对象
		;b //断点
		;持久化对象
		set sc = obj.%Save()  //保存成功返回1,否则返回0
		w sc,!  
		do obj.%Close()
		set obj = ""
		if $$$ISERR(sc){
			quit "修改错误"_$$$ISERR(sc)
		}else{
			quit "修改成功"_$$$ISERR(sc)	
			}
	}


##4、根据RowId查找数据(或索引查询)

	/// 根据RowId查找数据
	/// d ##class(wmlweb.DHCWangMingLong).FindAllBySql(10)
	ClassMethod FindAllBySql(RowId)
	{
		
		&sql(
		   select test_code,test_desc into :code,:desc from dhc_wangminglong 
		   where test_rowid = :RowId
		)
		w code_"^"_desc,!
		&sql(
	        select * into :PLIST() from dhc_wangminglong where test_rowid = :RowId
		)
		zw PLIST
	}

##5、查找列表数据

	/// 查找列表数据
	/// w ##class(wmlweb.DHCWangMingLong).FindAll()
	ClassMethod FindAll()
	{
		Set RowId = 0
		For  Set RowId = $o(^DHCWANGMINGLONG(RowId)) Quit:RowId=""  d
		.Set g = ^DHCWANGMINGLONG(RowId)
		.set Code = $p(g,"^",1)
		.set Desc = $p(g,"^",2)
		.set AddDate = $p(g,"^",3)
		.set Date = $zd(AddDate,3) //转换日期
		.set AddTime = $p(g,"^",4)
		.set time = $zt(AddTime)   //转换时间
		.set AddUser = $p(g,"^",5)
		.write Code_":"_Desc_":"_Date_":"_time_":"_AddUser,!
	}


##6、当参数不为空时查找相应的信息，当参数为空时查找所有的信息

	/// d ##class(wmlweb.DHCWangMingLong).FindByDesc("")
	/// 当参数不为空时查找相应的信息，当参数为空时查找所有的信息
	ClassMethod FindByDesc(StDesc)
	{
		Set RowId = 0
		For  Set RowId =$o(^DHCWANGMINGLONG(RowId)) quit:RowId=""  d  //当RowId为""时停止执行函数
		.Set g = ^DHCWANGMINGLONG(RowId)
		.set Code = $p(g,"^",1)
		.set Desc = $p(g,"^",2)
		.quit:(StDesc'=Desc)&&(StDesc'="")  //当表达式为真时停止执行
		.set AddDate = $p(g,"^",3)
		.set Date = $zd(AddDate,3) //转换日期
		.set AddTime = $p(g,"^",4)
		.set time = $zt(AddTime)   //转换时间
		.set AddUser = $p(g,"^",5)
		.write Code_":"_Desc_":"_Date_":"_time_":"_AddUser,!
	}

#如何建立索引查询？
1、在实体表建立索引：
 
    inspector-->Storage-->add(设置Map name、MapType、Global Name、Population Type分别为：字段Map、index、global名、nonnull)

2、在Subscripts设立节点(如字段为Test_Code)
    
    add-->0
    add-->"code"
    add-->{Test_Code}
    add-->{Test_RowId}

3、在RowID设立RowId的层级

    add-->Test_RowId-->{L4}


4、根据索引查询列表信息

	/// 建立Code字段为索引来查找信息
	/// d ##class(wmlweb.DHCWangMingLong).FindByCodeIndex("56789")
	ClassMethod FindByCodeIndex(StCode)
	{
		quit:StCode="" 0
		set RowId = $o(^DHCWANGMINGLONGi(0,"Code",StCode,"")) //StCode值的下一个节点的第一索引
		Set g = ^DHCWANGMINGLONG(RowId)
		set Code = $p(g,"^",1)
		set Desc = $p(g,"^",2)
		set AddDate = $p(g,"^",3)
		set Date = $zd(AddDate,3) //转换日期
		set AddTime = $p(g,"^",4)
		set time = $zt(AddTime)   //转换时间
		set AddUser = $p(g,"^",5)
		write Code_":"_Desc_":"_Date_":"_time_":"_AddUser,!
	}

5、匹配开头查询

	/// d ##class(wmlweb.DHCWangMingLong).FindByPreDesc("王")
	/// 匹配开头查询
	ClassMethod FindByPreDesc(StDesc)
	{
		quit:StDesc="" 0   //当参数为空时停止执行放回0
		
		set StDesc =  $$ALPHAUP^SSUTIL4(StDesc)   //把传入参数转换为大写
		
		set Len = $l(StDesc)   //查找字符串的长度
		
		set DescInd = $o(^DHCWANGMINGLONGi(0,"Desc",StDesc),-1) //查找参数所在层级的上一个索引
		;w DescInd,!
		;先找出DescInd层级的下一个索引赋值给DescInd,再判断DescInd为空或参数和DescInd的指定不相等则停止执行函数
		For  set DescInd = $o(^DHCWANGMINGLONGi(0,"Desc",DescInd)) quit:(DescInd="")||(StDesc'=$e(DescInd,1,Len))  d
		.set RowId = $o(^DHCWANGMINGLONGi(0,"Desc",DescInd,""))   
		.Set g = ^DHCWANGMINGLONG(RowId)
		.set Code = $p(g,"^",1)
		.set Desc = $p(g,"^",2)
		.set AddDate = $p(g,"^",3)
		.set Date = $zd(AddDate,3) //转换日期
		.set AddTime = $p(g,"^",4)
		.set time = $zt(AddTime)   //转换时间
		.set AddUser = $p(g,"^",5)
		.write Code_":"_Desc_":"_Date_":"_time_":"_AddUser,!
	}


#<font color=red>2018-04-09 星期一 晴</font>

#一、面向对象开发

##1、对象
1、对象模型：  
继承、属性、方法、集合、关系、用户定义的数据类型和流。   

继承：

    ///Extends继承,persistent持久性
    Class wml.DHCWangMingLong Extends %Persistent[ClassType = persistent]

    //多继承时,父类有相同的方法,如何设定它的优先级？ 
    inspector-->inheritance--left(right)
属性：

    Property name As %String;

方法：   
对象可以调用类方法（ClassMethod）和成员方法（Method）,
类（class）只能调用类方法（ClassMethod）,不能调用成员方法（Method）。

	// 类方法
	ClassMethod GetName(id)
	{
		q "get name"
	}
	
	// 成员方法，对某一个对象可以调用的
	Method GetObjName()
	{
		;都可以调用自身对象的属性
		;q i%name
		;q %this.name
		q $this.name
	}
	
	// 测试
	ClassMethod Test()
	{
		set animalObj = ##class(wmlweb.DHCAnimal).%New() //初始化对象
		set animalObj.name = "liu"  //给对象属性赋值
		w animalObj.GetObjName() //对象可以调用类方法和成员方法
	}


2、断点查询对象。


	DHC-APP>w ##class(wmlweb.DHCWangMingLong).InsertByObj("1014","anyang","2014-11-13","14:34:15","1")
	 
	 b
	 ^
	<BREAK>zInsertByObj+9^wmlweb.DHCWangMingLong.1

	DHC-APP 2e1>d $system.OBJ.Dump()
	Dump(): 需要对象引用

    DHC-APP 2e1>d $system.OBJ.ShowObjects()
	Oref      Class Name                    Ref Count
	----      ----------                    ---------
	1         wml.DHCWangMingLong           1
	2         User.CTSex                    3


3、如何把属性转换为xml形式？

	1、首先要继承XML.Adaptor
	Class wmlweb.DHCAnimal Extends (%RegisteredObject, %XML.Adaptor)
	{
		Property name As %String;
		
		Property color As %String;
    }

    2、do dogObj.XMLExportToString(.xml)
	Class wmlweb.DHCDog Extends wmlweb.DHCAnimal
	{
		ClassMethod Test()
		{
			set dogObj = ##class(wmlweb.DHCDog).%New() //初始化对象
			set dogObj.name = "大狗"  //给对象属性赋值
			set dogObj.color = "黑白相间"
			do dogObj.XMLExportToString(.xml)
			w xml
            do dogObj.%Close() //关闭对象
			set dogObj = ""
			quit
		}
	}

    3、验证xml形式
    DHC-APP>d ##class(wmlweb.DHCDog).Test()
    <DHCDog><name>大狗</name><color>黑白相间</color></DHCDog>

#<font color=red>2018-04-10 星期二 晴</font>

#父子表
##一、如何建父子表（//注释的内容是需要改的）？
1、在建好父表中加以下信息
    
    //ChildWmlCourse是子表中需要反转的
    //wml.DHCWmlCourse是子表的类名
    //WmlParRef是子表中需要关联的  
    Relationship ChildWmlCourse As wml.DHCWmlCourse [ Cardinality = children, Inverse = WmlParRef ];

2、在建好的子表中加入以下信息

    
    //WmlParRef是父表中需要反转的
    //wml.DHCWangMingLong是父表的类名
    //ChildWmlCourse是父表中需要关联的
    //DHC_Wml_ParRef是字段名
    Relationship WmlParRef As wml.DHCWangMingLong [ Cardinality = parent, Inverse = ChildWmlCourse, Required, SqlFieldName = DHC_Wml_ParRef ];

    
    //DHCChildsub是子表的增量，自增形式
    //^DHCWANGMINGLONG是父表的global名
    //DHC_Childsub
    //"C"可以写自己需要的节点
	Property DHCChildsub As %Numeric(SCALE = 0) [ InitialExpression = {$i(^DHCWANGMINGLONG($p($s($d(initvalue):initvalue,1:%d(0)),$c(1),1),"C",0))}, Required, SqlColumnNumber = 2, SqlFieldName = DHC_Childsub ];

    //DHCCildsub是下面定义的一个属性
    Index RowIDBasedIDKeyIndex On DHCChildsub [ IdKey, PrimaryKey, Unique ];

3、在子表中设置新的Storage

	1、global的名字和父表的global名一样。（Map Type、Population Type分别为data、nonull）
	
    2、在data层给字段排序

	3、在Subscripts上设节点层级：首先设父表的RowId,接着设在DHCChildsub上设置的节点如"C",最后设子表的增量如"DHC_Childsub"。 形式如下：
	    1    {DHC_WangMingLong.Test_RowId}  //父表的RowId
	    2    "C"      //自己需要的节点
        3     {DHC_Childsub}  //子表的增量
    
     4、在RowId上设置父表的RowId和增量的层级。形式如下：
        1     DHC_WangMingLong.Test_RowId    {L1}
        2     DHC_Childsub                   {L3}
   
4、如何在子表中建立某个字段的索引？（index型无data层设置）

    1、在新建的Storage中Add一个Map，
    设置Map name,Map Type为index类型的,
    接着设置你的Global Name(最好用父表的global名加个字母来表示如^DHCWANGMINGLONGi)
    
    2、在Subscripts上设立层级节点。假如以DHC_CourseDr字段建立索引。父表的RowId和子表的增量Childsub必须要的。具体形式如下：
       1      0
       2      "Course"
       3      {DHC_CourseDr}
       4      {DHC_WangMingLong.Test_RowId}
       5      {DHC_Childsub}

    3、在RowId上设置父表的RowId和增量的层级。形式如下：
        1     DHC_WangMingLong.Test_RowId    {L4}
        2     DHC_Childsub                   {L5}


##二、父子表查询
###1、首先建立一个注册类型的class类

	Class wmlweb.DHCWmlCourse Extends %RegisteredObject{
       类方法...
      }

###2、查询学生选了那些课程，且显示相应的分数?   
分析思路：  
1、知道学生名,需要找出课程和分数   
2、如何找出课程？   
2.1、找出课程表的global,如：
	
    DHC-APP>zw ^DHCCOURSE
	^DHCCOURSE(1)="Chinese^语文"
	^DHCCOURSE(2)="Math^数学"
	^DHCCOURSE(3)="Physics^物理"

2.2、想找出课程名，需要找出课程RowId条件

    DHC-APP>w $p(^DHCCOURSE(1),"^",2)
    语文

2.3、想找出课程RowId,需要先找出子表的global的信息,如：

     DHC-APP>zw ^DHCWANGMINGLONG
     ^DHCWANGMINGLONG(16,"C",0)=6
	 ^DHCWANGMINGLONG(16,"C",4)="1^62"
	 ^DHCWANGMINGLONG(16,"C",5)="2^80"
	 ^DHCWANGMINGLONG(16,"C",6)="3^59"
     
     DHC-APP>zw $p(^DHCWANGMINGLONG(16,"C",5),"^",1)
     2

2.4、想要找出子表的global的信息，需要找出学生的RowId条件和子表的增量条件,因为增量不同，因此需要循环出所有的增量，如：

    set Sub = 0
	For  set Sub = $o(^DHCWANGMINGLONG(RowId,"C",Sub)) quit:Sub=""  d

2.5、想要循环出所有的增量，需要学生的RowId条件。

    set RowId = $o(^DHCWANGMINGLONGi(0,"Desc",StDesc,""))

2.6、想要找出学生的RowId，需要知道学生的名字，而名字就是传入参数，所以是知道的条件。因此可以找出改学生的课程名。

3、如何找出课程的分数？
3.1、因为子表的global的信息中包含有课程的分数，因此需要找出子表的global的信息。如：
   
	 DHC-APP>zw ^DHCWANGMINGLONG
     ^DHCWANGMINGLONG(16,"C",0)=6
	 ^DHCWANGMINGLONG(16,"C",4)="1^62"
	 ^DHCWANGMINGLONG(16,"C",5)="2^80"
	 ^DHCWANGMINGLONG(16,"C",6)="3^59"
3.2、把global信息中的分数信息取出来,如：
    
     DHC-APP>zw $p(^DHCWANGMINGLONG(16,"C",5),"^",2)
     80


具体例子：

	/// 查询学生选了那些课程，且显示相应的分数
	/// d ##class(wmlweb.DHCWmlCourse).FindInfoByDesc("jangxiao")
	ClassMethod FindInfoByDesc(StDesc)
	{
		quit:StDesc="" ""
		;通过Desc索引查询RowId
		set StDesc = $$ALPHAUP^SSUTIL4(StDesc)
		set RowId = $o(^DHCWANGMINGLONGi(0,"Desc",StDesc,""))
		;通过RowID找他所选课程
		set Sub = 0
		For  set Sub = $o(^DHCWANGMINGLONG(RowId,"C",Sub)) quit:Sub=""  d
		.set CourseInfo = ^DHCWANGMINGLONG(RowId,"C",Sub)
		.set CourseId = $p(CourseInfo,"^",1)
		.set CourseDr = $p(^DHCCOURSE(CourseId),"^",2)
		.set Score = $p(CourseInfo,"^",2)
		.w CourseDr_","_Score,!
	}


###3、查询某门课程被学生选修,且显示相应的分数

	/// 查询某门课程被学生选修,且显示相应的分数
	/// d ##class(wmlweb.DHCWmlCourse).FindInfoByCourse("Math")
	/// select DHC_Wml_ParRef->test_desc, * from wml.DHC_WmlCourse where DHC_CourseDr->dhcc_num="Math"
	ClassMethod FindInfoByCourse(StCourse)
	{
		quit:StCourse="" ""
		;通过课程名字查询课程RowId
		set CourseId = $o(^DHCCOURSEi(StCourse,""))
		set RowId = ""  //从第一个RowId开始查找索引
		set Sub = 0   //从0开始查找下一个索引
		;循环学生的RowId
		For  Set RowId = $o(^DHCWANGMINGLONG(RowId)) quit:RowId=""  d
		.set HasFlag = 0  //当标志为1时停止
		.;循环学生的课程
		.For  set Sub = $o(^DHCWANGMINGLONG(RowId,"C",Sub)) quit:(Sub="")||(HasFlag=1)  d
		..set CourseInfo = ^DHCWANGMINGLONG(RowId,"C",Sub)  //查找课程id和分数
		..set CourseDr = $p(CourseInfo,"^",1)  //取出课程id
		..quit:(CourseId'=CourseDr)    //课程id不相等时结束执行
		..set HasFlag = 1   //只要找到了选了该课程的学生，就不需要在循环该学生的其他课程了
		..set Desc = $p(^DHCWANGMINGLONG(RowId),"^",2) //取出学生的名字
		..set Score = $p(CourseInfo,"^",2)  //取出分数的名字
		..w Desc_","_Score,!
	}
	
	/// 查询某门课程被学生选修,且显示相应的分数
	/// d ##class(wmlweb.DHCWmlCourse).FindInfoByCourseIndex("Math")
	/// select DHC_Wml_ParRef->test_desc, * from wml.DHC_WmlCourse where DHC_CourseDr->dhcc_num="Math"
	ClassMethod FindInfoByCourseIndex(StCourse)
	{
		quit:StCourse="" ""
		set CourseId = $o(^DHCCOURSEi(StCourse,""))  //课程ID
		set RowId = ""  //从第一个RowId开始索引查找学生ID
		For  set RowId = $o(^DHCWANGMINGLONGi(0,"Course",CourseId,RowId)) quit:RowId=""  d
		.set StName = $p(^DHCWANGMINGLONG(RowId),"^",2)  //根据学生RowId查找名字
		.set Sub = $o(^DHCWANGMINGLONGi(0,"Course",CourseId,RowId,""))  //查找DHC_Childsub
		.set StCourseInfo = ^DHCWANGMINGLONG(RowId,"C",Sub)  //查找这个层级的信息
		.set Score = $p(StCourseInfo,"^",2)  //查找这个信息中分数信息
		.w StName_","_Score,!
	}

#Query
##一、Query、Execute、Fetch、Close（建立QUery方式一）

1、Query

    //CourseNum是参数
    //StName和Score是返回数据的列名
	Query FindInfo(CourseNum As %String) As %Query(ROWSPEC = "StName:%String,Score:%String:分数 ")
	{ 
	}
   
2、Execute（类名为Query的名字加Execute,否则会执行不了）

    //CourseNum是需要传入的参数
	ClassMethod FindInfoExecute(ByRef qHandle As %Binary, CourseNum As %String) As %Status
	{
		s repid = $I(^CacheTemp)
		s ind = 1
		s qHandle = $lb(0,repid,0)

		//是你需要实现的功能代码(查询某门课程被那些学生选修,且显示相应的分数)
		quit:CourseNum="" ""
		set CourseId = $o(^DHCCOURSEi(CourseNum,""))  //课程ID
		set RowId = ""  //从第一个RowId开始索引查找学生ID
		For  set RowId = $o(^DHCWANGMINGLONGi(0,"Course",CourseId,RowId)) quit:RowId=""  d
		.set StName = $p(^DHCWANGMINGLONG(RowId),"^",2)  //根据学生RowId查找名字
		.set Sub = $o(^DHCWANGMINGLONGi(0,"Course",CourseId,RowId,""))  //查找DHC_Childsub
		.set StCourseInfo = ^DHCWANGMINGLONG(RowId,"C",Sub)  //查找这个层级的信息
		.set Score = $p(StCourseInfo,"^",2)  //查找这个信息中分数信息
		.set data=$lb( StName,Score)
		// 以上

		.set ^CacheTemp(repid,ind) = data
		.set ind = ind+1
		s qHandle = $lb(0,repid,0)
		quit $$$OK
	}

3、Fetch（类名为Query的名字加Fetch,否则会执行不了）

    //只需改placeAfter为Execute的类名
	ClassMethod FindInfoFetch(ByRef qHandle As %Binary, ByRef Row As %List, ByRef AtEnd As %Integer = 0) As %Status [ PlaceAfter = FindInfoExecute ]
	{
		set AtEnd = $LIST(qHandle,1)   //截取$lb中的数据
		set repid = $LIST(qHandle,2)
		set ind = $LIST(qHandle,3)
	    
	    set ind = $o(^CacheTemp(repid,ind))
	    if ind="" {
		set AtEnd=1
		set Row=""    
		}
		ELSE      {
		set Row=^CacheTemp(repid,ind)	
		}
		s qHandle=$lb(AtEnd,repid,ind)
		quit $$$OK
	}

4、Close(类名为Query的名字加Close,否则会执行不了)

    //只需改placeAfter为Execute的类名
	ClassMethod FindInfoClose(ByRef qHandle As %Binary) As %Status [ PlaceAfter = FindInfoExecute ]
	{
		set repid=$LIST(qHandle,2)
		Kill ^CacheTemp(repid)
		Quit $$$OK
	}

#二、去掉Fetch、Close （建立QUery方式二）

1、Query

    //PrtRowid是参数 
    //patName等是返回数据的列名
    //主要是把%Query改为websys.Query
	// d ##class(%ResultSet).RunQuery("web.BOE.Test","FindInfo","225685")
	Query FindInfo(PrtRowid As %String) As websys.Query(ROWSPEC = "patName:%String,patmiId:%String,sex:%String,patNo:%String,")
	{
	}

2、Execute
   
    //CourSeNum
	ClassMethod FindExecute(ByRef qHandle As %Binary, CourseNum As %String) As %Status
	{
		s repid = $I(^CacheTemp)
		s ind = 1
		s qHandle = $lb(0,repid,0)
		
        //是你需要实现的功能代码(查询某门课程被那些学生选修,且显示相应的分数)
		Set paperDr=$p(^DHCINVPRT(PrtRowid),"^",15)
		If $d(^PAPER(paperDr,"PAT",1)) Do
		.Set patNo=$p(^PAPER(paperDr,"PAT",1),"^",1)   ;登记号
		.Set medicare=$p(^PAPER(paperDr,"PAT",1),"^",22)   ;病案号
		Set CardNO=""
		If $d(^PAPER(paperDr,"ALL")) Do
		.Set patName=$p(^PAPER(paperDr,"ALL"),"^",1)   ;姓名
		.Set patmiId=$p(^PAPER(paperDr,"ALL"),"^",9)   ;身份证
		.Set sex=$p(^PAPER(paperDr,"ALL"),"^",7)       ;性别
		.If sex'="" s sex=$p(^CT("SEX",sex),"^",2)
		set data=$lb(patName,patmiId,sex,patNo)
		//以上为功能代码
        
		set ^CacheTemp(repid,ind) = data
		set ind = ind+1
		s qHandle = $lb(0,repid,0)
		quit $$$OK
	}

#三、根据SQL建Query （建立QUery方式三）


	/// d ##class(%ResultSet).RunQuery("wmlweb.DHCWmlCourse","FindBySQL","Math")

    //CourseNum是参数
    //StName和Score是返回数据的列名
    //SQLUser.表名   
    //其他sql语句跟平常一样
	Query FindBySQL(CourseNum As %String) As %SQLQuery(CONTAINID = 1, ROWSPEC = "StName:%String,Score:%String")
	{
	    SELECT DHC_Wml_ParRef->test_desc,DHC_Score FROM SQLUser.wml.DHC_WmlCourse
	    where DHC_CourseDr->DHCC_Num=:CourseNum
	}


4、调用Query

	/// 学习query的调用
	/// 大于StartScore分数的输出
	/// w ##class(wmlweb.DHCWmlCourse).QueryHandler(60,"Math")
	ClassMethod QueryHandler(StartScore, CourseNum)
	{
		set rtn = CourseNum_"分数超过"_StartScore_"的学生有:"
		;调用Query
		set rs = ##class(%ResultSet).%New("wmlweb.DHCWmlCourse:FindInfo")
		;调用Excute方法
		set %sc = rs.Execute(CourseNum)
		;rs.Next()相当于Fetch方法
		While(rs.Next()){
			;set Score = rs.GetData(2)
			set Score = rs.GetDataByName("Score")
			if (Score>StartScore){
				set rtn = rtn_","_rs.GetData(1)  ;姓名
				}
		}
		do rs.Close()
		set rs = ""
		quit rtn
	}

    //ClassMethod调用query的方法
	ClassMethod DocListBroker(itmjs As %Library.String = "", itmjsex As %Library.String = "", val As %Library.String = "")
	{
		;w ##class(web.DHCOPAdmReg).DocListBroker("","","20^7050^^^1^^239^^^2^^^")
		s ^Temp("DocListBroker")=val
	 Set Status=0
	 Set value=""
	
	 Set rs=##Class(%ResultSet).%New("web.DHCOPAdmReg:OPDocList")
	 If rs.QueryIsValid() { 
		 Set Status=rs.Execute(val)
		 Set columns = rs.GetColumnCount()
	
		 If 'Status Quit
		 While rs.Next() {
			s rowvalue=""
			For col = 1:1:columns {
				;Write rset.GetColumnName(col),":"
				if col=1 set rowvalue=rs.GetData(col)
				e  s rowvalue=rowvalue_"^"_rs.GetData(col)
				b  ;11
			}
			if value="" s value=rowvalue
			else  s value=value_"!"_rowvalue
			
		 }
	 }
	 if value'="" {
		 ;s retval=itmjs_"('"_value_"');"
		 s retval=itmjs_"('"_$ZCVT(value,"O","JS")_"');"
		 i itmjsex'="" s retval=retval_itmjsex_"('"_$ZCVT(value,"O","JS")_"');"
		 b  ;12
		 &javascript<#(retval)#>
	 }
	 q 1
	}



#<font color=red>2018-04-11 星期三 晴</font>

#事务 

开始：TSTART 
提交：TCOMMIT

#<font color=red>2018-04-12 星期四 晴</font>

#组件的应用
1、新建一个组件，设置组件名，设置方法类名、设置需要的Query方法

2、添加组件的Item，有Find、List、Edit、Custom、Lookup各种类型

	Find：Query方法中需要的参数
	
	List：Query方法中需要返回的数据类型，需要设置他们的ValueGet,如：  
	s val=rs.GetDataByName("StName")或  
	s val=rs.Data("Score")

	Custom：自定义Item或Table Item ,如按钮,就把它的Display Type 改为Button。注意：当按钮设置为查询按钮时，需要在查询按钮的Link中关联自己的组件,即在LinkComponent中填写自己的组件名。
  
3、设置组件布局
点击 component layout

4、进系统配置的菜单管理中把组件挂起来。

5、在组件中添加js文件

    点击组件名，在Other Script中加入你所需要的js文件，常用的有websys.js,websys.List.js


6、安全组管理：

	如果想要使用列编辑或界面编辑需要到系统管理中的安全组中的相应部分设置为yes。设置完后，在你自己的界面中双击列头就会显示出来相应的东西。如设置列宽，排列顺序等内容。



7、设计界面的动作,需要新建自己的js文件   

	 1、在设计的组件中需要包含自己的组件，点击组件名，在include Script中打上勾。   
	 2、新建一个和组件同名的js,保存到scripts文件夹夹中。    
	 3、写自己需要的需求代码。如
	
	    //点击行时调用的方法。selectedRowObj是行对象
		var SelectRowHandler = function(){
		   alert("你选择的是第"+selectedRowObj.rowIndex+"行")
		}


8、在组件上设置加密item

    一、组件
    //wmlweb.DHCWmlCourse类名
    //Upd类方法
	//主要是在ValueGet设置加密方法
     s val=##Class(%CSP.Page).Encrypt($lb("wmlweb.DHCWmlCourse.Upd"))
	s val=%request.Get("RegNo")



     二、js文件设置，如向后台发请求的两种方法
     ///1、需要加密才能调用的类方法
     var encObj = document.getElementById("updEnc");
	 var enc = encObj.value;	 
     //enc是加密字符串、rowId,score是类方法中需要的参数。
	 var rtn = cspHttpServerMethod(enc,rowId,score);
     ///2、这是不需要加密就能调用类方法。
     var rtn = tkMakeServerCall("wmlweb.DHCWmlCourse","Upd",rowId,score);


9、修改消息提示

    1、在组件中点击组件名设置Messages,其中code是条件，Description是内容。如：
    code:success
    Description:保存成功

    2、在js中如何用这些Messages,
      t["success"] = 保存成功


10.如何设置选择列表,如选择课程的列表？

    1、在组件的课程Item中Lookup中设置需要的类名和Query方法。
    2、点击应用,再点击否，再点击确认,出现一个Sql界面。
    3、跳到界面后，在前面的4个输入框中都输入一个空格,再点击应用。

10.1、如何进行点击选择列表时，需要进行的功能操作？
   
    1、在组件的Item中Lookup中的LookupJSFunction中设置需要的js方法。如(courseLookupHandler)

    2、在js文件中的方法中实现功能代码。如

	    function courseLookupHandler(str){
		alert(str)
		var arr = str.split("^");	
		var courseNum = arr[1];
		var CourseNumObj = document.getElementById("CourseNum");
		CourseNumObj.value = courseNum;
		}


11、如何在js中调用组件中的Query

	//方法一：udhcINVQuery是组件名，也是js名
	var frm=document.fudhcINVQuery;
	frm.submit();

	//方法二：
	var str='websys.default.csp?WEBSYS.TCOMPONENT=DHCOPBillUnHanInvDetail&UserRowid='+UserRowid+'&Job='+Job
	window.open(str,'_blank','toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,copyhistory=yes,width=700,height=520,left=0,top=0')
    
	//_blank:url加载到一个新的窗口;toolbar:是否显示浏览器工具栏；directories:是否添加目录按钮；status:是否添加一个状态栏；menubar:是否显示菜单栏；resizable:是否可调整窗口大小；scrollbars:是否显示滚动条


#一些功能方法的js
1、根据id取值和设值

	var ToBillAmount=100;
	DHCC_SetElementData("BillAmount",ToBillAmount);
    var BillAmount=DHCC_GetElementData("BillAmount");

2、根据id设置列表的值和取出列表的值

	//设置列表的值
	var objtbl=document.getElementById("tDHCOPAdm_Reg");
	var rows=objtbl.rows.length;	
	if (rows==2){
			//第一行不为空则增加一行
		    var Row=objtbl.rows.length-1;
		    var valueAry=val.split("^");
				var ASRowId=DHCC_GetColumnData("TabASRowId",1);  //TabASRowId为一个隐藏元素
				if (ASRowId!=""){AddRowNew(objtbl);}
			}else{
				AddRowNew(objtbl);
			}
	var Rowindex=rows-1;
	var RowObj=objtbl.rows[Rowindex];
	var rowitems=RowObj.all;
	if (!rowitems) rowitems=RowObj.getElementsByTagName("LABEL");
	for (var j=0;j<rowitems.length;j++) {
		if (rowitems[j].id) {
			var Id=rowitems[j].id;
			var arrId=Id.split("z");
			var Row=arrId[arrId.length-1];
		}
	}
    var TabDepDesc=valueAry[6];‘
    DHCC_SetColumnData("TabDepDesc",Row,TabDepDesc);  //如已选挂号列表中的科室
	}
    //取出列表的值
    var ASRowId=DHCC_GetColumnData('TabASRowId',1);
	
  





#<font color=red>2018-04-13 星期五 晴</font>
主要学习了什么?  
如何查找数据  
如何创建实体类  
如何重新定义新的global  
M的基础知识和常用命令、常用函数  
如何对表进行增删查改  
如何建立索引  
如何建父子表  
如何查询父子表  
如何建立Query  
如何使用Query查询  
如何建立组件  
如何应用组件  



方涛
门诊收费
1. 注册建卡
2. 挂号，可挂多个。
3. 门诊收费结算，收费员可以开一些简单医嘱。
4. 产品配置，门诊收费配置，门诊收费安全组配置
5. 收费查询，发票集中打印
6. 发票格式 开发工具管理，xml模板
7. 退费申请，门诊收费系统配置


