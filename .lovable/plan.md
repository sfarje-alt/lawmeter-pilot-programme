
## Resumen del cambio

Reescribimos el flujo IA de Sesiones para que sea **estrictamente en cadena**: alerta → (decisión usuario) → procesamiento (transcripción + clasificatoria IA en un solo paso) → alerta lista con **chat interno por alerta**. El **chatbot global desaparece** y la **transcripción nunca se expone** al usuario; solo se usa internamente para alimentar el chat por alerta.

## Nuevo flujo en cadena (una sola decisión)

```text
1. Llega alerta con orden del día
   └─ Clasificatoria preliminar (impacto sugerido) ya visible
2. Usuario decide: "Analizar con IA" (un solo botón)
   └─ Estado: "En procesamiento" (~20 min simulado)
3. Listo:
   ├─ Clasificatoria IA completa (impacto, urgencia, etiquetas, áreas)
   ├─ Transcripción generada (NO visible al usuario)
   └─ Chat interno habilitado dentro de la alerta
4. Usuario abre la alerta y conversa con el chat interno
   └─ Cada Q&A queda guardada en la alerta (historial persistente)
```

Se elimina la doble acción "Solicitar transcripción" + "Habilitar chatbot". Se reemplaza por **un solo botón "Analizar con IA"** que dispara ambos procesos en paralelo. Los estados `transcription_state` y `chatbot_state` se mantienen internos pero se sincronizan automáticamente.

## Cambios por archivo

### Sesiones — núcleo del flujo

- **`src/types/peruSessions.ts`**
  - Añadir `SesionChatMessage { id, role: 'user'|'assistant', content, created_at }`.
  - Añadir `chat_history?: SesionChatMessage[]` en `PeruSession`.
  - Marcar `chatbot_summary` como deprecated (mantener por compat con reportes hasta migrar).

- **`src/hooks/useSesionesWorkspace.ts`**
  - Reemplazar `requestTranscription` y `requestChatbot` por un único `requestAIAnalysis(sessionId)` que dispara el ciclo `en_cola → procesando → lista` para **ambos** estados a la vez.
  - Añadir `appendChatMessage(sessionId, message)` y `clearChatHistory(sessionId)`.
  - Persistir `chat_history` dentro del JSONB `legal_review.__chat_history` (mismo patrón usado hoy para `__chatbot_summary`, sin migración SQL).
  - Mantener `appendChatbotSummary` como adaptador interno: cuando se agrega un mensaje, también actualiza `chatbot_summary` (texto plano concatenado) para que Reportes y Analíticas existentes sigan funcionando sin cambios.

- **`src/components/sessions/peru/SesionesWorkspace.tsx`**
  - Eliminar `<SesionesGlobalChatbot />` del render y su prop `appendChatbotSummary`.
  - Pasar `requestAIAnalysis` (en lugar de `requestTranscription`/`requestChatbot`) al `SesionDetailWorkstation`.

- **`src/components/sessions/peru/SesionesGlobalChatbot.tsx`** → **eliminar archivo** (queda huérfano).

- **`src/components/sessions/peru/SesionDetailWorkstation.tsx`**
  - **Quitar el tab "Transcripción"** por completo (la transcripción nunca se expone).
  - Renombrar tab "Procesamiento IA" para que use `requestAIAnalysis` con un único botón **"Analizar con IA"** y un solo bloque de estado en cadena.
  - Reemplazar el bloque "Análisis del chatbot (chatbot_summary)" en la tab "Clasificatoria IA" por un nuevo componente **`SesionInternalChat`** embebido dentro de la alerta.
  - El `SesionInternalChat` muestra:
    - Estado vacío con prompts sugeridos (resumen, orden del día, perfil regulatorio, próximos pasos).
    - Historial Q&A persistente leído desde `session.chat_history`.
    - Input de pregunta con envío.
    - Solo habilitado cuando `transcription_state === 'lista'` (chatbot disponible).
    - Cuando aún está procesando: muestra "El chat estará disponible cuando termine el análisis IA".

- **`src/components/sessions/peru/SesionAlertCard.tsx`**
  - Mostrar chip único "Analizar IA" / "Procesando" / "Listo" en vez de los dos chips separados (TranscriptionChip + ChatbotChip).
  - Quitar referencias visuales a "transcripción" en la tarjeta (se reemplaza por "Análisis IA").

- **`src/components/sessions/peru/SesionChips.tsx`**
  - Añadir `<AIAnalysisChip state={...} />` derivado de `transcription_state` (que actúa como estado canónico ya que ambos avanzan juntos).
  - Mantener los chips antiguos como deprecated para no romper otros consumos.

### Conexión con Reportes

- **`src/components/reports/ReportsPage.tsx`**
  - Línea 477: ya usa `s.chatbot_summary` como fallback. Mantener; ahora `chatbot_summary` se llena automáticamente desde el chat interno (vía adaptador en el hook).
  - Etiquetar la sección como "Análisis IA y conversación interna" en lugar de "Resumen del chatbot".
  - No requiere otros cambios.

### Conexión con Analíticas

- **`src/components/analytics/*`** (consumen `transcription_state` para KPIs como "Sesiones procesadas")
  - No requieren cambio: ambos estados ahora avanzan en sincronía, así que cualquier conteo basado en `transcription_state === 'lista'` o `chatbot_state === 'listo'` da el mismo resultado.

### Conexión con Calendario

- **`src/components/calendar/LegislativeSessionsCalendar.tsx`**
  - Si muestra badges de "transcripción lista" o "chatbot disponible", consolidarlos en un único badge "Análisis IA listo" usando el helper `AIAnalysisChip`.

## Detalles técnicos de persistencia

- **Sin migración SQL**: el historial de chat se guarda dentro del campo `legal_review` (jsonb) de `session_editorial_state`, bajo la clave `__chat_history` (array de mensajes). Mismo patrón que ya se usa para `__chatbot_summary`.
- Tamaño máximo: últimos 50 mensajes por alerta (truncado en hook).
- Compatibilidad: `chatbot_summary` se sigue derivando como concatenación de los mensajes para que Reportes y vistas legacy no se rompan.

## Resultado UX

- **Cero ambigüedad**: un solo botón "Analizar con IA" por alerta.
- **Transcripción invisible**: el usuario nunca la ve, solo conversa con el chat.
- **Chat por alerta con historial propio**: cada alerta es autónoma, sus preguntas y respuestas viven con ella.
- **Sin chatbot global flotante**: la pantalla queda limpia.
- Reportes, Analíticas y Calendario siguen funcionando sin tocar nada externo.
