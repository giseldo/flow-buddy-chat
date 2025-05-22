
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import IntentTrainer from "./IntentTrainer";
import NodeEditor from "./NodeEditor";
import ResponseEditor from "./ResponseEditor";
import FlowVisualizer from "./FlowVisualizer";

interface FlowEditorProps {
  flowData: {
    nodes: any[];
    edges: any[];
    intents: any[];
    responses: any[];
  };
  onFlowDataChange: (data: any) => void;
}

const FlowEditor = ({ flowData, onFlowDataChange }: FlowEditorProps) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const handleNodesChange = (nodes: any[]) => {
    onFlowDataChange({
      ...flowData,
      nodes
    });
  };

  const handleEdgesChange = (edges: any[]) => {
    onFlowDataChange({
      ...flowData,
      edges
    });
  };

  const handleIntentsChange = (intents: any[]) => {
    onFlowDataChange({
      ...flowData,
      intents
    });
  };

  const handleResponsesChange = (responses: any[]) => {
    onFlowDataChange({
      ...flowData,
      responses
    });
  };

  const handleNodeSelect = (nodeId: string) => {
    setSelectedNodeId(nodeId);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Visualizador de Fluxo</CardTitle>
          </CardHeader>
          <CardContent className="h-[500px] bg-muted/20">
            <FlowVisualizer 
              nodes={flowData.nodes}
              edges={flowData.edges}
              onNodesChange={handleNodesChange}
              onEdgesChange={handleEdgesChange}
              onNodeSelect={handleNodeSelect}
            />
          </CardContent>
        </Card>
      </div>
      
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Configurações</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="nodes">
              <TabsList className="mb-4 w-full">
                <TabsTrigger value="nodes" className="flex-1">Nós</TabsTrigger>
                <TabsTrigger value="intents" className="flex-1">Intenções</TabsTrigger>
                <TabsTrigger value="responses" className="flex-1">Respostas</TabsTrigger>
              </TabsList>
              
              <TabsContent value="nodes">
                <NodeEditor 
                  nodes={flowData.nodes}
                  onNodesChange={handleNodesChange}
                  selectedNodeId={selectedNodeId}
                  intents={flowData.intents}
                  responses={flowData.responses}
                />
              </TabsContent>
              
              <TabsContent value="intents">
                <IntentTrainer 
                  intents={flowData.intents} 
                  onIntentsChange={handleIntentsChange} 
                />
              </TabsContent>
              
              <TabsContent value="responses">
                <ResponseEditor 
                  responses={flowData.responses} 
                  onResponsesChange={handleResponsesChange} 
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FlowEditor;
