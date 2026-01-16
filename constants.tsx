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

Prezado(a) [Nome],

Para finalizarmos o cadastro no sistema, preciso dos dados do seu suplente/supervisor:

• Nome completo:
• Setor/Função:
• E-mail Corporativo:
• Telefone/WhatsApp:

É fundamental que ambos participem dos treinamentos agendados para garantir o uso correto da plataforma.

Atenciosamente,`
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

Prezadas, [Saudação]!

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
    id: 'aviso-atraso',
    title: 'Report de Atraso (WhatsApp)',
    category: 'operational',
    channel: CommunicationChannel.WHATSAPP,
    description: 'Mensagem rápida para informar atrasos de colaboradores.',
    content: `[Saudação], [Nome do Gestor],
Espero que esteja bem.

Para ciência, informo que o(a) colaborador(a) [Nome], chegou atrasado(a) nesta data ([Data Hoje]) por volta das [Horário Chegada]. O horário padrão é [Horário Padrão].

Justificativa apresentada: [Motivo, ex: trânsito/transporte].`
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

Boa tarde,

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
  }
];