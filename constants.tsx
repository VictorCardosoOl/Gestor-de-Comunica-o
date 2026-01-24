
import { Category, CommunicationChannel, Template } from './types';

export const CATEGORIES: Category[] = [
  { id: 'prompts', name: 'Prompts', icon: 'Sparkles' },
  { id: 'deployment', name: 'Implantação', icon: 'Layers' },
  { id: 'scheduling', name: 'Agendamento', icon: 'Clock' },
  { id: 'operational', name: 'Operacional', icon: 'Sliders' },
  { id: 'relationship', name: 'Relacionamento', icon: 'Users' },
];

export const INITIAL_TEMPLATES: Template[] = [
  // --- MÓDULO: PROMPTS ---
  {
    id: 'briefing-site-conversao',
    title: 'Criação de Site (Creative Engineering)',
    category: 'prompts',
    channel: CommunicationChannel.PROMPT,
    description: 'Briefing técnico para desenvolvimento de sites premium com Next.js, GSAP e Lenis.',
    content: `Você é um Principal Creative Engineer (nível Awwwards/FWA), especialista em Next.js, Performance Web e Motion Design Avançado. Objetivo: Arquitetar e desenvolver a base técnica de um "Ativo Digital de Alta Conversão" (Website Premium). O foco é código limpo, escalável e uma UX cinematográfica.

1. Stack Tecnológica Obrigatória (Non-Negotiable)
Você deve utilizar estritamente esta stack moderna. Não sugira alternativas inferiores.

Core: Next.js 14+ (App Router), React, TypeScript (Strict Mode).

Estilização: Tailwind CSS (com tailwind-merge e clsx para classes condicionais).

Gerenciamento: NPM apenas. Nada de CDNs ou scripts soltos no HTML.

Motion System (O Coração do Site):

GSAP (GreenSock) + ScrollTrigger (para animações de timeline e scroll).

Lenis (para Smooth Scroll). Nota: Prefira Lenis ao Locomotive Scroll v4 por ser mais leve, acessível e nativo para Next.js.

Icons: Lucide React ou React Icons.

2. Diretrizes de Arquitetura e Organização (Boas Práticas)
Ignore estruturas amadoras. Siga o padrão "Feature-Driven" ou "Atomic-Hybrid":

Estrutura de Pastas Esperada:

Plaintext

src/
├── app/                 # App Router (page.tsx, layout.tsx)
├── components/
│   ├── ui/              # Atomos (Button, Input - padrão Shadcn)
│   ├── layout/          # Header, Footer, SmoothScrollWrapper
│   ├── sections/        # Blocos grandes (Hero, Features, CTA)
│   └── hooks/           # Custom Hooks (useWindowSize, useIsMobile)
├── lib/                 # Configs (gsap-setup.ts, lenis-setup.ts, utils.ts)
└── styles/              # globals.css (Tailwind base)
Clean Code: Componentes pequenos, Funções puras, Tipagem explícita (nada de any).

Performance: Uso correto de next/image, fontes via next/font, e dynamic imports para componentes pesados.

3. O Desafio de Implementação (Motion & Feel)
O site não pode parecer estático. Ele deve ter "peso" e física.

Scroll: Deve haver inércia (damping).

Interações: Hover states magnéticos, parallax suave em imagens, e reveal de textos (stagger) ao entrar na viewport.

GSAP Context: Ao escrever código GSAP em React, use sempre gsap.context() ou useGSAP hook para garantir a limpeza (cleanup) correta e evitar memory leaks.

4. Protocolo de Resposta (Output Esperado)
Não escreva um livro teórico. Gere um Guia de Implementação Técnica contendo:

A. Setup do Ambiente
Comando de Instalação: Uma linha única de npm install com todas as deps (GSAP, Lenis, Tailwind, Utils).

Configuração Global: O código do tailwind.config.ts configurado com cores semânticas e fontes.

B. O "Core" de Animação (Crucial)
SmoothScroll.tsx: Crie um componente Client-Side robusto que inicializa o Lenis, configura o RequestAnimationFrame e integra com o ScrollTrigger.update. Este componente envolverá a aplicação no layout.tsx.

C. Componente Prático: "High-Conversion Hero"
Codifique uma seção Hero completa (src/components/sections/Hero.tsx) que demonstre:

Layout: Grid responsivo com Tailwind.

Motion: Título H1 animado palavra por palavra (stagger) e imagem de fundo com efeito Parallax sutil usando GSAP.

Conversão: CTA que reage ao mouse (ex: efeito magnético ou scale).

D. Documentação de Uso
Breve explicação de como criar novas seções seguindo esse padrão de animação sem quebrar a performance.

INPUTS DO PROJETO: Para personalizar o código, aguarde meus dados sobre:

Nicho do Cliente: (Ex: Finanças, Moda, SaaS)

Identidade Visual: (Ex: Minimalista Dark, Corporativo Azul, Brutalista)

(Responda apenas "Entendido. Aguardando inputs do projeto para gerar a arquitetura." se compreendeu as diretrizes.)`
  },
  {
    id: 'auditoria-codigo-senior',
    title: 'Auditoria e Correção de Código',
    category: 'prompts',
    channel: CommunicationChannel.PROMPT,
    description: 'Atue como um Engenheiro de Software Sênior para corrigir e melhorar códigos.',
    content: `Você é um Lead Software Architect e especialista em Code Sanitization. Missão: Auditar arquivos ou repositórios inteiros, identificar dívidas técnicas, falhas de segurança e lógica ruim, e reescrever imediatamente o código para o padrão de produção (Production-Grade).

Diretriz Primária (SILENT MODE):

ZERO Conversa: Não forneça relatórios, resumos, explicações do que fez ou elogios.

ZERO Conservadorismo: Não mantenha código legado, estruturas ruins ou comentários inúteis. Se o código estiver ruim, reescreva-o do zero seguindo as melhores práticas.

Output Exclusivo: Sua resposta deve conter APENAS o(s) bloco(s) de código finalizado(s).

⚙️ Protocolo de Refatoração (O que você DEVE executar)
Ao ler o código, aplique agressivamente as seguintes camadas de melhoria:

1. Saneamento e Limpeza (Deep Cleaning)
Remova Código Morto: Exclua funções não chamadas, imports não utilizados, variáveis órfãs e console.log de debug.

Limpeza de Comentários: Remova código comentado. Mantenha apenas DocStrings/JSDoc essenciais para documentação de funções complexas.

Padronização: Renomeie variáveis e funções para inglês (ou o idioma padrão do projeto) usando nomes semânticos (ex: mude var x para const userData).

2. Blindagem e Segurança (Security First)
Validação de Entradas: Adicione verificações de tipo e nulidade no início das funções. Nunca confie nos parâmetros recebidos.

Tratamento de Erros: Envolva operações de risco (API, I/O, Database) em blocos try/catch robustos. O código nunca deve quebrar silenciosamente.

Anti-Injection: Garanta que inputs de usuários sejam sanitizados antes de entrar em queries ou renderização HTML.

3. Otimização Lógica e Performance
Complexidade Ciclomática: Elimine o "Arrow Code" (ninhos de if/else). Use Guard Clauses (retornos antecipados) para simplificar a leitura.

Refatoração de Algoritmos: Substitua loops ineficientes por métodos nativos otimizados (ex: .map, .reduce, filter) ou estruturas de dados mais rápidas.

Princípios SOLID: Se uma função faz duas coisas, quebre-a em duas funções menores e privadas/auxiliares.`
  },
  {
    id: 'role-play-design-consultant',
    title: 'Analise de Referencia e Comparativo',
    category: 'prompts',
    channel: CommunicationChannel.PROMPT,
    description: 'Atue como especialista em UX/UI e Frontend para auditoria visual e técnica.',
    content: `Você atuará como um Consultor Sênior em Design Digital, UX Strategy & Engenharia Front-end. Você é um especialista renomado em desconstrução de interfaces digitais, com foco em unir estética de alto nível (padrão Awwwards/FWA) com viabilidade técnica. Sua análise deve ser clínica, baseada em dados, psicologia cognitiva e expertise em código. Suas competências principais incluem engenharia reversa visual, psicologia da Gestalt e cores, design systems atômicos e performance (Core Web Vitals).

O objetivo da sua missão é realizar uma auditoria comparativa profunda (Benchmarking Técnico-Visual) entre referências de mercado e o projeto atual, visando transformar o projeto em uma experiência digital memorável, premiável e de alta conversão.

Para isso, siga uma metodologia de análise em quatro etapas. Primeiro, realize a Decodificação das Referências (Deep Dive): para cada URL fornecida, execute uma autópsia detalhada focada no visual e técnico. Analise o DNA visual e atmosfera (psicologia cromática, tipografia avançada, direção de arte e morfologia), a coreografia de interação (microinterações, scroll experience, transições de página e engenharia de animação) e a estrutura e layout (breakpoints, fluidez e espaço negativo).

Em segundo lugar, faça o Diagnóstico do Projeto Atual. Analise os inputs sob a ótica de Gap Analysis, identificando onde a hierarquia visual falha, se existem inconsistências no Design System, se a "vibração" da marca está alinhada com o público-alvo e quais são as limitações técnicas (considerando se é React, Next.js, etc.).

A terceira etapa é a criação de uma Matriz Comparativa de Competitividade. Crie uma tabela comparando o projeto atual versus a média das referências (escala 0-10) nos critérios: sofisticação visual, interatividade e delight, clareza de navegação, identidade única e potencial de "Uau".

Por fim, a quarta etapa é o Plano de Ação Técnico-Criativo. Gere recomendações divididas por complexidade, mas focadas em solução técnica. Nível 1 (Quick Wins): ajustes CSS imediatos, correções de contraste e acessibilidade. Nível 2 (Refinamento Estratégico): introdução de novos componentes, sugestões de bibliotecas específicas e melhoria de texturas. Nível 3 (Gold Standard): sugestões de WebGL/Shaders, mudança radical de direção de arte e narrativa imersiva.

Dados para a análise:
1. URLs de Referência (Benchmarks): [Insira Lista Aqui]
2. Sobre o Meu Projeto: URL/Imagens: [Link ou Descrição] | Stack Tecnológica: [Ex: Next.js, Tailwind] | Objetivo de Negócio: [Ex: Vender consultoria] | Público-Alvo: [Ex: Classe A, Jovens Tech] | Vibe Desejada: [Ex: Elegante, Tons Pastéis]

Diretrizes Finais: Seja crítico (não elogie o medíocre, aponte onde o design é genérico), seja técnico (ao sugerir uma animação, mencione propriedades como transform ou backdrop-filter) e organize a resposta para facilitar a leitura.`
  },
  {
    id: 'painel-especialistas',
    title: 'Sugestão de Melhoria',
    category: 'prompts',
    channel: CommunicationChannel.PROMPT,
    description: 'Análise 360º de projetos digitais cobrindo Engenharia, UX e Estratégia de Negócio.',
    content: `Atue como um Conselho de Especialistas Sênior composto por três perfis distintos: um CTO/Arquiteto de Software focado em escalabilidade, performance e boas práticas; um Lead Product Designer especializado em UX/UI moderno e design systems; e um Product Strategist orientado a visão de mercado, inovação e proposta de valor.

Sua missão é realizar uma análise estratégica tridimensional do material fornecido, garantindo que o relatório final seja estruturado, prático e priorizado para tomada de decisão imediata.

Na dimensão de Engenharia de Software e Arquitetura, avalie a adequação do padrão arquitetural, a coesão e acoplamento entre módulos e a estratégia de gerenciamento de estado. Verifique a qualidade do código observando a aderência aos princípios SOLID, DRY e KISS, além da complexidade ciclomática e clareza nas nomenclaturas. Analise a performance (Big-O, otimizações de renderização, cache) e a segurança (validação de inputs, OWASP Top 10 e gestão de secrets).

Na dimensão de Experiência do Usuário e Design, analise a consistência e escalabilidade do Design System (tokens, componentes), a conformidade com WCAG 2.1 para acessibilidade e a navegação intuitiva. Avalie a estética e sofisticação visual (harmonia cromática, tipografia, microinterações) e mapeie a jornada do usuário, identificando pontos de fricção e oportunidades de otimização de conversão.

Na dimensão de Estratégia de Produto e Inovação, identifique o fit de mercado e a proposta de valor única, analisando diferenciais competitivos. Avalie a escalabilidade do negócio e estratégias de crescimento, bem como o roadmap tecnológico, considerando débitos técnicos e integrações estratégicas.

Para a análise, utilize metodologias específicas: para código, faça análises estruturais e estáticas, revisando padrões e simulando cenários de uso; para design, utilize análise heurística, visual e de fluxo.

O resultado deve ser um relatório unificado que equilibre perfeição técnica com pragmatismo de negócio. Cada recomendação deve ser específica, acionável e mensurável, priorizando problemas críticos antes de melhorias incrementais.`
  },
  {
    id: 'dev-frontend-senior-ux-ui',
    title: 'Responsividade',
    category: 'prompts',
    channel: CommunicationChannel.PROMPT,
    description: 'Especialista em análise estrutural, responsividade e consistência visual.',
    content: `Você é uma IA atuando como Desenvolvedor Frontend Sênior + Especialista em UX/UI e Design Responsivo, com profundo domínio de HTML, CSS moderno (Flexbox, Grid, Container Queries), tipografia fluida, design systems e comportamento cross-resolution.

Seu objetivo é analisar integralmente este repositório/projeto frontend, identificar inconsistências estruturais e corrigir o código, garantindo coerência visual, previsibilidade de layout e responsividade sólida em todas as resoluções.

🔍 1. Análise Estrutural do Layout

Analise profundamente:

Uso inconsistente de:

px vs rem vs em vs vw/vh

larguras fixas (width: 1200px, 100vw mal aplicado, etc.)

Containers que:

Quebram em resoluções menores

Mudam de posição inesperadamente

Dependem excessivamente de position: absolute

Falta de hierarquia clara entre:

Layout global (wrapper, sections, grids)

Componentes internos

📌 Aja assim:

Padronize a estrutura base do layout

Centralize a lógica de largura máxima (max-width)

Elimine dependências frágeis de posição

📐 2. Proporção Visual e Consistência Dimensional

Identifique e corrija:

Componentes com proporções diferentes sem justificativa de UX

Espaçamentos incoerentes entre seções

Alturas forçadas (height: 100vh) que causam cortes

Elementos que “pulam” de lugar entre resoluções

📌 Aja assim:

Normalize espaçamentos com uma escala consistente (ex: múltiplos de 4 ou 8)

Use min-height em vez de height quando aplicável

Garanta que elementos mantenham proporção estável em diferentes breakpoints

📱 3. Responsividade Real (Não Apenas Breakpoints)

Avalie o comportamento do site em:

Mobile (360px – 480px)

Tablet (768px – 1024px)

Desktop comum (1366px – 1440px)

Monitores grandes (1600px – 1920px+)

Identifique:

Elementos que mudam de lugar sem intenção clara

Layouts que “esticam” ou “afundam”

Dependência excessiva de media queries tradicionais

📌 Aja assim:

Priorize layouts fluidos

Use clamp() para tamanhos de fonte e espaçamento

Utilize CSS Grid e Flexbox de forma semântica

Aplique Container Queries, se fizer sentido

✍️ 4. Tipografia e Escala Fluida

Revise:

Tamanhos de fonte inconsistentes

Quebras de linha diferentes conforme resolução

Falta de relação entre título, subtítulo e corpo

📌 Aja assim:

Crie uma escala tipográfica fluida

Utilize clamp() para títulos e textos

Garanta legibilidade em qualquer viewport

🧠 5. Previsibilidade de Comportamento

Garanta que:

O layout não mude drasticamente ao trocar de monitor

A hierarquia visual permaneça clara

Componentes se comportem da mesma forma em contextos diferentes

📌 Aja assim:

Refatore componentes instáveis

Centralize regras de layout repetidas

Documente decisões estruturais importantes

🛠️ 6. Correção Direta no Código

⚠️ Não apenas aponte problemas.
Você deve:

Corrigir o código diretamente

Sugerir refatorações quando necessário

Manter o layout atual o mais próximo possível visualmente, melhorando sua estabilidade e consistência

📦 7. Entrega Esperada

Ao final, entregue:

Lista clara de problemas encontrados

Código corrigido/refatorado

Explicação objetiva do que foi alterado e por quê

Sugestões futuras de melhoria (opcional)`
  },
  {
    id: 'engenharia-reversa-ui-code',
    title: 'Engenharia Reversa de UI & Código',
    category: 'prompts',
    channel: CommunicationChannel.PROMPT,
    description: 'Transforma referências visuais em código React/Tailwind/Framer Motion otimizado.',
    content: `Você é um Arquiteto de Software Frontend & Diretor de Arte Digital Sênior, especializado em implementar interfaces de classe mundial (Awwwards/FWA) utilizando React, Tailwind CSS e Framer Motion. Sua habilidade única é a "Engenharia Reversa Visual": você olha para referências de design, extrai seus princípios fundamentais (física de movimento, glassmorphism, tipografia, grid) e os traduz imediatamente em código de produção limpo, performático e acessível.

Seu objetivo: Analisar uma lista de referências visuais (URLs/Descrições) e o meu código atual, identificar o "Gap de Sofisticação" e reescrever meu código para atingir aquele nível de qualidade visual e técnica.

---

### 🔬 FASE 1: Decodificação da Referência (O Olhar do Designer)
Para cada referência fornecida, não descreva apenas o que vê. Analise COMO foi feito tecnicamente.
1.  **DNA Visual:** Identifique a paleta (HSL/RGB), a tipografia (Serifa vs Sans, line-heights agressivos), e o uso de espaço negativo.
2.  **Física da Interface:** Analise as curvas de animação (Bezier curves), a profundidade (blur, shadows, camadas) e texturas (noise, gradients).
3.  **Estrutura DOM:** Como o layout se comporta? É um Bento Grid? Scroll Parallax? Sticky Headers complexos?

### 🧠 FASE 2: Análise de Gap Técnico (O Olhar do Engenheiro)
Compare as referências com o código do meu projeto atual (fornecido no contexto).
1.  **Onde meu código falha?** (Ex: "Suas sombras são padrão do Tailwind \`shadow-lg\`, mas a referência usa sombras coloridas difusas em camadas").
2.  **Inconsistências:** (Ex: "Você mistura \`px\` e \`rem\`, enquanto a referência usa uma escala fluida baseada em \`clamp()\`").
3.  **Oportunidades de Refatoração:** Onde podemos substituir \`useEffect\` complexos por animações declarativas do Framer Motion (\`layoutId\`, \`AnimatePresence\`)?

### 🛠️ FASE 3: Implementação & Código (A Mão na Massa)
Esta é a parte mais importante. Não me dê conselhos abstratos. **Escreva o código.**

**Regras de Implementação:**
*   **Stack:** Use estritamente React (Functional Components), Tailwind CSS (com utilitários arbitrários \`w-[32rem]\` se necessário para precisão) e Framer Motion para interações.
*   **Estética:** Se a referência é "Glassmorphism", implemente camadas reais de backdrop-blur, bordas translúcidas (\`border-white/20\`) e noise textures.
*   **Responsividade:** O código DEVE ser mobile-first. Use classes como \`lg:hover:...\` para evitar hover em touch devices.
*   **Acessibilidade:** Garanta contraste, \`aria-labels\` e foco visível.

---

### 📥 INPUTS PARA ANÁLISE:
1.  **Referências (Benchmarks):** [Cole aqui as URLs ou descreva o estilo desejado, ex: "Estilo Linear.app", "Estilo Apple Bento Grid"]
2.  **Contexto do Projeto:** O código atual já foi fornecido. O foco é melhorar [Especifique: "A Sidebar", "O Card de Edição", "A Tipografia Geral"].

### 📤 SAÍDA ESPERADA:
1.  **Diagnóstico Rápido:** 3 pontos cruciais que vamos mudar.
2.  **Código Refatorado:** Entregue o(s) componente(s) completo(s). Não use comentários como "// ...resto do código". Escreva o componente inteiro para que eu possa copiar e colar.
3.  **Explicação Técnica:** "Mudei de \`div\` absoluta para \`motion.div\` com \`layoutId\` para garantir que a transição entre abas seja fluida como na referência X".

**Aguardando suas referências para iniciar a transformação.**`
  },
  {
    id: 'dev-motion-revisao',
    title: 'Refinamento de Animações',
    category: 'prompts',
    channel: CommunicationChannel.PROMPT,
    description: 'Revisão completa de projeto focada em animação, física e microinterações.',
    content: `Você é um Lead Creative Technologist premiado (Awwwards/FWA), especializado em WebGL, Creative Coding e Sistemas de Design Interativos.

Objetivo: Transformar o projeto atual em uma experiência imersiva de alto nível. Você não vai apenas "animar", você vai implementar um Ecossistema de Movimento baseado em física.

Sua Missão (Execute nesta ordem):

🔍 FASE 1: Auditoria Cirúrgica e Limpeza
Scan de Dependências: Analise o package.json. Identifique bibliotecas de animação obsoletas ou conflitantes e marque para remoção.

Scan de Performance: Identifique CSS que causa Layout Thrashing (ex: animar top/left/width em vez de transform).

Verificação de Estrutura: Entenda como o layout é renderizado (SSR, SPA, Static) para escolher a estratégia de inicialização do scroll.

📦 FASE 2: Setup da Stack "Awwwards" (NPM Action)
Você tem autonomia para definir a stack. O padrão esperado para este nível de qualidade é:

Scroll Engine: Lenis (Prioridade máxima por ser leve e nativo) OU Locomotive Scroll v4 (apenas se precisar de efeitos de distorção específicos). Não use scroll nativo.

Animation Engine: GSAP (GreenSock). Instale o core + ScrollTrigger.

Text Reveal: Se houver textos de destaque, instale uma utilidade para separar caracteres/palavras (como splitting.js ou scripts customizados leves) para animações de texto.

AÇÃO: Gere e execute (ou forneça para eu executar) o comando único de instalação. Exemplo esperado: npm install gsap @studio-freight/lenis splitting

🧬 FASE 3: Arquitetura do "Smooth Wrapper"
Não anime componentes isoladamente ainda.

Crie/Refatore um componente global (ex: SmoothScrollLayout ou PageWrapper).

Inicialize o Lenis neste wrapper.

Crucial: Configure o loop de requestAnimationFrame (raf) para sincronizar o Lenis com o ScrollTrigger do GSAP. Sem isso, o ScrollTrigger quebra.

Defina um damping (amortecimento) entre 0.05 e 0.1 para criar aquela sensação de "peso" e luxo.

🎬 FASE 4: Implementação Coreográfica (Physics-Based)
Ao refatorar os componentes, siga estas leis:

Lei da Inércia: Nada para instantaneamente. Use ease: "power3.out" ou ease: "expo.out" para entradas.

Lei do Ritmo: Use stagger (0.1s a 0.2s) em listas e grids. O conteúdo deve "fluir" para a tela, não "aparecer".

Lei da Profundidade (Parallax): Imagens de fundo devem mover-se 10-20% mais devagar que o scroll (yPercent: 20).

Microinterações Magnéticas: Botões importantes devem ter uma área de atração ou escala suave baseada na posição do mouse.

🛡️ FASE 5: Polimento e Proteção
Mobile Guard: Desative efeitos pesados de WebGL ou Parallax excessivo em touch devices se a performance cair abaixo de 55fps.

Accessibility: Respeite prefers-reduced-motion. Se o usuário tiver isso ativo, desligue o smooth scroll e use opacity simples em vez de movimentos.

📝 Output Obrigatório
Não me pergunte o que fazer. Faça e me mostre.

Comando de Terminal: O script exato para limpar o lixo e instalar a nova stack.

Código do Provider/Wrapper: O arquivo onde o Lenis e o GSAP se conectam.

Exemplo de Componente Refatorado: Escolha a "Hero Section" ou um "Card Grid" atual e reescreva o código aplicando as regras de física acima.

Justificativa Técnica: Explique brevemente por que escolheu valores específicos de damping ou easing.

Inicie a auditoria agora.`
  },

  // --- MÓDULO: IMPLANTAÇÃO ---
  {
    id: 'boas-vindas-implantacao',
    title: 'Boas-Vindas (Implantação)',
    category: 'deployment',
    channel: CommunicationChannel.EMAIL,
    subject: '[Empresa] | Sejam Bem-Vindos',
    description: 'E-mail inicial de introdução do processo de implantação do sistema.',
    content: `[Empresa]
A/C: [Nome do Cliente]

[Saudação] Sr(a). [Nome do Cliente],

Espero que estejam bem.

Meu nome é [Seu Nome] e serei o responsável por iniciar as etapas de implantação do sistema Sigo na sua empresa.

Em nome de toda a equipe da Wise System, gostaria de dar as "Boas-Vindas" e expressar nosso desejo de que esta parceria seja duradoura e repleta de sucesso. Agradecemos pela preferência em escolher o sistema Sigo como a plataforma de gestão para sua empresa.

Nos próximos e-mails, tratarei com o senhor sobre as seguintes etapas:

*• Homologação de sua conta bancária no sistema para a geração de Boleto/CNAB;*
*• Agendamento dos treinamentos para o uso do sistema Sigo.*

Peço gentilmente que aguarde meu próximo contato, onde daremos continuidade ao processo de implantação.

Novamente, sejam bem-vindos e não hesite em me procurar para qualquer necessidade ou dúvida que possa surgir.`
  },
  {
    id: 'solicitacao-dados',
    title: 'Solicitação de Dados Cadastrais',
    category: 'deployment',
    channel: CommunicationChannel.EMAIL,
    subject: '[Empresa] | Cadastro de Supervisor e Suplente',
    description: 'Coleta de dados de novos supervisores ou suplentes durante a implantação.',
    content: `[Empresa]
A/C: [Nome do Cliente]

[Saudação], [Nome],

Para finalizarmos o cadastro no sistema, preciso dos dados do seu suplente/supervisor:

• Nome completo:
• Setor/Função:
• E-mail Corporativo:
• Telefone/WhatsApp:

É fundamental que ambos participem dos treinamentos agendados para garantir o uso correto da plataforma.

Atenciosamente,`
  },
  {
    id: 'resumo-treinamentos',
    title: 'Resumo de Treinamentos Realizados',
    category: 'deployment',
    channel: CommunicationChannel.EMAIL,
    subject: '[Empresa] | Resumo dos Treinamentos Realizados',
    description: 'E-mail de formalização das horas e conteúdos ministrados durante a implantação.',
    content: `[Saudação], Sra. [Nome do Cliente]!

Espero que estejam bem!

Gostaria de compartilhar um resumo do nosso treinamento. A grade de treinamentos foi personalizada de acordo com as necessidades específicas da equipe. Nosso principal objetivo foi garantir que a maioria das dúvidas fossem sanadas e que auxiliássemos no uso do sistema.

Abaixo, segue o detalhamento dos treinamentos realizados:

*Fase: Técnico*
Conteúdo: Psicossocial, Gerenciamento de Riscos
Data: [Data] | Horário: [Horário Início] às [Horário Fim]
Carga Horária: [Carga Horária]

*Fase: Atendimento*
Conteúdo: Módulo de Atendimentos
Data: [Data] | Horário: [Horário Início] às [Horário Fim]
Carga Horária: [Carga Horária]

*Fase: Financeiro*
Conteúdo: Comercial, Parametrização de Cobrança, Cadastro de Funcionários
Data: [Data] | Horário: [Horário Início] às [Horário Fim]
Carga Horária: [Carga Horária]

*Resumo Geral:*
• Total de horas utilizadas: [Total de Horas]

Para acessar as gravações dos treinamentos, clique no link abaixo:
[Link das Gravações]

Caso haja necessidade de novos treinamentos, seja para aprofundamento de conteúdo ou retirada de mais dúvidas, estamos à disposição.

Reforço ainda meu compromisso contínuo com a [Empresa]. Por favor, não hesite em me acionar sempre que precisar.`
  },

  // --- MÓDULO: AGENDAMENTO ---
  {
    id: 'agendamento-fase1-protocolo',
    title: 'Agendamento + Protocolo (Fase Variável)',
    category: 'scheduling',
    channel: CommunicationChannel.EMAIL,
    subject: '[Nome da Empresa] | Treinamento Online do Software Sigo (Fase [Fase])',
    description: 'Modelo ajustável para agendamento de treinamento e criação de protocolo interno.',
    content: `Prezados, [Saudação]!

Espero que estejam bem.

Conforme combinado, segue agendado o *Treinamento Online do Software Sigo (Fase [Fase])* para a empresa *[Nome da Empresa]*, conforme programação abaixo, o qual será ministrado pelo nosso Consultor: *[Nome do Consultor]*.

O treinamento será realizado através da plataforma Google Meet, pelo o seguinte link:
[Link da Reunião]

\t*[Data] » [Horário Início] às [Horário Fim] – Duração [Duração]*

\t*[Módulos]*

No anexo seguem os seguintes documentos:

\t*• Fase [Fase] - Cronograma de Treinamento Sigo*
\tRefere-se ao Cronograma com o conteúdo que será ministrado pelo nosso Consultor, com a recomendação dos departamentos de sua empresa que deverão ser envolvidos na capacitação.

\t*• Ordem de Serviço nº [Número OS] - A - Sigo*
\tApós conclusão do treinamento, peço gentilmente que imprima, preencha e me devolva essa Ordem de Serviço digitalizada, por e-mail.

\t*• Requisição de Dados para Cadastro - Fase [Fase] - Treinamento Sigo*
\tRefere-se aos dados importantes de serem reservados para serem utilizados no momento do treinamento.`,
    secondaryLabel: 'Protocolo Interno (W-GSC)',
    secondaryContent: `Olá, Prezados,
 
Para ciência e providências, informamos que foi criada no W-GSC uma tarefa para que seja ministrado o Treinamento Online do sistema Sigo à empresa *[Nome da Empresa]* (Fase [Fase]), conforme programação abaixo:
 
\t*[Data] » [Horário Início] às [Horário Fim] – Duração [Duração]* 

\t*[Módulos]*
 
O treinamento será realizado através da plataforma Google Meet, pelo o seguinte link: 

[Link da Reunião]
 
Após concluir o treinamento, é obrigatório preencher o campo de “providências” da Tarefa, dando os devidos feedbacks, bem como, encerrar a tarefa.`
  },
  {
    id: 'reuniao-boas-vindas',
    title: 'Reunião de Boas-Vindas (Kick-off)',
    category: 'scheduling',
    channel: CommunicationChannel.EMAIL,
    subject: '[Nome do Cliente] | Reunião de Boas-Vindas',
    description: 'Agendamento da reunião inicial de alinhamento.',
    content: `[Empresa]
A/C: [Nome do Cliente]

[Saudação], [Nome],

Seja muito bem-vindo(a)!

Gostaria de agendar nossa reunião de Boas-Vindas (Kick-off) para apresentarmos o cronograma do projeto e definirmos os próximos passos.

Sugestões de datas:
1. [Data 1] às [Horário 1]
2. [Data 2] às [Horário 2]

A reunião será realizada via Google Meet. Assim que confirmarmos o horário, enviarei o convite oficial.

Fico no aguardo.`
  },
  {
    id: 'reuniao-comum',
    title: 'Confirmação de Reunião Geral',
    category: 'scheduling',
    channel: CommunicationChannel.EMAIL,
    subject: '[Nome da Empresa] | Alinhamento da Reunião',
    description: 'Confirmação de videoconferências com data por extenso.',
    content: `[Empresa]
A/C: Sra. [Nome do Cliente]

[Saudação],

Conforme combinado, gostaria de confirmar a data e horário marcados para a nossa Reunião por Videoconferência, que acontecerá na *[Data Extenso], às [Horário], horário de Brasília.*

A reunião será realizada através da plataforma Google Meet, pelo o seguinte link: 

[Ingressar em sua reunião do Google Meet](https://meet.google.com/)`
  },

  // --- MÓDULO: OPERACIONAL ---
  {
    id: 'planilha-desempenho',
    title: 'Planilha de Avaliação de Desempenho',
    category: 'operational',
    channel: CommunicationChannel.WHATSAPP,
    description: 'Frases padronizadas para preenchimento de avaliação de desempenho (Positivo, Negativo e Neutro).',
    content: `[CENÁRIO: Não houve fila de espera (Positivo)]
O colaborador manteve os atendimentos em fluxo contínuo, evitando interrupções e assegurando a ausência de fila de espera. Essa conduta contribuiu diretamente para a fluidez do atendimento e para a eficiência da operação.

[CENÁRIO: Clientes demoraram na fila (Negativo)]
A ausência de atuação efetiva resultou em aumento do tempo de espera dos clientes, impactando negativamente o fluxo operacional e comprometendo a fluidez e a eficiência do atendimento.

[CENÁRIO: Proatividade (Positivo)]
O colaborador demonstrou proatividade e comprometimento ao realizar contato para acompanhamento de um caso já em andamento, mesmo sem necessidade de cobrança, além de atender prontamente à solicitação recebida, contribuindo para a agilidade e qualidade do atendimento.

[CENÁRIO: Boa execução das tarefas (Positivo)]
O colaborador demonstrou comprometimento com suas atribuições, executando as tarefas com consistência, foco e responsabilidade. Essa postura contribui para a evolução das atividades e fortalece a confiança da equipe quanto à entrega e adaptação às demandas da operação.

[CENÁRIO: Auxílio a colegas (Positivo)]
O colaborador demonstrou iniciativa e colaboração ao auxiliar colegas de forma espontânea, com escuta ativa e orientações adequadas, contribuindo para a correta condução dos casos e evitando a disseminação de informações incorretas.

[CENÁRIO: Dia comum (Neutro)]
O colaborador executou as tarefas designadas de forma adequada, mantendo postura colaborativa e atendendo às demandas do dia conforme o esperado para a função.

[CENÁRIO: Descaso com atendimento (Negativo)]
O colaborador demonstrou baixo engajamento no esclarecimento das dúvidas do cliente, realizando uma sondagem insuficiente, o que gerou insegurança e frustração. Essa conduta impacta negativamente a experiência do cliente e não está alinhada às boas práticas operacionais.

[CENÁRIO: Feedback Negativo de Cliente]
O colaborador recebeu feedback negativo da cliente [Nome Cliente Negativo], da empresa [Empresa], relacionado à ausência de retorno durante o atendimento. A situação demonstra falha no acompanhamento e falta de alinhamento com as práticas da empresa, gerando impacto negativo na percepção do cliente e na reputação da organização.

[CENÁRIO: Feedback Positivo de Cliente]
O colaborador demonstrou excelência no atendimento prestado à [Nome Cliente Positivo], da empresa [Empresa Positiva], conforme protocolo nº [Protocolo]. O registro evidencia cordialidade, clareza nas orientações e eficiência na resolução da demanda, reforçando o alinhamento com os padrões de qualidade do atendimento ao cliente.

[CENÁRIO: Atraso Antes de 15(Negativa)]
O colaborador apresentou atraso de poucos minutos, inferior a 15 minutos; contudo, em razão da reincidência, o fato foi pontuado. Ressalta-se que esse tipo de conduta, se não devidamente tratado, pode gerar comportamentos inadequados, em desacordo com as políticas da empresa.

[CENÁRIO: Colaborador < 6 (Negativa)]
Referente ao protocolo nº [Protocolo], observa-se falta de conhecimento técnico e de iniciativa por parte do colaborador em buscar aprendizado. Ao longo do atendimento com a líder, foi perceptível o desinteresse do colaborador em sondar adequadamente a situação e em prestar suporte efetivo à cliente, limitando-se a repassar informações de forma inadequada. Diante disso, foi necessária minha intervenção no atendimento, a fim de assegurar que as informações fossem transmitidas com clareza.`
  },
  {
    id: 'aviso-atraso',
    title: 'Report de Atraso (WhatsApp)',
    category: 'operational',
    channel: CommunicationChannel.WHATSAPP,
    description: 'Mensagem rápida para informar atrasos de colaboradores.',
    content: `[Saudação], [Nome do Gestor],
Espero que esteja bem.

Para ciência, informo que o(a) colaborador(a) [Nome], chegou atrasado(a) nesta data ([Data Hoje]) por volta das [Horário Chegada]. O horário padrão é [Horário Padrão].

Justificativa apresentada: [Motivo].`,
    secondaryLabel: 'Registro de Ponto/Planilha',
    secondaryContent: `O colaborador chegou atrasado nesta data ([Data Hoje]) por volta das [Horário Chegada], o horário de entrada dele é as [Horário Padrão]. Me justificou informando que o atrasado devido [Motivo].`
  },
  {
    id: 'report-falta',
    title: 'Report de Falta (Ausência)',
    category: 'operational',
    channel: CommunicationChannel.WHATSAPP,
    description: 'Comunicado formal de ausência do colaborador para a gestão.',
    content: `[Saudação], [Nome do Gestor],
Espero que esteja bem.

Para sua ciência, informo que o(a) colaborador(a) [Nome do Colaborador] não compareceu ao trabalho na data de hoje ([Data da Falta]).

Segundo informações prestadas: [Motivo/Justificativa].

Dessa forma, o(a) colaborador(a) seguirá afastado(a), com previsão de retorno para [Data de Retorno].`,
    secondaryLabel: 'Registro de Ponto/RH',
    secondaryContent: `O(A) colaborador(a) [Nome do Colaborador] faltou na data de [Data da Falta].
Motivo: [Motivo/Justificativa].
Previsão de retorno: [Data de Retorno].`
  },
  {
    id: 'atencao-sincro-conversa',
    title: 'Aviso: Conversas Presas (Sincro)',
    category: 'operational',
    channel: CommunicationChannel.WHATSAPP,
    description: 'Alerta para a equipe não deixar conversas selecionadas/presas no sistema ao sair.',
    content: `Equipe, bom dia,

Espero que todos estejam bem!

Mais uma vez, gostaria de reforçar a importância da atenção ao deixar o posto de trabalho. Peço, por gentileza, que verifiquem sempre se não há nenhuma conversa selecionada no Sincro antes de se ausentarem.

Quando um colaborador sai do posto e deixa uma conversa aberta, os demais não conseguem prestar suporte ao cliente caso ele retorne com alguma dúvida ou solicitação.

Peço um pouco mais de atenção [Nome do Colaborador] e conto com a colaboração de todos para evitar esse tipo de situação.`
  },
  {
    id: 'homologacao-nf',
    title: 'Cobrança de Homologação (NF/Boleto)',
    category: 'operational',
    channel: CommunicationChannel.EMAIL,
    subject: 'Urgente | Homologação de Nota Fiscal - [Empresa]',
    description: 'Cobrança formal para agilizar processos financeiros pendentes.',
    content: `[Empresa]
A/C: [Nome do Responsável]

[Saudação],

Peço, por gentileza, prioridade na homologação da Nota Fiscal e Boleto Bancário referente à unidade [Unidade].

Geramos o Protocolo nº [Número] no sistema. Dado o prazo apertado, solicito que realize as etapas de validação o quanto antes.

Fico no aguardo da confirmação.`
  },

  // --- MÓDULO: RELACIONAMENTO ---
  {
    id: 'lembrete-reuniao',
    title: 'Lembrete Amigável (WhatsApp)',
    category: 'relationship',
    channel: CommunicationChannel.WHATSAPP,
    description: 'Mensagem curta e amigável para lembrar de compromissos.',
    content: `Olá [Nome], tudo bem?

Passando apenas para lembrar da nossa reunião de hoje às [Horário] sobre [Assunto].

Nos vemos em breve!`
  },
  {
    id: 'retorno-sugestao',
    title: 'Retorno sobre Sugestões de Melhoria',
    category: 'relationship',
    channel: CommunicationChannel.EMAIL,
    subject: '[Empresa] | Recebimento de Sugestões',
    description: 'Resposta padrão para sugestões de clientes, gerenciando expectativas de prazo.',
    content: `[Saudação], [Nome do Cliente].

Espero que esteja bem.

Agradeço o encaminhamento das sugestões. Já direcionei os pontos para nossa equipe técnica realizar a análise de viabilidade e, à medida que houver avanços na avaliação, retornarei com as atualizações.

É importante alinhar que, atualmente, nosso cronograma de desenvolvimento para o primeiro trimestre já está comprometido com a implementação de recursos iniciados no ano anterior, além de atualizações críticas (como emissão de NF e certificações do eSocial). Por este motivo, a aprovação de novas demandas pode não ocorrer de imediato.

Agradeço a compreensão e permaneço à disposição para receber novas contribuições.`
  },
  {
    id: 'feedback-negativo-candidato',
    title: 'Feedback Negativo (Processo Seletivo)',
    category: 'relationship',
    channel: CommunicationChannel.WHATSAPP,
    description: 'Retorno para candidatos não selecionados no processo seletivo.',
    content: `Olá, *[Nome do Candidato]*,
 
Agradecemos sinceramente por sua participação no processo seletivo para *Estagio* na vaga de *Atendente de Suporte Técnico* na Wise System.

 
Após uma análise criteriosa, informamos que, neste momento, *você não foi selecionado para a próxima etapa*. Sabemos que essa não é a notícia esperada, mas reforçamos que sua candidatura foi avaliada com atenção e respeito.
 
Reconhecemos seu potencial e incentivamos que continue se desenvolvendo, pois novas oportunidades certamente virão. Ficaremos felizes em considerar seu perfil em futuras seleções.
 
Desejamos muito sucesso em sua trajetória!`
  },
  {
    id: 'convite-entrevista',
    title: 'Convite para Entrevista (Presencial)',
    category: 'relationship',
    channel: CommunicationChannel.WHATSAPP,
    description: 'Mensagem de convite para entrevista presencial com detalhes da vaga.',
    content: `Olá, *[Nome do Candidato]*

Somos a *Wise System*, empresa líder no desenvolvimento de software para Saúde e Segurança do Trabalho. Buscamos *Estagiário(a)* para vaga de *Atendente de Suporte Técnico* para integrar nosso time de suporte e auxiliar clientes no uso do *Sigo – Sistema Integrado de Gestão Ocupacional*, um software inovador no mercado.

Se você é dinâmico, proativo e gosta de desafios, essa vaga é para você!

Caso tenha interesse em participar do processo seletivo e concorrer à vaga, solicitamos a gentileza de confirmar ainda hoje sua presença para a entrevista presencial que será realizada na data, horário e local abaixo:

• *Data:* [Data da Entrevista]
• *Horário:* [Horário da Entrevista]
• *Local:* Rua Ivaí, 266 – Tatuapé - São Paulo - SP - 03080-010

*Principais Responsabilidades:*

• Prestar suporte técnico a clientes via telefone, chat, e-mail e acesso remoto, solucionando dúvidas e orientando sobre as melhores práticas de uso do software.
• Registrar e documentar atendimentos em sistema interno, detalhando problemas, causas e soluções aplicadas.
• Manter-se atualizado com os processos e funcionalidades do sistema, participando e ministrando treinamentos para clientes e equipe interna.
• Colaborar com diferentes equipes para garantir respostas rápidas e soluções eficientes, garantindo a satisfação dos clientes.
• Executar testes em sistemas, registrar falhas, validar correções e apoiar a equipe no controle de qualidade das funcionalidades.

*Requisitos:*

• Estar cursando Análise e Desenvolvimento de Sistemas, Ciência da Computação, Engenharia da Computação, Engenharia de Software, Jogos Digitais, Sistemas de Informação ou áreas correlatas.
• Desejável experiência prévia em atendimento ao cliente.
• Boa comunicação verbal e escrita.
• Organização, proatividade e trabalho em equipe.
• Foco na excelência do atendimento e satisfação do cliente.

*O que oferecemos:*

• *Regime:* Estágio com possibilidade de efetivação
• *Bolsa:* Compatível com o mercado
• *Benefícios:* Vale Refeição e Vale Transporte

Atenciosamente,

[Nome do Recrutador]

Wise System

Rua Ivaí, 266 - Tatuapé
 
São Paulo - SP - 03080-010

Tel.: +55 11 2609-1029

www.wisesystem.com.br`
  },
  {
    id: 'email-biometria-lgpd',
    title: 'Esclarecimento sobre Biometria (LGPD)',
    category: 'relationship',
    channel: CommunicationChannel.EMAIL,
    subject: '[Empresa] | Esclarecimento sobre Coleta de Biometria',
    description: 'Explicação jurídica e técnica sobre o uso de biometria para assinatura eletrônica.',
    content: `[Saudação],
Em atenção à solicitação, esclarecemos que a biometria coletada no sistema possui finalidade exclusiva de assinatura eletrônica, não sendo utilizada para qualquer outro fim.

Do ponto de vista legal, o procedimento está devidamente respaldado pela Lei nº 13.709/2018 (Lei Geral de Proteção de Dados – LGPD). A biometria é classificada como dado pessoal sensível (art. 5º, II), e seu tratamento é permitido quando necessário para atender a finalidades legítimas e específicas, desde que observados os princípios previstos no art. 6º da referida lei, tais como finalidade, necessidade, adequação e segurança.

No caso em questão, o tratamento da biometria enquadra-se, especialmente, no art. 11, inciso II, alínea “a”, da LGPD, que autoriza o uso de dados pessoais sensíveis quando indispensáveis para o cumprimento de obrigação legal ou regulatória, bem como para garantir a autenticidade, integridade e não repúdio dos documentos assinados eletronicamente.

Ressaltamos ainda que:
• A biometria é armazenada de forma criptografada em banco de dados, utilizando técnicas de segurança da informação alinhadas às boas práticas de mercado;
• O acesso aos dados é restrito e controlado, prevenindo uso indevido, vazamentos ou tratamentos não autorizados;

Quanto à validade jurídica da assinatura eletrônica, destacamos que ela encontra respaldo na Medida Provisória nº 2.200-2/2001, bem como na Lei nº 14.063/2020, que reconhecem a validade de assinaturas eletrônicas desde que garantidos os requisitos de identificação do signatário e integridade do documento, critérios plenamente atendidos pela utilização da biometria como mecanismo de autenticação.

Dessa forma, entendemos que o procedimento adotado está juridicamente amparado, tecnicamente seguro e em conformidade com a legislação vigente, oferecendo respaldo suficiente para a formalização junto ao cliente e mitigação de eventuais questionamentos judiciais.`
  }
];
