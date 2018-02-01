
UPDATE gl_persona SET nombres = SUBSTRING_INDEX(nombre_completo, ' ', 1),segundo_nombre = SUBSTRING(SUBSTRING_INDEX(nombre_completo, ' ', 2),
       LENGTH(SUBSTRING_INDEX(nombre_completo, ' ', 1)) + 1)