module.exports=function(){
	var CodigoControl={
		prueba:function (){
			var llaveDosifi="u3M[zts3Bnnj4-dNbE[6Imj_=e}}vUd}@u\)=dXaDY\\CKiu_q\)7mvHefH#c7F$B";
			
			var numAutorizacion="1904008086256";
			
			var numFactura="853093";
			
			var numNITCliente="326602012";

			var fechaTrans="20070105";
			
			var montoTrans=13954.00;

			var res= this.obtenerCodigoControl(numAutorizacion,numFactura,numNITCliente,fechaTrans,montoTrans,llaveDosifi);

			console.log("CODIGO: "+res);
			return res;
		},
		obtenerCodigoControl:function(numAutorizacion,numFactura,numNITCliente,fechaTrans,montoTrans,llaveDosifi){
			console.log("DATOS FACT: "+numAutorizacion+" - "+numFactura+" - "+numNITCliente+" - "+fechaTrans+" - "+montoTrans+" - "+llaveDosifi);
			var numeroAutorizacion= numAutorizacion;	
			var numeroFactura     = this.juntarVerhoeff(numFactura   );
			var numeroNITCliente  = this.juntarVerhoeff(numNITCliente);		
			var fechaTransacion   = this.juntarVerhoeff(fechaTrans   );
			var montoTransacion   = this.juntarVerhoeff(this.redondearNumero(montoTrans,0)+"");	
			var llaveDosificacion = llaveDosifi;	
			var sumaVerhoeff= parseInt(numeroFactura)+parseInt(numeroNITCliente)+parseInt(fechaTransacion)+parseInt(montoTransacion);
			var numeroVerhoeff= this.obtenerVerhoeffSuma(sumaVerhoeff+"");
			var indice= 0;
			var cadena1= llaveDosificacion.substring(indice,(indice+numeroVerhoeff[0]+1)); indice= indice + numeroVerhoeff[0]+1;
			var cadena2= llaveDosificacion.substring(indice,(indice+numeroVerhoeff[1]+1)); indice= indice + numeroVerhoeff[1]+1;
			var cadena3= llaveDosificacion.substring(indice,(indice+numeroVerhoeff[2]+1)); indice= indice + numeroVerhoeff[2]+1;
			var cadena4= llaveDosificacion.substring(indice,(indice+numeroVerhoeff[3]+1)); indice= indice + numeroVerhoeff[3]+1;
			var cadena5= llaveDosificacion.substring(indice,(indice+numeroVerhoeff[4]+1)); indice= indice + numeroVerhoeff[4]+1;
			numeroAutorizacion= numeroAutorizacion + cadena1;
			numeroFactura=      numeroFactura      + cadena2;
			numeroNITCliente=   numeroNITCliente   + cadena3;	
			fechaTransacion=    fechaTransacion    + cadena4;	
			montoTransacion=    montoTransacion    + cadena5;
			var sumaConcatenada= numeroAutorizacion + numeroFactura + numeroNITCliente + fechaTransacion + montoTransacion;
			var llaveCifrado= llaveDosificacion + numeroVerhoeff[0] + numeroVerhoeff[1] + numeroVerhoeff[2] + numeroVerhoeff[3] + numeroVerhoeff[4];  
			var cadenaCifrada= this.cifrarMensajeRC4(sumaConcatenada,llaveCifrado).replace(/-/g,"");
			var sumTotalASCII= this.sumatoriaTotalASCII(cadenaCifrada);
			console.log("sumTotalASCII:"+sumTotalASCII);
			var sumParcialASCII= this.sumatoriaParcialASCII(cadenaCifrada);
			sumParcialASCII[0]= parseInt((sumParcialASCII[0] * sumTotalASCII) / (numeroVerhoeff[0]+1));		
			sumParcialASCII[1]= parseInt((sumParcialASCII[1] * sumTotalASCII) / (numeroVerhoeff[1]+1));
			sumParcialASCII[2]= parseInt((sumParcialASCII[2] * sumTotalASCII) / (numeroVerhoeff[2]+1));
			sumParcialASCII[3]= parseInt((sumParcialASCII[3] * sumTotalASCII) / (numeroVerhoeff[3]+1));
			sumParcialASCII[4]= parseInt((sumParcialASCII[4] * sumTotalASCII) / (numeroVerhoeff[4]+1));
			var sumaASCII= sumParcialASCII[0] + sumParcialASCII[1] + sumParcialASCII[2] + sumParcialASCII[3] + sumParcialASCII[4];
			var cadenaBase64= this.obtenerBase64(sumaASCII);
			return this.cifrarMensajeRC4(cadenaBase64,llaveCifrado);
		},
		invertirCadena:function (cadena){
			var cadenaInvertida= "";
			for (var i=cadena.length-1; i>=0; i--)
			{
				cadenaInvertida = cadenaInvertida + cadena[i];
			}
			return cadenaInvertida.split('');
		},
		obtenerVerhoeff:function (cifra) {
			var Mul=[[0,1,2,3,4,5,6,7,8,9],
					 [1,2,3,4,0,6,7,8,9,5],
					 [2,3,4,0,1,7,8,9,5,6],
					 [3,4,0,1,2,8,9,5,6,7],
					 [4,0,1,2,3,9,5,6,7,8],
					 [5,9,8,7,6,0,4,3,2,1],
					 [6,5,9,8,7,1,0,4,3,2],
					 [7,6,5,9,8,2,1,0,4,3],
					 [8,7,6,5,9,3,2,1,0,4],
					 [9,8,7,6,5,4,3,2,1,0]];
			
			var Per=[[0,1,2,3,4,5,6,7,8,9],
					 [1,5,7,6,2,8,3,0,9,4],
					 [5,8,0,3,7,9,6,1,4,2],
					 [8,9,1,6,0,4,3,5,2,7],
					 [9,4,5,3,1,2,6,8,7,0],
					 [4,2,8,6,5,7,3,9,0,1],
					 [2,7,9,3,8,0,6,4,1,5],
					 [7,0,4,6,9,1,3,2,5,8]];
					 
			var Inv = [0,4,3,2,1,5,6,7,8,9] , Check = 0;
			var NumeroInvertido = this.invertirCadena(cifra);
			for( var i= 0; i<NumeroInvertido.length; i++){
				Check = Mul[Check][ Per[((i + 1) % 8)][parseInt(NumeroInvertido[i]+"")] ];
			}   
			return Inv[Check];  		
		},
		juntarVerhoeff:function (cifra) {
			var cifraVerhoeff1= ""+this.obtenerVerhoeff(cifra);
			var cifraVerhoeff2= ""+this.obtenerVerhoeff(cifra+cifraVerhoeff1);
			return  cifra+cifraVerhoeff1+cifraVerhoeff2;
		},
		redondearNumero:function (numero,decimales ) {
			return parseInt(Math.round(numero*Math.pow(10,decimales))/Math.pow(10,decimales),10);    	
		},
		obtenerVerhoeffSuma:function (cifra) {
			var cifraVerhoeff=new Array(5);
			cifraVerhoeff[0]= this.obtenerVerhoeff(cifra);
			cifraVerhoeff[1]= this.obtenerVerhoeff(cifra+cifraVerhoeff[0]);
			cifraVerhoeff[2]= this.obtenerVerhoeff(cifra+cifraVerhoeff[0]+cifraVerhoeff[1]);
			cifraVerhoeff[3]= this.obtenerVerhoeff(cifra+cifraVerhoeff[0]+cifraVerhoeff[1]+cifraVerhoeff[2]);
			cifraVerhoeff[4]= this.obtenerVerhoeff(cifra+cifraVerhoeff[0]+cifraVerhoeff[1]+cifraVerhoeff[2]+cifraVerhoeff[3]);
			return cifraVerhoeff;
		},
		obtenerBase64:function (numero) { 
			var Dicionario= ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 
								'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 
								'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 
								'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 
								'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 
								'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 
								'y', 'z', '+', '/' ]; 
			var Cociente = 1, Resto;			
			var Palabra = ""; 
			while (Cociente > 0) { 
				Cociente = parseInt(numero / 64); 
				Resto =    numero % 64; 
				Palabra = Dicionario[Resto] + Palabra;
				numero = Cociente; 
			}
			return Palabra;   
	   },
	   convierteAHexadecimal:function (numero) {
			var cad= numero.toString(16);
			if(cad.length==1){
				return "0"+cad;
			}
			else{
				return cad;
			}
		},
		cifrarMensajeRC4:function (mensaje,key) {
			var mensajeCifrado="";
			var state=new Array(256);			
			var x=0,  y= 0; 
			var index1 = 0; 
			var index2 = 0;
			var NMen   =-1;
			for(var i=0; i<state.length; i++){
				state[i]= i;
			}
			for(var i=0; i<state.length; i++) {
				index2= (key.charCodeAt(index1)+state[i]+index2) % 256;
				var    temp  = state[  i   ];
				state[  i   ]= state[index2]; 
				state[index2]= temp;
				index1= (index1+1) % key.length;			
			}
			for(var i=0; i<mensaje.length; i++) {
				x= (    x+1   ) % 256;
				y= (state[x]+y) % 256;
				var temp= state[x];
				state[x]= state[y]; 
				state[y]= temp;
				NMen= (mensaje.charCodeAt(i)) ^ state[ (state[x]+state[y]) % 256 ];
				mensajeCifrado= mensajeCifrado+"-" + this.convierteAHexadecimal(NMen);
			}
			mensajeCifrado= mensajeCifrado.substr(1,mensajeCifrado.length);
			return mensajeCifrado.toUpperCase(); 
		},
		sumatoriaTotalASCII:function (cadena) {
			var suma= 0;
			for(var i=0;i<cadena.length;i++) 
			{
				suma= suma + (cadena.charCodeAt(i));
			}
			return suma;
		},
		sumatoriaParcialASCII:function (cadena) {
			var suma=[0,0,0,0,0];
			
			for(var i=0; i<cadena.length; i= i+5 ){ 
				suma[0]= suma[0] + (cadena.charCodeAt(i  ));
			}
			
			for(var i=1; i<cadena.length; i= i+5 ){ 
				suma[1]= suma[1] + (cadena.charCodeAt(i));
			}
			
			for(var i=2; i<cadena.length; i= i+5 ){
				suma[2]= suma[2] + (cadena.charCodeAt(i));
			}
			
			for(var i=3; i<cadena.length; i= i+5 ){ 
				suma[3]= suma[3] + (cadena.charCodeAt(i));
			}
			
			for(var i=4; i<cadena.length; i= i+5 ){ 
				suma[4]= suma[4] + (cadena.charCodeAt(i));
			}
			return suma;
		}
	}
	
	return CodigoControl;
	
}