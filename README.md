# Ready Golf CRM

Panel de monitoreo para el e-commerce **Ready Golf Shop**. Permite a Mateo
supervisar al agente de IA que opera en WhatsApp: ver conversaciones, pausar
el bot por chat, gestionar contactos (clientes / leads calificados) y editar
el catálogo de productos (los cambios se sincronizan con la memoria del
agente).

## Stack

- **Next.js 15** (App Router, Server Components, Route Handlers)
- **React 19**
- **TypeScript**
- **Tailwind CSS** con paleta de marca (negro 50% / verde 40% / blanco 10%)
- **lucide-react** para iconos
- Persistencia simple en archivos JSON dentro de `src/data/`

## Secciones

| Ruta | Descripción |
|---|---|
| `/` | Login rápido seleccionando al usuario **Mateo** (sin contraseña) |
| `/dashboard` | Resumen: conversaciones activas, bot encendido, clientes, leads, ingresos |
| `/conversaciones` | Lista de chats con filtro, chat al detalle, **toggle Bot ON/OFF por chat** |
| `/contactos` | Lista con filtros **Todos / Clientes / Leads calificados**, tags, notas |
| `/productos` | Catálogo editable (nombre, precio, categoría, stock). Sincroniza con el agente |

## Sincronización con el agente (WhatsApp / n8n)

Los cambios en **productos** y el **toggle del bot por chat** disparan un webhook
configurable. Definí estas variables en `.env.local`:

```env
AGENT_SYNC_WEBHOOK=https://tu-n8n.example.com/webhook/ready-golf
AGENT_SYNC_TOKEN=un-token-largo-y-secreto
```

Payloads emitidos:

```jsonc
// Producto creado/editado/eliminado
{ "event": "product_updated", "payload": { "id": "p4", "name": "...", "price": 1299000, ... } }

// Bot on/off en un chat
{ "event": "bot_toggle", "conversationId": "conv1", "phone": "+5491144550001", "botEnabled": false }
```

El agente debe escuchar este endpoint y refrescar su contexto (vector store,
base de productos, flag por conversación).

## Desarrollo local

```bash
npm install
npm run dev
# abrir http://localhost:3000
```

## Build y producción

```bash
npm run build
npm start
```

## Deploy en EasyPanel

1. Crear una app tipo **Node.js / Next.js** apuntando a este repo.
2. Comando de build: `npm install && npm run build`
3. Comando de start: `npm start`
4. Puerto: `3000`
5. Variables de entorno: `AGENT_SYNC_WEBHOOK`, `AGENT_SYNC_TOKEN`.

Cada push a `main` dispara el deploy automático.

## Estructura

```
src/
├── app/
│   ├── page.tsx               # Login (seleccionar Mateo)
│   ├── api/
│   │   ├── auth/route.ts      # Cookie de sesión
│   │   ├── products/...       # CRUD productos + webhook agente
│   │   ├── conversations/...  # Toggle bot por chat + webhook agente
│   │   └── contacts/route.ts
│   └── (app)/
│       ├── layout.tsx         # Sidebar + TopBar responsive
│       ├── dashboard/
│       ├── conversaciones/
│       ├── contactos/
│       └── productos/
├── components/                # Logo, Sidebar, TopBar, AppShell
├── data/                      # products.json, contacts.json, conversations.json
└── lib/                       # auth, db, format, types
```

## Reemplazar el logo

El logo vive en `public/logo.svg` (texto blanco "Ready" script + "GOLF SHOP"
sobre fondo negro). Reemplazá ese archivo por tu PNG/SVG oficial manteniendo
el nombre para actualizarlo en toda la app.
