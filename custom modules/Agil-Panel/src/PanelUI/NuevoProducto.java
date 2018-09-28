/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package PanelUI;

import java.awt.Image;
import java.awt.event.KeyEvent;
import java.io.File;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.Date;
import javax.swing.Icon;
import javax.swing.ImageIcon;
import javax.swing.JButton;
import javax.swing.JFileChooser;
import javax.swing.JOptionPane;
import javax.swing.JTable;
import javax.swing.filechooser.FileNameExtensionFilter;
import javax.swing.table.DefaultTableModel;
import modeloImagenes.GestionA;
import modelo_Productos.*;
import models.Database;
import models.RenderTable;
import models.insertarImagen;
import org.jdesktop.swingx.autocomplete.AutoCompleteDecorator;

/**
 *
 * @author AGIL
 */
public class NuevoProducto extends javax.swing.JDialog {
    insertarImagen insertarImg = new insertarImagen();
    public Database db = new Database();
    public int id_usuario;
    public int id_producto;
    public ArrayList listaProductos = new ArrayList();
    Sucursales sucursales = new Sucursales();
    DefaultTableModel modeloTabla;
    
    public JButton editar;
    public ImageIcon imgEditar;
    public Icon iconEditar;
    
    public JButton eliminar;
    public ImageIcon imgEliminar;
    public Icon iconEliminar;
    public static int contValid ;
    
    JFileChooser seleccionado = new JFileChooser();
    File archivo;
    byte[] bytesImg;
    GestionA gestion = new GestionA();
    /**
     * Creates new form NuevoProducto
     */
    public NuevoProducto(java.awt.Frame parent, boolean modal,int id_usuario) {
        super(parent,modal);
        initComponents();
        setLocationRelativeTo(this);
        this.id_usuario = id_usuario;

        generarNumero();
        requerido1.setVisible(false);
        requerido2.setVisible(false);
        requerido3.setVisible(false);
        requerido4.setVisible(false);
        requerido5.setVisible(false);
        //requerido6.setVisible(false);
        erp_panel.setVisible(false);
        obtenerTipoProductos(); 
        //sucursales.agregarSucursal(comboSucursal,this.id_usuario);
        ObtenerSucursal();
        obtenerGrupos();
        
        String[] columnas = {"Id","Producto","Unid. Medida","Formulario","Costo Unit.","Total","Eliminar"};
        modeloTabla = new DefaultTableModel(null,columnas);
        
        tablaProductosBase.setDefaultRenderer(Object.class, new RenderTable());
 
        insertarBotones();
    }
    
    public NuevoProducto(java.awt.Frame parent, boolean modal,int id_producto, int id_usuario) {
        super(parent,modal);
        initComponents();
        setLocationRelativeTo(this);
        this.id_usuario = id_usuario;
        this.id_producto = id_producto;
        generarNumero();
        requerido1.setVisible(false);
        requerido2.setVisible(false);
        requerido3.setVisible(false);
        requerido4.setVisible(false);
        requerido5.setVisible(false);
       //requerido6.setVisible(false);
        
        obtenerTipoProductos(); 
        ObtenerSucursal();
        //sucursales.agregarSucursal(comboSucursal,this.id_usuario);
        obtenerGrupos();
        
        String[] columnas = {"Id","Producto","Unid. Medida","Formulario","Costo Unit.","Total","Eliminar"};
        modeloTabla = new DefaultTableModel(null,columnas);
        
        tablaProductosBase.setDefaultRenderer(Object.class, new RenderTable());
 
        insertarBotones();
        obtenerDatos();
    }
    
    public void obtenerDatos(){
         ResultSet rs = null;
        String imagen = "";
        int id_grupo = 0;
        int id_subGrupo = 0;
        int id_tipo_prod = 0;
        double descuentoFijo = 0.0;
        int almacen = 0;
        int cuenta = 0;
        int id_almacen = 0;
        
        for (int i = 0; i < db.seleccionarProductos(this.id_producto).size(); i++) {
            //textoCodigo.setText(db.seleccionarProductos(this.id_producto).get(i).getCodigo());
            textoNombre.setText(db.seleccionarProductos(this.id_producto).get(i).getNombre());
            textoUnidadMedida.setText(db.seleccionarProductos(this.id_producto).get(i).getUnidad_medida());
            textoPrecio.setText(Double.toString(db.seleccionarProductos(this.id_producto).get(i).getPrecio_unit()));
            textoRangoP.setText(Double.toString(db.seleccionarProductos(this.id_producto).get(i).getRango_max()));
            textoRangoM.setText(Double.toString(db.seleccionarProductos(this.id_producto).get(i).getRango_min()));
            imagen = db.seleccionarProductos(this.id_producto).get(i).getImagen();
            ImageIcon imgs = new ImageIcon(imagen);
            Icon imgIcon = new ImageIcon(imgs.getImage().getScaledInstance(80, 80, 1));
            img.setIcon(imgIcon);
            textoRuta.setText(imagen);
            textoRuta.setText(db.seleccionarProductos(this.id_producto).get(i).getImagen());
            textoDescripcion.setText(db.seleccionarProductos(this.id_producto).get(i).getDescripcion());
            radioPublicar.setSelected(db.seleccionarProductos(this.id_producto).get(i).isPublicar_panel());
            radioActivar.setSelected(db.seleccionarProductos(this.id_producto).get(i).isActivar_inventario());
            textoInvMinimo.setText(Integer.toString(db.seleccionarProductos(this.id_producto).get(i).getInventario_minimo()));
            id_grupo = db.seleccionarProductos(this.id_producto).get(i).getGrupo();
            id_subGrupo = db.seleccionarProductos(this.id_producto).get(i).getSubGrupo();
            ObtenerNombreGrupoSubGrupo(id_grupo,id_subGrupo);
            textoCaracEsp.setText(db.seleccionarProductos(this.id_producto).get(i).getCaracte_especial1());
            textoCaracEspecial2.setText(db.seleccionarProductos(this.id_producto).get(i).getCaracte_especial2());
            textoMarca.setText(db.seleccionarProductos(this.id_producto).get(i).getMarca());
            textoModelo.setText(db.seleccionarProductos(this.id_producto).get(i).getMarca());
            textoAño.setText(db.seleccionarProductos(this.id_producto).get(i).getAnio());
            textoCodFab.setText(db.seleccionarProductos(this.id_producto).get(i).getCodigo_fabrica());
            textoCodigo.setText(Double.toString(db.seleccionarProductos(this.id_producto).get(i).getComision()));
            textoVencimiento.setText(Double.toString(db.seleccionarProductos(this.id_producto).get(i).getAlerta()));
            textoDescuento.setText(Double.toString(db.seleccionarProductos(this.id_producto).get(i).getDescuento()));
            descuentoFijo = db.seleccionarProductos(this.id_producto).get(i).getDescuento_fijo();
            
            if (descuentoFijo == 1.0) {
                radioFijo.setSelected(true);
            }else{
                radioFijo.setSelected(false);
            }
            id_tipo_prod = db.seleccionarProductos(this.id_producto).get(i).getTipo_producto();
            ObtenerNombreTipoProducto(id_tipo_prod);
            id_almacen = db.seleccionarProductos(this.id_producto).get(i).getAlmacen();
            ObtenerNombreSucursalAlmacen(id_almacen);
            textoCuenta.setText(Integer.toString(db.seleccionarProductos(this.id_producto).get(i).getCuenta()));
            
            
        }
        
        try {
            String consulta4 = "SELECT P.NOMBRE,P.UNIDAD_MEDIDA,PB.FORMULACION,P.PRECIO_UNITARIO,P.ID\n" +
                "FROM PRODUCTO AS P\n" +
                "INNER JOIN PRODUCTO_BASE AS PB ON PB.PRODUCTO_BASE = P.ID\n" +
                "WHERE PB.PRODUCTO = "+this.id_producto;
            rs = db.seleccionar(consulta4);
            while (rs.next()) {                
                String nombre = rs.getString(1);
                String unidMedi = rs.getString(2);
                String formulacion = Double.toString(rs.getDouble(3));
                String precioUnit = Double.toString(rs.getDouble(4));
                double total = rs.getDouble(3)*rs.getDouble(4);
                Object[] dato = {rs.getInt(5),nombre,unidMedi,formulacion,precioUnit,Double.toString(total),eliminar};
                modeloTabla.addRow(dato);
                
            }
            tablaProductosBase.setModel(modeloTabla);
            tamañoTabla();
            
        } catch (Exception e) {
            System.out.println("Error al obtener los productos base "+e);
        }
    }
    
    public void ObtenerNombreSucursalAlmacen(int id_almacen){
        ResultSet rs = null;
        String consulta3 = "SELECT S.NOMBRE, A.NOMBRE\n" +
            "FROM ALMACEN AS A\n" +
            "INNER JOIN SUCURSAL AS S ON S.ID = A.SUCURSAL\n" +
            "WHERE A.ID = "+id_almacen;
        
        try {
            rs = db.seleccionar(consulta3);
            while(rs.next()){            
                comboSucursal.setSelectedItem(rs.getString(1));
                comboAlmacen.setSelectedItem(rs.getString(2));
            }
        } catch (Exception e) {
            System.out.println("Error al seleccionar sucursal almacen "+e);
        }
    }
    
    public void ObtenerNombreTipoProducto(int id_tipo_producto){
        ResultSet rs = null;
        String consulta2 = "SELECT NOMBRE \n" +
            "FROM CLASE\n" +
            "WHERE ID = "+id_tipo_producto;
        try {
            rs = db.seleccionar(consulta2);
            while (rs.next()) {   
                comboTipoProducto.setSelectedItem(rs.getString(1));
            }
        } catch (Exception e) {
            System.out.println("Error seleccioanr tipo producto "+e);
        }
    }
    
    public void ObtenerNombreGrupoSubGrupo(int id_grupo, int id_subGrupo){
        ResultSet rs = null;
        String consulta1 = "SELECT T.NOMBRE, C.NOMBRE\n" +
            "FROM PRODUCTO AS P\n" +
            "INNER JOIN TIPO AS T ON T.ID_EMPRESA = P.EMPRESA\n" +
            "INNER JOIN CLASE AS C ON C.ID_TIPO = T.ID\n" +
            "WHERE P.ID = "+this.id_producto+" AND T.ID = "+id_grupo+" AND C.ID = "+id_subGrupo;
        try {
            rs = db.seleccionar(consulta1);
            while (rs.next()) {  
                comboGrupos.setSelectedItem(rs.getString(1));
                comboSubGrupo.setSelectedItem(rs.getString(2));
            }
        } catch (Exception e) {
            System.out.println("Error "+e);
        }
    }
    
    public void ObtenerSucursal(){
        ResultSet rs = null;
        String sucursal = "";
        try {
            rs = db.seleccionar("SELECT S.ID,S.NOMBRE \n" 
                    + "FROM USUARIO AS U \n"
                    + "INNER JOIN SUCURSAL AS S ON S.EMPRESA = U.EMPRESA \n"
                    + "WHERE U.ID = "+this.id_usuario);
            while (rs.next()) {
                sucursal = rs.getString(2);
                comboSucursal.addItem(sucursal);
            }          
        } catch (Exception e) {
            System.out.println("Error al obtener sucursal "+e);
        }
    }
    
    public void generarNumero(){
        ResultSet rs = null;
        try {
            rs = db.seleccionar("SELECT * FROM PRODUCTO");
            if (rs.next()) {
                String numero = db.seleccionarCodigoProducto();
                int letra = Integer.parseInt(numero.substring(2))+1;
                String generar = "DC"+Integer.toString(letra);
                labelCodigo.setText(generar); 
                textoCodigo.setText(generar);
            }else{
                String numero = "1";
                String letra = "DC";
                String generar = letra+numero+")";
                textoCodigo.setText(generar);
                labelCodigo.setText(generar);
            }
        } catch (Exception e) {
            System.out.println("Error al generar el codigo "+e);
        }
        
    }
    
    public void obtenerTipoProductos(){
        ResultSet rs = null;
        try{
            rs = db.seleccionar("SELECT C.NOMBRE \n" +
                "FROM TIPO AS T\n" +
                "INNER JOIN CLASE AS C ON T.ID = C.ID_TIPO\n" +
                "WHERE T.ID = "+21);        
            while (rs.next()) {                               
                comboTipoProducto.addItem(rs.getString(1));
            }
        }catch(Exception e){
            System.out.println("Error "+e);
        }
        AutoCompleteDecorator.decorate(comboProducto);
    }
    
    public void autocompleteComboBox(){
        
        ResultSet rs = null;
        String consulta = "SELECT P.NOMBRE\n" +
            "FROM USUARIO AS U\n" +
            "INNER JOIN PRODUCTO AS P ON U.EMPRESA = P.EMPRESA\n" +
            "WHERE U.ID = "+this.id_usuario+" AND P.ELIMINADO = "+false;
        try {
            rs = db.seleccionar(consulta);
            while (rs.next()) {                
                comboProducto.addItem(rs.getString(1));
            }
        } catch (Exception e) {
            System.out.println("Error "+e);
        }
        
    }
    
    public void obtenerGrupos(){
        ResultSet rs = null;
        String nombre = "";
        String consulta = "SELECT T.NOMBRE \n" +
            "FROM USUARIO AS U\n" +
            "INNER JOIN TIPO AS T ON T.ID_EMPRESA = U.EMPRESA\n" +
            "WHERE U.ID = "+this.id_usuario;
        try {
            rs = db.seleccionar(consulta);
            while(rs.next()){
                nombre = rs.getString(1);
                comboGrupos.addItem(nombre);
            }
        } catch (Exception e) {
            System.out.println("Error al optener los grupos "+e);
        }
    }
    
    public int obtenerIdGrupo(String nombre){
        ResultSet rs = null;
        int id_grupos = 0;
        rs = db.seleccionar("SELECT ID FROM TIPO WHERE NOMBRE = '"+nombre+"'");
        try {
            while(rs.next()){
                id_grupos = rs.getInt(1);
            }
        } catch (Exception e) {
            System.out.println("Error al seleccionar el id de grupos "+e);
        }
        return id_grupos;
    }
    
    public int obtenerIdSubGrupo(String nombre){
        ResultSet rs = null;
        int id_SubGrupos = 0;
        rs = db.seleccionar("SELECT ID FROM CLASE WHERE NOMBRE = '"+nombre+"'");
        try {
            while(rs.next()){
                id_SubGrupos = rs.getInt(1);
            }
        } catch (Exception e) {
            System.out.println("Error al seleccionar el id de grupos "+e);
        }
        return id_SubGrupos;
    }
    
    public void insertarBotones(){
        String imgEdit = "/imagen/editar.png";
        imgEditar = new ImageIcon(this.getClass().getResource(imgEdit));
        iconEditar = new ImageIcon(imgEditar.getImage().getScaledInstance(20, 20, 1));
        editar = new JButton(iconEditar);
        editar.setName("editar");
        String imgElim = "/imagen/delete.png";
        imgEliminar = new ImageIcon(this.getClass().getResource(imgElim));
        iconEliminar = new ImageIcon(imgEliminar.getImage().getScaledInstance(20, 20, 1));
        eliminar = new JButton(iconEliminar);
        eliminar.setName("eliminar");
        
        tablaProductosBase.setRowHeight(33);
    }
            
    public void tamañoTabla() {
        tablaProductosBase.getColumnModel().getColumn(0).setMaxWidth(0);
        tablaProductosBase.getColumnModel().getColumn(0).setMinWidth(0);
        tablaProductosBase.getColumnModel().getColumn(0).setPreferredWidth(0);
        
        /*tablaProductosBase.getColumnModel().getColumn(1).setMaxWidth(120);
        tablaProductosBase.getColumnModel().getColumn(1).setMinWidth(120);
        tablaProductosBase.getColumnModel().getColumn(1).setPreferredWidth(120);

        tablaProductosBase.getColumnModel().getColumn(2).setMaxWidth(120);
        tablaProductosBase.getColumnModel().getColumn(2).setMinWidth(120);
        tablaProductosBase.getColumnModel().getColumn(2).setPreferredWidth(120);

        tablaProductosBase.getColumnModel().getColumn(3).setMaxWidth(60);
        tablaProductosBase.getColumnModel().getColumn(3).setMinWidth(60);
        tablaProductosBase.getColumnModel().getColumn(3).setPreferredWidth(60);

        tablaProductosBase.getColumnModel().getColumn(4).setMaxWidth(60);
        tablaProductosBase.getColumnModel().getColumn(4).setMinWidth(60);
        tablaProductosBase.getColumnModel().getColumn(4).setPreferredWidth(60);*/
    }
        
    public void limpiar(){
        int tam = tablaProductosBase.getRowCount();
        for (int i = tam-1; i >= 0; i--) {
            modeloTabla.removeRow(i);
        }
    }
    
    public void validar(){
        contValid = 0;
        if (textoNombre.getText().equals("")){requerido1.setVisible(true); contValid++;}else{requerido1.setVisible(false);}
        if (textoUnidadMedida.getText().equals("")){requerido2.setVisible(true); contValid++;}else{requerido2.setVisible(false);}
        if (textoPrecio.getText().equals("")){requerido3.setVisible(true); contValid++;}else{requerido3.setVisible(false);}
        if (comboGrupos.getSelectedItem().equals(" ")){requerido4.setVisible(true); contValid++;}else{requerido4.setVisible(false);}
        if (comboSubGrupo.getSelectedItem().equals(" ")){requerido5.setVisible(true); contValid++;}else{requerido5.setVisible(false);}
        //if (comboAlmacen.getSelectedItem().equals(" ")){requerido6.setVisible(true); contValid++;} else{requerido6.setVisible(false);}

    }
    
    public void ActualizarProductos(){
        
        Date fe = new Date();
        long dd = fe.getTime();
        java.sql.Date fechaAct = new java.sql.Date(dd); 
        String codigo = textoCodigo.getText();
        String nombre = textoNombre.getText();
        String unidad_medida = textoUnidadMedida.getText();
        double precio_unit = Double.parseDouble(textoPrecio.getText());
        double rango_Max = Double.parseDouble(textoRangoP.getText());
        double rango_Min = Double.parseDouble(textoRangoM.getText());
        String descripcion = textoDescripcion.getText();
        boolean publicar_panel = radioPublicar.isSelected();
        boolean actvar_Inventario = radioActivar.isSelected();
        int invent_minimo = Integer.parseInt(textoInvMinimo.getText());
        int id_grupo = obtenerIdGrupo((String) comboGrupos.getSelectedItem());
        int id_subGrupo = obtenerIdSubGrupo((String) comboSubGrupo.getSelectedItem());
        String caracteristica1 = textoCaracEsp.getText();
        String caracteristica2 = textoCaracEspecial2.getText();
        String marca = textoMarca.getText();
        String modelo = textoModelo.getText();
        String año = textoAño.getText();
        String codigo_fabrica = textoCodFab.getText();
        String comi = "";
        double comision = 0.0;
        if (comi.equals("")) {
            comision = 0.0;
        }else{
            comision = Double.parseDouble(textoComision.getText());
        }
        String alert_venci = "";
        int alerta_vencimiento = 0;
        if(alert_venci.equals("")){
            alerta_vencimiento = 0;
        }else{
            alerta_vencimiento = Integer.parseInt(textoVencimiento.getText());  
        }
        double descuento = Double.parseDouble(textoDescuento.getText());
        boolean fijo = radioFijo.isSelected();
        double descuento_fijo;
        if(fijo == true){
            descuento_fijo = 1.0;
        }else{
            descuento_fijo = 0.0;
        }
        int cuenta = Integer.parseInt(textoCuenta.getText());
        
        int id_empresa = id_empresa();
        String tipPro = (String) comboTipoProducto.getSelectedItem();
        int id_tipo_prod = 0;  
        double utilidad_esperada = 0.0;
        String nombre_almacen = (String)comboAlmacen.getSelectedItem();
        int id_almacen = id_almacen(nombre_almacen);
        
        if (contValid == 0) {
            if (tipPro.equals("PRODUCTO BASE")) {
                id_tipo_prod = obtenerIdSubGrupo(tipPro);
                db.actualizarProductosProd(this.id_producto, id_empresa, nombre, codigo, unidad_medida, precio_unit, utilidad_esperada, invent_minimo, descripcion, id_grupo, id_subGrupo, caracteristica1, caracteristica2, codigo_fabrica, rango_Max, rango_Min, fechaAct, comision, publicar_panel, alerta_vencimiento, descuento, descuento_fijo, id_tipo_prod, actvar_Inventario, marca, modelo, año, cuenta);
            
                int id_producto = this.id_producto;
                if(!textoRuta.getText().equals("")){
                    
                    File ruta = new File(textoRuta.getText()); 
                    String resp = insertarImg.guardarProductos(ruta, id_producto);
                    db.insertarImgenProducto(id_producto, resp);
                }else{
                    
                    File ruta = new File("/imagen/icon-producto-default.png"); 
                    String resp = insertarImg.guardarProductos(ruta, id_producto);
                    db.insertarImgenProducto(id_producto, resp);
                }
            }
            
            if (tipPro.equals("PRODUCTO INTERMEDIO")) {
                id_tipo_prod = obtenerIdSubGrupo(tipPro);
                db.actualizarProductosProd(this.id_producto, id_empresa, nombre, codigo, unidad_medida, precio_unit, utilidad_esperada, invent_minimo, descripcion, id_grupo, id_subGrupo, caracteristica1, caracteristica2, codigo_fabrica, rango_Max, rango_Min, fechaAct, comision, publicar_panel, alerta_vencimiento, descuento, descuento_fijo, id_tipo_prod, actvar_Inventario, marca, modelo, año, cuenta);
            
                int id_producto = this.id_producto;
                if(!textoRuta.getText().equals("")){
                    
                    File ruta = new File(textoRuta.getText()); 
                    String resp = insertarImg.guardarProductos(ruta, id_producto);
                    db.insertarImgenProducto(id_producto, resp);
                }else{
                    
                    File ruta = new File("/imagen/icon-producto-default.png"); 
                    String resp = insertarImg.guardarProductos(ruta, id_producto);
                    db.insertarImgenProducto(id_producto, resp);
                }
                
                int id = 0;
                int id_prodBase = 0;
                double formulazion = 0.0;
                ResultSet rs = null;
                
                try {
                    db.eliminarProductos("DELETE FROM APP.PRODUCTO_BASE WHERE PRODUCTO = "+this.id_producto);
                    for (int i = 0; i < tablaProductosBase.getRowCount(); i++) {
                        id_prodBase = Integer.parseInt(String.valueOf(tablaProductosBase.getValueAt(i, 0)));
                        formulazion = Double.parseDouble(String.valueOf(tablaProductosBase.getValueAt(i, 3)));
                        id = obtenerIdProductoBase(this.id_producto, id_prodBase);
                        
                        db.insertarProductosBasePro(id_producto, id_prodBase, formulazion, fechaAct, fechaAct,false);
                    }
                    
                } catch (Exception e) {
                    System.out.println("error "+e);
                }
            }
            
            if (tipPro.equals("PRODUCTO FINAL")) {
                id_tipo_prod = obtenerIdSubGrupo(tipPro);
                db.actualizarProductosProd(this.id_producto, id_empresa, nombre, codigo, unidad_medida, precio_unit, utilidad_esperada, invent_minimo, descripcion, id_grupo, id_subGrupo, caracteristica1, caracteristica2, codigo_fabrica, rango_Max, rango_Min, fechaAct, comision, publicar_panel, alerta_vencimiento, descuento, descuento_fijo, id_tipo_prod, actvar_Inventario, marca, modelo, año, cuenta);
            
                int id_producto = this.id_producto;
                if(!textoRuta.getText().equals("")){
                    
                    File ruta = new File(textoRuta.getText()); 
                    String resp = insertarImg.guardarProductos(ruta, id_producto);
                    db.insertarImgenProducto(id_producto, resp);
                }else{
                    
                    File ruta = new File("/imagen/icon-producto-default.png"); 
                    String resp = insertarImg.guardarProductos(ruta, id_producto);
                    db.insertarImgenProducto(id_producto, resp);
                }
                
                int id = 0;
                int id_prodBase = 0;
                double formulazion = 0.0;
                ResultSet rs = null;
                
                try {
                    db.eliminarProductos("DELETE FROM APP.PRODUCTO_BASE WHERE PRODUCTO = "+this.id_producto);
                    for (int i = 0; i < tablaProductosBase.getRowCount(); i++) {
                        id_prodBase = Integer.parseInt(String.valueOf(tablaProductosBase.getValueAt(i, 0)));
                        formulazion = Double.parseDouble(String.valueOf(tablaProductosBase.getValueAt(i, 3)));
                        id = obtenerIdProductoBase(this.id_producto, id_prodBase);
                        
                        db.insertarProductosBasePro(id_producto, id_prodBase, formulazion, fechaAct, fechaAct,false);
                    }                  
                } catch (Exception e) {
                    System.out.println("error "+e);
                }
            }
          
        }       
    }
    
    public boolean exiteProductoBase(int id){
        ResultSet rs = null;
        boolean existe = false;
        String consulta = "SELECT * FROM PRODUCTO_BASE AS PB "
                + "INNER JOIN PRODUCTO AS P ON PB.PRODUCTO = P.ID"
                + "WHERE PB.ID = "+id+" AND P.ELIMINADO = "+false;
        try {
             rs = db.seleccionar(consulta);
            if(rs.next()){
                existe = true;
            }else{
                existe = false;
            }
        } catch (Exception e) {
            System.out.println("Error al verificar "+e); 
        }
        return existe;
    }
    
    public int obtenerIdProductoBase(int id_produ, int id_prodBase){
    ResultSet rs = null; 
    int id = 0 ;
    try {

        String consulta = "SELECT ID FROM PRODUCTO_BASE WHERE PRODUCTO = "+id_produ+" AND PRODUCTO_BASE = "+id_prodBase;
        rs = db.seleccionar(consulta);
        while(rs.next()){
            id = rs.getInt(1);        
        }


        } catch (Exception e) {
            System.out.println("error "+e);
        }
        return id;
    }
    
    public int id_almacen(String nombre){
        int almacenERP = 0;
        ResultSet rs = null;

        try {
            rs = db.seleccionar("SELECT A.ID FROM ALMACEN AS A WHERE A.NOMBRE = '"+nombre+"'");
            while (rs.next()) {                
                almacenERP = rs.getInt(1);
            }
        } catch (Exception e) {
            System.out.println("Error en el almacen Producto "+e);
        }

        return almacenERP;
    }
    
    public int id_empresa(){
        ResultSet rs = null;
         int empresa = 0;
        try {
            rs = db.seleccionar("SELECT EMPRESA FROM USUARIO WHERE ID = "+this.id_usuario);
            while (rs.next()) {                
                empresa = rs.getInt(1);
            }
        } catch (Exception e) {
            System.out.println("Error en productos al seleccionar el id empresa "+e.getMessage());
        }
        return empresa;
    }
    
    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        jScrollPane2 = new javax.swing.JScrollPane();
        jTable1 = new javax.swing.JTable();
        jScrollPane1 = new javax.swing.JScrollPane();
        jPanel1 = new javax.swing.JPanel();
        jLabel1 = new javax.swing.JLabel();
        jLabel2 = new javax.swing.JLabel();
        labelCodigo = new javax.swing.JLabel();
        textoCodigo = new javax.swing.JTextField();
        jLabel3 = new javax.swing.JLabel();
        textoNombre = new javax.swing.JTextField();
        jLabel4 = new javax.swing.JLabel();
        textoUnidadMedida = new javax.swing.JTextField();
        jLabel5 = new javax.swing.JLabel();
        textoPrecio = new javax.swing.JTextField();
        jLabel6 = new javax.swing.JLabel();
        textoRangoP = new javax.swing.JTextField();
        jLabel7 = new javax.swing.JLabel();
        textoRangoM = new javax.swing.JTextField();
        jLabel8 = new javax.swing.JLabel();
        textoDescripcion = new javax.swing.JTextField();
        jLabel9 = new javax.swing.JLabel();
        textoRuta = new javax.swing.JTextField();
        cargarImg = new javax.swing.JButton();
        img = new javax.swing.JLabel();
        requerido1 = new javax.swing.JLabel();
        requerido2 = new javax.swing.JLabel();
        requerido3 = new javax.swing.JLabel();
        radioPublicar = new javax.swing.JRadioButton();
        radioActivar = new javax.swing.JRadioButton();
        jLabel10 = new javax.swing.JLabel();
        textoInvMinimo = new javax.swing.JTextField();
        jLabel11 = new javax.swing.JLabel();
        jLabel12 = new javax.swing.JLabel();
        comboGrupos = new javax.swing.JComboBox<>();
        jLabel13 = new javax.swing.JLabel();
        comboSubGrupo = new javax.swing.JComboBox<>();
        jLabel14 = new javax.swing.JLabel();
        textoCaracEsp = new javax.swing.JTextField();
        jLabel15 = new javax.swing.JLabel();
        textoCaracEspecial2 = new javax.swing.JTextField();
        requerido4 = new javax.swing.JLabel();
        requerido5 = new javax.swing.JLabel();
        jLabel16 = new javax.swing.JLabel();
        textoMarca = new javax.swing.JTextField();
        jLabel17 = new javax.swing.JLabel();
        textoModelo = new javax.swing.JTextField();
        jLabel18 = new javax.swing.JLabel();
        textoAño = new javax.swing.JTextField();
        jLabel19 = new javax.swing.JLabel();
        textoCodFab = new javax.swing.JTextField();
        jLabel20 = new javax.swing.JLabel();
        textoComision = new javax.swing.JTextField();
        jLabel21 = new javax.swing.JLabel();
        textoVencimiento = new javax.swing.JTextField();
        jLabel22 = new javax.swing.JLabel();
        textoDescuento = new javax.swing.JTextField();
        radioFijo = new javax.swing.JRadioButton();
        jLabel23 = new javax.swing.JLabel();
        jLabel24 = new javax.swing.JLabel();
        comboTipoProducto = new javax.swing.JComboBox<>();
        guardar = new javax.swing.JButton();
        cancelar = new javax.swing.JButton();
        panelTipoProd = new javax.swing.JPanel();
        jLabel25 = new javax.swing.JLabel();
        jLabel27 = new javax.swing.JLabel();
        textoUnidMedidaAlma = new javax.swing.JTextField();
        jLabel28 = new javax.swing.JLabel();
        textoFormulacion = new javax.swing.JTextField();
        add = new javax.swing.JButton();
        jScrollPane3 = new javax.swing.JScrollPane();
        tablaProductosBase = 
        new JTable(){
            public boolean isCellEditable(int rowIndex, int colIndex) {
                return colIndex != 0 && colIndex != 1 && colIndex != 2 
                && colIndex != 3 && colIndex != 4 && colIndex != 5
                && colIndex != 6;
            }
        };
        comboProducto = new javax.swing.JComboBox<>();
        jLabel33 = new javax.swing.JLabel();
        labelTotal = new javax.swing.JLabel();
        erp_panel = new javax.swing.JPanel();
        textoCuenta = new javax.swing.JTextField();
        comboAlmacen = new javax.swing.JComboBox<>();
        comboSucursal = new javax.swing.JComboBox<>();
        jLabel29 = new javax.swing.JLabel();
        jLabel26 = new javax.swing.JLabel();
        jLabel31 = new javax.swing.JLabel();
        jLabel30 = new javax.swing.JLabel();
        requerido6 = new javax.swing.JLabel();
        jLabel32 = new javax.swing.JLabel();

        jTable1.setModel(new javax.swing.table.DefaultTableModel(
            new Object [][] {
                {null, null, null, null},
                {null, null, null, null},
                {null, null, null, null},
                {null, null, null, null}
            },
            new String [] {
                "Title 1", "Title 2", "Title 3", "Title 4"
            }
        ));
        jScrollPane2.setViewportView(jTable1);

        setDefaultCloseOperation(javax.swing.WindowConstants.DO_NOTHING_ON_CLOSE);

        jScrollPane1.setHorizontalScrollBar(null);

        jPanel1.setBackground(new java.awt.Color(255, 255, 255));

        jLabel1.setFont(new java.awt.Font("Arial", 1, 14)); // NOI18N
        jLabel1.setForeground(new java.awt.Color(27, 106, 170));
        jLabel1.setText("Datos Del Producto");

        jLabel2.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel2.setForeground(new java.awt.Color(27, 106, 170));
        jLabel2.setText("Codigo (Último Generado: ");

        labelCodigo.setForeground(new java.awt.Color(27, 106, 170));

        jLabel3.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel3.setForeground(new java.awt.Color(27, 106, 170));
        jLabel3.setText("Nombre");

        jLabel4.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel4.setForeground(new java.awt.Color(27, 106, 170));
        jLabel4.setText("Unidad De Medida");

        jLabel5.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel5.setForeground(new java.awt.Color(27, 106, 170));
        jLabel5.setText("Precio");

        textoPrecio.addKeyListener(new java.awt.event.KeyAdapter() {
            public void keyTyped(java.awt.event.KeyEvent evt) {
                textoPrecioKeyTyped(evt);
            }
        });

        jLabel6.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel6.setForeground(new java.awt.Color(27, 106, 170));
        jLabel6.setText("Rango +");

        textoRangoP.addKeyListener(new java.awt.event.KeyAdapter() {
            public void keyTyped(java.awt.event.KeyEvent evt) {
                textoRangoPKeyTyped(evt);
            }
        });

        jLabel7.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel7.setForeground(new java.awt.Color(27, 106, 170));
        jLabel7.setText("Rango -");

        textoRangoM.addKeyListener(new java.awt.event.KeyAdapter() {
            public void keyTyped(java.awt.event.KeyEvent evt) {
                textoRangoMKeyTyped(evt);
            }
        });

        jLabel8.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel8.setForeground(new java.awt.Color(27, 106, 170));
        jLabel8.setText("Descripción");

        jLabel9.setFont(new java.awt.Font("Arial", 1, 14)); // NOI18N
        jLabel9.setForeground(new java.awt.Color(27, 106, 170));
        jLabel9.setText("Datos Adicionales");

        cargarImg.setText("Cargar");
        cargarImg.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                cargarImgActionPerformed(evt);
            }
        });

        requerido1.setForeground(new java.awt.Color(255, 51, 51));
        requerido1.setText("Requerido");

        requerido2.setForeground(new java.awt.Color(255, 51, 51));
        requerido2.setText("Requerido");

        requerido3.setForeground(new java.awt.Color(255, 51, 51));
        requerido3.setText("Requerido");

        radioPublicar.setBackground(new java.awt.Color(255, 255, 255));
        radioPublicar.setText(" Publicar Panel?");

        radioActivar.setBackground(new java.awt.Color(255, 255, 255));
        radioActivar.setText(" Activar Inventario?");

        jLabel10.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel10.setForeground(new java.awt.Color(27, 106, 170));
        jLabel10.setText("Inventario Minimo");

        jLabel11.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel11.setForeground(new java.awt.Color(27, 106, 170));
        jLabel11.setText("Imagen");

        jLabel12.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel12.setForeground(new java.awt.Color(27, 106, 170));
        jLabel12.setText("Grupos");

        comboGrupos.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                comboGruposActionPerformed(evt);
            }
        });

        jLabel13.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel13.setForeground(new java.awt.Color(27, 106, 170));
        jLabel13.setText("Sub-Grupos");

        jLabel14.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel14.setForeground(new java.awt.Color(27, 106, 170));
        jLabel14.setText("Carac. Especial 1");

        jLabel15.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel15.setForeground(new java.awt.Color(27, 106, 170));
        jLabel15.setText("Carac. Especial 2");

        requerido4.setForeground(new java.awt.Color(255, 51, 51));
        requerido4.setText("Requerido");

        requerido5.setForeground(new java.awt.Color(255, 51, 51));
        requerido5.setText("Requerido");

        jLabel16.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel16.setForeground(new java.awt.Color(27, 106, 170));
        jLabel16.setText("Marca");

        jLabel17.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel17.setForeground(new java.awt.Color(27, 106, 170));
        jLabel17.setText("Modelo");

        jLabel18.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel18.setForeground(new java.awt.Color(27, 106, 170));
        jLabel18.setText("Año");

        jLabel19.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel19.setForeground(new java.awt.Color(27, 106, 170));
        jLabel19.setText("Codigo Fabrica");

        jLabel20.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel20.setForeground(new java.awt.Color(27, 106, 170));
        jLabel20.setText("Comisión");

        textoComision.addKeyListener(new java.awt.event.KeyAdapter() {
            public void keyTyped(java.awt.event.KeyEvent evt) {
                textoComisionKeyTyped(evt);
            }
        });

        jLabel21.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel21.setForeground(new java.awt.Color(27, 106, 170));
        jLabel21.setText("Alerta Vencimiento");

        textoVencimiento.addKeyListener(new java.awt.event.KeyAdapter() {
            public void keyTyped(java.awt.event.KeyEvent evt) {
                textoVencimientoKeyTyped(evt);
            }
        });

        jLabel22.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel22.setForeground(new java.awt.Color(27, 106, 170));
        jLabel22.setText("Descuento");

        textoDescuento.addKeyListener(new java.awt.event.KeyAdapter() {
            public void keyTyped(java.awt.event.KeyEvent evt) {
                textoDescuentoKeyTyped(evt);
            }
        });

        radioFijo.setBackground(new java.awt.Color(255, 255, 255));

        jLabel23.setFont(new java.awt.Font("Arial", 1, 14)); // NOI18N
        jLabel23.setForeground(new java.awt.Color(27, 106, 170));
        jLabel23.setText("Tipo De Producto");

        jLabel24.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel24.setForeground(new java.awt.Color(27, 106, 170));
        jLabel24.setText("Tipo Producto");

        comboTipoProducto.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                comboTipoProductoActionPerformed(evt);
            }
        });

        guardar.setBackground(new java.awt.Color(98, 155, 88));
        guardar.setForeground(new java.awt.Color(255, 255, 255));
        guardar.setText("Guardar");
        guardar.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                guardarActionPerformed(evt);
            }
        });

        cancelar.setBackground(new java.awt.Color(183, 70, 53));
        cancelar.setForeground(new java.awt.Color(255, 255, 255));
        cancelar.setText("Cancelar");
        cancelar.setBorder(javax.swing.BorderFactory.createLineBorder(new java.awt.Color(209, 91, 71)));
        cancelar.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                cancelarActionPerformed(evt);
            }
        });

        panelTipoProd.setBackground(new java.awt.Color(255, 255, 255));

        jLabel25.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel25.setForeground(new java.awt.Color(27, 106, 170));
        jLabel25.setText("Producto");

        jLabel27.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel27.setForeground(new java.awt.Color(27, 106, 170));
        jLabel27.setText("Unid. Medida");

        textoUnidMedidaAlma.setEditable(false);

        jLabel28.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel28.setForeground(new java.awt.Color(27, 106, 170));
        jLabel28.setText("Formulacion");

        add.setBackground(new java.awt.Color(98, 155, 88));
        add.setIcon(new javax.swing.ImageIcon(getClass().getResource("/imagen/addition-white.png"))); // NOI18N
        add.setBorder(javax.swing.BorderFactory.createLineBorder(new java.awt.Color(135, 184, 127)));
        add.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                addActionPerformed(evt);
            }
        });

        tablaProductosBase.setModel(new javax.swing.table.DefaultTableModel(
            new Object [][] {

            },
            new String [] {
                "Id", "Producto", "Unid. Medida", "Formulario", "Costo Unit.", "Total", "Eliminar"
            }
        ));
        tablaProductosBase.addMouseListener(new java.awt.event.MouseAdapter() {
            public void mouseClicked(java.awt.event.MouseEvent evt) {
                tablaProductosBaseMouseClicked(evt);
            }
        });
        jScrollPane3.setViewportView(tablaProductosBase);
        if (tablaProductosBase.getColumnModel().getColumnCount() > 0) {
            tablaProductosBase.getColumnModel().getColumn(0).setMinWidth(0);
            tablaProductosBase.getColumnModel().getColumn(0).setPreferredWidth(0);
            tablaProductosBase.getColumnModel().getColumn(0).setMaxWidth(0);
            tablaProductosBase.getColumnModel().getColumn(1).setResizable(false);
            tablaProductosBase.getColumnModel().getColumn(2).setResizable(false);
            tablaProductosBase.getColumnModel().getColumn(3).setResizable(false);
            tablaProductosBase.getColumnModel().getColumn(4).setResizable(false);
            tablaProductosBase.getColumnModel().getColumn(5).setResizable(false);
            tablaProductosBase.getColumnModel().getColumn(6).setResizable(false);
        }

        comboProducto.setModel(new javax.swing.DefaultComboBoxModel<>(new String[] { " " }));
        comboProducto.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                comboProductoActionPerformed(evt);
            }
        });

        jLabel33.setFont(new java.awt.Font("Arial", 1, 14)); // NOI18N
        jLabel33.setForeground(new java.awt.Color(27, 106, 170));
        jLabel33.setText("Total: ");

        labelTotal.setForeground(new java.awt.Color(255, 51, 51));

        comboAlmacen.setModel(new javax.swing.DefaultComboBoxModel<>(new String[] { " " }));
        comboAlmacen.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                comboAlmacenActionPerformed(evt);
            }
        });

        comboSucursal.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                comboSucursalActionPerformed(evt);
            }
        });

        jLabel29.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel29.setForeground(new java.awt.Color(27, 106, 170));
        jLabel29.setText("Sucursal");

        jLabel26.setFont(new java.awt.Font("Arial", 1, 14)); // NOI18N
        jLabel26.setForeground(new java.awt.Color(27, 106, 170));
        jLabel26.setText("ERP");

        jLabel31.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel31.setForeground(new java.awt.Color(27, 106, 170));
        jLabel31.setText("Cuenta");

        jLabel30.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel30.setForeground(new java.awt.Color(27, 106, 170));
        jLabel30.setText("Almacen");

        requerido6.setForeground(new java.awt.Color(255, 51, 51));
        requerido6.setText("Requerido");

        javax.swing.GroupLayout erp_panelLayout = new javax.swing.GroupLayout(erp_panel);
        erp_panel.setLayout(erp_panelLayout);
        erp_panelLayout.setHorizontalGroup(
            erp_panelLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(erp_panelLayout.createSequentialGroup()
                .addGap(34, 34, 34)
                .addGroup(erp_panelLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(jLabel26)
                    .addGroup(erp_panelLayout.createSequentialGroup()
                        .addGroup(erp_panelLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addGroup(erp_panelLayout.createSequentialGroup()
                                .addComponent(jLabel29, javax.swing.GroupLayout.PREFERRED_SIZE, 80, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addGap(44, 44, 44))
                            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, erp_panelLayout.createSequentialGroup()
                                .addComponent(comboSucursal, javax.swing.GroupLayout.PREFERRED_SIZE, 107, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addGap(18, 18, 18)))
                        .addGroup(erp_panelLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(jLabel30, javax.swing.GroupLayout.PREFERRED_SIZE, 80, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addComponent(comboAlmacen, javax.swing.GroupLayout.PREFERRED_SIZE, 89, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addComponent(requerido6))
                        .addGap(18, 18, 18)
                        .addGroup(erp_panelLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(textoCuenta, javax.swing.GroupLayout.PREFERRED_SIZE, 90, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addComponent(jLabel31, javax.swing.GroupLayout.PREFERRED_SIZE, 80, javax.swing.GroupLayout.PREFERRED_SIZE))))
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );
        erp_panelLayout.setVerticalGroup(
            erp_panelLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(erp_panelLayout.createSequentialGroup()
                .addContainerGap()
                .addComponent(jLabel26)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(erp_panelLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jLabel29)
                    .addComponent(jLabel30)
                    .addComponent(jLabel31))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(erp_panelLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(comboSucursal, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(comboAlmacen, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(textoCuenta, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addGap(4, 4, 4)
                .addComponent(requerido6)
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );

        javax.swing.GroupLayout panelTipoProdLayout = new javax.swing.GroupLayout(panelTipoProd);
        panelTipoProd.setLayout(panelTipoProdLayout);
        panelTipoProdLayout.setHorizontalGroup(
            panelTipoProdLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(panelTipoProdLayout.createSequentialGroup()
                .addContainerGap()
                .addGroup(panelTipoProdLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(comboProducto, javax.swing.GroupLayout.PREFERRED_SIZE, 165, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(jLabel25))
                .addGap(37, 37, 37)
                .addGroup(panelTipoProdLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(panelTipoProdLayout.createSequentialGroup()
                        .addGap(1, 1, 1)
                        .addComponent(jLabel27, javax.swing.GroupLayout.PREFERRED_SIZE, 80, javax.swing.GroupLayout.PREFERRED_SIZE))
                    .addComponent(textoUnidMedidaAlma, javax.swing.GroupLayout.PREFERRED_SIZE, 70, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addGap(28, 28, 28)
                .addGroup(panelTipoProdLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(jLabel28, javax.swing.GroupLayout.PREFERRED_SIZE, 80, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(textoFormulacion, javax.swing.GroupLayout.PREFERRED_SIZE, 68, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addGap(34, 34, 34)
                .addComponent(add, javax.swing.GroupLayout.PREFERRED_SIZE, 42, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
            .addGroup(panelTipoProdLayout.createSequentialGroup()
                .addGroup(panelTipoProdLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(jScrollPane3, javax.swing.GroupLayout.PREFERRED_SIZE, 493, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addGroup(panelTipoProdLayout.createSequentialGroup()
                        .addComponent(jLabel33)
                        .addGap(300, 300, 300)
                        .addComponent(labelTotal, javax.swing.GroupLayout.PREFERRED_SIZE, 53, javax.swing.GroupLayout.PREFERRED_SIZE))
                    .addComponent(erp_panel, javax.swing.GroupLayout.PREFERRED_SIZE, 121, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addGap(0, 226, Short.MAX_VALUE))
        );
        panelTipoProdLayout.setVerticalGroup(
            panelTipoProdLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(panelTipoProdLayout.createSequentialGroup()
                .addGap(23, 23, 23)
                .addGroup(panelTipoProdLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING)
                    .addGroup(panelTipoProdLayout.createSequentialGroup()
                        .addGroup(panelTipoProdLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING)
                            .addComponent(jLabel28)
                            .addComponent(jLabel25))
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                        .addGroup(panelTipoProdLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                            .addComponent(textoFormulacion, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addComponent(comboProducto, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)))
                    .addComponent(add, javax.swing.GroupLayout.PREFERRED_SIZE, 37, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addGroup(panelTipoProdLayout.createSequentialGroup()
                        .addComponent(jLabel27)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                        .addComponent(textoUnidMedidaAlma, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jScrollPane3, javax.swing.GroupLayout.PREFERRED_SIZE, 112, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addGroup(panelTipoProdLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING, false)
                    .addComponent(jLabel33, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                    .addComponent(labelTotal, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(erp_panel, javax.swing.GroupLayout.PREFERRED_SIZE, 34, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );

        jLabel32.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel32.setForeground(new java.awt.Color(27, 106, 170));
        jLabel32.setText("Fijo");

        javax.swing.GroupLayout jPanel1Layout = new javax.swing.GroupLayout(jPanel1);
        jPanel1.setLayout(jPanel1Layout);
        jPanel1Layout.setHorizontalGroup(
            jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel1Layout.createSequentialGroup()
                .addContainerGap()
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(jPanel1Layout.createSequentialGroup()
                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(jLabel1)
                            .addComponent(textoDescripcion, javax.swing.GroupLayout.PREFERRED_SIZE, 223, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addComponent(jLabel9)
                            .addGroup(jPanel1Layout.createSequentialGroup()
                                .addComponent(radioPublicar)
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                .addComponent(radioActivar))
                            .addGroup(jPanel1Layout.createSequentialGroup()
                                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addComponent(jLabel10, javax.swing.GroupLayout.PREFERRED_SIZE, 99, javax.swing.GroupLayout.PREFERRED_SIZE)
                                    .addComponent(textoInvMinimo, javax.swing.GroupLayout.PREFERRED_SIZE, 83, javax.swing.GroupLayout.PREFERRED_SIZE))
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addGroup(jPanel1Layout.createSequentialGroup()
                                        .addComponent(jLabel12, javax.swing.GroupLayout.PREFERRED_SIZE, 99, javax.swing.GroupLayout.PREFERRED_SIZE)
                                        .addGap(18, 18, 18)
                                        .addComponent(jLabel13, javax.swing.GroupLayout.PREFERRED_SIZE, 99, javax.swing.GroupLayout.PREFERRED_SIZE)
                                        .addGap(18, 18, 18)
                                        .addComponent(jLabel14, javax.swing.GroupLayout.PREFERRED_SIZE, 99, javax.swing.GroupLayout.PREFERRED_SIZE)
                                        .addGap(68, 68, 68)
                                        .addComponent(jLabel15, javax.swing.GroupLayout.PREFERRED_SIZE, 99, javax.swing.GroupLayout.PREFERRED_SIZE))
                                    .addGroup(jPanel1Layout.createSequentialGroup()
                                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                            .addComponent(comboGrupos, javax.swing.GroupLayout.PREFERRED_SIZE, 110, javax.swing.GroupLayout.PREFERRED_SIZE)
                                            .addComponent(requerido4))
                                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                            .addComponent(requerido5)
                                            .addGroup(jPanel1Layout.createSequentialGroup()
                                                .addComponent(comboSubGrupo, javax.swing.GroupLayout.PREFERRED_SIZE, 109, javax.swing.GroupLayout.PREFERRED_SIZE)
                                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                                .addComponent(textoCaracEsp, javax.swing.GroupLayout.PREFERRED_SIZE, 160, javax.swing.GroupLayout.PREFERRED_SIZE)
                                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                                .addComponent(textoCaracEspecial2, javax.swing.GroupLayout.PREFERRED_SIZE, 167, javax.swing.GroupLayout.PREFERRED_SIZE))))))
                            .addGroup(jPanel1Layout.createSequentialGroup()
                                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addGroup(jPanel1Layout.createSequentialGroup()
                                        .addComponent(jLabel2)
                                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                        .addComponent(labelCodigo, javax.swing.GroupLayout.PREFERRED_SIZE, 57, javax.swing.GroupLayout.PREFERRED_SIZE)
                                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                        .addComponent(textoCodigo, javax.swing.GroupLayout.PREFERRED_SIZE, 87, javax.swing.GroupLayout.PREFERRED_SIZE))
                                    .addGroup(jPanel1Layout.createSequentialGroup()
                                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                            .addComponent(requerido1)
                                            .addComponent(textoNombre, javax.swing.GroupLayout.PREFERRED_SIZE, 121, javax.swing.GroupLayout.PREFERRED_SIZE)
                                            .addComponent(jLabel3, javax.swing.GroupLayout.PREFERRED_SIZE, 55, javax.swing.GroupLayout.PREFERRED_SIZE))
                                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                            .addGroup(jPanel1Layout.createSequentialGroup()
                                                .addComponent(jLabel4, javax.swing.GroupLayout.PREFERRED_SIZE, 111, javax.swing.GroupLayout.PREFERRED_SIZE)
                                                .addGap(18, 18, 18)
                                                .addComponent(jLabel5, javax.swing.GroupLayout.PREFERRED_SIZE, 44, javax.swing.GroupLayout.PREFERRED_SIZE))
                                            .addGroup(jPanel1Layout.createSequentialGroup()
                                                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                                    .addComponent(textoUnidadMedida, javax.swing.GroupLayout.PREFERRED_SIZE, 117, javax.swing.GroupLayout.PREFERRED_SIZE)
                                                    .addComponent(requerido2))
                                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                                                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                                    .addComponent(textoPrecio, javax.swing.GroupLayout.PREFERRED_SIZE, 69, javax.swing.GroupLayout.PREFERRED_SIZE)
                                                    .addComponent(requerido3))))
                                        .addGap(69, 69, 69)
                                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                            .addGroup(jPanel1Layout.createSequentialGroup()
                                                .addComponent(jLabel6, javax.swing.GroupLayout.PREFERRED_SIZE, 51, javax.swing.GroupLayout.PREFERRED_SIZE)
                                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                                                .addComponent(jLabel7, javax.swing.GroupLayout.PREFERRED_SIZE, 51, javax.swing.GroupLayout.PREFERRED_SIZE)
                                                .addGap(18, 18, 18)
                                                .addComponent(jLabel11, javax.swing.GroupLayout.PREFERRED_SIZE, 51, javax.swing.GroupLayout.PREFERRED_SIZE))
                                            .addGroup(jPanel1Layout.createSequentialGroup()
                                                .addComponent(textoRangoP, javax.swing.GroupLayout.PREFERRED_SIZE, 49, javax.swing.GroupLayout.PREFERRED_SIZE)
                                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                                                .addComponent(textoRangoM, javax.swing.GroupLayout.PREFERRED_SIZE, 49, javax.swing.GroupLayout.PREFERRED_SIZE)
                                                .addGap(18, 18, 18)
                                                .addComponent(textoRuta, javax.swing.GroupLayout.PREFERRED_SIZE, 138, javax.swing.GroupLayout.PREFERRED_SIZE)
                                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                                .addComponent(cargarImg)))))
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                                .addComponent(img, javax.swing.GroupLayout.PREFERRED_SIZE, 82, javax.swing.GroupLayout.PREFERRED_SIZE)))
                        .addGap(0, 0, Short.MAX_VALUE))
                    .addGroup(jPanel1Layout.createSequentialGroup()
                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addGroup(jPanel1Layout.createSequentialGroup()
                                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addGroup(jPanel1Layout.createSequentialGroup()
                                        .addGap(166, 166, 166)
                                        .addComponent(jLabel17, javax.swing.GroupLayout.PREFERRED_SIZE, 53, javax.swing.GroupLayout.PREFERRED_SIZE)
                                        .addGap(25, 25, 25)
                                        .addComponent(jLabel18, javax.swing.GroupLayout.PREFERRED_SIZE, 53, javax.swing.GroupLayout.PREFERRED_SIZE)
                                        .addGap(29, 29, 29)
                                        .addComponent(jLabel19, javax.swing.GroupLayout.PREFERRED_SIZE, 96, javax.swing.GroupLayout.PREFERRED_SIZE)
                                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                                        .addComponent(jLabel20, javax.swing.GroupLayout.PREFERRED_SIZE, 65, javax.swing.GroupLayout.PREFERRED_SIZE)
                                        .addGap(2, 2, 2)
                                        .addComponent(jLabel21, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
                                    .addComponent(jLabel16, javax.swing.GroupLayout.PREFERRED_SIZE, 53, javax.swing.GroupLayout.PREFERRED_SIZE)
                                    .addGroup(jPanel1Layout.createSequentialGroup()
                                        .addComponent(textoMarca, javax.swing.GroupLayout.PREFERRED_SIZE, 158, javax.swing.GroupLayout.PREFERRED_SIZE)
                                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                        .addComponent(textoModelo, javax.swing.GroupLayout.PREFERRED_SIZE, 74, javax.swing.GroupLayout.PREFERRED_SIZE)
                                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                        .addComponent(textoAño, javax.swing.GroupLayout.PREFERRED_SIZE, 71, javax.swing.GroupLayout.PREFERRED_SIZE)
                                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                        .addComponent(textoCodFab, javax.swing.GroupLayout.PREFERRED_SIZE, 101, javax.swing.GroupLayout.PREFERRED_SIZE)
                                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                        .addComponent(textoComision, javax.swing.GroupLayout.PREFERRED_SIZE, 65, javax.swing.GroupLayout.PREFERRED_SIZE)
                                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                        .addComponent(textoVencimiento, javax.swing.GroupLayout.PREFERRED_SIZE, 80, javax.swing.GroupLayout.PREFERRED_SIZE)))
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addComponent(textoDescuento, javax.swing.GroupLayout.PREFERRED_SIZE, 68, javax.swing.GroupLayout.PREFERRED_SIZE)
                                    .addComponent(jLabel22, javax.swing.GroupLayout.PREFERRED_SIZE, 80, javax.swing.GroupLayout.PREFERRED_SIZE))
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addComponent(jLabel32, javax.swing.GroupLayout.PREFERRED_SIZE, 21, javax.swing.GroupLayout.PREFERRED_SIZE)
                                    .addComponent(radioFijo))
                                .addGap(149, 149, 149))
                            .addGroup(jPanel1Layout.createSequentialGroup()
                                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addComponent(panelTipoProd, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                                    .addComponent(jLabel8, javax.swing.GroupLayout.PREFERRED_SIZE, 74, javax.swing.GroupLayout.PREFERRED_SIZE)
                                    .addComponent(jLabel23)
                                    .addComponent(comboTipoProducto, javax.swing.GroupLayout.PREFERRED_SIZE, 158, javax.swing.GroupLayout.PREFERRED_SIZE)
                                    .addComponent(jLabel24, javax.swing.GroupLayout.PREFERRED_SIZE, 80, javax.swing.GroupLayout.PREFERRED_SIZE))
                                .addGap(0, 0, Short.MAX_VALUE)))
                        .addContainerGap())))
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, jPanel1Layout.createSequentialGroup()
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                .addComponent(cancelar, javax.swing.GroupLayout.PREFERRED_SIZE, 80, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(110, 110, 110)
                .addComponent(guardar)
                .addGap(225, 225, 225))
        );
        jPanel1Layout.setVerticalGroup(
            jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, jPanel1Layout.createSequentialGroup()
                .addContainerGap()
                .addComponent(jLabel1)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING, false)
                    .addGroup(jPanel1Layout.createSequentialGroup()
                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING)
                            .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                .addComponent(jLabel2)
                                .addComponent(labelCodigo, javax.swing.GroupLayout.PREFERRED_SIZE, 15, javax.swing.GroupLayout.PREFERRED_SIZE))
                            .addComponent(textoCodigo, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                            .addComponent(jLabel3)
                            .addComponent(jLabel5)
                            .addComponent(jLabel6)
                            .addComponent(jLabel7)
                            .addComponent(jLabel4)
                            .addComponent(jLabel11))
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addGroup(jPanel1Layout.createSequentialGroup()
                                .addComponent(textoUnidadMedida, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                .addComponent(requerido2))
                            .addGroup(jPanel1Layout.createSequentialGroup()
                                .addComponent(textoNombre, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                .addComponent(requerido1))
                            .addComponent(cargarImg)
                            .addGroup(jPanel1Layout.createSequentialGroup()
                                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                                    .addComponent(textoPrecio, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                                    .addComponent(textoRangoP, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                                    .addComponent(textoRangoM, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                                    .addComponent(textoRuta, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                .addComponent(requerido3))))
                    .addComponent(img, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jLabel8)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(textoDescripcion, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(18, 18, 18)
                .addComponent(jLabel9)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(radioPublicar)
                    .addComponent(radioActivar))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(jPanel1Layout.createSequentialGroup()
                        .addComponent(jLabel10)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                        .addComponent(textoInvMinimo, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                    .addGroup(jPanel1Layout.createSequentialGroup()
                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                            .addComponent(jLabel12)
                            .addComponent(jLabel13)
                            .addComponent(jLabel14)
                            .addComponent(jLabel15))
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                            .addComponent(comboGrupos, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addComponent(comboSubGrupo, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addComponent(textoCaracEsp, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addComponent(textoCaracEspecial2, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(requerido4)
                            .addComponent(requerido5))))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jLabel16)
                    .addComponent(jLabel17)
                    .addComponent(jLabel18)
                    .addComponent(jLabel19)
                    .addComponent(jLabel20)
                    .addComponent(jLabel21)
                    .addComponent(jLabel22)
                    .addComponent(jLabel32))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(radioFijo)
                    .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                        .addComponent(textoMarca, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addComponent(textoModelo, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addComponent(textoAño, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addComponent(textoCodFab, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addComponent(textoComision, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addComponent(textoVencimiento, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addComponent(textoDescuento, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)))
                .addGap(46, 46, 46)
                .addComponent(jLabel23)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jLabel24)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(comboTipoProducto, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(panelTipoProd, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(18, 18, 18)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(cancelar, javax.swing.GroupLayout.PREFERRED_SIZE, 39, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(guardar, javax.swing.GroupLayout.PREFERRED_SIZE, 39, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addContainerGap(212, Short.MAX_VALUE))
        );

        jScrollPane1.setViewportView(jPanel1);

        javax.swing.GroupLayout layout = new javax.swing.GroupLayout(getContentPane());
        getContentPane().setLayout(layout);
        layout.setHorizontalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addComponent(jScrollPane1, javax.swing.GroupLayout.DEFAULT_SIZE, 842, Short.MAX_VALUE)
        );
        layout.setVerticalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addComponent(jScrollPane1, javax.swing.GroupLayout.DEFAULT_SIZE, 805, Short.MAX_VALUE)
        );

        pack();
    }// </editor-fold>//GEN-END:initComponents

    private void cargarImgActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_cargarImgActionPerformed
         JFileChooser j = new JFileChooser();
         
        FileNameExtensionFilter fil = new FileNameExtensionFilter("JPG, PNG & GIF","jpg","png","gif");
        j.setFileFilter(fil);
        
        int s = j.showOpenDialog(this);
        if(s == JFileChooser.APPROVE_OPTION){
            String ruta = j.getSelectedFile().getAbsolutePath();
            File file = new File(ruta);
            textoRuta.setText(ruta);
            Image logo = getToolkit().getImage(textoRuta.getText());
            logo = logo.getScaledInstance(80, 80, Image.SCALE_DEFAULT);
            img.setIcon(new ImageIcon(logo));    
        }
    }//GEN-LAST:event_cargarImgActionPerformed

    private void comboTipoProductoActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_comboTipoProductoActionPerformed
        String tipoProducto = (String) comboTipoProducto.getSelectedItem();
        
        if (tipoProducto.equals("PRODUCTO FINAL")) {
            comboProducto.removeAllItems();
            panelTipoProd.setVisible(true);
            autocompleteComboBox();
        }
        if (tipoProducto.equals("PRODUCTO INTERMEDIO")) {
            panelTipoProd.setVisible(true);
            comboProducto.removeAllItems();
            autocompleteComboBox();
        }
        if (tipoProducto.equals("PRODUCTO BASE")) {
            panelTipoProd.setVisible(false);
            limpiar();
            
        }
    }//GEN-LAST:event_comboTipoProductoActionPerformed

    private void guardarActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_guardarActionPerformed
        contValid = 0;
        
        if(this.id_producto != 0){
            ActualizarProductos();
        }else{
            ResultSet rs = null;
            insertarImagen insertarP = new insertarImagen();
            Date fe = new Date();
            long dd = fe.getTime();
            java.sql.Date fechaAct = new java.sql.Date(dd);    

            int empresa = 0;
            try {
                rs = db.seleccionar("SELECT EMPRESA FROM USUARIO WHERE ID = "+this.id_usuario);
                while (rs.next()) {                
                    empresa = rs.getInt(1);
                }
            } catch (Exception e) {
                System.out.println("Error en productos al seleccionar el id empresa "+e.getMessage());
            }
            int id_empresa = empresa;
            String codigo = textoCodigo.getText();
            String nombre = textoNombre.getText();
            String UnidadMedida = textoUnidadMedida.getText();
            double precioUnit = Double.parseDouble(textoPrecio.getText());     
            String uniMax = textoRangoP.getText();
            double unidadMax;
            if(uniMax.equals(nombre)){unidadMax=0.0;}else{unidadMax=Double.parseDouble(uniMax);}
            String uniMin = textoRangoM.getText();
            double unidadMin;
            if (uniMin.equals("")){unidadMin = 0.0;}else{unidadMin = Double.parseDouble(uniMin);}


            double utilidad_esperada = 0.0;
            String inv_min = textoInvMinimo.getText();
            int inventario_minimo;
            if (inv_min.equals("")) {inventario_minimo=0;}else{inventario_minimo=Integer.parseInt(inv_min);}
            String descripcion = textoDescripcion.getText();
            String nombreGrupo = (String) comboGrupos.getSelectedItem();
            int id_grupo = obtenerIdGrupo(nombreGrupo);
            String nombreSubGrupo = (String) comboSubGrupo.getSelectedItem();
            int id_subGrupo = obtenerIdSubGrupo(nombreSubGrupo);
            String caracte1 = textoCaracEsp.getText();
            String caracte2 = textoCaracEspecial2.getText();
            String codigo_fabrica = textoCodFab.getText();
            String comi = textoComision.getText();
            int comision;
            if(comi.equals("")){comision = 0;}else{comision = Integer.parseInt(comi);}
            boolean publicar_panel = radioPublicar.isSelected();
            boolean activar_panel = radioActivar.isSelected();
            String ale = textoVencimiento.getText();
            int alerta_venci;
            if (ale.equals("")){alerta_venci = 0;}else{alerta_venci = Integer.parseInt(ale);}
            String desc = textoDescuento.getText();
            double descuento ;
            if (desc.equals("")) {descuento = 0.0;}else{descuento = Double.parseDouble(desc);}
            boolean fijo = radioFijo.isSelected();
            int descFijo;
            if (fijo == true) {descFijo = 1;}else{descFijo = 0;}
            String marca = textoMarca.getText();
            String modelo = textoModelo.getText();
            String anio = textoAño.getText();

            int almacenERP = 0;
           
            String nombreSuc = (String) comboSucursal.getSelectedItem();
            int id_sucursal = 0;
            try {
                rs = db.seleccionar("SELECT A.ID FROM SUCURSAL AS A WHERE A.NOMBRE = '"+nombreSuc+"'");
                while (rs.next()) {                
                    id_sucursal = rs.getInt(1);
                }
            } catch (Exception e) {
                System.out.println("Error al seleccionar id sucursal "+e);
            }

            try {
                rs = db.seleccionar("SELECT A.ID FROM ALMACEN AS A WHERE A.SUCURSAL = "+id_sucursal);
                while (rs.next()) {                
                    almacenERP = rs.getInt(1);
                }
            } catch (Exception e) {
                System.out.println("Error en el almacen Producto "+e);
            }


            String cue = textoCuenta.getText();
            int cuenta;
            if(cue.equals("")){cuenta = 0; }else{cuenta = Integer.parseInt(cue);}


            String tipPro = (String) comboTipoProducto.getSelectedItem();
            int id_tipo_prod = 0; 
            
            validar();
            if(contValid == 0){
                if (tipPro.equals("PRODUCTO BASE")) {
                    id_tipo_prod = obtenerIdSubGrupo(tipPro);
                    db.insertarProductosProd(id_empresa, nombre, codigo, UnidadMedida, precioUnit, utilidad_esperada, inventario_minimo, descripcion, id_grupo, id_subGrupo, caracte1, caracte2, codigo_fabrica, unidadMax, unidadMin, fechaAct, fechaAct, comision, publicar_panel, alerta_venci, descuento, descFijo, id_tipo_prod, activar_panel, marca, modelo, anio, cuenta,false);   

                    int id_producto = db.seleccionarUltimoIdProducto();
                    if(!textoRuta.getText().equals("")){
                        File ruta = new File(textoRuta.getText()); 

                        String resp = insertarP.guardarProductos(ruta, id_producto);
                        db.insertarImgenProducto(id_producto, resp);
                                                 
                    }else{
                        File ruta = new File("/imagen/icon-producto-default.png"); 
                        String resp = insertarP.guardarProductos(ruta, id_producto);
                        db.insertarImgenProducto(id_producto, resp);
                    }
                }

                if (tipPro.equals("PRODUCTO FINAL")) {
                    id_tipo_prod = obtenerIdSubGrupo(tipPro);
                    db.insertarProductosProd(id_empresa, nombre, codigo, UnidadMedida, precioUnit, utilidad_esperada, inventario_minimo, descripcion, id_grupo, id_subGrupo, caracte1, caracte2, codigo_fabrica, unidadMax, unidadMin, fechaAct, fechaAct, comision, publicar_panel, alerta_venci, descuento, descFijo, id_tipo_prod, activar_panel, marca, modelo, anio, cuenta,false);   

                    int id_producto = db.seleccionarUltimoIdProducto();
                    if(!textoRuta.getText().equals("")){
                        File ruta = new File(textoRuta.getText()); 

                        String resp = insertarP.guardarProductos(ruta, id_producto);
                        db.insertarImgenProducto(id_producto, resp);
                    }else{
                        File ruta = new File("/imagen/icon-producto-default.png"); 
                        String resp = insertarP.guardarProductos(ruta, id_producto);
                        db.insertarImgenProducto(id_producto, resp);
                    }

                    int id_prodBase = 0;
                    double formulazion = 0.0;

                    for (int i = 0; i < tablaProductosBase.getRowCount(); i++) {
                        id_prodBase = (int) tablaProductosBase.getValueAt(i, 0);
                        formulazion = (double) tablaProductosBase.getValueAt(i, 3);
                        db.insertarProductosBasePro(id_producto, id_prodBase, formulazion, fechaAct, fechaAct,false);
                    }

                }

                if (tipPro.equals("PRODUCTO INTERMEDIO")) {
                    id_tipo_prod = obtenerIdSubGrupo(tipPro);
                    db.insertarProductosProd(id_empresa, nombre, codigo, UnidadMedida, precioUnit, utilidad_esperada, inventario_minimo, descripcion, id_grupo, id_subGrupo, caracte1, caracte2, codigo_fabrica, unidadMax, unidadMin, fechaAct, fechaAct, comision, publicar_panel, alerta_venci, descuento, descFijo, id_tipo_prod, activar_panel, marca, modelo, anio, cuenta, false);   

                    int id_producto = db.seleccionarUltimoIdProducto();

                    if(!textoRuta.getText().equals("")){
                        File ruta = new File(textoRuta.getText()); 

                        String resp = insertarP.guardarProductos(ruta, id_producto);
                        db.insertarImgenProducto(id_producto, resp);
                    }else{
                        File ruta = new File("/imagen/icon-producto-default.png"); 
                        String resp = insertarP.guardarProductos(ruta, id_producto);
                        db.insertarImgenProducto(id_producto, resp);
                    }

                    int id_prodBase = 0;
                    String formu = "";
                    double formulazion = 0.0;
                    for (int i = 0; i < tablaProductosBase.getRowCount(); i++) {
                        id_prodBase = (int) tablaProductosBase.getValueAt(i, 0);
                        formu = (String) tablaProductosBase.getValueAt(i, 3);
                        formulazion = Double.parseDouble(formu);
                        db.insertarProductosBasePro(id_producto, id_prodBase, formulazion, fechaAct, fechaAct,false);
                    }   
                }

               JOptionPane.showMessageDialog(null, "Guardado Exitosamente!");
               dispose();
            }else{
                JOptionPane.showMessageDialog(null, "Ingrese los campos requeridos.");
            }
        }
    }//GEN-LAST:event_guardarActionPerformed

    private void comboGruposActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_comboGruposActionPerformed
        String grupo = (String) comboGrupos.getSelectedItem();
        String subGrupo = "";
        boolean habilitado = true;
        ResultSet rs = null;
        String consulta = "SELECT C.NOMBRE\n" +
            "FROM USUARIO AS U\n" +
            "INNER JOIN TIPO AS T ON T.ID_EMPRESA = U.EMPRESA\n" +
            "INNER JOIN CLASE AS C ON C.ID_TIPO = T.ID\n" +
            "WHERE U.ID = "+this.id_usuario+" AND T.NOMBRE = '"+grupo+"' AND C.HABILITADO = "+habilitado;
        
        try {
            comboSubGrupo.removeAllItems();
            rs = db.seleccionar(consulta);
            while(rs.next()){
                subGrupo = rs.getString(1);
                comboSubGrupo.addItem(subGrupo);
            }
        } catch (Exception e) {
            System.out.println("Error "+e);
        }
    }//GEN-LAST:event_comboGruposActionPerformed

    private void cancelarActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_cancelarActionPerformed
        dispose();
    }//GEN-LAST:event_cancelarActionPerformed

    private void comboSucursalActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_comboSucursalActionPerformed
       // Sucursales nomSuc = (Sucursales)comboSucursal.getSelectedItem();
       comboAlmacen.removeAllItems();
        int id_sucursal = 0;     
        String nombre = (String)comboSucursal.getSelectedItem();
        ResultSet rs = null;
        try {
            rs = db.seleccionar("SELECT A.ID FROM SUCURSAL AS A WHERE A.NOMBRE = '"+nombre+"'");
            while (rs.next()) {                
                id_sucursal = rs.getInt(1);
            }
        } catch (Exception e) {
            System.out.println("Error al seleccionar id sucursal "+e);
        }
        
        try {
            rs = db.seleccionar("SELECT A.NOMBRE FROM ALMACEN AS A WHERE A.SUCURSAL = "+id_sucursal);
            while (rs.next()) {                
                comboAlmacen.addItem(rs.getString(1));
            }
        } catch (Exception e) {
            System.out.println("Error en el almacen Producto "+e);
        }
            
    }//GEN-LAST:event_comboSucursalActionPerformed

    private void addActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_addActionPerformed
        ResultSet rs = null;
        int id = 0;
        String unidadMedid = "";
        double precioUnit = 0;
        String formulacion = textoFormulacion.getText();
        
        String nombre = (String) comboProducto.getSelectedItem();
        rs = db.seleccionar("SELECT P.ID,P.UNIDAD_MEDIDA,P.PRECIO_UNITARIO\n" +
            "FROM USUARIO AS U\n" +
            "INNER JOIN PRODUCTO AS P ON P.EMPRESA = U.EMPRESA\n" +
            "WHERE U.ID = "+this.id_usuario+" AND P.NOMBRE = '"+nombre+"'");
        try {
            while (rs.next()) {                
                id = rs.getInt(1);
                unidadMedid = rs.getString(2); 
                precioUnit = rs.getDouble(3);
            }
            double total = Integer.parseInt(formulacion)*precioUnit;
            Object[] data = {id,nombre,unidadMedid,formulacion,precioUnit,total,eliminar};
            modeloTabla.addRow(data);
            
            tablaProductosBase.setModel(modeloTabla);
            tamañoTabla();
            
        } catch (Exception e) {
            System.out.println("Error al seleccionar los productos "+e);
        }
        
        double sumarTotal = 0.0;
        double numero = 0.0;
        for (int i = 0; i < tablaProductosBase.getRowCount(); i++) {
            numero = Double.parseDouble(String.valueOf(tablaProductosBase.getValueAt(i, 5)));
            sumarTotal = sumarTotal + numero;
        }
        labelTotal.setText(Double.toString(sumarTotal));
    }//GEN-LAST:event_addActionPerformed

    private void comboProductoActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_comboProductoActionPerformed
        ResultSet rs = null;
        int id;
        String unidadMedid = "";
        double precioUnita;
        String nombre = (String) comboProducto.getSelectedItem();
        rs = db.seleccionar("SELECT P.ID,P.UNIDAD_MEDIDA \n" +
            "FROM USUARIO AS U\n" +
            "INNER JOIN PRODUCTO AS P ON P.EMPRESA = U.EMPRESA\n" +
            "WHERE U.ID = "+this.id_usuario+" AND P.NOMBRE = '"+nombre+"'");
        try {
            while (rs.next()) {                
                id = rs.getInt(1);
                unidadMedid = rs.getString(2);          
            }
        } catch (Exception e) {
            System.out.println("Error al seleccionar los productos "+e);
        }
        textoUnidMedidaAlma.setText(unidadMedid);
        textoFormulacion.setText("0");
    }//GEN-LAST:event_comboProductoActionPerformed

    private void tablaProductosBaseMouseClicked(java.awt.event.MouseEvent evt) {//GEN-FIRST:event_tablaProductosBaseMouseClicked
        int columna = tablaProductosBase.getColumnModel().getColumnIndexAtX(evt.getX());
        int fila = evt.getY() / tablaProductosBase.getRowHeight();

        if (fila < tablaProductosBase.getRowCount() && fila >= 0 && columna < tablaProductosBase.getColumnCount() && columna >= 0) {
            Object value = tablaProductosBase.getValueAt(fila, columna);

            if (value instanceof JButton) {
                ((JButton) value).doClick();
                    JButton botonAccion = (JButton) value;

                if (botonAccion.getName().equals("eliminar")) {
                    modeloTabla.removeRow(fila);
                    
                    double contador = 0.0;
                    for (int i = 0; i < tablaProductosBase.getRowCount(); i++) {
                        contador += (double) tablaProductosBase.getValueAt(i, 5);
                    }
                    labelTotal.setText(Double.toString(contador));
                    
                }
            }
        }
    }//GEN-LAST:event_tablaProductosBaseMouseClicked

    private void textoPrecioKeyTyped(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_textoPrecioKeyTyped
        char c = evt.getKeyChar();
        if (((c < '0') || (c > '9')) 
        && (c != KeyEvent.VK_BACK_SPACE)
        && (c != '.' || textoPrecio.getText().contains(".")) ) {
            evt.consume();
        }
    }//GEN-LAST:event_textoPrecioKeyTyped

    private void textoRangoPKeyTyped(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_textoRangoPKeyTyped
               char c = evt.getKeyChar();
        if (((c < '0') || (c > '9')) 
        && (c != KeyEvent.VK_BACK_SPACE)
        && (c != '.' || textoPrecio.getText().contains(".")) ) {
            evt.consume();
        }
    }//GEN-LAST:event_textoRangoPKeyTyped

    private void textoRangoMKeyTyped(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_textoRangoMKeyTyped
                char c = evt.getKeyChar();
        if (((c < '0') || (c > '9')) 
        && (c != KeyEvent.VK_BACK_SPACE)
        && (c != '.' || textoPrecio.getText().contains(".")) ) {
            evt.consume();
        }
    }//GEN-LAST:event_textoRangoMKeyTyped

    private void textoComisionKeyTyped(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_textoComisionKeyTyped
                char c = evt.getKeyChar();
        if (((c < '0') || (c > '9')) 
        && (c != KeyEvent.VK_BACK_SPACE)
        && (c != '.' || textoPrecio.getText().contains(".")) ) {
            evt.consume();
        }
    }//GEN-LAST:event_textoComisionKeyTyped

    private void textoVencimientoKeyTyped(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_textoVencimientoKeyTyped
        char c = evt.getKeyChar();
        if (((c < '0') || (c > '9')) 
        && (c != KeyEvent.VK_BACK_SPACE)
        && (c != '.' || textoPrecio.getText().contains(".")) ) {
            evt.consume();
        }
    }//GEN-LAST:event_textoVencimientoKeyTyped

    private void textoDescuentoKeyTyped(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_textoDescuentoKeyTyped
                char c = evt.getKeyChar();
        if (((c < '0') || (c > '9')) 
        && (c != KeyEvent.VK_BACK_SPACE)
        && (c != '.' || textoPrecio.getText().contains(".")) ) {
            evt.consume();
        }
    }//GEN-LAST:event_textoDescuentoKeyTyped

    private void comboAlmacenActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_comboAlmacenActionPerformed
        // TODO add your handling code here:
    }//GEN-LAST:event_comboAlmacenActionPerformed
    
    
    
    /**
     * @param args the command line arguments
     */

    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JButton add;
    private javax.swing.JButton cancelar;
    private javax.swing.JButton cargarImg;
    private javax.swing.JComboBox<String> comboAlmacen;
    private javax.swing.JComboBox<String> comboGrupos;
    private javax.swing.JComboBox<String> comboProducto;
    private javax.swing.JComboBox<String> comboSubGrupo;
    private javax.swing.JComboBox<String> comboSucursal;
    private javax.swing.JComboBox<String> comboTipoProducto;
    private javax.swing.JPanel erp_panel;
    private javax.swing.JButton guardar;
    private javax.swing.JLabel img;
    private javax.swing.JLabel jLabel1;
    private javax.swing.JLabel jLabel10;
    private javax.swing.JLabel jLabel11;
    private javax.swing.JLabel jLabel12;
    private javax.swing.JLabel jLabel13;
    private javax.swing.JLabel jLabel14;
    private javax.swing.JLabel jLabel15;
    private javax.swing.JLabel jLabel16;
    private javax.swing.JLabel jLabel17;
    private javax.swing.JLabel jLabel18;
    private javax.swing.JLabel jLabel19;
    private javax.swing.JLabel jLabel2;
    private javax.swing.JLabel jLabel20;
    private javax.swing.JLabel jLabel21;
    private javax.swing.JLabel jLabel22;
    private javax.swing.JLabel jLabel23;
    private javax.swing.JLabel jLabel24;
    private javax.swing.JLabel jLabel25;
    private javax.swing.JLabel jLabel26;
    private javax.swing.JLabel jLabel27;
    private javax.swing.JLabel jLabel28;
    private javax.swing.JLabel jLabel29;
    private javax.swing.JLabel jLabel3;
    private javax.swing.JLabel jLabel30;
    private javax.swing.JLabel jLabel31;
    private javax.swing.JLabel jLabel32;
    private javax.swing.JLabel jLabel33;
    private javax.swing.JLabel jLabel4;
    private javax.swing.JLabel jLabel5;
    private javax.swing.JLabel jLabel6;
    private javax.swing.JLabel jLabel7;
    private javax.swing.JLabel jLabel8;
    private javax.swing.JLabel jLabel9;
    private javax.swing.JPanel jPanel1;
    private javax.swing.JScrollPane jScrollPane1;
    private javax.swing.JScrollPane jScrollPane2;
    private javax.swing.JScrollPane jScrollPane3;
    private javax.swing.JTable jTable1;
    private javax.swing.JLabel labelCodigo;
    private javax.swing.JLabel labelTotal;
    private javax.swing.JPanel panelTipoProd;
    private javax.swing.JRadioButton radioActivar;
    private javax.swing.JRadioButton radioFijo;
    private javax.swing.JRadioButton radioPublicar;
    private javax.swing.JLabel requerido1;
    private javax.swing.JLabel requerido2;
    private javax.swing.JLabel requerido3;
    private javax.swing.JLabel requerido4;
    private javax.swing.JLabel requerido5;
    private javax.swing.JLabel requerido6;
    private javax.swing.JTable tablaProductosBase;
    private javax.swing.JTextField textoAño;
    private javax.swing.JTextField textoCaracEsp;
    private javax.swing.JTextField textoCaracEspecial2;
    private javax.swing.JTextField textoCodFab;
    private javax.swing.JTextField textoCodigo;
    private javax.swing.JTextField textoComision;
    private javax.swing.JTextField textoCuenta;
    private javax.swing.JTextField textoDescripcion;
    private javax.swing.JTextField textoDescuento;
    private javax.swing.JTextField textoFormulacion;
    private javax.swing.JTextField textoInvMinimo;
    private javax.swing.JTextField textoMarca;
    private javax.swing.JTextField textoModelo;
    private javax.swing.JTextField textoNombre;
    private javax.swing.JTextField textoPrecio;
    private javax.swing.JTextField textoRangoM;
    private javax.swing.JTextField textoRangoP;
    private javax.swing.JTextField textoRuta;
    private javax.swing.JTextField textoUnidMedidaAlma;
    private javax.swing.JTextField textoUnidadMedida;
    private javax.swing.JTextField textoVencimiento;
    // End of variables declaration//GEN-END:variables
}
