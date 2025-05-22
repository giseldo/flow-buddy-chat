
// Utilitário para processamento de linguagem natural
// Em uma implementação completa, usaríamos bibliotecas como TensorFlow.js ou HuggingFace

// Função para calcular similaridade entre strings (simplificada)
function calculateSimilarity(text1: string, text2: string): number {
  const a = text1.toLowerCase();
  const b = text2.toLowerCase();
  
  // Implementação básica baseada em correspondência de palavras
  const wordsA = a.split(/\s+/);
  const wordsB = b.split(/\s+/);
  
  let matches = 0;
  for (const wordA of wordsA) {
    if (wordA.length < 3) continue; // Ignorar palavras curtas
    if (wordsB.some(wordB => wordB.includes(wordA) || wordA.includes(wordB))) {
      matches++;
    }
  }
  
  return matches / Math.max(wordsA.length, wordsB.length, 1);
}

// Função para classificar texto
export async function classifyText(text: string, intents: any[]) {
  // Simular um pequeno delay para parecer que está processando
  await new Promise(resolve => setTimeout(resolve, 300));
  
  if (intents.length === 0) {
    throw new Error("Nenhuma intenção cadastrada");
  }
  
  let bestMatch = {
    intent: "",
    confidence: 0
  };
  
  for (const intent of intents) {
    const examples = intent.examples || [];
    let totalSimilarity = 0;
    
    for (const example of examples) {
      const similarity = calculateSimilarity(text, example);
      totalSimilarity += similarity;
    }
    
    // Média de similaridade com todos os exemplos
    const avgSimilarity = examples.length > 0 ? totalSimilarity / examples.length : 0;
    
    if (avgSimilarity > bestMatch.confidence) {
      bestMatch = {
        intent: intent.id,
        confidence: avgSimilarity
      };
    }
  }
  
  // Se a confiança for muito baixa, considerar como desconhecido
  if (bestMatch.confidence < 0.3) {
    return {
      intent: "unknown",
      confidence: 0
    };
  }
  
  return bestMatch;
}
