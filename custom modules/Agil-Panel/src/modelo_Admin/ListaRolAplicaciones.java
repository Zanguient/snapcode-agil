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
public class ListaRolAplicaciones {
    private int id;
    private boolean crear;
    private boolean ver;
    private boolean modificar;
    private boolean eliminar;

    public ListaRolAplicaciones(int id, boolean crear, boolean ver, boolean modificar, boolean eliminar) {
        this.id = id;
        this.crear = crear;
        this.ver = ver;
        this.modificar = modificar;
        this.eliminar = eliminar;
    }

    public int getAplicacion() {
        return id;
    }

    public void setAplicacion(int id) {
        this.id = id;
    }

    public boolean getCrear() {
        return crear;
    }

    public void setCrear(boolean crear) {
        this.crear = crear;
    }

    public boolean getVer() {
        return ver;
    }

    public void setVer(boolean ver) {
        this.ver = ver;
    }

    public boolean getModificar() {
        return modificar;
    }

    public void setModificar(boolean modificar) {
        this.modificar = modificar;
    }

    public boolean getEliminar() {
        return eliminar;
    }

    public void setEliminar(boolean eliminar) {
        this.eliminar = eliminar;
    }

      
}
