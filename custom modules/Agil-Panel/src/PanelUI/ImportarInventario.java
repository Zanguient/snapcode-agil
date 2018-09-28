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
import javax.swing.JOptionPane;
import models.Database;
import models.insertarImagen;

/**
 *
 * @author ricardo
 */
public class ImportarInventario extends javax.swing.JFrame {
    public Database db = new Database();
    public int id_usuario;
    /**
     * Creates new form VistaExcel
     */
    public ImportarInventario(int id_usuario) {
        initComponents();
        this.id_usuario = id_usuario;
        this.setTitle("Importar Inventario");
        setLocationRelativeTo(this);
        btnImportar.setEnabled(false);
        obtenerSucursal();
    }
    
    public ImportarInventario() {
        initComponents();
        this.setTitle("Importar Inventario");
        setLocationRelativeTo(this);
        btnImportar.setEnabled(false);
        obtenerSucursal();
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
                Logger.getLogger(ImportarInventario.class.getName()).log(Level.SEVERE, null, ex);
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
                Logger.getLogger(ImportarInventario.class.getName()).log(Level.SEVERE, null, ex);
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
                Logger.getLogger(ImportarInventario.class.getName()).log(Level.SEVERE, null, ex);
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
                Logger.getLogger(ImportarInventario.class.getName()).log(Level.SEVERE, null, ex);
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
                Logger.getLogger(ImportarInventario.class.getName()).log(Level.SEVERE, null, ex);
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
        
    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        btnImportar = new javax.swing.JButton();
        jScrollPane1 = new javax.swing.JScrollPane();
        jtDatos = new javax.swing.JTable();
        jButton1 = new javax.swing.JButton();
        cancelar = new javax.swing.JButton();
        comboSucursal = new javax.swing.JComboBox<>();
        comboAlmacen = new javax.swing.JComboBox<>();
        jLabel3 = new javax.swing.JLabel();
        jLabel4 = new javax.swing.JLabel();

        setDefaultCloseOperation(javax.swing.WindowConstants.EXIT_ON_CLOSE);
        setTitle("IMPORTAR Y EXPORTAR CON JAVA ");

        btnImportar.setFont(new java.awt.Font("Tahoma", 1, 11)); // NOI18N
        btnImportar.setText("Importar");
        btnImportar.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                btnImportarActionPerformed(evt);
            }
        });

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

        jLabel3.setFont(new java.awt.Font("Arial", 1, 12)); // NOI18N
        jLabel3.setForeground(new java.awt.Color(71, 143, 202));
        jLabel3.setText("Sucursal");

        jLabel4.setFont(new java.awt.Font("Arial", 1, 12)); // NOI18N
        jLabel4.setForeground(new java.awt.Color(71, 143, 202));
        jLabel4.setText("Almacen");

        javax.swing.GroupLayout layout = new javax.swing.GroupLayout(getContentPane());
        getContentPane().setLayout(layout);
        layout.setHorizontalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, layout.createSequentialGroup()
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                .addComponent(cancelar, javax.swing.GroupLayout.PREFERRED_SIZE, 76, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(36, 36, 36)
                .addComponent(jButton1, javax.swing.GroupLayout.PREFERRED_SIZE, 72, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(120, 120, 120))
            .addGroup(layout.createSequentialGroup()
                .addContainerGap()
                .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(jScrollPane1, javax.swing.GroupLayout.DEFAULT_SIZE, 580, Short.MAX_VALUE)
                    .addGroup(layout.createSequentialGroup()
                        .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(comboSucursal, javax.swing.GroupLayout.PREFERRED_SIZE, 120, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addComponent(jLabel3))
                        .addGap(18, 18, 18)
                        .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(jLabel4)
                            .addGroup(layout.createSequentialGroup()
                                .addComponent(comboAlmacen, javax.swing.GroupLayout.PREFERRED_SIZE, 121, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addGap(77, 77, 77)
                                .addComponent(btnImportar)))
                        .addGap(0, 0, Short.MAX_VALUE)))
                .addContainerGap())
        );
        layout.setVerticalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(layout.createSequentialGroup()
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jLabel3)
                    .addComponent(jLabel4))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(comboSucursal, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(comboAlmacen, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(btnImportar))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addComponent(jScrollPane1, javax.swing.GroupLayout.PREFERRED_SIZE, 129, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jButton1, javax.swing.GroupLayout.PREFERRED_SIZE, 32, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(cancelar, javax.swing.GroupLayout.PREFERRED_SIZE, 32, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addContainerGap())
        );

        pack();
    }// </editor-fold>//GEN-END:initComponents

    private void jButton1ActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jButton1ActionPerformed
        SimpleDateFormat formatter = new SimpleDateFormat("dd-MMM-yyyy");
        Date fe = new Date();
        long dd = fe.getTime();
        java.sql.Date fechaAct = new java.sql.Date(dd);

        for (int i = 0; i < jtDatos.getRowCount(); i++) {
           String codigo = String.valueOf(jtDatos.getValueAt(i, 0));
           String nombre  = String.valueOf(jtDatos.getValueAt(i, 1));
           int idProducto = obtenerIdProducto(nombre);
           String unidMedi = String.valueOf(jtDatos.getValueAt(i, 2));
           double costoUnit = (String.valueOf(jtDatos.getValueAt(i, 3)).equals(""))? 0.0 : Double.valueOf(String.valueOf(jtDatos.getValueAt(i, 3)));
           Double cantidad = (String.valueOf(jtDatos.getValueAt(i, 4)).equals(""))? 0 : Double.valueOf(String.valueOf(jtDatos.getValueAt(i, 4)));
           String fecha = String.valueOf(jtDatos.getValueAt(i, 5));
           String lote = String.valueOf(jtDatos.getValueAt(i, 5));
           int ids[] = obtenerIdMovimiento();
           double costoTotal = cantidad*costoUnit;
           String almacen = (String) comboAlmacen.getSelectedItem();
           int idAlmacen = obtenerIdAlmacen(almacen);
           java.sql.Date fechaVencimiento = null;
          
            String existe = "SELECT * FROM PRODUCTO WHERE CODIGO = '"+codigo+"'";
             if (db.existeEldato(existe) == true) {
                try{ 
                    db.insertarInvMovimiento(ids[0], ids[1], idAlmacen, fechaAct, fechaAct, fechaAct);
                    int idMovimiento = db.seleccionarUltimoIdMovimiento();
                    if (!fecha.equals("")) {
                        try {
                            Date fechaV = formatter.parse(fecha);
                            long d = fechaV.getTime();
                            fechaVencimiento = new java.sql.Date(d);

                            db.insertarInvInventario(idAlmacen, idProducto, cantidad, costoUnit, costoTotal, fechaAct, fechaAct, fechaVencimiento, lote);
                        } catch (Exception e) {
                            System.out.println("Error al pasar la fecha: "+e);
                        }
                    }else{
                       db.insertarInvInventarioSinFechaLimite(idAlmacen, idProducto, cantidad, costoUnit, costoTotal, fechaAct, fechaAct, lote);
                    }
                    int idInventario = db.seleccionarUltimoIdInventario();
                    double importe = costoTotal * cantidad;
                    double descuento = 0.0 ,recargo = 0.0 ,ice = 0.0,excento = 0.0;
                    double total = costoUnit * cantidad;
                    db.insertarDetalleMovimiento(idProducto, idMovimiento, costoUnit, cantidad, importe, descuento, recargo, ice, excento, false, false, total, fechaAct, fechaAct,fechaVencimiento, idInventario);

                    JOptionPane.showMessageDialog(null, "Guadado Correctamente");
                    dispose();
                }catch(Exception e){
                    System.out.println("Error al importar inventarios");
                    JOptionPane.showMessageDialog(null, "Ocurrio un error al importar los inventarios.");
                } 

                 
                 
            }else{
                JOptionPane.showMessageDialog(null, "<html>El producto "+nombre+" con <br> el codigo "+codigo+" no existe!</html>");
            }
            
        }
    }//GEN-LAST:event_jButton1ActionPerformed

    private void cancelarActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_cancelarActionPerformed
        dispose();
    }//GEN-LAST:event_cancelarActionPerformed

    private void btnImportarActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_btnImportarActionPerformed
        // TODO add your handling code here:
    }//GEN-LAST:event_btnImportarActionPerformed

    private void comboAlmacenActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_comboAlmacenActionPerformed
       
    }//GEN-LAST:event_comboAlmacenActionPerformed

    private void comboSucursalActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_comboSucursalActionPerformed
        comboAlmacen.removeAllItems();
        String sucursal = (String)comboSucursal.getSelectedItem();
        ResultSet rs = null;
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
                Logger.getLogger(ImportarInventario.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
        btnImportar.setEnabled(true);
    }//GEN-LAST:event_comboSucursalActionPerformed

    /**
     * @param args the command line arguments
     */
   

    // Variables declaration - do not modify//GEN-BEGIN:variables
    public javax.swing.JButton btnImportar;
    private javax.swing.JButton cancelar;
    private javax.swing.JComboBox<String> comboAlmacen;
    private javax.swing.JComboBox<String> comboSucursal;
    private javax.swing.JButton jButton1;
    private javax.swing.JLabel jLabel3;
    private javax.swing.JLabel jLabel4;
    private javax.swing.JScrollPane jScrollPane1;
    public javax.swing.JTable jtDatos;
    // End of variables declaration//GEN-END:variables
}
