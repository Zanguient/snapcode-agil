/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package models;

import com.toedter.calendar.JDateChooser;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 *
 * @author AGIL
 * 
 */
public class FuncionesFecha {
    
    SimpleDateFormat Formato = new SimpleDateFormat("dd-MM-yyyy");
    
    public String getFecha(JDateChooser jdc){
        if (jdc.getDate() != null) {
            return Formato.format(jdc);
        }else{
            return null;
        }
    }
    
    public java.util.Date StringDate(String fecha){
        SimpleDateFormat formato_del_texto = new SimpleDateFormat("dd-MM-yyyy");
        Date fechaE = null;
        
        try {
            fechaE = formato_del_texto.parse(fecha);
            return fechaE;
        } catch (Exception e) {
            //System.out.println("Error en la fecha:"+ e);
            return null;
        } 
       // return null;
    }
}
