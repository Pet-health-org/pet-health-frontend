# 📁 Estructura de Carpetas - Pet-Health Frontend

## Organización General

```
src/
├── components/                    # Componentes reutilizables
│   ├── index.js                   # Exportar todos los componentes
│   ├── Button/
│   │   ├── Button.jsx
│   │   └── Button.css
│   ├── Card/
│   │   ├── Card.jsx
│   │   └── Card.css
│   ├── Input/
│   │   ├── Input.jsx
│   │   └── Input.css
│   ├── Header/
│   │   ├── Header.jsx
│   │   └── Header.css
│   ├── Navbar/
│   │   ├── Navbar.jsx
│   │   └── Navbar.css
│   ├── Footer/
│   │   ├── Footer.jsx
│   │   └── Footer.css
│   ├── Layout/
│   │   ├── Layout.jsx
│   │   └── Layout.css
│   ├── Hero/
│   │   ├── Hero.jsx
│   │   └── Hero.css
│   └── ServiceGrid/
│       ├── ServiceGrid.jsx
│       └── ServiceGrid.css
│
├── pages/                         # Páginas completas
│   ├── HomePage.jsx
│   ├── HomePage.css
│   ├── LoginPage.jsx
│   ├── LoginPage.css
│   ├── DashboardPage.jsx
│   └── DashboardPage.css
│
├── styles/                        # Estilos globales y configuración
│   ├── global.css                 # Estilos base y variables CSS
│   └── colors.js                  # Paleta de colores (JavaScript)
│
├── assets/                        # Imágenes, iconos, fuentes
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── context/                       # React Context (autenticación, tema)
│   ├── AuthContext.js             # Contexto de autenticación
│   └── ThemeContext.js            # Contexto de tema
│
├── hooks/                         # Custom hooks
│   ├── useAuth.js
│   └── useFetch.js
│
├── services/                      # Llamadas a API
│   ├── api.js                     # Configuración de axios
│   ├── auth.service.js
│   └── appointments.service.js
│
├── utils/                         # Funciones de utilidad
│   ├── formatters.js
│   └── validators.js
│
├── config/                        # Configuración
│   └── axios.js                   # Configuración de cliente HTTP
│
├── App.js                         # Componente principal
├── App.css                        # Estilos del App
├── index.js                       # Punto de entrada
├── index.css                      # Estilos base
└── reportWebVitals.js
```

## 📊 Estructura por Características

```
features/                         # Estructura opcional para características grandes
├── auth/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   └── pages/
├── appointments/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   └── pages/
└── dashboard/
    ├── components/
    ├── hooks/
    ├── services/
    └── pages/
```

## 🎯 Componentes Creados

### Componentes Base (Reutilizables)
- ✅ **Button** - 6 variantes, 4 tamaños
- ✅ **Card** - Contenedor flexible con hover
- ✅ **Input** - Input con label, error, icon, ayuda
- ✅ **Header** - Encabezado con logo y título
- ✅ **Navbar** - Barra de navegación responsive
- ✅ **Footer** - Pie de página con enlaces
- ✅ **Layout** - Contenedor completo de página

### Componentes Especializados
- ✅ **Hero** - Sección banner principal
- ✅ **ServiceGrid** - Grilla de servicios

### Páginas Completas
- ✅ **HomePage** - Página de inicio
- ✅ **LoginPage** - Página de autenticación
- ✅ **DashboardPage** - Panel de usuario

## 🎨 Estilos

### Archivo: `styles/global.css`
- Variables CSS para colores, espaciado, tipografía
- Reset CSS
- Clases de utilidad
- Animaciones predefinidas
- Estilos para scrollbar

### Archivo: `styles/colors.js`
- Paleta de colores en JavaScript
- Sombras
- Espaciado

## 📦 Composición de Componentes

### HomePage
```
HomePage
├── Layout
│   ├── Header
│   ├── Navbar
│   ├── Main
│   │   ├── Hero
│   │   ├── ServiceGrid
│   │   │   └── Cards
│   │   ├── About Section
│   │   └── CTA Section
│   └── Footer
```

### LoginPage
```
LoginPage
├── Login Container
│   ├── Header (Logo + Title)
│   └── Login Card
│       ├── Form
│       │   ├── Inputs
│       │   └── Buttons
│       ├── Divider
│       └── Social Buttons
└── Side Panel
    └── Información
```

### DashboardPage
```
DashboardPage
├── Layout
│   ├── Header
│   ├── Navbar
│   ├── Main
│   │   ├── Header (Bienvenida)
│   │   ├── Summary Cards
│   │   ├── Appointments Section
│   │   ├── Pets Section
│   │   └── Quick Actions
│   └── Footer
```

## 🔗 Importaciones Comunes

### Importar un Componente
```jsx
import Button from '../components/Button/Button';
```

### Usar el Index
```jsx
import { Button, Card, Input } from '../components';
```

### Importar una Página
```jsx
import HomePage from './pages/HomePage';
```

### Usar Estilos Globales
```jsx
import '../styles/global.css';
```

### Usar Colores en JavaScript
```jsx
import { colors, shadows, spacing } from '../styles/colors';
```

## 🚀 Próximas Estructuras a Crear

```
├── services/
│   ├── api.js                     # Cliente HTTP
│   ├── auth.js                    # Endpoints de auth
│   ├── appointments.js            # Endpoints de citas
│   └── pets.js                    # Endpoints de mascotas
│
├── context/
│   ├── AuthContext.js             # Contexto de usuario
│   └── NotificationContext.js     # Contexto de notificaciones
│
├── hooks/
│   ├── useAuth.js                 # Hook de autenticación
│   ├── useLocalStorage.js         # Hook de localStorage
│   └── useFetch.js                # Hook de peticiones
│
├── utils/
│   ├── validators.js              # Validaciones
│   ├── formatters.js              # Formateo de datos
│   └── constants.js               # Constantes
│
└── config/
    ├── axios.js                   # Configuración HTTP
    └── api.js                     # URLs de API
```

## 📋 Checklist de Archivos Creados

### ✅ Archivos Creados

**Componentes Base:**
- [x] Button.jsx + Button.css
- [x] Card.jsx + Card.css
- [x] Input.jsx + Input.css
- [x] Header.jsx + Header.css
- [x] Navbar.jsx + Navbar.css
- [x] Footer.jsx + Footer.css
- [x] Layout.jsx + Layout.css

**Componentes Especializados:**
- [x] Hero.jsx + Hero.css
- [x] ServiceGrid.jsx + ServiceGrid.css

**Páginas:**
- [x] HomePage.jsx + HomePage.css
- [x] LoginPage.jsx + LoginPage.css
- [x] DashboardPage.jsx + DashboardPage.css

**Estilos y Configuración:**
- [x] styles/global.css
- [x] styles/colors.js
- [x] components/index.js
- [x] App.js (actualizado)

**Documentación:**
- [x] PLANTILLAS.md
- [x] GUIA_ESTILOS.md
- [x] EJEMPLOS_COMPONENTES.md
- [x] ESTRUCTURA.md (este archivo)

## 🎯 Próximos Pasos

1. **Integración con React Router**
   ```bash
   npm install react-router-dom
   ```

2. **Gestión de Estado**
   ```bash
   npm install zustand
   # o
   npm install @reduxjs/toolkit
   ```

3. **HTTP Client**
   ```bash
   npm install axios
   ```

4. **Validación de Formularios**
   ```bash
   npm install react-hook-form yup
   ```

5. **Notificaciones**
   ```bash
   npm install react-toastify
   ```

## 📱 Archivos por Dispositivo

### Desktop (>1200px)
- Todos los componentes a tamaño completo
- Navbar expandido
- Grillas de 4+ columnas

### Tablet (768px - 1200px)
- Navbar con ajustes
- Grillas de 2-3 columnas
- Espaciado reducido

### Mobile (<768px)
- Navbar colapsada (hamburger)
- Grillas de 1 columna
- Espaciado mínimo
- Font sizes reducidos

---

**Última actualización:** Abril 2024
