import { Category, CommunicationChannel, Template } from './types';

export const CATEGORIES: Category[] = [
  { id: 'deployment', name: 'Implantação', icon: 'Layers' },
  { id: 'scheduling', name: 'Agendamento', icon: 'Clock' },
  { id: 'operational', name: 'Operacional', icon: 'Sliders' },
  { id: 'relationship', name: 'Relacionamento', icon: 'Users' },
];

export const INITIAL_TEMPLATES: Template[] = [
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
O colaborador demonstrou excelência no atendimento prestado à [Nome Cliente Positivo], da empresa [Empresa], conforme protocolo nº [Protocolo]. O registro evidencia cordialidade, clareza nas orientações e eficiência na resolução da demanda, reforçando o alinhamento com os padrões de qualidade do atendimento ao cliente.`
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

Após uma análise criteriosa, optamos por seguir com outro perfil que se adequa mais especificamente às demandas da vaga neste momento.

Seu currículo permanecerá em nosso banco de talentos para futuras oportunidades.

Desejamos sucesso em sua jornada!`
  }
];