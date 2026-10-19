# Agora Growth · Workbook del Sprint Ejecutivo

Workbook en línea del Sistema de Ingresos™ que se embebe en Webflow y se sirve con jsDelivr.

- **Participantes** entran con su correo y un PIN de 6 dígitos, llenan los 8 Blueprints y el plan de 90 días (todo se guarda solo) y descargan su workbook en PDF.
- **Admins** (panel de Agora) crean cohortes, dan de alta participantes (uno por uno o en lista), consultan PINs, reenvían accesos y ven el avance de cada persona.
- **Sesiones en vivo**: cada cohorte tiene sus 3 sesiones (kick-off, jueves y viernes) con fecha, horario en hora de la Ciudad de México, liga de Meet y liga de la grabación. Los participantes ven «Unirme» o «Ver repetición» según el momento.
- **Guía previa** («Empieza por el porqué»): capítulos interactivos, video narrado y checklist de preparación (sus ICPs y números aparecen después como referencia en el Blueprint 1).
- **Reloj del Sprint**: cuenta regresiva al kick-off, tareas del día, próxima sesión y cierre del workbook ganador (hora CDMX).
- **Kits de práctica** por Blueprint: ejemplo resuelto, rúbrica de autoevaluación, errores comunes, prompts de revisión y calculadoras que llevan el resultado a la respuesta.
- **Materiales**: las ligas de Drive/YouTube se administran en la pestaña «Materiales» del Sheet.

| Página | Contenedor | Config |
| --- | --- | --- |
| Participantes | `<div id="ag-wb">` | `window.AG_WB_CONFIG = { mode: 'participant', endpoint }` |
| Panel de admin | `<div id="ag-wb">` | `window.AG_WB_CONFIG = { mode: 'admin', endpoint }` |

Script (versión fija por release): `https://cdn.jsdelivr.net/gh/Agora-Growth/agora-workbook@<tag>/workbook.min.js`

Las fuentes del PDF (`fonts/`, licencia SIL OFL 1.1) se cargan desde la misma versión del script.

Los datos y el contenido del workbook (preguntas, prompts, FAQs, glosario) viven en el Apps Script privado del Sheet del workbook, no en este repo: solo se entregan a usuarios con sesión.
