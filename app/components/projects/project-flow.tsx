"use client";

import React, { useCallback, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  useReactFlow,
  Handle,
  Position,
} from "@xyflow/react";
import { Database, Code, Server, Cloud, Smartphone, Globe, Zap } from "lucide-react";
import "@xyflow/react/dist/style.css";

interface ProjectFlowProps {
  workflow: {
    nodes: Array<{
      id: string;
      type: string;
      position: { x: number; y: number };
      data: { label: string; tech?: string };
    }>;
    edges: Array<{
      id: string;
      source: string;
      target: string;
    }>;
  };
  color?: string;
}

const getIcon = (label: string) => {
  const lowerLabel = label.toLowerCase();
  if (lowerLabel.includes("frontend") || lowerLabel.includes("web app") || lowerLabel.includes("mobile")) {
    return Globe;
  }
  if (lowerLabel.includes("backend") || lowerLabel.includes("api") || lowerLabel.includes("gateway")) {
    return Server;
  }
  if (lowerLabel.includes("database") || lowerLabel.includes("db")) {
    return Database;
  }
  if (lowerLabel.includes("cache") || lowerLabel.includes("redis")) {
    return Zap;
  }
  if (lowerLabel.includes("storage") || lowerLabel.includes("s3")) {
    return Cloud;
  }
  if (lowerLabel.includes("mobile") || lowerLabel.includes("react native")) {
    return Smartphone;
  }
  return Code;
};

const nodeTypes = {
  custom: ({ data, selected }: { data: { label: string; tech?: string }; selected?: boolean }) => {
    const IconComponent = getIcon(data.label);
    const isFrontend = data.label.toLowerCase().includes("frontend") || data.label.toLowerCase().includes("web");
    const isBackend = data.label.toLowerCase().includes("backend") || data.label.toLowerCase().includes("api");
    const isDatabase = data.label.toLowerCase().includes("database") || data.label.toLowerCase().includes("db");
    let bgGradient = "from-blue-500/10 via-blue-400/5 to-blue-600/10 dark:from-blue-500/20 dark:via-blue-400/10 dark:to-blue-600/20";
    let borderGradient = "from-blue-400/30 to-blue-600/30 dark:from-blue-400/50 dark:to-blue-600/50";
    let iconBg = "bg-gradient-to-br from-blue-500 to-blue-600";
    let iconColor = "text-white";
    let shadowColor = "shadow-blue-500/20";
    if (isBackend) {
      bgGradient = "from-purple-500/10 via-purple-400/5 to-purple-600/10 dark:from-purple-500/20 dark:via-purple-400/10 dark:to-purple-600/20";
      borderGradient = "from-purple-400/30 to-purple-600/30 dark:from-purple-400/50 dark:to-purple-600/50";
      iconBg = "bg-gradient-to-br from-purple-500 to-purple-600";
      shadowColor = "shadow-purple-500/20";
    } else if (isDatabase) {
      bgGradient = "from-emerald-500/10 via-emerald-400/5 to-emerald-600/10 dark:from-emerald-500/20 dark:via-emerald-400/10 dark:to-emerald-600/20";
      borderGradient = "from-emerald-400/30 to-emerald-600/30 dark:from-emerald-400/50 dark:to-emerald-600/50";
      iconBg = "bg-gradient-to-br from-emerald-500 to-emerald-600";
      shadowColor = "shadow-emerald-500/20";
    }
    
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        whileHover={{ scale: 1.03, y: -4 }}
        className={`px-6 py-5 rounded-3xl bg-gradient-to-br ${bgGradient} backdrop-blur-xl border border-white/20 dark:border-neutral-700/50 ${shadowColor} shadow-2xl min-w-[200px] relative group transition-all duration-300 overflow-hidden ${
          selected ? "ring-2 ring-offset-2 ring-blue-500" : ""
        }`}
        style={{
          background: `linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85))`,
          boxShadow: `0 20px 60px -12px rgba(0,0,0,0.12), 0 0 0 1px rgba(255,255,255,0.8) inset, 0 1px 2px rgba(0,0,0,0.05)`,
        }}
      >
        <Handle
          type="target"
          position={Position.Left}
          className="w-3.5 h-3.5 bg-white! dark:!bg-neutral-800 !border-2 !border-blue-500 dark:!border-blue-400 shadow-lg"
          style={{ borderRadius: '50%' }}
        />
        
        <div className="flex flex-col gap-3 relative z-10">
          <div className="flex items-start gap-4">
            <motion.div
              className={`p-3.5 rounded-2xl ${iconBg} ${iconColor} shadow-xl flex-shrink-0`}
              whileHover={{ rotate: [0, -10, 10, 0], scale: 1.15 }}
              transition={{ duration: 0.5 }}
            >
              <IconComponent className="w-7 h-7" />
            </motion.div>
            
            <div className="flex-1 min-w-0 pt-0.5">
              <div className="text-lg font-bold text-neutral-900 dark:text-white mb-1.5 leading-tight tracking-tight">
                {data.label}
              </div>
              {data.tech && (
                <div className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  {data.tech}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <Handle
          type="source"
          position={Position.Right}
          className="w-3.5 h-3.5 !bg-white dark:!bg-neutral-800 !border-2 !border-blue-500 dark:!border-blue-400 shadow-lg"
          style={{ borderRadius: '50%' }}
        />
        
        <motion.div
          className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 pointer-events-none"
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatDelay: 2,
            ease: "easeInOut"
          }}
        />
        
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-400/0 via-blue-400/20 to-blue-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </motion.div>
    );
  },
};

function FlowContent({ workflow, color = "#6366f1" }: ProjectFlowProps) {
  const { fitView } = useReactFlow();
  
  const initialNodes = useMemo(
    () =>
      workflow.nodes.map((node) => ({
        id: node.id,
        position: node.position,
        type: "custom",
        data: node.data,
      })),
    [workflow.nodes]
  );

  const initialEdges = useMemo(
    () =>
      workflow.edges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: "smoothstep" as const,
        animated: true,
        style: { 
          stroke: color, 
          strokeWidth: 3,
          strokeOpacity: 1,
        },
        markerEnd: {
          type: "arrowclosed" as const,
          color: color,
          width: 20,
          height: 20,
        },
      })),
    [workflow.edges, color]
  );
  
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges as any);

  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  useEffect(() => {   
    const timer = setTimeout(() => {
      fitView({ padding: 0.2, duration: 400 });
    }, 300);
    return () => clearTimeout(timer);
  }, [fitView, nodes.length, edges.length]);

  const onConnect = useCallback(
    (params: Connection | Edge) => {
      setEdges((eds) => addEdge(params, eds) as any);
    },
    [setEdges]
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      fitView
      className="bg-transparent"
      defaultEdgeOptions={{
        style: { 
          stroke: color, 
          strokeWidth: 3,
          strokeOpacity: 1,
        },
        type: "smoothstep" as const,
        animated: true,
        markerEnd: {
          type: "arrowclosed" as const,
          color: color,
          width: 20,
          height: 20,
        },
      }}
      nodesDraggable={false}
      nodesConnectable={false}
      minZoom={0.3}
      maxZoom={1.5}
      proOptions={{ hideAttribution: true }}
    >
      <Background color="#f3f4f6" gap={20} size={1} />
      <Controls
        showInteractive={false}
        className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-lg"
      />
    </ReactFlow>
  );
}

export default function ProjectFlow({ workflow, color = "#6366f1" }: ProjectFlowProps) {
  return (
    <div className="w-full h-full">
      <ReactFlowProvider>
        <FlowContent workflow={workflow} color={color} />
      </ReactFlowProvider>
    </div>
  );
}
