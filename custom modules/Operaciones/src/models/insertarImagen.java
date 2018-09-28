/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package models;

import java.awt.Graphics2D;
import java.awt.geom.AffineTransform;
import java.awt.image.BufferedImage;
import java.io.File;
import javax.imageio.ImageIO;

/**
 *
 * @author AGIL
 */
public class insertarImagen {


    public insertarImagen() {
        ;
    }
    
    public String guardarProductos(File ruta,int id){
        String rutaGuardada = "";
        String nombreProducto = ruta.getPath().replace('\\', '/');//getName();
        String nombreRuta = ruta.getName();
        String cortarNombre = nombreRuta.substring(0,nombreRuta.length()-4);
      
        int tam = nombreRuta.length()-4;
        String cortarExtencion = nombreRuta.substring(tam);
        String extencion = nombreRuta.substring(nombreRuta.length()-3);
        System.out.println( extencion);
        //String nombreProducto = nombreRuta;
        int ancho = 100;
        int alto= 100;
        try{
        BufferedImage bori = javax.imageio.ImageIO.read(new File(nombreProducto));

        BufferedImage bdest = new BufferedImage(ancho, alto, bori.getTransparency());
        Graphics2D g = bdest.createGraphics();
        
        int ancho_actual = bori.getWidth();
        int alto_actual = bori.getHeight();
        boolean pasar_a_escala_inferior = false;

        if (ancho_actual > ancho || alto_actual > alto) {
            pasar_a_escala_inferior = true;
        }

            BufferedImage image;
            java.awt.Image aux = null;
            if (pasar_a_escala_inferior) {
            aux = bori.getScaledInstance(ancho,alto, java.awt.Image.SCALE_SMOOTH);
            image = new BufferedImage(ancho,alto, bori.getTransparency());
            } else {
            // Mantenemos el tamano original de la imagen
            aux = bori.getScaledInstance(ancho_actual, alto_actual, java.awt.Image.SCALE_SMOOTH);
            image = new BufferedImage(ancho_actual, alto_actual, bori.getTransparency());
            }
            image.getGraphics().drawImage(aux, 0, 0, null);

            AffineTransform at = AffineTransform.getScaleInstance((double) ancho / bori.getWidth(), (double)alto / bori.getHeight());
            g.drawRenderedImage(bori, at);
            rutaGuardada = "C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\Operaciones\\src\\ImgProductos\\"+cortarNombre+"-"+id+cortarExtencion;
            ImageIO.write(image, extencion.toUpperCase(), new File(rutaGuardada));
            
        }catch(Exception e){
            System.out.println("Error "+e);
            
        } 
        return rutaGuardada;
    }
}
