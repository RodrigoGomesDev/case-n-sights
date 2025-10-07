# Case N-Sights - Documentação

Sistema de geração de relatórios inteligentes usando multi-agentes de IA.

## Tecnologias

Backend:
- Node.js com TypeScript
- Express
- LangChain (orquestração de agentes)
- Groq (LLM gratuito - Llama 3.3 70B)
- Tavily Search API (pesquisa web)
- PDFKit (geração de PDF)

Frontend:
- Next.js 15
- React 19
- TypeScript
- TailwindCSS v4
- Biome (linter/formatter)

## Estrutura do Projeto

```
case-n-sights/
├── apps/
│   ├── backend/        # API Node.js/Express
│   │   └── src/
│   │       ├── agents/           # Agentes de IA (Research, Analyst, Writer)
│   │       ├── config/           # Configuração LLM
│   │       ├── routes/           # Rotas da API
│   │       ├── services/         # Lógica de negócio
│   │       └── utils/            # Utilitários (logger, etc)
│   └── frontend/       # Interface Next.js
│       └── src/
│           ├── app/              # Pages e layouts Next.js
│           ├── components/       # Componentes React (Atomic Design)
│           │   ├── atoms/        # Button, Input, Card
│           │   ├── molecules/    # SearchInput, Modal, ErrorAlert, LoadingState
│           │   ├── organisms/    # Footer, ReportPreview, ReportSuccess
│           │   └── templates/    # MainLayout
│           ├── config/           # Constantes e URLs da API
│           └── services/         # Serviços de API
└── packages/
    └── shared/         # Tipos compartilhados
```

## Configuração

1. Clone o repositório
2. Instale dependências: `pnpm install`
3. Configure variáveis de ambiente

Backend (.env):
```
LLM_PROVIDER=groq
GROQ_API_KEY=sua_chave_groq
TAVILY_API_KEY=sua_chave_tavily
PORT=4000
```

Frontend (.env.local):
```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

Obtenha as chaves:
- Groq: https://console.groq.com (gratuito)
- Tavily: https://tavily.com (gratuito com limite)

## Executando

Terminal 1 - Backend:
```bash
cd apps/backend
pnpm dev
# Roda em http://localhost:4000
```

Terminal 2 - Frontend:
```bash
cd apps/frontend
pnpm dev
# Roda em http://localhost:3000
```

## Sistema de Agentes

O sistema usa três agentes especializados:

1. ResearchAgent
   - Gera queries de busca em inglês (melhores resultados)
   - Usa Tavily Search API para coletar dados
   - Retorna até 15 fontes relevantes

2. AnalystAgent
   - Analisa os dados coletados
   - Estrutura informações em seções
   - Gera conteúdo em português brasileiro

3. WriterAgent
   - Sintetiza o relatório final
   - Cria título e resumo executivo
   - Conteúdo em português brasileiro

## Fluxo de Geração

1. Usuário digita termo de busca (ex: "Tesla")
2. Backend inicia processamento com 3 agentes
3. ResearchAgent busca informações (queries em inglês)
4. AnalystAgent analisa e estrutura (conteúdo em português)
5. WriterAgent sintetiza relatório final (português)
6. Frontend exibe tela de sucesso
7. Usuário pode ver preview ou baixar PDF

## Arquitetura Frontend

Componentização usando Atomic Design:
- Atoms: Button, Input, Card
- Molecules: SearchInput, Modal, ErrorAlert, LoadingState, EmptyState
- Organisms: Footer, ReportSuccess, ReportPreview, ReportSection, ReportSources
- Templates: MainLayout

Services:
- reportService.generate(query) - Gera relatório
- reportService.exportToPDF(report) - Exporta PDF
- ApiError - Classe de erro customizada

## API Endpoints

POST /api/reports/generate
Body: { query: string }
Response: { status: "completed", report: Report }

POST /api/reports/export/pdf
Body: Report
Response: Arquivo PDF

GET /api/health
Response: { status: "ok" }

## Página de Teste

Acesse http://localhost:3000/test para testar sem gastar tokens da API.

Funcionalidades:
- Fluxo completo de geração (mockado)
- Loading simulado (2 segundos)
- Tela de sucesso com estatísticas
- Modal de preview
- Botão de download (alert)
- Dados fixos sobre Tesla

Como usar:
1. Digite qualquer termo no input
2. Clique em "Gerar" ou pressione Enter
3. Aguarde 2 segundos (loading)
4. Veja tela de sucesso
5. Clique "Ver Preview" para abrir modal
6. Teste o download (mostra alert)

Importante: Sempre retorna o mesmo relatório mockado, não consome tokens da API real.

## Componentes Principais

Modal:
- Fecha com ESC, clique fora ou botão X
- Bloqueia scroll do body quando aberto
- Acessível (role="dialog", aria-modal)

ReportSuccess:
- Exibe após geração bem-sucedida
- Mostra estatísticas (tempo, seções, fontes)
- Botões: "Ver Preview" e "Baixar PDF Completo"

ReportPreview:
- Preview limitado do relatório
- Mostra resumo executivo + primeira seção
- Fade-out gradiente no final
- Altura máxima de 500px
- Incentiva download do PDF completo

## Prompts dos Agentes

ResearchAgent:
- Gera consultas em INGLÊS para melhores resultados
- 3-5 queries específicas sobre o tópico

AnalystAgent:
- TODO conteúdo em PORTUGUÊS BRASILEIRO
- Cria 4-6 seções principais
- Inclui subsections quando apropriado

WriterAgent:
- TODO conteúdo em PORTUGUÊS BRASILEIRO
- Título profissional (máx 12 palavras)
- Resumo executivo (2-3 parágrafos)

## Paleta de Cores

```css
--color-bg-primary: #f6f6fb
--color-bg-secondary: #ffffff
--color-text-primary: #323453
--color-text-secondary: #9496a0
--color-accent: #4f46e5
--color-accent-hover: #4338ca
--color-accent-purple: #906c91
--color-accent-purple-dark: #7a5a7b
--color-accent-light: #bfa6ba
--color-border: #e5e5e5
--color-error: #c00
--color-error-bg: #fee
--color-error-border: #fcc
```

## Formatação e Linting

Backend e Frontend usam Biome:
```bash
pnpm format  # Formata e aplica fixes
```

Regras:
- Zero any no TypeScript
- Sem console.log em produção
- Sem emojis no código
- Importações organizadas
- Componentes sem props desnecessárias

## Scripts Disponíveis

Backend:
- `pnpm dev` - Inicia servidor em modo desenvolvimento
- `pnpm build` - Compila TypeScript
- `pnpm start` - Inicia servidor compilado
- `pnpm test` - Executa testes unitários
- `pnpm test:watch` - Executa testes em modo watch
- `pnpm test:coverage` - Gera relatório de cobertura
- `pnpm format` - Formata código com Biome

Frontend:
- `pnpm dev` - Inicia Next.js em desenvolvimento
- `pnpm build` - Build de produção
- `pnpm start` - Inicia build de produção
- `pnpm test` - Executa testes unitários
- `pnpm test:watch` - Executa testes em modo watch
- `pnpm test:coverage` - Gera relatório de cobertura
- `pnpm format` - Formata código com Biome

## Logging

Sistema de logging estruturado no backend:
```typescript
logger.info(message, context, metadata)
logger.error(message, context, error)
logger.warn(message, context, metadata)
```

Formato: [timestamp] [level] [context] message

## Tipos Compartilhados

Definidos em packages/shared/src/types.ts:

```typescript
ResearchData { url, source, snippet, relevance }
AnalysisSection { title, content, subsections[] }
Report { id, query, title, summary, sections[], sources[], generatedAt, processingTime }
ReportGenerationStatus { status, report?, message?, error? }
```

## Limitações Conhecidas

- Relatórios sempre em português brasileiro (por design)
- Preview mostra apenas primeira seção
- PDF não tem formatação avançada
- Sem autenticação/autorização
- Sem persistência de relatórios
- Rate limit da Tavily API (plano gratuito)

## Melhorias Futuras

- Sistema de autenticação
- Banco de dados para persistir relatórios
- Cache de pesquisas
- Múltiplos idiomas
- Formatação avançada de PDF
- Download de múltiplos formatos (DOCX, XLSX)
- Compartilhamento de relatórios

## Exemplo Prático
[![Assista ao vídeo](https://img.youtube.com/vi/-qcRaY0wuE8/maxresdefault.jpg)](https://www.youtube.com/watch?v=-qcRaY0wuE8)
