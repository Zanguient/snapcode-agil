/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Modelos;

/**
 *
 * @author AGIL
 */
public class ProductoExport {
    private int id_P;
    private int idDetalle;
    private int idProducto;
    private int empresa;
    private boolean activar_inventario;
    private int activo_fijo;
    private int alerta;
    private String anio;
    private String caracte1;
    private String caracte2;
    private String codigo;
    private String codigo_fabrica;
    private double comision;
    private String created;
    private String updated;
    private double descuento;
    private boolean descuento_fijo;
    private int almacenERP;
    private int cuenta;
    private int grupo;
    private int subgrupo;
    private String imagen;
    private double inventario_disponible;
    private int inventario_minimo;
    private int tipo_producto;

    public ProductoExport(int id_P,int idDetalle,int idProducto, int empresa, boolean activar_inventario, int activo_fijo, int alerta, String anio, String caracte1, String caracte2, String codigo, String codigo_fabrica, double comision, String created, String updated, double descuento, boolean descuento_fijo, int almacenERP, int cuenta, int grupo, int subgrupo, String imagen, double inventario_disponible, int inventario_minimo,int tipo_producto) {
        this.id_P = id_P;
        this.idDetalle = idDetalle;
        this.idProducto = idProducto;
        this.empresa = empresa;
        this.activar_inventario = activar_inventario;
        this.activo_fijo = activo_fijo;
        this.alerta = alerta;
        this.anio = anio;
        this.caracte1 = caracte1;
        this.caracte2 = caracte2;
        this.codigo = codigo;
        this.codigo_fabrica = codigo_fabrica;
        this.comision = comision;
        this.created = created;
        this.updated = updated;
        this.descuento = descuento;
        this.descuento_fijo = descuento_fijo;
        this.almacenERP = almacenERP;
        this.cuenta = cuenta;
        this.grupo = grupo;
        this.subgrupo = subgrupo;
        this.imagen = imagen;
        this.inventario_disponible = inventario_disponible;
        this.inventario_minimo = inventario_minimo;
        this.tipo_producto = tipo_producto;
    }
    
    public String getCreated() {
        return created;
    }

    public void setCreated(String created) {
        this.created = created;
    }

    public String getUpdated() {
        return updated;
    }

    public void setUpdated(String updated) {
        this.updated = updated;
    }

    public int getIdProducto() {
        return idProducto;
    }

    public void setIdProducto(int idProducto) {
        this.idProducto = idProducto;
    }

    public int getEmpresa() {
        return empresa;
    }

    public void setEmpresa(int empresa) {
        this.empresa = empresa;
    }

    public boolean isActivar_inventario() {
        return activar_inventario;
    }

    public void setActivar_inventario(boolean activar_inventario) {
        this.activar_inventario = activar_inventario;
    }

    public int getActivo_fijo() {
        return activo_fijo;
    }

    public void setActivo_fijo(int activo_fijo) {
        this.activo_fijo = activo_fijo;
    }

    public int getAlerta() {
        return alerta;
    }

    public void setAlerta(int alerta) {
        this.alerta = alerta;
    }

    public String getAnio() {
        return anio;
    }

    public void setAnio(String anio) {
        this.anio = anio;
    }

    public String getCaracte1() {
        return caracte1;
    }

    public void setCaracte1(String caracte1) {
        this.caracte1 = caracte1;
    }

    public String getCaracte2() {
        return caracte2;
    }

    public void setCaracte2(String caracte2) {
        this.caracte2 = caracte2;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public String getCodigo_fabrica() {
        return codigo_fabrica;
    }

    public void setCodigo_fabrica(String codigo_fabrica) {
        this.codigo_fabrica = codigo_fabrica;
    }

    public double getComision() {
        return comision;
    }

    public void setComision(double comision) {
        this.comision = comision;
    }

    public double getDescuento() {
        return descuento;
    }

    public void setDescuento(double descuento) {
        this.descuento = descuento;
    }

    public boolean isDescuento_fijo() {
        return descuento_fijo;
    }

    public void setDescuento_fijo(boolean descuento_fijo) {
        this.descuento_fijo = descuento_fijo;
    }

    public int getAlertaERP() {
        return almacenERP;
    }

    public void setAlertaERP(int almacenERP) {
        this.almacenERP = almacenERP;
    }

    public int getCuenta() {
        return cuenta;
    }

    public void setCuenta(int cuenta) {
        this.cuenta = cuenta;
    }

    public int getGrupo() {
        return grupo;
    }

    public void setGrupo(int grupo) {
        this.grupo = grupo;
    }

    public int getSubgrupo() {
        return subgrupo;
    }

    public void setSubgrupo(int subgrupo) {
        this.subgrupo = subgrupo;
    }

    public String getImagen() {
        return imagen;
    }

    public void setImagen(String imagen) {
        this.imagen = imagen;
    }

    public double getInventario_disponible() {
        return inventario_disponible;
    }

    public void setInventario_disponible(double inventario_disponible) {
        this.inventario_disponible = inventario_disponible;
    }

    public int getInventario_minimo() {
        return inventario_minimo;
    }

    public void setInventario_minimo(int inventario_minimo) {
        this.inventario_minimo = inventario_minimo;
    }

    public int getAlmacenERP() {
        return almacenERP;
    }

    public void setAlmacenERP(int almacenERP) {
        this.almacenERP = almacenERP;
    }

    public int getTipo_producto() {
        return tipo_producto;
    }

    public void setTipo_producto(int tipo_producto) {
        this.tipo_producto = tipo_producto;
    }

    public int getId_P() {
        return id_P;
    }

    public void setId_P(int id_P) {
        this.id_P = id_P;
    }

    public int getIdDetalle() {
        return idDetalle;
    }

    public void setIdDetalle(int idDetalle) {
        this.idDetalle = idDetalle;
    }
    
  
}
