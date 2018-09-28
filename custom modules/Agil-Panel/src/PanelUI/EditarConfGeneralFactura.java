/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package PanelUI;

import java.awt.event.WindowEvent;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.swing.JDialog;
import javax.swing.JOptionPane;
import javax.swing.JTable;
import models.Database;

/**
 *
 * @author AGIL
 */
public class EditarConfGeneralFactura extends java.awt.Dialog {
    public int id_factura;
    public Database db = new Database();
    public int tam;
    /**
     * Creates new form EditarConfGeneralFactura
     */
    public EditarConfGeneralFactura(java.awt.Frame parent, boolean modal,int id_factura,int tam) {
        super(parent, modal);
        initComponents();
        setLocationRelativeTo(this);
        setTitle("Configuracion de Factura General");
        this.tam = tam;    
        this.id_factura = id_factura;
        
        mostrarDatosImpresion();
        mostrarDatosTipoFactura();
        mostrarDatosTamañoPapel();
        mostrarDatosTitulo();
        mostrarDatosSubTitulo();
    }
    
    public void mostrarDatosImpresion(){
        ResultSet rs = null;
        int idImpresion = 30;
        String consulta = "SELECT C.NOMBRE\n" +
            "FROM TIPO AS T\n" +
            "INNER JOIN CLASE AS C ON C.ID_TIPO = T.ID\n" +
            "WHERE T.ID = "+idImpresion;
        try {
            rs = db.seleccionar(consulta);
            while (rs.next()) {                
                comboImpresion.addItem(rs.getString(1));
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
    
    public void mostrarDatosTipoFactura(){
        ResultSet rs = null;
        int idTipoFactura = 31;
        String consulta = "SELECT C.NOMBRE\n" +
            "FROM TIPO AS T\n" +
            "INNER JOIN CLASE AS C ON C.ID_TIPO = T.ID\n" +
            "WHERE T.ID = "+idTipoFactura;
        try{
            rs = db.seleccionar(consulta);
            while(rs.next()){
                comboTipFactu.addItem(rs.getString(1));
            }
        }catch(Exception e){
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
    
    public void mostrarDatosTamañoPapel(){
        ResultSet rs = null;
        int idTamañoPapel = 26;
        String consulta = "SELECT C.NOMBRE\n" +
            "FROM TIPO AS T\n" +
            "INNER JOIN CLASE AS C ON C.ID_TIPO = T.ID\n" +
            "WHERE T.ID = "+idTamañoPapel;
        try{
            rs = db.seleccionar(consulta);
            while(rs.next()){
                comboTamPapel.addItem(rs.getString(1));
                comboPapelCierreCaja.addItem(rs.getString(1));
                comboPapelCotizacion.addItem(rs.getString(1));
                comboPapelNotaBaja.addItem(rs.getString(1));
                comboPapelNotaPedido.addItem(rs.getString(1));
                comboPapelNotaTraspaso.addItem(rs.getString(1));
                comboPapelNotaVenta.addItem(rs.getString(1));
            }
        }catch(Exception e){
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
    
    public void mostrarDatosTitulo(){
        ResultSet rs = null;
        int idTituloFactu= 32;
        String consulta = "SELECT C.NOMBRE\n" +
            "FROM TIPO AS T\n" +
            "INNER JOIN CLASE AS C ON C.ID_TIPO = T.ID\n" +
            "WHERE T.ID = "+idTituloFactu;
        try{
            rs = db.seleccionar(consulta);
            while(rs.next()){
                comboTitulo.addItem(rs.getString(1));
            }
        }catch(Exception e){
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
    
    public void mostrarDatosSubTitulo(){
        ResultSet rs = null;
        int idSubTituloFactu= 33;
        String consulta = "SELECT C.NOMBRE\n" +
            "FROM TIPO AS T\n" +
            "INNER JOIN CLASE AS C ON C.ID_TIPO = T.ID\n" +
            "WHERE T.ID = "+idSubTituloFactu;
        try{
            rs = db.seleccionar(consulta);
            while(rs.next()){
                comboSubtitulo.addItem(rs.getString(1));
            }
        }catch(Exception e){
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
    
    public int obtenerIdImpresion(String nombre){
        ResultSet rs = null;
        int idImpresion = 30;
        int id = 0;
        String consulta = "SELECT C.ID \n" +
            "FROM TIPO AS T\n" +
            "INNER JOIN CLASE AS C ON C.ID_TIPO = T.ID\n" +
            "WHERE T.ID = "+idImpresion+" AND C.NOMBRE = '"+nombre+"'";
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
    
    public int obtenerIdTipoFactura(String nombre){
        ResultSet rs = null;
        int idTipoFactura = 31;
        int id = 0;
        String consulta = "SELECT C.ID \n" +
            "FROM TIPO AS T\n" +
            "INNER JOIN CLASE AS C ON C.ID_TIPO = T.ID\n" +
            "WHERE T.ID = "+idTipoFactura+" AND C.NOMBRE = '"+nombre+"'";
        try{
            rs = db.seleccionar(consulta);
            while(rs.next()){
                id = rs.getInt(1);
            }
        }catch(Exception e){
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
    
    public int obtenerIdTamañoPapel(String nombre){
        ResultSet rs = null;
        int idTamañoPapel = 26;
        int id = 0;
        String consulta = "SELECT C.ID \n" +
            "FROM TIPO AS T\n" +
            "INNER JOIN CLASE AS C ON C.ID_TIPO = T.ID\n" +
            "WHERE T.ID = "+idTamañoPapel+" AND C.NOMBRE = '"+nombre+"'";
        try{
            rs = db.seleccionar(consulta);
            while(rs.next()){
                id = rs.getInt(1);
            }
        }catch(Exception e){
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
    
    public int obtenerIdTitulo(String nombre){
        ResultSet rs = null;
        int idTituloFactu= 32;
        int id = 0;
        String consulta = "SELECT C.ID\n" +
            "FROM TIPO AS T\n" +
            "INNER JOIN CLASE AS C ON C.ID_TIPO = T.ID\n" +
            "WHERE T.ID = "+idTituloFactu+" AND C.NOMBRE = '"+nombre+"'";
        try{
            rs = db.seleccionar(consulta);
            while(rs.next()){
                id = rs.getInt(1);
            }
        }catch(Exception e){
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
    
    public int obtenerIdSubTitulo(String nombre){
        ResultSet rs = null;
        int idSubTituloFactu= 33;
        int id = 0;
        String consulta = "SELECT C.ID \n" +
            "FROM TIPO AS T\n" +
            "INNER JOIN CLASE AS C ON C.ID_TIPO = T.ID\n" +
            "WHERE T.ID = "+idSubTituloFactu+" AND C.NOMBRE = '"+nombre+"'";
        try{
            rs = db.seleccionar(consulta);
            while(rs.next()){
                id = rs.getInt(1);
            }
        }catch(Exception e){
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
     
    public int obtenerIdEmpresa(){
        ResultSet rs = null;
        int idFactura = this.id_factura;
        int id = 0;
        String consulta = "SELECT EMPRESA FROM CONFIGURACION_GENERAL_FACTURA WHERE ID = "+idFactura;
        try{
            rs = db.seleccionar(consulta);
            while(rs.next()){
                id = rs.getInt(1);
            }
        }catch(Exception e){
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
    

    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        jScrollPane1 = new javax.swing.JScrollPane();
        jPanel1 = new javax.swing.JPanel();
        jLabel1 = new javax.swing.JLabel();
        jLabel2 = new javax.swing.JLabel();
        comboImpresion = new javax.swing.JComboBox<>();
        jLabel3 = new javax.swing.JLabel();
        comboTipFactu = new javax.swing.JComboBox<>();
        jLabel4 = new javax.swing.JLabel();
        comboTamPapel = new javax.swing.JComboBox<>();
        jLabel5 = new javax.swing.JLabel();
        comboTitulo = new javax.swing.JComboBox<>();
        jLabel6 = new javax.swing.JLabel();
        comboSubtitulo = new javax.swing.JComboBox<>();
        radioUsar = new javax.swing.JRadioButton();
        radioUsarPF = new javax.swing.JRadioButton();
        radioImprimirGuardar = new javax.swing.JRadioButton();
        jLabel7 = new javax.swing.JLabel();
        comboPapelNotaVenta = new javax.swing.JComboBox<>();
        jLabel8 = new javax.swing.JLabel();
        comboPapelNotaTraspaso = new javax.swing.JComboBox<>();
        jLabel9 = new javax.swing.JLabel();
        comboPapelNotaBaja = new javax.swing.JComboBox<>();
        jLabel10 = new javax.swing.JLabel();
        comboPapelNotaPedido = new javax.swing.JComboBox<>();
        jLabel11 = new javax.swing.JLabel();
        comboPapelCierreCaja = new javax.swing.JComboBox<>();
        jLabel12 = new javax.swing.JLabel();
        comboPapelCotizacion = new javax.swing.JComboBox<>();
        btnCancelar = new javax.swing.JButton();
        btnGuardar = new javax.swing.JButton();

        addWindowListener(new java.awt.event.WindowAdapter() {
            public void windowClosing(java.awt.event.WindowEvent evt) {
                closeDialog(evt);
            }
        });

        jScrollPane1.setHorizontalScrollBar(null);

        jPanel1.setBackground(new java.awt.Color(255, 255, 255));

        jLabel1.setFont(new java.awt.Font("Arial", 1, 14)); // NOI18N
        jLabel1.setForeground(new java.awt.Color(70, 143, 204));
        jLabel1.setText("Configuracion datos generales facturacion");

        jLabel2.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel2.setForeground(new java.awt.Color(70, 143, 204));
        jLabel2.setText("Impresión");

        jLabel3.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel3.setForeground(new java.awt.Color(70, 143, 204));
        jLabel3.setText("Tipo Facturación");

        jLabel4.setForeground(new java.awt.Color(70, 143, 204));
        jLabel4.setText("Tamaño Papel");

        comboTamPapel.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                comboTamPapelActionPerformed(evt);
            }
        });

        jLabel5.setForeground(new java.awt.Color(70, 143, 204));
        jLabel5.setText("Título");

        jLabel6.setForeground(new java.awt.Color(70, 143, 204));
        jLabel6.setText("Subtítulo");

        radioUsar.setBackground(new java.awt.Color(255, 255, 255));
        radioUsar.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        radioUsar.setForeground(new java.awt.Color(70, 143, 204));
        radioUsar.setText("Usar?");
        radioUsar.setBorder(null);

        radioUsarPF.setBackground(new java.awt.Color(255, 255, 255));
        radioUsarPF.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        radioUsarPF.setForeground(new java.awt.Color(70, 143, 204));
        radioUsarPF.setText("Usar PF?");
        radioUsarPF.setBorder(null);

        radioImprimirGuardar.setBackground(new java.awt.Color(255, 255, 255));
        radioImprimirGuardar.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        radioImprimirGuardar.setForeground(new java.awt.Color(70, 143, 204));
        radioImprimirGuardar.setText("Imprimir al guardar?");
        radioImprimirGuardar.setBorder(null);

        jLabel7.setForeground(new java.awt.Color(70, 143, 204));
        jLabel7.setText("Tamaño Papel Nota Venta");

        jLabel8.setForeground(new java.awt.Color(70, 143, 204));
        jLabel8.setText("Tamaño Papel Nota Traspaso");

        jLabel9.setForeground(new java.awt.Color(70, 143, 204));
        jLabel9.setText("Tamaño Papel Nota Baja");

        jLabel10.setForeground(new java.awt.Color(70, 143, 204));
        jLabel10.setText("Tamaño Papel Nota Pedido");

        jLabel11.setForeground(new java.awt.Color(70, 143, 204));
        jLabel11.setText("Tamaño Papel Cierre Caja");

        jLabel12.setForeground(new java.awt.Color(70, 143, 204));
        jLabel12.setText("Tamaño Papel Cotización");

        btnCancelar.setBackground(new java.awt.Color(183, 70, 53));
        btnCancelar.setForeground(new java.awt.Color(255, 255, 255));
        btnCancelar.setText("Cancelar");
        btnCancelar.setBorder(javax.swing.BorderFactory.createLineBorder(new java.awt.Color(209, 91, 71)));
        btnCancelar.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                btnCancelarActionPerformed(evt);
            }
        });

        btnGuardar.setBackground(new java.awt.Color(98, 155, 88));
        btnGuardar.setForeground(new java.awt.Color(255, 255, 255));
        btnGuardar.setText("Guardar");
        btnGuardar.setBorder(javax.swing.BorderFactory.createLineBorder(new java.awt.Color(135, 184, 127)));
        btnGuardar.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                btnGuardarActionPerformed(evt);
            }
        });

        javax.swing.GroupLayout jPanel1Layout = new javax.swing.GroupLayout(jPanel1);
        jPanel1.setLayout(jPanel1Layout);
        jPanel1Layout.setHorizontalGroup(
            jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel1Layout.createSequentialGroup()
                .addContainerGap()
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(jLabel1)
                    .addGroup(jPanel1Layout.createSequentialGroup()
                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(comboImpresion, javax.swing.GroupLayout.PREFERRED_SIZE, 110, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addComponent(jLabel2))
                        .addGap(18, 18, 18)
                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(jLabel3)
                            .addComponent(comboTipFactu, javax.swing.GroupLayout.PREFERRED_SIZE, 180, javax.swing.GroupLayout.PREFERRED_SIZE))
                        .addGap(18, 18, 18)
                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(comboTamPapel, javax.swing.GroupLayout.PREFERRED_SIZE, 110, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addComponent(jLabel4))
                        .addGap(20, 20, 20)
                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(jLabel5, javax.swing.GroupLayout.PREFERRED_SIZE, 35, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addComponent(comboTitulo, javax.swing.GroupLayout.PREFERRED_SIZE, 170, javax.swing.GroupLayout.PREFERRED_SIZE)))
                    .addComponent(jLabel6, javax.swing.GroupLayout.PREFERRED_SIZE, 59, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addGroup(jPanel1Layout.createSequentialGroup()
                        .addComponent(comboSubtitulo, javax.swing.GroupLayout.PREFERRED_SIZE, 196, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addGap(18, 18, 18)
                        .addComponent(radioUsar)
                        .addGap(18, 18, 18)
                        .addComponent(radioUsarPF)
                        .addGap(18, 18, 18)
                        .addComponent(radioImprimirGuardar))
                    .addGroup(jPanel1Layout.createSequentialGroup()
                        .addGap(356, 356, 356)
                        .addComponent(btnCancelar, javax.swing.GroupLayout.PREFERRED_SIZE, 70, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addGap(58, 58, 58)
                        .addComponent(btnGuardar, javax.swing.GroupLayout.PREFERRED_SIZE, 70, javax.swing.GroupLayout.PREFERRED_SIZE))
                    .addGroup(jPanel1Layout.createSequentialGroup()
                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING, false)
                            .addComponent(comboPapelNotaVenta, javax.swing.GroupLayout.PREFERRED_SIZE, 141, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addComponent(jLabel7, javax.swing.GroupLayout.PREFERRED_SIZE, 149, javax.swing.GroupLayout.PREFERRED_SIZE))
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addGroup(jPanel1Layout.createSequentialGroup()
                                .addComponent(jLabel8, javax.swing.GroupLayout.PREFERRED_SIZE, 167, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                                .addComponent(jLabel9, javax.swing.GroupLayout.PREFERRED_SIZE, 171, javax.swing.GroupLayout.PREFERRED_SIZE))
                            .addGroup(jPanel1Layout.createSequentialGroup()
                                .addComponent(comboPapelNotaTraspaso, javax.swing.GroupLayout.PREFERRED_SIZE, 160, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addGap(18, 18, 18)
                                .addComponent(comboPapelNotaBaja, javax.swing.GroupLayout.PREFERRED_SIZE, 162, javax.swing.GroupLayout.PREFERRED_SIZE))))
                    .addGroup(jPanel1Layout.createSequentialGroup()
                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING, false)
                            .addComponent(jLabel10, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                            .addComponent(comboPapelNotaPedido, javax.swing.GroupLayout.PREFERRED_SIZE, 160, javax.swing.GroupLayout.PREFERRED_SIZE))
                        .addGap(18, 18, 18)
                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING, false)
                            .addComponent(comboPapelCierreCaja, 0, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                            .addComponent(jLabel11, javax.swing.GroupLayout.PREFERRED_SIZE, 160, javax.swing.GroupLayout.PREFERRED_SIZE))
                        .addGap(18, 18, 18)
                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING, false)
                            .addComponent(comboPapelCotizacion, 0, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                            .addComponent(jLabel12, javax.swing.GroupLayout.PREFERRED_SIZE, 160, javax.swing.GroupLayout.PREFERRED_SIZE))))
                .addContainerGap(234, Short.MAX_VALUE))
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
                    .addComponent(jLabel4)
                    .addComponent(jLabel5))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(comboImpresion, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(comboTipFactu, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(comboTamPapel, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(comboTitulo, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addComponent(jLabel6)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(comboSubtitulo, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(radioUsar)
                    .addComponent(radioUsarPF)
                    .addComponent(radioImprimirGuardar))
                .addGap(33, 33, 33)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jLabel7)
                    .addComponent(jLabel8)
                    .addComponent(jLabel9))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(comboPapelNotaVenta, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(comboPapelNotaTraspaso, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(comboPapelNotaBaja, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addGap(18, 18, 18)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jLabel10)
                    .addComponent(jLabel11)
                    .addComponent(jLabel12))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(comboPapelNotaPedido, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(comboPapelCierreCaja, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(comboPapelCotizacion, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, 58, Short.MAX_VALUE)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(btnCancelar, javax.swing.GroupLayout.PREFERRED_SIZE, 30, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(btnGuardar, javax.swing.GroupLayout.PREFERRED_SIZE, 30, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addGap(58, 58, 58))
        );

        jScrollPane1.setViewportView(jPanel1);

        add(jScrollPane1, java.awt.BorderLayout.CENTER);

        pack();
    }// </editor-fold>//GEN-END:initComponents

    /**
     * Closes the dialog
     */
    private void closeDialog(java.awt.event.WindowEvent evt) {//GEN-FIRST:event_closeDialog
        setVisible(false);
        dispose();
    }//GEN-LAST:event_closeDialog

    private void comboTamPapelActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_comboTamPapelActionPerformed
        // TODO add your handling code here:
    }//GEN-LAST:event_comboTamPapelActionPerformed

    private void btnCancelarActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_btnCancelarActionPerformed
        // TODO add your handling code here:
        dispose();
    }//GEN-LAST:event_btnCancelarActionPerformed

    private void btnGuardarActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_btnGuardarActionPerformed
   
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        java.util.Date fe = new java.util.Date();
        long d = fe.getTime();
        java.sql.Date updatedat = new java.sql.Date(d);
        String impresion = (String)comboImpresion.getSelectedItem();
        int idImpresion = obtenerIdImpresion(impresion);
        String tipoFactura = (String) comboTipFactu.getSelectedItem();
        int idTipoFactura = obtenerIdTipoFactura(tipoFactura);
        String tamañoPapel = (String) comboTamPapel.getSelectedItem();
        int idTamañoPapel = obtenerIdTamañoPapel(tamañoPapel);
        String titulo = (String) comboTitulo.getSelectedItem();
        int idTitulo = obtenerIdTitulo(titulo);
        String subTitulo = (String) comboSubtitulo.getSelectedItem();
        int idSubTitulo = obtenerIdSubTitulo(subTitulo);
        boolean usar = radioUsar.isSelected();
        boolean usarPF = radioUsarPF.isSelected();
        boolean imprimirGuardar = radioImprimirGuardar.isSelected();
        String tamPapelNotaVenta = (String) comboPapelNotaVenta.getSelectedItem();
        int idPapelNotaVenta = obtenerIdTamañoPapel(tamPapelNotaVenta);
        String tamPapelNotaTraspaso = (String) comboPapelNotaTraspaso.getSelectedItem();
        int idPapelNotaTraspaso = obtenerIdTamañoPapel(tamPapelNotaTraspaso);
        String tamPapelNotaBaja = (String) comboPapelNotaBaja.getSelectedItem();
        int idPapelNotaBaja = obtenerIdTamañoPapel(tamPapelNotaBaja);
        String tamPapelNotaPedido = (String) comboPapelNotaPedido.getSelectedItem();
        int idPapelNotaPedido = obtenerIdTamañoPapel(tamPapelNotaPedido);
        String tamPapelCierreCaja = (String) comboPapelCierreCaja.getSelectedItem();
        int idPapelCierreCaja = obtenerIdTamañoPapel(tamPapelCierreCaja);
        String tamPapelCotizacion = (String) comboPapelCotizacion.getSelectedItem();
        int idPapelCotizacion = obtenerIdTamañoPapel(tamPapelCotizacion);
        int empresa = obtenerIdEmpresa();
        
        db.actualizarConfigGeneralFactura(this.id_factura, empresa, idImpresion, idTipoFactura, idTamañoPapel, idTitulo, idSubTitulo, usar, usarPF, imprimirGuardar, updatedat, idPapelNotaVenta, idPapelNotaTraspaso, idPapelNotaBaja, idPapelNotaPedido, idPapelCierreCaja, idPapelCotizacion);

        JOptionPane.showMessageDialog(null, "Guardado Exitosamente");
        dispose();
    }//GEN-LAST:event_btnGuardarActionPerformed



    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JButton btnCancelar;
    private javax.swing.JButton btnGuardar;
    private javax.swing.JComboBox<String> comboImpresion;
    private javax.swing.JComboBox<String> comboPapelCierreCaja;
    private javax.swing.JComboBox<String> comboPapelCotizacion;
    private javax.swing.JComboBox<String> comboPapelNotaBaja;
    private javax.swing.JComboBox<String> comboPapelNotaPedido;
    private javax.swing.JComboBox<String> comboPapelNotaTraspaso;
    private javax.swing.JComboBox<String> comboPapelNotaVenta;
    private javax.swing.JComboBox<String> comboSubtitulo;
    private javax.swing.JComboBox<String> comboTamPapel;
    private javax.swing.JComboBox<String> comboTipFactu;
    private javax.swing.JComboBox<String> comboTitulo;
    private javax.swing.JLabel jLabel1;
    private javax.swing.JLabel jLabel10;
    private javax.swing.JLabel jLabel11;
    private javax.swing.JLabel jLabel12;
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
    private javax.swing.JRadioButton radioImprimirGuardar;
    private javax.swing.JRadioButton radioUsar;
    private javax.swing.JRadioButton radioUsarPF;
    // End of variables declaration//GEN-END:variables
}
