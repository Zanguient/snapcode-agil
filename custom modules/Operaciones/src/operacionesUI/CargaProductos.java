/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package operacionesUI;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;
import models.Database;
import models.RestServer;
import org.json.JSONArray;
import org.json.JSONObject;

/**
 *
 * @author AGIL
 */
public class CargaProductos extends Thread {

    public Database db = new Database();
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
        String consulta = "SELECT A.ID\n"
                + "FROM ALMACEN AS A\n"
                + "INNER JOIN SUCURSAL AS S ON S.ID = A.ID_SUCURSAL\n"
                + "WHERE S.ID_USUARIO = " + this.id_usuario;
        try {
            rs = db.seleccionar(consulta);
            while (rs.next()) {
                idAlmacen = rs.getInt(1);
                if (idAlmacen != 0) {
                    SeleccionarProductosPanel(this.id_usuario, idAlmacen, this.idEmpresa);
                }
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
        int id_alma = 0;
        int id_producto = 0;
        String nombreProducto = "";
        String unidad_medida = "";
        double precio_unitario = 0;
        double prec_unit = 0;
        String nombre_sucursal = "";
        int id_grupo = 0;
        int id_subgrupo = 0;
        String codigo = "";
        int id_pb = 0;
        String imagen = "";
        //int idEmp = 0; 
        double utilida_esperada = 0;
        int inventario_minimo = 0;
        boolean activarInventario = false;

//        for (int i = 0; i < db.seleccionarIdEmpresa(id_usuario).size(); i++) {
//            idEmp = db.seleccionarIdEmpresa(id_usuario).get(i).getId_empresa();
//        }     
        String url = "/productos-panel/empresa/" + idEmp + "/almacen/" + id_almacen + "/user/" + id_usuario;

        try {
            JSONArray res = RestServer.getJSONArray(url);

            int cantiInvetario = 0;
            for (int i = 0; i < res.length(); i++) {
                JSONObject data = res.getJSONObject(i);

                id_producto = data.getInt("id");
                nombreProducto = data.getString("nombre");
                unidad_medida = (String) data.get("unidad_medida").toString();
                precio_unitario = (data.get("precio_unitario").toString().equals("null")) ? 0 : Double.parseDouble(data.get("precio_unitario").toString());
                imagen = data.get("imagen").toString();
                id_alma = id_almacen;
                id_grupo = (data.get("id_grupo").toString().equals("null")) ? 0 : Integer.parseInt(data.get("id_grupo").toString());
                id_subgrupo = (data.get("id_subgrupo").toString().equals("null")) ? 0 : Integer.parseInt(data.get("id_subgrupo").toString());
                activarInventario = data.getBoolean("activar_inventario");
                codigo = (data.get("codigo_fabrica").toString().equals("null")) ? "" : (String) data.get("codigo_fabrica").toString();

                db.insertarProductos(id_alma, id_producto, nombreProducto, unidad_medida, precio_unitario, id_grupo, id_subgrupo, activarInventario, codigo);

                //Reecorre Inventarios
                JSONArray inventarios = data.getJSONArray("inventarios");
                for (int k = 0; k < inventarios.length(); k++) {
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
                    JSONObject inventario = inventarios.getJSONObject(k);

                    inv_id = inventario.getInt("id");
                    inv_id_alma = inventario.getInt("id_almacen");
                    inv_id_pro = inventario.getInt("id_producto");
                    inv_cant = inventario.getInt("cantidad");
                    cantiInvetario += inv_cant;
                    inv_cost_unit = inventario.getInt("costo_unitario");
                    inv_cost_to = inventario.getInt("costo_total");

                    inv_lote = (String) inventario.get("lote").toString();

                    inv_fecha_venci = (String) inventario.get("fecha_vencimiento").toString();
                    inv_createdAt = (String) inventario.get("createdAt").toString();
                    inv_updatedAt = (String) inventario.get("updatedAt").toString();

                    db.insertarInventario(inv_id, inv_id_alma, inv_id_pro, inv_cant, inv_cost_unit, inv_cost_to, inv_fecha_venci, inv_lote, inv_createdAt, inv_updatedAt);

                }

                //Ingresamos los productos  base             
                JSONArray productosBase = data.getJSONArray("productosBase");

                for (int j = 0; j < productosBase.length(); j++) {
                    JSONObject prodBase = productosBase.getJSONObject(j);

                    int idPB = prodBase.getInt("id");
                    String cantU_ideal_pb = prodBase.get("formulacion").toString();
                    id_pb = (prodBase.get("id_producto_base").toString().equals("null")) ? 0 : Integer.parseInt(prodBase.get("id_producto_base").toString());

                    if (!prodBase.get("productoBase").equals("null") ) {

                        String nombre_pb = prodBase.getJSONObject("productoBase").getString("nombre");
                        String unid_med_pb = prodBase.getJSONObject("productoBase").getString("unidad_medida");
                        int precio_unit_pb = prodBase.getJSONObject("productoBase").getInt("precio_unitario");

                        db.insertarProductosBase(id_producto, id_pb, nombre_pb, unid_med_pb, precio_unit_pb, cantU_ideal_pb, idPB);

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
                            inv_fecha_venci = (String) inventariospb.get("fecha_vencimiento").toString();
                            inv_createdAt = (String) inventariospb.get("createdAt").toString();
                            inv_updatedAt = (String) inventariospb.get("updatedAt").toString();

                            db.insertarInventario(inv_id, inv_id_alma, inv_id_pro, inv_cant, inv_cost_unit, inv_cost_to, inv_fecha_venci, inv_lote, inv_createdAt, inv_updatedAt);
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
        obtenerAlmacen();
    }
}
