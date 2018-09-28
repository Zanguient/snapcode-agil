/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Modelos;

import java.sql.Date;

/**
 *
 * @author AGIL
 */
public class Sucursal_Disificacion {
    private int id;
    private int id_sucursal;
    private int id_dosificacion;
    private String createdAt;
    private String updatedAt;
    
    public Sucursal_Disificacion(){
        
    }
  
    public Sucursal_Disificacion(int id, int id_sucursal, int id_dosificacion, String createdAt, String updatedAt) {
        this.id = id;
        this.id_sucursal = id_sucursal;
        this.id_dosificacion = id_dosificacion;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public String getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(String updatedAt) {
        this.updatedAt = updatedAt;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getId_sucursal() {
        return id_sucursal;
    }

    public void setId_sucursal(int id_sucursal) {
        this.id_sucursal = id_sucursal;
    }

    public int getId_dosificacion() {
        return id_dosificacion;
    }

    public void setId_dosificacion(int id_dosificacion) {
        this.id_dosificacion = id_dosificacion;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }
    
    
}
