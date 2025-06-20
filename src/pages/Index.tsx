
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import FlowEditor from "@/components/FlowEditor";
import ChatbotTester from "@/components/ChatbotTester";
import { toast } from "@/components/ui/sonner";

const Index = () => {
  const [flows, setFlows] = useState<any[]>([]);
  const [currentFlow, setCurrentFlow] = useState<any>(null);
  const [flowData, setFlowData] = useState<any>({
    nodes: [],
    edges: [],
    intents: [],
    responses: []
  });

  const handleCreateFlow = () => {
    const newFlow = {
      id: `flow-${flows.length + 1}`,
      name: `Novo Fluxo ${flows.length + 1}`,
      data: {
        nodes: [],
        edges: [],
        intents: [],
        responses: []
      }
    };
    
    setFlows([...flows, newFlow]);
    setCurrentFlow(newFlow);
    setFlowData(newFlow.data);
    toast.success("Novo fluxo criado com sucesso!");
  };

  const handleSaveFlow = () => {
    if (currentFlow) {
      const updatedFlows = flows.map(flow => 
        flow.id === currentFlow.id ? { ...flow, data: flowData } : flow
      );
      setFlows(updatedFlows);
      setCurrentFlow({ ...currentFlow, data: flowData });
      toast.success("Fluxo salvo com sucesso!");
    }
  };

  const handleExportJson = () => {
    if (currentFlow) {
      const jsonString = JSON.stringify(flowData, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement("a");
      a.href = url;
      a.download = `${currentFlow.name}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success("JSON exportado com sucesso!");
    } else {
      toast.error("Nenhum fluxo selecionado para exportar");
    }
  };

  const handleImportJson = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonData = JSON.parse(e.target?.result as string);
          setFlowData(jsonData);
          
          if (currentFlow) {
            const updatedFlows = flows.map(flow => 
              flow.id === currentFlow.id ? { ...flow, data: jsonData } : flow
            );
            setFlows(updatedFlows);
            setCurrentFlow({ ...currentFlow, data: jsonData });
          }
          
          toast.success("JSON importado com sucesso!");
        } catch (error) {
          toast.error("Erro ao importar JSON");
          console.error(error);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <header className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Construtor de Chatbots</h1>
          <p className="text-muted-foreground">
            Crie e treine seu chatbot com processamento de linguagem natural
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Ajuda</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Como usar a ferramenta</DialogTitle>
                <DialogDescription>
                  Dicas rápidas para criar e testar seus fluxos
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2 text-sm">
                <p>Use “Criar Novo Fluxo” para iniciar um novo projeto.</p>
                <p>Monte o fluxo conectando intenções e respostas no editor.</p>
                <p>Você pode salvar, importar e exportar os fluxos em JSON.</p>
                <p>Na aba “Testar Chatbot”, envie mensagens e veja as respostas.</p>
              </div>
            </DialogContent>
          </Dialog>
          <Button asChild variant="outline">
            <Link to="/about">Sobre</Link>
          </Button>
        </div>
      </header>

      <div className="flex flex-wrap gap-4 mb-6">
        <Button onClick={handleCreateFlow}>Criar Novo Fluxo</Button>
        <Button 
          variant="outline" 
          onClick={handleSaveFlow}
          disabled={!currentFlow}
        >
          Salvar Fluxo
        </Button>
        <Button 
          variant="outline" 
          onClick={handleExportJson}
          disabled={!currentFlow}
        >
          Exportar JSON
        </Button>
        <div>
          <input
            type="file"
            id="import-json"
            className="hidden"
            accept=".json"
            onChange={handleImportJson}
          />
          <label htmlFor="import-json">
            <Button 
              variant="outline" 
              disabled={!currentFlow}
              onClick={() => document.getElementById("import-json")?.click()}
            >
              Importar JSON
            </Button>
          </label>
        </div>
      </div>

      {currentFlow ? (
        <Tabs defaultValue="editor">
          <TabsList className="mb-4">
            <TabsTrigger value="editor">Editor de Fluxo</TabsTrigger>
            <TabsTrigger value="tester">Testar Chatbot</TabsTrigger>
          </TabsList>
          
          <TabsContent value="editor">
            <div className="border rounded-lg p-4 bg-card">
              <h2 className="text-xl font-semibold mb-4">
                {currentFlow.name}
              </h2>
              <FlowEditor 
                flowData={flowData} 
                onFlowDataChange={setFlowData} 
              />
            </div>
          </TabsContent>
          
          <TabsContent value="tester">
            <div className="border rounded-lg p-4 bg-card">
              <h2 className="text-xl font-semibold mb-4">
                Teste seu Chatbot
              </h2>
              <ChatbotTester 
                flowData={flowData} 
              />
            </div>
          </TabsContent>
        </Tabs>
      ) : (
        <div className="border rounded-lg p-8 text-center">
          <p className="text-muted-foreground mb-4">
            Nenhum fluxo selecionado. Crie um novo fluxo para começar.
          </p>
          <Button onClick={handleCreateFlow}>Criar Novo Fluxo</Button>
        </div>
      )}
    </div>
  );
};

export default Index;
