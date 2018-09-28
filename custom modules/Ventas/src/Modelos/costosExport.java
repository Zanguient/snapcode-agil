/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Modelos;

/**
 *
 * @author AGIL
 */
public class costosExport {
    private int idDetalle;
    private int idCostos;
    private int Idalmacen;
    private int idProducto;
    private double cantidad;
    private double costoTotal;
    private double costoUnitario;
    private String createdat;
    private String fechaVencimiento;
    private String lote;
    private String updatedat;

    public costosExport(int idDetalle, int idCostos, int Idalmacen, int idProducto, double cantidad, double costoTotal, double costoUnitario, String createdat, String fechaVencimiento, String lote, String updatedat) {
        this.idDetalle = idDetalle;
        this.idCostos = idCostos;
        this.Idalmacen = Idalmacen;
        this.idProducto = idProducto;
        this.cantidad = cantidad;
        this.costoTotal = costoTotal;
        this.costoUnitario = costoUnitario;
        this.createdat = createdat;
        this.fechaVencimiento = fechaVencimiento;
        this.lote = lote;
        this.updatedat = updatedat;
    }

    public int getIdDetalle() {
        return idDetalle;
    }

    public void setIdDetalle(int idDetalle) {
        this.idDetalle = idDetalle;
    }

    public int getIdCostos() {
        return idCostos;
    }

    public void setIdCostos(int idCostos) {
        this.idCostos = idCostos;
    }

    public int getIdalmacen() {
        return Idalmacen;
    }

    public void setIdalmacen(int Idalmacen) {
        this.Idalmacen = Idalmacen;
    }

    public int getIdProducto() {
        return idProducto;
    }

    public void setIdProducto(int idProducto) {
        this.idProducto = idProducto;
    }

    public double getCantidad() {
        return cantidad;
    }

    public void setCantidad(double cantidad) {
        this.cantidad = cantidad;
    }

    public double getCostoTotal() {
        return costoTotal;
    }

    public void setCostoTotal(double costoTotal) {
        this.costoTotal = costoTotal;
    }

    public double getCostoUnitario() {
        return costoUnitario;
    }

    public void setCostoUnitario(double costoUnitario) {
        this.costoUnitario = costoUnitario;
    }

    public String getCreatedat() {
        return createdat;
    }

    public void setCreatedat(String createdat) {
        this.createdat = createdat;
    }

    public String getFechaVencimiento() {
        return fechaVencimiento;
    }

    public void setFechaVencimiento(String fechaVencimiento) {
        this.fechaVencimiento = fechaVencimiento;
    }

    public String getLote() {
        return lote;
    }

    public void setLote(String lote) {
        this.lote = lote;
    }

    public String getUpdatedat() {
        return updatedat;
    }

    public void setUpdatedat(String updatedat) {
        this.updatedat = updatedat;
    }
    
    
}
