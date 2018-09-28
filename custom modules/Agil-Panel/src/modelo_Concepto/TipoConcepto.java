/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package modelo_Concepto;

/**
 *
 * @author AGIL
 */
public class TipoConcepto {
    private int id;    
    private String nombre;
    private String nombre_corto;

    public TipoConcepto(int id, String nombre, String nombre_corto) {
        this.id = id;
        this.nombre = nombre;
        this.nombre_corto = nombre_corto;
    }

    public String getNombre_corto() {
        return nombre_corto;
    }

    public void setNombre_corto(String nombre_corto) {
        this.nombre_corto = nombre_corto;
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
    
}
