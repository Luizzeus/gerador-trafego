# MedTraffic - Plataforma de Tráfego Digital para Saúde

O **MedTraffic** é uma plataforma SaaS multitenant modular desenvolvida em **Next.js** e **NestJS** projetada especificamente para o nicho de saúde (com foco inicial em **cuidadores de idosos/domiciliares** e **psicólogos**).

A plataforma ajuda profissionais autônomos e agências de saúde a estruturarem sua presença digital local, captarem leads e criarem campanhas e páginas de captura (Landing Pages) de alta conversão, em total conformidade com as diretrizes da **LGPD (Lei Geral de Proteção de Dados)** e as normas éticas de conselhos de classe como o **CFP** e **CFM/COFEN**.

---

## 🗺️ Roadmap de Desenvolvimento & Status das Fases

### 🟢 Fase 1: Core & Validação (Concluída)
* [x] **Modelagem do Banco de Dados:** Banco relacional estruturado com suporte local via SQLite (Prisma ORM) e preparado para PostgreSQL.
* [x] **Módulo de Autenticação:** Cadastro de usuário com papéis (`role`), criptografia de senhas com `bcrypt` e proteção de rotas privadas via JWT.
* [x] **Perfis Profissionais:** Cadastro autodeclarativo de dados e registros (CRP/COREN) para adequação ética.
* [x] **Landing Pages Públicas:** Mapeamento de subdomínios dinâmicos e injeção automática de templates baseados no nicho do profissional.
* [x] **Consentimento LGPD:** Registro inalterável e criptográfico de aceitação do termo (`ConsentLog`) com hash SHA-256 (salvando IP, timestamp e conteúdo).
* [x] **CRM Kanban de Leads:** Funil interativo (Novo, Em Contato, Agendado, Convertido, Perdido) com atalho de redirecionamento rápido para WhatsApp.

### 🟢 Fase 2: Automação & Faturamento (Concluída)
* [x] **Módulo de Assinaturas (SaaS):** Integração com o gateway **Asaas** para geração de PIX e faturamento mensal recorrente.
* [x] **Mock Payment Gateway:** Simulador de faturamento local out-of-the-box para testes de webhook sem necessidade de chaves de produção.
* [x] **Emissão de Notas Fiscais (NFS-e):** Geração simulada de URL de notas fiscais a partir da confirmação do webhook.
* [x] **Módulo de Sugestão de Campanhas (Guardrail Ético):** Motor de higienização semântica de termos vetados (ex: impede promessas de "cura", "milagres" ou "garantias", convertendo-os em terminologias educativas e éticas).
* [x] **Integração Dinâmica com OpenAI:** Geração de anúncios (Google e Meta Ads) e posts de redes sociais via `gpt-4o-mini` com Prompt Engineering ético, com sistema de fallback local inteligente e dupla camada de guardrails semânticos (CFP/CFM).
* [x] **Integração de Contas de Anúncios (OAuth2):** Conexão simulada das APIs do Google Ads/Meta Ads para controle direto de orçamentos e publicação via painel, com acompanhamento de métricas de desempenho em tempo real.

### 🟢 Fase 3: Ecossistema Conectado (Concluída)
* [x] **Agendamento Integrado (Concluído):** Formulário de pré-agendamento público na Landing Page integrado à captura de leads, sincronização simulada com o Google Calendar via OAuth2 mockado, e geração dinâmica de links de reuniões do Google Meet ao confirmar consultas.
* [x] **Editor Avançado de Blocos (Concluído):** Customização livre e visual de blocos de conteúdo da Landing Page (Hero, Benefícios e FAQs) com painel side-by-side de visualização em tempo real (Desktop/Mobile).
* [x] **WhatsApp Automation (Concluído):** Disparador de notificações automáticas via WhatsApp (simulação Evolution API/Z-API) integrado ao CRM de Leads e à Agenda de Consultas.
* [x] **Painel Administrativo Geral (RF-13 - Concluído):** Monitoramento de faturamento consolidado, aprovação e revogação ética de perfis profissionais (CRP/COREN autodeclarados) e auditoria legal global de consentimento LGPD.
* [x] **Exportação de Dados do CRM (RF-14 - Concluído):** Exportação estruturada de leads e logs de consentimento da LGPD em formato CSV para backup, auditoria ou migração externa.
* [x] **Automação de Campanhas Direta (RF-15 - Concluído):** Publicação em tempo real com stepper visual de progresso e console/terminal de payloads JSON (Google Ads v16 e Meta Graph API v19.0) das campanhas lançadas.

### 🟢 Fase 4: Central de Ajuda & Auto-Ajuda (Concluída)
* [x] **Tutoriais e Guias de Tráfego:** Guias interativos integrados com passo a passo sobre conceitos de tráfego, configurações no Google Ads, limites éticos dos conselhos (CFP/CFM) e manuais do MedTraffic.
* [x] **Busca Reativa:** Barra de pesquisa em tempo real que filtra dinamicamente todos os tópicos e perguntas frequentes.
* [x] **Chatbot de Auto-Ajuda Simulado:** Assistente interativo que responde dúvidas com auto-scroll para leitura fluida de mensagens.

---

## 🚀 Implementações Recentes (Fase 3)

Durante as iterações da Fase 3, as seguintes soluções foram desenhadas e implementadas com sucesso:

1. **Agendamento de Consultas na Landing Page**:
   - Adição de checkbox opcional no formulário de contato para agendamento.
   - Seleção dinâmica de data (com bloqueio de datas retroativas) e horários de consulta.
   - Criação automática e vinculada do Lead e da Consulta (`Appointment`) com status pendente no banco de dados.

2. **Gestão de Agenda de Consultas & Google Calendar Sync**:
   - Nova página no painel administrativo (**Agenda de Consultas**) com visualização organizada por abas (Pendentes, Confirmados, Cancelados).
   - Módulo de sincronização via fluxo de consentimento OAuth2 simulado para o Google Calendar, armazenando o status de conexão de forma resiliente na tabela `AdsCredential` (com `provider: 'google_calendar'`).
   - Geração automática e dinâmica de links exclusivos do **Google Meet** (`https://meet.google.com/xxx-xxxx-xxx`) na confirmação de consultas pendentes se a agenda estiver vinculada.
   - Fluxo de cancelamento/declínio que invalida e limpa os links gerados.

3. **Automação de Notificações via WhatsApp (Evolution API / Z-API)**:
   - Nova tela de gerenciamento de WhatsApp (**Automação WhatsApp**) com pareamento simulado por QR Code, personalização de templates e histórico de disparos.
   - Disparo automático de mensagens personalizadas no WhatsApp (com as tags dinâmicas `[Nome]`, `[Data]`, `[Hora]`, e `[MeetLink]`) em eventos de novos leads, confirmações e cancelamento de consultas.
   - Gravação dos disparos como logs de auditoria na tabela `AuditLog` (onde `action: 'SEND_WHATSAPP_NOTIFICATION'`).

4. **Painel Administrativo Geral (RF-13)**:
   - Acesso exclusivo para usuários com a role `admin` (protegido por `AdminGuard` no backend).
   - Visão consolidada da plataforma (faturamento mensal, distribuição de usuários, total de leads, LPs e consultas).
   - Tabela de verificação e aprovação/revogação ética de perfis profissionais autodeclarados (CRP/COREN) persistido diretamente no banco.
   - Auditoria global e detalhada de todos os consentimentos LGPD (IP, User Agent, hash criptográfico e termo aceito).

5. **Exportação de Leads do CRM (RF-14)**:
   - Botão de exportação de dados na interface de CRM Kanban.
   - Lógica de compilação de dados do lead, categorias e hash da LGPD convertendo em CSV com suporte a escape de aspas e codificação UTF-8.
   - Fluxo de download seguro via Blob no lado do cliente Next.js.

6. **Automação de Campanhas Direta (RF-15)**:
   - **Fluxo Visual de Sincronização**: Ao criar/lançar uma campanha (Google ou Meta Ads), a plataforma agora inicia uma animação passo a passo exibindo as etapas de validação de token, alocação de orçamento, criação de grupos de anúncio, vinculação à Landing Page e ativação final.
   - **Visualizador de Payloads de API (Terminal Logs)**: Disponibilização de um botão "Terminal" (ícone de terminal) em cada campanha na listagem. Ao clicar, abre-se um modal interativo e estilizado simulando um console que exibe o payload exato de **Request** e **Response** trafegados em formato JSON estruturado (Google Ads API v16 ou Meta Graph API v19.0), permitindo auditoria técnica direta.

7. **Arquitetura & Estrutura de Arquivos da Fase 3**:
   - **Backend (NestJS):**
     * [appointment.service.ts](file:///c:/Projetos/Gerador-trafego/backend/src/appointment/appointment.service.ts) - Lógica de agendamento, controle de status, geração de link de reuniões e sincronização do Google Calendar.
     * [appointment.controller.ts](file:///c:/Projetos/Gerador-trafego/backend/src/appointment/appointment.controller.ts) - Endpoints públicos e protegidos (JWT) de consulta, status, criação e credenciais.
     * [appointment.module.ts](file:///c:/Projetos/Gerador-trafego/backend/src/appointment/appointment.module.ts) - Definição do módulo de agenda injetando dependências do Prisma e Leads.
     * [whatsapp.service.ts](file:///c:/Projetos/Gerador-trafego/backend/src/whatsapp/whatsapp.service.ts) - Mapeamento de instâncias, templates, triggers e envio de mensagens simuladas.
     * [whatsapp.controller.ts](file:///c:/Projetos/Gerador-trafego/backend/src/whatsapp/whatsapp.controller.ts) - Endpoints protegidos (JWT) para status, conexão, logs e configurações.
     * [whatsapp.module.ts](file:///c:/Projetos/Gerador-trafego/backend/src/whatsapp/whatsapp.module.ts) - Definição global do módulo de WhatsApp.
     * [admin.guard.ts](file:///c:/Projetos/Gerador-trafego/backend/src/auth/admin.guard.ts) - Guarda de segurança que restringe rotas a administradores.
     * [admin.service.ts](file:///c:/Projetos/Gerador-trafego/backend/src/admin/admin.service.ts) - Serviço para estatísticas consolidadas e auditorias do painel.
     * [admin.controller.ts](file:///c:/Projetos/Gerador-trafego/backend/src/admin/admin.controller.ts) - Endpoints de estatísticas, perfis, verificação e logs.
     * [admin.module.ts](file:///c:/Projetos/Gerador-trafego/backend/src/admin/admin.module.ts) - Registro do módulo administrativo.
     * [lead.controller.ts](file:///c:/Projetos/Gerador-trafego/backend/src/lead/lead.controller.ts) - Rota `GET /leads/export` protegida.
     * [lead.service.ts](file:///c:/Projetos/Gerador-trafego/backend/src/lead/lead.service.ts) - Lógica de formatação CSV do CRM.
     * [campaign.controller.ts](file:///c:/Projetos/Gerador-trafego/backend/src/campaign/campaign.controller.ts) - Endpoint `GET /campaign/:id/sync-logs` protegido por JWT para retornar os passos e payloads reais da sincronização.
     * [campaign.service.ts](file:///c:/Projetos/Gerador-trafego/backend/src/campaign/campaign.service.ts) - Lógica de geração determinística e estruturada de logs de sincronização e payloads JSON específicos para Google e Meta Ads.
   - **Frontend (Next.js):**
     * [agenda/page.tsx](file:///c:/Projetos/Gerador-trafego/frontend/src/app/dashboard/agenda/page.tsx) - Painel administrativo da agenda e fluxo simulado do Google OAuth2.
     * [lp/[subdomain]/page.tsx](file:///c:/Projetos/Gerador-trafego/frontend/src/app/lp/%5Bsubdomain%5D/page.tsx) - Integração com o formulário de pré-agendamento e captação de leads.
     * [whatsapp/page.tsx](file:///c:/Projetos/Gerador-trafego/frontend/src/app/dashboard/whatsapp/page.tsx) - Tela de automação de WhatsApp, pareamento QR e logs de disparos.
     * [admin/page.tsx](file:///c:/Projetos/Gerador-trafego/frontend/src/app/dashboard/admin/page.tsx) - Painel geral de administração da plataforma.
     * [crm/page.tsx](file:///c:/Projetos/Gerador-trafego/frontend/src/app/dashboard/crm/page.tsx) - Botão e fluxo de download do CSV.
     * [campaigns/page.tsx](file:///c:/Projetos/Gerador-trafego/frontend/src/app/dashboard/campaigns/page.tsx) - Integração com o stepper visual de publicação e modal de visualização de logs JSON de API com estilo terminal escuro.
     * [api.ts](file:///c:/Projetos/Gerador-trafego/frontend/src/lib/api.ts) - Integração com a função `getCampaignSyncLogs` para consumo da nova rota no backend.
     * [help/page.tsx](file:///c:/Projetos/Gerador-trafego/frontend/src/app/dashboard/help/page.tsx) - Tela da Central de Ajuda, contendo guias de tráfego, modal de passo a passo detalhado, FAQs reativos e assistente virtual de suporte.

---

## 🚀 Implementações Recentes (Fase 4)

Durante a iteração da Fase 4, a seguinte solução de auto-ajuda e treinamento foi implementada com sucesso:

1. **Central de Ajuda & Tutoriais de Tráfego**:
   - **Guias Didáticos**: Artigos explicativos sobre os conceitos de Tráfego Orgânico vs. Pago, o funcionamento do leilão e orçamentos do Google Ads, e a adequação ética exigida pelo CFP e CFM/COFEN.
   - **Modal de Passo a Passo Detalhado**: Clicar em qualquer guia de aprendizado abre um modal que exibe o manual detalhado com checklists enumerados e dicas de especialistas.
   - **FAQs Reativos**: Seção de perguntas frequentes estruturada em acordeões que respondem de imediato a dúvidas sobre domínios próprios, pagamentos e logs de terminal.
   - **Busca em Tempo Real**: Campo de pesquisa superior reativo que filtra instantaneamente as categorias de artigos e perguntas frequentes.
   - **Assistente Virtual com Digitação Humanizada**: Chatbot de suporte simulado que responde com um efeito de escrita em tempo real (palavra por palavra com intervalo de 45ms), barra de rolagem com auto-scroll reativo e bloqueio de inputs temporário enquanto o bot digita.
   - **Filtro de Escopo e Respostas Enriquecidas**: O bot responde diretamente com instruções passo a passo para todos os tópicos de uso do MedTraffic e possui um detector que bloqueia perguntas de fora do contexto (off-topic), informando de forma polida seu foco exclusivo de suporte para a plataforma.

---

## 🚀 Implementações Recentes (Fase 2)

Durante as iterações da Fase 2, as seguintes soluções foram desenhadas e implementadas com sucesso:

1. **Módulo de Assinaturas SaaS & Simulador de Webhook**:
   - Integração das assinaturas de planos mensais via API do **Asaas** com suporte a pagamentos recorrentes e PIX.
   - Criação de um endpoint simulado de webhook (`/payments/simulate-webhook/:id`) que permite disparar a confirmação de recebimento direto no banco local (SQLite) sem necessidade de configuração de chaves externas de produção em ambiente local.
   - Simulação automática de emissão de NFS-e anexando uma URL de visualização fictícia à transação quitada.

2. **Integração Resiliente com OpenAI & Guardrails Éticos**:
   - Desenvolvimento do motor de IA integrado no backend NestJS (utilizando a API `fetch` nativa) direcionado ao modelo `gpt-4o-mini`.
   - Inclusão de um prompt de sistema rigoroso para garantir a conformidade com as diretrizes do Conselho Federal de Psicologia (CFP) e do Conselho Federal de Medicina/Enfermagem (CFM/COFEN).
   - **Mecanismo de Fallback local**: Caso o token da OpenAI não esteja configurado no ambiente local (`OPENAI_API_KEY`) ou se a chamada falhar por cota/rede, a aplicação detecta o erro e recorre imediatamente à geração baseada em templates dinâmicos geolocalizados locais, retornando status transparente (`source: 'local'`).
   - **Dupla camada de Guardrails**: Tanto o conteúdo retornado pela OpenAI quanto os templates locais passam por uma verificação semântica estrita para neutralizar e sanitizar termos proibidos (ex: trocando promessas de "cura rápida" ou "garantias" por linguagem acolhedora e informativa, em conformidade ética).

3. **Integração de Contas de Anúncios (OAuth2) & Gestão de Campanhas**:
   - Conexão e desconexão de contas do Google Ads e Meta Ads através de fluxo OAuth2 simulado com tela de consentimento de escopos de anúncio.
   - Painel interativo de **Campanhas de Anúncios** com listagem de campanhas ativas, controle de execução (Play/Pause) e exclusão.
   - Geração de **Métricas de Performance Dinâmicas** (Gasto, Impressões, Cliques, CTR, Conversões, CPC) calculadas de forma determinística e incremental a partir do orçamento diário da campanha para simular o tráfego de leads qualificados.
   - Wizard passo a passo para lançar campanhas vinculadas às Landing Pages publicadas do usuário, importando automaticamente as copys recomendadas pela IA com apenas um clique.

---

## 🛠️ Stack Tecnológica

### Backend (API REST)
* **Framework:** NestJS (Node.js) em TypeScript.
* **ORM:** Prisma ORM.
* **Banco de Dados:** SQLite (arquivo local `dev.db` para desenvolvimento, migrável para PostgreSQL).
* **Segurança:** Senhas criptografadas com `bcrypt` e proteção via JWT (Passport).

### Frontend (SaaS & Landing Pages)
* **Framework:** Next.js 14 (App Router) em TypeScript.
* **Estilização:** Tailwind CSS (tema clínico).
* **Iconografia:** Lucide React.
* **Acessibilidade & Otimização:** Layout adaptável e responsivo, focado em SEO e performance.

---

## 📦 Como Instalar e Executar Localmente

Certifique-se de possuir o **Node.js** (v18 ou superior) instalado em sua máquina.

### 1. Inicializar e Popular o Banco de Dados
Acesse a pasta do backend, instale as dependências, execute as migrações e rode o script de seed para criar os planos de assinatura e as categorias de serviço padrões:
```bash
cd backend
npm install
npm run db:migrate
npx prisma db seed
```

### 2. Executar o Backend (API REST)
Com as dependências instaladas, inicialize o servidor de desenvolvimento:
```bash
npm run start:dev
```
A API inicializará em `http://localhost:3000`.

### 3. Configurar e Inicializar o Frontend
Abra um segundo terminal e execute:
```bash
cd frontend
npm install
npm run dev
```
A interface do Next.js iniciará na porta **3001** (`http://localhost:3001`).

---

## 🧪 Testando as APIs REST

Disponibilizamos um arquivo de requisições prontas na raiz do backend: [api_tests.http](backend/api_tests.http).
Instale a extensão **"REST Client"** no seu editor de código para testar as rotas de Cadastro, Login, Perfil, Landing Pages, Leads/CRM e Faturamento diretamente.

---

## 📄 Licença
Este projeto é de propriedade privada e confidencial. Todos os direitos reservados.
