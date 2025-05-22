
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send } from "lucide-react";
import { classifyText } from "@/utils/nlp";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface ChatbotTesterProps {
  flowData: {
    nodes: any[];
    edges: any[];
    intents: any[];
    responses: any[];
  };
}

const ChatbotTester = ({ flowData }: ChatbotTesterProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    // Adicionar mensagem do usuário
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      text: input.trim(),
      sender: "user",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsThinking(true);
    
    // Simular processamento
    setTimeout(async () => {
      try {
        // Tentar classificar a intenção
        let response = "Desculpe, não entendi o que você quis dizer.";
        
        if (flowData.intents.length > 0) {
          const result = await classifyText(userMessage.text, flowData.intents);
          
          // Encontrar o nó correspondente à intenção detectada
          const matchedNode = flowData.nodes.find(node => node.data.intentId === result.intent);
          
          if (matchedNode && matchedNode.data.responseId) {
            // Encontrar a resposta associada ao nó
            const matchedResponse = flowData.responses.find(response => 
              response.id === matchedNode.data.responseId
            );
            
            if (matchedResponse) {
              response = matchedResponse.content;
            }
          }
        }
        
        // Adicionar resposta do bot
        const botMessage: Message = {
          id: `msg-${Date.now()}`,
          text: response,
          sender: "bot",
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, botMessage]);
      } catch (error) {
        console.error("Erro ao processar mensagem:", error);
        
        // Mensagem de erro
        const errorMessage: Message = {
          id: `msg-${Date.now()}`,
          text: "Desculpe, ocorreu um erro ao processar sua mensagem.",
          sender: "bot",
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsThinking(false);
      }
    }, 1000);
  };

  return (
    <div className="flex flex-col h-[500px]">
      <Card className="flex-grow flex flex-col">
        <CardHeader>
          <CardTitle>Chat com o Chatbot</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow overflow-y-auto flex flex-col p-4">
          {messages.length === 0 ? (
            <div className="flex-grow flex items-center justify-center text-muted-foreground">
              Envie uma mensagem para começar a conversa
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-2 rounded-lg ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p>{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              {isThinking && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] px-4 py-2 rounded-lg bg-muted">
                    <p className="animate-pulse">Digitando...</p>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-4 flex">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite sua mensagem..."
          className="flex-grow"
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          disabled={isThinking}
        />
        <Button 
          className="ml-2" 
          onClick={handleSendMessage} 
          disabled={isThinking || !input.trim()}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatbotTester;
