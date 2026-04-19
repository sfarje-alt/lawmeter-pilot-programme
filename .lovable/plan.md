

Veo el problema en la imagen: las tarjetas de la columna "Comisión" se cortan en el borde derecho (los iconos de acción y el badge "Grave" quedan parcialmente fuera del área visible).

## Diagnóstico

Reviso el código actual para confirmar la causa raíz.
<lov-plan-investigation>
Archivos clave: `src/pages/Inbox.tsx`, `src/components/inbox/BillsInbox.tsx`, `src/components/inbox/KanbanColumn.tsx`, `src/components/inbox/InboxAlertCard.tsx`.

Causa probable: aunque `KanbanColumn` ya usa `flex-1 basis-0 min-w-0 overflow-hidden`, el contenido interno (`InboxAlertCard`) probablemente tiene elementos sin `min-w-0` en sus hijos flex, lo que provoca que el card mantenga un ancho intrínseco mayor al contenedor y se recorte por el `overflow-hidden`. Específicamente la fila de header con badges (`Proyecto de Ley`, `Positivo/Grave`) + iconos de acción (open, pin, archive) que usa `flex` sin permitir wrap ni shrink.

Adicionalmente, el `ScrollArea` de shadcn renderiza un viewport interno que puede no estar respetando `w-full min-w-0`, dejando que el contenido empuje el ancho.
</lov-plan-investigation>

## Plan de fix

### 1. `InboxAlertCard.tsx` — permitir shrink del contenido
- En la fila superior (badges + iconos), agregar `min-w-0` al contenedor de badges y `flex-wrap` para que los badges se envuelvan si no caben.
- Asegurar que el grupo de iconos de acción use `shrink-0` (para no desaparecer) y que los badges usen `min-w-0` + `truncate` cuando aplique.
- Confirmar que el contenedor raíz de la card use `w-full min-w-0` y `overflow-hidden` para no desbordar la columna.

### 2. `KanbanColumn.tsx` — forzar ancho del viewport del ScrollArea
- El `ScrollArea` de shadcn envuelve el contenido en un `[&>div]:!w-full` viewport. Agregar esa clase (o `[&>div]:min-w-0`) al `ScrollArea` para que el viewport interno respete el ancho de la columna.
- Cambiar el wrapper interno de cards a `w-full min-w-0` (ya está) y añadir `max-w-full` por seguridad.

### 3. Verificación visual
- Comprobar en viewport ~979px (sidebar abierto) que las 3 columnas reparten el ancho y ninguna card se recorta.

## Archivos a modificar
- `src/components/inbox/InboxAlertCard.tsx`
- `src/components/inbox/KanbanColumn.tsx`

Sin cambios de diseño, sólo fixes de layout flex/overflow.

