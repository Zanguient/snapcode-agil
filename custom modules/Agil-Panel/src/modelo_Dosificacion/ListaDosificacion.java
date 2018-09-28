/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package modelo_Dosificacion;

import java.math.BigDecimal;

/**
 *
 * @author AGIL
 */
public class ListaDosificacion {
 
    public int id;
    public java.math.BigDecimal autorizacion;

    public ListaDosificacion(int id, BigDecimal autorizacion) {
        this.id = id;
        this.autorizacion = autorizacion;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public java.math.BigDecimal getAutorizacion() {
        return autorizacion;
    }

    public void setAutorizacion(java.math.BigDecimal autorizacion) {
        this.autorizacion = autorizacion;
    }

    
    
    
}
