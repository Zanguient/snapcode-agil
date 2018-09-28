/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package operacionesUI;

import java.awt.BorderLayout;
import java.awt.Container;
import javax.swing.BorderFactory;
import javax.swing.JFrame;
import javax.swing.JProgressBar;
import javax.swing.SwingUtilities;
import javax.swing.border.Border;

/**
 *
 * @author AGIL
 */
public class E1Threard  implements Runnable {
      Thread hilo1;
      
    public E1Threard() {
        hilo1 = new Thread(E1Threard.this);
    }
    
    public void progreso(){
        JFrame f = new JFrame("");
        f.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        f.setLocationRelativeTo(null);
        Container content = f.getContentPane();
        JProgressBar progressBar = new JProgressBar();

        try {
            for (int i = 0; i < 100; i++) {
                    progressBar.setValue(i);
                    progressBar.setStringPainted(true);
                    progressBar.repaint();
                    Border border = BorderFactory.createTitledBorder("Reading...");
                    progressBar.setBorder(border);
                    content.add(progressBar, BorderLayout.NORTH);
                    f.setSize(300, 100);               
                    f.setVisible(true);
                    Thread.sleep(500);

            }
         } catch (Exception ex) {
            System.out.println("Error: "+ex);
        }
        f.dispose();
    }
    
  
    public void run(){
        progreso();
    }
    
    public void start(){
        this.hilo1.start();
    }
    
}

