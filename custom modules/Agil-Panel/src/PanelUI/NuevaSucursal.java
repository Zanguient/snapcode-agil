/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package PanelUI;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.swing.Icon;
import javax.swing.ImageIcon;
import javax.swing.JButton;
import javax.swing.JOptionPane;
import javax.swing.JTable;
import javax.swing.table.DefaultTableModel;
import modelo_Sucursal.*;
import models.Database;
import models.RenderTable;
import org.jdesktop.swingx.JXComboBox;
import org.jdesktop.swingx.autocomplete.AutoCompleteDecorator;

/**
 *
 * @author AGIL
 */
public class NuevaSucursal extends javax.swing.JDialog {
    public Database db = new Database();
    public int id_usuario;
    public int contVerif ;
    public Departamento depart = new Departamento();
    
    public int id_sucursal;
    
    public DefaultTableModel modeloTabla;
    public DefaultTableModel modeloTablaAct;
    
    public JButton editar;
    public ImageIcon imgEditar;
    public Icon iconEditar;
    
    public JButton eliminar;
    public ImageIcon imgEliminar;
    public Icon iconEliminar;
    
    public String nombreGlobal;
    
    public NuevaSucursal(java.awt.Frame parent, boolean modal,int id_usuario) {
        super(parent,modal);
        initComponents();
        setLocationRelativeTo(this);
        this.setTitle("Nueva Sucursal");
        this.id_usuario = id_usuario;
        depart.agregarDepartamentos(comboDepart);       
        AutoCompleteDecorator.decorate(comboActividad);
        //activi.agregarActividades(comboActividad);
        //dosifi.agregarDosificacion(comboDosificacion);
        optenerDosificacion();
        optenerActividades();
        
        btnEditar.setVisible(false);
        requerido1.setVisible(false);
        requerido2.setVisible(false);
        requerido3.setVisible(false);
        requerido4.setVisible(false);
        requerido5.setVisible(false);
        requerido6.setVisible(false);
        requerido7.setVisible(false);
        requerido8.setVisible(false);
        requerido9.setVisible(false);
        requerido10.setVisible(false);      
        requerido11.setVisible(false); 
        requerido12.setVisible(false); 
        
        String[] columnas = {"Nombre","Numero","Direccion","Telefono","Editar","Eliminar"}; 
        modeloTabla = new DefaultTableModel(null,columnas);
        
        String[] columnasAct = {"Actividad","Dosificación","Eliminar"}; 
        modeloTablaAct = new DefaultTableModel(null,columnasAct);
        
        
        tablaAlmacen.setDefaultRenderer(Object.class, new RenderTable());

        tablaActividades.setDefaultRenderer(Object.class, new RenderTable());
        insertarBotones();
    }
    
    public NuevaSucursal(java.awt.Frame parent, boolean modal,int id_sucursal,int id_usuario){
        super(parent,modal);
        initComponents();
        setLocationRelativeTo(this);
        this.id_sucursal = id_sucursal;
        this.id_usuario = id_usuario;

        depart.agregarDepartamentos(comboDepart);       
        AutoCompleteDecorator.decorate(comboActividad);
        optenerDosificacion();
        optenerActividades();
             
        btnEditar.setVisible(false);
        requerido1.setVisible(false);
        requerido2.setVisible(false);
        requerido3.setVisible(false);
        requerido4.setVisible(false);
        requerido5.setVisible(false);
        requerido6.setVisible(false);
        requerido7.setVisible(false);
        requerido8.setVisible(false);
        requerido9.setVisible(false); 
        requerido10.setVisible(false); 
        requerido11.setVisible(false); 
        requerido12.setVisible(false); 
        
        String[] columnas = {"Nombre","Numero","Direccion","Telefono","Editar","Eliminar"}; 
        modeloTabla = new DefaultTableModel(null,columnas);
        
        String[] columnasAct = {"Actividad","Dosificación","Eliminar"}; 
        modeloTablaAct = new DefaultTableModel(null,columnasAct);
        
        
        tablaAlmacen.setDefaultRenderer(Object.class, new RenderTable());

        tablaActividades.setDefaultRenderer(Object.class, new RenderTable());
        insertarBotones();
        
        obtenerDatos();
    }
    
    public void obtenerIdMunicipio(){
        ResultSet rs = null;
        String consulta = "";
        
    }
    
    public void actualizar(){
        contVerif = 0;
        verificar();
        if (contVerif == 0) {
            Date fe = new Date();
            long dd = fe.getTime();
            java.sql.Date fechaAct = new java.sql.Date(dd);   

            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            java.sql.Date fechaReinicio = null;

            Calendar fecha = Calendar.getInstance();
            int año = fecha.get(Calendar.YEAR);
            int mes = fecha.get(Calendar.MONTH) + 1;
            int dia = fecha.get(Calendar.DAY_OF_MONTH);

            String nombreSuc = textoNomSuc.getText();
            int numeroSucu = Integer.parseInt(textoNumSuc.getText());
            String direcSuc = textoDirecSuc.getText();
            String tele1Suc = textoTeleSuc.getText();
            String tele2Suc = textoTele2Suc.getText();
            String tele3Suc = textoTele3Suc.getText();
            Departamento depar =  (Departamento) comboDepart.getSelectedItem();
            int id_depart = depar.getId();
            Departamento munici = (Departamento) comboMunici.getSelectedItem();
            int id_munici = munici.getId();
            int numCorreVenta =  Integer.parseInt(textoNumCorreVenta.getText());
            int numCorreTrasp = Integer.parseInt(textoNumCorreTraspa.getText());
            int numCorreBaja = Integer.parseInt(textoNumCorreBaja.getText());
            int numCorrePedi = Integer.parseInt(textoNumCorrePedi.getText());
            int numCorreResibo = Integer.parseInt(textoNumeCorreResibo.getText());
            int numCorreCoti = Integer.parseInt(textoNumCorreCotiza.getText());
            int numCorrePreFact = Integer.parseInt(textoNumCorrePreFac.getText());

            int idEmpresa = 0;
            int telefo1Suc = 0;
            int telefo2Suc = 0;
            int telefo3Suc = 0;
            int copiasImprPedido = 0;
            String fasePedido = "";
            int impPedidoCorto = 0;
            ResultSet rs = db.seleccionar("SELECT EMPRESA FROM USUARIO WHERE ID = "+this.id_usuario);
            try {
                while (rs.next()) {                
                    idEmpresa = rs.getInt(1);
                }
            } catch (Exception e) {
                System.out.println("Error al recoger el id empresa de sucursal:"+e);
            }

            if (!tele1Suc.equals("")) {
                telefo1Suc = Integer.parseInt(tele1Suc);
            }
            if (!tele2Suc.equals("")) {
                telefo2Suc = Integer.parseInt(tele2Suc);
            }
            if (!tele3Suc.equals("")) {
                telefo3Suc = Integer.parseInt(tele3Suc);
            }

            try {
                Date fechaRei = sdf.parse(año+"-"+mes+"-"+"01");
                Long d = fechaRei.getTime();
                fechaReinicio = new java.sql.Date(d);

            } catch (ParseException ex) {
                Logger.getLogger(NuevaSucursal.class.getName()).log(Level.SEVERE, null, ex);
            }
 
            db.actualizarSucursalSuc(this.id_sucursal, idEmpresa, nombreSuc, numeroSucu, direcSuc, telefo1Suc, telefo2Suc, telefo3Suc, id_depart, id_munici, fechaAct, numCorreVenta, numCorreTrasp, numCorreBaja, numCorrePedi, copiasImprPedido, fasePedido, numCorreResibo, impPedidoCorto, numCorreCoti, numCorrePreFact, fechaReinicio);
           // db.insertarSucursalSuc(idEmpresa, nombreSuc, numeroSucu, direcSuc, telefo1Suc, telefo2Suc, telefo3Suc, id_depart, id_munici, fechaAct, fechaAct, numCorreVenta, numCorreTrasp, numCorreBaja, numCorrePedi, copiasImprPedido, fasePedido, numCorreResibo, impPedidoCorto, numCorreCoti, numCorrePreFact, fechaAct);
            //int id_sucursal = db.seleccionarUltimoIdSucursal();
            String nombreAl = "";
            String numAl = "";
            int numero;
            String direccion = "";
            String telefono = "";
            
            String eliminar = "DELETE FROM APP.ALMACEN WHERE SUCURSAL = "+this.id_sucursal;
            db.eliminarProductos(eliminar);
            
            for (int i = 0; i < tablaAlmacen.getRowCount(); i++) {
                
                nombreAl = (String) tablaAlmacen.getValueAt(i, 0);
                if(nombreAl == null){nombreAl = "";}               
                numAl  = (String) tablaAlmacen.getValueAt(i, 1);
                if(numAl == null){numero = 0;}else{numero = Integer.parseInt(numAl);}
                direccion = (String) tablaAlmacen.getValueAt(i, 2);
                if(direccion == null){direccion = "";}    
                telefono = (String) tablaAlmacen.getValueAt(i, 3);
                if(telefono == null){telefono = "";}
                int idAlmacen = 0;
                    db.insertarAlmacenSuc(this.id_sucursal, nombreAl, numero, direccion, telefono, fechaAct, fechaAct);
                //    db.actualizarAlmacenSuc(idAlmacen, this.id_sucursal, nombreAl, numero, direccion,telefono, fechaAct);
            }
            
            
            String eliminarSucAct = "DELETE FROM APP.SUCURSAL_ACTIVIDAD_DOSIFICACION WHERE SUCURSAL = "+this.id_sucursal;
            db.eliminarProductos(eliminarSucAct);
            
            String fechaActString = sdf.format(fechaAct);
            for (int i = 0; i < tablaActividades.getRowCount(); i++) {
                String actividades = (String) tablaActividades.getValueAt(i, 0);
                String dosificacion = (String) tablaActividades.getValueAt(i, 1);
                int id_actividad = actividades(actividades);
                int id_dosificacion = dosificaciones(dosificacion);
                
               // db.actualizarSucursalActividadDosificacion(, this.id_sucursal, id_actividad, id_dosificacion, nombreAl);
                db.insertarSucursalActividadDosificacion(this.id_sucursal, id_actividad, id_dosificacion, fechaActString, fechaActString,false);
            } 
            limpiarFormulario();
            
            dispose();
        }else{
            JOptionPane.showMessageDialog(null, "Ingrese los campos requeridos");
        }
    } 
    
    public void obtenerDatos(){
        ResultSet rs = null;
        String consulta = "SELECT S.NOMBRE,S.NUMERO,S.DIRECCION,S.TELEFONO1,S.TELEFONO2,S.TELEFONO3,DEP.NOMBRE,MUN.NOMBRE,\n" +
            "S.NOTA_VENTA_CORRELATIVO,S.NOTA_TRASPASO_CORRELATIVO,S.NOTA_BAJA_CORRELATIVO,S.PEDIDO_CORRELATIVO,\n" +
            "S.NOTA_RECIBO_CORRELATIVO,S.COTIZACION_CORRELATIVO,S.PRE_FACTURA_CORRELATIVO\n" +
            "FROM APP.SUCURSAL AS S\n" +
            "LEFT JOIN CLASE AS DEP ON DEP.ID = S.DEPARTAMENTO\n" +
            "LEFT JOIN CLASE AS MUN ON MUN.ID = S.MUNICIPIO\n" +
            "WHERE S.ID = "+this.id_sucursal;
        try {
            rs = db.seleccionar(consulta);
            while(rs.next()){
               textoNomSuc.setText(rs.getString(1));
               textoNumSuc.setText(Integer.toString(rs.getInt(2)));
               textoDirecSuc.setText(rs.getString(3));
               textoTeleSuc.setText(rs.getString(4));
               textoTele2Suc.setText(rs.getString(5));
               textoTele3Suc.setText(rs.getString(6));
               comboDepart.setSelectedItem(rs.getString(7));
               comboMunici.setSelectedItem(rs.getString(8));
               textoNumCorreVenta.setText(Integer.toString(rs.getInt(9)));
               textoNumCorreTraspa.setText(Integer.toString(rs.getInt(10)));
               textoNumCorreBaja.setText(Integer.toString(rs.getInt(11)));
               textoNumCorrePedi.setText(Integer.toString(rs.getInt(12)));
               textoNumeCorreResibo.setText(Integer.toString(rs.getInt(13)));
               textoNumCorreCotiza.setText(Integer.toString(rs.getInt(14)));
               textoNumCorrePreFac.setText(Integer.toString(rs.getInt(15)));    
            }
        } catch (Exception e) {
            System.out.println("Error al optener los datos editados en sucursal "+e);
        }
        int existe = 0;
        String veriConsulta = "SELECT A.NOMBRE, A.NUMERO,A.DIRECCION,A.TELEFONO\n" +
            "FROM APP.ALMACEN AS A\n" +
            "WHERE SUCURSAL = "+this.id_sucursal;
        try {
            rs = db.seleccionar(veriConsulta);
            if (rs.next()) {
                existe = 0;
            }else{
                existe++;
            }
            
            if (existe == 0) {
                String consulta2 = "SELECT A.NOMBRE, A.NUMERO,A.DIRECCION,A.TELEFONO\n" +
                "FROM APP.ALMACEN AS A\n" +
                "WHERE SUCURSAL = "+this.id_sucursal;
                rs = db.seleccionar(consulta2);
                while (rs.next()) {                    
                    String nombre = rs.getString(1);
                    String numero = Integer.toString(rs.getInt(2));
                    String direccion = rs.getString(3);
                    String telefono = rs.getString(4);
                    
                    Object[] dato = {nombre,numero,direccion,telefono,editar,eliminar};
                    modeloTabla.addRow(dato);
                }
                tablaAlmacen.setModel(modeloTabla);
            }          
        } catch (Exception e) {
            System.out.println("Error al optener el almacen "+e);
        }
        
        String consulta3 = "SELECT C.NOMBRE, D.AUTORIZACION\n" +
            "FROM SUCURSAL_ACTIVIDAD_DOSIFICACION AS S\n" +
            "INNER JOIN CLASE AS C ON S.ACTIVIDAD = C.ID\n" +
            "INNER JOIN DOSIFICACION AS D ON D.ID = S.DOSIFICACION\n" +
            "WHERE S.SUCURSAL = "+this.id_sucursal;
        try {
            rs = db.seleccionar(consulta3);
            while (rs.next()) {                
                String nombreDosif = rs.getString(1);
                String autorizar = (String) rs.getBigDecimal(2).toString();
                Object[] dato = {nombreDosif,autorizar,eliminar};
                modeloTablaAct.addRow(dato);
            }
            tablaActividades.setModel(modeloTablaAct);
        } catch (Exception e) {
            System.out.println("Error al optener las actividades y dosificaciones "+e);
        }
    }
    
    public void optenerActividades(){
        ResultSet rs = null;
        boolean habilitado = true;
        String consulta = "SELECT ID, NOMBRE, NOMBRE_CORTO \n" +
            "FROM CLASE \n" +
            "WHERE ID_TIPO = "+3+" AND HABILITADO = "+habilitado;
        try {          
            rs = db.seleccionar(consulta);
            while (rs.next()) {                
              comboActividad.addItem(rs.getString(2));
            }
        } catch (Exception e) {
            System.out.println("Error "+e);
        }      
    }
    
    public void optenerDosificacion(){
        ResultSet rs = null;
        boolean habilitado = true;
        String consulta = "SELECT D.ID, D.AUTORIZACION \n" +
            "FROM USUARIO AS U\n" +
            "INNER JOIN DOSIFICACION AS D ON D.EMPRESA = U.EMPRESA\n" +
            "WHERE U.ID = "+this.id_usuario+" AND D.EXPIRADO = "+false+" AND D.ELIMINADO = "+false+" AND D.ID NOT IN(SELECT DOSIFICACION FROM SUCURSAL_ACTIVIDAD_DOSIFICACION AS SAD)" ;
        try {          
            rs = db.seleccionar(consulta);
            while (rs.next()) {                
             comboDosificacion.addItem(rs.getString(2));
            }
        } catch (Exception e) {
            System.out.println("Error "+e);
        }finally{
            try {
                rs.close();
                db.Conectar().close();
            } catch (SQLException ex) {
                ex.printStackTrace();
            }
        }
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
        tablaAlmacen.setRowHeight(33);
        tablaActividades.setRowHeight(33);
    }
    
    public void verificar(){
        contVerif = 0;
        Departamento munici = (Departamento) comboMunici.getSelectedItem();
        ;
        if (textoNomSuc.getText().equals("")) {requerido1.setVisible(true); contVerif++;}else{requerido1.setVisible(false);}
        if (textoNumCorreVenta.getText().equals("")) {requerido2.setVisible(true); contVerif++;}else{requerido2.setVisible(false);}
        if (textoNumSuc.getText().equals("")) {requerido3.setVisible(true); contVerif++;}else{requerido3.setVisible(false);}
        if (textoNumCorreTraspa.getText().equals("")) {requerido4.setVisible(true); contVerif++;}else{requerido4.setVisible(false);}
        if (textoNumCorreBaja.getText().equals("")) {requerido5.setVisible(true); contVerif++;}else{requerido5.setVisible(false);}
        if (textoNumCorrePedi.getText().equals("")) {requerido6.setVisible(true); contVerif++;}else{requerido6.setVisible(false);}
        if (textoNumCorreCotiza.getText().equals("")) {requerido7.setVisible(true); contVerif++;}else{requerido7.setVisible(false);}
        if (textoNumCorrePreFac.getText().equals("")) {requerido8.setVisible(true); contVerif++;}else{requerido8.setVisible(false);}
        if (textoNumeCorreResibo.getText().equals("")) {requerido9.setVisible(true); contVerif++;}else{requerido9.setVisible(false);}
        int tam = tablaAlmacen.getRowCount();
        if (tam == 0){requerido10.setVisible(true); contVerif++;}else{requerido10.setVisible(false);}
        if (comboDepart.getSelectedItem().equals(" ")) {requerido11.setVisible(true);contVerif++;} else {requerido11.setVisible(false);}
        if (munici == null) {requerido12.setVisible(true);contVerif++;} else {requerido12.setVisible(false);}
    }
    
    public int actividades(String nombre){
        int id_actividad = 0;
        if(nombre.equals(" ")){
            id_actividad = 0;
        }else{
            ResultSet rs = null;
            try {
                rs = db.seleccionar("SELECT ID FROM APP.CLASE WHERE NOMBRE ='"+nombre+"'");
                while(rs.next()){
                    id_actividad = rs.getInt(1);
                }
            } catch (Exception e) {
                System.out.println("Error al seleccionar el id de la actividad "+e);
            }
        }
        return id_actividad;
    }
    
    public int dosificaciones(String nombre){
        int id_dosifica = 0;
        if(nombre.equals(" ")){
            id_dosifica = 0;
        }else{
            java.math.BigInteger autoriza = new java.math.BigInteger(nombre);

            ResultSet rs = null;
            try {
                rs = db.seleccionar("SELECT ID FROM APP.DOSIFICACION WHERE AUTORIZACION = "+autoriza);
                while(rs.next()){
                    id_dosifica = rs.getInt(1);
                }
            } catch (Exception e) {
                System.out.println("Error al seleccionar el id de la dosificacion "+e);
            }
        }
        return id_dosifica;
    }
    
    public void limpiarFormulario(){
        textoNomSuc.setText("");
        textoNumSuc.setText("");
        textoDirecAlma.setText("");
        textoTeleSuc.setText("");
        textoTele2Suc.setText("");
        textoTele3Suc.setText("");
        comboDepart.setSelectedItem("COCHABAMBA");
        textoNumCorreVenta.setText("");
        textoNumCorreTraspa.setText("");
        textoNumCorreBaja.setText("");
        textoNumCorrePedi.setText("");
        textoNumCorreCotiza.setText("");
        textoNumeCorreResibo.setText("");
        textoNumCorrePreFac.setText("");
        textoNomAlma.setText("");
        textoNumAlma.setText("");
        textoDirecAlma.setText("");
        textoTeleAlma.setText("");
        for (int i = 0; i < tablaAlmacen.getRowCount(); i++) {
            modeloTabla.removeRow(i);
        }
        for (int i = 0; i < tablaActividades.getRowCount(); i++) {
            modeloTablaAct.removeRow(i);
        }
        JOptionPane.showMessageDialog(null, "Guardado Exitosamente");
    }
    
    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        jScrollPane1 = new javax.swing.JScrollPane();
        jPanel1 = new javax.swing.JPanel();
        jLabel1 = new javax.swing.JLabel();
        jLabel2 = new javax.swing.JLabel();
        textoNomSuc = new javax.swing.JTextField();
        jLabel3 = new javax.swing.JLabel();
        textoNumSuc = new javax.swing.JTextField();
        jLabel4 = new javax.swing.JLabel();
        textoDirecSuc = new javax.swing.JTextField();
        jLabel5 = new javax.swing.JLabel();
        textoTeleSuc = new javax.swing.JTextField();
        jLabel6 = new javax.swing.JLabel();
        jLabel7 = new javax.swing.JLabel();
        textoTele2Suc = new javax.swing.JTextField();
        jLabel8 = new javax.swing.JLabel();
        textoTele3Suc = new javax.swing.JTextField();
        comboDepart = new javax.swing.JComboBox<>();
        jLabel9 = new javax.swing.JLabel();
        comboMunici = new javax.swing.JComboBox<>();
        jLabel10 = new javax.swing.JLabel();
        jLabel11 = new javax.swing.JLabel();
        textoNumCorreVenta = new javax.swing.JTextField();
        jLabel12 = new javax.swing.JLabel();
        textoNumCorreTraspa = new javax.swing.JTextField();
        jLabel13 = new javax.swing.JLabel();
        textoNumCorreBaja = new javax.swing.JTextField();
        jLabel14 = new javax.swing.JLabel();
        textoNumCorrePedi = new javax.swing.JTextField();
        jLabel15 = new javax.swing.JLabel();
        textoNumCorreCotiza = new javax.swing.JTextField();
        jLabel16 = new javax.swing.JLabel();
        textoNumCorrePreFac = new javax.swing.JTextField();
        requerido1 = new javax.swing.JLabel();
        requerido2 = new javax.swing.JLabel();
        jLabel17 = new javax.swing.JLabel();
        jLabel18 = new javax.swing.JLabel();
        textoNomAlma = new javax.swing.JTextField();
        jLabel19 = new javax.swing.JLabel();
        textoNumAlma = new javax.swing.JTextField();
        jLabel20 = new javax.swing.JLabel();
        textoDirecAlma = new javax.swing.JTextField();
        jLabel21 = new javax.swing.JLabel();
        textoTeleAlma = new javax.swing.JTextField();
        jScrollPane2 = new javax.swing.JScrollPane();
        tablaAlmacen = new JTable(){
            public boolean isCellEditable(int rowIndex, int colIndex) {
                return colIndex != 0 && colIndex != 1 && colIndex != 2 
                && colIndex != 3 && colIndex != 4 && colIndex != 5;
            }
        };
        btnAdd = new javax.swing.JButton();
        jLabel22 = new javax.swing.JLabel();
        comboActividad = new javax.swing.JComboBox<>();
        jLabel23 = new javax.swing.JLabel();
        comboDosificacion = new javax.swing.JComboBox<>();
        guardar = new javax.swing.JButton();
        cancelar = new javax.swing.JButton();
        jLabel24 = new javax.swing.JLabel();
        btnEditar = new javax.swing.JButton();
        requerido3 = new javax.swing.JLabel();
        requerido4 = new javax.swing.JLabel();
        requerido5 = new javax.swing.JLabel();
        requerido6 = new javax.swing.JLabel();
        requerido7 = new javax.swing.JLabel();
        requerido8 = new javax.swing.JLabel();
        jLabel25 = new javax.swing.JLabel();
        textoNumeCorreResibo = new javax.swing.JTextField();
        requerido9 = new javax.swing.JLabel();
        jScrollPane3 = new javax.swing.JScrollPane();
        tablaActividades = new JTable(){
            public boolean isCellEditable(int rowIndex, int colIndex) {
                return colIndex != 0 && colIndex != 1 && colIndex != 2 ;

            }
        };
        btnAddAlmacen = new javax.swing.JButton();
        requerido10 = new javax.swing.JLabel();
        requerido11 = new javax.swing.JLabel();
        requerido12 = new javax.swing.JLabel();

        setDefaultCloseOperation(javax.swing.WindowConstants.DO_NOTHING_ON_CLOSE);

        jScrollPane1.setBackground(new java.awt.Color(255, 255, 255));
        jScrollPane1.setHorizontalScrollBar(null);

        jPanel1.setBackground(new java.awt.Color(255, 255, 255));

        jLabel1.setFont(new java.awt.Font("Arial", 1, 14)); // NOI18N
        jLabel1.setForeground(new java.awt.Color(66, 139, 202));
        jLabel1.setText("Datos de la Sucursal");

        jLabel2.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel2.setForeground(new java.awt.Color(66, 139, 202));
        jLabel2.setText("Nombre Sucursal");

        jLabel3.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel3.setForeground(new java.awt.Color(66, 139, 202));
        jLabel3.setText("Número Sucursal");

        textoNumSuc.addKeyListener(new java.awt.event.KeyAdapter() {
            public void keyTyped(java.awt.event.KeyEvent evt) {
                textoNumSucKeyTyped(evt);
            }
        });

        jLabel4.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel4.setForeground(new java.awt.Color(66, 139, 202));
        jLabel4.setText("Dirección");

        jLabel5.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel5.setForeground(new java.awt.Color(66, 139, 202));
        jLabel5.setText("Teléfono");

        textoTeleSuc.addKeyListener(new java.awt.event.KeyAdapter() {
            public void keyTyped(java.awt.event.KeyEvent evt) {
                textoTeleSucKeyTyped(evt);
            }
        });

        jLabel6.setFont(new java.awt.Font("Arial", 1, 14)); // NOI18N
        jLabel6.setForeground(new java.awt.Color(66, 139, 202));
        jLabel6.setText("Datos Adicionales");

        jLabel7.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel7.setForeground(new java.awt.Color(66, 139, 202));
        jLabel7.setText("Telefono2");

        textoTele2Suc.addKeyListener(new java.awt.event.KeyAdapter() {
            public void keyTyped(java.awt.event.KeyEvent evt) {
                textoTele2SucKeyTyped(evt);
            }
        });

        jLabel8.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel8.setForeground(new java.awt.Color(66, 139, 202));
        jLabel8.setText("Telefono3");

        textoTele3Suc.addKeyListener(new java.awt.event.KeyAdapter() {
            public void keyTyped(java.awt.event.KeyEvent evt) {
                textoTele3SucKeyTyped(evt);
            }
        });

        comboDepart.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                comboDepartActionPerformed(evt);
            }
        });

        jLabel9.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel9.setForeground(new java.awt.Color(66, 139, 202));
        jLabel9.setText("Departamento");

        comboMunici.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                comboMuniciActionPerformed(evt);
            }
        });

        jLabel10.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel10.setForeground(new java.awt.Color(66, 139, 202));
        jLabel10.setText("Municipio");

        jLabel11.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel11.setForeground(new java.awt.Color(66, 139, 202));
        jLabel11.setText("Número Correlativo Venta");

        textoNumCorreVenta.addKeyListener(new java.awt.event.KeyAdapter() {
            public void keyTyped(java.awt.event.KeyEvent evt) {
                textoNumCorreVentaKeyTyped(evt);
            }
        });

        jLabel12.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel12.setForeground(new java.awt.Color(66, 139, 202));
        jLabel12.setText("Número Correlativo Traspaso");

        textoNumCorreTraspa.addKeyListener(new java.awt.event.KeyAdapter() {
            public void keyTyped(java.awt.event.KeyEvent evt) {
                textoNumCorreTraspaKeyTyped(evt);
            }
        });

        jLabel13.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel13.setForeground(new java.awt.Color(66, 139, 202));
        jLabel13.setText("Número Correlativo Baja");

        textoNumCorreBaja.addKeyListener(new java.awt.event.KeyAdapter() {
            public void keyTyped(java.awt.event.KeyEvent evt) {
                textoNumCorreBajaKeyTyped(evt);
            }
        });

        jLabel14.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel14.setForeground(new java.awt.Color(66, 139, 202));
        jLabel14.setText("Número Correlativo Pedido");

        textoNumCorrePedi.addKeyListener(new java.awt.event.KeyAdapter() {
            public void keyTyped(java.awt.event.KeyEvent evt) {
                textoNumCorrePediKeyTyped(evt);
            }
        });

        jLabel15.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel15.setForeground(new java.awt.Color(66, 139, 202));
        jLabel15.setText("Número Correlativo Cotización");

        jLabel16.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel16.setForeground(new java.awt.Color(66, 139, 202));
        jLabel16.setText("Número Correlativo Pre-Factura");

        requerido1.setFont(new java.awt.Font("Arial", 0, 11)); // NOI18N
        requerido1.setForeground(new java.awt.Color(255, 51, 51));
        requerido1.setText("Requerido");

        requerido2.setFont(new java.awt.Font("Arial", 0, 11)); // NOI18N
        requerido2.setForeground(new java.awt.Color(255, 51, 51));
        requerido2.setText("Requerido");

        jLabel17.setFont(new java.awt.Font("Arial", 1, 14)); // NOI18N
        jLabel17.setForeground(new java.awt.Color(66, 139, 202));
        jLabel17.setText("Datos Almacen");

        jLabel18.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel18.setForeground(new java.awt.Color(66, 139, 202));
        jLabel18.setText("Nombre Almacen");

        jLabel19.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel19.setForeground(new java.awt.Color(66, 139, 202));
        jLabel19.setText("Número Almacen");

        textoNumAlma.addKeyListener(new java.awt.event.KeyAdapter() {
            public void keyTyped(java.awt.event.KeyEvent evt) {
                textoNumAlmaKeyTyped(evt);
            }
        });

        jLabel20.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel20.setForeground(new java.awt.Color(66, 139, 202));
        jLabel20.setText("Dirección");

        jLabel21.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel21.setForeground(new java.awt.Color(66, 139, 202));
        jLabel21.setText("Telefono");

        textoTeleAlma.addKeyListener(new java.awt.event.KeyAdapter() {
            public void keyTyped(java.awt.event.KeyEvent evt) {
                textoTeleAlmaKeyTyped(evt);
            }
        });

        tablaAlmacen.setModel(new javax.swing.table.DefaultTableModel(
            new Object [][] {

            },
            new String [] {
                "Nombre", "Numero", "Direccion", "Telefono", "Editar", "Eliminar"
            }
        ));
        tablaAlmacen.addMouseListener(new java.awt.event.MouseAdapter() {
            public void mouseClicked(java.awt.event.MouseEvent evt) {
                tablaAlmacenMouseClicked(evt);
            }
        });
        jScrollPane2.setViewportView(tablaAlmacen);

        btnAdd.setBackground(new java.awt.Color(27, 106, 170));
        btnAdd.setFont(new java.awt.Font("Arial", 0, 11)); // NOI18N
        btnAdd.setForeground(new java.awt.Color(255, 255, 255));
        btnAdd.setIcon(new javax.swing.ImageIcon(getClass().getResource("/imagen/addition-white.png"))); // NOI18N
        btnAdd.setBorder(javax.swing.BorderFactory.createLineBorder(new java.awt.Color(66, 139, 202)));
        btnAdd.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                btnAddActionPerformed(evt);
            }
        });

        jLabel22.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel22.setForeground(new java.awt.Color(66, 139, 202));
        jLabel22.setText("Actividad");

        comboActividad.setModel(new javax.swing.DefaultComboBoxModel<>(new String[] { " " }));
        comboActividad.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                comboActividadActionPerformed(evt);
            }
        });

        jLabel23.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel23.setForeground(new java.awt.Color(66, 139, 202));
        jLabel23.setText("Dosificación");

        comboDosificacion.setModel(new javax.swing.DefaultComboBoxModel<>(new String[] { " " }));

        guardar.setBackground(new java.awt.Color(98, 155, 88));
        guardar.setFont(new java.awt.Font("Arial", 0, 11)); // NOI18N
        guardar.setForeground(new java.awt.Color(255, 255, 255));
        guardar.setText("Guardar");
        guardar.setBorder(javax.swing.BorderFactory.createLineBorder(new java.awt.Color(135, 184, 127)));
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

        jLabel24.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel24.setForeground(new java.awt.Color(66, 139, 202));
        jLabel24.setText("Almacenes");

        btnEditar.setBackground(new java.awt.Color(27, 106, 170));
        btnEditar.setFont(new java.awt.Font("Arial", 0, 11)); // NOI18N
        btnEditar.setForeground(new java.awt.Color(255, 255, 255));
        btnEditar.setIcon(new javax.swing.ImageIcon(getClass().getResource("/imagen/addition-white.png"))); // NOI18N
        btnEditar.setText("Editar");
        btnEditar.setBorder(javax.swing.BorderFactory.createLineBorder(new java.awt.Color(66, 139, 202)));
        btnEditar.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                btnEditarActionPerformed(evt);
            }
        });

        requerido3.setFont(new java.awt.Font("Arial", 0, 11)); // NOI18N
        requerido3.setForeground(new java.awt.Color(255, 51, 51));
        requerido3.setText("Requerido");

        requerido4.setFont(new java.awt.Font("Arial", 0, 11)); // NOI18N
        requerido4.setForeground(new java.awt.Color(255, 51, 51));
        requerido4.setText("Requerido");

        requerido5.setFont(new java.awt.Font("Arial", 0, 11)); // NOI18N
        requerido5.setForeground(new java.awt.Color(255, 51, 51));
        requerido5.setText("Requerido");

        requerido6.setFont(new java.awt.Font("Arial", 0, 11)); // NOI18N
        requerido6.setForeground(new java.awt.Color(255, 51, 51));
        requerido6.setText("Requerido");

        requerido7.setFont(new java.awt.Font("Arial", 0, 11)); // NOI18N
        requerido7.setForeground(new java.awt.Color(255, 51, 51));
        requerido7.setText("Requerido");

        requerido8.setFont(new java.awt.Font("Arial", 0, 11)); // NOI18N
        requerido8.setForeground(new java.awt.Color(255, 51, 51));
        requerido8.setText("Requerido");

        jLabel25.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel25.setForeground(new java.awt.Color(66, 139, 202));
        jLabel25.setText("Número Correlativo Recibo");

        requerido9.setFont(new java.awt.Font("Arial", 0, 11)); // NOI18N
        requerido9.setForeground(new java.awt.Color(255, 51, 51));
        requerido9.setText("Requerido");

        tablaActividades.setModel(new javax.swing.table.DefaultTableModel(
            new Object [][] {

            },
            new String [] {
                "Actividad", "Dosificación", "Eliminar"
            }
        ));
        tablaActividades.addMouseListener(new java.awt.event.MouseAdapter() {
            public void mouseClicked(java.awt.event.MouseEvent evt) {
                tablaActividadesMouseClicked(evt);
            }
        });
        jScrollPane3.setViewportView(tablaActividades);

        btnAddAlmacen.setBackground(new java.awt.Color(27, 106, 170));
        btnAddAlmacen.setFont(new java.awt.Font("Arial", 0, 11)); // NOI18N
        btnAddAlmacen.setForeground(new java.awt.Color(255, 255, 255));
        btnAddAlmacen.setIcon(new javax.swing.ImageIcon(getClass().getResource("/imagen/addition-white.png"))); // NOI18N
        btnAddAlmacen.setBorder(javax.swing.BorderFactory.createLineBorder(new java.awt.Color(66, 139, 202)));
        btnAddAlmacen.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                btnAddAlmacenActionPerformed(evt);
            }
        });

        requerido10.setFont(new java.awt.Font("Arial", 0, 11)); // NOI18N
        requerido10.setForeground(new java.awt.Color(255, 51, 51));
        requerido10.setText("Requerido");

        requerido11.setFont(new java.awt.Font("Arial", 0, 11)); // NOI18N
        requerido11.setForeground(new java.awt.Color(255, 51, 51));
        requerido11.setText("Requerido");

        requerido12.setFont(new java.awt.Font("Arial", 0, 11)); // NOI18N
        requerido12.setForeground(new java.awt.Color(255, 51, 51));
        requerido12.setText("Requerido");

        javax.swing.GroupLayout jPanel1Layout = new javax.swing.GroupLayout(jPanel1);
        jPanel1.setLayout(jPanel1Layout);
        jPanel1Layout.setHorizontalGroup(
            jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel1Layout.createSequentialGroup()
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(jPanel1Layout.createSequentialGroup()
                        .addContainerGap()
                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(jLabel1)
                            .addGroup(jPanel1Layout.createSequentialGroup()
                                .addComponent(jLabel4)
                                .addGap(147, 147, 147)
                                .addComponent(jLabel5))
                            .addGroup(jPanel1Layout.createSequentialGroup()
                                .addComponent(textoDirecSuc, javax.swing.GroupLayout.PREFERRED_SIZE, 180, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addGap(18, 18, 18)
                                .addComponent(textoTeleSuc, javax.swing.GroupLayout.PREFERRED_SIZE, 110, javax.swing.GroupLayout.PREFERRED_SIZE))
                            .addComponent(jLabel6)
                            .addGroup(jPanel1Layout.createSequentialGroup()
                                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addComponent(textoTele2Suc, javax.swing.GroupLayout.PREFERRED_SIZE, 110, javax.swing.GroupLayout.PREFERRED_SIZE)
                                    .addComponent(jLabel7))
                                .addGap(18, 18, 18)
                                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addComponent(textoTele3Suc, javax.swing.GroupLayout.PREFERRED_SIZE, 110, javax.swing.GroupLayout.PREFERRED_SIZE)
                                    .addComponent(jLabel8))
                                .addGap(18, 18, 18)
                                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addComponent(jLabel9)
                                    .addComponent(comboDepart, javax.swing.GroupLayout.PREFERRED_SIZE, 143, javax.swing.GroupLayout.PREFERRED_SIZE)
                                    .addComponent(requerido11))
                                .addGap(34, 34, 34)
                                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addComponent(jLabel10)
                                    .addComponent(comboMunici, javax.swing.GroupLayout.PREFERRED_SIZE, 140, javax.swing.GroupLayout.PREFERRED_SIZE)
                                    .addComponent(requerido12)))
                            .addGroup(jPanel1Layout.createSequentialGroup()
                                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addComponent(textoNomSuc, javax.swing.GroupLayout.PREFERRED_SIZE, 105, javax.swing.GroupLayout.PREFERRED_SIZE)
                                    .addComponent(jLabel2)
                                    .addComponent(requerido1))
                                .addGap(18, 18, 18)
                                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addComponent(requerido3)
                                    .addComponent(jLabel3)
                                    .addComponent(textoNumSuc, javax.swing.GroupLayout.PREFERRED_SIZE, 101, javax.swing.GroupLayout.PREFERRED_SIZE)))))
                    .addGroup(jPanel1Layout.createSequentialGroup()
                        .addGap(413, 413, 413)
                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(cancelar, javax.swing.GroupLayout.PREFERRED_SIZE, 71, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addGroup(jPanel1Layout.createSequentialGroup()
                                .addGap(174, 174, 174)
                                .addComponent(guardar, javax.swing.GroupLayout.PREFERRED_SIZE, 74, javax.swing.GroupLayout.PREFERRED_SIZE))))
                    .addGroup(jPanel1Layout.createSequentialGroup()
                        .addGap(20, 20, 20)
                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addGroup(jPanel1Layout.createSequentialGroup()
                                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addComponent(jLabel22)
                                    .addComponent(comboActividad, javax.swing.GroupLayout.PREFERRED_SIZE, 350, javax.swing.GroupLayout.PREFERRED_SIZE))
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addComponent(comboDosificacion, javax.swing.GroupLayout.PREFERRED_SIZE, 164, javax.swing.GroupLayout.PREFERRED_SIZE)
                                    .addComponent(jLabel23)))
                            .addGroup(jPanel1Layout.createSequentialGroup()
                                .addGap(20, 20, 20)
                                .addComponent(jScrollPane3, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)))
                        .addGap(30, 30, 30)
                        .addComponent(btnAddAlmacen, javax.swing.GroupLayout.PREFERRED_SIZE, 38, javax.swing.GroupLayout.PREFERRED_SIZE))
                    .addGroup(jPanel1Layout.createSequentialGroup()
                        .addContainerGap()
                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addGroup(jPanel1Layout.createSequentialGroup()
                                .addGap(21, 21, 21)
                                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addComponent(jLabel24, javax.swing.GroupLayout.PREFERRED_SIZE, 80, javax.swing.GroupLayout.PREFERRED_SIZE)
                                    .addComponent(jScrollPane2, javax.swing.GroupLayout.PREFERRED_SIZE, 410, javax.swing.GroupLayout.PREFERRED_SIZE)
                                    .addComponent(requerido10)))
                            .addComponent(jLabel17)
                            .addGroup(jPanel1Layout.createSequentialGroup()
                                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addGroup(jPanel1Layout.createSequentialGroup()
                                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                            .addGroup(jPanel1Layout.createSequentialGroup()
                                                .addComponent(jLabel18)
                                                .addGap(18, 18, 18)
                                                .addComponent(jLabel19)
                                                .addGap(18, 18, 18)
                                                .addComponent(jLabel20)
                                                .addGap(143, 143, 143)
                                                .addComponent(jLabel21))
                                            .addGroup(jPanel1Layout.createSequentialGroup()
                                                .addComponent(textoNomAlma, javax.swing.GroupLayout.PREFERRED_SIZE, 105, javax.swing.GroupLayout.PREFERRED_SIZE)
                                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                                                .addComponent(textoNumAlma, javax.swing.GroupLayout.PREFERRED_SIZE, 104, javax.swing.GroupLayout.PREFERRED_SIZE)
                                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                                                .addComponent(textoDirecAlma, javax.swing.GroupLayout.PREFERRED_SIZE, 185, javax.swing.GroupLayout.PREFERRED_SIZE)
                                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                                                .addComponent(textoTeleAlma, javax.swing.GroupLayout.PREFERRED_SIZE, 102, javax.swing.GroupLayout.PREFERRED_SIZE)))
                                        .addGap(18, 18, 18)
                                        .addComponent(btnAdd, javax.swing.GroupLayout.PREFERRED_SIZE, 38, javax.swing.GroupLayout.PREFERRED_SIZE))
                                    .addGroup(jPanel1Layout.createSequentialGroup()
                                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                            .addComponent(jLabel11)
                                            .addComponent(textoNumCorreVenta, javax.swing.GroupLayout.PREFERRED_SIZE, 75, javax.swing.GroupLayout.PREFERRED_SIZE)
                                            .addComponent(requerido2))
                                        .addGap(18, 18, 18)
                                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                            .addComponent(jLabel12)
                                            .addComponent(textoNumCorreTraspa, javax.swing.GroupLayout.PREFERRED_SIZE, 75, javax.swing.GroupLayout.PREFERRED_SIZE)
                                            .addComponent(requerido4))
                                        .addGap(18, 18, 18)
                                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                            .addComponent(requerido5)
                                            .addComponent(jLabel13)
                                            .addComponent(textoNumCorreBaja, javax.swing.GroupLayout.PREFERRED_SIZE, 75, javax.swing.GroupLayout.PREFERRED_SIZE)))
                                    .addGroup(jPanel1Layout.createSequentialGroup()
                                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                            .addComponent(jLabel14)
                                            .addComponent(textoNumCorrePedi, javax.swing.GroupLayout.PREFERRED_SIZE, 75, javax.swing.GroupLayout.PREFERRED_SIZE))
                                        .addGap(18, 18, 18)
                                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                            .addComponent(jLabel15)
                                            .addComponent(textoNumCorreCotiza, javax.swing.GroupLayout.PREFERRED_SIZE, 75, javax.swing.GroupLayout.PREFERRED_SIZE)
                                            .addComponent(requerido7))
                                        .addGap(18, 18, 18)
                                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                            .addComponent(requerido9)
                                            .addComponent(jLabel25)
                                            .addComponent(textoNumeCorreResibo, javax.swing.GroupLayout.PREFERRED_SIZE, 90, javax.swing.GroupLayout.PREFERRED_SIZE)))
                                    .addComponent(requerido6)
                                    .addComponent(jLabel16)
                                    .addComponent(textoNumCorrePreFac, javax.swing.GroupLayout.PREFERRED_SIZE, 75, javax.swing.GroupLayout.PREFERRED_SIZE)
                                    .addComponent(requerido8))
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                .addComponent(btnEditar, javax.swing.GroupLayout.PREFERRED_SIZE, 74, javax.swing.GroupLayout.PREFERRED_SIZE)))))
                .addContainerGap(667, Short.MAX_VALUE))
        );
        jPanel1Layout.setVerticalGroup(
            jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel1Layout.createSequentialGroup()
                .addContainerGap()
                .addComponent(jLabel1)
                .addGap(18, 18, 18)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jLabel2)
                    .addComponent(jLabel3))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(textoNomSuc, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(textoNumSuc, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(requerido1)
                    .addComponent(requerido3))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jLabel4)
                    .addComponent(jLabel5))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(textoDirecSuc, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(textoTeleSuc, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addGap(18, 18, 18)
                .addComponent(jLabel6)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jLabel7)
                    .addComponent(jLabel8)
                    .addComponent(jLabel9)
                    .addComponent(jLabel10))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(textoTele2Suc, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(textoTele3Suc, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(comboDepart, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(comboMunici, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(requerido11)
                    .addComponent(requerido12))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, 18, Short.MAX_VALUE)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jLabel11)
                    .addComponent(jLabel12)
                    .addComponent(jLabel13))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(textoNumCorreVenta, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(textoNumCorreTraspa, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(textoNumCorreBaja, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(jPanel1Layout.createSequentialGroup()
                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                            .addComponent(requerido2)
                            .addComponent(requerido4))
                        .addGap(11, 11, 11))
                    .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, jPanel1Layout.createSequentialGroup()
                        .addComponent(requerido5)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)))
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jLabel14)
                    .addComponent(jLabel15)
                    .addComponent(jLabel25))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(textoNumCorrePedi, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(textoNumCorreCotiza, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(textoNumeCorreResibo, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addGap(5, 5, 5)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(requerido6)
                    .addComponent(requerido7)
                    .addComponent(requerido9))
                .addGap(9, 9, 9)
                .addComponent(jLabel16)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(textoNumCorrePreFac, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(5, 5, 5)
                .addComponent(requerido8)
                .addGap(18, 18, 18)
                .addComponent(jLabel17)
                .addGap(5, 5, 5)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING)
                    .addComponent(btnAdd, javax.swing.GroupLayout.PREFERRED_SIZE, 36, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(btnEditar, javax.swing.GroupLayout.PREFERRED_SIZE, 35, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addGroup(jPanel1Layout.createSequentialGroup()
                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                            .addComponent(jLabel18)
                            .addComponent(jLabel19)
                            .addComponent(jLabel20)
                            .addComponent(jLabel21))
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                            .addComponent(textoNomAlma, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addComponent(textoNumAlma, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addComponent(textoDirecAlma, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addComponent(textoTeleAlma, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jLabel24)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jScrollPane2, javax.swing.GroupLayout.PREFERRED_SIZE, 119, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(requerido10)
                .addGap(18, 18, 18)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING)
                    .addGroup(jPanel1Layout.createSequentialGroup()
                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                            .addComponent(jLabel22)
                            .addComponent(jLabel23))
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                            .addComponent(comboActividad, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addComponent(comboDosificacion, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)))
                    .addComponent(btnAddAlmacen, javax.swing.GroupLayout.PREFERRED_SIZE, 41, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jScrollPane3, javax.swing.GroupLayout.PREFERRED_SIZE, 95, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(18, 18, 18)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(cancelar, javax.swing.GroupLayout.PREFERRED_SIZE, 40, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(guardar, javax.swing.GroupLayout.PREFERRED_SIZE, 40, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addGap(60, 60, 60))
        );

        jScrollPane1.setViewportView(jPanel1);

        javax.swing.GroupLayout layout = new javax.swing.GroupLayout(getContentPane());
        getContentPane().setLayout(layout);
        layout.setHorizontalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addComponent(jScrollPane1, javax.swing.GroupLayout.DEFAULT_SIZE, 779, Short.MAX_VALUE)
        );
        layout.setVerticalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addComponent(jScrollPane1, javax.swing.GroupLayout.DEFAULT_SIZE, 415, Short.MAX_VALUE)
        );

        pack();
    }// </editor-fold>//GEN-END:initComponents

    private void textoNumSucKeyTyped(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_textoNumSucKeyTyped
        char c = evt.getKeyChar(); 
        if ((c<'0' || c>'9')) evt.consume(); 
    }//GEN-LAST:event_textoNumSucKeyTyped

    private void textoTeleSucKeyTyped(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_textoTeleSucKeyTyped
        char c = evt.getKeyChar(); 
        if ((c<'0' || c>'9')) evt.consume();
    }//GEN-LAST:event_textoTeleSucKeyTyped

    private void textoTele2SucKeyTyped(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_textoTele2SucKeyTyped
        char c = evt.getKeyChar(); 
        if ((c<'0' || c>'9')) evt.consume();
    }//GEN-LAST:event_textoTele2SucKeyTyped

    private void textoTele3SucKeyTyped(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_textoTele3SucKeyTyped
        char c = evt.getKeyChar(); 
        if ((c<'0' || c>'9')) evt.consume();
    }//GEN-LAST:event_textoTele3SucKeyTyped

    private void guardarActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_guardarActionPerformed
        contVerif = 0;
        
        if (this.id_sucursal != 0) {
            actualizar();
        }else{
            
            verificar();
            if (contVerif == 0) {
                Date fe = new Date();
                long dd = fe.getTime();
                java.sql.Date fechaAct = new java.sql.Date(dd);     
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

                String nombreSuc = textoNomSuc.getText();
                int numeroSucu = Integer.parseInt(textoNumSuc.getText());
                String direcSuc = textoDirecSuc.getText();
                String tele1Suc = textoTeleSuc.getText();
                String tele2Suc = textoTele2Suc.getText();
                String tele3Suc = textoTele3Suc.getText();
                Departamento depar =  (Departamento) comboDepart.getSelectedItem();
                int id_depart = depar.getId();
                Departamento munici = (Departamento) comboMunici.getSelectedItem();
                int id_munici = munici.getId();
                int numCorreVenta =  Integer.parseInt(textoNumCorreVenta.getText());
                int numCorreTrasp = Integer.parseInt(textoNumCorreTraspa.getText());
                int numCorreBaja = Integer.parseInt(textoNumCorreBaja.getText());
                int numCorrePedi = Integer.parseInt(textoNumCorrePedi.getText());
                int numCorreResibo = Integer.parseInt(textoNumeCorreResibo.getText());
                int numCorreCoti = Integer.parseInt(textoNumCorreCotiza.getText());
                int numCorrePreFact = Integer.parseInt(textoNumCorrePreFac.getText());

                int idEmpresa = 0;
                int telefo1Suc = 0;
                int telefo2Suc = 0;
                int telefo3Suc = 0;
                int copiasImprPedido = 0;
                String fasePedido = "";
                int impPedidoCorto = 0;
                ArrayList<ListaSucursal> lista = new ArrayList();
                ResultSet rs = db.seleccionar("SELECT EMPRESA FROM USUARIO WHERE ID = "+this.id_usuario);
                try {
                    while (rs.next()) {                
                        idEmpresa = rs.getInt(1);
                    }
                } catch (Exception e) {
                    System.out.println("Error al recoger el id empresa de sucursal:"+e);
                }

                if (!tele1Suc.equals("")) {
                    telefo1Suc = Integer.parseInt(tele1Suc);
                }
                if (!tele2Suc.equals("")) {
                    telefo2Suc = Integer.parseInt(tele2Suc);
                }
                if (!tele3Suc.equals("")) {
                    telefo3Suc = Integer.parseInt(tele3Suc);
                }

            
                db.insertarSucursalSuc(idEmpresa, nombreSuc, numeroSucu, direcSuc, telefo1Suc, telefo2Suc, telefo3Suc, id_depart, id_munici, fechaAct, fechaAct, numCorreVenta, numCorreTrasp, numCorreBaja, numCorrePedi, copiasImprPedido, fasePedido, numCorreResibo, impPedidoCorto, numCorreCoti, numCorrePreFact, fechaAct,false);
                int id_sucursal = db.seleccionarUltimoIdSucursal();
                String nombreAl = "";
                String numAl = "";
                int numero;
                String direccion = "";
                String telefono = "";
                for (int i = 0; i < tablaAlmacen.getRowCount(); i++) {
                    nombreAl = (String) tablaAlmacen.getValueAt(i, 0);
                    if(nombreAl == null){nombreAl = "";}               
                    numAl  = (String) tablaAlmacen.getValueAt(i, 1);
                    if(numAl == null){numero = 0;}else{numero = Integer.parseInt(numAl);}
                    direccion = (String) tablaAlmacen.getValueAt(i, 2);
                    if(direccion == null){direccion = "";}    
                    telefono = (String) tablaAlmacen.getValueAt(i, 3);
                    if(telefono == null){telefono = "";}

                    db.insertarAlmacenSuc(id_sucursal,nombreAl,numero,direccion, telefono, fechaAct, fechaAct);
                }
                int idSuct = id_sucursal;
                String fechaActString = sdf.format(fechaAct);
                boolean expirado = false;
                for (int i = 0; i < tablaActividades.getRowCount(); i++) {
                    String actividades = (String) tablaActividades.getValueAt(i, 0);
                    String dosificacion = (String) tablaActividades.getValueAt(i, 1);
                    int id_actividad = actividades(actividades);
                    int id_dosificacion = dosificaciones(dosificacion);
                    db.insertarSucursalActividadDosificacion(idSuct, id_actividad, id_dosificacion, fechaActString, fechaActString,expirado);
                } 
                
                db.insertarConfigFactura(id_sucursal,false,false, fechaAct, fechaAct);
                
                limpiarFormulario();
                dispose();
            }else{
                JOptionPane.showMessageDialog(null, "Ingrese los campos requeridos");
            }
        }
    }//GEN-LAST:event_guardarActionPerformed

    private void comboDepartActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_comboDepartActionPerformed
        comboMunici.removeAllItems();
        Departamento depart = (Departamento)comboDepart.getSelectedItem();
        String nombreCorto = depart.getNomb_corto();
        
        String[] parts = nombreCorto.split("-");
        nombreCorto = parts[0]+"M";
             
        if(nombreCorto.equals("SZM")){
            nombreCorto = "SCZM";
        }else if (nombreCorto.equals("LPM")) {
             nombreCorto = "LPZM";
        }else if (nombreCorto.equals("ORM")) {
            nombreCorto = "ORUM";
        }else if (nombreCorto.equals("TRM")) {
            nombreCorto = "TRJM";
        }else if (nombreCorto.equals("BNM")) {
            nombreCorto = "BENIM";
        }
        depart.agregarMunicipio(nombreCorto, comboMunici);
        /*ResultSet rs = null;
        boolean habilitado = true;
        String consulta = "SELECT NOMBRE "
                + "FROM CLASE "
                + "WHERE NOMBRE_CORTO = '"+nombreCorto+"' AND HABILITADO = "+habilitado;
;
        try {          
            rs = db.seleccionar(consulta);
            while (rs.next()) {                
              comboMunici.addItem(rs.getString(1));
            }
        } catch (Exception e) {
            System.out.println("Error "+e);
        }finally{
            try {
                rs.close();
                db.Conectar().close();
            } catch (SQLException ex) {
                Logger.getLogger(NuevaSucursal.class.getName()).log(Level.SEVERE, null, ex);
            }
        }*/
    }//GEN-LAST:event_comboDepartActionPerformed

    private void cancelarActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_cancelarActionPerformed
         dispose();
    }//GEN-LAST:event_cancelarActionPerformed

    private void comboActividadActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_comboActividadActionPerformed
        System.out.println("La actividad es "+comboActividad.getSelectedItem());
    }//GEN-LAST:event_comboActividadActionPerformed

    private void textoTeleAlmaKeyTyped(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_textoTeleAlmaKeyTyped
        char c = evt.getKeyChar();
        if (c<'0' || c>'9')  evt.consume();
      
    }//GEN-LAST:event_textoTeleAlmaKeyTyped

    private void textoNumCorreVentaKeyTyped(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_textoNumCorreVentaKeyTyped
        char c = evt.getKeyChar();
        if (c<'0' || c>'9')  evt.consume();
    }//GEN-LAST:event_textoNumCorreVentaKeyTyped

    private void textoNumCorreTraspaKeyTyped(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_textoNumCorreTraspaKeyTyped
         char c = evt.getKeyChar();
        if (c<'0' || c>'9')  evt.consume();
    }//GEN-LAST:event_textoNumCorreTraspaKeyTyped

    private void textoNumCorreBajaKeyTyped(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_textoNumCorreBajaKeyTyped
        char c = evt.getKeyChar();
        if (c<'0' || c>'9')  evt.consume();
    }//GEN-LAST:event_textoNumCorreBajaKeyTyped

    private void textoNumCorrePediKeyTyped(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_textoNumCorrePediKeyTyped
        char c = evt.getKeyChar();
        if (c<'0' || c>'9')  evt.consume();
    }//GEN-LAST:event_textoNumCorrePediKeyTyped

    private void btnAddActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_btnAddActionPerformed
        String nomAlmacen = textoNomAlma.getText();
        String numero = textoNumAlma.getText();
        String direcAlmacen = textoDirecAlma.getText();
        String telefefono = textoTeleAlma.getText();
        
        Object[] datos = {nomAlmacen,numero,direcAlmacen,telefefono,editar,eliminar};
        modeloTabla.addRow(datos);
        tablaAlmacen.setModel(modeloTabla);
        
        textoNomAlma.setText("");
        textoNumAlma.setText("");
        textoDirecAlma.setText("");
        textoTeleAlma.setText("");
    }//GEN-LAST:event_btnAddActionPerformed

    private void textoNumAlmaKeyTyped(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_textoNumAlmaKeyTyped
        char c = evt.getKeyChar();
        if (c<'0'||c>'9') evt.consume();
    }//GEN-LAST:event_textoNumAlmaKeyTyped

    private void tablaAlmacenMouseClicked(java.awt.event.MouseEvent evt) {//GEN-FIRST:event_tablaAlmacenMouseClicked
        int columna = tablaAlmacen.getColumnModel().getColumnIndexAtX(evt.getX());
        int fila = evt.getY() / tablaAlmacen.getRowHeight();

        if (fila < tablaAlmacen.getRowCount() && fila >= 0 && columna < tablaAlmacen.getColumnCount() && columna >= 0) {
            Object value = tablaAlmacen.getValueAt(fila, columna);

            if (value instanceof JButton) {
                ((JButton) value).doClick();
                    JButton botonAccion = (JButton) value;

                if (botonAccion.getName().equals("editar")) {
                    String nombre = String.valueOf(tablaAlmacen.getValueAt(fila, 0));
                    String numero = String.valueOf(tablaAlmacen.getValueAt(fila, 1));
                    String direccion =  String.valueOf(tablaAlmacen.getValueAt(fila, 2));
                    String telefono = String.valueOf(tablaAlmacen.getValueAt(fila, 3));
                    nombreGlobal = nombre;
                    
                    textoNomAlma.setText(nombre);
                    textoNumAlma.setText(numero);
                    textoDirecAlma.setText(direccion);
                    textoTeleAlma.setText(telefono);
                    
                    btnEditar.setVisible(true);
                    btnAdd.setVisible(false);
                    
                }
                if (botonAccion.getName().equals("eliminar")) {
                    
                    modeloTabla.removeRow(fila);
                }
            }
        }
    }//GEN-LAST:event_tablaAlmacenMouseClicked

    private void btnEditarActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_btnEditarActionPerformed
        String nombre = textoNomAlma.getText();
        String numero = textoNumAlma.getText();
        String direcci = textoDirecAlma.getText();
        String telefono = textoTeleAlma.getText();
        
        for (int i = 0; i < tablaAlmacen.getRowCount(); i++) {
            if (tablaAlmacen.getValueAt(i, 0).equals(nombreGlobal)) {
                tablaAlmacen.setValueAt(nombre, i, 0);
                tablaAlmacen.setValueAt(numero, i, 1);
                tablaAlmacen.setValueAt(direcci, i, 2);
                tablaAlmacen.setValueAt(telefono, i, 3);
                
            }
        }
        textoNomAlma.setText("");
        textoNumAlma.setText("");
        textoDirecAlma.setText("");
        textoTeleAlma.setText("");
                    
        btnAdd.setVisible(true);
        btnEditar.setVisible(false);
    }//GEN-LAST:event_btnEditarActionPerformed

    private void comboMuniciActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_comboMuniciActionPerformed
        // TODO add your handling code here:
    }//GEN-LAST:event_comboMuniciActionPerformed

    private void btnAddAlmacenActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_btnAddAlmacenActionPerformed
        String nomActividad = (String) comboActividad.getSelectedItem();
        String nomDosificacion = (String) comboDosificacion.getSelectedItem();
        int existe = 0; 
        int tam = tablaActividades.getRowCount();

        for(int i = 0;i < tablaActividades.getRowCount();i++){
            if (tablaActividades.getValueAt(i, 1).equals(nomDosificacion)) {
                existe ++;
            }
        }      
        if (existe == 0) {
            Object[] datos = {nomActividad,nomDosificacion,eliminar};               
            modeloTablaAct.addRow(datos);
        }else{
            JOptionPane.showMessageDialog(null, "Ya se ingreso esa dosificación");
        }
        tablaActividades.setModel(modeloTablaAct);
        existe = 0;
    }//GEN-LAST:event_btnAddAlmacenActionPerformed

    private void tablaActividadesMouseClicked(java.awt.event.MouseEvent evt) {//GEN-FIRST:event_tablaActividadesMouseClicked
        int columna = tablaAlmacen.getColumnModel().getColumnIndexAtX(evt.getX());
        int fila = evt.getY() / tablaAlmacen.getRowHeight();

        if (fila < tablaAlmacen.getRowCount() && fila >= 0 && columna < tablaAlmacen.getColumnCount() && columna >= 0) {
            Object value = tablaAlmacen.getValueAt(fila, columna);

            if (value instanceof JButton) {
                ((JButton) value).doClick();
                    JButton botonAccion = (JButton) value;

                if (botonAccion.getName().equals("eliminar")) {
                    modeloTablaAct.removeRow(fila);     
                }
            }
        }
    }//GEN-LAST:event_tablaActividadesMouseClicked

    /**
     * @param args the command line arguments
     */

    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JButton btnAdd;
    private javax.swing.JButton btnAddAlmacen;
    private javax.swing.JButton btnEditar;
    private javax.swing.JButton cancelar;
    private javax.swing.JComboBox<String> comboActividad;
    private javax.swing.JComboBox<Departamento> comboDepart;
    private javax.swing.JComboBox<String> comboDosificacion;
    private javax.swing.JComboBox<Departamento> comboMunici;
    private javax.swing.JButton guardar;
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
    private javax.swing.JLabel jLabel3;
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
    private javax.swing.JLabel requerido1;
    private javax.swing.JLabel requerido10;
    private javax.swing.JLabel requerido11;
    private javax.swing.JLabel requerido12;
    private javax.swing.JLabel requerido2;
    private javax.swing.JLabel requerido3;
    private javax.swing.JLabel requerido4;
    private javax.swing.JLabel requerido5;
    private javax.swing.JLabel requerido6;
    private javax.swing.JLabel requerido7;
    private javax.swing.JLabel requerido8;
    private javax.swing.JLabel requerido9;
    private javax.swing.JTable tablaActividades;
    private javax.swing.JTable tablaAlmacen;
    private javax.swing.JTextField textoDirecAlma;
    private javax.swing.JTextField textoDirecSuc;
    private javax.swing.JTextField textoNomAlma;
    private javax.swing.JTextField textoNomSuc;
    private javax.swing.JTextField textoNumAlma;
    private javax.swing.JTextField textoNumCorreBaja;
    private javax.swing.JTextField textoNumCorreCotiza;
    private javax.swing.JTextField textoNumCorrePedi;
    private javax.swing.JTextField textoNumCorrePreFac;
    private javax.swing.JTextField textoNumCorreTraspa;
    private javax.swing.JTextField textoNumCorreVenta;
    private javax.swing.JTextField textoNumSuc;
    private javax.swing.JTextField textoNumeCorreResibo;
    private javax.swing.JTextField textoTele2Suc;
    private javax.swing.JTextField textoTele3Suc;
    private javax.swing.JTextField textoTeleAlma;
    private javax.swing.JTextField textoTeleSuc;
    // End of variables declaration//GEN-END:variables
}
