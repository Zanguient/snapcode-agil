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
public class Datos {
    private String nombre;
    private int numero;
    private String direccion;
    private int idDatos;
    private static int contadorDatos;
    
    private Datos(){
        this.idDatos = ++contadorDatos;
    }
    
    public Datos(String nombre, int numero,String direccion){
        this();
        this.nombre = nombre;
        this.numero = numero;
        this.direccion = direccion;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public int getNumero() {
        return numero;
    }

    public void setNumero(int numero) {
        this.numero = numero;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }
    
    
}
