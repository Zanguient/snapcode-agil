describe('pruebas cotizacion agil', function () {
  browser.driver.manage().window().maximize();
  var usuario = element(By.id('nick'));
  var clave = element(By.id('clave'));
  var login_button = element(By.id('ingresarlogin'));
  var contador = 0;
  var cotizacion_tamano_final;
  var detalle_tamano_final;
  var cotizacion_lista_final;
  var detalle_lista_final;
  //saca la info de inv_cotizacion

  var ConnectDatabase = require("../connectDatabase.js");

  let test_cotizacion = require('../test_cotizacion.json');

  //console.log(test_cotizacion);

  var connectDatabase = new ConnectDatabase();
  connectDatabase.connection.connect();//conecta a la base de datos
  browser.driver.sleep(2000);

  var producto_sql = 'SELECT * FROM agil_producto where empresa=16';
  var producto_lista = []

  var cotizacion_sql = 'SELECT COUNT(*) as cotitamano FROM inv_cotizacion';
  var cotizacion_lista = []

  var detalle_sql = 'SELECT COUNT(*) as detcotitamano FROM inv_detalle_cotizacion';
  var detalle_lista = []

  connectDatabase.connection.query(producto_sql, function (err, rows) {
    if (!err) { //copia toda la lista en la variable prodlist
      producto_lista = rows  //muestra los objetos dentro de la BD que especificamos
      console.log(producto_lista.length);
    }
  });

  connectDatabase.connection.query(cotizacion_sql, function (err, coti_rows) {
    if (!err) { //copia toda la lista en la variable prodlist
      cotizacion_lista = coti_rows[0]["cotitamano"] //muestra los objetos dentro de la BD que especificamos
      console.log("tamaño de la lista coti: " + cotizacion_lista);
      // console.log(coti_rows);
    }
  });

  //console.log("cotizacion lista: "+cotizacion_lista);
  connectDatabase.connection.query(detalle_sql, function (err, detcoti_rows) {
    if (!err) { //copia toda la lista en la variable prodlist
      detalle_lista = detcoti_rows[0]["detcotitamano"]  //muestra los objetos dentro de la BD que especificamos
      console.log("tamaño de la lista det coti: " + detalle_lista);
      //console.log(detcoti_rows);
    }
  });


  it('Prueba Cotizacion Agil', function (PruebaCotizacion) {
    browser.get('http://localhost:8083/#/', 2000);
    setTimeout(function () {
      browser.driver.sleep(2000);
      //hacer que el usuario y pass los lea desde otro JS
      usuario.sendKeys(test_cotizacion.usuario);//loguea
      clave.sendKeys(test_cotizacion.clave);
      browser.driver.sleep(5000)
      login_button.click();
      browser.driver.sleep(10000).then(function () {
        browser.driver.sleep(5000);
        //--<< por la URL>>--
        //browser.get('http://localhost:8083/#/cotizacion', 5000);
        element(By.id('cotizacion2')).click();
      });
      browser.driver.sleep(5000).then(function () {
      });
      browser.driver.sleep(4000);
      element(By.id('nuevo')).click();
      browser.driver.sleep(2000);
      element(By.model('cotizacion.nombre')).sendKeys(test_cotizacion.nombre); //introduce toda la info en los campos
      element(By.model('cotizacion.sucursal')).sendKeys(test_cotizacion.sucursal);
      element(by.model('cotizacion.descripcion')).sendKeys(test_cotizacion.descripcion);
      //element(By.model('cotizacion.fechaTexto')).sendKeys('06/10/2017');
      browser.driver.sleep(1000);
      if (contador < test_cotizacion.cantidad_pruebas) {
        while (contador < test_cotizacion.cantidad_pruebas) //bucle para agregar X cantidad de objetos
        {
          contador = contador + 1;

          var numero_random = Math.floor(Math.random() * (producto_lista.length - 0)) + 0; //genera un num random
          // element(By.id('id_productoTB')).sendKeys('tornil'); // de forma manual coloca escribe "tornil" para buscar el tornillo

          element(By.id('id_productoTB')).sendKeys(producto_lista[numero_random].nombre); //coloca el nombre tornillo que es el primer nombre objeto de la lista productos
          console.log("numero random " + contador + ": " + numero_random);
          browser.driver.sleep(4000);

          element.all(by.css('.ng-isolate-scope li')).then(function (items) { //genera un numero random y elige de la lista desplegable

            expect(items.length).toBe(items.length);

            var random_lista = Math.floor((Math.random() * items.length) + 0);

            console.log("random: " + random_lista);
            expect(items[random_lista].click());
          });
          element(By.id('cantidadTB')).sendKeys(contador); //coloca una cantidad igual al contador

          browser.driver.sleep(1000).then;
          element(By.id('agregar_detalle_cotizacionTB')).click(); //click en agregar
          browser.driver.sleep(1000);
        }
        element(By.id('guardarCotizacion')).click()
      }
      browser.driver.sleep(2000).then(function () {
        ;

        cotizacion_tamano_final = 'SELECT COUNT(*) as cotitamano FROM inv_cotizacion';
        browser.driver.sleep(1000);
        connectDatabase.connection.query(cotizacion_tamano_final, function (err, cotizacion_row_final) {
          if (!err) { //copia toda la lista en la variable prodlist
            cotizacion_lista_final = cotizacion_row_final[0]["cotitamano"] //muestra los objetos dentro de la BD que especificamos
            // console.log("Tamaño Final coti: "+cotizacion_lista_final);
          }
        });

        detalle_tamano_final = 'SELECT COUNT(*) as detcotitamano FROM inv_detalle_cotizacion';
        browser.driver.sleep(1000);
        connectDatabase.connection.query(detalle_tamano_final, function (err, detalle_rows_final) {
          if (!err) { //copia toda la lista en la variable prodlist
            detalle_lista_final = detalle_rows_final[0]["detcotitamano"]  //muestra los objetos dentro de la BD que especificamos
            //console.log("Tamaño final detalle coti: "+detalle_lista_final);
          }
        });
      });
      browser.driver.sleep(2000).then(function () {
        console.log();

        // var EC = protractor.ExpectedConditions;
        // Waits for an alert pops up.

        if (cotizacion_lista < cotizacion_lista_final) {
          // browser.wait(EC.alertIsPresent=(cotizacion_lista<cotizacion_lista_final)("¡¡PRUEBA REALIZADA EXITOSAMENTE!!"), 5000);
          console.log("¡¡PRUEBA REALIZADA EXITOSAMENTE!!")
        }
        else
        { console.log("FALLO EN LA PRUEBA") }

        console.log("Tamaño Final coti: " + cotizacion_lista_final);
        console.log("Tamaño final detalle coti: " + detalle_lista_final)
        browser.driver.sleep(5000);

      });
      element(by.buttonText("OK")).click();
      /*expect((buttonText('OK')).toBe(buttonText('OK')));
      element(by.buttonText('OK')).click().then(function(){
      browser.driver.sleep(4000)
      console.log("le hizo click");*/

    }, 4000);


  });


});
