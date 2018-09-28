/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package PanelUI;

import java.awt.event.KeyAdapter;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.awt.event.MouseEvent;
import java.math.BigDecimal;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.swing.Icon;
import javax.swing.ImageIcon;
import javax.swing.JButton;
import javax.swing.JLabel;
import javax.swing.JTable;
import javax.swing.RowFilter;
import javax.swing.table.DefaultTableModel;
import javax.swing.table.TableCellRenderer;
import javax.swing.table.TableRowSorter;
import modelo_Dosificacion.ListaDosificacion;
import models.Database;
import models.RenderTable;

/**
 *
 * @author AGIL
 */
public class Dosificaciones extends javax.swing.JFrame {
    public Database db = new Database();
    public DefaultTableModel modeloTabla;
    public TableRowSorter trs ;
    public int id_usuario;
    
    public JButton eliminar;
    public ImageIcon imgEliminar;
    public Icon iconEliminar;
      
    public JButton Noeliminar;
    public ImageIcon imgNoEliminar;
    public Icon iconNoEliminar;
    
    public JButton editar;
    public ImageIcon imgEditar;
    public Icon iconEditar;
    
    public JButton Noeditar;
    public ImageIcon imgNoEditar;
    public Icon iconNoEditar;
    
    public boolean nuevo;
    public boolean borrar;
    public boolean modificar;
    
    /**
     * Creates new form Dosificaciones
     */
    public Dosificaciones(boolean nuevo,boolean modificar,boolean borrar,int id_usuario) {
        initComponents();
        this.id_usuario = id_usuario;
        System.out.println(this.id_usuario);
        setLocationRelativeTo(this);
        this.setTitle("Dosificación");
        btnNuevo.setVisible(nuevo);
        this.borrar = borrar;
        this.modificar = modificar;
        String[] columnas = {"Id","Autorización","<html>Número<br>Correlativo<html>","Fecha Limite","Llave Digital","Frase Pié Pagina","<html>Sucursales<br>Asignadas</html>","Eliminar"};
        modeloTabla = new DefaultTableModel(null, columnas);
        
        alinearTextoTabla();
        
        tablaDosificaciones.setDefaultRenderer(Object.class, new RenderTable());
        tablaDosificaciones.getTableHeader().setPreferredSize(new java.awt.Dimension(0, 33));
        
        insertarBotones();
        obtenderDosificaciones();

    }
    
    public void alinearTextoTabla(){
        TableCellRenderer rendererFromHeader = tablaDosificaciones.getTableHeader().getDefaultRenderer();
        JLabel headerLabel = (JLabel) rendererFromHeader;
        headerLabel.setHorizontalAlignment(JLabel.CENTER);
    }
    
    public void obtenderDosificaciones(){
        ResultSet rs = null;
       
        int id = 0;
        int correlativo = 0;
        String fecha = "";
        String llaveDigital = "";
        String nombrePieFact = "";
        String sucursal = "";
        //SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        
        String consulta = "SELECT D.ID, D.AUTORIZACION,D.CORRELATIVO,D.FEHCA_LIMITE_EMISION,D.LLAVE_DIGITAL,C.NOMBRE\n" +
            "FROM USUARIO AS U\n" +
            "INNER JOIN DOSIFICACION AS D ON D.EMPRESA = U.EMPRESA\n" +
            "INNER JOIN CLASE AS C ON C.ID = D.PIE_FACTURA\n" +
            "WHERE U.ID = "+this.id_usuario+" AND U.ELIMINADO = "+false+" AND D.ELIMINADO = "+false;
        try {
            rs = db.seleccionar(consulta);
            while(rs.next()){
                id = rs.getInt(1);
                BigDecimal auten = rs.getBigDecimal(2);
                correlativo = rs.getInt(3);
                fecha = rs.getString(4);
                llaveDigital = rs.getString(5);
                nombrePieFact = rs.getString(6);
                
                String existe = "SELECT * \n" +
                    "FROM SUCURSAL_ACTIVIDAD_DOSIFICACION\n" +
                    "WHERE DOSIFICACION = "+id;
                
                String activo = "SELECT * FROM DOSIFICACION WHERE ID = "+id+" AND EXPIRADO = "+true;
                
                if (this.borrar == false) {
                    if (db.existeEldato(existe)) {
                        //verifica si no caduco la fecha limite
                        if (db.existeEldato(activo)) {
                            sucursal = obtenerNomSucursal(id);
                            Object[] dato = {id,auten,correlativo,fecha,llaveDigital,nombrePieFact,"<html>"+sucursal+"<br><span style='color:RED;'>EXPIRADO</span></html>",Noeliminar};
                            modeloTabla.addRow(dato);
                        }else{
                            sucursal = obtenerNomSucursal(id);
                            Object[] dato = {id,auten,correlativo,fecha,llaveDigital,nombrePieFact,"<html>"+sucursal+"<br><span style='color:GREEN;'>VIGENTE</span></html>",Noeliminar};
                            modeloTabla.addRow(dato);
                        }
                    }else{
                        Object[] dato = {id,auten,correlativo,fecha,llaveDigital,nombrePieFact,"<html>POR ASIGNAR</html>",Noeliminar};
                        modeloTabla.addRow(dato);
                    }
                }else if (this.borrar == false) {
                    if (db.existeEldato(existe)) {
                        //verifica si no caduco la fecha limite
                        if (db.existeEldato(activo)) {
                            sucursal = obtenerNomSucursal(id);
                            Object[] dato = {id,auten,correlativo,fecha,llaveDigital,nombrePieFact,"<html>"+sucursal+"<br><span style='color:RED;'>EXPIRADO</red></html>",Noeliminar};
                            modeloTabla.addRow(dato);
                        }else{
                            sucursal = obtenerNomSucursal(id);
                            Object[] dato = {id,auten,correlativo,fecha,llaveDigital,nombrePieFact,"<html>"+sucursal+"<br><span style='color:GREEN;'>VIGENTE</span></html>",Noeliminar};
                            modeloTabla.addRow(dato);
                        }
                    }else{
                        Object[] dato = {id,auten,correlativo,fecha,llaveDigital,nombrePieFact,"<html>POR ASIGNAR</html>",Noeliminar};
                        modeloTabla.addRow(dato);
                    }
                }else{
                    if (db.existeEldato(existe)) {
                        //verifica si no caduco la fecha limite
                        if (db.existeEldato(activo)) {
                            sucursal = obtenerNomSucursal(id);
                            Object[] dato = {id,auten,correlativo,fecha,llaveDigital,nombrePieFact,"<html>"+sucursal+"<br><span style='color:RED;'>EXPIRADO</span></html>",eliminar};
                            modeloTabla.addRow(dato);
                        }else{
                            sucursal = obtenerNomSucursal(id);
                            Object[] dato = {id,auten,correlativo,fecha,llaveDigital,nombrePieFact,"<html>"+sucursal+"<br><span style='color:GREEN;'>VIGENTE</span></html>",eliminar};
                            modeloTabla.addRow(dato);
                        }
                    }else{
                        Object[] dato = {id,auten,correlativo,fecha,llaveDigital,nombrePieFact,"<html>POR ASIGNAR</html>",eliminar};
                        modeloTabla.addRow(dato);
                    }
                }        
            }
            tablaDosificaciones.setModel(modeloTabla);
            tamañoTabla();
            
        } catch (Exception e) {
            System.out.println("Error "+e);
        }
    }
    
    public String obtenerNomSucursal(int id){
        String nombre="";
        ResultSet rs = null;
        String consulta = "SELECT S.NOMBRE\n" +
            "FROM SUCURSAL_ACTIVIDAD_DOSIFICACION AS SAD\n" +
            "INNER JOIN SUCURSAL AS S ON S.ID = SAD.SUCURSAL\n" +
            "WHERE DOSIFICACION = "+id;
        try {
            rs = db.seleccionar(consulta);
            while (rs.next()) {                
                nombre = rs.getString(1);
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
        return nombre;
    }
    
    public void limpiar(){
        int tam = tablaDosificaciones.getRowCount();
        for (int i = tam - 1; i >= 0; i--) {
            modeloTabla.removeRow(i);
        }
    }
    
    public void insertarBotones(){

        String imgElim = "/imagen/delete.png";
        imgEliminar = new ImageIcon(this.getClass().getResource(imgElim));
        iconEliminar = new ImageIcon(imgEliminar.getImage().getScaledInstance(20, 20, 1));
        eliminar = new JButton(iconEliminar);
        eliminar.setName("eliminar");
       
        
        String imgNoElim = "/imagen/delete.png";
        imgNoEliminar = new ImageIcon(this.getClass().getResource(imgNoElim));
        iconNoEliminar = new ImageIcon(imgNoEliminar.getImage().getScaledInstance(20, 20, 1));
        Noeliminar = new JButton(iconNoEliminar);
        Noeliminar.setName("Noeliminar");
        
        String imgEdit = "/imagen/editar.png";
        imgEditar = new ImageIcon(this.getClass().getResource(imgEdit));
        iconEditar = new ImageIcon(imgEditar.getImage().getScaledInstance(20, 20, 1));
        editar = new JButton(iconEditar);
        editar.setName("editar");
        
        String imgNoEdit = "/imagen/noeditar.png";
        imgNoEditar = new ImageIcon(this.getClass().getResource(imgNoEdit));
        iconNoEditar = new ImageIcon(imgNoEditar.getImage().getScaledInstance(20, 20, 1));
        Noeditar = new JButton(iconNoEditar);
        Noeditar.setName("NoEditar");
        
        tablaDosificaciones.setRowHeight(33);
    }
    
    public void tamañoTabla() {
        tablaDosificaciones.getColumnModel().getColumn(0).setMaxWidth(0);
        tablaDosificaciones.getColumnModel().getColumn(0).setMinWidth(0);
        tablaDosificaciones.getColumnModel().getColumn(0).setPreferredWidth(0);
        
        tablaDosificaciones.getColumnModel().getColumn(1).setMaxWidth(100);
        tablaDosificaciones.getColumnModel().getColumn(1).setMinWidth(100);
        tablaDosificaciones.getColumnModel().getColumn(1).setPreferredWidth(100);

        tablaDosificaciones.getColumnModel().getColumn(2).setMaxWidth(80);
        tablaDosificaciones.getColumnModel().getColumn(2).setMinWidth(80);
        tablaDosificaciones.getColumnModel().getColumn(2).setPreferredWidth(80);

        tablaDosificaciones.getColumnModel().getColumn(3).setMaxWidth(100);
        tablaDosificaciones.getColumnModel().getColumn(3).setMinWidth(100);
        tablaDosificaciones.getColumnModel().getColumn(3).setPreferredWidth(100);
        
        
        tablaDosificaciones.getColumnModel().getColumn(6).setMaxWidth(100);
        tablaDosificaciones.getColumnModel().getColumn(6).setMinWidth(100);
        tablaDosificaciones.getColumnModel().getColumn(6).setPreferredWidth(100);

        tablaDosificaciones.getColumnModel().getColumn(7).setMaxWidth(60);
        tablaDosificaciones.getColumnModel().getColumn(7).setMinWidth(60);
        tablaDosificaciones.getColumnModel().getColumn(7).setPreferredWidth(60);
        
        tablaDosificaciones.getColumnModel().getColumn(8).setMaxWidth(60);
        tablaDosificaciones.getColumnModel().getColumn(8).setMinWidth(60);
        tablaDosificaciones.getColumnModel().getColumn(8).setPreferredWidth(60);
    }
    
    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        jPanel1 = new javax.swing.JPanel();
        jLabel1 = new javax.swing.JLabel();
        btnNuevo = new javax.swing.JButton();
        jPanel2 = new javax.swing.JPanel();
        jLabel2 = new javax.swing.JLabel();
        jPanel3 = new javax.swing.JPanel();
        jLabel3 = new javax.swing.JLabel();
        filtro = new javax.swing.JTextField();
        jScrollPane1 = new javax.swing.JScrollPane();
        tablaDosificaciones = new JTable(){
            public boolean isCellEditable(int rowIndex, int colIndex) {
                return colIndex != 0 && colIndex != 1 && colIndex != 2 
                && colIndex != 3 && colIndex != 4 && colIndex != 5
                && colIndex != 6  && colIndex != 7 ;
            }
        };
        actualizar = new javax.swing.JButton();

        setDefaultCloseOperation(javax.swing.WindowConstants.DISPOSE_ON_CLOSE);

        jPanel1.setBackground(new java.awt.Color(255, 255, 255));

        jLabel1.setFont(new java.awt.Font("Arial", 1, 14)); // NOI18N
        jLabel1.setForeground(new java.awt.Color(66, 139, 202));
        jLabel1.setText("DOSIFICACIONES");

        btnNuevo.setBackground(new java.awt.Color(27, 106, 170));
        btnNuevo.setForeground(new java.awt.Color(255, 255, 255));
        btnNuevo.setIcon(new javax.swing.ImageIcon(getClass().getResource("/imagen/addition-white.png"))); // NOI18N
        btnNuevo.setText("Nuevo");
        btnNuevo.setBorder(javax.swing.BorderFactory.createLineBorder(new java.awt.Color(66, 139, 202)));
        btnNuevo.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                btnNuevoActionPerformed(evt);
            }
        });

        jPanel2.setBackground(new java.awt.Color(27, 106, 170));

        jLabel2.setFont(new java.awt.Font("Arial", 1, 12)); // NOI18N
        jLabel2.setForeground(new java.awt.Color(255, 255, 255));
        jLabel2.setText("Lista De Dosificaciones");

        javax.swing.GroupLayout jPanel2Layout = new javax.swing.GroupLayout(jPanel2);
        jPanel2.setLayout(jPanel2Layout);
        jPanel2Layout.setHorizontalGroup(
            jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel2Layout.createSequentialGroup()
                .addComponent(jLabel2, javax.swing.GroupLayout.PREFERRED_SIZE, 369, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(0, 0, Short.MAX_VALUE))
        );
        jPanel2Layout.setVerticalGroup(
            jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addComponent(jLabel2, javax.swing.GroupLayout.Alignment.TRAILING, javax.swing.GroupLayout.DEFAULT_SIZE, 37, Short.MAX_VALUE)
        );

        jLabel3.setText("Search: ");

        filtro.addKeyListener(new java.awt.event.KeyAdapter() {
            public void keyTyped(java.awt.event.KeyEvent evt) {
                filtroKeyTyped(evt);
            }
        });

        javax.swing.GroupLayout jPanel3Layout = new javax.swing.GroupLayout(jPanel3);
        jPanel3.setLayout(jPanel3Layout);
        jPanel3Layout.setHorizontalGroup(
            jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, jPanel3Layout.createSequentialGroup()
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                .addComponent(jLabel3)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(filtro, javax.swing.GroupLayout.PREFERRED_SIZE, 80, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(28, 28, 28))
        );
        jPanel3Layout.setVerticalGroup(
            jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel3Layout.createSequentialGroup()
                .addContainerGap()
                .addGroup(jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jLabel3, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                    .addComponent(filtro, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addContainerGap())
        );

        tablaDosificaciones.setModel(new javax.swing.table.DefaultTableModel(
            new Object [][] {

            },
            new String [] {
                "ID", "Autorización", "Número Correlativo", "Fecha Limite", "Llave Digital", "Frase Pié Factura", "Sucursal Asignación", "Editar", "Eliminar"
            }
        ) {
            boolean[] canEdit = new boolean [] {
                true, false, false, false, false, false, true, true, false
            };

            public boolean isCellEditable(int rowIndex, int columnIndex) {
                return canEdit [columnIndex];
            }
        });
        tablaDosificaciones.setFillsViewportHeight(true);
        tablaDosificaciones.addMouseListener(new java.awt.event.MouseAdapter() {
            public void mouseClicked(java.awt.event.MouseEvent evt) {
                tablaDosificacionesMouseClicked(evt);
            }
            public void mouseEntered(java.awt.event.MouseEvent evt) {
                tablaDosificacionesMouseEntered(evt);
            }
        });
        tablaDosificaciones.addPropertyChangeListener(new java.beans.PropertyChangeListener() {
            public void propertyChange(java.beans.PropertyChangeEvent evt) {
                tablaDosificacionesPropertyChange(evt);
            }
        });
        jScrollPane1.setViewportView(tablaDosificaciones);
        if (tablaDosificaciones.getColumnModel().getColumnCount() > 0) {
            tablaDosificaciones.getColumnModel().getColumn(0).setMinWidth(0);
            tablaDosificaciones.getColumnModel().getColumn(0).setPreferredWidth(0);
            tablaDosificaciones.getColumnModel().getColumn(0).setMaxWidth(0);
            tablaDosificaciones.getColumnModel().getColumn(5).setResizable(false);
        }

        actualizar.setBackground(new java.awt.Color(27, 106, 170));
        actualizar.setForeground(new java.awt.Color(255, 255, 255));
        actualizar.setIcon(new javax.swing.ImageIcon(getClass().getResource("/imagen/boton-actualizar.png"))); // NOI18N
        actualizar.setText("Nuevo");
        actualizar.setBorder(javax.swing.BorderFactory.createLineBorder(new java.awt.Color(66, 139, 202)));
        actualizar.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                actualizarActionPerformed(evt);
            }
        });

        javax.swing.GroupLayout jPanel1Layout = new javax.swing.GroupLayout(jPanel1);
        jPanel1.setLayout(jPanel1Layout);
        jPanel1Layout.setHorizontalGroup(
            jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel1Layout.createSequentialGroup()
                .addContainerGap()
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(jPanel2, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                    .addComponent(jPanel3, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                    .addComponent(jScrollPane1, javax.swing.GroupLayout.DEFAULT_SIZE, 886, Short.MAX_VALUE)
                    .addGroup(jPanel1Layout.createSequentialGroup()
                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(jLabel1, javax.swing.GroupLayout.PREFERRED_SIZE, 166, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addGroup(jPanel1Layout.createSequentialGroup()
                                .addComponent(btnNuevo, javax.swing.GroupLayout.PREFERRED_SIZE, 75, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addGap(18, 18, 18)
                                .addComponent(actualizar, javax.swing.GroupLayout.PREFERRED_SIZE, 75, javax.swing.GroupLayout.PREFERRED_SIZE)))
                        .addGap(0, 0, Short.MAX_VALUE)))
                .addContainerGap())
        );
        jPanel1Layout.setVerticalGroup(
            jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel1Layout.createSequentialGroup()
                .addContainerGap()
                .addComponent(jLabel1)
                .addGap(18, 18, 18)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(btnNuevo, javax.swing.GroupLayout.PREFERRED_SIZE, 46, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(actualizar, javax.swing.GroupLayout.PREFERRED_SIZE, 46, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jPanel2, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jPanel3, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jScrollPane1, javax.swing.GroupLayout.PREFERRED_SIZE, 225, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addContainerGap(60, Short.MAX_VALUE))
        );

        javax.swing.GroupLayout layout = new javax.swing.GroupLayout(getContentPane());
        getContentPane().setLayout(layout);
        layout.setHorizontalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addComponent(jPanel1, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
        );
        layout.setVerticalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addComponent(jPanel1, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
        );

        pack();
    }// </editor-fold>//GEN-END:initComponents

    private void btnNuevoActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_btnNuevoActionPerformed
        NuevaDosificacion nuevaDosificacion = new NuevaDosificacion(this,true,this.id_usuario);
        nuevaDosificacion.setVisible(true);
    }//GEN-LAST:event_btnNuevoActionPerformed

    private void actualizarActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_actualizarActionPerformed
        limpiar();
        obtenderDosificaciones();
    }//GEN-LAST:event_actualizarActionPerformed

    private void tablaDosificacionesMouseEntered(java.awt.event.MouseEvent evt) {//GEN-FIRST:event_tablaDosificacionesMouseEntered
        int columna = tablaDosificaciones.getColumnModel().getColumnIndexAtX(evt.getX());
        int fila = evt.getY() / tablaDosificaciones.getRowHeight();

        if (fila < tablaDosificaciones.getRowCount() && fila >= 0 && columna < tablaDosificaciones.getColumnCount() && columna >= 0) {
            Object value = tablaDosificaciones.getValueAt(fila, columna);
            
            
            if (columna == 5) {
                String letra = String.valueOf(tablaDosificaciones.getValueAt(fila, 5));
                tablaDosificaciones.setToolTipText(letra);              
            }
        }
    }//GEN-LAST:event_tablaDosificacionesMouseEntered

    private void tablaDosificacionesPropertyChange(java.beans.PropertyChangeEvent evt) {//GEN-FIRST:event_tablaDosificacionesPropertyChange
        // TODO add your handling code here:
    }//GEN-LAST:event_tablaDosificacionesPropertyChange

    private void tablaDosificacionesMouseClicked(java.awt.event.MouseEvent evt) {//GEN-FIRST:event_tablaDosificacionesMouseClicked
       int columna = tablaDosificaciones.getColumnModel().getColumnIndexAtX(evt.getX());
        int fila = evt.getY() / tablaDosificaciones.getRowHeight();

        if (fila < tablaDosificaciones.getRowCount() && fila >= 0 && columna < tablaDosificaciones.getColumnCount() && columna >= 0) {
            Object value = tablaDosificaciones.getValueAt(fila, columna);
            
            
            if (value instanceof JButton) {
                ((JButton) value).doClick();
                    JButton botonAccion = (JButton) value;
                 
                if (botonAccion.getName().equals("editar")) {
                   int id_dosifi = Integer.parseInt(String.valueOf(tablaDosificaciones.getValueAt(fila, 0)));
                   NuevaDosificacion nuevaDosif = new NuevaDosificacion(this,true,this.id_usuario, id_dosifi);
                   nuevaDosif.setVisible(true);
                }
                if (botonAccion.getName().equals("eliminar")) {
                   modeloTabla.removeRow(fila);
                   
                   int id = Integer.parseInt(String.valueOf(tablaDosificaciones.getValueAt(fila, 0)));
                   String elimiDosi = "UPDATE APP.DOSIFICACION SET ELIMINADO = "+true+" WHERE ID = "+id;
                   db.insertar(elimiDosi);
                   
                }              
            }
        }
    }//GEN-LAST:event_tablaDosificacionesMouseClicked
   
    private void filtroKeyTyped(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_filtroKeyTyped
        // TODO add your handling code here:     
        filtro.addKeyListener(new KeyAdapter() {
            @Override
            public void keyReleased(KeyEvent e) {
               trs.setRowFilter(RowFilter.regexFilter("(?i)"+filtro.getText(), 1));
            }  
        });
        
        trs = new TableRowSorter(modeloTabla);
        tablaDosificaciones.setRowSorter(trs);
    }//GEN-LAST:event_filtroKeyTyped
    
    /**
     * @param args the command line arguments
     */
   

    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JButton actualizar;
    private javax.swing.JButton btnNuevo;
    private javax.swing.JTextField filtro;
    private javax.swing.JLabel jLabel1;
    private javax.swing.JLabel jLabel2;
    private javax.swing.JLabel jLabel3;
    private javax.swing.JPanel jPanel1;
    private javax.swing.JPanel jPanel2;
    private javax.swing.JPanel jPanel3;
    private javax.swing.JScrollPane jScrollPane1;
    private javax.swing.JTable tablaDosificaciones;
    // End of variables declaration//GEN-END:variables
}
