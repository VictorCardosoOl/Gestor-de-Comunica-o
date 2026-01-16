# QuickComms Studio

O **QuickComms Studio** é uma ferramenta de produtividade desenvolvida para otimizar e padronizar fluxos de comunicação corporativa. Focada em profissionais que lidam com alto volume de e-mails e mensagens (Customer Success, Suporte, Implantação), a aplicação atua como um hub central de modelos inteligentes.

O objetivo principal é eliminar o processo manual de "copiar, colar e editar", reduzindo erros operacionais e garantindo que a comunicação siga o padrão de qualidade da empresa.

## Funcionalidades

### Gestão de Templates
Centralização de scripts de E-mail e WhatsApp em uma interface única, organizada por categorias funcionais (ex: Implantação, Financeiro, Relacionamento).

### Smart Variables (Edição Dinâmica)
O sistema analisa a estrutura do template e identifica automaticamente placeholders (variáveis entre colchetes, como `[Nome do Cliente]` ou `[Data]`). 
- **Preenchimento Sincronizado:** Ao digitar o valor de uma variável no painel lateral, todas as suas ocorrências no texto são atualizadas em tempo real.
- **Prevenção de Erros:** Elimina o risco de enviar um e-mail com "Olá [Nome]" esquecido no corpo do texto.

### Cópia com Formatação (Rich Text)
Diferente de blocos de notas comuns, o QuickComms preserva a estrutura HTML dos templates.
- Ao copiar um e-mail, o conteúdo mantém negritos, itálicos, links e quebras de linha.
- Pronto para colar diretamente no Outlook, Gmail ou ferramentas de CRM.

### Protocolos e Ações Duplas
Suporte nativo para templates compostos, permitindo gerenciar fluxos que exigem duas etapas simultâneas (ex: enviar um comunicado externo ao cliente e registrar um protocolo interno no sistema da empresa).

### UX/UI Editorial
Interface desenvolvida com foco na legibilidade e redução de fadiga visual, utilizando conceitos de *Glassmorphism* e tipografia editorial. O aplicativo é totalmente responsivo e funciona como PWA (Progressive Web App), permitindo instalação local.

## Stack Tecnológica

O projeto foi construído utilizando tecnologias modernas do ecossistema React, priorizando performance e experiência de desenvolvimento.

- **Core:** React 18, TypeScript
- **Estilização:** Tailwind CSS
- **Interface & Animações:** Framer Motion, Lucide React
- **Arquitetura:** Componentização baseada em ES Modules

## Instalação e Execução

Para rodar o projeto localmente:

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

3. Acesse a aplicação no navegador (geralmente em `http://localhost:5173`).

---

*QuickComms Studio — Gestão de Comunicação Eficiente.*