const BASE_URL = window.location.origin;

/**
 * Recupera o token JWT do localStorage
 * @returns {string|null}
 */
export function getToken() {
  return localStorage.getItem('token');
}

/**
 * Recupera o usuário logado do localStorage
 * @returns {object|null}
 */
export function getUsuario() {
  const usuario = localStorage.getItem('usuario');
  return usuario ? JSON.parse(usuario) : null;
}

/**
 * Remove token e usuário do localStorage e redireciona para login
 */
export function logout() {
  localStorage.clear();
  window.location.href = '/login';
}

/**
 * Monta os headers para requisições
 * @param {boolean} autenticado
 * @param {object} extras
 * @returns {object}
 */
function getHeaders(autenticado = false, extras = {}) {
  const headers = { 'Content-Type': 'application/json', ...extras };
  if (autenticado) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

/**
 * Função genérica para requisições HTTP
 * @param {string} method
 * @param {string} endpoint
 * @param {object|null} data
 * @param {boolean} autenticado
 * @param {object} headersExtras
 * @returns {Promise<any>}
 */
async function request(method, endpoint, data = null, autenticado = false, headersExtras = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
  const options = {
    method,
    headers: getHeaders(autenticado, headersExtras)
  };
  if (data) options.body = JSON.stringify(data);

  let res;
  try {
    res = await fetch(url, options);
  } catch (err) {
    throw new Error('Erro de rede ou servidor offline.');
  }

  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      logout();
    }
    let msg = `Erro ${method} ${endpoint}: ${res.status}`;
    try {
      const errJson = await res.json();
      msg += errJson.error ? ` - ${errJson.error}` : '';
    } catch {}
    throw new Error(msg);
  }

  // Se não houver conteúdo, retorna null
  if (res.status === 204) return null;

  // Tenta retornar JSON, se não for, retorna texto
  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await res.json();
  }
  return await res.text();
}

// Métodos públicos para requisições NÃO autenticadas
export function get(endpoint, headersExtras = {}) {
  return request('GET', endpoint, null, false, headersExtras);
}
export function post(endpoint, data, headersExtras = {}) {
  return request('POST', endpoint, data, false, headersExtras);
}
export function put(endpoint, data, headersExtras = {}) {
  return request('PUT', endpoint, data, false, headersExtras);
}
export function del(endpoint, headersExtras = {}) {
  return request('DELETE', endpoint, null, false, headersExtras);
}

// Métodos públicos para requisições autenticadas
export function getAutenticado(endpoint, headersExtras = {}) {
  return request('GET', endpoint, null, true, headersExtras);
}
export function postAutenticado(endpoint, data, headersExtras = {}) {
  return request('POST', endpoint, data, true, headersExtras);
}
export function putAutenticado(endpoint, data, headersExtras = {}) {
  return request('PUT', endpoint, data, true, headersExtras);
}
export function deleteAutenticado(endpoint, headersExtras = {}) {
  return request('DELETE', endpoint, null, true, headersExtras);
}