##1、Ext.data.Store是EXT中用来进行数据交换和数据交互的标准中间件

	 var store=new Ext.data.Store({
	//proxy就是给store一个访问地址，当你执行store.load()的时候它就是根据这个地址从后台获取数据的//
			proxy:new Ext.data.HttpProxy({
				url:"../csp/dhc.nurse.ext.common.getdata.csp"
			}),
	//设置数据解析器  Ext.data.JsonReader主要用于从服务器端读取以Json格式读取数据，并显示在前端页面中。//
			reader:new Ext.data.JsonReader({
				root:'rows',     //构造元数据的数组由json.rows得到
				totalProperty:'results',   //totalRecords属性由json.results得到
				fields:[{
					'name':'ctlocDesc',
					'mapping':'ctlocDesc'
				}, {
					'name':'CtLocDr',
					'mapping':'CtLocDr'
				}]
			}),
			baseParams:{
				className:'web.DHCMgNurPerHRComm',
				methodName:'SearchComboDep',
				type:'Query'
			}
		}),


##2、Ext.form.ComboBox

	var comboBoxDep=new Ext.form.ComboBox({
	name:'comboboxDep',
		id:'comboboxDep',
		store:store
		listeners:{
			    focus: {
					fn: function (e) {
					e.expand();
					this.doQuery(this.allQuery, true);
					},
					buffer: 200
				},
				beforequery: function (e) {
					var combo = e.combo;
					var me = this;
					if (!e.forceAll) {
						var input = e.query;
						var regExp = new RegExp("^" + input + ".*", "i");
							combo.store.filterBy(function (record, id) {
							var text = getPinyin(record.data[me.displayField]);
							return regExp.test(text)|regExp.test(record.data[me.displayField]);  
						});
						combo.expand();
						combo.select(0, true);
						return false;
					}
			    }
		},
	//	tabIndex:'0',
		listWidth:200,
		//height:22,
		width:220,
		xtype:'combo',
		displayField:'ctlocDesc',
		valueField:'CtLocDr',
		hideTrigger:false,
		queryParam:'ward1',
		forceSelection:true,
		triggerAction:'all',
		minChars:1,
		pageSize:2000,
		typeAhead:false,
		typeAheadDelay:1000,
		loadingText:'Searching...'
	})




##3、生成Excel

    function exportFun(){
    var grid = Ext.getCmp('mygrid');
	var cm = grid.getColumnModel();
	var store = grid.getStore();
	var it = store.data.items;
	var rows = it.length;

	var oXL = new ActiveXObject('Excel.application');
	var oWB = oXL.Workbooks.Add();
	var oSheet = oWB.ActiveSheet;
	oSheet.Range("A1:J1").MergeCells = true;
	oSheet.Cells(1, 1).value = "护士兼职申请";   //第一行第一列
	oSheet.Rows(1).Font.Size = 18;     //第一行的字体大小
	oSheet.Cells(1, 1).HorizontalAlignment = 3;   //第一行第一列的高度
	oSheet.Range("A2:J2").MergeCells = true;   //从A2到J2
    oSheet.Cells(2, 1).value = "科室:" + warddesc + "      " + "时段:" + stdate + "至" + enddate;   //第二行第一列
	oSheet.Rows(2).Font.Size = 12;  //第二行第一列的字体大小
    for (var i = 0; i < 10; i++) {
		var headerdesc = cm.getColumnHeader(i);   //列标题
		oSheet.Cells(3, i + 1).HorizontalAlignment = 3   
		oSheet.Cells(3, i + 1).value = headerdesc;
		for (var j = 0; j < rows; j++) {
			r = it[j].data;
			var v = r[cm.getDataIndex(i)];
			oSheet.Cells(4 + j, i + 1).value = "'" + v;
			oSheet.Cells(4 + j, i + 1).HorizontalAlignment = 3;
			oSheet.Cells(4 + j, i + 1).WrapText = true;
			oSheet.Cells(4 + j, i + 1).ColumnWidth = cm.getColumnWidth(i) / 8;
		}
	}
    //oSheet.PageSetup.Orientation=2;
	mygridlist(oSheet, 3, 3 + rows, 1, 10);
	var fname = oXL.GetSaveAsFilename("护士兼职申请统计.xls", "Excel Spreadsheets (*.xls), *.xls");
	if (fname != "") {
		oWB.SaveAs(fname);
	}
	oWB.Close(savechanges = false);
	oXL.Quit();
	idTmr = window.setInterval("Cleanup();", 1);
    }


	function mygridlist(objSheet, row1, row2, c1, c2) {
	objSheet.Range(objSheet.Cells(row1, c1), objSheet.Cells(row2, c2)).Borders(1).LineStyle = 1;
	objSheet.Range(objSheet.Cells(row1, c1), objSheet.Cells(row2, c2)).Borders(2).LineStyle = 1;
	objSheet.Range(objSheet.Cells(row1, c1), objSheet.Cells(row2, c2)).Borders(3).LineStyle = 1;
	objSheet.Range(objSheet.Cells(row1, c1), objSheet.Cells(row2, c2)).Borders(4).LineStyle = 1;
	}

##4、选择框默认选择，禁止再选

	comboboxDep.store.load({
				params: { start: 0, limit: 1000 }, callback: function () {
					comboboxDep.setValue(session['LOGON.CTLOCID']); //默认选择
					comboboxDep.disable();  //禁止再选
				}
			});



##5、双击事件(dblclick)

	var grid=Ext.getCmp('mygrid');
	grid.on('dblclick',function(){ModCheck(NurTyp);});

    //设置监听事件
	var grid = new Ext.grid.GridPanel({  
	   store: <your datastore>,  
	   columns:[<your columns>],  
	   renderTo:'example-grid',  
	   height:200,  
	   listeners:{  
	//单击  
	       rowdblclick : function(grid,row){  
	           alert("rowdblclick")  
	       },  
	//双击  
	       rowclick:function(grid,row){  
	           alert('rowclick')  
	       }  
	   }  
	});  
	




