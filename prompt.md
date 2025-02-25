# Prompt para Neural Network Graph Generator

Crea una aplicación web estática para visualizar y manipular redes neuronales usando vis.js con las siguientes especificaciones:

## Estructura Base
- Single-page app con HTML5, CSS moderno y JavaScript puro
- Sin backend, todo funciona en el cliente
- Usa sistema de grid 12 columnas
- Tema oscuro con paleta de colores neutra

## Componentes Principales
1. Barra de navegación superior con:
   - Logo (patrón circular de 5 nodos interconectados)
   - Botones: Exportar (SVG), Guardar Como, Abrir, Ayuda

2. Área principal:
   - Canvas a pantalla completa usando vis.js
   - Título del grafo actual en la parte superior
   - Fondo oscuro (#1a1a1a)

3. Panel contextual (aparece al seleccionar nodo):
   - Campos para editar nombre del nodo
   - Slider para peso de conexiones (0-1)
   - Opción para crear/eliminar nodos

## Red Neural Inicial
- 5 nodos numerados (0-4)
- Nodo 1 como centro fijo
- Disposición:
  - Horizontal: nodos 0-1-4
  - Vertical: nodos 3-1-2
- Todos interconectados con pesos variables
- Colores distintivos por nodo

## Funcionalidades
- Guardar/cargar grafos en localStorage
- Exportar como SVG
- Arrastrar y soltar nodos
- Edición de nombres y pesos
- Física de red interactiva
- Generación de thumbnails al guardar

## Características Técnicas
- Usar vis.js Network
- Responsive design
- Física de red suave y natural
- Persistencia local de datos
- Interfaz minimalista e intuitiva

## UI/UX
- Feedback visual en interacciones
- Transiciones suaves
- Tooltips informativos
- Indicadores claros de selección
- Panel contextual no intrusivo
