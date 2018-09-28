/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package UI;

import Conexion.Conexion;
import Conexion.Conexion2;
import Conexion.DataBase;
import Conexion.RestServer;
import Conexion.VentasDB;
import Modelos.JButtonProducto;
import java.awt.Dimension;
import java.awt.KeyEventDispatcher;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.KeyEvent;
import java.sql.ResultSet;
import java.util.ArrayList;
import javax.swing.JOptionPane;
import javax.swing.SwingConstants;
import Modelos.*;
import java.awt.KeyboardFocusManager;
import java.awt.event.KeyAdapter;
import java.net.URL;
import java.net.URLConnection;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.util.Date;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.swing.Icon;
import javax.swing.ImageIcon;
import javax.swing.JButton;
import javax.swing.JLabel;
import javax.swing.JTable;
import javax.swing.RowFilter;
import javax.swing.table.DefaultTableCellRenderer;
import javax.swing.table.DefaultTableModel;
import javax.swing.table.TableCellRenderer;
import javax.swing.table.TableRowSorter;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
/**
 *
 * @author AGIL
 */
public class VentasUI extends javax.swing.JFrame implements ActionListener {
    DataBase db = new DataBase();
    
    private int id_usuario;
    private int id_empresa;
    DefaultTableModel modalProductos;
    ProductosSeleccionados prodSelected;
    ArrayList<ProductosSeleccionados> listaProdSelected = new ArrayList();
    
    public ImageIcon img;
    public Icon icon;
    String EliminarUrl;
    String QuitarUrl;
    ImageIcon imgQuitar;
    Icon iconQuitar;
    ImageIcon imgEliminar;
    Icon iconEliminar;
    
    JButton quitar;
    JButton eliminar;
    
    JButtonProducto menu[] = null;
    JButtonProducto boton;
    
    /**
     * Creates new form VentasUI
     */
    //Sin conexion a internet
    public VentasUI(int id_usuario){
        initComponents();
        setLocationRelativeTo(this);
        this.id_usuario = id_usuario;
        
    }
    //Con conexion a internet
    public VentasUI(int id_usuario,int id_empresa) {
        initComponents();
        setLocationRelativeTo(this);
        this.setExtendedState(MAXIMIZED_BOTH);
        this.id_usuario = id_usuario;
        this.id_empresa = id_empresa;
        
        //setExtendedState(6);
       // setVisible(true);
        String[] columnas = {"id","#","Cant","Producto","Prod.Unit.(Bs)","Imp.(Bs)","Quitar","Eliminar"};
        modalProductos = (DefaultTableModel) tablaProductos.getModel();//new DefaultTableModel(null,columnas);    
        tablaProductos.setDefaultRenderer(Object.class, new RenderTabla());  
        
        KeyboardFocusManager manager = KeyboardFocusManager.getCurrentKeyboardFocusManager();
        manager.addKeyEventDispatcher(new VentasUI.MyDispatcher());
        
        QuitarUrl = "/imagen/substract.png";
        EliminarUrl = "/imagen/eliminar.png";
        
        imgQuitar = new ImageIcon(this.getClass().getResource(QuitarUrl));
        iconQuitar = new ImageIcon(imgQuitar.getImage().getScaledInstance(20, 20, 1));
        quitar = new JButton(iconQuitar);
        quitar.setName("quitar");
        
        imgEliminar = new ImageIcon(this.getClass().getResource(EliminarUrl));
        iconEliminar = new ImageIcon(imgEliminar.getImage().getScaledInstance(20, 20, 1));
        eliminar = new JButton(iconEliminar);
        eliminar.setName("eliminar");
        
        tablaProductos.setRowHeight(33);
        
        agregarFecha();
        
        //sincronizarConAgil("2018-09-12");
     // insertarTipoMovimientos("MOVEGR");
      // InsertarSelecciones("TIPA");
      // InsertarActividadComercial("ACTCOM");
     //  InsertarTipoProducto("TPS");

        
        comboMovimientos();
        comboSucursal();
        
        textDias.setEditable(false);
        textSujetoCF.setEditable(false);
        textACuenta.setEditable(false);
        textSaldo.setEditable(false);
        
        alinearTextoTabla();
        centrar_datos();
        
    }
    
    public void alinearTextoTabla(){
        TableCellRenderer rendererFromHeader = tablaProductos.getTableHeader().getDefaultRenderer();
        JLabel headerLabel = (JLabel) rendererFromHeader;
        headerLabel.setHorizontalAlignment(JLabel.CENTER);
    }
    
    
    public void centrar_datos(){  
        DefaultTableCellRenderer modelocentrar = new DefaultTableCellRenderer(); 
        modelocentrar.setHorizontalAlignment(SwingConstants.CENTER); 
        tablaProductos.getColumnModel().getColumn(1).setCellRenderer(modelocentrar); 
        tablaProductos.getColumnModel().getColumn(2).setCellRenderer(modelocentrar);
        tablaProductos.getColumnModel().getColumn(3).setCellRenderer(modelocentrar);
        tablaProductos.getColumnModel().getColumn(4).setCellRenderer(modelocentrar);
   
    } 
     
    private boolean getConnectionStatus() {
        String estado = "";
        boolean respuesta = false;
        try { 
            URL ruta=new URL("http://agilsof.net/"); 
            URLConnection rutaC = ruta.openConnection(); 
            rutaC.connect(); 
            estado="Online"; 
            respuesta = true;
        }catch(Exception e){ 
            estado="Offline"; 
            respuesta  = false;
        } 
        return respuesta;   
    }
    
    public void agregarFecha() {
        java.util.Date fe = new java.util.Date();
        String feAct = (String) fe.toString();
        java.util.Date fechaParseada;
        combofecha.setDate(fe);
    }
    
    public void insertarActividades(){
        int id;
        int id_sucursal;
        int id_actividad;
        int id_dosificaciones;
        String createdat;
        String updatedat;
        String created;
        String updated;    
        int id_actividades;
    
        if(getConnectionStatus() == true){
            String url = "/dosificaciones/empresa/"+this.id_empresa;
            JSONArray res = RestServer.getJSONArray(url);
           
            for (int i = 0; i < res.length(); i++) {
                try {
                    JSONObject actividades = res.getJSONObject(i);
                    //System.out.println(actividades.getJSONArray("actividadesSucursales"));
                    JSONArray actividad = actividades.getJSONArray("actividadesSucursales");
                    
                    for (int j = 0; j < actividad.length(); j++) {
                        JSONObject objectActividad = actividad.getJSONObject(j);
                        id = objectActividad.getInt("id");
                        id_sucursal = objectActividad.get("id_sucursal").toString().equals("null")? 0:Integer.parseInt(objectActividad.get("id_sucursal").toString());
                        id_actividad = objectActividad.getInt("id_actividad");
                        id_dosificaciones = objectActividad.getInt("id_dosificacion");
                        created = objectActividad.getString("createdAt");
                        updated = objectActividad.getString("updatedAt");

                        if (id_sucursal == 0) {
                            db.InsertarSucursalActividadIdSucNull(id, id_actividad, id_dosificaciones, created, updated);
                        }else{
                            db.InsertarSucursalActividad(id, id_sucursal, id_actividad, id_dosificaciones, created, updated);                      
                        }  
                    }
                } catch (JSONException ex) {
                    System.out.println("Error dosificaciones: "+ex);
                    Logger.getLogger(VentasUI.class.getName()).log(Level.SEVERE, null, ex);
                }

            }
        }
    }
    
    public void insertarTipoMovimientos(String tipo){
        
        if (getConnectionStatus() == true) {
            String url = "/tipos/"+tipo;
            JSONObject res = RestServer.getJSONObject(url);    
            try {
                int id = res.getInt("id");
                String nombre = res.getString("nombre");
                String nombreCorto = res.getString("nombre_corto");
                int id_empresa = res.get("id_empresa").toString().equals("null")? 0:Integer.parseInt(res.get("id_empresa").toString());
                String created = res.getString("createdAt");
                String updated = res.getString("updatedAt");
                if (id_empresa == 0) {
                    db.InsertarTiposEmpresaNull(id, nombre, nombreCorto, created, updated);
                }else{
                    db.InsertarTipos(id, nombre, nombreCorto, created, updated, id_empresa);
                }
                
                JSONArray clases = res.getJSONArray("clases");
                for (int i = 0; i < clases.length(); i++) {
                    JSONObject clase = clases.getJSONObject(i);
                    
                    int idC = clase.getInt("id");
                    int id_tipo = clase.getInt("id_tipo");
                    String nombreC = clase.getString("nombre");
                    String nombre_cortoC = clase.getString("nombre_corto");
                    boolean habilitado = clase.getBoolean("habilitado");
                    boolean eliminado = clase.getBoolean("eliminado");
                    String createdC = clase.getString("createdAt");
                    String updatedC = clase.getString("updatedAt");
                    
                    db.InsertarClases(idC, id_tipo, nombreC, nombre_cortoC, habilitado, createdC, updatedC);
                    
                }
            } catch (JSONException ex) {
                Logger.getLogger(VentasUI.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }
    
    public void InsertarSelecciones(String tipo) {
        int id;
        String nombre;
        String nombre_corto;
        java.sql.Date createdAt ;
        java.sql.Date updatedAt ;
        String created;
        String updated;
        int id_empresa ;
     
        if (getConnectionStatus() == true) {
            
            String url = "/tipos/"+tipo;
            JSONObject res = RestServer.getJSONObject(url);
            SimpleDateFormat formatter=new SimpleDateFormat("yyyy-MM-dd");  
            try {
                id = res.getInt("id");
                nombre = res.getString("nombre");
                nombre_corto = res.getString("nombre_corto");
                id_empresa = res.get("id_empresa").toString().equals("null")? 0:Integer.parseInt(res.get("id_empresa").toString()); ;
                created = (String) res.getString("createdAt");
                updated = (String) res.get("updatedAt");
                String createdTransformado = created.substring(0, 10);

                if (id_empresa == 0) {
                    db.InsertarTiposEmpresaNull(id, nombre, nombre_corto, created, updated);
                }else{
                    db.InsertarTipos(id, nombre, nombre_corto, created, updated, id_empresa);          
                }

                JSONArray clases  = res.getJSONArray("clases");
                for (int i = 0; i < clases.length(); i++) {
                    JSONObject clase = clases.getJSONObject(i);
                    int id_clase = clase.getInt("id");
                    int id_tipo = clase.getInt("id_tipo");
                    String nombre_clase = clase.getString("nombre");
                    String nombre_corto_clase = clase.getString("nombre_corto");
                    boolean habilitado = clase.getBoolean("habilitado");
                    String createdC=  clase.getString("createdAt");
                    String updatedC =  clase.getString("updatedAt");
                    db.InsertarClases(id_clase, id_tipo, nombre_clase, nombre_corto_clase, habilitado, createdC, updatedC);
                }


            } catch (JSONException ex) {
                Logger.getLogger(VentasUI.class.getName()).log(Level.SEVERE, null, ex);
                System.out.println(ex.getMessage());  
            }
        }
    }
    
    public void InsertarActividadComercial(String tipo) {
        int id;
        String nombre;
        String nombre_corto;
        java.sql.Date createdAt ;
        java.sql.Date updatedAt ;
        String created;
        String updated;
        int id_empresa ;
     
        if (getConnectionStatus() == true) {
            
            String url = "/tipos/"+tipo;
            JSONObject res = RestServer.getJSONObject(url);
            SimpleDateFormat formatter=new SimpleDateFormat("yyyy-MM-dd");  
            try {
                id = res.getInt("id");
                nombre = res.getString("nombre");
                nombre_corto = res.getString("nombre_corto");
                id_empresa = res.get("id_empresa").toString().equals("null")? 0:Integer.parseInt(res.get("id_empresa").toString()); ;
                created = (String) res.getString("createdAt");
                updated = (String) res.get("updatedAt");
                String createdTransformado = created.substring(0, 10);

                if (id_empresa == 0) {
                    db.InsertarTiposEmpresaNull(id, nombre, nombre_corto, created, updated);
                }else{
                    db.InsertarTipos(id, nombre, nombre_corto, created, updated, id_empresa);          
                }

                JSONArray clases  = res.getJSONArray("clases");
                for (int i = 0; i < clases.length(); i++) {
                    JSONObject clase = clases.getJSONObject(i);
                    int id_clase = clase.getInt("id");
                    int id_tipo = clase.getInt("id_tipo");
                    String nombre_clase = clase.getString("nombre");
                    String nombre_corto_clase = clase.getString("nombre_corto");
                    boolean habilitado = clase.getBoolean("habilitado");
                    String createdC=  clase.getString("createdAt");
                    String updatedC =  clase.getString("updatedAt");
                    db.InsertarClases(id_clase, id_tipo, nombre_clase, nombre_corto_clase, habilitado, createdC, updatedC);
                }


            } catch (JSONException ex) {
                Logger.getLogger(VentasUI.class.getName()).log(Level.SEVERE, null, ex);
                System.out.println(ex.getMessage());  
            }
        }
    }
    
    public void InsertarTipoProducto(String tipo) {
        int id;
        String nombre;
        String nombre_corto;
        java.sql.Date createdAt ;
        java.sql.Date updatedAt ;
        String created;
        String updated;
        int id_empresa ;
        Connection conn = null;   
     
        if (getConnectionStatus() == true) {
            
            String url = "/tipos/"+tipo;
            JSONObject res = RestServer.getJSONObject(url);
            SimpleDateFormat formatter=new SimpleDateFormat("yyyy-MM-dd");  
            try {
                id = res.getInt("id");
                nombre = res.getString("nombre");
                nombre_corto = res.getString("nombre_corto");
                id_empresa = res.get("id_empresa").toString().equals("null")? 0:Integer.parseInt(res.get("id_empresa").toString()); ;
                created = (String) res.getString("createdAt");
                updated = (String) res.get("updatedAt");
                String createdTransformado = created.substring(0, 10);

                if (id_empresa == 0) {
                    db.InsertarTiposEmpresaNull(id, nombre, nombre_corto, created, updated);
                }else{
                    db.InsertarTipos(id, nombre, nombre_corto, created, updated, id_empresa);          
                }

                JSONArray clases  = res.getJSONArray("clases");
                for (int i = 0; i < clases.length(); i++) {
                    JSONObject clase = clases.getJSONObject(i);
                    int id_clase = clase.getInt("id");
                    int id_tipo = clase.getInt("id_tipo");
                    String nombre_clase = clase.getString("nombre");
                    String nombre_corto_clase = clase.getString("nombre_corto");
                    boolean habilitado = clase.getBoolean("habilitado");
                    String createdC=  clase.getString("createdAt");
                    String updatedC =  clase.getString("updatedAt");
                    
                    db.eliminar("DELETE FROM CLASE WHERE ID = "+id_clase);
                    db.InsertarClases(id_clase, id_tipo, nombre_clase, nombre_corto_clase, habilitado, createdC, updatedC);
                                
                }


            } catch (JSONException ex) {
                Logger.getLogger(VentasUI.class.getName()).log(Level.SEVERE, null, ex);
                System.out.println(ex.getMessage());  
            }
        }
    }
    
    public void insertarSucursalAlmacen(){
        
        String url = "/sucursales/empresa/"+this.id_empresa;
        JSONArray sucursales = RestServer.getJSONArray(url);
       
        try {
            for (int i = 0; i < sucursales.length(); i++) {
                JSONObject sucursal = sucursales.getJSONObject(i);

                int id = sucursal.getInt("id");
                int id_empresa = sucursal.getInt("id_empresa");
                String nombre = sucursal.getString("nombre");
                int numero = (sucursal.get("numero").toString().equals("null"))? 0:Integer.parseInt(sucursal.get("numero").toString());
                String direccion = (sucursal.get("direccion").toString().equals("null"))? "":(String)sucursal.get("direccion").toString();
                String telefono1 = (String)sucursal.get("telefono1").toString();//.equals("null")? 0:Integer.parseInt(sucursal.get("telefono1").toString());
                String telefono2 = sucursal.get("telefono2").toString();//.equals("null")? 0:Integer.parseInt(sucursal.get("telefono2").toString());
                String telefono3 = sucursal.get("telefono3").toString();//.equals("null")? 0:Integer.parseInt(sucursal.get("telefono3").toString());
                int id_departamento = (sucursal.get("id_departamento").toString().equals("null"))? 0:Integer.parseInt(sucursal.get("id_departamento").toString());
                int id_municipio = sucursal.get("id_municipio").toString().equals("null")? 0:Integer.parseInt(sucursal.get("id_municipio").toString());
                String created = sucursal.get("createdAt").toString().equals("null")? "": (String)sucursal.get("createdAt").toString();
                String updated = sucursal.get("updatedAt").toString().equals("null")? "":(String)sucursal.get("updatedAt").toString();
                int nota_venta_correlativo = sucursal.getInt("nota_venta_correlativo");//.toString().equals("null")? 0:Integer.parseInt(sucursal.get("nota_venta_correlativo").toString());
                int nota_traspaso_correlativo = sucursal.getInt("nota_traspaso_correlativo");//.toString().equals("null")? 0:Integer.parseInt(sucursal.get("nota_traspaso_correlativo").toString());
                int nota_baja_correlativo = sucursal.getInt("nota_baja_correlativo");//.toString().equals("null")? 0:Integer.parseInt(sucursal.get("nota_baja_correlativo").toString());
                int pedido_correlativo = sucursal.getInt("pedido_correlativo");//.toString().equals("null")? 0:Integer.parseInt(sucursal.get("pedido_correlativo").toString());
                int copias_impresion_pedido = sucursal.getInt("copias_impresion_pedido");//.toString().equals("null")? 0:Integer.parseInt(sucursal.get("copias_impresion_pedido").toString());
                String frase_pedido = sucursal.get("frase_pedido").toString().equals("null")? "":(String)sucursal.get("frase_pedido").toString();
                int nota_recibo_correlativo = sucursal.getInt("nota_recibo_correlativo");//.toString().equals("null")? 0:Integer.parseInt(sucursal.get("nota_recibo_correlativo").toString());
                int cotizacion_correlativo = (sucursal.get("cotizacion_correlativo").toString().equals("null"))? 0:Integer.parseInt(sucursal.get("cotizacion_correlativo").toString());
                int pre_factura_correlativo = (sucursal.get("pre_factura_correlativo").toString().equals("null"))? 0:Integer.parseInt(sucursal.get("pre_factura_correlativo").toString());
                int comprobante_ingreso_correlativo = (sucursal.get("comprobante_ingreso_correlativo").toString().equals("null"))? 0:Integer.parseInt(sucursal.get("comprobante_ingreso_correlativo").toString());
                int comprobante_egreso_correlativo = (sucursal.get("comprobante_egreso_correlativo").toString().equals("null"))? 0:Integer.parseInt(sucursal.get("comprobante_egreso_correlativo").toString());
                int comprobante_traspaso_correlativo = (sucursal.get("comprobante_traspaso_correlativo").toString().equals("null"))? 0:Integer.parseInt(sucursal.get("comprobante_traspaso_correlativo").toString());
                int comprobante_caja_chica_correlativo = (sucursal.get("comprobante_caja_chica_correlativo").toString().equals("null"))? 0:Integer.parseInt(sucursal.get("comprobante_caja_chica_correlativo").toString());
                String fecha_reinicio_correlativo = (sucursal.get("fecha_reinicio_correlativo").toString().equals("null"))? "":(String)sucursal.get("fecha_reinicio_correlativo").toString();
                int nota_venta_farmacia_correlativo = (sucursal.get("nota_venta_farmacia_correlativo").toString().equals("null"))? 0:Integer.parseInt(sucursal.get("nota_venta_farmacia_correlativo").toString());
                int despacho_correlativo = (sucursal.get("despacho_correlativo").toString().equals("null"))? 0:Integer.parseInt(sucursal.get("despacho_correlativo").toString());
                int despacho_recivo_correlativo = (sucursal.get("despacho_recivo_correlativo").toString().equals("null"))? 0:Integer.parseInt(sucursal.get("despacho_recivo_correlativo").toString());
                int ropa_trabajo_correlativo = (sucursal.get("ropa_trabajo_correlativo").toString().equals("null"))? 0:Integer.parseInt(sucursal.get("ropa_trabajo_correlativo").toString());
                boolean reini_compro_ingreso_correla = sucursal.getBoolean("reiniciar_comprobante_ingreso_correlativo");
                boolean reini_compro_egreso_correla = sucursal.getBoolean("reiniciar_comprobante_egreso_correlativo");
                boolean reini_compro_traspaso_correla = sucursal.getBoolean("reiniciar_comprobante_traspaso_correlativo");
                boolean reini_compro_caja_chica_correla = sucursal.getBoolean("reiniciar_comprobante_caja_chica_correlativo");
                boolean imprimir_pedido_corto = sucursal.getBoolean("imprimir_pedido_corto");

                db.insertarSucursalSuc(id, id_empresa, nombre, numero, direccion, telefono1, telefono2, telefono3, id_departamento, id_municipio, created, updated, nota_venta_correlativo, nota_traspaso_correlativo, nota_baja_correlativo, pedido_correlativo, copias_impresion_pedido, frase_pedido, nota_recibo_correlativo, cotizacion_correlativo, pre_factura_correlativo, comprobante_ingreso_correlativo, comprobante_egreso_correlativo, comprobante_traspaso_correlativo, comprobante_caja_chica_correlativo, fecha_reinicio_correlativo, nota_venta_farmacia_correlativo, despacho_correlativo, ropa_trabajo_correlativo, reini_compro_ingreso_correla, reini_compro_traspaso_correla, reini_compro_egreso_correla, reini_compro_caja_chica_correla, imprimir_pedido_corto, false, despacho_recivo_correlativo);

                JSONArray almacenes = sucursal.getJSONArray("almacenes");
                for (int j = 0; j < almacenes.length(); j++) {
                    JSONObject almacen = almacenes.getJSONObject(j);
                    int id_almacen = almacen.getInt("id");
                    int id_sucursalc = almacen.getInt("id_sucursal");
                    String nombre_almacen = almacen.getString("nombre");
                    int numero_almacen = (almacen.get("numero").toString().equals("null"))? 0:Integer.parseInt(almacen.get("numero").toString());
                    String direccion_almacen = (almacen.get("direccion").toString().equals("null"))? "":(String)almacen.get("direccion").toString();
                    String telefono = (String) almacen.get("telefono").toString();       
                    String created_almacen = (String)almacen.get("createdAt").toString();
                    String updated_almacen = (String)almacen.get("updatedAt").toString();

                    db.insertarAlmacenSuc(id_almacen, id_sucursalc, nombre_almacen, numero_almacen, direccion_almacen, telefono, created_almacen, updated_almacen);
                }
            }

        } catch (JSONException ex) {
            System.out.println(ex);
            Logger.getLogger(VentasUI.class.getName()).log(Level.SEVERE, null, ex);
        }     
    }
    
    public void comboMovimientos(){
        ResultSet rs = null;
        String nombre_movimiento;
        String consulta = "SELECT NOMBRE FROM CLASE WHERE ID_TIPO = "+7+" AND HABILITADO = "+true;
        rs = db.seleccionar(consulta);
        try {
            while (rs.next()) {            
                nombre_movimiento = rs.getString(1);
                comboMovimiento.addItem(nombre_movimiento);
            }
        } catch (Exception e) {
            System.out.println("Error comboMovimientos: "+e);
        }
        
    }
    
    public void comboTipoPago(){
        boolean habilitado = true;
        String nombre_tipo_pago;
        ResultSet rs = null;
        String consulta = "SELECT C.NOMBRE \n" +
            "FROM TIPO AS T\n" +
            "INNER JOIN CLASE AS C ON T.ID = C.ID_TIPO \n" +
            "WHERE T.ID = "+4+" AND C.HABILITADO = "+habilitado;
        rs = db.seleccionar(consulta);
        try {
            while (rs.next()) {            
                nombre_tipo_pago = rs.getString(1);
                comboTipoPago.addItem(nombre_tipo_pago);
            }
        } catch (Exception e) {
            System.out.println("Error: "+e);
        }
    }
    
    public int obtenerIdEmpresa(){
        ResultSet rs ;
        int empresa = 0;
       
        String sucursal = "SELECT EMPRESA FROM USUARIO WHERE ID = "+this.id_usuario;
         rs = db.seleccionar(sucursal);
        try {
            while (rs.next()) {            
                empresa = rs.getInt(1);                       
            }
     
        } catch (Exception e) {
            System.out.println("Error: "+e);
        }
        return empresa;
    }
    
    public void comboSucursal(){
        ResultSet rs ;
        String nom_sucursal;
        int idEmpresa = this.id_empresa; //obtenerIdEmpresa();
        String sucursal = "SELECT NOMBRE FROM SUCURSAL WHERE EMPRESA = "+idEmpresa;
         rs = db.seleccionar(sucursal);
        try {
            while (rs.next()) {            
                nom_sucursal = rs.getString(1);
                comboSucursal.addItem(nom_sucursal);            
            }
     
        } catch (Exception e) {
            System.out.println("Error: "+e);
        }
    }
    
    private class MyDispatcher implements KeyEventDispatcher {
        @Override
        public boolean dispatchKeyEvent(KeyEvent e) {
            if (e.getID() == KeyEvent.KEY_PRESSED) {
                if (e.getKeyCode() == KeyEvent.VK_F4) {
                    JOptionPane.showMessageDialog(null, "SE APRETO F4");
                }
            } 
            return false;
        }
    }

    private void ingresarGrupos(){
        ResultSet rs = null;
        String consulta = "";
        String nom_almacen = comboAlmacen.getSelectedItem().toString();
        int id_almacen = 0;
        
        int id_grupo = 0;
        String nomb_grupo = "";
        
        consulta = "SELECT ID FROM ALMACEN WHERE NOMBRE = "+nom_almacen;
        rs = db.seleccionar(consulta);
        try {
            while (rs.next()) {                
                id_almacen = rs.getInt(1);
            }
            
            consulta = "SELECT G.ID,G.NOMBRE \n" +
                "FROM PRODUCTO AS P\n" +
                "INNER JOIN GRUPOS AS G ON P.ID_GRUPO = G.ID\n" +
                "WHERE P.ID_ALM = "+id_almacen;
            rs = db.seleccionar(consulta);
            while (rs.next()) { 
                id_grupo = rs.getInt(1);
                nomb_grupo = rs.getString(2);
            }
        } catch (Exception e) {
            System.out.println("Error: "+e);
        }     
    }
    
    public void tamañoTablaProductos() {
        tablaProductos.getColumnModel().getColumn(0).setMaxWidth(0);
        tablaProductos.getColumnModel().getColumn(0).setMinWidth(0);
        tablaProductos.getColumnModel().getColumn(0).setPreferredWidth(0);

        tablaProductos.getColumnModel().getColumn(1).setMaxWidth(30);
        tablaProductos.getColumnModel().getColumn(1).setMinWidth(30);
        tablaProductos.getColumnModel().getColumn(1).setPreferredWidth(30);

        tablaProductos.getColumnModel().getColumn(2).setMaxWidth(40);
        tablaProductos.getColumnModel().getColumn(2).setMinWidth(40);
        tablaProductos.getColumnModel().getColumn(2).setPreferredWidth(40);

        tablaProductos.getColumnModel().getColumn(5).setMaxWidth(60);
        tablaProductos.getColumnModel().getColumn(5).setMinWidth(60);
        tablaProductos.getColumnModel().getColumn(5).setPreferredWidth(60);
        
        tablaProductos.getColumnModel().getColumn(6).setMaxWidth(60);
        tablaProductos.getColumnModel().getColumn(6).setMinWidth(60);
        tablaProductos.getColumnModel().getColumn(6).setPreferredWidth(60);
        
        tablaProductos.getColumnModel().getColumn(7).setMaxWidth(60);
        tablaProductos.getColumnModel().getColumn(7).setMinWidth(60);
        tablaProductos.getColumnModel().getColumn(7).setPreferredWidth(60);
    }
    
    public int obtenerIdSucursal(String sucursal){
        ResultSet rs = null;
        int id = 0;
        
        String consulta = "SELECT ID \n" +
            "FROM SUCURSAL \n" +
            "WHERE NOMBRE = '"+sucursal+"' AND EMPRESA = "+this.id_empresa;
        rs = db.seleccionar(consulta);
        try {
            while(rs.next()){
                id = rs.getInt(1);
            }
        } catch (Exception e) {
            System.out.println("Error al obtener id de sucursal: "+e);
        }
        return id;
    }
    
    public int calcularCantidad(int id,int id_alm){
        ResultSet rs = null;
        int cantidad = 0;
        String consulta = "SELECT CANTIDAD FROM INV_INVENTARIO WHERE PRODUCTO = "+id+" AND ALMACEN = "+id_alm;
        try {
            rs = db.seleccionar(consulta);
            while(rs.next()){
                cantidad = cantidad + rs.getInt(1);
            }
        } catch (Exception e) {
            System.out.println("Error al obtener la cantidad: "+e);
        }
        return cantidad;
    }
       
    public int obtenerIdAlmacen(String almacen){
        ResultSet rs = null;
        String consulta = "SELECT ID FROM ALMACEN WHERE NOMBRE = '"+almacen+"'";
        int id = 0;
        try {
            rs = db.seleccionar(consulta);
            while (rs.next()) {                
                id = rs.getInt(1);
            }
        } catch (Exception e) {
            System.out.println("Error al obtener el almacen: "+e);
        }
        return id;
    }
        
    public int obtenerIdSucursal(String sucursal,int idEmpresa){
        ResultSet rs = null;
        int id = 0;
        String consulta = "SELECT ID FROM SUCURSAL WHERE NOMBRE = '"+sucursal+"' AND EMPRESA = "+idEmpresa;
        try {
            rs = db.seleccionar(consulta);
            while(rs.next()){
                id = rs.getInt(1);
            }
        } catch (Exception e) {
        }
        return id;
    }
    
    public void obtenerSucursalActividad(int idSucursal){
        comboActividad.removeAllItems();
        comboActividad.addItem("Seleccionar...");
        ResultSet rs = null;
        String actividad = "";
        String consulta = "SELECT DISTINCT(C.NOMBRE) \n" +
            "FROM SUCURSAL_ACTIVIDAD_DOSIFICACION AS SAD \n" +
            "INNER JOIN CLASE AS C ON SAD.ACTIVIDAD = C.ID \n" +
            "WHERE SAD.SUCURSAL = "+idSucursal;
        try {
            rs = db.seleccionar(consulta);
            while(rs.next()){
                actividad = rs.getString(1);
                comboActividad.addItem(actividad);
            }
        } catch (Exception e) {
            System.out.println("Error al recoger la dosificacion: "+e);
        }
    }
    
    public boolean estaActivoInventario(int id,int id_alm){
        ResultSet rs = null;
        boolean activo = false;
        String consulta = "SELECT ACTIVAR_INVENTARIO FROM PRODUCTO WHERE IDP = "+id+" AND ALMACEN = "+id_alm;
        try {
            rs = db.seleccionar(consulta);
            while(rs.next()){
                activo = true;
            }
        } catch (Exception e) {
            System.out.println("Error al ver si es un inventario activo: "+e);
        }
        return activo;
    }
    
    private void SeleccionarProductosPanelSinInternet(int id_almacen,boolean estado) {
        int id_producto = 0;
        String nombreProducto = "";
        String unidad_medida = "";
        String precio_unitario = "";
        double prec_unit = 0;
        String nombre_sucursal = "";
        int id_pb = 0;
        String imagen = "";
        int idEmp = this.id_empresa;
        int tamaño = 0;

//        for (int i = 0; i < db.seleccionarIdEmpresa(this.id_usuario).size(); i++) {
//            idEmp = db.seleccionarIdEmpresa(this.id_usuario).get(i).getId_empresa();
//        }

        int idP = 0;
        String nombre = "";
        String codigo = "";
        String uni_med = "";
        double pre_unit = 0.0;
        String descripcion = "";
        String codigo_fabrica = "";
        double descuento = 0;
        int i = 0;

        ResultSet rstam = db.seleccionar("SELECT * FROM PRODUCTO WHERE ALMACEN = " + id_almacen);
        try {
            while (rstam.next()) {
                tamaño++;
            }
        } catch (SQLException ex) {
            Logger.getLogger(VentasUI.class.getName()).log(Level.SEVERE, null, ex);
        }

        try {
            menu = new JButtonProducto[tamaño];
            ResultSet rs = db.seleccionar("SELECT IDP,NOMBRE,CODIGO,UNIDAD_MEDIDA,PRECIO_UNITARIO,DESCRIPCION,CODIGO_FABRICA,DESCUENTO "
                    + "FROM PRODUCTO WHERE ALMACEN = "+id_almacen);
            while (rs.next()) {

                idP = rs.getInt(1);
                nombre = rs.getString(2);
                codigo = rs.getString(3);
                uni_med = rs.getString(4);
                pre_unit = Double.parseDouble(rs.getString(5));
                descripcion = rs.getString(6);
                codigo_fabrica = rs.getString(7);
                descuento = rs.getDouble(8);
                
                int id_pro = 0;
                String nom_pb = "";
                double formulacion = 0;
                String codigoPB = "";
                String uni_med_pb = "";
                String codigo_fabrica_pb = "";
                double prec_unit_pb = 0;
                String cantUni_ideal_pb = "";
                int id_Pb = 0;
                int cantidad = 0;

                ArrayList<JButtonProducto> productos = new ArrayList();
                ResultSet rs2 = db.seleccionar("SELECT PBS.IDPB,PBS.NOMBRE,PB.FORMULACION,PBS.CODIGO,PBS.UNIDAD_MEDIDA,\n" +
                "PBS.PRECIO_UNITARIO,PBS.CODIGO_FABRICA,PBS.UNIDAD_MEDIDA,\n" +
                "PBS.PRECIO_UNITARIO,PBS.CODIGO_FABRICA\n" +
                "FROM PRODUCTO_BASE AS PB\n" +
                "INNER JOIN PRODUCTOS_BASES AS PBS ON PB.PRODUCTO_BASE = PBS.IDPB\n" +
                "WHERE PB.PRODUCTO = "+idP);
                while (rs2.next()) {
                    id_pro = rs2.getInt(1);
                    nom_pb = rs2.getString(2);
                    formulacion = Double.parseDouble(rs2.getString(3));
                    codigoPB = rs2.getString(4);
                    uni_med_pb = rs2.getString(5);
                    //cantUni_ideal_pb = rs2.getString(4);
                    prec_unit_pb = rs2.getDouble(6);
                    codigo_fabrica_pb = rs2.getString(7);

                    JButtonProducto productoBase = new JButtonProducto(id_pro,nom_pb,formulacion,codigoPB,uni_med_pb,prec_unit_pb,codigo_fabrica_pb);
                    productos.add(productoBase);
                }        
                String imagenIcon = "/imagen/icon-producto-default.png";

                img = new ImageIcon(this.getClass().getResource(imagenIcon));
                icon = new ImageIcon(img.getImage().getScaledInstance(80, 90, 1));
                int invCantidad = calcularCantidad(idP, id_almacen);
                                                           
                menu[i] = new JButtonProducto(idP, nombre,codigo, uni_med, pre_unit, descripcion,codigo_fabrica,invCantidad,productos,descuento,i, icon);
                menu[i].setToolTipText("<html>Producto:"+nombre+"<br>Cantidad: "+invCantidad+"</html>");
                
//                if (estaActivoInventario(idP, id_almacen) == true) {
//                    menu[i].setToolTipText("<html>Producto:"+nombre+"<br>Cantidad: "+invCantidad+"</html>");
//
//                }else if (estaActivoInventario(idP, id_almacen) == false){
//                    menu[i].setToolTipText("<html>Producto:"+nombre+"<br>Cantidad: Ilimitada</html>");      
//                }        
                

                menu[i].setVerticalTextPosition(SwingConstants.BOTTOM);
                menu[i].setHorizontalTextPosition(SwingConstants.CENTER);
                menu[i].setPreferredSize(new Dimension(100, 150));

                menu[i].addActionListener(this);
                jPanelMostrar.add(menu[i]);
                jPanelMostrar.updateUI();
                i++;            
            }
        } catch (Exception e) {
            System.out.println("error: " + e.getMessage());
        }
    }
    
    private void ingresarProducto(int id,String nombre,double precio,int cantidadProducto){
        int cont = 0;
        double descuento = (100-boton.getDescuento())/100;
        int cantidad = 1;   
        double imp = (cantidad * precio) * descuento;
        int pos = boton.getPost();
        if (tablaProductos.getRowCount() == 0) {
            cont = 1;
        }else{
            for (int i = 0; i < tablaProductos.getRowCount(); i++) {
                cont = Integer.parseInt(String.valueOf(tablaProductos.getValueAt(i, 1)));
                cont = cont + 1;
            }
        }
        Object[] datos = {id,cont,cantidad,nombre,precio,imp,quitar,eliminar};
        
        modalProductos.addRow(datos);
        tablaProductos.setModel(modalProductos);
        
        int nuevaCantidad = cantidadProducto - 1;
        menu[pos].setCantidad(nuevaCantidad);
        menu[pos].setToolTipText("<html>Producto:"+nombre+"<br>Cantidad: "+nuevaCantidad+"</html>");
        
        calcularTotal();
    }
    
    private boolean existeProducto(int id){
        boolean existe = false;
        int tam = tablaProductos.getRowCount();
        for (int i = 0; i < tam; i++) {
            int idTabla = Integer.valueOf(String.valueOf(tablaProductos.getValueAt(i, 0)));
            if(id == idTabla){
                existe = true;
                break;
            }else{
                existe = false;
            }
        }
        return existe;
    }
    
    private void incrementarCantidad(int id, int cantidadProducto){
        int tam = tablaProductos.getRowCount();
        int cont = 0;
        double descuento = (100 - boton.getDescuento())/100;
        for (int i = 0; i < tam; i++) {
            int idTabla = Integer.valueOf(String.valueOf(tablaProductos.getValueAt(i, 0)));
            if (id == idTabla) {
                int cantidad = Integer.valueOf(String.valueOf(tablaProductos.getValueAt(i, 2)));
                String nombreP = String.valueOf(tablaProductos.getValueAt(i, 3));
                int pos = boton.getPost();
                cantidad = cantidad + 1;
                tablaProductos.setValueAt(cantidad, i, 2);
                double precio = Double.valueOf(String.valueOf(tablaProductos.getValueAt(i, 4)));
                double importe = (cantidad * precio) * descuento;
                tablaProductos.setValueAt(importe, i, 5); 
                
                int nuevaCantidad = cantidadProducto - 1;
                menu[pos].setCantidad(nuevaCantidad);
                menu[pos].setToolTipText("<html>Producto:"+nombreP+"<br>Cantidad: "+nuevaCantidad+"</html>");
                          
            }
        }
        textoPagado.setText("");
        textoCambio.setText("");
        calcularTotal();
    }
    
    public void calcularTotal(){
        double total = 0;
        double sumTotal = 0;
        for (int i = 0; i < tablaProductos.getRowCount(); i++) {
            total = Double.parseDouble(String.valueOf(tablaProductos.getValueAt(i, 5)));
            sumTotal = sumTotal + total;
            
        }
        textTotal.setText(Double.toString(sumTotal));     
        textoPagado.setText(Double.toString(sumTotal));
        
        textoCambio.setText("0");
        if (comboTipoPago.getSelectedItem().equals("CREDITO")) {
            textSujetoCF.setText(Double.toString(sumTotal));
        }
    }
    
    public String[] datosMovimiento(String movimiento){
        ResultSet rs = null;
        String consulta = "SELECT ID,NOMBRE_CORTO FROM CLASE WHERE NOMBRE = '"+movimiento+"'";
        String id = "";
        String nombre_corto = "";
        String[] res = new String[2];
        try{
            rs = db.seleccionar(consulta);
            while (rs.next()) {           
                id = Integer.toString(rs.getInt(1));
                nombre_corto = rs.getString(2);
                res[0] = id;
                res[1] = nombre_corto;
            }
        }catch(Exception e){
            System.out.println("Error en recoger movimientos: "+e);
        } 
        return res;
    }
    
    public String[] datosActividad(String actividad){
        ResultSet rs = null;
        String consulta = "SELECT ID,ID_TIPO,NOMBRE,NOMBRE_CORTO,HABILITADO "
                + "FROM CLASE "
                + "WHERE NOMBRE = '"+actividad+"'";
        String id = "";
        String idTipo = "";
        String nombre = "";
        String nombre_corto = "";
        String habilitado = "";
        
        String[] res = new String[5];
        try{
            rs = db.seleccionar(consulta);
            while (rs.next()) {           
                id = Integer.toString(rs.getInt(1));
                idTipo = Integer.toString(rs.getInt(2));
                nombre = rs.getString(3);
                nombre_corto = rs.getString(4);
                habilitado = Boolean.toString(rs.getBoolean(5));
                res[0] = id;
                res[1] = idTipo;
                res[2] = nombre;
                res[3] = nombre_corto;
                res[4] = habilitado;
            }
        }catch(Exception e){
            System.out.println("Error en recoger actividad: "+e);
        } 
        return res;
    }
    
    public String[] datosAlmacen(int idEmpresa, String sucursal,String almacen){
        ResultSet rs = null;
        String consulta = "SELECT A.SUCURSAL,A.ID,A.NOMBRE,A.DIRECCION,A.NUMERO\n" +
        "FROM SUCURSAL AS S\n" +
        "INNER JOIN ALMACEN AS A ON S.ID = A.SUCURSAL\n" +
        "WHERE S.EMPRESA = "+idEmpresa+" AND S.NOMBRE = '"+sucursal+"' AND A.NOMBRE = '"+almacen+"'";
        String Idsucursal = "";
        String idAlmacen = "";
        String nombre = "";
        String direccion = "";
        String numero = "";
        String[] res = new String[5];
        try{
            rs = db.seleccionar(consulta);
            while (rs.next()) {           
                Idsucursal = Integer.toString(rs.getInt(1));
                idAlmacen = Integer.toString(rs.getInt(2));
                nombre = rs.getString(3);
                direccion = rs.getString(4);
                numero = Integer.toString(rs.getInt(5));
                res[0] = Idsucursal;
                res[1] = idAlmacen;
                res[2] = nombre;
                res[3] = direccion;
                res[4] = numero;
            }
        }catch(Exception e){
            System.out.println("Error en recoger almacen: "+e);
        } 
        return res;
    }
    
    public ArrayList<Inventario> datosInventario(int Idproducto,int IdAlmacen){
        ArrayList<Inventario> lista = new ArrayList<>();
        ResultSet rs = null;
        String consulta = "SELECT CANTIDAD,COSTO_TOTAL,COSTO_UNITARIO,CREATEDAT,FECHA_VENCIMIENTO,"
                + "ID,ALMACEN,PRODUCTO,LOTE,UPDATEDAT\n" +
             "FROM INV_INVENTARIO "
            + "WHERE PRODUCTO = "+Idproducto+" AND ALMACEN = "+IdAlmacen;
        int id = 0;
        int almacen = 0;
        int producto = 0;
        double cantidad = 0;
        double costo_unitario = 0;
        double costo_total = 0;
        String created = "";
        String updated = "";
        String fecha_vencimiento = "";
        String lote = "";
        
        try{
            rs = db.seleccionar(consulta);
            while (rs.next()) {           
                id = rs.getInt(6);
                almacen = rs.getInt(7);
                producto = rs.getInt(8);
                cantidad = rs.getDouble(1);
                costo_unitario = rs.getDouble(3);
                costo_total = rs.getDouble(2);
                created = rs.getString(4);
                updated = rs.getString(10);
                fecha_vencimiento = rs.getString(5);
                lote = rs.getString(9);
                Inventario inventario = new Inventario(id, almacen, producto, cantidad, costo_unitario, costo_total, created, updated, fecha_vencimiento, lote);
                lista.add(inventario);
            }
        }catch(Exception e){
            System.out.println("Error en recoger almacen: "+e);
        } 
        return lista;
    }
     
    public ArrayList<ProductosBase>obtenerProductosBase(int idP){
        ResultSet rs = null;
        ArrayList<ProductosBase>lista = new ArrayList<>();
        String consulta = "SELECT PB.ID,PB.PRODUCTO,PB.PRODUCTO_BASE,PB.FORMULACION,PB.CREATEDAT,PB.UPDATEDAT,PB.ELIMINADO \n" +
            "FROM PRODUCTO_BASE AS PB\n" +
            "WHERE PRODUCTO = "+idP;
        try {
            rs = db.seleccionar(consulta);
            while (rs.next()) {                
                int id = rs.getInt(1);
                int idPro = rs.getInt(2);
                int idProB = rs.getInt(3);
                String formulacion = rs.getString(4);
                String created = rs.getString(5);
                String updated = rs.getString(6);
                boolean eliminado = rs.getBoolean(7);
                
                ProductosBase productos = new ProductosBase(id, idPro, idProB, formulacion, created, updated);
                lista.add(productos);
            }
        } catch (Exception e) {
            System.out.println("Error al obtener producto base: "+e);
        }
        return lista;
    }
    
    public ArrayList<ProductosBase>obtenerProductosBases(int idPB){
        ResultSet rs = null;
        ArrayList<ProductosBase>lista = new ArrayList<>();
        String consulta = "SELECT IDPB,NOMBRE,ACTIVAR_INVENTARIO,TIPO_PRODUCTO\n" +
            "FROM PRODUCTOS_BASES\n" +
            "WHERE IDPB = "+idPB;
        try {
            rs = db.seleccionar(consulta);
            while (rs.next()) {                
                int id = rs.getInt(1);
                String nombre = rs.getString(2);
                boolean activar_inventario = rs.getBoolean(3);
                int tipo_producto = rs.getInt(4);
                
                ProductosBase productos = new ProductosBase(id,nombre, activar_inventario,tipo_producto);
                lista.add(productos);
            }
        } catch (Exception e) {
            System.out.println("Error al obtener producto base: "+e);
        }
        return lista;
    }
    
    public String[] datosProducto(int id, int almacen){
        ResultSet rs = null;
        String[] res = new String[20];
        String consulta = "SELECT ACTIVAR_INVENTARIO,ALERTA,ANIO,CARACTERISTICA_ESPECIAL1,CARACTERISTICA_ESPECIAL2,\n" +
            "CODIGO,CODIGO_FABRICA,COMISION,CREATEDAT,DESCRIPCION,DESCUENTO,DESCUENTO_FIJO,\n" +
            "IDP,ALMACEN_ERP,CUENTA,EMPRESA,GRUPO,SUBGRUPO,TIPO_PRODUCTO,INVENTARIO_MINIMO,\n" +
            "MARCA,MODELO,NOMBRE,PRECIO_UNITARIO,PUBLICAR_PANEL,RANGO_MIN,RANGO_MAX,\n" +
            "UNIDAD_MEDIDA,UPDATEDAT\n" +
            "FROM PRODUCTO \n" +
            "WHERE IDP = "+id+" AND ALMACEN = "+almacen;
       
        try {
             rs = db.seleccionar(consulta);
            while (rs.next()) {                
               String activarInventario = Boolean.toString(rs.getBoolean(1));
               String alerta = Integer.toString(rs.getInt(2));
               String anio = rs.getString(3);
               String caract1 = rs.getString(4);
               String caract2 = rs.getString(5);
               String codigo = rs.getString(6);
               String codFabrica = rs.getString(7);
               String comision = Double.toString(rs.getDouble(8));
               String created = rs.getString(9);
               String descripcion = rs.getString(10);
               String descuento = Double.toString(rs.getDouble(11));
               String descFijo = Boolean.toString(rs.getBoolean(12));
               String idp = Integer.toString(rs.getInt(13));
               String idAlmacenERP = Integer.toString(rs.getInt(14));
               String cuenta = Integer.toString(rs.getInt(15));
               String empresa = Integer.toString(rs.getInt(16));
               String grupo = Integer.toString(rs.getInt(17));
               String subGrupo = Integer.toString(rs.getInt(18));
               String tipoProd = Integer.toString(rs.getInt(19));
               String invMinimo = Integer.toString(rs.getInt(20));
               /*String marca = rs.getString(21);
               String modelo = rs.getString(22);
               String nombre = rs.getString(23);
               String precioUnit = Double.toString(rs.getDouble(24));
               String publicarPanel = Boolean.toString(rs.getBoolean(25));
               String rangoNega = Double.toString(rs.getDouble(26));
               String rangoMaxi = Double.toString(rs.getDouble(27));
               String unidadMedi = rs.getString(28);
               String updated = rs.getString(29);*/
               
               res[0]=activarInventario;
               res[1]=alerta;
               res[2]=anio;
               res[3]=caract1;
               res[4]=caract2;
               res[5]=codigo;
               res[6]=codFabrica;
               res[7]=comision;
               res[8]=created;
               res[9]=descripcion;
               res[10]=descuento;
               res[11]=descFijo;
               res[12]=idp;
               res[13]=idAlmacenERP;
               res[14]=cuenta;
               res[15]=empresa;
               res[16]=grupo;
               res[17]=subGrupo;
               res[18]=tipoProd;
               res[19]=invMinimo;
            }
        } catch (Exception e) {
        }
        return res;
    }
    
    public String[] datosTipoProducto(int idTipoProducto){
        ResultSet rs = null;
        String[] result = new String[7];
        String consulta = "SELECT ID,ID_TIPO,NOMBRE,NOMBRE_CORTO,HABILITADO,CREATEDAT,UPDATEDAT\n" +
            "FROM CLASE \n" +
            "WHERE ID = "+idTipoProducto;
        rs = db.seleccionar(consulta);
        try {
            while (rs.next()) {                
                String idC = Integer.toString(rs.getInt(1));
                String idTipo = Integer.toString(rs.getInt(2));
                String nombreC = rs.getString(3);
                String nombreCortoC = rs.getString(4);
                String habilidatoC = Boolean.toString(rs.getBoolean(5));
                String created = rs.getString(6);
                String updated = rs.getString(7);

                result[0] = idC;
                result[1] = idTipo;
                result[2] = nombreC;
                result[3] = nombreCortoC;
                result[4] = habilidatoC;
                result[5] = created;
                result[6] = updated;
            }
            
        } catch (Exception e) {
            System.out.println("Error al recoger el tiproducto: "+e);
        }
        return result;
    }
    
    public double obtenerPrecioUnitarioPro(int idP,int idAlmacen){
        ResultSet rs = null;
        double precioUnit = 0;
        String consulta = "SELECT PRECIO_UNITARIO "
                + "FROM PRODUCTO "
                + "WHERE IDP = "+idP+" AND ALMACEN = "+idAlmacen;
        rs = db.seleccionar(consulta);
        try{
            while (rs.next()) {                
                precioUnit = rs.getDouble(1);
            }
        }catch(Exception e){
            System.out.println("Error al obtener el precio unitario: "+e);
        }
        return precioUnit;
    }
    
    public String[] datosClase(String tipo){
        ResultSet rs = null;
        String consulta = "SELECT ID,ID_TIPO,NOMBRE,NOMBRE_CORTO,HABILITADO,CREATEDAT,UPDATEDAT \n" +
            "FROM CLASE \n" +
            "WHERE NOMBRE = '"+tipo+"'";
        String[] result = new String[7];
        
        try {
            rs = db.seleccionar(consulta);
            while(rs.next()){
                String id = Integer.toString(rs.getInt(1));
                String idTipo = Integer.toString(rs.getInt(2));
                String nombre = rs.getString(3);
                String nombreCorto = rs.getString(4);
                String habilitado = Boolean.toString(rs.getBoolean(5));
                String created = rs.getString(6);
                String updated = rs.getString(7);
                
                result[0] = id;
                result[1] = idTipo;
                result[2] = nombre;
                result[3] = nombreCorto;
                result[4] = habilitado;
                result[5] = created;
                result[6] = updated;
  
            }
        } catch (Exception e) {
            System.out.println("Error al obtener los datos de la clas: "+e.getMessage());
        }
        return result;
    }
    
    public void venderConInternet(){
//        Date f = combofecha.getDate();
//        Long fe = f.getTime();
//        java.sql.Date fecha = new java.sql.Date(fe);
        Date f = combofecha.getDate();
        Long fe = f.getTime();
        Timestamp fecha = new Timestamp(fe);
        SimpleDateFormat formateador = new SimpleDateFormat("dd/MM/yy");
        SimpleDateFormat urlFormato = new SimpleDateFormat("yy-MM-dd");
        
        int id_empresa = obtenerIdEmpresa();     
        
        String movimiento = (String)comboMovimiento.getSelectedItem();
        double a_cuenta = textACuenta.getText().equals("")? 0:Double.parseDouble(textACuenta.getText());
        String actividad = (String) comboActividad.getSelectedItem();
        String almacen = (String) comboAlmacen.getSelectedItem();
        String sucursal = (String) comboSucursal.getSelectedItem();
        int idSucursal = obtenerIdSucursal(sucursal);
        double cambio = textoCambio.getText().equals("")?  0:Double.parseDouble(textoCambio.getText());
        int nit = Integer.parseInt(txtNitCliente.getText());
        String razonSocial = txtRazonSocial.getText();
        double pagado = Double.parseDouble(textoPagado.getText());
        double saldo = (textSaldo.getText().equals(""))? 0:Double.parseDouble(textSaldo.getText());
        String tipoPago = (String) comboTipoPago.getSelectedItem();
        
        String[] movimientosDatos = datosMovimiento(movimiento);
        String[] actividadDatos = datosActividad(actividad);
        String[] almacenDatos = datosAlmacen(this.id_empresa, sucursal, almacen);
        
        try{
            JSONObject JSONdatos = new JSONObject();
            JSONObject nombre_corto = new JSONObject();
            JSONObject id = new JSONObject();
            
            JSONObject JSONventa = new JSONObject();
            JSONObject JSONActividad = new JSONObject();
            JSONObject JSONAlmacen = new JSONObject();
            JSONObject JSONcliente = new JSONObject();
            JSONObject JSONdetallesVentas = new JSONObject();
            
            JSONArray ARRAYcosto = ARRAYcosto = new JSONArray();
            JSONArray ARRAYdetallesVentas = new JSONArray();
            JSONArray ARRAYdetalles = new JSONArray();
           
            
            JSONArray ARRAYinventario = new JSONArray();
            JSONObject JSONdetalleVentaNoconsolidada = new JSONObject();
            JSONObject JSONtipoProducto = new JSONObject();
            
            JSONObject JSONmovimiento = new JSONObject();
            JSONObject JSONtipoPago = new JSONObject();
            JSONObject JSONsucursal = new JSONObject();
            
            
            JSONventa.put("a_cuenta", a_cuenta);
            
                JSONActividad.put("eliminado", false);
                JSONActividad.put("habilitado", actividadDatos[4]);
                JSONActividad.put("id", Integer.parseInt(actividadDatos[0]));
                JSONActividad.put("id_tipo", Integer.parseInt(actividadDatos[1]));
                JSONActividad.put("nombre", actividadDatos[2]);
                JSONActividad.put("nombre_corto", actividadDatos[3]);
            JSONventa.put("actividad", JSONActividad);
            
                JSONAlmacen.put("direccion", almacenDatos[3]);
                JSONAlmacen.put("id", Integer.parseInt(almacenDatos[1]));
                JSONAlmacen.put("id_sucursal", Integer.parseInt(almacenDatos[0]));
                JSONAlmacen.put("nombre", almacenDatos[2]);
                JSONAlmacen.put("numero", Integer.parseInt(almacenDatos[4]));
            JSONventa.put("almacen", JSONAlmacen);
            
            JSONventa.put("cambio", cambio);
            
                JSONcliente.put("nit", nit);
                JSONcliente.put("razon_social", razonSocial);            
            JSONventa.put("cliente", JSONcliente);
            
            JSONventa.put("despachado", false);
            
            for (int i = 0; i < tablaProductos.getRowCount(); i++) {
                JSONObject JSONdetalles = new JSONObject();
                JSONObject JSONproducto = new JSONObject();
                int idP = Integer.valueOf(String.valueOf(tablaProductos.getValueAt(i, 0)));
                
                int cantidadP = Integer.valueOf(String.valueOf(tablaProductos.getValueAt(i, 2)));
                double importe = Double.valueOf(String.valueOf(tablaProductos.getValueAt(i, 5)));
                int idAlmacen = obtenerIdAlmacen(almacen);
                double cantidad_disponible = calcularCantidad(idP, idAlmacen);
                double precioUnita = obtenerPrecioUnitarioPro(idP,idAlmacen);
                JSONdetalles.put("cantidad", cantidadP);
                String[] productoDatos = datosProducto(idP, idAlmacen);
                
               
                for (int j = 0; j < datosInventario(idP,idAlmacen).size(); j++) {
                     JSONObject JSONcosto = new JSONObject();
                    int idI = datosInventario(idP,idAlmacen).get(j).getId();
                    int almacenI = datosInventario(idP,idAlmacen).get(j).getAlmacen();
                    int productoI = datosInventario(idP,idAlmacen).get(j).getProducto();
                    double cantidadI = datosInventario(idP,idAlmacen).get(j).getCantidad();
                    double costoUniI = datosInventario(idP,idAlmacen).get(j).getCosto_unitario();
                    String created = datosInventario(idP,idAlmacen).get(j).getCreated();
                    double costoTotal = datosInventario(idP,idAlmacen).get(j).getCosto_total();
                    String createdI = datosInventario(idP,idAlmacen).get(j).getCreated();
                    String updatedI = datosInventario(idP,idAlmacen).get(j).getUpdated();
                    String fechaVenI = datosInventario(idP,idAlmacen).get(j).getFecha_vencimiento();
                    String lote = datosInventario(idP,idAlmacen).get(j).getLote();
                    String updated = datosInventario(idP,idAlmacen).get(j).getUpdated();
                    
                    JSONcosto.put("cantidad", cantidadI);
                    JSONcosto.put("costo_total", costoTotal);
                    JSONcosto.put("costo_unitario", costoUniI);
                    JSONcosto.put("createdAt", created);                    
                    JSONcosto.put("fecha_vencimiento", fechaVenI);
                    JSONcosto.put("id", idI);
                    JSONcosto.put("id_almacen", almacenI);
                    JSONcosto.put("id_producto", productoI);
                    JSONcosto.put("lote", lote);
                    JSONcosto.put("updatedAt", updated);                    
                    
                    ARRAYcosto.put(JSONcosto);
                    JSONdetalles.put("costos", ARRAYcosto);
                    
                }
                     
                    JSONdetalles.put("descuento",Double.parseDouble(productoDatos[10]));
                    JSONdetalles.put("excento",0);
                    JSONdetalles.put("ice",0);
                    JSONdetalles.put("importe",importe);
                    
                    //CANTIDAD DE INVENTARIO                   
                    JSONdetalles.put("inventario_disponible",cantidad_disponible);
                    JSONdetalles.put("precio_unitario", precioUnita);
                   
                    

                        JSONproducto.put("activar_inventario", Boolean.parseBoolean(productoDatos[0]));
                        JSONproducto.put("activo_fijo", 0);
                        JSONproducto.put("alerta", Integer.parseInt(productoDatos[1]));
                        JSONproducto.put("anio", productoDatos[2]);
                        JSONproducto.put("caracteristica_especial1", productoDatos[3]);
                        JSONproducto.put("caracteristica_especial2",productoDatos[4]);
                        JSONproducto.put("codigo", productoDatos[5]);
                        JSONproducto.put("codigo_fabrica", productoDatos[6]);
                        JSONproducto.put("comision", Double.parseDouble(productoDatos[7]));
                        JSONproducto.put("createdAt", productoDatos[8]);
                        JSONproducto.put("descripcion", productoDatos[9]);
                        JSONproducto.put("descuento", Double.parseDouble(productoDatos[10]));
                        JSONproducto.put("descuento_fijo", Boolean.parseBoolean(productoDatos[11]));
                        JSONproducto.put("id", Integer.parseInt(productoDatos[12]));
                        JSONproducto.put("id_almacen_erp", Integer.parseInt(productoDatos[13]));
                        JSONproducto.put("id_cuenta", Integer.parseInt(productoDatos[14]));
                        JSONproducto.put("id_empresa", Integer.parseInt(productoDatos[15]));
                        JSONproducto.put("id_grupo", Integer.parseInt(productoDatos[16]));
                        JSONproducto.put("id_subgrupo", Integer.parseInt(productoDatos[17]));
                        JSONproducto.put("id_tipo_producto", Integer.parseInt(productoDatos[18]));
                        JSONproducto.put("imagen", "");
                        JSONproducto.put("inventario_disponible", cantidad_disponible);
                        JSONproducto.put("inventario_minimo", Integer.parseInt(productoDatos[12]));
                        
                        JSONArray ARRAYproductoBase = new JSONArray();
                        
                        for (int j = 0; j < obtenerProductosBase(idP).size(); j++) {
                            JSONObject JSONproductosBase = new JSONObject();
                            //JSONObject JSONprodBase = new JSONObject();
                            
                            int idPB = obtenerProductosBase(idP).get(j).getId();
                            int id_producto = obtenerProductosBase(idP).get(j).getId_producto();
                            int id_producto_base = obtenerProductosBase(idP).get(j).getId_producto_base();
                            String formulacion = obtenerProductosBase(idP).get(j).getFormulacion();
                            String createdAt = obtenerProductosBase(idP).get(j).getCreatedAt();
                            String updatedAt = obtenerProductosBase(idP).get(j).getUpdatedAt();
                            
                            JSONproductosBase.put("createdAt", createdAt);
                            JSONproductosBase.put("formulacion", formulacion);
                            JSONproductosBase.put("id", idPB);
                            JSONproductosBase.put("id_producto", id_producto);
                            JSONproductosBase.put("id_producto_base", id_producto_base);
                            JSONproductosBase.put("updatedAt", updatedAt);
                                  
                            
                            JSONObject JSONproBase = new JSONObject();
                            JSONtipoProducto = new JSONObject();
                            for (int k = 0; k < obtenerProductosBases(id_producto_base).size(); k++) {
                                int idProB = obtenerProductosBases(id_producto_base).get(k).getIdPb();
                                boolean activarInv = obtenerProductosBases(id_producto_base).get(k).isActivar_inventario();
                                int tipoProducto = obtenerProductosBases(id_producto_base).get(k).getTipo_producto();
                                JSONproBase.put("id", idProB);
                                JSONproBase.put("activar_inventario", activarInv);
                                
                                
                                String[] datoTipoProB = datosTipoProducto(tipoProducto);
                                JSONtipoProducto.put("createdAt", datoTipoProB[5]);
                                JSONtipoProducto.put("eliminado", false);
                                JSONtipoProducto.put("habilitado", datoTipoProB[4]);
                                JSONtipoProducto.put("id", Integer.parseInt(datoTipoProB[0]));
                                JSONtipoProducto.put("id_tipo", Integer.parseInt(datoTipoProB[1]));
                                JSONtipoProducto.put("nombre", datoTipoProB[2]);
                                JSONtipoProducto.put("nombre_corto", datoTipoProB[3]);
                                JSONtipoProducto.put("updatedAt", datoTipoProB[6]);
                                    
                                JSONproBase.put("tipoProducto", JSONtipoProducto);
                                JSONproductosBase.put("productoBase", JSONproBase);
                            }
                            
                            
                            ARRAYproductoBase.put(JSONproductosBase);
                            JSONproducto.put("productosBase", ARRAYproductoBase);
                            
                        }
                    // JSONdetalles.put("producto", JSONproducto);
                     
                        JSONObject JSONinventario = new JSONObject();
                        for (int j = 0; j < datosInventario(idP,idAlmacen).size(); j++) {
                            JSONObject JSONinventarioDeta = new JSONObject();
                            double cantidadIn = datosInventario(idP,idAlmacen).get(j).getCantidad();
                            double costoTotal = datosInventario(idP,idAlmacen).get(j).getCosto_total();
                            double costoUnit = datosInventario(idP,idAlmacen).get(j).getCosto_unitario();
                            String createdIn = datosInventario(idP,idAlmacen).get(j).getCreated();
                            int idIn = datosInventario(idP,idAlmacen).get(j).getId();
                            int almacenIn = datosInventario(idP,idAlmacen).get(j).getAlmacen();
                            int productoIn = datosInventario(idP,idAlmacen).get(j).getProducto();
                            String lote = datosInventario(idP,idAlmacen).get(j).getLote();
                            
                            JSONinventarioDeta.put("cantidad", cantidadIn);
                            JSONinventarioDeta.put("costo_total", costoTotal);
                            JSONinventarioDeta.put("costo_unitario", costoUnit);
                            JSONinventarioDeta.put("createdAt", createdIn);
                            JSONinventarioDeta.put("id", idIn);
                            JSONinventarioDeta.put("id_almacen", almacenIn);
                            JSONinventarioDeta.put("id_producto", productoIn);
                            JSONinventarioDeta.put("lote", lote);
                            
                            ARRAYinventario.put(JSONinventarioDeta);
                            
                            
                            JSONproducto.put("inventarios", ARRAYinventario);

                        }
                        
                       // JSONdetalles.put("costo", ARRAYcosto);
                            String[] tipoProducto = datosTipoProducto(Integer.parseInt(productoDatos[18]));
                            JSONtipoProducto.put("createdAt", tipoProducto[5]);
                            JSONtipoProducto.put("eliminado", false);
                            JSONtipoProducto.put("habilitado", tipoProducto[4]);
                            JSONtipoProducto.put("id", tipoProducto[0]);
                            JSONtipoProducto.put("id_tipo", tipoProducto[1]);
                            JSONtipoProducto.put("nombre", tipoProducto[2]);
                            JSONtipoProducto.put("nombre_corto", tipoProducto[3]);
                            JSONtipoProducto.put("updatedAt", tipoProducto[6]);
                        JSONproducto.put("tipoProducto", JSONtipoProducto);
                    //JSONventa.put("tipoProducto", JSONtipoProducto);*/
                         
                        JSONdetalles.put("producto", JSONproducto);
                        JSONdetalles.put("recargo", 0);
                        JSONdetalles.put("tipo_descuento", true);
                        JSONdetalles.put("tipo_recargo", false);
                        double total = Double.parseDouble(textTotal.getText());
                        JSONdetalles.put("total", precioUnita);   
                        
                    ARRAYdetallesVentas.put(JSONdetalles);
            }
            JSONventa.put("detallesVenta", ARRAYdetallesVentas);
            
            Object[] arrayDetallesVentasNoconsolidadas = {};
            JSONventa.put("detallesVentaNoConsolidadas", arrayDetallesVentasNoconsolidadas);  
            
            JSONventa.put("fecha", fecha.toString());
            String fechaTexto = formateador.format(fecha);
            JSONventa.put("fechaTexto", fechaTexto);
            JSONventa.put("id_empresa", this.id_empresa);
            JSONventa.put("id_usuario", this.id_usuario);
            
            double importePro = 0;
            for (int j = 0; j < tablaProductos.getRowCount(); j++) {
                int cantidadPro = Integer.valueOf(String.valueOf(tablaProductos.getValueAt(j, 2)));
                double precioUnitPro = Double.valueOf(String.valueOf(tablaProductos.getValueAt(j, 4)));                      

                importePro += (cantidadPro * precioUnitPro);
            }
            JSONventa.put("importe", importePro);
                    
            String[] movimientos = datosClase(movimiento);
            JSONmovimiento.put("createdAt", movimientos[5]);
            JSONmovimiento.put("eliminado", false);
            JSONmovimiento.put("habilitado", movimientos[4]);
            JSONmovimiento.put("id", Integer.parseInt(movimientos[0]));
            JSONmovimiento.put("id_tipo", Integer.parseInt(movimientos[1]));
            JSONmovimiento.put("nombre", movimientos[2]);
            JSONmovimiento.put("nombre_corto", movimientos[3]);
            JSONmovimiento.put("updatedAt", movimientos[6]);
            JSONventa.put("movimiento", JSONmovimiento);
            
            JSONventa.put("pagado", pagado);
            JSONventa.put("saldo", saldo);


            JSONsucursal.put("id", idSucursal);
            JSONventa.put("sucursal", JSONsucursal);

            String[] tipoDePago = datosClase(tipoPago);
            JSONtipoPago.put("id", Integer.parseInt(tipoDePago[0]));

            JSONventa.put("tipoPago", JSONtipoPago);
            
            double total = Double.parseDouble(textTotal.getText());
            JSONventa.put("total", total);
                    
            String url = "/ventas";
            JSONObject res = RestServer.postJSONdata(url, JSONventa); 
            
            JOptionPane.showMessageDialog(null, "Se guardo exitosamente la venta");
            
            Thread.sleep(4000);
            String urlF = urlFormato.format(fecha);
            sincronizarConAgil(urlF);
        }catch(Exception e){
            System.out.println("Error: "+e);
        }
        
    }
    
    public void venderSinInternet(){
        
        Date f = combofecha.getDate();
        Long fe = f.getTime();
        Timestamp fecha = new Timestamp(fe);
        SimpleDateFormat formateador = new SimpleDateFormat("dd/MM/yy");
        
        String almacen = (String)comboAlmacen.getSelectedItem();
        int idAlmacen = obtenerIdAlmacen(almacen);
        String sucursal = (String)comboSucursal.getSelectedItem();
        int idSucursal = obtenerIdSucursal(sucursal, this.id_empresa);
        String actividad = (String)comboActividad.getSelectedItem();
        String cliente = txtRazonSocial.getText();
        String movimiento = (String)comboMovimiento.getSelectedItem();
        String[] datosMovimiento = datosMovimiento(movimiento);
        int idMovimiento = Integer.parseInt(datosMovimiento[0]);
        String factura = txtNitCliente.getText();
        String tipoPago = (String) comboTipoPago.getSelectedItem();
        int idUsuario = this.id_usuario;
       
        
        double a_cuenta = textACuenta.getText().equals("")? 0:Double.parseDouble(textACuenta.getText());
        double cambio = (textoCambio.getText().equals(""))? 0:Double.parseDouble(textoCambio.getText());
        boolean despachado = false;
        String fechaAct = fecha.toString();
        String fechaTexto = formateador.format(fecha);
        double importePro = 0;
        for (int i = 0; i < tablaProductos.getRowCount(); i++) {
            int cantidadPro = Integer.valueOf(String.valueOf(tablaProductos.getValueAt(i, 2)));
            double precioUnitPro = Double.valueOf(String.valueOf(tablaProductos.getValueAt(i, 4)));                      

            importePro += (cantidadPro * precioUnitPro);
        }
        double pagado = Double.parseDouble(textoPagado.getText());
        double saldo = textSaldo.getText().equals("")? 0:Double.parseDouble(textSaldo.getText());
        double total = Double.parseDouble(textTotal.getText());
         
         
        String autorizacion = "";
        String[] datosActividad = datosActividad(actividad);
        String[] almacenDatos = datosAlmacen(this.id_empresa, sucursal, almacen);
        String[] movimientos = datosClase(movimiento);
        String[] tipoDePago = datosClase(tipoPago);
      
            
        int idActi = Integer.parseInt(datosActividad[0]);
        int idTipoActi = Integer.parseInt(datosActividad[1]);
        String nombreActi = datosActividad[2];
        String nombreCortoActi = datosActividad[3];
        boolean habilitado = Boolean.parseBoolean(datosActividad[4]);
        boolean eliminado = false; 
        
        
        int idSucursalAl = Integer.parseInt(almacenDatos[0]);
        int idAlm = Integer.parseInt(almacenDatos[1]);
        String nombreAlm = almacenDatos[2];
        String direccion = almacenDatos[3];
        int numeroAlm = Integer.parseInt(almacenDatos[4]);
                     
        
        
        String createdMo =  movimientos[5];
        boolean eliminadoMo = false;
        boolean habilitadoMo = Boolean.parseBoolean(movimientos[4]);
        int idMo = Integer.parseInt(movimientos[0]);
        int idTipoMo = Integer.parseInt(movimientos[1]);
        String nombreMo = movimientos[2];
        String nombreCortoMo = movimientos[3];
        String updatedMo = movimientos[6];
            
        int idTP = Integer.parseInt(tipoDePago[0]);
        int idTipoTP = Integer.parseInt(tipoDePago[1]);
        String nombreTP = tipoDePago[2];
        String nombreCortoTP = tipoDePago[3];
        boolean habilitadoTP = Boolean.parseBoolean(tipoDePago[4]);
        String createdTP = tipoDePago[5];
        String updatedTP = tipoDePago[6];
        boolean eliminadoTP = false;
             
        Connection conn = null;   
        try { 
            conn = Conexion2.getConnection(); 
            //Revisamos si la conexion esta en modo autocommit 
            //por default es autocommit == true 
            if (conn.getAutoCommit()) { 
                conn.setAutoCommit(false); 
            } 
            VentasDB ventasdb = new VentasDB(conn);
            
            ventasdb.insertActividadExportar(idActi, idTipoActi, nombreActi, nombreCortoActi, eliminado, habilitado);
            int idActividadVe = ventasdb.selectUltimoIdActividad();
            ventasdb.insertAlmacenExportar(idAlm, idSucursalAl, nombreAlm, numeroAlm, direccion);
            int idAlmacenVe = ventasdb.selectUltimoIdAlmacen();            
            ventasdb.insertClienteExportar(factura, cliente);
            int idClienteVe = ventasdb.selectUltimoIdCliente();
            ventasdb.insertClaseExportar(idMo, idTipoMo, nombreMo, nombreCortoMo, habilitado, createdMo, updatedMo, eliminadoMo);
            int idMov = ventasdb.selectUltimoIdClase();
            ventasdb.insertSucursalExportar(idSucursal);
            int idSuc = ventasdb.selectUltimoIdSucursal();
            ventasdb.insertClaseExportar(idTP, idTipoTP, nombreTP, nombreCortoTP, habilitadoTP, createdTP, updatedTP, eliminadoTP);
            int idTiPag = ventasdb.selectUltimoIdClase();
            
            
            ventasdb.insertVentaExportar(a_cuenta, idActividadVe, idAlmacenVe, cambio, idClienteVe, despachado, fechaAct, fechaTexto, this.id_empresa, idUsuario, importePro, idMovimiento, pagado, saldo, idSucursal, idTiPag, total);
            int idVenta = ventasdb.selectUltimoIdVenta();
 
            for (int i = 0; i < tablaProductos.getRowCount(); i++) {
                int idP = Integer.valueOf(String.valueOf(tablaProductos.getValueAt(i, 0)));
                
                int cantidadP = Integer.valueOf(String.valueOf(tablaProductos.getValueAt(i, 2)));
                double importe = Double.valueOf(String.valueOf(tablaProductos.getValueAt(i, 5)));
                
                double cantidad_disponible = calcularCantidad(idP, idAlmacen);
                double precioUnita = obtenerPrecioUnitarioPro(idP,idAlmacen);

                String[] productoDatos = datosProducto(idP, idAlmacen);
                double descuento = Double.parseDouble(productoDatos[10]);       
                     
                ventasdb.insertDetalleVentaExportar(idVenta,cantidadP, descuento, 0, 0, importe, cantidad_disponible, precioUnita, 0, true, false, total);            
                int idDetalleVenta = ventasdb.selectUltimoIdDetalleVenta();
                
                
                for (int j = 0; j < datosInventario(idP,idAlmacen).size(); j++) {                 
                    int idI = datosInventario(idP,idAlmacen).get(j).getId();
                    int almacenI = datosInventario(idP,idAlmacen).get(j).getAlmacen();
                    int productoI = datosInventario(idP,idAlmacen).get(j).getProducto();
                    double cantidadI = datosInventario(idP,idAlmacen).get(j).getCantidad();
                    double costoUniI = datosInventario(idP,idAlmacen).get(j).getCosto_unitario();
                    String created = datosInventario(idP,idAlmacen).get(j).getCreated();
                    double costoTotal = datosInventario(idP,idAlmacen).get(j).getCosto_total();
                    String createdI = datosInventario(idP,idAlmacen).get(j).getCreated();
                    String updatedI = datosInventario(idP,idAlmacen).get(j).getUpdated();
                    String fechaVenI = datosInventario(idP,idAlmacen).get(j).getFecha_vencimiento();
                    String lote = datosInventario(idP,idAlmacen).get(j).getLote();
                    String updated = datosInventario(idP,idAlmacen).get(j).getUpdated();
                    
                    ventasdb.insertCostosExportar(idDetalleVenta,idI, almacenI, productoI, cantidadI, costoTotal, costoUniI, created, updated, fechaVenI, lote);
          
                }

                    boolean activarInventario = Boolean.parseBoolean(productoDatos[0]);
                    int activo_fijo = 0;
                    int alerta = Integer.parseInt(productoDatos[1]);
                    String anio = productoDatos[2];
                    String caracte_especial1 = productoDatos[3];
                    String caracte_especial2 = productoDatos[4];
                    String codigo = productoDatos[5];
                    String codigoFabrica = productoDatos[6];
                    double comision = Double.parseDouble(productoDatos[7]);
                    String createdAtPro = productoDatos[8];
                    String updatedAtPro = productoDatos[9];
                    double descuentoPro = Double.parseDouble(productoDatos[10]); 
                    boolean descuentoFijo = Boolean.parseBoolean(productoDatos[11]);
                    int idPro = Integer.parseInt(productoDatos[12]);
                    int idAlmErp =  Integer.parseInt(productoDatos[13]);
                    int idCuenta = Integer.parseInt(productoDatos[14]);
                    int idEmpresa = Integer.parseInt(productoDatos[15]);
                    int idGrupo = Integer.parseInt(productoDatos[16]);
                    int idSubGrupo = Integer.parseInt(productoDatos[17]);
                    int idTipoProducto = Integer.parseInt(productoDatos[18]);
                    String imagen = "";
                    double inventarioDisponible = cantidad_disponible;
                    int inventarioMinimo = Integer.parseInt(productoDatos[12]);

                    ventasdb.insertProductoExportar(idDetalleVenta, idPro, idEmpresa, activarInventario, activo_fijo, alerta, anio, caracte_especial1, caracte_especial2, codigo, codigoFabrica, comision, createdTP, updatedTP, descuentoPro, descuentoFijo, idAlmErp, idCuenta, idGrupo, idSubGrupo, imagen, inventarioDisponible, inventarioMinimo,idTipoProducto);
                    int idUltimoPro = ventasdb.selectUltimoIdProd();
                   
                    for (int j = 0; j < obtenerProductosBase(idP).size(); j++) {

                        int idPB = obtenerProductosBase(idP).get(j).getId();
                        int id_producto = obtenerProductosBase(idP).get(j).getId_producto();
                        int id_producto_base = obtenerProductosBase(idP).get(j).getId_producto_base();
                        String formulacion = obtenerProductosBase(idP).get(j).getFormulacion();
                        String createdAt = obtenerProductosBase(idP).get(j).getCreatedAt();
                        String updatedAt = obtenerProductosBase(idP).get(j).getUpdatedAt();

                        ventasdb.insertProductoBaseExportar(idUltimoPro, idPB, id_producto, id_producto_base, formulacion, createdAt, updatedAt);
                        int idUltimoProBase = ventasdb.selectUltimoIdProdBase();
                        
                        for (int k = 0; k < obtenerProductosBases(id_producto_base).size(); k++) {
                            int idProB = obtenerProductosBases(id_producto_base).get(k).getIdPb();
                            String nombre = obtenerProductosBases(id_producto_base).get(k).getNombre();
                            boolean activarInv = obtenerProductosBases(id_producto_base).get(k).isActivar_inventario();
                            int tipoProducto = obtenerProductosBases(id_producto_base).get(k).getTipo_producto();
                            
                            ventasdb.insertProductosBaseExportar(idUltimoProBase, idProB, activarInv,tipoProducto,nombre);
                            int idUltimoProsBase = ventasdb.selectUltimoIdProductosBase(); 
                            
                                String[] datoTipoProB = datosTipoProducto(tipoProducto);
                                String created = datoTipoProB[5];
                                boolean eliminadoTPB = false;
                                boolean habilitadoTPB = Boolean.parseBoolean(datoTipoProB[4]);
                                int idTPB = Integer.parseInt(datoTipoProB[0]);
                                int idTiPoTPB = Integer.parseInt(datoTipoProB[1]);
                                String nombreTPB = datoTipoProB[2];
                                String nombreCortoTPB = datoTipoProB[3];
                                String updated = datoTipoProB[6];

                                ventasdb.insertClaseExportar(idTPB, idTiPoTPB, nombreTPB, nombreCortoTPB, habilitadoTPB, created, updated, eliminadoTPB);
                                
                                for (int l = 0; l < datosInventario(idP,idAlmacen).size(); l++) {
                                    JSONObject JSONinventarioDeta = new JSONObject();
                                    double cantidadInPB = datosInventario(idP,idAlmacen).get(l).getCantidad();
                                    double costoTotalInPB = datosInventario(idP,idAlmacen).get(l).getCosto_total();
                                    double costoUnitInPB = datosInventario(idP,idAlmacen).get(l).getCosto_unitario();
                                    String createdInPB = datosInventario(idP,idAlmacen).get(l).getCreated();
                                    int idInPB = datosInventario(idP,idAlmacen).get(l).getId();
                                    int almacenInPB = datosInventario(idP,idAlmacen).get(l).getAlmacen();
                                    int productoInPB = datosInventario(idP,idAlmacen).get(l).getProducto();
                                    String lotePB = datosInventario(idP,idAlmacen).get(l).getLote();
                                    
                                    ventasdb.insertInventarioPBExportar(idInPB, almacenInPB, productoInPB, cantidadInPB, costoTotalInPB,costoUnitInPB, created, lotePB);
                            }                   
                        }
     
                    }              
            }
            JOptionPane.showMessageDialog(null, "Se guardo la venta en la base de datos.");
            
            conn.commit();
        } catch (SQLException e) {
            //Hacemos rollback en caso de error
            try {
                System.out.println("Entramos al rollback");
            //Imprimimos la excepcion a la consola
                e.printStackTrace(System.out);
            //Hacemos rollback
                conn.rollback();
            } catch (SQLException e1) {
                e1.printStackTrace(System.out);
            }
        }
        System.out.println("Fin de la venta");
    }
    
    public void sincronizarConAgil(String urlfecha){
        if (getConnectionStatus() == true) {
            Converter convertir = new Converter();
            
            String url = "/obtenerDetalleVenta/empresa/"+this.id_empresa+"/inicio/"+urlfecha+"/fin/"+urlfecha;

            try {
                JSONArray ventas = RestServer.getJSONArray(url);
                            
                Connection conn = null;   
                try { 
                    conn = Conexion.getConnection();
                    if (conn.getAutoCommit()) { 
                        conn.setAutoCommit(false); 
                    } 
                    VentasDB ventasdb = new VentasDB(conn);
                    
                    //ventasdb.deleteVentas();
                   // ventasdb.deleteDetalleVentas();
                    
                    for (int i = 0; i < ventas.length(); i++) {
                        JSONObject venta = ventas.getJSONObject(i);
                        int id = venta.getInt("id");
                        int id_almacen = venta.getInt("id_almacen");
                        int id_actividad = (venta.get("id_actividad").toString().equals("null"))? 0:Integer.parseInt(venta.get("id_actividad").toString());
                        int id_cliente = (venta.get("id_cliente").toString().equals("null"))? 0:Integer.parseInt(venta.get("id_cliente").toString());
                        int id_movimiento = venta.getInt("id_movimiento");
                        String factura = (venta.get("factura").toString().equals("null"))? "":venta.get("factura").toString();
                        String autorizacion = (venta.get("autorizacion").toString().equals("null"))? "":venta.get("autorizacion").toString();
                        String f = (venta.get("fecha").toString().equals("null"))? "":venta.get("fecha").toString();
                        Timestamp fecha = null;
                        if (!f.equals("")) {
                            Instant instant = Instant.parse(f);
                            LocalDateTime fe = LocalDateTime.ofInstant(instant, ZoneId.of(ZoneOffset.UTC.getId()));
                            fecha = Timestamp.valueOf(fe);
                        }else{
                            fecha = null;
                        }
                       
                        
                        String fecha_limite_emision = (venta.get("fecha_limite_emision").toString().equals("null"))? "":venta.get("fecha_limite_emision").toString();
                        String codigo_control = (venta.get("codigo_control").toString().equals("null"))? "":venta.get("codigo_control").toString();
                        double importe = (venta.get("importe").toString().equals("null"))? 0:Double.parseDouble(venta.get("importe").toString());
                        int id_tipo_pago = (venta.get("id_tipo_pago").toString().equals("null"))? 0:Integer.parseInt(venta.get("id_tipo_pago").toString());
                        int dias_credito = (venta.get("dias_credito").toString().equals("null"))? 0:Integer.parseInt(venta.get("dias_credito").toString());
                        double a_cuenta = (venta.get("a_cuenta").toString()).equals("null")? 0:Double.parseDouble(venta.get("a_cuenta").toString());
                        double saldo = (venta.get("saldo").toString().equals("null"))? 0:Double.parseDouble(venta.get("saldo").toString());
                        double total = (venta.get("total").toString().equals("null"))? 0:Double.parseDouble(venta.get("total").toString());
                        String createdAt = (venta.get("createdAt").toString().equals("null"))? "":venta.get("createdAt").toString();
                        String updatedAt = (venta.get("updatedAt").toString().equals("null"))? "":venta.get("updatedAt").toString();
                        int id_usuario = (venta.get("id_usuario").toString().equals("null"))? 0:Integer.parseInt(venta.get("id_usuario").toString());
                        boolean activa = venta.getBoolean("activa");
                        double pagado = (venta.get("pagado").toString().equals("null"))? 0:Double.parseDouble(venta.get("pagado").toString());
                        double cambio = (venta.get("cambio").toString().equals("null"))? 0:Double.parseDouble(venta.get("cambio").toString());
                        int almacen_traspaso = (venta.get("id_almacen_traspaso").toString().equals("null"))? 0:Integer.parseInt(venta.get("id_almacen_traspaso").toString());
                        int pedido = (venta.get("pedido").toString().equals("null"))? 0:Integer.parseInt(venta.get("pedido").toString());
                        boolean despachado = venta.getBoolean("despachado");
                        int id_cierre_caja = (venta.get("id_cierre_caja").toString().equals("null"))? 0:Integer.parseInt(venta.get("id_cierre_caja").toString());
                        int id_vendedor = (venta.get("id_vendedor").toString().equals("null"))? 0:Integer.parseInt(venta.get("id_vendedor").toString());
                        boolean contabilizado = (venta.get("contabilizado").toString().equals("null"))? false:Boolean.parseBoolean(venta.get("contabilizado").toString());
                        boolean usar_servicios = (venta.get("usar_servicios").toString().equals("null"))? false:Boolean.parseBoolean(venta.get("usar_servicios").toString());
                        String totalLiterario = convertir.Convertir(Double.toString(total), true);
                     
                        ventasdb.insertarVenta(id, id_almacen, id_actividad, id_cliente, id_movimiento, factura, autorizacion, fecha, fecha_limite_emision, codigo_control, importe, id_tipo_pago, dias_credito, a_cuenta, saldo, total, createdAt, updatedAt, id_usuario, activa, pagado, cambio, almacen_traspaso, pedido, despachado, id_cierre_caja, id_vendedor, contabilizado, usar_servicios,totalLiterario);
                        
                        int idMo = venta.getJSONObject("movimiento").getInt("id");
                        int tipoMo = venta.getJSONObject("movimiento").getInt("id_tipo");
                        int claseMo = venta.getJSONObject("movimiento").getInt("id_clase");
                        int almacenMo = venta.getJSONObject("movimiento").getInt("id_almacen");
                        String fechaMo = venta.getJSONObject("movimiento").getString("fecha");
                        String createdMo = venta.getJSONObject("movimiento").getString("createdAt");
                        String updatedMo = venta.getJSONObject("movimiento").getString("updatedAt");
                        ventasdb.insertMovimientosVenta(idMo, tipoMo, claseMo, almacenMo, fechaMo, createdMo, updatedMo);
                        
                        int idCli = venta.getJSONObject("cliente").getInt("id");
                        String razonSocialCli = venta.getJSONObject("cliente").getString("razon_social");
                        String nitCli = venta.getJSONObject("cliente").get("nit").toString();
                        ventasdb.insertCliente(idCli, razonSocialCli, nitCli);
                                          
                        JSONArray detalleVentas = venta.getJSONArray("detallesVenta");                      
                        for (int j = 0; j < detalleVentas.length(); j++) {
                            JSONObject detalle = detalleVentas.getJSONObject(j);
                            
                            int idDetalle = (detalle.get("id").toString().equals("null"))? 0:Integer.parseInt(detalle.get("id").toString());
                            int idVenta = detalle.getInt("id_venta");
                            int idProducto = (detalle.get("id_producto").toString().equals("null"))? 0:Integer.parseInt(detalle.get("id_producto").toString());
                            double precioUnitario = (detalle.get("precio_unitario").toString().equals("null"))? 0:Double.parseDouble(detalle.get("precio_unitario").toString());
                            double cantidad = (detalle.get("cantidad").toString().equals("null"))? 0:Double.parseDouble(detalle.get("cantidad").toString());
                            double importeDetalle = (detalle.get("importe").toString().equals("null"))? 0:Double.parseDouble(detalle.get("importe").toString());
                            double descuento = (detalle.get("descuento").toString().equals("null"))? 0:Double.parseDouble(detalle.get("descuento").toString());
                            double recargo = (detalle.get("recargo").toString().equals("null"))? 0:Double.parseDouble(detalle.get("recargo").toString());
                            double ice = (detalle.get("ice").toString().equals("null"))? 0:Double.parseDouble(detalle.get("ice").toString());
                            double excento = (detalle.get("excento").toString().equals("null"))? 0:Double.parseDouble(detalle.get("excento").toString());
                            boolean tipoDescuento = (detalle.get("tipo_descuento").toString().equals("null"))? false:Boolean.parseBoolean(detalle.get("tipo_descuento").toString());
                            boolean tipoRecargo = (detalle.get("tipo_recargo").toString().equals("null"))? false:Boolean.parseBoolean(detalle.get("tipo_recargo").toString());
                            double totalDetalle = (detalle.get("total").toString().equals("null"))? 0:Double.parseDouble(detalle.get("total").toString());
                            String createdAtDetalle = detalle.get("createdAt").toString();
                            String updatedAtDetalle = detalle.get("updatedAt").toString();
                            String fechaLimite = (detalle.get("fecha_vencimiento").toString().equals("null"))? "":detalle.get("fecha_vencimiento").toString();
                            String lote = (detalle.get("lote").toString().equals("null"))? "":detalle.get("lote").toString();
                            int inventario = (detalle.get("id_inventario").toString().equals("null"))? 0:Integer.parseInt(detalle.get("id_inventario").toString());
                            String observacion = (detalle.get("observaciones").toString().equals("null"))? "":detalle.get("observaciones").toString();
                            int servicio = (detalle.get("id_servicio").toString().equals("null"))? 0:Integer.parseInt(detalle.get("id_servicio").toString());
                            
                            ventasdb.insertarDetalleVenta(idDetalle, idVenta, idProducto, precioUnitario, cantidad, importeDetalle, descuento, recargo, ice, excento, tipoDescuento, tipoRecargo, totalDetalle, createdAtDetalle, updatedAtDetalle, fechaLimite, lote, inventario, observacion, servicio);

                         }
                        
                        conn.commit();
                    }
                 
                } catch (SQLException e) {
                    //Hacemos rollback en caso de error
                    try {
                        System.out.println("Entramos al rollback");
                    //Imprimimos la excepcion a la consola
                        e.printStackTrace(System.out);
                    //Hacemos rollback
                        conn.rollback();
                    } catch (SQLException e1) {
                        e1.printStackTrace(System.out);
                    }
                }
                    
            } catch (Exception e) {
                System.out.println("Error al recoger las ventas en la cincronizacion: "+e);               
            }
                        
                        
        }else{
            JOptionPane.showMessageDialog(null, "No se actualizo las ventas con el del servidor.!");
        }
    }
    
    public void FiltrarNombre(String productoFiltrado){
        JButtonProducto filtroProducto[];
        String alma = (String)comboAlmacen.getSelectedItem();
        int almacen = obtenerIdAlmacen(alma);


        int idProducto = 0;
        String nombre = "";
        String codigo = "";
        String unidadMedida = "";
        double precioUnitario = 0;
        String descripcion = "";
        String codigoFabrica = "";
        double descuento = 0;
        int pos = 0;

        int id_pro = 0;
        String  nom_pb = "";
        double formulacion = 0;
        String codigoPB = "";
        String uni_med_pb = "";
        double prec_unit_pb = 0;
        String codigo_fabrica_pb = "";
        int i = 0;

        ResultSet rs = null;
        ResultSet rs2 = null;
        int tamaño = 0 ;
            
        jPanelMostrar.removeAll();
        ResultSet rstam = db.seleccionar("SELECT * FROM PRODUCTO WHERE lower(NOMBRE) LIKE '%"+productoFiltrado+"%' AND ALMACEN = "+almacen);
        try {
            while (rstam.next()) {
                tamaño++;
            }
        } catch (SQLException ex) {
            Logger.getLogger(VentasUI.class.getName()).log(Level.SEVERE, null, ex);
        }
        
        try {
            
            menu = new JButtonProducto[tamaño];
            rs = db.seleccionar("SELECT IDP,NOMBRE,CODIGO,UNIDAD_MEDIDA,PRECIO_UNITARIO,DESCRIPCION,CODIGO_FABRICA,DESCUENTO \n" +
                "FROM PRODUCTO WHERE lower(NOMBRE) LIKE '%"+productoFiltrado+"%' AND ALMACEN = "+almacen);
            while(rs.next()){
               idProducto = rs.getInt(1);
               nombre = rs.getString(2);
               codigo = rs.getString(3);
               unidadMedida = rs.getString(4);
               precioUnitario = rs.getDouble(5);
               descripcion = rs.getString(6);
               codigoFabrica = rs.getString(7);
               descuento = rs.getDouble(8);
               
               ArrayList<JButtonProducto> productosBase = new ArrayList();
               String consultaPB = "SELECT PBS.IDPB,PBS.NOMBRE,PB.FORMULACION,PBS.CODIGO,PBS.UNIDAD_MEDIDA,\n" +
                "PBS.PRECIO_UNITARIO,PBS.CODIGO_FABRICA,PBS.UNIDAD_MEDIDA,\n" +
                "PBS.PRECIO_UNITARIO,PBS.CODIGO_FABRICA\n" +
                "FROM PRODUCTO_BASE AS PB\n" +
                "INNER JOIN PRODUCTOS_BASES AS PBS ON PB.PRODUCTO_BASE = PBS.IDPB\n" +
                "WHERE PB.PRODUCTO = "+idProducto;
               rs2 = db.seleccionar(consultaPB);
                while (rs2.next()) {                    
                    id_pro = rs2.getInt(1);
                    nom_pb = rs2.getString(2);
                    formulacion = Double.parseDouble(rs2.getString(3));
                    codigoPB = rs2.getString(4);
                    uni_med_pb = rs2.getString(5);
                    //cantUni_ideal_pb = rs2.getString(4);
                    prec_unit_pb = rs2.getDouble(6);
                    codigo_fabrica_pb = rs2.getString(7);
                    
                    JButtonProducto pb = new JButtonProducto(id_pro, nom_pb, formulacion, codigoPB, uni_med_pb, prec_unit_pb, codigo_fabrica_pb);
                    productosBase.add(pb);
                }
                                   
                String imagenIcon = "/imagen/icon-producto-default.png";

                img = new ImageIcon(this.getClass().getResource(imagenIcon));
                icon = new ImageIcon(img.getImage().getScaledInstance(80, 90, 1));
                int invCantidad = calcularCantidad(idProducto, almacen);
                                                           
                menu[i] = new JButtonProducto(idProducto, nombre,codigo, unidadMedida, precioUnitario, descripcion,codigoFabrica,invCantidad,productosBase,descuento,i, icon);
                menu[i].setToolTipText("<html>Producto:"+nombre+"<br>Cantidad: "+invCantidad+"</html>");
                

                menu[i].setVerticalTextPosition(SwingConstants.BOTTOM);
                menu[i].setHorizontalTextPosition(SwingConstants.CENTER);
                menu[i].setPreferredSize(new Dimension(100, 150));

                menu[i].addActionListener(this);
                jPanelMostrar.add(menu[i]);
                jPanelMostrar.updateUI();            
            
                i++;
            
            
            }
            
        } catch (Exception e) {
            System.out.println("Error al filtrar: "+e);
        }
    }
    /**
     * This method is called from within the constructor to initialize the form.
     * WARNING: Do NOT modify this code. The content of this method is always
     * regenerated by the Form Editor.
     */
    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        jPanel1 = new javax.swing.JPanel();
        jPanel2 = new javax.swing.JPanel();
        labelActividad = new javax.swing.JLabel();
        combofecha = new com.toedter.calendar.JDateChooser();
        labelFecha = new javax.swing.JLabel();
        comboMovimiento = new javax.swing.JComboBox<>();
        labelMovimiento = new javax.swing.JLabel();
        comboActividad = new javax.swing.JComboBox<>();
        labelSucursal = new javax.swing.JLabel();
        comboSucursal = new javax.swing.JComboBox<>();
        labelAlmacen = new javax.swing.JLabel();
        comboAlmacen = new javax.swing.JComboBox<>();
        labelTipoPago = new javax.swing.JLabel();
        comboTipoPago = new javax.swing.JComboBox<>();
        btnMostrar = new javax.swing.JButton();
        textDias = new javax.swing.JTextField();
        labelFecha1 = new javax.swing.JLabel();
        textSujetoCF = new javax.swing.JTextField();
        labelFecha3 = new javax.swing.JLabel();
        labelFecha4 = new javax.swing.JLabel();
        textACuenta = new javax.swing.JTextField();
        labelFecha5 = new javax.swing.JLabel();
        textSaldo = new javax.swing.JTextField();
        jScrollPane1 = new javax.swing.JScrollPane();
        jPanelMostrar = new javax.swing.JPanel();
        jScrollPane2 = new javax.swing.JScrollPane();
        tablaProductos = new JTable(){
            public boolean isCellEditable(int rowIndex, int colIndex) {
                return colIndex != 0 && colIndex != 1 && colIndex != 2 && colIndex != 3 
                && colIndex != 4 && colIndex != 5 && colIndex != 6 && colIndex != 7;
            }
        };
        jPanel3 = new javax.swing.JPanel();
        jLabel7 = new javax.swing.JLabel();
        txtNitCliente = new javax.swing.JTextField();
        jLabel8 = new javax.swing.JLabel();
        txtRazonSocial = new javax.swing.JTextField();
        jPanel4 = new javax.swing.JPanel();
        jLabel9 = new javax.swing.JLabel();
        textoPagado = new javax.swing.JTextField();
        jLabel10 = new javax.swing.JLabel();
        textoCambio = new javax.swing.JTextField();
        btnGuardar = new javax.swing.JButton();
        jLabel11 = new javax.swing.JLabel();
        txtFiltro = new javax.swing.JTextField();
        btnCerrar = new javax.swing.JButton();
        jLabel1 = new javax.swing.JLabel();
        textTotal = new javax.swing.JLabel();

        setDefaultCloseOperation(javax.swing.WindowConstants.DISPOSE_ON_CLOSE);

        jPanel1.setBackground(new java.awt.Color(255, 255, 255));

        jPanel2.setBackground(new java.awt.Color(255, 255, 255));
        jPanel2.setBorder(javax.swing.BorderFactory.createLineBorder(new java.awt.Color(227, 64, 61)));

        labelActividad.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        labelActividad.setForeground(new java.awt.Color(255, 0, 0));
        labelActividad.setText("ACTIVIDAD");

        combofecha.setDateFormatString("yyyy-MM-dd HH:mm:ss");

        labelFecha.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        labelFecha.setForeground(new java.awt.Color(255, 0, 0));
        labelFecha.setText("FECHA");

        comboMovimiento.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                comboMovimientoActionPerformed(evt);
            }
        });
        comboMovimiento.addKeyListener(new java.awt.event.KeyAdapter() {
            public void keyPressed(java.awt.event.KeyEvent evt) {
                comboMovimientoKeyPressed(evt);
            }
        });

        labelMovimiento.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        labelMovimiento.setForeground(new java.awt.Color(255, 0, 0));
        labelMovimiento.setText("MOVIENTO");

        comboActividad.setModel(new javax.swing.DefaultComboBoxModel<>(new String[] { " " }));
        comboActividad.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                comboActividadActionPerformed(evt);
            }
        });

        labelSucursal.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        labelSucursal.setForeground(new java.awt.Color(255, 0, 0));
        labelSucursal.setText("SUCURSAL");

        comboSucursal.setModel(new javax.swing.DefaultComboBoxModel<>(new String[] { "Seleccionar ..." }));
        comboSucursal.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                comboSucursalActionPerformed(evt);
            }
        });

        labelAlmacen.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        labelAlmacen.setForeground(new java.awt.Color(255, 0, 0));
        labelAlmacen.setText("ALMACEN");

        comboAlmacen.setModel(new javax.swing.DefaultComboBoxModel<>(new String[] { "Seleccionar ..." }));
        comboAlmacen.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                comboAlmacenActionPerformed(evt);
            }
        });

        labelTipoPago.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        labelTipoPago.setForeground(new java.awt.Color(255, 0, 0));
        labelTipoPago.setText("TIPO DE PAGO");

        comboTipoPago.setModel(new javax.swing.DefaultComboBoxModel<>(new String[] { "CONTADO", "CREDITO" }));
        comboTipoPago.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                comboTipoPagoActionPerformed(evt);
            }
        });

        btnMostrar.setText("Mostrar");
        btnMostrar.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                btnMostrarActionPerformed(evt);
            }
        });

        labelFecha1.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        labelFecha1.setForeground(new java.awt.Color(255, 0, 0));
        labelFecha1.setText("DÍAS");

        labelFecha3.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        labelFecha3.setForeground(new java.awt.Color(255, 0, 0));
        labelFecha3.setText("SUJETO A CF");

        labelFecha4.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        labelFecha4.setForeground(new java.awt.Color(255, 0, 0));
        labelFecha4.setText("A CUENTA (BS)");

        textACuenta.addKeyListener(new java.awt.event.KeyAdapter() {
            public void keyReleased(java.awt.event.KeyEvent evt) {
                textACuentaKeyReleased(evt);
            }
        });

        labelFecha5.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        labelFecha5.setForeground(new java.awt.Color(255, 0, 0));
        labelFecha5.setText("SALDO");

        javax.swing.GroupLayout jPanel2Layout = new javax.swing.GroupLayout(jPanel2);
        jPanel2.setLayout(jPanel2Layout);
        jPanel2Layout.setHorizontalGroup(
            jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, jPanel2Layout.createSequentialGroup()
                .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(jPanel2Layout.createSequentialGroup()
                        .addGap(6, 6, 6)
                        .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(combofecha, javax.swing.GroupLayout.PREFERRED_SIZE, 130, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addComponent(labelFecha, javax.swing.GroupLayout.PREFERRED_SIZE, 189, javax.swing.GroupLayout.PREFERRED_SIZE))
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, 39, Short.MAX_VALUE)
                        .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(labelMovimiento, javax.swing.GroupLayout.PREFERRED_SIZE, 130, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addComponent(comboMovimiento, javax.swing.GroupLayout.PREFERRED_SIZE, 160, javax.swing.GroupLayout.PREFERRED_SIZE))
                        .addGap(23, 23, 23)
                        .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(comboActividad, javax.swing.GroupLayout.PREFERRED_SIZE, 302, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addComponent(labelActividad, javax.swing.GroupLayout.PREFERRED_SIZE, 130, javax.swing.GroupLayout.PREFERRED_SIZE))
                        .addGap(34, 34, 34)
                        .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING, false)
                            .addComponent(comboSucursal, 0, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                            .addComponent(labelSucursal, javax.swing.GroupLayout.PREFERRED_SIZE, 151, javax.swing.GroupLayout.PREFERRED_SIZE))
                        .addGap(36, 36, 36)
                        .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(labelAlmacen, javax.swing.GroupLayout.PREFERRED_SIZE, 94, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addComponent(comboAlmacen, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                        .addGap(33, 33, 33)
                        .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(labelTipoPago, javax.swing.GroupLayout.PREFERRED_SIZE, 103, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addComponent(comboTipoPago, javax.swing.GroupLayout.PREFERRED_SIZE, 112, javax.swing.GroupLayout.PREFERRED_SIZE))
                        .addGap(49, 49, 49))
                    .addGroup(jPanel2Layout.createSequentialGroup()
                        .addGap(90, 90, 90)
                        .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING, false)
                            .addComponent(labelFecha1, javax.swing.GroupLayout.DEFAULT_SIZE, 120, Short.MAX_VALUE)
                            .addComponent(textDias))
                        .addGap(42, 42, 42)
                        .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(textSujetoCF)
                            .addComponent(labelFecha3, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
                        .addGap(34, 34, 34)
                        .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(labelFecha4, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                            .addComponent(textACuenta))
                        .addGap(33, 33, 33)
                        .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addGroup(jPanel2Layout.createSequentialGroup()
                                .addComponent(labelFecha5, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                                .addGap(544, 544, 544))
                            .addGroup(jPanel2Layout.createSequentialGroup()
                                .addComponent(textSaldo, javax.swing.GroupLayout.PREFERRED_SIZE, 120, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)))))
                .addComponent(btnMostrar)
                .addGap(86, 86, 86))
        );
        jPanel2Layout.setVerticalGroup(
            jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel2Layout.createSequentialGroup()
                .addContainerGap()
                .addComponent(btnMostrar, javax.swing.GroupLayout.PREFERRED_SIZE, 61, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
            .addGroup(jPanel2Layout.createSequentialGroup()
                .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING)
                        .addGroup(jPanel2Layout.createSequentialGroup()
                            .addComponent(labelFecha, javax.swing.GroupLayout.PREFERRED_SIZE, 30, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                            .addComponent(combofecha, javax.swing.GroupLayout.PREFERRED_SIZE, 29, javax.swing.GroupLayout.PREFERRED_SIZE))
                        .addGroup(jPanel2Layout.createSequentialGroup()
                            .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                .addComponent(labelMovimiento, javax.swing.GroupLayout.PREFERRED_SIZE, 29, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addComponent(labelTipoPago, javax.swing.GroupLayout.PREFERRED_SIZE, 29, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addGroup(jPanel2Layout.createSequentialGroup()
                                    .addComponent(labelAlmacen, javax.swing.GroupLayout.PREFERRED_SIZE, 29, javax.swing.GroupLayout.PREFERRED_SIZE)
                                    .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                    .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                                        .addComponent(comboAlmacen, javax.swing.GroupLayout.PREFERRED_SIZE, 29, javax.swing.GroupLayout.PREFERRED_SIZE)
                                        .addComponent(comboTipoPago, javax.swing.GroupLayout.PREFERRED_SIZE, 29, javax.swing.GroupLayout.PREFERRED_SIZE)))
                                .addGroup(jPanel2Layout.createSequentialGroup()
                                    .addComponent(labelSucursal, javax.swing.GroupLayout.PREFERRED_SIZE, 29, javax.swing.GroupLayout.PREFERRED_SIZE)
                                    .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                    .addComponent(comboSucursal, javax.swing.GroupLayout.PREFERRED_SIZE, 29, javax.swing.GroupLayout.PREFERRED_SIZE))
                                .addGroup(jPanel2Layout.createSequentialGroup()
                                    .addComponent(labelActividad, javax.swing.GroupLayout.PREFERRED_SIZE, 29, javax.swing.GroupLayout.PREFERRED_SIZE)
                                    .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                    .addComponent(comboActividad, javax.swing.GroupLayout.PREFERRED_SIZE, 29, javax.swing.GroupLayout.PREFERRED_SIZE)))
                            .addGap(1, 1, 1)))
                    .addComponent(comboMovimiento, javax.swing.GroupLayout.Alignment.TRAILING, javax.swing.GroupLayout.PREFERRED_SIZE, 29, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(labelFecha4, javax.swing.GroupLayout.PREFERRED_SIZE, 23, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                        .addComponent(labelFecha1, javax.swing.GroupLayout.PREFERRED_SIZE, 23, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addComponent(labelFecha3, javax.swing.GroupLayout.PREFERRED_SIZE, 23, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addComponent(labelFecha5, javax.swing.GroupLayout.PREFERRED_SIZE, 23, javax.swing.GroupLayout.PREFERRED_SIZE)))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(jPanel2Layout.createSequentialGroup()
                        .addGap(0, 0, Short.MAX_VALUE)
                        .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING, false)
                            .addComponent(textDias, javax.swing.GroupLayout.DEFAULT_SIZE, 25, Short.MAX_VALUE)
                            .addComponent(textSujetoCF)
                            .addComponent(textACuenta)))
                    .addComponent(textSaldo))
                .addGap(19, 19, 19))
        );

        jPanelMostrar.setBackground(new java.awt.Color(255, 255, 255));
        jPanelMostrar.setBorder(javax.swing.BorderFactory.createEtchedBorder());
        jPanelMostrar.setLayout(new java.awt.GridLayout(3, 0));
        jScrollPane1.setViewportView(jPanelMostrar);

        tablaProductos.setModel(new javax.swing.table.DefaultTableModel(
            new Object [][] {

            },
            new String [] {
                "Id", "#", "Cant.", "Producto", "Prod Unit.(Bs)", "Imp.(Bs)", "Quitar", "Elilminar"
            }
        ) {
            boolean[] canEdit = new boolean [] {
                true, false, false, false, false, false, false, false
            };

            public boolean isCellEditable(int rowIndex, int columnIndex) {
                return canEdit [columnIndex];
            }
        });
        tablaProductos.setFillsViewportHeight(true);
        tablaProductos.setGridColor(new java.awt.Color(51, 51, 255));
        tablaProductos.addMouseListener(new java.awt.event.MouseAdapter() {
            public void mouseClicked(java.awt.event.MouseEvent evt) {
                tablaProductosMouseClicked(evt);
            }
        });
        jScrollPane2.setViewportView(tablaProductos);
        if (tablaProductos.getColumnModel().getColumnCount() > 0) {
            tablaProductos.getColumnModel().getColumn(0).setMinWidth(0);
            tablaProductos.getColumnModel().getColumn(0).setPreferredWidth(0);
            tablaProductos.getColumnModel().getColumn(0).setMaxWidth(0);
            tablaProductos.getColumnModel().getColumn(1).setMinWidth(30);
            tablaProductos.getColumnModel().getColumn(1).setPreferredWidth(30);
            tablaProductos.getColumnModel().getColumn(1).setMaxWidth(30);
            tablaProductos.getColumnModel().getColumn(2).setMinWidth(40);
            tablaProductos.getColumnModel().getColumn(2).setPreferredWidth(40);
            tablaProductos.getColumnModel().getColumn(2).setMaxWidth(40);
            tablaProductos.getColumnModel().getColumn(5).setMinWidth(60);
            tablaProductos.getColumnModel().getColumn(5).setPreferredWidth(60);
            tablaProductos.getColumnModel().getColumn(5).setMaxWidth(60);
            tablaProductos.getColumnModel().getColumn(6).setMinWidth(60);
            tablaProductos.getColumnModel().getColumn(6).setPreferredWidth(60);
            tablaProductos.getColumnModel().getColumn(6).setMaxWidth(60);
            tablaProductos.getColumnModel().getColumn(7).setMinWidth(60);
            tablaProductos.getColumnModel().getColumn(7).setPreferredWidth(60);
            tablaProductos.getColumnModel().getColumn(7).setMaxWidth(60);
        }

        jPanel3.setBackground(new java.awt.Color(227, 64, 61));

        jLabel7.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel7.setForeground(new java.awt.Color(255, 255, 255));
        jLabel7.setText("NIT CLIENTE");

        jLabel8.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel8.setForeground(new java.awt.Color(255, 255, 255));
        jLabel8.setText("RAZON SOCIAL CLIENTE");

        jPanel4.setBackground(new java.awt.Color(0, 134, 174));

        jLabel9.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel9.setForeground(new java.awt.Color(255, 255, 255));
        jLabel9.setText("PAGADO (BS)");

        textoPagado.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                textoPagadoActionPerformed(evt);
            }
        });
        textoPagado.addKeyListener(new java.awt.event.KeyAdapter() {
            public void keyReleased(java.awt.event.KeyEvent evt) {
                textoPagadoKeyReleased(evt);
            }
        });

        jLabel10.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel10.setForeground(new java.awt.Color(255, 255, 255));
        jLabel10.setText("CAMBIO (BS)");

        textoCambio.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                textoCambioActionPerformed(evt);
            }
        });
        textoCambio.addKeyListener(new java.awt.event.KeyAdapter() {
            public void keyReleased(java.awt.event.KeyEvent evt) {
                textoCambioKeyReleased(evt);
            }
        });

        btnGuardar.setBackground(new java.awt.Color(51, 146, 209));
        btnGuardar.setText("Guardar");
        btnGuardar.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                btnGuardarActionPerformed(evt);
            }
        });

        javax.swing.GroupLayout jPanel4Layout = new javax.swing.GroupLayout(jPanel4);
        jPanel4.setLayout(jPanel4Layout);
        jPanel4Layout.setHorizontalGroup(
            jPanel4Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, jPanel4Layout.createSequentialGroup()
                .addGap(25, 25, 25)
                .addGroup(jPanel4Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING, false)
                    .addComponent(textoPagado)
                    .addComponent(jLabel9, javax.swing.GroupLayout.DEFAULT_SIZE, 90, Short.MAX_VALUE))
                .addGap(18, 18, 18)
                .addGroup(jPanel4Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING, false)
                    .addComponent(jLabel10, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                    .addComponent(textoCambio, javax.swing.GroupLayout.PREFERRED_SIZE, 87, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addGap(18, 18, 18)
                .addComponent(btnGuardar, javax.swing.GroupLayout.PREFERRED_SIZE, 83, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addContainerGap(32, Short.MAX_VALUE))
        );
        jPanel4Layout.setVerticalGroup(
            jPanel4Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, jPanel4Layout.createSequentialGroup()
                .addContainerGap()
                .addGroup(jPanel4Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING)
                    .addComponent(btnGuardar, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                    .addGroup(javax.swing.GroupLayout.Alignment.LEADING, jPanel4Layout.createSequentialGroup()
                        .addGroup(jPanel4Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                            .addComponent(jLabel9, javax.swing.GroupLayout.PREFERRED_SIZE, 26, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addComponent(jLabel10, javax.swing.GroupLayout.PREFERRED_SIZE, 26, javax.swing.GroupLayout.PREFERRED_SIZE))
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                        .addGroup(jPanel4Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                            .addComponent(textoPagado, javax.swing.GroupLayout.PREFERRED_SIZE, 28, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addComponent(textoCambio, javax.swing.GroupLayout.PREFERRED_SIZE, 28, javax.swing.GroupLayout.PREFERRED_SIZE))
                        .addGap(0, 0, Short.MAX_VALUE)))
                .addContainerGap())
        );

        jLabel11.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel11.setForeground(new java.awt.Color(255, 255, 255));
        jLabel11.setText("BÚSQUEDA");

        txtFiltro.addKeyListener(new java.awt.event.KeyAdapter() {
            public void keyReleased(java.awt.event.KeyEvent evt) {
                txtFiltroKeyReleased(evt);
            }
            public void keyTyped(java.awt.event.KeyEvent evt) {
                txtFiltroKeyTyped(evt);
            }
        });

        btnCerrar.setBackground(new java.awt.Color(51, 146, 209));
        btnCerrar.setText("Cerrar");
        btnCerrar.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                btnCerrarActionPerformed(evt);
            }
        });

        javax.swing.GroupLayout jPanel3Layout = new javax.swing.GroupLayout(jPanel3);
        jPanel3.setLayout(jPanel3Layout);
        jPanel3Layout.setHorizontalGroup(
            jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel3Layout.createSequentialGroup()
                .addGap(18, 18, 18)
                .addGroup(jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING, false)
                    .addComponent(jLabel7, javax.swing.GroupLayout.DEFAULT_SIZE, 121, Short.MAX_VALUE)
                    .addComponent(txtNitCliente))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING, false)
                    .addComponent(txtRazonSocial)
                    .addComponent(jLabel8, javax.swing.GroupLayout.DEFAULT_SIZE, 153, Short.MAX_VALUE))
                .addGap(51, 51, 51)
                .addComponent(jPanel4, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(28, 28, 28)
                .addComponent(btnCerrar, javax.swing.GroupLayout.PREFERRED_SIZE, 83, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(27, 27, 27)
                .addGroup(jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING, false)
                    .addComponent(txtFiltro)
                    .addComponent(jLabel11, javax.swing.GroupLayout.PREFERRED_SIZE, 153, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );
        jPanel3Layout.setVerticalGroup(
            jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addComponent(jPanel4, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
            .addGroup(jPanel3Layout.createSequentialGroup()
                .addContainerGap()
                .addGroup(jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(btnCerrar, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                    .addGroup(jPanel3Layout.createSequentialGroup()
                        .addGroup(jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addGroup(jPanel3Layout.createSequentialGroup()
                                .addGroup(jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                                    .addComponent(jLabel7, javax.swing.GroupLayout.PREFERRED_SIZE, 26, javax.swing.GroupLayout.PREFERRED_SIZE)
                                    .addComponent(jLabel8, javax.swing.GroupLayout.PREFERRED_SIZE, 26, javax.swing.GroupLayout.PREFERRED_SIZE))
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                .addGroup(jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING, false)
                                    .addComponent(txtNitCliente, javax.swing.GroupLayout.DEFAULT_SIZE, 29, Short.MAX_VALUE)
                                    .addComponent(txtRazonSocial)))
                            .addGroup(jPanel3Layout.createSequentialGroup()
                                .addComponent(jLabel11, javax.swing.GroupLayout.PREFERRED_SIZE, 26, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                .addComponent(txtFiltro, javax.swing.GroupLayout.PREFERRED_SIZE, 30, javax.swing.GroupLayout.PREFERRED_SIZE)))
                        .addGap(0, 16, Short.MAX_VALUE)))
                .addContainerGap())
        );

        jLabel1.setText("Total :");

        javax.swing.GroupLayout jPanel1Layout = new javax.swing.GroupLayout(jPanel1);
        jPanel1.setLayout(jPanel1Layout);
        jPanel1Layout.setHorizontalGroup(
            jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addComponent(jPanel2, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, jPanel1Layout.createSequentialGroup()
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(jPanel1Layout.createSequentialGroup()
                        .addGap(27, 27, 27)
                        .addComponent(jScrollPane2, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                    .addGroup(jPanel1Layout.createSequentialGroup()
                        .addGap(244, 244, 244)
                        .addComponent(jLabel1, javax.swing.GroupLayout.PREFERRED_SIZE, 41, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addGap(18, 18, 18)
                        .addComponent(textTotal, javax.swing.GroupLayout.PREFERRED_SIZE, 57, javax.swing.GroupLayout.PREFERRED_SIZE)))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                .addComponent(jScrollPane1, javax.swing.GroupLayout.PREFERRED_SIZE, 736, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(58, 58, 58))
            .addComponent(jPanel3, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
        );
        jPanel1Layout.setVerticalGroup(
            jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel1Layout.createSequentialGroup()
                .addComponent(jPanel2, javax.swing.GroupLayout.PREFERRED_SIZE, 137, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jPanel3, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(jPanel1Layout.createSequentialGroup()
                        .addGap(18, 18, 18)
                        .addComponent(jScrollPane1, javax.swing.GroupLayout.DEFAULT_SIZE, 376, Short.MAX_VALUE)
                        .addGap(44, 44, 44))
                    .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, jPanel1Layout.createSequentialGroup()
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                        .addComponent(jScrollPane2, javax.swing.GroupLayout.PREFERRED_SIZE, 175, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                            .addComponent(jLabel1)
                            .addComponent(textTotal, javax.swing.GroupLayout.PREFERRED_SIZE, 14, javax.swing.GroupLayout.PREFERRED_SIZE))
                        .addGap(59, 59, 59))))
        );

        javax.swing.GroupLayout layout = new javax.swing.GroupLayout(getContentPane());
        getContentPane().setLayout(layout);
        layout.setHorizontalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(layout.createSequentialGroup()
                .addComponent(jPanel1, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(0, 0, Short.MAX_VALUE))
        );
        layout.setVerticalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addComponent(jPanel1, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
        );

        pack();
    }// </editor-fold>//GEN-END:initComponents

    private void comboSucursalActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_comboSucursalActionPerformed
         String nombreSucursal = (String) comboSucursal.getSelectedItem();
        comboAlmacen.removeAllItems();
        comboAlmacen.addItem("Seleccionar...");
        for (int i = 0; i < db.SeleccionarAlmacen(nombreSucursal,this.id_empresa).size(); i++) {
            comboAlmacen.addItem(db.SeleccionarAlmacen(nombreSucursal,this.id_empresa).get(i).getNombre());
        }
        
        int idSucursal = obtenerIdSucursal(nombreSucursal, this.id_empresa);
        obtenerSucursalActividad(idSucursal);
        
    }//GEN-LAST:event_comboSucursalActionPerformed

    private void comboAlmacenActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_comboAlmacenActionPerformed
  
    }//GEN-LAST:event_comboAlmacenActionPerformed

    private void tablaProductosMouseClicked(java.awt.event.MouseEvent evt) {//GEN-FIRST:event_tablaProductosMouseClicked
        int columna = tablaProductos.getColumnModel().getColumnIndexAtX(evt.getX());
        int fila = evt.getY() / tablaProductos.getRowHeight();
        String idProducto;
        boolean existe = false;

        if (fila < tablaProductos.getRowCount() && fila >= 0 && columna < tablaProductos.getColumnCount() && columna >= 0) {
            Object value = tablaProductos.getValueAt(fila, columna);

            if (value instanceof JButton) {
                ((JButton) value).doClick();
                JButton botonAccion = (JButton) value;

                if (botonAccion.getName().equals("quitar")) {
                    double imp ;
                    int id = Integer.parseInt(String.valueOf(tablaProductos.getValueAt(fila, 0)));
                    int cantidad = Integer.parseInt(String.valueOf(tablaProductos.getValueAt(fila, 2)));
                    double precioUnit = Double.parseDouble(String.valueOf(tablaProductos.getValueAt(fila, 4)));
          
                    cantidad = cantidad - 1; 
                    if (cantidad < 1) {
                        JOptionPane.showMessageDialog(null, "No puede tener cantidad menor a 1");
                    }else{
                        tablaProductos.setValueAt(cantidad, fila, 2);
                        imp = precioUnit * cantidad;
                        tablaProductos.setValueAt(imp, fila, 5);
                        
                        /*for (int i = 0; i < listaProdSelected.size(); i++) {
                            if (id == listaProdSelected.get(i).getId()) {
                                listaProdSelected.get(i).setCant(cantidad);
                                listaProdSelected.get(i).setImp(imp);
                            }
                        }*/
                    } 
                    calcularTotal();
                }
                if (botonAccion.getName().equals("eliminar")) {
                    int id = Integer.parseInt(String.valueOf(tablaProductos.getValueAt(fila, 0)));
                    modalProductos.removeRow(fila);
                    
                    for (int i = 0; i < listaProdSelected.size(); i++) {
                        if (id == listaProdSelected.get(i).getId()) {
                            listaProdSelected.remove(i);
                        }
                    }
                    int Numeral = 1;
                    for (int i = 0; i < tablaProductos.getRowCount(); i++) {
                        tablaProductos.setValueAt(Numeral, i, 1);
                        Numeral++;
                    }
                    calcularTotal();
                }
            }
        }
    }//GEN-LAST:event_tablaProductosMouseClicked

    private void comboMovimientoKeyPressed(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_comboMovimientoKeyPressed
       
    }//GEN-LAST:event_comboMovimientoKeyPressed

    private void comboMovimientoActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_comboMovimientoActionPerformed
        String nombre_movimiento = (String)comboMovimiento.getSelectedItem();
        
        if (nombre_movimiento.equals("FACTURACIÓN")) {
            tipoMovimiento1();          
        }else if (nombre_movimiento.equals("BAJA")) {
            tipoMovimiento2();
        }else if (nombre_movimiento.equals("PROFORMA")) {
            tipoMovimiento3();
        }else if (nombre_movimiento.equals("TRASPASO")) {
            tipoMovimiento2();
        }else if (nombre_movimiento.equals("AJUSTE")) {
            tipoMovimiento2();
        }
    }//GEN-LAST:event_comboMovimientoActionPerformed

    private void comboActividadActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_comboActividadActionPerformed
        // TODO add your handling code here:
    }//GEN-LAST:event_comboActividadActionPerformed

    private void btnMostrarActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_btnMostrarActionPerformed
        String almacen = (String) comboAlmacen.getSelectedItem();
        int idAlmacen = obtenerIdAlmacen(almacen);
        
        jPanelMostrar.removeAll();
        jPanelMostrar.updateUI();
        jPanelMostrar.repaint();
        SeleccionarProductosPanelSinInternet(idAlmacen,true);
    }//GEN-LAST:event_btnMostrarActionPerformed

    private void btnCerrarActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_btnCerrarActionPerformed
        dispose();
    }//GEN-LAST:event_btnCerrarActionPerformed

    private void comboTipoPagoActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_comboTipoPagoActionPerformed
        String tipoPago = (String)comboTipoPago.getSelectedItem();
        System.out.println(tipoPago);
        if (tipoPago == "CREDITO") {
           textDias.setEditable(true);
           textSujetoCF.setEditable(true);
           textACuenta.setEditable(true);
           textSaldo.setEditable(true);

        }else if(tipoPago == "CONTADO"){
            textDias.setEditable(false);
            textSujetoCF.setEditable(false);
            textACuenta.setEditable(false);
            textSaldo.setEditable(false);

        }
    }//GEN-LAST:event_comboTipoPagoActionPerformed

    private void textoCambioKeyReleased(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_textoCambioKeyReleased

    }//GEN-LAST:event_textoCambioKeyReleased

    private void textoPagadoKeyReleased(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_textoPagadoKeyReleased
        DecimalFormat df = new DecimalFormat("#.00");

        String pagado = textoPagado.getText();
        double total = 0;
        double sumTotal = 0;
        for (int i = 0; i < tablaProductos.getRowCount(); i++) {
            total = Double.parseDouble(String.valueOf(tablaProductos.getValueAt(i, 5)));
            sumTotal = sumTotal + total;
            
        }
        String cambio = df.format(Double.parseDouble(pagado) - sumTotal);
        System.out.println(cambio);
        
        if (pagado.equals(" ")) {
             textoCambio.setText("");
             
        }else{
            if(cambio.equals(",00")){
                textoCambio.setText("0");
                
            }else if(!cambio.equals(",00")){
               textoCambio.setText(cambio);               
            }
        }

    
    }//GEN-LAST:event_textoPagadoKeyReleased

    private void btnGuardarActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_btnGuardarActionPerformed
        // TODO add your handling code here:
        String sucursal = (String)comboSucursal.getSelectedItem();
        String almacen = (String)comboAlmacen.getSelectedItem();
        if (getConnectionStatus() == true) {

            if (!combofecha.toString().isEmpty()) {
                if ((!txtNitCliente.getText().equals(""))&&(!txtRazonSocial.getText().equals(""))) {
                    if (!sucursal.equals("Seleccionar ...") && !almacen.equals("Seleccionar ...")) {
                        if (tablaProductos.getRowCount() != 0) {
                            venderConInternet();
                            
                        }else{
                            JOptionPane.showMessageDialog(null, "Ingrese productos"); 
                        } 
                    }else{
                         JOptionPane.showMessageDialog(null, "Ingrese la Sucursal y el Almacen"); 
                    }     
                }else{
                   JOptionPane.showMessageDialog(null, "Ingrese Nit o la Razon Social"); 
                }
            }else{
                JOptionPane.showMessageDialog(null, "Ingrese la fecha");
            }
        }else{
            
            if (!combofecha.toString().isEmpty()) {
                if ((!txtNitCliente.getText().equals(""))&&(!txtRazonSocial.getText().equals(""))) {
                    if (!sucursal.equals("Seleccionar ...") && !almacen.equals("Seleccionar ...")) {
                        if (tablaProductos.getRowCount() != 0) {
                            venderSinInternet();
                            
                        }else{
                            JOptionPane.showMessageDialog(null, "Ingrese productos"); 
                        } 
                    }else{
                         JOptionPane.showMessageDialog(null, "Ingrese la Sucursal y el Almacen"); 
                    }     
                }else{
                   JOptionPane.showMessageDialog(null, "Ingrese Nit o la Razon Social"); 
                }
            }else{
                JOptionPane.showMessageDialog(null, "Ingrese la fecha");
            }
        }
    }//GEN-LAST:event_btnGuardarActionPerformed

    private void textoPagadoActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_textoPagadoActionPerformed
        // TODO add your handling code here:
    }//GEN-LAST:event_textoPagadoActionPerformed

    private void textoCambioActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_textoCambioActionPerformed
        // TODO add your handling code here:
    }//GEN-LAST:event_textoCambioActionPerformed

    private void textACuentaKeyReleased(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_textACuentaKeyReleased
        
        if (textACuenta.getText().equals("")) {
            textACuenta.setText("");
            textSaldo.setText("");
        }else{
            double total = Double.parseDouble(textTotal.getText());
            double aCuenta = Double.parseDouble(textACuenta.getText());
            double saldo = total-aCuenta;
            textSaldo.setText(Double.toString(saldo));
            
        }
    }//GEN-LAST:event_textACuentaKeyReleased

    private void txtFiltroKeyTyped(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_txtFiltroKeyTyped

    }//GEN-LAST:event_txtFiltroKeyTyped

    private void txtFiltroKeyReleased(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_txtFiltroKeyReleased
         if (txtFiltro.getText().equals("")) {
            jPanelMostrar.removeAll();

            String almacen = (String) comboAlmacen.getSelectedItem();
            int idAlmacen = obtenerIdAlmacen(almacen);
            SeleccionarProductosPanelSinInternet(idAlmacen,true);

        } else {
            FiltrarNombre(txtFiltro.getText().trim());
        }
    }//GEN-LAST:event_txtFiltroKeyReleased

    public void tipoMovimiento1(){
        labelFecha.setVisible(true);
        combofecha.setVisible(true);
        labelActividad.setVisible(true);
        comboActividad.setVisible(true);
        labelMovimiento.setVisible(true);
        comboMovimiento.setVisible(true);
        labelSucursal.setVisible(true);
        comboSucursal.setVisible(true);
        labelAlmacen.setVisible(true);
        comboAlmacen.setVisible(true);
        labelTipoPago.setVisible(true);
        comboTipoPago.setVisible(true);
    }
    
    public void tipoMovimiento2(){
        labelFecha.setVisible(false);
        combofecha.setVisible(false);
        labelActividad.setVisible(false);
        comboActividad.setVisible(false);
        labelMovimiento.setVisible(true);
        comboMovimiento.setVisible(true);
        labelSucursal.setVisible(true);
        comboSucursal.setVisible(true);
        labelAlmacen.setVisible(true);
        comboAlmacen.setVisible(true);
        labelTipoPago.setVisible(false);
        comboTipoPago.setVisible(false);
    }
    
    public void tipoMovimiento3(){
        labelFecha.setVisible(true);
        combofecha.setVisible(true);
        labelActividad.setVisible(false);
        comboActividad.setVisible(false);
        labelMovimiento.setVisible(true);
        comboMovimiento.setVisible(true);
        labelSucursal.setVisible(true);
        comboSucursal.setVisible(true);
        labelAlmacen.setVisible(true);
        comboAlmacen.setVisible(true);
        labelTipoPago.setVisible(true);
        comboTipoPago.setVisible(true);
    }
    
    /**
     * @param args the command line arguments
     */
    public static void main(String args[]) {
        /* Set the Nimbus look and feel */
        //<editor-fold defaultstate="collapsed" desc=" Look and feel setting code (optional) ">
        /* If Nimbus (introduced in Java SE 6) is not available, stay with the default look and feel.
         * For details see http://download.oracle.com/javase/tutorial/uiswing/lookandfeel/plaf.html 
         */
        try {
            for (javax.swing.UIManager.LookAndFeelInfo info : javax.swing.UIManager.getInstalledLookAndFeels()) {
                if ("Nimbus".equals(info.getName())) {
                    javax.swing.UIManager.setLookAndFeel(info.getClassName());
                    break;
                }
            }
        } catch (ClassNotFoundException ex) {
            java.util.logging.Logger.getLogger(VentasUI.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (InstantiationException ex) {
            java.util.logging.Logger.getLogger(VentasUI.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (IllegalAccessException ex) {
            java.util.logging.Logger.getLogger(VentasUI.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (javax.swing.UnsupportedLookAndFeelException ex) {
            java.util.logging.Logger.getLogger(VentasUI.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        }
        //</editor-fold>

        /* Create and display the form */
        /*java.awt.EventQueue.invokeLater(new Runnable() {
            public void run() {
                new VentasUI().setVisible(true);
            }
        });*/
    }

    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JButton btnCerrar;
    private javax.swing.JButton btnGuardar;
    private javax.swing.JButton btnMostrar;
    private javax.swing.JComboBox<String> comboActividad;
    private javax.swing.JComboBox<String> comboAlmacen;
    private javax.swing.JComboBox<String> comboMovimiento;
    private javax.swing.JComboBox<String> comboSucursal;
    private javax.swing.JComboBox<String> comboTipoPago;
    private com.toedter.calendar.JDateChooser combofecha;
    private javax.swing.JLabel jLabel1;
    private javax.swing.JLabel jLabel10;
    private javax.swing.JLabel jLabel11;
    private javax.swing.JLabel jLabel7;
    private javax.swing.JLabel jLabel8;
    private javax.swing.JLabel jLabel9;
    private javax.swing.JPanel jPanel1;
    private javax.swing.JPanel jPanel2;
    private javax.swing.JPanel jPanel3;
    private javax.swing.JPanel jPanel4;
    private javax.swing.JPanel jPanelMostrar;
    private javax.swing.JScrollPane jScrollPane1;
    private javax.swing.JScrollPane jScrollPane2;
    private javax.swing.JLabel labelActividad;
    private javax.swing.JLabel labelAlmacen;
    private javax.swing.JLabel labelFecha;
    private javax.swing.JLabel labelFecha1;
    private javax.swing.JLabel labelFecha3;
    private javax.swing.JLabel labelFecha4;
    private javax.swing.JLabel labelFecha5;
    private javax.swing.JLabel labelMovimiento;
    private javax.swing.JLabel labelSucursal;
    private javax.swing.JLabel labelTipoPago;
    private javax.swing.JTable tablaProductos;
    private javax.swing.JTextField textACuenta;
    private javax.swing.JTextField textDias;
    private javax.swing.JTextField textSaldo;
    private javax.swing.JTextField textSujetoCF;
    private javax.swing.JLabel textTotal;
    private javax.swing.JTextField textoCambio;
    private javax.swing.JTextField textoPagado;
    private javax.swing.JTextField txtFiltro;
    private javax.swing.JTextField txtNitCliente;
    private javax.swing.JTextField txtRazonSocial;
    // End of variables declaration//GEN-END:variables

    //@Override
    public void actionPerformed(ActionEvent e ) {
       boton = (JButtonProducto) e.getSource();
       int cantidad  = boton.getCantidad();
       
        if(cantidad > 0){
            int id = boton.getId();
            String nombre = boton.getNombre();
            double precioUnitario = boton.getPrecio_unitario();
                if (tablaProductos.getRowCount() == 0) {
                    ingresarProducto(id,nombre,precioUnitario,cantidad);
                }else if (tablaProductos.getRowCount() != 0) {

                    if (existeProducto(id) == true) {
                        //incrementamos la cantidad y calculamos el imp
                        incrementarCantidad(id,cantidad);
                    }else{
                        //el producto se ingresa
                        ingresarProducto(id,nombre,precioUnitario,cantidad);
                    }
                }

        }else{
            JOptionPane.showMessageDialog(null, "Este producto no tiene cantidad");
        }
    }
}
