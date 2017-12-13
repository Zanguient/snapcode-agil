describe('Pruebas Ventas Facturacion', function () {
    browser.driver.manage().window().maximize();
  var usuario = element(By.id('nick'));
  var clave = element(By.id('clave'));
  var login_button = element(By.id('ingresarlogin'));
  var contador = 0;
  var venta_cancelada = 0;
  var producto_agregado = 0;
  var cantidad_producto;
  var costo_producto = 0;
  var pago_producto_total = 0;
  var pago_credito = 0;
  //var PrimProd = 0;

  var ConnectDatabase = require("../connectDatabase.js");
  var test_ventas = require('../test_ventas.json');

  var connectDatabase = new ConnectDatabase();
  connectDatabase.connection.connect();//conecta a la base de datos
  browser.driver.sleep(2000);

  var producto_DB = 'SELECT * FROM agil_producto where empresa=16 LIMIT 280';
  var producto_lista = []


  connectDatabase.connection.query(producto_DB, function (err, rows) {
    if (!err) { //copia toda la lista en la variable prodlist
      producto_lista = rows  //muestra los objetos dentro de la BD que especificamos
    }
  });

  var inventario_DB = 'SELECT * FROM inv_inventario where empresa=16 LIMIT 280';
  var inventario_lista = []

  connectDatabase.connection.query(inventario_DB, function (err, rows) {
    if (!err) { //copia toda la lista en la variable prodlist
      inventario_lista = rows  //muestra los objetos dentro de la BD que especificamos
    }
  });

  it('Prueba Ventas Agil', function () {
    browser.get('http://localhost:8083/#/')
    setTimeout(function () {
      browser.driver.sleep(2000);
      //hacer que el usuario y pass los lea desde otro JS
      usuario.sendKeys(test_ventas.usuario);//loguea
      clave.sendKeys(test_ventas.clave);
      login_button.click();
      browser.driver.sleep(3000).then(function () {
        browser.driver.sleep(5000);
        element(By.id('ventas2')).click();
      });
      browser.driver.sleep(2000)
      element(By.id('nuevo')).click();

      browser.driver.sleep(3000);
      element(By.model('venta.movimiento')).sendKeys(test_ventas.movimiento);
      browser.driver.sleep(1000);
      element(By.model('venta.sucursal')).sendKeys(test_ventas.sucursal);
      element(By.model('venta.almacen')).sendKeys(test_ventas.almacen);
      browser.driver.sleep(1000);
    }, 2000);
    setTimeout(function () {
      if ((test_ventas.movimiento == "FACTURACIÓN") || (test_ventas.movimiento == "PROFORMA")) {
        browser.driver.sleep(1000);
        element(By.model('venta.cliente.nit')).sendKeys(test_ventas.nit);
        element(By.model('venta.cliente.razon_social')).sendKeys(test_ventas.razon_social);
        element(By.model('venta.vendedor')).sendKeys(test_ventas.vendedor);
        element(By.model('venta.tipoPago')).sendKeys(test_ventas.tipo_pago);
        browser.driver.sleep(1000);
      }
      else
        if (test_ventas.movimiento == "FACTURACIÓN") {
          element(By.model('venta.actividad')).sendKeys(test_ventas.actividad);
        }
        else
          if (test_ventas.movimiento == "TRASPASO") {
            element(By.model('venta.sucursalDestino')).sendKeys(test_ventas.sucursal_destino);
            element(By.model('venta.almacen')).sendKeys(test_ventas.almacen_origen);
            element(By.model('venta.almacenDestino')).sendKeys(test_ventas.almacen_destino);
          }

      browser.driver.sleep(1000);
    }, 2000);
    setTimeout(function () {
      
      while (contador < test_ventas.cantidad_pruebas) //bucle para agregar X cantidad de objetos
      {
        contador = contador + 1;

        var numero_random = Math.floor(Math.random() * (producto_lista.length - 0)) + 0; //genera un num random
        //element(By.id('id_producto')).sendKeys('tornil'); // de forma manual coloca escribe "tornil" para buscar el tornillo

        //Por su Codigo//
        var producto = producto_lista[numero_random].codigo; //CODIGO del producto random
        //var ProdID = producto_lista[numero_random].id;//ID del producto random

        console.log("Codigo del Prod :" + producto);
        //console.log("ID del Prod :" + ProdID); //saca el id de la list prod

        //Por su nombre//
        //var producto = producto_lista[numero_random].nombre;

        element(By.id('id_producto')).sendKeys(producto); //coloca el ID de un objeto Random de la lista productos

        //console.log("numero random " + contador + ": " + numero_random);
        browser.driver.sleep(3000)
        element.all(by.css('.ng-isolate-scope li')).then(function (items) { //genera un numero random y elige de la lista desplegable
          console.log('lleeeego a la parte de agregar productossdsss');
          expect(items.length).toBe(items.length);

          var random = Math.floor((Math.random() * items.length) + 0);
          browser.sleep(2000);
          expect(items[random].click());
          browser.sleep(2000);

          element(by.id('CantProd')).getText().then(function (text) {
            cantidad_producto = text; //saca la cantidad de prod en el inv
            browser.sleep(4000);
          });

          browser.sleep(1000).then(function () {

            if (cantidad_producto <= 0) {
              venta_cancelada = venta_cancelada + 1;
              console.log("Productos Agotados: " + venta_cancelada);
              element(By.id('id_producto')).clear() //limpia el cuadro de texto
              browser.sleep(3000);
            }

            else
              if (cantidad_producto > 0) {
                console.log("El Producto se agrego satisfactoriamente");
                producto_agregado = producto_agregado + 1;
                console.log("Productos Agregados :" + producto_agregado);
                element(by.id('Precio')).getText().then(function (text) {
                  var pago_texto = text; //saca el precio del prod en el inv
                  costo_producto = parseInt(pago_texto);
                  pago_producto_total = (pago_producto_total + costo_producto); //total a pagar
                  console.log("Precio Total :" + pago_producto_total); //precio del producto guardado
                });
                element(By.id('cantidad')).sendKeys("1");//coloca una cantidad 1
                element(By.id('agregar_detalle_venta')).click(); // en agregar
                browser.sleep(3000);
              }
          });
        });
      }
      browser.sleep(3000).then(function () {
        if (producto_agregado == 0) {
          console.log(">>>>No se encontraron los productos en el inventario: <<<<");
          console.log("Agregados Exitosamente: " + producto_agregado);
          browser.sleep(3000).then(function () {
            element(By.id('cerrarV')).click();
          });
          browser.sleep(5000).then(function () {
          });
        }
        else
          if (producto_agregado > 0) {
            console.log(">>>>El numero de productos EXITOSOS es: " + producto_agregado);
            console.log(">>>>El numero FALLOS es: " + venta_cancelada);
            if ((test_ventas.tipo_pago == "CONTADO") && ((test_ventas.movimiento == "FACTURACIÓN") || (test_ventas.movimiento == "PROFORMA"))) {
              element(By.id('pagado')).sendKeys(pago_producto_total); //coloca el total a pagar en el campo pagado
            }
            else
              if ((test_ventas.tipo_pago == "CREDITO") && ((test_ventas.movimiento == "FACTURACIÓN") || (test_ventas.movimiento == "PROFORMA"))) {
                pago_credito = (pago_producto_total / 2);
                element(By.model('venta.a_cuenta')).sendKeys(pago_credito);
                element(By.model('venta.dias_credito')).sendKeys(test_ventas.dias);
                browser.sleep(3000);
                element(By.id('pagado')).clear()
                element(By.id('pagado')).sendKeys(pago_credito);
              }
            browser.sleep(8000).then(function () {
              element(By.id('guardarV')).click();
            });
            browser.sleep(8000).then(function () {
              element(By.id('mensaje')).click();
            });
            browser.sleep(5000).then(function () {
            });
          }
      });
    }, 2000);
  });
});