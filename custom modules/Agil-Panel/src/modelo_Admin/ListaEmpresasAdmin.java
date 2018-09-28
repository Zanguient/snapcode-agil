/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package modelo_Admin;
    
import java.sql.Date;

/**
 *
 * @author AGIL
 */
public class ListaEmpresasAdmin {
    private int id;
    private String razonSocial;
    private String nit;
    private String direccion;
    private int telefono1;
    private int telefono2;
    private int telefono3;
    private int departamento;
    private int municipio;
    private java.sql.Date createdat;
    private java.sql.Date updatedat;
    private boolean panel;
    private boolean vencimiento;
    private boolean servicios;
    private boolean consumos;
    private boolean descuentos;
    private boolean geo;
    private boolean pedidos;
    private boolean pantallaCliente;
    private boolean pantallaDespacho;
    private boolean mesas;
    private boolean salas;
    private boolean contabilidad;
    private boolean medico;
    private boolean mantenimiento;
    private boolean cuentasAuxiliares;
    private String imagen;

    public ListaEmpresasAdmin(int id, String razonSocial, String nit, String direccion, int telefono1, int telefono2, int telefono3, int departamento, int municipio, Date createdat, Date updatedat, boolean panel, boolean vencimiento, boolean servicios, boolean consumos, boolean descuentos, boolean geo, boolean pedidos, boolean pantallaCliente, boolean pantallaDespacho, boolean mesas, boolean salas, boolean contabilidad, boolean medico, boolean mantenimiento, boolean cuentasAuxiliares, String imagen) {
        this.id = id;
        this.razonSocial = razonSocial;
        this.nit = nit;
        this.direccion = direccion;
        this.telefono1 = telefono1;
        this.telefono2 = telefono2;
        this.telefono3 = telefono3;
        this.departamento = departamento;
        this.municipio = municipio;
        this.createdat = createdat;
        this.updatedat = updatedat;
        this.panel = panel;
        this.vencimiento = vencimiento;
        this.servicios = servicios;
        this.consumos = consumos;
        this.descuentos = descuentos;
        this.geo = geo;
        this.pedidos = pedidos;
        this.pantallaCliente = pantallaCliente;
        this.pantallaDespacho = pantallaDespacho;
        this.mesas = mesas;
        this.salas = salas;
        this.contabilidad = contabilidad;
        this.medico = medico;
        this.mantenimiento = mantenimiento;
        this.cuentasAuxiliares = cuentasAuxiliares;
        this.imagen = imagen;
    }

    public String getImagen() {
        return imagen;
    }

    public void setImagen(String imagen) {
        this.imagen = imagen;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getRazonSocial() {
        return razonSocial;
    }

    public void setRazonSocial(String razonSocial) {
        this.razonSocial = razonSocial;
    }

    public String getNit() {
        return nit;
    }

    public void setNit(String nit) {
        this.nit = nit;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public int getTelefono1() {
        return telefono1;
    }

    public void setTelefono1(int telefono1) {
        this.telefono1 = telefono1;
    }

    public int getTelefono2() {
        return telefono2;
    }

    public void setTelefono2(int telefono2) {
        this.telefono2 = telefono2;
    }

    public int getTelefono3() {
        return telefono3;
    }

    public void setTelefono3(int telefono3) {
        this.telefono3 = telefono3;
    }

    public int getDepartamento() {
        return departamento;
    }

    public void setDepartamento(int departamento) {
        this.departamento = departamento;
    }

    public int getMunicipio() {
        return municipio;
    }

    public void setMunicipio(int municipio) {
        this.municipio = municipio;
    }

    public java.sql.Date getCreatedat() {
        return createdat;
    }

    public void setCreatedat(java.sql.Date createdat) {
        this.createdat = createdat;
    }

    public java.sql.Date getUpdatedat() {
        return updatedat;
    }

    public void setUpdatedat(java.sql.Date updatedat) {
        this.updatedat = updatedat;
    }

    public boolean isPanel() {
        return panel;
    }

    public void setPanel(boolean panel) {
        this.panel = panel;
    }

    public boolean isVencimiento() {
        return vencimiento;
    }

    public void setVencimiento(boolean vencimiento) {
        this.vencimiento = vencimiento;
    }

    public boolean isServicios() {
        return servicios;
    }

    public void setServicios(boolean servicios) {
        this.servicios = servicios;
    }

    public boolean isConsumos() {
        return consumos;
    }

    public void setConsumos(boolean consumos) {
        this.consumos = consumos;
    }

    public boolean isDescuentos() {
        return descuentos;
    }

    public void setDescuentos(boolean descuentos) {
        this.descuentos = descuentos;
    }

    public boolean isGeo() {
        return geo;
    }

    public void setGeo(boolean geo) {
        this.geo = geo;
    }

    public boolean isPedidos() {
        return pedidos;
    }

    public void setPedidos(boolean pedidos) {
        this.pedidos = pedidos;
    }

    public boolean isPantallaCliente() {
        return pantallaCliente;
    }

    public void setPantallaCliente(boolean pantallaCliente) {
        this.pantallaCliente = pantallaCliente;
    }

    public boolean isPantallaDespacho() {
        return pantallaDespacho;
    }

    public void setPantallaDespacho(boolean pantallaDespacho) {
        this.pantallaDespacho = pantallaDespacho;
    }

    public boolean isMesas() {
        return mesas;
    }

    public void setMesas(boolean mesas) {
        this.mesas = mesas;
    }

    public boolean isSalas() {
        return salas;
    }

    public void setSalas(boolean salas) {
        this.salas = salas;
    }

    public boolean isContabilidad() {
        return contabilidad;
    }

    public void setContabilidad(boolean contabilidad) {
        this.contabilidad = contabilidad;
    }

    public boolean isMedico() {
        return medico;
    }

    public void setMedico(boolean medico) {
        this.medico = medico;
    }

    public boolean isMantenimiento() {
        return mantenimiento;
    }

    public void setMantenimiento(boolean mantenimiento) {
        this.mantenimiento = mantenimiento;
    }

    public boolean isCuentasAuxiliares() {
        return cuentasAuxiliares;
    }

    public void setCuentasAuxiliares(boolean cuentasAuxiliares) {
        this.cuentasAuxiliares = cuentasAuxiliares;
    }
    

    
}
