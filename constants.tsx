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
    title: 'Briefing: Site de Alta Conversão',
    category: 'prompts',
    channel: CommunicationChannel.PROMPT,
    description: 'Estrutura completa para criação de sites focados em aquisição de leads.',
    content: `Desenvolver um ativo digital principal que funcione como um mecanismo eficiente e escalável para a aquisição de leads qualificados, convertendo tráfego em oportunidades comerciais mensuráveis.

1. Objetivos de Comunicação e Percepção
O site deve instilar, de forma consistente, os seguintes atributos:
• Autoridade e Expertise: Posicionar a empresa como referência no setor.
• Confiança e Credibilidade: Transparência e solidez institucional.
• Clareza de Valor: Comunicar eficazmente a proposta de valor única.
• Orientação para Soluções: Foco nas dores e objetivos do cliente.
• Experiência Premium: Qualidade superior em todos os pontos de contato.

2. Escopo de Atuação e Planejamento
Elabore um plano abrangente que cubra as seguintes dimensões do projeto:
• Estratégia de Conteúdo & Conversão: Jornada do usuário, arquitetura de informação e mapeamento de pontos de conversão.
• Experiência do Usuário (UX): Pesquisa, fluxos, wireframes e princípios de usabilidade e acessibilidade.
• Interface do Usuário (UI) & Branding: Direção visual, sistema de design (Design System) e linguagem visual.
• Copywriting & Mensagem: Estratégia de conteúdo persuasivo e tom de voz.
• Tecnologia & Implementação: Stack técnico, performance, SEO e integrações.
• Análise & Otimização: Framework para medição e iteração contínua.

3. Entregáveis Detalhados e Estruturados
3.1. Estratégia e Estrutura do Site
• Sitemap Estratégico: Diagrama hierárquico com todas as páginas e sua relação.
• Blueprint de Conversão: Definição do objetivo primário e micro-conversões para cada página.
• Jornada do Usuário (User Journey Map): Mapa detalhado das etapas, emoções, pontos de contato e gatilhos de decisão.

3.2. Arquitetura de Conversão e CRO
• Mapa de Calls-to-Action (CTAs): Localização, hierarquia visual e copy para cada CTA.
• Estratégia de Formulários: Tipos (lead magnet, contato, qualificação), campos, progressive profiling e gatilhos de exibição.
• Psicologia Aplicada: Identificação dos princípios de persuasão (ex: Prova Social, Urgência, Autoridade) a serem empregados em cada seção.

3.3. Experiência do Usuário (UX)
• Princípios de Usabilidade: Aplicação das 10 Heurísticas de Nielsen.
• Wireframes Textuais/Conceituais: Descrição funcional do layout e elementos-chave de cada página principal.
• Especificações de Acessibilidade: Conformidade com WCAG 2.1 AA, abordando contraste, navegação por teclado e ARIA.
• Estratégia Responsiva: Abordagem Mobile-First, breakpoints e comportamentos adaptativos.

3.4. Sistema de Design (UI) e Direção Visual
• Direção Criativa Conceitual: Descrição do mood (ex: "Tecnológico e Acolhedor", "Minimalista e Ousado").
• Design System Proposital:
  - Paleta de Cores: Primária, secundária, acentos, tons neutros. Especificar a função de cada cor (ação, destaque, fundo).
  - Tipografia: Famílias para cabeçalhos e corpo de texto, escala de tamanhos, peso e alturas de linha.
  - Sistema de Grid: Layout grid para desktops e móveis.
  - Espaçamento (Scale): Sistema baseado em rem ou px para consistência.
• Biblioteca de Componentes: Botões, cards, formulários, seções hero, etc.

3.5. Estratégia de Conteúdo e Copy
• Value Proposition Canvas: Adaptação para a home page.
• Tom de Voz: Definição (ex: "Profissional mas não formal, Conhecível mas não casual").
• Exemplos de Copy Estratégica: Headlines, subheadlines, blocos de benefícios e CTAs para páginas-chave.

4. Análise de Benchmarking e Curadoria de Referências
Realize uma análise crítica de concorrentes diretos e indiretos, bem como de benchmarks de outros setores. Para cada referência (forneça 3-5 exemplos), analise:
• URL do Site.
• Pontos Fortes: Em design, usabilidade, clareza ou conversão.
• Oportunidades Identificadas: Aspectos que podem ser superados.
• Insights Aplicáveis: Elementos ou padrões adaptáveis para este projeto.

5. Requisitos Técnicos e de Performance
5.1. Performance Web
• Otimização para Core Web Vitals (LCP, FID, CLS).
• Estratégias de carregamento (lazy loading, priorização de recursos críticos).
• Meta de pontuação superior a 90 no Google Lighthouse.

5.2. Fundamentos de SEO
• Estrutura semântica HTML5.
• Estratégia de keywords e meta tags.
• Implementação de Schema Markup (LocalBusiness, FAQ, etc.).
• URLs amigáveis e otimização de imagens (alt text, WebP).

5.3. Qualidade de Código e Manutenibilidade
• Arquitetura componentizada e reutilizável.
• Princípios de Clean Code.
• Documentação básica do sistema.

6. Stack Tecnológico Recomendado (Justifique cada sugestão)
• Framework Front-end: [Ex: Next.js para SEO/performance, Astro para conteúdos estáticos].
• Estilização: [Ex: Tailwind CSS para desenvolvimento ágil e consistência].
• Gerenciamento de Estado/Interatividade: [Ex: React Hooks, Zustand].
• Animações: [Ex: Framer Motion para interações complexas].
• CMS/Headless CMS: [Ex: Hygraph, Sanity – se necessário].
• Analytics & Monitoramento: Google Analytics 4, Google Tag Manager.
• Ferramentas de Heatmap & Gravação: [Ex: Hotjar, Microsoft Clarity].

7. Framework de Resposta Esperado
Sua resposta deve ser um documento estruturado e acionável, organizado com base nos tópicos acima. Forneça:
• Racional Estratégico para cada recomendação.
• Exemplos Práticos e sugestões aplicáveis.
• Justificativas baseadas em dados, psicologia do usuário ou tendências de mercado.
• Formatação Clara com uso de títulos, subtítulos e listas para escaneabilidade.

8. Oferta de Personalização Avançada
Para obter um plano 100% personalizado e específico, forneça as informações abaixo:
• Qual o segmento específico do seu cliente? (ex.: advocacia trabalhista, software SaaS para RH, clínica de estética premium)
• Quem é o público-alvo detalhado? (Perfil demográfico, profissional, dores principais, estágio de awareness)
• Quais são as diretrizes de estilo ou identidade visual existentes? (Ex.: "moderno e tecnológico", "confortável e confiável", "arrojado e disruptivo")`
  },
  {
    id: 'auditoria-codigo-senior',
    title: 'Auditoria e Correção de Código',
    category: 'prompts',
    channel: CommunicationChannel.PROMPT,
    description: 'Atue como um Engenheiro de Software Sênior para corrigir e melhorar códigos.',
    content: `Atue como um Engenheiro de Software Sênior especializado em correção prática de código. Seu objetivo exclusivo é analisar trechos de código recebidos, identificar problemas funcionais e de qualidade, e entregar uma versão corrigida e melhorada pronta para uso.

Protocolo de Análise
Execute esta sequência ao receber qualquer código:

Análise de Funcionalidade
Verifique se o código executa corretamente
Identifique erros de lógica ou execução
Detecte casos extremos não tratados
Valide a integridade das operações principais

Avaliação de Qualidade
Identifique violações que impactam manutenibilidade
Detecte duplicações significativas de código
Verifique problemas de segurança evidentes
Analise ineficiências de performance notórias

Determinação de Ação
Decida se são necessários: ajustes, correções ou refatoração
Mantenha alterações mínimas e focadas
Preserve a estrutura original quando viável

Critérios de Correção
Correções Obrigatórias (Faça sempre):
Código que não executa ou produz erros
Comportamento incorreto em cenários normais
Vulnerabilidades de segurança explícitas
Loops infinitos ou condições de bloqueio
Tratamento ausente para valores nulos/críticos

Melhorias Recomendadas (Aplique quando relevante):
Estruturas excessivamente complexas
Duplicação de lógica de negócio
Violações graves de princípios SOLID
Ineficiências algorítmicas evidentes
Código ilegível ou confuso

Ajustes Opcionais (Aplique com discrição):
Refatorações estéticas sem impacto funcional
Otimizações prematuras
Preferências de estilo pessoal

Processo de Resposta
Para cada submissão de código:

Forneça primeiro o código corrigido - completo e pronto para uso

Diretrizes de Implementação
Foque em problemas reais - não em melhorias hipotéticas
Preserve a intenção original - não reescreva funcionalidades que funcionam
Seja conservador - altere apenas o necessário
Mantenha compatibilidade - com o contexto existente
Documente apenas o indispensável - assuma um desenvolvedor competente como usuário

Princípios de Atuação
Você é um corretor de código, não um teórico
Entregue soluções, não apenas diagnósticos
Execute em vez de sugerir
Corrija em vez de descrever
Simplifique sem perder clareza`
  },
  {
    id: 'role-play-design-consultant',
    title: 'Role Play: Consultor de Design Digital',
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
    title: 'Painel de Especialistas: CTO, Design & Produto',
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

Espero que esteja bem.

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

Espero que esteja bem!

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
    title: 'Agendamento + Protocolo (Fase 1)',
    category: 'scheduling',
    channel: CommunicationChannel.EMAIL,
    subject: '[Empresa] | Treinamento Online do Software Sigo (Fase 1)',
    description: 'Modelo duplo: E-mail para o cliente e Protocolo Interno (Task) para o consultor.',
    content: `[Empresa] | Treinamento Online do Software Sigo (Fase 1)

[Saudação],

Espero que estejam bem. 

Conforme combinado, segue agendado o Treinamento Online do Software Sigo (Fase 1) para a empresa [Empresa], conforme programação abaixo, o qual será ministrado pelo nosso Consultor: [Nome do Consultor].

O treinamento será realizado através da plataforma Google Meet, pelo o seguinte link: [Link da Reunião]

[Data] » [Horário Início] às [Horário Fim] – Duração 03h00 
                                                                                                                                   
• Configurações e Cadastros 
• Cadastros e Utilitários  

No anexo seguem os seguintes documentos:

• Fase 1 - Cronograma de Treinamento Sigo
Refere-se ao Cronograma com o conteúdo que será ministrado pelo nosso Consultor, com a recomendação dos departamentos de sua empresa que deverão ser envolvidos na capacitação.

• Ordem de Serviço nº [Número OS] - A - Sigo
Após conclusão do treinamento, peço gentilmente que imprima, preencha e me devolva essa Ordem de Serviço digitalizada, por e-mail.

• Requisição de Dados para Cadastro - Fase 1 - Treinamento Sigo
Refere-se aos dados importantes de serem reservados para serem utilizados no momento do treinamento.`,
    secondaryLabel: 'Protocolo Interno (W-GSC)',
    secondaryContent: `Olá, [Nome do Consultor],
 
Para sua ciência e providência, foi criado no W-GSC uma Tarefa para o senhor ministrar o Treinamento Online do sistema Sigo para a empresa [Empresa] (Fase 1), conforme programação abaixo:
 
[Data] » [Horário Início] às [Horário Fim] – Duração 03h00 
                                                                                                                                   
• Configurações e Cadastros 
• Cadastros e Utilitários  
 
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
O colaborador demonstrou excelência no atendimento prestado à [Nome Cliente Positivo], da empresa [Empresa Positiva], conforme protocolo nº [Protocolo]. O registro evidencia cordialidade, clareza nas orientações e eficiência na resolução da demanda, reforçando o alinhamento com os padrões de qualidade do atendimento ao cliente.`
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