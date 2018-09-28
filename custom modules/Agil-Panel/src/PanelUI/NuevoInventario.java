/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package PanelUI;

import java.awt.EventQueue;
import java.awt.event.KeyEvent;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Date;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.swing.JOptionPane;
import models.Database;

/**
 *
 * @author AGIL
 */
public class NuevoInventario extends javax.swing.JDialog {
    public int id_usuario;
    public Database db = new Database();
    public ArrayList arrayProductos = new ArrayList();

    /**
     * Creates new form NuevoInventario
     */
    public NuevoInventario(java.awt.Frame parent, boolean modal,int id_usuario) {
        super(parent,modal);
        initComponents();
        setTitle("Nuevo Inventario");
        setLocationRelativeTo(this);
        this.id_usuario = id_usuario;
        
        obtenerSucursal();
        obtenerProductos();
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
   
    public void obtenerProductos(){
        ResultSet rs = null;
        String consulta = "SELECT P.NOMBRE \n" +
            "FROM PRODUCTO AS P\n" +
            "INNER JOIN USUARIO AS U ON P.EMPRESA = U.EMPRESA\n" +
            "WHERE U.ID = "+this.id_usuario+" AND U.ELIMINADO = "+false+" AND P.ELIMINADO = "+false;
        try {
            rs = db.seleccionar(consulta);
            while (rs.next()) {
                String producto = rs.getString(1);
                arrayProductos.add(producto);
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
    
    public void autocomplete(String txt){
        String complete = "";
        int inicio = txt.length();
        int ultimo = txt.length();
        
        for (int i = 0; i < arrayProductos.size(); i++) {
            if (arrayProductos.get(i).toString().startsWith(txt)) {
                complete = arrayProductos.get(i).toString();
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
    
    public void obtenerUnidadCodigo(String producto){
        ResultSet rs = null;
        String consulta = "SELECT CODIGO,UNIDAD_MEDIDA \n" +
            "FROM PRODUCTO \n" +
            "WHERE NOMBRE = '"+producto+"'";
        try {
            rs = db.seleccionar(consulta);
            while (rs.next()) {                
                textoCodigo.setText(rs.getString(1));
                textoUnidMedida.setText(rs.getString(2));
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
    
    public int obtenerIdAlmacen(String almacen){
        ResultSet rs = null;
        int id = 0;
        String consulta = "SELECT ID FROM ALMACEN WHERE NOMBRE = '"+almacen+"'";
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
    
    public int obtenerIdProducto(String producto){
        ResultSet rs = null;
        int id = 0;
        String consulta = "SELECT ID FROM PRODUCTO WHERE NOMBRE = '"+producto+"'";
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
   
    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        jScrollPane1 = new javax.swing.JScrollPane();
        jPanel1 = new javax.swing.JPanel();
        jLabel1 = new javax.swing.JLabel();
        jLabel2 = new javax.swing.JLabel();
        jLabel3 = new javax.swing.JLabel();
        jLabel4 = new javax.swing.JLabel();
        jLabel5 = new javax.swing.JLabel();
        comboSucursal = new javax.swing.JComboBox<>();
        comboAlmacen = new javax.swing.JComboBox<>();
        textoProducto = new javax.swing.JTextField();
        textoCodigo = new javax.swing.JTextField();
        jLabel6 = new javax.swing.JLabel();
        textoUnidMedida = new javax.swing.JTextField();
        jLabel7 = new javax.swing.JLabel();
        fechaVencimiento = new com.toedter.calendar.JDateChooser();
        labelLote = new javax.swing.JLabel();
        textoLote = new javax.swing.JTextField();
        textoCostoUnit = new javax.swing.JTextField();
        jLabel8 = new javax.swing.JLabel();
        jLabel9 = new javax.swing.JLabel();
        textoCantiUnid = new javax.swing.JTextField();
        btnGuardar = new javax.swing.JButton();
        btnCerrar = new javax.swing.JButton();
        jSeparator1 = new javax.swing.JSeparator();

        setDefaultCloseOperation(javax.swing.WindowConstants.DO_NOTHING_ON_CLOSE);
        setPreferredSize(new java.awt.Dimension(1050, 310));

        jScrollPane1.setHorizontalScrollBar(null);
        jScrollPane1.setPreferredSize(new java.awt.Dimension(1026, 350));

        jPanel1.setBackground(new java.awt.Color(255, 255, 255));

        jLabel1.setFont(new java.awt.Font("Arial", 1, 14)); // NOI18N
        jLabel1.setForeground(new java.awt.Color(71, 143, 202));
        jLabel1.setText("INVENTARIO INICIAL PRODUCTO");

        jLabel2.setFont(new java.awt.Font("Arial", 1, 14)); // NOI18N
        jLabel2.setForeground(new java.awt.Color(71, 143, 202));
        jLabel2.setText("Almacen");

        jLabel3.setFont(new java.awt.Font("Arial", 1, 14)); // NOI18N
        jLabel3.setForeground(new java.awt.Color(71, 143, 202));
        jLabel3.setText("Nombre");

        jLabel4.setFont(new java.awt.Font("Arial", 1, 14)); // NOI18N
        jLabel4.setForeground(new java.awt.Color(71, 143, 202));
        jLabel4.setText("Sucursal");

        jLabel5.setFont(new java.awt.Font("Arial", 1, 14)); // NOI18N
        jLabel5.setForeground(new java.awt.Color(71, 143, 202));
        jLabel5.setText("<html><center>Código<br>  Item</center><html>");

        comboSucursal.setModel(new javax.swing.DefaultComboBoxModel<>(new String[] { " " }));
        comboSucursal.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                comboSucursalActionPerformed(evt);
            }
        });

        comboAlmacen.setModel(new javax.swing.DefaultComboBoxModel<>(new String[] { " " }));
        comboAlmacen.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                comboAlmacenActionPerformed(evt);
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

        textoCodigo.setEditable(false);

        jLabel6.setFont(new java.awt.Font("Arial", 1, 14)); // NOI18N
        jLabel6.setForeground(new java.awt.Color(71, 143, 202));
        jLabel6.setText("<html><center>Unidad de<br>Medida</center><html>");

        textoUnidMedida.setEditable(false);

        jLabel7.setFont(new java.awt.Font("Arial", 1, 14)); // NOI18N
        jLabel7.setForeground(new java.awt.Color(71, 143, 202));
        jLabel7.setText("<html><center>Fecha de<br>Vencimiento</center><html>");

        labelLote.setFont(new java.awt.Font("Arial", 1, 14)); // NOI18N
        labelLote.setForeground(new java.awt.Color(71, 143, 202));
        labelLote.setText("Lote");

        textoLote.addKeyListener(new java.awt.event.KeyAdapter() {
            public void keyTyped(java.awt.event.KeyEvent evt) {
                textoLoteKeyTyped(evt);
            }
        });

        textoCostoUnit.addKeyListener(new java.awt.event.KeyAdapter() {
            public void keyTyped(java.awt.event.KeyEvent evt) {
                textoCostoUnitKeyTyped(evt);
            }
        });

        jLabel8.setFont(new java.awt.Font("Arial", 1, 14)); // NOI18N
        jLabel8.setForeground(new java.awt.Color(71, 143, 202));
        jLabel8.setText("<html><center>Costo Unit.<br>(Bs./U)</center><html>");

        jLabel9.setFont(new java.awt.Font("Arial", 1, 14)); // NOI18N
        jLabel9.setForeground(new java.awt.Color(71, 143, 202));
        jLabel9.setText("<html><center>Cantidad<br>Unidad</center><html>");

        textoCantiUnid.addKeyListener(new java.awt.event.KeyAdapter() {
            public void keyTyped(java.awt.event.KeyEvent evt) {
                textoCantiUnidKeyTyped(evt);
            }
        });

        btnGuardar.setBackground(new java.awt.Color(98, 155, 88));
        btnGuardar.setForeground(new java.awt.Color(255, 255, 255));
        btnGuardar.setText("Guardar");
        btnGuardar.setToolTipText("");
        btnGuardar.setBorder(javax.swing.BorderFactory.createLineBorder(new java.awt.Color(135, 184, 127)));
        btnGuardar.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                btnGuardarActionPerformed(evt);
            }
        });

        btnCerrar.setBackground(new java.awt.Color(183, 70, 53));
        btnCerrar.setForeground(new java.awt.Color(255, 255, 255));
        btnCerrar.setText("Cerrar");
        btnCerrar.setToolTipText("");
        btnCerrar.setBorder(javax.swing.BorderFactory.createLineBorder(new java.awt.Color(209, 91, 71)));
        btnCerrar.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                btnCerrarActionPerformed(evt);
            }
        });

        jSeparator1.setForeground(new java.awt.Color(71, 143, 202));

        javax.swing.GroupLayout jPanel1Layout = new javax.swing.GroupLayout(jPanel1);
        jPanel1.setLayout(jPanel1Layout);
        jPanel1Layout.setHorizontalGroup(
            jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, jPanel1Layout.createSequentialGroup()
                .addGap(0, 0, Short.MAX_VALUE)
                .addComponent(btnCerrar, javax.swing.GroupLayout.PREFERRED_SIZE, 71, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(18, 18, 18)
                .addComponent(btnGuardar, javax.swing.GroupLayout.PREFERRED_SIZE, 70, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(58, 58, 58))
            .addGroup(jPanel1Layout.createSequentialGroup()
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(jPanel1Layout.createSequentialGroup()
                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addGroup(jPanel1Layout.createSequentialGroup()
                                .addGap(22, 22, 22)
                                .addComponent(comboSucursal, javax.swing.GroupLayout.PREFERRED_SIZE, 130, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                                .addComponent(comboAlmacen, javax.swing.GroupLayout.PREFERRED_SIZE, 120, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                                .addComponent(textoProducto, javax.swing.GroupLayout.PREFERRED_SIZE, 120, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                                .addComponent(textoCodigo, javax.swing.GroupLayout.PREFERRED_SIZE, 104, javax.swing.GroupLayout.PREFERRED_SIZE))
                            .addGroup(jPanel1Layout.createSequentialGroup()
                                .addGap(54, 54, 54)
                                .addComponent(jLabel4)
                                .addGap(71, 71, 71)
                                .addComponent(jLabel2)
                                .addGap(81, 81, 81)
                                .addComponent(jLabel3)
                                .addGap(61, 61, 61)
                                .addComponent(jLabel5, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)))
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addGroup(jPanel1Layout.createSequentialGroup()
                                .addComponent(textoUnidMedida, javax.swing.GroupLayout.PREFERRED_SIZE, 71, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addGap(18, 18, 18)
                                .addComponent(fechaVencimiento, javax.swing.GroupLayout.PREFERRED_SIZE, 120, javax.swing.GroupLayout.PREFERRED_SIZE))
                            .addGroup(jPanel1Layout.createSequentialGroup()
                                .addComponent(jLabel6, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addGap(28, 28, 28)
                                .addComponent(jLabel7, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)))
                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addGroup(jPanel1Layout.createSequentialGroup()
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                                .addComponent(textoLote, javax.swing.GroupLayout.PREFERRED_SIZE, 63, javax.swing.GroupLayout.PREFERRED_SIZE))
                            .addGroup(jPanel1Layout.createSequentialGroup()
                                .addGap(22, 22, 22)
                                .addComponent(labelLote)))
                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addGroup(jPanel1Layout.createSequentialGroup()
                                .addGap(9, 9, 9)
                                .addComponent(jLabel8, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                            .addGroup(jPanel1Layout.createSequentialGroup()
                                .addGap(18, 18, 18)
                                .addComponent(textoCostoUnit, javax.swing.GroupLayout.PREFERRED_SIZE, 57, javax.swing.GroupLayout.PREFERRED_SIZE)))
                        .addGap(18, 18, 18)
                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(jLabel9, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addComponent(textoCantiUnid, javax.swing.GroupLayout.PREFERRED_SIZE, 69, javax.swing.GroupLayout.PREFERRED_SIZE)))
                    .addGroup(jPanel1Layout.createSequentialGroup()
                        .addContainerGap()
                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(jLabel1)
                            .addComponent(jSeparator1, javax.swing.GroupLayout.PREFERRED_SIZE, 963, javax.swing.GroupLayout.PREFERRED_SIZE))))
                .addContainerGap(33, Short.MAX_VALUE))
        );
        jPanel1Layout.setVerticalGroup(
            jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel1Layout.createSequentialGroup()
                .addContainerGap()
                .addComponent(jLabel1)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jSeparator1, javax.swing.GroupLayout.PREFERRED_SIZE, 10, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(39, 39, 39)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jLabel5, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(jLabel6, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(jLabel7, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(jLabel3)
                    .addComponent(jLabel2)
                    .addComponent(jLabel4)
                    .addComponent(labelLote)
                    .addComponent(jLabel8, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(jLabel9, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addGap(7, 7, 7)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                        .addComponent(comboSucursal, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addComponent(comboAlmacen, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addComponent(textoProducto, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addComponent(textoCodigo, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addComponent(textoUnidMedida, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                    .addComponent(fechaVencimiento, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                        .addComponent(textoLote, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addComponent(textoCostoUnit, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addComponent(textoCantiUnid, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)))
                .addGap(72, 72, 72)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(btnGuardar, javax.swing.GroupLayout.PREFERRED_SIZE, 37, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(btnCerrar, javax.swing.GroupLayout.PREFERRED_SIZE, 37, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addContainerGap(139, Short.MAX_VALUE))
        );

        jScrollPane1.setViewportView(jPanel1);

        javax.swing.GroupLayout layout = new javax.swing.GroupLayout(getContentPane());
        getContentPane().setLayout(layout);
        layout.setHorizontalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addComponent(jScrollPane1, javax.swing.GroupLayout.DEFAULT_SIZE, 1012, Short.MAX_VALUE)
        );
        layout.setVerticalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addComponent(jScrollPane1, javax.swing.GroupLayout.PREFERRED_SIZE, 275, javax.swing.GroupLayout.PREFERRED_SIZE)
        );

        pack();
    }// </editor-fold>//GEN-END:initComponents

    private void comboAlmacenActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_comboAlmacenActionPerformed
        
    }//GEN-LAST:event_comboAlmacenActionPerformed

    private void btnCerrarActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_btnCerrarActionPerformed
        dispose();
    }//GEN-LAST:event_btnCerrarActionPerformed

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

    private void textoProductoKeyPressed(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_textoProductoKeyPressed
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
                    autocomplete(txt);
                }
            });               
        }
        String producto  = textoProducto.getText();
        obtenerUnidadCodigo(producto);
    }//GEN-LAST:event_textoProductoKeyPressed

    private void btnGuardarActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_btnGuardarActionPerformed
        Date fe = new Date();
        long dd = fe.getTime();
        java.sql.Date fechaAct = new java.sql.Date(dd);
        
        String sucursal = (String)comboSucursal.getSelectedItem();
        String almacen = (String) comboAlmacen.getSelectedItem();
        int idAlmacen = obtenerIdAlmacen(almacen);
        String producto = textoProducto.getText();
        int idProducto = obtenerIdProducto(producto);
        String codigoItem = textoCodigo.getText();
        String UnidadMedi = textoUnidMedida.getText();
        
        double cantidad = (textoCantiUnid.getText().equals(""))? 0: Double.parseDouble(textoCantiUnid.getText());
        double costoUnitario = (textoCostoUnit.getText().equals(""))?  0: Double.parseDouble(textoCostoUnit.getText());
        String lote = textoLote.getText();
        
        int[] ids = obtenerIdMovimiento();
        
        try{
        
            db.insertarInvMovimiento(ids[0],ids[1],idAlmacen, fechaAct, fechaAct, fechaAct);
            int idMovimiento = db.seleccionarUltimoIdMovimiento();
            double costoTotal = cantidad * costoUnitario;
            java.sql.Date fechaVenci = null;

            try{
                if (!this.fechaVencimiento.getDate().toString().isEmpty()) {
                    Date fecha = fechaVencimiento.getDate();
                    long d = fecha.getTime();
                    fechaVenci = new java.sql.Date(d); 
                    db.insertarInvInventario(idAlmacen, idProducto, cantidad, costoUnitario, costoTotal, fechaAct, fechaVenci, fechaVenci, lote);
                }
            }catch(Exception e){
                db.insertarInvInventarioSinFechaLimite(idAlmacen, idProducto, cantidad, costoUnitario, costoTotal, fechaAct, fechaAct, lote);
            }

            int idInventario = db.seleccionarUltimoIdInventario();

            double importe = costoTotal * cantidad;
            double descuento = 0.0 ,recargo = 0.0 ,ice = 0.0,excento = 0.0;
            double total = costoUnitario * cantidad;
            db.insertarDetalleMovimiento(idProducto, idMovimiento, costoUnitario, cantidad, importe, descuento, recargo, ice, excento, false, false, total, fechaAct, fechaAct,fechaVenci, idInventario);
            
            JOptionPane.showMessageDialog(null, "Guardado Exitosamente");
            dispose();
            
        }catch(Exception e){
            System.out.println("Error al insertar inventario "+e.getMessage());
            JOptionPane.showMessageDialog(null, "Ocurrio un error al insertar el inventario");
        }
  
    }//GEN-LAST:event_btnGuardarActionPerformed

    private void textoLoteKeyTyped(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_textoLoteKeyTyped
        char c = evt.getKeyChar(); 
        if ((c<'0' || c>'9')) evt.consume();
    }//GEN-LAST:event_textoLoteKeyTyped

    private void textoCostoUnitKeyTyped(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_textoCostoUnitKeyTyped
        char c = evt.getKeyChar();
        if (((c < '0') || (c > '9')) 
        && (c != KeyEvent.VK_BACK_SPACE)
        && (c != '.' || textoCostoUnit.getText().contains(".")) ) {
            evt.consume();
        }
    }//GEN-LAST:event_textoCostoUnitKeyTyped

    private void textoCantiUnidKeyTyped(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_textoCantiUnidKeyTyped
        char c = evt.getKeyChar();
        if (((c < '0') || (c > '9')) 
        && (c != KeyEvent.VK_BACK_SPACE)
        && (c != '.' || textoCantiUnid.getText().contains(".")) ) {
            evt.consume();
        }
    }//GEN-LAST:event_textoCantiUnidKeyTyped

    private void textoProductoKeyReleased(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_textoProductoKeyReleased
        
        String nombre = textoProducto.getText();
        if (nombre.equals("")) {
            textoCodigo.setText("");
            textoUnidMedida.setText("");
        }
    }//GEN-LAST:event_textoProductoKeyReleased

 

    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JButton btnCerrar;
    private javax.swing.JButton btnGuardar;
    private javax.swing.JComboBox<String> comboAlmacen;
    private javax.swing.JComboBox<String> comboSucursal;
    private com.toedter.calendar.JDateChooser fechaVencimiento;
    private javax.swing.JLabel jLabel1;
    private javax.swing.JLabel jLabel2;
    private javax.swing.JLabel jLabel3;
    private javax.swing.JLabel jLabel4;
    private javax.swing.JLabel jLabel5;
    private javax.swing.JLabel jLabel6;
    private javax.swing.JLabel jLabel7;
    private javax.swing.JLabel jLabel8;
    private javax.swing.JLabel jLabel9;
    private javax.swing.JPanel jPanel1;
    private javax.swing.JScrollPane jScrollPane1;
    private javax.swing.JSeparator jSeparator1;
    private javax.swing.JLabel labelLote;
    private javax.swing.JTextField textoCantiUnid;
    private javax.swing.JTextField textoCodigo;
    private javax.swing.JTextField textoCostoUnit;
    private javax.swing.JTextField textoLote;
    private javax.swing.JTextField textoProducto;
    private javax.swing.JTextField textoUnidMedida;
    // End of variables declaration//GEN-END:variables
}
