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
};
