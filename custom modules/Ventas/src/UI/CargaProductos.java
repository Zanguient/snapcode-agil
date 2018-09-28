/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package UI;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;
import Conexion.DataBase;
import Conexion.RestServer;
import org.json.JSONArray;
import org.json.JSONObject;

/**
 *
 * @author AGIL
 */
public class CargaProductos extends Thread {

    public DataBase db = new DataBase();
    public int id_usuario;
    public int idEmpresa;

    public CargaProductos(String name, int id_usuario, int idEmpresa) {
        super(name);
        this.id_usuario = id_usuario;
        this.idEmpresa = idEmpresa;
    }

    public void obtenerAlmacen() {
        int idAlmacen = 0;
        ResultSet rs = null;
        String consulta = "SELECT A.ID\n" +
            "FROM ALMACEN AS A\n" +
            "INNER JOIN SUCURSAL AS S ON S.ID = A.SUCURSAL\n" +
            "WHERE S.EMPRESA = " + this.idEmpresa;
        try {
            rs = db.seleccionar(consulta);
            while (rs.next()) {
                idAlmacen = rs.getInt(1);
                //if (idAlmacen != 0) {
                    SeleccionarProductosPanel(this.id_usuario, idAlmacen, this.idEmpresa);
               // }
            }
        } catch (Exception e) {
            System.out.println("Error al seleccionar id sucursal: " + e.getMessage());
        } finally {
            try {
                rs.close();
                db.Conectar().close();
            } catch (SQLException ex) {
                Logger.getLogger(CargaProductos.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
        System.out.println("Salio Productos");
    }

    private void SeleccionarProductosPanel(int id_usuario, int id_almacen, int idEmp) {

//        for (int i = 0; i < db.seleccionarIdEmpresa(id_usuario).size(); i++) {
//            idEmp = db.seleccionarIdEmpresa(id_usuario).get(i).getId_empresa();
//        }     
        String url = "/productos-panel/empresa/"+idEmp+"/almacen/"+id_almacen+"/user/"+id_usuario;

        try {
            JSONArray res = RestServer.getJSONArray(url);

            int cantiInvetario = 0;
            for (int i = 0; i < res.length(); i++) {
                JSONObject data = res.getJSONObject(i);
                int id = (data.get("id").toString().equals("null")? 0:Integer.parseInt(data.get("id").toString()));
                int id_empresa = (data.get("id_empresa").toString().equals("null"))? 0:Integer.parseInt(data.get("id_empresa").toString());
                String nombre = (data.get("nombre").toString().equals("null"))? "":(String)data.get("nombre").toString();
                String imagen = (data.get("imagen").toString().equals("null"))? "":(String)data.get("imagen").toString();
                String codigo = (data.get("codigo").toString().equals("null"))? "":(String)data.get("codigo").toString();
                String unidad_medida = (data.get("unidad_medida").toString().equals("null"))? "":(String)data.get("unidad_medida").toString();
                double precio_unitario = (data.get("precio_unitario").toString().equals("null"))? 0:Double.parseDouble(data.get("precio_unitario").toString());
                double utilidad_esperada = (data.get("utilidad_esperada").toString().equals("null"))? 0:Double.parseDouble(data.get("utilidad_esperada").toString());
                int inventario_minimo = (data.get("inventario_minimo").toString().equals("null"))? 0:Integer.parseInt(data.get("inventario_minimo").toString());
                String descripcion = (data.get("descripcion").toString().equals("null"))? "":(String)data.get("descripcion").toString();
                int id_grupo = (data.get("id_grupo").toString().equals("null"))? 0:Integer.parseInt(data.get("id_grupo").toString());
                int id_subgrupo = (data.get("id_subgrupo").toString().equals("null"))? 0:Integer.parseInt(data.get("id_subgrupo").toString());
                String caracteristica_especial1 = (data.get("caracteristica_especial1").toString().equals("null"))? "":(String)data.get("caracteristica_especial1").toString();
                String caracteristica_especial2 = (data.get("caracteristica_especial2").toString().equals("null"))? "":(String)data.get("caracteristica_especial2").toString();
                String codigo_fabrica = (data.get("codigo_fabrica").toString().equals("null"))? "": (String)data.get("codigo_fabrica").toString();
                double rango_max = (data.get("rango_positivo").toString().equals("null"))? 0:Double.parseDouble(data.get("rango_positivo").toString());
                double rango_min = (data.get("rango_negativo").toString().equals("null"))? 0:Double.parseDouble(data.get("rango_negativo").toString());
                String created = (data.get("createdAt").toString().equals("null"))? "":(String)data.get("createdAt").toString();
                String updated = (data.get("updatedAt").toString().equals("null"))? "":(String)data.get("updatedAt").toString();
                double comision = (data.get("comision").toString().equals("null"))? 0:Double.parseDouble(data.get("comision").toString());
                boolean publicar_panel = data.getBoolean("publicar_panel");
                int alerta = (data.get("alerta").toString().equals("null"))? 0:Integer.parseInt(data.get("alerta").toString());
                int descuento = (data.get("descuento").toString().equals("null"))? 0:Integer.parseInt(data.get("descuento").toString());
                boolean descuento_fijo = (data.get("descuento_fijo").toString().equals("null"))? false:Boolean.parseBoolean(data.get("descuento_fijo").toString());
                int tipo_producto = (data.get("id_tipo_producto").toString().equals("null"))? 0:Integer.parseInt(data.get("id_tipo_producto").toString());
                boolean activar_inventario = data.getBoolean("activar_inventario");
                String marca = (data.get("marca").toString().equals("null"))? "":(String)data.get("marca").toString();
                String modelo = (data.get("modelo").toString().equals("null"))? "":(String)data.get("modelo").toString();
                String anio = (data.get("anio").toString().equals("null"))? "":(String)data.get("anio").toString();
                int almacen_erp = (data.get("id_almacen_erp").toString().equals("null"))? 0:Integer.parseInt(data.get("id_almacen_erp").toString());
                int cuenta = (data.get("id_cuenta").toString().equals("null"))? 0:Integer.parseInt(data.get("id_cuenta").toString());
                boolean eliminado = false;

                db.insertarProductos(id, id_empresa, id_almacen, nombre, codigo, unidad_medida, precio_unitario, utilidad_esperada, inventario_minimo, descripcion, id_grupo, id_subgrupo, caracteristica_especial1, caracteristica_especial2, codigo_fabrica, rango_max, rango_min, created, updated, comision, publicar_panel, alerta, descuento, descuento_fijo, tipo_producto, activar_inventario, marca, modelo, anio, cuenta, imagen, eliminado);             
    
                //Reecorre Inventarios
                JSONArray inventarios = data.getJSONArray("inventarios");
                for (int k = 0; k < inventarios.length(); k++) {
                    int inv_id = 0;
                    int inv_id_alma = 0;
                    int inv_id_pro = 0;
                    double inv_cant = 0;
                    double inv_cost_unit = 0;
                    double inv_cost_to = 0;
                    String inv_lote = "";
                    String inv_fecha_venci = "";
                    String inv_createdAt = "";
                    String inv_updatedAt = "";
                    JSONObject inventario = inventarios.getJSONObject(k);

                    inv_id = (inventario.get("id").toString().equals("null"))? 0:Integer.parseInt(inventario.get("id").toString());
                    inv_id_alma = (inventario.get("id_almacen").toString().equals("null"))? 0:Integer.parseInt(inventario.get("id_almacen").toString());
                    inv_id_pro = (inventario.get("id_producto").toString().equals("null"))? 0:Integer.parseInt(inventario.get("id_producto").toString());
                    inv_cant = (inventario.get("cantidad").toString().equals("null"))? 0:Double.parseDouble(inventario.get("cantidad").toString());
                    
                    inv_cost_unit = (inventario.get("costo_unitario").toString().equals("null"))? 0:Double.parseDouble(inventario.get("costo_unitario").toString());
                    inv_cost_to = (inventario.get("costo_total").toString().equals("null"))? 0:Double.parseDouble(inventario.get("costo_total").toString());

                    inv_lote = (inventario.get("lote").toString().equals("null"))? "":(String) inventario.get("lote").toString();

                    inv_fecha_venci = (inventario.get("fecha_vencimiento").toString().equals("null"))? "":(String)inventario.get("fecha_vencimiento").toString();
                    inv_createdAt = (String) inventario.get("createdAt").toString();
                    inv_updatedAt = (String) inventario.get("updatedAt").toString();
                    
                    db.eliminar("DELETE FROM INV_INVENTARIO WHERE ID = "+inv_id);
                    db.insertarInventario(inv_id, inv_id_alma, inv_id_pro, inv_cant, inv_cost_unit, inv_cost_to, inv_fecha_venci, inv_lote, inv_createdAt, inv_updatedAt);

                }

                //Ingresamos los productos  base             
                JSONArray productosBase = data.getJSONArray("productosBase");

                for (int j = 0; j < productosBase.length(); j++) {
                    JSONObject prodBase = productosBase.getJSONObject(j);

                    int idPB = (prodBase.get("id").toString().equals("null"))? 0:Integer.parseInt(prodBase.get("id").toString());
                    int id_producto = (prodBase.get("id_producto").toString().equals("null"))? 0:Integer.parseInt(prodBase.get("id_producto").toString());
                    int id_prodcutoBase = (prodBase.get("id_producto_base").toString().equals("null"))? 0:Integer.parseInt(prodBase.get("id_producto_base").toString());
                    double formulacion = (prodBase.get("formulacion").toString().equals("null"))? 0:Double.parseDouble(prodBase.get("formulacion").toString());                  
                    db.insertarProductoBase(idPB, id_producto, id_prodcutoBase, formulacion, created, updated, eliminado);
                
                    if (!prodBase.get("productoBase").equals("null") ) {
                            
                        int idProBase = prodBase.getJSONObject("productoBase").getInt("id");
                        int empresaProBase =   prodBase.getJSONObject("productoBase").getInt("id_empresa");
                        String nombreProBase =   prodBase.getJSONObject("productoBase").getString("nombre");
                        String imagenProBase =   prodBase.getJSONObject("productoBase").getString("imagen");                        
                        String codigoProBase =   prodBase.getJSONObject("productoBase").getString("codigo");                        
                        String unidad_medida_prodBase =   prodBase.getJSONObject("productoBase").getString("unidad_medida");                        
                        double precio_unitario_prodBase = (prodBase.getJSONObject("productoBase").get("precio_unitario").toString().equals("null"))? 0:Double.parseDouble(prodBase.getJSONObject("productoBase").get("precio_unitario").toString());
                        int inventario_minimo_proBase = (prodBase.getJSONObject("productoBase").get("inventario_minimo").toString().equals("null"))? 0:Integer.parseInt(prodBase.getJSONObject("productoBase").get("inventario_minimo").toString());

                        double utilidad_esperada_proBase = (prodBase.getJSONObject("productoBase").get("utilidad_esperada").toString().equals("null"))? 0:Double.parseDouble(prodBase.getJSONObject("productoBase").get("utilidad_esperada").toString());
                        String descripcion_prodBase = (prodBase.getJSONObject("productoBase").get("descripcion").toString().equals("null"))? "":(String)prodBase.getJSONObject("productoBase").get("descripcion").toString();
                        int id_grupo_prodBase = (prodBase.getJSONObject("productoBase").get("id_grupo").toString().equals("null"))? 0:Integer.parseInt(prodBase.getJSONObject("productoBase").get("id_grupo").toString());
                        int id_subgrupo_prodBase = (prodBase.getJSONObject("productoBase").get("id_subgrupo").toString().equals("null"))? 0:Integer.parseInt(prodBase.getJSONObject("productoBase").get("id_subgrupo").toString());
                        String caracteristica_especial1_prodBase = (prodBase.getJSONObject("productoBase").get("caracteristica_especial1").toString().equals("null"))? "":(String)prodBase.getJSONObject("productoBase").get("caracteristica_especial1").toString();
                        String caracteristica_especial2_prodBase = (prodBase.getJSONObject("productoBase").get("caracteristica_especial2").toString().equals("null"))? "":(String)prodBase.getJSONObject("productoBase").get("caracteristica_especial2").toString();
                        String codigo_fabrica_prodBase = (prodBase.getJSONObject("productoBase").get("codigo_fabrica").toString().equals("null"))? "": (String)prodBase.getJSONObject("productoBase").get("codigo_fabrica").toString();
                        double rango_max_proBase = (prodBase.getJSONObject("productoBase").get("rango_positivo").toString().equals("null"))? 0:Double.parseDouble(prodBase.getJSONObject("productoBase").get("rango_positivo").toString());
                        double rango_min_proBase = (prodBase.getJSONObject("productoBase").get("rango_negativo").toString().equals("null"))? 0:Double.parseDouble(prodBase.getJSONObject("productoBase").get("rango_negativo").toString());
                        String created_proBase = (prodBase.getJSONObject("productoBase").get("createdAt").toString().equals("null"))? "":(String)prodBase.getJSONObject("productoBase").get("createdAt").toString();
                        String updated_prodBase = (prodBase.getJSONObject("productoBase").get("updatedAt").toString().equals("null"))? "":(String)prodBase.getJSONObject("productoBase").get("updatedAt").toString();
                        double comision_proBase = (prodBase.getJSONObject("productoBase").get("comision").toString().equals("null"))? 0:Double.parseDouble(prodBase.getJSONObject("productoBase").get("comision").toString());
                        boolean publicar_panel_proBase = data.getBoolean("publicar_panel");
                        int alerta_proBase = (prodBase.getJSONObject("productoBase").get("alerta").toString().equals("null"))? 0:Integer.parseInt(prodBase.getJSONObject("productoBase").get("alerta").toString());
                        int descuento_proBase = (prodBase.getJSONObject("productoBase").get("descuento").toString().equals("null"))? 0:Integer.parseInt(prodBase.getJSONObject("productoBase").get("descuento").toString());
                        boolean descuento_fijo_proBase = (prodBase.getJSONObject("productoBase").get("descuento_fijo").toString().equals("null"))? false:Boolean.parseBoolean(prodBase.getJSONObject("productoBase").get("descuento_fijo").toString());
                        int tipo_producto_proBase = (prodBase.getJSONObject("productoBase").get("id_tipo_producto").toString().equals("null"))? 0:Integer.parseInt(prodBase.getJSONObject("productoBase").get("id_tipo_producto").toString());
                        boolean activar_inventario_proBase = data.getBoolean("activar_inventario");
                        String marca_proBase = (prodBase.getJSONObject("productoBase").get("marca").toString().equals("null"))? "":(String)prodBase.getJSONObject("productoBase").get("marca").toString();
                        String modelo_proBase = (prodBase.getJSONObject("productoBase").get("modelo").toString().equals("null"))? "":(String)prodBase.getJSONObject("productoBase").get("modelo").toString();
                        String anio_proBase = (prodBase.getJSONObject("productoBase").get("anio").toString().equals("null"))? "":(String)prodBase.getJSONObject("productoBase").get("anio").toString();
                        int almacen_erp_proBase = (prodBase.getJSONObject("productoBase").get("id_almacen_erp").toString().equals("null"))? 0:Integer.parseInt(prodBase.getJSONObject("productoBase").get("id_almacen_erp").toString());
                        int cuenta_proBase = (prodBase.getJSONObject("productoBase").get("id_cuenta").toString().equals("null"))? 0:Integer.parseInt(prodBase.getJSONObject("productoBase").get("id_cuenta").toString());
                        boolean eliminado_proBase = false;
                        
                        
                        String nombre_pb = prodBase.getJSONObject("productoBase").getString("nombre");
                        String unid_med_pb = prodBase.getJSONObject("productoBase").getString("unidad_medida");
                        int precio_unit_pb = prodBase.getJSONObject("productoBase").getInt("precio_unitario");
                        
                        db.insertarProductosBases(idProBase, empresaProBase, nombreProBase, codigoProBase, unidad_medida_prodBase, precio_unitario_prodBase, utilidad_esperada_proBase, inventario_minimo_proBase, descripcion_prodBase, id_grupo_prodBase, id_subgrupo_prodBase, caracteristica_especial1_prodBase, caracteristica_especial2_prodBase, codigo_fabrica_prodBase, rango_max_proBase, rango_min_proBase, created_proBase, updated_prodBase, comision_proBase, publicar_panel_proBase, alerta_proBase, descuento_proBase, descuento_fijo_proBase, tipo_producto_proBase, activar_inventario_proBase, marca_proBase, modelo_proBase, anio_proBase, cuenta_proBase, imagenProBase, eliminado_proBase);             
                                            
                        JSONArray inventariosPb = prodBase.getJSONObject("productoBase").getJSONArray("inventarios");
                        for (int k = 0; k < inventariosPb.length(); k++) {
                            JSONObject inventariospb = inventariosPb.getJSONObject(k);

                            int inv_id = 0;
                            int inv_id_alma = 0;
                            int inv_id_pro = 0;
                            int inv_cant = 0;
                            int inv_cost_unit = 0;
                            int inv_cost_to = 0;
                            String inv_lote = "";
                            String inv_fecha_venci = "";
                            String inv_createdAt = "";
                            String inv_updatedAt = "";

                            inv_id = inventariospb.getInt("id");
                            inv_id_alma = inventariospb.getInt("id_almacen");
                            inv_id_pro = inventariospb.getInt("id_producto");
                            inv_cant = inventariospb.getInt("cantidad");
                            inv_cost_unit = inventariospb.getInt("costo_unitario");
                            inv_cost_to = inventariospb.getInt("costo_total");
                            inv_lote = (String) inventariospb.get("lote").toString();
                            inv_fecha_venci = (inventariospb.get("fecha_vencimiento").toString().equals("null"))? "":(String)inventariospb.get("fecha_vencimiento").toString();
                            inv_createdAt = (String) inventariospb.get("createdAt").toString();
                            inv_updatedAt = (String) inventariospb.get("updatedAt").toString();
                            
                            db.insertarInventario(inv_id, inv_id_alma, inv_id_pro, inv_cant, inv_cost_unit, inv_cost_to, inv_fecha_venci, inv_lote, inv_createdAt, inv_updatedAt);
                       
                        }
                        
                        JSONArray productosBaseB =  prodBase.getJSONObject("productoBase").getJSONArray("productosBase");
                        if (productosBaseB.length() > 0) {
                            for (int k = 0; k < productosBaseB.length(); k++) {
                                JSONObject productoBaseB = productosBaseB.getJSONObject(k);
                                int idProductoBaseB = productoBaseB.getInt("id");
                                int ProductoB = productoBaseB.getInt("id_producto");
                                int ProductoBaseB = productoBaseB.getInt("id_producto_base");
                                double formulacionB = (productoBaseB.get("formulacion").toString().equals("null"))? 0:Double.parseDouble(productoBaseB.get("formulacion").toString()); 
                                String createdB = productoBaseB.getString("createdAt");
                                String updatedB = productoBaseB.getString("updatedAt");

                                db.insertarProductoBase(ProductoBaseB, ProductoB, ProductoBaseB, formulacionB, createdB, updatedB, eliminado);

                                if (!productoBaseB.get("productoBase").equals("null") ) {
                                    int idProBaseB = productoBaseB.getJSONObject("productoBase").getInt("id");
                                    int empresaProBaseB =   productoBaseB.getJSONObject("productoBase").getInt("id_empresa");
                                    String nombreProBaseB =   productoBaseB.getJSONObject("productoBase").getString("nombre");
                                    String imagenProBaseB =   productoBaseB.getJSONObject("productoBase").getString("imagen");                        
                                    String codigoProBaseB =   productoBaseB.getJSONObject("productoBase").getString("codigo");                        
                                    String unidad_medida_prodBaseB =   productoBaseB.getJSONObject("productoBase").getString("unidad_medida");                        
                                    double precio_unitario_prodBaseB = (productoBaseB.getJSONObject("productoBase").get("precio_unitario").toString().equals("null"))? 0:Double.parseDouble(productoBaseB.getJSONObject("productoBase").get("precio_unitario").toString());
                                    int inventario_minimo_proBaseB = (productoBaseB.getJSONObject("productoBase").get("inventario_minimo").toString().equals("null"))? 0:Integer.parseInt(productoBaseB.getJSONObject("productoBase").get("inventario_minimo").toString());

                                    double utilidad_esperada_proBaseB = (productoBaseB.getJSONObject("productoBase").get("utilidad_esperada").toString().equals("null"))? 0:Double.parseDouble(productoBaseB.getJSONObject("productoBase").get("utilidad_esperada").toString());
                                    String descripcion_prodBaseB = (productoBaseB.getJSONObject("productoBase").get("descripcion").toString().equals("null"))? "":(String)productoBaseB.getJSONObject("productoBase").get("descripcion").toString();
                                    int id_grupo_prodBaseB = (productoBaseB.getJSONObject("productoBase").get("id_grupo").toString().equals("null"))? 0:Integer.parseInt(productoBaseB.getJSONObject("productoBase").get("id_grupo").toString());
                                    int id_subgrupo_prodBaseB = (productoBaseB.getJSONObject("productoBase").get("id_subgrupo").toString().equals("null"))? 0:Integer.parseInt(productoBaseB.getJSONObject("productoBase").get("id_subgrupo").toString());
                                    String caracteristica_especial1_prodBaseB = (productoBaseB.getJSONObject("productoBase").get("caracteristica_especial1").toString().equals("null"))? "":(String)productoBaseB.getJSONObject("productoBase").get("caracteristica_especial1").toString();
                                    String caracteristica_especial2_prodBaseB = (productoBaseB.getJSONObject("productoBase").get("caracteristica_especial2").toString().equals("null"))? "":(String)productoBaseB.getJSONObject("productoBase").get("caracteristica_especial2").toString();
                                    String codigo_fabrica_prodBaseB = (productoBaseB.getJSONObject("productoBase").get("codigo_fabrica").toString().equals("null"))? "": (String)productoBaseB.getJSONObject("productoBase").get("codigo_fabrica").toString();
                                    double rango_max_proBaseB = (productoBaseB.getJSONObject("productoBase").get("rango_positivo").toString().equals("null"))? 0:Double.parseDouble(productoBaseB.getJSONObject("productoBase").get("rango_positivo").toString());
                                    double rango_min_proBaseB = (productoBaseB.getJSONObject("productoBase").get("rango_negativo").toString().equals("null"))? 0:Double.parseDouble(productoBaseB.getJSONObject("productoBase").get("rango_negativo").toString());
                                    String created_proBaseB = (productoBaseB.getJSONObject("productoBase").get("createdAt").toString().equals("null"))? "":(String)productoBaseB.getJSONObject("productoBase").get("createdAt").toString();
                                    String updated_prodBaseB = (productoBaseB.getJSONObject("productoBase").get("updatedAt").toString().equals("null"))? "":(String)productoBaseB.getJSONObject("productoBase").get("updatedAt").toString();
                                    double comision_proBaseB = (productoBaseB.getJSONObject("productoBase").get("comision").toString().equals("null"))? 0:Double.parseDouble(productoBaseB.getJSONObject("productoBase").get("comision").toString());
                                    boolean publicar_panel_proBaseB = productoBaseB.getJSONObject("productoBase").getBoolean("publicar_panel");
                                    int alerta_proBaseB = (productoBaseB.getJSONObject("productoBase").get("alerta").toString().equals("null"))? 0:Integer.parseInt(productoBaseB.getJSONObject("productoBase").get("alerta").toString());
                                    int descuento_proBaseB = (productoBaseB.getJSONObject("productoBase").get("descuento").toString().equals("null"))? 0:Integer.parseInt(productoBaseB.getJSONObject("productoBase").get("descuento").toString());
                                    boolean descuento_fijo_proBaseB = (productoBaseB.getJSONObject("productoBase").get("descuento_fijo").toString().equals("null"))? false:Boolean.parseBoolean(productoBaseB.getJSONObject("productoBase").get("descuento_fijo").toString());
                                    int tipo_producto_proBaseB = (productoBaseB.getJSONObject("productoBase").get("id_tipo_producto").toString().equals("null"))? 0:Integer.parseInt(productoBaseB.getJSONObject("productoBase").get("id_tipo_producto").toString());
                                    boolean activar_inventario_proBaseB = productoBaseB.getJSONObject("productoBase").getBoolean("activar_inventario");
                                    String marca_proBaseB = (productoBaseB.getJSONObject("productoBase").get("marca").toString().equals("null"))? "":(String)productoBaseB.getJSONObject("productoBase").get("marca").toString();
                                    String modelo_proBaseB = (productoBaseB.getJSONObject("productoBase").get("modelo").toString().equals("null"))? "":(String)productoBaseB.getJSONObject("productoBase").get("modelo").toString();
                                    String anio_proBaseB = (productoBaseB.getJSONObject("productoBase").get("anio").toString().equals("null"))? "":(String)productoBaseB.getJSONObject("productoBase").get("anio").toString();
                                    int almacen_erp_proBaseB = (productoBaseB.getJSONObject("productoBase").get("id_almacen_erp").toString().equals("null"))? 0:Integer.parseInt(productoBaseB.getJSONObject("productoBase").get("id_almacen_erp").toString());
                                    int cuenta_proBaseB = (productoBaseB.getJSONObject("productoBase").get("id_cuenta").toString().equals("null"))? 0:Integer.parseInt(productoBaseB.getJSONObject("productoBase").get("id_cuenta").toString());
                                    boolean eliminado_proBaseB = false;


                                    String nombre_pbB = productoBaseB.getJSONObject("productoBase").getString("nombre");
                                    String unid_med_pbB = productoBaseB.getJSONObject("productoBase").getString("unidad_medida");
                                    int precio_unit_pbB = productoBaseB.getJSONObject("productoBase").getInt("precio_unitario");

                                    db.insertarProductosBases(idProBase, empresaProBase, nombreProBase, codigoProBase, unidad_medida_prodBase, precio_unitario_prodBase, utilidad_esperada_proBase, inventario_minimo_proBase, descripcion_prodBase, id_grupo_prodBase, id_subgrupo_prodBase, caracteristica_especial1_prodBase, caracteristica_especial2_prodBase, codigo_fabrica_prodBase, rango_max_proBase, rango_min_proBase, created_proBase, updated_prodBase, comision_proBase, publicar_panel_proBase, alerta_proBase, descuento_proBase, descuento_fijo_proBase, tipo_producto_proBase, activar_inventario_proBase, marca_proBase, modelo_proBase, anio_proBase, cuenta_proBase, imagenProBase, eliminado_proBase);             

                                    JSONArray inventariosPbB = productoBaseB.getJSONObject("productoBase").getJSONArray("inventarios");
                                    for (int l = 0; l < inventariosPbB.length(); l++) {
                                        JSONObject inventariospb = inventariosPbB.getJSONObject(l);

                                        int inv_id = 0;
                                        int inv_id_alma = 0;
                                        int inv_id_pro = 0;
                                        int inv_cant = 0;
                                        int inv_cost_unit = 0;
                                        int inv_cost_to = 0;
                                        String inv_lote = "";
                                        String inv_fecha_venci = "";
                                        String inv_createdAt = "";
                                        String inv_updatedAt = "";

                                        inv_id = inventariospb.getInt("id");
                                        inv_id_alma = inventariospb.getInt("id_almacen");
                                        inv_id_pro = inventariospb.getInt("id_producto");
                                        inv_cant = inventariospb.getInt("cantidad");
                                        inv_cost_unit = inventariospb.getInt("costo_unitario");
                                        inv_cost_to = inventariospb.getInt("costo_total");
                                        inv_lote = (String) inventariospb.get("lote").toString();
                                        inv_fecha_venci = (inventariospb.get("fecha_vencimiento").toString().equals("null"))? "":(String)inventariospb.get("fecha_vencimiento").toString();
                                        inv_createdAt = (String) inventariospb.get("createdAt").toString();
                                        inv_updatedAt = (String) inventariospb.get("updatedAt").toString();

                                        db.insertarInventario(inv_id, inv_id_alma, inv_id_pro, inv_cant, inv_cost_unit, inv_cost_to, inv_fecha_venci, inv_lote, inv_createdAt, inv_updatedAt);
                                    }
                                }
                            }
                        }
                        
                    }  
                }
            }
        } catch (Exception e) {
            System.out.println(e);
            System.out.println("Error: " + e.getMessage());
            
        }
    }

    @Override
    public void run(){   
         System.out.println("Entro Productos");
        try {
            obtenerAlmacen();
        } catch (Exception e) {
            System.out.println("Error en el hilo al cargar los productos");
            e.printStackTrace();
        }
    }
}
