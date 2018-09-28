/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package models;


import java.sql.Date;
//import java.util.Date;
/**
 *
 * @author AGIL
 */
public class Detalle_Solicitud_Producto {
    private int id;
    private int solicitud;
    private int producto;
    private int cantidad;
    private Date createdat;
    private Date updatedat;

    public Detalle_Solicitud_Producto(int id,int solicitud, int producto, int cantidad, Date createdat, Date updatedat) {
        this.id = id;
        this.solicitud = solicitud;
        this.producto = producto;
        this.cantidad = cantidad;
        this.createdat = createdat;
        this.updatedat = updatedat;
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

    public int getCantidad() {
        return cantidad;
    }

    public void setCantidad(int cantidad) {
        this.cantidad = cantidad;
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

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }
    
    
}
