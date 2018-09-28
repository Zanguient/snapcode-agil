/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package PanelUI;

import java.awt.Color;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.swing.JLabel;
import javax.swing.JTable;
import javax.swing.SwingConstants;
import javax.swing.table.DefaultTableCellRenderer;
import javax.swing.table.DefaultTableModel;
import javax.swing.table.TableCellRenderer;
import modelo_Inventario.ControladorExcel;
import modelo_Inventario.ModeloExcel;
import models.Database;
import models.RenderTable;

/**
 *
 * @author AGIL
 */
public class Inventario extends javax.swing.JFrame {
    public int id_usuario;
    public boolean nuevo;
    public Database db = new Database();
    public ArrayList arrayProducto = new ArrayList();
    DefaultTableModel modelInventario;
    
    /**
     * Creates new form Inventario
     */
    public Inventario(boolean nuevo,int id_usuario) {
        initComponents();
        setTitle("Inventario");
        setLocationRelativeTo(this);
        this.id_usuario = id_usuario;
        this.nuevo = nuevo;
        btnNuevo.setVisible(nuevo);
        btnImportar.setVisible(nuevo);
        modelInventario = (DefaultTableModel) tablaInventario.getModel();
        
        tablaInventario.getTableHeader().setPreferredSize(new java.awt.Dimension(0, 33));
        tablaInventario.setDefaultRenderer(Object.class, new RenderTable());  
        tablaInventario.getTableHeader().setBackground(Color.cyan);
        tablaInventario.getTableHeader().setForeground(Color.blue);
        tablaInventario.setRowHeight(33);

        alinearTextoTabla();
        centrar_datos();
        obtenerSucursal();
        obtenerGrupos();
    }

    public void alinearTextoTabla(){
        TableCellRenderer rendererFromHeader = tablaInventario.getTableHeader().getDefaultRenderer();
        JLabel headerLabel = (JLabel) rendererFromHeader;
        headerLabel.setHorizontalAlignment(JLabel.CENTER);
    }
    
     public void centrar_datos(){  
        DefaultTableCellRenderer modelocentrar = new DefaultTableCellRenderer(); 
        modelocentrar.setHorizontalAlignment(SwingConstants.CENTER); 
        tablaInventario.getColumnModel().getColumn(1).setCellRenderer(modelocentrar); 
        tablaInventario.getColumnModel().getColumn(2).setCellRenderer(modelocentrar);
        tablaInventario.getColumnModel().getColumn(3).setCellRenderer(modelocentrar);
        tablaInventario.getColumnModel().getColumn(4).setCellRenderer(modelocentrar);
        tablaInventario.getColumnModel().getColumn(5).setCellRenderer(modelocentrar);
        tablaInventario.getColumnModel().getColumn(6).setCellRenderer(modelocentrar);
        tablaInventario.getColumnModel().getColumn(7).setCellRenderer(modelocentrar);
        tablaInventario.getColumnModel().getColumn(8).setCellRenderer(modelocentrar);  
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
                Logger.getLogger(Inventario.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
                
    }
    
    public void obtenerGrupos(){
        ResultSet rs = null;
        String consulta = "SELECT C.NOMBRE\n" +
            "FROM TIPO AS T\n" +
            "INNER JOIN USUARIO AS U ON U.EMPRESA = T.ID_EMPRESA\n" +
            "INNER JOIN CLASE AS C ON C.ID_TIPO = T.ID\n" +
            "WHERE U.ID = "+this.id_usuario+" AND  T.NOMBRE_CORTO = 'GRUPOS PRODUCTOS' AND U.ELIMINADO = "+false;
        try {
            rs = db.seleccionar(consulta);
            while (rs.next()) {                
                comboGrupos.addItem(rs.getString(1));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }finally{
            try {
                rs.close();
                db.Conectar().close();
            } catch (SQLException ex) {
                Logger.getLogger(Inventario.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
        
    }  
    
    public int obtenerIdSucursal(){
        String sucursal = (String)comboSucursal.getSelectedItem();
        ResultSet rs = null;
        int id = 0;
        String consulta = "SELECT S.ID\n" +
            "FROM SUCURSAL AS S \n" +
            "INNER JOIN USUARIO AS U ON U.EMPRESA = S.EMPRESA\n" +
            "WHERE U.ID = "+this.id_usuario+" AND S.NOMBRE = '"+sucursal+"'";
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
                Logger.getLogger(Inventario.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
        return id;
    }
    
    public int obtenerIdAlmacen(int sucursal,String almacen){
        ResultSet rs = null;
        int id = 0;
        String consulta = "SELECT A.ID\n" +
            "FROM ALMACEN AS A\n" +
            "WHERE A.SUCURSAL = "+sucursal+" AND NOMBRE = '"+almacen+"'";
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
                Logger.getLogger(Inventario.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
        return id;
    }
    
    public void limpiar(){
        int tam = tablaInventario.getRowCount();
        for (int i = tam-1; i >= 0; i--) {
            modelInventario.removeRow(i);
        }
    }
    
    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        jScrollPane1 = new javax.swing.JScrollPane();
        jPanel1 = new javax.swing.JPanel();
        jLabel1 = new javax.swing.JLabel();
        jSeparator1 = new javax.swing.JSeparator();
        btnNuevo = new javax.swing.JButton();
        jPanel2 = new javax.swing.JPanel();
        jLabel2 = new javax.swing.JLabel();
        jLabel3 = new javax.swing.JLabel();
        jScrollPane2 = new javax.swing.JScrollPane();
        tablaInventario = new JTable(){
            public boolean isCellEditable(int rowIndex, int colIndex) {
                return colIndex != 0 && colIndex != 1 && colIndex != 2 && colIndex != 3 
                && colIndex != 4 && colIndex != 5 && colIndex != 6 && colIndex != 7
                && colIndex != 8 && colIndex != 9 ;
            }
        };
        jPanel3 = new javax.swing.JPanel();
        jLabel4 = new javax.swing.JLabel();
        comboSucursal = new javax.swing.JComboBox<>();
        jLabel5 = new javax.swing.JLabel();
        comboAlmacen = new javax.swing.JComboBox<>();
        jLabel6 = new javax.swing.JLabel();
        comboCantidad = new javax.swing.JComboBox<>();
        jLabel7 = new javax.swing.JLabel();
        comboGrupos = new javax.swing.JComboBox<>();
        textoProducto = new javax.swing.JTextField();
        btnFiltro = new javax.swing.JButton();
        btnImportar = new javax.swing.JButton();
        jLabel8 = new javax.swing.JLabel();

        setDefaultCloseOperation(javax.swing.WindowConstants.DISPOSE_ON_CLOSE);

        jScrollPane1.setHorizontalScrollBar(null);

        jPanel1.setBackground(new java.awt.Color(255, 255, 255));

        jLabel1.setFont(new java.awt.Font("Arial", 1, 14)); // NOI18N
        jLabel1.setForeground(new java.awt.Color(71, 143, 202));
        jLabel1.setText("INVENTARIO");

        jSeparator1.setForeground(new java.awt.Color(71, 143, 202));

        btnNuevo.setBackground(new java.awt.Color(27, 106, 170));
        btnNuevo.setFont(new java.awt.Font("Arial", 0, 11)); // NOI18N
        btnNuevo.setForeground(new java.awt.Color(255, 255, 255));
        btnNuevo.setIcon(new javax.swing.ImageIcon(getClass().getResource("/imagen/addition-white.png"))); // NOI18N
        btnNuevo.setText("Nuevo");
        btnNuevo.setBorder(javax.swing.BorderFactory.createLineBorder(new java.awt.Color(71, 143, 202)));
        btnNuevo.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                btnNuevoActionPerformed(evt);
            }
        });

        jPanel2.setBackground(new java.awt.Color(71, 143, 202));

        jLabel2.setFont(new java.awt.Font("Arial", 0, 14)); // NOI18N
        jLabel2.setForeground(new java.awt.Color(255, 255, 255));
        jLabel2.setText("Lista de Productos");

        javax.swing.GroupLayout jPanel2Layout = new javax.swing.GroupLayout(jPanel2);
        jPanel2.setLayout(jPanel2Layout);
        jPanel2Layout.setHorizontalGroup(
            jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel2Layout.createSequentialGroup()
                .addContainerGap()
                .addComponent(jLabel2)
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );
        jPanel2Layout.setVerticalGroup(
            jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel2Layout.createSequentialGroup()
                .addContainerGap()
                .addComponent(jLabel2)
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );

        jLabel3.setFont(new java.awt.Font("Arial", 1, 12)); // NOI18N
        jLabel3.setForeground(new java.awt.Color(71, 143, 202));
        jLabel3.setText("Inportacion Única Inventario Incial");

        tablaInventario.setModel(new javax.swing.table.DefaultTableModel(
            new Object [][] {

            },
            new String [] {
                "#", "Código", "Producto", "Descripción", "<html>Unidad de<br>Medida</html>", "<html>Cantidad<br>Total</html>", "<html>Precio<br> Unitario</html>", "Fecha Vencimiento", "Grupo"
            }
        ));
        tablaInventario.setFillsViewportHeight(true);
        jScrollPane2.setViewportView(tablaInventario);
        if (tablaInventario.getColumnModel().getColumnCount() > 0) {
            tablaInventario.getColumnModel().getColumn(0).setMinWidth(30);
            tablaInventario.getColumnModel().getColumn(0).setPreferredWidth(30);
            tablaInventario.getColumnModel().getColumn(0).setMaxWidth(30);
            tablaInventario.getColumnModel().getColumn(1).setMinWidth(80);
            tablaInventario.getColumnModel().getColumn(1).setPreferredWidth(80);
            tablaInventario.getColumnModel().getColumn(1).setMaxWidth(80);
            tablaInventario.getColumnModel().getColumn(7).setMinWidth(120);
            tablaInventario.getColumnModel().getColumn(7).setPreferredWidth(120);
            tablaInventario.getColumnModel().getColumn(7).setMaxWidth(120);
        }

        jLabel4.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel4.setText("Sucursal: ");

        comboSucursal.setModel(new javax.swing.DefaultComboBoxModel<>(new String[] { " " }));
        comboSucursal.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                comboSucursalActionPerformed(evt);
            }
        });

        jLabel5.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel5.setText("Almacen: ");

        comboAlmacen.setModel(new javax.swing.DefaultComboBoxModel<>(new String[] { " " }));

        jLabel6.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel6.setText("Cantidades: ");

        comboCantidad.setModel(new javax.swing.DefaultComboBoxModel<>(new String[] { "Todos", "Con Saldo", "Sin Saldo" }));

        jLabel7.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel7.setText("Grupos:");

        comboGrupos.setModel(new javax.swing.DefaultComboBoxModel<>(new String[] { " " }));

        btnFiltro.setBackground(new java.awt.Color(71, 143, 202));
        btnFiltro.setIcon(new javax.swing.ImageIcon(getClass().getResource("/imagen/buscar.png"))); // NOI18N
        btnFiltro.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                btnFiltroActionPerformed(evt);
            }
        });

        javax.swing.GroupLayout jPanel3Layout = new javax.swing.GroupLayout(jPanel3);
        jPanel3.setLayout(jPanel3Layout);
        jPanel3Layout.setHorizontalGroup(
            jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel3Layout.createSequentialGroup()
                .addContainerGap()
                .addComponent(jLabel4)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(comboSucursal, javax.swing.GroupLayout.PREFERRED_SIZE, 134, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addComponent(jLabel5)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(comboAlmacen, javax.swing.GroupLayout.PREFERRED_SIZE, 122, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addComponent(jLabel6)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(comboCantidad, 0, 125, Short.MAX_VALUE)
                .addGap(18, 18, 18)
                .addComponent(jLabel7)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addComponent(comboGrupos, javax.swing.GroupLayout.PREFERRED_SIZE, 105, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(18, 18, 18)
                .addComponent(textoProducto, javax.swing.GroupLayout.PREFERRED_SIZE, 98, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addComponent(btnFiltro, javax.swing.GroupLayout.PREFERRED_SIZE, 31, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(19, 19, 19))
        );
        jPanel3Layout.setVerticalGroup(
            jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel3Layout.createSequentialGroup()
                .addGap(24, 24, 24)
                .addGroup(jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(btnFiltro)
                    .addGroup(jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                        .addComponent(jLabel4)
                        .addComponent(comboSucursal, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addComponent(jLabel5)
                        .addComponent(comboAlmacen, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addComponent(jLabel6)
                        .addComponent(comboCantidad, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addComponent(jLabel7)
                        .addComponent(comboGrupos, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addComponent(textoProducto, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)))
                .addContainerGap(26, Short.MAX_VALUE))
        );

        btnImportar.setBackground(new java.awt.Color(27, 106, 170));
        btnImportar.setFont(new java.awt.Font("Arial", 0, 11)); // NOI18N
        btnImportar.setForeground(new java.awt.Color(255, 255, 255));
        btnImportar.setIcon(new javax.swing.ImageIcon(getClass().getResource("/imagen/subir.png"))); // NOI18N
        btnImportar.setText("Importar");
        btnImportar.setBorder(javax.swing.BorderFactory.createLineBorder(new java.awt.Color(71, 143, 202)));
        btnImportar.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                btnImportarActionPerformed(evt);
            }
        });

        jLabel8.setFont(new java.awt.Font("Arial", 1, 12)); // NOI18N
        jLabel8.setForeground(new java.awt.Color(71, 143, 202));
        jLabel8.setText("Importación Múltiple Inventario Inicial");

        javax.swing.GroupLayout jPanel1Layout = new javax.swing.GroupLayout(jPanel1);
        jPanel1.setLayout(jPanel1Layout);
        jPanel1Layout.setHorizontalGroup(
            jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel1Layout.createSequentialGroup()
                .addContainerGap()
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(jPanel1Layout.createSequentialGroup()
                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(jPanel2, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                            .addComponent(jScrollPane2)
                            .addGroup(jPanel1Layout.createSequentialGroup()
                                .addComponent(jLabel1)
                                .addGap(0, 0, Short.MAX_VALUE))
                            .addComponent(jPanel3, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                            .addComponent(jSeparator1))
                        .addContainerGap())
                    .addGroup(jPanel1Layout.createSequentialGroup()
                        .addComponent(btnNuevo, javax.swing.GroupLayout.PREFERRED_SIZE, 71, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                        .addComponent(btnImportar, javax.swing.GroupLayout.PREFERRED_SIZE, 86, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addGap(358, 358, 358))
                    .addGroup(jPanel1Layout.createSequentialGroup()
                        .addComponent(jLabel3)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                        .addComponent(jLabel8)
                        .addGap(266, 266, 266))))
        );
        jPanel1Layout.setVerticalGroup(
            jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel1Layout.createSequentialGroup()
                .addContainerGap()
                .addComponent(jLabel1)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jSeparator1, javax.swing.GroupLayout.PREFERRED_SIZE, 10, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(23, 23, 23)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jLabel3)
                    .addComponent(jLabel8))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(btnNuevo, javax.swing.GroupLayout.PREFERRED_SIZE, 39, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(btnImportar, javax.swing.GroupLayout.PREFERRED_SIZE, 39, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addComponent(jPanel2, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addComponent(jPanel3, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jScrollPane2, javax.swing.GroupLayout.PREFERRED_SIZE, 247, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addContainerGap(47, Short.MAX_VALUE))
        );

        jScrollPane1.setViewportView(jPanel1);

        javax.swing.GroupLayout layout = new javax.swing.GroupLayout(getContentPane());
        getContentPane().setLayout(layout);
        layout.setHorizontalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addComponent(jScrollPane1, javax.swing.GroupLayout.DEFAULT_SIZE, 977, Short.MAX_VALUE)
        );
        layout.setVerticalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addComponent(jScrollPane1, javax.swing.GroupLayout.DEFAULT_SIZE, 570, Short.MAX_VALUE)
        );

        pack();
    }// </editor-fold>//GEN-END:initComponents

    private void btnNuevoActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_btnNuevoActionPerformed
        NuevoInventario nuevoInventario = new NuevoInventario(this, true, this.id_usuario);
        nuevoInventario.setVisible(true);
    }//GEN-LAST:event_btnNuevoActionPerformed

    private void comboSucursalActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_comboSucursalActionPerformed
        ResultSet rs = null;
        comboAlmacen.removeAllItems();
        String sucursal = (String) comboSucursal.getSelectedItem();
        String consulta = "SELECT A.NOMBRE\n" +
            "FROM ALMACEN AS A\n" +
            "INNER JOIN SUCURSAL AS S ON S.ID = A.SUCURSAL\n" +
            "WHERE S.NOMBRE = '"+sucursal+"' AND S.ELIMINADO = "+false ;
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
                Logger.getLogger(NuevoInventario.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }//GEN-LAST:event_comboSucursalActionPerformed

    private void btnFiltroActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_btnFiltroActionPerformed
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd");

        String producto = textoProducto.getText();
        String cantidades = (String) comboCantidad.getSelectedItem();
        int idSucursal = obtenerIdSucursal();
        String almacen = (String) comboAlmacen.getSelectedItem();
        int idAlmacen = obtenerIdAlmacen(idSucursal, almacen);
        String grupos = (String) comboGrupos.getSelectedItem();
        String nombreP = textoProducto.getText();
        int num = 1;
        String consultaAñadir = "";
        String consultaNombre = "";
        ResultSet rs = null;
        limpiar();
        if (cantidades.equals("Todos")) {
           consultaAñadir = "";
    
        }
        if(cantidades.equals("Con Saldo")){
             consultaAñadir = "AND I.CANTIDAD > "+0;
            
        }
        if (cantidades.equals("Sin Saldo")) {
            consultaAñadir = "AND I.CANTIDAD < "+0;
            
        }
        if (cantidades.equals("Todos") && !grupos.equals(" ") ) {
            consultaAñadir = " AND C.NOMBRE = '"+grupos+"'";
            
        }
        if (cantidades.equals("Con Saldo") && !grupos.equals(" ") ) {
            consultaAñadir = "AND I.CANTIDAD > "+0+" AND C.NOMBRE = '"+grupos+"'";
            
        }
        if (cantidades.equals("Sin Saldo") && !grupos.equals(" ") ) {
            consultaAñadir = "AND I.CANTIDAD < "+0+" AND C.NOMBRE = '"+grupos+"'";
        }
        if(!nombreP.equals("")){
            consultaNombre = "AND LOWER(P.NOMBRE) LIKE '%"+nombreP+"%'";
        }
        
        
        String consulta = "SELECT P.CODIGO, P.NOMBRE,P.DESCRIPCION,P.UNIDAD_MEDIDA,I.CANTIDAD,P.PRECIO_UNITARIO,I.FECHA_VENCIMIENTO,C.NOMBRE\n" +
                "FROM PRODUCTO AS P \n" +
                "INNER JOIN INV_INVENTARIO AS I ON I.PRODUCTO = P.ID \n" +
                "LEFT JOIN CLASE AS C ON C.ID = P.SUBGRUPO \n" +
                "WHERE I.ALMACEN = "+idAlmacen+""+consultaAñadir+""+consultaNombre+" AND P.ELIMINADO = "+false;       
            try {
                rs = db.seleccionar(consulta);
                while (rs.next()) {                    
                    String codigo = rs.getString(1);
                    String nombre = rs.getString(2);
                    String descripcion = rs.getString(3);
                    String unidadMedida = rs.getString(4);
                    double cantidad = rs.getDouble(5);
                    double precioUnit = rs.getDouble(6);
                    String fechaVeni = rs.getString(7);//sdf.format(rs.getDate(7));
                    String grupo = rs.getString(8);
                    
     
                    Object[] datos = {num,codigo,nombre,descripcion,unidadMedida,"<html><span style='color:GREEN;'>"+cantidad+"</span></html>",precioUnit,fechaVeni,grupo};
                    num++;
                    
                    modelInventario.addRow(datos);
                
                }              
                tablaInventario.setModel(modelInventario);
                
            } catch (Exception e) {
                e.printStackTrace();
            }
        
    }//GEN-LAST:event_btnFiltroActionPerformed

    private void btnImportarActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_btnImportarActionPerformed
        ModeloExcel modeloE = new ModeloExcel();
        ImportarInventario vistaE = new ImportarInventario(this.id_usuario);
        ControladorExcel contraControladorExcel = new ControladorExcel(vistaE, modeloE);
        vistaE.setVisible(true);
        vistaE.setLocationRelativeTo(null);
    }//GEN-LAST:event_btnImportarActionPerformed

    /**
     * @param args the command line arguments
     */
  

    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JButton btnFiltro;
    private javax.swing.JButton btnImportar;
    private javax.swing.JButton btnNuevo;
    private javax.swing.JComboBox<String> comboAlmacen;
    private javax.swing.JComboBox<String> comboCantidad;
    private javax.swing.JComboBox<String> comboGrupos;
    private javax.swing.JComboBox<String> comboSucursal;
    private javax.swing.JLabel jLabel1;
    private javax.swing.JLabel jLabel2;
    private javax.swing.JLabel jLabel3;
    private javax.swing.JLabel jLabel4;
    private javax.swing.JLabel jLabel5;
    private javax.swing.JLabel jLabel6;
    private javax.swing.JLabel jLabel7;
    private javax.swing.JLabel jLabel8;
    private javax.swing.JPanel jPanel1;
    private javax.swing.JPanel jPanel2;
    private javax.swing.JPanel jPanel3;
    private javax.swing.JScrollPane jScrollPane1;
    private javax.swing.JScrollPane jScrollPane2;
    private javax.swing.JSeparator jSeparator1;
    private javax.swing.JTable tablaInventario;
    private javax.swing.JTextField textoProducto;
    // End of variables declaration//GEN-END:variables
}
