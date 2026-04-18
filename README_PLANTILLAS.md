# 🐾 Pet-Health Frontend - Plantillas React

> Sistema de plantillas profesionales para una clínica veterinaria usando React 19

## 📋 Descripción

Este proyecto contiene un conjunto completo de **plantillas React reutilizables** para una clínica veterinaria llamada **Pet-Health**. Incluye componentes base, páginas completas, estilos globales y documentación detallada.

**Paleta de colores:**
- 🟢 Verde Marino: `#2D7D6F`
- 🔵 Azul Marino: `#1A3A52`
- ⚪ Blanco: `#FFFFFF`

## ✨ Características

- ✅ **7 Componentes Base Reutilizables**
  - Button (6 variantes)
  - Card (flexible y con hover)
  - Input (con validación)
  - Header, Navbar, Footer, Layout

- ✅ **2 Componentes Especializados**
  - Hero (banner principal)
  - ServiceGrid (grilla de servicios)

- ✅ **3 Páginas Completas**
  - HomePage (inicio con servicios)
  - LoginPage (autenticación)
  - DashboardPage (panel de usuario)

- ✅ **Sistema de Estilos Completo**
  - Variables CSS globales
  - Paleta de colores profesional
  - Animaciones suaves
  - 100% Responsive

- ✅ **Documentación Detallada**
  - Guía de estilos
  - Ejemplos de componentes
  - Estructura de carpetas

## 📁 Estructura

```
src/
├── components/           # Componentes reutilizables
├── pages/               # Páginas completas
├── styles/              # Estilos globales
├── assets/              # Imágenes y recursos
├── context/             # React Context (opcional)
├── hooks/               # Custom hooks (opcional)
├── services/            # Llamadas a API (opcional)
└── config/              # Configuración
```

## 🚀 Inicio Rápido

### 1. Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start
```

### 2. Ver en Navegador

```
http://localhost:3000
```

### 3. Compilar para Producción

```bash
npm run build
```

## 📦 Componentes Disponibles

### Button
```jsx
<Button 
  variant="primary"    // primary, secondary, outline, ghost, danger
  size="md"           // xs, sm, md, lg
>
  Texto
</Button>
```

### Card
```jsx
<Card padding="md" hover>
  Contenido
</Card>
```

### Input
```jsx
<Input 
  label="Correo"
  type="email"
  fullWidth
/>
```

### Layout
```jsx
<Layout logoSrc="/logo.png">
  Contenido de la página
</Layout>
```

## 📄 Páginas

### HomePage
- Hero section
- Grid de servicios
- Sección "Acerca de"
- Call-to-action

### LoginPage
- Formulario de login
- Opciones sociales
- Panel informativo

### DashboardPage
- Resumen de estadísticas
- Lista de citas
- Gestión de mascotas
- Acciones rápidas

## 🎨 Personalización

### Cambiar Colores

Editar `src/styles/global.css`:
```css
:root {
  --primary-green: #TU_COLOR;
  --primary-blue: #TU_COLOR;
}
```

### Agregar Componente Nuevo

1. Crear carpeta `src/components/NuevoComponente/`
2. Crear `NuevoComponente.jsx` y `NuevoComponente.css`
3. Exportar en `src/components/index.js`

### Agregar Página Nueva

1. Crear `src/pages/NuevaPage.jsx`
2. Envolver con `Layout`
3. Usar componentes base

## 📱 Responsividad

Todos los componentes se adaptan a:
- 📱 Mobile (< 600px)
- 📱 Tablet (600px - 768px)
- 🖥️ Desktop (> 768px)

## 🎬 Animaciones

Disponibles:
- `animate-fade-in` (0.3s)
- `animate-slide-in-up` (0.3s)
- `animate-slide-in-down` (0.3s)

```jsx
<div className="animate-fade-in">Contenido</div>
```

## 📚 Documentación

Consulta los siguientes archivos:

- 📖 **[PLANTILLAS.md](./PLANTILLAS.md)** - Guía completa de componentes
- 🎨 **[GUIA_ESTILOS.md](./GUIA_ESTILOS.md)** - Sistema de diseño
- 📝 **[EJEMPLOS_COMPONENTES.md](./EJEMPLOS_COMPONENTES.md)** - Ejemplos de uso
- 📁 **[ESTRUCTURA.md](./ESTRUCTURA.md)** - Organización del proyecto

## 🔧 Dependencias

```json
{
  "react": "^19.2.5",
  "react-dom": "^19.2.5",
  "react-scripts": "5.0.1"
}
```

## 📝 Variables CSS

### Colores

```css
--primary-green: #2D7D6F
--primary-blue: #1A3A52
--white: #FFFFFF
--gray-50 a --gray-900: Escala de grises
```

### Espaciado

```css
--space-xs: 4px
--space-sm: 8px
--space-md: 16px
--space-lg: 24px
--space-xl: 32px
--space-2xl: 48px
```

### Tipografía

```css
--font-size-xs: 12px
--font-size-sm: 14px
--font-size-base: 16px
--font-size-lg: 18px
--font-size-xl: 20px
--font-size-2xl: 24px
--font-size-3xl: 30px
```

## 🚀 Próximos Pasos

Para convertir esto en una aplicación completa:

1. **Agregar enrutamiento**
   ```bash
   npm install react-router-dom
   ```

2. **Gestión de estado**
   ```bash
   npm install zustand
   ```

3. **Cliente HTTP**
   ```bash
   npm install axios
   ```

4. **Validación de formularios**
   ```bash
   npm install react-hook-form yup
   ```

5. **Notificaciones**
   ```bash
   npm install react-toastify
   ```

## 📋 Checklist de Desarrollo

- [ ] Plantillas creadas ✅
- [ ] Estilos globales ✅
- [ ] Componentes base ✅
- [ ] Páginas de ejemplo ✅
- [ ] Documentación ✅
- [ ] Integración de router
- [ ] Contexto de autenticación
- [ ] Llamadas a API
- [ ] Validación de formularios
- [ ] Testing
- [ ] Deploy

## 🎯 Casos de Uso

### Agendar Cita
```jsx
<DashboardPage logoSrc="/logo.png" />
```

### Ver Servicios
```jsx
<HomePage logoSrc="/logo.png" />
```

### Iniciar Sesión
```jsx
<LoginPage />
```

## 💡 Tips

1. **Reutiliza componentes**: Combina Button, Card e Input para crear formularios
2. **Usa Layout**: Envuelve todas tus páginas con Layout
3. **Varía colores**: Usa variantes `variant` en Button para diferentes acciones
4. **Mantén espaciado**: Usa siempre `--space-*` variables
5. **Test responsivo**: Usa DevTools para ver en diferentes tamaños

## 🐛 Solución de Problemas

### Los estilos no se aplican
- Verifica que `global.css` esté importado en `App.js`
- Asegúrate de que los archivos `.css` existan junto a los `.jsx`

### El layout no se ve bien en mobile
- Verifica el `container` class
- Revisa que el NavBar esté activo

### Componentes sin estilo
- Verifica las rutas de importación
- Asegúrate de que los archivos CSS estén en el mismo directorio

## 📞 Contacto y Soporte

Para preguntas sobre las plantillas, consulta la documentación incluida.

## 📄 Licencia

Proyecto creado para Pet-Health - Clínica Veterinaria

## 🎉 ¡Listo para Usar!

Ahora puedes:
- ✅ Usar componentes base en tus páginas
- ✅ Personalizar colores y estilos
- ✅ Agregar nuevas páginas
- ✅ Conectar con un backend

---

**Última actualización:** Abril 2024
**Versión:** 1.0.0
