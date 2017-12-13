describe('Pruebas Ventas Facturacion', function () {
  browser.driver.manage().window().maximize();
  var usuario = element(By.id('nick'));
  var clave = element(By.id('clave'));
  var login_button = element(By.id('ingresarlogin'));

  var contador = 0;
  var descuentos_generales = element(By.id('descuentos_generales'));
  var descuentos = element(By.id("descuentos"));
  var recargos = element(By.id("recargos"));
  var pago_texto;
  var pago_int;
  var random;

  var ConnectDatabase = require("../connectDatabase.js");
  let test_compras = require('../test_compras.json');

  var connectDatabase = new ConnectDatabase();
  connectDatabase.connection.connect();//conecta a la base de datos
  browser.driver.sleep(2000);

  var producto_DB = 'SELECT * FROM agil_producto where empresa=1 LIMIT 280';
  var producto_lista = []

  connectDatabase.connection.query(producto_DB, function (err, rows) {
    if (!err) { //copia toda la lista en la variable prodlist
      producto_lista = rows  //muestra los objetos dentro de la BD que especificamos
    }
  });

  it('Prueba Ventas Agil', function () {
    browser.get('http://localhost:8083/#/')
    setTimeout(function () {
      browser.driver.sleep(2000);
      //hacer que el usuario y pass los lea desde otro JS
      usuario.sendKeys(test_compras.usuario);//loguea
      clave.sendKeys(test_compras.clave);
      login_button.click();
      browser.driver.sleep(3000).then(function () {
        browser.driver.sleep(5000);
        element(By.id('compras2')).click();
      });
      browser.driver.sleep(2000)
      element(By.id('nuevaCompra')).click();
      browser.driver.sleep(3000);
      element(By.id('razon_social')).sendKeys(test_compras.razon_social);
      browser.driver.sleep(3000);

      element.all(by.css('.ng-isolate-scope li')).then(function (items) {
        browser.driver.sleep(3000);
        expect(items.length).toBe(items.length);
        random = Math.floor((Math.random() * items.length) + 0);
        expect(items[random].click());
      });
      element(By.id('factura')).sendKeys(test_compras.num_factura);
      browser.driver.sleep(1000);
      element(By.model('compra.autorizacion')).clear();
      element(By.model('compra.autorizacion')).sendKeys(test_compras.num_autorizacion);
      browser.driver.sleep(3000);
      element(By.model('compra.codigo_control')).clear();
      element(By.model('compra.codigo_control')).sendKeys(test_compras.codigo_control);
      browser.driver.sleep(3000);
      element(By.model('compra.sucursal')).sendKeys(test_compras.sucursal)

      if (test_compras.tipo_pago == "contado") {
        element(By.model("compra.tipoPago")).sendKeys("CONTADO");
        browser.driver.sleep(3000);
      }
      else  // -- Credito  --
        if (test_compras.tipo_pago == "credito") {
          console.log("entro credito");
          browser.driver.sleep(3000);
          element(By.model("compra.tipoPago")).sendKeys("CREDITO");
          dias_random = Math.floor(Math.random() * (30 - 0) + 1);
          element(By.model("compra.dias_credito")).sendKeys(dias_random);
        }
      //-- Descuentos Generales --
      if (test_compras.descuentos_generales == "si") {
        console.log("entro descuentos generales");
        browser.driver.sleep(3000)
        expect(descuentos_generales.isSelected()).toBe(false).then(function () {
          descuentos_generales.click()
        });
        //-- Descuentos Porcentaje --
        if (test_compras.descuentos == "porcentaje") {
          console.log("entro descuentos porcentaje");
          browser.driver.sleep(3000);
          expect(descuentos.isSelected()).toBe(false).then(function () {
            descuentos.click();
          });
          browser.driver.sleep(3000);
          element(By.model("compra.descuento")).clear();
          element(By.model("compra.descuento")).sendKeys(test_compras.descuentos_porcentaje);
          browser.driver.sleep(3000);
          element(By.model("compra.ice")).clear();
          element(By.model("compra.ice")).sendKeys(test_compras.ICE_porcentaje);
        }
        else    //-- Descuentos Bs --
          if (test_compras.descuentos == "Bs") {
            console.log("entro descuento Bs");
            browser.driver.sleep(3000);
            element(By.model("compra.descuento")).clear();
            element(By.model("compra.descuento")).sendKeys(test_compras.descuentos_Bs);
            browser.driver.sleep(3000);
            element(By.model("compra.ice")).clear();
            element(By.model("compra.ice")).sendKeys(test_compras.ICE_Bs);
          }
        // -- Recargos Porcentaje 

        if (test_compras.regargos == "porcentaje") {
          console.log("entro recargos porcentaje");
          browser.driver.sleep(3000);
          expect(recargos.isSelected()).toBe(false).then(function () {
            recargos.click();
          });
          browser.driver.sleep(3000);
          element(By.model("compra.recargo")).clear();
          element(By.model("compra.recargo")).sendKeys(test_compras.recargos_porcentaje);
          browser.driver.sleep(3000);
          element(By.model("compra.excento")).clear();
          element(By.model("compra.excento")).sendKeys(test_compras.excentos_porcentaje);
        }
        else    // -- Recargos Bs
          if (test_compras.recargos == "Bs") {
            console.log("entro recargos BS");
            element(By.model("compra.recargo")).clear();
            element(By.model("compra.recargo")).sendKeys(test_compras.recargos_Bs);
            browser.driver.sleep(3000);
            element(By.model("compra.excento")).clear();
            element(By.model("compra.excento")).sendKeys(test_compras.excentos_Bs);
          }
      }
      else
        if (test_compras.descuentos_generales == "no") {
          console.log("Entro en NO generales : ");
        }
      browser.driver.sleep(1000)

      while (contador < test_compras.cantidad_pruebas) {
        element(By.id("centro_costo")).sendKeys(test_compras.centro_costo);

        element.all(by.css('.ng-isolate-scope li')).then(function (items) {
          expect(items.length).toBe(items.length);
          browser.sleep(2000);
          expect(items[0].click()); //click en la posicion 0 de la lista
        });
        browser.driver.sleep(3000)

        random = Math.floor(Math.random() * (producto_lista.length - 0)) + 0; //genera un num random
        var producto = producto_lista[random].codigo; //CODIGO del producto random
        element(By.id('id_producto')).sendKeys(producto); //coloca el ID de un objeto Random de la lista productos

        browser.driver.sleep(3000)
        element.all(by.css('.ng-isolate-scope li')).then(function (items) { //genera un numero random y elige de la lista desplegable
          expect(items.length).toBe(items.length);
          random = Math.floor((Math.random() * items.length) + 0);
          browser.sleep(2000);
          expect(items[random].click());
          browser.sleep(2000);
        });

        element(By.id("fecha_vencimiento")).sendKeys(test_compras.fecha);
        browser.driver.sleep(3000)
        random = Math.floor(Math.random() * (10 - 0)) + 1
        browser.driver.sleep(3000)
        element(By.id("costo_unitario")).sendKeys(random);
        browser.driver.sleep(3000)
        element(By.id("cantidad")).sendKeys(random);
        browser.driver.sleep(1000).then(function () {
          element(By.id("agregar_detalle_compra")).click();
        });

        contador = contador + 1;
      }
      if (test_compras.tipo_pago == "credito") {
        element(By.id("total_compra")).getText().then(function (text) {
          pago_texto = text;
          pago_int = parseInt(pago_texto);
          element(By.model("compra.a_cuenta")).sendKeys(pago_int / 2);
        });
      }
      browser.pause();
      element(by.id('btnguardar')).click();
      browser.pause();
    }, 2000);
  });
});