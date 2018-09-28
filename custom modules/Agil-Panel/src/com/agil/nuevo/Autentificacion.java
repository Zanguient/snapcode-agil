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
public class Autentificacion {
    private int id_aut;
    private int id_empresa;

    public Autentificacion(int id_aut, int id_empresa) {
        this.id_aut = id_aut;
        this.id_empresa = id_empresa;
    }

    public int getId_aut() {
        return id_aut;
    }

    public void setId_aut(int id_aut) {
        this.id_aut = id_aut;
    }

    public int getId_empresa() {
        return id_empresa;
    }

    public void setId_empresa(int id_empresa) {
        this.id_empresa = id_empresa;
    }
   
}
