ALTER TABLE agil_gtm_estibaje add activo tinyint(1) default 1;
ALTER TABLE agil_gtm_grupo_estibaje add activo tinyint(1) default 1;
ALTER TABLE agil_gtm_transportista add activo tinyint(1) default 1;
ALTER TABLE agil_gtm_despacho_detalle add estado int(11);