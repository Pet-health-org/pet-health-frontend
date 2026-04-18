# 🎨 Guía de Estilos - Pet-Health

## 🎯 Tokens de Diseño

### Colores

#### Primarios
- **Verde Marino**: `#2D7D6F` (RGB: 45, 125, 111)
- **Azul Marino**: `#1A3A52` (RGB: 26, 58, 82)

#### Secundarios
- **Verde Marina Claro**: `#4A9B91`
- **Azul Marina Claro**: `#2E5A7B`

#### Neutrales
```
White:        #FFFFFF
Gray 50:      #F9FAFB  (Fondo muy claro)
Gray 100:     #F3F4F6  (Fondo claro)
Gray 200:     #E5E7EB  (Bordes)
Gray 300:     #D1D5DB  (Bordes secundarios)
Gray 400:     #9CA3AF  (Placeholder)
Gray 500:     #6B7280  (Texto secundario)
Gray 600:     #4B5563  (Texto terciario)
Gray 700:     #374151  (Texto primario)
Gray 800:     #1F2937  (Texto fuerte)
Gray 900:     #111827  (Texto muy fuerte)
```

#### Estados
- **Success**: `#10B981` (Verde)
- **Warning**: `#F59E0B` (Amarillo)
- **Error**: `#EF4444` (Rojo)
- **Info**: `#3B82F6` (Azul)

### Espaciado

```
XS:   4px
SM:   8px
MD:   16px
LG:   24px
XL:   32px
2XL:  48px
```

### Tipografía

#### Fuente Principal
- **Familia**: Segoe UI, Tahoma, Geneva, Verdana, sans-serif
- **Antialias**: Habilitado

#### Tamaños
```
XS:   12px
SM:   14px
Base: 16px
LG:   18px
XL:   20px
2XL:  24px
3XL:  30px
```

#### Pesos
- **Regular**: 400
- **Medium**: 500
- **Semibold**: 600
- **Bold**: 700
- **Extrabold**: 900

### Sombras

```
Small:   0 1px 2px 0 rgba(0, 0, 0, 0.05)
Medium:  0 4px 6px -1px rgba(0, 0, 0, 0.1)
Large:   0 10px 15px -3px rgba(0, 0, 0, 0.1)
XL:      0 20px 25px -5px rgba(0, 0, 0, 0.1)
```

### Border Radius

```
SM:   4px
MD:   8px
LG:   12px
Full: 9999px (Completamente redondeado)
```

## 🎨 Ejemplos de Uso

### Paleta de Botones

#### Botón Primario (Verde Marino)
```jsx
<Button variant="primary" size="md">
  Agendar Cita
</Button>
```
- Fondo: Verde Marino
- Texto: Blanco
- Sombra: Media
- Hover: Verde Marino Oscuro + Elevación

#### Botón Secundario (Azul Marino)
```jsx
<Button variant="secondary" size="md">
  Contactar
</Button>
```
- Fondo: Azul Marino
- Texto: Blanco
- Hover: Azul Marino Oscuro

#### Botón Outline
```jsx
<Button variant="outline" size="md">
  Cancelar
</Button>
```
- Fondo: Transparente
- Borde: 2px Verde Marino
- Texto: Verde Marino
- Hover: Fondo Verde Marino + Texto Blanco

#### Botón Ghost
```jsx
<Button variant="ghost" size="md">
  Más Información
</Button>
```
- Fondo: Transparente
- Texto: Verde Marino
- Hover: Fondo Gris 100

### Componentes de Entrada

#### Input Estándar
```jsx
<Input 
  label="Correo Electrónico"
  type="email"
  placeholder="tu@correo.com"
  fullWidth
/>
```
- Borde: Gris 300
- Focus: Verde Marino + Shadow
- Error: Rojo

#### Input con Icono
```jsx
<Input 
  label="Usuario"
  icon="👤"
  placeholder="Tu usuario"
/>
```

#### Input Deshabilitado
```jsx
<Input 
  label="Campo deshabilitado"
  disabled
/>
```
- Fondo: Gris 100
- Texto: Gris 500

### Cards y Contenedores

#### Card Básica
```jsx
<Card padding="md">
  <h3>Consulta General</h3>
  <p>Descripción del servicio</p>
</Card>
```
- Fondo: Blanco
- Borde: 1px Gris 200
- Sombra: Pequeña
- Border Radius: 12px

#### Card Hover
```jsx
<Card hover padding="lg">
  <h3>Vacunación</h3>
  <p>$35 por sesión</p>
</Card>
```
- Cursor: Pointer
- Hover: Sombra más grande + Elevación -4px

### Secciones

#### Hero Section
```jsx
<Hero 
  title="Bienvenido a Pet-Health"
  subtitle="Clínica Veterinaria de Confianza"
/>
```
- Gradiente: Azul Marino → Verde Marino
- Altura: min 500px
- Overlay: Azul Marino Oscuro 85%

#### About Section
```jsx
<section className="about-section">
  {/* Contenido */}
</section>
```
- Fondo: Gris 50
- Padding: 48px vertical

#### CTA Section
```jsx
<section className="cta-section">
  <h2>¿Necesitas atención?</h2>
  <button className="cta-button">Agendar Ahora</button>
</section>
```
- Fondo: Gradiente Azul/Verde
- Texto: Blanco
- Botón: Blanco con texto Verde Marino

## 📐 Componentes Comunes

### Header
- Altura: 60px + padding
- Gradiente: Azul → Verde
- Logo: 48px × 48px
- Posición: Sticky

### Navbar
- Altura: 56px
- Fondo: Blanco
- Borde inferior: 1px Gris 200
- Links: Verde Marino con underline en hover
- Menú móvil: Hamburger toggle

### Footer
- Fondo: Azul Marino
- Borde superior: 4px Verde Marino
- Padding: 48px vertical, 24px horizontal
- Texto: Blanco 90%
- Links: Verde Marino Claro

### Service Grid
```jsx
<div className="service-grid">
  {/* Cards de servicios */}
</div>
```
- Columnas: Auto-fit (min 280px)
- Gap: 24px
- Icon: 80px × 80px, gradiente

## 🎬 Animaciones

### Fade In (0.3s)
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

### Slide In Up (0.3s)
```css
@keyframes slideInUp {
  from { 
    transform: translateY(20px);
    opacity: 0;
  }
  to { 
    transform: translateY(0);
    opacity: 1;
  }
}
```

### Slide In Down (0.3s)
```css
@keyframes slideInDown {
  from { 
    transform: translateY(-20px);
    opacity: 0;
  }
  to { 
    transform: translateY(0);
    opacity: 1;
  }
}
```

## 📱 Breakpoints (Responsividad)

```
Mobile:     < 600px
Tablet:     600px - 768px
Desktop:    > 768px
```

### Cambios principales en Mobile

- Header: Padding reducido
- Navbar: Hamburger menu
- Layout: Single column
- Cards: Full width o 1 columna
- Font sizes: Reducidos un nivel
- Spacing: Reducido un nivel

## ✅ Checklist de Diseño

- [ ] Paleta de colores implementada
- [ ] Tipografía consistente
- [ ] Espaciado uniforme (múltiplos de 8px)
- [ ] Sombras aplicadas correctamente
- [ ] Border radius consistentes
- [ ] Animaciones suaves (0.3s ease)
- [ ] Accesibilidad: Contraste mínimo AA
- [ ] Responsive en todos los breakpoints
- [ ] Hover states definidos
- [ ] Focus states para accesibilidad

---

**Última actualización**: Abril 2024
