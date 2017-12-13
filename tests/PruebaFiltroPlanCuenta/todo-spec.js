describe('Prueba Filtro Plan de Cuentas', function () {
  browser.driver.manage().window().maximize();
  var usuario = element(By.id('nick'));
  var clave = element(By.id('clave'));
  var login_button = element(By.id('ingresarlogin'));
  var contador_pruebas = 0;
  var contador = 0;
  var contador2 = 0;
  var tamaño;
  var tamaño2;
  var clasificacion_lista = [];
  var tipo_cuenta_lista = [];


  let test_plan_cuenta = require('../test_plan_cuenta.json');

  it('Prueba Filtro Plan Cuenta Agil', function () {
    browser.get('http://localhost:8083/#/')
   // browser.executeScript("document.body.style.zoom='50%'");
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
      element(By.id("fechainicio")).sendKeys("01/09/2017");
      element(By.id("fechainicio")).click();
      browser.driver.sleep(2000)
      element(By.id("fechafin")).sendKeys("30/10/2017");
      element(By.id("fechafin")).click();
      browser.driver.sleep(2000)

      while (contador_pruebas < test_plan_cuenta.cantidad_pruebas) {
        element.all(by.options("cuentaClasificacion.id as cuentaClasificacion.nombre for cuentaClasificacion in cuentaClasificaciones")).getText().then(function (text) {
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
          element(By.id("filtroClasificacion")).sendKeys(posicion_clasificacion);
        });

        element.all(by.options("cuentaTipo.id as cuentaTipo.nombre for cuentaTipo in cuentaTipos")).getText().then(function (text2) {
          contador = 0;
          contador2 = 0;
          tamaño2 = text2.length;
          while (contador < tamaño) {
            if (text2[contador] != "") {
              tipo_cuenta_lista[contador2] = text2[contador];
              contador2 = contador2 + 1;
            }
            contador = contador + 1
          }
          //<<--Imprime la 1ra lista nueva-->>
          var random_tipo_cuenta = Math.floor(Math.random() * (contador2 - 0) + 0);
          var elemento_tipo_cuenta = tipo_cuenta_lista[random_tipo_cuenta];
          element(By.id("filtroTipo_cuenta")).sendKeys(elemento_tipo_cuenta);
          element(By.id("Buscar")).click();
          browser.driver.sleep(5000);
        });
        contador_pruebas = contador_pruebas + 1;
      }
    });

  }, 2000);

});
