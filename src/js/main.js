// Configuración inicial de la red
const initialNodes = [
    { id: 'n0', label: '0', x: -100, y: 0, color: { background: '#ffffff', border: '#ffffff' }, font: { color: '#000000' } },
    { id: 'n1', label: '1', x: 0, y: 0, fixed: true, color: { background: '#ffeb3b', border: '#fdd835' }, font: { color: '#000000' } },
    { id: 'n2', label: '2', x: 100, y: 100, color: { background: '#e91e63', border: '#d81b60' }, font: { color: '#000000' } },
    { id: 'n3', label: '3', x: 0, y: -100, color: { background: '#2196f3', border: '#1e88e5' }, font: { color: '#000000' } },
    { id: 'n4', label: '4', x: 200, y: 0, color: { background: '#9e9e9e', border: '#757575' }, font: { color: '#000000' } }
];

const initialEdges = [
    // Conexiones desde 0
    { from: 'n0', to: 'n1', value: 0.5 },
    { from: 'n0', to: 'n2', value: 0.3 },
    { from: 'n0', to: 'n3', value: 0.4 },
    
    // Conexiones desde 1
    { from: 'n1', to: 'n2', value: 0.6 },
    { from: 'n1', to: 'n3', value: 0.5 },
    { from: 'n1', to: 'n4', value: 0.7 },
    
    // Conexiones desde 2
    { from: 'n2', to: 'n4', value: 0.4 },
    
    // Conexiones desde 3
    { from: 'n3', to: 'n4', value: 0.5 },
];

// Función para guardar el estado actual
function saveNetworkState() {
    const currentNodes = nodes.get();
    const currentEdges = edges.get();
    localStorage.setItem('networkNodes', JSON.stringify(currentNodes));
    localStorage.setItem('networkEdges', JSON.stringify(currentEdges));
}

// Función para cargar el estado guardado
function loadNetworkState() {
    const savedNodes = localStorage.getItem('networkNodes');
    const savedEdges = localStorage.getItem('networkEdges');
    
    if (savedNodes && savedEdges) {
        nodes.clear();
        edges.clear();
        nodes.add(JSON.parse(savedNodes));
        edges.add(JSON.parse(savedEdges));
        return true;
    }
    return false;
}

// Función para crear un nuevo gráfico
function createNewGraph() {
    if (confirm('¿Estás seguro de que quieres crear un nuevo gráfico? Se perderán todos los cambios no guardados.')) {
        nodes.clear();
        edges.clear();
        nodes.add(initialNodes);
        edges.add(initialEdges);
        network.fit();
        saveNetworkState();
    }
}

// Inicializar la red
const nodes = new vis.DataSet();
const edges = new vis.DataSet();

// Cargar el estado guardado o usar el inicial
if (!loadNetworkState()) {
    nodes.add(initialNodes);
    edges.add(initialEdges);
}

// Configuración de la red
const options = {
    nodes: {
        shape: 'circle',
        size: 30,
        font: {
            size: 16,
            color: '#000000',
            face: 'arial'
        },
        borderWidth: 2,
        borderWidthSelected: 4,
        shadow: true
    },
    edges: {
        width: 2,
        color: {
            color: '#848484',
            highlight: '#848484',
            hover: '#848484'
        },
        smooth: {
            type: 'continuous',
            roundness: 0.5
        }
    },
    physics: {
        enabled: true,
        barnesHut: {
            gravitationalConstant: -2000,
            centralGravity: 0.3,
            springLength: 150,
            springConstant: 0.04,
            damping: 0.09
        },
        stabilization: {
            enabled: true,
            iterations: 1000,
            updateInterval: 100
        }
    },
    interaction: {
        hover: true,
        navigationButtons: false,
        keyboard: true
    }
};

// Crear la red
const container = document.getElementById('network');
const data = { nodes, edges };
const network = new vis.Network(container, data, options);

// Variables globales
let selectedNode = null;
let selectedEdge = null;

// Elementos DOM
const contextPanel = document.getElementById('contextPanel');
const selectedNodeSpan = document.getElementById('selectedNode');
const nodeNameInput = document.getElementById('nodeName');
const edgeWeightInput = document.getElementById('edgeWeight');
const weightValueSpan = document.getElementById('weightValue');
const newNodeNameInput = document.getElementById('newNodeName');
const createConnectionBtn = document.getElementById('createConnectionBtn');
const deleteNodeBtn = document.getElementById('deleteNodeBtn');

// Inicializar la red cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Botones del panel de control
    const exportBtn = document.getElementById('exportBtn');
    console.log('Export button found:', exportBtn);
    const helpBtn = document.getElementById('helpBtn');
    console.log('Help button found:', helpBtn);

    if (!exportBtn || !helpBtn) {
        console.error('Botones no encontrados:', {
            exportBtn: !!exportBtn,
            helpBtn: !!helpBtn
        });
    }

    // Exportar la red como imagen
    if (exportBtn) {
        exportBtn.onclick = exportGraphAsSVG;
    }

    // Mostrar ayuda
    if (helpBtn) {
        helpBtn.onclick = function() {
            const helpText = `Instrucciones básicas:

1. Nodos:
   - Haz clic en un nodo para editarlo
   - Arrastra los nodos para reorganizar la red
   - El nodo seleccionado se resalta en un color más claro

2. Conexiones:
   - Usa el slider para ajustar el peso (0-1)
   - El grosor de la línea indica el peso de la conexión
   - Las conexiones más fuertes mantienen los nodos más cerca

3. Nuevas Conexiones:
   - Selecciona un nodo
   - Escribe el nombre del nodo destino
   - Si el nodo existe, se conectará con él
   - Si no existe, se creará un nuevo nodo

4. Exportar:
   - Guarda la red como imagen PNG
   - Incluye todos los nodos y conexiones visibles`;

            alert(helpText);
        };
    }
});

// Eventos de la red
network.on('selectNode', function(params) {
    const nodeId = params.nodes[0];
    const node = nodes.get(nodeId);
    
    if (node) {
        selectedNode = nodeId;
        selectedNodeSpan.textContent = node.label;
        nodeNameInput.value = node.label;
        
        // Mostrar el panel contextual
        contextPanel.classList.remove('hidden');
        
        // Obtener las conexiones del nodo seleccionado
        const connectedEdges = network.getConnectedEdges(nodeId);
        if (connectedEdges.length > 0) {
            const firstEdge = edges.get(connectedEdges[0]);
            edgeWeightInput.value = firstEdge.value || 0.5;
            weightValueSpan.textContent = edgeWeightInput.value;
        }
    }
});

network.on('deselectNode', function() {
    selectedNode = null;
    // Ocultar el panel contextual solo si no hay nodo seleccionado
    if (!selectedNode) {
        contextPanel.classList.add('hidden');
    }
});

// Actualizar el valor mostrado cuando se mueve el slider
edgeWeightInput.addEventListener('input', function() {
    weightValueSpan.textContent = this.value;
});

// Función para encontrar un nodo por su label
function findNodeByLabel(label) {
    const allNodes = nodes.get();
    return allNodes.find(node => node.label === label);
}

// Función para obtener el color según el label
function getNodeColorByLabel(label) {
    const colors = {
        '0': { background: '#ffffff', border: '#ffffff' }, // Blanco
        '1': { background: '#ffeb3b', border: '#fdd835' }, // Amarillo
        '2': { background: '#e91e63', border: '#d81b60' }, // Magenta
        '3': { background: '#2196f3', border: '#1e88e5' }, // Azul
        '4': { background: '#9e9e9e', border: '#757575' }  // Gris
    };
    return colors[label] || { background: '#ffffff', border: '#ffffff' }; // Default a blanco
}

// Función para obtener el color del nodo padre
function getParentNodeColor(selectedNodeId) {
    const parentNode = nodes.get(selectedNodeId);
    if (!parentNode) return null;
    
    // Obtener el primer dígito del label del nodo padre
    const parentBaseNumber = parentNode.label.charAt(0);
    const colors = {
        '0': { background: '#ffffff', border: '#ffffff' }, // Blanco
        '1': { background: '#ffeb3b', border: '#fdd835' }, // Amarillo
        '2': { background: '#e91e63', border: '#d81b60' }, // Magenta
        '3': { background: '#2196f3', border: '#1e88e5' }, // Azul
        '4': { background: '#9e9e9e', border: '#757575' }  // Gris
    };
    return colors[parentBaseNumber] || { background: '#ffffff', border: '#ffffff' };
}

// Función para crear una nueva conexión
function createNewConnection() {
    const selectedId = selectedNode;
    const newNodeName = newNodeNameInput.value.trim();
    const weight = parseFloat(edgeWeightInput.value) || 0.5;
    
    if (!selectedId || !newNodeName) {
        alert('Selecciona un nodo y escribe un nombre para el nuevo nodo');
        return;
    }

    try {
        let targetNodeId;
        const existingNode = findNodeByLabel(newNodeName);
        
        if (existingNode) {
            targetNodeId = existingNode.id;
        } else {
            const allNodes = nodes.get();
            const newId = 'n' + allNodes.length;
            
            const newNode = {
                id: newId,
                label: newNodeName,
                color: getParentNodeColor(selectedId),
                font: { color: '#000000' }
            };
            nodes.add(newNode);
            targetNodeId = newId;
        }

        // Crear la conexión con el peso especificado
        const newEdge = {
            from: selectedId,
            to: targetNodeId,
            value: weight,
            length: 200 * (1 - weight) // A mayor peso, conexión más corta
        };
        
        edges.add(newEdge);
        
        // Estabilizar la red después de añadir el nodo
        network.stabilize(100);
        newNodeNameInput.value = '';
        edgeWeightInput.value = '0.5'; // Resetear el peso al valor por defecto
        
    } catch (error) {
        console.error('Error al crear la conexión:', error);
        alert('Error al crear la conexión. Por favor, intenta de nuevo.');
    }
}

// Event listener para el botón de crear conexión
createConnectionBtn.addEventListener('click', createNewConnection);

// Event listener para el input de nuevo nodo (Enter)
newNodeNameInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevenir el comportamiento por defecto
        createNewConnection();
    }
});

// Eventos del panel contextual
nodeNameInput.addEventListener('change', function() {
    if (selectedNode !== null) {
        nodes.update({ id: selectedNode, label: this.value });
    }
});

edgeWeightInput.addEventListener('input', function() {
    weightValueSpan.textContent = this.value;
    if (selectedEdge !== null) {
        edges.update({ id: selectedEdge, value: parseFloat(this.value) });
    }
});

deleteNodeBtn.addEventListener('click', function() {
    if (selectedNode !== null) {
        nodes.remove(selectedNode);
        contextPanel.classList.add('hidden');
    }
});

// Event listeners para guardar cambios
nodes.on('*', saveNetworkState);
edges.on('*', saveNetworkState);

// Botón nuevo gráfico
const newGraphBtn = document.getElementById('newGraphBtn');
if (newGraphBtn) {
    newGraphBtn.addEventListener('click', createNewGraph);
}

// Función para exportar el gráfico como SVG
function exportGraphAsSVG() {
    try {
        // Obtener las posiciones actuales de los nodos
        const positions = network.getPositions();
        const allNodes = nodes.get();
        const allEdges = edges.get();
        
        if (allNodes.length === 0) {
            throw new Error('No hay nodos para exportar');
        }
        
        // Calcular los límites del gráfico
        let minX = Infinity, maxX = -Infinity;
        let minY = Infinity, maxY = -Infinity;
        
        allNodes.forEach(node => {
            const pos = positions[node.id];
            if (!pos) {
                throw new Error(`No se encontró la posición para el nodo ${node.id}`);
            }
            minX = Math.min(minX, pos.x);
            maxX = Math.max(maxX, pos.x);
            minY = Math.min(minY, pos.y);
            maxY = Math.max(maxY, pos.y);
        });
        
        // Añadir un pequeño margen
        const margin = 50;
        minX -= margin;
        maxX += margin;
        minY -= margin;
        maxY += margin;
        
        // Usar las dimensiones reales del gráfico
        const width = maxX - minX;
        const height = maxY - minY;
        
        if (width <= 0 || height <= 0) {
            throw new Error('Dimensiones del gráfico inválidas');
        }
        
        // Crear el SVG con las dimensiones reales
        let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${minX} ${minY} ${width} ${height}">
            <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#848484"/>
                </marker>
            </defs>`;
        
        // Añadir las conexiones
        allEdges.forEach(edge => {
            const from = positions[edge.from];
            const to = positions[edge.to];
            
            if (!from || !to) {
                console.warn(`Saltando conexión ${edge.from}->${edge.to}: posiciones no encontradas`);
                return;
            }
            
            // Usar las posiciones reales sin transformación
            const strokeWidth = Math.max(1, edge.value * 5);
            const opacity = Math.max(0.2, edge.value);
            
            svg += `<line x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}" 
                         stroke="#848484" stroke-width="${strokeWidth}" 
                         opacity="${opacity}" marker-end="url(#arrowhead)"/>`;
        });
        
        // Añadir los nodos
        allNodes.forEach(node => {
            const pos = positions[node.id];
            if (!pos) return;
            
            const radius = 15;
            const label = node.label.replace(/[<>&"']/g, c => {
                switch (c) {
                    case '<': return '&lt;';
                    case '>': return '&gt;';
                    case '&': return '&amp;';
                    case '"': return '&quot;';
                    case "'": return '&apos;';
                    default: return c;
                }
            });
            
            // Añadir un círculo blanco detrás del texto para mejorar legibilidad
            svg += `<circle cx="${pos.x}" cy="${pos.y}" r="${radius}" 
                           fill="${node.color.background}" 
                           stroke="${node.color.border}" 
                           stroke-width="2"/>
                   <circle cx="${pos.x}" cy="${pos.y}" r="12" 
                           fill="white" 
                           opacity="0.7"/>
                   <text x="${pos.x}" y="${pos.y}" 
                         text-anchor="middle" 
                         dominant-baseline="middle" 
                         fill="#000000" 
                         font-family="arial" 
                         font-weight="bold"
                         font-size="16">${label}</text>`;
        });
        
        svg += '</svg>';
        
        // Crear un blob y descargar
        const blob = new Blob([svg], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'red-neuronal.svg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url); // Liberar memoria
        
    } catch (error) {
        console.error('Error al exportar el gráfico:', error);
        alert('Error al exportar el gráfico. Por favor, intenta de nuevo.');
    }
}
