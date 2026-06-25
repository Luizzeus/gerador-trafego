const BASE_URL = 'http://localhost:3000';

async function fetchApi(endpoint: string, options: RequestInit = {}) {
  // Executa apenas no lado do cliente
  let token = null;
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('medtraffic_token');
  }

  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch (e) {
    data = { message: 'Erro ao processar dados de resposta' };
  }

  if (!response.ok) {
    const errorMsg = data.message || 'Erro na requisição à API';
    throw new Error(Array.isArray(errorMsg) ? errorMsg.join(', ') : errorMsg);
  }

  return data;
}

export const api = {
  // Autenticação
  async register(body: any) {
    return fetchApi('/auth/register', { method: 'POST', body: JSON.stringify(body) });
  },

  async login(body: any) {
    return fetchApi('/auth/login', { method: 'POST', body: JSON.stringify(body) });
  },

  // Perfil Profissional
  async saveProfile(body: any) {
    return fetchApi('/profiles', { method: 'POST', body: JSON.stringify(body) });
  },

  async getMyProfile() {
    return fetchApi('/profiles/me', { method: 'GET' });
  },

  async getPublicProfile(id: string) {
    return fetchApi(`/profiles/${id}`, { method: 'GET' });
  },

  // Landing Pages
  async createLp(body: any) {
    return fetchApi('/landing-pages', { method: 'POST', body: JSON.stringify(body) });
  },

  async updateLp(id: string, body: any) {
    return fetchApi(`/landing-pages/${id}`, { method: 'PATCH', body: JSON.stringify(body) });
  },

  async getLpById(id: string) {
    return fetchApi(`/landing-pages/${id}`, { method: 'GET' });
  },

  async getMyLps() {
    return fetchApi('/landing-pages/me', { method: 'GET' });
  },

  async getPublicLp(subdomain: string) {
    return fetchApi(`/landing-pages/public/${subdomain}`, { method: 'GET' });
  },

  // Leads
  async captureLead(body: any) {
    return fetchApi('/leads', { method: 'POST', body: JSON.stringify(body) });
  },

  async getMyLeads() {
    return fetchApi('/leads/crm', { method: 'GET' });
  },

  async updateLeadStatus(id: string, status: string) {
    return fetchApi(`/leads/crm/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  // Sugestões de Campanha e IA
  async getCampaignSuggestions() {
    return fetchApi('/campaign-suggestions/generate', { method: 'GET' });
  },

  // Campanhas de Anúncios & Integrações
  async getCampaigns() {
    return fetchApi('/campaign', { method: 'GET' });
  },

  async createCampaign(body: any) {
    return fetchApi('/campaign', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  async updateCampaignStatus(id: string, status: string) {
    return fetchApi(`/campaign/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  async deleteCampaign(id: string) {
    return fetchApi(`/campaign/${id}`, { method: 'DELETE' });
  },

  async getAdsConnections() {
    return fetchApi('/campaign/connections', { method: 'GET' });
  },

  async connectAdsAccount(body: { provider: string; accountName: string; accountId: string }) {
    return fetchApi('/campaign/connections', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  async disconnectAdsAccount(provider: string) {
    return fetchApi(`/campaign/connections/${provider}`, { method: 'DELETE' });
  },

  // Agendamento & Agenda
  async scheduleAppointment(body: any) {
    return fetchApi('/appointment/schedule', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  async getAppointments() {
    return fetchApi('/appointment', { method: 'GET' });
  },

  async updateAppointmentStatus(id: string, status: string) {
    return fetchApi(`/appointment/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  async deleteAppointment(id: string) {
    return fetchApi(`/appointment/${id}`, { method: 'DELETE' });
  },

  async getGoogleCalendarConnection() {
    return fetchApi('/appointment/google-calendar', { method: 'GET' });
  },

  async connectGoogleCalendar(body: { accountName: string; accountId: string }) {
    return fetchApi('/appointment/google-calendar', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  async disconnectGoogleCalendar() {
    return fetchApi('/appointment/google-calendar', { method: 'DELETE' });
  },

  // Faturamento e Pagamentos
  async getBillingStatus() {
    return fetchApi('/payments/status', { method: 'GET' });
  },

  async getBillingPlans() {
    return fetchApi('/payments/plans', { method: 'GET' });
  },

  async subscribeToPlan(planId: number) {
    return fetchApi('/payments/subscribe', {
      method: 'POST',
      body: JSON.stringify({ planId }),
    });
  },

  async simulatePaymentConfirmation(paymentId: string) {
    return fetchApi(`/payments/simulate-webhook/${paymentId}`, {
      method: 'POST',
    });
  },
};

