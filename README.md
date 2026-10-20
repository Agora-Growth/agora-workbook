# Agora Growth · Workbook del Sprint Ejecutivo

Workbook en línea del Sistema de Ingresos™ que se embebe en Webflow y se sirve con jsDelivr.

- **Participantes** entran con su correo y un PIN de 6 dígitos, llenan los 8 Blueprints y el plan de 90 días (todo se guarda solo) y descargan su workbook en PDF.
- **Admins** (panel de Agora) crean cohortes, dan de alta participantes (uno por uno o en lista), consultan PINs, reenvían accesos y ven el avance de cada persona.
- **Sesiones en vivo**: cada cohorte tiene sus 3 sesiones (kick-off, jueves y viernes) con fecha, horario en hora de la Ciudad de México, liga de Meet y liga de la grabación. Los participantes ven «Unirme» o «Ver repetición» según el momento.
- **Guía previa** («Empieza por el porqué»): capítulos interactivos, video narrado y checklist de preparación (sus ICPs y números aparecen después como referencia en el Blueprint 1).
- **Reloj del Sprint**: cuenta regresiva al kick-off, tareas del día, próxima sesión y cierre del workbook ganador (hora CDMX).
- **Kits de práctica** por Blueprint: ejemplo resuelto, rúbrica de autoevaluación, errores comunes, prompts de revisión y calculadoras que llevan el resultado a la respuesta.
- **Materiales**: las ligas de Drive/YouTube se administran en la pestaña «Materiales» del Sheet.
- **Copiloto IA** (Claude, desde v1.6): para los participantes que el panel habilite (Activo, Bloqueado u Oculto, por cohorte o por persona). Explica el contenido y la logística, ayuda a arrancar cada sección, revisa con la rúbrica y propone borradores que el participante decide insertar. Límites por día y por Sprint, tope de gasto mensual y apagado automático al día siguiente de la última sesión. La API key vive en las propiedades del Apps Script, nunca en este repo.
- **Copiloto del facilitador** en el panel: prepara los talleres con las respuestas de la cohorte, resume a un participante, agrupa dudas y analiza lo que preguntan al copiloto.
- **Dudas para el taller**: los participantes las envían desde cada sección; el panel las agrupa por sesión, permite responderlas y proyectarlas en vivo.
- **Correos automáticos**: recordatorio un día antes y una hora antes de cada sesión, y check-ins del plan de 90 días a los 30, 60 y 90 días (con aviso a Agora si alguien pide ayuda).
- **Calendario y feedback**: cada sesión se agrega a Google Calendar o como .ics, y muestra su formulario de feedback desde que empieza.
- **Mi empresa** (v1.7): perfil corto del negocio de cada participante (sector, tamaño, ventas, mercados, cómo vende, reto). Lo usan el copiloto, el copiloto del facilitador y el botón «Copiar con mi contexto» de cada prompt; también va en el PDF.
- **Tutorial** (v1.7): recorrido guiado y repetible que resalta cada parte del workbook y explica qué llenar (inicio, guía previa, un Blueprint con su kit, plan de 90 días y Mi empresa).

| Página | Contenedor | Config |
| --- | --- | --- |
| Participantes | `<div id="ag-wb">` | `window.AG_WB_CONFIG = { mode: 'participant', endpoint }` |
| Panel de admin | `<div id="ag-wb">` | `window.AG_WB_CONFIG = { mode: 'admin', endpoint }` |

Script (versión fija por release): `https://cdn.jsdelivr.net/gh/Agora-Growth/agora-workbook@<tag>/workbook.min.js`

Las fuentes del PDF (`fonts/`, licencia SIL OFL 1.1) se cargan desde la misma versión del script.

Los datos y el contenido del workbook (preguntas, prompts, FAQs, glosario) viven en el Apps Script privado del Sheet del workbook, no en este repo: solo se entregan a usuarios con sesión.
