
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";

interface NodeEditorProps {
  nodes: any[];
  onNodesChange: (nodes: any[]) => void;
  selectedNodeId: string | null;
  intents: any[];
  responses: any[];
}

const NodeEditor = ({
  nodes,
  onNodesChange,
  selectedNodeId,
  intents,
  responses
}: NodeEditorProps) => {
  const [nodeLabel, setNodeLabel] = useState("");
  const [selectedIntent, setSelectedIntent] = useState("");
  const [selectedResponse, setSelectedResponse] = useState("");
  
  const selectedNode = selectedNodeId 
    ? nodes.find(node => node.id === selectedNodeId) 
    : null;

  useEffect(() => {
    if (selectedNode) {
      setNodeLabel(selectedNode.data.label || "");
      setSelectedIntent(selectedNode.data.intentId || "none");
      setSelectedResponse(selectedNode.data.responseId || "none");
    } else {
      setNodeLabel("");
      setSelectedIntent("none");
      setSelectedResponse("none");
    }
  }, [selectedNode]);

  const handleSaveNode = () => {
    if (!selectedNodeId) {
      toast.error("Nenhum nó selecionado");
      return;
    }

    const updatedNodes = nodes.map(node => {
      if (node.id === selectedNodeId) {
        return {
          ...node,
          data: {
            ...node.data,
            label: nodeLabel,
            intentId: selectedIntent === "none" ? null : selectedIntent,
            responseId: selectedResponse === "none" ? null : selectedResponse
          }
        };
      }
      return node;
    });

    onNodesChange(updatedNodes);
    toast.success("Nó atualizado com sucesso");
  };

  const handleDeleteNode = () => {
    if (!selectedNodeId) {
      toast.error("Nenhum nó selecionado");
      return;
    }

    const updatedNodes = nodes.filter(node => node.id !== selectedNodeId);
    onNodesChange(updatedNodes);
    toast.success("Nó removido com sucesso");
  };

  if (!selectedNode) {
    return (
      <div className="text-center p-4">
        <p className="text-muted-foreground">Selecione um nó para editar</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="node-name">Nome do Nó</Label>
        <Input
          id="node-name"
          value={nodeLabel}
          onChange={(e) => setNodeLabel(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="intent-select">Intenção Associada</Label>
        <Select
          value={selectedIntent}
          onValueChange={setSelectedIntent}
        >
          <SelectTrigger id="intent-select">
            <SelectValue placeholder="Selecione uma intenção" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Nenhuma</SelectItem>
            {intents.map(intent => (
              <SelectItem key={intent.id} value={intent.id}>
                {intent.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="response-select">Resposta Associada</Label>
        <Select
          value={selectedResponse}
          onValueChange={setSelectedResponse}
        >
          <SelectTrigger id="response-select">
            <SelectValue placeholder="Selecione uma resposta" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Nenhuma</SelectItem>
            {responses.map(response => (
              <SelectItem key={response.id} value={response.id}>
                {response.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2 pt-2">
        <Button onClick={handleSaveNode} className="flex-1">
          Salvar
        </Button>
        <Button onClick={handleDeleteNode} variant="destructive">
          Excluir
        </Button>
      </div>
    </div>
  );
};

export default NodeEditor;
