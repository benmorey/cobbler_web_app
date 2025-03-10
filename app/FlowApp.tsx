'use client';

import React, { useState, useCallback } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';

// Define initial nodes and edges
const initialNodes = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Start' },
    position: { x: 250, y: 25 },
  },
  {
    id: '2',
    data: { label: 'Process' },
    position: { x: 250, y: 125 },
  },
  {
    id: '3',
    type: 'output',
    data: { label: 'End' },
    position: { x: 250, y: 225 },
  },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e2-3', source: '2', target: '3' },
];

// Define node types for the sidebar
const nodeTypes = [
  { type: 'input', label: 'Input Node' },
  { type: 'default', label: 'Process Node' },
  { type: 'output', label: 'Output Node' },
];

const FlowApp = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [nodeName, setNodeName] = useState('');
  
  // Handle connections between nodes - with proper typing
  const onConnect = useCallback(
    (params: Connection) => setEdges((eds: Edge[]) => addEdge(params, eds)),
    [setEdges]
  );
  
  // Handle adding new nodes from sidebar
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };
  
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      
      const reactFlowBounds = document.querySelector('.react-flow')?.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');
      
      // Check if the dropped element is valid
      if (typeof type === 'undefined' || !type || !reactFlowBounds) {
        return;
      }
      
      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };
      
      // Create a new node
      const newNode = {
        id: `${nodes.length + 1}`,
        type,
        position,
        data: { label: nodeName || `${type.charAt(0).toUpperCase() + type.slice(1)} Node` },
      };
      
      setNodes((nds) => nds.concat(newNode));
      setNodeName('');
    },
    [nodeName, nodes, setNodes]
  );
  
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);
  
  // Explicitly set background variant to fix TypeScript error
  const backgroundVariant = 'dots' as BackgroundVariant;
    
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md p-4 flex flex-col">
        <h2 className="text-xl font-bold mb-4">Flow Components</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Node Name:</label>
          <input
            type="text"
            value={nodeName}
            onChange={(e) => setNodeName(e.target.value)}
            placeholder="Enter node name"
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div className="space-y-2">
          <p className="font-medium">Drag to add:</p>
          {nodeTypes.map((nodeType) => (
            <div
              key={nodeType.type}
              className="p-2 border rounded bg-blue-50 cursor-move"
              onDragStart={(event) => onDragStart(event, nodeType.type)}
              draggable
            >
              {nodeType.label}
            </div>
          ))}
        </div>
        
        <div className="mt-8">
          <h3 className="font-medium mb-2">Instructions:</h3>
          <ul className="text-sm space-y-1">
            <li>• Drag nodes from above to add them</li>
            <li>• Connect nodes by dragging from handles</li>
            <li>• Use the panel controls to zoom and pan</li>
          </ul>
        </div>
      </div>
      
      {/* React Flow Canvas */}
      <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          fitView
        >
          <Controls />
          <MiniMap />
          <Background variant={backgroundVariant} gap={12} size={1} />
        </ReactFlow>
      </div>
    </div>
  );
};

export default FlowApp;