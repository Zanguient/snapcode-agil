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
public class Producto {
    private int id;
    private String nombre_producto;
    private String uni_medida;
    private double precio_uni;

    public Producto(int id, String nombre_producto, String uni_medida, double precio_uni) {
        this.id = id;
        this.nombre_producto = nombre_producto;
        this.uni_medida = uni_medida;
        this.precio_uni = precio_uni;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getNombre_producto() {
        return nombre_producto;
    }

    public void setNombre_producto(String nombre_producto) {
        this.nombre_producto = nombre_producto;
    }

    public String getUni_medida() {
        return uni_medida;
    }

    public void setUni_medida(String uni_medida) {
        this.uni_medida = uni_medida;
    }

    public double getPrecio_uni() {
        return precio_uni;
    }

    public void setPrecio_uni(double precio_uni) {
        this.precio_uni = precio_uni;
    }
    
    
}
