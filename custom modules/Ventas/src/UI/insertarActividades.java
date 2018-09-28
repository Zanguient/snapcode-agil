/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package UI;

import Conexion.DataBase;
import Conexion.RestServer;
import java.net.URL;
import java.net.URLConnection;
import java.util.logging.Level;
import java.util.logging.Logger;
import jdk.nashorn.internal.runtime.Context;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/**
 *
 * @author AGIL
 */
public class insertarActividades extends Thread {
    public int idEmpresa;
    public DataBase db = new DataBase();

    public insertarActividades(String nombre, int idEmpresa) {
        super(nombre);
        this.idEmpresa = idEmpresa;
    }
    
    private boolean getConnectionStatus() {
        String estado = "";
        boolean respuesta = false;
        try { 
            URL ruta=new URL("http://agilsof.net/"); 
            URLConnection rutaC = ruta.openConnection(); 
            rutaC.connect(); 
            estado="Online"; 
            respuesta = true;
        }catch(Exception e){ 
            estado="Offline"; 
            respuesta  = false;
        } 
        return respuesta;   
    }
    
    public void insertarActividades(){
        System.out.println("Entro actividades");
        int id;
        int id_sucursal;
        int id_actividad;
        int id_dosificaciones;
        String createdat;
        String updatedat;
        String created;
        String updated;    
        int id_actividades;
    
        if(getConnectionStatus() == true){
            String url = "/dosificaciones/empresa/"+this.idEmpresa;
            JSONArray res = RestServer.getJSONArray(url);
           
            for (int i = 0; i < res.length(); i++) {
                try {
                    JSONObject actividades = res.getJSONObject(i);
                    //System.out.println(actividades.getJSONArray("actividadesSucursales"));
                    JSONArray actividad = actividades.getJSONArray("actividadesSucursales");
                    
                    for (int j = 0; j < actividad.length(); j++) {
                        JSONObject objectActividad = actividad.getJSONObject(j);
                        id = objectActividad.getInt("id");
                        id_sucursal = objectActividad.get("id_sucursal").toString().equals("null")? 0:Integer.parseInt(objectActividad.get("id_sucursal").toString());
                        id_actividad = objectActividad.getInt("id_actividad");
                        id_dosificaciones = objectActividad.getInt("id_dosificacion");
                        created = objectActividad.getString("createdAt");
                        updated = objectActividad.getString("updatedAt");

                        if (id_sucursal == 0) {
                            db.InsertarSucursalActividadIdSucNull(id, id_actividad, id_dosificaciones, created, updated);
                        }else{
                            db.InsertarSucursalActividad(id, id_sucursal, id_actividad, id_dosificaciones, created, updated);                      
                        }  
                    }
                } catch (JSONException ex) {
                    System.out.println("Error dosificaciones: "+ex);
                    Logger.getLogger(VentasUI.class.getName()).log(Level.SEVERE, null, ex);
                }
            }
        }
        System.out.println("Salio actividades");
    }
    
    
    @Override
    public void run(){
        try {
             insertarActividades();
        } catch (Exception e) {
            System.out.println("Error en el hilo al insertar actividad");
            e.printStackTrace();
        }    
    }
}
