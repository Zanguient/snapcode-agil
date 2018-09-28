/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package modelo_Sucursal;

import java.sql.ResultSet;
import javax.swing.JComboBox;
import models.Database;

/**
 *
 * @author AGIL
 */
public class ListaSucursal {
    public Database db = new Database();
    private int id;
    private String nombre;
    private int numero;
    private String direccion;
    private String telefono1;
    private String telefono2;
    private String telefono3;
    private String departamento;
    private String municipio;

    public ListaSucursal(int id, String nombre, int numero, String direccion, String telefono1, String telefono2, String telefono3, String departamento, String municipio) {
        this.id = id;
        this.nombre = nombre;
        this.numero = numero;
        this.direccion = direccion;
        this.telefono1 = telefono1;
        this.telefono2 = telefono2;
        this.telefono3 = telefono3;
        this.departamento = departamento;
        this.municipio = municipio;
    }

    public ListaSucursal(){
        
    }
    
    public String getMunicipio() {
        return municipio;
    }

    public void setMunicipio(String municipio) {
        this.municipio = municipio;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
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

    public String getTelefono1() {
        return telefono1;
    }

    public void setTelefono1(String telefono1) {
        this.telefono1 = telefono1;
    }

    public String getTelefono2() {
        return telefono2;
    }

    public void setTelefono2(String telefono2) {
        this.telefono2 = telefono2;
    }

    public String getTelefono3() {
        return telefono3;
    }

    public void setTelefono3(String telefono3) {
        this.telefono3 = telefono3;
    }

    public String getDepartamento() {
        return departamento;
    }

    public void setDepartamento(String departamento) {
        this.departamento = departamento;
    }  
}