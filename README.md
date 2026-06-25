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

### 🟡 Fase 2: Automação & Faturamento (Em Progresso)
* [x] **Módulo de Assinaturas (SaaS):** Integração com o gateway **Asaas** para geração de PIX e faturamento mensal recorrente.
* [x] **Mock Payment Gateway:** Simulador de faturamento local out-of-the-box para testes de webhook sem necessidade de chaves de produção.
* [x] **Emissão de Notas Fiscais (NFS-e):** Geração simulada de URL de notas fiscais a partir da confirmação do webhook.
* [x] **Módulo de Sugestão de Campanhas (Guardrail Ético):** Motor de higienização semântica de termos vetados (ex: impede promessas de "cura", "milagres" ou "garantias", convertendo-os em terminologias educativas e éticas).
* [ ] **Integração Dinâmica com OpenAI (Em Execução):** Geração de anúncios e posts via GPT-4o-mini com Prompt Engineering ético.
* [ ] **Integração de Contas de Anúncios (OAuth2):** Conexão das APIs do Google Ads/Meta Ads para controle direto de orçamentos e publicação via painel.

### 🔴 Fase 3: Ecossistema Conectado (Futuro)
* [ ] **Agendamento Integrado:** Sincronização automática com a agenda do Google e agendador de consultas na LP.
* [ ] **Editor Avançado de Blocos:** Customização livre de layouts de landing pages.
* [ ] **WhatsApp Automation:** Disparador de notificações automáticas via WhatsApp (Evolution API/Z-API).

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
