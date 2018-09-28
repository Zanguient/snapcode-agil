/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package modelo_Productos;

/**
 *
 * @author AGIL
 */
public class listaSucursal {
    private String codigo;
    private String nombre;
    private String unidad_medida;
    private double precio_unit;
    private double rango_max;
    private double rango_min;
    private String descripcion;
    private String imagen;
    private boolean publicar_panel;
    private boolean activar_inventario;
    private int inventario_minimo;
    private int grupo;
    private int subGrupo;
    private String caracte_especial1;
    private String caracte_especial2;
    private String marca;
    private String modelo;
    private String anio;
    private String codigo_fabrica;
    private double comision;
    private int alerta;
    private double descuento;
    private double descuento_fijo;
    private int tipo_producto;
    private int almacen;
    private int cuenta;

    public listaSucursal(String codigo, String nombre, String unidad_medida, double precio_unit, double rango_max, double rango_min, String descripcion, String imagen, boolean publicar_panel, boolean activar_inventario, int inventario_minimo, int grupo, int subGrupo, String caracte_especial1, String caracte_especial2, String marca, String modelo, String anio, String codigo_fabrica, double comision, int alerta, double descuento, double descuento_fijo, int tipo_producto, int almacen, int cuenta) {
        this.codigo = codigo;
        this.nombre = nombre;
        this.unidad_medida = unidad_medida;
        this.precio_unit = precio_unit;
        this.rango_max = rango_max;
        this.rango_min = rango_min;
        this.descripcion = descripcion;
        this.imagen = imagen;
        this.publicar_panel = publicar_panel;
        this.activar_inventario = activar_inventario;
        this.inventario_minimo = inventario_minimo;
        this.grupo = grupo;
        this.subGrupo = subGrupo;
        this.caracte_especial1 = caracte_especial1;
        this.caracte_especial2 = caracte_especial2;
        this.marca = marca;
        this.modelo = modelo;
        this.anio = anio;
        this.codigo_fabrica = codigo_fabrica;
        this.comision = comision;
        this.alerta = alerta;
        this.descuento = descuento;
        this.descuento_fijo = descuento_fijo;
        this.tipo_producto = tipo_producto;
        this.almacen = almacen;
        this.cuenta = cuenta;
    }

    public int getCuenta() {
        return cuenta;
    }

    public void setCuenta(int cuenta) {
        this.cuenta = cuenta;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getUnidad_medida() {
        return unidad_medida;
    }

    public void setUnidad_medida(String unidad_medida) {
        this.unidad_medida = unidad_medida;
    }

    public double getPrecio_unit() {
        return precio_unit;
    }

    public void setPrecio_unit(double precio_unit) {
        this.precio_unit = precio_unit;
    }

    public double getRango_max() {
        return rango_max;
    }

    public void setRango_max(double rango_max) {
        this.rango_max = rango_max;
    }

    public double getRango_min() {
        return rango_min;
    }

    public void setRango_min(double rango_min) {
        this.rango_min = rango_min;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getImagen() {
        return imagen;
    }

    public void setImagen(String imagen) {
        this.imagen = imagen;
    }

    public boolean isPublicar_panel() {
        return publicar_panel;
    }

    public void setPublicar_panel(boolean publicar_panel) {
        this.publicar_panel = publicar_panel;
    }

    public boolean isActivar_inventario() {
        return activar_inventario;
    }

    public void setActivar_inventario(boolean activar_inventario) {
        this.activar_inventario = activar_inventario;
    }

    public int getInventario_minimo() {
        return inventario_minimo;
    }

    public void setInventario_minimo(int inventario_minimo) {
        this.inventario_minimo = inventario_minimo;
    }

    public int getGrupo() {
        return grupo;
    }

    public void setGrupo(int grupo) {
        this.grupo = grupo;
    }

    public int getSubGrupo() {
        return subGrupo;
    }

    public void setSubGrupo(int subGrupo) {
        this.subGrupo = subGrupo;
    }

    public String getCaracte_especial1() {
        return caracte_especial1;
    }

    public void setCaracte_especial1(String caracte_especial1) {
        this.caracte_especial1 = caracte_especial1;
    }

    public String getCaracte_especial2() {
        return caracte_especial2;
    }

    public void setCaracte_especial2(String caracte_especial2) {
        this.caracte_especial2 = caracte_especial2;
    }

    public String getMarca() {
        return marca;
    }

    public void setMarca(String marca) {
        this.marca = marca;
    }

    public String getModelo() {
        return modelo;
    }

    public void setModelo(String modelo) {
        this.modelo = modelo;
    }

    public String getAnio() {
        return anio;
    }

    public void setAnio(String anio) {
        this.anio = anio;
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

    public int getAlerta() {
        return alerta;
    }

    public void setAlerta(int alerta) {
        this.alerta = alerta;
    }

    public double getDescuento() {
        return descuento;
    }

    public void setDescuento(double descuento) {
        this.descuento = descuento;
    }

    public double getDescuento_fijo() {
        return descuento_fijo;
    }

    public void setDescuento_fijo(double descuento_fijo) {
        this.descuento_fijo = descuento_fijo;
    }

    public int getTipo_producto() {
        return tipo_producto;
    }

    public void setTipo_producto(int tipo_producto) {
        this.tipo_producto = tipo_producto;
    }

    public int getAlmacen() {
        return almacen;
    }

    public void setAlmacen(int almacen) {
        this.almacen = almacen;
    }
    
    
}
