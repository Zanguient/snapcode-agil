UPDATE gl_persona
SET gl_persona.nombre_completo = CONCAT(gl_persona.nombres, ' ', gl_persona.apellido_paterno,' ',gl_persona.apellido_materno) where gl_persona.segundo_nombre is NULL;
UPDATE gl_persona
SET gl_persona.nombre_completo = CONCAT(gl_persona.nombres,' ',gl_persona.apellido_materno) where gl_persona.apellido_paterno is NULL;
UPDATE gl_persona
SET gl_persona.nombre_completo = CONCAT(gl_persona.nombres,' ',gl_persona.apellido_paterno) where gl_persona.apellido_materno is NULL;
UPDATE gl_persona
SET gl_persona.nombre_completo = gl_persona.nombres where gl_persona.apellido_paterno is NULL and gl_persona.apellido_materno is NULL;