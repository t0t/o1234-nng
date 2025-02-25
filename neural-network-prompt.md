# Prompt para desarrollar "o1234-NNG: Generador de Redes Neuronales de Palabras"

## Objetivo
Crear una aplicación web interactiva que permita a los usuarios generar y visualizar redes de conexiones entre palabras, similar a una red neuronal, donde cada palabra es un nodo y las conexiones entre ellas tienen pesos asignados. La aplicación comenzará con 5 nodos iniciales (0, 1, 2, 3, 4) dispuestos en una estructura específica.

## Especificaciones técnicas

### Visualización principal
- **Contenedor SVG**: 
  - Debe ocupar el 100% del viewport (tanto ancho como alto)
  - Fondo oscuro integrado (sin espacios blancos alrededor)
  - Totalmente responsive para adaptarse a cualquier dispositivo
- **Estilo visual**: 
  - Diseño austero y limpio con tema oscuro
  - Gama cromática neutra con acentos sutiles para acciones
  - Uso de variables CSS para fácil personalización
  - Interfaz con suficiente contraste para buena legibilidad

### Componentes de la red

#### Nodos
- Cada nodo representa una palabra y consiste en:
  - Círculo envolvente
  - Texto editable en el centro que se adapta automáticamente al tamaño del círculo
  - Sistema de ajuste para palabras largas (reducción de tamaño de fuente, saltos de línea o abreviación)
  - La edición del texto debe ser intuitiva (doble clic para editar)
  - Identificador único para cada nodo
  - Capacidad de ser arrastrado y reposicionado en el lienzo

#### Conexiones (Aristas)
- Líneas SVG que conectan dos o más nodos
- Cada conexión tiene:
  - Nodo de origen
  - Nodo de destino
  - Peso asignado (visualizado mediante el grosor o la opacidad de la línea)
  - Posibilidad de etiqueta opcional con el valor del peso

### Componentes de la interfaz

#### Panel de control general
- Panel minimalista con solo tres elementos:
  - Logo de la aplicación (el diseño circular con los nodos 0, 1, 2, 3, 4 interconectados)
  - Botón "Exportar" para guardar el trabajo actual
  - Botón "Ayuda" para mostrar instrucciones básicas

#### Panel contextual de nodos
- Aparece únicamente al hacer clic en un nodo específico
- Contiene:
  - Nombre/identificador del nodo seleccionado
  - Campo de texto para editar el nombre del nodo actual
  - Slider para ajustar el peso de las conexiones
  - Campo de texto para añadir el nombre de un nuevo nodo a conectar
  - Botón "Crear conexión" para vincular con otro nodo
  - Botón "Eliminar nodo" para eliminar el nodo seleccionado

### Interactividad implementada

- **Selección de nodos**:
  - Al hacer clic en un nodo, aparece el panel contextual
  - El nodo seleccionado se resalta con un borde punteado
  - Al hacer clic fuera de un nodo o panel, se cierra el panel contextual

- **Edición de nodos**:
  - El texto de cada nodo se ajusta automáticamente según su longitud
  - El usuario puede editar el nombre del nodo desde el panel contextual
  - Los cambios se aplican inmediatamente

- **Gestión de conexiones**:
  - El slider permite ajustar el peso de las conexiones en tiempo real
  - El grosor y opacidad de las líneas refleja visualmente el peso de cada conexión
  - Se pueden crear nuevas conexiones entre nodos existentes o con nuevos nodos

- **Navegación y organización**:
  - Los nodos se pueden arrastrar para reorganizar la red
  - Las conexiones se actualizan dinámicamente al mover los nodos
  - El SVG es responsive y ocupa todo el viewport

## Estructura inicial de nodos
- La aplicación comenzará con 5 nodos numerados: 0, 1, 2, 3 y 4
- Disposición específica:
  - Eje horizontal: nodos 0, 1, 4 unidos por conexiones
  - Eje vertical (de arriba hacia abajo): nodos 3, 1, 2
  - El nodo 1 actúa como nodo central, ubicado en la intersección de ambos ejes
  - Esta estructura formará un patrón circular o pentagonal donde todos los nodos están interconectados

## Diseño de la interfaz
- Minimalista con tema oscuro y gama cromática neutra
- Logo de la aplicación (el patrón circular con nodos 0-4) como elemento de identidad
- Panel de control general simplificado, solo con logo, botón Exportar y botón Ayuda
- Área principal dedicada al lienzo SVG que ocupa todo el viewport
- Panel contextual que aparece únicamente al seleccionar un nodo
- Indicadores visuales claros del nodo activo (borde resaltado)

## Habilidades técnicas necesarias
- Manipulación avanzada de SVG
- Gestión de eventos de interacción (arrastrar, soltar, clic)
- Algoritmos básicos de visualización de grafos
- Experiencia en diseño de interfaces intuitivas