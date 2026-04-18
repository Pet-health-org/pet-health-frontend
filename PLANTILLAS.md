# 🐾 Pet-Health - Documentación de Plantillas

## 📋 Introducción

Este proyecto contiene un conjunto completo de plantillas React para una clínica veterinaria. Las plantillas están diseñadas con una paleta de colores profesional (verde marino, azul marino y blanco) y siguen mejores prácticas de componentes reutilizables.

## 🎨 Paleta de Colores

```
Verde Marino Principal:    #2D7D6F
Azul Marino Principal:     #1A3A52
Blanco:                    #FFFFFF

Verde Marino Claro:        #4A9B91
Azul Marino Claro:         #2E5A7B
Grises Neutros:            #F9FAFB - #111827
```

## 📦 Estructura de Componentes

### Componentes Base (Reutilizables)

#### **Button**
```jsx
<Button 
  variant="primary"      // primary, secondary, outline, ghost, danger, success
  size="md"             // xs, sm, md, lg
  fullWidth={false}
  disabled={false}
>
  Texto del Botón
</Button>
```

#### **Card**
```jsx
<Card 
  padding="md"          // xs, sm, md, lg
  hover={false}
  className=""
>
  Contenido de la tarjeta
</Card>
```

#### **Input**
```jsx
<Input 
  label="Label"
  type="text"
  placeholder="Placeholder"
  error="Mensaje de error"
  helpText="Texto de ayuda"
  icon={null}
  size="md"             // xs, sm, md, lg
  fullWidth={true}
/>
```

#### **Header**
```jsx
<Header 
  logoSrc="/logo.png"
  title="Pet-Health"
  subtitle="Clínica Veterinaria"
  onLogoClick={() => {}}
>
  {/* Contenido adicional */}
</Header>
```

#### **Navbar**
```jsx
<Navbar 
  links={[
    { href: '#home', label: 'Inicio', active: true },
    { href: '#servicios', label: 'Servicios' }
  ]}
  isAuthenticated={true}
  userName="Juan"
  onLogout={() => {}}
/>
```

#### **Footer**
```jsx
<Footer className="" />
```

#### **Layout**
Componente contenedor que agrupa Header, Navbar, contenido principal y Footer.

```jsx
<Layout 
  logoSrc="/logo.png"
  navbarLinks={links}
  isAuthenticated={true}
  userName="Juan"
>
  {/* Contenido principal */}
</Layout>
```

### Componentes Especializados

#### **Hero**
Sección principal con banner llamativo.

```jsx
<Hero 
  title="Bienvenido"
  subtitle="Subtítulo"
  description="Descripción"
  ctaText="Botón Principal"
  onCtaClick={() => {}}
  onSecondaryCtaClick={() => {}}
/>
```

#### **ServiceGrid**
Grilla de servicios.

```jsx
<ServiceGrid 
  services={[
    {
      icon: '🩺',
      title: 'Consultas',
      description: 'Descripción...',
      price: 'Desde $50'
    }
  ]}
/>
```

## 📄 Páginas Plantillas

### 1. **HomePage**
Página de inicio con:
- Hero section
- Grid de servicios
- Sección "Acerca de"
- CTA (Call To Action)

```jsx
import HomePage from './pages/HomePage';

<HomePage logoSrc="/logo.png" />
```

### 2. **LoginPage**
Página de autenticación con:
- Formulario de login
- Opciones de redes sociales
- Panel informativo lateral

```jsx
import LoginPage from './pages/LoginPage';

<LoginPage />
```

### 3. **DashboardPage**
Panel de usuario con:
- Resumen de estadísticas
- Lista de próximas citas
- Gestión de mascotas
- Acciones rápidas

```jsx
import DashboardPage from './pages/DashboardPage';

<DashboardPage logoSrc="/logo.png" />
```

## 🎯 Uso Rápido

### Instalación

1. Todos los componentes ya están creados en `/src/components`
2. Los estilos globales están en `/src/styles/global.css`
3. Los colores están definidos en `/src/styles/colors.js`

### Importar Componentes

```jsx
// Importación individual
import Button from './components/Button/Button';
import Card from './components/Card/Card';

// O usar el índice
import { Button, Card, Input } from './components';
```

### Importar Páginas

```jsx
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
```

## 🎨 Personalización

### Variables CSS

Todas las variables están definidas en `:root` en `global.css`:

```css
--primary-green: #2D7D6F;
--primary-blue: #1A3A52;
--space-md: 16px;
--font-size-lg: 18px;
```

### Modificar Colores

1. Editar `src/styles/global.css` (variables CSS)
2. Editar `src/styles/colors.js` (para JavaScript)

### Agregar Animaciones

Las siguientes animaciones están disponibles:
- `animate-fade-in`
- `animate-slide-in-up`
- `animate-slide-in-down`

```jsx
<div className="animate-fade-in">Contenido</div>
```

## 📱 Responsividad

Todos los componentes son responsivos y se adaptan a:
- 📱 Mobile (< 600px)
- 📱 Tablet (600px - 768px)
- 🖥️ Desktop (> 768px)

## 🔧 Extensiones Comunes

### Agregar Página Nueva

1. Crear archivo en `src/pages/NuevaPage.jsx`
2. Envolver con `Layout`
3. Usar componentes base

```jsx
import Layout from '../components/Layout/Layout';
import { Button, Card } from '../components';

const NuevaPage = () => {
  return (
    <Layout>
      <div className="container">
        <h1>Mi Nueva Página</h1>
      </div>
    </Layout>
  );
};

export default NuevaPage;
```

### Agregar Componente Nuevo

1. Crear carpeta en `src/components/NombreComponente/`
2. Crear `NombreComponente.jsx` y `NombreComponente.css`
3. Exportar en `src/components/index.js`

## 📝 Notas

- ✅ Todos los componentes incluyen accesibilidad (ARIA)
- ✅ Estilos CSS organizados por componente
- ✅ Paleta de colores profesional implementada
- ✅ Animaciones suaves y transiciones
- ✅ Totalmente responsive
- ✅ Listo para producción

## 🚀 Próximos Pasos

1. Conectar con backend/API
2. Agregar autenticación real
3. Implementar rutas con React Router
4. Agregar gestión de estado (Redux/Context)
5. Implementar funcionalidad de citas
6. Agregar notificaciones

---

**Creado para Pet-Health - Clínica Veterinaria** 🐾
