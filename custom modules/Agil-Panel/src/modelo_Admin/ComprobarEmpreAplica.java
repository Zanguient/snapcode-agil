/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package modelo_Admin;

/**
 *
 * @author AGIL
 */
public class ComprobarEmpreAplica {
    private int idRol ;
    private int idAplicacion;

    public ComprobarEmpreAplica(int idRol, int idAplicacion) {
        this.idRol = idRol;
        this.idAplicacion = idAplicacion;
    }

    public int getIdAplicacion() {
        return idAplicacion;
    }

    public void setIdAplicacion(int idAplicacion) {
        this.idAplicacion = idAplicacion;
    }

    public int getIdRol() {
        return idRol;
    }

    public void setIdRol(int idRol) {
        this.idRol = idRol;
    }
    
    
}
