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

### 🟡 Fase 3: Ecossistema Conectado (Em Progresso)
* [x] **Agendamento Integrado (Concluído):** Formulário de pré-agendamento público na Landing Page integrado à captura de leads, sincronização simulada com o Google Calendar via OAuth2 mockado, e geração dinâmica de links de reuniões do Google Meet ao confirmar consultas.
* [x] **Editor Avançado de Blocos (Concluído):** Customização livre e visual de blocos de conteúdo da Landing Page (Hero, Benefícios e FAQs) com painel side-by-side de visualização em tempo real (Desktop/Mobile).
* [ ] **WhatsApp Automation:** Disparador de notificações automáticas via WhatsApp (Evolution API/Z-API).

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

3. **Arquitetura & Estrutura de Arquivos da Fase 3**:
   - **Backend (NestJS):**
     * [appointment.service.ts](file:///c:/Projetos/Gerador-trafego/backend/src/appointment/appointment.service.ts) - Lógica de agendamento, controle de status, geração de link de reuniões e sincronização do Google Calendar.
     * [appointment.controller.ts](file:///c:/Projetos/Gerador-trafego/backend/src/appointment/appointment.controller.ts) - Endpoints públicos e protegidos (JWT) de consulta, status, criação e credenciais.
     * [appointment.module.ts](file:///c:/Projetos/Gerador-trafego/backend/src/appointment/appointment.module.ts) - Definição do módulo de agenda injetando dependências do Prisma e Leads.
   - **Frontend (Next.js):**
     * [agenda/page.tsx](file:///c:/Projetos/Gerador-trafego/frontend/src/app/dashboard/agenda/page.tsx) - Painel administrativo da agenda e fluxo simulado do Google OAuth2.
     * [lp/[subdomain]/page.tsx](file:///c:/Projetos/Gerador-trafego/frontend/src/app/lp/%5Bsubdomain%5D/page.tsx) - Integração com o formulário de pré-agendamento e captação de leads.

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
