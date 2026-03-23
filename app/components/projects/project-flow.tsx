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
import {
  Database,
  Code,
  Server,
  Cloud,
  Smartphone,
  Globe,
  Zap,
} from "lucide-react";
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
  if (
    lowerLabel.includes("frontend") ||
    lowerLabel.includes("web app") ||
    lowerLabel.includes("web")
  ) {
    return Globe;
  }
  if (
    lowerLabel.includes("backend") ||
    lowerLabel.includes("api") ||
    lowerLabel.includes("gateway")
  ) {
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

const hexToRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const createNodeTypes = (accentColor: string) => ({
  custom: ({
    data,
    selected,
  }: {
    data: { label: string; tech?: string };
    selected?: boolean;
  }) => {
    const IconComponent = getIcon(data.label);
    const iconBg = accentColor;
    const iconColor = "#ffffff";

    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 8 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        whileHover={{ scale: 1.02, y: -2 }}
        className="relative min-w-[200px] group"
      >
        <div
          className="px-6 py-5 rounded-2xl relative overflow-hidden transition-all duration-300"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.98), rgba(255,255,255,0.9))",
            boxShadow: `0 4px 24px -4px rgba(0,0,0,0.08), 0 0 0 1px rgba(255,255,255,0.9) inset`,
            border: `1px solid ${hexToRgba(accentColor, 0.2)}`,
          }}
        >
          <Handle
            type="target"
            position={Position.Left}
            className="w-3! h-3! bg-white! border-2! border-neutral-300!"
            style={{
              borderRadius: "50%",
              left: -6,
              borderColor: accentColor,
            }}
          />

          <div className="flex flex-col gap-3 relative z-10">
            <div className="flex items-start gap-4">
              <motion.div
                className="p-3 rounded-xl shrink-0 shadow-lg"
                style={{
                  backgroundColor: iconBg,
                  color: iconColor,
                  boxShadow: `0 8px 24px ${hexToRgba(accentColor, 0.35)}`,
                }}
                whileHover={{ rotate: [0, -8, 8, 0], scale: 1.1 }}
                transition={{ duration: 0.4 }}
              >
                <IconComponent className="w-6 h-6" />
              </motion.div>

              <div className="flex-1 min-w-0 pt-0.5">
                <div className="text-base font-bold text-neutral-900 dark:text-neutral-100 mb-1 leading-tight">
                  {data.label}
                </div>
                {data.tech && (
                  <div
                    className="text-xs font-semibold uppercase tracking-wider"
                    style={{ color: hexToRgba(accentColor, 0.9) }}
                  >
                    {data.tech}
                  </div>
                )}
              </div>
            </div>
          </div>

          <Handle
            type="source"
            position={Position.Right}
            className="w-3! h-3! bg-white! border-2! border-neutral-300!"
            style={{
              borderRadius: "50%",
              right: -6,
              borderColor: accentColor,
            }}
          />
        </div>
      </motion.div>
    );
  },
});

function FlowContent({ workflow, color = "#6366f1" }: ProjectFlowProps) {
  const { fitView } = useReactFlow();
  const nodeTypes = useMemo(
    () => createNodeTypes(color),
    [color]
  );

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
          strokeWidth: 2.5,
          strokeOpacity: 0.9,
        },
        markerEnd: {
          type: "arrowclosed" as const,
          color: color,
          width: 18,
          height: 18,
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
      fitView({ padding: 0.25, duration: 450 });
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
          strokeWidth: 2.5,
          strokeOpacity: 0.9,
        },
        type: "smoothstep" as const,
        animated: true,
        markerEnd: {
          type: "arrowclosed" as const,
          color: color,
          width: 18,
          height: 18,
        },
      }}
      nodesDraggable={false}
      nodesConnectable={false}
      minZoom={0.3}
      maxZoom={1.5}
      proOptions={{ hideAttribution: true }}
    >
      <Background
        color={hexToRgba(color, 0.15)}
        gap={24}
        size={1}
        style={{ backgroundColor: "transparent" }}
      />
      <Controls
        showInteractive={false}
        className="[&>button]:bg-white/90 [&>button]:dark:bg-neutral-900/90 [&>button]:rounded-xl [&>button]:border [&>button]:border-neutral-200/80"
      />
    </ReactFlow>
  );
}

export default function ProjectFlow({
  workflow,
  color = "#6366f1",
}: ProjectFlowProps) {
  return (
    <div
      className="w-full h-full project-flow-container"
      style={{ "--project-accent": color } as React.CSSProperties}
    >
      <ReactFlowProvider>
        <FlowContent workflow={workflow} color={color} />
      </ReactFlowProvider>
    </div>
  );
}
