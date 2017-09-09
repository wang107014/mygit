## <font color=red>什么是JavaScript？</font> ##
JavaScript是一种具有面向对象、解释型的程序设计语言。JavaScript是一种具有面向对象、解释型的程序设计语言。它是基于对象和<font color=red>事件驱动</font>且相对安全的客户端使用的脚本语言。（事件驱动即跟随当前时间点上出现的事件，调动可用资源，执行相关任务，使不断出现的问题得以解决，防止事务堆积。）
## <font color=red>使用JavaScript的方式：</font> ##
- 确定对象
- 确定属性
- 确定事件
- 用js实现功能
## <font color=red>JavaScript的特点：</font> ##
1. 松散性：它的变量不必具有一个明确的类型。
2. 对象属性：JavaScript中的对象把属性名映射为任意的属性值。
3. 继承机制：它的面向对象继承机制是基于原型的。
## <font color=red>JavaScript的核心：</font> ##
1. 核心（ECMAScript）
2. 文档对象模型（DOM）
3. 浏览器对象模型（BOM）
## <font color=red>变量：</font> ##
前面输入的数据，后面要使用，需要定义变量，变量就用来存储程序当中需要用到的数据的，用关键字var定义变量。
特点：
1. 一个变量只能存储一个数据，后来存储的数据覆盖前面存储的数据。
2. 变量存储数据可以改变。

        var m=prompt("输入第一个数");
		var n=prompt("输入第二个数");
		alert(parseInt(m)+parseInt(n));
		m=30;
		alert(m);
## <font color=red>数据类型：</font> ##
**基本数据类型**：
1. number数值型
2. string字符串型
3. boolean布尔类型
4. undefined未定义类型。
**引用数据类型：**
1. object
2. function
3. array
4. null


        //34+5.6 //number
		//"张三" "男" "玩游戏"  //string字符串类型
		// true,false //boolean布尔类型
	    
	    var a=50;
	    //alert(typeof a);
	    var s="abc";
	    alert(typeof s);
	    var b=false;
	    alert(typeof b);
	    var d
	    alert(typeof d); //undefined
## <font color=red>进制：</font> ##
1. 8进制和16进制如何和十进制区分，8进制的前缀加个0,16进制的前缀加0x。
2. 8进制：每三位二进制表示1位。
3. 16进制：每四位二进制表示1位。

     	<script>
		var a=23;
		var b=0100; //8进制加前缀0
		var c=0x10; //16进制加前缀0x
		alert(c);
	</script>

## <font color=red>连接符号和转义字符：</font> ##
**+连接符**：实现多个数值同时进行显示。
字符串类型和任何类型的数据相连接，最终都是字符串。
**转义字符：**通过反斜杠改变后边所跟字符的含义。（\n换行）
     
      <script>
		var a=6;
		var s="hello";
		var b=true;
		//alert(a+s+b);
		//alert(s+a+a); //hello66
		//alert(a+a+s); //12hello字符串类型和任何类型的数据相连接，最终都是字符串。
		//alert("张三说：\"你好！！\""); //通过反斜杠把""的含义改变了。
		alert("张三说：\n'你好！！'");  //\n换行
		alert("张三说：\t'你好！！'");  //\n制表符tab键
	    alert("张三说：\\'你好！！'"); 
	</script>
## <font color=red>算数运算符：</font> ##
+ + -  *  /（除） %（取余数） ++（自增运算符） --（自减）
运算符和变量或常量组合在一起形成了表达式，表达式有一个最终的结果。
## <font color=red>赋值运算符：</font> ##
= +=  -=  %=  *=
把赋值号右边的值赋给左边的变量。赋值表达式的值就是赋值号右边的值。

           <script>
			var a=10;
			a+=5; //a=a+5;
			a*=3; //a=a*3;
			var b;
			alert(b=90)
			alert(b*2);
			alert(a);
		</script>
## <font color=red>关系运算符：</font> ##
>=  <  <=  ==  ===  !=  !==

1. **==和！=**:比较数值，不比较数据类型。

1. **===和！==:**比较数值和数据类型。

           <script>
			//关系表达式最终的结果是成立或不成了，所以值为true或false。
			var a=5;
			var b=6;
			//alert(a>b);
			
			var x=100;
			var y="100";
			//alert(x==y); //true 比较数值，不比较数据类型。
			//alert(x===y);  //false比较数值和数据类型。
			//alert(X!=y);  //false 比较数值，不比较数据类型。
			alert(x!==y); //true  比较数值，不比较数据类型。
		</script>

## <font color=red>逻辑运算符：</font> ##
&& (与) ||（或）  ！（非）

1. &&：如果左边的表达式的值为false，那么就不再计算右边表达式。
2. ||：如果左边的表达式为true，那么就不再计算右边的表达式。
3. 0相当于false，非0相当于true；
4. 空字符串相当于false，非空字符串相当于true；
     
            <script>
			var h5=67,js=90;
			var r=h5>js&&js<90;
			//alert(r);
			var year=2016;
			var a=year%4==0&&year%100!=0||year%400==0?"是闰年":"不是闰年";
			//alert(a);
			//0相当于false，非0相当于true；
			alert(0&&6); //6  如果左边的表达式的值为false，那么就不再计算右边表达式。
			alert(3||6); //0  如果左边的表达式为true，那么就不再计算右边的表达式。
		</script>
     
## <font color=red>选择结构：</font> ##
**if 和switch**    
1. switch中break是停止的意思，没有break就会继续执行下面的语句，直到遇到break为止。  
            
			switch(num){
				case 1: alert(1);break;
				case 2: alert(2);break;
				case 3: alert(3);break;
				case 4: alert(4);break;
				default: alert(5);break;				
			}
2. 在default下没有写break，执行完语句就会遇到右大括号也可以停止执行。如果把default放在case的前面，如果default没break，那么程序就会一直执行下去。    
3. 总之程序只有遇到break或右大括号才会停止。   
4. case 后边的值可以是常量，变量，表达式。

## <font color=red>循环结构：</font> ##
1. while循环解决的是具备重复件的问题。   
While(){
循环体；
}    

                while(i<=10){
				sum=sum+i;
				i++;
				alert("sum="+sum);
			}}
**原理：**先判断条件是否为真，如果为真则执行循环体一次，然后再判断条件是否为真，如果为真则再执行循环体，如此反复，直到条件为假时循环结束，循环结束后继续执行下面的语句。    
2. do-while循环
do{
循环体；
}
while()  
 
            do{
				alert("bb"+j);				
			}
			while(j>5){
				alert("cc"+j);
				j++;
			}
**原理：**先执行循环体一次，然后判断条件，如果条件为真则执行循环体，然后再判断条件，如此反复直到条件为假循环结束。
1. for(循环变量初始化语句；循环条件；改变循环变量值得语句){
循环体；
}   

	
			for(var j=1;j<6;j++)//外循环控制的是行数
			{
				
				for(var i=1;i<10;i++)//内循环控制的是每一行显示的内容
				 document.write("*");
				 document.write("<br/>");//换行
			}
			
**break:**结束其所在的循环。   

			for(var a=1;a<=5;a++)
			{
				if(a==3){
					break;
				}
				document.write(a);
				document.write("<br/>");
			}
			
**continue：**结束的是本次循环，直接进入下一次循环。
	
			flag:
			for(var s=1;s<=5;s++)
			{
				for(var d=1;d<5;d++)
				{
					if(d%2==0){
						continue flag;//结束外部循环
						
					}
					document.write(s);
				}
				
			}
			
			for(var w=1;w<6;w++)
			{
				if(w%2==0)
				continue; //结束本次的循环，直接进入下一次循环，也就是去执行w++
				document.write(w);
			}
## <font color=red>函数：</font> ##

1. 函数就是用来解决相同功能不用重复写多次的问题。
函数的参数使函数的功能更加灵活，可以让函数实现接收任意的数值。  

			function show(){
				alert("你好")
				alert("我好")
				alert("大家好")
			}
			show();//调用函数
			
1. 如何自定义函数，   
 一是否用到了不确定的数值，如果用到了就要使用参数，二再分析最终的结果是不是数值，如果是则返回。     
单独使用return，它的作用就是结束函数的执行，返回到函数调用的位置。函数之间是可以相互调用的。


            //求两个数中的最大值
			function getmax(num1,num2){
				return num1>num2?num1:num2;
			}
			//判断两个数是否相等
			function ifequal(n1,n2){
				return n1==n2;
			}
			//打印一个5行5列的矩形
			function rectangle(){
				for(j=1;j<=5;j++){
					for(var k=1;k<=5;k++){
						document.write("*");
						
					}
					document.write("<br />");
				}
			}
			getmax();
			ifequal();
			rectangle();
## <font color=red>递归：</font> ##
1. 递归是函数自己调用自己。  
1. 在使用递归是要注意一调用次数不要太多，否则会出现内存溢出，二要有能够使调用结束下来得条件。

           //求从1开始一直到某个数的和。
			function sum(n){
				if(n==1){
					return 1;
				}
				else
				{
					return n+sum(n-1);
				}
			}
			alert(sum(89));

## <font color=red>对象：</font> ##
Js中的数据类型：    
**基本类型**：number、string、boolean、undefined  只能存储数据  
**引用类型**：Object是最基本的类型 特点：是数据和功能（函数）的组合。   
对象：把数据和功能封装在一起， 对象.数据    对象.功能   

1. 创建对象可以使用new Object    
2. 创建对象是可以省略new。 
3. 创建对象还可以使用字面量方式。   
如Obj.age中的.运算符是访问对象的age。对象既可以存储数还可以包含功能。  
从内存的角度来看两种类型的对比：   
基本类型的变量是在栈中开辟一块内存，引用类型的变量会在栈中开辟一块内存，而对象是在堆中开辟内存，对象变量在栈中存放的是对象在堆中的内存地址。  
基本类型的变量直接存储的就是数据本身。
引用类型的变量存储的是对象的内存地址。


        var a=39;
		function show()
		{
			alert(a);
		}
		var obj=new Object();
		obj.name="张三";
		obj.fun=show;
		alert(obj.name);
		obj.fun();
		
		var obj=new Object();
		obj.name="张三";
		obj.fun=function()//匿名函数
		{
			alert("show");
		}
		//创建对象是可以省略new
		var obj=Object;
		obj.age=23;
		obj.fun=function(){
			alert("呵呵");
		}
		alert(obj.age);
		obj.fun();
		
		//创建对象的方式2，字面量方式
		var obj={
			name:"山水",
			age:23,
			fun:show		
		}
		function show(){
			alert("af");
		}
		alert(obj.name);
		obj.fun();
		

## <font color=red>数组：</font> ##
数组属于引用类型  
程序需要存储数据时要定义变量来表示，但是如果变量很多时可以用数组来解决。   
创建数组的同时给数组初始化数组，数组的初始长度就是数据的个数。   
数组的长度是可以改变的，数组可以存储不同类型的数据。   

            //使用new创建数组
			var arr=new Array(10); //定义了一个可以存储10个数的数组。
			//alert(typeof arr);
			//如何把数据放在数组？
			arr[0]=3;
			arr[1]=4;
			alert(arr[0]+arr[1]);
			alert(arr.length)
			alert(arr);
			var arr1=new Array("张三",23,true)//创建数组的同时给数组初始化数组，数组的初始长度就是数据的个数。
			arr1[3]=66;
			alert(arr1.length);
			alert(arr1[2]);
			
			var a=Array(10); 
			var b=Array();
			var c=Array("zhansan",23,true);
			
			//也可以使用字面量方式创建数组
数组中的常用方法：   
**toString()**:把数组中的数据转成字符串并返回。   
**Join()**:使用指定的分隔符把数组中的数据连接成字符串。   
**Push()**:向数组末添加数据，并返回数组长度。   
**Pop()**:删除数组末尾的数，返回被删除的数组。   
**Unshift()**:向数组的开头添加数据，返回数组的长度。   
**Shift()**:删除数组开头的数据，返回被删除的数据。   
**Concat()**:基于当前数组创建一个新数组并返回该数组。   
**Slice()**:基于当前数组获取指定区域元素并返回一个新的数组。   
**Splice()**:删除、插入、替换。

	        var arr=["张三",34,"闪电发货","演员"];
			/*alert(arr)  //内部自动调用了toString();
			alert(arr.join("/"))
			//alert(arr.push("搞笑"))//返回数组的长度。
		    alert(arr.pop());
		   // alert(arr.unshift("新奥法"))
		    alert(arr.shift());
		    
		    var a=arr.concat("非常搞笑");
		    alert(a);
		    alert(arr);
		    
		    var b=arr.slice(1,3);//从下标1的位置开始截取，直到下标3的前一个位置。
		    alert(b);
		    alert(arr);
		    
		   var c=arr.splice(0,2);//删除原有数组中的两个数，被删除的数放到一个新的数组当中，原有数组就少两个数。
		   alert(c);
		   alert(arr);
		  
		   var d=arr.splice(2,0,"呵呵");//插入 从下标2开始删除0个数，并插入数据
		   alert(d);//
		   alert(arr);*/
		  
		  var e=arr.splice(2,1,"东北");//替换  从下标开始删除1个数据，并插入数据
		    alert(arr);
		    alert(e);
## <font color=red>日期与时间</font> ##
- Date(1000):表示从1970.1.1  08:00:00开始算多少毫秒数。   
- Date("6/16/2009"):内部使用了Date.parse()转换成毫秒数    
- Date(“May 3,2016”):   

            var date=new Date();
			//alert(date);
			
			var d1=new Date(1000); //1970.1.1  08:00:01;
			//alert(d1);
			
			var d2=new Date("6/16/2009");
			//alert(d2);
			
			var d3=new Date("May 4,2016");
			//alert(d3)
			
			var d4=new Date("Mon Sep 04 2017 10:54:07 GMT+0800");
			//alert(d4)
			
			var t1 =Date.parse("1/1/2011 08:00:00");
			//alert(t1);
			var d5=new Date(t1);
			alert(d5);
			
**如何解决浏览器的兼容问题？**   
Date.UTC()方法返回日期的毫秒数。   
UTC：国际协调时间（世界统一世界）。我们时间为东八区，因此要在多少点的基础上加8。   
   
            //解决不同浏览器的兼容问题。
			var t2=Date.UTC(1970,0,1,0,0,0);
			alert(t2);
			var d6=new Date(t2);
			alert(d6);     
日期的方法：   
**通用方法：**  
  
- **toString()**:转换为字符串     
- **toLocaleString()**:转换为本地格式。   
- **Valueof()**:转换为毫秒数。  

**日期的格式化方法：**          

- toDateString():只想得到日期的星期年月日；
- toTimeString():只想得到时分秒。  
- toLocaleDateString()：得到本地的日期。  
- toLocaleTimeString()：得到本地的时分秒。
  
**组件方法：**  
**getTime()**  //获取日期的毫秒数，和valueOf()返回一致。    
**setTime(100)**  //以毫秒数设置日期，会改变整个日期    
**getFullYear()**  //获取四位年份   
**setFullYear(2018)**   //设置四位年份，返回毫秒数    
**getMonth()1+**    //获取月份要加1   
**setMonth()**    //设置月份   
**getDate()**    //获取日期   
**setDate(9)**  //返回星期几，0表示星期日，6表示星期六    
**setDay(3)**  //设置星期几    
**getHours()**   //返回时   
**setHours()**   //设置时  
**getMinutes()**   //返回分钟  
**setMinutes()**    //设置分钟    
**getSeconds(**)   //返回秒数   
**getMilliseconds()**   //返回毫秒数   
**setMilliseconds()**  //设置毫秒数   
**getTimezoneOffset()**   //返回本地时间和UTC时间相差的分钟数

           var d=new Date(Date.UTC(2018,10,3,8,13,30));
			1.通用方法：
			alert(d.toString());//转成字符串形式。
			alert(d.toLocaleString()) //转成本地格式。
			alert(d.valueOf());
	
			2.日期格式化方法
			alert(d.toDateString());
			alert(d.toTimeString());
			alert(d.toLocaleDateString());
			alert(d.toLocaleTimeString());
			alert(d.toUTCString());
			
			3.组件方法：
			alert(d.getTime());//获取日期的毫秒数，和valueOf()返回一致。
			alert(d.setTime(100)); //以毫秒数设置日期，会改变整个日期
			alert(d.getFullYear()); //获取四位年份
			alert(d.setFullYear(2018));  //设置四位年份，返回毫秒数
			alert(d.getMonth()+1); //获取月份要加1
			alert(d.setMonth());  //设置月份
			alert(d.getDate());  //获取日期
			alert(d.setDate(9)); //设置日期，返回毫秒数
			alert(d.getDay());  //返回星期几，0表示星期日，6表示星期六
			alert(d.setDay(3)); //设置星期几
			alert(d.getHours()); //返回时
			alert(d.setHours());  //设置时
			alert(d.getMinutes()); //返回分钟
			alert(d.setMinutes()); //设置分钟
			alert(d.getSeconds()); //返回秒数
			alert(d.getMilliseconds()); //返回毫秒数
			alert(d.setMilliseconds()); //设置毫秒数
			alert(d.getTimezoneOffset()); //返回本地时间和UTC时间相差的分钟数，相差8个小时480分钟
			//显示当前时间
			alert(date.getFullYear()+"年"+(date.getMonth()+1)+"月"+date.getDate()+"日"+date.getHours()+"时"+date.getMinutes()+"分"+date.getSeconds()+"秒");
	
			
		
## <font color=red>字符串</font> ##
**Arr.sort()**:自动排序  
字符串常用方法：   

            subStr(index1,index2)第一个参数表示截取的起始索引，第二个参数表示截取的字符的个数。
			var ss="hello world 努力学习 abcdefg";
			var s1=ss.substr(5,2);
			alert(s1);
			
			//subString(index1,index2):第一个参数表示截取的起始索引，第二个参数表示截取的结束位置（不包含结束位置上的字符，到结束位置的前一位）
			var s2=ss.substring(6,8);
			alert(s2);
			
			var str="hello word,hello kitty";
			alert(str.match("hello"));
			
			var s3=str.search("hello");
			alert(s3);
			
			var s4=str.replace("hello","hehehe");
			alert(s4);
			
			var str5="zhangsan,lisi,wangwu,zhaoliu";
			var s5=str5.split(",");
			alert(s5[2]);
			
			var str6="owksdjfkj";
			alert(str6.toUpperCase());
			var str7="KJKLSDJFADSKL";
			alert(str7.toLowerCase());
字符串中的每一个字符都有一个索引，索引从0开始。   
**charAt(index)**:根据索引得到字符串中的某一个字符    
**charCodeAt(index)**:返回索引对应的字符串的编码    
**String.fromCharCode()**:根据编码生成字符串    
**indexOf(str)**:默认返回在字符串中第一次出现的索引。    
**indexOf(str,position)**:返回从position指定的位置开始在字符串中第一次出现的索引。         
**lastIndexOf(str)**:返回在字符串中最后一次出现的索引    
**subStr(index1,index2)**第一个参数表示截取的起始索引，第二个参数表示截取的字符的个数。   
**subString(index1,index2)**:第一个参数表示截取的起始索引，第二个参数表示截取的结束位置（不包含结束位置上的字符，到结束位置的前一位）。   
**b.math(“a”)**:以数组的形式返回，数组中是b中第一个和“a”匹配的字符串。如果没有匹配的字符串则返回null空对象。    
**search()**:字符串第一次出现的起始位置。如果没有则返回-1;    
**replace()**:默认替换第一个，原有字符串不变。    
**split()**:切割字符串存到数组里面。   
**toUpperCase()**:小写字符串变成大写字符串。   
**toLowerCase()**:大写字符串变成小写字符串。
   

			var a=90;
			var arr=new Array(32,35,3,67);
			alert(arr.sort()); //自动排序
			
			var ab="abc";
			var ss=new String("abc");//string
			alert(typeof ab +"===="+typeof ss);//对象字符串
			alert(ab==ss);//只比较内容不比较类型
			alert(ab===ss); //内容和类型都要比较
			alert(ss.length);
			ss.text="hehe";
			alert(ss.text);
		
			var aa="abcd0987deg&*#";
		    alert(aa.charAt(0));//根据索引得到字符串中的某一个字符
		    alert(aa.charAt(aa.length-1));
		    alert(aa.charAt(-1));//返回空
		    alert(aa.charCodeAt("s"));
		    
		    //打印字符串中每一个字符以及字符对应的编码
		    var d="abcdefg 012345 ABCDEFG 中国你好!";
		    for(var i=0;i<d.length;i++){
		    	document.write("下标为"+i+"的字符是"+d.charAt(i)+"----->"+"该字符的编码是："+d.charCodeAt(i)+"<br/>")
		    }
            
            //String.fromCharCode():根据编码生成字符串
            var str= String.fromCharCode(98,78,85,20320);
            alert(str);
			var cd="*awerottskdjfroljfd";
			var index=  cd.indexOf("rot");
			alert(index);//4
			
			var index2=cd.indexOf("rol",10);
			alert(index2)//13
			
			var index3=cd.lastIndexOf("j");
			alert(index3);//16
			
			var num=cd.indexOf("afdf");
			alert(num); //不存在时返回-1
		  


          //验证邮箱是否合法
		  var email="zhangsan.hehe@qq.com"; //含有一个@符号，@号在.前边
		  
		  //判断是否含有@
		  if(email.indexOf("@")>0)
		  {
		  	//判断是否只含有一个@符号
		  	if(email.indexOf("@")==email.lastIndexOf("@")){
		  		//@符号是否在第一个.的前边，且两个符号不挨着
		  		if(email.indexOf("@")+1<email.indexOf(".",email.indexOf("@"))){
		  			alert("合法邮箱");
		  		}
		  		else{
		  			alert("@不在.的前边，不合法");
		  		}
		  	}
		  	else{
		  		alert("含有多个@，不合法");
		  	}
		  }
		  else
		  {
		  	alert("没有@，不合法")
		  }
		  
		  
## <font color=red>正则表达式</font> ##
isNaN():判断是否是数字，如果是则返回false。   
正则表达式主要用来验证客户端的输入数据，用户填写完表单单击按钮之后，表单就会发送到服务器，在服务器端通常会用PHP，ASP，NET等服务器脚本对其进行进一步处理，因为客户端验证，可以节约大量的服务器端的系统资源，并且提供更好的用户体验。   
验证方式：   
**test()**:字符串中含有和正则表达式匹配的则返回true。   
**excel（）**:返回匹配的字符串（返回的类型是数组对象）。  
**new RegExp(string pattern) i**:不区分大小写  g:全局匹配   m:多行匹配。如 var reg=new RegExp(“hello”,”i”);  
                
String对象也提供了4个使用正则表达式的方法：  

1. **match(pattern)**返回pattern中的子串或null,返回数组，数组中含有匹配的字符串。
2.	**search（pattern）**返回字符串中pattern开始位置。
3.	**replace(pattern,replacement)**用replacement代替pattern。
4.	**split(pattern)**返回字符串按指定pattern拆分的数组。

            //验证qq号是否合法：5-15位，不能以0开头，全是数字
      		var qq="0123343";
			  if(qq.length>=5&&qq.length<=15)
			  {
			  	if(qq.charCodeAt(0)!=48){
			  		if(!isNaN(qq))
			  		alert("合法的");
			  		else
			  		alert("含有非数字");
			  	}
			  
			  	else
			  	alert("以0开头，不合法");
			  }
			  else{
			  	alert("长度不合法");
			  }
			   //定义一个验证qq的正则表达式
			  var reg=/[1-9][0-9]{4,14}/;
			  alert(reg.test(qq));
    			//使用正则表达式进行验证的方式：test(),exce();
			    var reg=new RegExp("hello","i");//i不区分大小写  g全局匹配   m多行匹配
			    var str ="Hello world";
			    alert(reg.test(str));//字符串中含有和正则表达式匹配的则返回true。
			    alert(reg.exec(str)); //返回匹配的字符串（返回的类型是数组对象）。
				var reg1=/hello/;
				var str1="hello world";
				alert(reg1.test(str1));


## <font color=red>正则表达式规则</font> 

1. . :代表任意字符（换行除外）。  
2. ?:出现0次或1次、*：出现0次或多次、+：出现1次或多次。  
1. {m,n}:至少出现m次，最多出现n次     
1. {m,}:至少出现m次 
1. {m}:正好出现m次。 []限定某一位上字符的取值范围        [^]:限定某一位上不能取的值.
1. \d等价于[0-9]   
2. \D等价于[^0-9]  
3. \w等价于[a-zA-Z0-9_]  
4. \W等价于[^a-zA-Z0-9_].
5. \s匹配空白字符、空格、制表符和换行符。
6. 贪婪：+ * ？  {m,n}  {m,}  {m}   最大能匹配的字符串。
7. 惰性：+?  *?  ??  {m,n}?   {m,}?  {m}? 最小匹配的字符串。
 

//			.:代表任意字符（换行除外）
			var reg=/b..k/
			var str="books";
			alert(reg.test(str));
			
			//?：出现0次或1次     *：出现0次或多次     +：出现1次或多次
			var reg=/bo?k/;
			var str="books";
			alert(reg.test(str));
			var reg=/bo*k/;
			var str="books";
			alert(reg.test(str));
			var reg=/bo+k/;
			var str="books";
			alert(reg.test(str));

			//{m,n}:至少出现m次，最多出现n次     {m,}:至少出现m次    {m}:正好出现m次
			var reg=/bo{1,6}k/;
			var str="books";
			alert(reg.test(str));
			var reg=/bo{1,}k/;
			var str="books";
			alert(reg.test(str));
			var reg=/bo{1}k/;
			var str="books";
			alert(reg.test(str));
            
            //[]限定某一位上字符的取值范围   [^]:限定某一位上不能取的值
            var reg=/[a-zA-Z0-9]ook/;
			var str="books";
			alert(reg.test(str));
			var reg=/[^a-zA-Z0-9]ook/;
			var str="books";
			alert(reg.test(str));
			
			//\d等价于[0-9]   \D等价于[^0-9]  \w等价于[a-zA-Z0-9]  \W等价于[^a-zA-Z0-9] 
			  var reg=/\dook/;
			  var str="books";
			  alert(reg.test(str));
			  var reg=/\Dook/;
			  var str="books";
			  alert(reg.test(str));
			  var reg=/\wook/;
			  var str="books";
			  alert(reg.test(str));
			  var reg=/\Wook/;
			  var str="books";
			  alert(reg.test(str));
			  
			  var reg=/book$/; //匹配行首  匹配行尾
			  var str="books";
			  alert(reg.test(str));

			// \s匹配空白字符、空格、制表符和换行符
			var reg=/java\sscript/;
			var str="study java script";
			alert(reg.test(str));
			
			//()分组
			var reg=/(javascript){2,4}/
			var str="study javascriptjavascript";
			alert(reg.test(str));
			alert(RegExp.$1);
			
			var reg=/(.*)\s(.*)/;
			var str="hello world";
			var str1=str.replace(reg,'$2,$1');
			alert(str1);
		
			var reg=/6(.*)6/
			var str="study 6javascript6javascript6";
			alert(reg.test(str));
			var str1=str.replace(reg,'$1');
			alert(str1);

**使用exec()方法返回匹配字符串数组。**    
      

使用exec()方法返回数组


			var reg=/[a-z]+\s\d{4}/
			var str="hello 2020";
			alert(reg.exec(str));			
			捕获性分组。
			var reg=/([a-z]+)\s(\d{4})/;
			var str="hello 2020";
			alert(reg.exec(str));
			alert(reg.exec(str)[0]);
			alert(reg.exec(str)[1]);
			alert(reg.exec(str)[2]);
			
			//数组中第一个数据是整个正则表达式的字符串
			//数组中第二个数据是第一个分组中的字符串
			//数组中第三个数据是第二个分组中的字符串
			
			非捕获分组？：不想捕获
			var reg=/([a-z]+)\s(?:\d{4})/;
			var str="hello 2020";
			alert(reg.exec(str));
			
			前瞻捕获?=
			var reg=/[a-z]+(?=gle)/;
			var str="google";
			alert(reg.exec(str));
			
			//换行模式g全局匹配，m多行匹配
			var reg=/^\d+/gm;
			var  str="1.baidu\n2.google\n3.ie";
			alert(str.replace(reg,"*"))
捕获性分组。数组中第一个数据是整个正则表达式的字符串，数组中第二个数据是第一个分组中的字符串，数组中第三个数据是第二个分组中的字符串。     
非捕获分组？：不想捕获。
前瞻捕获?=。
换行模式g全局匹配，m多行匹配。
   
            var reg=/hello/i;
			var str="Hello world,Hello Kitty";
			alert(str.match(reg));//默认只返回第一个匹配的字符串
			
			var reg1=/hello/ig; //i不分大小写，g全局匹配
			var str1="Hello world,Hello Kitty";
			alert(str1.match(reg1)); //
			
			var reg2=/hello/i; //i不分大小写，g全局匹配
			var str2="Hello world,Hello Kitty";
			alert(str2.search(reg2)); //返回第一个和正则表达式匹配的字符串的起始位置
			
			var reg3=/hello/ig; //i不分大小写，g全局匹配
			var str3="Hello world,Hello Kitty";
			alert(str3.replace(reg3,"hehehe")); //替换所有第一个符号正则表达式的字符串
		 
		    var reg4=/ /; //i不分大小写，g全局匹配
			var str4="Hello world,Hello Kitty";
			alert(str4.split(reg4)); //
## <font color=red>正则表达式验证规则</font> ##


            //验证手机号
			var reg=/^1[3578]\d{9}$/  //行首行尾匹配
			var phone="13487977634";
			alert(reg.test(phone));
			
			//把手机号的中间4位显示为****
			var reg=/(\d{3})\d{4}(\d{4})/;
			var phone="13475939494";
			alert(phone.replace(reg,'$1****$2'));
			
			//验证是否是压缩文件
			var reg=/\w+\.rar|zip|gz/;
			var file="test.rar";
			alert(reg.test(file));
			
			//验证邮箱
			var reg=/^[a-zA-Z0-9_\.\-]+@[a-zA-Z0-9_\.\-]+\.[a-zA-Z]+$/;
			var email="xiaoming.hehe@13.com";
			alert(reg.test(email));

## <font color=red>Function类型</font> ##
Function类型实际上是引用类型，每个函数都是function类型的对象，而且都其他引用类型一样具有属性和方法，由于函数是对象，因此函数实际上也是一个指向函数对象的引用类型变量。   
函数本身就是变量，所以函数也可以作为值来使用，也就是说，不仅可以像传递参数一样把一个函数传递给另一个函数，而且可以将一个函数作为另一个函数的结果返回。   


            //一、函数的声明方式
			//1、普通方式
			function fun(num1,num2){
				return num1,num2;				
			}
			//1、使用变量方式
			var fun2=function(a,b){
				return a+b;
			}
			//3、使用new创建函数
			var fun3=new Function('n1','n2','return n1+n2');//不建议使用
			
			//二、函数作为参数来传递：
			function add(a,b){
				return a+b;
			}
			function show(fun,num){
				return fun(num,80);
			}
			alert(show(add,66));
**函数内部属性：**  
1、	**arguments属性**：指向一个类似数组但不是数组的对象，存储的实际传递给函数的参数，而不局限于函数声明所定义的参数列表。    
2、	**length属性**：函数定义时所指定的参数个数。   
3、	**arguments中的callee属性**：它表示对函数对象本身的引用（相当于函数名）。   
**全局变量**：任何一个函数都可以使用是公共的。   
**局部变量：**只能被其所在的函数使用，当局部变量和全局变量同名时，全局变量无效。   


            //函数内部属性：
			//1、arguments属性：指向一个类似数组但不是数组的对象，存储的实际传递给函数的参数，而不局限于函数声明所定义的参数列表。 
			function show(a,b){
				if(arguments.length==2) 
				   alert(a+b);
				 else if(arguments.length==3)
				   alert(arguments[0]+arguments[1]+arguments[2]);
			}
			show("hello","world","haha");  //arguments实际传递的参数
			alert(show.length);//
			
			//arguments中的callee属性：它表示对函数对象本身的引用
			//使用递归实现阶乘
			function jie(n){
				if(n==1)
				return 1;
				else
				return n*arguments.callee(n-1);
			}
			
			//局部变量和全局变量
			var b=90;  //全局变量，任何一个函数都可以使用。公共的
			function fun(){
				var a=89;//局部变量：只能被其所在的函数使用
				var b=80; //当局部变量和全局变量同名时，全局变量无效。
				alert(b);
			}
			fun(); 
**this:**是一个引用，指向函数被调用时的对象。   

    	function test(mse){
				alert(mse);
			}
			var f=test;
			f("hello");

			//this:是一个引用，指向函数被调用时的对象
			var name="zhangsan";
			function show()
			{
				//alert(this.name);
			}
			window.show();//windows对象 this指向的就是window对象
			var obj={
				name:"lisi",
				show:function (){
					alert(this.name);
				}
			}  
			//obj.show();//this指向的是obj对象
			
			var color="红色";
			function funa()
			{
				alert(this.color);
			}
			var objs={
				color:"紫色",
			};
			funa();
			objs.showcolor=funa;
			objs.showcolor();
Function内部有一个prototype属性；该属性含有两个方法**call(),apply(); **      
两者的传递参数形式不一样，**call(this,a,b); apply(this,[a,b])。**
     

        function sum(num1,num2){
			return num1+num2;
		}
		function show1(num1,num2){
			return sum.call(this,num1,num2); //第一个参数是调用sum函数的对象，后边的参数是传递给sum的实际数据。
		}
		function show2(num1,num2){
			return sum.apply(this,[num1,num2]);//第一个参数是调用sum函数的对象，
		}
		
		
	
		alert(show1(10,10))
		alert(show2(20,20));
		
		//可以使用call() apply()方法改变调用函数的对象
		function test(){
			this.property="hello wold";
		}
		test();
		alert(window.property);
		var obj1={};
		test.call(obj1);
		alert(obj1.property);

      
## <font color=red>两种数据类型的对比</font> ##
JavaScript变量是松散型的（不强制类型），决定了它只是在特定时间用于保存特定值的一个名字而已，变量中存储的数据的类型也是可以改变的。

        <script>
			var a = 89;
			alert(typeof a);
			var a=new Object();
			alert(typeof a)
		</script>
## <font color=red>作用域</font> ##
作用域：在程序中定义的变量或函数能够被使用的范围。     
全局：在程序中的任何位置都能使用。    
局部：在程序的某个范围内可以使用。   
全局的变量和函数，都是Window对象的属性和方法。

            <script>
			//全局：
			var name = "list";
			//alert(window.name);
			function show() {
				alert(name);
			}
			//window.show();

			//局部
			function fun() {
				//				var age=20;
				//				alert(age);
				return ss();

				function ss() {
					return 66;
				}
			}
			//fun();
			alert(fun());
			//函数的参数：属于局部变量，作用域仅限于该函数。
			function add(a,b){
				return a+b;
				
			}
			alert(add(3,4));
			//不存在块级作用域。
			if(true)
			{
				var a=90;//全局变量
			}
			alert(a);
			for(var i=1;i<5;i++){
				var num=90;
				num=num+i;
			}
			alert(i);
			alert(num);
		</script>

##<font color=red>垃圾回收</font>##
JavaScript具有自动垃圾收集机制，它会自动管理内存分配及无用内存的回收。最常用的垃圾收集方式是标记清除。
##<font color=red>内置对象</font>##
Glodal(全局)对象：所有在全局作用域定义的变量和函数，都是global对象的属性和方法。

##<font color=red>面向对象与原型</font>##
开发有两种模式：   
1.函数模式。   
2.面向对象。  
     
      <script>
			//开发有两种模式：1.函数模式，2.面向对象
			var arr=new Array(1,2,3);
			var a1=arr.length
			var a2=arr.sort()
			alert(a1);
			alert(a2);
			//创建对象
			var stu1=new Object();
			stu1.name="张三";
			stu1.age=23;
			stu1.study=function(){
				alert("我叫"+this.name+"今年"+this.age);
				
			}
		    alert(stu1.name);
			alert(stu1.age);
		    stu1.study();
			//使用工厂模式创建对象：解决实例化对象产生大量重复问题。
			function createobj(name,age){
				var obj=new Object();
				obj.name=name;
				obj.age=age;
				obj.study=function(){
					alert("我叫"+this.name+"今年"+this.age);
				}
				return obj;
			}
			var stu3=createobj("张三",23);
			var stu4=createobj("李四",33);
			var stu5=createobj("王五",43);
			alert(stu3.name);
			alert(stu3.age);
			stu3.study();
		</script>
**使用工厂模式创建对象**：解决实例化对象产生大量重复问题（Demo37）   
**构造函数创建对象：**（Demo38）
工厂模式解决了重复实例化的问题，但是存在识别问题，因为根本无法清除他们到底是哪个类型，因此采用构造函数来创建特定对象。  
使用构造函数的方法，和使用工厂模式的方法他们不同之处如下：    
1. 构造函数方法没有显示的创建对象(new Object());   
2. 直接将属性和方法赋值给this对象；    
3. 没有return语句   
**构造函数的特点**  
1. 函数名首字母大写，为了和普通函数区分   
2. 使用构造函数必须使用new

            <script>
			//工厂模式解决了重复实例化的问题，但是存在识别问题，因为根本无法清除他们到底是哪个类型，因此采用构造函数来创建特定对象。
			function Student(name,age){
				this.name=name; //后台创建了new Object()
				this.age=age;   //this就指向了这个对象
				this.study=function(){
					alert(this.name+","+this.age);
				};//后台返回了该对象
			}
			var stu1=new Student("张三",34);
			alert(stu1.name);
			alert(stu1.age);
			stu1.study();
          //使用构造函数的方法，和使用工厂模式的方法他们不同之处如下：
          //构造函数方法没有显示的创建对象(new Object());
          //直接将属性和方法赋值给this对象；
           //没有return语句
			var stu2=new Student("李四",87);
			alert(stu2.name);
			alert(stu2.age);
			stu2.study();
           //构造函数的特点
           //1.函数名首字母大写，为了和普通函数区分
           //2.使用构造函数必须使用new
			//把构造函数当成普通函数使用
			Student("wang",33);//没意义
			alert(typeof stu1)
			alert(stu1 instanceof Student);
			alert(stu2 instanceof Student);
		</script>
           
##<font color=red>继承</font>##
继承是面向对象中一个比较核心的概念，而实现继承的方式依靠原型链完成。    
被继承的类型称为父类，继承的称为子类,可以把子类对象看成父类类型。       
**使用原型实现继承存在的问题**    
1. 当原型中存在引用类型时，存在数据修改时的问题。    
2. 子类类型的对象无法给父类传参数。   
    
    //继承是面向对象中一个比较核心的概念，而实现继承的方式依靠原型链完成
			function Box()
			{
				this.name="wang";
			}
			function Desk()
			{
				this.age=100;
				
			}
			Desk.prototype=new Box();//Desk继承了Box,形成了一个原型
			var desk=new Desk();
			alert(desk.age);
			alert(desk.name);
			//被继承的类型称为父类，继承的称为子类,可以把子类对象看成父类类型。
			alert(desk instanceof Desk);
			alert(desk instanceof Box);
			
			//使用原型实现继承存在的问题
			function Test(age){
				this.family=["妈妈","爸爸"];
				this.age=age;
			}
			function util(){}
			util.prototype=new Test(20);
			var ul=new util();
			ul.family.push("姐姐");
			alert(ul.family);
			var u2=new util();
			alert(u2.family);
			//当原型中存在引用类型时，存在数据修改时的问题
            //子类类型的对象无法给父类传参数。   
**继承类型**  
1. 原型链继承、  
2. 对象冒充、   
3. 组合继承、    
4. 原型式继承、    
5. 寄生式继承、    
6. 寄生组合继承。    
    
     <script>
			//原型模式
			function Student(){};
			Student.prototype={
					name:"李四",
					
					family:['爸爸','妈妈','兄弟姐妹'],
					fun:function(){
						return this.name+this.age+this.family;
					}
			};
			var stu1=new Student();
			stu1.name="张三";
			stu1.family.push("哥哥");
			alert(stu1.name);
			alert(stu1.family);
			
			var stu2=new Student();
			alert(stu2.name);
		</script>
##<font color=red>Math的方法</font>##
	        Math.min();
			Math.max();
			Math.ceil(num);//返回大于等于该数的最小整数
			Math.floor(num);//返回小于等于该数的最大整数
			Math.round(num);//四舍五入取整
			Math.random();//产生随机数方法，随机数大于等于0.0小于1.0
			Math.abs(num);//返回num的绝对值
			Math.exp(num);//返回Math.E的num次幂
			Math.log(num);//返回num的自然对数
			Math.pow(num,power);//返回num的power次幂
			Math.sqrt(num);//返回num的平方根
			Math.acos(x);//返回x的反余弦值
			Math.asin(x);//返回x的反正弦值
			Math.atan(x);//返回x的反正切值
			Math.atan2(y,x);//返回y/x的反正切值
			Math.cos(x);//返回x的余弦值
			Math.sin(x);//返回x的正弦值
			Math.tan();//返回x的正切值

##<font color=red>匿名函数</font>##
匿名函数就是没有名字的函数。   
把匿名函数赋值给一个变量
    
    //匿名函数就是没有名字的函数
			function show(){
				alert("hello");
			}
			show();
			//匿名函数的调用
			(function(){
				alert("world");
			})();  
			
			(function(name){
				 alert(name);
			})("lisi");
			
			var s=(function(name){
				return name;
			})("zhangsan");
			alert(s);
			
			alert((function(name){
				return name;
			})("wangwu"));
			
			//把匿名函数赋值给一个变量
			var m=function(){
				alert("haha");
			}
			m();
		</script>
##<font color=red>闭包</font>##
在一个函数内部创建另一个函数，通过另一个函数访问这个函数的局部变量。   
使用闭包的优势：实现一个变量累加。    
调用函数时为局部变量开辟内存，函数调用结束时，局部变量内存立刻被释放    
全局变量是公共的，容易发生问题    
不适用全局变量实现让age的值主键递增---闭包   
闭包使用的局部变量不会立刻释放内存，会在内存驻留一段时间。   
注意：尽量少用闭包，在必要时再使用闭包。   
闭包中的this在运行时指向window，因为闭包并不属于这个对象的属性或方法。	
      
             <script>
			//闭包：在一个函数内部创建另一个函数，通过另一个函数访问这个函数的局部变量
			function show(){
				var name="lisi";
				return function(){
					return name;
				};
			}
			var fun=show();
			alert(fun());
			alert(show()())
			//使用闭包的优势：实现一个变量累加
			function add(){
				var age=10;
				age++;
				return age;
			}
			alert(add());
			//调用函数时为局部变量开辟内存，函数调用结束时，局部变量内存立刻被释放
			var age=10; //一直在内存中，直到程序运行结束
			function add1(){
				
				age++;
				return age;
			}
			alert(add1());
			//全局变量是公共的，容易发生问题
			//不适用全局变量实现让age的值主键递增---闭包
			function show1(){
				var name=90;
				return function(){
					name++;
					return name;
				};
			}
			var fun1=show1();
			alert(fun1());
			alert(fun1());
		    闭包使用的局部变量不会立刻释放内存，会在内存驻留一段时间。
		    注意：尽量少用闭包，在必要时再使用闭包

          //闭包中的this在运行时指向window，因为闭包并不属于这个对象的属性或方法。
          var obj={
          	name:"lisi",
          	fun:function(){
          		return function(){
          			return this;
          		};
          	}
          };
          alert(obj.fun()())//window
            var name="window";
            var obj={
          	name:"object",
          	fun:function(){
          		return function(){
          			return this.name;
          		};
          	}
          };
          alert(obj.fun()())//window
          alert(obj.fun().call(obj));//对象冒充
		</script>
##<font color=red>BOM</font>##
浏览器对象模型：提供了独立于内容而与浏览器窗口进行交互的对象，并且每个对象都提供了很多方法与属性。    
BOM主要用于管理窗口与窗口之间的通讯，因此其核心对象是window   
window.closed//当窗口关闭时为真   
window.defaultStatus//窗口底部状态栏显示的默认状态消息   
window.document//窗口中当前显示的文档对象    
window.frames//窗口中的框架对象数组   
window.history//保存有窗口最近加载的url  
window.length//窗口中的框架数   
window.location //当前窗口的url   
window.name//窗口名   
window.offscreenBuffering//用于绘制新窗口内容并在完成后复制已经存在的内容，控制屏幕更新   
window.opener//打开当前窗口的窗口   
**Window对象的常用属性和方法**  
1. 系统对话框   
2. 新建窗口    
3. 窗口的位置和大小    
4. 间隔调用和超时调用   
**confirm("确认")**   //弹出确认对话框，点击确认返回true，否则返回false。    
**prompt("请输入一个数据")**//弹出让用户输入数据的对话框,返回用户输入的值，点击取消返回值是null,第二个参数是默认值。    
**print()**;//显示打印对话框   
**find()**;//显示查找对话框
    
   			<script>
			window.closed//当窗口关闭时为真
			window.defaultStatus//窗口底部状态栏显示的默认状态消息
			window.document//窗口中当前显示的文档对象
			window.frames//窗口中的框架对象数组
			window.history//保存有窗口最近加载的url
			window.length//窗口中的框架数
			window.location //当前窗口的url
			window.name//窗口名
			window.offscreenBuffering//用于绘制新窗口内容并在完成后复制已经存在的内容，控制屏幕更新
			window.opener//打开当前窗口的窗口
			//Window对象的常用属性和方法
			//1.系统对话框
			//2.新建窗口
			//3.窗口的位置和大小
			//4.间隔调用和超时调用
			alert("你是")//弹出显示数据的对话框
			confirm("确认")//弹出确认对话框，点击确认返回true，否则返回false。
			if(confirm("你要退出吗"))
			{
				alert("退出")
			}  
			else
			alert("不退出"); 
			var num=prompt("请输入一个数据",4)//弹出让用户输入数据的对话框,返回用户输入的值，点击取消返回值是null,第二个参数是默认值。
			alert(num);
			print();//显示打印对话框
			find();//显示查找对话框
		</script>