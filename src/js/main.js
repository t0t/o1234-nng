// Configuración inicial de la red
const initialNodes = [
    { id: 'n0', label: '0', x: -100, y: 0, group: 'group0' },
    { id: 'n1', label: '1', x: 0, y: 0, fixed: true, group: 'group1' },
    { id: 'n2', label: '2', x: 100, y: 100, group: 'group2' },
    { id: 'n3', label: '3', x: 0, y: -100, group: 'group3' },
    { id: 'n4', label: '4', x: 200, y: 0, group: 'group4' }
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

// Definición de grupos y colores
const nodeGroups = {
    group0: { color: { background: '#ffffff', border: '#ffffff' }, font: { color: '#000000' } },
    group1: { color: { background: '#ffeb3b', border: '#fdd835' }, font: { color: '#000000' } },
    group2: { color: { background: '#e91e63', border: '#d81b60' }, font: { color: '#000000' } },
    group3: { color: { background: '#2196f3', border: '#1e88e5' }, font: { color: '#000000' } },
    group4: { color: { background: '#9e9e9e', border: '#757575' }, font: { color: '#000000' } }
};

// Crear los datasets
const nodes = new vis.DataSet(initialNodes);
const edges = new vis.DataSet(initialEdges);

// Configuración de la red
const options = {
    nodes: {
        shape: 'circle',
        size: 30,
        font: {
            size: 14
        },
        borderWidth: 2,
        shadow: true
    },
    edges: {
        width: 2,
        shadow: true,
        smooth: {
            type: 'continuous'
        }
    },
    groups: nodeGroups,
    physics: {
        enabled: true,
        solver: 'forceAtlas2Based',
        forceAtlas2Based: {
            gravitationalConstant: -10,
            centralGravity: 0.01,
            springLength: 90,
            springConstant: 0.08,
            damping: 0.4,
            avoidOverlap: 0.4
        },
        stabilization: {
            enabled: true,
            iterations: 1000,
            updateInterval: 50,
            fit: true
        }
    },
    manipulation: {
        enabled: false
    }
};

// Crear la red
const container = document.getElementById('network');
const data = { nodes, edges };
const network = new vis.Network(container, data, options);

// Clave para localStorage
const STORAGE_KEY = 'neural_network_graphs';

// Función para cargar gráficos guardados
function loadSavedGraphs() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : {};
    } catch (error) {
        console.error('Error al cargar gráficos:', error);
        return {};
    }
}

// Función para guardar un gráfico
async function saveGraph(name) {
    const graphs = loadSavedGraphs();
    const id = `graph_${Date.now()}`;
    
    // Capturar miniatura
    const thumbnail = await captureNetworkThumbnail();
    
    const graphData = {
        name,
        created: new Date().toISOString(),
        modified: new Date().toISOString(),
        thumbnail,
        data: {
            nodes: nodes.get(),
            edges: edges.get()
        }
    };
    
    try {
        graphs[id] = graphData;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(graphs));
        return id;
    } catch (e) {
        console.error('Error al guardar:', e);
        throw new Error('No se pudo guardar el gráfico: ' + e.message);
    }
}

// Función para cargar un gráfico
window.loadGraph = function(id) {
    const graphs = loadSavedGraphs();
    const graph = graphs[id];
    
    if (graph) {
        nodes.clear();
        edges.clear();
        nodes.add(graph.data.nodes);
        edges.add(graph.data.edges);
        document.getElementById('savedGraphsPanel').classList.add('hidden');
        return true;
    }
    return false;
}

// Función para eliminar un gráfico
window.deleteGraph = function(id) {
    const graphs = loadSavedGraphs();
    if (graphs[id]) {
        delete graphs[id];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(graphs));
        updateGraphsList();
        return true;
    }
    return false;
}

// Función para actualizar la lista de gráficos
function updateGraphsList() {
    const graphsList = document.querySelector('.graphs-list');
    const graphs = loadSavedGraphs();
    
    graphsList.innerHTML = '';
    
    Object.entries(graphs).forEach(([id, graph]) => {
        const item = document.createElement('div');
        item.className = 'graph-item';
        
        // Crear elemento de imagen
        const img = document.createElement('img');
        img.className = 'graph-thumbnail';
        img.alt = graph.name;
        
        // Asignar src solo si hay thumbnail
        if (graph.thumbnail) {
            img.src = graph.thumbnail;
            img.onerror = () => {
                console.error('Error al cargar miniatura:', id);
                img.src = '/src/assets/placeholder.png';
            };
        } else {
            img.src = '/src/assets/placeholder.png';
        }
        
        const info = document.createElement('div');
        info.className = 'graph-info';
        info.innerHTML = `
            <h4 class="graph-name">${graph.name}</h4>
            <div class="graph-date">Modificado: ${new Date(graph.modified).toLocaleString()}</div>
        `;
        
        const actions = document.createElement('div');
        actions.className = 'graph-actions';
        actions.innerHTML = `
            <button class="btn" onclick="loadGraph('${id}')">Abrir</button>
            <button class="btn cancel-btn" onclick="deleteGraph('${id}')">Eliminar</button>
        `;
        
        item.appendChild(img);
        item.appendChild(info);
        item.appendChild(actions);
        graphsList.appendChild(item);
    });
}

// Función para capturar miniatura
function captureNetworkThumbnail() {
    return new Promise((resolve) => {
        try {
            // Asegurarnos de que el network está listo
            if (!network || !network.canvas || !network.canvas.frame) {
                console.error('Network no está listo para captura');
                resolve(null);
                return;
            }

            // Hacer fit para asegurar que todo el gráfico es visible
            network.fit({
                animation: false
            });

            // Esperar un momento para que el fit se complete
            setTimeout(() => {
                const networkCanvas = network.canvas.frame.canvas;
                
                // Crear un canvas temporal
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // Usar un tamaño fijo para la miniatura
                canvas.width = 200;
                canvas.height = 200;
                
                // Dibujar el fondo negro
                ctx.fillStyle = '#1a1a1a';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                // Calcular el escalado manteniendo la relación de aspecto
                const scale = Math.min(
                    canvas.width / networkCanvas.width,
                    canvas.height / networkCanvas.height
                );
                
                // Calcular posición centrada
                const x = (canvas.width - networkCanvas.width * scale) / 2;
                const y = (canvas.height - networkCanvas.height * scale) / 2;
                
                // Dibujar el contenido del network
                ctx.save();
                ctx.translate(x, y);
                ctx.scale(scale, scale);
                ctx.drawImage(networkCanvas, 0, 0);
                ctx.restore();
                
                // Convertir a PNG y resolver la promesa
                const dataUrl = canvas.toDataURL('image/png', 0.8);
                resolve(dataUrl);
            }, 100);
        } catch (error) {
            console.error('Error al capturar miniatura:', error);
            resolve(null);
        }
    });
}

// Variables globales para el panel de contexto
let selectedNode = null;
let selectedEdge = null;

// Eventos de la red
network.on('selectNode', function(params) {
    const nodeId = params.nodes[0];
    const node = nodes.get(nodeId);
    
    if (node) {
        selectedNode = nodeId;
        document.getElementById('selectedNode').textContent = node.label;
        document.getElementById('nodeName').value = node.label;
        
        // Mostrar el panel contextual
        document.getElementById('contextPanel').classList.remove('hidden');
        
        // Obtener las conexiones del nodo seleccionado
        const connectedEdges = network.getConnectedEdges(nodeId);
        if (connectedEdges.length > 0) {
            const firstEdge = edges.get(connectedEdges[0]);
            const weightInput = document.getElementById('edgeWeight');
            weightInput.value = firstEdge.value || 0.5;
            document.getElementById('weightValue').textContent = weightInput.value;
        }
    }
});

network.on('deselectNode', function() {
    selectedNode = null;
    // Ocultar el panel contextual solo si no hay nodo seleccionado
    if (!selectedNode) {
        document.getElementById('contextPanel').classList.add('hidden');
    }
});

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
        
        // Añadir margen
        const margin = 50;
        minX -= margin;
        maxX += margin;
        minY -= margin;
        maxY += margin;
        
        const width = maxX - minX;
        const height = maxY - minY;
        
        if (width <= 0 || height <= 0) {
            throw new Error('Dimensiones del gráfico inválidas');
        }
        
        // Crear el SVG
        let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${minX} ${minY} ${width} ${height}">
            <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#848484"/>
                </marker>
            </defs>`;
        
        // Añadir conexiones
        allEdges.forEach(edge => {
            const from = positions[edge.from];
            const to = positions[edge.to];
            
            if (!from || !to) {
                console.warn(`Saltando conexión ${edge.from}->${edge.to}: posiciones no encontradas`);
                return;
            }
            
            const strokeWidth = Math.max(1, edge.value * 5);
            const opacity = Math.max(0.2, edge.value);
            
            svg += `<line x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}" 
                         stroke="#848484" stroke-width="${strokeWidth}" 
                         opacity="${opacity}" marker-end="url(#arrowhead)"/>`;
        });
        
        // Añadir nodos
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
            
            svg += `<circle cx="${pos.x}" cy="${pos.y}" r="${radius}" 
                           fill="${nodeGroups[node.group].color.background || '#ffffff'}" 
                           stroke="${nodeGroups[node.group].color.border || '#000000'}" 
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
        
        // Descargar el SVG
        const blob = new Blob([svg], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'red-neuronal.svg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
    } catch (error) {
        console.error('Error al exportar el gráfico:', error);
        alert('Error al exportar el gráfico. Por favor, intenta de nuevo.');
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Botón Guardar Como
    const saveAsBtn = document.getElementById('saveAsBtn');
    if (saveAsBtn) {
        saveAsBtn.addEventListener('click', () => {
            document.getElementById('saveGraphModal').classList.remove('hidden');
        });
    }

    // Botón Abrir
    const openGraphBtn = document.getElementById('openGraphBtn');
    if (openGraphBtn) {
        openGraphBtn.addEventListener('click', () => {
            document.getElementById('savedGraphsPanel').classList.remove('hidden');
            updateGraphsList();
        });
    }

    // Botón Guardar en modal
    const saveGraphBtn = document.getElementById('saveGraphBtn');
    if (saveGraphBtn) {
        saveGraphBtn.addEventListener('click', async () => {
            const nameInput = document.getElementById('graphNameInput');
            const name = nameInput.value.trim();
            
            if (name) {
                await saveGraph(name);
                nameInput.value = '';
                document.getElementById('saveGraphModal').classList.add('hidden');
                updateGraphsList();
            }
        });
    }

    // Botones de cerrar modales
    document.querySelectorAll('.close-btn, .cancel-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal, .saved-graphs-panel');
            if (modal) {
                modal.classList.add('hidden');
            }
        });
    });

    // Eventos del panel de contexto
    const nodeNameInput = document.getElementById('nodeName');
    const edgeWeightInput = document.getElementById('edgeWeight');
    const weightValueSpan = document.getElementById('weightValue');
    const newNodeNameInput = document.getElementById('newNodeName');
    const createConnectionBtn = document.getElementById('createConnectionBtn');
    const deleteNodeBtn = document.getElementById('deleteNodeBtn');

    // Actualizar nombre del nodo
    if (nodeNameInput) {
        nodeNameInput.addEventListener('change', function() {
            if (selectedNode !== null) {
                nodes.update({ id: selectedNode, label: this.value });
            }
        });
    }

    // Actualizar peso de la conexión
    if (edgeWeightInput) {
        edgeWeightInput.addEventListener('input', function() {
            weightValueSpan.textContent = this.value;
            if (selectedEdge !== null) {
                edges.update({ id: selectedEdge, value: parseFloat(this.value) });
            }
        });
    }

    // Eliminar nodo
    if (deleteNodeBtn) {
        deleteNodeBtn.addEventListener('click', function() {
            if (selectedNode !== null) {
                nodes.remove(selectedNode);
                document.getElementById('contextPanel').classList.add('hidden');
            }
        });
    }

    // Crear nueva conexión
    if (createConnectionBtn) {
        createConnectionBtn.addEventListener('click', function() {
            if (!selectedNode || !newNodeNameInput.value.trim()) {
                alert('Selecciona un nodo y escribe un nombre para el nuevo nodo');
                return;
            }

            const newNodeName = newNodeNameInput.value.trim();
            const weight = parseFloat(edgeWeightInput.value) || 0.5;
            
            // Buscar si ya existe un nodo con ese nombre
            const existingNode = nodes.get().find(node => node.label === newNodeName);
            
            let targetNodeId;
            if (existingNode) {
                targetNodeId = existingNode.id;
            } else {
                // Crear nuevo nodo
                const newId = 'n' + nodes.get().length;
                nodes.add({
                    id: newId,
                    label: newNodeName,
                    group: selectedNode ? nodes.get(selectedNode).group : 'group3'  // Heredar grupo del nodo padre o grupo 3 si es independiente
                });
                targetNodeId = newId;
            }

            // Crear la conexión
            edges.add({
                from: selectedNode,
                to: targetNodeId,
                value: weight
            });

            newNodeNameInput.value = '';
        });

        // Añadir event listener para la tecla Enter
        newNodeNameInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                createConnectionBtn.click();
            }
        });
    }

    // Botón Exportar
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportGraphAsSVG);
    }

});
