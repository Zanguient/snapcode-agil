/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package operacionesUI;

import java.net.*;
import java.util.logging.*;
import org.json.*;
import models.*;
import com.agil.nuevo.*;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.FlowLayout;
import java.io.File;
import java.io.FileNotFoundException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Date;
import javax.swing.ImageIcon;
import javax.swing.JButton;
import javax.swing.JTable;
import javax.swing.JTextField;
import javax.swing.table.DefaultTableModel;
import javax.swing.table.TableColumnModel;
import java.util.HashMap;
import java.util.Map;
import javax.swing.Icon;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JProgressBar;
import javax.swing.JTextArea;
import javax.swing.SwingUtilities;
import javax.swing.table.TableCellRenderer;
import model_detalle_producto.detalleSolicitudProducto;
import model_detalle_producto_base.detalleSolicitudProductoBase;
import model_solicitud.solicitudReposicion;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.JasperReport;
import net.sf.jasperreports.engine.util.JRLoader;
import net.sf.jasperreports.view.JasperViewer;

/**
 *
 * @author AGIL
 */
public class Solicitudes extends javax.swing.JFrame  {
    int cant = 0;
    JSONObject datosUsuario;
    int id_usuario;
    Database db = new Database();
    DatabaseExportacion dbExp = new DatabaseExportacion();
    ArrayList<Sucursal> listaSucur;
    ArrayList<Almacen> ListaAlmacen;
    String estado = "";

    DefaultTableModel defaulttable;
    TableColumnModel columnModel;

    JButton entregar;
    JButton bloqueado;
    JButton editar;
    JButton noeditar;
    JButton Imprimir;
    JButton ver;
    JButton copiar;
    JButton eliminar;

    ImageIcon imgEntre;
    Icon iconEntre;
    
    ImageIcon imgBloq;
    Icon iconBloq;
    
    ImageIcon imgEdit;
    Icon iconEdit;
    
    ImageIcon imgNoEdit;
    Icon iconNoEdit;
    
    ImageIcon imgImp;
    Icon iconImp;
    
    ImageIcon imgVer;
    Icon iconVer;
    
    ImageIcon imgCopiar;
    Icon iconCopiar;
    
    ImageIcon imgElimi;
    Icon iconElimi;
    
    ArrayList<solicitudReposicion>arraySolicitud = new ArrayList();
    ArrayList<detalleSolicitudProducto>arrayDetalleProducto = new ArrayList();
    ArrayList<detalleSolicitudProductoBase>arrayDetalleProductoBase = new ArrayList();
    
    /**
     * Creates new form Solicitudes
     */
    
    private String getConnectionStatus() {
        String estado = ""; 
        try { 

            URL ruta=new URL("http://agilsof.net/"); 
            URLConnection rutaC = ruta.openConnection(); 
            rutaC.connect(); 
            estado="Online"; 
        }catch(Exception e){ 
            estado="Offline"; 
        } 
        return estado;   
    }

    private void MostrarFiltrosSucursal() {
        String nombre_sucursal = "";
        int id_sucursal = 0;
        //DefaultComboBoxModel value = new DefaultComboBoxModel();
        //jComboSucursal.removeAll();
//        jComboSucursal.setModel(value);
//        value.addElement(new Sucursal(id_sucursal,nombre_sucursal));
        for (int i = 0; i < db.SeleccionarSucursal(this.id_usuario).size(); i++) {
            nombre_sucursal = db.SeleccionarSucursal(this.id_usuario).get(i).getNombre();
            id_sucursal = db.SeleccionarSucursal(this.id_usuario).get(i).getId();
            jComboSucursal.addItem(nombre_sucursal);
        }
    }

    public void MostrarFiltroAlmacen(String nombre) {
        String nombre_almacen = "";
        String nombre_sucursal = "";
        int id_sucursal = 0;

        if (nombre.equals("Todo")) {
            jComboAlmacen.removeAllItems();
            jComboAlmacen.addItem("Todo");

        } else if (!nombre.equals("Todo")) {
            for (int i = 0; i < db.SeleccionarSucursalPorNombre(nombre).size(); i++) {
                nombre_sucursal = db.SeleccionarSucursalPorNombre(nombre).get(i).getNombre();
                id_sucursal = db.SeleccionarSucursalPorNombre(nombre).get(i).getId();
            }
            jComboAlmacen.removeAllItems();
            int tam = db.selectAlmacenById(id_sucursal).size();
            jComboAlmacen.addItem("Todo");
            for (int i = 0; i < tam; i++) {
                nombre_almacen = db.selectAlmacenById(id_sucursal).get(i).getNombre();
                jComboAlmacen.addItem(nombre_almacen);
            }
        }
    }

    public void limpiarListas(ArrayList lista) {
        int tam = lista.size();
        for (int i = tam - 1; i >= 0; i--) {
            lista.remove(i);
        }
    }

    public Solicitudes(int id_usuario) {
        initComponents();
        setLocationRelativeTo(null);
        this.id_usuario = id_usuario;
        listaSucur = new ArrayList();
        ListaAlmacen = new ArrayList();
        MostrarFiltrosSucursal();
        listaSucur = new ArrayList();
        //labelPendientes.setText(SumarCantidades());
        
        String columnas[] = {"N°", "Id", "Sucursal", "Fecha", "monto", "Usuario", "Estado", "Entregar", "Editar", "Imprimir", "Ver", "Copiar", "Eliminar"};
        defaulttable = new DefaultTableModel(null, columnas);
            
        columnModel = tablaSolicitudes.getColumnModel();

        columnModel.getColumn(0).setPreferredWidth(30);

        columnModel.getColumn(1).setPreferredWidth(0);

        columnModel.getColumn(2).setPreferredWidth(130);
        columnModel.getColumn(3).setPreferredWidth(100);
        columnModel.getColumn(4).setPreferredWidth(80);
        columnModel.getColumn(5).setPreferredWidth(100);
        columnModel.getColumn(6).setPreferredWidth(100);
        columnModel.getColumn(7).setPreferredWidth(60);
        columnModel.getColumn(8).setPreferredWidth(60);
        columnModel.getColumn(9).setPreferredWidth(60);
        columnModel.getColumn(10).setPreferredWidth(60);
        columnModel.getColumn(11).setPreferredWidth(60);
        columnModel.getColumn(12).setPreferredWidth(60);

        tablaSolicitudes.setDefaultRenderer(Object.class, new RenderTable());
        
        String Imgentregar = "/imagen/desbloqueado.png";
        imgEntre = new ImageIcon(this.getClass().getResource(Imgentregar));
        iconEntre = new ImageIcon(imgEntre.getImage().getScaledInstance(20, 20, 1));
        entregar = new JButton(iconEntre);
        entregar.setName("entregar");
        
        String Imgbloqueado = "/imagen/bloqueado.png";
        imgBloq = new ImageIcon(this.getClass().getResource(Imgbloqueado));
        iconBloq = new ImageIcon(imgBloq.getImage().getScaledInstance(20, 20, 1));
        bloqueado = new JButton(iconBloq);
        
        String imgEditar = "/imagen/editar.png";
        imgEdit = new ImageIcon(this.getClass().getResource(imgEditar));
        iconEdit = new ImageIcon(imgEdit.getImage().getScaledInstance(20, 20, 1));
        editar = new JButton(iconEdit);
        editar.setName("editar");
        
        String imgNoEditar = "/imagen/noeditar.png";
        imgNoEdit = new ImageIcon(this.getClass().getResource(imgNoEditar));
        iconNoEdit = new ImageIcon(imgNoEdit.getImage().getScaledInstance(20, 20, 1));
        noeditar = new JButton(iconNoEdit);
        noeditar.setName("noeditar");
        
        String imgImprimir = "/imagen/impresora.png";
        imgImp = new ImageIcon(this.getClass().getResource(imgImprimir));
        iconImp = new ImageIcon(imgImp.getImage().getScaledInstance(20, 20, 1));
        Imprimir = new JButton(iconImp);
        Imprimir.setName("imprimir");
        
        String imgver = "/imagen/ver.png";
        imgVer = new ImageIcon(this.getClass().getResource(imgver));
        iconVer = new ImageIcon(imgVer.getImage().getScaledInstance(20, 20, 1));
        ver = new JButton(iconVer);
        ver.setName("ver");
        
        String imgcopiar = "/imagen/copia.png";
        imgCopiar = new ImageIcon(this.getClass().getResource(imgcopiar));
        iconCopiar = new ImageIcon(imgCopiar.getImage().getScaledInstance(20, 20, 1));
        copiar = new JButton(iconCopiar);
        copiar.setName("copiar");
        
        String imgEliminar = "/imagen/eliminar.png";
        imgElimi = new ImageIcon(this.getClass().getResource(imgEliminar));
        iconElimi = new ImageIcon(imgElimi.getImage().getScaledInstance(20, 20, 1));
        eliminar = new JButton(iconElimi);
        eliminar.setName("eliminar");
        
        tablaSolicitudes.setRowHeight(33);
        
        alinearTextoTabla();

    }

    public Solicitudes(JSONObject datosUsuario, int id_usuario) {
        initComponents();
        setLocationRelativeTo(null);
        this.datosUsuario = datosUsuario;
        this.id_usuario = id_usuario;
        listaSucur = new ArrayList();
        ListaAlmacen = new ArrayList();
        MostrarFiltrosSucursal();
        //labelPendientes.setText(SumarCantidades());

        String columnas[] = {"N°", "Id", "Sucursal", "Fecha", "monto", "Usuario", "Estado", "Entregar", "Editar", "Imprimir", "Ver", "Copiar", "Eliminar"};
        defaulttable = new DefaultTableModel(null, columnas);

        columnModel = tablaSolicitudes.getColumnModel();

        columnModel.getColumn(0).setPreferredWidth(30);

        columnModel.getColumn(1).setPreferredWidth(0);

        columnModel.getColumn(2).setPreferredWidth(130);
        columnModel.getColumn(3).setPreferredWidth(100);
        columnModel.getColumn(4).setPreferredWidth(80);
        columnModel.getColumn(5).setPreferredWidth(100);
        columnModel.getColumn(6).setPreferredWidth(100);
        columnModel.getColumn(7).setPreferredWidth(60);
        columnModel.getColumn(8).setPreferredWidth(60);
        columnModel.getColumn(9).setPreferredWidth(60);
        columnModel.getColumn(10).setPreferredWidth(60);
        columnModel.getColumn(11).setPreferredWidth(60);
        columnModel.getColumn(12).setPreferredWidth(60);

        tablaSolicitudes.setDefaultRenderer(Object.class, new RenderTable());
        
        String imgEntra = "/imagen/desbloqueado.png";
        imgEntre = new ImageIcon(this.getClass().getResource(imgEntra));
        iconEntre = new ImageIcon(imgEntre.getImage().getScaledInstance(15, 20, 1));
        entregar = new JButton(iconEntre);
        entregar.setName("entregar");
        
        String imgBloqueado = "/imagen/bloqueado.png";
        imgBloq = new ImageIcon(this.getClass().getResource(imgBloqueado));
        iconBloq = new ImageIcon(imgBloq.getImage().getScaledInstance(15, 20, 1));
        bloqueado = new JButton(iconBloq);
        
        String imgEditar = "/imagen/editar.png";
        imgEdit = new ImageIcon(this.getClass().getResource(imgEditar));
        iconEdit = new ImageIcon(imgEdit.getImage().getScaledInstance(15, 20, 1));
        editar = new JButton(iconEdit);
        editar.setName("editar");
        
        String imgNoEditar = "/imagen/noeditar.png";
        imgNoEdit = new ImageIcon(this.getClass().getResource(imgNoEditar));
        iconNoEdit = new ImageIcon(imgNoEdit.getImage().getScaledInstance(15, 20, 1));
        noeditar = new JButton(iconNoEdit);
        noeditar.setName("noeditar");
        
        String imgImprimir = "/imagen/impresora.png";
        imgImp = new ImageIcon(this.getClass().getResource(imgImprimir));
        iconImp = new ImageIcon(imgImp.getImage().getScaledInstance(15, 20, 1));
        Imprimir = new JButton(iconImp);
        Imprimir.setName("imprimir");
        
        String imgver = "/imagen/ver.png";
        imgVer = new ImageIcon(this.getClass().getResource(imgver));
        iconVer = new ImageIcon(imgVer.getImage().getScaledInstance(20, 20, 1));
        ver = new JButton(iconVer);
        ver.setName("ver");
        
        String imgcopiar = "/imagen/copia.png";
        imgCopiar = new ImageIcon(this.getClass().getResource(imgcopiar));
        iconCopiar = new ImageIcon(imgCopiar.getImage().getScaledInstance(20, 20, 1));
        copiar = new JButton(iconCopiar);
        copiar.setName("copiar");
        
        String imgEliminar = "/imagen/eliminar.png";
        imgElimi = new ImageIcon(this.getClass().getResource(imgEliminar));
        iconElimi = new ImageIcon(imgElimi.getImage().getScaledInstance(20, 20, 1));
        eliminar = new JButton(iconElimi);
        eliminar.setName("eliminar");
                    
        tablaSolicitudes.setRowHeight(33);
        grupoActual();
        alinearTextoTabla();
        
        Sincronizacion();
    }
    
    public void grupoActual(){
        ResultSet rs = null;
        int cont = 1;
        Date f = new Date();
        Long fe = f.getTime();
        java.sql.Date fechaAct = new java.sql.Date(fe);
        
        String consulta13 = "SELECT SO.ID,SO.ALMACEN,SO.FECHA,SO.USUARIO,SO.MONTO,SO.ACTIVO,SU.NOMBRE, U.NOMBRE_USUARIO \n" +
            "FROM SUCURSAL AS SU\n" +
            "INNER JOIN ALMACEN AS A ON A.ID_SUCURSAL = SU.ID\n" +
            "INNER JOIN SOLICITUD_REPOSICION AS SO ON SO.ALMACEN = A.ID\n" +
            "INNER JOIN USUARIO AS U ON U.ID = SO.USUARIO\n" +
            "WHERE date(SO.FECHA) = '"+fechaAct+"' AND SO.USUARIO = "+this.id_usuario+" AND SO.ELIMINADO = "+false+"\n" +
            "ORDER BY FECHA ASC";
        try{       
                rs = db.selectInFiltro(consulta13);
                while (rs.next()) {
                    int id = rs.getInt(1);
                    int id_almacen = rs.getInt(2);
                    java.sql.Date fecha = rs.getDate(3);
                    int id_usuario = rs.getInt(4);
                    double monto = rs.getDouble(5);
                    boolean activo = rs.getBoolean(6);
                    String nom_sucursal = rs.getString(7);
                    String nom_usuario = rs.getString(8);

                    if (activo == true) {
                        SinEnviar(cont++, id, nom_sucursal, fecha, monto, nom_usuario, "<html><span style='color:GREEN'>Abierto</span></html>", entregar, editar, Imprimir, ver, copiar, eliminar);
                    } else if (activo == false) {
                        enviado(cont++, id, nom_sucursal, fecha, monto, nom_usuario, "<html><span style='color:RED'>Cerrado</span></html>", bloqueado, noeditar, Imprimir, ver, copiar, eliminar);
                    }                                             
                }
        }catch(Exception e){
            System.out.println("Error al recoger los filtros: "+e);
        }
    }
    
    public void alinearTextoTabla(){
        TableCellRenderer rendererFromHeader = tablaSolicitudes.getTableHeader().getDefaultRenderer();
        JLabel headerLabel = (JLabel) rendererFromHeader;
        headerLabel.setHorizontalAlignment(JLabel.CENTER);
    }
    
    public void cerrarSolicitudes(){
        ArrayList<solicitudReposicion> arraySolicitud = new ArrayList();
        ArrayList<detalleSolicitudProducto> arrayDetalleP = new ArrayList();
        ArrayList<detalleSolicitudProductoBase> arrayDetallePB = new ArrayList();
        ArrayList<Integer> idsSolicitud = new ArrayList();
        ResultSet rs = null;
        
        
        try {
            
            String consultaSuc = "SELECT ID "
                    + "FROM SOLICITUD_REPOSICION_CIERRE ";
            rs = dbExp.seleccionar(consultaSuc);
            while(rs.next()){
                int idS = rs.getInt(1);

                idsSolicitud.add(idS);
            }
            
            int id = 0;
            for (int i = 0; i < idsSolicitud.size(); i++) {
                id = idsSolicitud.get(i);
                String consultaS = "SELECT ID,ALMACEN,USUARIO,ACTIVO,ELIMINADO,MONTO,NOMBRE_SUCURSAL,FECHA\n" +
                    "FROM SOLICITUD_REPOSICION_CIERRE\n" +
                    "WHERE ID = "+id;
                rs = dbExp.seleccionar(consultaS);

                while(rs.next()){
                    int idS = rs.getInt(1);
                    int almacen = rs.getInt(2);
                    int usuario = rs.getInt(3);
                    boolean activo = rs.getBoolean(4);
                    boolean eliminado = rs.getBoolean(5);
                    double monto = rs.getDouble(6);
                    String nomSucursal = rs.getString(7);
                    Timestamp fecha = rs.getTimestamp(8);

                    solicitudReposicion listaS = new solicitudReposicion(idS, almacen, usuario, fecha, activo, eliminado, null, null, monto, nomSucursal);
                    arraySolicitud.add(listaS);
                }

                String consultaDP = "SELECT ID,SOLICITUD,PRODUCTO,CANTIDAD,CREATEDAT,UPDATEDAT \n"
                        + "FROM DETALLE_SOLICITUD_PRODUCTO_CIERRE \n"
                        + "WHERE SOLICITUD = "+id;
                rs = dbExp.seleccionar(consultaDP);
                while (rs.next()) {                                    
                    int idDP = rs.getInt(1);
                    int solicitud = rs.getInt(2);
                    int producto = rs.getInt(3);
                    double cantidad = rs.getDouble(4);
                    java.sql.Date created = rs.getDate(5);
                    java.sql.Date updated = rs.getDate(6);

                    detalleSolicitudProducto listaDP = new detalleSolicitudProducto(idDP, solicitud, producto, cantidad, created, updated);
                    arrayDetalleP.add(listaDP);
                }
            }
            for (int i = 0; i < arrayDetalleP.size(); i++) {
                int idDP = arrayDetalleP.get(i).getId();

                String consultaDPB = "SELECT ID,DETALLE_SOLICITUD_PRODUCTO,PRODUCTO_BASE,CANTIDAD_IDEAL,CANTIDAD_REAL,TOTAL\n" +
                    "FROM DETALLE_SOLICITUD_PRODUCTO_BASE_CIERRE \n" +
                    "WHERE DETALLE_SOLICITUD_PRODUCTO = "+idDP;
                rs = dbExp.seleccionar(consultaDPB);
                while (rs.next()) {                                    
                    int idDPB = rs.getInt(1);
                    int detalleProducto = rs.getInt(2);
                    int productoBase = rs.getInt(3);
                    double cantidadIdeal = rs.getDouble(4);
                    double cantidadReal = rs.getDouble(5);
                    double total = rs.getDouble(6);

                    detalleSolicitudProductoBase detallePB = new detalleSolicitudProductoBase(idDPB, detalleProducto, productoBase, cantidadIdeal, cantidadReal, null, null, total);
                    arrayDetallePB.add(detallePB);
                }
            }

        } catch (Exception e) {
            System.out.println("Error al obtener los datos al cerrar la solicitud: "+e);
        }finally{
            try {
                rs.close();
                db.Conectar().close();
            } catch (Exception e) {
                System.out.println(e.getMessage());
            }
        }
        
        if (getConnectionStatus().equals("Online")) {

            int idAlma = 0;
            double tMonto = 0;
            double tTotalMonto = 0;
            for (int i = 0; i < arraySolicitud.size(); i++) {
                idAlma = arraySolicitud.get(i).getAlmacen();
            }
            for (int i = 0; i < arrayDetalleP.size(); i++) {
                int ids = arrayDetalleP.get(i).getId();
                int idPro = arrayDetalleP.get(i).getProducto();
                int cantidad = (int)arrayDetalleP.get(i).getCantidad();
                double monto = obtenerPrecioUnitario(idPro, idAlma);

                    if (tieneProductoBase(ids) == true) {
                        for (int j = 0; j < arrayDetallePB.size(); j++) {
                            int idss = arrayDetallePB.get(j).getDetalle_solicitud_producto();
                            int prodBase = arrayDetallePB.get(j).getProducto_base();
                            double precio = obtenerPrecioUnitarioPB(prodBase);

                            if (ids == idss) {
                                double cantidad_ideal = arrayDetallePB.get(j).getCantidad_ideal()*precio;
                                double total_real = arrayDetallePB.get(j).getCantidad_real()*precio;
                                tTotalMonto += total_real; 
                            }
                        }
                    }else{
                         tMonto += monto * cantidad;
                         System.out.println(monto);
                    }

            }

            try {
                double monto = tMonto + tTotalMonto;
                JSONObject datos = new JSONObject();
                JSONObject ObjAlmacen = new JSONObject();
                JSONObject idAlmacen = new JSONObject();
                JSONObject idSuc = new JSONObject();
                JSONObject idUser = new JSONObject();

                for (int i = 0; i < arraySolicitud.size(); i++) {
                    JSONObject listaProductosSolicitados = new JSONObject();
                    int idS = arraySolicitud.get(i).getId();
                    int almacen = arraySolicitud.get(i).getAlmacen();
                    Timestamp fecha = (Timestamp) arraySolicitud.get(i).getFecha();
                    boolean estado = arraySolicitud.get(i).isActivo();
                    int usuario = arraySolicitud.get(i).getUsuario();
                    String nombreSucur = arraySolicitud.get(i).getNombreSucursal();
                    int idSucursal = obtenerIdSucursal(nombreSucur);

                    datos.put("activo", true);    
                    idAlmacen.put("id", almacen);
                    datos.put("almacen", idAlmacen);
                    datos.put("fecha", fecha);
                    datos.put("id", idS);

                    idAlmacen.put("id", almacen);
                    listaProductosSolicitados.put("almacen", idAlmacen);
                    listaProductosSolicitados.put("fecha", fecha);                        
                    listaProductosSolicitados.put("identificador", idS);

                    JSONArray arrayProducto;
                    JSONArray arrayListaProductos ;
                    JSONArray arraySolicitudesProductos ;

                     arrayProducto = new JSONArray();
                     arrayListaProductos = new JSONArray();
                     arraySolicitudesProductos = new JSONArray();
                    for (int j = 0; j < arrayDetalleP.size(); j++) {
                        JSONObject producto ;
                        JSONObject idAlmacenP ;
                        JSONObject idProductoBase;
                        JSONObject idEmpresa ;
                        JSONObject productoSolicitudBase;
                          producto = new JSONObject();
                         idAlmacenP = new JSONObject();
                         idProductoBase = new JSONObject();
                         idEmpresa = new JSONObject();
                         productoSolicitudBase = new JSONObject();
                        //JSONObject solicitudesProductos = new JSONObject();
                        int empresa = obtenerIdEmpresa();
                        int idP = arrayDetalleP.get(j).getId();
                        double cantidad = arrayDetalleP.get(j).getCantidad();
                        int idProducto = arrayDetalleP.get(j).getProducto();
                        String nombreProducto = obtenerNombreProducto(idProducto, almacen);

                       // solicitudesProductos.put("", listaSucur)
                        if (estaActivoInventario(idProducto, almacen) == true) {
                            String nombreAlmacen = obtenerNombreAlmacen(almacen);
                            idAlmacenP.put("id", almacen);
                            idAlmacenP.put("id_sucursal", idSuc);
                            idAlmacenP.put("nombre", nombreAlmacen);
                            producto.put("almacen", idAlmacenP);
                            producto.put("cantidad_ideal", cantidad);
                            producto.put("cantidad_real", cantidad);
                            producto.put("estado", estado);
                            producto.put("id", idP);
                            producto.put("id_detalle_solicitud_producto", idP);

                            idProductoBase.put("id", idProducto);
                            idProductoBase.put("id_empresa", empresa);
                            idProductoBase.put("nombre", nombreProducto);

                            producto.put("id_producto_base", idProductoBase);
                            producto.put("monto", monto);

                            productoSolicitudBase.put("id", idProducto);
                            productoSolicitudBase.put("id_empresa", empresa);
                            productoSolicitudBase.put("nombre", nombreProducto);

                            producto.put("productoSolicitudBase", productoSolicitudBase);
                            producto.put("solicitud", idS);
                            producto.put("total", cantidad);
                            producto.put("totalMostrar", 0);

                            arrayProducto.put(producto);
                            listaProductosSolicitados.put("productos", arrayProducto);


                        }else{
                            Object[] a = {};
                            listaProductosSolicitados.put("productos",a);
                        }   

                        for (int k = 0; k < arrayDetallePB.size(); k++) {

                            producto = new JSONObject();
                         idAlmacenP = new JSONObject();
                         idProductoBase = new JSONObject();
                         idEmpresa = new JSONObject();
                         productoSolicitudBase = new JSONObject();
                            int idPB = arrayDetallePB.get(k).getId();
                            int detalleSolicitudProducto = arrayDetallePB.get(k).getDetalle_solicitud_producto();
                            double cantidadIdeal = arrayDetallePB.get(k).getCantidad_ideal();
                            double cantidadReal = arrayDetallePB.get(k).getCantidad_real();
                            int productoBase = arrayDetallePB.get(k).getProducto_base();
                            String nombreProdBase = obtenerNombreProductoBase(productoBase);
                            double precioProdBase = obtenerPrecioUnitarioPB(productoBase);
                            if (idP == detalleSolicitudProducto) {

                                 if (estaActivoInventario(idProducto, almacen) == true) {
                                    idAlmacenP.put("id", almacen);
                                    producto.put("almacen", idAlmacenP);
                                    producto.put("cantidad_ideal", cantidadIdeal);
                                    producto.put("cantidad_real", cantidadReal);
                                    producto.put("estado", estado);
                                    producto.put("id", idP);
                                    producto.put("id_detalle_solicitud_producto", idP);

                                    producto.put("id_producto_base", productoBase);
                                    producto.put("monto", monto);

                                    productoSolicitudBase.put("id", productoBase);
                                    productoSolicitudBase.put("id_empresa", empresa);                          
                                    productoSolicitudBase.put("nombre", nombreProdBase);

                                    producto.put("productoSolicitudBase", productoSolicitudBase);
                                    producto.put("solicitud", idS);
                                    double total = cantidadIdeal + cantidadReal;
                                    producto.put("total", total);
                                    double totalbs = total * precioProdBase;
                                    producto.put("totalbs", totalbs);
                                    producto.put("totalMostrar", total);
                                    producto.put("totalSumar", total);

                                    arrayProducto.put(producto);
                                    listaProductosSolicitados.put("productos", arrayProducto);
                                }else{
                                    Object[] a = {};
                                    listaProductosSolicitados.put("productos",a);
                                }   
                            }
                        }
                    }
                    idUser.put("id", usuario);
                    idSuc.put("id", idSucursal);
                    listaProductosSolicitados.put("sucursal", idSuc);
                    listaProductosSolicitados.put("usuario", idUser);
                    datos.put("listaProductosSolicitados", listaProductosSolicitados);
                }
                int idEmp = obtenerIdEmpresa();
                String url = "/productos-operaciones/empresa/"+idEmp+"/cerrar";
                JSONObject res = RestServer.postJSONdata(url, datos); 
                //JOptionPane.showMessageDialog(null, "Se cerraron las solicitudes");
                
            } catch (Exception e) {
                System.out.println("Error al cerrar la solicitud en el json: " +e);
            }
        }else{
            JOptionPane.showMessageDialog(null, "No se puede conectar al AGIL SERVIDOR intente mas tarde");
        }
    }
    
    public String obtenerNombreUsuario(int id){
        ResultSet rs = null;
        String result = "";
        String consulta = "SELECT NOMBRE_USUARIO \n" +
            "FROM USUARIO\n" +
            "WHERE ID = "+id;
        try {
            rs = db.seleccionar(consulta);
            while(rs.next()){
                result = rs.getString(1);
            }
        } catch (Exception e) {
            System.out.println("Error al obtener el usuario "+e);
        }
        
        return result ;
    }

    /**
     * This method is called from within the constructor to initialize the form.
     * WARNING: Do NOT modify this code. The content of this method is always
     * regenerated by the Form Editor.
     */
    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        jLabel1 = new javax.swing.JLabel();
        jbuttonAgregar = new javax.swing.JButton();
        jLabel2 = new javax.swing.JLabel();
        jLabel3 = new javax.swing.JLabel();
        jDateDesde = new com.toedter.calendar.JDateChooser();
        jDateHasta = new com.toedter.calendar.JDateChooser();
        jLabel4 = new javax.swing.JLabel();
        jPanel1 = new javax.swing.JPanel();
        jLabel5 = new javax.swing.JLabel();
        jLabel6 = new javax.swing.JLabel();
        jPanel2 = new javax.swing.JPanel();
        jLabel7 = new javax.swing.JLabel();
        jLabel8 = new javax.swing.JLabel();
        jComboSucursal = new javax.swing.JComboBox<>();
        jComboAlmacen = new javax.swing.JComboBox<>();
        jPanel3 = new javax.swing.JPanel();
        jLabel10 = new javax.swing.JLabel();
        jComboActivo = new javax.swing.JComboBox<>();
        jButtonFiltro = new javax.swing.JButton();
        jPanel4 = new javax.swing.JPanel();
        jLabel9 = new javax.swing.JLabel();
        jScrollPane1 = new javax.swing.JScrollPane();
        tablaSolicitudes = new JTable(){
            public boolean isCellEditable(int rowIndex, int colIndex) {
                return colIndex != 0 && colIndex != 1 && colIndex != 2
                && colIndex != 3 && colIndex != 4 
                && colIndex != 5 && colIndex != 6
                && colIndex != 7 && colIndex != 8
                && colIndex != 9 && colIndex != 10
                && colIndex != 11 && colIndex != 12;
            }
        };
        btnExportar = new javax.swing.JButton();
        btnSincronizar = new javax.swing.JButton();
        jbuttonAgregar1 = new javax.swing.JButton();

        setDefaultCloseOperation(javax.swing.WindowConstants.EXIT_ON_CLOSE);

        jLabel1.setFont(new java.awt.Font("Tahoma", 0, 14)); // NOI18N
        jLabel1.setForeground(new java.awt.Color(51, 51, 255));
        jLabel1.setText("SOLICITUD DE VIVERES");

        jbuttonAgregar.setForeground(new java.awt.Color(51, 51, 255));
        jbuttonAgregar.setIcon(new javax.swing.ImageIcon(getClass().getResource("/imagen/addition.png"))); // NOI18N
        jbuttonAgregar.setText("Agregar");
        jbuttonAgregar.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jbuttonAgregarActionPerformed(evt);
            }
        });

        jLabel2.setText("FILTRO DE SOLICITUDES");

        jLabel3.setText("PERIODO");

        jLabel4.setText("FILTRO");

        jPanel1.setBackground(new java.awt.Color(153, 153, 255));

        jLabel5.setText("Desde");

        jLabel6.setText("Hasta");

        javax.swing.GroupLayout jPanel1Layout = new javax.swing.GroupLayout(jPanel1);
        jPanel1.setLayout(jPanel1Layout);
        jPanel1Layout.setHorizontalGroup(
            jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel1Layout.createSequentialGroup()
                .addGap(103, 103, 103)
                .addComponent(jLabel5, javax.swing.GroupLayout.PREFERRED_SIZE, 53, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(114, 114, 114)
                .addComponent(jLabel6)
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );
        jPanel1Layout.setVerticalGroup(
            jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, jPanel1Layout.createSequentialGroup()
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jLabel5)
                    .addComponent(jLabel6))
                .addContainerGap())
        );

        jPanel2.setBackground(new java.awt.Color(153, 153, 255));

        jLabel7.setText("Sucursal");

        jLabel8.setText("Almacen");

        javax.swing.GroupLayout jPanel2Layout = new javax.swing.GroupLayout(jPanel2);
        jPanel2.setLayout(jPanel2Layout);
        jPanel2Layout.setHorizontalGroup(
            jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel2Layout.createSequentialGroup()
                .addGap(108, 108, 108)
                .addComponent(jLabel7)
                .addGap(124, 124, 124)
                .addComponent(jLabel8)
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );
        jPanel2Layout.setVerticalGroup(
            jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel2Layout.createSequentialGroup()
                .addContainerGap()
                .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jLabel7)
                    .addComponent(jLabel8))
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );

        jComboSucursal.setModel(new javax.swing.DefaultComboBoxModel<>(new String[] { "Todo" }));
        jComboSucursal.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jComboSucursalActionPerformed(evt);
            }
        });

        jComboAlmacen.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jComboAlmacenActionPerformed(evt);
            }
        });

        jPanel3.setBackground(new java.awt.Color(153, 153, 255));

        jLabel10.setText("Estado");

        javax.swing.GroupLayout jPanel3Layout = new javax.swing.GroupLayout(jPanel3);
        jPanel3.setLayout(jPanel3Layout);
        jPanel3Layout.setHorizontalGroup(
            jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel3Layout.createSequentialGroup()
                .addGap(109, 109, 109)
                .addComponent(jLabel10)
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );
        jPanel3Layout.setVerticalGroup(
            jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, jPanel3Layout.createSequentialGroup()
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                .addComponent(jLabel10)
                .addContainerGap())
        );

        jComboActivo.setModel(new javax.swing.DefaultComboBoxModel<>(new String[] { "Todo", "Abierto", "Cerrado" }));
        jComboActivo.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jComboActivoActionPerformed(evt);
            }
        });

        jButtonFiltro.setForeground(new java.awt.Color(51, 51, 255));
        jButtonFiltro.setText("FILTRAR");
        jButtonFiltro.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jButtonFiltroActionPerformed(evt);
            }
        });

        jPanel4.setBackground(new java.awt.Color(51, 51, 255));

        jLabel9.setForeground(new java.awt.Color(255, 255, 255));
        jLabel9.setText("Lista de Solicitudes");

        javax.swing.GroupLayout jPanel4Layout = new javax.swing.GroupLayout(jPanel4);
        jPanel4.setLayout(jPanel4Layout);
        jPanel4Layout.setHorizontalGroup(
            jPanel4Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel4Layout.createSequentialGroup()
                .addContainerGap()
                .addComponent(jLabel9, javax.swing.GroupLayout.PREFERRED_SIZE, 135, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );
        jPanel4Layout.setVerticalGroup(
            jPanel4Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addComponent(jLabel9, javax.swing.GroupLayout.DEFAULT_SIZE, 36, Short.MAX_VALUE)
        );

        tablaSolicitudes.setModel(new javax.swing.table.DefaultTableModel(
            new Object [][] {

            },
            new String [] {
                "N°", "Id", "Sucursal", "Fecha", "Hora", "Monto", "Usuario", "Estado", "Entregar", "Editar", "Imprimir", "Ver", "Eliminar"
            }
        ) {
            boolean[] canEdit = new boolean [] {
                false, false, false, false, false, false, false, false, false, false, false, false, false
            };

            public boolean isCellEditable(int rowIndex, int columnIndex) {
                return canEdit [columnIndex];
            }
        });
        tablaSolicitudes.setAutoResizeMode(javax.swing.JTable.AUTO_RESIZE_OFF);
        tablaSolicitudes.setFillsViewportHeight(true);
        tablaSolicitudes.addMouseListener(new java.awt.event.MouseAdapter() {
            public void mouseClicked(java.awt.event.MouseEvent evt) {
                tablaSolicitudesMouseClicked(evt);
            }
        });
        jScrollPane1.setViewportView(tablaSolicitudes);
        if (tablaSolicitudes.getColumnModel().getColumnCount() > 0) {
            tablaSolicitudes.getColumnModel().getColumn(0).setPreferredWidth(30);
            tablaSolicitudes.getColumnModel().getColumn(1).setMinWidth(0);
            tablaSolicitudes.getColumnModel().getColumn(1).setPreferredWidth(0);
            tablaSolicitudes.getColumnModel().getColumn(1).setMaxWidth(0);
            tablaSolicitudes.getColumnModel().getColumn(2).setMinWidth(130);
            tablaSolicitudes.getColumnModel().getColumn(2).setPreferredWidth(130);
            tablaSolicitudes.getColumnModel().getColumn(2).setMaxWidth(130);
            tablaSolicitudes.getColumnModel().getColumn(3).setPreferredWidth(100);
            tablaSolicitudes.getColumnModel().getColumn(4).setPreferredWidth(100);
            tablaSolicitudes.getColumnModel().getColumn(5).setPreferredWidth(100);
            tablaSolicitudes.getColumnModel().getColumn(6).setPreferredWidth(100);
            tablaSolicitudes.getColumnModel().getColumn(7).setPreferredWidth(100);
            tablaSolicitudes.getColumnModel().getColumn(8).setPreferredWidth(100);
            tablaSolicitudes.getColumnModel().getColumn(9).setPreferredWidth(100);
            tablaSolicitudes.getColumnModel().getColumn(10).setPreferredWidth(100);
            tablaSolicitudes.getColumnModel().getColumn(11).setPreferredWidth(100);
            tablaSolicitudes.getColumnModel().getColumn(12).setPreferredWidth(100);
        }

        btnExportar.setForeground(new java.awt.Color(51, 51, 255));
        btnExportar.setIcon(new javax.swing.ImageIcon(getClass().getResource("/imagen/exportar.png"))); // NOI18N
        btnExportar.setText("Exportar");
        btnExportar.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                btnExportarActionPerformed(evt);
            }
        });

        btnSincronizar.setForeground(new java.awt.Color(51, 51, 255));
        btnSincronizar.setIcon(new javax.swing.ImageIcon(getClass().getResource("/imagen/sincronizar.png"))); // NOI18N
        btnSincronizar.setText("Sincronizar");
        btnSincronizar.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                btnSincronizarActionPerformed(evt);
            }
        });

        jbuttonAgregar1.setForeground(new java.awt.Color(51, 51, 255));
        jbuttonAgregar1.setText("Salir");
        jbuttonAgregar1.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jbuttonAgregar1ActionPerformed(evt);
            }
        });

        javax.swing.GroupLayout layout = new javax.swing.GroupLayout(getContentPane());
        getContentPane().setLayout(layout);
        layout.setHorizontalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(layout.createSequentialGroup()
                .addGap(119, 119, 119)
                .addComponent(jComboActivo, javax.swing.GroupLayout.PREFERRED_SIZE, 124, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(0, 717, Short.MAX_VALUE))
            .addGroup(layout.createSequentialGroup()
                .addContainerGap()
                .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, layout.createSequentialGroup()
                        .addComponent(jLabel1, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                        .addComponent(jbuttonAgregar1, javax.swing.GroupLayout.PREFERRED_SIZE, 63, javax.swing.GroupLayout.PREFERRED_SIZE))
                    .addComponent(jPanel3, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                    .addComponent(jPanel2, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                    .addComponent(jPanel1, javax.swing.GroupLayout.Alignment.TRAILING, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                    .addComponent(jPanel4, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                    .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, layout.createSequentialGroup()
                        .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(jLabel2, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                            .addGroup(layout.createSequentialGroup()
                                .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addGroup(layout.createSequentialGroup()
                                        .addComponent(jLabel3, javax.swing.GroupLayout.PREFERRED_SIZE, 87, javax.swing.GroupLayout.PREFERRED_SIZE)
                                        .addGap(18, 18, 18)
                                        .addComponent(jDateDesde, javax.swing.GroupLayout.PREFERRED_SIZE, 120, javax.swing.GroupLayout.PREFERRED_SIZE)
                                        .addGap(45, 45, 45)
                                        .addComponent(jDateHasta, javax.swing.GroupLayout.PREFERRED_SIZE, 120, javax.swing.GroupLayout.PREFERRED_SIZE))
                                    .addGroup(layout.createSequentialGroup()
                                        .addComponent(jLabel4, javax.swing.GroupLayout.PREFERRED_SIZE, 98, javax.swing.GroupLayout.PREFERRED_SIZE)
                                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                                        .addComponent(jComboSucursal, javax.swing.GroupLayout.PREFERRED_SIZE, 120, javax.swing.GroupLayout.PREFERRED_SIZE)
                                        .addGap(42, 42, 42)
                                        .addComponent(jComboAlmacen, javax.swing.GroupLayout.PREFERRED_SIZE, 126, javax.swing.GroupLayout.PREFERRED_SIZE))
                                    .addGroup(layout.createSequentialGroup()
                                        .addComponent(jbuttonAgregar)
                                        .addGap(33, 33, 33)
                                        .addComponent(btnExportar)
                                        .addGap(32, 32, 32)
                                        .addComponent(btnSincronizar)))
                                .addGap(0, 450, Short.MAX_VALUE)))
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                        .addComponent(jButtonFiltro, javax.swing.GroupLayout.PREFERRED_SIZE, 90, javax.swing.GroupLayout.PREFERRED_SIZE))
                    .addComponent(jScrollPane1))
                .addContainerGap())
        );
        layout.setVerticalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(layout.createSequentialGroup()
                .addContainerGap()
                .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jLabel1, javax.swing.GroupLayout.PREFERRED_SIZE, 30, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(jbuttonAgregar1, javax.swing.GroupLayout.PREFERRED_SIZE, 48, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jbuttonAgregar, javax.swing.GroupLayout.PREFERRED_SIZE, 48, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(btnExportar, javax.swing.GroupLayout.PREFERRED_SIZE, 48, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(btnSincronizar, javax.swing.GroupLayout.PREFERRED_SIZE, 48, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jLabel2, javax.swing.GroupLayout.PREFERRED_SIZE, 27, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(jButtonFiltro, javax.swing.GroupLayout.PREFERRED_SIZE, 27, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jPanel1, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(jLabel3, javax.swing.GroupLayout.Alignment.TRAILING, javax.swing.GroupLayout.PREFERRED_SIZE, 24, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(jDateDesde, javax.swing.GroupLayout.Alignment.TRAILING, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(jDateHasta, javax.swing.GroupLayout.Alignment.TRAILING, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jPanel2, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jLabel4, javax.swing.GroupLayout.PREFERRED_SIZE, 24, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(jComboSucursal, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(jComboAlmacen, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jPanel3, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addComponent(jComboActivo, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(28, 28, 28)
                .addComponent(jPanel4, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jScrollPane1, javax.swing.GroupLayout.PREFERRED_SIZE, 190, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addContainerGap(17, Short.MAX_VALUE))
        );

        pack();
    }// </editor-fold>//GEN-END:initComponents

    private void jbuttonAgregarActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jbuttonAgregarActionPerformed
        AgregarProducto agregar;

        try {
            if (getConnectionStatus() == "Online") {
                agregar = new AgregarProducto(this.datosUsuario, this.id_usuario);
                agregar.setVisible(true);
                //dispose();
            } else if (getConnectionStatus() == "Offline") {
                agregar = new AgregarProducto(this.id_usuario);
                agregar.setVisible(true);
                //dispose();
            }
        } catch (Exception e) {
            System.out.println("Error al abrir agregar productos "+e);
        }
    }//GEN-LAST:event_jbuttonAgregarActionPerformed

    private void jComboSucursalActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jComboSucursalActionPerformed
        String item = "";
        String nombre_sucursal = "";
        int id_sucursal = 0;
        item = (String) jComboSucursal.getSelectedItem().toString();
        limpiarListas(listaSucur);

        if (item.equals("Todo")) {
            nombre_sucursal = item;
            id_sucursal = 0;
            Sucursal sucursal = new Sucursal(id_sucursal, nombre_sucursal, 0);
            listaSucur.add(sucursal);

        } else {
            for (int i = 0; i < db.SeleccionarSucursalPorNombre(item).size(); i++) {
                nombre_sucursal = db.SeleccionarSucursalPorNombre(item).get(i).getNombre();
                id_sucursal = db.SeleccionarSucursalPorNombre(item).get(i).getId();
                Sucursal sucursal = new Sucursal(id_sucursal, nombre_sucursal, 0);
                listaSucur.add(sucursal);
            }

        }

        MostrarFiltroAlmacen(nombre_sucursal);
    }//GEN-LAST:event_jComboSucursalActionPerformed

    private void jButtonFiltroActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jButtonFiltroActionPerformed
        String consulta = "";
        String consulta2 = "";
        String consulta3 = "";
        ResultSet rs = null;
        ResultSet rsId_A = null;
        ResultSet rsNom_Usu = null;
        ResultSet rsNom_Suc = null;
        Date fechaDesde = jDateDesde.getDate();
        Date fechaHasta = jDateHasta.getDate();
        int id = 0;
        int id_almacen = 0;
        Date fecha;
        int id_usuario = 0;
        double monto = 0.0;
        boolean activo = false;
        String nom_sucursal = "";
        String nom_usuario = "";

        int id_sucursal = 0;
        String nombre_sucur = "";
        String nombre_alma = "";

        int cont = 1;
        defaulttable.setRowCount(0);

        String d1 = ((JTextField) jDateDesde.getDateEditor().getUiComponent()).getText();
        String d2 = ((JTextField) jDateHasta.getDateEditor().getUiComponent()).getText();
        try {
            for (int i = 0; i < listaSucur.size(); i++) {
                nombre_sucur = listaSucur.get(i).getNombre();
                id_sucursal = listaSucur.get(i).getId();
            }

            for (int i = 0; i < ListaAlmacen.size(); i++) {
                nombre_alma = ListaAlmacen.get(i).getNombre();
                id_almacen = ListaAlmacen.get(i).getId();
            }
            defaulttable.setRowCount(0);
            estado = jComboActivo.getSelectedItem().toString();
            
            if ((!d1.toString().equals("")) && (d2.toString().equals("")) && (nombre_sucur == "Todo") && (nombre_alma == "Todo") && (estado == "Todo")) {
                long fh = fechaDesde.getTime();
                java.sql.Date desde = new java.sql.Date(fh);

                consulta = "SELECT S.ID,S.ALMACEN,S.FECHA, S.USUARIO,S.MONTO,S.ACTIVO,SU.NOMBRE, U.NOMBRE_USUARIO \n" +
                    "FROM SOLICITUD_REPOSICION S\n" +
                    "INNER JOIN LOGIN L ON L.ID = S.USUARIO \n" +
                    "INNER JOIN ALMACEN AS A ON A.ID = S.ALMACEN\n" +
                    "INNER JOIN SUCURSAL AS SU ON SU.ID = A.ID_SUCURSAL\n" +
                    "INNER JOIN USUARIO AS U ON U.ID = S.USUARIO\n" +
                    "WHERE date(S.FECHA) >= '"+desde+"' AND S.USUARIO= "+this.id_usuario+" AND S.ELIMINADO = "+false+"\n"+
                    "ORDER BY FECHA ASC ";
                rs = db.selectInFiltro(consulta);
                while (rs.next()) {
                    id = rs.getInt(1);
                    id_almacen = rs.getInt(2);
                    fecha = rs.getDate(3);
                    id_usuario = rs.getInt(4);
                    monto = rs.getDouble(5);
                    activo = rs.getBoolean(6);
                    nom_sucursal = rs.getString(7);
                    nom_usuario = rs.getString(8);

                    if (activo == true) {
                        SinEnviar(cont++, id, nom_sucursal, fecha, monto, nom_usuario, "<html><span style='color:GREEN'>Abierto</span></html>", entregar, editar, Imprimir, ver, copiar, eliminar);
                    } else if (activo == false) {
                        enviado(cont++, id, nom_sucursal, fecha, monto, nom_usuario, "<html><span style='color:RED'>Cerrado</span></html>", bloqueado, noeditar, Imprimir, ver, copiar, eliminar);
                    }                    
                }
            } else if (d1.toString().equals("") && !d2.toString().equals("") && (nombre_sucur == "Todo") && (nombre_alma == "Todo") && (estado == "Todo")) {

                long fh = fechaHasta.getTime();
                java.sql.Date hasta = new java.sql.Date(fh);

                consulta2 = "SELECT S.ID,S.ALMACEN,S.FECHA, S.USUARIO,S.MONTO,S.ACTIVO,SU.NOMBRE, U.NOMBRE_USUARIO \n" +
                    "FROM SOLICITUD_REPOSICION S\n" +
                    "INNER JOIN LOGIN L ON L.ID = S.USUARIO \n" +
                    "INNER JOIN ALMACEN AS A ON A.ID = S.ALMACEN\n" +
                    "INNER JOIN SUCURSAL AS SU ON SU.ID = A.ID_SUCURSAL\n" +
                    "INNER JOIN USUARIO AS U ON U.ID = S.USUARIO\n" +
                    "WHERE date(S.FECHA) <= '"+hasta+"' AND S.USUARIO= "+this.id_usuario+" AND S.ELIMINADO = "+false+"\n"+
                    "ORDER BY FECHA ASC ";
                rs = db.selectInFiltro(consulta2);
                while (rs.next()) {
                    id = rs.getInt(1);
                    id_almacen = rs.getInt(2);
                    fecha = rs.getDate(3);
                    id_usuario = rs.getInt(4);
                    monto = rs.getDouble(5);
                    activo = rs.getBoolean(6);
                    nom_sucursal = rs.getString(7);
                    nom_usuario = rs.getString(8);

                    if (activo == true) {
                        SinEnviar(cont++, id, nom_sucursal, fecha, monto, nom_usuario, "<html><span style='color:GREEN'>Abierto</span></html>", entregar, editar, Imprimir, ver, copiar, eliminar);
                    } else if (activo == false) {
                        enviado(cont++, id, nom_sucursal, fecha, monto, nom_usuario, "<html><span style='color:RED'>Cerrado</span></html>", bloqueado, noeditar, Imprimir, ver, copiar, eliminar);
                    }                                        
                }
            }else if ((!d1.toString().equals("")) && (d2.toString().equals("")) && (nombre_sucur == "Todo") && (nombre_alma == "Todo") && (estado != "Todo")) {
                long fh = fechaDesde.getTime();
                java.sql.Date desde = new java.sql.Date(fh);
                boolean tipoEstado = (estado == "Abierto") ? true : false;

               consulta3 = "SELECT S.ID,S.ALMACEN,S.FECHA, S.USUARIO,S.MONTO,S.ACTIVO,SU.NOMBRE, U.NOMBRE_USUARIO \n" +
                    "FROM SOLICITUD_REPOSICION S\n" +
                    "INNER JOIN LOGIN L ON L.ID = S.USUARIO \n" +
                    "INNER JOIN ALMACEN AS A ON A.ID = S.ALMACEN\n" +
                    "INNER JOIN SUCURSAL AS SU ON SU.ID = A.ID_SUCURSAL\n" +
                    "INNER JOIN USUARIO AS U ON U.ID = S.USUARIO\n" +
                    "WHERE date(S.FECHA) >= '"+desde+"' AND S.USUARIO= "+this.id_usuario+" AND ACTIVO = "+tipoEstado+" AND S.ELIMINADO = "+false+" \n"+
                    "ORDER BY FECHA ASC ";
                rs = db.selectInFiltro(consulta3);
                while (rs.next()) {
                    id = rs.getInt(1);
                    id_almacen = rs.getInt(2);
                    fecha = rs.getDate(3);
                    id_usuario = rs.getInt(4);
                    monto = rs.getDouble(5);
                    activo = rs.getBoolean(6);
                    nom_sucursal = rs.getString(7);
                    nom_usuario = rs.getString(8);

                    if (activo == true) {
                        SinEnviar(cont++, id, nom_sucursal, fecha, monto, nom_usuario, "<html><span style='color:GREEN'>Abierto</span></html>", entregar, editar, Imprimir, ver, copiar, eliminar);
                    } else if (activo == false) {
                        enviado(cont++, id, nom_sucursal, fecha, monto, nom_usuario, "<html><span style='color:RED'>Cerrado</span></html>", bloqueado, noeditar, Imprimir, ver, copiar, eliminar);
                    }
                }
            }else if ((!d1.toString().equals("")) && (d2.toString().equals("")) && (nombre_sucur != "Todo") && (nombre_alma == "Todo") && (estado == "Todo")) {
                long fh = fechaDesde.getTime();
                java.sql.Date desde = new java.sql.Date(fh);
                int id_alma = 0;
                // boolean tipoEstado = (estado == "Abierto") ? true : false;
               

                String consulta4 = "SELECT SO.ID,SO.ALMACEN,SO.FECHA,SO.USUARIO,SO.MONTO,SO.ACTIVO,SU.NOMBRE, U.NOMBRE_USUARIO \n" +
                    "FROM SUCURSAL AS SU\n" +
                    "INNER JOIN ALMACEN AS A ON A.ID_SUCURSAL = SU.ID\n" +
                    "INNER JOIN SOLICITUD_REPOSICION AS SO ON SO.ALMACEN = A.ID\n" +
                    "INNER JOIN USUARIO AS U ON U.ID = SO.USUARIO\n" +
                    "WHERE SU.ID = "+id_sucursal+" AND SO.FECHA >= '"+desde+"' AND SO.USUARIO = "+this.id_usuario+" AND S.ELIMINADO = "+false+" \n" +
                    "ORDER BY date(FECHA) ASC";
                rs = db.selectInFiltro(consulta4);
                while (rs.next()) {
                    id = rs.getInt(1);
                    id_almacen = rs.getInt(2);
                    fecha = rs.getDate(3);
                    id_usuario = rs.getInt(4);
                    monto = rs.getDouble(5);
                    activo = rs.getBoolean(6);
                    nom_sucursal = rs.getString(7);
                    nom_usuario = rs.getString(8);

                    if (activo == true) {
                        SinEnviar(cont++, id, nom_sucursal, fecha, monto, nom_usuario, "<html><span style='color:GREEN'>Abierto</span></html>", entregar, editar, Imprimir, ver, copiar, eliminar);
                    } else if (activo == false) {
                        enviado(cont++, id, nom_sucursal, fecha, monto, nom_usuario, "<html><span style='color:GREEN'>Cerrado</span></html>", bloqueado, noeditar, Imprimir, ver, copiar, eliminar);
                    }                  
                }            
            }else if ((!d1.toString().equals("")) && (d2.toString().equals("")) && (nombre_sucur != "Todo") && (nombre_alma != "Todo") && (estado == "Todo")) {
                long fh = fechaDesde.getTime();
                java.sql.Date desde = new java.sql.Date(fh);
                // boolean tipoEstado = (estado == "Abierto") ? true : false;
                
                String consulta5 = "SELECT S.ID,S.ALMACEN,S.FECHA, S.USUARIO,S.MONTO,S.ACTIVO,SU.NOMBRE, U.NOMBRE_USUARIO \n" +
                    "FROM SOLICITUD_REPOSICION S \n" +
                    "INNER JOIN LOGIN L ON L.ID = S.USUARIO \n" +
                    "INNER JOIN ALMACEN AS A ON A.ID = S.ALMACEN\n" +
                    "INNER JOIN USUARIOSUCURSAL AS SU ON SU.ID = A.ID_SUCURSAL\n" +
                    "INNER JOIN  AS U ON U.ID = S.USUARIO\n" +
                    "WHERE date(S.FECHA) >= '"+desde+"' AND date(S.USUARIO) = "+this.id_usuario+" AND S.ALMACEN = "+id_almacen+" AND S.ELIMINADO = "+false+" \n" +
                    "ORDER BY FECHA ASC ";
                rs = db.selectInFiltro(consulta5);
                while (rs.next()) {
                    id = rs.getInt(1);
                    id_almacen = rs.getInt(2);
                    fecha = rs.getDate(3);
                    id_usuario = rs.getInt(4);
                    monto = rs.getDouble(5);
                    activo = rs.getBoolean(6);
                    nom_sucursal = rs.getString(7);
                    nom_usuario = rs.getString(8);
                  
                    if (activo == true) {
                        SinEnviar(cont++, id, nom_sucursal, fecha, monto, nom_usuario, "<html><span style='color:GREEN'>Abierto</span></html>", entregar, editar, Imprimir, ver, copiar, eliminar);
                    } else if (activo == false) {
                        enviado(cont++, id, nom_sucursal, fecha, monto, nom_usuario, "<html><span style='color:GREEN'>Cerrado</span></html>", bloqueado, noeditar, Imprimir, ver, copiar, eliminar);
                    }        
                }
            }else if ((!d1.toString().equals("")) && (d2.toString().equals("")) && (nombre_sucur != "Todo") && (nombre_alma != "Todo") && (estado != "Todo")) {
                long fh = fechaDesde.getTime();
                java.sql.Date desde = new java.sql.Date(fh);
                boolean tipoEstado = (estado == "Abierto") ? true : false;

                String consulta6 = "SELECT S.ID,S.ALMACEN,S.FECHA, S.USUARIO,S.MONTO,S.ACTIVO,SU.NOMBRE, U.NOMBRE_USUARIO \n" +
                    "FROM SOLICITUD_REPOSICION S \n" +
                    "INNER JOIN LOGIN L ON L.ID = S.USUARIO \n" +
                    "INNER JOIN ALMACEN AS A ON A.ID = S.ALMACEN\n" +
                    "INNER JOIN SUCURSAL AS SU ON SU.ID = A.ID_SUCURSAL\n" +
                    "INNER JOIN USUARIO AS U ON U.ID = S.USUARIO\n" +
                    "WHERE date(S.FECHA) >= '"+desde+"' AND date(S.USUARIO) = "+this.id_usuario+" AND S.ALMACEN = "+id_almacen+"  AND ACTIVO = "+tipoEstado+" AND S.ELIMINADO = "+false+"\n" +
                    "ORDER BY FECHA ASC ";
                rs = db.selectInFiltro(consulta6);
                while (rs.next()) {
                    id = rs.getInt(1);
                    id_almacen = rs.getInt(2);
                    fecha = rs.getDate(3);
                    id_usuario = rs.getInt(4);
                    monto = rs.getDouble(5);
                    activo = rs.getBoolean(6);
                    nom_sucursal = rs.getString(7);
                    nom_usuario = rs.getString(8);
                        
                    if (activo == true) {
                        SinEnviar(cont++, id, nom_sucursal, fecha, monto, nom_usuario, "<html><span style='color:GREEN'>Abierto</span></html>", entregar, editar, Imprimir, ver, copiar, eliminar);
                    } else if (activo == false) {
                        enviado(cont++, id, nom_sucursal, fecha, monto, nom_usuario, "<html><span style='color:GREEN'>Cerrado</span></html>", bloqueado, noeditar, Imprimir, ver, copiar, eliminar);
                    }           
                }
            }else if ((!d1.toString().equals("")) && (d2.toString().equals("")) && (nombre_sucur != "Todo") && (nombre_alma == "Todo") && (estado != "Todo")) {
                long fh = fechaDesde.getTime();
                java.sql.Date desde = new java.sql.Date(fh);
                boolean tipoEstado = (estado == "Abierto") ? true : false;

                String consulta7 = "SELECT SO.ID,SO.ALMACEN,SO.FECHA,SO.USUARIO,SO.MONTO,SO.ACTIVO,SU.NOMBRE, U.NOMBRE_USUARIO \n" +
                    "FROM SUCURSAL AS SU\n" +
                    "INNER JOIN ALMACEN AS A ON A.ID_SUCURSAL = SU.ID\n" +
                    "INNER JOIN SOLICITUD_REPOSICION AS SO ON SO.ALMACEN = A.ID\n" +
                    "INNER JOIN USUARIO AS U ON U.ID = SO.USUARIO\n" +
                    "WHERE SU.ID = "+id_sucursal+" AND date(SO.FECHA) >= '"+desde+"' AND SO.USUARIO = "+this.id_usuario+" AND SO.ACTIVO = "+tipoEstado+" AND S.ELIMINADO = "+false+"\n" +
                    "ORDER BY FECHA ASC";
                
                rs = db.selectInFiltro(consulta7);
                while (rs.next()) {
                    id = rs.getInt(1);
                    id_almacen = rs.getInt(2);
                    fecha = rs.getDate(3);
                    id_usuario = rs.getInt(4);
                    monto = rs.getDouble(5);
                    activo = rs.getBoolean(6);
                    nom_sucursal = rs.getString(7);
                    nom_usuario = rs.getString(8);
                        
                    if (activo == true) {
                        SinEnviar(cont++, id, nom_sucursal, fecha, monto, nom_usuario, "<html><span style='color:GREEN'>Abierto</span></html>", entregar, editar, Imprimir, ver, copiar, eliminar);
                    } else if (activo == false) {
                        enviado(cont++, id, nom_sucursal, fecha, monto, nom_usuario, "<html><span style='color:RED'>Cerrado</span></html>", bloqueado, noeditar, Imprimir, ver, copiar, eliminar);
                    }           
                }
            }else if ((d1.toString().equals("")) && (!d2.toString().equals("")) && (nombre_sucur != "Todo") && (nombre_alma == "Todo") && (estado == "Todo")){
                long fh = fechaHasta.getTime();
                java.sql.Date hasta = new java.sql.Date(fh);
                int id_alma = 0;
                // boolean tipoEstado = (estado == "Abierto") ? true : false;

                String consulta7 = "SELECT SO.ID,SO.ALMACEN,SO.FECHA,SO.USUARIO,SO.MONTO,SO.ACTIVO,SU.NOMBRE, U.NOMBRE_USUARIO \n" +
                    "FROM SUCURSAL AS SU\n" +
                    "INNER JOIN ALMACEN AS A ON A.ID_SUCURSAL = SU.ID\n" +
                    "INNER JOIN SOLICITUD_REPOSICION AS SO ON SO.ALMACEN = A.ID\n" +
                    "INNER JOIN USUARIO AS U ON U.ID = SO.USUARIO\n" +
                    "WHERE SU.ID = "+id_sucursal+" AND date(SO.FECHA) <= '"+hasta+"' AND SO.USUARIO = "+this.id_usuario+" AND S.ELIMINADO = "+false+"\n" +
                    "ORDER BY FECHA ASC";
                
                rs = db.selectInFiltro(consulta7);
                while (rs.next()) {
                    id = rs.getInt(1);
                    id_almacen = rs.getInt(2);
                    fecha = rs.getDate(3);
                    id_usuario = rs.getInt(4);
                    monto = rs.getDouble(5);
                    activo = rs.getBoolean(6);
                    nom_sucursal = rs.getString(7);
                    nom_usuario = rs.getString(8);

                    if (activo == true) {
                        SinEnviar(cont++, id, nom_sucursal, fecha, monto, nom_usuario, "<html><span style='color:GREEN'>Abierto</span></html>", entregar, editar, Imprimir, ver, copiar, eliminar);
                    } else if (activo == false) {
                        enviado(cont++, id, nom_sucursal, fecha, monto, nom_usuario, "<html><span style='color:RED'>Cerrado</span></html>", bloqueado, noeditar, Imprimir, ver, copiar, eliminar);
                    }
                }
            }else if ((d1.toString().equals("")) && (!d2.toString().equals("")) && (nombre_sucur != "Todo") && (nombre_alma != "Todo") && (estado == "Todo")) {

                long fh = fechaHasta.getTime();
                java.sql.Date hasta = new java.sql.Date(fh);
                // boolean tipoEstado = (estado == "Abierto") ? true : false;

                String consulta8 = "SELECT S.ID,S.ALMACEN,S.FECHA, S.USUARIO,S.MONTO,S.ACTIVO,SU.NOMBRE, U.NOMBRE_USUARIO \n" +
                    "FROM SOLICITUD_REPOSICION S \n" +
                    "INNER JOIN LOGIN L ON L.ID = S.USUARIO \n" +
                    "INNER JOIN ALMACEN AS A ON A.ID = S.ALMACEN\n" +
                    "INNER JOIN SUCURSAL AS SU ON SU.ID = A.ID_SUCURSAL\n" +
                    "INNER JOIN USUARIO AS U ON U.ID = S.USUARIO\n" +
                    "WHERE date(S.FECHA) >= '"+hasta+"' AND S.USUARIO = "+this.id_usuario+" AND S.ALMACEN = "+id_almacen+" AND S.ELIMINADO = "+false+"\n" +
                    "ORDER BY FECHA ASC ";
                
                rs = db.selectInFiltro(consulta8);
                while (rs.next()) {
                    id = rs.getInt(1);
                    id_almacen = rs.getInt(2);
                    fecha = rs.getDate(3);
                    id_usuario = rs.getInt(4);
                    monto = rs.getDouble(5);
                    activo = rs.getBoolean(6);
                    nom_sucursal = rs.getString(7);
                    nom_usuario = rs.getString(8);
                        
                    if (activo == true) {
                        SinEnviar(cont++, id, nom_sucursal, fecha, monto, nom_usuario, "<html><span style='color:GREEN'>Abierto</span></html>", entregar, editar, Imprimir, ver, copiar, eliminar);
                    } else if (activo == false) {
                        enviado(cont++, id, nom_sucursal, fecha, monto, nom_usuario, "<html><span style='color:RED'>Cerrado</span></html>", bloqueado, noeditar, Imprimir, ver, copiar, eliminar);
                    }
                    
                }
            }else if ((d1.toString().equals("")) && (!d2.toString().equals("")) && (nombre_sucur != "Todo") && (nombre_alma != "Todo") && (estado != "Todo")) {

                long fh = fechaHasta.getTime();
                java.sql.Date hasta = new java.sql.Date(fh);
                boolean tipoEstado = (estado == "Abierto") ? true : false;

                String consulta9 = "SELECT S.ID,S.ALMACEN,S.FECHA, S.USUARIO,S.MONTO,S.ACTIVO,SU.NOMBRE, U.NOMBRE_USUARIO \n" +
                    "FROM SOLICITUD_REPOSICION S \n" +
                    "INNER JOIN LOGIN L ON L.ID = S.USUARIO \n" +
                    "INNER JOIN ALMACEN AS A ON A.ID = S.ALMACEN\n" +
                    "INNER JOIN SUCURSAL AS SU ON SU.ID = A.ID_SUCURSAL\n" +
                    "INNER JOIN USUARIO AS U ON U.ID = S.USUARIO\n" +
                    "WHERE date(S.FECHA) >= '"+hasta+"' AND S.USUARIO = "+this.id_usuario+" AND S.ALMACEN = "+id_almacen+"  AND ACTIVO = "+tipoEstado+" AND S.ELIMINADO = "+false+"\n" +
                    "ORDER BY FECHA ASC ";
                rs = db.selectInFiltro(consulta9);
                while (rs.next()) {
                    id = rs.getInt(1);
                    id_almacen = rs.getInt(2);
                    fecha = rs.getDate(3);
                    id_usuario = rs.getInt(4);
                    monto = rs.getDouble(5);
                    activo = rs.getBoolean(6);
                    nom_sucursal = rs.getString(7);
                    nom_usuario = rs.getString(8);
    
                    if (activo == true) {
                        SinEnviar(cont++, id, nom_sucursal, fecha, monto, nom_usuario, "<html><span style='color:GREEN'>Abierto</span></html>", entregar, editar, Imprimir, ver, copiar, eliminar);
                    } else if (activo == false) {
                        enviado(cont++, id, nom_sucursal, fecha, monto, nom_usuario, "<html><span style='color:RED'>Cerrado</span></html>", bloqueado, noeditar, Imprimir, ver, copiar, eliminar);
                    }
                    
                }
            }else if ((!d1.toString().equals("")) && (!d2.toString().equals("")) && (nombre_sucur == "Todo") && (nombre_alma == "Todo") && (estado == "Todo")) {
                long fd = fechaDesde.getTime();
                java.sql.Timestamp desde = new java.sql.Timestamp(fd);

                long fh = fechaHasta.getTime();
                java.sql.Timestamp hasta = new java.sql.Timestamp(fh);
                
                String consulta10 = "SELECT S.ID,S.ALMACEN,S.FECHA, S.USUARIO,S.MONTO,S.ACTIVO,SU.NOMBRE, U.NOMBRE_USUARIO \n" +
                    "FROM SOLICITUD_REPOSICION S \n" +
                    "INNER JOIN LOGIN L ON L.ID = S.USUARIO \n" +
                    "INNER JOIN ALMACEN AS A ON A.ID = S.ALMACEN\n" +
                    "INNER JOIN SUCURSAL AS SU ON SU.ID = A.ID_SUCURSAL\n" +
                    "INNER JOIN USUARIO AS U ON U.ID = S.USUARIO\n" +
                    "WHERE date(S.FECHA) >= '"+desde+"' AND date(S.FECHA) <= '"+hasta+"' AND S.USUARIO = "+this.id_usuario+" AND S.ELIMINADO = "+false+"\n" +
                    "ORDER BY FECHA ASC ";
                rs = db.selectInFiltro(consulta10);
                while (rs.next()) {
                    id = rs.getInt(1);
                    id_almacen = rs.getInt(2);
                    fecha = rs.getDate(3);
                    id_usuario = rs.getInt(4);
                    monto = rs.getDouble(5);
                    activo = rs.getBoolean(6);
                    nom_sucursal = rs.getString(7);
                    nom_usuario = rs.getString(8);

                    if (activo == true) {
                        SinEnviar(cont++, id, nom_sucursal, fecha, monto, nom_usuario, "<html><span style='color:GREEN'>Abierto</span></html>", entregar, editar, Imprimir, ver, copiar, eliminar);
                    } else if (activo == false) {
                        enviado(cont++, id, nom_sucursal, fecha, monto, nom_usuario, "<html><span style='color:RED'>Cerrado</span></html>", bloqueado, noeditar, Imprimir, ver, copiar, eliminar);
                    }                 
                }
            }else if ((!d1.toString().equals("")) && (!d2.toString().equals("")) && (nombre_sucur == "Todo") && (nombre_alma == "Todo") && (estado != "Todo")) {
                long fd = fechaDesde.getTime();
                java.sql.Date desde = new java.sql.Date(fd);

                long fh = fechaHasta.getTime();
                java.sql.Date hasta = new java.sql.Date(fh);
                boolean tipoEstado = (estado == "Abierto") ? true : false;

                String consulta11 = "SELECT S.ID,S.ALMACEN,S.FECHA, S.USUARIO,S.MONTO,S.ACTIVO,SU.NOMBRE, U.NOMBRE_USUARIO \n" +
                    "FROM SOLICITUD_REPOSICION S \n" +
                    "INNER JOIN LOGIN L ON L.ID = S.USUARIO \n" +
                    "INNER JOIN ALMACEN AS A ON A.ID = S.ALMACEN\n" +
                    "INNER JOIN SUCURSAL AS SU ON SU.ID = A.ID_SUCURSAL\n" +
                    "INNER JOIN USUARIO AS U ON U.ID = S.USUARIO\n" +
                    "WHERE date(S.FECHA) >= '"+desde+"' AND date(S.FECHA) <= '"+hasta+"' AND S.USUARIO = "+this.id_usuario+" AND ACTIVO = "+tipoEstado+" AND S.ELIMINADO = "+false+" \n" +
                    "ORDER BY FECHA ASC ";
                rs = db.selectInFiltro(consulta11);
                while (rs.next()) {
                    id = rs.getInt(1);
                    id_almacen = rs.getInt(2);
                    fecha = rs.getDate(3);
                    id_usuario = rs.getInt(4);
                    monto = rs.getDouble(5);
                    activo = rs.getBoolean(6);
                    nom_sucursal = rs.getString(7);
                    nom_usuario = rs.getString(8);

                    if (activo == true) {
                        SinEnviar(cont++, id, nom_sucursal, fecha, monto, nom_usuario, "<html><span style='color:GREEN'>Abierto</span></html>", entregar, editar, Imprimir, ver, copiar, eliminar);
                    } else if (activo == false) {
                        enviado(cont++, id, nom_sucursal, fecha, monto, nom_usuario, "<html><span style='color:RED'>Cerrado</span></html>", bloqueado, noeditar, Imprimir, ver, copiar, eliminar);
                    }        
                }
            }else if ((!d1.toString().equals("")) && (!d2.toString().equals("")) && (nombre_sucur != "Todo") && (nombre_alma == "Todo") && (estado == "Todo")) {

                long fh = fechaHasta.getTime();
                java.sql.Date hasta = new java.sql.Date(fh);

                long fd = fechaDesde.getTime();
                java.sql.Date desde = new java.sql.Date(fd);
                int id_alma = 0;
                // boolean tipoEstado = (estado == "Abierto") ? true : false;
                String consulta12 = "SELECT SO.ID,SO.ALMACEN,SO.FECHA,SO.USUARIO,SO.MONTO,SO.ACTIVO,SU.NOMBRE, U.NOMBRE_USUARIO \n" +
                    "FROM SUCURSAL AS SU\n" +
                    "INNER JOIN ALMACEN AS A ON A.ID_SUCURSAL = SU.ID\n" +
                    "INNER JOIN SOLICITUD_REPOSICION AS SO ON SO.ALMACEN = A.ID\n" +
                    "INNER JOIN USUARIO AS U ON U.ID = SO.USUARIO\n" +
                    "WHERE SU.ID = "+id_sucursal+" AND date(SO.FECHA) >= '"+desde+"' AND date(SO.FECHA) <= '"+hasta+"' AND SO.USUARIO = "+this.id_usuario+" AND SO.ELIMINADO = "+false+"\n" +
                    "ORDER BY FECHA ASC";
           
                rs= db.selectInFiltro(consulta12);
                while (rs.next()) {
                    id = rs.getInt(1);
                    id_almacen = rs.getInt(2);
                    fecha = rs.getDate(3);
                    id_usuario = rs.getInt(4);
                    monto = rs.getDouble(5);
                    activo = rs.getBoolean(6);
                    nom_sucursal = rs.getString(7);
                    nom_usuario = rs.getString(8);
   

                    if (activo == true) {
                        SinEnviar(cont++, id, nom_sucursal, fecha, monto, nom_usuario, "<html><span style='color:GREEN'>Abierto</span></html>", entregar, editar, Imprimir, ver, copiar, eliminar);
                    } else if (activo == false) {
                        enviado(cont++, id, nom_sucursal, fecha, monto, nom_usuario, "<html><span style='color:RED'>Cerrado</span></html>", bloqueado, noeditar, Imprimir, ver, copiar, eliminar);
                    }
                }
            }else if ((!d1.toString().equals("")) && (!d2.toString().equals("")) && (nombre_sucur != "Todo") && (nombre_alma == "Todo") && (estado != "Todo")) {

                long fh = fechaHasta.getTime();
                java.sql.Date hasta = new java.sql.Date(fh);

                long fd = fechaDesde.getTime();
                java.sql.Date desde = new java.sql.Date(fd);
                int id_alma = 0;
                boolean tipoEstado = (estado == "Abierto") ? true : false;

                String consulta13 = "SELECT SO.ID,SO.ALMACEN,SO.FECHA,SO.USUARIO,SO.MONTO,SO.ACTIVO,SU.NOMBRE, U.NOMBRE_USUARIO \n" +
                    "FROM SUCURSAL AS SU\n" +
                    "INNER JOIN ALMACEN AS A ON A.ID_SUCURSAL = SU.ID\n" +
                    "INNER JOIN SOLICITUD_REPOSICION AS SO ON SO.ALMACEN = A.ID\n" +
                    "INNER JOIN USUARIO AS U ON U.ID = SO.USUARIO\n" +
                    "WHERE SU.ID = "+id_sucursal+" AND date(SO.FECHA) >= '"+desde+"' AND date(SO.FECHA) <= '"+hasta+"' AND SO.USUARIO = "+this.id_usuario+" AND ACTIVO = "+tipoEstado+" AND SO.ELIMINADO = "+false+"\n" +
                    "ORDER BY FECHA ASC";
                
                rs = db.selectInFiltro(consulta13);
                while (rs.next()) {
                    id = rs.getInt(1);
                    id_almacen = rs.getInt(2);
                    fecha = rs.getDate(3);
                    id_usuario = rs.getInt(4);
                    monto = rs.getDouble(5);
                    activo = rs.getBoolean(6);
                    nom_sucursal = rs.getString(7);
                    nom_usuario = rs.getString(8);

                    if (activo == true) {
                        SinEnviar(cont++, id, nom_sucursal, fecha, monto, nom_usuario, "<html><span style='color:GREEN'>Abierto</span></html>", entregar, editar, Imprimir, ver, copiar, eliminar);
                    } else if (activo == false) {
                        enviado(cont++, id, nom_sucursal, fecha, monto, nom_usuario, "<html><span style='color:RED'>Cerrado</span></html>", bloqueado, noeditar, Imprimir, ver, copiar, eliminar);
                    }                                             
                }
            }else if ((!d1.toString().equals("")) && (!d2.toString().equals("")) && (nombre_sucur != "Todo") && (nombre_alma != "Todo") && (estado == "Todo")) {

                long fh = fechaHasta.getTime();
                java.sql.Date hasta = new java.sql.Date(fh);

                long fd = fechaDesde.getTime();
                java.sql.Date desde = new java.sql.Date(fd);
                // boolean tipoEstado = (estado == "Abierto") ? true : false;

                String consulta14 = "SELECT S.ID,S.ALMACEN,S.FECHA, S.USUARIO,S.MONTO,S.ACTIVO,SU.NOMBRE, U.NOMBRE_USUARIO \n" +
                    "FROM SOLICITUD_REPOSICION S \n" +
                    "INNER JOIN LOGIN L ON L.ID = S.USUARIO \n" +
                    "INNER JOIN ALMACEN AS A ON A.ID = S.ALMACEN\n" +
                    "INNER JOIN SUCURSAL AS SU ON SU.ID = A.ID_SUCURSAL\n" +
                    "INNER JOIN USUARIO AS U ON U.ID = S.USUARIO\n" +
                    "WHERE date(S.FECHA) >= '"+desde+"' AND date(S.FECHA) <= '"+hasta+"' AND S.USUARIO = "+this.id_usuario+" AND S.ALMACEN = "+id_almacen+" AND S.ELIMINADO = "+false+"\n" +
                    "ORDER BY FECHA ASC ";
                
                rs = db.selectInFiltro(consulta14);
                while (rs.next()) {
                    id = rs.getInt(1);
                    id_almacen = rs.getInt(2);
                    fecha = rs.getDate(3);
                    id_usuario = rs.getInt(4);
                    monto = rs.getDouble(5);
                    activo = rs.getBoolean(6);
                    nom_sucursal = rs.getString(7);
                    nom_usuario = rs.getString(8);
                                      
                    if (activo == true) {
                        SinEnviar(cont++, id, nom_sucursal, fecha, monto, nom_usuario, "<html><span style='color:GREEN'>Abierto</span></html>", entregar, editar, Imprimir, ver, copiar, eliminar);
                    } else if (activo == false) {
                        enviado(cont++, id, nom_sucursal, fecha, monto, nom_usuario, "<html><span style='color:RED'>Cerrado</span></html>", bloqueado, noeditar, Imprimir, ver, copiar, eliminar);
                    }
                }
            }else if ((!d1.toString().equals("")) && (!d2.toString().equals("")) && (nombre_sucur != "Todo") && (nombre_alma != "Todo") && (estado != "Todo")) {

                long fh = fechaHasta.getTime();
                java.sql.Date hasta = new java.sql.Date(fh);
                long fd = fechaDesde.getTime();
                java.sql.Date desde = new java.sql.Date(fd);
                boolean tipoEstado = (estado == "Abierto") ? true : false;

                String consulta15 = "SELECT S.ID,S.ALMACEN,S.FECHA, S.USUARIO,S.MONTO,S.ACTIVO,SU.NOMBRE, U.NOMBRE_USUARIO \n" +
                    "FROM SOLICITUD_REPOSICION S \n" +
                    "INNER JOIN LOGIN L ON L.ID = S.USUARIO \n" +
                    "INNER JOIN ALMACEN AS A ON A.ID = S.ALMACEN\n" +
                    "INNER JOIN SUCURSAL AS SU ON SU.ID = A.ID_SUCURSAL\n" +
                    "INNER JOIN USUARIO AS U ON U.ID = S.USUARIO\n" +
                    "WHERE date(S.FECHA) >= '"+desde+"' AND date(S.FECHA) <= '"+hasta+"' AND S.USUARIO = "+this.id_usuario+" AND S.ALMACEN = "+id_almacen+" AND S.ACTIVO = "+tipoEstado+" AND S.ELIMINADO = "+false+"\n" +
                    "ORDER BY FECHA ASC ";
                rs = db.selectInFiltro(consulta15);
                while (rs.next()) {
                    id = rs.getInt(1);
                    id_almacen = rs.getInt(2);
                    fecha = rs.getDate(3);
                    id_usuario = rs.getInt(4);
                    monto = rs.getDouble(5);
                    activo = rs.getBoolean(6);
                    nom_sucursal = rs.getString(7);
                    nom_usuario = rs.getString(8);
                    
                    if (activo == true) {
                        SinEnviar(cont++, id, nom_sucursal, fecha, monto, nom_usuario, "<html><span style='color:GREEN'>Abierto</span></html>", entregar, editar, Imprimir, ver, copiar, eliminar);
                    } else if (activo == false) {
                        enviado(cont++, id, nom_sucursal, fecha, monto, nom_usuario, "<html><span style='color:RED'>Cerrado</span></html>", bloqueado, noeditar, Imprimir, ver, copiar, eliminar);
                    }                    
                }
            }else if ((nombre_sucur == "Todo") && (nombre_alma == "Todo") && (estado == "Todo")) {

                String consultaTodo = "SELECT S.ID,S.ALMACEN,S.FECHA, S.USUARIO,S.MONTO,S.ACTIVO,SU.NOMBRE, U.NOMBRE_USUARIO \n" +
                    "FROM SOLICITUD_REPOSICION S \n" +
                    "INNER JOIN LOGIN L ON L.ID = S.USUARIO \n" +
                    "INNER JOIN ALMACEN AS A ON A.ID = S.ALMACEN\n" +
                    "INNER JOIN SUCURSAL AS SU ON SU.ID = A.ID_SUCURSAL\n" +
                    "INNER JOIN USUARIO AS U ON U.ID = S.USUARIO\n" +
                    "WHERE  S.USUARIO = "+this.id_usuario+" AND S.ELIMINADO = "+false+" \n" +
                    "ORDER BY FECHA ASC ";
                rs = db.selectInFiltro(consultaTodo);
                while (rs.next()) {
                    id = rs.getInt(1);
                    id_almacen = rs.getInt(2);
                    fecha = rs.getDate(3);
                    id_usuario = rs.getInt(4);
                    monto = rs.getDouble(5);
                    activo = rs.getBoolean(6);
                    nom_sucursal = rs.getString(7);
                    nom_usuario = rs.getString(8);

                    if (activo == true) {
                        SinEnviar(cont++, id, nom_sucursal, fecha, monto, nom_usuario, "<html><span style='color:GREEN'>Abierto</span></html>", entregar, editar, Imprimir, ver, copiar, eliminar);
                    } else if (activo == false) {
                        enviado(cont++, id, nom_sucursal, fecha, monto, nom_usuario, "<html><span style='color:RED'>Cerrado</span></html>", bloqueado, noeditar, Imprimir, ver, copiar, eliminar);
                    }                           
                }
            }else if ((nombre_sucur != "Todo") && (nombre_alma == "Todo") && (estado == "Todo")) {
                String consulta16 = "SELECT SO.ID,SO.ALMACEN,SO.FECHA,SO.USUARIO,SO.MONTO,SO.ACTIVO,SU.NOMBRE, U.NOMBRE_USUARIO \n" +
                    "FROM SUCURSAL AS SU\n" +
                    "INNER JOIN ALMACEN AS A ON A.ID_SUCURSAL = SU.ID\n" +
                    "INNER JOIN SOLICITUD_REPOSICION AS SO ON SO.ALMACEN = A.ID\n" +
                    "INNER JOIN USUARIO AS U ON U.ID = SO.USUARIO\n" +
                    "WHERE SU.ID = "+id_sucursal+" AND SO.USUARIO = "+this.id_usuario+" AND SO.ELIMINADO = "+false+"\n" +
                    "ORDER BY FECHA ASC";

                rs = db.selectInFiltro(consulta16);
                while (rs.next()) {
                    id = rs.getInt(1);
                    id_almacen = rs.getInt(2);
                    fecha = rs.getDate(3);
                    id_usuario = rs.getInt(4);
                    monto = rs.getDouble(5);
                    activo = rs.getBoolean(6);
                    nom_sucursal = rs.getString(7);
                    nom_usuario = rs.getString(8);

                    if (activo == true) {
                        SinEnviar(cont++, id, nom_sucursal, fecha, monto, nom_usuario, "<html><span style='color:GREEN'>Abierto</span></html>", entregar, editar, Imprimir, ver, copiar, eliminar);
                    } else if (activo == false) {
                        enviado(cont++, id, nom_sucursal, fecha, monto, nom_usuario, "<html><span style='color:RED'>Cerrado</span></html>", bloqueado, noeditar, Imprimir, ver, copiar, eliminar);
                    }
                }
            }else if ((nombre_sucur != "Todo") && (nombre_alma == "Todo") && (estado != "Todo")) {
                boolean tipoEstado = (estado == "Abierto") ? true : false;
                
                String consulta18 = "SELECT SO.ID,SO.ALMACEN,SO.FECHA,SO.USUARIO,SO.MONTO,SO.ACTIVO,SU.NOMBRE, U.NOMBRE_USUARIO \n" +
                    "FROM SUCURSAL AS SU\n" +
                    "INNER JOIN ALMACEN AS A ON A.ID_SUCURSAL = SU.ID\n" +
                    "INNER JOIN SOLICITUD_REPOSICION AS SO ON SO.ALMACEN = A.ID\n" +
                    "INNER JOIN USUARIO AS U ON U.ID = SO.USUARIO\n" +
                    "WHERE SU.ID = "+id_sucursal+" AND SO.USUARIO = "+this.id_usuario+" AND SO.ACTIVO = "+tipoEstado+" AND SO.ELIMINADO = "+false+" \n" +
                    "ORDER BY FECHA ASC";
                rs = db.selectInFiltro(consulta18);
                while (rs.next()) {
                    id = rs.getInt(1);
                    id_almacen = rs.getInt(2);
                    fecha = rs.getDate(3);
                    id_usuario = rs.getInt(4);
                    monto = rs.getDouble(5);
                    activo = rs.getBoolean(6);
                    nom_sucursal = rs.getString(7);
                    nom_usuario = rs.getString(8);
                    
                    if (activo == true) {
                        SinEnviar(cont++, id, nom_sucursal, fecha, monto, nom_usuario, "<html><span style='color:GREEN'>Abierto</span></html>", entregar, editar, Imprimir, ver, copiar, eliminar);
                    } else if (activo == false) {
                        enviado(cont++, id, nom_sucursal, fecha, monto, nom_usuario, "<html><span style='color:RED'>Cerrado</span></html>", bloqueado, noeditar, Imprimir, ver, copiar, eliminar);
                    } 
                }
            }else if ((nombre_sucur != "Todo") && (nombre_alma != "Todo") && (estado == "Todo")) {
                
                String consulta19 = "SELECT S.ID,S.ALMACEN,S.FECHA, S.USUARIO,S.MONTO,S.ACTIVO,SU.NOMBRE, U.NOMBRE_USUARIO \n" +
                    "FROM SOLICITUD_REPOSICION S \n" +
                    "INNER JOIN LOGIN L ON L.ID = S.USUARIO \n" +
                    "INNER JOIN ALMACEN AS A ON A.ID = S.ALMACEN\n" +
                    "INNER JOIN SUCURSAL AS SU ON SU.ID = A.ID_SUCURSAL\n" +
                    "INNER JOIN USUARIO AS U ON U.ID = S.USUARIO\n" +
                    "WHERE S.USUARIO = "+this.id_usuario+" AND S.ALMACEN = "+id_almacen+" AND S.ELIMINADO = "+false+" \n" +
                    "ORDER BY FECHA ASC ";
                rs = db.selectInFiltro(consulta19);
                while (rs.next()) {
                    id = rs.getInt(1);
                    id_almacen = rs.getInt(2);
                    fecha = rs.getDate(3);
                    id_usuario = rs.getInt(4);
                    monto = rs.getDouble(5);
                    activo = rs.getBoolean(6);
                    nom_sucursal = rs.getString(7);
                    nom_usuario = rs.getString(8);

                    if (activo == true) {
                        SinEnviar(cont++, id, nom_sucursal, fecha, monto, nom_usuario, "<html><span style='color:GREEN'>Abierto</span></html>", entregar, editar, Imprimir, ver, copiar, eliminar);
                    } else if (activo == false) {
                       enviado(cont++, id, nom_sucursal, fecha, monto, nom_usuario, "<html><span style='color:RED'>Cerrado</span></html>", bloqueado, noeditar, Imprimir, ver, copiar, eliminar);
                    }
                }
            }else if ((nombre_sucur != "Todo") && (nombre_alma != "Todo") && (estado != "Todo")) {
                    boolean tipoEstado = (estado == "Abierto") ? true : false;

                    String consulta19 = "SELECT S.ID,S.ALMACEN,S.FECHA, S.USUARIO,S.MONTO,S.ACTIVO,SU.NOMBRE, U.NOMBRE_USUARIO \n" +
                        "FROM SOLICITUD_REPOSICION S \n" +
                        "INNER JOIN LOGIN L ON L.ID = S.USUARIO \n" +
                        "INNER JOIN ALMACEN AS A ON A.ID = S.ALMACEN\n" +
                        "INNER JOIN SUCURSAL AS SU ON SU.ID = A.ID_SUCURSAL\n" +
                        "INNER JOIN USUARIO AS U ON U.ID = S.USUARIO\n" +
                        "WHERE S.USUARIO = "+this.id_usuario+" AND S.ALMACEN = "+id_almacen+" AND S.ACTIVO = "+tipoEstado+" AND S.ELIMINADO = "+false+" \n" +
                        "ORDER BY FECHA ASC ";
                    rs = db.selectInFiltro(consulta19);
                    while (rs.next()) {
                        id = rs.getInt(1);
                        id_almacen = rs.getInt(2);
                        fecha = rs.getDate(3);
                        id_usuario = rs.getInt(4);
                        monto = rs.getDouble(5);
                        activo = rs.getBoolean(6);
                        nom_sucursal = rs.getString(7);
                        nom_usuario = rs.getString(8);
                        
                        if (activo == true) {
                            SinEnviar(cont++, id, nom_sucursal, fecha, monto, nom_usuario, "<html><span style='color:GREEN'>Abierto</span></html>", entregar, editar, Imprimir, ver, copiar, eliminar);
                        } else if (activo == false) {
                           enviado(cont++, id, nom_sucursal, fecha, monto, nom_usuario, "<html><span style='color:RED'>Abierto</span></html>", bloqueado, noeditar, Imprimir, ver, copiar, eliminar);
                        }
                    }
                }    
        } catch (Exception e) {
            System.out.println("error " + e.getMessage());
        }
        
        
        if (getConnectionStatus() == "Online") {       
            try{
                //Ingresar de la BDExp
                String consultaExp = "S.ID,S.ALMACEN,S.FECHA, S.USUARIO,S.MONTO,S.ACTIVO,S.NOMBRE_SUCURSAL \n" +
                    "FROM SOLICITUD_REPOSICION AS S\n" +
                    "WHERE S.USUARIO = ";
                while(rs.next()){
                    id = rs.getInt(1);
                    id_almacen = rs.getInt(2);
                    fecha = rs.getDate(3);
                    id_usuario = rs.getInt(4);
                    monto = rs.getDouble(5);
                    activo = rs.getBoolean(6);
                    nom_sucursal = rs.getString(7);
                    nom_usuario = obtenerNombreUsuario(id_usuario);

                    if (activo == true) {
                        SinEnviar(cont++, id, nom_sucursal, fecha, monto, nom_usuario, "<html><span style='color:GREEN'>Abierto</span></html>", entregar, editar, Imprimir, ver, copiar, eliminar);
                    } else if (activo == false) {
                       enviado(cont++, id, nom_sucursal, fecha, monto, nom_usuario, "<html><span style='color:RED'>Abierto</span></html>", bloqueado, noeditar, Imprimir, ver, copiar, eliminar);
                    }             
                }
            }catch(Exception e){
                System.out.println("Error: "+e);
            }
        }
        
    }//GEN-LAST:event_jButtonFiltroActionPerformed

    public void SinEnviar(int cont, int id, String nom_sucursal, Date fecha, double monto, String nom_usuario, String activo, JButton entregar, JButton editar, JButton Imprimir, JButton ver, JButton copiar, JButton eliminar) {
        Object[] data = {cont, id, nom_sucursal, fecha, monto, nom_usuario, activo, entregar, editar, Imprimir, ver, copiar, eliminar};
        defaulttable.addRow(data);
        tablaSolicitudes.setModel(defaulttable);
        establecerTamañoCelda();
        defaulttable.fireTableDataChanged();
        
    }

    public void enviado(int cont, int id, String nom_sucursal, Date fecha, double monto, String nom_usuario, String activo, JButton entregar, JButton editar, JButton Imprimir, JButton ver, JButton copiar, JButton eliminar) {
        Object[] data = {cont, id, nom_sucursal, fecha, monto, nom_usuario, activo, entregar, editar, Imprimir, ver, copiar, eliminar};
        defaulttable.addRow(data);
        tablaSolicitudes.setModel(defaulttable);
        establecerTamañoCelda();
        defaulttable.fireTableDataChanged();
    }

    public void establecerTamañoCelda() {
        tablaSolicitudes.getColumnModel().getColumn(2).setMaxWidth(150);
        tablaSolicitudes.getColumnModel().getColumn(2).setMinWidth(150);
        tablaSolicitudes.getColumnModel().getColumn(2).setPreferredWidth(150);

        tablaSolicitudes.getColumnModel().getColumn(0).setMaxWidth(30);
        tablaSolicitudes.getColumnModel().getColumn(0).setMinWidth(30);
        tablaSolicitudes.getColumnModel().getColumn(0).setPreferredWidth(30);

        tablaSolicitudes.getColumnModel().getColumn(1).setMaxWidth(0);
        tablaSolicitudes.getColumnModel().getColumn(1).setMinWidth(0);
        tablaSolicitudes.getColumnModel().getColumn(1).setPreferredWidth(0);
    }
    
    public ArrayList<solicitudReposicion> obtenerSolicitudes(){
        ResultSet rs = null;
        ArrayList<solicitudReposicion>solicitud = new ArrayList();
        String consulta = "SELECT ID,ACTIVO,ALMACEN,FECHA,USUARIO,MONTO\n" +
            "FROM SOLICITUD_REPOSICION \n"+
            "WHERE ACTIVO = "+false+" AND ELIMINADO = "+false;
        int id = 0;
        boolean activo = false;
        int almacen = 0;
        Date fecha = null;
        int usuario = 0;
        double monto = 0;
        try {
            rs = dbExp.seleccionar(consulta);
            while (rs.next()) {  
                id = rs.getInt(1);
                activo = rs.getBoolean(2);
                almacen = rs.getInt(3);
                fecha = rs.getTimestamp(4);
                usuario = rs.getInt(5);
                monto = rs.getDouble(6);
                
                solicitudReposicion lista = new solicitudReposicion(id, almacen, usuario, fecha, activo, false , null, null, monto, "");
                solicitud.add(lista);
            }
            
        } catch (Exception e) {
            System.out.println("Error al obtener la solicitud: "+e.getMessage());
        }finally{
            try {
                rs.close();
                db.Conectar().close();
            } catch (SQLException ex) {
                Logger.getLogger(Solicitudes.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
        return solicitud;
    }
    
    public ArrayList<detalleSolicitudProducto> obtenerDetalleProducto(int solicitud){
        ResultSet rs = null;
        ArrayList<detalleSolicitudProducto>producto= new ArrayList();
        String consulta = "SELECT ID,SOLICITUD,PRODUCTO,CANTIDAD\n" +
            "FROM DETALLE_SOLICITUD_PRODUCTO\n" +
            "WHERE SOLICITUD = "+solicitud;
        int id = 0;
        int id_solicitud = 0;
        int id_producto = 0;
        double cantidad = 0;       
        
        try {
            rs = dbExp.seleccionar(consulta);
            while (rs.next()) {  
                id = rs.getInt(1);
                id_solicitud = rs.getInt(2);
                id_producto = rs.getInt(3);
                cantidad = rs.getDouble(4);
                
                detalleSolicitudProducto lista = new detalleSolicitudProducto(id, id_solicitud, id_producto, cantidad, null, null);
                producto.add(lista);
            }
            
        } catch (Exception e) {
            System.out.println("Error al obtener el detalle producto: "+e.getMessage());
        }finally{
            try {
                rs.close();
                db.Conectar().close();
            } catch (SQLException ex) {
                Logger.getLogger(Solicitudes.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
        return producto;
    }
    
    public ArrayList<detalleSolicitudProductoBase> obtenerDetalleProductoBase(int producto){
        ResultSet rs = null;
        ArrayList<detalleSolicitudProductoBase>productoBase= new ArrayList();
        String consulta = "SELECT ID,DETALLE_SOLICITUD_PRODUCTO,PRODUCTO_BASE,CANTIDAD_IDEAL,CANTIDAD_REAL,TOTAL \n" +
            "FROM DETALLE_SOLICITUD_PRODUCTO_BASE \n" +
            "WHERE DETALLE_SOLICITUD_PRODUCTO = "+producto;
        int id = 0;
        int deta_soli_pro = 0;
        int producto_base = 0;
        double cantidad_ideal = 0;       
        double cantidad_real = 0;
        double total = 0;
        try {
            rs = dbExp.seleccionar(consulta);
            while (rs.next()) {  
                id = rs.getInt(1);
                deta_soli_pro = rs.getInt(2);
                producto_base = rs.getInt(3);
                cantidad_ideal = rs.getDouble(4);
                cantidad_real = rs.getDouble(5);
                total = rs.getDouble(6);
                
                detalleSolicitudProductoBase lista = new detalleSolicitudProductoBase(id, deta_soli_pro, producto_base, cantidad_ideal, cantidad_real, null, null, total);
                productoBase.add(lista);
            }
            
        } catch (Exception e) {
            System.out.println("Error al obtener el detalle producto base: "+e.getMessage());
        }finally{
            try {
                rs.close();
                db.Conectar().close();
            } catch (SQLException ex) {
                Logger.getLogger(Solicitudes.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
        return productoBase;
    }
    
    public String obtenerNombreProducto(int producto, int almacen){
        String nombre = "";
        ResultSet rs = null;
        String consulta = "SELECT NOMB_PROD FROM PRODUCTO WHERE ID_PROD = "+producto+" AND ID_ALM = "+almacen;
        try {
            rs = db.seleccionar(consulta);
            while(rs.next()){
                nombre = rs.getString(1);
            }
        } catch (Exception e) {
            System.out.println("Error al recoger el nombre del producto: "+e.getMessage());
        }
        return nombre;
    }
    
    public String obtenerNombreProductoBase(int producto){
        String nombre = "";
        ResultSet rs = null;
        String consulta = "SELECT NOMBRE_PB FROM PRODUCTO_BASE WHERE ID_PROD_BASE = "+producto;
        try {
            rs = db.seleccionar(consulta);
            while(rs.next()){
                nombre = rs.getString(1);
            }
        } catch (Exception e) {
            System.out.println("Error al recoger el nombre del producto base: "+e.getMessage());
        } 
        return nombre;
    }
    
    public int obtenerIdEmpresa(){
        int id = 0;
        ResultSet rs = null;
        String consulta = "SELECT IDEMPRESA\n" +
            "FROM LOGIN\n" +
            "WHERE ID = "+this.id_usuario;
        try {
            rs = db.seleccionar(consulta);
            while (rs.next()) {                
                id = rs.getInt(1);
            }
        } catch (Exception e) {
            System.out.println("Error al recuperar el id de empresa: "+e);
        }
        return id;
    }
    
    public String obtenerNombreSucursal(int id){
        ResultSet rs = null;
        String nombre = "";
        String consulta = "SELECT S.NOMBRE\n" +
            "FROM ALMACEN AS A\n" +
            "INNER JOIN SUCURSAL AS S ON A.ID_SUCURSAL = S.ID\n" +
            "WHERE A.ID ="+id ;
        try {
            rs = db.seleccionar(consulta);
            while(rs.next()){
                nombre = rs.getString(1);
            }
        } catch (Exception e) {
            System.out.println("Error al obtener el nombre de la sucursal: "+e);
        }finally{
            try {
                rs.close();
                db.Conectar().close();
            } catch (SQLException ex) {
                Logger.getLogger(AgregarProducto.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
        return nombre;
    }
    
    public void Sincronizacion(){
        if (getConnectionStatus() == "Online") {
            db.eliminarProductos("DELETE FROM SOLICITUD_REPOSICION");
            db.eliminarProductos("DELETE FROM DETALLE_SOLICITUD_PRODUCTO");
            db.eliminarProductos("DELETE FROM DETALLE_SOLICITUD_PRODUCTO_BASE");
            sincronizar();
        }
    }
    
    public void sincronizar(){
          
        SimpleDateFormat horaCompleta = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss:SSS");
        
        SimpleDateFormat hora = new SimpleDateFormat("yyyy-MM-dd");
        
        int idEmp = obtenerIdEmpresa();
        String url = "/operaciones/empresa/"+idEmp+"/vintage/"+this.id_usuario+"/capo/"+0+"/desde/"+0+"/hasta/"+0+"/suc/"+0+"/alm/"+0+"/mov/"+0+"/est/"+0+"/val/"+0+"/pagina/"+0+"/items-pagina/"+0+"/busqueda/"+0;
        try{
            JSONObject data = RestServer.getJSONObject(url);   
           
            JSONArray solicitudes = data.getJSONArray("solicitudes");
            for (int j = 0; j < solicitudes.length(); j++) {
                JSONObject resSolicitudes = solicitudes.getJSONObject(j);

                int id = resSolicitudes.getInt("id");
                int idAlmacen = resSolicitudes.getInt("id_almacen");

                String f = resSolicitudes.get("fecha").toString();
                Instant instant = Instant.parse(f);
                LocalDateTime fe = LocalDateTime.ofInstant(instant, ZoneId.of(ZoneOffset.UTC.getId()));
                Timestamp fecha = Timestamp.valueOf(fe);      

                String c = resSolicitudes.get("createdAt").toString();
                String[] cortarPC = c.split("\\.");
                String[] cortarPPC = cortarPC[0].split("\\:");
                String cortar = cortarPPC[0].substring(0,10);
                Date co = hora.parse(cortar);
                Long c1 = co.getTime();
                java.sql.Date created = new java.sql.Date(c1);

                String u = resSolicitudes.get("updatedAt").toString();
                String[] cortarPU = c.split("\\.");
                String[] cortarPPU = cortarPU[0].split("\\:");
                String cortarU = cortarPPU[0].substring(0,10);
                Date upda = hora.parse(cortarU);
                Long u1 = upda.getTime();
                java.sql.Date updated = new java.sql.Date(u1);
                
                int idUsuario = resSolicitudes.getInt("id_usuario");
                boolean activo = resSolicitudes.getBoolean("activo");
                boolean eliminado = resSolicitudes.getBoolean("eliminado");
                double monto = resSolicitudes.getDouble("monto");
                String sucursal = obtenerNombreSucursal(idAlmacen);
                db.ingresarSolicitudReposicion(id, idAlmacen, fecha, idUsuario, activo, eliminado, created , monto, sucursal);

                JSONArray solicitudesProductos = resSolicitudes.getJSONArray("solicitudesProductos");
                for (int k = 0; k < solicitudesProductos.length(); k++) {
                    JSONObject resSolicitudesProducto =  solicitudesProductos.getJSONObject(k);

                    int idDP = resSolicitudesProducto.getInt("id");
                    int idSolicitud = resSolicitudesProducto.getInt("id_solicitud");
                    int idProducto = resSolicitudesProducto.get("id_producto").toString().equals("null")? 0:Integer.parseInt(resSolicitudesProducto.get("id_producto").toString());
                    double cantidad = resSolicitudesProducto.getDouble("cantidad");

                    String creaP = resSolicitudes.get("createdAt").toString();
                    String[] cortarPDP = creaP.split("\\.");
                    String[] cortarPPDP = cortarPDP[0].split("\\:");
                    String cortar1 = cortarPPDP[0].substring(0,10);
                    Date cDP = hora.parse(cortar1);
                    Long cDP1 = cDP.getTime();
                    java.sql.Date createdDP = new java.sql.Date(cDP1);

                    String updDP = resSolicitudes.get("updatedAt").toString();
                    String[] updatedPDP = updDP.split("\\.");
                    String[] updatedPPDP = updatedPDP[0].split("\\:");
                    String updated1 = updatedPPDP[0].substring(0,10);
                    Date uDP = hora.parse(updated1);
                    Long uDP1 = uDP.getTime();
                    java.sql.Date updatedDP = new java.sql.Date(uDP1);

                    db.insertarSolicitudProducto(idDP, idSolicitud, idProducto, cantidad, createdDP, updatedDP);

                    JSONArray detallesIngredientesProducto = resSolicitudesProducto.getJSONArray("detallesIngredientesProducto");
                    for (int l = 0; l < detallesIngredientesProducto.length(); l++) {
                        JSONObject resDetallesIngredientesProducto = detallesIngredientesProducto.getJSONObject(l);

                        int idDPB = resDetallesIngredientesProducto.getInt("id");
                        int id_detalle_solicitud_producto = resDetallesIngredientesProducto.getInt("id_detalle_solicitud_producto");
                        int id_prod_base = (resDetallesIngredientesProducto.get("id_producto_base").toString().equals("null"))? 0:Integer.parseInt(resDetallesIngredientesProducto.get("id_producto_base").toString());
                        double cantidadIdeal = (resDetallesIngredientesProducto.get("cantidad_ideal").toString().equals("null"))? 0:Double.parseDouble(resDetallesIngredientesProducto.get("cantidad_ideal").toString());
                        double cantidadReal = (resDetallesIngredientesProducto.get("cantidad_real").toString().equals("null"))? 0:Double.parseDouble(resDetallesIngredientesProducto.get("cantidad_real").toString());  
                        double total = (resDetallesIngredientesProducto.get("total").toString().equals("null"))? 0:Double.parseDouble(resDetallesIngredientesProducto.get("total").toString()); 
                        String creaDPB = resSolicitudes.get("createdAt").toString();
                        String[] cortarPDPB = creaDPB.split("\\.");
                        String[] cortarPPDPB = cortarPDPB[0].split("\\:");
                        String cortar2 = cortarPPDPB[0].substring(0,10);
                        Date cDPB = hora.parse(cortar2);
                        Long cDPB1 = cDPB.getTime();
                        java.sql.Date createdDPB = new java.sql.Date(cDPB1);

                        String updDPB = resSolicitudes.get("updatedAt").toString();
                        String[] updatedPDPB = updDPB.split("\\.");
                        String[] updatedPPDPB = updatedPDPB[0].split("\\:");
                        String updated2 = updatedPPDPB[0].substring(0,10);
                        Date uDPB = hora.parse(updated2);
                        Long uDPB1 = uDPB.getTime();
                        java.sql.Date updatedDPB = new java.sql.Date(uDPB1);
                        db.insertarDetalleSolicitudProductoBase(idDPB, id_detalle_solicitud_producto, id_prod_base, cantidadIdeal, cantidadReal, createdDPB, updatedDPB, total);
                    }
                }
            }
        }catch(Exception e){
            JOptionPane.showMessageDialog(null, "Error al sincronizar los datos de entrada.!");
            System.out.println("Error: "+e.getMessage());  
            e.printStackTrace();
        }
    }
   
    public boolean tieneProductosBaseSincronizar(int detalleProducto){
        boolean respuesta = false;
        ResultSet rs = null;
        String consulta = "SELECT * "
                + "FROM DETALLE_SOLICITUD_PRODUCTO_BASE WHERE DETALLE_SOLICITUD_PRODUCTO = "+detalleProducto;
        try {
            rs = db.seleccionar(consulta);
            while (rs.next()) {                
                respuesta = true;
            }
        } catch (Exception e) {
            System.out.println("Error al ver si existe el producto base en la sincronizacion: "+e);
        }
        return respuesta;
    }
  
    public boolean estaActivoInventario(int id,int id_alm){
        ResultSet rs = null;
        boolean activo = false;
        String consulta = "SELECT ACTIVAR_INVENTARIO FROM PRODUCTO WHERE ID_PROD = "+id+" AND ID_ALM = "+id_alm;
        try {
            rs = db.seleccionar(consulta);
            while(rs.next()){
                activo = true;
            }
        } catch (Exception e) {
            System.out.println("Error al ver si es un inventario activo: "+e);
        }
        return activo;
    }
    
    public double obtenerPrecioUnitario(int idProducto, int almacen){
        double precio = 0;
        ResultSet rs = null;
        String consulta = "SELECT PRECIO_UNIT FROM PRODUCTO WHERE ID_PROD = "+idProducto+" AND ID_ALM = "+almacen;
        try {
            rs = db.seleccionar(consulta);
            while (rs.next()) {                
                precio = rs.getDouble(1);
            }
        } catch (Exception e) {
            System.out.println("Error al recuperar precio del producto: "+e);
        }
        return precio;
    }
    
    public boolean tieneProductoBase(int idProducto){
        String consulta = "SELECT * FROM DETALLE_SOLICITUD_PRODUCTO_BASE WHERE DETALLE_SOLICITUD_PRODUCTO = "+idProducto;
        boolean res = false;
        ResultSet rs = null;
        try {
            rs = db.seleccionar(consulta);
            while(rs.next()){
                res = true;
            }
        } catch (Exception e) {
            System.out.println("Error al obtener los productos base "+e);
        }
        
        return res;
    }
    
    public double obtenerPrecioUnitarioPB(int idProducto){
        String consulta = "SELECT PRECIO_UNI_PB FROM PRODUCTO_BASE WHERE ID_PROD_BASE ="+idProducto;
        double res = 0;
        ResultSet rs = null;
        try {
            rs = db.seleccionar(consulta);
            while(rs.next()){
                res = rs.getDouble(1);
            }
        } catch (Exception e) {
            System.out.println("Error al obtener los productos base "+e);
        }
        
        return res;
    }
    
    public int obtenerIdSucursal(String sucursal){
        String consulta = "SELECT ID FROM SUCURSAL WHERE NOMBRE = '"+sucursal+"'";
        int res = 0;
        ResultSet rs = null;
        try {
            rs = db.seleccionar(consulta);
            while(rs.next()){
                res = rs.getInt(1);
            }
        } catch (Exception e) {
            System.out.println("Error al obtener el id de la sucursal "+e);
        }
        
        return res;
    }
    
    public String obtenerNombreAlmacen(int almacen){
        String consulta = "SELECT NOMBRE FROM ALMACEN WHERE ID = "+almacen;
        String res = "";
        ResultSet rs = null;
        try {
            rs = db.seleccionar(consulta);
            while(rs.next()){
                res = rs.getString(1);
            }
        } catch (Exception e) {
            System.out.println("Error al obtener el nombre del almacen "+e);
        }
        
        return res;
    }
    
    public int cantidadASincronizar(){
        Connection conn = null;
        int count = 0;
        try { conn = Conexion2.getConnection(); 
            if (conn.getAutoCommit()) { 
                conn.setAutoCommit(false);
            } 
            InventarioDB invDb = new InventarioDB(conn);
            
            count = invDb.seleccionarCantidadSolicitud();
            
            conn.commit();
        }catch (SQLException e) {
            //Hacemos rollback en caso de error
            try {
                System.out.println("Entramos al rollback");
            //Imprimimos la excepcion a la consola
                e.printStackTrace(System.out);
            //Hacemos rollback
                conn.rollback();
            } catch (SQLException e1) {
                e1.printStackTrace(System.out);
            }
        }
        return count;
    }
   
    public int cantidadCerrar(){
        Connection conn = null;
        int count = 0;
        try { conn = Conexion2.getConnection(); 
            if (conn.getAutoCommit()) { 
                conn.setAutoCommit(false);
            } 
            InventarioDB invDb = new InventarioDB(conn);
            
            count = invDb.seleccionarCantidadCerrar();
            
            conn.commit();
        }catch (SQLException e) {
            //Hacemos rollback en caso de error
            try {
                System.out.println("Entramos al rollback");
            //Imprimimos la excepcion a la consola
                e.printStackTrace(System.out);
            //Hacemos rollback
                conn.rollback();
            } catch (SQLException e1) {
                e1.printStackTrace(System.out);
            }
        }
        return count;
    }
    
    public String SumarCantidades(){
        int suma = 0;
        int guardados = 0;
        int cerrados = 0;
        String total = "";
        
        guardados = cantidadASincronizar();
        cerrados = cantidadCerrar();
        suma = guardados + cerrados;
        total = Integer.toString(suma);
        
        return total;
    }
    
    private void jComboAlmacenActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jComboAlmacenActionPerformed
        String item_almacen = "";
        int id = 0;
        String nombre_alma = "";
        int id_sucursal = 0;
        try {
            limpiarListas(ListaAlmacen);
            item_almacen = (String) jComboAlmacen.getSelectedItem();

            if (!item_almacen.equals(null)) {
                if (item_almacen.equals("Todo")) {
                    id = 0;
                    nombre_alma = item_almacen;
                    Almacen almacen = new Almacen(id, nombre_alma, id_sucursal);
                    ListaAlmacen.add(almacen);

                } else if (!item_almacen.equals("Todo")) {
                    for (int i = 0; i < db.SeleccionarTodoAlmacenPorNombre(item_almacen).size(); i++) {
                        id = db.SeleccionarTodoAlmacenPorNombre(item_almacen).get(i).getId();
                        nombre_alma = db.SeleccionarTodoAlmacenPorNombre(item_almacen).get(i).getNombre();
                        id_sucursal = db.SeleccionarTodoAlmacenPorNombre(item_almacen).get(i).getId_sucursal();

                        Almacen almacen = new Almacen(id, nombre_alma, id_sucursal);
                        ListaAlmacen.add(almacen);
                    }
                }
            }

        } catch (Exception e) {
            //System.out.println("error: "+e.getStackTrace());
            System.out.println("nombre " + item_almacen);
        }
    }//GEN-LAST:event_jComboAlmacenActionPerformed

    private void jComboActivoActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jComboActivoActionPerformed
        // TODO add your handling code here:
    }//GEN-LAST:event_jComboActivoActionPerformed
    
    private void tablaSolicitudesMouseClicked(java.awt.event.MouseEvent evt) {//GEN-FIRST:event_tablaSolicitudesMouseClicked
        // TODO add your handling code here:
        int columna = tablaSolicitudes.getColumnModel().getColumnIndexAtX(evt.getX());
        int fila = evt.getY() / tablaSolicitudes.getRowHeight();
        String consulta = "";
        ResultSet rs = null;
        ResultSet rs2 = null;
        ResultSet rs3 = null;

        if (fila < tablaSolicitudes.getRowCount() && fila >= 0 && columna < tablaSolicitudes.getColumnCount() && columna >= 0) {
            Object value = tablaSolicitudes.getValueAt(fila, columna);

            if (value instanceof JButton) {
                ((JButton) value).doClick();
                JButton botonAccion = (JButton) value;

                if (botonAccion.getName().equals("entregar")) {
                    int id = Integer.parseInt(String.valueOf(tablaSolicitudes.getValueAt(fila, 1)));
                    ArrayList<solicitudReposicion> arraySolicitud = new ArrayList();
                    ArrayList<detalleSolicitudProducto> arrayDetalleP = new ArrayList();
                    ArrayList<detalleSolicitudProductoBase> arrayDetallePB = new ArrayList();
                    
                    int resp = JOptionPane.showConfirmDialog(this, "<html>Desea cerrar el producto?</html>", "Alerta!", JOptionPane.YES_NO_OPTION, JOptionPane.QUESTION_MESSAGE);

                    if(resp == 0){
                        InventarioDB invDbs = new InventarioDB();
                        Connection conn = null;
                        try {
                            
                            for (int i = 0; i < invDbs.seleccionarSolicitudReposicion(id).size(); i++) {
                                int idS = invDbs.seleccionarSolicitudReposicion(id).get(i).getId();
                                int almacen = invDbs.seleccionarSolicitudReposicion(id).get(i).getAlmacen();
                                int usuario = invDbs.seleccionarSolicitudReposicion(id).get(i).getUsuario();
                                boolean activo = invDbs.seleccionarSolicitudReposicion(id).get(i).isActivo();
                                boolean eliminado = invDbs.seleccionarSolicitudReposicion(id).get(i).isEliminado();
                                double monto = invDbs.seleccionarSolicitudReposicion(id).get(i).getMonto();
                                String nomSucursal = invDbs.seleccionarSolicitudReposicion(id).get(i).getNombreSucursal();
                                Timestamp fecha = (Timestamp) invDbs.seleccionarSolicitudReposicion(id).get(i).getFecha();

                                solicitudReposicion listaS = new solicitudReposicion(idS, almacen, usuario, fecha, activo, eliminado, null, null, monto, nomSucursal);
                                arraySolicitud.add(listaS);
                            }
                           /* String consultaS = "SELECT ID,ALMACEN,USUARIO,ACTIVO,ELIMINADO,MONTO,NOMBRE_SUCURSAL,FECHA "
                                    + "FROM SOLICITUD_REPOSICION "
                                    + "WHERE ID = "+id;
                            rs = db.seleccionar(consultaS);

                            while(rs.next()){
                                
                            }*/
                            for (int i = 0; i < invDbs.seleccionarSolicitudProducto(id).size(); i++) {
                                int idDP = invDbs.seleccionarSolicitudProducto(id).get(i).getId();
                                int solicitud = invDbs.seleccionarSolicitudProducto(id).get(i).getSolicitud();
                                int producto = invDbs.seleccionarSolicitudProducto(id).get(i).getProducto();
                                double cantidad = invDbs.seleccionarSolicitudProducto(id).get(i).getCantidad();
                                java.sql.Date created = (java.sql.Date) invDbs.seleccionarSolicitudProducto(id).get(i).getCreatedAt();
                                java.sql.Date updated = (java.sql.Date) invDbs.seleccionarSolicitudProducto(id).get(i).getUpdatedAt();

                                detalleSolicitudProducto listaDP = new detalleSolicitudProducto(idDP, solicitud, producto, cantidad, created, updated);
                                arrayDetalleP.add(listaDP);
                            }
                           /* String consultaDP = "SELECT ID,SOLICITUD,PRODUCTO,CANTIDAD,CREATEDAT,UPDATEDAT "
                                    + "FROM DETALLE_SOLICITUD_PRODUCTO "
                                    + "WHERE SOLICITUD = "+id;
                            rs = db.seleccionar(consultaDP);
                            while (rs.next()) {                                    
                                int idDP = rs.getInt(1);
                                int solicitud = rs.getInt(2);
                                int producto = rs.getInt(3);
                                double cantidad = rs.getDouble(4);
                                java.sql.Date created = rs.getDate(5);
                                java.sql.Date updated = rs.getDate(6);

                                detalleSolicitudProducto listaDP = new detalleSolicitudProducto(idDP, solicitud, producto, cantidad, created, updated);
                                arrayDetalleP.add(listaDP);
                            }

                            for (int i = 0; i < arrayDetalleP.size(); i++) {
                                int idDP = arrayDetalleP.get(i).getId();

                                String consultaDPB = "SELECT ID,DETALLE_SOLICITUD_PRODUCTO,PRODUCTO_BASE,CANTIDAD_IDEAL,CANTIDAD_REAL,TOTAL\n" +
                                    "FROM DETALLE_SOLICITUD_PRODUCTO_BASE \n" +
                                    "WHERE DETALLE_SOLICITUD_PRODUCTO = "+idDP;
                                rs = db.seleccionar(consultaDPB);
                                while (rs.next()) {                                    
                                    int idDPB = rs.getInt(1);
                                    int detalleProducto = rs.getInt(2);
                                    int productoBase = rs.getInt(3);
                                    double cantidadIdeal = rs.getDouble(4);
                                    double cantidadReal = rs.getDouble(5);
                                    double total = rs.getDouble(6);

                                    detalleSolicitudProductoBase detallePB = new detalleSolicitudProductoBase(idDPB, detalleProducto, productoBase, cantidadIdeal, cantidadReal, null, null, total);
                                    arrayDetallePB.add(detallePB);
                                }
                            }*/
                            for (int i = 0; i < arrayDetalleP.size(); i++) {
                                int idDP = arrayDetalleP.get(i).getId();
                                for (int j = 0; j < invDbs.seleccionarSolicitudProductoBase(idDP).size(); j++) {
                                    int idDPB = rs.getInt(1);
                                    int detalleProducto = rs.getInt(2);
                                    int productoBase = rs.getInt(3);
                                    double cantidadIdeal = rs.getDouble(4);
                                    double cantidadReal = rs.getDouble(5);
                                    double total = rs.getDouble(6);

                                    detalleSolicitudProductoBase detallePB = new detalleSolicitudProductoBase(idDPB, detalleProducto, productoBase, cantidadIdeal, cantidadReal, null, null, total);
                                    arrayDetallePB.add(detallePB);
                                }
                            }
         
                        }catch (SQLException e) {
                            //Hacemos rollback en caso de error
                            try {
                                System.out.println("Entramos al rollback");
                            //Imprimimos la excepcion a la consola
                                e.printStackTrace(System.out);
                            //Hacemos rollback
                                conn.rollback();
                            } catch (SQLException e1) {
                                e1.printStackTrace(System.out);
                            }
                        }
                        
                        if (getConnectionStatus().equals("Online")) {
                            
                            int idAlma = 0;
                            double tMonto = 0;
                            double tTotalMonto = 0;
                            for (int i = 0; i < arraySolicitud.size(); i++) {
                                idAlma = arraySolicitud.get(i).getAlmacen();
                            }
                            for (int i = 0; i < arrayDetalleP.size(); i++) {
                                int ids = arrayDetalleP.get(i).getId();
                                int idPro = arrayDetalleP.get(i).getProducto();
                                int cantidad = (int)arrayDetalleP.get(i).getCantidad();
                                double monto = obtenerPrecioUnitario(idPro, idAlma);
                                    
                                    if (tieneProductoBase(ids) == true) {
                                        for (int j = 0; j < arrayDetallePB.size(); j++) {
                                            int idss = arrayDetallePB.get(j).getDetalle_solicitud_producto();
                                            int prodBase = arrayDetallePB.get(j).getProducto_base();
                                            double precio = obtenerPrecioUnitarioPB(prodBase);
                                            
                                            if (ids == idss) {
                                                double cantidad_ideal = arrayDetallePB.get(j).getCantidad_ideal()*precio;
                                                double total_real = arrayDetallePB.get(j).getCantidad_real()*precio;
                                                tTotalMonto += total_real; 
                                            }
                                        }
                                    }else{
                                         tMonto += monto * cantidad;
                                         System.out.println(monto);
                                    }
                                    
                            }
                            
                            try {
                                double monto = tMonto + tTotalMonto;
                                JSONObject datos = new JSONObject();
                                JSONObject ObjAlmacen = new JSONObject();
                                JSONObject idAlmacen = new JSONObject();
                                JSONObject idSuc = new JSONObject();
                                JSONObject idUser = new JSONObject();
                                
                                for (int i = 0; i < arraySolicitud.size(); i++) {
                                    JSONObject listaProductosSolicitados = new JSONObject();
                                    int idS = arraySolicitud.get(i).getId();
                                    int almacen = arraySolicitud.get(i).getAlmacen();
                                    Timestamp fecha = (Timestamp) arraySolicitud.get(i).getFecha();
                                    boolean estado = arraySolicitud.get(i).isActivo();
                                    int usuario = arraySolicitud.get(i).getUsuario();
                                    String nombreSucur = arraySolicitud.get(i).getNombreSucursal();
                                    int idSucursal = obtenerIdSucursal(nombreSucur);
                                    
                                    datos.put("activo", true);    
                                    idAlmacen.put("id", almacen);
                                    datos.put("almacen", idAlmacen);
                                    datos.put("fecha", fecha);
                                    datos.put("id", idS);
                                    
                                    idAlmacen.put("id", almacen);
                                    listaProductosSolicitados.put("almacen", idAlmacen);
                                    listaProductosSolicitados.put("fecha", fecha);                        
                                    listaProductosSolicitados.put("identificador", idS);
                                    
                                    JSONArray arrayProducto;
                                    JSONArray arrayListaProductos ;
                                    JSONArray arraySolicitudesProductos ;
                                    
                                     arrayProducto = new JSONArray();
                                     arrayListaProductos = new JSONArray();
                                     arraySolicitudesProductos = new JSONArray();
                                    for (int j = 0; j < arrayDetalleP.size(); j++) {
                                        JSONObject producto ;
                                        JSONObject idAlmacenP ;
                                        JSONObject idProductoBase;
                                        JSONObject idEmpresa ;
                                        JSONObject productoSolicitudBase;
                                          producto = new JSONObject();
                                         idAlmacenP = new JSONObject();
                                         idProductoBase = new JSONObject();
                                         idEmpresa = new JSONObject();
                                         productoSolicitudBase = new JSONObject();
                                        //JSONObject solicitudesProductos = new JSONObject();
                                        int empresa = obtenerIdEmpresa();
                                        int idP = arrayDetalleP.get(j).getId();
                                        double cantidad = arrayDetalleP.get(j).getCantidad();
                                        int idProducto = arrayDetalleP.get(j).getProducto();
                                        String nombreProducto = obtenerNombreProducto(idProducto, almacen);
                                        
                                       // solicitudesProductos.put("", listaSucur)
                                        if (estaActivoInventario(idProducto, almacen) == true) {
                                            String nombreAlmacen = obtenerNombreAlmacen(almacen);
                                            idAlmacenP.put("id", almacen);
                                            idAlmacenP.put("id_sucursal", idSuc);
                                            idAlmacenP.put("nombre", nombreAlmacen);
                                            producto.put("almacen", idAlmacenP);
                                            producto.put("cantidad_ideal", cantidad);
                                            producto.put("cantidad_real", cantidad);
                                            producto.put("estado", estado);
                                            producto.put("id", idP);
                                            producto.put("id_detalle_solicitud_producto", idP);
                                            
                                            idProductoBase.put("id", idProducto);
                                            idProductoBase.put("id_empresa", empresa);
                                            idProductoBase.put("nombre", nombreProducto);

                                            producto.put("id_producto_base", idProductoBase);
                                            producto.put("monto", monto);
                                            
                                            productoSolicitudBase.put("id", idProducto);
                                            productoSolicitudBase.put("id_empresa", empresa);
                                            productoSolicitudBase.put("nombre", nombreProducto);
                                            
                                            producto.put("productoSolicitudBase", productoSolicitudBase);
                                            producto.put("solicitud", idS);
                                            producto.put("total", cantidad);
                                            producto.put("totalMostrar", 0);
                                            
                                            arrayProducto.put(producto);
                                            listaProductosSolicitados.put("productos", arrayProducto);
                                            
                                            
                                        }else{
                                            Object[] a = {};
                                            listaProductosSolicitados.put("productos",a);
                                        }   
                                        
                                        
                                        for (int k = 0; k < arrayDetallePB.size(); k++) {
                                            
                                         producto = new JSONObject();
                                         idAlmacenP = new JSONObject();
                                         idProductoBase = new JSONObject();
                                         idEmpresa = new JSONObject();
                                         productoSolicitudBase = new JSONObject();
                                            int idPB = arrayDetallePB.get(k).getId();
                                            int detalleSolicitudProducto = arrayDetallePB.get(k).getDetalle_solicitud_producto();
                                            double cantidadIdeal = arrayDetallePB.get(k).getCantidad_ideal();
                                            double cantidadReal = arrayDetallePB.get(k).getCantidad_real();
                                            int productoBase = arrayDetallePB.get(k).getProducto_base();
                                            String nombreProdBase = obtenerNombreProductoBase(productoBase);
                                            double precioProdBase = obtenerPrecioUnitarioPB(productoBase);
                                            if (idP == detalleSolicitudProducto) {
                                                
                                                 if (estaActivoInventario(idProducto, almacen) == true) {
                                                    idAlmacenP.put("id", almacen);
                                                    producto.put("almacen", idAlmacenP);
                                                    producto.put("cantidad_ideal", cantidadIdeal);
                                                    producto.put("cantidad_real", cantidadReal);
                                                    producto.put("estado", estado);
                                                    producto.put("id", idP);
                                                    producto.put("id_detalle_solicitud_producto", idP);
            
                                                    producto.put("id_producto_base", productoBase);
                                                    producto.put("monto", monto);
                                                    
                                                    productoSolicitudBase.put("id", productoBase);
                                                    productoSolicitudBase.put("id_empresa", empresa);                          
                                                    productoSolicitudBase.put("nombre", nombreProdBase);
                                                
                                                    producto.put("productoSolicitudBase", productoSolicitudBase);
                                                    producto.put("solicitud", idS);
                                                    double total = cantidadIdeal + cantidadReal;
                                                    producto.put("total", total);
                                                    double totalbs = total * precioProdBase;
                                                    producto.put("totalbs", totalbs);
                                                    producto.put("totalMostrar", total);
                                                    producto.put("totalSumar", total);
                                                    
                                                    arrayProducto.put(producto);
                                                    listaProductosSolicitados.put("productos", arrayProducto);
                                                }else{
                                                    Object[] a = {};
                                                    listaProductosSolicitados.put("productos",a);
                                                }   
                                            }
                                        }
                                    }
                                    idUser.put("id", usuario);
                                    idSuc.put("id", idSucursal);
                                    listaProductosSolicitados.put("sucursal", idSuc);
                                    listaProductosSolicitados.put("usuario", idUser);
                                    datos.put("listaProductosSolicitados", listaProductosSolicitados);
                                }
                                int idEmp = obtenerIdEmpresa();
                                String url = "/productos-operaciones/empresa/"+idEmp+"/cerrar";
                                JSONObject res = RestServer.postJSONdata(url, datos); 
                                                
                               //SE ACTUALIZA EL ESTADO LOCAL DE LA SOLICITUD
                                try {
                                  conn = Conexion.getConnection(); 
                                  if (conn.getAutoCommit()) { 
                                      conn.setAutoCommit(false); 
                                  } 
                                  InventarioDB invDb = new InventarioDB(conn);
                                  invDb.updateSolicitud(id);
                                  conn.commit();
                                } catch (SQLException e) {
                                    //Hacemos rollback en caso de error
                                    try {
                                        System.out.println("Entramos al rollback");
                                    //Imprimimos la excepcion a la consola
                                        e.printStackTrace(System.out);
                                    //Hacemos rollback
                                        conn.rollback();
                                    } catch (SQLException e1) {
                                        e1.printStackTrace(System.out);
                                    }
                                }
                                
                                tablaSolicitudes.setValueAt("<html><span style='color:RED'>Cerrado</span></html>", fila, 6);

                                String imgNoEditar = "/imagen/noeditar.png";
                                imgNoEdit = new ImageIcon(this.getClass().getResource(imgNoEditar));
                                iconNoEdit = new ImageIcon(imgNoEdit.getImage().getScaledInstance(15, 20, 1));
                                noeditar = new JButton(iconNoEdit);
                                tablaSolicitudes.setValueAt(noeditar, fila, 8);
                            } catch (Exception e) {
                                System.out.println("Error al cerrar la solicitud en el json: " +e);
                            }
                        }else{
                            
                            for (int i = 0; i < arraySolicitud.size(); i++) {
                                int idS = arraySolicitud.get(i).getId();
                                int almacen = arraySolicitud.get(i).getAlmacen();
                                int usuario = arraySolicitud.get(i).getUsuario();
                                boolean activo = true;
                                boolean eliminado = false;
                                double monto = arraySolicitud.get(i).getMonto();
                                String nombreSucursal = arraySolicitud.get(i).getNombreSucursal();
                                Timestamp fecha = (Timestamp) arraySolicitud.get(i).getFecha();
                                
                                dbExp.ingresarSolicitudReposicionCierre(id, almacen, fecha, usuario, activo, eliminado, null, monto, nombreSucursal);
                            }
                            
                            for (int i = 0; i < arrayDetalleP.size(); i++) {
                                int idP = arrayDetalleP.get(i).getId();
                                int solicitud = arrayDetalleP.get(i).getSolicitud();
                                int producto = arrayDetalleP.get(i).getProducto();
                                double cantidad = arrayDetalleP.get(i).getCantidad();
                                java.sql.Date created = (java.sql.Date) arrayDetalleP.get(i).getCreatedAt();
                                java.sql.Date updated = (java.sql.Date) arrayDetalleP.get(i).getUpdatedAt();
                                
                                dbExp.insertarSolicitudProductoCierre(idP, solicitud, producto, cantidad, created, updated);
                                
                                if (tieneProductoBase(idP) == true) {
                                    for (int j = 0; j < arrayDetallePB.size(); j++) {
                                        int detalleSP = arrayDetallePB.get(j).getDetalle_solicitud_producto();
                                        if (idP == detalleSP) {
                                            int idPB = arrayDetallePB.get(j).getId();
                                            int productoBase = arrayDetallePB.get(j).getProducto_base();
                                            double cantidadIdeal = arrayDetallePB.get(j).getCantidad_ideal();
                                            double cantidadReal = arrayDetallePB.get(j).getCantidad_real();
                                            java.sql.Date createdPB = (java.sql.Date) arrayDetallePB.get(j).getCreatedat();
                                            java.sql.Date updatedPB = (java.sql.Date) arrayDetallePB.get(j).getUpdatedat();
                                            double total = arrayDetallePB.get(j).getTotal();
                                        
                                            dbExp.insertarDetalleSolicitudProductoBaseCierre(idPB, detalleSP, productoBase, cantidadIdeal, cantidadReal, created, updatedPB, total);
                                        }
                                    }
                                }                              
                            }
                            JOptionPane.showMessageDialog(null, "<html>No tiene coneccion a internet pero se guardo localmente<br>cuando este conectado sincronice para re-enviar</html>");
                            
                            //SE ACTUALIZA EL ESTADO LOCAL DE LA SOLICITUD
                            try {
                                conn = Conexion.getConnection(); 
                                if (conn.getAutoCommit()) { 
                                    conn.setAutoCommit(false); 
                                } 
                                InventarioDB invDb = new InventarioDB(conn);
                                invDb.updateSolicitud(id);
                                conn.commit();
                            } catch (SQLException e) {
                                //Hacemos rollback en caso de error
                                try {
                                    System.out.println("Entramos al rollback");
                                //Imprimimos la excepcion a la consola
                                    e.printStackTrace(System.out);
                                //Hacemos rollback
                                    conn.rollback();
                                } catch (SQLException e1) {
                                    e1.printStackTrace(System.out);
                                }
                            }
                            //dbExp.UpdateTablaSolicitudes(id);
                            tablaSolicitudes.setValueAt("<html><span style='color:RED'>Cerrado</span></html>", fila, 6);

                            String imgNoEditar = "/imagen/noeditar.png";
                            imgNoEdit = new ImageIcon(this.getClass().getResource(imgNoEditar));
                            iconNoEdit = new ImageIcon(imgNoEdit.getImage().getScaledInstance(15, 20, 1));
                            noeditar = new JButton(iconNoEdit);
                            tablaSolicitudes.setValueAt(noeditar, fila, 8);
                        }
                    
                    }     
                }
                if (botonAccion.getName().equals("editar")) {
                    
                    int id = Integer.parseInt(String.valueOf(tablaSolicitudes.getValueAt(fila, 1)));
                    String nombreSucursal = String.valueOf(tablaSolicitudes.getValueAt(fila, 2));
                    ArrayList<solicitudReposicion>arraySolicitud = new ArrayList();
                    ArrayList<detalleSolicitudProducto>arrayDetalleProducto = new ArrayList();
                    ArrayList<detalleSolicitudProductoBase>arrayDetalleProductoBase = new ArrayList();
                     
                            
                    
                    String consultaSolicitud = "SELECT ID,ALMACEN,USUARIO,ACTIVO,MONTO,FECHA FROM SOLICITUD_REPOSICION WHERE ID = "+id;
                    try {
                        rs = db.seleccionar(consultaSolicitud);
                        while(rs.next()){
                            int idS = rs.getInt(1);
                            int almacenS = rs.getInt(2);
                            int usuarioS = rs.getInt(3);
                            boolean activo = rs.getBoolean(4);
                            double monto = rs.getDouble(5);
                            Timestamp fecha = rs.getTimestamp(6);
                            
                            solicitudReposicion lista = new solicitudReposicion(idS, almacenS, usuarioS, fecha, activo, false, null, null, monto, "");
                            arraySolicitud.add(lista);
                        }
                        
                        String consultaDP = "SELECT ID,SOLICITUD,PRODUCTO,CANTIDAD FROM DETALLE_SOLICITUD_PRODUCTO WHERE SOLICITUD = "+id;
                        rs = db.seleccionar(consultaDP);
                        while (rs.next()) {                            
                            int idDP = rs.getInt(1);
                            int solicitud = rs.getInt(2);
                            int producto = rs.getInt(3);
                            double cantidad = rs.getDouble(4);
                            
                            detalleSolicitudProducto listaDP = new detalleSolicitudProducto(idDP, solicitud, producto, cantidad, null, null);
                            arrayDetalleProducto.add(listaDP);                           
                        }
                        
                        for (int i = 0; i < arrayDetalleProducto.size(); i++) {
                            int idDP = arrayDetalleProducto.get(i).getId();
                            
                            String consultaDPB = "SELECT ID,DETALLE_SOLICITUD_PRODUCTO,PRODUCTO_BASE,CANTIDAD_IDEAL,CANTIDAD_REAL,TOTAL \n" +
                                "FROM DETALLE_SOLICITUD_PRODUCTO_BASE\n" +
                                "WHERE DETALLE_SOLICITUD_PRODUCTO = "+idDP;
                            rs = db.seleccionar(consultaDPB);
                            while(rs.next()){
                                int idDPB = rs.getInt(1);
                                int detalleP = rs.getInt(2);
                                int productoBase = rs.getInt(3);
                                double cantidadIdeal = rs.getDouble(4);
                                double cantidadReal = rs.getDouble(5);
                                double total = rs.getDouble(6);
                                
                                detalleSolicitudProductoBase listaPB = new detalleSolicitudProductoBase(idDPB, detalleP, productoBase, cantidadIdeal, cantidadReal, null, null, total);
                                arrayDetalleProductoBase.add(listaPB);
                            }
                        }                  
                    } catch (Exception e) {
                        System.out.println("Error al realizar la edicion: "+e);
                    }
                    
                    AgregarProducto agregar = new AgregarProducto(this.id_usuario, id, nombreSucursal, true, arraySolicitud, arrayDetalleProducto, arrayDetalleProductoBase);
                    int resp = JOptionPane.showConfirmDialog(this, "<html>Desea editar el producto</html>", "Alerta!", JOptionPane.YES_NO_OPTION, JOptionPane.QUESTION_MESSAGE);

                    if(resp == 0){
                        agregar.setVisible(true); 
                    }
//                                    
//                    agregar.setVisible(true); 
                    
                }
                if (botonAccion.getName().equals("imprimir")) {
                    int id_detalle = Integer.parseInt(String.valueOf(tablaSolicitudes.getValueAt(fila, 1)));

                    try {
                        imprimirPDF(id_detalle);
                    } catch (FileNotFoundException ex) {
                        Logger.getLogger(Solicitudes.class.getName()).log(Level.SEVERE, null, ex);
                    }
                }
                if (botonAccion.getName().equals("ver")) {
                    int id = Integer.parseInt(String.valueOf(tablaSolicitudes.getValueAt(fila, 1)));
                    String nombreSucursal = String.valueOf(tablaSolicitudes.getValueAt(fila, 2));
                    ArrayList<solicitudReposicion>arraySolicitud = new ArrayList();
                    ArrayList<detalleSolicitudProducto>arrayDetalleProducto = new ArrayList();
                    ArrayList<detalleSolicitudProductoBase>arrayDetalleProductoBase = new ArrayList();
                     
                            
                    
                    String consultaSolicitud = "SELECT ID,ALMACEN,USUARIO,ACTIVO,MONTO,FECHA FROM SOLICITUD_REPOSICION WHERE ID = "+id;
                    try {
                        rs = db.seleccionar(consultaSolicitud);
                        while(rs.next()){
                            int idS = rs.getInt(1);
                            int almacenS = rs.getInt(2);
                            int usuarioS = rs.getInt(3);
                            boolean activo = rs.getBoolean(4);
                            double monto = rs.getDouble(5);
                            Timestamp fecha = rs.getTimestamp(6);
                            
                            solicitudReposicion lista = new solicitudReposicion(idS, almacenS, usuarioS, fecha, activo, false, null, null, monto, "");
                            arraySolicitud.add(lista);
                        }
                        
                        String consultaDP = "SELECT ID,SOLICITUD,PRODUCTO,CANTIDAD FROM DETALLE_SOLICITUD_PRODUCTO WHERE SOLICITUD = "+id;
                        rs = db.seleccionar(consultaDP);
                        while (rs.next()) {                            
                            int idDP = rs.getInt(1);
                            int solicitud = rs.getInt(2);
                            int producto = rs.getInt(3);
                            double cantidad = rs.getDouble(4);
                            
                            detalleSolicitudProducto listaDP = new detalleSolicitudProducto(idDP, solicitud, producto, cantidad, null, null);
                            arrayDetalleProducto.add(listaDP);                           
                        }
                        
                        for (int i = 0; i < arrayDetalleProducto.size(); i++) {
                            int idDP = arrayDetalleProducto.get(i).getId();
                            
                            String consultaDPB = "SELECT ID,DETALLE_SOLICITUD_PRODUCTO,PRODUCTO_BASE,CANTIDAD_IDEAL,CANTIDAD_REAL,TOTAL \n" +
                                "FROM DETALLE_SOLICITUD_PRODUCTO_BASE\n" +
                                "WHERE DETALLE_SOLICITUD_PRODUCTO = "+idDP;
                            rs = db.seleccionar(consultaDPB);
                            while(rs.next()){
                                int idDPB = rs.getInt(1);
                                int detalleP = rs.getInt(2);
                                int productoBase = rs.getInt(3);
                                double cantidadIdeal = rs.getDouble(4);
                                double cantidadReal = rs.getDouble(5);
                                double total = rs.getDouble(6);
                                
                                detalleSolicitudProductoBase listaPB = new detalleSolicitudProductoBase(idDPB, detalleP, productoBase, cantidadIdeal, cantidadReal, null, null, total);
                                arrayDetalleProductoBase.add(listaPB);
                            }
                        }                  
                    } catch (Exception e) {
                        System.out.println("Error al realizar la edicion: "+e);
                    }
                    
                    
                    AgregarProducto agregar = new AgregarProducto(this.id_usuario, id, nombreSucursal, false, arraySolicitud, arrayDetalleProducto, arrayDetalleProductoBase);                                   
                    int resp = JOptionPane.showConfirmDialog(this, "<html>Desea ver el producto</html>", "Alerta!", JOptionPane.YES_NO_OPTION, JOptionPane.QUESTION_MESSAGE);

                    if(resp == 0){
                        agregar.setVisible(true); 
                    }
                       // AgregarProducto agregar = new AgregarProducto(this.id_usuario, id, id_almacen, nom_sucur, false);
                       // agregar.setVisible(true);            
                }
                if (botonAccion.getName().equals("copiar")) {
                    //System.out.println("ERROR");
                    int id_solicitud = 0;
                    int id_solicitud_exp = 0;
                    int id_deta_pro = 0;
                    Detalle_Solicitud_Producto_Base prodBase = null;
                    Detalle_Solicitud_Producto prod = null;
                    ArrayList<detalleSolicitudProducto> arrayDSP = new ArrayList();
                    ArrayList<detalleSolicitudProductoBase> arrayDSPB = new ArrayList();
                   
                    int id = Integer.parseInt(String.valueOf(tablaSolicitudes.getValueAt(fila, 1)));
                    int ultimoIdSolicitud = 0;
                    try{
                    int idSolicitud = db.seleccionarSolicitudReposicionId();
                    ultimoIdSolicitud = idSolicitud + 1;
                    consulta = "SELECT ALMACEN,FECHA,USUARIO,ACTIVO,ELIMINADO,CREATEDAT,UPDATEDAT,MONTO,NOMBRE_SUCURSAL \n"
                            + "FROM SOLICITUD_REPOSICION \n"
                            + "WHERE ID = " + id;
                    rs = db.seleccionar(consulta);
                    while(rs.next()){
                        int almacen = rs.getInt(1); 
                        Timestamp fecha = rs.getTimestamp(2);
                        int usuario = rs.getInt(3);
                        boolean activo = rs.getBoolean(4);
                        boolean eliminado = rs.getBoolean(5);
                        java.sql.Date created = rs.getDate(6);
                        java.sql.Date updated = rs.getDate(7);
                        double monto = rs.getDouble(8);
                        String nombreSucursal = rs.getString(9);
                        
                        db.ingresarSolicitudReposicion(ultimoIdSolicitud, almacen, fecha, usuario, activo, eliminado, created, monto, nombreSucursal);
                        dbExp.ingresarSolicitudReposicionExp(ultimoIdSolicitud, almacen, fecha, usuario, activo, eliminado, created, monto, nombreSucursal);

                    }

                    id_solicitud = db.seleccionarSolicitudReposicionId();
                   
                    db.insertarProductos("UPDATE SOLICITUD_REPOSICION SET ACTIVO = "+true+" WHERE ID = "+id_solicitud);
                    dbExp.insertarProductos("UPDATE SOLICITUD_REPOSICION SET ACTIVO = "+true+" WHERE ID = "+id_solicitud);
                    }catch(Exception e){
                        System.out.println("Error al copiar solicitud reposicion: "+e);
                    }
                    try {
                        int ultimoIdDetalleProducto = 0;
                        
                        String consultaDP = "SELECT ID,SOLICITUD,PRODUCTO,CANTIDAD,CREATEDAT,UPDATEDAT FROM DETALLE_SOLICITUD_PRODUCTO WHERE SOLICITUD = "+id;
                        rs = db.seleccionar(consultaDP);
                        while(rs.next()){
                           int idDP = rs.getInt(1);
                            int solicitud = rs.getInt(2);
                            int producto = rs.getInt(3);
                            double cantidad = rs.getDouble(4);
                            java.sql.Date created = rs.getDate(5);
                            java.sql.Date updated = rs.getDate(6);                       
                            
                            int idDetalleProducto = db.seleccionarDetalleSoliciProducto();
                            ultimoIdDetalleProducto = idDetalleProducto + 1;
                            db.insertarSolicitudProducto(ultimoIdDetalleProducto,id_solicitud, producto, cantidad, updated, created);                                     
                            dbExp.insertarSolicitudProducto(ultimoIdDetalleProducto, id_solicitud, producto, cantidad, updated, created);
                            
                            //le paso el id del detalle solicitud al modelo detallesolicitudprodcuto
                            detalleSolicitudProducto listaDP = new detalleSolicitudProducto(idDP, ultimoIdDetalleProducto, producto, cantidad, created, updated);
                            arrayDSP.add(listaDP);
                        }
                        
                        
                        int idDP = 0;
                        int detalleSP = 0;
                        int ultimoIdDetallePB = 0;
                        for (int i = 0; i < arrayDSP.size(); i++) {
                            idDP = arrayDSP.get(i).getId();
                            //id detalle del nuevo producto
                            detalleSP = arrayDSP.get(i).getSolicitud();
                            
                            String consultaDPB = "SELECT ID,DETALLE_SOLICITUD_PRODUCTO,PRODUCTO_BASE,CANTIDAD_IDEAL,CANTIDAD_REAL,CREATEDAT,UPDATEDAT,TOTAL \n" +
                                "FROM DETALLE_SOLICITUD_PRODUCTO_BASE \n" +
                                "WHERE DETALLE_SOLICITUD_PRODUCTO = "+idDP;
                            rs = db.seleccionar(consultaDPB);
                            while(rs.next()){
                                int idDPB = rs.getInt(1);
                                int detalleSolicitudProducto = rs.getInt(2);
                                int productoBase = rs.getInt(3);
                                double cantidadIdeal = rs.getDouble(4);
                                double cantidadReal = rs.getDouble(5);
                                java.sql.Date created = rs.getDate(6);
                                java.sql.Date updated = rs.getDate(7);
                                double total = rs.getDouble(8);

                                int idDetalleProductoBase = db.seleccionarUltimoIdDetalleSolicitudProductoBase();
                                ultimoIdDetallePB = idDetalleProductoBase + 1;
                                db.insertarDetalleSolicitudProductoBase(ultimoIdDetallePB,detalleSP, productoBase, cantidadIdeal, cantidadReal, created, updated, cantidadReal);
                                dbExp.insertarDetalleSolicitudProductoBase(ultimoIdDetallePB,detalleSP, productoBase, cantidadIdeal, cantidadReal, created, updated, cantidadReal);         
                            }
                        }
                        JOptionPane.showMessageDialog(null, "<html>Se copio el producto<br>Sincronize el sisteme por favor!</html>");
                    } catch (Exception e) {
                        System.out.println("Error al copiar el detalle de producto: "+e);
                    }
                }

                if (botonAccion.getName().equals("eliminar")) {
                    int num = 1;
                    int id = Integer.parseInt(String.valueOf(tablaSolicitudes.getValueAt(fila, 1)));
                    int id_sdpb = 0;
                    
                    int resp = JOptionPane.showConfirmDialog(this, "<html>Desea eliminar el<br>producto?</html>", "Alerta!", JOptionPane.YES_NO_OPTION, JOptionPane.ERROR_MESSAGE);

                    if(resp == 0){
                        defaulttable.removeRow(fila);
                        for (int i = 0; i < tablaSolicitudes.getRowCount(); i++) {
                            tablaSolicitudes.setValueAt(num, i, 0);
                            num = num + 1;
                        }
                        consulta = "SELECT ID FROM DETALLE_SOLICITUD_PRODUCTO "
                                + "WHERE SOLICITUD = "+id;
                        rs = db.selectProductos(consulta);
                        try {
                            while(rs.next()){

                                String eliminarConsulta = "DELETE FROM DETALLE_SOLICITUD_PRODUCTO_BASE WHERE DETALLE_SOLICITUD_PRODUCTO = "+rs.getInt(1);
                                db.eliminarProductos(eliminarConsulta);
                                
                                dbExp.eliminarProductos(eliminarConsulta);
                            }
                        } catch (Exception e) {
                            System.out.println("error "+e);
                        }
                        String consulta2 = "DELETE FROM DETALLE_SOLICITUD_PRODUCTO WHERE SOLICITUD = "+id;
                        db.eliminarProductos(consulta2);
                        dbExp.eliminarProductos(consulta2);

                        String consulta3 = "DELETE FROM SOLICITUD_REPOSICION WHERE ID = "+id;
                        db.eliminarProductos(consulta3); 
                        dbExp.eliminarProductos(consulta3); 
                        
                        try{
                            JSONObject datos = new JSONObject();
                            String url = "/operaciones/eliminar/"+id;
                            RestServer.postJSONdata(url, datos);
                        }catch(Exception e){
                            System.out.println("Error al Elimnar: "+e);
                        }
                    }
                }
            }
        }
    }//GEN-LAST:event_tablaSolicitudesMouseClicked

    private void btnExportarActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_btnExportarActionPerformed
        vistaExportarUI vistaEx = new vistaExportarUI(this.id_usuario);
        vistaEx.setVisible(true);
        vistaEx.setLocationRelativeTo(this);
    }//GEN-LAST:event_btnExportarActionPerformed

    private void btnSincronizarActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_btnSincronizarActionPerformed
  
        ResultSet rs = null;
        String consultaSoli = "SELECT ID,ALMACEN,USUARIO,ACTIVO,ELIMINADO,MONTO,NOMBRE_SUCURSAL,FECHA FROM SOLICITUD_REPOSICION WHERE ELIMINADO = "+false;
        rs = dbExp.seleccionar(consultaSoli);
        try{
            while(rs.next()){
                int id = rs.getInt(1);
                int almacen = rs.getInt(2);
                int usuario = rs.getInt(3);
                boolean activo = rs.getBoolean(4);
                boolean eliminado = rs.getBoolean(5);
                double monto = rs.getDouble(6);
                String nombreSucur = rs.getString(7);
                Timestamp fecha = rs.getTimestamp(8);
                
                solicitudReposicion listaSolicitud = new solicitudReposicion(id, almacen, usuario, fecha, activo, eliminado, null, null, monto, nombreSucur);
                arraySolicitud.add(listaSolicitud);
            }
        }catch(Exception e){
            System.out.println("Error al seleccionar las solicitudes para la exportacion: "+e);
        }
        
        String consultaDetaPro = "SELECT ID,SOLICITUD,PRODUCTO,CANTIDAD,CREATEDAT,UPDATEDAT FROM DETALLE_SOLICITUD_PRODUCTO";
        rs = dbExp.seleccionar(consultaDetaPro);
        try {
            while(rs.next()){
                int id = rs.getInt(1);
                int solicitud = rs.getInt(2);
                int producto = rs.getInt(3);
                double cantidad = rs.getDouble(4);
                java.sql.Date created = rs.getDate(5);
                java.sql.Date updated = rs.getDate(6);
                
                detalleSolicitudProducto listaDSP = new detalleSolicitudProducto(id, solicitud, producto, cantidad, created, updated);
                arrayDetalleProducto.add(listaDSP);
            }
        } catch (Exception e) {
            System.out.println("Error al seleccionar detalle solicitud producto al exportar: "+e);
        }
        
        String consultaDSPB = "SELECT ID,DETALLE_SOLICITUD_PRODUCTO,PRODUCTO_BASE,CANTIDAD_IDEAL,CANTIDAD_REAL,TOTAL\n" +
            "FROM DETALLE_SOLICITUD_PRODUCTO_BASE";
        rs = dbExp.seleccionar(consultaDSPB);
        try {
            while (rs.next()) {                
                int id = rs.getInt(1);
                int detalleSP = rs.getInt(2);
                int producto_base = rs.getInt(3);
                double cantidadIdeal = rs.getDouble(4);
                double cantidadReal = rs.getDouble(5);
                double total = rs.getDouble(6);
                
                detalleSolicitudProductoBase listaDSPB = new detalleSolicitudProductoBase(id, detalleSP, producto_base, cantidadIdeal, cantidadReal, null, null, total);
                arrayDetalleProductoBase.add(listaDSPB);
            }
        } catch (Exception e) {
            System.out.println("Error al obtener el detalle de solicitud del producto base de la exportacion: "+e);
        }
        
        if (arraySolicitud.size() != 0) {
            try {
                JSONObject datos = new JSONObject();
                JSONObject idAlmacen = new JSONObject();
                JSONArray arrayDetalleIngredientesProducto = new JSONArray();
                JSONArray arrayDetalleIngredientesProductoNull = new JSONArray();
                JSONArray arraySolicitudProducto = new JSONArray();

                for (int i = 0; i < arraySolicitud.size(); i++) {
                    int ids = arraySolicitud.get(i).getId();
                    int id_almacen = arraySolicitud.get(i).getAlmacen();
                    Timestamp fecha = (Timestamp) arraySolicitud.get(i).getFecha();
                    int id_usuario = arraySolicitud.get(i).getUsuario();
                    boolean activo = arraySolicitud.get(i).isActivo();
                    double monto = arraySolicitud.get(i).getMonto();
                    int id_empresa = obtenerIdEmpresa();

                    idAlmacen.put("id", id_almacen);
                    datos.put("almacen", idAlmacen);
                    datos.put("fecha", fecha);
                    datos.put("id_usuario", id_usuario);
                    datos.put("activo", activo);
                    datos.put("monto", monto);
                    datos.put("id_empresa", id_empresa);

                    for (int j = 0; j < arrayDetalleProducto.size(); j++) {
                        int solicitud = arrayDetalleProducto.get(j).getSolicitud();
                        JSONObject solicitudesProductos = new JSONObject();
                        JSONObject detallesIngredientesProductoNull = new JSONObject();
                        JSONObject productoSolicitado = new JSONObject();
                        JSONObject id_producto = new JSONObject();                   

                        if (ids == solicitud) {
                            int idDP = arrayDetalleProducto.get(j).getId();
                            int producto = arrayDetalleProducto.get(j).getProducto();
                            double cantidad = arrayDetalleProducto.get(j).getCantidad();

                            productoSolicitado.put("id", producto);
                            solicitudesProductos.put("productoSolicitado", productoSolicitado);
                            solicitudesProductos.put("cantidad", cantidad);

                            if (tieneProductosBaseSincronizar(idDP) == true) {
                                for (int k = 0; k < arrayDetalleProductoBase.size(); k++) {
                                    int detalle_solicitud_producto = arrayDetalleProductoBase.get(k).getDetalle_solicitud_producto();

                                    JSONObject detallesIngredientesProducto = new JSONObject();
                                    if (idDP == detalle_solicitud_producto) {

                                        int producto_base = arrayDetalleProductoBase.get(k).getProducto_base();
                                        double cantidad_ideal = arrayDetalleProductoBase.get(k).getCantidad_ideal();
                                        double cantidad_real = arrayDetalleProductoBase.get(k).getCantidad_real();
                                        double total = arrayDetalleProductoBase.get(k).getTotal();

                                        detallesIngredientesProducto.put("cantidad_ideal", cantidad_ideal);
                                        detallesIngredientesProducto.put("cantidad_real", cantidad_real);
                                        detallesIngredientesProducto.put("id_producto_base", producto_base);
                                        detallesIngredientesProducto.put("total", total);

                                        arrayDetalleIngredientesProducto.put(detallesIngredientesProducto);
                                        solicitudesProductos.put("detallesIngredientesProducto", arrayDetalleIngredientesProducto);
                                    }
                                }
                            }else{
                                Object[] pb = {};
                                solicitudesProductos.put("detallesIngredientesProducto", pb);
                            }

                            arraySolicitudProducto.put(solicitudesProductos);
                            datos.put("solicitudesProductos", arraySolicitudProducto);
                        }
                    }

                    if (getConnectionStatus() == "Online") {
                        try {
                            int idEmp = obtenerIdEmpresa();
                            String url = "/solicitud/empresa/"+idEmp;
                            JSONObject res = RestServer.postJSONdata(url, datos);

                            dbExp.eliminarProductos("DELETE FROM SOLICITUD_REPOSICION");
                            dbExp.eliminarProductos("DELETE FROM DETALLE_SOLICITUD_PRODUCTO");
                            dbExp.eliminarProductos("DELETE FROM DETALLE_SOLICITUD_PRODUCTO_BASE");

                            db.eliminarProductos("DELETE FROM SOLICITUD_REPOSICION");
                            db.eliminarProductos("DELETE FROM DETALLE_SOLICITUD_PRODUCTO");
                            db.eliminarProductos("DELETE FROM DETALLE_SOLICITUD_PRODUCTO_BASE");
                            sincronizar();
                            JOptionPane.showMessageDialog(null, "Se sincronizaron los datos!.");
                            //labelPendientes.setText("0");
                            
                        } catch (Exception e) {
                            System.out.println("Error: "+e);
                            JOptionPane.showMessageDialog(null, "Error en la sincronizacon: "+e);
                        }

                    }else{
                        JOptionPane.showMessageDialog(null, "<html>No se pudieron cargar los datos al servido Agil.<br>Conectece a una red de internet o sincronize mas tarde</html>");
                    }


                }
            } catch (Exception e) {
                System.out.println("Error al enviar el JSON:"+ e);
            }
        }
        cerrarSolicitudes();

        //dbExp.eliminarProductos("DELETE FROM SOLICITUD_REPOSICION_CIERRE");
        dbExp.eliminarProductos("DELETE FROM DETALLE_SOLICITUD_PRODUCTO_CIERRE");
        dbExp.eliminarProductos("DELETE FROM DETALLE_SOLICITUD_PRODUCTO_BASE_CIERRE");
    }//GEN-LAST:event_btnSincronizarActionPerformed

    private void jbuttonAgregar1ActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jbuttonAgregar1ActionPerformed
        System.exit(0);
    }//GEN-LAST:event_jbuttonAgregar1ActionPerformed

    public void imprimirPDF(int id_detalle) throws FileNotFoundException {
       // Connection con;
        try {

          //  con = DriverManager.getConnection("jdbc:derby:.\\dbOperaciones");
            JasperReport reporte = null;
            //System.out.println(new File (".").getAbsolutePath());
            String path =System.getProperty("user.dir") +"\\Reportes\\reporte_solicitud_detalle.jasper"; //"C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\Operaciones\\src\\Reportes\\reporte_solicitud_detalle.jasper";
            
            Object id = id_detalle;      
            Map parametro = new HashMap();
            parametro.put("id_detalle", id);

            reporte = (JasperReport) JRLoader.loadObjectFromFile(path);

            JasperPrint jprint = JasperFillManager.fillReport(reporte, parametro, db.Conectar());
            JasperViewer view = new JasperViewer(jprint, false);
            view.setDefaultCloseOperation(DISPOSE_ON_CLOSE);
            view.setVisible(true);

        } catch (Exception e) {
            JOptionPane.showMessageDialog(null, "Error al abrir el archivo: " + e);
            System.out.println("Error: "+e.getMessage());
        }
    }
    
    /**
     * @param args the command line arguments
     */

    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JButton btnExportar;
    private javax.swing.JButton btnSincronizar;
    private javax.swing.JButton jButtonFiltro;
    private javax.swing.JComboBox<String> jComboActivo;
    private javax.swing.JComboBox<String> jComboAlmacen;
    private javax.swing.JComboBox<String> jComboSucursal;
    private com.toedter.calendar.JDateChooser jDateDesde;
    private com.toedter.calendar.JDateChooser jDateHasta;
    private javax.swing.JLabel jLabel1;
    private javax.swing.JLabel jLabel10;
    private javax.swing.JLabel jLabel2;
    private javax.swing.JLabel jLabel3;
    private javax.swing.JLabel jLabel4;
    private javax.swing.JLabel jLabel5;
    private javax.swing.JLabel jLabel6;
    private javax.swing.JLabel jLabel7;
    private javax.swing.JLabel jLabel8;
    private javax.swing.JLabel jLabel9;
    private javax.swing.JPanel jPanel1;
    private javax.swing.JPanel jPanel2;
    private javax.swing.JPanel jPanel3;
    private javax.swing.JPanel jPanel4;
    private javax.swing.JScrollPane jScrollPane1;
    private javax.swing.JButton jbuttonAgregar;
    private javax.swing.JButton jbuttonAgregar1;
    private javax.swing.JTable tablaSolicitudes;
    // End of variables declaration//GEN-END:variables
}
