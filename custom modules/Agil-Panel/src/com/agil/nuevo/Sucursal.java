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
public class Sucursal {
    //Almacen almacen;
    private String nombre;
    private int id;
    private int id_usuario;

    public Sucursal(int id,String nombre,int id_usuario) {
        this.nombre = nombre;
        this.id = id;
        this.id_usuario = id_usuario;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }
    
    public String toString(){
        return nombre;
    }

    public int getId_usuario() {
        return id_usuario;
    }

    public void setId_usuario(int id_usuario) {
        this.id_usuario = id_usuario;
    }
}
