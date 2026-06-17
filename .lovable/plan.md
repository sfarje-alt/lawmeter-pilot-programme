## Cambio de credenciales: Dra. Evelyn → Karina Chavez

Reasignar el usuario cliente actualmente registrado como **Evelyn Vanetti Lopez Tuesta** (`elopez@rep.com.pe`) para que pertenezca a **Karina Debbie Chavez Brena** (`kchavez@rep.com.pe`), manteniendo la misma cuenta dentro de la organización ISA Energía (REP).

### Cambios

1. **Auth (auth.users)** — actualizar el email del usuario `8a107f77-f050-4bea-9678-e52f0d91d71a` de `elopez@rep.com.pe` a `kchavez@rep.com.pe` (email confirmado, sin requerir reverificación).
2. **profiles** — actualizar `email` y `full_name` ("Karina Debbie Chavez Brena") del mismo registro. Se conserva `organization_id`, `account_type=user` y el rol existente.
3. **Contraseña** — se mantiene la misma contraseña que ya se compartió para esa cuenta (no se resetea salvo que lo pidas). Si prefieres, puedo además forzar una nueva contraseña temporal.

### Lo que NO cambia

- Mismo `user_id`, mismo `organization_id` (ISA Energía), mismo rol y mismos permisos de cliente.
- Sin tocar `user_roles`, `client_users`, alertas, comentarios ni datos asociados.
- Ningún otro usuario es afectado.

### Confirmación rápida

¿Mantengo la contraseña actual o quieres que también genere una nueva temporal para Karina?
