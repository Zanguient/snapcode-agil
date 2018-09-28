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
public class ProductosSeleccionados {
    private int id = 0;
    private int cant = 0;
    private String nombre = "";
    private double prodUnita = 0;
    private double imp = 0;

    public ProductosSeleccionados(int id,int cant,String nombre,double prodUnita,double imp) {
        this.id = id;
        this.cant = cant;
        this.nombre = nombre;
        this.prodUnita = prodUnita;
        this.imp = imp;
    }

    public double getImp() {
        return imp;
    }

    public void setImp(double imp) {
        this.imp = imp;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getCant() {
        return cant;
    }

    public void setCant(int cant) {
        this.cant = cant;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public double getProdUnita() {
        return prodUnita;
    }

    public void setProdUnita(double prodUnita) {
        this.prodUnita = prodUnita;
    }
    
}
