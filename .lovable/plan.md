

## Plan: Eliminar metadatos técnicos y añadir sistema de créditos para IA en sesiones

### 1. Quitar el bloque "Modelo / Costo USD / Duración audio"

En `src/components/sessions/SesionDetailDrawer.tsx` (líneas 335-352) eliminar el bloque que muestra `analysis_model`, `analysis_cost_usd` y `transcript_duration_s`. Esa información es interna y no debe ser visible al usuario.

### 2. Sistema de créditos del piloto

**Modelo:**
- Balance inicial: **30 créditos** por organización (piloto Betsson).
- Análisis de sesión (transcripción + resumen IA, hasta 90 min): **10 créditos**.
- Pregunta Q&A sobre sesión analizada: **1 crédito** por defecto, escalando según longitud de respuesta:
  - respuesta corta (<400 tokens out) → 1 crédito
  - respuesta media (400-1200) → 2 créditos
  - respuesta larga (>1200) → 3 créditos
  El edge function `session-qa` ya devuelve los tokens, así que computamos en backend y descontamos antes de retornar.

**Backend (migración):**
Nueva tabla `org_ai_credits`:
```
organization_id uuid PK
balance int not null default 30
included_credits int not null default 30
updated_at timestamptz
```
Y `ai_credit_transactions` (auditoría):
```
id uuid PK, organization_id, delta int, reason text
('session_analysis' | 'session_qa'), session_id, created_at
```
RLS: SELECT para miembros de la org; INSERT/UPDATE solo vía edge functions con service role.

Función RPC `consume_credits(org_id, amount, reason, session_id)` que:
- bloquea la fila, valida `balance >= amount`, descuenta y registra transacción.
- retorna `{ success, new_balance, error }`.

**Edge functions:**
- `solicitar-analisis-sesion`: antes de encolar, llamar `consume_credits(10, 'session_analysis')`. Si falla por saldo, retornar 402 con mensaje "Créditos insuficientes".
- `session-qa`: tras obtener respuesta, calcular tier (1/2/3) por `outputTokens` y consumir. Devolver `creditsUsed` y `newBalance` en la respuesta.

### 3. UI de balance de créditos

**Hook nuevo** `useAICredits()` que lee `org_ai_credits` y se suscribe vía realtime para actualizar en vivo.

**Barra de balance** (componente `CreditsBalanceBar`):
- Ubicación: header de `SesionesWorkspace.tsx` (junto al título "Sesiones").
- Muestra: `[████████░░] 22 / 30 créditos`.
- Color: verde >50%, ámbar 20-50%, rojo <20%.
- Tooltip con desglose: "10 créditos = 1 análisis (90 min). 1-3 créditos = 1 pregunta Q&A".

**En `SesionDetailDrawer` y `peru/SessionDetailDrawer`:**
- Botón "Analizar sesión con IA" muestra "(10 créditos)" al lado y se deshabilita si `balance < 10` con tooltip "Créditos insuficientes".
- Antes de ejecutar, modal de confirmación: "Esto consumirá 10 créditos. Saldo actual: 22 → 12. ¿Continuar?".
- En `SessionQAPanel`: bajo el input mostrar "Cada pregunta consume 1-3 créditos según complejidad". Tras cada respuesta, toast pequeño "1 crédito consumido · saldo: 21".

### 4. Q&A en el drawer correcto

`src/components/sessions/SesionDetailDrawer.tsx` (el genérico, que es el que muestra la captura) **no tiene panel Q&A** — solo lo tiene la versión `peru/SessionDetailDrawer.tsx`. Añadir una sección Q&A al drawer genérico que aparece **solo cuando** `analysis_status === 'COMPLETED'`, reutilizando lógica de `SessionQAPanel` adaptada al tipo `Sesion` (usando `transcript_text` o equivalente del registro). Si no hay transcripción persistida en este modelo, exponer `transcript_text` desde la query de `useSesionRealtime`.

### 5. Archivos a tocar

```
Migración nueva:
  org_ai_credits + ai_credit_transactions + RPC consume_credits

Backend:
  supabase/functions/solicitar-analisis-sesion/index.ts   (consumir 10)
  supabase/functions/session-qa/index.ts                  (consumir 1-3)

Frontend:
  src/hooks/useAICredits.ts                               (nuevo)
  src/components/sessions/CreditsBalanceBar.tsx           (nuevo)
  src/components/sessions/SesionDetailDrawer.tsx          (quitar metadatos + añadir Q&A + costo en botón)
  src/components/sessions/peru/SessionDetailDrawer.tsx    (costo en botón Analizar)
  src/components/sessions/peru/SessionQAPanel.tsx         (mostrar créditos consumidos)
  src/components/sessions/peru/SesionesWorkspace.tsx      (montar CreditsBalanceBar en header)
```

### 6. Confirmación necesaria

- ¿El balance es **por organización** (Betsson comparte 30) o **por usuario**? Asumo por organización salvo que digas lo contrario.
- ¿Quieres que el admin pueda recargar créditos manualmente desde el panel de cliente, o lo manejamos solo desde backend en el piloto?

