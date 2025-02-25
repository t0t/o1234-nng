# Generador de Redes Neuronales de Palabras

Una aplicación web interactiva para visualizar y crear redes de conexiones entre palabras, implementada con vis.js.

## 🌟 Características

- **Visualización Dinámica**: Red interactiva con nodos y conexiones que responden a la física
- **Sistema de Colores**: 
  - Nodo 0: Blanco
  - Nodo 1: Amarillo (Central)
  - Nodo 2: Magenta
  - Nodo 3: Azul
  - Nodo 4: Gris
- **Herencia de Colores**: Los nuevos nodos heredan el color de su nodo padre
- **Conexiones Ponderadas**: El peso de las conexiones determina:
  - La distancia entre nodos
  - El grosor de las líneas
  - La opacidad de las conexiones
- **Exportación SVG**: Genera gráficos vectoriales con:
  - Fondo transparente
  - Textos legibles
  - Preservación de colores y estilos
- **Persistencia**: Los cambios se guardan automáticamente en localStorage

## 🛠️ Tecnologías

- **Frontend**: HTML5, CSS moderno, JavaScript
- **Visualización**: vis.js Network
- **Build System**: Vite
- **Persistencia**: localStorage API

## 📦 Instalación

1. Clona el repositorio:
```bash
git clone <url-del-repo>
cd o1234-NNG
```

2. Instala las dependencias:
```bash
npm install
```

3. Inicia el servidor de desarrollo:
```bash
npm run dev
```

## 🎮 Uso

1. **Crear Nodos**:
   - Selecciona un nodo existente
   - Escribe el nombre del nuevo nodo
   - Ajusta el peso de la conexión (0-1)
   - Presiona Enter o haz clic en "Crear"

2. **Modificar Conexiones**:
   - Selecciona un nodo para ver sus conexiones
   - Ajusta los pesos usando el slider
   - Los cambios se reflejan en tiempo real

3. **Exportar**:
   - Haz clic en el botón "Exportar"
   - Se descargará un archivo SVG
   - El gráfico mantiene todas las propiedades visuales

4. **Nuevo Gráfico**:
   - Usa el botón "Nuevo" para empezar desde cero
   - Confirma para borrar el gráfico actual

## 🎨 Diseño

- **Tema**: Oscuro y minimalista
- **Gama Cromática**: Neutra con acentos de color por tipo de nodo
- **Interfaz**: 
  - Panel de control simplificado
  - Área principal para el lienzo
  - Panel contextual para nodos seleccionados

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:
1. Haz fork del proyecto
2. Crea una rama para tu feature
3. Envía un pull request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.
