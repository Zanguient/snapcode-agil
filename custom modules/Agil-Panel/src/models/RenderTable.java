/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package models;

import java.awt.Component;
import javax.swing.JButton;
import javax.swing.JCheckBox;
import javax.swing.JLabel;
import javax.swing.JProgressBar;
import javax.swing.JTable;
import javax.swing.SwingConstants;
import javax.swing.table.DefaultTableCellRenderer;

/**
 *
 * @author AGIL
 */
public class RenderTable extends DefaultTableCellRenderer {
    //DefaultTableCellRenderer cellRenderer = new DefaultTableCellRenderer();
    int row;
    @Override
    public Component getTableCellRendererComponent(JTable table, Object value, 
            boolean isSelected, boolean hasFocus, int row, int column) {
       // cellRenderer.setHorizontalAlignment(SwingConstants.CENTER);
        //table.getColumnModel().getColumn(1).setCellRenderer(cellRenderer);
        
        if (value instanceof JButton) {
            JButton btn = (JButton)value;
            return btn;
        }
        
        if (value instanceof JLabel){
            JLabel label = (JLabel)value;
            return label;
        }
        
        
        /*if (value instanceof JCheckBox) {
            JCheckBox box = (JCheckBox)value;
            return box;
        }*/
        return super.getTableCellRendererComponent(table, value, isSelected,
                hasFocus, row, column); 
        //To change body of generated methods, choose Tools | Templates.
    }
  
}
