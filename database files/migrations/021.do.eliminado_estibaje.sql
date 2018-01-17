ALTER TABLE agil_gtm_estibaje ADD eliminado tinyint default 0;
ALTER TABLE agil_gtm_transportista ADD eliminado tinyint default 0;
ALTER TABLE agil_gtm_transportista ADD observacion varchar(100);
ALTER TABLE agil_gtm_grupo_estibaje ADD eliminado tinyint default 0;
ALTER TABLE agil_gtm_destino ADD eliminado tinyint default 0;
ALTER TABLE agil_gtm_destino ADD codigo varchar(100);