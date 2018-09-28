/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package model_solicitud;

import java.util.Date;

/**
 *
 * @author AGIL
 */
public class solicitudReposicion {
    private int id;
    private int almacen;
    private int usuario;
    private Date fecha;
    private boolean activo;
    private boolean eliminado;
    private Date createdAt;
    private Date updatedAt;
    private double monto;
    private String nombreSucursal;

    public solicitudReposicion(int id, int almacen, int usuario, Date fecha, boolean activo, boolean eliminado, Date createdAt, Date updatedAt, double monto, String nombreSucursal) {
        this.id = id;
        this.almacen = almacen;
        this.usuario = usuario;
        this.fecha = fecha;
        this.activo = activo;
        this.eliminado = eliminado;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.monto = monto;
        this.nombreSucursal = nombreSucursal;
    }

    public String getNombreSucursal() {
        return nombreSucursal;
    }

    public void setNombreSucursal(String nombreSucursal) {
        this.nombreSucursal = nombreSucursal;
    }

    public int getAlmacen() {
        return almacen;
    }

    public void setAlmacen(int almacen) {
        this.almacen = almacen;
    }

    public int getUsuario() {
        return usuario;
    }

    public void setUsuario(int usuario) {
        this.usuario = usuario;
    }

    public Date getFecha() {
        return fecha;
    }

    public void setFecha(Date fecha) {
        this.fecha = fecha;
    }

    public boolean isActivo() {
        return activo;
    }

    public void setActivo(boolean activo) {
        this.activo = activo;
    }

    public boolean isEliminado() {
        return eliminado;
    }

    public void setEliminado(boolean eliminado) {
        this.eliminado = eliminado;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }

    public double getMonto() {
        return monto;
    }

    public void setMonto(double monto) {
        this.monto = monto;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }
    
}
