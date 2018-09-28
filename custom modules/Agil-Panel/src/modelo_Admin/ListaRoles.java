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
public class ListaRoles {
    private int texto;
    private boolean ver;
    private boolean crear;
    private boolean modificar;
    private boolean eliminar;

    public ListaRoles(int texto, boolean ver, boolean crear, boolean modificar, boolean eliminar) {
        this.texto = texto;
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

    public int getTexto() {
        return texto;
    }

    public void setTexto(int texto) {
        this.texto = texto;
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
