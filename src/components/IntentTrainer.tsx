
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle, X } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { classifyText } from "@/utils/nlp";

interface IntentTrainerProps {
  intents: any[];
  onIntentsChange: (intents: any[]) => void;
}

const IntentTrainer = ({ intents, onIntentsChange }: IntentTrainerProps) => {
  const [intentName, setIntentName] = useState("");
  const [intentDescription, setIntentDescription] = useState("");
  const [examples, setExamples] = useState<string[]>([]);
  const [exampleInput, setExampleInput] = useState("");
  const [selectedIntentId, setSelectedIntentId] = useState<string | null>(null);

  const handleAddExample = () => {
    if (exampleInput.trim()) {
      setExamples([...examples, exampleInput.trim()]);
      setExampleInput("");
    }
  };

  const handleRemoveExample = (index: number) => {
    const newExamples = [...examples];
    newExamples.splice(index, 1);
    setExamples(newExamples);
  };

  const handleAddIntent = () => {
    if (!intentName.trim()) {
      toast.error("Nome da intenção é obrigatório");
      return;
    }

    if (examples.length < 3) {
      toast.error("Adicione pelo menos 3 exemplos");
      return;
    }

    const newIntent = {
      id: selectedIntentId || `intent-${Date.now()}`,
      name: intentName.trim(),
      description: intentDescription.trim(),
      examples: [...examples]
    };

    let updatedIntents;
    if (selectedIntentId) {
      updatedIntents = intents.map(intent => 
        intent.id === selectedIntentId ? newIntent : intent
      );
    } else {
      updatedIntents = [...intents, newIntent];
    }

    onIntentsChange(updatedIntents);
    
    // Limpar formulário
    setIntentName("");
    setIntentDescription("");
    setExamples([]);
    setSelectedIntentId(null);
    
    toast.success(selectedIntentId ? "Intenção atualizada" : "Intenção adicionada");
  };

  const handleSelectIntent = (intent: any) => {
    setSelectedIntentId(intent.id);
    setIntentName(intent.name);
    setIntentDescription(intent.description);
    setExamples([...intent.examples]);
  };

  const handleDeleteIntent = (intentId: string) => {
    const updatedIntents = intents.filter(intent => intent.id !== intentId);
    onIntentsChange(updatedIntents);
    
    if (selectedIntentId === intentId) {
      setIntentName("");
      setIntentDescription("");
      setExamples([]);
      setSelectedIntentId(null);
    }
    
    toast.success("Intenção removida");
  };

  const handleTestNLP = async () => {
    if (exampleInput.trim() && intents.length > 0) {
      try {
        const result = await classifyText(exampleInput.trim(), intents);
        toast.info(`Intenção detectada: ${result.intent}`, {
          description: `Confiança: ${Math.round(result.confidence * 100)}%`
        });
      } catch (error) {
        toast.error("Erro ao classificar texto");
        console.error(error);
      }
    } else {
      toast.error("Digite um texto para testar");
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="intent-name">Nome da Intenção</Label>
          <Input
            id="intent-name"
            value={intentName}
            onChange={(e) => setIntentName(e.target.value)}
            placeholder="Ex: saudação, pergunta_produto"
          />
        </div>
        
        <div>
          <Label htmlFor="intent-description">Descrição (opcional)</Label>
          <Textarea
            id="intent-description"
            value={intentDescription}
            onChange={(e) => setIntentDescription(e.target.value)}
            placeholder="Descreva o propósito desta intenção"
          />
        </div>
        
        <div>
          <Label>Exemplos de frases</Label>
          <div className="flex gap-2 mb-2">
            <Input
              value={exampleInput}
              onChange={(e) => setExampleInput(e.target.value)}
              placeholder="Digite um exemplo"
              onKeyDown={(e) => e.key === "Enter" && handleAddExample()}
            />
            <Button type="button" onClick={handleAddExample} size="icon">
              <PlusCircle className="h-4 w-4" />
            </Button>
          </div>
          
          {examples.length > 0 ? (
            <div className="space-y-2">
              {examples.map((example, index) => (
                <div key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                  <span className="text-sm">{example}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemoveExample(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Adicione exemplos para treinar a detecção de intenção
            </p>
          )}
        </div>
        
        <div className="flex gap-2 pt-2">
          <Button onClick={handleAddIntent} className="flex-1">
            {selectedIntentId ? "Atualizar" : "Adicionar"} Intenção
          </Button>
          {selectedIntentId && (
            <Button 
              variant="outline" 
              onClick={() => {
                setIntentName("");
                setIntentDescription("");
                setExamples([]);
                setSelectedIntentId(null);
              }}
            >
              Cancelar
            </Button>
          )}
        </div>
        
        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline" 
            onClick={handleTestNLP} 
            className="flex-1"
            disabled={intents.length === 0}
          >
            Testar NLP
          </Button>
        </div>
      </div>

      {intents.length > 0 && (
        <div>
          <h3 className="text-sm font-medium mb-2">Intenções Cadastradas</h3>
          <div className="space-y-2">
            {intents.map(intent => (
              <Card key={intent.id} className="overflow-hidden">
                <CardContent className="p-3 flex justify-between items-center">
                  <div className="flex-grow" onClick={() => handleSelectIntent(intent)}>
                    <h4 className="font-medium cursor-pointer hover:text-primary">{intent.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {intent.examples.length} exemplo(s)
                    </p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => handleDeleteIntent(intent.id)}
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

export default IntentTrainer;
