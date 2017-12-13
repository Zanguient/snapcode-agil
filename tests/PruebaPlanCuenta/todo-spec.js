describe('Pruebas Plan Cuentas', function () {
  browser.driver.manage().window().maximize();
  var usuario = element(By.id('nick'));
  var clave = element(By.id('clave'));
  var login_button = element(By.id('ingresarlogin'));
  var random_debe = Math.floor(Math.random() * (500 - 250)) + 0;
  var random_haber = Math.floor(Math.random() * (250 - 0)) + 0;
  var random_monto = Math.floor(Math.random() * (250 - 0)) + 0
  var numero_random = Math.floor(Math.random() * (100 - 0)) + 0;
  var saldo = (random_debe - random_haber)
  var check_bimonetaria = element(By.id('check_bimonetaria'));
  var check_vincular_cuenta = element(By.id('check_vincular_cuenta'));
  var check_calculo = element(By.id('check_calculo'));

  var cuenta_lista = [];
  var clasificacion_lista = [];
  var operacion_lista = [];

  var contador = 0;
  var contador2 = 0;

  let test_plan_cuenta = require('../test_plan_cuenta.json');

  it('Prueba Plan Cuenta Agil', function () {
    browser.get('http://localhost:8083/#/')
    setTimeout(function () {
      browser.driver.sleep(2000);
      //hacer que el usuario y pass los lea desde otro JS
      usuario.sendKeys(test_plan_cuenta.usuario);//loguea
      clave.sendKeys(test_plan_cuenta.clave);
      login_button.click();
      browser.driver.sleep(3000).then(function () {
        browser.driver.sleep(5000);
        element(By.id('contabilidad-cuenta2')).click();
      });
      browser.driver.sleep(2000)

      element(By.id('nuevo')).click().then(function () {

        browser.driver.sleep(2000)
        element(By.id('codigoC')).sendKeys(numero_random);
      });
      element(By.id('Nombre')).sendKeys("Cuenta - " + numero_random);
      browser.driver.sleep(1000);
      element(By.id('descripcion')).sendKeys(test_plan_cuenta.descripcion)

      //-->Limpia la 1ra lista<--
      element.all(by.options("clasificacionCuenta as clasificacionCuenta.nombre for clasificacionCuenta in cuentaClasificaciones track by clasificacionCuenta.id")).getText().then(function (text) {

        tamaño = text.length;
        while (contador < tamaño) {
          if (text[contador] != "") {
            clasificacion_lista[contador2] = text[contador];
            contador2 = contador2 + 1;
          }
          contador = contador + 1
        }
        //<<--Imprime la 1ra lista nueva-->>
        var random_clasificacion = Math.floor(Math.random() * (contador2 - 0) + 0);
        var posicion_clasificacion = clasificacion_lista[random_clasificacion];
        element(By.id("clasificacionC")).sendKeys(posicion_clasificacion);
      });

      //-->Limpia la 2da lista<--//

      element.all(by.options("cuentaTipo as cuentaTipo.nombre for cuentaTipo in cuentaTipos track by cuentaTipo.id")).getText().then(function (text2) {
        tamaño2 = text2.length;

        contador = 0;
        contador2 = 0;
        //-->Limpia la lista<-- 
        while (contador < tamaño2) {
          if (text2[contador] != "") {
            cuenta_lista[contador2] = text2[contador];
            contador2 = contador2 + 1;
          }
          contador = contador + 1
        }
        //<<--Imprime la 2da lista nueva-->>
        var random_cuenta = Math.floor(Math.random() * (contador2 - 0) + 0);
        var posicion_cuenta = cuenta_lista[random_cuenta];
        element(By.id("tipoCuentaC")).sendKeys(posicion_cuenta);
        browser.driver.sleep(2000)
      });

      element(By.id("siguiente")).click();
      browser.driver.sleep(1000);
      element(By.id('debeC')).sendKeys(random_debe);
      element(By.id('haberC')).sendKeys(random_haber);
      element(By.id('saldoC')).sendKeys(saldo);
      browser.driver.sleep(1000)
    }, 2000);
    setTimeout(function () {
      if (test_plan_cuenta.bimonetaria == "si") {
        expect(check_bimonetaria.isSelected()).toBe(false).then(function () {
          check_bimonetaria.click();
          expect(check_bimonetaria.isSelected()).toBe(true);
        });
      }
      browser.driver.sleep(1000);
      if (test_plan_cuenta.vincular_cuenta == "provedor") {
        expect(check_vincular_cuenta.isSelected()).toBe(false).then(function () {
          check_vincular_cuenta.click();
          expect(check_vincular_cuenta.isSelected()).toBe(true);
          element(By.id('razon_social')).sendKeys(test_plan_cuenta.razon_social)
          browser.driver.sleep(1000);
          element.all(by.css('.ng-isolate-scope li')).then(function (items) { //genera un numero random y elige de la lista desplegable
            expect(items.length).toBe(items.length);
            var random_lista = Math.floor((Math.random() * items.length) + 0);
            browser.driver.sleep(1000);
            expect(items[random_lista].click());
          });
        });
      }
      else {
        element(By.id('razon_socialC')).sendKeys(test_plan_cuenta.razon_social)
        browser.driver.sleep(1000);
        element.all(by.css('.ng-isolate-scope li')).then(function (items) { //genera un numero random y elige de la lista desplegable
          expect(items.length).toBe(items.length);
          var random_lista = Math.floor((Math.random() * items.length) + 0);
          browser.driver.sleep(1000);
          expect(items[random_lista].click());
        });
      }
      browser.driver.sleep(3000);
      element(By.id("siguiente")).click();

      //-->Limpia la 3ra lista<--//
      element.all(by.options("operacionCuenta as operacionCuenta.nombre for operacionCuenta in operacionesCalculo track by operacionCuenta.id")).getText().then(function (text3) {
        tamaño3 = text3.length;

        contador = 0;
        contador2 = 0;
        //-->Limpia la lista<-- 
        while (contador < tamaño3) {
          if (text3[contador] != "") {
            operacion_lista[contador2] = text3[contador];
            contador2 = contador2 + 1;
          }
          contador = contador + 1
        }
        //<<--Imprime la 3ra lista nueva-->>
        var random_operacion = Math.floor(Math.random() * (contador2 - 0) + 0);
        var posicion_operacion = operacion_lista[random_operacion];
        element(By.id("claseCalculo")).sendKeys(posicion_operacion);
        browser.driver.sleep(2000)
      });
      browser.driver.sleep(1000);
      element(By.id("montoC")).sendKeys(random_monto)
      browser.driver.sleep(2000)

      if (test_plan_cuenta.calculo_cuenta == "si") {
        expect(check_calculo.isSelected()).toBe(false).then(function () {
          check_calculo.click();
          expect(check_calculo.isSelected()).toBe(true);
        });
      }
      browser.driver.sleep(1000);
      element(By.id("siguiente")).click();
      browser.driver.sleep(1000);

      browser.sleep(5000).then(function () {
        element(By.id("siguiente")).click();
      });


      browser.sleep(5000).then(function () {
        element(By.buttonText('OK')).click();
      });

    }, 2000);

  });
});