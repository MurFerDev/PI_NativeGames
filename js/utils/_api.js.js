const BASE_URL = window.location.origin;

/**
 * Recupera o token JWT do localStorage
 */
export function getToken() {
  return localStorage.getItem('token');
}

/**
 * Recupera o usuário logado do localStorage
 */
export function getUsuario() {
  const usuario = localStorage.getItem('usuario');
  return usuario ? JSON.parse(usuario) : null;
}

/**
 * Remove token e usuário do localStorage e redireciona
 */
export function logout() {
  localStorage.clear();
  window.location.href = '/login';
}

/**
 * Headers padrão com ou sem autenticação
 */
function getHeaders(autenticado = false) {
  const headers = { 'Content-Type': 'application/json' };
  if (autenticado) {
    const token = getToken();
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

/**
 * Requisição genérica com método, corpo e autenticação
 */
async function request(method, endpoint, data = null, autenticado = false) {
  const options = {
    method,
    headers: getHeaders(autenticado)
  };
  if (data) options.body = JSON.stringify(data);

  const res = await fetch(`${BASE_URL}${endpoint}`, options);

  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      logout();
    }
    throw new Error(`Erro ${method} ${endpoint}: ${res.status}`);
  }

  return await res.json();
}

// Métodos exportados

export function get(endpoint) {
  return request('GET', endpoint);
}

export function post(endpoint, data) {
  return request('POST', endpoint, data);
}

export function put(endpoint, data) {
  return request('PUT', endpoint, data);
}

export function del(endpoint) {
  return request('DELETE', endpoint);
}

export function getAutenticado(endpoint) {
  return request('GET', endpoint, null, true);
}

export function postAutenticado(endpoint, data) {
  return request('POST', endpoint, data, true);
}

export function putAutenticado(endpoint, data) {
  return request('PUT', endpoint, data, true);
}

export function deleteAutenticado(endpoint) {
  return request('DELETE', endpoint, null, true);
}