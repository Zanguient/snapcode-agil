describe('Pruebas Comprobantes', function () {
  browser.driver.manage().window().maximize();
  var usuario = element(By.id('nick'));
  var clave = element(By.id('clave'));
  var login_button = element(By.id('ingresarlogin'));
  var random_tipo_comprobante = Math.floor(Math.random() * (4 - 0) + 1);
  var random_sucursal = Math.floor(Math.random() * (5 - 0) + 1);
  var contador = 0;
  var random_debe = 0;
  var random_haber = 0;
  var contador_index = 0;
  var contador_index_texto = 0;
  var contador_debe_texto = 0;
  var contador_haber_texo = 0;
  var check_bimonetario = element(By.model('opcionBimonetario'));


  let test_comprobantes = require('../test_comprobantes.json');

  it('Prueba comprobantes Agil', function () {
    browser.get('http://localhost:8083/#/')
    setTimeout(function () {
      browser.driver.sleep(2000);
      //hacer que el usuario y pass los lea desde otro JS
      usuario.sendKeys(test_comprobantes.usuario);//loguea
      clave.sendKeys(test_comprobantes.clave);
      login_button.click();

      browser.driver.sleep(3000)
      browser.driver.sleep(2000).then(function () {
        browser.driver.sleep(5000);
        element(By.id('comprobantes2')).click();
      });

      browser.driver.sleep(2000)
      element(By.id('nuevo')).click()
      browser.driver.sleep(2000)

      //<<Tipo comprobante>>
      element.all(by.options("cuentaTipo.id as cuentaTipo.nombre for cuentaTipo in tiposComprobantes")).get(random_tipo_comprobante).getText().then(function (text) {
        var cuenta_tipo = text;
        element(By.model('nuevoComprobante.tipo_comprobante')).sendKeys(cuenta_tipo);
        browser.driver.sleep(2000)
      });
      //<<Sucursal>>
      element.all(by.options("sucursalFiltro.id as sucursalFiltro.nombre for sucursalFiltro in sucursales")).get(random_sucursal).getText().then(function (text2) {
        var sucursal_tipo = text2;
        element(By.model('nuevoComprobante.id_sucursal')).sendKeys(sucursal_tipo);
        browser.driver.sleep(2000)
      });
      //<<Fecha>>
      element(By.model("nuevoComprobante.fecha")).sendKeys('25/10/2017');
      element(By.model("nuevoComprobante.gloza")).sendKeys("Test comprobantes Viernes")

      if (test_comprobantes.bimonetario == "si") {
        expect(check_bimonetario.isSelected()).toBe(false).then(function () {
          check_bimonetario.click();
          expect(check_bimonetario.isSelected()).toBe(true);
        });
      }
      while (contador <=test_comprobantes.cantidad_pruebas) {
        //<<Click en la flecha azul>>
        browser.driver.sleep(2000)
        element(By.id("agregar_asiento")).click().then(function () {
          browser.driver.sleep(2000)

          contador_index_texto = contador_index + "-As";
          browser.driver.sleep(2000)

          contador_debe_texto = contador_index + "-Bs";
          browser.driver.sleep(2000)

          contador_haber_texo = contador_index + "-Cs";
          browser.driver.sleep(2000)

          element(By.id(contador_index_texto)).sendKeys("caja");
          browser.driver.sleep(2000)
          element.all(by.css('.ng-isolate-scope li')).then(function (items) { //genera un numero random y elige de la lista desplegable

            expect(items.length).toBe(items.length);

            var random_lista = Math.floor((Math.random() * items.length) + 0);

            expect(items[random_lista].click());
          });
          random_debe = Math.floor(Math.random() * (500 - 250)) + 0;
          element(By.id(contador_debe_texto)).sendKeys(random_debe);

          random_haber = Math.floor(Math.random() * (250 - 0)) + 0
          element(By.id(contador_haber_texo)).sendKeys(random_haber);

          contador_index = contador_index + 1;
        });
        contador = contador + 1
      }

      browser.driver.sleep(10000).then(function () {
         element(By.id("guardarV")).click();
        browser.driver.sleep(2000);
      });


    }, 2000);
  });
});