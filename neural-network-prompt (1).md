# Prompt para desarrollar "o1234-NNG: Generador de Redes Neuronales de Palabras"

## Objetivo
Crear una aplicación web interactiva que permita a los usuarios generar y visualizar redes de conexiones entre palabras, similar a una red neuronal, donde cada palabra es un nodo y las conexiones entre ellas tienen pesos asignados. La aplicación comenzará con 5 nodos iniciales (0, 1, 2, 3, 4) dispuestos en una estructura específica.

## Especificaciones técnicas

### Tecnología base
- **Librería principal**: vis.js para la visualización y manipulación de redes
- **Implementación**: HTML, CSS y JavaScript
- **Estructura**: Aplicación de página única con paneles de control

### Visualización principal
- **Contenedor vis.js**: 
  - Debe ocupar la mayor parte del viewport
  - Fondo oscuro integrado sin espacios blancos alrededor
  - Totalmente responsive para adaptarse a cualquier dispositivo
- **Estilo visual**: 
  - Diseño austero y limpio con tema oscuro
  - Gama cromática neutra con acentos sutiles para acciones
  - Uso de variables CSS para fácil personalización
  - Interfaz con suficiente contraste para buena legibilidad

### Componentes de la red

#### Nodos
- Cada nodo representa una palabra con:
  - Forma circular 
  - Texto editable en el centro
  - Identificador único
  - Configuración visual que sigue el tema oscuro

#### Conexiones (Aristas)
- Líneas que conectan los nodos con:
  - Peso asignado entre 0 y 1
  - Visualización del peso mediante el grosor y opacidad de la línea
  - Etiqueta visible mostrando el valor numérico del peso

### Componentes de la interfaz

#### Panel de control general
- Panel lateral minimalista con solo tres elementos:
  - Logo de la aplicación (el diseño circular con los nodos 0, 1, 2, 3, 4 interconectados)
  - Botón "Exportar" para guardar el trabajo actual como imagen
  - Botón "Ayuda" para mostrar instrucciones básicas

#### Panel contextual de nodos
- Aparece únicamente al hacer clic en un nodo específico
- Contiene:
  - Nombre/identificador del nodo seleccionado
  - Campo de texto para editar el nombre del nodo actual
  - Slider para ajustar el peso de las conexiones (0-1)
  - Campo de texto para añadir el nombre de un nuevo nodo a conectar
  - Botón "Crear conexión" para vincular con otro nodo
  - Botón "Eliminar nodo" para eliminar el nodo seleccionado

### Funcionalidades principales

- **Selección de nodos**:
  - Al hacer clic en un nodo, aparece el panel contextual
  - El nodo seleccionado se resalta visualmente
  - Al hacer clic fuera de un nodo o panel, se cierra el panel contextual

- **Edición de nodos y conexiones**:
  - Edición del nombre de los nodos 
  - Ajuste del peso de conexiones con visualización en tiempo real
  - Creación de nuevas conexiones entre nodos existentes
  - Creación de nuevos nodos a partir de conexiones

### Navegación y organización
  - Arrastre de nodos para reorganizar la red
  - Motor de física que responde naturalmente a las interacciones
  - Las conexiones con mayor peso mantienen los nodos más cercanos
  - Animaciones fluidas al reorganizar la estructura de la red

## Estructura inicial de nodos
- La aplicación comenzará con 5 nodos numerados: 0, 1, 2, 3 y 4
- Disposición específica:
  - Eje horizontal: nodos 0, 1, 4 unidos por conexiones
  - Eje vertical (de arriba hacia abajo): nodos 3, 1, 2
  - El nodo 1 actúa como nodo central, ubicado en la intersección de ambos ejes
  - Todos los nodos están interconectados con pesos visualmente diferenciados

## Configuración inicial de vis.js
- Physics: activada para aprovechar el motor de simulación física de vis.js
  - Comportamiento dinámico y orgánico de la red
  - Los nodos se repelen entre sí de forma natural
  - Las conexiones actúan como resortes con tensión proporcional a su peso
  - Estabilización inicial para posicionar nodos estratégicamente
- Nodes: configurados con forma circular, color oscuro y borde visible
- Edges: grosor y opacidad proporcional al peso de la conexión
- Interaction: habilitado el arrastre de nodos y la selección de conexiones