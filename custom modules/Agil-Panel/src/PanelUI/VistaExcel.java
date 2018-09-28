/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package PanelUI;

import java.io.File;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.logging.Level;
import java.util.logging.Logger;
import models.Database;
import models.insertarImagen;

/**
 *
 * @author ricardo
 */
public class VistaExcel extends javax.swing.JFrame {
    public Database db = new Database();
    public int id_usuario;
    /**
     * Creates new form VistaExcel
     */
    public VistaExcel(int id_usuario) {
        initComponents();
        this.id_usuario = id_usuario;
    }
    
    public VistaExcel() {
        initComponents();
    }
    public boolean verificarGrupo(String nombre_Grupo){
        boolean existe = false;
        ResultSet rs = null;
        String nombre = nombre_Grupo.toLowerCase();
        String consulta = "SELECT * FROM TIPO WHERE LOWER(NOMBRE) = '"+nombre+"'";
        try {
            rs = db.seleccionar(consulta);
            if (rs.next()) {
                existe = true;
            }else{
                existe = false;
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }finally{
            try {
                rs.close();
                db.Conectar().close();
            } catch (SQLException ex) {
                Logger.getLogger(VistaExcel.class.getName()).log(Level.SEVERE, null, ex);
            }
            
        } 
        return existe;
    }
    
    public boolean verificarSubGrupo(String nombre_SubGrupo){
        boolean existe = false;
        ResultSet rs = null;
        String nombre = nombre_SubGrupo.toLowerCase();
        String consulta = "SELECT * FROM CLASE WHERE LOWER(NOMBRE) = '"+nombre+"'";
        try {
            rs = db.seleccionar(consulta);
            if (rs.next()) {
                existe = true;
            }else{
                existe = false;
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }finally{
            try {
                rs.close();
                db.Conectar().close();
            } catch (SQLException ex) {
                Logger.getLogger(VistaExcel.class.getName()).log(Level.SEVERE, null, ex);
            }
            
        } 
        return existe;
    }
    
    public int[] insertarGrupoSubGrupo(String nombre_grupo,String nombre_subGrupo){
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        Date fe = new Date();
        long dd = fe.getTime();
        java.sql.Date fechaAct = new java.sql.Date(dd);
        String fecha = sdf.format(fechaAct);
        String nombre_corto = "";
        int id_empresa = obtenerIdEmpresa();
        int[] ids = new int[2];
        if (verificarGrupo(nombre_grupo)== false) {
            nombre_corto = nombre_grupo;         
            int ultimoId = db.seleccionarUltimoIdTipo();
            int id = ultimoId + 1;
            db.InsertarTipos(id, nombre_grupo, nombre_corto, fecha, fecha, id_empresa); 
            
            int id_tipo = id;
            ids[0] = id_tipo;          
            int ultimoIdClase = db.seleccionarUltimoIdClase();
            int id_subGrupo = ultimoIdClase +1;
            String nomb_corto_grupo = nombre_subGrupo;
            db.InsertarClasesConcepto(id_subGrupo, id_tipo, nombre_subGrupo, nomb_corto_grupo, true, fecha, fecha);
            ids[1] = id_subGrupo; 
            
        }else{
            int id_grupo = obtenerIdGrupo(nombre_grupo);
            if (verificarSubGrupo(nombre_subGrupo) == true) {
                int id_SubGrupo = obtenerIdSubGrupo(nombre_subGrupo);
                ids[0] = id_grupo;
                ids[1] = id_SubGrupo;
            }else{
                String nomb_corto_grupo = nombre_subGrupo;
                ids[0] = id_grupo;
                
                int ultimoIdClase = db.seleccionarUltimoIdClase();
                int id_subGrupo = ultimoIdClase +1;
                ids[1] = id_subGrupo; 
                db.InsertarClasesConcepto(id_subGrupo, id_grupo, nombre_subGrupo, nomb_corto_grupo, true, fecha, fecha);
            }
            
        }
        return ids;
    }
    
    public int obtenerIdEmpresa(){
        int id = 0;
        ResultSet rs = null;
        try{
            rs = db.seleccionar("SELECT EMPRESA\n" +
                "FROM USUARIO\n" +
                "WHERE ID = "+this.id_usuario);
            while (rs.next()) {                
                id = rs.getInt(1);
            }
        }catch(Exception ex){
            ex.printStackTrace();
        }finally{
            try {
                rs.close();
                db.Conectar().close();
            } catch (SQLException ex) {
                Logger.getLogger(VistaExcel.class.getName()).log(Level.SEVERE, null, ex);
                ex.printStackTrace();
            }
        }
        return id;
    }
    
    public int obtenerIdGrupo(String nombre_grupo){
        ResultSet rs = null;
        String nombre = nombre_grupo.toLowerCase();
        int id = 0;
        try {
            rs = db.seleccionar("SELECT ID FROM TIPO WHERE LOWER(NOMBRE) = '"+nombre+"'");
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
                Logger.getLogger(VistaExcel.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
        return id;
    }
    
    public int obtenerIdSubGrupo(String nombre_SubGrupo){
        ResultSet rs = null;
        String nombre = nombre_SubGrupo.toLowerCase();
        int id = 0;
        try {
            rs = db.seleccionar("SELECT ID FROM CLASE WHERE LOWER(NOMBRE) = '"+nombre+"'");
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
                Logger.getLogger(VistaExcel.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
        return id;
    }
    
    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        btnImportar = new javax.swing.JButton();
        jLabel1 = new javax.swing.JLabel();
        jLabel4 = new javax.swing.JLabel();
        jLabel2 = new javax.swing.JLabel();
        jScrollPane1 = new javax.swing.JScrollPane();
        jtDatos = new javax.swing.JTable();
        jButton1 = new javax.swing.JButton();
        cancelar = new javax.swing.JButton();

        setDefaultCloseOperation(javax.swing.WindowConstants.EXIT_ON_CLOSE);
        setTitle("IMPORTAR Y EXPORTAR CON JAVA ");

        btnImportar.setFont(new java.awt.Font("Tahoma", 1, 11)); // NOI18N
        btnImportar.setText("Importar");
        btnImportar.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                btnImportarActionPerformed(evt);
            }
        });

        jLabel1.setFont(new java.awt.Font("Tahoma", 1, 12)); // NOI18N
        jLabel1.setForeground(new java.awt.Color(0, 102, 0));
        jLabel1.setText("IMPORTACIÓN ");

        jLabel4.setIcon(new javax.swing.ImageIcon(getClass().getResource("/imagen/xls.png"))); // NOI18N

        jLabel2.setIcon(new javax.swing.ImageIcon(getClass().getResource("/imagen/xlsx.png"))); // NOI18N

        jtDatos.setModel(new javax.swing.table.DefaultTableModel(
            new Object [][] {
                {null, null, null, null, null, null},
                {null, null, null, null, null, null},
                {null, null, null, null, null, null},
                {null, null, null, null, null, null}
            },
            new String [] {
                "Title 1", "Title 2", "Title 3", "Title 4", "Título 5", "Título 6"
            }
        ));
        jtDatos.setAutoscrolls(false);
        jtDatos.setSelectionMode(javax.swing.ListSelectionModel.SINGLE_SELECTION);
        jtDatos.getTableHeader().setResizingAllowed(false);
        jScrollPane1.setViewportView(jtDatos);

        jButton1.setBackground(new java.awt.Color(98, 155, 88));
        jButton1.setForeground(new java.awt.Color(255, 255, 255));
        jButton1.setText("Guardar");
        jButton1.setBorder(javax.swing.BorderFactory.createLineBorder(new java.awt.Color(135, 184, 127)));
        jButton1.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jButton1ActionPerformed(evt);
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

        javax.swing.GroupLayout layout = new javax.swing.GroupLayout(getContentPane());
        getContentPane().setLayout(layout);
        layout.setHorizontalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(layout.createSequentialGroup()
                .addContainerGap()
                .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING)
                    .addComponent(jScrollPane1, javax.swing.GroupLayout.DEFAULT_SIZE, 580, Short.MAX_VALUE)
                    .addGroup(layout.createSequentialGroup()
                        .addComponent(btnImportar)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                        .addComponent(jLabel4)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                        .addComponent(jLabel1)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                        .addComponent(jLabel2)))
                .addContainerGap())
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, layout.createSequentialGroup()
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                .addComponent(cancelar, javax.swing.GroupLayout.PREFERRED_SIZE, 76, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(36, 36, 36)
                .addComponent(jButton1, javax.swing.GroupLayout.PREFERRED_SIZE, 72, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(119, 119, 119))
        );
        layout.setVerticalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(layout.createSequentialGroup()
                .addContainerGap()
                .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING)
                    .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                        .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(btnImportar, javax.swing.GroupLayout.Alignment.TRAILING)
                            .addComponent(jLabel4, javax.swing.GroupLayout.Alignment.TRAILING))
                        .addComponent(jLabel2, javax.swing.GroupLayout.Alignment.TRAILING))
                    .addComponent(jLabel1, javax.swing.GroupLayout.PREFERRED_SIZE, 27, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jScrollPane1, javax.swing.GroupLayout.PREFERRED_SIZE, 129, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(18, 18, 18)
                .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jButton1, javax.swing.GroupLayout.PREFERRED_SIZE, 32, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(cancelar, javax.swing.GroupLayout.PREFERRED_SIZE, 32, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addContainerGap(21, Short.MAX_VALUE))
        );

        pack();
    }// </editor-fold>//GEN-END:initComponents

    private void jButton1ActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jButton1ActionPerformed
        Date fe = new Date();
        long dd = fe.getTime();
        java.sql.Date fechaAct = new java.sql.Date(dd);
        insertarImagen insertarP = new insertarImagen();
        
        for (int i = 0; i < jtDatos.getRowCount(); i++) {
            String codigo = String.valueOf(jtDatos.getValueAt(i, 0));
            String nombre = String.valueOf(jtDatos.getValueAt(i, 1));
            String unidMedida = String.valueOf(jtDatos.getValueAt(i, 2));
            double precioUnit = Double.valueOf(String.valueOf(jtDatos.getValueAt(i, 3)));
            String descripcion = String.valueOf(jtDatos.getValueAt(i, 4));
            int inventMinimo = Integer.parseInt(String.valueOf(jtDatos.getValueAt(i, 5)));
            String grupo = String.valueOf(jtDatos.getValueAt(i, 6));
            String subGrupo = String.valueOf(jtDatos.getValueAt(i, 7));
            String caractEspe1 = String.valueOf(jtDatos.getValueAt(i, 8));
            String caractEspe2 = String.valueOf(jtDatos.getValueAt(i, 9));
            String codigoFabrica = String.valueOf(jtDatos.getValueAt(i, 10));
            double comision = Double.valueOf(String.valueOf(jtDatos.getValueAt(i, 11)));
            int alerta = Integer.parseInt(String.valueOf(jtDatos.getValueAt(i, 12)));
            double descuento = Double.valueOf(String.valueOf(jtDatos.getValueAt(i, 13)));
            boolean descuentoFijo = Boolean.parseBoolean(String.valueOf(jtDatos.getValueAt(i, 14)));
            double descuFijo = 0.0;
            if(descuentoFijo == true){descuFijo = 1.0;}else{descuFijo = 0.0;}       
            int id_empresa = obtenerIdEmpresa();
            double utili_esperada = 0.0;
            double rangoMax = 0.0;
            double rangoMin = 0.0;
            boolean publicar_panel = false;
            boolean activ_prod = false;
            int id_tipo_producto = 633;
            String marca = "" , modelo = "", anio = "";
            int cuenta = 0;
            
            
            int[] ids = insertarGrupoSubGrupo(grupo, subGrupo);
            int[] id_grupo = new int[2];
            for (int j = 0; j < ids.length; j++) {
                id_grupo[j] = ids[j];
            }
            int id_SubGrupo = id_grupo[1];      
            
            db.insertarProductosProd(id_empresa, nombre, codigo, unidMedida, precioUnit, utili_esperada, inventMinimo, descripcion, id_grupo[0], id_SubGrupo, caractEspe1, caractEspe2, codigoFabrica, rangoMax, rangoMin, fechaAct, fechaAct, comision, publicar_panel, alerta , descuento, descuFijo, id_tipo_producto, activ_prod, marca, modelo, anio, cuenta,false);
            
            int id_producto = db.seleccionarUltimoIdProducto();
            File ruta = new File("/imagen/icon-producto-default.png"); 
            String resp = insertarP.guardarProductos(ruta, id_producto);
            db.insertarImgenProducto(id_producto, resp);
            
        }
    }//GEN-LAST:event_jButton1ActionPerformed

    private void cancelarActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_cancelarActionPerformed
        dispose();
    }//GEN-LAST:event_cancelarActionPerformed

    private void btnImportarActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_btnImportarActionPerformed
        // TODO add your handling code here:
    }//GEN-LAST:event_btnImportarActionPerformed

    /**
     * @param args the command line arguments
     */
   

    // Variables declaration - do not modify//GEN-BEGIN:variables
    public javax.swing.JButton btnImportar;
    private javax.swing.JButton cancelar;
    private javax.swing.JButton jButton1;
    private javax.swing.JLabel jLabel1;
    private javax.swing.JLabel jLabel2;
    private javax.swing.JLabel jLabel4;
    private javax.swing.JScrollPane jScrollPane1;
    public javax.swing.JTable jtDatos;
    // End of variables declaration//GEN-END:variables
}
