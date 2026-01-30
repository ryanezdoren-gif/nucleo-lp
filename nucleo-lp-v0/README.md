# Núcleo L&P — Versión 0 (Sheets + Chat)

Spanish UI (dark neon). Minimal inflows/outflows + native chat. Google Sheets acts as DB for V0.

## Estructura de Sheets (encabezados en Español)
- **Clientes**: `id, nombre, contacto, email, telefono, notas, creado_en`
- **Proyectos**: `id, cliente_id, nombre, estado, inicio_en, vence_en, responsable`
- **Facturas**: `id, cliente_id, proyecto_id, tipo, monto_clp, vence_en, estado, notas`

Comparte el Sheet con el email del Service Account (Editor).

## Variables de Entorno (Vercel → Settings → Environment Variables)
- `OPENAI_API_KEY`
- `GOOGLE_CREDENTIALS_JSON` (contenido JSON completo del service account)
- `GOOGLE_SHEETS_SPREADSHEET_ID`
- `TELEGRAM_BOT_TOKEN` (opcional)
- `APP_BASE_URL` (Vercel lo inyecta automáticamente en producción; puedes dejarlo vacío)

## Desarrollo local
```bash
npm i
npm run dev
```

## Despliegue (Vercel)
1. Importa el proyecto desde este ZIP o repo.
2. Pega las variables de entorno.
3. Deploy. 

## Rutas
- `/` Dashboard con KPIs
- `/clientes`, `/proyectos`, `/facturas` CRUD mínimo
- `/chat` Chat nativo con el Mago (Wise Wizard)

## Migración futura
- Sustituir Sheets por Postgres (Supabase), manteniendo el mismo modelo de datos.
