module.exports=function(router,fs,excelbuilder,CodigoControl){
	
router.route('/pruebas-codigo-control')
	.post(function(req, res) {
		for(var i=0;i<req.body.pruebas.length;i++){
			var codigo=CodigoControl.obtenerCodigoControl(req.body.pruebas[i].autorizacion,
											req.body.pruebas[i].factura,
											req.body.pruebas[i].nit,
											req.body.pruebas[i].fecha,
											req.body.pruebas[i].monto,
											req.body.pruebas[i].llave_digital);
			req.body.pruebas[i].codigo=codigo;
		}
		
		//EXCEL DATOS ESTUDIANTES
		var documentName='PRUEBAS-CODIGO-CONTROL.xlsx';
		var workbookData = excelbuilder.createWorkbook('./reports/',documentName);
		var sheet1Data = workbookData.createSheet('sheet1', 30,5100);
		sheet1Data.set(3, 1, 'REPORTE DE PRUEBAS CODIGO DE CONTROL');
		sheet1Data.merge({col:3,row:1},{col:15,row:1});
		sheet1Data.align(3, 1, 'center');
		sheet1Data.border(3, 1, {top:'medium',bottom:'medium',left:'medium'});
		for(var i=4;i<15;i++){
			sheet1Data.border(i, 1, {top:'medium',bottom:'medium'});
		}
		sheet1Data.border(15,1 , {top:'medium',right:'medium',bottom:'medium'});
		sheet1Data.fill(3, 1, {type:'solid',fgColor:'8',bgColor:'64'});
		
		sheet1Data.set(1, 7,"Nº");
		sheet1Data.merge({col:1,row:7},{col:1,row:9});
		sheet1Data.width(1,3);
		sheet1Data.align(1, 7, 'center');
		sheet1Data.valign(1, 7, 'center');
		sheet1Data.border(1, 7, {left:'medium',top:'medium',right:'medium'});
		sheet1Data.border(1, 8, {left:'medium',right:'medium'});
		sheet1Data.border(1, 9, {left:'medium',right:'medium',bottom:'medium'});
		sheet1Data.fill(1, 7, {type:'solid',fgColor:'8',bgColor:'64'});
		
		sheet1Data.set(2, 7,"NRO. AUTORIZACION");
		sheet1Data.merge({col:2,row:7},{col:2,row:9});
		sheet1Data.width(2,20);
		sheet1Data.align(2, 7, 'center');
		sheet1Data.valign(2, 7, 'center');
		sheet1Data.border(2, 7, {left:'medium',top:'medium',right:'medium'});
		sheet1Data.border(2, 8, {left:'medium',right:'medium'});
		sheet1Data.border(2, 9, {left:'medium',right:'medium',bottom:'medium'});
		sheet1Data.fill(2, 7, {type:'solid',fgColor:'8',bgColor:'64'});
		
		sheet1Data.set(3, 7,"NRO. FACTURA");
		sheet1Data.merge({col:3,row:7},{col:3,row:9});
		sheet1Data.width(3,20);
		sheet1Data.align(3, 7, 'center');
		sheet1Data.valign(3, 7, 'center');
		sheet1Data.border(3, 7, {left:'medium',top:'medium',right:'medium'});
		sheet1Data.border(3, 8, {left:'medium',right:'medium'});
		sheet1Data.border(3, 9, {left:'medium',right:'medium',bottom:'medium'});
		sheet1Data.fill(3, 7, {type:'solid',fgColor:'8',bgColor:'64'});
		
		sheet1Data.set(4, 7,"NIT/CI");
		sheet1Data.merge({col:4,row:7},{col:4,row:9});
		sheet1Data.width(4,30);
		sheet1Data.align(4, 7, 'center');
		sheet1Data.valign(4, 7, 'center');
		sheet1Data.border(4, 7, {left:'medium',top:'medium',right:'medium'});
		sheet1Data.border(4, 8, {left:'medium',right:'medium'});
		sheet1Data.border(4, 9, {left:'medium',right:'medium',bottom:'medium'});
		sheet1Data.fill(4, 7, {type:'solid',fgColor:'8',bgColor:'64'});
		
		sheet1Data.set(5, 7,"FECHA");
		sheet1Data.merge({col:5,row:7},{col:5,row:9});
		sheet1Data.width(5,30);
		sheet1Data.align(5, 7, 'center');
		sheet1Data.valign(5, 7, 'center');
		sheet1Data.border(5, 7, {left:'medium',top:'medium',right:'medium'});
		sheet1Data.border(5, 8, {left:'medium',right:'medium'});
		sheet1Data.border(5, 9, {left:'medium',right:'medium',bottom:'medium'});
		sheet1Data.fill(5, 7, {type:'solid',fgColor:'8',bgColor:'64'});
		
		sheet1Data.set(6, 7,"MONTO");
		sheet1Data.merge({col:6,row:7},{col:6,row:9});
		sheet1Data.width(6,30);
		sheet1Data.align(6, 7, 'center');
		sheet1Data.valign(6, 7, 'center');
		sheet1Data.border(6, 7, {left:'medium',top:'medium',right:'medium'});
		sheet1Data.border(6, 8, {left:'medium',right:'medium'});
		sheet1Data.border(6, 9, {left:'medium',right:'medium',bottom:'medium'});
		sheet1Data.fill(6, 7, {type:'solid',fgColor:'8',bgColor:'64'});
		
		sheet1Data.set(7, 7,"LLAVE DIGITAL");
		sheet1Data.merge({col:7,row:7},{col:7,row:9});
		sheet1Data.width(7,30);
		sheet1Data.align(7, 7, 'center');
		sheet1Data.valign(7, 7, 'center');
		sheet1Data.border(7, 7, {left:'medium',top:'medium',right:'medium'});
		sheet1Data.border(7, 8, {left:'medium',right:'medium'});
		sheet1Data.border(7, 9, {left:'medium',right:'medium',bottom:'medium'});
		sheet1Data.fill(7, 7, {type:'solid',fgColor:'8',bgColor:'64'});
		
		sheet1Data.set(8, 7,"CODIGO CONTROL ESPERADO");
		sheet1Data.merge({col:8,row:7},{col:8,row:9});
		sheet1Data.width(8,30);
		sheet1Data.align(8, 7, 'center');
		sheet1Data.valign(8, 7, 'center');
		sheet1Data.border(8, 7, {left:'medium',top:'medium',right:'medium'});
		sheet1Data.border(8, 8, {left:'medium',right:'medium'});
		sheet1Data.border(8, 9, {left:'medium',right:'medium',bottom:'medium'});
		sheet1Data.fill(8, 7, {type:'solid',fgColor:'8',bgColor:'64'});
		
		sheet1Data.set(9, 7,"CODIGO CONTROL GENERADO");
		sheet1Data.merge({col:9,row:7},{col:9,row:9});
		sheet1Data.width(9,30);
		sheet1Data.align(9, 7, 'center');
		sheet1Data.valign(9, 7, 'center');
		sheet1Data.border(9, 7, {left:'medium',top:'medium',right:'medium'});
		sheet1Data.border(9, 8, {left:'medium',right:'medium'});
		sheet1Data.border(9, 9, {left:'medium',right:'medium',bottom:'medium'});
		sheet1Data.fill(9, 7, {type:'solid',fgColor:'8',bgColor:'64'});
		
		for(var indexStudent=0;indexStudent<req.body.pruebas.length;indexStudent++){
			sheet1Data.set(1, indexStudent+10, (indexStudent+1));
			sheet1Data.border(1,indexStudent+10, {top:'medium',bottom:'medium',right:'medium',left:'medium'});
			sheet1Data.set(2, indexStudent+10,req.body.pruebas[indexStudent].autorizacion);
			sheet1Data.border(2,indexStudent+10, {top:'medium',bottom:'medium',right:'medium',left:'medium'});					
			sheet1Data.set(3, indexStudent+10,req.body.pruebas[indexStudent].factura);
			sheet1Data.border(3,indexStudent+10, {top:'medium',bottom:'medium',right:'medium',left:'medium'});
			sheet1Data.set(4, indexStudent+10,req.body.pruebas[indexStudent].nit);
			sheet1Data.border(4,indexStudent+10, {top:'medium',bottom:'medium',right:'medium',left:'medium'});
			sheet1Data.set(5, indexStudent+10,req.body.pruebas[indexStudent].fecha);
			sheet1Data.border(5,indexStudent+10, {top:'medium',bottom:'medium',right:'medium',left:'medium'});
			sheet1Data.set(6, indexStudent+10,req.body.pruebas[indexStudent].monto);
			sheet1Data.border(6,indexStudent+10, {top:'medium',bottom:'medium',right:'medium',left:'medium'});
			sheet1Data.set(7, indexStudent+10,req.body.pruebas[indexStudent].llave_digital);
			sheet1Data.border(7,indexStudent+10, {top:'medium',bottom:'medium',right:'medium',left:'medium'});
			sheet1Data.set(8, indexStudent+10,req.body.pruebas[indexStudent].codigo_control_esperado);
			sheet1Data.border(8,indexStudent+10, {top:'medium',bottom:'medium',right:'medium',left:'medium'});
			sheet1Data.set(9, indexStudent+10,req.body.pruebas[indexStudent].codigo);
			sheet1Data.border(9,indexStudent+10, {top:'medium',bottom:'medium',right:'medium',left:'medium'});
		}
		
		workbookData.save(function(err){
			if (err)
				throw err;
			else
			{
				//res.sendfile('./reports/'+documentName);
			}
		});
		
		
		res.json({resultados:req.body.pruebas});
	});
}