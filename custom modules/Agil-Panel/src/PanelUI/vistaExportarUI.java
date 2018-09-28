/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package PanelUI;

import java.io.File;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;
import javax.swing.JFileChooser;
import javax.swing.JOptionPane;
import javax.swing.JTable;
import javax.swing.filechooser.FileNameExtensionFilter;
import javax.swing.table.DefaultTableModel;
import modelo_Productos.Exportar;
import modelo_Productos.listarProductosExport;
import models.Database;
import net.sf.jasperreports.export.Exporter;

/**
 *
 * @author AGIL
 */
public class vistaExportarUI extends javax.swing.JFrame {
    public Database db = new Database();
    public DefaultTableModel modeloTabla;
    public int id_usuario;
    
    public vistaExportarUI(int id_usuario) {
        initComponents();
        this.id_usuario = id_usuario;
        String[] columnas = {"Codigo","Nombre","Unid.Medida","Precio Unit.","Invent.Minimo","Descripcion","Grupo","SubGrupo","Caracteristica1","Caracteristica2","Codigo Fabrica","Comision(%)","Alerta","Descuento","Descuento Fijo"};
        modeloTabla = new DefaultTableModel(null,columnas);
        obtenerDatos();
    }
    
    public vistaExportarUI(){
        
    }
    
    public void obtenerDatos(){
        ResultSet rs = null;
        ArrayList<listarProductosExport> productos = new ArrayList();

        String codigo;
        String nombre;
        String unidadMedida;
        double precioUnit;
        int inventMinimo;
        String descripcion;
        int grupo;
        int subGrupo;
        String caracte1;
        String caracte2;
        String codigoFabrica;
        double comision;
        int alerta;
        double descuento;
        double descuentoFijo;
        int num = 1;
        
        String consulta = "SELECT P.CODIGO,P.NOMBRE,P.UNIDAD_MEDIDA,P.PRECIO_UNITARIO,\n" +
            "P.INVENTARIO_MINIMO,P.DESCRIPCION,P.GRUPO,P.SUBGRUPO,P.CARACTERISTICA_ESPECIAL1,P.CARACTERISTICA_ESPECIAL2,\n" +
            "P.CODIGO_FABRICA,P.COMISION,P.ALERTA,P.DESCUENTO,P.DESCUENTO_FIJO\n" +
            "FROM USUARIO AS U\n" +
            "INNER JOIN PRODUCTO AS P ON P.EMPRESA = U.EMPRESA\n" +
            "WHERE U.ID = "+this.id_usuario;
        try {
            rs = db.seleccionar(consulta);
            while(rs.next()){
                codigo = rs.getString(1);
                nombre = rs.getString(2);
                unidadMedida = rs.getString(3);
                precioUnit = rs.getDouble(4);
                inventMinimo = rs.getInt(5);
                descripcion = rs.getString(6);
                grupo = rs.getInt(7);
                subGrupo = rs.getInt(8);
                caracte1 = rs.getString(9);
                caracte2 = rs.getString(10);
                codigoFabrica = rs.getString(11);
                comision = rs.getDouble(12);
                alerta = rs.getInt(13);
                descuento = rs.getDouble(14);
                descuentoFijo = rs.getDouble(15);
                
                listarProductosExport lista = new listarProductosExport(codigo, nombre, unidadMedida, precioUnit, inventMinimo, descripcion, grupo, subGrupo, caracte1, caracte2, codigoFabrica, comision, alerta, descuento, descuentoFijo);
                productos.add(lista);
                
            }                   
        } catch (Exception e) {
            System.out.println("Error al seleccionar los productos "+e);
        }       
        String nombre_grupo = "";
        String nombre_subGrupo = "";
        
        for (int i = 0; i < productos.size(); i++) {

                codigo = productos.get(i).getCodigo();
                nombre = productos.get(i).getNombre();
                unidadMedida = productos.get(i).getUnidadMedida();
                precioUnit = productos.get(i).getPrecioUnit();
                inventMinimo = productos.get(i).getInventMinimo();
                descripcion = productos.get(i).getDescripcion();
                nombre_grupo = obtenerNombreGrupo(productos.get(i).getGrupo());
                nombre_subGrupo = obtenerNombreSubGrupo(productos.get(i).getSubGrupo());
                caracte1 = productos.get(i).getCaracte1();
                caracte2 = productos.get(i).getCaracte2();
                codigoFabrica = productos.get(i).getCodigoFabrica();
                comision = productos.get(i).getComicion();
                alerta = productos.get(i).getAlerta();
                descuento = productos.get(i).getDescuento();
                descuentoFijo = productos.get(i).getDescuentoFijo();
                String descFijo = "false";
                if (descuentoFijo == 1.0) {descFijo = "true";}else{descFijo="false";}
                
                Object[] dato = {codigo,nombre,unidadMedida, precioUnit,inventMinimo,descripcion,nombre_grupo,nombre_subGrupo,caracte1,caracte2,codigoFabrica,comision,alerta,descuento,descFijo};
              
                modeloTabla.addRow(dato);
        }
        jtDatos.setModel(modeloTabla);
    }
    
    public String obtenerNombreSubGrupo(int id_SubGrupo){
        String nombre = "";
        ResultSet rs = null;
        try {
            String consulta = "SELECT NOMBRE FROM CLASE WHERE ID = "+id_SubGrupo;
            rs = db.seleccionar(consulta);
            while (rs.next()) {                
                nombre = rs.getString(1);
            }
        } catch (Exception e) {
            System.out.println("Error al obtener los nombres de los sub grupos "+e);
        }
        return nombre;
    }
     
    public String obtenerNombreGrupo(int id_grupo){
        String nombre = "";
        ResultSet rs = null;
        try {
            String consulta = "SELECT NOMBRE FROM TIPO WHERE ID = "+id_grupo;
            rs = db.seleccionar(consulta);
            while (rs.next()) {                
                nombre = rs.getString(1);
            }
        } catch (Exception e) {
            System.out.println("Error al obtener los nombres de grupos "+e);
        }
        return nombre;
    }
    
    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        jScrollPane1 = new javax.swing.JScrollPane();
        jtDatos = new javax.swing.JTable();
        btnExportar = new javax.swing.JButton();
        jLabel1 = new javax.swing.JLabel();
        jLabel2 = new javax.swing.JLabel();
        jLabel3 = new javax.swing.JLabel();
        jButton1 = new javax.swing.JButton();

        setDefaultCloseOperation(javax.swing.WindowConstants.DISPOSE_ON_CLOSE);

        jtDatos.setModel(new javax.swing.table.DefaultTableModel(
            new Object [][] {

            },
            new String [] {
                "Código", "Nombre", "Unid.Medida", "Precio Unit", "Descripcion", "Invent.Minimo", "Grupo", "Sub-Grupo", "Caracteristica1", "Caracteristica2", "Código Fabrica", "Comision(%)", "Alerta", "Descuento", "Descuento Fijo"
            }
        ) {
            boolean[] canEdit = new boolean [] {
                false, false, false, false, false, false, false, false, false, false, false, false, false, false, false
            };

            public boolean isCellEditable(int rowIndex, int columnIndex) {
                return canEdit [columnIndex];
            }
        });
        jScrollPane1.setViewportView(jtDatos);
        if (jtDatos.getColumnModel().getColumnCount() > 0) {
            jtDatos.getColumnModel().getColumn(0).setResizable(false);
            jtDatos.getColumnModel().getColumn(1).setResizable(false);
            jtDatos.getColumnModel().getColumn(2).setResizable(false);
            jtDatos.getColumnModel().getColumn(3).setResizable(false);
            jtDatos.getColumnModel().getColumn(4).setResizable(false);
            jtDatos.getColumnModel().getColumn(5).setResizable(false);
            jtDatos.getColumnModel().getColumn(6).setResizable(false);
            jtDatos.getColumnModel().getColumn(7).setResizable(false);
            jtDatos.getColumnModel().getColumn(8).setResizable(false);
            jtDatos.getColumnModel().getColumn(9).setResizable(false);
            jtDatos.getColumnModel().getColumn(10).setResizable(false);
            jtDatos.getColumnModel().getColumn(11).setResizable(false);
            jtDatos.getColumnModel().getColumn(12).setResizable(false);
            jtDatos.getColumnModel().getColumn(13).setResizable(false);
            jtDatos.getColumnModel().getColumn(14).setResizable(false);
        }

        btnExportar.setFont(new java.awt.Font("Tahoma", 1, 11)); // NOI18N
        btnExportar.setText("Exportar");
        btnExportar.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                btnExportarActionPerformed(evt);
            }
        });

        jLabel1.setFont(new java.awt.Font("Tahoma", 1, 12)); // NOI18N
        jLabel1.setForeground(new java.awt.Color(0, 102, 0));
        jLabel1.setText("IMPORTACIÓN / EXPORTACIÓN ");

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

        javax.swing.GroupLayout layout = new javax.swing.GroupLayout(getContentPane());
        getContentPane().setLayout(layout);
        layout.setHorizontalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(layout.createSequentialGroup()
                .addContainerGap()
                .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(layout.createSequentialGroup()
                        .addComponent(jScrollPane1, javax.swing.GroupLayout.DEFAULT_SIZE, 980, Short.MAX_VALUE)
                        .addContainerGap())
                    .addGroup(layout.createSequentialGroup()
                        .addComponent(btnExportar)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                        .addComponent(jLabel3, javax.swing.GroupLayout.PREFERRED_SIZE, 32, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                        .addComponent(jLabel2)
                        .addGap(75, 75, 75))))
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, layout.createSequentialGroup()
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                .addComponent(jButton1, javax.swing.GroupLayout.PREFERRED_SIZE, 75, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(253, 253, 253))
            .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                .addGroup(layout.createSequentialGroup()
                    .addGap(374, 374, 374)
                    .addComponent(jLabel1)
                    .addContainerGap(432, Short.MAX_VALUE)))
        );
        layout.setVerticalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(layout.createSequentialGroup()
                .addContainerGap()
                .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(jLabel3, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                    .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                        .addComponent(btnExportar)
                        .addComponent(jLabel2, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)))
                .addGap(18, 18, 18)
                .addComponent(jScrollPane1, javax.swing.GroupLayout.PREFERRED_SIZE, 180, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(62, 62, 62)
                .addComponent(jButton1, javax.swing.GroupLayout.PREFERRED_SIZE, 34, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(28, 28, 28))
            .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                .addGroup(layout.createSequentialGroup()
                    .addGap(164, 164, 164)
                    .addComponent(jLabel1, javax.swing.GroupLayout.PREFERRED_SIZE, 27, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addContainerGap(169, Short.MAX_VALUE)))
        );

        pack();
    }// </editor-fold>//GEN-END:initComponents

    private void btnExportarActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_btnExportarActionPerformed
        // TODO add your handling code here:
        if (jtDatos.getRowCount()==0) {
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
            nom.add("Detalle de Gastos");
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
    private javax.swing.JLabel jLabel1;
    private javax.swing.JLabel jLabel2;
    private javax.swing.JLabel jLabel3;
    private javax.swing.JScrollPane jScrollPane1;
    public javax.swing.JTable jtDatos;
    // End of variables declaration//GEN-END:variables
}
