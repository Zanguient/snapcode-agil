/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package modelo_Sucursal;

/**
 *
 * @author AGIL
 */
public class listaDatosCorrelativos {
   private int num_corre_venta;
   private int num_corre_traspaso;
   private int num_corre_baja;
   private int num_corre_pedido;
   private int num_corre_cotizacion;
   private int num_corre_preFactura;
   private int num_corre_despacho;
   private int num_corre_despacho_recibo;
   private int num_corre_ropa_trabajo;
   private int num_corre_compro_ingre;
   private boolean reinicio_ingreso;
   private int num_corre_compro_egreso;
   private boolean reinicio_egreso;
   private int num_corre_compro_traspaso;
   private boolean reinicio_traspaso;
   private int num_corre_caja_chica;
   private boolean reinicio_caja_chica;
   private int num_corre_venta_farmacia;
   private String frase;
   private int num_copias_impresion_pedido;
   private boolean impresion_pedido_corto;

    public listaDatosCorrelativos(int num_corre_venta, int num_corre_traspaso, int num_corre_baja, int num_corre_pedido, int num_corre_cotizacion, int num_corre_preFactura, int num_corre_despacho, int num_corre_despacho_recibo, int num_corre_ropa_trabajo, int num_corre_compro_ingre, boolean reinicio_ingreso, int num_corre_compro_egreso, boolean reinicio_egreso, int num_corre_compro_traspaso, boolean reinicio_traspaso, int num_corre_caja_chica, boolean reinicio_caja_chica, int num_corre_venta_farmacia, String frase, int num_copias_impresion_pedido, boolean impresion_pedido_corto) {
        this.num_corre_venta = num_corre_venta;
        this.num_corre_traspaso = num_corre_traspaso;
        this.num_corre_baja = num_corre_baja;
        this.num_corre_pedido = num_corre_pedido;
        this.num_corre_cotizacion = num_corre_cotizacion;
        this.num_corre_preFactura = num_corre_preFactura;
        this.num_corre_despacho = num_corre_despacho;
        this.num_corre_despacho_recibo = num_corre_despacho_recibo;
        this.num_corre_ropa_trabajo = num_corre_ropa_trabajo;
        this.num_corre_compro_ingre = num_corre_compro_ingre;
        this.reinicio_ingreso = reinicio_ingreso;
        this.num_corre_compro_egreso = num_corre_compro_egreso;
        this.reinicio_egreso = reinicio_egreso;
        this.num_corre_compro_traspaso = num_corre_compro_traspaso;
        this.reinicio_traspaso = reinicio_traspaso;
        this.num_corre_caja_chica = num_corre_caja_chica;
        this.reinicio_caja_chica = reinicio_caja_chica;
        this.num_corre_venta_farmacia = num_corre_venta_farmacia;
        this.frase = frase;
        this.num_copias_impresion_pedido = num_copias_impresion_pedido;
        this.impresion_pedido_corto = impresion_pedido_corto;
    }

    public boolean isImpresion_pedido_corto() {
        return impresion_pedido_corto;
    }

    public void setImpresion_pedido_corto(boolean impresion_pedido_corto) {
        this.impresion_pedido_corto = impresion_pedido_corto;
    }

    public int getNum_corre_despacho() {
        return num_corre_despacho;
    }

    public void setNum_corre_despacho(int num_corre_despacho) {
        this.num_corre_despacho = num_corre_despacho;
    }

    public int getNum_corre_despacho_recibo() {
        return num_corre_despacho_recibo;
    }

    public void setNum_corre_despacho_recibo(int num_corre_despacho_recibo) {
        this.num_corre_despacho_recibo = num_corre_despacho_recibo;
    }

    public int getNum_corre_ropa_trabajo() {
        return num_corre_ropa_trabajo;
    }

    public void setNum_corre_ropa_trabajo(int num_corre_ropa_trabajo) {
        this.num_corre_ropa_trabajo = num_corre_ropa_trabajo;
    }

    public int getNum_corre_compro_ingre() {
        return num_corre_compro_ingre;
    }

    public void setNum_corre_compro_ingre(int num_corre_compro_ingre) {
        this.num_corre_compro_ingre = num_corre_compro_ingre;
    }

    public boolean isReinicio_ingreso() {
        return reinicio_ingreso;
    }

    public void setReinicio_ingreso(boolean reinicio_ingreso) {
        this.reinicio_ingreso = reinicio_ingreso;
    }

    public int getNum_corre_compro_egreso() {
        return num_corre_compro_egreso;
    }

    public void setNum_corre_compro_egreso(int num_corre_compro_egreso) {
        this.num_corre_compro_egreso = num_corre_compro_egreso;
    }

    public boolean isReinicio_egreso() {
        return reinicio_egreso;
    }

    public void setReinicio_egreso(boolean reinicio_egreso) {
        this.reinicio_egreso = reinicio_egreso;
    }

    public int getNum_corre_compro_traspaso() {
        return num_corre_compro_traspaso;
    }

    public void setNum_corre_compro_traspaso(int num_corre_compro_traspaso) {
        this.num_corre_compro_traspaso = num_corre_compro_traspaso;
    }

    public boolean isReinicio_traspaso() {
        return reinicio_traspaso;
    }

    public void setReinicio_traspaso(boolean reinicio_traspaso) {
        this.reinicio_traspaso = reinicio_traspaso;
    }

    public int getNum_corre_caja_chica() {
        return num_corre_caja_chica;
    }

    public void setNum_corre_caja_chica(int num_corre_caja_chica) {
        this.num_corre_caja_chica = num_corre_caja_chica;
    }

    public boolean isReinicio_caja_chica() {
        return reinicio_caja_chica;
    }

    public void setReinicio_caja_chica(boolean reinicio_caja_chica) {
        this.reinicio_caja_chica = reinicio_caja_chica;
    }

    public int getNum_corre_venta_farmacia() {
        return num_corre_venta_farmacia;
    }

    public void setNum_corre_venta_farmacia(int num_corre_venta_farmacia) {
        this.num_corre_venta_farmacia = num_corre_venta_farmacia;
    }

    public String getFrase() {
        return frase;
    }

    public void setFrase(String frase) {
        this.frase = frase;
    }

    public int getNum_copias_impresion_pedido() {
        return num_copias_impresion_pedido;
    }

    public void setNum_copias_impresion_pedido(int num_copias_impresion_pedido) {
        this.num_copias_impresion_pedido = num_copias_impresion_pedido;
    }

    public int getNum_corre_venta() {
        return num_corre_venta;
    }

    public void setNum_corre_venta(int num_corre_venta) {
        this.num_corre_venta = num_corre_venta;
    }

    public int getNum_corre_traspaso() {
        return num_corre_traspaso;
    }

    public void setNum_corre_traspaso(int num_corre_traspaso) {
        this.num_corre_traspaso = num_corre_traspaso;
    }

    public int getNum_corre_baja() {
        return num_corre_baja;
    }

    public void setNum_corre_baja(int num_corre_baja) {
        this.num_corre_baja = num_corre_baja;
    }

    public int getNum_corre_pedido() {
        return num_corre_pedido;
    }

    public void setNum_corre_pedido(int num_corre_pedido) {
        this.num_corre_pedido = num_corre_pedido;
    }

    public int getNum_corre_cotizacion() {
        return num_corre_cotizacion;
    }

    public void setNum_corre_cotizacion(int num_corre_cotizacion) {
        this.num_corre_cotizacion = num_corre_cotizacion;
    }

    public int getNum_corre_preFactura() {
        return num_corre_preFactura;
    }

    public void setNum_corre_preFactura(int num_corre_preFactura) {
        this.num_corre_preFactura = num_corre_preFactura;
    }
}
