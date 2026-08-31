# Investigación 1 — Frontend (Hotel System)

Frontend en **React + TypeScript + Vite** para el backend de autenticación RBAC y dominio hotelero (habitaciones y reservaciones).

## Requisitos

- Node.js 20+
- pnpm 9+
- Backend corriendo en `http://localhost:5018`

## Configuración

```bash
pnpm install
```

Si `pnpm install` falla por certificados SSL (antivirus/proxy), usa el almacén de certificados de Windows:

```powershell
$env:NODE_OPTIONS='--use-system-ca'
pnpm install
```

La URL del API está en `src/api/client.ts` (`http://localhost:5018`). Cámbiala si tu backend usa otro puerto.

## Ejecutar

```powershell
$env:NODE_OPTIONS='--use-system-ca'
pnpm run dev
```

Abre la URL que muestre Vite (normalmente `http://localhost:5173`).

## Usuarios de demo

| Rol | Email | Contraseña | Notas |
|-----|-------|------------|-------|
| Admin | `admin@example.com` | `AdminPass1` | Se crea al iniciar el backend si no hay admins |
| Suscriptor | (regístrate) | mín. 6 chars, letra + número | POST `/register` desde la pantalla de registro |

## Pantallas

| Ruta | Acceso | Descripción |
|------|--------|-------------|
| `/login` | Público | Inicio de sesión |
| `/register` | Público | Registro `Subscription_L1` |
| `/dashboard` | Autenticado | Datos de `/users/me` |
| `/rooms` | Autenticado | Lista de habitaciones |
| `/reservations/create` | Autenticado | Crear reservación |
| `/admin-panel` | Solo Admin | Gestión de usuarios |
| `/admin/register` | Solo Admin | Crear otro administrador |
| `/rooms/create` | Solo Admin | Crear habitación |
| `/reservations` | Solo Admin | Reservaciones con datos de habitación |

## Errores visibles

- **401** — credenciales inválidas en login; sesión expirada redirige a login
- **403** — banner global cuando la API rechaza por permisos o suscripción expirada; pantalla dedicada si un suscriptor entra a rutas Admin

## Build

```bash
pnpm run build
```
