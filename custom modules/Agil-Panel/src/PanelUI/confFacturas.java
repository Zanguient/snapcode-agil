/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package PanelUI;

import java.awt.Color;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.swing.Icon;
import javax.swing.ImageIcon;
import javax.swing.JButton;
import javax.swing.JLabel;
import javax.swing.JTable;
import javax.swing.SwingConstants;
import javax.swing.table.DefaultTableCellRenderer;
import javax.swing.table.DefaultTableModel;
import javax.swing.table.TableCellRenderer;
import models.Database;
import models.RenderTable;

/**
 *
 * @author AGIL
 */
public class confFacturas extends javax.swing.JFrame {
    public Database db = new Database();
    public int id_usuario;
    
    public JButton editar;
    public ImageIcon imgEditar;
    public Icon iconEditar;
    
    public JButton NoEditar;
    public ImageIcon imgNoEditar;
    public Icon iconNoEditar;
    
    public DefaultTableModel modelFactTabla;
    public DefaultTableModel modelFactSucTabla;
    
    public boolean modificar;
    /**
     * Creates new form confFacturas
     */
   
    
    public confFacturas(boolean modificar,int id_usuario) {
        initComponents();
        this.id_usuario = id_usuario;
        this.modificar = modificar;
        setTitle("Facturas");
        setLocationRelativeTo(this);
               
        String[] columnas = {"Impresión","Tipo","<html>Tamaño<br>Papel</html>","Título","Subtítulo","<html>Uso General<br>Activo?<htlml>","Editar"};
        modelFactTabla = (DefaultTableModel) tablaFactura.getModel();//new DefaultTableModel(null, columnas);
        tablaFactura.setDefaultRenderer(Object.class, new RenderTable());
        
        tablaFactura.getTableHeader().setPreferredSize(new java.awt.Dimension(0, 33)); 
        tablaFactura.getTableHeader().setBackground(Color.cyan);
        tablaFactura.getTableHeader().setForeground(Color.blue);
        
        //
        modelFactSucTabla = (DefaultTableModel) tablaFacturaSucursal.getModel();//new DefaultTableModel(null, columnas);
        tablaFacturaSucursal.setDefaultRenderer(Object.class, new RenderTable());
        
        tablaFacturaSucursal.getTableHeader().setPreferredSize(new java.awt.Dimension(0, 33)); 
        tablaFacturaSucursal.getTableHeader().setBackground(Color.cyan);
        tablaFacturaSucursal.getTableHeader().setForeground(Color.blue);
        
        insertarBotones();
        centrar_datos();
        alinearTextoTabla();        
        
        configuracionGeneralFactura();
        configuracionSucursalFactura();
        
    }
    
    public void centrar_datos(){  
        DefaultTableCellRenderer modelocentrar = new DefaultTableCellRenderer(); 
        modelocentrar.setHorizontalAlignment(SwingConstants.CENTER); 
        tablaFactura.getColumnModel().getColumn(0).setCellRenderer(modelocentrar); 
        tablaFactura.getColumnModel().getColumn(1).setCellRenderer(modelocentrar);
        tablaFactura.getColumnModel().getColumn(2).setCellRenderer(modelocentrar);
        tablaFactura.getColumnModel().getColumn(3).setCellRenderer(modelocentrar);
        tablaFactura.getColumnModel().getColumn(4).setCellRenderer(modelocentrar);
        tablaFactura.getColumnModel().getColumn(5).setCellRenderer(modelocentrar);  
        
        tablaFacturaSucursal.getColumnModel().getColumn(0).setCellRenderer(modelocentrar); 
        tablaFacturaSucursal.getColumnModel().getColumn(1).setCellRenderer(modelocentrar);
        tablaFacturaSucursal.getColumnModel().getColumn(2).setCellRenderer(modelocentrar);
        tablaFacturaSucursal.getColumnModel().getColumn(3).setCellRenderer(modelocentrar);
        tablaFacturaSucursal.getColumnModel().getColumn(4).setCellRenderer(modelocentrar);
        tablaFacturaSucursal.getColumnModel().getColumn(5).setCellRenderer(modelocentrar);
        tablaFacturaSucursal.getColumnModel().getColumn(6).setCellRenderer(modelocentrar);
        
    } 
     
    public void alinearTextoTabla(){
        TableCellRenderer rendererFromHeader = tablaFactura.getTableHeader().getDefaultRenderer();
        JLabel headerLabel = (JLabel) rendererFromHeader;
        headerLabel.setHorizontalAlignment(JLabel.CENTER);
        
        TableCellRenderer rendererFromHeaderTablaSucursal = tablaFacturaSucursal.getTableHeader().getDefaultRenderer();
        JLabel headerLabelSucursal = (JLabel) rendererFromHeaderTablaSucursal;
        headerLabelSucursal.setHorizontalAlignment(JLabel.CENTER);
    }
    
    public void insertarBotones(){
        tablaFactura.setDefaultRenderer(Object.class, new RenderTable());
        
        String imgEdit = "/imagen/editar.png";
        imgEditar = new ImageIcon(this.getClass().getResource(imgEdit));
        iconEditar = new ImageIcon(imgEditar.getImage().getScaledInstance(20, 20, 1));
        editar = new JButton(iconEditar);
        editar.setName("editar");
              
        String imgNoEdit = "/imagen/noeditar.png";
        imgNoEditar = new ImageIcon(this.getClass().getResource(imgNoEdit));
        iconNoEditar = new ImageIcon(imgNoEditar.getImage().getScaledInstance(20, 20, 1));
        NoEditar = new JButton(iconNoEditar);
        NoEditar.setName("NoEditar");
       
        tablaFactura.setRowHeight(33);
        tablaFacturaSucursal.setRowHeight(33);
    }
     
    public int obtenerIdEmpreasa(){
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
                ex.printStackTrace();
            }
        }
        return id;
    }
    
    public void configuracionGeneralFactura(){
        ResultSet rs = null;
        int idEmpresa = obtenerIdEmpreasa();
        String consulta = "SELECT CGF.ID,IMP.NOMBRE,TIP.NOMBRE,TAM.NOMBRE,TIT.NOMBRE,SUBTIT.NOMBRE,CGF.USAR\n" +
            "FROM CONFIGURACION_GENERAL_FACTURA AS CGF\n" +
            "LEFT JOIN CLASE AS IMP ON IMP.ID = CGF.IMPRESION_FACTURA\n" +
            "LEFT JOIN CLASE AS TIP ON TIP.ID = CGF.TIPO_FACTURA\n" +
            "LEFT JOIN CLASE AS TAM ON TAM.ID = CGF.TAMANO_PAPEL_FACTURA\n" +
            "LEFT JOIN CLASE AS TIT ON TIT.ID = CGF.TITULO_FACTURA\n" +
            "LEFT JOIN CLASE AS SUBTIT ON SUBTIT.ID = CGF.SUBTITULO_FACTURA\n" +
            "WHERE CGF.EMPRESA = "+idEmpresa;
        try {
            rs = db.seleccionar(consulta);
            while (rs.next()) {     
                int id = rs.getInt(1);
                String impresion = rs.getString(2);
                String tipo = rs.getString(3);
                String tamaño = rs.getString(4);
                String titulo = rs.getString(5);
                String SubTitu = rs.getString(6);
                boolean usar = rs.getBoolean(7);
                
                if (this.modificar == true) {
                    if (usar == true) {
                        Object[] datos = {id,impresion,tipo,tamaño,titulo,SubTitu,"<html><span style='color:GREEN; '>Si</span></html>",editar};
                        modelFactTabla.addRow(datos);
                    }else{
                        Object[] datos = {id,impresion,tipo,tamaño,titulo,SubTitu,"<html><span style='color:RED; '>No</span></html>",editar};
                        modelFactTabla.addRow(datos);
                    }    
                }else{
                    if (usar == true) {
                        Object[] datos = {id,impresion,tipo,tamaño,titulo,SubTitu,"<html><span style='color:GREEN; '>Si</span></html>",NoEditar};
                        modelFactTabla.addRow(datos);
                    }else{
                        Object[] datos = {id,impresion,tipo,tamaño,titulo,SubTitu,"<html><span style='color:RED; '>No</span></html>",NoEditar};
                        modelFactTabla.addRow(datos);
                    }    
                }      
            }
            tablaFactura.setModel(modelFactTabla);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    public void configuracionSucursalFactura(){
        ResultSet rs = null;
        int num = 1;
        int idEmpresa = obtenerIdEmpreasa();
        String consulta = "SELECT CF.ID, S.NOMBRE, IMP.NOMBRE,TIP.NOMBRE,TAM.NOMBRE,TIT.NOMBRE,SUBTIT.NOMBRE \n" +
            "FROM SUCURSAL AS S \n" +
            "INNER JOIN CONFIGURACION_FACTURA AS CF ON S.ID = CF.SUCURSAL\n" +
            "LEFT JOIN CLASE AS IMP ON IMP.ID = CF.IMPRESION_FACTURA\n" +
            "LEFT JOIN CLASE AS TIP ON TIP.ID = CF.TIPO_FACTURACION\n" +
            "LEFT JOIN CLASE AS TAM ON TAM.ID = CF.TAMANO_PAPEL_FACTURA\n" +
            "LEFT JOIN CLASE AS TIT ON TIT.ID = CF.TITULO_FACTURA\n" +
            "LEFT JOIN CLASE AS SUBTIT ON SUBTIT.ID = CF.SUBTITULO_FACTURA\n" +
            "WHERE S.EMPRESA = "+idEmpresa+" AND S.ELIMINADO = "+false;
        try {
            rs = db.seleccionar(consulta);
            while (rs.next()) {                
                int id = rs.getInt(1);
                String sucursal = rs.getString(2);
                String impresion = rs.getString(3);
                String tipo = rs.getString(4);
                String tamaño = rs.getString(5);
                String titulo = rs.getString(6);
                String SubTitu = rs.getString(7);
                
                Object[] datos = {id,num,sucursal,impresion,tipo,tamaño,titulo,SubTitu,editar};
                num++;
                modelFactSucTabla.addRow(datos);
            }
            tablaFacturaSucursal.setModel(modelFactSucTabla);
            
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
    
    /**
     * This method is called from within the constructor to initialize the form.
     * WARNING: Do NOT modify this code. The content of this method is always
     * regenerated by the Form Editor.
     */
    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        jScrollPane1 = new javax.swing.JScrollPane();
        jPanel1 = new javax.swing.JPanel();
        jLabel1 = new javax.swing.JLabel();
        jPanel2 = new javax.swing.JPanel();
        jLabel2 = new javax.swing.JLabel();
        jScrollPane2 = new javax.swing.JScrollPane();
        tablaFactura = new JTable(){
            public boolean isCellEditable(int rowIndex, int colIndex) {
                return colIndex != 0 && colIndex != 1 && colIndex != 2 && colIndex != 3 
                && colIndex != 4 && colIndex != 5 && colIndex != 6;
            }
        };
        jButton1 = new javax.swing.JButton();
        jPanel3 = new javax.swing.JPanel();
        jLabel3 = new javax.swing.JLabel();
        jScrollPane3 = new javax.swing.JScrollPane();
        tablaFacturaSucursal = new JTable(){
            public boolean isCellEditable(int rowIndex, int colIndex) {
                return colIndex != 0 && colIndex != 1 && colIndex != 2 && colIndex != 3 
                && colIndex != 4 && colIndex != 5 && colIndex != 6;
            }
        };

        setDefaultCloseOperation(javax.swing.WindowConstants.DISPOSE_ON_CLOSE);

        jScrollPane1.setHorizontalScrollBar(null);

        jPanel1.setBackground(new java.awt.Color(255, 255, 255));

        jLabel1.setFont(new java.awt.Font("Arial", 1, 14)); // NOI18N
        jLabel1.setForeground(new java.awt.Color(48, 126, 204));
        jLabel1.setText("CONFIGURACIÓN DE FACTURAS");

        jPanel2.setBackground(new java.awt.Color(48, 126, 204));

        jLabel2.setFont(new java.awt.Font("Arial", 1, 12)); // NOI18N
        jLabel2.setForeground(new java.awt.Color(255, 255, 255));
        jLabel2.setText("Configuración general de facturas");

        javax.swing.GroupLayout jPanel2Layout = new javax.swing.GroupLayout(jPanel2);
        jPanel2.setLayout(jPanel2Layout);
        jPanel2Layout.setHorizontalGroup(
            jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel2Layout.createSequentialGroup()
                .addContainerGap()
                .addComponent(jLabel2)
                .addContainerGap(555, Short.MAX_VALUE))
        );
        jPanel2Layout.setVerticalGroup(
            jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel2Layout.createSequentialGroup()
                .addContainerGap()
                .addComponent(jLabel2)
                .addContainerGap(19, Short.MAX_VALUE))
        );

        tablaFactura.setModel(new javax.swing.table.DefaultTableModel(
            new Object [][] {

            },
            new String [] {
                "Id", "Impresión", "Tipo", "<html>Tamaño<br>Página</html>", "Título", "SubTítulo", "Uso General?", "Editar"
            }
        ));
        tablaFactura.addMouseListener(new java.awt.event.MouseAdapter() {
            public void mouseClicked(java.awt.event.MouseEvent evt) {
                tablaFacturaMouseClicked(evt);
            }
        });
        jScrollPane2.setViewportView(tablaFactura);
        if (tablaFactura.getColumnModel().getColumnCount() > 0) {
            tablaFactura.getColumnModel().getColumn(0).setMinWidth(0);
            tablaFactura.getColumnModel().getColumn(0).setPreferredWidth(0);
            tablaFactura.getColumnModel().getColumn(0).setMaxWidth(0);
            tablaFactura.getColumnModel().getColumn(5).setMinWidth(200);
            tablaFactura.getColumnModel().getColumn(5).setPreferredWidth(200);
            tablaFactura.getColumnModel().getColumn(5).setMaxWidth(200);
            tablaFactura.getColumnModel().getColumn(7).setMinWidth(60);
            tablaFactura.getColumnModel().getColumn(7).setPreferredWidth(60);
            tablaFactura.getColumnModel().getColumn(7).setMaxWidth(60);
        }

        jButton1.setBackground(new java.awt.Color(48, 126, 204));
        jButton1.setForeground(new java.awt.Color(255, 255, 255));
        jButton1.setIcon(new javax.swing.ImageIcon(getClass().getResource("/imagen/boton-actualizar.png"))); // NOI18N
        jButton1.setText("Actuaizar");
        jButton1.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jButton1ActionPerformed(evt);
            }
        });

        jPanel3.setBackground(new java.awt.Color(48, 126, 204));

        jLabel3.setFont(new java.awt.Font("Arial", 1, 12)); // NOI18N
        jLabel3.setForeground(new java.awt.Color(255, 255, 255));
        jLabel3.setText("Lista de configuraciones por facturas  por sucursal");

        javax.swing.GroupLayout jPanel3Layout = new javax.swing.GroupLayout(jPanel3);
        jPanel3.setLayout(jPanel3Layout);
        jPanel3Layout.setHorizontalGroup(
            jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel3Layout.createSequentialGroup()
                .addContainerGap()
                .addComponent(jLabel3)
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );
        jPanel3Layout.setVerticalGroup(
            jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel3Layout.createSequentialGroup()
                .addContainerGap()
                .addComponent(jLabel3)
                .addContainerGap(17, Short.MAX_VALUE))
        );

        tablaFacturaSucursal.setModel(new javax.swing.table.DefaultTableModel(
            new Object [][] {

            },
            new String [] {
                "Id", "#", "Sucursal", "Impresión", "Tipo", "<html>Tamaño<br>Página</html>", "Título", "SubTítulo", "Editar"
            }
        ));
        tablaFacturaSucursal.addMouseListener(new java.awt.event.MouseAdapter() {
            public void mouseClicked(java.awt.event.MouseEvent evt) {
                tablaFacturaSucursalMouseClicked(evt);
            }
        });
        jScrollPane3.setViewportView(tablaFacturaSucursal);
        if (tablaFacturaSucursal.getColumnModel().getColumnCount() > 0) {
            tablaFacturaSucursal.getColumnModel().getColumn(0).setMinWidth(0);
            tablaFacturaSucursal.getColumnModel().getColumn(0).setPreferredWidth(0);
            tablaFacturaSucursal.getColumnModel().getColumn(0).setMaxWidth(0);
            tablaFacturaSucursal.getColumnModel().getColumn(1).setMinWidth(30);
            tablaFacturaSucursal.getColumnModel().getColumn(1).setPreferredWidth(30);
            tablaFacturaSucursal.getColumnModel().getColumn(1).setMaxWidth(30);
            tablaFacturaSucursal.getColumnModel().getColumn(7).setMinWidth(200);
            tablaFacturaSucursal.getColumnModel().getColumn(7).setPreferredWidth(200);
            tablaFacturaSucursal.getColumnModel().getColumn(7).setMaxWidth(200);
            tablaFacturaSucursal.getColumnModel().getColumn(8).setMinWidth(60);
            tablaFacturaSucursal.getColumnModel().getColumn(8).setPreferredWidth(60);
            tablaFacturaSucursal.getColumnModel().getColumn(8).setMaxWidth(60);
        }

        javax.swing.GroupLayout jPanel1Layout = new javax.swing.GroupLayout(jPanel1);
        jPanel1.setLayout(jPanel1Layout);
        jPanel1Layout.setHorizontalGroup(
            jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel1Layout.createSequentialGroup()
                .addContainerGap()
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(jPanel1Layout.createSequentialGroup()
                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING, false)
                                .addComponent(jLabel1)
                                .addComponent(jPanel2, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                                .addComponent(jScrollPane2, javax.swing.GroupLayout.DEFAULT_SIZE, 758, Short.MAX_VALUE))
                            .addComponent(jButton1))
                        .addGap(0, 0, Short.MAX_VALUE))
                    .addComponent(jPanel3, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                    .addComponent(jScrollPane3, javax.swing.GroupLayout.Alignment.TRAILING, javax.swing.GroupLayout.DEFAULT_SIZE, 759, Short.MAX_VALUE))
                .addContainerGap())
        );
        jPanel1Layout.setVerticalGroup(
            jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel1Layout.createSequentialGroup()
                .addContainerGap()
                .addComponent(jLabel1)
                .addGap(18, 18, 18)
                .addComponent(jButton1, javax.swing.GroupLayout.PREFERRED_SIZE, 36, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addComponent(jPanel2, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jScrollPane2, javax.swing.GroupLayout.PREFERRED_SIZE, 73, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addComponent(jPanel3, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jScrollPane3, javax.swing.GroupLayout.PREFERRED_SIZE, 227, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addContainerGap(42, Short.MAX_VALUE))
        );

        jScrollPane1.setViewportView(jPanel1);

        javax.swing.GroupLayout layout = new javax.swing.GroupLayout(getContentPane());
        getContentPane().setLayout(layout);
        layout.setHorizontalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addComponent(jScrollPane1, javax.swing.GroupLayout.DEFAULT_SIZE, 790, Short.MAX_VALUE)
        );
        layout.setVerticalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addComponent(jScrollPane1, javax.swing.GroupLayout.DEFAULT_SIZE, 531, Short.MAX_VALUE)
        );

        pack();
    }// </editor-fold>//GEN-END:initComponents

    private void tablaFacturaMouseClicked(java.awt.event.MouseEvent evt) {//GEN-FIRST:event_tablaFacturaMouseClicked
        int columna = tablaFactura.getColumnModel().getColumnIndexAtX(evt.getX());
        int fila = evt.getY() / tablaFactura.getRowHeight();
        String idProducto;
        boolean existe = false;

        if (fila < tablaFactura.getRowCount() && fila >= 0 && columna < tablaFactura.getColumnCount() && columna >= 0) {
            Object value = tablaFactura.getValueAt(fila, columna);

            if (value instanceof JButton) {
                ((JButton) value).doClick();
                JButton botonAccion = (JButton) value;

                if (botonAccion.getName().equals("editar")) {
                    int idFactura = Integer.parseInt(String.valueOf(tablaFactura.getValueAt(fila, 0)));
                    //System.out.println(idFactura);
                    int tam = tablaFactura.getRowCount();
                    EditarConfGeneralFactura editarFactura = new EditarConfGeneralFactura(this, true, idFactura,tam);
                    editarFactura.setVisible(true);
                }
            }
        }
    }//GEN-LAST:event_tablaFacturaMouseClicked

    private void jButton1ActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jButton1ActionPerformed
        int tam = tablaFactura.getRowCount();
        for (int i = tam-1; i >= 0; i--) {
            modelFactTabla.removeRow(i);
        }
        configuracionGeneralFactura();
        
        int tam2 = tablaFacturaSucursal.getRowCount();
        for (int i = tam2-1; i >= 0; i--) {
            modelFactSucTabla.removeRow(i);
        }
        configuracionSucursalFactura();
    }//GEN-LAST:event_jButton1ActionPerformed

    private void tablaFacturaSucursalMouseClicked(java.awt.event.MouseEvent evt) {//GEN-FIRST:event_tablaFacturaSucursalMouseClicked
        int columna = tablaFacturaSucursal.getColumnModel().getColumnIndexAtX(evt.getX());
        int fila = evt.getY() / tablaFacturaSucursal.getRowHeight();
        String idProducto;
        boolean existe = false;

        if (fila < tablaFacturaSucursal.getRowCount() && fila >= 0 && columna < tablaFacturaSucursal.getColumnCount() && columna >= 0) {
            Object value = tablaFacturaSucursal.getValueAt(fila, columna);

            if (value instanceof JButton) {
                ((JButton) value).doClick();
                JButton botonAccion = (JButton) value;

                if (botonAccion.getName().equals("editar")) {
                    int idFactura = Integer.parseInt(String.valueOf(tablaFacturaSucursal.getValueAt(fila, 0)));
                    int tam = tablaFacturaSucursal.getRowCount();
                    EditarConfFactura editarFactura = new EditarConfFactura(this, true, idFactura);
                    editarFactura.setVisible(true);
                }
            }
        }
    }//GEN-LAST:event_tablaFacturaSucursalMouseClicked

    /**
     * @param args the command line arguments
     */


    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JButton jButton1;
    private javax.swing.JLabel jLabel1;
    private javax.swing.JLabel jLabel2;
    private javax.swing.JLabel jLabel3;
    private javax.swing.JPanel jPanel1;
    private javax.swing.JPanel jPanel2;
    private javax.swing.JPanel jPanel3;
    private javax.swing.JScrollPane jScrollPane1;
    private javax.swing.JScrollPane jScrollPane2;
    private javax.swing.JScrollPane jScrollPane3;
    public javax.swing.JTable tablaFactura;
    public javax.swing.JTable tablaFacturaSucursal;
    // End of variables declaration//GEN-END:variables
}
