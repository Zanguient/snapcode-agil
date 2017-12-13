module.exports=function(){
	var NumeroLiteral={
		
		prueba:function (numero){

			var res= this.Convertir(numero);

			console.log("CODIGO: "+res);
			return res;
		},
		
		UNIDADES:["", "un ", "dos ", "tres ", "cuatro ", "cinco ", "seis ", "siete ", "ocho ", "nueve "],
		DECENAS:["diez ", "once ", "doce ", "trece ", "catorce ", "quince ", "dieciseis ",
            "diecisiete ", "dieciocho ", "diecinueve ", "veinte ","veintiuno ","veintidos ","veintitres ","veinticuatro ",
			"veinticinco ","veintiseis ","veintisiete ","veintiocho ","veintinueve "
			, "treinta ", "cuarenta ",
            "cincuenta ", "sesenta ", "setenta ", "ochenta ", "noventa "],
        CENTENAS:["", "ciento ", "doscientos ", "trecientos ", "cuatrocientos ", "quinientos ", "seiscientos ",
            "setecientos ", "ochocientos ", "novecientos "],
			
		Convertir:function(numero) {
			var mayusculas = true;
			var literal = "";
			var parte_decimal;
			//si el numero utiliza (.) en lugar de (,) -> se reemplaza
			numero = numero.replace(".",",");
			//si el numero no tiene parte decimal, se le agrega ,00
			if(numero.indexOf(",")==-1){
				numero = numero + ",00";
			}console.log(numero);
			//se valida formato de entrada -> 0,00 y 999 999 999,00
			var re=/\d{1,9},\d{1,2}/;
			if (re.exec(numero)) {
				//se divide el numero 0000000,00 -> entero y decimal
				var Num=numero.split(",");
				//de da formato al numero decimal
				parte_decimal = Num[1] + "/100 Bolivianos.";
				//se convierte el numero a literal
				if (parseInt(Num[0]) == 0) {//si el valor es cero
					literal = "cero ";
				} else if (parseInt(Num[0]) > 999999) {//si es millon
					literal = this.getMillones(Num[0]);
				} else if (parseInt(Num[0]) > 999) {//si es miles
					literal = this.getMiles(Num[0]);
				} else if (parseInt(Num[0]) > 99) {//si es centena
					literal = this.getCentenas(Num[0]);
				} else if (parseInt(Num[0]) > 9) {//si es decena
					literal = this.getDecenas(Num[0]);
				} else {//sino unidades -> 9
					literal = this.getUnidades(Num[0]);
				}
				//devuelve el resultado en mayusculas o minusculas
				if (mayusculas) {
					return (literal + parte_decimal).toUpperCase();
				} else {
					return (literal + parte_decimal);
				}
			} else {//error, no se puede convertir
				console.log("entro null");
				return literal = null;
			}
		},
		
		getUnidades:function(numero) {// 1 - 9
			//si tuviera algun 0 antes se lo quita -> 09 = 9 o 009=9
			var num = numero.substring(numero.length - 1);
			return this.UNIDADES[parseInt(num)];
		},
		
		getDecenas:function(num) {// 99
			var n = parseInt(num);
			if (n < 10) {//para casos como -> 01 - 09
				return this.getUnidades(num);
			} else if (n > 29) {//para 30...99
				var u = this.getUnidades(num);
				if (u=="") { //para 30,40,50,60,70,80,90
					return this.DECENAS[parseInt(num.substring(0, 1)) + 17];
				} else {
					return this.DECENAS[parseInt(num.substring(0, 1)) + 17] + "y " + u;
				}
			} else if(n>19 && n<30) {//numeros entre 21 y 29
				var u = this.getUnidades(num);
				if (u=="") { //para 20
					return this.DECENAS[parseInt(num.substring(0, 1)) + 8];
				} else {
					return this.DECENAS[n - 10];
				}
			}else {//numeros entre 11 y 19
				return this.DECENAS[n - 10];
			}
		},
		
		getCentenas:function(num) {// 999 o 099
			if(parseInt(num)>99 ){//es centena
				if (parseInt(num) == 100) {//caso especial
					return " cien ";
				} else {
					return this.CENTENAS[parseInt(num.substring(0, 1))] + this.getDecenas(num.substring(1));
				}
			}else{//por Ej. 099
				//se quita el 0 antes de convertir a decenas
				return this.getDecenas(parseInt(num)+"");
			}
		},
		
		getMiles:function(numero) {// 999 999
			//obtiene las centenas
			var c = numero.substring(numero.length - 3);
			//obtiene los miles
			var m = numero.substring(0, numero.length - 3);
			var n="";
			//se comprueba que miles tenga valor entero
			if (parseInt(m) > 0) {
				n = this.getCentenas(m);
				return n + "mil " + this.getCentenas(c);
			} else {
				return "" + this.getCentenas(c);
			}

		},
		
		getMillones:function(numero) { //000 000 000
			//se obtiene los miles
			var miles = numero.substring(numero.length - 6);
			//se obtiene los millones
			var millon = numero.substring(0, numero.length - 6);
			var n = "";
			if(millon.length>1){
				n = this.getCentenas(millon) + "millones ";
			}else{
				n = this.getUnidades(millon) + "millon ";
			}
			return n + this.getMiles(miles);
		}
	}
	
	return NumeroLiteral;
	
}