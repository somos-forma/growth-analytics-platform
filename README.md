# Growth Analytics Platform

Plataforma de análisis de crecimiento para gestionar clientes, integraciones y datos de marketing.

## 📚 Stack Tecnológico

### Frontend Framework

- **[Next.js 16.0.10](https://nextjs.org/)** - Framework de React con App Router para aplicaciones web full-stack
- **[React 19.2.0](https://react.dev/)** - Biblioteca de interfaz de usuario con nuevas características
- **[TypeScript 5](https://www.typescriptlang.org/)** - Tipado estático para JavaScript

### Estilos y UI

- **[Tailwind CSS 4](https://tailwindcss.com/)** - Framework CSS utility-first
- **[Radix UI](https://www.radix-ui.com/)** - Componentes accesibles y sin estilos:
  - Avatar, Checkbox, Dialog, Dropdown Menu
  - Label, Popover, Radio Group, Scroll Area
  - Select, Separator, Slider, Slot, Tabs, Tooltip
- **[Lucide React](https://lucide.dev/)** - Iconos modernos y optimizados
- **[next-themes](https://github.com/pacocoursey/next-themes)** - Soporte para modo oscuro
- **[class-variance-authority](https://cva.style/)** - Gestión de variantes de componentes
- **[tailwind-merge](https://github.com/dcastil/tailwind-merge)** - Merge inteligente de clases de Tailwind
- **[tw-animate-css](https://github.com/vedantnn71/tw-animate-css)** - Animaciones CSS con Tailwind

### Gestión de Estado y Datos

- **[Zustand 5.0.8](https://zustand-demo.pmnd.rs/)** - Gestión de estado ligera y escalable
- **[TanStack Query 5.90.5](https://tanstack.com/query)** - Fetching, caching y sincronización de datos del servidor
- **[TanStack Table 8.21.3](https://tanstack.com/table)** - Tablas headless y potentes

### Formularios y Validación

- **[React Hook Form 7.65.0](https://react-hook-form.com/)** - Gestión de formularios con validación
- **[@hookform/resolvers 5.2.2](https://github.com/react-hook-form/resolvers)** - Resolvers para esquemas de validación
- **[Zod 4.1.12](https://zod.dev/)** - Validación de esquemas TypeScript-first

### Interacción y UX

- **[@dnd-kit](https://dndkit.com/)** - Toolkit de drag and drop:
  - core: 6.3.1
  - sortable: 10.0.0
  - utilities: 3.2.2
- **[react-dropzone 14.3.8](https://react-dropzone.js.org/)** - Zona de carga de archivos drag and drop
- **[Sonner 2.0.7](https://sonner.emilkowal.ski/)** - Notificaciones toast elegantes
- **[Recharts 2.15.4](https://recharts.org/)** - Gráficos componibles de React

### Utilidades

- **[date-fns 4.1.0](https://date-fns.org/)** - Biblioteca moderna de manejo de fechas
- **[react-day-picker 9.11.2](https://react-day-picker.js.org/)** - Selector de fechas flexible
- **[clsx 2.1.1](https://github.com/lukeed/clsx)** - Utilidad para construcción de strings de clases

### Integraciones

- **[google-auth-library 10.5.0](https://github.com/googleapis/google-auth-library-nodejs)** - Cliente de autenticación de Google

### Herramientas de Desarrollo

- **[Biome 2.2.0](https://biomejs.dev/)** - Linter y formateador rápido (reemplazo de ESLint + Prettier)
- **[PostCSS](https://postcss.org/)** - Transformación de CSS con JavaScript
- **[pnpm](https://pnpm.io/)** - Gestor de paquetes rápido y eficiente

## 🏗️ Arquitectura del Proyecto

### Estructura de Carpetas

```
├── app/                          # App Router de Next.js
│   ├── api/                      # API Routes
│   │   ├── analytics/
│   │   ├── clients/
│   │   └── users/
│   └── dashboard/                # Rutas del dashboard
│       ├── clients/
│       ├── google-ads/
│       ├── google-analytics/
│       ├── integrations/
│       ├── marketing-mix-modeling/
│       ├── meta-ads/
│       └── users/
├── components/                   # Componentes compartidos
│   ├── ui/                       # Componentes UI base (shadcn/ui)
│   ├── charts/                   # Componentes de gráficos
│   ├── empty/                    # Estados vacíos
│   └── skeletons/                # Estados de carga
├── features/                     # Módulos por funcionalidad
│   ├── analysis/
│   ├── assignments/
│   ├── auth/
│   ├── clients/
│   ├── google-ads/
│   ├── google-analytics/
│   ├── integrations/
│   ├── meta-ads/
│   └── users/
│       ├── components/           # Componentes específicos
│       ├── hooks/                # Custom hooks
│       ├── services/             # Lógica de negocio
│       ├── types/                # Tipos TypeScript
│       └── store.ts              # Estado Zustand
├── hooks/                        # Hooks globales
├── lib/                          # Utilidades y configuración
└── utils/                        # Funciones de utilidad
```

### Patrones de Arquitectura

- **Feature-Sliced Design**: Organización modular por características
- **Separation of Concerns**: Separación clara entre componentes, lógica y datos
- **Custom Hooks**: Reutilización de lógica con hooks personalizados
- **Server Components**: Uso de componentes de servidor de Next.js 16
- **API Routes**: Endpoints REST con App Router

## 🚀 Scripts Disponibles

```bash
# Desarrollo
pnpm dev          # Inicia el servidor de desarrollo

# Producción
pnpm build        # Construye la aplicación para producción
pnpm start        # Inicia el servidor de producción

# Calidad de Código
pnpm lint         # Ejecuta Biome linter
pnpm format       # Formatea el código con Biome
```

## 📦 Instalación

```bash
# Instalar dependencias
pnpm install

# Iniciar desarrollo
pnpm dev
```

## 🔧 Configuración

### TypeScript

- Target: ES2017
- Strict mode habilitado
- Path aliases: `@/*` apunta a la raíz del proyecto

### Next.js

- TypeScript build errors ignorados (desarrollo rápido)
- Imágenes sin optimizar

### Biome

- Formatter: 2 espacios de indentación
- Linter: Reglas recomendadas + dominios Next.js y React
- Organización automática de imports

## 🎨 Sistema de Diseño

- **Componentes UI**: Basados en [shadcn/ui](https://ui.shadcn.com/)
- **Temas**: Soporte para modo claro y oscuro
- **Accesibilidad**: Componentes Radix UI con WAI-ARIA
- **Responsive**: Mobile-first design con Tailwind

## 🔗 Integraciones

- **Google Ads**: Gestión y análisis de campañas
- **Google Analytics**: Análisis de datos web
- **Meta Ads**: Gestión de publicidad en Facebook/Instagram

## 📊 Características

- Dashboard interactivo con métricas en tiempo real
- Gestión de clientes y usuarios
- Análisis de marketing mix modeling
- Tablas de datos con ordenamiento y filtrado
- Gráficos interactivos con Recharts
- Sistema de asignaciones drag and drop
- Modo oscuro/claro
- Diseño responsive

---

**Versión**: 0.1.0  
**Node.js**: 20+  
**Package Manager**: pnpm
