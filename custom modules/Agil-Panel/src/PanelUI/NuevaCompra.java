/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package PanelUI;

import java.awt.Color;
import java.awt.EventQueue;
import java.awt.event.KeyEvent;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.swing.Icon;
import javax.swing.ImageIcon;
import javax.swing.JButton;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JTable;
import javax.swing.SwingConstants;
import javax.swing.table.DefaultTableCellRenderer;
import javax.swing.table.DefaultTableModel;
import javax.swing.table.TableCellRenderer;
import models.Database;
import models.RenderTable;
import org.jdesktop.swingx.autocomplete.AutoCompleteDecorator;

/**
 *
 * @author AGIL
 */
public class NuevaCompra extends javax.swing.JDialog {
    public int id_usuario;
    public Database db = new Database();
    public ArrayList producto = new ArrayList();
    public ArrayList razonSocial = new ArrayList();
    
    Date date = new Date();
    public int contVerif = 0;
    DefaultTableModel modeloTabla ;
    
    JButton editar;
    ImageIcon imgEditar;
    Icon iconEditar;
    
    JButton eliminar;
    ImageIcon imgEliminar;
    Icon iconEliminar;
    public int num = 1;
    /**
     * Creates new form NuevaCompra
     */
    public NuevaCompra(java.awt.Frame parent, boolean modal,int id_usuario) {
        super(parent,modal);
        initComponents();
        setTitle("Nuevo Producto");
        setLocationRelativeTo(this);
        this.id_usuario = id_usuario;
        
        modeloTabla = (DefaultTableModel) tablaProductosA.getModel();
        tablaProductosA.setDefaultRenderer(Object.class, new RenderTable());
        
        tablaProductosA.getTableHeader().setPreferredSize(new java.awt.Dimension(0, 33));
        tablaProductosA.getTableHeader().setBackground(Color.cyan);
        tablaProductosA.getTableHeader().setForeground(Color.blue);
        tablaProductosA.setRowHeight(33);


        comboCentroCosto.setEnabled(false);
        textoProducto.setEnabled(false);
        jfecha.setDate(date);
        
        obtenerCentroCostos();     
        AutoCompleteDecorator.decorate(comboCentroCosto);
        textoNuevoCCO.setVisible(false);
        PanelCredito.setVisible(false);
        PanelDescuGenerales.setVisible(false);
        panelExcedentes.setVisible(false);
        panelFecha.setEnabled(false);
        textoLote.setEnabled(false);
        textoCU.setEnabled(false);
        textoCantidad.setEnabled(false);
        
//        labelDGImp.setVisible(false);
//        labelImp.setVisible(false);
//        labelSujeto.setVisible(false);
        
        requerido1.setVisible(false);
        requerido2.setVisible(false);
        requerido3.setVisible(false);
        requerido4.setVisible(false);
        requerido5.setVisible(false);
        requerido6.setVisible(false);
        
        obtenerRazonSocial();
        obtenerProducto();       
        obtenerSucursal();
        
        tamañoTabla();
        alinearTextoTabla();
        centrar_datos();
        insertarBotones();
    }
    
    public void insertarBotones(){
        tablaProductosA.setDefaultRenderer(Object.class, new RenderTable());
        String editaImg = "/imagen/editar.png";
        imgEditar = new ImageIcon(this.getClass().getResource(editaImg));
        iconEditar = new ImageIcon(imgEditar.getImage().getScaledInstance(20, 20, 1));
        editar = new JButton(iconEditar);
        editar.setName("editar");
        
        String eliminarImg = "/imagen/eliminar.png";
        imgEliminar = new ImageIcon(this.getClass().getResource(eliminarImg));
        iconEliminar = new ImageIcon(imgEliminar.getImage().getScaledInstance(20, 20, 1));
        eliminar = new JButton(iconEliminar);
        eliminar.setName("eliminar");
    }
    
    public void alinearTextoTabla(){
        TableCellRenderer rendererFromHeader = tablaProductosA.getTableHeader().getDefaultRenderer();
        JLabel headerLabel = (JLabel) rendererFromHeader;
        headerLabel.setHorizontalAlignment(JLabel.CENTER);
    }
    
     public void centrar_datos(){  
        DefaultTableCellRenderer modelocentrar = new DefaultTableCellRenderer(); 
        modelocentrar.setHorizontalAlignment(SwingConstants.CENTER); 
        tablaProductosA.getColumnModel().getColumn(1).setCellRenderer(modelocentrar); 
        tablaProductosA.getColumnModel().getColumn(2).setCellRenderer(modelocentrar);
        tablaProductosA.getColumnModel().getColumn(3).setCellRenderer(modelocentrar);
        tablaProductosA.getColumnModel().getColumn(4).setCellRenderer(modelocentrar);
        tablaProductosA.getColumnModel().getColumn(5).setCellRenderer(modelocentrar);
        tablaProductosA.getColumnModel().getColumn(6).setCellRenderer(modelocentrar);
        tablaProductosA.getColumnModel().getColumn(7).setCellRenderer(modelocentrar);
        tablaProductosA.getColumnModel().getColumn(8).setCellRenderer(modelocentrar);
        tablaProductosA.getColumnModel().getColumn(9).setCellRenderer(modelocentrar);
        tablaProductosA.getColumnModel().getColumn(10).setCellRenderer(modelocentrar);
        tablaProductosA.getColumnModel().getColumn(11).setCellRenderer(modelocentrar);
        tablaProductosA.getColumnModel().getColumn(12).setCellRenderer(modelocentrar);

    } 
     
    public void tamañoTabla() {
        tablaProductosA.getColumnModel().getColumn(8).setMaxWidth(0);
        tablaProductosA.getColumnModel().getColumn(8).setMinWidth(0);
        tablaProductosA.getColumnModel().getColumn(8).setPreferredWidth(0);
        
        tablaProductosA.getColumnModel().getColumn(9).setMaxWidth(0);
        tablaProductosA.getColumnModel().getColumn(9).setMinWidth(0);
        tablaProductosA.getColumnModel().getColumn(9).setPreferredWidth(0);
        
        tablaProductosA.getColumnModel().getColumn(11).setMaxWidth(00);
        tablaProductosA.getColumnModel().getColumn(11).setMinWidth(0);
        tablaProductosA.getColumnModel().getColumn(11).setPreferredWidth(0);
        
//        tablaProductosA.getColumnModel().getColumn(12).setMaxWidth(0);
//        tablaProductosA.getColumnModel().getColumn(12).setMinWidth(0);
//        tablaProductosA.getColumnModel().getColumn(12).setPreferredWidth(0);
    }
    
    public void tamañoTablaDescuentos(){
        tablaProductosA.getColumnModel().getColumn(8).setMaxWidth(70);
        tablaProductosA.getColumnModel().getColumn(8).setMinWidth(70);
        tablaProductosA.getColumnModel().getColumn(8).setPreferredWidth(70);
        
        tablaProductosA.getColumnModel().getColumn(9).setMaxWidth(70);
        tablaProductosA.getColumnModel().getColumn(9).setMinWidth(70);
        tablaProductosA.getColumnModel().getColumn(9).setPreferredWidth(70);
        
        tablaProductosA.getColumnModel().getColumn(10).setMaxWidth(70);
        tablaProductosA.getColumnModel().getColumn(10).setMinWidth(70);
        tablaProductosA.getColumnModel().getColumn(10).setPreferredWidth(70);
        
        tablaProductosA.getColumnModel().getColumn(11).setMaxWidth(70);
        tablaProductosA.getColumnModel().getColumn(11).setMinWidth(70);
        tablaProductosA.getColumnModel().getColumn(11).setPreferredWidth(70);
    }
    
    public void obtenerRazonSocial(){
        ResultSet rs = null;
        String consulta = "SELECT P.RAZON_SOCIAL \n" +
            "FROM PROVEEDOR AS P\n" +
            "INNER JOIN USUARIO AS U ON U.EMPRESA = P.EMPRESA\n" +
            "WHERE U.ID = "+this.id_usuario+" AND U.ELIMINADO = "+false;
        try {
            rs = db.seleccionar(consulta);
            while (rs.next()) {                
                razonSocial.add(rs.getString(1));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }finally{
            try {
                rs.close();
                db.Conectar().close();
            } catch (SQLException ex) {
                Logger.getLogger(NuevaCompra.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }
    
    public void obtenerSucursal(){
        ResultSet rs = null;
        String consulta = "SELECT S.NOMBRE \n" +
            "FROM USUARIO AS U\n" +
            "INNER JOIN SUCURSAL AS S ON S.EMPRESA = U.EMPRESA\n" +
            "WHERE U.ID = "+this.id_usuario+" AND U.ELIMINADO = "+false+" AND S.ELIMINADO = "+false;
        try {
            rs = db.seleccionar(consulta);
            while (rs.next()) {                
                comboSucursal.addItem(rs.getString(1));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }finally{
            try {
                rs.close();
                db.Conectar().close();
            } catch (SQLException ex) {
                Logger.getLogger(NuevoInventario.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }
    
    public void obtenerCentroCostos(){
        ResultSet rs = null;
        int idEmpresa = obtenerIdEmpresa();
        boolean habilitado = true;
        String consulta = "SELECT C.NOMBRE \n" +
            "FROM CLASE AS C\n" +
            "INNER JOIN TIPO AS T ON T.ID = C.ID_TIPO\n" +
            "WHERE T.NOMBRE = 'CENTROS DE COSTO' AND T.ID_EMPRESA = "+idEmpresa+" AND C.HABILITADO = "+habilitado;
        try {
            rs = db.seleccionar(consulta);
            while (rs.next()) {                
                comboCentroCosto.addItem(rs.getString(1));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }finally{
            try {
                rs.close();
                db.Conectar().close();
            } catch (Exception e) {
                e.getMessage();
            }
        }
    }
    
    public void obtenerProducto(){
        ResultSet rs = null;
        String consulta = "SELECT P.NOMBRE \n" +
            "FROM USUARIO AS U\n" +
            "INNER JOIN PRODUCTO AS P ON P.EMPRESA = U.EMPRESA\n" +
            "WHERE U.ID = "+this.id_usuario+" AND U.ELIMINADO = "+false+" AND P.ELIMINADO = "+false ;
        try {
            rs = db.seleccionar(consulta);
            while (rs.next()) {                
                String Nombreproducto = rs.getString(1);
                producto.add(Nombreproducto);
            }
        } catch (Exception e) {
            System.out.println("Error: "+e);
        }finally{
            try {             
                rs.close();
                db.Conectar().close();
            } catch (SQLException ex) {
                Logger.getLogger(NuevaCompra.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }
    
    public void autocompleteProducto(String txt){
        String complete = "";
        int inicio = txt.length();
        int ultimo = txt.length();
        
        for (int i = 0; i < producto.size(); i++) {
            if (producto.get(i).toString().startsWith(txt)) {
                complete = producto.get(i).toString();
                ultimo = complete.length();
                break;
            }
        }
        if (ultimo>inicio) {
            textoProducto.setText(complete);
            textoProducto.setCaretPosition(ultimo);
            textoProducto.moveCaretPosition(inicio);
        }      
    }
    
    public void autocompleteRazonSocial(String txt){
        String complete = "";
        int inicio = txt.length();
        int ultimo = txt.length();
        
        for (int i = 0; i < razonSocial.size(); i++) {
            if (razonSocial.get(i).toString().startsWith(txt)) {
                complete = razonSocial.get(i).toString();
                ultimo = complete.length();
                break;
            }
        }
        if (ultimo>inicio) {
            textoRazonSocial.setText(complete);
            textoRazonSocial.setCaretPosition(ultimo);
            textoRazonSocial.moveCaretPosition(inicio);
        }      
    }
    
    public void obtenerUnidProducto(){
        ResultSet rs = null;
        String nomProducto = textoProducto.getText();
        String consulta = "SELECT UNIDAD_MEDIDA FROM PRODUCTO WHERE NOMBRE = '"+nomProducto+"'";       
        try {
            rs = db.seleccionar(consulta);
            while (rs.next()) { 
                String unidad  = rs.getString(1);
                textoUniMedida.setText(unidad);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }finally{
            try {
                rs.close();
                db.Conectar().close();
            } catch (SQLException ex) {
                Logger.getLogger(NuevaCompra.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }
    
    public int[] obtenerIdMovimiento(){
       ResultSet rs = null;
       int[] ids = new int[2];
       String consulta = "SELECT T.ID , C.ID \n" +
        "FROM TIPO AS T ,CLASE AS C\n" +
        "WHERE T.NOMBRE_CORTO = 'MOVING' AND C.ID_TIPO = T.ID AND C.NOMBRE_CORTO = 'III'";
        try {
            rs = db.seleccionar(consulta);
            while (rs.next()) {                
                ids[0] = rs.getInt(1);
                ids[1] = rs.getInt(2);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }finally{
           try {
               rs.close();
           } catch (SQLException ex) {
               Logger.getLogger(NuevoInventario.class.getName()).log(Level.SEVERE, null, ex);
           }
        }
        return ids;
    }
    
    public int obtenerTipoPago(String pago){
        ResultSet rs = null;
        int id = 0;
        
        String consulta = "SELECT ID FROM CLASE WHERE NOMBRE = '"+pago+"'";
        try {
            rs = db.seleccionar(consulta);
            while (rs.next()) {                
                id = rs.getInt(1);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }finally{
            try {
                rs.close();
                db.Conectar().close();
            } catch (SQLException ex) {
                Logger.getLogger(NuevaCompra.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
        return id;
    }
    
    public int obtenerIdSucursal(String sucursal){
        int id = 0;
        ResultSet rs = null;      
        String consulta = "SELECT ID\n" +
            "FROM SUCURSAL \n" +
            "WHERE NOMBRE = '"+sucursal+"'";
        try {
            rs = db.seleccionar(consulta);
            while (rs.next()) {                
                id = rs.getInt(1);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }finally{
            try {
                rs.close();
                db.Conectar().close();
            } catch (SQLException ex) {
                Logger.getLogger(NuevoInventario.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
        return id;
    }
    
    public int obtenerIdAlmacen(String almacen){
        ResultSet rs = null;
        String sucursal = (String)comboSucursal.getSelectedItem();
        int idSucursal = obtenerIdSucursal(sucursal);
        
        int id = 0;
        String consulta = "SELECT ID\n" +
            "FROM ALMACEN\n" +
            "WHERE SUCURSAL = "+idSucursal+" AND NOMBRE = '"+almacen+"' ";
        try {
            rs = db.seleccionar(consulta);
            while (rs.next()) {                
                id = rs.getInt(1);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }finally{
            try {
                rs.close();
                db.Conectar().close();
            } catch (SQLException ex) {
                Logger.getLogger(NuevoInventario.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
        return id;
    }
    
    public int obtenerIdEmpresa(){
        ResultSet rs = null;      
        int id = 0;
        String consulta = "SELECT EMPRESA FROM USUARIO WHERE ID = "+this.id_usuario;
        try {
            rs = db.seleccionar(consulta);
            while (rs.next()) {                
                id = rs.getInt(1);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }finally{
            try {
                rs.close();
                db.Conectar().close();
            } catch (SQLException ex) {
                Logger.getLogger(NuevoInventario.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
        return id;
    }
    
    public int obtenerIdProveedor(String proveedor){
        ResultSet rs = null;      
        int id = 0;
        String consulta = "SELECT P.ID \n" +
            "FROM PROVEEDOR AS P\n" +
            "INNER JOIN USUARIO AS U ON U.EMPRESA = P.EMPRESA\n" +
            "WHERE U.ID = "+this.id_usuario+" AND P.RAZON_SOCIAL = '"+proveedor+"'";
        try {
            rs = db.seleccionar(consulta);
            while (rs.next()) {                
                id = rs.getInt(1);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }finally{
            try {
                rs.close();
                db.Conectar().close();
            } catch (SQLException ex) {
                Logger.getLogger(NuevoInventario.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
        return id;
    }
    
    public String obtenerCodigoProducto(String producto){
         ResultSet rs = null;      
        String codigo = "";
        String consulta = "SELECT CODIGO FROM PRODUCTO WHERE NOMBRE = '"+producto+"'";
        try {
            rs = db.seleccionar(consulta);
            while (rs.next()) {                
                codigo = rs.getString(1);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }finally{
            try {
                rs.close();
                db.Conectar().close();
            } catch (SQLException ex) {
                Logger.getLogger(NuevoInventario.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
        return codigo;
    }
    
    public void verificar(){
        contVerif = 0;
        if (textoNit.getText().equals("")) {requerido1.setVisible(true);contVerif++;}else{requerido1.setVisible(false);}
        if (textoRazonSocial.getText().equals("")) {requerido2.setVisible(true);contVerif++;}else{requerido2.setVisible(false);}
        if (textoFactura.getText().equals("")) {requerido3.setVisible(true);contVerif++;}else{requerido3.setVisible(false);}
        if (textoAutorizacion.getText().equals("")) { requerido4.setVisible(true);contVerif++;}else{requerido4.setVisible(false);}
        try {
            if (this.jfecha.getDate().toString().isEmpty()) {requerido5.setVisible(true); contVerif++;}
        } catch (Exception e) {
            requerido5.setVisible(false);
        }
        if (textoCodControl.getText().equals("")) {requerido6.setVisible(true); contVerif++;}else{requerido6.setVisible(false);}

    }
    
    public int obtenerIdTipo(){
        ResultSet rs = null;  
        int idEmpresa = obtenerIdEmpresa();
        int id = 0;
        String consulta = "SELECT ID\n" +
            "FROM TIPO \n" +
            "WHERE NOMBRE_CORTO = 'CCO' AND ID_EMPRESA = "+idEmpresa;
        try {
            rs = db.seleccionar(consulta);
            while (rs.next()) {                
                id = rs.getInt(1);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }finally{
            try {
                rs.close();
                db.Conectar().close();
            } catch (SQLException ex) {
                Logger.getLogger(NuevoInventario.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
        return id;
    }
    
    public boolean existeCCO(String nombre){
        boolean existe = false;
        int idEmpresa = obtenerIdEmpresa();
        String centroCostos = "SELECT C.*\n" +
            "FROM CLASE AS C\n" +
            "INNER JOIN TIPO AS T ON T.ID = C.ID_TIPO\n" +
            "WHERE C.NOMBRE = '"+nombre+"'  AND T.ID_EMPRESA = "+idEmpresa+" AND C.HABILITADO = "+true;
            if (db.existeEldato(centroCostos) == true) {
                existe = true;
            }else{
                existe = false;
            }
            return existe;
    }
    
    public int obtenerIdProducto(String producto){
        ResultSet rs = null;  
        int id = 0;
        String consulta = "SELECT P.ID \n" +
            "FROM PRODUCTO AS P \n" +
            "INNER JOIN USUARIO AS U ON U.EMPRESA = P.EMPRESA \n" +
            "WHERE U.ID = "+this.id_usuario+" AND P.NOMBRE = '"+producto+"' AND U.ELIMINADO = "+false+" AND P.ELIMINADO = "+false;
        try {
            rs = db.seleccionar(consulta);
            while (rs.next()) {                
                id = rs.getInt(1);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }finally{
            try {
                rs.close();
                db.Conectar().close();
            } catch (SQLException ex) {
                Logger.getLogger(NuevoInventario.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
        return id;
    }
    
     public int obtenerIdCCO(String producto){
        ResultSet rs = null;  
        int id = 0;
        int idEmpresa = obtenerIdEmpresa();
        String consulta = "SELECT C.ID \n" +
            "FROM TIPO AS T \n" +
            "INNER JOIN CLASE AS C ON C.ID_TIPO = T.ID\n" +
            "WHERE T.ID_EMPRESA = "+idEmpresa+" AND C.NOMBRE = '"+producto+"'";
        try {
            rs = db.seleccionar(consulta);
            while (rs.next()) {                
                id = rs.getInt(1);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }finally{
            try {
                rs.close();
                db.Conectar().close();
            } catch (SQLException ex) {
                Logger.getLogger(NuevoInventario.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
        return id;
    }
     

    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        jScrollPane1 = new javax.swing.JScrollPane();
        jPanel1 = new javax.swing.JPanel();
        jPanel2 = new javax.swing.JPanel();
        jLabel1 = new javax.swing.JLabel();
        jLabel2 = new javax.swing.JLabel();
        textoNit = new javax.swing.JTextField();
        jLabel3 = new javax.swing.JLabel();
        textoRazonSocial = new javax.swing.JTextField();
        jLabel4 = new javax.swing.JLabel();
        textoFactura = new javax.swing.JTextField();
        jLabel5 = new javax.swing.JLabel();
        textoAutorizacion = new javax.swing.JTextField();
        jLabel6 = new javax.swing.JLabel();
        jfecha = new com.toedter.calendar.JDateChooser();
        jLabel7 = new javax.swing.JLabel();
        textoCodControl = new javax.swing.JTextField();
        jLabel8 = new javax.swing.JLabel();
        comboSucursal = new javax.swing.JComboBox<>();
        jLabel9 = new javax.swing.JLabel();
        comboAlmacen = new javax.swing.JComboBox<>();
        jLabel10 = new javax.swing.JLabel();
        comboTipPago = new javax.swing.JComboBox<>();
        radioDescGene = new javax.swing.JLabel();
        radioDescGeneral = new javax.swing.JRadioButton();
        PanelCredito = new javax.swing.JPanel();
        jLabel12 = new javax.swing.JLabel();
        textoDias = new javax.swing.JTextField();
        jLabel13 = new javax.swing.JLabel();
        jTextField7 = new javax.swing.JTextField();
        jLabel14 = new javax.swing.JLabel();
        textoACuenta = new javax.swing.JTextField();
        jLabel15 = new javax.swing.JLabel();
        jTextField9 = new javax.swing.JTextField();
        PanelDescuGenerales = new javax.swing.JPanel();
        jLabel16 = new javax.swing.JLabel();
        radioDescuento = new javax.swing.JRadioButton();
        jLabel17 = new javax.swing.JLabel();
        radioRecargas = new javax.swing.JRadioButton();
        textoDescuentos = new javax.swing.JTextField();
        textoRecarga = new javax.swing.JTextField();
        jLabel18 = new javax.swing.JLabel();
        textoIce = new javax.swing.JTextField();
        jLabel19 = new javax.swing.JLabel();
        textoExcentos = new javax.swing.JTextField();
        requerido1 = new javax.swing.JLabel();
        requerido2 = new javax.swing.JLabel();
        requerido3 = new javax.swing.JLabel();
        requerido4 = new javax.swing.JLabel();
        requerido5 = new javax.swing.JLabel();
        requerido6 = new javax.swing.JLabel();
        jPanel3 = new javax.swing.JPanel();
        jLabel20 = new javax.swing.JLabel();
        jLabel21 = new javax.swing.JLabel();
        jLabel22 = new javax.swing.JLabel();
        textoProducto = new javax.swing.JTextField();
        jLabel23 = new javax.swing.JLabel();
        textoUniMedida = new javax.swing.JTextField();
        jLabel24 = new javax.swing.JLabel();
        panelFecha = new com.toedter.calendar.JDateChooser();
        jLabel25 = new javax.swing.JLabel();
        textoLote = new javax.swing.JTextField();
        jLabel26 = new javax.swing.JLabel();
        textoCU = new javax.swing.JTextField();
        jLabel27 = new javax.swing.JLabel();
        textoCantidad = new javax.swing.JTextField();
        jLabel28 = new javax.swing.JLabel();
        textImporte = new javax.swing.JTextField();
        jButton1 = new javax.swing.JButton();
        comboCentroCosto = new javax.swing.JComboBox<>();
        radioPanelDescGene = new javax.swing.JRadioButton();
        panelExcedentes = new javax.swing.JPanel();
        jLabel29 = new javax.swing.JLabel();
        rapioPanelDesc = new javax.swing.JRadioButton();
        textPanelDesc = new javax.swing.JTextField();
        jLabel30 = new javax.swing.JLabel();
        radioPanelRec = new javax.swing.JRadioButton();
        textPanelRecarga = new javax.swing.JTextField();
        jLabel31 = new javax.swing.JLabel();
        textPaneIce = new javax.swing.JTextField();
        jLabel32 = new javax.swing.JLabel();
        textPanelExc = new javax.swing.JTextField();
        textoNuevoCCO = new javax.swing.JTextField();
        radioNuevoCCO = new javax.swing.JCheckBox();
        jLabel34 = new javax.swing.JLabel();
        btnCancelar = new javax.swing.JButton();
        btnGuardar = new javax.swing.JButton();
        jScrollPane2 = new javax.swing.JScrollPane();
        tablaProductosA = new JTable(){
            public boolean isCellEditable(int rowIndex, int colIndex) {
                return colIndex != 0 && colIndex != 1 && colIndex != 2 && colIndex != 3 
                && colIndex != 4 && colIndex != 5 && colIndex != 6 && colIndex != 7
                && colIndex != 8 && colIndex != 9 && colIndex != 10 && colIndex != 11
                && colIndex != 12 && colIndex != 13 && colIndex != 14
                && colIndex != 14 && colIndex != 15;
            }
        };
        jLabel33 = new javax.swing.JLabel();
        labelImp = new javax.swing.JTextField();
        labelDGImp = new javax.swing.JTextField();
        labelSujeto = new javax.swing.JTextField();

        setDefaultCloseOperation(javax.swing.WindowConstants.DO_NOTHING_ON_CLOSE);

        jScrollPane1.setHorizontalScrollBar(null);

        jPanel1.setBackground(new java.awt.Color(255, 255, 255));
        jPanel1.setPreferredSize(new java.awt.Dimension(1248, 790));

        jPanel2.setBackground(new java.awt.Color(255, 255, 255));
        jPanel2.setBorder(javax.swing.BorderFactory.createLineBorder(new java.awt.Color(0, 0, 0)));

        jLabel1.setFont(new java.awt.Font("Arial", 1, 14)); // NOI18N
        jLabel1.setForeground(new java.awt.Color(131, 178, 219));
        jLabel1.setText("DATOS DE COMPRA");

        jLabel2.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel2.setForeground(new java.awt.Color(131, 178, 219));
        jLabel2.setText("NIT");

        textoNit.addKeyListener(new java.awt.event.KeyAdapter() {
            public void keyTyped(java.awt.event.KeyEvent evt) {
                textoNitKeyTyped(evt);
            }
        });

        jLabel3.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel3.setForeground(new java.awt.Color(131, 178, 219));
        jLabel3.setText("Razon Social");

        textoRazonSocial.addKeyListener(new java.awt.event.KeyAdapter() {
            public void keyPressed(java.awt.event.KeyEvent evt) {
                textoRazonSocialKeyPressed(evt);
            }
        });

        jLabel4.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel4.setForeground(new java.awt.Color(131, 178, 219));
        jLabel4.setText("Num. Factura");

        textoFactura.addKeyListener(new java.awt.event.KeyAdapter() {
            public void keyTyped(java.awt.event.KeyEvent evt) {
                textoFacturaKeyTyped(evt);
            }
        });

        jLabel5.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel5.setForeground(new java.awt.Color(131, 178, 219));
        jLabel5.setText("Num. Autorizacion");

        jLabel6.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel6.setForeground(new java.awt.Color(131, 178, 219));
        jLabel6.setText("Fecha");

        jLabel7.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel7.setForeground(new java.awt.Color(131, 178, 219));
        jLabel7.setText("Codigo Control");

        jLabel8.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel8.setForeground(new java.awt.Color(131, 178, 219));
        jLabel8.setText("Sucursal");

        comboSucursal.setModel(new javax.swing.DefaultComboBoxModel<>(new String[] { " " }));
        comboSucursal.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                comboSucursalActionPerformed(evt);
            }
        });

        jLabel9.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel9.setForeground(new java.awt.Color(131, 178, 219));
        jLabel9.setText("Almacen");

        comboAlmacen.setModel(new javax.swing.DefaultComboBoxModel<>(new String[] { " " }));
        comboAlmacen.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                comboAlmacenActionPerformed(evt);
            }
        });

        jLabel10.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel10.setForeground(new java.awt.Color(131, 178, 219));
        jLabel10.setText("Tipo de Pago");

        comboTipPago.setModel(new javax.swing.DefaultComboBoxModel<>(new String[] { "CONTADO", "CREDITO" }));
        comboTipPago.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                comboTipPagoActionPerformed(evt);
            }
        });

        radioDescGene.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        radioDescGene.setForeground(new java.awt.Color(131, 178, 219));
        radioDescGene.setText("<html>Descuentos<br>Generales</html>");

        radioDescGeneral.setBackground(new java.awt.Color(255, 255, 255));
        radioDescGeneral.setBorder(null);
        radioDescGeneral.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                radioDescGeneralActionPerformed(evt);
            }
        });

        PanelCredito.setBackground(new java.awt.Color(255, 255, 255));

        jLabel12.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel12.setForeground(new java.awt.Color(131, 178, 219));
        jLabel12.setText("Dias");

        textoDias.addKeyListener(new java.awt.event.KeyAdapter() {
            public void keyReleased(java.awt.event.KeyEvent evt) {
                textoDiasKeyReleased(evt);
            }
        });

        jLabel13.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel13.setForeground(new java.awt.Color(131, 178, 219));
        jLabel13.setText("Sujeto a DF");

        jTextField7.setEditable(false);
        jTextField7.addKeyListener(new java.awt.event.KeyAdapter() {
            public void keyReleased(java.awt.event.KeyEvent evt) {
                jTextField7KeyReleased(evt);
            }
        });

        jLabel14.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel14.setForeground(new java.awt.Color(131, 178, 219));
        jLabel14.setText("A Cuenta");

        textoACuenta.addKeyListener(new java.awt.event.KeyAdapter() {
            public void keyPressed(java.awt.event.KeyEvent evt) {
                textoACuentaKeyPressed(evt);
            }
            public void keyReleased(java.awt.event.KeyEvent evt) {
                textoACuentaKeyReleased(evt);
            }
        });

        jLabel15.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel15.setForeground(new java.awt.Color(131, 178, 219));
        jLabel15.setText("Saldo");

        jTextField9.setEditable(false);
        jTextField9.addKeyListener(new java.awt.event.KeyAdapter() {
            public void keyReleased(java.awt.event.KeyEvent evt) {
                jTextField9KeyReleased(evt);
            }
        });

        javax.swing.GroupLayout PanelCreditoLayout = new javax.swing.GroupLayout(PanelCredito);
        PanelCredito.setLayout(PanelCreditoLayout);
        PanelCreditoLayout.setHorizontalGroup(
            PanelCreditoLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(PanelCreditoLayout.createSequentialGroup()
                .addContainerGap()
                .addGroup(PanelCreditoLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(PanelCreditoLayout.createSequentialGroup()
                        .addComponent(jLabel12)
                        .addGap(74, 74, 74)
                        .addComponent(jLabel13))
                    .addGroup(PanelCreditoLayout.createSequentialGroup()
                        .addGroup(PanelCreditoLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addGroup(PanelCreditoLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING, false)
                                .addComponent(textoACuenta, javax.swing.GroupLayout.Alignment.LEADING, javax.swing.GroupLayout.DEFAULT_SIZE, 80, Short.MAX_VALUE)
                                .addComponent(textoDias, javax.swing.GroupLayout.Alignment.LEADING))
                            .addComponent(jLabel14))
                        .addGap(18, 18, 18)
                        .addGroup(PanelCreditoLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING, false)
                            .addComponent(jLabel15)
                            .addComponent(jTextField7, javax.swing.GroupLayout.DEFAULT_SIZE, 85, Short.MAX_VALUE)
                            .addComponent(jTextField9))))
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );
        PanelCreditoLayout.setVerticalGroup(
            PanelCreditoLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(PanelCreditoLayout.createSequentialGroup()
                .addContainerGap()
                .addGroup(PanelCreditoLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jLabel12)
                    .addComponent(jLabel13))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(PanelCreditoLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(textoDias, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(jTextField7, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(PanelCreditoLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jLabel14)
                    .addComponent(jLabel15))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(PanelCreditoLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(textoACuenta, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(jTextField9, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );

        PanelDescuGenerales.setBackground(new java.awt.Color(255, 255, 255));

        jLabel16.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel16.setForeground(new java.awt.Color(131, 178, 219));
        jLabel16.setText("Descuentos(-)");

        radioDescuento.setBackground(new java.awt.Color(255, 255, 255));
        radioDescuento.setForeground(new java.awt.Color(131, 178, 219));
        radioDescuento.setText("Bs");
        radioDescuento.setBorder(null);
        radioDescuento.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                radioDescuentoActionPerformed(evt);
            }
        });

        jLabel17.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel17.setForeground(new java.awt.Color(131, 178, 219));
        jLabel17.setText("Recargas (+)");

        radioRecargas.setBackground(new java.awt.Color(255, 255, 255));
        radioRecargas.setForeground(new java.awt.Color(131, 178, 219));
        radioRecargas.setText("Bs");
        radioRecargas.setBorder(null);
        radioRecargas.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                radioRecargasActionPerformed(evt);
            }
        });

        textoDescuentos.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                textoDescuentosActionPerformed(evt);
            }
        });
        textoDescuentos.addKeyListener(new java.awt.event.KeyAdapter() {
            public void keyReleased(java.awt.event.KeyEvent evt) {
                textoDescuentosKeyReleased(evt);
            }
        });

        textoRecarga.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                textoRecargaActionPerformed(evt);
            }
        });
        textoRecarga.addKeyListener(new java.awt.event.KeyAdapter() {
            public void keyReleased(java.awt.event.KeyEvent evt) {
                textoRecargaKeyReleased(evt);
            }
        });

        jLabel18.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel18.setForeground(new java.awt.Color(131, 178, 219));
        jLabel18.setText("Ice(-)");

        textoIce.addKeyListener(new java.awt.event.KeyAdapter() {
            public void keyReleased(java.awt.event.KeyEvent evt) {
                textoIceKeyReleased(evt);
            }
        });

        jLabel19.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel19.setForeground(new java.awt.Color(131, 178, 219));
        jLabel19.setText("Excentos(-)");

        textoExcentos.addKeyListener(new java.awt.event.KeyAdapter() {
            public void keyReleased(java.awt.event.KeyEvent evt) {
                textoExcentosKeyReleased(evt);
            }
        });

        javax.swing.GroupLayout PanelDescuGeneralesLayout = new javax.swing.GroupLayout(PanelDescuGenerales);
        PanelDescuGenerales.setLayout(PanelDescuGeneralesLayout);
        PanelDescuGeneralesLayout.setHorizontalGroup(
            PanelDescuGeneralesLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(PanelDescuGeneralesLayout.createSequentialGroup()
                .addContainerGap()
                .addGroup(PanelDescuGeneralesLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(PanelDescuGeneralesLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING, false)
                        .addComponent(textoIce, javax.swing.GroupLayout.Alignment.LEADING)
                        .addComponent(textoDescuentos)
                        .addGroup(PanelDescuGeneralesLayout.createSequentialGroup()
                            .addComponent(jLabel16)
                            .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                            .addComponent(radioDescuento)))
                    .addComponent(jLabel18, javax.swing.GroupLayout.PREFERRED_SIZE, 43, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addGap(18, 18, 18)
                .addGroup(PanelDescuGeneralesLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING, false)
                    .addGroup(PanelDescuGeneralesLayout.createSequentialGroup()
                        .addComponent(jLabel17)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                        .addComponent(radioRecargas))
                    .addComponent(jLabel19)
                    .addComponent(textoRecarga)
                    .addComponent(textoExcentos))
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );
        PanelDescuGeneralesLayout.setVerticalGroup(
            PanelDescuGeneralesLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(PanelDescuGeneralesLayout.createSequentialGroup()
                .addContainerGap()
                .addGroup(PanelDescuGeneralesLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(PanelDescuGeneralesLayout.createSequentialGroup()
                        .addGroup(PanelDescuGeneralesLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING)
                            .addComponent(radioDescuento)
                            .addComponent(jLabel16))
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                        .addGroup(PanelDescuGeneralesLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                            .addComponent(textoDescuentos, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addComponent(textoRecarga, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                        .addComponent(jLabel18))
                    .addGroup(PanelDescuGeneralesLayout.createSequentialGroup()
                        .addGroup(PanelDescuGeneralesLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                            .addComponent(jLabel17)
                            .addComponent(radioRecargas))
                        .addGap(42, 42, 42)
                        .addComponent(jLabel19)))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(PanelDescuGeneralesLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(textoIce, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(textoExcentos, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );

        requerido1.setForeground(new java.awt.Color(255, 51, 51));
        requerido1.setText("Requerido");

        requerido2.setForeground(new java.awt.Color(255, 51, 51));
        requerido2.setText("Requerido");

        requerido3.setForeground(new java.awt.Color(255, 51, 51));
        requerido3.setText("Requerido");

        requerido4.setForeground(new java.awt.Color(255, 51, 51));
        requerido4.setText("Requerido");

        requerido5.setForeground(new java.awt.Color(255, 51, 51));
        requerido5.setText("Requerido");

        requerido6.setForeground(new java.awt.Color(255, 51, 51));
        requerido6.setText("Requerido");

        javax.swing.GroupLayout jPanel2Layout = new javax.swing.GroupLayout(jPanel2);
        jPanel2.setLayout(jPanel2Layout);
        jPanel2Layout.setHorizontalGroup(
            jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addComponent(PanelCredito, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
            .addComponent(PanelDescuGenerales, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
            .addGroup(jPanel2Layout.createSequentialGroup()
                .addContainerGap()
                .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING)
                    .addGroup(javax.swing.GroupLayout.Alignment.LEADING, jPanel2Layout.createSequentialGroup()
                        .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addGroup(jPanel2Layout.createSequentialGroup()
                                .addComponent(jLabel2)
                                .addGap(0, 0, Short.MAX_VALUE))
                            .addComponent(textoNit))
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                        .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING, false)
                            .addGroup(jPanel2Layout.createSequentialGroup()
                                .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addComponent(jLabel3)
                                    .addComponent(requerido2))
                                .addGap(49, 49, 49))
                            .addComponent(textoRazonSocial)))
                    .addComponent(jLabel1, javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(javax.swing.GroupLayout.Alignment.LEADING, jPanel2Layout.createSequentialGroup()
                        .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(comboSucursal, javax.swing.GroupLayout.PREFERRED_SIZE, 117, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addComponent(jLabel8))
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                        .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(jLabel9)
                            .addComponent(comboAlmacen, javax.swing.GroupLayout.PREFERRED_SIZE, 120, javax.swing.GroupLayout.PREFERRED_SIZE)))
                    .addGroup(javax.swing.GroupLayout.Alignment.LEADING, jPanel2Layout.createSequentialGroup()
                        .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(jLabel6)
                            .addComponent(jfecha, javax.swing.GroupLayout.PREFERRED_SIZE, 129, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addComponent(jLabel10)
                            .addComponent(comboTipPago, javax.swing.GroupLayout.PREFERRED_SIZE, 99, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addComponent(requerido5))
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                        .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(textoCodControl)
                            .addGroup(jPanel2Layout.createSequentialGroup()
                                .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addComponent(requerido6)
                                    .addComponent(jLabel7))
                                .addGap(0, 0, Short.MAX_VALUE))))
                    .addGroup(jPanel2Layout.createSequentialGroup()
                        .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addGroup(jPanel2Layout.createSequentialGroup()
                                .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addComponent(textoFactura)
                                    .addGroup(jPanel2Layout.createSequentialGroup()
                                        .addComponent(jLabel4)
                                        .addGap(0, 0, Short.MAX_VALUE)))
                                .addGap(18, 18, 18))
                            .addGroup(jPanel2Layout.createSequentialGroup()
                                .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addComponent(radioDescGene, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                                    .addGroup(jPanel2Layout.createSequentialGroup()
                                        .addGap(21, 21, 21)
                                        .addComponent(radioDescGeneral))
                                    .addComponent(requerido1)
                                    .addComponent(requerido3))
                                .addGap(53, 53, 53)))
                        .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addGroup(jPanel2Layout.createSequentialGroup()
                                .addComponent(requerido4)
                                .addGap(0, 0, Short.MAX_VALUE))
                            .addComponent(jLabel5, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                            .addComponent(textoAutorizacion))))
                .addGap(30, 30, 30))
        );
        jPanel2Layout.setVerticalGroup(
            jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel2Layout.createSequentialGroup()
                .addContainerGap()
                .addComponent(jLabel1)
                .addGap(18, 18, 18)
                .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jLabel2)
                    .addComponent(jLabel3))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(textoNit, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(textoRazonSocial, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(requerido1)
                    .addComponent(requerido2))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jLabel4)
                    .addComponent(jLabel5))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(textoFactura, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(textoAutorizacion, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(requerido3)
                    .addComponent(requerido4))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jLabel6)
                    .addComponent(jLabel7))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(jfecha, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(textoCodControl, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(requerido5)
                    .addComponent(requerido6))
                .addGap(10, 10, 10)
                .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(jLabel8)
                    .addComponent(jLabel9))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(comboSucursal, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(comboAlmacen, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addGap(27, 27, 27)
                .addComponent(jLabel10)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(comboTipPago, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(PanelCredito, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addComponent(radioDescGene, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(radioDescGeneral)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(PanelDescuGenerales, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(25, 25, 25))
        );

        jPanel3.setBackground(new java.awt.Color(255, 255, 255));
        jPanel3.setBorder(javax.swing.BorderFactory.createLineBorder(new java.awt.Color(0, 0, 0)));

        jLabel20.setFont(new java.awt.Font("Arial", 1, 14)); // NOI18N
        jLabel20.setForeground(new java.awt.Color(131, 178, 219));
        jLabel20.setText("BUSQUEDA PRODUCTO");

        jLabel21.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel21.setForeground(new java.awt.Color(131, 178, 219));
        jLabel21.setText("Centro de Costo");

        jLabel22.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel22.setForeground(new java.awt.Color(131, 178, 219));
        jLabel22.setText("Producto");

        textoProducto.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                textoProductoActionPerformed(evt);
            }
        });
        textoProducto.addKeyListener(new java.awt.event.KeyAdapter() {
            public void keyPressed(java.awt.event.KeyEvent evt) {
                textoProductoKeyPressed(evt);
            }
            public void keyReleased(java.awt.event.KeyEvent evt) {
                textoProductoKeyReleased(evt);
            }
        });

        jLabel23.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel23.setForeground(new java.awt.Color(131, 178, 219));
        jLabel23.setText("Unidad Medida");

        textoUniMedida.setEditable(false);

        jLabel24.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel24.setForeground(new java.awt.Color(131, 178, 219));
        jLabel24.setText("Fecha Vencimiento");

        jLabel25.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel25.setForeground(new java.awt.Color(131, 178, 219));
        jLabel25.setText("Lote");

        jLabel26.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel26.setForeground(new java.awt.Color(131, 178, 219));
        jLabel26.setText("C.U (Bs/U)");

        textoCU.addKeyListener(new java.awt.event.KeyAdapter() {
            public void keyReleased(java.awt.event.KeyEvent evt) {
                textoCUKeyReleased(evt);
            }
        });

        jLabel27.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel27.setForeground(new java.awt.Color(131, 178, 219));
        jLabel27.setText("Cant. (Unid)");

        textoCantidad.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                textoCantidadActionPerformed(evt);
            }
        });
        textoCantidad.addKeyListener(new java.awt.event.KeyAdapter() {
            public void keyReleased(java.awt.event.KeyEvent evt) {
                textoCantidadKeyReleased(evt);
            }
            public void keyTyped(java.awt.event.KeyEvent evt) {
                textoCantidadKeyTyped(evt);
            }
        });

        jLabel28.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel28.setForeground(new java.awt.Color(131, 178, 219));
        jLabel28.setText("Imp. (Bs)");

        textImporte.setEditable(false);
        textImporte.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                textImporteActionPerformed(evt);
            }
        });

        jButton1.setIcon(new javax.swing.ImageIcon(getClass().getResource("/imagen/addition.png"))); // NOI18N
        jButton1.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jButton1ActionPerformed(evt);
            }
        });

        comboCentroCosto.setModel(new javax.swing.DefaultComboBoxModel<>(new String[] { " " }));
        comboCentroCosto.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                comboCentroCostoActionPerformed(evt);
            }
        });

        radioPanelDescGene.setBackground(new java.awt.Color(255, 255, 255));
        radioPanelDescGene.setText("<html><span style=' color:BLUE '>««</span></html>");
        radioPanelDescGene.setBorder(null);
        radioPanelDescGene.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                radioPanelDescGeneActionPerformed(evt);
            }
        });

        panelExcedentes.setBackground(new java.awt.Color(255, 255, 255));

        jLabel29.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel29.setForeground(new java.awt.Color(131, 178, 219));
        jLabel29.setText("DESC. (-)");

        rapioPanelDesc.setBackground(new java.awt.Color(255, 255, 255));
        rapioPanelDesc.setForeground(new java.awt.Color(131, 178, 219));
        rapioPanelDesc.setText("Bs");
        rapioPanelDesc.setBorder(null);
        rapioPanelDesc.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                rapioPanelDescActionPerformed(evt);
            }
        });

        textPanelDesc.addKeyListener(new java.awt.event.KeyAdapter() {
            public void keyTyped(java.awt.event.KeyEvent evt) {
                textPanelDescKeyTyped(evt);
            }
        });

        jLabel30.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel30.setForeground(new java.awt.Color(131, 178, 219));
        jLabel30.setText("REC. (+)");

        radioPanelRec.setBackground(new java.awt.Color(255, 255, 255));
        radioPanelRec.setForeground(new java.awt.Color(131, 178, 219));
        radioPanelRec.setText("Bs");
        radioPanelRec.setBorder(null);
        radioPanelRec.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                radioPanelRecActionPerformed(evt);
            }
        });

        textPanelRecarga.addKeyListener(new java.awt.event.KeyAdapter() {
            public void keyTyped(java.awt.event.KeyEvent evt) {
                textPanelRecargaKeyTyped(evt);
            }
        });

        jLabel31.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel31.setForeground(new java.awt.Color(131, 178, 219));
        jLabel31.setText("ICE (-)");

        textPaneIce.addKeyListener(new java.awt.event.KeyAdapter() {
            public void keyTyped(java.awt.event.KeyEvent evt) {
                textPaneIceKeyTyped(evt);
            }
        });

        jLabel32.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel32.setForeground(new java.awt.Color(131, 178, 219));
        jLabel32.setText("EXC. (-)");

        textPanelExc.addKeyListener(new java.awt.event.KeyAdapter() {
            public void keyTyped(java.awt.event.KeyEvent evt) {
                textPanelExcKeyTyped(evt);
            }
        });

        javax.swing.GroupLayout panelExcedentesLayout = new javax.swing.GroupLayout(panelExcedentes);
        panelExcedentes.setLayout(panelExcedentesLayout);
        panelExcedentesLayout.setHorizontalGroup(
            panelExcedentesLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(panelExcedentesLayout.createSequentialGroup()
                .addGroup(panelExcedentesLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(panelExcedentesLayout.createSequentialGroup()
                        .addContainerGap()
                        .addComponent(jLabel29)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                        .addComponent(rapioPanelDesc))
                    .addGroup(panelExcedentesLayout.createSequentialGroup()
                        .addGap(30, 30, 30)
                        .addComponent(textPanelDesc, javax.swing.GroupLayout.PREFERRED_SIZE, 53, javax.swing.GroupLayout.PREFERRED_SIZE)))
                .addGap(18, 18, 18)
                .addGroup(panelExcedentesLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(panelExcedentesLayout.createSequentialGroup()
                        .addComponent(jLabel30)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                        .addComponent(radioPanelRec))
                    .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, panelExcedentesLayout.createSequentialGroup()
                        .addComponent(textPanelRecarga, javax.swing.GroupLayout.PREFERRED_SIZE, 53, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addGap(14, 14, 14)))
                .addGroup(panelExcedentesLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(panelExcedentesLayout.createSequentialGroup()
                        .addGap(28, 28, 28)
                        .addComponent(jLabel31))
                    .addGroup(panelExcedentesLayout.createSequentialGroup()
                        .addGap(20, 20, 20)
                        .addComponent(textPaneIce, javax.swing.GroupLayout.PREFERRED_SIZE, 53, javax.swing.GroupLayout.PREFERRED_SIZE)))
                .addGap(18, 18, 18)
                .addGroup(panelExcedentesLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(textPanelExc, javax.swing.GroupLayout.PREFERRED_SIZE, 58, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, panelExcedentesLayout.createSequentialGroup()
                        .addComponent(jLabel32)
                        .addGap(8, 8, 8)))
                .addContainerGap(117, Short.MAX_VALUE))
        );
        panelExcedentesLayout.setVerticalGroup(
            panelExcedentesLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(panelExcedentesLayout.createSequentialGroup()
                .addContainerGap()
                .addGroup(panelExcedentesLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jLabel29)
                    .addComponent(rapioPanelDesc)
                    .addComponent(jLabel30)
                    .addComponent(radioPanelRec)
                    .addComponent(jLabel31)
                    .addComponent(jLabel32))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(panelExcedentesLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(textPanelDesc, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(textPanelRecarga, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(textPaneIce, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(textPanelExc, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );

        radioNuevoCCO.setBackground(new java.awt.Color(255, 255, 255));
        radioNuevoCCO.setBorder(null);
        radioNuevoCCO.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                radioNuevoCCOActionPerformed(evt);
            }
        });

        jLabel34.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel34.setForeground(new java.awt.Color(131, 178, 219));
        jLabel34.setText("Nuevo");

        javax.swing.GroupLayout jPanel3Layout = new javax.swing.GroupLayout(jPanel3);
        jPanel3.setLayout(jPanel3Layout);
        jPanel3Layout.setHorizontalGroup(
            jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel3Layout.createSequentialGroup()
                .addContainerGap()
                .addGroup(jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(jPanel3Layout.createSequentialGroup()
                        .addGroup(jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addGroup(jPanel3Layout.createSequentialGroup()
                                .addGroup(jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addGroup(jPanel3Layout.createSequentialGroup()
                                        .addComponent(jLabel21)
                                        .addGap(45, 45, 45)
                                        .addComponent(jLabel34))
                                    .addGroup(jPanel3Layout.createSequentialGroup()
                                        .addComponent(comboCentroCosto, javax.swing.GroupLayout.PREFERRED_SIZE, 137, javax.swing.GroupLayout.PREFERRED_SIZE)
                                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                        .addComponent(radioNuevoCCO)))
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, 20, Short.MAX_VALUE)
                                .addGroup(jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addGroup(jPanel3Layout.createSequentialGroup()
                                        .addGap(25, 25, 25)
                                        .addComponent(jLabel22))
                                    .addComponent(textoProducto, javax.swing.GroupLayout.PREFERRED_SIZE, 140, javax.swing.GroupLayout.PREFERRED_SIZE))
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                                .addGroup(jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addComponent(jLabel23)
                                    .addGroup(jPanel3Layout.createSequentialGroup()
                                        .addGap(10, 10, 10)
                                        .addComponent(textoUniMedida, javax.swing.GroupLayout.PREFERRED_SIZE, 61, javax.swing.GroupLayout.PREFERRED_SIZE)))
                                .addGap(18, 18, 18)
                                .addGroup(jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addGroup(jPanel3Layout.createSequentialGroup()
                                        .addComponent(panelFecha, javax.swing.GroupLayout.PREFERRED_SIZE, 133, javax.swing.GroupLayout.PREFERRED_SIZE)
                                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, 16, Short.MAX_VALUE)
                                        .addComponent(textoLote, javax.swing.GroupLayout.PREFERRED_SIZE, 43, javax.swing.GroupLayout.PREFERRED_SIZE)
                                        .addGap(18, 18, 18))
                                    .addGroup(jPanel3Layout.createSequentialGroup()
                                        .addGap(15, 15, 15)
                                        .addComponent(jLabel24)
                                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                                        .addComponent(jLabel25)
                                        .addGap(28, 28, 28)))
                                .addGroup(jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addComponent(jLabel26)
                                    .addGroup(jPanel3Layout.createSequentialGroup()
                                        .addGap(10, 10, 10)
                                        .addComponent(textoCU, javax.swing.GroupLayout.PREFERRED_SIZE, 47, javax.swing.GroupLayout.PREFERRED_SIZE)))
                                .addGap(18, 18, 18)
                                .addGroup(jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING, false)
                                    .addGroup(jPanel3Layout.createSequentialGroup()
                                        .addComponent(jLabel27)
                                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                                        .addComponent(jLabel28))
                                    .addGroup(jPanel3Layout.createSequentialGroup()
                                        .addGap(10, 10, 10)
                                        .addComponent(textoCantidad, javax.swing.GroupLayout.PREFERRED_SIZE, 48, javax.swing.GroupLayout.PREFERRED_SIZE)
                                        .addGap(18, 18, 18)
                                        .addComponent(textImporte, javax.swing.GroupLayout.PREFERRED_SIZE, 50, javax.swing.GroupLayout.PREFERRED_SIZE))))
                            .addGroup(jPanel3Layout.createSequentialGroup()
                                .addGroup(jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addComponent(jLabel20)
                                    .addComponent(textoNuevoCCO, javax.swing.GroupLayout.PREFERRED_SIZE, 137, javax.swing.GroupLayout.PREFERRED_SIZE))
                                .addGap(0, 0, Short.MAX_VALUE)))
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                        .addGroup(jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING)
                            .addComponent(jButton1, javax.swing.GroupLayout.PREFERRED_SIZE, 34, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addComponent(radioPanelDescGene, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                        .addGap(19, 19, 19))
                    .addGroup(jPanel3Layout.createSequentialGroup()
                        .addComponent(panelExcedentes, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))))
        );
        jPanel3Layout.setVerticalGroup(
            jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel3Layout.createSequentialGroup()
                .addContainerGap()
                .addComponent(jLabel20)
                .addGap(18, 18, 18)
                .addGroup(jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(jPanel3Layout.createSequentialGroup()
                        .addGroup(jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING)
                            .addGroup(jPanel3Layout.createSequentialGroup()
                                .addComponent(jLabel21)
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                .addGroup(jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING, false)
                                    .addComponent(comboCentroCosto)
                                    .addComponent(radioNuevoCCO, javax.swing.GroupLayout.PREFERRED_SIZE, 20, javax.swing.GroupLayout.PREFERRED_SIZE)))
                            .addGroup(jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                .addGroup(jPanel3Layout.createSequentialGroup()
                                    .addGroup(jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                                        .addComponent(jLabel22)
                                        .addComponent(jLabel34))
                                    .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                    .addComponent(textoProducto, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                                .addGroup(jPanel3Layout.createSequentialGroup()
                                    .addComponent(jLabel23)
                                    .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                    .addComponent(textoUniMedida, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))))
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                        .addComponent(textoNuevoCCO, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                        .addComponent(panelExcedentes, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                    .addGroup(jPanel3Layout.createSequentialGroup()
                        .addGroup(jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                            .addComponent(jLabel25)
                            .addComponent(jLabel26)
                            .addComponent(jLabel27)
                            .addComponent(jLabel28)
                            .addComponent(jLabel24))
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                        .addGroup(jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(panelFecha, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addGroup(jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                                .addComponent(textoLote, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addComponent(textoCU, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addComponent(textoCantidad, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addComponent(textImporte, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                            .addComponent(jButton1, javax.swing.GroupLayout.PREFERRED_SIZE, 21, javax.swing.GroupLayout.PREFERRED_SIZE))
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                        .addComponent(radioPanelDescGene, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)))
                .addContainerGap(16, Short.MAX_VALUE))
        );

        btnCancelar.setText("Cancelar");
        btnCancelar.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                btnCancelarActionPerformed(evt);
            }
        });

        btnGuardar.setText("Guardar");
        btnGuardar.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                btnGuardarActionPerformed(evt);
            }
        });

        tablaProductosA.setModel(new javax.swing.table.DefaultTableModel(
            new Object [][] {

            },
            new String [] {
                "Centro Costos", "#", "Producto", "Cod. Item", "Unid. Medida", "<html><center>C.U. <br> (Bs/Uni)</center></html>", "Cant. (Uni)", "Imp. (Bs)", "Desc. (-)", "Rec. (+)", "Ice (-)", "Exc. (-)", "<html><center>Sujeto <br>a DF</center></html>", "Fecha", "Lote", "Eliminar"
            }
        ));
        tablaProductosA.setFillsViewportHeight(true);
        tablaProductosA.addMouseListener(new java.awt.event.MouseAdapter() {
            public void mouseClicked(java.awt.event.MouseEvent evt) {
                tablaProductosAMouseClicked(evt);
            }
        });
        jScrollPane2.setViewportView(tablaProductosA);
        if (tablaProductosA.getColumnModel().getColumnCount() > 0) {
            tablaProductosA.getColumnModel().getColumn(0).setMinWidth(0);
            tablaProductosA.getColumnModel().getColumn(0).setPreferredWidth(0);
            tablaProductosA.getColumnModel().getColumn(0).setMaxWidth(0);
            tablaProductosA.getColumnModel().getColumn(1).setMinWidth(30);
            tablaProductosA.getColumnModel().getColumn(1).setPreferredWidth(30);
            tablaProductosA.getColumnModel().getColumn(1).setMaxWidth(30);
            tablaProductosA.getColumnModel().getColumn(13).setMinWidth(0);
            tablaProductosA.getColumnModel().getColumn(13).setPreferredWidth(0);
            tablaProductosA.getColumnModel().getColumn(13).setMaxWidth(0);
            tablaProductosA.getColumnModel().getColumn(14).setMinWidth(0);
            tablaProductosA.getColumnModel().getColumn(14).setPreferredWidth(0);
            tablaProductosA.getColumnModel().getColumn(14).setMaxWidth(0);
            tablaProductosA.getColumnModel().getColumn(15).setMinWidth(60);
            tablaProductosA.getColumnModel().getColumn(15).setPreferredWidth(60);
            tablaProductosA.getColumnModel().getColumn(15).setMaxWidth(60);
        }

        jLabel33.setFont(new java.awt.Font("Arial", 1, 12)); // NOI18N
        jLabel33.setForeground(new java.awt.Color(131, 178, 219));
        jLabel33.setText("Total: ");

        labelImp.setEditable(false);
        labelImp.setBorder(null);

        labelDGImp.setEditable(false);
        labelDGImp.setBorder(null);

        labelSujeto.setEditable(false);
        labelSujeto.setBorder(null);

        javax.swing.GroupLayout jPanel1Layout = new javax.swing.GroupLayout(jPanel1);
        jPanel1.setLayout(jPanel1Layout);
        jPanel1Layout.setHorizontalGroup(
            jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel1Layout.createSequentialGroup()
                .addContainerGap()
                .addComponent(jPanel2, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(jPanel1Layout.createSequentialGroup()
                        .addGap(8, 8, 8)
                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, jPanel1Layout.createSequentialGroup()
                                .addGap(0, 0, Short.MAX_VALUE)
                                .addComponent(btnCancelar)
                                .addGap(18, 18, 18)
                                .addComponent(btnGuardar)
                                .addGap(82, 82, 82))
                            .addGroup(jPanel1Layout.createSequentialGroup()
                                .addComponent(jPanel3, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addContainerGap(12, Short.MAX_VALUE))))
                    .addGroup(jPanel1Layout.createSequentialGroup()
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                        .addComponent(jLabel33)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                        .addComponent(labelImp, javax.swing.GroupLayout.PREFERRED_SIZE, 36, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addGap(135, 135, 135)
                        .addComponent(labelDGImp, javax.swing.GroupLayout.PREFERRED_SIZE, 36, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addGap(167, 167, 167)
                        .addComponent(labelSujeto, javax.swing.GroupLayout.PREFERRED_SIZE, 37, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addGap(96, 96, 96))
                    .addGroup(jPanel1Layout.createSequentialGroup()
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                        .addComponent(jScrollPane2, javax.swing.GroupLayout.PREFERRED_SIZE, 927, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addContainerGap())))
        );
        jPanel1Layout.setVerticalGroup(
            jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel1Layout.createSequentialGroup()
                .addContainerGap()
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(jPanel1Layout.createSequentialGroup()
                        .addComponent(jPanel2, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addContainerGap(89, Short.MAX_VALUE))
                    .addGroup(jPanel1Layout.createSequentialGroup()
                        .addComponent(jPanel3, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                        .addComponent(jScrollPane2, javax.swing.GroupLayout.PREFERRED_SIZE, 180, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addGap(27, 27, 27)
                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                            .addComponent(jLabel33)
                            .addComponent(labelImp, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addComponent(labelDGImp, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addComponent(labelSujeto, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                            .addComponent(btnGuardar)
                            .addComponent(btnCancelar))
                        .addGap(141, 141, 141))))
        );

        jScrollPane1.setViewportView(jPanel1);

        javax.swing.GroupLayout layout = new javax.swing.GroupLayout(getContentPane());
        getContentPane().setLayout(layout);
        layout.setHorizontalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addComponent(jScrollPane1, javax.swing.GroupLayout.Alignment.TRAILING, javax.swing.GroupLayout.DEFAULT_SIZE, 1262, Short.MAX_VALUE)
        );
        layout.setVerticalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addComponent(jScrollPane1, javax.swing.GroupLayout.PREFERRED_SIZE, 664, javax.swing.GroupLayout.PREFERRED_SIZE)
        );

        pack();
    }// </editor-fold>//GEN-END:initComponents

    private void comboTipPagoActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_comboTipPagoActionPerformed
        String tipPago = (String)comboTipPago.getSelectedItem();
        if (tipPago.equals("CONTADO")) {
            PanelCredito.setVisible(false);
            
        }else if (tipPago.equals("CREDITO")){
            PanelCredito.setVisible(true);
            textoDias.setText("0");
        }
    }//GEN-LAST:event_comboTipPagoActionPerformed

    private void radioDescuentoActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_radioDescuentoActionPerformed
        boolean descu = radioDescuento.isSelected();
  
        if (descu == true) {
            radioDescuento.setText("%");
        } else if(descu == false) {
            radioDescuento.setText("Bs");
        }      
    }//GEN-LAST:event_radioDescuentoActionPerformed

    private void radioDescGeneralActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_radioDescGeneralActionPerformed
        boolean descGeneral = radioDescGeneral.isSelected();
        int tam = tablaProductosA.getRowCount();
        
        if (tam <= 0) {
            if (descGeneral == true) {
            
                PanelDescuGenerales.setVisible(true);
                radioPanelDescGene.setEnabled(false);
                
                textoDescuentos.setText("0");
                textoRecarga.setText("0");
                textoIce.setText("0");
                textoExcentos.setText("0");
            } else if(descGeneral == false){

                PanelDescuGenerales.setVisible(false);
                radioPanelDescGene.setEnabled(true);
            }
        }else if (tam > 0) {
            radioPanelDescGene.setEnabled(false);
        }
        
    }//GEN-LAST:event_radioDescGeneralActionPerformed

    private void radioRecargasActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_radioRecargasActionPerformed
        boolean descargos = radioRecargas.isSelected();
        System.out.println(descargos);
        if (descargos == true) {
            radioRecargas.setText("%");
        } else if(descargos == false){
            radioRecargas.setText("Bs");
        }
    }//GEN-LAST:event_radioRecargasActionPerformed

    private void textoProductoKeyPressed(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_textoProductoKeyPressed
        //String costo = (String)comboCentroCosto.getSelectedItem(); 
        //if (costo.equals("ALMACEN")) {
            switch(evt.getKeyCode()){
            case KeyEvent.VK_BACK_SPACE:
                break;
            case KeyEvent.VK_ENTER:
                textoProducto.setText(textoProducto.getText());
                break;
            default:
                EventQueue.invokeLater(new Runnable() {
            @Override
            public void run() {
                String txt = textoProducto.getText();
                autocompleteProducto(txt);
                }
            });                
           // }     
            obtenerUnidProducto();  
        }
    }//GEN-LAST:event_textoProductoKeyPressed

    private void comboAlmacenActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_comboAlmacenActionPerformed
        // TODO add your handling code here:
    }//GEN-LAST:event_comboAlmacenActionPerformed

    private void comboSucursalActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_comboSucursalActionPerformed
        comboAlmacen.removeAllItems();
        String sucursal = (String)comboSucursal.getSelectedItem();
        ResultSet rs = null;
        String consulta = "SELECT A.NOMBRE\n" +
            "FROM ALMACEN AS A\n" +
            "INNER JOIN SUCURSAL AS S ON S.ID = A.SUCURSAL\n" +
            "WHERE S.NOMBRE = '"+sucursal+"' AND S.ELIMINADO = "+false;
        try {
            rs = db.seleccionar(consulta);
            while (rs.next()) {                
                comboAlmacen.addItem(rs.getString(1));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }finally{
            try {
                rs.close();
                db.Conectar().close();
            } catch (SQLException ex) {
                Logger.getLogger(NuevaCompra.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
        comboCentroCosto.setEnabled(true);
        textoProducto.setEnabled(true);
        panelFecha.setEnabled(true);
        textoLote.setEnabled(true);
        textoCU.setEnabled(true);
        textoCantidad.setEnabled(true);
    }//GEN-LAST:event_comboSucursalActionPerformed

    private void textoProductoKeyReleased(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_textoProductoKeyReleased
        
        String producto = textoProducto.getText();
        if (producto.equals("")) {
            textoUniMedida.setText("");
        }
    }//GEN-LAST:event_textoProductoKeyReleased

    private void textoRazonSocialKeyPressed(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_textoRazonSocialKeyPressed
        switch(evt.getKeyCode()){
            case KeyEvent.VK_BACK_SPACE:
                break;
            case KeyEvent.VK_ENTER:
                textoRazonSocial.setText(textoRazonSocial.getText());
                break;
            default:
                EventQueue.invokeLater(new Runnable() {
            @Override
            public void run() {
                String txt = textoRazonSocial.getText();
                autocompleteRazonSocial(txt);
                }
            });                
            }  
    }//GEN-LAST:event_textoRazonSocialKeyPressed

    private void btnCancelarActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_btnCancelarActionPerformed
        dispose();
    }//GEN-LAST:event_btnCancelarActionPerformed
    
    private void btnGuardarActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_btnGuardarActionPerformed
        contVerif = 0;
        verificar();
        if (contVerif == 0) {
            
            Date fact = new Date();
            long f = fact.getTime();
            java.sql.Date fechaAct = new java.sql.Date(f);
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            String fechaActual = sdf.format(fechaAct);
            
            String nit = textoNit.getText();
            String razonSocial = textoRazonSocial.getText();

            Date fecha = jfecha.getDate();
            long d = fecha.getTime();
            java.sql.Date fechaSeleccionada = new java.sql.Date(d);
            String tiPago = (String)comboTipPago.getSelectedItem();
            int idTipPago = obtenerTipoPago(tiPago);
            boolean desGene = radioDescGeneral.isSelected();
            boolean panelDesGene = radioPanelDescGene.isSelected();
            
            int[] idMovimientos = obtenerIdMovimiento();
            String almacen = (String)comboAlmacen.getSelectedItem();
            int idAlmacen = obtenerIdAlmacen(almacen);
            int idEmpresa = obtenerIdEmpresa();
            
            java.math.BigInteger factura = new java.math.BigInteger(textoFactura.getText());
            java.math.BigInteger autorizacion = new java.math.BigInteger(textoAutorizacion.getText());
            String codiContro = textoCodControl.getText();
            int dias = (textoDias.getText().equals(""))? 0:Integer.parseInt(textoDias.getText());
            double aCuenta = (textoACuenta.getText().equals(""))? 0:Double.parseDouble(textoACuenta.getText());
            double saldo = 0;
            boolean Tipodescuento = radioDescuento.isSelected();
            boolean TipoRecarga = radioRecargas.isSelected();
            
            /*double descuento = Double.parseDouble(textoDescuentos.getText());
            double recarga = Double.parseDouble(textoRecarga.getText());*/
            
            try {
                //if (tiPago.equals("CONTADO")) {
                    
                    db.insertarInvMovimiento(idMovimientos[0], idMovimientos[1], idEmpresa, fechaSeleccionada, fechaAct, fechaAct); 
                    int idProveedor = obtenerIdProveedor(razonSocial);
                    int idMovimiento = db.seleccionarUltimoIdMovimiento();
                    
                    String proveedor = "SELECT * FROM PROVEEDOR WHERE RAZON_SOCIAL = '"+razonSocial+"'";
                    if (db.existeEldato(proveedor)==true) {
                        
                        //if (desGene == true) {
                            //System.out.println(labelDGImp.getText());
                            double descuento_gene = (textoDescuentos.getText().equals(""))? 0:Double.parseDouble(textoDescuentos.getText());
                            double recargo_gene = (textoRecarga.getText().equals(""))? 0:Double.parseDouble(textoRecarga.getText());
                            double ice_gene = (textoIce.getText().equals(""))? 0:Double.parseDouble(textoIce.getText());
                            double excento_gene = (textoExcentos.getText().equals(""))? 0:Double.parseDouble(textoExcentos.getText());
                            double importe_gene = (labelDGImp.getText().equals(""))? 0:Double.parseDouble(labelDGImp.getText());
                            double sujetoDF_gene = (labelSujeto.getText().equals(""))? 0:Double.parseDouble(labelSujeto.getText());
                            saldo = sujetoDF_gene - aCuenta;
                            db.insertarCompra(idAlmacen, idProveedor, idMovimiento, factura, autorizacion, fechaSeleccionada, codiContro, importe_gene, idTipPago, dias, aCuenta, saldo, desGene, descuento_gene, recargo_gene, ice_gene, excento_gene,Tipodescuento , TipoRecarga, sujetoDF_gene, fechaAct, fechaAct, 0, this.id_usuario, 0);


                            for (int i = 0; i < tablaProductosA.getRowCount(); i++) {

                                String centroCosto = String.valueOf(tablaProductosA.getValueAt(i, 0));
                                String producto = String.valueOf(tablaProductosA.getValueAt(i, 2));
                                double costoUnitario = Double.valueOf(String.valueOf(tablaProductosA.getValueAt(i, 5)));
                                int cantidad = Integer.parseInt(String.valueOf(tablaProductosA.getValueAt(i, 6)));
                                double importe = Double.valueOf(String.valueOf(tablaProductosA.getValueAt(i, 7)));
                                double descuento = Double.valueOf(String.valueOf(tablaProductosA.getValueAt(i, 8)));
                                double recarga = Double.valueOf(String.valueOf(tablaProductosA.getValueAt(i, 9)));
                                double ice = Double.valueOf(String.valueOf(tablaProductosA.getValueAt(i, 10)));
                                double excento = Double.valueOf(String.valueOf(tablaProductosA.getValueAt(i, 11)));
                                double sujetoDF = Double.valueOf(String.valueOf(tablaProductosA.getValueAt(i, 12)));
                                double costoTotal = costoUnitario * cantidad;
                                String fe =  String.valueOf(tablaProductosA.getValueAt(i, 13));
                                java.sql.Date fechaVencimiento = null;
                                try {
                                    if (!sdf.parse(String.valueOf(tablaProductosA.getValueAt(i, 13))).toString().isEmpty()) {
                                         Date fechaS = sdf.parse(String.valueOf(tablaProductosA.getValueAt(i, 13)));
                                        long ff = fechaS.getTime();
                                        fechaVencimiento = new java.sql.Date(ff);
                                    }
                                } catch (Exception e) {
                                    fechaVencimiento = null;
                                }
                                String lote = String.valueOf(tablaProductosA.getValueAt(i, 14));                           
                           
                                int ultimoIdCompra = db.seleccionarUltimoIdCompra();
                                int idProducto = obtenerIdProducto(producto);
                                                            
                                //Verifica si existe el Centro de Costos ingresado
                                if (existeCCO(centroCosto)== true) {
                                    //SI EL CENTRO DE COSTOS ES DE TIPO ALMACEN
                                    if(centroCosto.equals("ALMACEN")){
                                        db.insertarInvInventario(idAlmacen, idProducto, cantidad, costoUnitario, costoTotal, fechaAct, fechaAct, fechaVencimiento, lote);
                                    
                                        int idInventario = db.seleccionarUltimoIdInventario(); 
                                        int idCentroCostos = obtenerIdCCO(centroCosto);
                                        db.insertarDetalleCompra(ultimoIdCompra, idProducto, idCentroCostos, costoUnitario, cantidad, importe, descuento, recarga, ice, excento, Tipodescuento, TipoRecarga, sujetoDF, fechaAct, fechaAct, idInventario);

                                        db.insertarDetalleMovimiento(idProducto, idMovimiento, costoUnitario, cantidad, importe, descuento, recarga, ice, excento, Tipodescuento, TipoRecarga, sujetoDF, fechaAct, fechaAct,fechaVencimiento,idInventario);

                                    }else{
                                        db.insertarDetalleMovimiento(idProducto, idMovimiento, costoUnitario, cantidad, importe, descuento, recarga, ice, excento, Tipodescuento, TipoRecarga, sujetoDF, fechaAct, fechaAct, fechaVencimiento, 0);
                                    
                                    
                                    }
                                }else{
                                    int idClase = db.seleccionarUltimoIdClase();
                                    idClase = idClase + 1;
                                    int idTipo = obtenerIdTipo();
                                    db.InsertarClases(idClase, idTipo, centroCosto, "", true, fechaActual, fechaActual);
                                       
                                    db.insertarDetalleMovimiento(idProducto, idMovimiento, costoUnitario, cantidad, importe, descuento, recarga, ice, excento, Tipodescuento, TipoRecarga, sujetoDF, fechaAct, fechaAct, fechaVencimiento, 0);
                                }
                            }
                    }else{
                       //AGREGAR NUEVO PROVEEDOR
                        db.insertarProveedor(idEmpresa, codiContro, razonSocial, nit, "", "", "", "", "", "", "", null, null, "", "", fechaAct, fechaAct, "", "","" ,"" , "");
                        int ultimoIdProveedor = db.seleccionarUltimoIdProveedor();
                        
                        double descuento_gene = (textoDescuentos.getText().equals(""))? 0:Double.parseDouble(textoDescuentos.getText());
                        double recargo_gene = (textoRecarga.getText().equals(""))? 0:Double.parseDouble(textoRecarga.getText());
                        double ice_gene = (textoIce.getText().equals(""))? 0:Double.parseDouble(textoIce.getText());
                        double excento_gene = (textoExcentos.getText().equals(""))? 0:Double.parseDouble(textoExcentos.getText());
                        double importe_gene = (labelDGImp.getText().equals(""))? 0:Double.parseDouble(labelDGImp.getText());
                        double sujetoDF_gene = (labelSujeto.getText().equals(""))? 0:Double.parseDouble(labelSujeto.getText());

                        db.insertarCompra(idAlmacen, ultimoIdProveedor, idMovimiento, factura, autorizacion, fechaSeleccionada, codiContro, importe_gene, idTipPago, dias, aCuenta, saldo, desGene, descuento_gene, recargo_gene, ice_gene, excento_gene,Tipodescuento , TipoRecarga, sujetoDF_gene, fechaAct, fechaAct, 0, this.id_usuario, 0);


                        for (int i = 0; i < tablaProductosA.getRowCount(); i++) {

                            String centroCosto = String.valueOf(tablaProductosA.getValueAt(i, 0));
                            String producto = String.valueOf(tablaProductosA.getValueAt(i, 2));
                            double costoUnitario = Double.valueOf(String.valueOf(tablaProductosA.getValueAt(i, 5)));
                            int cantidad = Integer.parseInt(String.valueOf(tablaProductosA.getValueAt(i, 6)));
                            double importe = Double.valueOf(String.valueOf(tablaProductosA.getValueAt(i, 7)));
                            double descuento = Double.valueOf(String.valueOf(tablaProductosA.getValueAt(i, 8)));
                            double recarga = Double.valueOf(String.valueOf(tablaProductosA.getValueAt(i, 9)));
                            double ice = Double.valueOf(String.valueOf(tablaProductosA.getValueAt(i, 10)));
                            double excento = Double.valueOf(String.valueOf(tablaProductosA.getValueAt(i, 11)));
                            double sujetoDF = Double.valueOf(String.valueOf(tablaProductosA.getValueAt(i, 12)));
                            double costoTotal = costoUnitario * cantidad;
                            String fe =  String.valueOf(tablaProductosA.getValueAt(i, 13));
                            java.sql.Date fechaVencimiento = null;
                            try {
                                if (!sdf.parse(String.valueOf(tablaProductosA.getValueAt(i, 13))).toString().isEmpty()) {
                                     Date fechaS = sdf.parse(String.valueOf(tablaProductosA.getValueAt(i, 13)));
                                    long ff = fechaS.getTime();
                                    fechaVencimiento = new java.sql.Date(ff);
                                }
                            } catch (Exception e) {
                                fechaVencimiento = null;
                            }
                            String lote = String.valueOf(tablaProductosA.getValueAt(i, 14));                           

                            int ultimoIdCompra = db.seleccionarUltimoIdCompra();
                            int idProducto = obtenerIdProducto(producto);

                            //Verifica si existe el Centro de Costos ingresado
                            if (existeCCO(centroCosto)== true) {
                                //SI EL CENTRO DE COSTOS ES DE TIPO ALMACEN
                                if(centroCosto.equals("ALMACEN")){
                                    db.insertarInvInventario(idAlmacen, idProducto, cantidad, costoUnitario, costoTotal, fechaAct, fechaAct, fechaVencimiento, lote);

                                    int idInventario = db.seleccionarUltimoIdInventario(); 
                                    int idCentroCostos = obtenerIdCCO(centroCosto);
                                    db.insertarDetalleCompra(ultimoIdCompra, idProducto, idCentroCostos, costoUnitario, cantidad, importe, descuento, recarga, ice, excento, Tipodescuento, TipoRecarga, sujetoDF, fechaAct, fechaAct, idInventario);

                                    db.insertarDetalleMovimiento(idProducto, idMovimiento, costoUnitario, cantidad, importe, descuento, recarga, ice, excento, Tipodescuento, TipoRecarga, sujetoDF, fechaAct, fechaAct,fechaVencimiento,idInventario);

                                }else{
                                    db.insertarDetalleMovimiento(idProducto, idMovimiento, costoUnitario, cantidad, importe, descuento, recarga, ice, excento, Tipodescuento, TipoRecarga, sujetoDF, fechaAct, fechaAct, fechaVencimiento, 0);


                                }
                            }else{
                                int idClase = db.seleccionarUltimoIdClase();
                                idClase = idClase + 1;
                                int idTipo = obtenerIdTipo();
                                db.InsertarClases(idClase, idTipo, centroCosto, "", true, fechaActual, fechaActual);

                                db.insertarDetalleMovimiento(idProducto, idMovimiento, costoUnitario, cantidad, importe, descuento, recarga, ice, excento, Tipodescuento, TipoRecarga, sujetoDF, fechaAct, fechaAct, fechaVencimiento, 0);
                            }
                        }                      
                    }
                
                JOptionPane.showMessageDialog(null, "Guardado Exitosamente.");
                dispose();
                
            } catch (Exception e) {
                e.printStackTrace();
            }
        }else{
            JOptionPane.showMessageDialog(null, "Ingrese los campos requeridos");
        }
        
    }//GEN-LAST:event_btnGuardarActionPerformed

    private void radioPanelDescGeneActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_radioPanelDescGeneActionPerformed
        boolean exce = radioPanelDescGene.isSelected();
        
        if (exce == true) {
            panelExcedentes.setVisible(true);
            radioDescGeneral.setEnabled(false);
            
            textPanelDesc.setText("0");
            textPanelRecarga.setText("0");
            textPaneIce.setText("0");
            textPanelExc.setText("0");
        }else{
            panelExcedentes.setVisible(false);
            radioDescGeneral.setEnabled(true);
            
            textPanelDesc.setText("0");
            textPanelRecarga.setText("0");
            textPaneIce.setText("0");
            textPanelExc.setText("0");
        }
    }//GEN-LAST:event_radioPanelDescGeneActionPerformed

    private void textoNitKeyTyped(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_textoNitKeyTyped
        char c = evt.getKeyChar(); 
        if ((c<'0' || c>'9')) evt.consume();
    }//GEN-LAST:event_textoNitKeyTyped

    private void textoFacturaKeyTyped(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_textoFacturaKeyTyped
        char c = evt.getKeyChar(); 
        if ((c<'0' || c>'9')) evt.consume();
    }//GEN-LAST:event_textoFacturaKeyTyped

    private void textImporteActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_textImporteActionPerformed
        // TODO add your handling code here:
    }//GEN-LAST:event_textImporteActionPerformed

    private void textoCUKeyReleased(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_textoCUKeyReleased
        int cantidad = (textoCantidad.getText().equals(""))? 0:Integer.parseInt(textoCantidad.getText());
        double cu = (textoCU.getText().equals(""))? 0.0:Double.parseDouble(textoCU.getText());
        double importe = cantidad * cu;
        textImporte.setText(Double.toString(importe));
    }//GEN-LAST:event_textoCUKeyReleased

    private void textoCantidadKeyReleased(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_textoCantidadKeyReleased
        int cantidad = (textoCantidad.getText().equals(""))? 0:Integer.parseInt(textoCantidad.getText());
        double cu = (textoCU.getText().equals(""))? 0.0:Double.parseDouble(textoCU.getText());
        double importe = cantidad * cu;
        textImporte.setText(Double.toString(importe));
    }//GEN-LAST:event_textoCantidadKeyReleased

    private void jButton1ActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jButton1ActionPerformed
        
        String centroCostos = textoNuevoCCO.getText();
        String centroCostos1 = (String) comboCentroCosto.getSelectedItem();
        String producto  = textoProducto.getText();
        String unidadMedi = textoUniMedida.getText();
        String cu = textoCU.getText();
        String cantidad = textoCantidad.getText();
        String importe = textImporte.getText();
        String codigo = obtenerCodigoProducto(producto);
        String textNuevoCCO = textoNuevoCCO.getText();
        //Date fechaSelec = panelFecha.getDate();
        java.sql.Date fechaVenci = null;
        try{
            if (!this.panelFecha.getDate().toString().isEmpty()) {
                Date fv = panelFecha.getDate();
                long v = fv.getTime();
                fechaVenci = new java.sql.Date(v);
            }
        }catch(Exception e){
            fechaVenci = null;
        }
        String lote = textoLote.getText();
        
        int idEmpresa = obtenerIdEmpresa();
        String existeProducto = "SELECT *\n" +
            "FROM PRODUCTO AS P\n" +
            "WHERE P.NOMBRE = '"+producto+"' AND P.EMPRESA = "+idEmpresa+" AND P.ELIMINADO = "+false;
        if(db.existeEldato(existeProducto) == true){
        
            if (radioPanelDescGene.isSelected() == true) {
                double panelDescuento = Double.parseDouble(textPanelDesc.getText());
                double panelRecarga = Double.parseDouble(textPanelRecarga.getText());
                double panelIce = Double.parseDouble(textPaneIce.getText());
                double panelExcento = Double.parseDouble(textPanelExc.getText());


                if (rapioPanelDesc.isSelected() == false && radioPanelRec.isSelected() == false) {

                    if (!textoNuevoCCO.getText().equals("")) {                   
                        double subjetoDF = Double.parseDouble(importe)-panelDescuento+panelRecarga-panelIce-panelExcento ;
                        Object[] datos = {centroCostos,num,producto,codigo,unidadMedi,cu,cantidad,importe,panelDescuento,panelRecarga,panelIce,panelExcento,subjetoDF,fechaVenci,lote,eliminar};
                        num = num + 1;
                        modeloTabla.addRow(datos);
                    }else{
                        double subjetoDF = Double.parseDouble(importe)-panelDescuento+panelRecarga-panelIce-panelExcento ;
                        Object[] datos = {centroCostos1,num,producto,codigo,unidadMedi,cu,cantidad,importe,panelDescuento,panelRecarga,panelIce,panelExcento,subjetoDF,fechaVenci,lote,eliminar};
                        num = num + 1;
                        modeloTabla.addRow(datos);
                    }

                }
                if (rapioPanelDesc.isSelected() == false && radioPanelRec.isSelected() == true) {

                    if (!textoNuevoCCO.getText().equals("")) {

                        panelRecarga = panelRecarga / 100;
                        double subjetoDF = Double.parseDouble(importe)-panelDescuento+panelRecarga-panelIce-panelExcento ;
                        Object[] datos = {centroCostos,num,producto,codigo,unidadMedi,cu,cantidad,importe,panelDescuento,panelRecarga,panelIce,panelExcento,subjetoDF,fechaVenci,lote,eliminar};
                        num = num + 1;
                        modeloTabla.addRow(datos);
                    }else{

                        panelRecarga = panelRecarga / 100;
                        double subjetoDF = Double.parseDouble(importe)-panelDescuento+panelRecarga-panelIce-panelExcento ;
                        Object[] datos = {centroCostos1,num,producto,codigo,unidadMedi,cu,cantidad,importe,panelDescuento,panelRecarga,panelIce,panelExcento,subjetoDF,fechaVenci,lote,eliminar};
                        num = num + 1;
                        modeloTabla.addRow(datos);
                    }
                }
                if (rapioPanelDesc.isSelected() == true && radioPanelRec.isSelected() == false) {

                    if (!textoNuevoCCO.getText().equals("")) {                                  
                        panelDescuento = panelDescuento / 100;
                        double subjetoDF = Double.parseDouble(importe)-panelDescuento+panelRecarga-panelIce-panelExcento ;
                        Object[] datos = {centroCostos,num,producto,codigo,unidadMedi,cu,cantidad,importe,panelDescuento,panelRecarga,panelIce,panelExcento,subjetoDF,fechaVenci,lote,eliminar};
                        num = num + 1;
                        modeloTabla.addRow(datos);
                    }else{
                        panelDescuento = panelDescuento / 100;
                        double subjetoDF = Double.parseDouble(importe)-panelDescuento+panelRecarga-panelIce-panelExcento ;
                        Object[] datos = {centroCostos1,num,producto,codigo,unidadMedi,cu,cantidad,importe,panelDescuento,panelRecarga,panelIce,panelExcento,subjetoDF,fechaVenci,lote,eliminar};
                        num = num + 1;
                        modeloTabla.addRow(datos);
                    }
                }
                if (rapioPanelDesc.isSelected() == true && radioPanelRec.isSelected() == true) {

                    if (!textoNuevoCCO.getText().equals("")) {
                        panelDescuento = panelDescuento / 100;
                        panelRecarga = panelRecarga / 100;
                        double subjetoDF = Double.parseDouble(importe)-panelDescuento+panelRecarga-panelIce-panelExcento ;
                        Object[] datos = {centroCostos,num,producto,codigo,unidadMedi,cu,cantidad,importe,panelDescuento,panelRecarga,panelIce,panelExcento,subjetoDF,fechaVenci,lote,eliminar};
                        num = num + 1;
                        modeloTabla.addRow(datos);
                    }else{
                        panelDescuento = panelDescuento / 100;
                        panelRecarga = panelRecarga / 100;
                        double subjetoDF = Double.parseDouble(importe)-panelDescuento+panelRecarga-panelIce-panelExcento ;
                        Object[] datos = {centroCostos1,num,producto,codigo,unidadMedi,cu,cantidad,importe,panelDescuento,panelRecarga,panelIce,panelExcento,subjetoDF,fechaVenci,lote,eliminar};
                        num = num + 1;
                        modeloTabla.addRow(datos);
                    }
                }


                tablaProductosA.setModel(modeloTabla);
                tamañoTablaDescuentos();         

                textPanelDesc.setText("0");
                textPanelRecarga.setText("0");
                textPaneIce.setText("0");
                textPanelExc.setText("0");
                comboCentroCosto.setSelectedItem("");
                textoProducto.setText("");
                textoLote.setText("");
                textoCU.setText("");
                textoCantidad.setText("");
                textImporte.setText("");
                
                double imp = 0;
                double sujeto = 0;
                for (int i = 0; i < tablaProductosA.getRowCount(); i++) {
                    double valorTotal = Double.parseDouble(String.valueOf(tablaProductosA.getValueAt(i, 7)));
                    double valorSujeto = Double.parseDouble(String.valueOf(tablaProductosA.getValueAt(i, 12)));
                    imp = imp+valorTotal;
                    sujeto = sujeto+valorSujeto;
                }
  
                labelSujeto.setText(Double.toString(sujeto));
                labelImp.setText(Double.toString(imp));
                
                if (comboTipPago.getSelectedItem().equals("CREDITO")) {
                    jTextField7.setText(Double.toString(sujeto));
                }
                
            }
            //Descuento General del Panel
            if (radioDescGeneral.isSelected() == true) {

                if (!textoNuevoCCO.getText().equals("")) {

                    double subjetoDF = Double.parseDouble(importe)-0+0-0-0 ;
                    Object[] datos = {centroCostos,num,producto,codigo,unidadMedi,cu,cantidad,importe,0,0,0,0,subjetoDF,fechaVenci,lote,eliminar};
                    num = num +1;
                    modeloTabla.addRow(datos);
                }else{
                    double subjetoDF = Double.parseDouble(importe)-0+0-0-0 ;
                    Object[] datos = {centroCostos1,num,producto,codigo,unidadMedi,cu,cantidad,importe,0,0,0,0,subjetoDF,fechaVenci,lote,eliminar};
                    num = num +1;
                    modeloTabla.addRow(datos);
                }

                tablaProductosA.setModel(modeloTabla);
                tamañoTabla();

                //CALCULO DE DESCUENTOS GENERALES
                double descuento = (textoDescuentos.getText().equals(""))? 0:Double.parseDouble(textoDescuentos.getText());
                double recarga = (textoRecarga.getText().equals(""))? 0:Double.parseDouble(textoRecarga.getText());
                double ice = (textoIce.getText().equals(""))? 0:Double.parseDouble(textoIce.getText());
                double excentos = (textoExcentos.getText().equals(""))? 0:Double.parseDouble(textoExcentos.getText());
                double imp = 0;
                double sujeto = 0;
                for (int i = 0; i < tablaProductosA.getRowCount(); i++) {
                    double valorTotal = Double.parseDouble(String.valueOf(tablaProductosA.getValueAt(i, 7)));
                    double valorSujeto = Double.parseDouble(String.valueOf(tablaProductosA.getValueAt(i, 12)));
                    imp = imp+valorTotal;
                    sujeto = (sujeto+valorSujeto);
                }
                sujeto = sujeto - descuento + recarga - ice - excentos;
                labelDGImp.setVisible(true);
                labelSujeto.setVisible(true);
                labelDGImp.setText(Double.toString(imp));
                labelSujeto.setText(Double.toString(sujeto));
                labelImp.setVisible(false);
                //Fin
                if (comboTipPago.getSelectedItem().equals("CREDITO")) {
                    jTextField7.setText(Double.toString(sujeto));
                }
                comboCentroCosto.setSelectedItem("");
                textoProducto.setText("");
                textoLote.setText("");
                textoCU.setText("");
                textoCantidad.setText("");
                textImporte.setText("");
                
                

            }
            if (radioDescGeneral.isSelected() == false && radioPanelDescGene.isSelected() == false) {
                radioPanelDescGene.setSelected(true);
                panelExcedentes.setVisible(true);
                double panelDescuento =(textPanelDesc.getText().equals(""))? 0:Double.parseDouble(textPanelDesc.getText());
                double panelRecarga = (textPanelRecarga.getText().equals(""))? 0:Double.parseDouble(textPanelRecarga.getText());
                double panelIce =(textPaneIce.getText().equals(""))? 0:Double.parseDouble(textPaneIce.getText());
                double panelExcento =(textPanelExc.getText().equals(""))? 0:Double.parseDouble(textPanelExc.getText());

                if (!textoNuevoCCO.getText().equals("")) {
                    double subjetoDF = Double.parseDouble(importe)-panelDescuento+panelRecarga-panelIce-panelExcento ;
                    Object[] datos = {centroCostos,num,producto,codigo,unidadMedi,cu,cantidad,importe,panelDescuento,panelRecarga,panelIce,panelExcento,subjetoDF,fechaVenci,lote,eliminar};
                    num = num + 1;
                    modeloTabla.addRow(datos);
                }else{
                    double subjetoDF = Double.parseDouble(importe)-panelDescuento+panelRecarga-panelIce-panelExcento ;
                    Object[] datos = {centroCostos1,num,producto,codigo,unidadMedi,cu,cantidad,importe,panelDescuento,panelRecarga,panelIce,panelExcento,subjetoDF,fechaVenci,lote,eliminar};
                    num = num + 1;
                    modeloTabla.addRow(datos);
                }


                tablaProductosA.setModel(modeloTabla);
                tamañoTablaDescuentos();

                double imp = 0;
                double sujeto = 0;
                for (int i = 0; i < tablaProductosA.getRowCount(); i++) {
                    double valorTotal = Double.parseDouble(String.valueOf(tablaProductosA.getValueAt(i, 7)));
                    double valorSujeto = Double.parseDouble(String.valueOf(tablaProductosA.getValueAt(i, 12)));
                    imp = imp+valorTotal;
                    sujeto = (sujeto+valorSujeto);
                }
                labelImp.setVisible(true);
                labelSujeto.setVisible(true);
                labelImp.setText(Double.toString(imp));
                labelSujeto.setText(Double.toString(sujeto));
                labelDGImp.setVisible(false);
                if (comboTipPago.getSelectedItem().equals("CREDITO")) {
                    jTextField7.setText(Double.toString(sujeto));
                }
                
                textPanelDesc.setText("0");
                textPanelRecarga.setText("0");
                textPaneIce.setText("0");
                textPanelExc.setText("0");
                comboCentroCosto.setSelectedItem("");
                textoProducto.setText("");
                textoLote.setText("");
                textoCU.setText("");
                textoCantidad.setText("");
                textImporte.setText("");
            }  
        }else{
            JOptionPane.showMessageDialog(null, "<html>El producto ingresado no se encuentra <br>en el catalogo de productos.</html>");
        }
    }//GEN-LAST:event_jButton1ActionPerformed

    private void rapioPanelDescActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_rapioPanelDescActionPerformed
        
        if (rapioPanelDesc.isSelected() == true) {
            rapioPanelDesc.setText("%");
        }else if (rapioPanelDesc.isSelected() == false) {
            rapioPanelDesc.setText("Bs");
        }
    }//GEN-LAST:event_rapioPanelDescActionPerformed

    private void radioPanelRecActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_radioPanelRecActionPerformed
        if (radioPanelRec.isSelected() == true) {
            radioPanelRec.setText("%");
        }else if (radioPanelRec.isSelected() == false) {
            radioPanelRec.setText("Bs");
        }
    }//GEN-LAST:event_radioPanelRecActionPerformed

    private void tablaProductosAMouseClicked(java.awt.event.MouseEvent evt) {//GEN-FIRST:event_tablaProductosAMouseClicked
        int columna = tablaProductosA.getColumnModel().getColumnIndexAtX(evt.getX());
        int fila = evt.getY() / tablaProductosA.getRowHeight();
        String idProducto;
        boolean existe = false;
        int num = 1;
        if (fila < tablaProductosA.getRowCount() && fila >= 0 && columna < tablaProductosA.getColumnCount() && columna >= 0) {
            Object value = tablaProductosA.getValueAt(fila, columna);

            if (value instanceof JButton) {
                ((JButton) value).doClick();
                JButton botonAccion = (JButton) value;

                if (botonAccion.getName().equals("eliminar")) {
                    
                    modeloTabla.removeRow(fila);
                    
                    for (int i = 0; i < tablaProductosA.getRowCount(); i++) {
                        tablaProductosA.setValueAt(num, i, 1);
                        num = num+1;
                    }
                    if (radioDescGeneral.isSelected()==true) {
                        
                        double descuento = (textoDescuentos.getText().equals(""))? 0:Double.parseDouble(textoDescuentos.getText());
                        double recarga = (textoRecarga.getText().equals(""))? 0:Double.parseDouble(textoRecarga.getText());
                        double ice = (textoIce.getText().equals(""))? 0:Double.parseDouble(textoIce.getText());
                        double excentos = (textoExcentos.getText().equals(""))? 0:Double.parseDouble(textoExcentos.getText());
                        double imp = 0;
                        double sujeto = 0;
                        for (int i = 0; i < tablaProductosA.getRowCount(); i++) {
                            tablaProductosA.setValueAt(num, i, 1);
                            double valorTotal = Double.parseDouble(String.valueOf(tablaProductosA.getValueAt(i, 7)));
                            double valorSujeto = Double.parseDouble(String.valueOf(tablaProductosA.getValueAt(i, 12)));
                            imp = imp+valorTotal;
                            sujeto = (sujeto+valorSujeto);
                            num = num+1;
                        }
                        sujeto = sujeto - descuento + recarga - ice - excentos;
                        labelDGImp.setText(Double.toString(imp));
                        labelSujeto.setText(Double.toString(sujeto));
                        labelImp.setVisible(false);
             
                    }
                    if (radioPanelDescGene.isSelected() == true) {
                        double imp = 0;
                        double sujeto = 0;
                        for (int i = 0; i < tablaProductosA.getRowCount(); i++) {
                            double valorTotal = Double.parseDouble(String.valueOf(tablaProductosA.getValueAt(i, 6)));
                            double valorSujeto = Double.parseDouble(String.valueOf(tablaProductosA.getValueAt(i, 11)));
                            imp = imp+valorTotal;
                            sujeto = (sujeto+valorSujeto);
                        }
                        //sujeto = sujeto - descuento + recarga - ice - excentos;
                        labelImp.setText(Double.toString(imp));
                        labelSujeto.setText(Double.toString(sujeto));
                        labelDGImp.setVisible(false);
                    }
                }           
            }   
        }
    }//GEN-LAST:event_tablaProductosAMouseClicked

    private void textoCantidadActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_textoCantidadActionPerformed
        // TODO add your handling code here:
    }//GEN-LAST:event_textoCantidadActionPerformed

    private void textoCantidadKeyTyped(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_textoCantidadKeyTyped
        char c = evt.getKeyChar(); 
        if ((c<'0' || c>'9')) evt.consume();
    }//GEN-LAST:event_textoCantidadKeyTyped

    private void textoDescuentosKeyReleased(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_textoDescuentosKeyReleased
        double descuento = (textoDescuentos.getText().equals(""))? 0:Double.parseDouble(textoDescuentos.getText());
        double recarga = (textoRecarga.getText().equals(""))? 0:Double.parseDouble(textoRecarga.getText());
        double ice = (textoIce.getText().equals(""))? 0:Double.parseDouble(textoIce.getText());
        double excentos = (textoExcentos.getText().equals(""))? 0:Double.parseDouble(textoExcentos.getText());
        double imp = 0;
        double sujeto = 0;
        for (int i = 0; i < tablaProductosA.getRowCount(); i++) {
            double valorTotal = Double.parseDouble(String.valueOf(tablaProductosA.getValueAt(i, 7)));
            double valorSujeto = Double.parseDouble(String.valueOf(tablaProductosA.getValueAt(i, 12)));
            imp = imp+valorTotal;   
            sujeto = (sujeto+valorSujeto);
        }
        sujeto = sujeto - descuento + recarga - ice - excentos;
        labelDGImp.setText(Double.toString(imp));
        labelSujeto.setText(Double.toString(sujeto));
        
    }//GEN-LAST:event_textoDescuentosKeyReleased

    private void textoDescuentosActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_textoDescuentosActionPerformed
        // TODO add your handling code here:
    }//GEN-LAST:event_textoDescuentosActionPerformed

    private void textoRecargaKeyReleased(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_textoRecargaKeyReleased
        double descuento = (textoDescuentos.getText().equals(""))? 0:Double.parseDouble(textoDescuentos.getText());
        double recarga = (textoRecarga.getText().equals(""))? 0:Double.parseDouble(textoRecarga.getText());
        double ice = (textoIce.getText().equals(""))? 0:Double.parseDouble(textoIce.getText());
        double excentos = (textoExcentos.getText().equals(""))? 0:Double.parseDouble(textoExcentos.getText());
        double imp = 0;
        double sujeto = 0;
        for (int i = 0; i < tablaProductosA.getRowCount(); i++) {
            double valorTotal = Double.parseDouble(String.valueOf(tablaProductosA.getValueAt(i, 7)));
            double valorSujeto = Double.parseDouble(String.valueOf(tablaProductosA.getValueAt(i, 12)));
            imp = imp+valorTotal;   
            sujeto = (sujeto+valorSujeto);
        }
        sujeto = sujeto - descuento + recarga - ice - excentos;
        labelDGImp.setText(Double.toString(imp));
        labelSujeto.setText(Double.toString(sujeto));
        labelImp.setVisible(false);
    }//GEN-LAST:event_textoRecargaKeyReleased

    private void textoIceKeyReleased(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_textoIceKeyReleased
        double descuento = (textoDescuentos.getText().equals(""))? 0:Double.parseDouble(textoDescuentos.getText());
        double recarga = (textoRecarga.getText().equals(""))? 0:Double.parseDouble(textoRecarga.getText());
        double ice = (textoIce.getText().equals(""))? 0:Double.parseDouble(textoIce.getText());
        double excentos = (textoExcentos.getText().equals(""))? 0:Double.parseDouble(textoExcentos.getText());
        double imp = 0;
        double sujeto = 0;
        for (int i = 0; i < tablaProductosA.getRowCount(); i++) {
            double valorTotal = Double.parseDouble(String.valueOf(tablaProductosA.getValueAt(i, 7)));
            double valorSujeto = Double.parseDouble(String.valueOf(tablaProductosA.getValueAt(i, 12)));
            imp = imp+valorTotal;   
            sujeto = (sujeto+valorSujeto);
        }
        sujeto = sujeto - descuento + recarga - ice - excentos;
        labelDGImp.setText(Double.toString(imp));
        labelSujeto.setText(Double.toString(sujeto));
        labelImp.setVisible(false);
    }//GEN-LAST:event_textoIceKeyReleased

    private void textoExcentosKeyReleased(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_textoExcentosKeyReleased
        double descuento = (textoDescuentos.getText().equals(""))? 0:Double.parseDouble(textoDescuentos.getText());
        double recarga = (textoRecarga.getText().equals(""))? 0:Double.parseDouble(textoRecarga.getText());
        double ice = (textoIce.getText().equals(""))? 0:Double.parseDouble(textoIce.getText());
        double excentos = (textoExcentos.getText().equals(""))? 0:Double.parseDouble(textoExcentos.getText());
        double imp = 0;
        double sujeto = 0;
        for (int i = 0; i < tablaProductosA.getRowCount(); i++) {
            double valorTotal = Double.parseDouble(String.valueOf(tablaProductosA.getValueAt(i, 7)));
            double valorSujeto = Double.parseDouble(String.valueOf(tablaProductosA.getValueAt(i, 12)));
            imp = imp+valorTotal;   
            sujeto = (sujeto+valorSujeto);
        }
        sujeto = sujeto - descuento + recarga - ice - excentos;
        labelDGImp.setText(Double.toString(imp));
        labelSujeto.setText(Double.toString(sujeto));
        labelImp.setVisible(false);
    }//GEN-LAST:event_textoExcentosKeyReleased

    private void textPanelDescKeyTyped(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_textPanelDescKeyTyped
        char c = evt.getKeyChar();
        if (((c < '0') || (c > '9')) 
        && (c != KeyEvent.VK_BACK_SPACE)
        && (c != '.' || textPanelDesc.getText().contains(".")) ) {
            evt.consume();
        }
    }//GEN-LAST:event_textPanelDescKeyTyped

    private void textPanelRecargaKeyTyped(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_textPanelRecargaKeyTyped
         char c = evt.getKeyChar();
        if (((c < '0') || (c > '9')) 
        && (c != KeyEvent.VK_BACK_SPACE)
        && (c != '.' || textPanelRecarga.getText().contains(".")) ) {
            evt.consume();
        }
    }//GEN-LAST:event_textPanelRecargaKeyTyped

    private void textPaneIceKeyTyped(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_textPaneIceKeyTyped
        char c = evt.getKeyChar();
        if (((c < '0') || (c > '9')) 
        && (c != KeyEvent.VK_BACK_SPACE)
        && (c != '.' || textPaneIce.getText().contains(".")) ) {
            evt.consume();
        }
    }//GEN-LAST:event_textPaneIceKeyTyped

    private void textPanelExcKeyTyped(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_textPanelExcKeyTyped
        char c = evt.getKeyChar();
        if (((c < '0') || (c > '9')) 
        && (c != KeyEvent.VK_BACK_SPACE)
        && (c != '.' || textPanelExc.getText().contains(".")) ) {
            evt.consume();
        }
    }//GEN-LAST:event_textPanelExcKeyTyped

    private void jTextField7KeyReleased(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_jTextField7KeyReleased
        
    }//GEN-LAST:event_jTextField7KeyReleased

    private void jTextField9KeyReleased(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_jTextField9KeyReleased
  
    }//GEN-LAST:event_jTextField9KeyReleased

    private void textoACuentaKeyReleased(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_textoACuentaKeyReleased
        double total = 0;
        double aCuenta = (textoACuenta.getText().equals(""))? 0:Double.parseDouble(textoACuenta.getText());
        for (int i = 0; i < tablaProductosA.getRowCount(); i++) {
            double sujeto = Double.valueOf(String.valueOf(tablaProductosA.getValueAt(i, 12)));
            total = total + sujeto;
        }
        total = total - aCuenta;
        jTextField9.setText(Double.toString(total));
    }//GEN-LAST:event_textoACuentaKeyReleased

    private void textoDiasKeyReleased(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_textoDiasKeyReleased
        double total = 0;
        double aCuenta = (textoACuenta.getText().equals(""))? 0:Double.parseDouble(textoACuenta.getText());
        for (int i = 0; i < tablaProductosA.getRowCount(); i++) {
            double sujeto = Double.valueOf(String.valueOf(tablaProductosA.getValueAt(i, 12)));
            total = total + sujeto;
        }
        total = total;
        jTextField7.setText(Double.toString(total));
    }//GEN-LAST:event_textoDiasKeyReleased

    private void textoACuentaKeyPressed(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_textoACuentaKeyPressed
        // TODO add your handling code here:
    }//GEN-LAST:event_textoACuentaKeyPressed

    private void radioNuevoCCOActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_radioNuevoCCOActionPerformed
        boolean nuevoCCO = radioNuevoCCO.isSelected();
        if (nuevoCCO == true) {
            comboCentroCosto.setEnabled(false);
            textoNuevoCCO.setVisible(true);
        }else if (nuevoCCO == false) {
             comboCentroCosto.setEnabled(true);
            textoNuevoCCO.setVisible(false);
        }
    }//GEN-LAST:event_radioNuevoCCOActionPerformed

    private void textoProductoActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_textoProductoActionPerformed
        // TODO add your handling code here:
    }//GEN-LAST:event_textoProductoActionPerformed

    private void comboCentroCostoActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_comboCentroCostoActionPerformed
        // TODO add your handling code here:
    }//GEN-LAST:event_comboCentroCostoActionPerformed

    private void textoRecargaActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_textoRecargaActionPerformed
        // TODO add your handling code here:
    }//GEN-LAST:event_textoRecargaActionPerformed


    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JPanel PanelCredito;
    private javax.swing.JPanel PanelDescuGenerales;
    private javax.swing.JButton btnCancelar;
    private javax.swing.JButton btnGuardar;
    private javax.swing.JComboBox<String> comboAlmacen;
    private javax.swing.JComboBox<String> comboCentroCosto;
    private javax.swing.JComboBox<String> comboSucursal;
    private javax.swing.JComboBox<String> comboTipPago;
    private javax.swing.JButton jButton1;
    private javax.swing.JLabel jLabel1;
    private javax.swing.JLabel jLabel10;
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
    private javax.swing.JLabel jLabel34;
    private javax.swing.JLabel jLabel4;
    private javax.swing.JLabel jLabel5;
    private javax.swing.JLabel jLabel6;
    private javax.swing.JLabel jLabel7;
    private javax.swing.JLabel jLabel8;
    private javax.swing.JLabel jLabel9;
    private javax.swing.JPanel jPanel1;
    private javax.swing.JPanel jPanel2;
    private javax.swing.JPanel jPanel3;
    private javax.swing.JScrollPane jScrollPane1;
    private javax.swing.JScrollPane jScrollPane2;
    private javax.swing.JTextField jTextField7;
    private javax.swing.JTextField jTextField9;
    private com.toedter.calendar.JDateChooser jfecha;
    private javax.swing.JTextField labelDGImp;
    private javax.swing.JTextField labelImp;
    private javax.swing.JTextField labelSujeto;
    private javax.swing.JPanel panelExcedentes;
    private com.toedter.calendar.JDateChooser panelFecha;
    private javax.swing.JLabel radioDescGene;
    private javax.swing.JRadioButton radioDescGeneral;
    private javax.swing.JRadioButton radioDescuento;
    private javax.swing.JCheckBox radioNuevoCCO;
    private javax.swing.JRadioButton radioPanelDescGene;
    private javax.swing.JRadioButton radioPanelRec;
    private javax.swing.JRadioButton radioRecargas;
    private javax.swing.JRadioButton rapioPanelDesc;
    private javax.swing.JLabel requerido1;
    private javax.swing.JLabel requerido2;
    private javax.swing.JLabel requerido3;
    private javax.swing.JLabel requerido4;
    private javax.swing.JLabel requerido5;
    private javax.swing.JLabel requerido6;
    private javax.swing.JTable tablaProductosA;
    private javax.swing.JTextField textImporte;
    private javax.swing.JTextField textPaneIce;
    private javax.swing.JTextField textPanelDesc;
    private javax.swing.JTextField textPanelExc;
    private javax.swing.JTextField textPanelRecarga;
    private javax.swing.JTextField textoACuenta;
    private javax.swing.JTextField textoAutorizacion;
    private javax.swing.JTextField textoCU;
    private javax.swing.JTextField textoCantidad;
    private javax.swing.JTextField textoCodControl;
    private javax.swing.JTextField textoDescuentos;
    private javax.swing.JTextField textoDias;
    private javax.swing.JTextField textoExcentos;
    private javax.swing.JTextField textoFactura;
    private javax.swing.JTextField textoIce;
    private javax.swing.JTextField textoLote;
    private javax.swing.JTextField textoNit;
    private javax.swing.JTextField textoNuevoCCO;
    private javax.swing.JTextField textoProducto;
    private javax.swing.JTextField textoRazonSocial;
    private javax.swing.JTextField textoRecarga;
    private javax.swing.JTextField textoUniMedida;
    // End of variables declaration//GEN-END:variables
}
