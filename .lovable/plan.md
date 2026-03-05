

# Plan: Agregar alertas de Backus y perfil de cliente

## Resumen

Se extraen 2 normas del Excel (sección "PRIVACIDAD DE DATOS - BACKUS") y se crean como nuevas alertas en el mock data. Se crea un perfil de cliente para **Unión de Cervecerías Peruanas Backus y Johnston S.A.A.** (Backus/AB InBev). Las alertas se pre-publican para este cliente.

## Datos extraídos del Excel

| # | Tipo | Título | Entidad | Fecha | Área | Comentario Experto |
|---|------|--------|---------|-------|------|--------------------|
| 1 | Norma | Decreto Supremo N.° 016-2024-JUS. Reglamento de la Ley N.° 29733 | Min. Justicia y DDHH | 29 marzo 2025 | Protección datos, ciberseguridad | Reglamento Ley 29733: brechas 72h, DPO obligatorio, sanciones 100 UIT... |
| 2 | Norma | LEY DE PROTECCIÓN DE DATOS PERSONALES LEY Nº 29733 | Congreso | 3 julio 2011 | Protección de datos, privacidad | Marco general LPDP: ARCO, ANPD, consentimiento... |

## Archivos a modificar (3)

### 1. `src/data/peruAlertsMockData.ts`
- Agregar `BACKUS_CLIENT_ID = "client-backus"` como constante
- Agregar Backus a `MOCK_CLIENTS` array con sector "Bebidas / Consumo masivo", áreas relevantes (Protección de datos, Ciberseguridad, Compliance)
- Agregar 2 normas al array `MOCK_REGULATIONS_RAW` con IDs `reg-backus-001` y `reg-backus-002`, con sus datos completos del Excel
- Agregar nuevas entidades al array `ENTITIES` si no existen ("Ministerio de Justicia y Derechos Humanos")
- Agregar nuevos sectores relevantes

### 2. `src/data/mockClientProfiles.ts`
- Crear perfil completo `BACKUS_CLIENT_PROFILE` con:
  - Razón social: "Unión de Cervecerías Peruanas Backus y Johnston S.A.A."
  - Nombre comercial: "Backus"
  - Sector primario: "Bebidas / Consumo masivo"
  - Sectores secundarios: "Manufactura", "Logística"
  - Autoridades supervisoras: ANPD, SUNAT, INDECOPI, PRODUCE
  - Keywords: protección de datos, privacidad, ciberseguridad, DPO, datos personales, consentimiento, LPDP, ANPD, etc.
  - Comisiones vigiladas relevantes
  - Usuarios ficticios (Director Legal, Jefe de Compliance, DPO)
- Agregar al array `MOCK_CLIENT_PROFILES`

### 3. `src/contexts/AlertsContext.tsx`
- Importar `BACKUS_CLIENT_ID`
- En `initializeAlerts()`, pre-publicar las 2 normas de Backus (IDs `reg-backus-*`) asignándolas a `BACKUS_CLIENT_ID` con sus commentaries

## Resultado esperado
- En el Inbox admin: aparecen 2 normas nuevas (protección de datos) con badge de Backus
- En Clientes: aparece Backus como segundo cliente junto a FarmaSalud
- Filtros dinámicos: se actualizan automáticamente al detectar nuevas áreas/entidades en los datos

