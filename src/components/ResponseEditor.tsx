
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { X } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface ResponseEditorProps {
  responses: any[];
  onResponsesChange: (responses: any[]) => void;
}

const ResponseEditor = ({ responses, onResponsesChange }: ResponseEditorProps) => {
  const [responseName, setResponseName] = useState("");
  const [responseContent, setResponseContent] = useState("");
  const [selectedResponseId, setSelectedResponseId] = useState<string | null>(null);

  const handleAddResponse = () => {
    if (!responseName.trim()) {
      toast.error("Nome da resposta é obrigatório");
      return;
    }

    if (!responseContent.trim()) {
      toast.error("Conteúdo da resposta é obrigatório");
      return;
    }

    const newResponse = {
      id: selectedResponseId || `response-${Date.now()}`,
      name: responseName.trim(),
      content: responseContent.trim()
    };

    let updatedResponses;
    if (selectedResponseId) {
      updatedResponses = responses.map(response => 
        response.id === selectedResponseId ? newResponse : response
      );
    } else {
      updatedResponses = [...responses, newResponse];
    }

    onResponsesChange(updatedResponses);
    
    // Limpar formulário
    setResponseName("");
    setResponseContent("");
    setSelectedResponseId(null);
    
    toast.success(selectedResponseId ? "Resposta atualizada" : "Resposta adicionada");
  };

  const handleSelectResponse = (response: any) => {
    setSelectedResponseId(response.id);
    setResponseName(response.name);
    setResponseContent(response.content);
  };

  const handleDeleteResponse = (responseId: string) => {
    const updatedResponses = responses.filter(response => response.id !== responseId);
    onResponsesChange(updatedResponses);
    
    if (selectedResponseId === responseId) {
      setResponseName("");
      setResponseContent("");
      setSelectedResponseId(null);
    }
    
    toast.success("Resposta removida");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="response-name">Nome da Resposta</Label>
          <Input
            id="response-name"
            value={responseName}
            onChange={(e) => setResponseName(e.target.value)}
            placeholder="Ex: boas_vindas, produto_info"
          />
        </div>
        
        <div>
          <Label htmlFor="response-content">Conteúdo da Resposta</Label>
          <Textarea
            id="response-content"
            value={responseContent}
            onChange={(e) => setResponseContent(e.target.value)}
            placeholder="Digite a mensagem que o chatbot deve responder"
            className="min-h-[100px]"
          />
        </div>
        
        <div className="flex gap-2 pt-2">
          <Button onClick={handleAddResponse} className="flex-1">
            {selectedResponseId ? "Atualizar" : "Adicionar"} Resposta
          </Button>
          {selectedResponseId && (
            <Button 
              variant="outline" 
              onClick={() => {
                setResponseName("");
                setResponseContent("");
                setSelectedResponseId(null);
              }}
            >
              Cancelar
            </Button>
          )}
        </div>
      </div>

      {responses.length > 0 && (
        <div>
          <h3 className="text-sm font-medium mb-2">Respostas Cadastradas</h3>
          <div className="space-y-2">
            {responses.map(response => (
              <Card key={response.id} className="overflow-hidden">
                <CardContent className="p-3 flex justify-between items-center">
                  <div className="flex-grow" onClick={() => handleSelectResponse(response)}>
                    <h4 className="font-medium cursor-pointer hover:text-primary">
                      {response.name}
                    </h4>
                    <p className="text-xs text-muted-foreground truncate">
                      {response.content.length > 50 
                        ? response.content.substring(0, 50) + "..." 
                        : response.content}
                    </p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => handleDeleteResponse(response.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResponseEditor;
