

# Desglose de Costos de IA por Cliente - Calculadora de Cotización

## Resumen Ejecutivo

Este documento detalla todos los componentes de IA en LawMeter, sus costos estimados, y los factores que determinan el uso por cliente. Esto te permitirá crear una calculadora de cotización con márgenes apropiados.

---

## 1. Componentes de IA y Costos

### 1.1 Análisis de Legislación (`analyze-bill`)

| Concepto | Detalle |
|----------|---------|
| **Modelo** | `google/gemini-2.5-flash` |
| **Propósito** | Analizar proyectos de ley/normas, generar score de riesgo, resumen ejecutivo |
| **Tokens típicos** | Input: ~2,000-8,000 tokens / Output: ~500-800 tokens |
| **Costo estimado** | ~$0.002 - $0.008 por análisis |
| **Trigger** | Usuario abre detalle de alerta y solicita análisis |

**Factores de variabilidad:**
- Longitud del texto legislativo (hasta 8,000 caracteres procesados)
- Disponibilidad de texto completo vs. solo metadatos
- Frecuencia con que el cliente analiza nuevas alertas

---

### 1.2 Análisis de Transcripción de Sesión (`analyze-session-transcript`)

| Concepto | Detalle |
|----------|---------|
| **Modelo** | `google/gemini-2.5-flash` |
| **Propósito** | Analizar transcripciones de sesiones del Congreso |
| **Tokens típicos** | Input: ~15,000-40,000 tokens / Output: ~1,000-2,000 tokens |
| **Costo estimado** | ~$0.015 - $0.045 por sesión |
| **Trigger** | Usuario solicita análisis de una sesión con video |

**Factores de variabilidad:**
- Duración de la sesión (1-4 horas típico)
- Truncamiento a 50,000 caracteres máximo
- Número de comisiones monitoreadas por cliente

---

### 1.3 Preguntas y Respuestas de Sesión (`session-qa`)

| Concepto | Detalle |
|----------|---------|
| **Modelo** | `google/gemini-3-flash-preview` (más capaz) |
| **Propósito** | Responder preguntas específicas sobre sesiones |
| **Tokens típicos** | Input: ~10,000-30,000 tokens / Output: ~200-500 tokens |
| **Costo estimado** | ~$0.01 - $0.03 por pregunta |
| **Trigger** | Usuario hace preguntas en el panel de Q&A |

**Factores de variabilidad:**
- Cantidad de preguntas por sesión analizada
- Historial de conversación (acumulativo)
- Uso activo del cliente vs. pasivo

---

### 1.4 Sugerencia de Keywords (`suggest-keywords`)

| Concepto | Detalle |
|----------|---------|
| **Modelo** | `google/gemini-2.5-flash-lite` (más económico) |
| **Propósito** | Sugerir palabras clave durante onboarding |
| **Tokens típicos** | Input: ~200-500 tokens / Output: ~100-200 tokens |
| **Costo estimado** | ~$0.0002 - $0.0005 por llamada |
| **Trigger** | Usuario escribe en campo de keywords (debounced) |

**Factores de variabilidad:**
- Frecuencia de edición del perfil
- Generalmente bajo: solo durante setup inicial

---

### 1.5 Análisis de Documento del Cliente (`analyze-client-document`)

| Concepto | Detalle |
|----------|---------|
| **Modelo** | `google/gemini-2.5-flash` |
| **Propósito** | Extraer keywords y contexto de documentos corporativos |
| **Tokens típicos** | Input: ~5,000-15,000 tokens / Output: ~500-800 tokens |
| **Costo estimado** | ~$0.005 - $0.015 por documento |
| **Trigger** | Usuario sube documento durante onboarding |

**Factores de variabilidad:**
- Tamaño del documento (máx 15,000 caracteres)
- Uso único durante configuración inicial

---

### 1.6 Traducción (`translate-text`)

| Concepto | Detalle |
|----------|---------|
| **Modelo** | `google/gemini-2.5-flash` |
| **Propósito** | Traducir contenido español → inglés |
| **Tokens típicos** | Input: ~500-2,000 tokens / Output: ~500-2,000 tokens |
| **Costo estimado** | ~$0.001 - $0.004 por traducción |
| **Trigger** | Usuario solicita traducción de alerta/sesión |

**Factores de variabilidad:**
- Frecuencia de uso (opcional)
- Longitud del contenido traducido

---

## 2. Servicios Externos (No-IA pero con Costo)

### 2.1 Transcripción de Audio (AssemblyAI)

| Concepto | Detalle |
|----------|---------|
| **Servicio** | AssemblyAI + Python microservice (Render) |
| **Propósito** | Transcribir videos de YouTube sin subtítulos |
| **Costo** | ~$0.0037 por minuto de audio |
| **Ejemplo** | Sesión de 3 horas = ~$0.67 |

**Factores de variabilidad:**
- Solo se usa si YouTube no tiene subtítulos
- Duración de sesiones (1-4 horas típico)
- Número de sesiones por semana por comisión

---

## 3. Modelo de Consumo por Cliente

### Perfil de Uso Típico (Mensual)

```text
┌─────────────────────────────────────────────────────────────┐
│  CLIENTE ACTIVO (ej: FarmaSalud)                            │
├─────────────────────────────────────────────────────────────┤
│  Alertas analizadas:        ~50-100/mes                     │
│  Sesiones monitoreadas:     ~8-12/mes (3 comisiones)        │
│  Sesiones analizadas (IA):  ~4-6/mes                        │
│  Preguntas Q&A:             ~10-20/mes                      │
│  Traducciones:              ~5-10/mes                       │
└─────────────────────────────────────────────────────────────┘
```

### Estimación de Costo Mensual por Perfil

| Perfil de Cliente | Alertas | Sesiones IA | Q&A | Costo IA Est. |
|-------------------|---------|-------------|-----|---------------|
| **Básico** (1 sector, 1 comisión) | 20 | 2 | 5 | ~$0.30/mes |
| **Estándar** (2-3 sectores, 2 comisiones) | 60 | 4 | 15 | ~$1.00/mes |
| **Avanzado** (multi-sector, 3-5 comisiones) | 150 | 8 | 40 | ~$3.50/mes |
| **Enterprise** (uso intensivo) | 300+ | 15+ | 100+ | ~$10-15/mes |

---

## 4. Fórmulas para Calculadora

### Costo de IA por Cliente (Mensual)

```text
COSTO_IA = 
    (alertas_analizadas × $0.005) +
    (sesiones_analizadas × $0.03) +
    (preguntas_qa × $0.02) +
    (traducciones × $0.002) +
    (transcripciones_assemblyai × duracion_min × $0.0037)
```

### Variables de Input para Calculadora

| Variable | Descripción | Valor Típico |
|----------|-------------|--------------|
| `num_comisiones` | Comisiones monitoreadas | 1-5 |
| `num_sectores` | Sectores de interés | 1-3 |
| `frecuencia_revision` | Veces que revisa alertas/semana | 2-5 |
| `uso_qa` | Intensidad de Q&A (bajo/medio/alto) | medio |
| `necesita_traducciones` | Si requiere inglés | sí/no |

### Multiplicadores Sugeridos

```text
sesiones_mensuales = num_comisiones × 4  (aprox. 1/semana por comisión)
sesiones_analizadas = sesiones_mensuales × 0.5  (50% requieren análisis)
alertas_mensuales = (num_comisiones + num_sectores × 2) × 15
preguntas_qa = uso_qa_factor × sesiones_analizadas × 3
```

---

## 5. Estructura de Pricing Sugerida

### Tiers de Suscripción

| Tier | Incluye | Precio Base | Costo IA Estimado | Margen |
|------|---------|-------------|-------------------|--------|
| **Starter** | 1 comisión, 1 sector, 30 análisis | $99/mes | ~$0.50 | 99.5% |
| **Professional** | 3 comisiones, 3 sectores, 100 análisis | $299/mes | ~$2.00 | 99.3% |
| **Enterprise** | Ilimitado + soporte | $799/mes | ~$10.00 | 98.7% |

### Overage (Uso Excedente)

| Recurso | Precio Sugerido | Tu Costo | Margen |
|---------|-----------------|----------|--------|
| Análisis de alerta extra | $0.10 | $0.005 | 95% |
| Análisis de sesión extra | $0.50 | $0.03 | 94% |
| Pregunta Q&A extra | $0.25 | $0.02 | 92% |
| Transcripción (por hora) | $5.00 | $0.22 | 95.6% |

---

## 6. Detalles Técnicos

### Precios de Lovable AI Gateway (Referencia)

Los modelos Gemini tienen pricing aproximado:
- **gemini-2.5-flash**: ~$0.00001875/1K tokens input, ~$0.000075/1K tokens output
- **gemini-2.5-flash-lite**: ~50% más barato que flash
- **gemini-3-flash-preview**: Similar a flash, optimizado para chat

### Dependencias de Costo

```text
┌─────────────────────────────────────────────────────────────┐
│                    FACTORES DE COSTO                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌───────────────┐     ┌───────────────┐                   │
│  │ # Comisiones  │────▶│ # Sesiones    │                   │
│  │ monitoreadas  │     │ por mes       │                   │
│  └───────────────┘     └───────┬───────┘                   │
│                                │                            │
│                                ▼                            │
│  ┌───────────────┐     ┌───────────────┐                   │
│  │ # Keywords    │     │ Análisis IA   │                   │
│  │ activas       │────▶│ requeridos    │                   │
│  └───────────────┘     └───────┬───────┘                   │
│                                │                            │
│                                ▼                            │
│  ┌───────────────┐     ┌───────────────┐                   │
│  │ Actividad del │────▶│ COSTO TOTAL   │                   │
│  │ usuario       │     │ MENSUAL       │                   │
│  └───────────────┘     └───────────────┘                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 7. Recomendaciones

1. **Tracking de Uso**: Implementar logging de cada llamada a funciones de IA por `client_id` para facturación precisa

2. **Límites por Tier**: Establecer límites mensuales en la base de datos por cliente

3. **Caching**: Ya implementado parcialmente con `localStorage` - considerar cache en DB para reducir llamadas repetidas

4. **Alertas de Consumo**: Notificar cuando un cliente alcance 80% de su límite

5. **Freemium**: El modelo de subtítulos de YouTube es gratuito y cubre ~70% de videos - solo cobrar AssemblyAI como premium

