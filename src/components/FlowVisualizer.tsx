
import React, { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface FlowVisualizerProps {
  nodes: any[];
  edges: any[];
  onNodesChange: (nodes: any[]) => void;
  onEdgesChange: (edges: any[]) => void;
  onNodeSelect: (nodeId: string) => void;
}

const FlowVisualizer = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onNodeSelect
}: FlowVisualizerProps) => {
  // Em uma implementação completa, aqui teríamos uma biblioteca como react-flow
  // Para simplificar, usaremos uma representação visual simples
  
  const addNode = useCallback(() => {
    const newNode = {
      id: `node-${Date.now()}`,
      type: 'default',
      position: { x: 100, y: 100 },
      data: { label: `Novo nó ${nodes.length + 1}`, intentId: null, responseId: null }
    };
    
    onNodesChange([...nodes, newNode]);
    toast.success("Novo nó adicionado");
  }, [nodes, onNodesChange]);

  const connectNodes = useCallback((sourceId: string, targetId: string) => {
    const newEdge = {
      id: `edge-${sourceId}-${targetId}`,
      source: sourceId,
      target: targetId,
      label: 'Conecta para',
      type: 'default'
    };
    
    onEdgesChange([...edges, newEdge]);
  }, [edges, onEdgesChange]);

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4 flex justify-end">
        <Button onClick={addNode}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Adicionar Nó
        </Button>
      </div>
      
      <div className="flex-grow bg-white rounded-lg p-4 border overflow-auto">
        {nodes.length === 0 ? (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            Adicione nós para criar seu fluxo
          </div>
        ) : (
          <div className="flex flex-wrap gap-6">
            {nodes.map((node) => (
              <Card 
                key={node.id} 
                className="p-4 w-48 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => onNodeSelect(node.id)}
              >
                <div className="font-medium">{node.data.label}</div>
                <div className="text-xs text-muted-foreground mt-2">
                  ID: {node.id}
                </div>
                {node.data.intentId && (
                  <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded mt-2">
                    Intent: {node.data.intentId}
                  </div>
                )}
                {node.data.responseId && (
                  <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded mt-2">
                    Response: {node.data.responseId}
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
      
      {nodes.length > 0 && (
        <div className="mt-4 border-t pt-4">
          <h4 className="text-sm font-medium mb-2">Conexões</h4>
          {edges.length > 0 ? (
            <div className="text-sm">
              {edges.map(edge => (
                <div key={edge.id} className="mb-1">
                  {edge.source} → {edge.target}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              Nenhuma conexão criada
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FlowVisualizer;
