/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.agil.nuevo;

/**
 *
 * @author AGIL
 */
public class ProductoBase {

    private int id_producto;
    private String nombre_pb;
    private String unid_medid_pb;
    private String cantU_ideal_pb;
    private int precio_unit_pb;
    private int id_prod_base;

    public ProductoBase(int id_producto, String nombre_pb, String unid_medid_pb, String cantU_ideal_pb, int precio_unit_pb, int id_prod_base) {
        this.id_producto = id_producto;
        this.nombre_pb = nombre_pb;
        this.unid_medid_pb = unid_medid_pb;
        this.cantU_ideal_pb = cantU_ideal_pb;
        this.precio_unit_pb = precio_unit_pb;
        this.id_prod_base = id_prod_base;

    }

    public int getId_producto() {
        return id_producto;
    }

    public void setId_producto(int id_producto) {
        this.id_producto = id_producto;
    }

    public String getNombre_pb() {
        return nombre_pb;
    }

    public void setNombre_pb(String nombre_pb) {
        this.nombre_pb = nombre_pb;
    }

    public String getUnid_medid_pb() {
        return unid_medid_pb;
    }

    public void setUnid_medid_pb(String unid_medid_pb) {
        this.unid_medid_pb = unid_medid_pb;
    }

    public String getCantU_ideal_pb() {
        return cantU_ideal_pb;
    }

    public void setCantU_ideal_pb(String cantU_ideal_pb) {
        this.cantU_ideal_pb = cantU_ideal_pb;
    }

    public int getPrecio_unit_pb() {
        return precio_unit_pb;
    }

    public void setPrecio_unit_pb(int precio_unit_pb) {
        this.precio_unit_pb = precio_unit_pb;
    }

    public int getId_prod_base() {
        return id_prod_base;
    }

    public void setId_prod_base(int id_prod_base) {
        this.id_prod_base = id_prod_base;
    }

}
