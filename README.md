# MedTraffic - Plataforma de Tráfego Digital para Saúde

O **MedTraffic** é uma plataforma SaaS multitenant modular desenvolvida em **Next.js** e **NestJS** projetada especificamente para o nicho de saúde (com foco inicial em **cuidadores de idosos/domiciliares** e **psicólogos**). 

A plataforma ajuda profissionais autônomos e empresas de saúde a estruturarem sua presença digital local, captarem leads e criarem campanhas e páginas de captura (Landing Pages) de alta conversão, em total conformidade com as diretrizes da **LGPD (Lei Geral de Proteção de Dados)** e as normas éticas de conselhos de classe como o **CFP** e **CFM/COFEN**.

---

## 🚀 Principais Funcionalidades (MVP - Fase 1)

1. **Painel de Controle Administrativo (SaaS):** Dashboard interativo exibindo métricas de atração e engajamento de leads (Visitas, Cadastro de Leads, Cliques no WhatsApp e Taxa de Conversão).
2. **Gerenciador de Landing Pages:** Geração dinâmica de Landing Pages sob subdomínio personalizado. Templates pré-aprovados injetados automaticamente de acordo com o nicho de atuação do profissional.
3. **Formulário de Captação & Termos LGPD:** Captura segura de contatos do visitante exigindo aceite do termo de consentimento. Gera e grava um log criptográfico SHA-256 (`ConsentLog`) no banco de dados para segurança jurídica da operação.
4. **CRM Kanban de Leads:** Funil de vendas simples (Novo, Em Contato, Agendado, Convertido, Perdido) com alteração interativa de status e ação de contato rápido via link do WhatsApp.
5. **Autonomia de Anúncios e Rastreamento:** Integração de pixels de conversão (Meta Ads Pixel e Google Tag) nas LPs públicas e suporte à conexão de contas próprias de anúncios do profissional.
6. **Integração de WhatsApp Pessoal:** Roteamento de conversões para o WhatsApp do profissional utilizando API de baixo custo e conexão simplificada por QR Code.

---

## 🛠️ Stack Tecnológica

### Backend (API REST)
* **Framework:** NestJS (Node.js) em TypeScript.
* **ORM:** Prisma ORM.
* **Banco de Dados:** SQLite (arquivo local `dev.db` out-of-the-box para desenvolvimento, preparado para migração imediata para PostgreSQL).
* **Segurança:** Criptografia de senhas com `bcrypt` e proteção de rotas privadas via tokens JWT (Passport).

### Frontend (Painel SaaS & Landing Pages)
* **Framework:** Next.js 14 (App Router) em TypeScript.
* **Estilização:** Tailwind CSS (tema clínico personalizado).
* **Iconografia:** Lucide React.
* **Arquitetura:** Design responsivo, elementos glassmorphic e otimização extrema para tempos de carregamento ultra-rápidos (focado em SEO).

---

## 📦 Como Instalar e Executar Localmente

Certifique-se de possuir o **Node.js** (v18 ou superior) instalado em sua máquina.

### 1. Clonar o Repositório e Configurar o Backend
Abra um terminal e execute:
```bash
cd backend
npm install
npm run db:migrate
npm run start:dev
```
A API do backend inicializará com sucesso na porta **3000** (`http://localhost:3000`).

### 2. Configurar e Inicializar o Frontend
Abra um segundo terminal e execute:
```bash
cd frontend
npm install
npm run dev
```
A interface do Next.js iniciará na porta **3001** (`http://localhost:3001`). Acesse o link no seu navegador para ver a plataforma em funcionamento.

---

## 🧪 Testando as APIs REST

Disponibilizamos um arquivo de requisições prontas na raiz do backend: [api_tests.http](backend/api_tests.http). 
Caso utilize o VS Code, instale a extensão **"REST Client"** para testar as rotas de Cadastro, Login, Criação de Perfil, Landing Pages e CRM diretamente do seu editor com um único clique.

---

## 📄 Licença
Este projeto é de propriedade privada e confidencial. Todos os direitos reservados.
