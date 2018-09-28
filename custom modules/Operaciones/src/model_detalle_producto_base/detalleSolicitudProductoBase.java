/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package model_detalle_producto_base;

import java.util.Date;

/**
 *
 * @author AGIL
 */
public class detalleSolicitudProductoBase {
    private int id;
    private int detalle_solicitud_producto;
    private int producto_base;
    private double cantidad_ideal;
    private double cantidad_real;
    private Date createdat;
    private Date updatedat;
    private double total;

    public detalleSolicitudProductoBase(int id, int detalle_solicitud_producto, int producto_base, double cantidad_ideal, double cantidad_real, Date createdat, Date updatedat, double total) {
        this.id = id;
        this.detalle_solicitud_producto = detalle_solicitud_producto;
        this.producto_base = producto_base;
        this.cantidad_ideal = cantidad_ideal;
        this.cantidad_real = cantidad_real;
        this.createdat = createdat;
        this.updatedat = updatedat;
        this.total = total;
    }

    public double getTotal() {
        return total;
    }

    public void setTotal(double total) {
        this.total = total;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getDetalle_solicitud_producto() {
        return detalle_solicitud_producto;
    }

    public void setDetalle_solicitud_producto(int detalle_solicitud_producto) {
        this.detalle_solicitud_producto = detalle_solicitud_producto;
    }

    public int getProducto_base() {
        return producto_base;
    }

    public void setProducto_base(int producto_base) {
        this.producto_base = producto_base;
    }

    public double getCantidad_ideal() {
        return cantidad_ideal;
    }

    public void setCantidad_ideal(double cantidad_ideal) {
        this.cantidad_ideal = cantidad_ideal;
    }

    public double getCantidad_real() {
        return cantidad_real;
    }

    public void setCantidad_real(double cantidad_real) {
        this.cantidad_real = cantidad_real;
    }

    public Date getCreatedat() {
        return createdat;
    }

    public void setCreatedat(Date createdat) {
        this.createdat = createdat;
    }

    public Date getUpdatedat() {
        return updatedat;
    }

    public void setUpdatedat(Date updatedat) {
        this.updatedat = updatedat;
    }
    
}
