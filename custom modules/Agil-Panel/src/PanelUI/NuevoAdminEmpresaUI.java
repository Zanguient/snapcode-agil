/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package PanelUI;

import java.net.URL;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.Date;
import javax.net.ssl.HttpsURLConnection;
import javax.swing.Icon;
import javax.swing.ImageIcon;
import javax.swing.JButton;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JTable;
import javax.swing.table.DefaultTableModel;
import javax.swing.table.TableCellRenderer;
import modelo_Admin.RenderTable;
import models.Database;
import models.RestServer;
import org.json.JSONArray;
import org.json.JSONObject;

/**
 *
 * @author AGIL
 */
public class NuevoAdminEmpresaUI extends javax.swing.JDialog {
    Database db = new  Database();
    int contVerifi;
    public int id_empresa = 0;
    public int num = 1;
    
    JButton editar;
    ImageIcon imgEditar;
    Icon iconEditar;
    
    JButton eliminar;
    ImageIcon imgEliminar;
    Icon iconEliminar;
    
    DefaultTableModel modelApliTabla;
    
    /**
     * Creates new form NuevoAdminEmpresaUI
     */
    public NuevoAdminEmpresaUI(java.awt.Frame parent, boolean modal) {
        super(parent,modal);
        initComponents();
        setLocationRelativeTo(this);
        comboDepartamento();
        
        String[] columnas = {"Id","#","Aplicacion","Eliminar"};
        modelApliTabla = new DefaultTableModel(null,columnas);
        tablaAplicacion.setDefaultRenderer(Object.class, new RenderTable());
        alinearTextoTabla();

        
        requerido1.setVisible(false);
        requerido2.setVisible(false);
        requerido3.setVisible(false);
        requerido4.setVisible(false);
        requerido5.setVisible(false);
        
        comboSucurDepartamento();
        obtenerRolAplicaciones();
        insertarBotones();
    }
    
    public NuevoAdminEmpresaUI(java.awt.Frame parent, boolean modal,int id_empresa) {
        super(parent,modal);
        initComponents();
        setLocationRelativeTo(this);
        this.id_empresa = id_empresa;
        
        String[] columnas = {"Id","#","Aplicacion","Eliminar"};
        modelApliTabla = new DefaultTableModel(null,columnas);
        tablaAplicacion.setDefaultRenderer(Object.class, new RenderTable());
        
         insertarBotones();
        alinearTextoTabla();
        requerido1.setVisible(false);
        requerido2.setVisible(false);
        requerido3.setVisible(false);
        requerido4.setVisible(false);
        requerido5.setVisible(false);
        comboDepartamento();
        comboSucurDepartamento();
        obtenerRolAplicaciones();
        optenerDatosEmpresa(this.id_empresa);
        optenerDatosSucursal(this.id_empresa);
        obtenerDatosRolAplicacion(this.id_empresa);
       
   
    }
    
    public void insertarBotones(){
        tablaAplicacion.setDefaultRenderer(Object.class, new RenderTable());
        
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
    
    public void tamañoTabla() {
        tablaAplicacion.getColumnModel().getColumn(0).setMaxWidth(0);
        tablaAplicacion.getColumnModel().getColumn(0).setMinWidth(0);
        tablaAplicacion.getColumnModel().getColumn(0).setPreferredWidth(0);

        tablaAplicacion.getColumnModel().getColumn(1).setMaxWidth(30);
        tablaAplicacion.getColumnModel().getColumn(1).setMinWidth(30);
        tablaAplicacion.getColumnModel().getColumn(1).setPreferredWidth(30);
        
        
        tablaAplicacion.getColumnModel().getColumn(2).setMaxWidth(200);
        tablaAplicacion.getColumnModel().getColumn(2).setMinWidth(200);
        tablaAplicacion.getColumnModel().getColumn(2).setPreferredWidth(200);
        tablaAplicacion.setRowHeight(33);
    }
    
    public void alinearTextoTabla(){
        TableCellRenderer rendererFromHeader = tablaAplicacion.getTableHeader().getDefaultRenderer();
        JLabel headerLabel = (JLabel) rendererFromHeader;
        headerLabel.setHorizontalAlignment(JLabel.CENTER);
    }
       
    public void obtenerRolAplicaciones(){
        ResultSet rs = null;
        String consulta = "SELECT TITULO FROM APLICACION";
        try {
            rs = db.seleccionar(consulta);
            while(rs.next()){
                String aplicacion = rs.getString(1);
                comboAplicacion.addItem(aplicacion);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }finally{
            try {
                rs.close();
                db.Conectar().close();
            } catch (SQLException ex) {
                ex.printStackTrace();
            }
        }
    }
    
    private boolean getConnectionStatus() {
        String conStatus = null;
        boolean estado = false;
        try {
            URL u = new URL("http://agilsof.net/");
            HttpsURLConnection huc = (HttpsURLConnection) u.openConnection();
            huc.connect();
            conStatus = "Online";
            estado = true;

        } catch (Exception e) {
            conStatus = "Offline";
            estado = false;

        }
        return estado;
    }
    
    public void comboDepartamento(){
        ResultSet rs = null;
        String nombre_depar;
        String consulta = "SELECT C.NOMBRE \n" +
            "FROM TIPO AS T\n" +
            "INNER JOIN CLASE AS C ON C.ID_TIPO = T.ID\n" +
            "WHERE T.ID = "+1;
        rs = db.seleccionar(consulta);
        try {
            while (rs.next()) {                
                nombre_depar = rs.getString(1);
                comboDepartamento.addItem(nombre_depar);              
            }
        } catch (Exception e) {
            System.out.println("Error: "+e);
        }
    }
    
    public void comboSucurDepartamento(){
        ResultSet rs = null;
        String nombre_depar;
        String consulta = "SELECT C.NOMBRE \n" +
            "FROM TIPO AS T\n" +
            "INNER JOIN CLASE AS C ON C.ID_TIPO = T.ID\n" +
            "WHERE T.ID = "+1;
        rs = db.seleccionar(consulta);
        try {
            while (rs.next()) {                
                nombre_depar = rs.getString(1);
                comboSucDepart.addItem(nombre_depar);
            }
        } catch (Exception e) {
            System.out.println("Error: "+e);
        }
    }
    
    private void insertarProvincia(String tipo){
        int id;
        String nombre;
        String nombre_corto;
        String idEmpresa;
        String creadAt;
        String updatedAt;
        
        if (getConnectionStatus() == true) {
            try {
                 String url = "/paises/"+tipo;
                
                JSONArray clases  = RestServer.getJSONArray(url);
                for (int i = 0; i < clases.length(); i++) {
                    JSONObject clase = clases.getJSONObject(i);
                    int id_clase = clase.getInt("id");
                    int id_tipo = clase.getInt("id_tipo");
                    String nombre_clase = clase.getString("nombre");
                    String nombre_corto_clase = clase.getString("nombre_corto");
                    boolean habilitado = clase.getBoolean("habilitado");
                    String created_clase =  clase.getString("createdAt").substring(0,10);
                    String updated_clase =  clase.getString("updatedAt").substring(0,10);
                    db.InsertarClases(id_clase, id_tipo, nombre_clase, nombre_corto_clase, habilitado, created_clase, updated_clase);
                    
                 
                    JSONObject municipio = clase.getJSONObject("tipo");
                    id = municipio.getInt("id");
                    nombre = municipio.getString("nombre");
                    nombre_corto = municipio.getString("nombre_corto");
                    idEmpresa = (String) municipio.get("id_empresa").toString();
                    creadAt = municipio.getString("createdAt").substring(0,10);
                    updatedAt = municipio.getString("updatedAt").substring(0,10);
                    if (idEmpresa.equals("null")) {
                        db.InsertarTiposEmpresaNula(id, nombre, nombre_corto, creadAt, updatedAt);
                    }else{
                        int id_empresa = Integer.parseInt(idEmpresa);
                        db.InsertarTipos(id, nombre, nombre_corto, creadAt, updatedAt, id_empresa);
                    }
                }
            } catch (Exception e) {
                System.out.println("Error: "+e);
            }     
        }
    } 
    
    public void verificar(){
        
        if (textRazonSocial.getText().equals("")){requerido1.setVisible(true);contVerifi++;}else{requerido1.setVisible(false);}
        if (textNit.getText().equals("")){requerido2.setVisible(true);contVerifi++;}else{requerido2.setVisible(false);}
        if (textNombreSuc.getText().equals("")){requerido3.setVisible(true);contVerifi++;}else{requerido3.setVisible(false);}
        if (textSucNumero.getText().equals("")){requerido4.setVisible(true);contVerifi++;}else{requerido4.setVisible(false);}
        if (textNumCorrelativo.getText().equals("")){requerido5.setVisible(true);contVerifi++;}else{requerido5.setVisible(false);}

    }
    
    public void optenerDatosEmpresa(int id){
        
        ResultSet rs = null;
        ResultSet rsLugar = null;
        int id_depart = 0;
        int id_muni = 0;
        String[] nom_lugar = new String[2];

        for (int i = 0; i < db.seleccionarEmpresa(id).size() ; i++) {
           
            textRazonSocial.setText(db.seleccionarEmpresa(id).get(i).getRazonSocial());
            textNit.setText(db.seleccionarEmpresa(id).get(i).getNit());
            textDireccion.setText(db.seleccionarEmpresa(id).get(i).getDireccion());
            textTelefono1.setText(Integer.toString(db.seleccionarEmpresa(id).get(i).getTelefono1()));
            textTelefono2.setText(Integer.toString(db.seleccionarEmpresa(id).get(i).getTelefono2()));
            textTelefono3.setText(Integer.toString(db.seleccionarEmpresa(id).get(i).getTelefono3()));
            id_depart = db.seleccionarEmpresa(id).get(i).getDepartamento();
            id_muni = db.seleccionarEmpresa(id).get(i).getMunicipio();
            
            rsLugar = db.seleccionar("SELECT NOMBRE FROM CLASE WHERE ID IN ("+id_depart+","+id_muni+")");
            try {
                while(rsLugar.next()){
                    
                    nom_lugar[0] = rsLugar.getString(1);
                    nom_lugar[1] = rsLugar.getString(1);
                }
               
                comboDepartamento.setSelectedItem(nom_lugar[0]);
                comboMunicipio.setSelectedItem(nom_lugar[1]);
                radioPanel.setSelected(db.seleccionarEmpresa(id).get(i).isPanel());
                radioVencimientos.setSelected(db.seleccionarEmpresa(id).get(i).isVencimiento());
                radioServicios.setSelected(db.seleccionarEmpresa(id).get(i).isServicios());
                radioConsumos.setSelected(db.seleccionarEmpresa(id).get(i).isConsumos());
                radioDescuentos.setSelected(db.seleccionarEmpresa(id).get(i).isDescuentos());
                radioGeoreferencias.setSelected(db.seleccionarEmpresa(id).get(i).isGeo());
                radioMedico.setSelected(db.seleccionarEmpresa(id).get(i).isMedico());
                radioCuentaAuxiliar.setSelected(db.seleccionarEmpresa(id).get(i).isCuentasAuxiliares());
                radioPedidos.setSelected(db.seleccionarEmpresa(id).get(i).isPedidos());
                radioPantallaClient.setSelected(db.seleccionarEmpresa(id).get(i).isPantallaCliente());
                radioPantallaDespa.setSelected(db.seleccionarEmpresa(id).get(i).isPantallaDespacho());
                radioMesas.setSelected(db.seleccionarEmpresa(id).get(i).isMesas());
                radioSalas.setSelected(db.seleccionarEmpresa(id).get(i).isSalas());
                radioContabilidad.setSelected(db.seleccionarEmpresa(id).get(i).isContabilidad());
                radioMantenimiento.setSelected(db.seleccionarEmpresa(id).get(i).isMantenimiento());
 ;
            } catch (Exception e) {
                System.out.println("Error: "+e);
            }

        }
    }
    
    public void optenerDatosSucursal(int id){
        ResultSet rs = null;
        int sucuDepartamento = 0;
        int sucuMunicipio = 0;
        try {
            String consulSucursal = "SELECT * FROM SUCURSAL WHERE EMPRESA = "+id;
            rs = db.seleccionar(consulSucursal);
            while (rs.next()) {     
                sucuDepartamento = rs.getInt(9);
                sucuMunicipio = rs.getInt(10);
                textNombreSuc.setText(rs.getString(3));
                textSucNumero.setText(Integer.toString(rs.getInt(4)));
                textNumCorrelativo.setText(Integer.toString(rs.getInt(13)));
                textDireccion.setText(rs.getString(5));
                textSucurTel1.setText(Integer.toString(rs.getInt(6)));
                textSucurTel2.setText(Integer.toString(rs.getInt(7)));
                textSucurTel3.setText(Integer.toString(rs.getInt(8))); 
                comboSucDepart.setSelectedItem(db.seleccionarNombreDepartamento(sucuDepartamento));

            }
        } catch (Exception e) {
            System.out.println("Error: "+e);
        }
    
    }
    
    public void obtenerDatosRolAplicacion(int id_empresa){
        ResultSet rs = null;
        int num = 1;
        String consulta = "SELECT A.ID,A.TITULO\n" +
            "FROM EMPRESA_APLICACION AS EA\n" +
            "INNER JOIN APLICACION AS A ON A.ID = EA.APLICACION\n" +
            "WHERE EA.EMPRESA = "+id_empresa;
        try {
            rs = db.seleccionar(consulta);
            while (rs.next()) { 
                int id = rs.getInt(1);
                String nombreAplicacion = rs.getString(2);
                
                Object[] datos = {id,num,nombreAplicacion,eliminar};
                num++;
                modelApliTabla.addRow(datos);
            }
            tablaAplicacion.setModel(modelApliTabla);
            tamañoTabla();
        } catch (Exception e) {
            e.printStackTrace();
        }finally{
            try {
                rs.close();
                db.Conectar().close();
            } catch (SQLException ex) {
                ex.printStackTrace();
            }
        }
    }
    
    public void actualizarEmpresa(int id){
        contVerifi = 0;
        
        Date fe = new Date();
        long dd = fe.getTime();
        java.sql.Date fechaAct = new java.sql.Date(dd); 
        String razonSocial = textRazonSocial.getText();
        String nit = textNit.getText();
        String direccion = textDireccion.getText();
        int telefono1 = Integer.parseInt(textSucurTel1.getText());
        int telefono2 = Integer.parseInt(textSucurTel2.getText());
        int telefono3 = Integer.parseInt(textSucurTel3.getText());
        boolean panel = radioPanel.isSelected();
        boolean vencimiento = radioVencimientos.isSelected();
        boolean servicio = radioServicios.isSelected();
        boolean consumo = radioConsumos.isSelected();
        boolean descuento = radioDescuentos.isSelected();
        boolean geo = radioGeoreferencias.isSelected();
        boolean medico = radioMedico.isSelected();
        boolean cuentasAuxiliares = radioCuentaAuxiliar.isSelected();
        boolean pedidos = radioPedidos.isSelected();
        boolean pantallaCliente = radioPantallaClient.isSelected();
        boolean pantallaDespacho = radioPantallaDespa.isSelected();
        boolean mesas = radioMesas.isSelected();
        boolean salas = radioSalas.isSelected();
        boolean contabilidad = radioContabilidad.isSelected();
        boolean mantenimiento = radioMantenimiento.isSelected();
        String nom_depart = (String) comboDepartamento.getSelectedItem();
        String nom_munici = (String) comboMunicipio.getSelectedItem();
        String imagen = "img";
        int[] id_depart = new int[2];
        String consulDepart = "SELECT ID,NOMBRE \n" +
                "FROM APP.CLASE \n" +
                "WHERE NOMBRE IN( '"+nom_depart+"','"+nom_munici+"')";
        int i=0;
        try {
            ResultSet resDepart = db.seleccionar(consulDepart);
            while(resDepart.next()){              
                id_depart[i] = resDepart.getInt(1);
                i++;
            }
            verificar();
            //System.out.println(id_depart[0]+" - "+id_depart[1]);
            if (contVerifi == 0) {
                db.actualizarEmpresa(id, razonSocial, nit, direccion, telefono1, telefono2, telefono3, id_depart[0], id_depart[1], fechaAct, panel, vencimiento, servicio, consumo, descuento, servicio, pedidos, pantallaCliente, pantallaDespacho, mesas, salas, contabilidad, medico, mantenimiento, cuentasAuxiliares, imagen,false);
                
                String nom_suc = textNombreSuc.getText();
                int num_suc = Integer.parseInt(textSucNumero.getText());
                int num_corre_suc = Integer.parseInt(textNumCorrelativo.getText());
                String direc_suc = textSucursalDireccion.getText();
                int telef1_suc = Integer.parseInt(textTelefono1.getText());
                int telef2_suc = Integer.parseInt(textTelefono2.getText());
                int telef3_suc = Integer.parseInt(textTelefono3.getText());
                
                String nom_depart_suc = (String) comboDepartamento.getSelectedItem();
                String nom_munici_suc = (String) comboMunicipio.getSelectedItem();
        
                int[] id_depart_suc = new int[2];
                String consulDepartSuc = "SELECT ID,NOMBRE \n" +
                    "FROM APP.CLASE \n" +
                     "WHERE NOMBRE IN( '"+nom_depart_suc+"','"+nom_munici_suc+"')";
                int j=0;
        
                ResultSet resDepartSuc = db.seleccionar(consulDepartSuc);
                while(resDepartSuc.next()){              
                    id_depart_suc[j] = resDepartSuc.getInt(1);
                    i++;
                }
                verificar();
                if(contVerifi == 0){
                    db.insertarSucursalEmpresa(id, nom_suc, num_suc, direc_suc, telef1_suc, telef2_suc, telef3_suc, id_depart_suc[0], id_depart_suc[1], fechaAct, fechaAct, num_corre_suc,false);
                    
                    String eliminarEmpresaAplica = "DELETE FROM EMPRESA_APLICACION WHERE EMPRESA = "+id;
                    db.eliminarProductos(eliminarEmpresaAplica);
                    
                    for (int k = 0; k < tablaAplicacion.getRowCount(); k++) {
                        int idAplica = Integer.parseInt(String.valueOf(tablaAplicacion.getValueAt(k, 0)));
                        db.insertarEmpresaAplicacion(id,idAplica,fechaAct,fechaAct);
                    }
                    
                    
                    limiarFormulario();
                                   
                }else{
                    JOptionPane.showMessageDialog(null, "Ingrese los campos requeridos");
                }
            }else{
                JOptionPane.showMessageDialog(null, "Los campos son requeridos");
            }
            
        } catch (Exception e) {
            System.out.println("Error: "+e);
        }
    }
    
    public void limiarFormulario(){

        textRazonSocial.setText("");
        textNit.setText("");
        textDireccion.setText("");
        textTelefono1.setText("");
        textTelefono2.setText("");
        textTelefono3.setText("");
        radioPanel.setSelected(false);
        radioVencimientos.setSelected(false);
        radioServicios.setSelected(false);
        radioConsumos.setSelected(false);
        radioDescuentos.setSelected(false);
        radioGeoreferencias.setSelected(false);
        radioPedidos.setSelected(false);
        radioPantallaClient.setSelected(false);
        radioPantallaDespa.setSelected(false);
        radioMesas.setSelected(false);
        radioSalas.setSelected(false);
        radioContabilidad.setSelected(false);
        radioMedico.setSelected(false);
        radioMantenimiento.setSelected(false);
        radioCuentaAuxiliar.setSelected(false);
        
        textSucNumero.setText("");
        textNombreSuc.setText("");
        textSucNumero.setText("");
        textNumCorrelativo.setText("");
        textSucursalDireccion.setText("");
        textSucurTel1.setText("");
        textSucurTel2.setText("");
        textSucurTel3.setText("");
        JOptionPane.showMessageDialog(null, "Se guardo el formulario");
        dispose();
    }
    
    public int obtenerIdAplicacion(String nombre){
        ResultSet rs = null;
        String consulta = "SELECT ID FROM APLICACION WHERE TITULO = '"+nombre+"'";
        int id = 0;
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
                ex.printStackTrace();
            }
        }
        return id;
    }
      
    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        jScrollPane1 = new javax.swing.JScrollPane();
        jPanel1 = new javax.swing.JPanel();
        jLabel1 = new javax.swing.JLabel();
        textRazonSocial = new javax.swing.JTextField();
        jLabel2 = new javax.swing.JLabel();
        jLabel3 = new javax.swing.JLabel();
        textNit = new javax.swing.JTextField();
        jLabel4 = new javax.swing.JLabel();
        textDireccion = new javax.swing.JTextField();
        jLabel5 = new javax.swing.JLabel();
        jLabel6 = new javax.swing.JLabel();
        jLabel7 = new javax.swing.JLabel();
        textTelefono1 = new javax.swing.JTextField();
        textTelefono2 = new javax.swing.JTextField();
        textTelefono3 = new javax.swing.JTextField();
        jLabel8 = new javax.swing.JLabel();
        jLabel9 = new javax.swing.JLabel();
        comboDepartamento = new javax.swing.JComboBox<>();
        jLabel10 = new javax.swing.JLabel();
        comboMunicipio = new javax.swing.JComboBox<>();
        radioPanel = new javax.swing.JRadioButton();
        radioVencimientos = new javax.swing.JRadioButton();
        radioServicios = new javax.swing.JRadioButton();
        radioConsumos = new javax.swing.JRadioButton();
        radioDescuentos = new javax.swing.JRadioButton();
        radioGeoreferencias = new javax.swing.JRadioButton();
        radioPedidos = new javax.swing.JRadioButton();
        radioPantallaClient = new javax.swing.JRadioButton();
        radioPantallaDespa = new javax.swing.JRadioButton();
        radioMesas = new javax.swing.JRadioButton();
        radioContabilidad = new javax.swing.JRadioButton();
        radioMedico = new javax.swing.JRadioButton();
        radioMantenimiento = new javax.swing.JRadioButton();
        radioCuentaAuxiliar = new javax.swing.JRadioButton();
        jLabel11 = new javax.swing.JLabel();
        jLabel12 = new javax.swing.JLabel();
        textNombreSuc = new javax.swing.JTextField();
        jLabel13 = new javax.swing.JLabel();
        textNumCorrelativo = new javax.swing.JTextField();
        jLabel14 = new javax.swing.JLabel();
        textSucNumero = new javax.swing.JTextField();
        jLabel15 = new javax.swing.JLabel();
        textSucursalDireccion = new javax.swing.JTextField();
        jLabel16 = new javax.swing.JLabel();
        textSucurTel1 = new javax.swing.JTextField();
        jLabel17 = new javax.swing.JLabel();
        textSucurTel2 = new javax.swing.JTextField();
        jLabel18 = new javax.swing.JLabel();
        textSucurTel3 = new javax.swing.JTextField();
        jLabel19 = new javax.swing.JLabel();
        comboSucDepart = new javax.swing.JComboBox<>();
        jLabel20 = new javax.swing.JLabel();
        comboSucMuni = new javax.swing.JComboBox<>();
        jButton1 = new javax.swing.JButton();
        radioSalas = new javax.swing.JRadioButton();
        requerido1 = new javax.swing.JLabel();
        requerido2 = new javax.swing.JLabel();
        requerido3 = new javax.swing.JLabel();
        requerido4 = new javax.swing.JLabel();
        requerido5 = new javax.swing.JLabel();
        jButton2 = new javax.swing.JButton();
        comboAplicacion = new javax.swing.JComboBox<>();
        jLabel21 = new javax.swing.JLabel();
        jScrollPane2 = new javax.swing.JScrollPane();
        tablaAplicacion = new JTable(){
            public boolean isCellEditable(int rowIndex, int colIndex) {
                return colIndex != 0 && colIndex != 1 && colIndex != 2 && colIndex != 3 
                && colIndex != 4  ;
            }
        };
        jButton3 = new javax.swing.JButton();

        setDefaultCloseOperation(javax.swing.WindowConstants.DO_NOTHING_ON_CLOSE);

        jPanel1.setBackground(new java.awt.Color(255, 255, 255));

        jLabel1.setFont(new java.awt.Font("Arial", 0, 14)); // NOI18N
        jLabel1.setForeground(new java.awt.Color(48, 126, 204));
        jLabel1.setText("DATOS DE LA EMPRESA");

        jLabel2.setForeground(new java.awt.Color(48, 126, 204));
        jLabel2.setText("Razón Social");

        jLabel3.setForeground(new java.awt.Color(48, 126, 204));
        jLabel3.setText("NIT");

        textNit.addKeyListener(new java.awt.event.KeyAdapter() {
            public void keyTyped(java.awt.event.KeyEvent evt) {
                textNitKeyTyped(evt);
            }
        });

        jLabel4.setForeground(new java.awt.Color(48, 126, 204));
        jLabel4.setText("Dirección");

        jLabel5.setForeground(new java.awt.Color(48, 126, 204));
        jLabel5.setText("Teléfono1");

        jLabel6.setForeground(new java.awt.Color(48, 126, 204));
        jLabel6.setText("Teléfono2");

        jLabel7.setForeground(new java.awt.Color(48, 126, 204));
        jLabel7.setText("Teléfono3");

        textTelefono1.addKeyListener(new java.awt.event.KeyAdapter() {
            public void keyTyped(java.awt.event.KeyEvent evt) {
                textTelefono1KeyTyped(evt);
            }
        });

        textTelefono2.addKeyListener(new java.awt.event.KeyAdapter() {
            public void keyTyped(java.awt.event.KeyEvent evt) {
                textTelefono2KeyTyped(evt);
            }
        });

        textTelefono3.addKeyListener(new java.awt.event.KeyAdapter() {
            public void keyTyped(java.awt.event.KeyEvent evt) {
                textTelefono3KeyTyped(evt);
            }
        });

        jLabel8.setFont(new java.awt.Font("Arial", 0, 14)); // NOI18N
        jLabel8.setForeground(new java.awt.Color(48, 126, 204));
        jLabel8.setText("DATOS ADICIONALES");

        jLabel9.setForeground(new java.awt.Color(48, 126, 204));
        jLabel9.setText("Departamento");

        comboDepartamento.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                comboDepartamentoActionPerformed(evt);
            }
        });

        jLabel10.setForeground(new java.awt.Color(48, 126, 204));
        jLabel10.setText("Municipio");

        comboMunicipio.setModel(new javax.swing.DefaultComboBoxModel<>(new String[] { " " }));
        comboMunicipio.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                comboMunicipioActionPerformed(evt);
            }
        });

        radioPanel.setText("Usar Panel?");
        radioPanel.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                radioPanelActionPerformed(evt);
            }
        });

        radioVencimientos.setText("Usar Vencimientos?");

        radioServicios.setText("Usar Servicios?");

        radioConsumos.setText("Usar Consumos?");
        radioConsumos.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                radioConsumosActionPerformed(evt);
            }
        });

        radioDescuentos.setText("Usar Descuentos?");

        radioGeoreferencias.setText("Usar Georeferencias?");

        radioPedidos.setText("Usar Pedidos?");

        radioPantallaClient.setText("Usar Pantalla Cliente?");

        radioPantallaDespa.setText("Usar Pantalla Despacho?");

        radioMesas.setText("Usar Mesas?");

        radioContabilidad.setText("Usar contabilidad?");

        radioMedico.setText("Usar Medico?");

        radioMantenimiento.setText("Usar Mantenimiento?");

        radioCuentaAuxiliar.setText("Usar Cuentas Auxiliares");

        jLabel11.setFont(new java.awt.Font("Arial", 0, 14)); // NOI18N
        jLabel11.setForeground(new java.awt.Color(48, 126, 204));
        jLabel11.setText("DATOS SUCURSAL PRINCIPAL");

        jLabel12.setForeground(new java.awt.Color(48, 126, 204));
        jLabel12.setText("Nombre");

        jLabel13.setForeground(new java.awt.Color(48, 126, 204));
        jLabel13.setText("Numero Correlativo Venta");

        textNumCorrelativo.addKeyListener(new java.awt.event.KeyAdapter() {
            public void keyTyped(java.awt.event.KeyEvent evt) {
                textNumCorrelativoKeyTyped(evt);
            }
        });

        jLabel14.setForeground(new java.awt.Color(48, 126, 204));
        jLabel14.setText("Numero");

        textSucNumero.addKeyListener(new java.awt.event.KeyAdapter() {
            public void keyTyped(java.awt.event.KeyEvent evt) {
                textSucNumeroKeyTyped(evt);
            }
        });

        jLabel15.setForeground(new java.awt.Color(48, 126, 204));
        jLabel15.setText("Direccion");

        jLabel16.setForeground(new java.awt.Color(48, 126, 204));
        jLabel16.setText("Telefono1");

        textSucurTel1.addKeyListener(new java.awt.event.KeyAdapter() {
            public void keyTyped(java.awt.event.KeyEvent evt) {
                textSucurTel1KeyTyped(evt);
            }
        });

        jLabel17.setForeground(new java.awt.Color(48, 126, 204));
        jLabel17.setText("Telefono2");

        textSucurTel2.addKeyListener(new java.awt.event.KeyAdapter() {
            public void keyTyped(java.awt.event.KeyEvent evt) {
                textSucurTel2KeyTyped(evt);
            }
        });

        jLabel18.setForeground(new java.awt.Color(48, 126, 204));
        jLabel18.setText("Telefono3");

        textSucurTel3.addKeyListener(new java.awt.event.KeyAdapter() {
            public void keyTyped(java.awt.event.KeyEvent evt) {
                textSucurTel3KeyTyped(evt);
            }
        });

        jLabel19.setForeground(new java.awt.Color(48, 126, 204));
        jLabel19.setText("Departamento");

        comboSucDepart.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                comboSucDepartActionPerformed(evt);
            }
        });

        jLabel20.setForeground(new java.awt.Color(48, 126, 204));
        jLabel20.setText("Municipio");

        comboSucMuni.setModel(new javax.swing.DefaultComboBoxModel<>(new String[] { " " }));
        comboSucMuni.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                comboSucMuniActionPerformed(evt);
            }
        });

        jButton1.setBackground(new java.awt.Color(98, 155, 88));
        jButton1.setText("Guardar");
        jButton1.setBorder(javax.swing.BorderFactory.createLineBorder(new java.awt.Color(135, 184, 127)));
        jButton1.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jButton1ActionPerformed(evt);
            }
        });

        radioSalas.setText("Usar Salas?");

        requerido1.setForeground(new java.awt.Color(255, 0, 0));
        requerido1.setText("Requerido");

        requerido2.setForeground(new java.awt.Color(255, 0, 0));
        requerido2.setText("Requerido");

        requerido3.setForeground(new java.awt.Color(255, 0, 0));
        requerido3.setText("Requerido");

        requerido4.setForeground(new java.awt.Color(255, 0, 0));
        requerido4.setText("Requerido");

        requerido5.setForeground(new java.awt.Color(255, 0, 0));
        requerido5.setText("Requerido");

        jButton2.setBackground(new java.awt.Color(183, 70, 53));
        jButton2.setText("Cerrar");
        jButton2.setBorder(javax.swing.BorderFactory.createLineBorder(new java.awt.Color(209, 91, 71)));
        jButton2.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jButton2ActionPerformed(evt);
            }
        });

        jLabel21.setForeground(new java.awt.Color(48, 126, 204));
        jLabel21.setText("Rol Aplicaiones");

        tablaAplicacion.setModel(new javax.swing.table.DefaultTableModel(
            new Object [][] {

            },
            new String [] {
                "Id", "#", "Aplicacion", "Eliminar"
            }
        ));
        tablaAplicacion.addMouseListener(new java.awt.event.MouseAdapter() {
            public void mouseClicked(java.awt.event.MouseEvent evt) {
                tablaAplicacionMouseClicked(evt);
            }
        });
        jScrollPane2.setViewportView(tablaAplicacion);
        if (tablaAplicacion.getColumnModel().getColumnCount() > 0) {
            tablaAplicacion.getColumnModel().getColumn(0).setMinWidth(0);
            tablaAplicacion.getColumnModel().getColumn(0).setPreferredWidth(0);
            tablaAplicacion.getColumnModel().getColumn(0).setMaxWidth(0);
            tablaAplicacion.getColumnModel().getColumn(1).setMinWidth(30);
            tablaAplicacion.getColumnModel().getColumn(1).setPreferredWidth(30);
            tablaAplicacion.getColumnModel().getColumn(1).setMaxWidth(30);
            tablaAplicacion.getColumnModel().getColumn(2).setMinWidth(200);
            tablaAplicacion.getColumnModel().getColumn(2).setPreferredWidth(200);
            tablaAplicacion.getColumnModel().getColumn(2).setMaxWidth(200);
            tablaAplicacion.getColumnModel().getColumn(3).setMinWidth(80);
            tablaAplicacion.getColumnModel().getColumn(3).setPreferredWidth(80);
            tablaAplicacion.getColumnModel().getColumn(3).setMaxWidth(80);
        }

        jButton3.setIcon(new javax.swing.ImageIcon(getClass().getResource("/imagen/addition.png"))); // NOI18N
        jButton3.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jButton3ActionPerformed(evt);
            }
        });

        javax.swing.GroupLayout jPanel1Layout = new javax.swing.GroupLayout(jPanel1);
        jPanel1.setLayout(jPanel1Layout);
        jPanel1Layout.setHorizontalGroup(
            jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel1Layout.createSequentialGroup()
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(jPanel1Layout.createSequentialGroup()
                        .addGap(14, 14, 14)
                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addGroup(jPanel1Layout.createSequentialGroup()
                                .addComponent(radioPanel)
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                                .addComponent(radioVencimientos)
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                                .addComponent(radioServicios)
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                                .addComponent(radioConsumos)
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                                .addComponent(radioDescuentos)
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                                .addComponent(radioGeoreferencias)
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                                .addComponent(radioMedico))
                            .addGroup(jPanel1Layout.createSequentialGroup()
                                .addComponent(radioPedidos)
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                                .addComponent(radioPantallaClient)
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                                .addComponent(radioPantallaDespa)
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                                .addComponent(radioMesas)
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                                .addComponent(radioSalas)
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                                .addComponent(radioCuentaAuxiliar))
                            .addGroup(jPanel1Layout.createSequentialGroup()
                                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addComponent(comboDepartamento, javax.swing.GroupLayout.PREFERRED_SIZE, 167, javax.swing.GroupLayout.PREFERRED_SIZE)
                                    .addComponent(jLabel9))
                                .addGap(18, 18, 18)
                                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addComponent(jLabel10)
                                    .addComponent(comboMunicipio, javax.swing.GroupLayout.PREFERRED_SIZE, 175, javax.swing.GroupLayout.PREFERRED_SIZE)))
                            .addGroup(jPanel1Layout.createSequentialGroup()
                                .addComponent(radioContabilidad)
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                                .addComponent(radioMantenimiento))
                            .addGroup(jPanel1Layout.createSequentialGroup()
                                .addComponent(comboAplicacion, javax.swing.GroupLayout.PREFERRED_SIZE, 178, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addGap(30, 30, 30)
                                .addComponent(jButton3, javax.swing.GroupLayout.PREFERRED_SIZE, 40, javax.swing.GroupLayout.PREFERRED_SIZE))
                            .addComponent(jLabel21)))
                    .addGroup(jPanel1Layout.createSequentialGroup()
                        .addContainerGap()
                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addGroup(jPanel1Layout.createSequentialGroup()
                                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING)
                                    .addComponent(jLabel2, javax.swing.GroupLayout.Alignment.LEADING)
                                    .addComponent(jLabel1, javax.swing.GroupLayout.PREFERRED_SIZE, 185, javax.swing.GroupLayout.PREFERRED_SIZE))
                                .addGap(110, 110, 110)
                                .addComponent(jLabel4))
                            .addGroup(jPanel1Layout.createSequentialGroup()
                                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addComponent(textRazonSocial, javax.swing.GroupLayout.PREFERRED_SIZE, 140, javax.swing.GroupLayout.PREFERRED_SIZE)
                                    .addComponent(requerido1, javax.swing.GroupLayout.PREFERRED_SIZE, 78, javax.swing.GroupLayout.PREFERRED_SIZE))
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addComponent(requerido2, javax.swing.GroupLayout.PREFERRED_SIZE, 78, javax.swing.GroupLayout.PREFERRED_SIZE)
                                    .addComponent(jLabel3)
                                    .addGroup(jPanel1Layout.createSequentialGroup()
                                        .addComponent(textNit, javax.swing.GroupLayout.PREFERRED_SIZE, 140, javax.swing.GroupLayout.PREFERRED_SIZE)
                                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                        .addComponent(textDireccion, javax.swing.GroupLayout.PREFERRED_SIZE, 240, javax.swing.GroupLayout.PREFERRED_SIZE))))
                            .addGroup(jPanel1Layout.createSequentialGroup()
                                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addComponent(jLabel5)
                                    .addComponent(textTelefono1, javax.swing.GroupLayout.PREFERRED_SIZE, 140, javax.swing.GroupLayout.PREFERRED_SIZE))
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addComponent(textTelefono2, javax.swing.GroupLayout.PREFERRED_SIZE, 140, javax.swing.GroupLayout.PREFERRED_SIZE)
                                    .addComponent(jLabel6))
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addComponent(textTelefono3, javax.swing.GroupLayout.PREFERRED_SIZE, 140, javax.swing.GroupLayout.PREFERRED_SIZE)
                                    .addComponent(jLabel7)))))
                    .addGroup(jPanel1Layout.createSequentialGroup()
                        .addContainerGap()
                        .addComponent(jLabel8, javax.swing.GroupLayout.PREFERRED_SIZE, 185, javax.swing.GroupLayout.PREFERRED_SIZE))
                    .addGroup(jPanel1Layout.createSequentialGroup()
                        .addGap(14, 14, 14)
                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addGroup(jPanel1Layout.createSequentialGroup()
                                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING, false)
                                    .addComponent(jLabel16, javax.swing.GroupLayout.Alignment.LEADING)
                                    .addComponent(textSucurTel1, javax.swing.GroupLayout.Alignment.LEADING, javax.swing.GroupLayout.PREFERRED_SIZE, 150, javax.swing.GroupLayout.PREFERRED_SIZE))
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addComponent(textSucurTel2, javax.swing.GroupLayout.PREFERRED_SIZE, 150, javax.swing.GroupLayout.PREFERRED_SIZE)
                                    .addComponent(jLabel17))
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addComponent(jLabel18)
                                    .addComponent(textSucurTel3, javax.swing.GroupLayout.PREFERRED_SIZE, 150, javax.swing.GroupLayout.PREFERRED_SIZE)))
                            .addGroup(jPanel1Layout.createSequentialGroup()
                                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addComponent(jLabel19)
                                    .addComponent(comboSucDepart, javax.swing.GroupLayout.PREFERRED_SIZE, 168, javax.swing.GroupLayout.PREFERRED_SIZE))
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addComponent(jLabel20)
                                    .addComponent(comboSucMuni, javax.swing.GroupLayout.PREFERRED_SIZE, 192, javax.swing.GroupLayout.PREFERRED_SIZE)))
                            .addComponent(textSucursalDireccion, javax.swing.GroupLayout.PREFERRED_SIZE, 285, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addGroup(jPanel1Layout.createSequentialGroup()
                                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addComponent(textNombreSuc, javax.swing.GroupLayout.PREFERRED_SIZE, 140, javax.swing.GroupLayout.PREFERRED_SIZE)
                                    .addComponent(jLabel12))
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addComponent(jLabel14)
                                    .addComponent(textSucNumero, javax.swing.GroupLayout.PREFERRED_SIZE, 77, javax.swing.GroupLayout.PREFERRED_SIZE))
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addComponent(jLabel13)
                                    .addComponent(textNumCorrelativo, javax.swing.GroupLayout.PREFERRED_SIZE, 115, javax.swing.GroupLayout.PREFERRED_SIZE)))
                            .addGroup(jPanel1Layout.createSequentialGroup()
                                .addComponent(requerido3)
                                .addGap(97, 97, 97)
                                .addComponent(requerido4)
                                .addGap(34, 34, 34)
                                .addComponent(requerido5))
                            .addComponent(jLabel15)
                            .addComponent(jLabel11, javax.swing.GroupLayout.PREFERRED_SIZE, 213, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addComponent(jScrollPane2, javax.swing.GroupLayout.PREFERRED_SIZE, 308, javax.swing.GroupLayout.PREFERRED_SIZE))))
                .addContainerGap(143, Short.MAX_VALUE))
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, jPanel1Layout.createSequentialGroup()
                .addGap(0, 0, Short.MAX_VALUE)
                .addComponent(jButton2, javax.swing.GroupLayout.PREFERRED_SIZE, 76, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(138, 138, 138)
                .addComponent(jButton1, javax.swing.GroupLayout.PREFERRED_SIZE, 76, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(226, 226, 226))
        );
        jPanel1Layout.setVerticalGroup(
            jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel1Layout.createSequentialGroup()
                .addContainerGap()
                .addComponent(jLabel1)
                .addGap(18, 18, 18)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jLabel2)
                    .addComponent(jLabel3)
                    .addComponent(jLabel4))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(textRazonSocial, javax.swing.GroupLayout.PREFERRED_SIZE, 30, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(textNit, javax.swing.GroupLayout.PREFERRED_SIZE, 30, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(textDireccion, javax.swing.GroupLayout.PREFERRED_SIZE, 30, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addGap(6, 6, 6)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(requerido1)
                    .addComponent(requerido2))
                .addGap(18, 18, 18)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING)
                    .addGroup(jPanel1Layout.createSequentialGroup()
                        .addComponent(jLabel5)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                        .addComponent(textTelefono1, javax.swing.GroupLayout.PREFERRED_SIZE, 30, javax.swing.GroupLayout.PREFERRED_SIZE))
                    .addGroup(jPanel1Layout.createSequentialGroup()
                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                            .addComponent(jLabel7)
                            .addComponent(jLabel6))
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                            .addComponent(textTelefono2, javax.swing.GroupLayout.PREFERRED_SIZE, 30, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addComponent(textTelefono3, javax.swing.GroupLayout.PREFERRED_SIZE, 30, javax.swing.GroupLayout.PREFERRED_SIZE))))
                .addGap(18, 18, 18)
                .addComponent(jLabel8)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jLabel9)
                    .addComponent(jLabel10))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(comboDepartamento, javax.swing.GroupLayout.PREFERRED_SIZE, 30, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(comboMunicipio, javax.swing.GroupLayout.PREFERRED_SIZE, 30, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(radioPanel)
                    .addComponent(radioVencimientos)
                    .addComponent(radioDescuentos)
                    .addComponent(radioGeoreferencias)
                    .addComponent(radioMedico)
                    .addComponent(radioServicios)
                    .addComponent(radioConsumos))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(radioPedidos)
                    .addComponent(radioPantallaClient)
                    .addComponent(radioPantallaDespa)
                    .addComponent(radioMesas)
                    .addComponent(radioSalas)
                    .addComponent(radioCuentaAuxiliar))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(radioContabilidad)
                    .addComponent(radioMantenimiento))
                .addGap(19, 19, 19)
                .addComponent(jLabel21)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(comboAplicacion, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(jButton3))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addComponent(jScrollPane2, javax.swing.GroupLayout.PREFERRED_SIZE, 137, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(18, 18, 18)
                .addComponent(jLabel11)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jLabel12)
                    .addComponent(jLabel13)
                    .addComponent(jLabel14))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(textNombreSuc, javax.swing.GroupLayout.PREFERRED_SIZE, 30, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(textNumCorrelativo, javax.swing.GroupLayout.PREFERRED_SIZE, 30, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(textSucNumero, javax.swing.GroupLayout.PREFERRED_SIZE, 30, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(requerido3)
                    .addComponent(requerido4)
                    .addComponent(requerido5))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jLabel15)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(textSucursalDireccion, javax.swing.GroupLayout.PREFERRED_SIZE, 30, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jLabel16)
                    .addComponent(jLabel17)
                    .addComponent(jLabel18))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(textSucurTel1, javax.swing.GroupLayout.PREFERRED_SIZE, 30, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(textSucurTel2, javax.swing.GroupLayout.PREFERRED_SIZE, 30, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(textSucurTel3, javax.swing.GroupLayout.PREFERRED_SIZE, 30, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jLabel19)
                    .addComponent(jLabel20))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(comboSucDepart, javax.swing.GroupLayout.PREFERRED_SIZE, 30, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(comboSucMuni, javax.swing.GroupLayout.PREFERRED_SIZE, 30, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jButton2, javax.swing.GroupLayout.PREFERRED_SIZE, 34, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(jButton1, javax.swing.GroupLayout.PREFERRED_SIZE, 34, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addContainerGap(82, Short.MAX_VALUE))
        );

        jScrollPane1.setViewportView(jPanel1);

        javax.swing.GroupLayout layout = new javax.swing.GroupLayout(getContentPane());
        getContentPane().setLayout(layout);
        layout.setHorizontalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addComponent(jScrollPane1, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
        );
        layout.setVerticalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addComponent(jScrollPane1, javax.swing.GroupLayout.DEFAULT_SIZE, 590, Short.MAX_VALUE)
        );

        pack();
    }// </editor-fold>//GEN-END:initComponents

    private void comboDepartamentoActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_comboDepartamentoActionPerformed
        
        String nombre_depart = (String) comboDepartamento.getSelectedItem();
        //comboMunicipio.removeAllItems();
        ResultSet rs = null;
        String nombre_corto="";
        String nombre;
        String consulta = "SELECT NOMBRE_CORTO "
                + "FROM CLASE "
                + "WHERE NOMBRE = '"+nombre_depart+"'";
        try {
            rs = db.seleccionar(consulta);
            while (rs.next()) {                
                nombre = rs.getString(1);
                String[] parts = nombre.split("-");
                nombre_corto = parts[0]+"M";
                
                if(nombre_corto.equals("SZM")){
                    nombre_corto = "SCZM";
                }else if (nombre_corto.equals("LPM")) {
                     nombre_corto = "LPZM";
                }else if (nombre_corto.equals("ORM")) {
                    nombre_corto = "ORUM";
                }else if (nombre_corto.equals("TRM")) {
                    nombre_corto = "TRJM";
                }else if (nombre_corto.equals("BNM")) {
                    nombre_corto = "BENIM";
                }
                insertarProvincia(nombre_corto);
            }
            
            comboMunicipio.removeAllItems();
            String consultaProv = "SELECT NOMBRE \n" +
                "FROM CLASE\n" +
                "WHERE NOMBRE_CORTO = '"+nombre_corto+"'";
            rs = db.seleccionar(consultaProv);
            while (rs.next()) {                
                comboMunicipio.addItem(rs.getString(1));
            }
            
        } catch (Exception e) {
            System.out.println("Error: "+e);
        }
    }//GEN-LAST:event_comboDepartamentoActionPerformed

    private void radioPanelActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_radioPanelActionPerformed
        // TODO add your handling code here:
        System.out.println(radioPanel.isSelected());
    }//GEN-LAST:event_radioPanelActionPerformed

    private void radioConsumosActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_radioConsumosActionPerformed
        // TODO add your handling code here:
    }//GEN-LAST:event_radioConsumosActionPerformed

    private void comboMunicipioActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_comboMunicipioActionPerformed
        // TODO add your handling code here:
    }//GEN-LAST:event_comboMunicipioActionPerformed

    private void comboSucDepartActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_comboSucDepartActionPerformed
        String nombre_depart = (String) comboSucDepart.getSelectedItem().toString();
        ResultSet rs = null;
        String nombre_corto="";
        String nombre;
        
        comboSucMuni.removeAllItems();
        String consulta = "SELECT NOMBRE_CORTO "
                + "FROM CLASE "
                + "WHERE NOMBRE = '"+nombre_depart+"'";
        try {
            rs = db.seleccionar(consulta);
            while (rs.next()) {                
                nombre = rs.getString(1);
                String[] parts = nombre.split("-");
                nombre_corto = parts[0]+"M";
                insertarProvincia(nombre_corto);
            }
            
            String consultaProv = "SELECT NOMBRE \n" +
                "FROM CLASE\n" +
                "WHERE NOMBRE_CORTO = '"+nombre_corto+"'";
            rs = db.seleccionar(consultaProv);
            while (rs.next()) {                
                comboSucMuni.addItem(rs.getString(1));
            }
        } catch (Exception e) {
            System.out.println("Error: "+e);
        }
    }//GEN-LAST:event_comboSucDepartActionPerformed

    private void jButton1ActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jButton1ActionPerformed
       contVerifi = 0;
        ResultSet rs = null;
        int telefono1 = 0;
        int telefono2 = 0;
        int telefono3 = 0;

        if (this.id_empresa != 0) {
            actualizarEmpresa(this.id_empresa);
          // System.out.println("SE ACTUALIZA");
        }else{
            String nombre_depart = (String) comboDepartamento.getSelectedItem();
            String nombre_munici = (String) comboMunicipio.getSelectedItem();
            String razon_social = (String) textRazonSocial.getText();
            String nit = (String) textNit.getText();
            String direccion = (String) textDireccion.getText();
            String tele1 = (String) textTelefono1.getText();
            String tele2 = (String) textTelefono2.getText();
            String tele3 = (String) textTelefono3.getText();
            verificar();
            
            if (!tele1.equals("")) {
                telefono1 = Integer.parseInt(tele1);
            }
            if (!tele2.equals("")) {
                telefono2 = Integer.parseInt(tele2);
            }
            if (!tele3.equals("")) {
                telefono3 = Integer.parseInt(tele3);
            }
            boolean panel = radioPanel.isSelected();
            boolean vencimiento = radioVencimientos.isSelected();
            boolean servicios = radioServicios.isSelected();
            boolean consumos = radioConsumos.isSelected();
            boolean descuentos = radioDescuentos.isSelected();
            boolean georeferencia = radioGeoreferencias.isSelected();
            boolean pedidos = radioPedidos.isSelected();
            boolean pantalla_Cliente = radioPantallaClient.isSelected();
            boolean pantalla_despacho = radioPantallaDespa.isSelected();
            boolean mesas = radioMesas.isSelected();
            boolean salas = radioSalas.isSelected();
            boolean contabilidad = radioContabilidad.isSelected();
            boolean medico = radioMedico.isSelected();
            boolean mantenimiento = radioMantenimiento.isSelected();
            boolean cuentasAuxi = radioCuentaAuxiliar.isSelected();
            String imagen = "img";
            int id_depart=0;
            int id_munici=0;
            
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            Date fe = new Date();
            long dd = fe.getTime();
            java.sql.Date fechaAct = new java.sql.Date(dd);   
            String fecha = sdf.format(fechaAct);
            
            String nombreSucur = (String) textSucNumero.getText();
            try {

                String consultaDepart = "SELECT ID FROM CLASE WHERE NOMBRE = '"+nombre_depart+"'";

                rs = db.seleccionar(consultaDepart);
                while (rs.next()) { 
                    id_depart = rs.getInt(1);
                }

                String consultaMuni = "SELECT ID FROM CLASE WHERE NOMBRE = '"+nombre_munici+"'";

                rs = db.seleccionar(consultaMuni);
                while (rs.next()) {                
                    id_munici = rs.getInt(1);
                }   
                if (contVerifi == 0) {
                    db.insertarEmpresa(razon_social, nit, direccion, telefono1,telefono2,telefono3, id_depart, id_munici, fechaAct, fechaAct, panel, vencimiento, servicios, consumos, descuentos, georeferencia, pedidos, pantalla_Cliente, pantalla_despacho, mesas, salas, contabilidad, medico, mantenimiento, cuentasAuxi, imagen,false);

                    int sucurTelefono1 = 0;
                    int sucurTelefono2 = 0;
                    int sucurTelefono3 = 0; 
                    
                    int id = db.seleccionarUltimoIdEmpresa();
                    
                    //insertar centro de costos en tipo y clase
                    int idTipo = db.seleccionarUltimoIdTipo();
                    idTipo = idTipo + 1;
                    db.InsertarTiposConceptos(idTipo, "CENTROS DE COSTO", "CCO", fecha, fecha, id);
                    int ultimoIdTipo = db.seleccionarUltimoIdTipo();
                    int idClase = db.seleccionarUltimoIdClase();
                    idClase = idClase + 1;
                    db.InsertarClases(idClase, ultimoIdTipo, "ALMACEN", "AL", true, fecha, fecha);
                    int ultimoIdClase = db.seleccionarUltimoIdClase();
                    ultimoIdClase = + 1;
                    db.InsertarClases(ultimoIdClase, ultimoIdTipo, "VARIOS", "VARI", true, fecha, fecha);
                    //FIN
                    
                    String sucur_depart = (String) comboSucDepart.getSelectedItem();
                    String sucur_munici = (String) comboSucMuni.getSelectedItem();
                    String nombreSucursal = textNombreSuc.getText();
                    int numero = Integer.parseInt((String) textSucNumero.getText());
                    int numeroCorrelativo = Integer.parseInt((String) textNumCorrelativo.getText());
                    String direccionSucur = textSucursalDireccion.getText();
                    String sucurTel1 = textSucurTel1.getText();
                    String sucurTel2 = textSucurTel2.getText();
                    String sucurTel3 = textSucurTel3.getText();

                    if (!sucurTel1.equals("")) {
                        sucurTelefono1 = Integer.parseInt(sucurTel1);
                    }
                    if (!sucurTel2.equals("")) {
                        sucurTelefono2 = Integer.parseInt(sucurTel2);
                    }
                    if (!sucurTel3.equals("")) {
                        sucurTelefono3 = Integer.parseInt(sucurTel3);
                    }
                    int id_suc_depart = 0;
                    int id_suc_munici = 0;
                    verificar();
                    String consulSucDepart = "SELECT ID FROM CLASE WHERE NOMBRE = '"+sucur_depart+"'";      
                    rs = db.seleccionar(consulSucDepart);
                    while (rs.next()) { 
                        id_suc_depart = rs.getInt(1);
                    }

                    String consulSucMuni = "SELECT ID FROM CLASE WHERE NOMBRE = '"+sucur_munici+"'";     
                    rs = db.seleccionar(consulSucMuni);
                    while (rs.next()) {                
                        id_suc_munici = rs.getInt(1);
                    } 
                   
                    db.insertarSucursalEmpresa(id, nombreSucursal, numero, direccionSucur, sucurTelefono1, sucurTelefono2, sucurTelefono3,id_suc_depart,id_suc_munici, fechaAct, fechaAct, numeroCorrelativo,false);
                    
                    String eliminarEmpresaAplica = "DELETE FROM EMPRESA_APLICACION WHERE EMPRESA = "+id;
                    db.eliminarProductos(eliminarEmpresaAplica);
                    
                    for (int i = 0; i < tablaAplicacion.getRowCount(); i++) {
                        int idAplica = Integer.parseInt(String.valueOf(tablaAplicacion.getValueAt(i, 0)));
                        db.insertarEmpresaAplicacion(id,idAplica,fechaAct,fechaAct);
                    }
                    
                    db.insertarConfigGeneralFactura(id, false, fechaAct, fechaAct,false,false);
                    
                    limiarFormulario();
                           
                  
                }else{
                    JOptionPane.showMessageDialog(null, "Ingrese los campos requeridos");
                }
            } catch (Exception e) {
                System.out.println("Error: "+e);
            }
        }
        dispose();
    }//GEN-LAST:event_jButton1ActionPerformed

    private void textNitKeyTyped(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_textNitKeyTyped
        char c = evt.getKeyChar(); 
        if ((c<'0' || c>'9')) evt.consume();
    }//GEN-LAST:event_textNitKeyTyped

    private void textTelefono1KeyTyped(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_textTelefono1KeyTyped
        char c = evt.getKeyChar(); 
        if ((c<'0' || c>'9')) evt.consume();
    }//GEN-LAST:event_textTelefono1KeyTyped

    private void textTelefono2KeyTyped(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_textTelefono2KeyTyped
        char c = evt.getKeyChar(); 
        if ((c<'0' || c>'9')) evt.consume();
    }//GEN-LAST:event_textTelefono2KeyTyped

    private void textTelefono3KeyTyped(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_textTelefono3KeyTyped
        char c = evt.getKeyChar(); 
        if ((c<'0' || c>'9')) evt.consume();
    }//GEN-LAST:event_textTelefono3KeyTyped

    private void textSucNumeroKeyTyped(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_textSucNumeroKeyTyped
        char c = evt.getKeyChar();
        if (c<'0' || c>'9') evt.consume();
    }//GEN-LAST:event_textSucNumeroKeyTyped

    private void textNumCorrelativoKeyTyped(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_textNumCorrelativoKeyTyped
        char c = evt.getKeyChar();
        if (c<'0' || c>'9') evt.consume();
    }//GEN-LAST:event_textNumCorrelativoKeyTyped

    private void textSucurTel1KeyTyped(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_textSucurTel1KeyTyped
        char c = evt.getKeyChar();
        if (c<'0' || c>'9') evt.consume();
    }//GEN-LAST:event_textSucurTel1KeyTyped

    private void textSucurTel2KeyTyped(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_textSucurTel2KeyTyped
       char c = evt.getKeyChar();
        if (c<'0' || c>'9') evt.consume();
    }//GEN-LAST:event_textSucurTel2KeyTyped

    private void textSucurTel3KeyTyped(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_textSucurTel3KeyTyped
        char c = evt.getKeyChar();
        if (c<'0' || c>'9') evt.consume();
    }//GEN-LAST:event_textSucurTel3KeyTyped

    private void jButton2ActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jButton2ActionPerformed
        dispose();
    }//GEN-LAST:event_jButton2ActionPerformed

    private void comboSucMuniActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_comboSucMuniActionPerformed
        // TODO add your handling code here:
    }//GEN-LAST:event_comboSucMuniActionPerformed

    private void jButton3ActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jButton3ActionPerformed
        String aplicacion = (String)comboAplicacion.getSelectedItem();
        int id = obtenerIdAplicacion(aplicacion);
        
        Object[] datos = {id,num,aplicacion,eliminar};
        num++;
        modelApliTabla.addRow(datos);
        
        tablaAplicacion.setModel(modelApliTabla);
        tamañoTabla();
    }//GEN-LAST:event_jButton3ActionPerformed

    private void tablaAplicacionMouseClicked(java.awt.event.MouseEvent evt) {//GEN-FIRST:event_tablaAplicacionMouseClicked
        int columna = tablaAplicacion.getColumnModel().getColumnIndexAtX(evt.getX());
        int fila = evt.getY() / tablaAplicacion.getRowHeight();
        String idProducto;
        boolean existe = false;

        if (fila < tablaAplicacion.getRowCount() && fila >= 0 && columna < tablaAplicacion.getColumnCount() && columna >= 0) {
            Object value = tablaAplicacion.getValueAt(fila, columna);

            if (value instanceof JButton) {
                ((JButton) value).doClick();
                JButton botonAccion = (JButton) value;

                if (botonAccion.getName().equals("eliminar")) {
                    int num = 1;
                    modelApliTabla.removeRow(fila);
                    
                    for (int i = 0; i < tablaAplicacion.getRowCount(); i++) {
                        tablaAplicacion.setValueAt(num, i, 1);
                        num++;
                    }               
                }
            }
        }
    }//GEN-LAST:event_tablaAplicacionMouseClicked

    /**
     * @param args the command line arguments
     */
  

    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JComboBox<String> comboAplicacion;
    private javax.swing.JComboBox<String> comboDepartamento;
    private javax.swing.JComboBox<String> comboMunicipio;
    private javax.swing.JComboBox<String> comboSucDepart;
    private javax.swing.JComboBox<String> comboSucMuni;
    private javax.swing.JButton jButton1;
    private javax.swing.JButton jButton2;
    private javax.swing.JButton jButton3;
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
    private javax.swing.JRadioButton radioConsumos;
    private javax.swing.JRadioButton radioContabilidad;
    private javax.swing.JRadioButton radioCuentaAuxiliar;
    private javax.swing.JRadioButton radioDescuentos;
    private javax.swing.JRadioButton radioGeoreferencias;
    private javax.swing.JRadioButton radioMantenimiento;
    private javax.swing.JRadioButton radioMedico;
    private javax.swing.JRadioButton radioMesas;
    private javax.swing.JRadioButton radioPanel;
    private javax.swing.JRadioButton radioPantallaClient;
    private javax.swing.JRadioButton radioPantallaDespa;
    private javax.swing.JRadioButton radioPedidos;
    private javax.swing.JRadioButton radioSalas;
    private javax.swing.JRadioButton radioServicios;
    private javax.swing.JRadioButton radioVencimientos;
    private javax.swing.JLabel requerido1;
    private javax.swing.JLabel requerido2;
    private javax.swing.JLabel requerido3;
    private javax.swing.JLabel requerido4;
    private javax.swing.JLabel requerido5;
    private javax.swing.JTable tablaAplicacion;
    private javax.swing.JTextField textDireccion;
    private javax.swing.JTextField textNit;
    private javax.swing.JTextField textNombreSuc;
    private javax.swing.JTextField textNumCorrelativo;
    private javax.swing.JTextField textRazonSocial;
    private javax.swing.JTextField textSucNumero;
    private javax.swing.JTextField textSucurTel1;
    private javax.swing.JTextField textSucurTel2;
    private javax.swing.JTextField textSucurTel3;
    private javax.swing.JTextField textSucursalDireccion;
    private javax.swing.JTextField textTelefono1;
    private javax.swing.JTextField textTelefono2;
    private javax.swing.JTextField textTelefono3;
    // End of variables declaration//GEN-END:variables
}
