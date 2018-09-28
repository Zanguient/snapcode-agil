/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package operacionesUI;

import java.io.File;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.swing.JFileChooser;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JTable;
import javax.swing.filechooser.FileNameExtensionFilter;
import javax.swing.table.DefaultTableModel;
import javax.swing.table.TableCellRenderer;
import model_detalle_producto.detalleSolicitudProducto;
import model_exportar.Exportar;
import model_solicitud.solicitudReposicion;
import model_detalle_producto_base.detalleSolicitudProductoBase;
import models.DatabaseExportacion;

/**
 *
 * @author AGIL
 */
public class vistaExportarUI extends javax.swing.JFrame {
    public DatabaseExportacion db = new DatabaseExportacion();
    public DefaultTableModel modeloTabla;
    public DefaultTableModel modeloTablaProducto;
    public DefaultTableModel modeloTablaProductoBase;
    ArrayList<solicitudReposicion> ArraySolicitud = new ArrayList();
    ArrayList<detalleSolicitudProducto> solicitudProducto = new ArrayList();
    public int id_usuario;
    
    public vistaExportarUI(int id_usuario) {
        initComponents();
        this.id_usuario = id_usuario;
        String[] columnas = {"Id","Almacen","Usuario","Activo","Eliminado","Creado","Actualizado","Monto","Sucursal","Fecha"};
        modeloTabla = new DefaultTableModel(null,columnas);
        jtDatos.getTableHeader().setPreferredSize(new java.awt.Dimension(0, 33));
        
        String[] columnasProducto = {"Id","Solicitud","Producto","Cantidad","Creado","Actualizado"};
        modeloTablaProducto = new DefaultTableModel(null,columnasProducto);
        jDatosProducto.getTableHeader().setPreferredSize(new java.awt.Dimension(0, 33));
        
        String[] columnaPb = {"Id","Solicitud Producto","Producto Base","Cantidad Ideal","Cantidad Real","Creado","Actualizado","Total"};
        modeloTablaProductoBase = new DefaultTableModel(null,columnaPb);
        jDatosProductoB.getTableHeader().setPreferredSize(new java.awt.Dimension(0, 33));
        
        alinearTextoTabla();
        
        obtenerDatosSolicitud();
        obtenerDatosDetalleProducto();
        obtenerDatosDetalleProductoBase();
    }
    
    public vistaExportarUI(){
        
    }
    
    public void alinearTextoTabla(){
        TableCellRenderer rendererFromHeaderPB = jDatosProductoB.getTableHeader().getDefaultRenderer();
        JLabel headerLabelPB = (JLabel) rendererFromHeaderPB;
        headerLabelPB.setHorizontalAlignment(JLabel.CENTER);
        
        TableCellRenderer rendererFromHeader = jtDatos.getTableHeader().getDefaultRenderer();
        JLabel headerLabel = (JLabel) rendererFromHeader;
        headerLabel.setHorizontalAlignment(JLabel.CENTER);
        
        TableCellRenderer rendererFromHeaderP = jDatosProducto.getTableHeader().getDefaultRenderer();
        JLabel headerLabelP = (JLabel) rendererFromHeaderP;
        headerLabelP.setHorizontalAlignment(JLabel.CENTER);
    }
    
    public void obtenerDatosSolicitud(){
        ResultSet rs = null;
       
        int id = 0;
        int almacen = 0;
        int usuario = 0;
        boolean activo = false;
        boolean eliminado = false;
        Date createdat = null;
        Date updatedat = null;
        double monto = 0;
        String sucursal = "";
        java.sql.Timestamp fecha = null;
        int idDP = 0;
        int solicitudDP = 0;
        int producto = 0;
        double cantidad = 0;
        int idDPB = 0;
        int detalleSoliProdBase = 0;
        int producto_base = 0;
        double cantidad_ideal = 0;
        double cantidad_real = 0;
        double total = 0;
        
        int num = 1;
        
        String consulta = "SELECT ID,ALMACEN,USUARIO,ACTIVO,ELIMINADO,CREATEDAT,UPDATEDAT,MONTO,NOMBRE_SUCURSAL,FECHA\n" +
        "FROM SOLICITUD_REPOSICION\n" +
        "WHERE ACTIVO = "+true+" AND ELIMINADO = "+false+" AND USUARIO = "+this.id_usuario;
        try {
            rs = db.seleccionar(consulta);
            while(rs.next()){
                
                id = rs.getInt(1);
                almacen = rs.getInt(2);
                usuario = rs.getInt(3);
                activo = rs.getBoolean(4);
                eliminado = rs.getBoolean(5);
                createdat = rs.getDate(6);
                updatedat = rs.getDate(7);
                monto = rs.getDouble(8);
                sucursal = rs.getString(9);
                fecha = rs.getTimestamp(10);
                
                solicitudReposicion lista = new solicitudReposicion(id, almacen, usuario, fecha, activo, eliminado, createdat, updatedat, monto, sucursal);
                ArraySolicitud.add(lista);
                              
            }                   
        } catch (Exception e) {
            System.out.println("Error al seleccionar los productos "+e);
        }       
 
        for (int i = 0; i < ArraySolicitud.size(); i++) {
            id = ArraySolicitud.get(i).getId();
            almacen = ArraySolicitud.get(i).getAlmacen();
            usuario = ArraySolicitud.get(i).getUsuario();
            fecha = (Timestamp) ArraySolicitud.get(i).getFecha();
            activo = ArraySolicitud.get(i).isActivo();
            eliminado = ArraySolicitud.get(i).isEliminado();
            createdat = ArraySolicitud.get(i).getCreatedAt();
            updatedat = ArraySolicitud.get(i).getUpdatedAt();
            monto = ArraySolicitud.get(i).getMonto();
            sucursal = ArraySolicitud.get(i).getNombreSucursal();
            
            
            Object[] dato = {id,almacen,usuario,activo,eliminado,createdat,updatedat,monto,sucursal,fecha};            
            modeloTabla.addRow(dato);                     
        }
         jtDatos.setModel(modeloTabla);  
    }
    
    public void obtenerDatosDetalleProducto(){
        
        ResultSet rs = null;
        int id = 0;
        int solicitud = 0;
        int producto = 0;
        double cantidad = 0;
        Date createdat = null;
        Date updatedat = null;
        
        String consulta = "SELECT ID,SOLICITUD,PRODUCTO,CANTIDAD,CREATEDAT,UPDATEDAT \n" +
            "FROM DETALLE_SOLICITUD_PRODUCTO";
        try {
            rs = db.seleccionar(consulta);
            while (rs.next()) {    
                id = rs.getInt(1);
                solicitud = rs.getInt(2);
                producto = rs.getInt(3);
                cantidad = rs.getDouble(4);
                createdat = rs.getDate(5);
                updatedat = rs.getDate(6);
                
                detalleSolicitudProducto lista = new detalleSolicitudProducto(id,solicitud, producto, cantidad, createdat, updatedat);
                solicitudProducto.add(lista);
            }
        } catch (Exception e) {
            System.out.println("Error al obtener el detalle de la solicitud de productos: "+e);
        }finally{
            try {
                rs.close();
                db.Conectar().close();
            } catch (SQLException ex) {
                Logger.getLogger(vistaExportarUI.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
        
        for (int i = 0; i < ArraySolicitud.size(); i++) {
            int idSolicitud = ArraySolicitud.get(i).getId();
            
            for (int j = 0; j < solicitudProducto.size(); j++) {
                int idComparar = solicitudProducto.get(j).getSolicitud();
                if (idSolicitud == idComparar) {
                    id = solicitudProducto.get(j).getId();
                    solicitud = solicitudProducto.get(j).getSolicitud();
                    producto = solicitudProducto.get(j).getProducto();
                    cantidad = solicitudProducto.get(j).getCantidad();
                    createdat = solicitudProducto.get(j).getCreatedAt();
                    updatedat = solicitudProducto.get(j).getUpdatedAt();

                    Object[] dato = {id,solicitud,producto,cantidad,createdat,updatedat};
                    modeloTablaProducto.addRow(dato);
                }/*else{                          
                    id = solicitudProducto.get(j).getId();
                    solicitud = solicitudProducto.get(j).getSolicitud();
                    producto = solicitudProducto.get(j).getProducto();
                    cantidad = solicitudProducto.get(j).getCantidad();
                    createdat = solicitudProducto.get(j).getCreatedAt();
                    updatedat = solicitudProducto.get(j).getUpdatedAt();

                    Object[] dato = {id,solicitud,producto,cantidad,createdat,updatedat};
                    modeloTablaProducto.addRow(dato);
                    
                    solicitudProducto.remove(j);                  
                }*/
            }
            jDatosProducto.setModel(modeloTablaProducto);
        }

    }
    
    public void obtenerDatosDetalleProductoBase(){
        ArrayList<detalleSolicitudProductoBase> detalleSolicitudProductoBase = new ArrayList();
        ResultSet rs = null;
        int id = 0;
        int detalleSoliProdBase = 0;
        int producto_base = 0;
        double cantidad_ideal = 0;
        double cantidad_real = 0;
        Date createdat = null;
        Date updateat = null;
        double total = 0;
        
        String consulta = "SELECT ID,DETALLE_SOLICITUD_PRODUCTO,PRODUCTO_BASE,CANTIDAD_IDEAL,CANTIDAD_REAL,CREATEDAT,UPDATEDAT,TOTAL\n" +
        "FROM DETALLE_SOLICITUD_PRODUCTO_BASE";
        try {
           rs = db.seleccionar(consulta);
            while (rs.next()) {                
                id = rs.getInt(1);
                detalleSoliProdBase = rs.getInt(2);
                producto_base = rs.getInt(3);
                cantidad_ideal = rs.getDouble(4);
                cantidad_real = rs.getDouble(5);
                createdat = rs.getDate(6);
                updateat = rs.getDate(7);
                total = rs.getDouble(8);
                
                detalleSolicitudProductoBase lista = new detalleSolicitudProductoBase(id, detalleSoliProdBase, producto_base, cantidad_ideal, cantidad_real, createdat, updateat, total);
                detalleSolicitudProductoBase.add(lista);
                
            }
        } catch (Exception e) {
            System.out.println("Error al mostrar el detalle del producto base "+e);
        }
        
        for (int i = 0; i < jDatosProductoB.getRowCount(); i++) {
            modeloTablaProductoBase.removeRow(i);
        }
        for (int i = 0; i < solicitudProducto.size(); i++) {
            int idSolicitudProducto = solicitudProducto.get(i).getId();
            for (int j = 0; j < detalleSolicitudProductoBase.size(); j++) {
                int idSoli = detalleSolicitudProductoBase.get(j).getDetalle_solicitud_producto();
                int idPrdBa = detalleSolicitudProductoBase.get(j).getProducto_base();
                if ((idSolicitudProducto == idSoli) && (idPrdBa > 0)) {
                    id = detalleSolicitudProductoBase.get(j).getId();
                    detalleSoliProdBase = detalleSolicitudProductoBase.get(j).getDetalle_solicitud_producto();
                    producto_base = detalleSolicitudProductoBase.get(j).getProducto_base();
                    cantidad_ideal = detalleSolicitudProductoBase.get(j).getCantidad_ideal();
                    cantidad_real = detalleSolicitudProductoBase.get(j).getCantidad_real();
                    createdat = detalleSolicitudProductoBase.get(j).getCreatedat();
                    updateat = detalleSolicitudProductoBase.get(j).getUpdatedat();
                    total = detalleSolicitudProductoBase.get(j).getTotal();

                    Object[] datos = {id,detalleSoliProdBase,producto_base,cantidad_ideal,cantidad_real,createdat,updateat,total};
                    modeloTablaProductoBase.addRow(datos);
                }
                
            }
            jDatosProductoB.setModel(modeloTablaProductoBase);
        }
        
        
    }
    
    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        jScrollPane1 = new javax.swing.JScrollPane();
        jtDatos = new javax.swing.JTable();
        btnExportar = new javax.swing.JButton();
        jLabel2 = new javax.swing.JLabel();
        jLabel3 = new javax.swing.JLabel();
        jButton1 = new javax.swing.JButton();
        jScrollPane2 = new javax.swing.JScrollPane();
        jDatosProducto = new javax.swing.JTable();
        jLabel1 = new javax.swing.JLabel();
        jLabel4 = new javax.swing.JLabel();
        jScrollPane3 = new javax.swing.JScrollPane();
        jDatosProductoB = new javax.swing.JTable();
        jLabel5 = new javax.swing.JLabel();

        setDefaultCloseOperation(javax.swing.WindowConstants.DISPOSE_ON_CLOSE);

        jtDatos.setModel(new javax.swing.table.DefaultTableModel(
            new Object [][] {

            },
            new String [] {
                "Id", "Almacen", "Usuario", "Activo", "Eliminado", "Creado", "Actualizado", "Monto", "Sucursal", "Fecha"
            }
        ) {
            boolean[] canEdit = new boolean [] {
                true, false, false, false, false, false, false, true, false, false
            };

            public boolean isCellEditable(int rowIndex, int columnIndex) {
                return canEdit [columnIndex];
            }
        });
        jtDatos.setFillsViewportHeight(true);
        jScrollPane1.setViewportView(jtDatos);
        if (jtDatos.getColumnModel().getColumnCount() > 0) {
            jtDatos.getColumnModel().getColumn(1).setResizable(false);
            jtDatos.getColumnModel().getColumn(2).setResizable(false);
            jtDatos.getColumnModel().getColumn(3).setResizable(false);
            jtDatos.getColumnModel().getColumn(4).setResizable(false);
            jtDatos.getColumnModel().getColumn(5).setResizable(false);
            jtDatos.getColumnModel().getColumn(6).setResizable(false);
            jtDatos.getColumnModel().getColumn(8).setResizable(false);
            jtDatos.getColumnModel().getColumn(9).setResizable(false);
        }

        btnExportar.setBackground(new java.awt.Color(0, 102, 0));
        btnExportar.setFont(new java.awt.Font("Tahoma", 1, 11)); // NOI18N
        btnExportar.setText("Exportar");
        btnExportar.setBorder(javax.swing.BorderFactory.createLineBorder(new java.awt.Color(0, 153, 0)));
        btnExportar.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                btnExportarActionPerformed(evt);
            }
        });

        jLabel2.setFont(new java.awt.Font("Tahoma", 1, 12)); // NOI18N
        jLabel2.setForeground(new java.awt.Color(0, 102, 0));
        jLabel2.setText(" EXPORTACIÓN ");

        jLabel3.setIcon(new javax.swing.ImageIcon(getClass().getResource("/imagen/xls.png"))); // NOI18N

        jButton1.setBackground(new java.awt.Color(183, 70, 53));
        jButton1.setText("Cancelar");
        jButton1.setBorder(javax.swing.BorderFactory.createLineBorder(new java.awt.Color(209, 91, 71)));
        jButton1.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jButton1ActionPerformed(evt);
            }
        });

        jDatosProducto.setModel(new javax.swing.table.DefaultTableModel(
            new Object [][] {

            },
            new String [] {
                "Id", "Solicitud", "Producto", "Cantidad", "Creado", "Actualizado"
            }
        ));
        jDatosProducto.setFillsViewportHeight(true);
        jScrollPane2.setViewportView(jDatosProducto);

        jLabel1.setFont(new java.awt.Font("Arial", 1, 14)); // NOI18N
        jLabel1.setForeground(new java.awt.Color(51, 51, 255));
        jLabel1.setText("Tabla Solicitudes");

        jLabel4.setFont(new java.awt.Font("Arial", 1, 14)); // NOI18N
        jLabel4.setForeground(new java.awt.Color(51, 51, 255));
        jLabel4.setText("Tabla Detalle del Producto");

        jDatosProductoB.setModel(new javax.swing.table.DefaultTableModel(
            new Object [][] {

            },
            new String [] {
                "Id", "<html>Detalle Solicitud<br>Producto</html>", "<html>Producto<br>Base</html>", "<html>Cantidad<br>Ideal</html>", "<html>Cantidad<br>Real</html>", "Craedo", "Actualizado", "Total"
            }
        ));
        jDatosProductoB.setFillsViewportHeight(true);
        jScrollPane3.setViewportView(jDatosProductoB);

        jLabel5.setFont(new java.awt.Font("Arial", 1, 14)); // NOI18N
        jLabel5.setForeground(new java.awt.Color(51, 51, 255));
        jLabel5.setText("Tabla Detalle del Producto Base");

        javax.swing.GroupLayout layout = new javax.swing.GroupLayout(getContentPane());
        getContentPane().setLayout(layout);
        layout.setHorizontalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, layout.createSequentialGroup()
                .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING)
                    .addComponent(jScrollPane2, javax.swing.GroupLayout.Alignment.LEADING, javax.swing.GroupLayout.DEFAULT_SIZE, 999, Short.MAX_VALUE)
                    .addComponent(jScrollPane1)
                    .addComponent(jScrollPane3, javax.swing.GroupLayout.Alignment.LEADING, javax.swing.GroupLayout.DEFAULT_SIZE, 999, Short.MAX_VALUE))
                .addContainerGap())
            .addGroup(layout.createSequentialGroup()
                .addContainerGap()
                .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(layout.createSequentialGroup()
                        .addComponent(jLabel1)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                        .addComponent(jLabel3, javax.swing.GroupLayout.PREFERRED_SIZE, 32, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                        .addComponent(jLabel2)
                        .addGap(75, 75, 75))
                    .addGroup(layout.createSequentialGroup()
                        .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(jLabel4)
                            .addComponent(jLabel5))
                        .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))))
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, layout.createSequentialGroup()
                .addGap(0, 0, Short.MAX_VALUE)
                .addComponent(btnExportar, javax.swing.GroupLayout.PREFERRED_SIZE, 74, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(116, 116, 116)
                .addComponent(jButton1, javax.swing.GroupLayout.PREFERRED_SIZE, 75, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(53, 53, 53))
        );
        layout.setVerticalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(layout.createSequentialGroup()
                .addContainerGap()
                .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(jLabel3, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                    .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, layout.createSequentialGroup()
                        .addGap(0, 0, Short.MAX_VALUE)
                        .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(jLabel2, javax.swing.GroupLayout.Alignment.TRAILING)
                            .addComponent(jLabel1, javax.swing.GroupLayout.Alignment.TRAILING))))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jScrollPane1, javax.swing.GroupLayout.PREFERRED_SIZE, 135, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(18, 18, 18)
                .addComponent(jLabel4)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jScrollPane2, javax.swing.GroupLayout.PREFERRED_SIZE, 141, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(18, 18, 18)
                .addComponent(jLabel5)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jScrollPane3, javax.swing.GroupLayout.PREFERRED_SIZE, 141, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(18, 18, 18)
                .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(btnExportar, javax.swing.GroupLayout.PREFERRED_SIZE, 34, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(jButton1, javax.swing.GroupLayout.PREFERRED_SIZE, 34, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addGap(19, 19, 19))
        );

        pack();
    }// </editor-fold>//GEN-END:initComponents

    private void btnExportarActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_btnExportarActionPerformed
        // TODO add your handling code here:
        if (jtDatos.getRowCount()==0 && jDatosProducto.getRowCount()== 0 && jDatosProductoB.getRowCount()== 0) {
            JOptionPane.showMessageDialog (null, "No hay datos en la tabla para exportar.","BCO",
                JOptionPane.INFORMATION_MESSAGE);
           // this.cmbConsorcio.grabFocus();
            return;
        }
        JFileChooser chooser=new JFileChooser();
        FileNameExtensionFilter filter=new FileNameExtensionFilter("Archivos de excel","xls");
        chooser.setFileFilter(filter);
        chooser.setDialogTitle("Guardar archivo");
        chooser.setMultiSelectionEnabled(false);
        chooser.setAcceptAllFileFilterUsed(false);
        if (chooser.showSaveDialog(null)==JFileChooser.APPROVE_OPTION){
            List<JTable> tb=new ArrayList<>();
            List<String>nom=new ArrayList<>();
            tb.add(jtDatos);
            nom.add("Solicitudes");
            String file=chooser.getSelectedFile().toString().concat(".xls");
            try {
                Exportar e = new Exportar(new File(file),tb, nom);
                if (e.export()) {
                    JOptionPane.showMessageDialog(null, "Los datos fueron exportados a excel.","BCO",
                        JOptionPane.INFORMATION_MESSAGE);

                }
            } catch (Exception ex) {
                JOptionPane.showMessageDialog(null,"Hubo un error"+ex.getMessage(),"Error",JOptionPane.ERROR_MESSAGE);
            }
        }
       /* try {
            Thread.sleep(4000);
        } catch (InterruptedException ex) {
            System.out.println("No paro 4 seg: "+ex);
        }*/
        JFileChooser chooserP=new JFileChooser();
        FileNameExtensionFilter filterP=new FileNameExtensionFilter("Archivos de excel","xls");
        chooserP.setFileFilter(filterP);
        chooserP.setDialogTitle("Guardar archivo");
        chooserP.setMultiSelectionEnabled(false);
        chooserP.setAcceptAllFileFilterUsed(false);
        if (chooserP.showSaveDialog(null)==JFileChooser.APPROVE_OPTION){
            List<JTable> tbP=new ArrayList<>();
            List<String>nomP=new ArrayList<>();
            tbP.add(jDatosProducto);
            nomP.add("Detalle de Productos");
            String file=chooserP.getSelectedFile().toString().concat(".xls");
            try {
                Exportar p = new Exportar(new File(file),tbP, nomP);
                if (p.export()) {
                    JOptionPane.showMessageDialog(null, "Los datos fueron exportados a excel.","BCO",
                        JOptionPane.INFORMATION_MESSAGE);

                }
            } catch (Exception ex) {
                JOptionPane.showMessageDialog(null,"Hubo un error"+ex.getMessage(),"Error",JOptionPane.ERROR_MESSAGE);
            }
        }
        
        JFileChooser chooserPb=new JFileChooser();
        FileNameExtensionFilter filterPb=new FileNameExtensionFilter("Archivos de excel","xls");
        chooserPb.setFileFilter(filterPb);
        chooserPb.setDialogTitle("Guardar archivo");
        chooserPb.setMultiSelectionEnabled(false);
        chooserPb.setAcceptAllFileFilterUsed(false);
        if (chooserPb.showSaveDialog(null)==JFileChooser.APPROVE_OPTION){
            List<JTable> tbPb=new ArrayList<>();
            List<String>nomPb=new ArrayList<>();
            tbPb.add(jDatosProductoB);
            nomPb.add("Detalle de Producto Base");
            String file=chooserPb.getSelectedFile().toString().concat(".xls");
            try {
                Exportar p = new Exportar(new File(file),tbPb, nomPb);
                if (p.export()) {
                    JOptionPane.showMessageDialog(null, "Los datos fueron exportados a excel.","BCO",
                        JOptionPane.INFORMATION_MESSAGE);

                }
            } catch (Exception ex) {
                JOptionPane.showMessageDialog(null,"Hubo un error"+ex.getMessage(),"Error",JOptionPane.ERROR_MESSAGE);
            }
        }
    }//GEN-LAST:event_btnExportarActionPerformed

    private void jButton1ActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jButton1ActionPerformed
        dispose();
    }//GEN-LAST:event_jButton1ActionPerformed

    /**
     * @param args the command line arguments
     */
   

    // Variables declaration - do not modify//GEN-BEGIN:variables
    public javax.swing.JButton btnExportar;
    private javax.swing.JButton jButton1;
    public javax.swing.JTable jDatosProducto;
    public javax.swing.JTable jDatosProductoB;
    private javax.swing.JLabel jLabel1;
    private javax.swing.JLabel jLabel2;
    private javax.swing.JLabel jLabel3;
    private javax.swing.JLabel jLabel4;
    private javax.swing.JLabel jLabel5;
    private javax.swing.JScrollPane jScrollPane1;
    private javax.swing.JScrollPane jScrollPane2;
    private javax.swing.JScrollPane jScrollPane3;
    public javax.swing.JTable jtDatos;
    // End of variables declaration//GEN-END:variables
}
