// Configuración inicial de la red
const nodes = new vis.DataSet([
    { id: 0, label: '0', x: -100, y: 0 },
    { id: 1, label: '1', x: 0, y: 0, fixed: true },
    { id: 2, label: '2', x: 100, y: 100 },
    { id: 3, label: '3', x: 0, y: -100 },
    { id: 4, label: '4', x: 200, y: 0 }
]);

const edges = new vis.DataSet([
    // Conexiones desde 0
    { from: 0, to: 1, value: 0.5 },
    { from: 0, to: 2, value: 0.3 },
    { from: 0, to: 3, value: 0.4 },
    
    // Conexiones desde 1
    { from: 1, to: 2, value: 0.6 },
    { from: 1, to: 3, value: 0.5 },
    { from: 1, to: 4, value: 0.7 },
    
    // Conexiones desde 2
    { from: 2, to: 4, value: 0.4 },
    
    // Conexiones desde 3
    { from: 3, to: 4, value: 0.5 },
]);

// Configuración de la red
const options = {
    nodes: {
        shape: 'circle',
        size: 30,
        font: {
            size: 20,
            color: '#ffffff'
        },
        borderWidth: 2,
        borderWidthSelected: 4,
        color: {
            background: '#4a4a4a',
            border: '#6a6a6a',
            highlight: {
                background: '#6a6a6a',
                border: '#8a8a8a'
            }
        }
    },
    edges: {
        width: 2,
        color: {
            color: '#848484',
            highlight: '#a4a4a4'
        },
        scaling: {
            min: 1,
            max: 5,
            label: {
                enabled: true
            }
        },
        smooth: {
            type: 'continuous'
        }
    },
    physics: {
        enabled: true,
        barnesHut: {
            gravitationalConstant: -2000,
            centralGravity: 0.3,
            springLength: 200,
            springConstant: 0.04
        },
        stabilization: {
            iterations: 2500
        }
    },
    interaction: {
        hover: true,
        tooltipDelay: 200
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
const exportBtn = document.getElementById('exportBtn');
const helpBtn = document.getElementById('helpBtn');

// Función para encontrar un nodo por su label
function findNodeByLabel(label) {
    const allNodes = nodes.get();
    return allNodes.find(node => node.label === label);
}

// Función para crear o conectar con un nodo
function createOrConnectNode(fromNodeId, newLabel, weight) {
    // Primero buscamos si existe un nodo con ese label
    const existingNode = findNodeByLabel(newLabel);
    
    if (existingNode) {
        // Si existe, creamos solo la conexión
        edges.add({ 
            from: fromNodeId, 
            to: existingNode.id, 
            value: weight 
        });
        return existingNode.id;
    } else {
        // Si no existe, creamos el nuevo nodo y la conexión
        const newNodeId = nodes.length;
        nodes.add({ id: newNodeId, label: newLabel });
        edges.add({ 
            from: fromNodeId, 
            to: newNodeId, 
            value: weight 
        });
        return newNodeId;
    }
}

// Eventos de la red
network.on('selectNode', function(params) {
    selectedNode = params.nodes[0];
    const node = nodes.get(selectedNode);
    
    selectedNodeSpan.textContent = node.label;
    nodeNameInput.value = node.label;
    contextPanel.classList.remove('hidden');
});

network.on('deselectNode', function() {
    selectedNode = null;
    contextPanel.classList.add('hidden');
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

createConnectionBtn.addEventListener('click', function() {
    if (selectedNode !== null && newNodeNameInput.value.trim() !== '') {
        createOrConnectNode(
            selectedNode, 
            newNodeNameInput.value.trim(), 
            parseFloat(edgeWeightInput.value)
        );
        newNodeNameInput.value = '';
    }
});

deleteNodeBtn.addEventListener('click', function() {
    if (selectedNode !== null) {
        nodes.remove(selectedNode);
        contextPanel.classList.add('hidden');
    }
});

// Exportar la red como imagen
exportBtn.addEventListener('click', function() {
    const canvas = container.querySelector('canvas');
    const link = document.createElement('a');
    link.download = 'red-neuronal.png';
    link.href = canvas.toDataURL();
    link.click();
});

// Mostrar ayuda
helpBtn.addEventListener('click', function() {
    alert('Instrucciones básicas:\n\n' +
          '1. Haz clic en un nodo para editarlo\n' +
          '2. Usa el slider para ajustar el peso de las conexiones\n' +
          '3. Escribe un nombre y haz clic en "Crear Conexión" para añadir un nuevo nodo\n' +
          '4. Usa el botón "Exportar" para guardar la red como imagen\n' +
          '5. Arrastra los nodos para reorganizar la red');
});
