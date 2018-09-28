/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package modelo_Usuario;

/**
 *
 * @author AGIL
 */
public class listaRoles {
    private String aplicacion;
    private boolean ver;
    private boolean crear;
    private boolean modificar;
    private boolean eliminar;

    public listaRoles(String aplicacion, boolean ver, boolean crear, boolean modificar, boolean eliminar) {
        this.aplicacion = aplicacion;
        this.ver = ver;
        this.crear = crear;
        this.modificar = modificar;
        this.eliminar = eliminar;
    }

    public boolean isEliminar() {
        return eliminar;
    }

    public void setEliminar(boolean eliminar) {
        this.eliminar = eliminar;
    }

    public String getAplicacion() {
        return aplicacion;
    }

    public void setAplicacion(String aplicacion) {
        this.aplicacion = aplicacion;
    }

    public boolean isCrear() {
        return crear;
    }

    public void setCrear(boolean crear) {
        this.crear = crear;
    }

    public boolean isVer() {
        return ver;
    }

    public void setVer(boolean ver) {
        this.ver = ver;
    }

    public boolean isModificar() {
        return modificar;
    }

    public void setModificar(boolean modificar) {
        this.modificar = modificar;
    }
    
    
}
