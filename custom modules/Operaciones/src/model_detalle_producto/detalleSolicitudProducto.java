/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package model_detalle_producto;

import java.util.Date;

/**
 *
 * @author AGIL
 */
public class detalleSolicitudProducto {
    private int id;
    private int solicitud;
    private int producto;
    private double cantidad;
    private Date createdAt;
    private Date updatedAt;

    public detalleSolicitudProducto(int id, int solicitud, int producto, double cantidad, Date createdAt, Date updatedAt) {
        this.id = id;
        this.solicitud = solicitud;
        this.producto = producto;
        this.cantidad = cantidad;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }

    public int getSolicitud() {
        return solicitud;
    }

    public void setSolicitud(int solicitud) {
        this.solicitud = solicitud;
    }

    public int getProducto() {
        return producto;
    }

    public void setProducto(int producto) {
        this.producto = producto;
    }

    public double getCantidad() {
        return cantidad;
    }

    public void setCantidad(double cantidad) {
        this.cantidad = cantidad;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    } 

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }
}
