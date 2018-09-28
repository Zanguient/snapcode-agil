/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package PanelUI;

import java.net.*;
import java.util.logging.*;
import javax.net.ssl.HttpsURLConnection;
import org.json.*;
import models.*;
import com.agil.nuevo.*;
import java.io.FileNotFoundException;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.Date;
import javax.swing.ImageIcon;
import javax.swing.JButton;
import javax.swing.JTable;
import javax.swing.JTextField;
import javax.swing.table.DefaultTableModel;
import javax.swing.table.TableColumnModel;
import java.sql.Connection;
import java.sql.DriverManager;
import java.util.HashMap;
import java.util.Map;
import javax.swing.Icon;
import javax.swing.JOptionPane;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.JasperReport;
import net.sf.jasperreports.engine.util.JRLoader;
import net.sf.jasperreports.view.JasperViewer;

/**
 *
 * @author AGIL
 */
public class Solicitudes extends javax.swing.JFrame {

    JSONObject datosUsuario;
    int id_usuario;
    Database db = new Database();
    ArrayList<Sucursal> listaSucur;
    ArrayList<Almacen> ListaAlmacen;
    String estado = "";

    DefaultTableModel defaulttable;
    TableColumnModel columnModel;

    JButton entregar;
    JButton bloqueado;
    JButton editar;
    JButton noeditar;
    JButton Imprimir;
    JButton ver;
    JButton copiar;
    JButton eliminar;

    ImageIcon imgEntre;
    Icon iconEntre;
    
    ImageIcon imgBloq;
    Icon iconBloq;
    
    ImageIcon imgEdit;
    Icon iconEdit;
    
    ImageIcon imgNoEdit;
    Icon iconNoEdit;
    
    ImageIcon imgImp;
    Icon iconImp;
    
    ImageIcon imgVer;
    Icon iconVer;
    
    ImageIcon imgCopiar;
    Icon iconCopiar;
    
    ImageIcon imgElimi;
    Icon iconElimi;
    
    /**
     * Creates new form Solicitudes
     */
    private String getConnectionStatus() {
        String conStatus = null;
        try {
            URL u = new URL("https://www.google.com/");
            HttpsURLConnection huc = (HttpsURLConnection) u.openConnection();
            huc.connect();
            conStatus = "Online";
            JOptionPane.showMessageDialog(null, "Conectando con red");

        } catch (Exception e) {
            conStatus = "Offline";
            JOptionPane.showMessageDialog(null, "Conectando sin red");

        }
        return conStatus;
    }

    private void MostrarFiltrosSucursal() {
        String nombre_sucursal = "";
        int id_sucursal = 0;
        //DefaultComboBoxModel value = new DefaultComboBoxModel();
        //jComboSucursal.removeAll();
//        jComboSucursal.setModel(value);
//        value.addElement(new Sucursal(id_sucursal,nombre_sucursal));
        for (int i = 0; i < db.SeleccionarSucursal(this.id_usuario).size(); i++) {
            nombre_sucursal = db.SeleccionarSucursal(this.id_usuario).get(i).getNombre();
            id_sucursal = db.SeleccionarSucursal(this.id_usuario).get(i).getId();
            jComboSucursal.addItem(nombre_sucursal);
        }
    }

    public void MostrarFiltroAlmacen(String nombre) {
        String nombre_almacen = "";
        String nombre_sucursal = "";
        int id_sucursal = 0;

        if (nombre.equals("Todo")) {
            jComboAlmacen.removeAllItems();
            jComboAlmacen.addItem("Todo");

        } else if (!nombre.equals("Todo")) {
            for (int i = 0; i < db.SeleccionarSucursalPorNombre(nombre).size(); i++) {
                nombre_sucursal = db.SeleccionarSucursalPorNombre(nombre).get(i).getNombre();
                id_sucursal = db.SeleccionarSucursalPorNombre(nombre).get(i).getId();
            }
            jComboAlmacen.removeAllItems();
            int tam = db.selectAlmacenById(id_sucursal).size();
            jComboAlmacen.addItem("Todo");
            for (int i = 0; i < tam; i++) {
                nombre_almacen = db.selectAlmacenById(id_sucursal).get(i).getNombre();
                jComboAlmacen.addItem(nombre_almacen);
            }
        }
    }

    public void limpiarListas(ArrayList lista) {
        int tam = lista.size();
        for (int i = tam - 1; i >= 0; i--) {
            lista.remove(i);
        }
    }

    public Solicitudes(int id_usuario) {
        initComponents();
        setLocationRelativeTo(null);
        this.id_usuario = id_usuario;
        listaSucur = new ArrayList();
        ListaAlmacen = new ArrayList();
        MostrarFiltrosSucursal();
        listaSucur = new ArrayList();

        String columnas[] = {"N°", "Id", "Sucursal", "Fecha", "monto", "Usuario", "Estado", "Entregar", "Editar", "Imprimir", "Ver", "Copiar", "Eliminar"};
        defaulttable = new DefaultTableModel(null, columnas);

        columnModel = tablaSolicitudes.getColumnModel();

        columnModel.getColumn(0).setPreferredWidth(30);

        columnModel.getColumn(1).setPreferredWidth(0);

        columnModel.getColumn(2).setPreferredWidth(150);
        columnModel.getColumn(3).setPreferredWidth(100);
        columnModel.getColumn(4).setPreferredWidth(80);
        columnModel.getColumn(5).setPreferredWidth(100);
        columnModel.getColumn(6).setPreferredWidth(80);
        columnModel.getColumn(7).setPreferredWidth(60);
        columnModel.getColumn(8).setPreferredWidth(60);
        columnModel.getColumn(9).setPreferredWidth(60);
        columnModel.getColumn(10).setPreferredWidth(60);
        columnModel.getColumn(11).setPreferredWidth(60);
        columnModel.getColumn(12).setPreferredWidth(60);

        tablaSolicitudes.setDefaultRenderer(Object.class, new RenderTable());
        
        imgEntre = new ImageIcon("C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\Operaciones\\src\\imagen\\desbloqueado.png");
        iconEntre = new ImageIcon(imgEntre.getImage().getScaledInstance(20, 20, 1));
        entregar = new JButton(imgEntre);
        entregar.setName("entregar");
        
        imgBloq = new ImageIcon("C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\Operaciones\\src\\imagen\\bloqueado.png");
        iconBloq = new ImageIcon(imgBloq.getImage().getScaledInstance(20, 20, 1));
        bloqueado = new JButton(imgBloq);
        
        imgEdit = new ImageIcon("C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\Operaciones\\src\\imagen\\editar.png");
        iconEdit = new ImageIcon(imgEdit.getImage().getScaledInstance(20, 20, 1));
        editar = new JButton(imgEdit);
        editar.setName("editar");
        
        imgNoEdit = new ImageIcon("C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\Operaciones\\src\\imagen\\noeditar.png");
        iconNoEdit = new ImageIcon(imgNoEdit.getImage().getScaledInstance(20, 20, 1));
        noeditar = new JButton(imgNoEdit);
        noeditar.setName("noeditar");
        
        imgImp = new ImageIcon("C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\Operaciones\\src\\imagen\\impresora.png");
        iconImp = new ImageIcon(imgImp.getImage().getScaledInstance(20, 20, 1));
        Imprimir = new JButton(imgImp);
        Imprimir.setName("imprimir");
        
        imgVer = new ImageIcon("C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\Operaciones\\src\\imagen\\ver.png");
        iconVer = new ImageIcon(imgVer.getImage().getScaledInstance(20, 20, 1));
        ver = new JButton(imgVer);
        ver.setName("ver");
        
        imgCopiar = new ImageIcon("C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\Operaciones\\src\\imagen\\copia.png");
        iconCopiar = new ImageIcon(imgCopiar.getImage().getScaledInstance(20, 20, 1));
        copiar = new JButton(imgCopiar);
        copiar.setName("copiar");
        
        imgElimi = new ImageIcon("C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\Operaciones\\src\\imagen\\eliminar.png");
        iconElimi = new ImageIcon(imgElimi.getImage().getScaledInstance(20, 20, 1));
        eliminar = new JButton(imgElimi);
        eliminar.setName("eliminar");
        
        tablaSolicitudes.setRowHeight(33);
    }

    public Solicitudes(JSONObject datosUsuario, int id_usuario) {
        initComponents();
        setLocationRelativeTo(null);
        this.datosUsuario = datosUsuario;
        this.id_usuario = id_usuario;
        listaSucur = new ArrayList();
        ListaAlmacen = new ArrayList();
        MostrarFiltrosSucursal();

        String columnas[] = {"N°", "Id", "Sucursal", "Fecha", "monto", "Usuario", "Estado", "Entregar", "Editar", "Imprimir", "Ver", "Copiar", "Eliminar"};
        defaulttable = new DefaultTableModel(null, columnas);

        columnModel = tablaSolicitudes.getColumnModel();

        columnModel.getColumn(0).setPreferredWidth(30);

        columnModel.getColumn(1).setPreferredWidth(0);

        columnModel.getColumn(2).setPreferredWidth(150);
        columnModel.getColumn(3).setPreferredWidth(100);
        columnModel.getColumn(4).setPreferredWidth(80);
        columnModel.getColumn(5).setPreferredWidth(100);
        columnModel.getColumn(6).setPreferredWidth(80);
        columnModel.getColumn(7).setPreferredWidth(60);
        columnModel.getColumn(8).setPreferredWidth(60);
        columnModel.getColumn(9).setPreferredWidth(60);
        columnModel.getColumn(10).setPreferredWidth(60);
        columnModel.getColumn(11).setPreferredWidth(60);
        columnModel.getColumn(12).setPreferredWidth(60);

        tablaSolicitudes.setDefaultRenderer(Object.class, new RenderTable());

        imgEntre = new ImageIcon("C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\Operaciones\\src\\imagen\\desbloqueado.png");
        iconEntre = new ImageIcon(imgEntre.getImage().getScaledInstance(15, 20, 1));
        entregar = new JButton(imgEntre);
        entregar.setName("entregar");
        
        imgBloq = new ImageIcon("C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\Operaciones\\src\\imagen\\bloqueado.png");
        iconBloq = new ImageIcon(imgBloq.getImage().getScaledInstance(15, 20, 1));
        bloqueado = new JButton(imgBloq);
        
        imgEdit = new ImageIcon("C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\Operaciones\\src\\imagen\\editar.png");
        iconEdit = new ImageIcon(imgEdit.getImage().getScaledInstance(15, 20, 1));
        editar = new JButton(imgEdit);
        editar.setName("editar");
        
        imgNoEdit = new ImageIcon("C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\Operaciones\\src\\imagen\\noeditar.png");
        iconNoEdit = new ImageIcon(imgNoEdit.getImage().getScaledInstance(15, 20, 1));
        noeditar = new JButton(imgNoEdit);
        noeditar.setName("noeditar");
        
        imgImp = new ImageIcon("C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\Operaciones\\src\\imagen\\impresora.png");
        iconImp = new ImageIcon(imgImp.getImage().getScaledInstance(15, 20, 1));
        Imprimir = new JButton(imgImp);
        Imprimir.setName("imprimir");
        
        imgVer = new ImageIcon("C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\Operaciones\\src\\imagen\\ver.png");
        iconVer = new ImageIcon(imgVer.getImage().getScaledInstance(20, 20, 1));
        ver = new JButton(imgVer);
        ver.setName("ver");
        
        imgCopiar = new ImageIcon("C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\Operaciones\\src\\imagen\\copia.png");
        iconCopiar = new ImageIcon(imgCopiar.getImage().getScaledInstance(20, 20, 1));
        copiar = new JButton(imgCopiar);
        copiar.setName("copiar");
        
        imgElimi = new ImageIcon("C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\Operaciones\\src\\imagen\\eliminar.png");
        iconElimi = new ImageIcon(imgElimi.getImage().getScaledInstance(20, 20, 1));
        eliminar = new JButton(imgElimi);
        eliminar.setName("eliminar");
        
        tablaSolicitudes.setRowHeight(33);
    }

    /**
     * This method is called from within the constructor to initialize the form.
     * WARNING: Do NOT modify this code. The content of this method is always
     * regenerated by the Form Editor.
     */
    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        jLabel1 = new javax.swing.JLabel();
        jbuttonAgregar = new javax.swing.JButton();
        jLabel2 = new javax.swing.JLabel();
        jLabel3 = new javax.swing.JLabel();
        jDateDesde = new com.toedter.calendar.JDateChooser();
        jDateHasta = new com.toedter.calendar.JDateChooser();
        jLabel4 = new javax.swing.JLabel();
        jPanel1 = new javax.swing.JPanel();
        jLabel5 = new javax.swing.JLabel();
        jLabel6 = new javax.swing.JLabel();
        jPanel2 = new javax.swing.JPanel();
        jLabel7 = new javax.swing.JLabel();
        jLabel8 = new javax.swing.JLabel();
        jComboSucursal = new javax.swing.JComboBox<>();
        jComboAlmacen = new javax.swing.JComboBox<>();
        jPanel3 = new javax.swing.JPanel();
        jLabel10 = new javax.swing.JLabel();
        jComboActivo = new javax.swing.JComboBox<>();
        jButtonFiltro = new javax.swing.JButton();
        jPanel4 = new javax.swing.JPanel();
        jLabel9 = new javax.swing.JLabel();
        jScrollPane1 = new javax.swing.JScrollPane();
        tablaSolicitudes = new JTable(){
            public boolean isCellEditable(int rowIndex, int colIndex) {
                return colIndex != 0 && colIndex != 1 && colIndex != 2
                && colIndex != 3 && colIndex != 4 
                && colIndex != 5 && colIndex != 6
                && colIndex != 7 && colIndex != 8
                && colIndex != 9 && colIndex != 10
                && colIndex != 11 && colIndex != 12;
            }
        };

        setDefaultCloseOperation(javax.swing.WindowConstants.EXIT_ON_CLOSE);

        jLabel1.setFont(new java.awt.Font("Tahoma", 0, 14)); // NOI18N
        jLabel1.setForeground(new java.awt.Color(51, 51, 255));
        jLabel1.setText("SOLICITUD DE VIVERES");

        jbuttonAgregar.setForeground(new java.awt.Color(51, 51, 255));
        jbuttonAgregar.setIcon(new javax.swing.ImageIcon(getClass().getResource("/imagen/addition.png"))); // NOI18N
        jbuttonAgregar.setText("Agregar");
        jbuttonAgregar.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jbuttonAgregarActionPerformed(evt);
            }
        });

        jLabel2.setText("FILTRO DE SOLICITUDES");

        jLabel3.setText("PERIODO");

        jLabel4.setText("FILTRO");

        jPanel1.setBackground(new java.awt.Color(153, 153, 255));

        jLabel5.setText("Desde");

        jLabel6.setText("Hasta");

        javax.swing.GroupLayout jPanel1Layout = new javax.swing.GroupLayout(jPanel1);
        jPanel1.setLayout(jPanel1Layout);
        jPanel1Layout.setHorizontalGroup(
            jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel1Layout.createSequentialGroup()
                .addGap(103, 103, 103)
                .addComponent(jLabel5, javax.swing.GroupLayout.PREFERRED_SIZE, 53, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(114, 114, 114)
                .addComponent(jLabel6)
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );
        jPanel1Layout.setVerticalGroup(
            jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, jPanel1Layout.createSequentialGroup()
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jLabel5)
                    .addComponent(jLabel6))
                .addContainerGap())
        );

        jPanel2.setBackground(new java.awt.Color(153, 153, 255));

        jLabel7.setText("Sucursal");

        jLabel8.setText("Almacen");

        javax.swing.GroupLayout jPanel2Layout = new javax.swing.GroupLayout(jPanel2);
        jPanel2.setLayout(jPanel2Layout);
        jPanel2Layout.setHorizontalGroup(
            jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel2Layout.createSequentialGroup()
                .addGap(108, 108, 108)
                .addComponent(jLabel7)
                .addGap(124, 124, 124)
                .addComponent(jLabel8)
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );
        jPanel2Layout.setVerticalGroup(
            jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel2Layout.createSequentialGroup()
                .addContainerGap()
                .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jLabel7)
                    .addComponent(jLabel8))
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );

        jComboSucursal.setModel(new javax.swing.DefaultComboBoxModel<>(new String[] { "Todo" }));
        jComboSucursal.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jComboSucursalActionPerformed(evt);
            }
        });

        jComboAlmacen.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jComboAlmacenActionPerformed(evt);
            }
        });

        jPanel3.setBackground(new java.awt.Color(153, 153, 255));

        jLabel10.setText("Estado");

        javax.swing.GroupLayout jPanel3Layout = new javax.swing.GroupLayout(jPanel3);
        jPanel3.setLayout(jPanel3Layout);
        jPanel3Layout.setHorizontalGroup(
            jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel3Layout.createSequentialGroup()
                .addGap(109, 109, 109)
                .addComponent(jLabel10)
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );
        jPanel3Layout.setVerticalGroup(
            jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, jPanel3Layout.createSequentialGroup()
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                .addComponent(jLabel10)
                .addContainerGap())
        );

        jComboActivo.setModel(new javax.swing.DefaultComboBoxModel<>(new String[] { "Todo", "Abierto", "Cerrado" }));
        jComboActivo.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jComboActivoActionPerformed(evt);
            }
        });

        jButtonFiltro.setForeground(new java.awt.Color(51, 51, 255));
        jButtonFiltro.setText("FILTRAR");
        jButtonFiltro.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jButtonFiltroActionPerformed(evt);
            }
        });

        jPanel4.setBackground(new java.awt.Color(51, 51, 255));

        jLabel9.setForeground(new java.awt.Color(255, 255, 255));
        jLabel9.setText("Lista de Solicitudes");

        javax.swing.GroupLayout jPanel4Layout = new javax.swing.GroupLayout(jPanel4);
        jPanel4.setLayout(jPanel4Layout);
        jPanel4Layout.setHorizontalGroup(
            jPanel4Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel4Layout.createSequentialGroup()
                .addContainerGap()
                .addComponent(jLabel9, javax.swing.GroupLayout.PREFERRED_SIZE, 135, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );
        jPanel4Layout.setVerticalGroup(
            jPanel4Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addComponent(jLabel9, javax.swing.GroupLayout.DEFAULT_SIZE, 36, Short.MAX_VALUE)
        );

        tablaSolicitudes.setModel(new javax.swing.table.DefaultTableModel(
            new Object [][] {

            },
            new String [] {
                "N°", "Id", "Sucursal", "Fecha", "Hora", "Monto", "Usuario", "Estado", "Entregar", "Editar", "Imprimir", "Ver", "Eliminar"
            }
        ) {
            boolean[] canEdit = new boolean [] {
                false, false, false, false, false, false, false, false, false, false, false, false, false
            };

            public boolean isCellEditable(int rowIndex, int columnIndex) {
                return canEdit [columnIndex];
            }
        });
        tablaSolicitudes.setAutoResizeMode(javax.swing.JTable.AUTO_RESIZE_OFF);
        tablaSolicitudes.addMouseListener(new java.awt.event.MouseAdapter() {
            public void mouseClicked(java.awt.event.MouseEvent evt) {
                tablaSolicitudesMouseClicked(evt);
            }
        });
        jScrollPane1.setViewportView(tablaSolicitudes);
        if (tablaSolicitudes.getColumnModel().getColumnCount() > 0) {
            tablaSolicitudes.getColumnModel().getColumn(0).setPreferredWidth(50);
            tablaSolicitudes.getColumnModel().getColumn(1).setPreferredWidth(0);
            tablaSolicitudes.getColumnModel().getColumn(2).setPreferredWidth(100);
            tablaSolicitudes.getColumnModel().getColumn(3).setPreferredWidth(100);
            tablaSolicitudes.getColumnModel().getColumn(4).setPreferredWidth(100);
            tablaSolicitudes.getColumnModel().getColumn(5).setPreferredWidth(100);
            tablaSolicitudes.getColumnModel().getColumn(6).setPreferredWidth(100);
            tablaSolicitudes.getColumnModel().getColumn(7).setPreferredWidth(100);
            tablaSolicitudes.getColumnModel().getColumn(8).setPreferredWidth(100);
            tablaSolicitudes.getColumnModel().getColumn(9).setPreferredWidth(100);
            tablaSolicitudes.getColumnModel().getColumn(10).setPreferredWidth(100);
            tablaSolicitudes.getColumnModel().getColumn(11).setPreferredWidth(100);
            tablaSolicitudes.getColumnModel().getColumn(12).setPreferredWidth(100);
        }

        javax.swing.GroupLayout layout = new javax.swing.GroupLayout(getContentPane());
        getContentPane().setLayout(layout);
        layout.setHorizontalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(layout.createSequentialGroup()
                .addGap(119, 119, 119)
                .addComponent(jComboActivo, javax.swing.GroupLayout.PREFERRED_SIZE, 124, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(0, 0, Short.MAX_VALUE))
            .addGroup(layout.createSequentialGroup()
                .addContainerGap()
                .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, layout.createSequentialGroup()
                        .addComponent(jLabel2, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                        .addComponent(jButtonFiltro, javax.swing.GroupLayout.PREFERRED_SIZE, 90, javax.swing.GroupLayout.PREFERRED_SIZE))
                    .addComponent(jLabel1, javax.swing.GroupLayout.Alignment.TRAILING, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                    .addComponent(jPanel3, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                    .addComponent(jPanel2, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                    .addComponent(jPanel1, javax.swing.GroupLayout.Alignment.TRAILING, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                    .addComponent(jPanel4, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                    .addGroup(layout.createSequentialGroup()
                        .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addGroup(layout.createSequentialGroup()
                                .addComponent(jLabel3, javax.swing.GroupLayout.PREFERRED_SIZE, 87, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addGap(18, 18, 18)
                                .addComponent(jDateDesde, javax.swing.GroupLayout.PREFERRED_SIZE, 120, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addGap(45, 45, 45)
                                .addComponent(jDateHasta, javax.swing.GroupLayout.PREFERRED_SIZE, 120, javax.swing.GroupLayout.PREFERRED_SIZE))
                            .addGroup(layout.createSequentialGroup()
                                .addComponent(jLabel4, javax.swing.GroupLayout.PREFERRED_SIZE, 98, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                                .addComponent(jComboSucursal, javax.swing.GroupLayout.PREFERRED_SIZE, 120, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addGap(42, 42, 42)
                                .addComponent(jComboAlmacen, javax.swing.GroupLayout.PREFERRED_SIZE, 126, javax.swing.GroupLayout.PREFERRED_SIZE))
                            .addComponent(jbuttonAgregar, javax.swing.GroupLayout.PREFERRED_SIZE, 111, javax.swing.GroupLayout.PREFERRED_SIZE))
                        .addGap(0, 538, Short.MAX_VALUE))
                    .addComponent(jScrollPane1))
                .addContainerGap())
        );
        layout.setVerticalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(layout.createSequentialGroup()
                .addContainerGap()
                .addComponent(jLabel1, javax.swing.GroupLayout.PREFERRED_SIZE, 30, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addComponent(jbuttonAgregar, javax.swing.GroupLayout.PREFERRED_SIZE, 48, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(jLabel2, javax.swing.GroupLayout.PREFERRED_SIZE, 27, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(jButtonFiltro, javax.swing.GroupLayout.PREFERRED_SIZE, 27, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jPanel1, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(jLabel3, javax.swing.GroupLayout.Alignment.TRAILING, javax.swing.GroupLayout.PREFERRED_SIZE, 24, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(jDateDesde, javax.swing.GroupLayout.Alignment.TRAILING, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(jDateHasta, javax.swing.GroupLayout.Alignment.TRAILING, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jPanel2, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jLabel4, javax.swing.GroupLayout.PREFERRED_SIZE, 24, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(jComboSucursal, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(jComboAlmacen, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jPanel3, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addComponent(jComboActivo, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(28, 28, 28)
                .addComponent(jPanel4, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(44, 44, 44)
                .addComponent(jScrollPane1, javax.swing.GroupLayout.PREFERRED_SIZE, 190, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addContainerGap(72, Short.MAX_VALUE))
        );

        pack();
    }// </editor-fold>//GEN-END:initComponents

    private void jbuttonAgregarActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jbuttonAgregarActionPerformed
        AgregarProducto agregar;

        try {
            if (getConnectionStatus() == "Online") {
                agregar = new AgregarProducto(this.datosUsuario, this.id_usuario);
                agregar.setVisible(true);
                //dispose();
            } else if (getConnectionStatus() == "Offline") {
                agregar = new AgregarProducto(this.id_usuario);
                agregar.setVisible(true);
                //dispose();
            }
        } catch (Exception e) {
        }
    }//GEN-LAST:event_jbuttonAgregarActionPerformed

    private void jComboSucursalActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jComboSucursalActionPerformed
        String item = "";
        String nombre_sucursal = "";
        int id_sucursal = 0;
        item = (String) jComboSucursal.getSelectedItem().toString();
        limpiarListas(listaSucur);

        if (item.equals("Todo")) {
            nombre_sucursal = item;
            id_sucursal = 0;
            //Sucursal sucursal = new Sucursal(id_sucursal, nombre_sucursal, 0);
            //listaSucur.add(sucursal);

        } else {
            for (int i = 0; i < db.SeleccionarSucursalPorNombre(item).size(); i++) {
                nombre_sucursal = db.SeleccionarSucursalPorNombre(item).get(i).getNombre();
                id_sucursal = db.SeleccionarSucursalPorNombre(item).get(i).getId();
                //Sucursal sucursal = new Sucursal(id_sucursal, nombre_sucursal, 0);
               // listaSucur.add(sucursal);
            }

        }

        MostrarFiltroAlmacen(nombre_sucursal);
    }//GEN-LAST:event_jComboSucursalActionPerformed

    private void jButtonFiltroActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jButtonFiltroActionPerformed
        String consulta = "";
        String consulta2 = "";
        String consulta3 = "";
        ResultSet rs = null;
        ResultSet rsId_A = null;
        ResultSet rsNom_Usu = null;
        ResultSet rsNom_Suc = null;
        Date fechaDesde = jDateDesde.getDate();
        Date fechaHasta = jDateHasta.getDate();
        int id = 0;
        int id_almacen = 0;
        Date fecha;
        int id_usuario = 0;
        double monto = 0.0;
        boolean activo = false;
        String nom_sucursal = "";
        String nom_usuario = "";

        int id_sucursal = 0;
        String nombre_sucur = "";
        String nombre_alma = "";

        int cont = 0;
        defaulttable.setRowCount(0);

        String d1 = ((JTextField) jDateDesde.getDateEditor().getUiComponent()).getText();
        String d2 = ((JTextField) jDateHasta.getDateEditor().getUiComponent()).getText();
        try {
            for (int i = 0; i < listaSucur.size(); i++) {
               // nombre_sucur = listaSucur.get(i).getNombre();
              //  id_sucursal = listaSucur.get(i).getId();
            }

            for (int i = 0; i < ListaAlmacen.size(); i++) {
                nombre_alma = ListaAlmacen.get(i).getNombre();
                id_almacen = ListaAlmacen.get(i).getId();
            }
            defaulttable.setRowCount(0);
            estado = jComboActivo.getSelectedItem().toString();
            
            if ((!d1.toString().equals("")) && (d2.toString().equals("")) && (nombre_sucur == "Todo") && (nombre_alma == "Todo") && (estado == "Todo")) {
                long fh = fechaDesde.getTime();
                java.sql.Date desde = new java.sql.Date(fh);

//SELECT * FROM SOLICITUD_REPOSICION S INNER JOIN LOGIN L ON L.ID = S.USUARIO  WHERE FECHA >= '2018-03-08' AND FECHA <= '2018-03-09' AND USUARIO = 149
                consulta = "SELECT S.ID,S.ALMACEN,S.FECHA, S.USUARIO,S.MONTO,S.ACTIVO,SU.NOMBRE, U.NOMBRE_USUARIO \n" +
                    "FROM SOLICITUD_REPOSICION S\n" +
                    "INNER JOIN LOGIN L ON L.ID = S.USUARIO \n" +
                    "INNER JOIN ALMACEN AS A ON A.ID = S.ALMACEN\n" +
                    "INNER JOIN SUCURSAL AS SU ON SU.ID = A.ID_SUCURSAL\n" +
                    "INNER JOIN USUARIO AS U ON U.ID = S.USUARIO\n" +
                    "WHERE S.FECHA >= '"+desde+"' AND S.USUARIO= "+this.id_usuario+" \n"+
                    "ORDER BY FECHA ASC ";
                rs = db.selectInFiltro(consulta);
                while (rs.next()) {
                    id = rs.getInt(1);
                    id_almacen = rs.getInt(2);
                    fecha = rs.getDate(3);
                    id_usuario = rs.getInt(4);
                    monto = rs.getDouble(5);
                    activo = rs.getBoolean(6);
                    nom_sucursal = rs.getString(7);
                    nom_usuario = rs.getString(8);

                    if (activo == true) {
                        SinEnviar(cont++, id, nom_sucursal, fecha, monto, nom_usuario, activo, entregar, editar, Imprimir, ver, copiar, eliminar);
                    } else if (activo == false) {
                        enviado(cont++, id, nom_sucursal, fecha, monto, nom_usuario, activo, bloqueado, noeditar, Imprimir, ver, copiar, eliminar);
                    }                    
                }
            } else if (d1.toString().equals("") && !d2.toString().equals("") && (nombre_sucur == "Todo") && (nombre_alma == "Todo") && (estado == "Todo")) {

                long fh = fechaHasta.getTime();
                java.sql.Date hasta = new java.sql.Date(fh);

                consulta2 = "SELECT S.ID,S.ALMACEN,S.FECHA, S.USUARIO,S.MONTO,S.ACTIVO,SU.NOMBRE, U.NOMBRE_USUARIO \n" +
                    "FROM SOLICITUD_REPOSICION S\n" +
                    "INNER JOIN LOGIN L ON L.ID = S.USUARIO \n" +
                    "INNER JOIN ALMACEN AS A ON A.ID = S.ALMACEN\n" +
                    "INNER JOIN SUCURSAL AS SU ON SU.ID = A.ID_SUCURSAL\n" +
                    "INNER JOIN USUARIO AS U ON U.ID = S.USUARIO\n" +
                    "WHERE S.FECHA <= '"+hasta+"' AND S.USUARIO= "+this.id_usuario+" \n"+
                    "ORDER BY FECHA ASC ";
                rs = db.selectInFiltro(consulta2);
                while (rs.next()) {
                    id = rs.getInt(1);
                    id_almacen = rs.getInt(2);
                    fecha = rs.getDate(3);
                    id_usuario = rs.getInt(4);
                    monto = rs.getDouble(5);
                    activo = rs.getBoolean(6);
                    nom_sucursal = rs.getString(7);
                    nom_usuario = rs.getString(8);

                    if (activo == true) {
                        SinEnviar(cont++, id, nom_sucursal, fecha, monto, nom_usuario, activo, entregar, editar, Imprimir, ver, copiar, eliminar);
                    } else if (activo == false) {
                        enviado(cont++, id, nom_sucursal, fecha, monto, nom_usuario, activo, bloqueado, noeditar, Imprimir, ver, copiar, eliminar);
                    }                                        
                }
            }else if ((!d1.toString().equals("")) && (d2.toString().equals("")) && (nombre_sucur == "Todo") && (nombre_alma == "Todo") && (estado != "Todo")) {
                long fh = fechaDesde.getTime();
                java.sql.Date desde = new java.sql.Date(fh);
                boolean tipoEstado = (estado == "Abierto") ? true : false;

               consulta3 = "SELECT S.ID,S.ALMACEN,S.FECHA, S.USUARIO,S.MONTO,S.ACTIVO,SU.NOMBRE, U.NOMBRE_USUARIO \n" +
                    "FROM SOLICITUD_REPOSICION S\n" +
                    "INNER JOIN LOGIN L ON L.ID = S.USUARIO \n" +
                    "INNER JOIN ALMACEN AS A ON A.ID = S.ALMACEN\n" +
                    "INNER JOIN SUCURSAL AS SU ON SU.ID = A.ID_SUCURSAL\n" +
                    "INNER JOIN USUARIO AS U ON U.ID = S.USUARIO\n" +
                    "WHERE S.FECHA >= '"+desde+"' AND S.USUARIO= "+this.id_usuario+" AND ACTIVO = "+tipoEstado+" \n"+
                    "ORDER BY FECHA ASC ";
                rs = db.selectInFiltro(consulta3);
                while (rs.next()) {
                    id = rs.getInt(1);
                    id_almacen = rs.getInt(2);
                    fecha = rs.getDate(3);
                    id_usuario = rs.getInt(4);
                    monto = rs.getDouble(5);
                    activo = rs.getBoolean(6);
                    nom_sucursal = rs.getString(7);
                    nom_usuario = rs.getString(8);

                    if (activo == true) {
                        SinEnviar(cont++, id, nom_sucursal, fecha, monto, nom_usuario, activo, entregar, editar, Imprimir, ver, copiar, eliminar);
                    } else if (activo == false) {
                        enviado(cont++, id, nom_sucursal, fecha, monto, nom_usuario, activo, bloqueado, noeditar, Imprimir, ver, copiar, eliminar);
                    }
                }
            }else if ((!d1.toString().equals("")) && (d2.toString().equals("")) && (nombre_sucur != "Todo") && (nombre_alma == "Todo") && (estado == "Todo")) {
                long fh = fechaDesde.getTime();
                java.sql.Date desde = new java.sql.Date(fh);
                int id_alma = 0;
                // boolean tipoEstado = (estado == "Abierto") ? true : false;
               

                String consulta4 = "SELECT SO.ID,SO.ALMACEN,SO.FECHA,SO.USUARIO,SO.MONTO,SO.ACTIVO,SU.NOMBRE, U.NOMBRE_USUARIO \n" +
                    "FROM SUCURSAL AS SU\n" +
                    "INNER JOIN ALMACEN AS A ON A.ID_SUCURSAL = SU.ID\n" +
                    "INNER JOIN SOLICITUD_REPOSICION AS SO ON SO.ALMACEN = A.ID\n" +
                    "INNER JOIN USUARIO AS U ON U.ID = SO.USUARIO\n" +
                    "WHERE SU.ID = "+id_sucursal+" AND SO.FECHA >= '"+desde+"' AND SO.USUARIO = "+this.id_usuario+" \n" +
                    "ORDER BY FECHA ASC";
                rs = db.selectInFiltro(consulta4);
                while (rs.next()) {
                    id = rs.getInt(1);
                    id_almacen = rs.getInt(2);
                    fecha = rs.getDate(3);
                    id_usuario = rs.getInt(4);
                    monto = rs.getDouble(5);
                    activo = rs.getBoolean(6);
                    nom_sucursal = rs.getString(7);
                    nom_usuario = rs.getString(8);

                    if (activo == true) {
                        SinEnviar(cont++, id, nom_sucursal, fecha, monto, nom_usuario, activo, entregar, editar, Imprimir, ver, copiar, eliminar);
                    } else if (activo == false) {
                        enviado(cont++, id, nom_sucursal, fecha, monto, nom_usuario, activo, bloqueado, noeditar, Imprimir, ver, copiar, eliminar);
                    }                  
                }            
            }else if ((!d1.toString().equals("")) && (d2.toString().equals("")) && (nombre_sucur != "Todo") && (nombre_alma != "Todo") && (estado == "Todo")) {
                long fh = fechaDesde.getTime();
                java.sql.Date desde = new java.sql.Date(fh);
                // boolean tipoEstado = (estado == "Abierto") ? true : false;
                
                String consulta5 = "SELECT S.ID,S.ALMACEN,S.FECHA, S.USUARIO,S.MONTO,S.ACTIVO,SU.NOMBRE, U.NOMBRE_USUARIO \n" +
                    "FROM SOLICITUD_REPOSICION S \n" +
                    "INNER JOIN LOGIN L ON L.ID = S.USUARIO \n" +
                    "INNER JOIN ALMACEN AS A ON A.ID = S.ALMACEN\n" +
                    "INNER JOIN USUARIOSUCURSAL AS SU ON SU.ID = A.ID_SUCURSAL\n" +
                    "INNER JOIN  AS U ON U.ID = S.USUARIO\n" +
                    "WHERE S.FECHA >= '"+desde+"' AND S.USUARIO = "+this.id_usuario+" AND S.ALMACEN = "+id_almacen+" \n" +
                    "ORDER BY FECHA ASC ";
                rs = db.selectInFiltro(consulta5);
                while (rs.next()) {
                    id = rs.getInt(1);
                    id_almacen = rs.getInt(2);
                    fecha = rs.getDate(3);
                    id_usuario = rs.getInt(4);
                    monto = rs.getDouble(5);
                    activo = rs.getBoolean(6);
                    nom_sucursal = rs.getString(7);
                    nom_usuario = rs.getString(8);
                  
                    if (activo == true) {
                        SinEnviar(cont++, id, nom_sucursal, fecha, monto, nom_usuario, activo, entregar, editar, Imprimir, ver, copiar, eliminar);
                    } else if (activo == false) {
                        enviado(cont++, id, nom_sucursal, fecha, monto, nom_usuario, activo, bloqueado, noeditar, Imprimir, ver, copiar, eliminar);
                    }        
                }
            }else if ((!d1.toString().equals("")) && (d2.toString().equals("")) && (nombre_sucur != "Todo") && (nombre_alma != "Todo") && (estado != "Todo")) {
                long fh = fechaDesde.getTime();
                java.sql.Date desde = new java.sql.Date(fh);
                boolean tipoEstado = (estado == "Abierto") ? true : false;

                String consulta6 = "SELECT S.ID,S.ALMACEN,S.FECHA, S.USUARIO,S.MONTO,S.ACTIVO,SU.NOMBRE, U.NOMBRE_USUARIO \n" +
                    "FROM SOLICITUD_REPOSICION S \n" +
                    "INNER JOIN LOGIN L ON L.ID = S.USUARIO \n" +
                    "INNER JOIN ALMACEN AS A ON A.ID = S.ALMACEN\n" +
                    "INNER JOIN SUCURSAL AS SU ON SU.ID = A.ID_SUCURSAL\n" +
                    "INNER JOIN USUARIO AS U ON U.ID = S.USUARIO\n" +
                    "WHERE S.FECHA >= '"+desde+"' AND S.USUARIO = "+this.id_usuario+" AND S.ALMACEN = "+id_almacen+"  AND ACTIVO = "+tipoEstado+" \n" +
                    "ORDER BY FECHA ASC ";
                rs = db.selectInFiltro(consulta6);
                while (rs.next()) {
                    id = rs.getInt(1);
                    id_almacen = rs.getInt(2);
                    fecha = rs.getDate(3);
                    id_usuario = rs.getInt(4);
                    monto = rs.getDouble(5);
                    activo = rs.getBoolean(6);
                    nom_sucursal = rs.getString(7);
                    nom_usuario = rs.getString(8);
                        
                    if (activo == true) {
                        SinEnviar(cont++, id, nom_sucursal, fecha, monto, nom_usuario, activo, entregar, editar, Imprimir, ver, copiar, eliminar);
                    } else if (activo == false) {
                        enviado(cont++, id, nom_sucursal, fecha, monto, nom_usuario, activo, bloqueado, noeditar, Imprimir, ver, copiar, eliminar);
                    }           
                }
            }else if ((!d1.toString().equals("")) && (d2.toString().equals("")) && (nombre_sucur != "Todo") && (nombre_alma == "Todo") && (estado != "Todo")) {
                long fh = fechaDesde.getTime();
                java.sql.Date desde = new java.sql.Date(fh);
                boolean tipoEstado = (estado == "Abierto") ? true : false;

                String consulta7 = "SELECT SO.ID,SO.ALMACEN,SO.FECHA,SO.USUARIO,SO.MONTO,SO.ACTIVO,SU.NOMBRE, U.NOMBRE_USUARIO \n" +
                    "FROM SUCURSAL AS SU\n" +
                    "INNER JOIN ALMACEN AS A ON A.ID_SUCURSAL = SU.ID\n" +
                    "INNER JOIN SOLICITUD_REPOSICION AS SO ON SO.ALMACEN = A.ID\n" +
                    "INNER JOIN USUARIO AS U ON U.ID = SO.USUARIO\n" +
                    "WHERE SU.ID = "+id_sucursal+" AND SO.FECHA >= '"+desde+"' AND SO.USUARIO = "+this.id_usuario+" AND SO.ACTIVO = "+tipoEstado+" \n" +
                    "ORDER BY FECHA ASC";
                
                rs = db.selectInFiltro(consulta7);
                while (rs.next()) {
                    id = rs.getInt(1);
                    id_almacen = rs.getInt(2);
                    fecha = rs.getDate(3);
                    id_usuario = rs.getInt(4);
                    monto = rs.getDouble(5);
                    activo = rs.getBoolean(6);
                    nom_sucursal = rs.getString(7);
                    nom_usuario = rs.getString(8);
                        
                    if (activo == true) {
                        SinEnviar(cont++, id, nom_sucursal, fecha, monto, nom_usuario, activo, entregar, editar, Imprimir, ver, copiar, eliminar);
                    } else if (activo == false) {
                        enviado(cont++, id, nom_sucursal, fecha, monto, nom_usuario, activo, bloqueado, noeditar, Imprimir, ver, copiar, eliminar);
                    }           
                }
            }else if ((d1.toString().equals("")) && (!d2.toString().equals("")) && (nombre_sucur != "Todo") && (nombre_alma == "Todo") && (estado == "Todo")){
                long fh = fechaHasta.getTime();
                java.sql.Date hasta = new java.sql.Date(fh);
                int id_alma = 0;
                // boolean tipoEstado = (estado == "Abierto") ? true : false;

                String consulta7 = "SELECT SO.ID,SO.ALMACEN,SO.FECHA,SO.USUARIO,SO.MONTO,SO.ACTIVO,SU.NOMBRE, U.NOMBRE_USUARIO \n" +
                    "FROM SUCURSAL AS SU\n" +
                    "INNER JOIN ALMACEN AS A ON A.ID_SUCURSAL = SU.ID\n" +
                    "INNER JOIN SOLICITUD_REPOSICION AS SO ON SO.ALMACEN = A.ID\n" +
                    "INNER JOIN USUARIO AS U ON U.ID = SO.USUARIO\n" +
                    "WHERE SU.ID = "+id_sucursal+" AND SO.FECHA <= '"+hasta+"' AND SO.USUARIO = "+this.id_usuario+" \n" +
                    "ORDER BY FECHA ASC";
                
                rs = db.selectInFiltro(consulta7);
                while (rs.next()) {
                    id = rs.getInt(1);
                    id_almacen = rs.getInt(2);
                    fecha = rs.getDate(3);
                    id_usuario = rs.getInt(4);
                    monto = rs.getDouble(5);
                    activo = rs.getBoolean(6);
                    nom_sucursal = rs.getString(7);
                    nom_usuario = rs.getString(8);

                    if (activo == true) {
                        SinEnviar(cont++, id, nom_sucursal, fecha, monto, nom_usuario, activo, entregar, editar, Imprimir, ver, copiar, eliminar);
                    } else if (activo == false) {
                        enviado(cont++, id, nom_sucursal, fecha, monto, nom_usuario, activo, bloqueado, noeditar, Imprimir, ver, copiar, eliminar);
                    }
                }
            }else if ((d1.toString().equals("")) && (!d2.toString().equals("")) && (nombre_sucur != "Todo") && (nombre_alma != "Todo") && (estado == "Todo")) {

                long fh = fechaHasta.getTime();
                java.sql.Date hasta = new java.sql.Date(fh);
                // boolean tipoEstado = (estado == "Abierto") ? true : false;

                String consulta8 = "SELECT S.ID,S.ALMACEN,S.FECHA, S.USUARIO,S.MONTO,S.ACTIVO,SU.NOMBRE, U.NOMBRE_USUARIO \n" +
                    "FROM SOLICITUD_REPOSICION S \n" +
                    "INNER JOIN LOGIN L ON L.ID = S.USUARIO \n" +
                    "INNER JOIN ALMACEN AS A ON A.ID = S.ALMACEN\n" +
                    "INNER JOIN SUCURSAL AS SU ON SU.ID = A.ID_SUCURSAL\n" +
                    "INNER JOIN USUARIO AS U ON U.ID = S.USUARIO\n" +
                    "WHERE S.FECHA >= '"+hasta+"' AND S.USUARIO = "+this.id_usuario+" AND S.ALMACEN = "+id_almacen+" \n" +
                    "ORDER BY FECHA ASC ";
                
                rs = db.selectInFiltro(consulta8);
                while (rs.next()) {
                    id = rs.getInt(1);
                    id_almacen = rs.getInt(2);
                    fecha = rs.getDate(3);
                    id_usuario = rs.getInt(4);
                    monto = rs.getDouble(5);
                    activo = rs.getBoolean(6);
                    nom_sucursal = rs.getString(7);
                    nom_usuario = rs.getString(8);
                        
                    if (activo == true) {
                        SinEnviar(cont++, id, nom_sucursal, fecha, monto, nom_usuario, activo, entregar, editar, Imprimir, ver, copiar, eliminar);
                    } else if (activo == false) {
                        enviado(cont++, id, nom_sucursal, fecha, monto, nom_usuario, activo, bloqueado, noeditar, Imprimir, ver, copiar, eliminar);
                    }
                    
                }
            }else if ((d1.toString().equals("")) && (!d2.toString().equals("")) && (nombre_sucur != "Todo") && (nombre_alma != "Todo") && (estado != "Todo")) {

                long fh = fechaHasta.getTime();
                java.sql.Date hasta = new java.sql.Date(fh);
                boolean tipoEstado = (estado == "Abierto") ? true : false;

                String consulta9 = "SELECT S.ID,S.ALMACEN,S.FECHA, S.USUARIO,S.MONTO,S.ACTIVO,SU.NOMBRE, U.NOMBRE_USUARIO \n" +
                    "FROM SOLICITUD_REPOSICION S \n" +
                    "INNER JOIN LOGIN L ON L.ID = S.USUARIO \n" +
                    "INNER JOIN ALMACEN AS A ON A.ID = S.ALMACEN\n" +
                    "INNER JOIN SUCURSAL AS SU ON SU.ID = A.ID_SUCURSAL\n" +
                    "INNER JOIN USUARIO AS U ON U.ID = S.USUARIO\n" +
                    "WHERE S.FECHA >= '"+hasta+"' AND S.USUARIO = "+this.id_usuario+" AND S.ALMACEN = "+id_almacen+"  AND ACTIVO = "+tipoEstado+" \n" +
                    "ORDER BY FECHA ASC ";
                rs = db.selectInFiltro(consulta9);
                while (rs.next()) {
                    id = rs.getInt(1);
                    id_almacen = rs.getInt(2);
                    fecha = rs.getDate(3);
                    id_usuario = rs.getInt(4);
                    monto = rs.getDouble(5);
                    activo = rs.getBoolean(6);
                    nom_sucursal = rs.getString(7);
                    nom_usuario = rs.getString(8);
    
                    if (activo == true) {
                        SinEnviar(cont++, id, nom_sucursal, fecha, monto, nom_usuario, activo, entregar, editar, Imprimir, ver, copiar, eliminar);
                    } else if (activo == false) {
                        enviado(cont++, id, nom_sucursal, fecha, monto, nom_usuario, activo, bloqueado, noeditar, Imprimir, ver, copiar, eliminar);
                    }
                    
                }
            }else if ((!d1.toString().equals("")) && (!d2.toString().equals("")) && (nombre_sucur == "Todo") && (nombre_alma == "Todo") && (estado == "Todo")) {
                long fd = fechaDesde.getTime();
                java.sql.Date desde = new java.sql.Date(fd);

                long fh = fechaHasta.getTime();
                java.sql.Date hasta = new java.sql.Date(fh);
                
                String consulta10 = "SELECT S.ID,S.ALMACEN,S.FECHA, S.USUARIO,S.MONTO,S.ACTIVO,SU.NOMBRE, U.NOMBRE_USUARIO \n" +
                    "FROM SOLICITUD_REPOSICION S \n" +
                    "INNER JOIN LOGIN L ON L.ID = S.USUARIO \n" +
                    "INNER JOIN ALMACEN AS A ON A.ID = S.ALMACEN\n" +
                    "INNER JOIN SUCURSAL AS SU ON SU.ID = A.ID_SUCURSAL\n" +
                    "INNER JOIN USUARIO AS U ON U.ID = S.USUARIO\n" +
                    "WHERE S.FECHA >= '"+desde+"' AND S.FECHA <= '"+hasta+"' AND S.USUARIO = "+this.id_usuario+"\n" +
                    "ORDER BY FECHA ASC ";
                rs = db.selectInFiltro(consulta10);
                while (rs.next()) {
                    id = rs.getInt(1);
                    id_almacen = rs.getInt(2);
                    fecha = rs.getDate(3);
                    id_usuario = rs.getInt(4);
                    monto = rs.getDouble(5);
                    activo = rs.getBoolean(6);
                    nom_sucursal = rs.getString(7);
                    nom_usuario = rs.getString(8);

                    if (activo == true) {
                        SinEnviar(cont++, id, nom_sucursal, fecha, monto, nom_usuario, activo, entregar, editar, Imprimir, ver, copiar, eliminar);
                    } else if (activo == false) {
                        enviado(cont++, id, nom_sucursal, fecha, monto, nom_usuario, activo, bloqueado, noeditar, Imprimir, ver, copiar, eliminar);
                    }                 
                }
            }else if ((!d1.toString().equals("")) && (!d2.toString().equals("")) && (nombre_sucur == "Todo") && (nombre_alma == "Todo") && (estado != "Todo")) {
                long fd = fechaDesde.getTime();
                java.sql.Date desde = new java.sql.Date(fd);

                long fh = fechaHasta.getTime();
                java.sql.Date hasta = new java.sql.Date(fh);
                boolean tipoEstado = (estado == "Abierto") ? true : false;

                String consulta11 = "SELECT S.ID,S.ALMACEN,S.FECHA, S.USUARIO,S.MONTO,S.ACTIVO,SU.NOMBRE, U.NOMBRE_USUARIO \n" +
                    "FROM SOLICITUD_REPOSICION S \n" +
                    "INNER JOIN LOGIN L ON L.ID = S.USUARIO \n" +
                    "INNER JOIN ALMACEN AS A ON A.ID = S.ALMACEN\n" +
                    "INNER JOIN SUCURSAL AS SU ON SU.ID = A.ID_SUCURSAL\n" +
                    "INNER JOIN USUARIO AS U ON U.ID = S.USUARIO\n" +
                    "WHERE S.FECHA >= '"+desde+"' AND S.FECHA <= '"+hasta+"' AND S.USUARIO = "+this.id_usuario+" AND ACTIVO = "+tipoEstado+" \n" +
                    "ORDER BY FECHA ASC ";
                rs = db.selectInFiltro(consulta11);
                while (rs.next()) {
                    id = rs.getInt(1);
                    id_almacen = rs.getInt(2);
                    fecha = rs.getDate(3);
                    id_usuario = rs.getInt(4);
                    monto = rs.getDouble(5);
                    activo = rs.getBoolean(6);
                    nom_sucursal = rs.getString(7);
                    nom_usuario = rs.getString(8);

                    if (activo == true) {
                        SinEnviar(cont++, id, nom_sucursal, fecha, monto, nom_usuario, activo, entregar, editar, Imprimir, ver, copiar, eliminar);
                    } else if (activo == false) {
                        enviado(cont++, id, nom_sucursal, fecha, monto, nom_usuario, activo, bloqueado, noeditar, Imprimir, ver, copiar, eliminar);
                    }        
                }
            }else if ((!d1.toString().equals("")) && (!d2.toString().equals("")) && (nombre_sucur != "Todo") && (nombre_alma == "Todo") && (estado == "Todo")) {

                long fh = fechaHasta.getTime();
                java.sql.Date hasta = new java.sql.Date(fh);

                long fd = fechaDesde.getTime();
                java.sql.Date desde = new java.sql.Date(fd);
                int id_alma = 0;
                // boolean tipoEstado = (estado == "Abierto") ? true : false;
                String consulta12 = "SELECT SO.ID,SO.ALMACEN,SO.FECHA,SO.USUARIO,SO.MONTO,SO.ACTIVO,SU.NOMBRE, U.NOMBRE_USUARIO \n" +
                    "FROM SUCURSAL AS SU\n" +
                    "INNER JOIN ALMACEN AS A ON A.ID_SUCURSAL = SU.ID\n" +
                    "INNER JOIN SOLICITUD_REPOSICION AS SO ON SO.ALMACEN = A.ID\n" +
                    "INNER JOIN USUARIO AS U ON U.ID = SO.USUARIO\n" +
                    "WHERE SU.ID = "+id_sucursal+" AND SO.FECHA >= '"+desde+"' AND SO.FECHA <= '"+hasta+"' AND SO.USUARIO = "+this.id_usuario+" \n" +
                    "ORDER BY FECHA ASC";
           
                rs= db.selectInFiltro(consulta12);
                while (rs.next()) {
                    id = rs.getInt(1);
                    id_almacen = rs.getInt(2);
                    fecha = rs.getDate(3);
                    id_usuario = rs.getInt(4);
                    monto = rs.getDouble(5);
                    activo = rs.getBoolean(6);
                    nom_sucursal = rs.getString(7);
                    nom_usuario = rs.getString(8);
   

                    if (activo == true) {
                        SinEnviar(cont++, id, nom_sucursal, fecha, monto, nom_usuario, activo, entregar, editar, Imprimir, ver, copiar, eliminar);
                    } else if (activo == false) {
                        enviado(cont++, id, nom_sucursal, fecha, monto, nom_usuario, activo, bloqueado, noeditar, Imprimir, ver, copiar, eliminar);
                    }
                }
            }else if ((!d1.toString().equals("")) && (!d2.toString().equals("")) && (nombre_sucur != "Todo") && (nombre_alma == "Todo") && (estado != "Todo")) {

                long fh = fechaHasta.getTime();
                java.sql.Date hasta = new java.sql.Date(fh);

                long fd = fechaDesde.getTime();
                java.sql.Date desde = new java.sql.Date(fd);
                int id_alma = 0;
                boolean tipoEstado = (estado == "Abierto") ? true : false;

                String consulta13 = "SELECT SO.ID,SO.ALMACEN,SO.FECHA,SO.USUARIO,SO.MONTO,SO.ACTIVO,SU.NOMBRE, U.NOMBRE_USUARIO \n" +
                    "FROM SUCURSAL AS SU\n" +
                    "INNER JOIN ALMACEN AS A ON A.ID_SUCURSAL = SU.ID\n" +
                    "INNER JOIN SOLICITUD_REPOSICION AS SO ON SO.ALMACEN = A.ID\n" +
                    "INNER JOIN USUARIO AS U ON U.ID = SO.USUARIO\n" +
                    "WHERE SU.ID = "+id_sucursal+" AND SO.FECHA >= '"+desde+"' AND SO.FECHA <= '"+hasta+"' AND SO.USUARIO = "+this.id_usuario+" AND ACTIVO = "+tipoEstado+" \n" +
                    "ORDER BY FECHA ASC";
                
                rs = db.selectInFiltro(consulta13);
                while (rs.next()) {
                    id = rs.getInt(1);
                    id_almacen = rs.getInt(2);
                    fecha = rs.getDate(3);
                    id_usuario = rs.getInt(4);
                    monto = rs.getDouble(5);
                    activo = rs.getBoolean(6);
                    nom_sucursal = rs.getString(7);
                    nom_usuario = rs.getString(8);

                    if (activo == true) {
                        SinEnviar(cont++, id, nom_sucursal, fecha, monto, nom_usuario, activo, entregar, editar, Imprimir, ver, copiar, eliminar);
                    } else if (activo == false) {
                        enviado(cont++, id, nom_sucursal, fecha, monto, nom_usuario, activo, bloqueado, noeditar, Imprimir, ver, copiar, eliminar);
                    }                                             
                }
            }else if ((!d1.toString().equals("")) && (!d2.toString().equals("")) && (nombre_sucur != "Todo") && (nombre_alma != "Todo") && (estado == "Todo")) {

                long fh = fechaHasta.getTime();
                java.sql.Date hasta = new java.sql.Date(fh);

                long fd = fechaDesde.getTime();
                java.sql.Date desde = new java.sql.Date(fd);
                // boolean tipoEstado = (estado == "Abierto") ? true : false;

                String consulta14 = "SELECT S.ID,S.ALMACEN,S.FECHA, S.USUARIO,S.MONTO,S.ACTIVO,SU.NOMBRE, U.NOMBRE_USUARIO \n" +
                    "FROM SOLICITUD_REPOSICION S \n" +
                    "INNER JOIN LOGIN L ON L.ID = S.USUARIO \n" +
                    "INNER JOIN ALMACEN AS A ON A.ID = S.ALMACEN\n" +
                    "INNER JOIN SUCURSAL AS SU ON SU.ID = A.ID_SUCURSAL\n" +
                    "INNER JOIN USUARIO AS U ON U.ID = S.USUARIO\n" +
                    "WHERE S.FECHA >= '"+desde+"' AND S.FECHA <= '"+hasta+"' AND S.USUARIO = "+this.id_usuario+" AND S.ALMACEN = "+id_almacen+" \n" +
                    "ORDER BY FECHA ASC ";
                
                rs = db.selectInFiltro(consulta14);
                while (rs.next()) {
                    id = rs.getInt(1);
                    id_almacen = rs.getInt(2);
                    fecha = rs.getDate(3);
                    id_usuario = rs.getInt(4);
                    monto = rs.getDouble(5);
                    activo = rs.getBoolean(6);
                    nom_sucursal = rs.getString(7);
                    nom_usuario = rs.getString(8);
                                      
                    if (activo == true) {
                        SinEnviar(cont++, id, nom_sucursal, fecha, monto, nom_usuario, activo, entregar, editar, Imprimir, ver, copiar, eliminar);
                    } else if (activo == false) {
                        enviado(cont++, id, nom_sucursal, fecha, monto, nom_usuario, activo, bloqueado, noeditar, Imprimir, ver, copiar, eliminar);
                    }
                }
            }else if ((!d1.toString().equals("")) && (!d2.toString().equals("")) && (nombre_sucur != "Todo") && (nombre_alma != "Todo") && (estado != "Todo")) {

                long fh = fechaHasta.getTime();
                java.sql.Date hasta = new java.sql.Date(fh);
                long fd = fechaDesde.getTime();
                java.sql.Date desde = new java.sql.Date(fd);
                boolean tipoEstado = (estado == "Abierto") ? true : false;

                String consulta15 = "SELECT S.ID,S.ALMACEN,S.FECHA, S.USUARIO,S.MONTO,S.ACTIVO,SU.NOMBRE, U.NOMBRE_USUARIO \n" +
                    "FROM SOLICITUD_REPOSICION S \n" +
                    "INNER JOIN LOGIN L ON L.ID = S.USUARIO \n" +
                    "INNER JOIN ALMACEN AS A ON A.ID = S.ALMACEN\n" +
                    "INNER JOIN SUCURSAL AS SU ON SU.ID = A.ID_SUCURSAL\n" +
                    "INNER JOIN USUARIO AS U ON U.ID = S.USUARIO\n" +
                    "WHERE S.FECHA >= '"+desde+"' AND S.FECHA <= '"+hasta+"' AND S.USUARIO = "+this.id_usuario+" AND S.ALMACEN = "+id_almacen+" AND S.ACTIVO = "+tipoEstado+" \n" +
                    "ORDER BY FECHA ASC ";
                rs = db.selectInFiltro(consulta15);
                while (rs.next()) {
                    id = rs.getInt(1);
                    id_almacen = rs.getInt(2);
                    fecha = rs.getDate(3);
                    id_usuario = rs.getInt(4);
                    monto = rs.getDouble(5);
                    activo = rs.getBoolean(6);
                    nom_sucursal = rs.getString(7);
                    nom_usuario = rs.getString(8);
                    
                    if (activo == true) {
                        SinEnviar(cont++, id, nom_sucursal, fecha, monto, nom_usuario, activo, entregar, editar, Imprimir, ver, copiar, eliminar);
                    } else if (activo == false) {
                        enviado(cont++, id, nom_sucursal, fecha, monto, nom_usuario, activo, bloqueado, noeditar, Imprimir, ver, copiar, eliminar);
                    }                    
                }
            }else if ((nombre_sucur == "Todo") && (nombre_alma == "Todo") && (estado == "Todo")) {

                String consultaTodo = "SELECT S.ID,S.ALMACEN,S.FECHA, S.USUARIO,S.MONTO,S.ACTIVO,SU.NOMBRE, U.NOMBRE_USUARIO \n" +
                    "FROM SOLICITUD_REPOSICION S \n" +
                    "INNER JOIN LOGIN L ON L.ID = S.USUARIO \n" +
                    "INNER JOIN ALMACEN AS A ON A.ID = S.ALMACEN\n" +
                    "INNER JOIN SUCURSAL AS SU ON SU.ID = A.ID_SUCURSAL\n" +
                    "INNER JOIN USUARIO AS U ON U.ID = S.USUARIO\n" +
                    "WHERE  S.USUARIO = "+this.id_usuario+" \n" +
                    "ORDER BY FECHA ASC ";
                rs = db.selectInFiltro(consultaTodo);
                while (rs.next()) {
                    id = rs.getInt(1);
                    id_almacen = rs.getInt(2);
                    fecha = rs.getDate(3);
                    id_usuario = rs.getInt(4);
                    monto = rs.getDouble(5);
                    activo = rs.getBoolean(6);
                    nom_sucursal = rs.getString(7);
                    nom_usuario = rs.getString(8);

                    if (activo == true) {
                        SinEnviar(cont++, id, nom_sucursal, fecha, monto, nom_usuario, activo, entregar, editar, Imprimir, ver, copiar, eliminar);
                    } else if (activo == false) {
                        enviado(cont++, id, nom_sucursal, fecha, monto, nom_usuario, activo, bloqueado, noeditar, Imprimir, ver, copiar, eliminar);
                    }                           
                }
            }else if ((nombre_sucur != "Todo") && (nombre_alma == "Todo") && (estado == "Todo")) {
                String consulta16 = "SELECT SO.ID,SO.ALMACEN,SO.FECHA,SO.USUARIO,SO.MONTO,SO.ACTIVO,SU.NOMBRE, U.NOMBRE_USUARIO \n" +
                    "FROM SUCURSAL AS SU\n" +
                    "INNER JOIN ALMACEN AS A ON A.ID_SUCURSAL = SU.ID\n" +
                    "INNER JOIN SOLICITUD_REPOSICION AS SO ON SO.ALMACEN = A.ID\n" +
                    "INNER JOIN USUARIO AS U ON U.ID = SO.USUARIO\n" +
                    "WHERE SU.ID = "+id_sucursal+" AND SO.USUARIO = "+this.id_usuario+" \n" +
                    "ORDER BY FECHA ASC";

                rs = db.selectInFiltro(consulta16);
                while (rs.next()) {
                    id = rs.getInt(1);
                    id_almacen = rs.getInt(2);
                    fecha = rs.getDate(3);
                    id_usuario = rs.getInt(4);
                    monto = rs.getDouble(5);
                    activo = rs.getBoolean(6);
                    nom_sucursal = rs.getString(7);
                    nom_usuario = rs.getString(8);

                    if (activo == true) {
                        SinEnviar(cont++, id, nom_sucursal, fecha, monto, nom_usuario, activo, entregar, editar, Imprimir, ver, copiar, eliminar);
                    } else if (activo == false) {
                        enviado(cont++, id, nom_sucursal, fecha, monto, nom_usuario, activo, bloqueado, noeditar, Imprimir, ver, copiar, eliminar);
                    }
                }
            }else if ((nombre_sucur != "Todo") && (nombre_alma == "Todo") && (estado != "Todo")) {
                boolean tipoEstado = (estado == "Abierto") ? true : false;
                
                String consulta18 = "SELECT SO.ID,SO.ALMACEN,SO.FECHA,SO.USUARIO,SO.MONTO,SO.ACTIVO,SU.NOMBRE, U.NOMBRE_USUARIO \n" +
                    "FROM SUCURSAL AS SU\n" +
                    "INNER JOIN ALMACEN AS A ON A.ID_SUCURSAL = SU.ID\n" +
                    "INNER JOIN SOLICITUD_REPOSICION AS SO ON SO.ALMACEN = A.ID\n" +
                    "INNER JOIN USUARIO AS U ON U.ID = SO.USUARIO\n" +
                    "WHERE SU.ID = "+id_sucursal+" AND SO.USUARIO = "+this.id_usuario+" AND SO.ACTIVO = "+tipoEstado+" \n" +
                    "ORDER BY FECHA ASC";
                rs = db.selectInFiltro(consulta18);
                while (rs.next()) {
                    id = rs.getInt(1);
                    id_almacen = rs.getInt(2);
                    fecha = rs.getDate(3);
                    id_usuario = rs.getInt(4);
                    monto = rs.getDouble(5);
                    activo = rs.getBoolean(6);
                    nom_sucursal = rs.getString(7);
                    nom_usuario = rs.getString(8);
                    
                    if (activo == true) {
                        SinEnviar(cont++, id, nom_sucursal, fecha, monto, nom_usuario, activo, entregar, editar, Imprimir, ver, copiar, eliminar);
                    } else if (activo == false) {
                        enviado(cont++, id, nom_sucursal, fecha, monto, nom_usuario, activo, bloqueado, noeditar, Imprimir, ver, copiar, eliminar);
                    } 
                }
            }else if ((nombre_sucur != "Todo") && (nombre_alma != "Todo") && (estado == "Todo")) {
                
                String consulta19 = "SELECT S.ID,S.ALMACEN,S.FECHA, S.USUARIO,S.MONTO,S.ACTIVO,SU.NOMBRE, U.NOMBRE_USUARIO \n" +
                    "FROM SOLICITUD_REPOSICION S \n" +
                    "INNER JOIN LOGIN L ON L.ID = S.USUARIO \n" +
                    "INNER JOIN ALMACEN AS A ON A.ID = S.ALMACEN\n" +
                    "INNER JOIN SUCURSAL AS SU ON SU.ID = A.ID_SUCURSAL\n" +
                    "INNER JOIN USUARIO AS U ON U.ID = S.USUARIO\n" +
                    "WHERE S.USUARIO = "+this.id_usuario+" AND S.ALMACEN = "+id_almacen+" \n" +
                    "ORDER BY FECHA ASC ";
                rs = db.selectInFiltro(consulta19);
                while (rs.next()) {
                    id = rs.getInt(1);
                    id_almacen = rs.getInt(2);
                    fecha = rs.getDate(3);
                    id_usuario = rs.getInt(4);
                    monto = rs.getDouble(5);
                    activo = rs.getBoolean(6);
                    nom_sucursal = rs.getString(7);
                    nom_usuario = rs.getString(8);

                    if (activo == true) {
                        SinEnviar(cont++, id, nom_sucursal, fecha, monto, nom_usuario, activo, entregar, editar, Imprimir, ver, copiar, eliminar);
                    } else if (activo == false) {
                       enviado(cont++, id, nom_sucursal, fecha, monto, nom_usuario, activo, bloqueado, noeditar, Imprimir, ver, copiar, eliminar);
                    }
                }
            }else if ((nombre_sucur != "Todo") && (nombre_alma != "Todo") && (estado != "Todo")) {
                    boolean tipoEstado = (estado == "Abierto") ? true : false;

                    String consulta19 = "SELECT S.ID,S.ALMACEN,S.FECHA, S.USUARIO,S.MONTO,S.ACTIVO,SU.NOMBRE, U.NOMBRE_USUARIO \n" +
                        "FROM SOLICITUD_REPOSICION S \n" +
                        "INNER JOIN LOGIN L ON L.ID = S.USUARIO \n" +
                        "INNER JOIN ALMACEN AS A ON A.ID = S.ALMACEN\n" +
                        "INNER JOIN SUCURSAL AS SU ON SU.ID = A.ID_SUCURSAL\n" +
                        "INNER JOIN USUARIO AS U ON U.ID = S.USUARIO\n" +
                        "WHERE S.USUARIO = "+this.id_usuario+" AND S.ALMACEN = "+id_almacen+" AND S.ACTIVO = "+tipoEstado+" \n" +
                        "ORDER BY FECHA ASC ";
                    rs = db.selectInFiltro(consulta19);
                    while (rs.next()) {
                        id = rs.getInt(1);
                        id_almacen = rs.getInt(2);
                        fecha = rs.getDate(3);
                        id_usuario = rs.getInt(4);
                        monto = rs.getDouble(5);
                        activo = rs.getBoolean(6);
                        nom_sucursal = rs.getString(7);
                        nom_usuario = rs.getString(8);
                        
                        if (activo == true) {
                            SinEnviar(cont++, id, nom_sucursal, fecha, monto, nom_usuario, activo, entregar, editar, Imprimir, ver, copiar, eliminar);
                        } else if (activo == false) {
                           enviado(cont++, id, nom_sucursal, fecha, monto, nom_usuario, activo, bloqueado, noeditar, Imprimir, ver, copiar, eliminar);
                        }
                    }
                }    
        } catch (Exception e) {
            System.out.println("error " + e.getMessage());
        }

    }//GEN-LAST:event_jButtonFiltroActionPerformed

    public void SinEnviar(int cont, int id, String nom_sucursal, Date fecha, double monto, String nom_usuario, boolean activo, JButton entregar, JButton editar, JButton Imprimir, JButton ver, JButton copiar, JButton eliminar) {
        Object[] data = {cont, id, nom_sucursal, fecha, monto, nom_usuario, activo, entregar, editar, Imprimir, ver, copiar, eliminar};
        defaulttable.addRow(data);
        tablaSolicitudes.setModel(defaulttable);
        establecerTamañoCelda();
        defaulttable.fireTableDataChanged();
    }

    public void enviado(int cont, int id, String nom_sucursal, Date fecha, double monto, String nom_usuario, boolean activo, JButton entregar, JButton editar, JButton Imprimir, JButton ver, JButton copiar, JButton eliminar) {
        Object[] data = {cont, id, nom_sucursal, fecha, monto, nom_usuario, activo, entregar, editar, Imprimir, ver, copiar, eliminar};
        defaulttable.addRow(data);
        tablaSolicitudes.setModel(defaulttable);
        establecerTamañoCelda();
        defaulttable.fireTableDataChanged();
    }

    public void establecerTamañoCelda() {
        tablaSolicitudes.getColumnModel().getColumn(2).setMaxWidth(150);
        tablaSolicitudes.getColumnModel().getColumn(2).setMinWidth(150);
        tablaSolicitudes.getColumnModel().getColumn(2).setPreferredWidth(150);

        tablaSolicitudes.getColumnModel().getColumn(0).setMaxWidth(30);
        tablaSolicitudes.getColumnModel().getColumn(0).setMinWidth(30);
        tablaSolicitudes.getColumnModel().getColumn(0).setPreferredWidth(30);

        tablaSolicitudes.getColumnModel().getColumn(1).setMaxWidth(0);
        tablaSolicitudes.getColumnModel().getColumn(1).setMinWidth(0);
        tablaSolicitudes.getColumnModel().getColumn(1).setPreferredWidth(0);
    }

    private void jComboAlmacenActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jComboAlmacenActionPerformed
        String item_almacen = "";
        int id = 0;
        String nombre_alma = "";
        int id_sucursal = 0;
        try {
            limpiarListas(ListaAlmacen);
            item_almacen = (String) jComboAlmacen.getSelectedItem();

            if (!item_almacen.equals(null)) {
                if (item_almacen.equals("Todo")) {
                    id = 0;
                    nombre_alma = item_almacen;
                    Almacen almacen = new Almacen(id, nombre_alma, id_sucursal);
                    ListaAlmacen.add(almacen);

                } else if (!item_almacen.equals("Todo")) {
                    for (int i = 0; i < db.SeleccionarTodoAlmacenPorNombre(item_almacen).size(); i++) {
                        id = db.SeleccionarTodoAlmacenPorNombre(item_almacen).get(i).getId();
                        nombre_alma = db.SeleccionarTodoAlmacenPorNombre(item_almacen).get(i).getNombre();
                        id_sucursal = db.SeleccionarTodoAlmacenPorNombre(item_almacen).get(i).getId_sucursal();

                        Almacen almacen = new Almacen(id, nombre_alma, id_sucursal);
                        ListaAlmacen.add(almacen);
                    }
                }
            }

        } catch (Exception e) {
            //System.out.println("error: "+e.getStackTrace());
            System.out.println("nombre " + item_almacen);
        }
    }//GEN-LAST:event_jComboAlmacenActionPerformed

    private void jComboActivoActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jComboActivoActionPerformed
        // TODO add your handling code here:
    }//GEN-LAST:event_jComboActivoActionPerformed

    private void tablaSolicitudesMouseClicked(java.awt.event.MouseEvent evt) {//GEN-FIRST:event_tablaSolicitudesMouseClicked
        // TODO add your handling code here:
        int columna = tablaSolicitudes.getColumnModel().getColumnIndexAtX(evt.getX());
        int fila = evt.getY() / tablaSolicitudes.getRowHeight();
        String consulta = "";
        ResultSet rs = null;
        ResultSet rs2 = null;
        ResultSet rs3 = null;

        if (fila < tablaSolicitudes.getRowCount() && fila >= 0 && columna < tablaSolicitudes.getColumnCount() && columna >= 0) {
            Object value = tablaSolicitudes.getValueAt(fila, columna);

            if (value instanceof JButton) {
                ((JButton) value).doClick();
                JButton botonAccion = (JButton) value;

                if (botonAccion.getName().equals("entregar")) {
                    int id = Integer.parseInt(String.valueOf(tablaSolicitudes.getValueAt(fila, 1)));
                    System.out.println("id " + id);
                    db.UpdateTablaSolicitudes(id);

                }
                if (botonAccion.getName().equals("editar")) {
                    int id_almacen = 0;
                    int id_sucursal = 0;
                    String nom_sucur = "";

                    int id = Integer.parseInt(String.valueOf(tablaSolicitudes.getValueAt(fila, 1)));
                    consulta = "SELECT * FROM SOLICITUD_REPOSICION WHERE ID =" + id;
                    rs = db.selectInFiltro(consulta);
                    try {
                        while (rs.next()) {
                            id_almacen = rs.getInt(2);

                            String consulta2 = "SELECT ID_SUCURSAL FROM ALMACEN WHERE ID = " + id_almacen;
                            rs2 = db.selectInFiltro(consulta2);
                            while (rs2.next()) {
                                id_sucursal = rs2.getInt(1);

                                String consulta3 = "SELECT * FROM SUCURSAL WHERE ID = " + id_sucursal;
                                rs3 = db.selectInFiltro(consulta3);
                                while (rs3.next()) {
                                    nom_sucur = rs3.getString(2);
                                }
                            }
                        }
                    } catch (Exception e) {
                        System.out.println("Error: " + e);
                    }

                    AgregarProducto agregar = new AgregarProducto(this.id_usuario, id, id_almacen, nom_sucur, true);
                    agregar.setVisible(true);

                }
                if (botonAccion.getName().equals("imprimir")) {
                    int id_detalle = Integer.parseInt(String.valueOf(tablaSolicitudes.getValueAt(fila, 1)));

                    try {
                        imprimirPDF(id_detalle);
                    } catch (FileNotFoundException ex) {
                        Logger.getLogger(Solicitudes.class.getName()).log(Level.SEVERE, null, ex);
                    }
                }
                if (botonAccion.getName().equals("ver")) {
                    int id_almacen = 0;
                    String nom_sucur = "";

                    int id = Integer.parseInt(String.valueOf(tablaSolicitudes.getValueAt(fila, 1)));
                    consulta = "SELECT A.ID, SU.NOMBRE\n"
                            + "FROM SOLICITUD_REPOSICION AS S, ALMACEN AS A, SUCURSAL AS SU\n"
                            + "WHERE S.ALMACEN = A.ID AND SU.ID = A.ID_SUCURSAL AND S.ID = " + id;
                    rs = db.selectProductos(consulta);
                    try {
                        while (rs.next()) {
                            id_almacen = rs.getInt(1);
                            nom_sucur = rs.getString(2);
                        }
                        AgregarProducto agregar = new AgregarProducto(this.id_usuario, id, id_almacen, nom_sucur, false);
                        agregar.setVisible(true);

                    } catch (Exception e) {
                        System.out.println("error " + e);
                    }
                }
                if (botonAccion.getName().equals("copiar")) {
                    //System.out.println("ERROR");
                    int id_solicitud = 0;
                    int id_deta_pro = 0;
                    Detalle_Solicitud_Producto_Base prodBase = null;
                    Detalle_Solicitud_Producto prod = null;
                    ArrayList<Detalle_Solicitud_Producto_Base> prodBasLista = new ArrayList();
                    ArrayList<Detalle_Solicitud_Producto> prodLista = new ArrayList();
                   
                    int id = Integer.parseInt(String.valueOf(tablaSolicitudes.getValueAt(fila, 1)));

                    consulta = "INSERT INTO SOLICITUD_REPOSICION(ALMACEN,FECHA,USUARIO,ACTIVO,ELIMINADO,CREATEDAT,UPDATEDAT,MONTO,NOMBRE_SUCURSAL) \n"
                            + "SELECT ALMACEN,FECHA,USUARIO,ACTIVO,ELIMINADO,CREATEDAT,UPDATEDAT,MONTO,NOMBRE_SUCURSAL \n"
                            + "FROM SOLICITUD_REPOSICION \n"
                            + "WHERE ID = " + id;
                    rs = db.insertarProductos(consulta);

                    id_solicitud = db.seleccionarSolicitudReposicionId();
                    //System.out.println("id "+id_solicitud);

                    String consulta2 = "SELECT ID,SOLICITUD,PRODUCTO,CANTIDAD,CREATEDAT,UPDATEDAT FROM DETALLE_SOLICITUD_PRODUCTO WHERE SOLICITUD = " + id;
                    rs = db.selectProductos(consulta2);
                    try {
                        while (rs.next()) {
                            prod =  new Detalle_Solicitud_Producto(rs.getInt(1),rs.getInt(2), rs.getInt(3),rs.getInt(4) ,rs.getDate(5), rs.getDate(6));
                            prodLista.add(prod);
                            //db.insertarProductosConDatos(id_solicitud, rs.getInt(1), rs.getInt(2), rs.getDate(3), rs.getDate(4));
                        }

                        String consulta3 = "SELECT DSPB.DETALLE_SOLICITUD_PRODUCTO,DSPB.PRODUCTO_BASE,DSPB.CANTIDAD_IDEAL,DSPB.CANTIDAD_REAL,DSPB.CREATEDAT,DSPB.UPDATEDAT,DSPB.TOTAL\n" +
                                "FROM DETALLE_SOLICITUD_PRODUCTO_BASE AS DSPB, DETALLE_SOLICITUD_PRODUCTO AS DSP\n" +
                                "WHERE DSPB.DETALLE_SOLICITUD_PRODUCTO = DSP.ID AND DSP.SOLICITUD = "+id;
                        rs = db.selectProductos(consulta3);
                        while (rs.next()) {
                            prodBase = new Detalle_Solicitud_Producto_Base(rs.getInt(1),rs.getInt(2),rs.getDouble(3),rs.getDouble(4),rs.getDate(5),rs.getDate(6),rs.getDouble(7));
                            prodBasLista.add(prodBase);
                        }
                        
                        for (int i = 0; i < prodLista.size(); i++) {
                            int id_producto = prodLista.get(i).getId();
                            db.insertarSolicitudProducto(id_solicitud,prodLista.get(i).getProducto(),prodLista.get(i).getCantidad(), prodLista.get(i).getCreatedat(), prodLista.get(i).getCreatedat());

                           int id_Detalle_Producto = db.seleccionarDetalleSoliciProducto();
                            for (int j = 0; j < prodBasLista.size(); j++) {
                                
                                if(id_producto == prodBasLista.get(j).getDetalle_solicitud_producto()){
                                    //System.out.println("prod base "+prodBasLista.get(i).getProducto_base());
                                     db.insertarDetalleSolicitudProductoBase(id_Detalle_Producto,prodBasLista.get(j).getProducto_base(),prodBasLista.get(j).getCantidad_ideal(),prodBasLista.get(j).getCantidad_real(),prodBasLista.get(j).getCreatedat(),prodBasLista.get(j).getUpdatedat(),prodBasLista.get(j).getTotal());
                                }
                            }
                        }
                    } catch (Exception e) {
                        System.out.println("Error al insertar: " + e);
                    }
                }

                if (botonAccion.getName().equals("eliminar")) {

                    int id = Integer.parseInt(String.valueOf(tablaSolicitudes.getValueAt(fila, 1)));
                    int id_sdpb = 0;
                    
                    consulta = "SELECT ID FROM DETALLE_SOLICITUD_PRODUCTO "
                            + "WHERE SOLICITUD = "+id;
                    rs = db.selectProductos(consulta);
                    try {
                        while(rs.next()){
                            
                            String eliminarConsulta = "DELETE FROM DETALLE_SOLICITUD_PRODUCTO_BASE WHERE DETALLE_SOLICITUD_PRODUCTO = "+rs.getInt(1);
                            db.eliminarProductos(eliminarConsulta);
                        }
                    } catch (Exception e) {
                        System.out.println("error "+e);
                    }
                    String consulta2 = "DELETE FROM DETALLE_SOLICITUD_PRODUCTO WHERE SOLICITUD = "+id;
                    db.eliminarProductos(consulta2);
                    
                    String consulta3 = "DELETE FROM SOLICITUD_REPOSICION WHERE ID = "+id;
                    db.eliminarProductos(consulta3); 

                }
            }
        }
    }//GEN-LAST:event_tablaSolicitudesMouseClicked

    public void imprimirPDF(int id_detalle) throws FileNotFoundException {
        Connection con;
        try {

            con = DriverManager.getConnection("jdbc:derby:agil");
            JasperReport reporte = null;
            String path = "C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\Operaciones\\src\\Reportes\\reporte_solicitud_detalle.jasper";
            Object id = id_detalle;
            System.out.println("id " + id);
            Map parametro = new HashMap();
            parametro.put("id_detalle", id);

            reporte = (JasperReport) JRLoader.loadObjectFromFile(path);

            JasperPrint jprint = JasperFillManager.fillReport(reporte, parametro, con);
            JasperViewer view = new JasperViewer(jprint, false);
            view.setDefaultCloseOperation(DISPOSE_ON_CLOSE);
            view.setVisible(true);

        } catch (Exception e) {
            JOptionPane.showMessageDialog(null, "Error: " + e);
        }
    }
    /**
     * @param args the command line arguments
     */

    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JButton jButtonFiltro;
    private javax.swing.JComboBox<String> jComboActivo;
    private javax.swing.JComboBox<String> jComboAlmacen;
    private javax.swing.JComboBox<String> jComboSucursal;
    private com.toedter.calendar.JDateChooser jDateDesde;
    private com.toedter.calendar.JDateChooser jDateHasta;
    private javax.swing.JLabel jLabel1;
    private javax.swing.JLabel jLabel10;
    private javax.swing.JLabel jLabel2;
    private javax.swing.JLabel jLabel3;
    private javax.swing.JLabel jLabel4;
    private javax.swing.JLabel jLabel5;
    private javax.swing.JLabel jLabel6;
    private javax.swing.JLabel jLabel7;
    private javax.swing.JLabel jLabel8;
    private javax.swing.JLabel jLabel9;
    private javax.swing.JPanel jPanel1;
    private javax.swing.JPanel jPanel2;
    private javax.swing.JPanel jPanel3;
    private javax.swing.JPanel jPanel4;
    private javax.swing.JScrollPane jScrollPane1;
    private javax.swing.JButton jbuttonAgregar;
    private javax.swing.JTable tablaSolicitudes;
    // End of variables declaration//GEN-END:variables
}
