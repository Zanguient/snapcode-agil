package PanelUI;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Date;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.swing.JOptionPane;
import models.Database;

import modelo_Sucursal.listaDatosCorrelativos;
/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 *
 * @author AGIL
 */
public class SucursalDatosCorrelativos extends javax.swing.JFrame {
    public Database db = new Database();
    public int id_usuario;
    public int id_sucursal;
    /**
     * Creates new form SucursalDatosCorrelativos
     */
    public SucursalDatosCorrelativos(int id_sucursal,int id_usuario) {
        initComponents();
        this.setLocationRelativeTo(this);
        this.id_usuario = id_usuario;
        this.id_sucursal = id_sucursal;
        obtenerTamañoFactura();
        obtenerDatos(); 
        obtenerNotaFactura();
        obtenerDatosFacturacion();
    }
    
    public void obtenerDatosFacturacion(){
        ResultSet rs = null;
        String consulta = "SELECT NOVENTA.NOMBRE,NOTRASPASO.NOMBRE,NOBAJA.NOMBRE,NOPEDIDO.NOMBRE,CIECAJA.NOMBRE\n" +
            "FROM CONFIGURACION_FACTURA AS CF\n" +
            "INNER JOIN CLASE AS NOVENTA ON NOVENTA.ID = CF.TAMANO_PAPEL_NOTA_VENTA\n" +
            "INNER JOIN CLASE AS NOTRASPASO ON NOTRASPASO.ID = CF.TAMANO_PAPEL_NOTA_TRASPASO\n" +
            "INNER JOIN CLASE AS NOBAJA ON NOBAJA.ID = CF.TAMANO_PAPEL_NOTA_BAJA\n" +
            "INNER JOIN CLASE AS NOPEDIDO ON NOPEDIDO.ID = CF.TAMANO_PAPEL_NOTA_PEDIDO\n" +
            "INNER JOIN CLASE AS CIECAJA ON CIECAJA.ID = CF.TAMANO_PAPEL_CIERRE_CAJA\n" +
            "WHERE CF.SUCURSAL = "+this.id_sucursal;
        try {
            rs = db.seleccionar(consulta);
            while (rs.next()) {                
                comboPapelNotaVenta.setSelectedItem(rs.getString(1));
                comboPapelNotaTrasp.setSelectedItem(rs.getString(2));
                comboPapelNotaBaja.setSelectedItem(rs.getString(3));
                comboPapelNotaPedi.setSelectedItem(rs.getString(4));
                comboPapelCierreCaja.setSelectedItem(rs.getString(5));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }finally{
            try {
                rs.close();
                db.Conectar().close();
            } catch (SQLException ex) {
                Logger.getLogger(SucursalDatosCorrelativos.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }
    
    public void obtenerDatos(){
        List<listaDatosCorrelativos> datosCorre = db.seleccionarDatosCorrelativosSucu(this.id_sucursal,this.id_usuario);
        for (listaDatosCorrelativos datosCorrelativos : datosCorre) {
            
            textoNumCorreVenta.setText(Integer.toString(datosCorrelativos.getNum_corre_venta()));
            textoNumCorreTrasp.setText(Integer.toString(datosCorrelativos.getNum_corre_traspaso()));
            textoNumCorreBaja.setText(Integer.toString(datosCorrelativos.getNum_corre_baja()));
            textoNumCorrePedido.setText(Integer.toString(datosCorrelativos.getNum_corre_pedido()));
            textoNumCorrePedido.setText(Integer.toString(datosCorrelativos.getNum_corre_pedido()));
            textoNumCorreCotiza.setText(Integer.toString(datosCorrelativos.getNum_corre_cotizacion()));
            textoNumCorrePreFact.setText(Integer.toString(datosCorrelativos.getNum_corre_preFactura()));
            textoNumCoreDespa.setText(Integer.toString(datosCorrelativos.getNum_corre_despacho()));
            textoNumCoreDespaRecibo.setText(Integer.toString(datosCorrelativos.getNum_corre_despacho_recibo()));
            textoNumCorreRopaTrabajo.setText(Integer.toString(datosCorrelativos.getNum_corre_ropa_trabajo()));
            
            textNumCorreCompIngre.setText(Integer.toString(datosCorrelativos.getNum_corre_compro_ingre()));
            textoNumCorreCompEgreso.setText(Integer.toString(datosCorrelativos.getNum_corre_compro_egreso()));
            textoCorreCompTrasp.setText(Integer.toString(datosCorrelativos.getNum_corre_compro_traspaso()));
            textoNumCorreCompCajaChica.setText(Integer.toString(datosCorrelativos.getNum_corre_caja_chica()));
            reinicioIngreso.setSelected(datosCorrelativos.isReinicio_ingreso());
            reinicioEgreso.setSelected(datosCorrelativos.isReinicio_egreso());
            reinicioTraspaso.setSelected(datosCorrelativos.isReinicio_egreso());
            reinicioCajaChica.setSelected(datosCorrelativos.isReinicio_caja_chica());
            textoNumCorreVentaRecetaFarma.setText(Integer.toString(datosCorrelativos.getNum_corre_venta_farmacia()));
            textoFrasePedido.setText(datosCorrelativos.getFrase());
            textoNumCopiImprePedido.setText(Integer.toString(datosCorrelativos.getNum_copias_impresion_pedido()));
            impriPediCorto.setSelected(datosCorrelativos.isImpresion_pedido_corto());
            
        }
    }
    
    public void obtenerNotaFactura(){
        ResultSet rs = null;
        boolean habilitado = true;
        try {
            rs = db.seleccionar("SELECT C.NOMBRE \n" +
                "FROM TIPO AS T\n" +
                "INNER JOIN CLASE AS C ON C.ID_TIPO = T.ID\n" +
                "WHERE T.ID = "+26+" AND C.HABILITADO = "+habilitado);
            while (rs.next()) {                
                comboPapelNotaVenta.setSelectedItem(rs.getString(1));
                comboPapelNotaTrasp.setSelectedItem(rs.getString(1));
                comboPapelNotaBaja.setSelectedItem(rs.getString(1));
                comboPapelNotaPedi.setSelectedItem(rs.getString(1));
                comboPapelCierreCaja.setSelectedItem(rs.getString(1));
            }
    
        } catch (Exception e) {
            e.printStackTrace();
        }
            
    }
    
    public void obtenerTamañoFactura(){
        ResultSet rs = null;
        String consulta = "SELECT C.NOMBRE\n" +
            "FROM TIPO AS T\n" +
            "INNER JOIN CLASE AS C ON T.ID = C.ID_TIPO\n" +
            "WHERE T.ID = "+26;
        try {
            rs = db.seleccionar(consulta);
            while (rs.next()) {                
                comboPapelNotaVenta.addItem(rs.getString(1));
                comboPapelNotaPedi.addItem(rs.getString(1));
                comboPapelNotaBaja.addItem(rs.getString(1));
                comboPapelCierreCaja.addItem(rs.getString(1));
                comboPapelNotaTrasp.addItem(rs.getString(1));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }finally{
            try {
                rs.close();
                db.Conectar().close();
            } catch (SQLException ex) {
                Logger.getLogger(SucursalDatosCorrelativos.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }
    
    public int obtenerIdTamañoFactura(String nombre){
        ResultSet rs = null;
        int id = 0;
        String consulta = "SELECT ID FROM CLASE WHERE NOMBRE = '"+nombre+"'";
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
                Logger.getLogger(SucursalDatosCorrelativos.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
        return id;
    }
    
    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        jScrollPane1 = new javax.swing.JScrollPane();
        jPanel1 = new javax.swing.JPanel();
        jPanel2 = new javax.swing.JPanel();
        jLabel1 = new javax.swing.JLabel();
        cerrar = new javax.swing.JButton();
        jLabel2 = new javax.swing.JLabel();
        textoNumCorreVenta = new javax.swing.JTextField();
        jLabel3 = new javax.swing.JLabel();
        textoNumCorreTrasp = new javax.swing.JTextField();
        label = new javax.swing.JLabel();
        textoNumCorreBaja = new javax.swing.JTextField();
        label1 = new javax.swing.JLabel();
        textoNumCorrePedido = new javax.swing.JTextField();
        label2 = new javax.swing.JLabel();
        textoNumCorreCotiza = new javax.swing.JTextField();
        label3 = new javax.swing.JLabel();
        textoNumCorrePreFact = new javax.swing.JTextField();
        label4 = new javax.swing.JLabel();
        textoNumCoreDespa = new javax.swing.JTextField();
        label5 = new javax.swing.JLabel();
        textNumCorreCompIngre = new javax.swing.JTextField();
        label6 = new javax.swing.JLabel();
        reinicioIngreso = new javax.swing.JRadioButton();
        label7 = new javax.swing.JLabel();
        textoNumCorreCompEgreso = new javax.swing.JTextField();
        label8 = new javax.swing.JLabel();
        reinicioEgreso = new javax.swing.JRadioButton();
        label9 = new javax.swing.JLabel();
        textoCorreCompTrasp = new javax.swing.JTextField();
        label10 = new javax.swing.JLabel();
        reinicioTraspaso = new javax.swing.JRadioButton();
        label11 = new javax.swing.JLabel();
        textoNumCorreCompCajaChica = new javax.swing.JTextField();
        label12 = new javax.swing.JLabel();
        reinicioCajaChica = new javax.swing.JRadioButton();
        label13 = new javax.swing.JLabel();
        textoNumCorreVentaRecetaFarma = new javax.swing.JTextField();
        label15 = new javax.swing.JLabel();
        textoFrasePedido = new javax.swing.JTextField();
        label16 = new javax.swing.JLabel();
        textoNumCopiImprePedido = new javax.swing.JTextField();
        label17 = new javax.swing.JLabel();
        comboPapelNotaVenta = new javax.swing.JComboBox<>();
        label18 = new javax.swing.JLabel();
        comboPapelNotaTrasp = new javax.swing.JComboBox<>();
        label19 = new javax.swing.JLabel();
        comboPapelNotaBaja = new javax.swing.JComboBox<>();
        label20 = new javax.swing.JLabel();
        comboPapelNotaPedi = new javax.swing.JComboBox<>();
        label21 = new javax.swing.JLabel();
        impriPediCorto = new javax.swing.JRadioButton();
        label22 = new javax.swing.JLabel();
        comboPapelCierreCaja = new javax.swing.JComboBox<>();
        guardar = new javax.swing.JButton();
        cancelar = new javax.swing.JButton();
        label14 = new javax.swing.JLabel();
        textoNumCoreDespaRecibo = new javax.swing.JTextField();
        label23 = new javax.swing.JLabel();
        textoNumCorreRopaTrabajo = new javax.swing.JTextField();

        setDefaultCloseOperation(javax.swing.WindowConstants.EXIT_ON_CLOSE);

        jScrollPane1.setCursor(new java.awt.Cursor(java.awt.Cursor.DEFAULT_CURSOR));
        jScrollPane1.setHorizontalScrollBar(null);

        jPanel1.setBackground(new java.awt.Color(255, 255, 255));

        jPanel2.setBackground(new java.awt.Color(66, 139, 202));

        jLabel1.setFont(new java.awt.Font("Arial", 1, 14)); // NOI18N
        jLabel1.setForeground(new java.awt.Color(255, 255, 255));
        jLabel1.setText("Datos Correlativos");

        cerrar.setBackground(new java.awt.Color(66, 139, 202));
        cerrar.setIcon(new javax.swing.ImageIcon(getClass().getResource("/imagen/cancelar.png"))); // NOI18N

        javax.swing.GroupLayout jPanel2Layout = new javax.swing.GroupLayout(jPanel2);
        jPanel2.setLayout(jPanel2Layout);
        jPanel2Layout.setHorizontalGroup(
            jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel2Layout.createSequentialGroup()
                .addContainerGap()
                .addComponent(jLabel1)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                .addComponent(cerrar, javax.swing.GroupLayout.PREFERRED_SIZE, 27, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addContainerGap())
        );
        jPanel2Layout.setVerticalGroup(
            jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel2Layout.createSequentialGroup()
                .addContainerGap()
                .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(jLabel1, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                    .addComponent(cerrar, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
                .addContainerGap())
        );

        jLabel2.setFont(new java.awt.Font("Arial", 0, 11)); // NOI18N
        jLabel2.setForeground(new java.awt.Color(66, 139, 202));
        jLabel2.setText("Número Correlatio Venta");

        textoNumCorreVenta.addKeyListener(new java.awt.event.KeyAdapter() {
            public void keyTyped(java.awt.event.KeyEvent evt) {
                textoNumCorreVentaKeyTyped(evt);
            }
        });

        jLabel3.setFont(new java.awt.Font("Arial", 0, 11)); // NOI18N
        jLabel3.setForeground(new java.awt.Color(66, 139, 202));
        jLabel3.setText("Número Correlatio Traspaso");

        textoNumCorreTrasp.addKeyListener(new java.awt.event.KeyAdapter() {
            public void keyTyped(java.awt.event.KeyEvent evt) {
                textoNumCorreTraspKeyTyped(evt);
            }
        });

        label.setFont(new java.awt.Font("Arial", 0, 11)); // NOI18N
        label.setForeground(new java.awt.Color(66, 139, 202));
        label.setText("Número Correlatio Baja");

        textoNumCorreBaja.addKeyListener(new java.awt.event.KeyAdapter() {
            public void keyTyped(java.awt.event.KeyEvent evt) {
                textoNumCorreBajaKeyTyped(evt);
            }
        });

        label1.setFont(new java.awt.Font("Arial", 0, 11)); // NOI18N
        label1.setForeground(new java.awt.Color(66, 139, 202));
        label1.setText("Número Correlatio Pedido");

        textoNumCorrePedido.addKeyListener(new java.awt.event.KeyAdapter() {
            public void keyTyped(java.awt.event.KeyEvent evt) {
                textoNumCorrePedidoKeyTyped(evt);
            }
        });

        label2.setFont(new java.awt.Font("Arial", 0, 11)); // NOI18N
        label2.setForeground(new java.awt.Color(66, 139, 202));
        label2.setText("Número Correlatio Cotización");

        textoNumCorreCotiza.addKeyListener(new java.awt.event.KeyAdapter() {
            public void keyTyped(java.awt.event.KeyEvent evt) {
                textoNumCorreCotizaKeyTyped(evt);
            }
        });

        label3.setFont(new java.awt.Font("Arial", 0, 11)); // NOI18N
        label3.setForeground(new java.awt.Color(66, 139, 202));
        label3.setText("Número Correlatio PreFactura");

        textoNumCorrePreFact.addKeyListener(new java.awt.event.KeyAdapter() {
            public void keyTyped(java.awt.event.KeyEvent evt) {
                textoNumCorrePreFactKeyTyped(evt);
            }
        });

        label4.setFont(new java.awt.Font("Arial", 0, 11)); // NOI18N
        label4.setForeground(new java.awt.Color(66, 139, 202));
        label4.setText("Número Correlatio Despacho");

        textoNumCoreDespa.addKeyListener(new java.awt.event.KeyAdapter() {
            public void keyTyped(java.awt.event.KeyEvent evt) {
                textoNumCoreDespaKeyTyped(evt);
            }
        });

        label5.setFont(new java.awt.Font("Arial", 0, 11)); // NOI18N
        label5.setForeground(new java.awt.Color(66, 139, 202));
        label5.setText("Número Correlatio Comprobante Ingreso");

        textNumCorreCompIngre.addKeyListener(new java.awt.event.KeyAdapter() {
            public void keyTyped(java.awt.event.KeyEvent evt) {
                textNumCorreCompIngreKeyTyped(evt);
            }
        });

        label6.setFont(new java.awt.Font("Arial", 0, 11)); // NOI18N
        label6.setForeground(new java.awt.Color(66, 139, 202));
        label6.setText("Reiniciar");

        reinicioIngreso.setBackground(new java.awt.Color(255, 255, 255));
        reinicioIngreso.setBorder(null);

        label7.setFont(new java.awt.Font("Arial", 0, 11)); // NOI18N
        label7.setForeground(new java.awt.Color(66, 139, 202));
        label7.setText("Número Correlatio Comprobante Egreso");

        textoNumCorreCompEgreso.addKeyListener(new java.awt.event.KeyAdapter() {
            public void keyTyped(java.awt.event.KeyEvent evt) {
                textoNumCorreCompEgresoKeyTyped(evt);
            }
        });

        label8.setFont(new java.awt.Font("Arial", 0, 11)); // NOI18N
        label8.setForeground(new java.awt.Color(66, 139, 202));
        label8.setText("Reiniciar");

        reinicioEgreso.setBackground(new java.awt.Color(255, 255, 255));
        reinicioEgreso.setBorder(null);

        label9.setFont(new java.awt.Font("Arial", 0, 11)); // NOI18N
        label9.setForeground(new java.awt.Color(66, 139, 202));
        label9.setText("Número Correlatio Comprobante Traspaso");

        textoCorreCompTrasp.addKeyListener(new java.awt.event.KeyAdapter() {
            public void keyTyped(java.awt.event.KeyEvent evt) {
                textoCorreCompTraspKeyTyped(evt);
            }
        });

        label10.setFont(new java.awt.Font("Arial", 0, 11)); // NOI18N
        label10.setForeground(new java.awt.Color(66, 139, 202));
        label10.setText("Reiniciar");

        reinicioTraspaso.setBackground(new java.awt.Color(255, 255, 255));
        reinicioTraspaso.setBorder(null);

        label11.setFont(new java.awt.Font("Arial", 0, 11)); // NOI18N
        label11.setForeground(new java.awt.Color(66, 139, 202));
        label11.setText("Número Correlatio Comprobante Caja Chica");

        textoNumCorreCompCajaChica.addKeyListener(new java.awt.event.KeyAdapter() {
            public void keyTyped(java.awt.event.KeyEvent evt) {
                textoNumCorreCompCajaChicaKeyTyped(evt);
            }
        });

        label12.setFont(new java.awt.Font("Arial", 0, 11)); // NOI18N
        label12.setForeground(new java.awt.Color(66, 139, 202));
        label12.setText("Reiniciar");

        reinicioCajaChica.setBackground(new java.awt.Color(255, 255, 255));
        reinicioCajaChica.setBorder(null);

        label13.setFont(new java.awt.Font("Arial", 0, 11)); // NOI18N
        label13.setForeground(new java.awt.Color(66, 139, 202));
        label13.setText("Número Correlatio Venta Receta Farmacia ");

        textoNumCorreVentaRecetaFarma.addKeyListener(new java.awt.event.KeyAdapter() {
            public void keyTyped(java.awt.event.KeyEvent evt) {
                textoNumCorreVentaRecetaFarmaKeyTyped(evt);
            }
        });

        label15.setFont(new java.awt.Font("Arial", 0, 11)); // NOI18N
        label15.setForeground(new java.awt.Color(66, 139, 202));
        label15.setText("Frase Pedido");

        textoFrasePedido.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                textoFrasePedidoActionPerformed(evt);
            }
        });

        label16.setFont(new java.awt.Font("Arial", 0, 11)); // NOI18N
        label16.setForeground(new java.awt.Color(66, 139, 202));
        label16.setText("Numero de Copias Impresion Pedido");

        textoNumCopiImprePedido.addKeyListener(new java.awt.event.KeyAdapter() {
            public void keyTyped(java.awt.event.KeyEvent evt) {
                textoNumCopiImprePedidoKeyTyped(evt);
            }
        });

        label17.setFont(new java.awt.Font("Arial", 0, 11)); // NOI18N
        label17.setForeground(new java.awt.Color(66, 139, 202));
        label17.setText("Tamaño Papel Nota Venta");

        comboPapelNotaVenta.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                comboPapelNotaVentaActionPerformed(evt);
            }
        });

        label18.setFont(new java.awt.Font("Arial", 0, 11)); // NOI18N
        label18.setForeground(new java.awt.Color(66, 139, 202));
        label18.setText("Tamaño Papel Nota Traspaso");

        label19.setFont(new java.awt.Font("Arial", 0, 11)); // NOI18N
        label19.setForeground(new java.awt.Color(66, 139, 202));
        label19.setText("Tamaño Papel Nota Baja");

        label20.setFont(new java.awt.Font("Arial", 0, 11)); // NOI18N
        label20.setForeground(new java.awt.Color(66, 139, 202));
        label20.setText("Tamaño Papel Nota Pedido");

        label21.setFont(new java.awt.Font("Arial", 0, 11)); // NOI18N
        label21.setForeground(new java.awt.Color(66, 139, 202));
        label21.setText("Imprimir Pedido Corto?");

        impriPediCorto.setBackground(new java.awt.Color(255, 255, 255));
        impriPediCorto.setBorder(null);
        impriPediCorto.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                impriPediCortoActionPerformed(evt);
            }
        });

        label22.setFont(new java.awt.Font("Arial", 0, 11)); // NOI18N
        label22.setForeground(new java.awt.Color(66, 139, 202));
        label22.setText("Tamaño Papel Cierre Caja");

        guardar.setBackground(new java.awt.Color(98, 155, 88));
        guardar.setText("Guardar");
        guardar.setBorder(javax.swing.BorderFactory.createLineBorder(new java.awt.Color(135, 184, 127)));
        guardar.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                guardarActionPerformed(evt);
            }
        });

        cancelar.setBackground(new java.awt.Color(183, 70, 53));
        cancelar.setText("Cancelar");
        cancelar.setBorder(javax.swing.BorderFactory.createLineBorder(new java.awt.Color(209, 91, 71)));
        cancelar.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                cancelarActionPerformed(evt);
            }
        });

        label14.setFont(new java.awt.Font("Arial", 0, 11)); // NOI18N
        label14.setForeground(new java.awt.Color(66, 139, 202));
        label14.setText("Número Correlatio Despacho Recibo");

        textoNumCoreDespaRecibo.addKeyListener(new java.awt.event.KeyAdapter() {
            public void keyTyped(java.awt.event.KeyEvent evt) {
                textoNumCoreDespaReciboKeyTyped(evt);
            }
        });

        label23.setFont(new java.awt.Font("Arial", 0, 11)); // NOI18N
        label23.setForeground(new java.awt.Color(66, 139, 202));
        label23.setText("Número Correlativo Ropa Trabajo");

        javax.swing.GroupLayout jPanel1Layout = new javax.swing.GroupLayout(jPanel1);
        jPanel1.setLayout(jPanel1Layout);
        jPanel1Layout.setHorizontalGroup(
            jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel1Layout.createSequentialGroup()
                .addContainerGap()
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(jPanel2, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                    .addGroup(jPanel1Layout.createSequentialGroup()
                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, jPanel1Layout.createSequentialGroup()
                                    .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, 273, javax.swing.GroupLayout.PREFERRED_SIZE)
                                    .addComponent(cancelar, javax.swing.GroupLayout.PREFERRED_SIZE, 66, javax.swing.GroupLayout.PREFERRED_SIZE)
                                    .addGap(84, 84, 84)
                                    .addComponent(guardar, javax.swing.GroupLayout.PREFERRED_SIZE, 67, javax.swing.GroupLayout.PREFERRED_SIZE)
                                    .addGap(2, 2, 2))
                                .addGroup(jPanel1Layout.createSequentialGroup()
                                    .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING, false)
                                        .addGroup(javax.swing.GroupLayout.Alignment.LEADING, jPanel1Layout.createSequentialGroup()
                                            .addComponent(label13)
                                            .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                            .addComponent(textoNumCorreVentaRecetaFarma))
                                        .addGroup(javax.swing.GroupLayout.Alignment.LEADING, jPanel1Layout.createSequentialGroup()
                                            .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                                .addComponent(label7)
                                                .addComponent(label9)
                                                .addComponent(label11)
                                                .addComponent(label5))
                                            .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                            .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING, false)
                                                .addComponent(textoNumCorreCompEgreso)
                                                .addComponent(textNumCorreCompIngre)
                                                .addComponent(textoCorreCompTrasp)
                                                .addComponent(textoNumCorreCompCajaChica, javax.swing.GroupLayout.PREFERRED_SIZE, 199, javax.swing.GroupLayout.PREFERRED_SIZE))))
                                    .addGap(18, 18, 18)
                                    .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                        .addGroup(jPanel1Layout.createSequentialGroup()
                                            .addComponent(label6)
                                            .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                                            .addComponent(reinicioIngreso))
                                        .addGroup(jPanel1Layout.createSequentialGroup()
                                            .addComponent(label8)
                                            .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                                            .addComponent(reinicioEgreso))
                                        .addGroup(jPanel1Layout.createSequentialGroup()
                                            .addComponent(label10)
                                            .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                                            .addComponent(reinicioTraspaso))
                                        .addGroup(jPanel1Layout.createSequentialGroup()
                                            .addComponent(label12)
                                            .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                                            .addComponent(reinicioCajaChica))))
                                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING, false)
                                    .addGroup(javax.swing.GroupLayout.Alignment.LEADING, jPanel1Layout.createSequentialGroup()
                                        .addComponent(label16)
                                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                                        .addComponent(textoNumCopiImprePedido))
                                    .addGroup(javax.swing.GroupLayout.Alignment.LEADING, jPanel1Layout.createSequentialGroup()
                                        .addComponent(label15, javax.swing.GroupLayout.PREFERRED_SIZE, 92, javax.swing.GroupLayout.PREFERRED_SIZE)
                                        .addGap(63, 63, 63)
                                        .addComponent(textoFrasePedido, javax.swing.GroupLayout.PREFERRED_SIZE, 189, javax.swing.GroupLayout.PREFERRED_SIZE)))
                                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING, false)
                                    .addGroup(javax.swing.GroupLayout.Alignment.LEADING, jPanel1Layout.createSequentialGroup()
                                        .addComponent(label17)
                                        .addGap(28, 28, 28)
                                        .addComponent(comboPapelNotaVenta, javax.swing.GroupLayout.PREFERRED_SIZE, 122, javax.swing.GroupLayout.PREFERRED_SIZE))
                                    .addGroup(javax.swing.GroupLayout.Alignment.LEADING, jPanel1Layout.createSequentialGroup()
                                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                            .addComponent(label18)
                                            .addComponent(label19)
                                            .addComponent(label20)
                                            .addComponent(label21)
                                            .addComponent(label22))
                                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                            .addComponent(comboPapelNotaTrasp, 0, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                                            .addComponent(comboPapelNotaBaja, 0, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                                            .addComponent(comboPapelNotaPedi, 0, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                                            .addGroup(jPanel1Layout.createSequentialGroup()
                                                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                                    .addComponent(impriPediCorto)
                                                    .addComponent(comboPapelCierreCaja, javax.swing.GroupLayout.PREFERRED_SIZE, 123, javax.swing.GroupLayout.PREFERRED_SIZE))
                                                .addGap(0, 0, Short.MAX_VALUE))))))
                            .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING, false)
                                .addGroup(javax.swing.GroupLayout.Alignment.LEADING, jPanel1Layout.createSequentialGroup()
                                    .addComponent(label14)
                                    .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                                    .addComponent(textoNumCoreDespaRecibo))
                                .addGroup(javax.swing.GroupLayout.Alignment.LEADING, jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING)
                                    .addGroup(jPanel1Layout.createSequentialGroup()
                                        .addComponent(label23)
                                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                        .addComponent(textoNumCorreRopaTrabajo, javax.swing.GroupLayout.PREFERRED_SIZE, 176, javax.swing.GroupLayout.PREFERRED_SIZE))
                                    .addGroup(jPanel1Layout.createSequentialGroup()
                                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                                .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                                    .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, jPanel1Layout.createSequentialGroup()
                                                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                                            .addComponent(jLabel3)
                                                            .addComponent(jLabel2)
                                                            .addComponent(label)
                                                            .addComponent(label1))
                                                        .addGap(18, 18, 18))
                                                    .addGroup(jPanel1Layout.createSequentialGroup()
                                                        .addComponent(label2)
                                                        .addGap(14, 14, 14)))
                                                .addGroup(jPanel1Layout.createSequentialGroup()
                                                    .addComponent(label3)
                                                    .addGap(11, 11, 11)))
                                            .addGroup(jPanel1Layout.createSequentialGroup()
                                                .addComponent(label4)
                                                .addGap(15, 15, 15)))
                                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING, false)
                                            .addComponent(textoNumCoreDespa)
                                            .addComponent(textoNumCorrePreFact)
                                            .addComponent(textoNumCorreCotiza, javax.swing.GroupLayout.DEFAULT_SIZE, 184, Short.MAX_VALUE)
                                            .addComponent(textoNumCorreBaja)
                                            .addComponent(textoNumCorreVenta)
                                            .addComponent(textoNumCorreTrasp)
                                            .addComponent(textoNumCorrePedido, javax.swing.GroupLayout.Alignment.TRAILING))))))
                        .addGap(0, 71, Short.MAX_VALUE)))
                .addContainerGap())
        );
        jPanel1Layout.setVerticalGroup(
            jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel1Layout.createSequentialGroup()
                .addContainerGap()
                .addComponent(jPanel2, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(26, 26, 26)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jLabel2)
                    .addComponent(textoNumCorreVenta, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jLabel3)
                    .addComponent(textoNumCorreTrasp, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(label)
                    .addComponent(textoNumCorreBaja, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(label1)
                    .addComponent(textoNumCorrePedido, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(label2)
                    .addComponent(textoNumCorreCotiza, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(label3)
                    .addComponent(textoNumCorrePreFact, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(label4)
                    .addComponent(textoNumCoreDespa, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(textoNumCoreDespaRecibo, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(label14))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, 11, Short.MAX_VALUE)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(textoNumCorreRopaTrabajo, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(label23))
                .addGap(23, 23, 23)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING)
                    .addGroup(jPanel1Layout.createSequentialGroup()
                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                            .addComponent(label5)
                            .addComponent(textNumCorreCompIngre, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addComponent(label6)
                            .addComponent(reinicioIngreso))
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(reinicioEgreso)
                            .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                                .addComponent(label7)
                                .addComponent(textoNumCorreCompEgreso, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addComponent(label8)))
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                            .addComponent(label9)
                            .addComponent(textoCorreCompTrasp, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addComponent(label10)))
                    .addComponent(reinicioTraspaso))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING)
                    .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                        .addComponent(label11)
                        .addComponent(textoNumCorreCompCajaChica, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addComponent(label12))
                    .addComponent(reinicioCajaChica))
                .addGap(11, 11, 11)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(label13)
                    .addComponent(textoNumCorreVentaRecetaFarma, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(label15)
                    .addComponent(textoFrasePedido, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(label16)
                    .addComponent(textoNumCopiImprePedido, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(label17)
                    .addComponent(comboPapelNotaVenta, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(label18)
                    .addComponent(comboPapelNotaTrasp, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(comboPapelNotaBaja, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(label19))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(label20)
                    .addComponent(comboPapelNotaPedi, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(label21)
                    .addComponent(impriPediCorto))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(label22)
                    .addComponent(comboPapelCierreCaja, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(guardar, javax.swing.GroupLayout.PREFERRED_SIZE, 32, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(cancelar, javax.swing.GroupLayout.PREFERRED_SIZE, 32, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addGap(139, 139, 139))
        );

        jScrollPane1.setViewportView(jPanel1);

        javax.swing.GroupLayout layout = new javax.swing.GroupLayout(getContentPane());
        getContentPane().setLayout(layout);
        layout.setHorizontalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addComponent(jScrollPane1)
        );
        layout.setVerticalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addComponent(jScrollPane1, javax.swing.GroupLayout.DEFAULT_SIZE, 437, Short.MAX_VALUE)
        );

        pack();
    }// </editor-fold>//GEN-END:initComponents

    private void textoFrasePedidoActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_textoFrasePedidoActionPerformed
        // TODO add your handling code here:
    }//GEN-LAST:event_textoFrasePedidoActionPerformed

    private void impriPediCortoActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_impriPediCortoActionPerformed
        // TODO add your handling code here:
    }//GEN-LAST:event_impriPediCortoActionPerformed

    private void comboPapelNotaVentaActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_comboPapelNotaVentaActionPerformed
        // TODO add your handling code here:
    }//GEN-LAST:event_comboPapelNotaVentaActionPerformed

    private void cancelarActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_cancelarActionPerformed
        dispose();
    }//GEN-LAST:event_cancelarActionPerformed

    private void guardarActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_guardarActionPerformed
        
        Date fe = new Date();
        long dd = fe.getTime();
        java.sql.Date fechaAct = new java.sql.Date(dd); 
        
        int nota_venta_corre = (textoNumCorreVenta.getText().equals(""))? 1 : Integer.parseInt(textoNumCorreVenta.getText());
        int nota_traspaso_corre = (textoNumCorreTrasp.getText().equals(""))? 1 : Integer.parseInt(textoNumCorreTrasp.getText());
        int nota_baja_corre = (textoNumCorreBaja.getText().equals(""))? 1 : Integer.parseInt(textoNumCorreBaja.getText());
        int nota_pedido_corre = (textoNumCorrePedido.getText().equals(""))? 1 : Integer.parseInt(textoNumCorrePedido.getText());
        int nota_cotizacion_corre = (textoNumCorreCotiza.getText().equals(""))? 1 : Integer.parseInt(textoNumCorreCotiza.getText());
        int preFactura = (textoNumCorrePreFact.getText().equals(""))? 1 : Integer.parseInt(textoNumCorrePreFact.getText());
        int nota_desapa_corre = (textoNumCoreDespa.getText().equals(""))? 1 : Integer.parseInt(textoNumCoreDespa.getText());
        int despacho_recibo_corre = (textoNumCoreDespaRecibo.getText().equals(""))? 1 : Integer.parseInt(textoNumCoreDespaRecibo.getText());       
        int ropa_trabajo_corre = (textoNumCorreRopaTrabajo.getText().equals(""))? 1 : Integer.parseInt(textoNumCorreRopaTrabajo.getText());
        int compro_ingreso = (textNumCorreCompIngre.getText().equals(""))? 1 : Integer.parseInt(textNumCorreCompIngre.getText());
        boolean reinicio_ingreso = reinicioIngreso.isSelected();
        int compro_egreso = (textoNumCorreCompEgreso.getText().equals(""))? 1 : Integer.parseInt(textoNumCorreCompEgreso.getText());
        boolean reinicio_egreso = reinicioEgreso.isSelected();
        int compro_traspa = (textoCorreCompTrasp.getText().equals(""))? 1 : Integer.parseInt(textoCorreCompTrasp.getText());
        boolean reinicio_traspaso = reinicioTraspaso.isSelected();
        int compro_caja_chica = (textoNumCorreCompCajaChica.getText().equals(""))? 1 : Integer.parseInt(textoNumCorreCompCajaChica.getText());
        boolean reinicio_caja_chica = reinicioCajaChica.isSelected();
        int nota_venta_farmacia = (textoNumCorreVentaRecetaFarma.getText().equals(""))? 1 : Integer.parseInt(textoNumCorreVentaRecetaFarma.getText());
        String frase = textoFrasePedido.getText();
        int copias_imprimir_pedido = (textoNumCopiImprePedido.getText().equals(""))? 1 : Integer.parseInt(textoNumCopiImprePedido.getText());
        boolean imprimir_pedido_corto = impriPediCorto.isSelected();
        
        
        String venta = (String) comboPapelNotaVenta.getSelectedItem();
        int nota_venta = obtenerIdTamañoFactura(venta);
        String traspaso = (String) comboPapelNotaTrasp.getSelectedItem();
        int nota_traspaso = obtenerIdTamañoFactura(traspaso);
        String baja = (String) comboPapelNotaBaja.getSelectedItem();
        int nota_baja = obtenerIdTamañoFactura(baja);
        String pedido = (String) comboPapelNotaPedi.getSelectedItem();
        int nota_pedido = obtenerIdTamañoFactura(pedido);
        String cierre = (String) comboPapelCierreCaja.getSelectedItem();
        int cierre_caja = obtenerIdTamañoFactura(cierre);
        
        try {
            db.actualizarSucursalDatosCorrelativos(this.id_sucursal, nota_venta_corre, nota_traspaso_corre, nota_baja_corre, nota_pedido_corre, copias_imprimir_pedido, frase, nota_cotizacion_corre, preFactura, compro_ingreso, compro_egreso, compro_traspa, compro_caja_chica, nota_venta_farmacia, nota_desapa_corre,ropa_trabajo_corre, reinicio_ingreso, reinicio_traspaso, reinicio_egreso,reinicio_caja_chica, imprimir_pedido_corto, despacho_recibo_corre);

            db.actualizarFacturaSucursalDatosCorrelativo(this.id_sucursal, nota_venta, nota_traspaso, nota_baja, nota_pedido, cierre_caja, fechaAct);
        
            JOptionPane.showMessageDialog(null, "Guardado Exitosamente");
            dispose();
        } catch (Exception e) {
            System.out.println("Error al guardar datos correlativos: "+e.getMessage());
            JOptionPane.showMessageDialog(null, "Error al guardar");
        }
        
        
    }//GEN-LAST:event_guardarActionPerformed

    private void textoNumCorreVentaKeyTyped(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_textoNumCorreVentaKeyTyped
        char c = evt.getKeyChar();
        if ((c < '0') || (c > '9')) evt.consume();
    }//GEN-LAST:event_textoNumCorreVentaKeyTyped

    private void textoNumCorreTraspKeyTyped(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_textoNumCorreTraspKeyTyped
        char c = evt.getKeyChar();
        if ((c < '0') || (c > '9')) evt.consume();
    }//GEN-LAST:event_textoNumCorreTraspKeyTyped

    private void textoNumCorreBajaKeyTyped(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_textoNumCorreBajaKeyTyped
        char c = evt.getKeyChar();
        if ((c < '0') || (c > '9')) evt.consume();
    }//GEN-LAST:event_textoNumCorreBajaKeyTyped

    private void textoNumCorrePedidoKeyTyped(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_textoNumCorrePedidoKeyTyped
        char c = evt.getKeyChar();
        if ((c < '0') || (c > '9')) evt.consume();
    }//GEN-LAST:event_textoNumCorrePedidoKeyTyped

    private void textoNumCorreCotizaKeyTyped(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_textoNumCorreCotizaKeyTyped
       char c = evt.getKeyChar();
       if ((c < '0') || (c > '9')) evt.consume();
    }//GEN-LAST:event_textoNumCorreCotizaKeyTyped

    private void textoNumCorrePreFactKeyTyped(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_textoNumCorrePreFactKeyTyped
        char c = evt.getKeyChar();
        if ((c < '0') || (c > '9')) evt.consume();
    }//GEN-LAST:event_textoNumCorrePreFactKeyTyped

    private void textoNumCoreDespaKeyTyped(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_textoNumCoreDespaKeyTyped
        char c = evt.getKeyChar();
        if ((c < '0') || (c > '9')) evt.consume();
    }//GEN-LAST:event_textoNumCoreDespaKeyTyped

    private void textoNumCoreDespaReciboKeyTyped(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_textoNumCoreDespaReciboKeyTyped
        char c = evt.getKeyChar();
        if ((c < '0') || (c > '9')) evt.consume();
    }//GEN-LAST:event_textoNumCoreDespaReciboKeyTyped

    private void textNumCorreCompIngreKeyTyped(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_textNumCorreCompIngreKeyTyped
        char c = evt.getKeyChar();
        if ((c < '0') || (c > '9')) evt.consume();
    }//GEN-LAST:event_textNumCorreCompIngreKeyTyped

    private void textoNumCorreCompEgresoKeyTyped(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_textoNumCorreCompEgresoKeyTyped
        char c = evt.getKeyChar();
        if ((c < '0') || (c > '9')) evt.consume();
    }//GEN-LAST:event_textoNumCorreCompEgresoKeyTyped

    private void textoCorreCompTraspKeyTyped(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_textoCorreCompTraspKeyTyped
        char c = evt.getKeyChar();
        if ((c < '0') || (c > '9')) evt.consume();
    }//GEN-LAST:event_textoCorreCompTraspKeyTyped

    private void textoNumCorreCompCajaChicaKeyTyped(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_textoNumCorreCompCajaChicaKeyTyped
        char c = evt.getKeyChar();
        if ((c < '0') || (c > '9')) evt.consume();
    }//GEN-LAST:event_textoNumCorreCompCajaChicaKeyTyped

    private void textoNumCorreVentaRecetaFarmaKeyTyped(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_textoNumCorreVentaRecetaFarmaKeyTyped
        char c = evt.getKeyChar();
        if ((c < '0') || (c > '9')) evt.consume();
    }//GEN-LAST:event_textoNumCorreVentaRecetaFarmaKeyTyped

    private void textoNumCopiImprePedidoKeyTyped(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_textoNumCopiImprePedidoKeyTyped
        char c = evt.getKeyChar();
        if ((c < '0') || (c > '9')) evt.consume();
    }//GEN-LAST:event_textoNumCopiImprePedidoKeyTyped

    /**
     * @param args the command line arguments
     */
    

    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JButton cancelar;
    private javax.swing.JButton cerrar;
    private javax.swing.JComboBox<String> comboPapelCierreCaja;
    private javax.swing.JComboBox<String> comboPapelNotaBaja;
    private javax.swing.JComboBox<String> comboPapelNotaPedi;
    private javax.swing.JComboBox<String> comboPapelNotaTrasp;
    private javax.swing.JComboBox<String> comboPapelNotaVenta;
    private javax.swing.JButton guardar;
    private javax.swing.JRadioButton impriPediCorto;
    private javax.swing.JLabel jLabel1;
    private javax.swing.JLabel jLabel2;
    private javax.swing.JLabel jLabel3;
    private javax.swing.JPanel jPanel1;
    private javax.swing.JPanel jPanel2;
    private javax.swing.JScrollPane jScrollPane1;
    private javax.swing.JLabel label;
    private javax.swing.JLabel label1;
    private javax.swing.JLabel label10;
    private javax.swing.JLabel label11;
    private javax.swing.JLabel label12;
    private javax.swing.JLabel label13;
    private javax.swing.JLabel label14;
    private javax.swing.JLabel label15;
    private javax.swing.JLabel label16;
    private javax.swing.JLabel label17;
    private javax.swing.JLabel label18;
    private javax.swing.JLabel label19;
    private javax.swing.JLabel label2;
    private javax.swing.JLabel label20;
    private javax.swing.JLabel label21;
    private javax.swing.JLabel label22;
    private javax.swing.JLabel label23;
    private javax.swing.JLabel label3;
    private javax.swing.JLabel label4;
    private javax.swing.JLabel label5;
    private javax.swing.JLabel label6;
    private javax.swing.JLabel label7;
    private javax.swing.JLabel label8;
    private javax.swing.JLabel label9;
    private javax.swing.JRadioButton reinicioCajaChica;
    private javax.swing.JRadioButton reinicioEgreso;
    private javax.swing.JRadioButton reinicioIngreso;
    private javax.swing.JRadioButton reinicioTraspaso;
    private javax.swing.JTextField textNumCorreCompIngre;
    private javax.swing.JTextField textoCorreCompTrasp;
    private javax.swing.JTextField textoFrasePedido;
    private javax.swing.JTextField textoNumCopiImprePedido;
    private javax.swing.JTextField textoNumCoreDespa;
    private javax.swing.JTextField textoNumCoreDespaRecibo;
    private javax.swing.JTextField textoNumCorreBaja;
    private javax.swing.JTextField textoNumCorreCompCajaChica;
    private javax.swing.JTextField textoNumCorreCompEgreso;
    private javax.swing.JTextField textoNumCorreCotiza;
    private javax.swing.JTextField textoNumCorrePedido;
    private javax.swing.JTextField textoNumCorrePreFact;
    private javax.swing.JTextField textoNumCorreRopaTrabajo;
    private javax.swing.JTextField textoNumCorreTrasp;
    private javax.swing.JTextField textoNumCorreVenta;
    private javax.swing.JTextField textoNumCorreVentaRecetaFarma;
    // End of variables declaration//GEN-END:variables
}
