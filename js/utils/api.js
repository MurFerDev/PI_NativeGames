// utils/api.js

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
    window.location.href = '/login'; // Redireciona para a página de login
  }
  
  /**
   * Envia uma requisição GET autenticada
   */
  export async function getAutenticado(url) {
    const token = getToken();
  
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  
    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        logout();
      }
      throw new Error('Erro na requisição GET: ' + res.status);
    }
  
    return await res.json();
  }
  
  /**
   * Envia uma requisição POST autenticada
   */
  export async function postAutenticado(url, data) {
    const token = getToken();
  
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
  
    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        logout();
      }
      throw new Error('Erro na requisição POST: ' + res.status);
    }
  
    return await res.json();
  }
  
  /**
   * Envia uma requisição PUT autenticada
   */
  export async function putAutenticado(url, data) {
    const token = getToken();
  
    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
  
    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        logout();
      }
      throw new Error('Erro na requisição PUT: ' + res.status);
    }
  
    return await res.json();
  }
  
  /**
   * Envia uma requisição DELETE autenticada
   */
  export async function deleteAutenticado(url) {
    const token = getToken();
  
    const res = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  
    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        logout();
      }
      throw new Error('Erro na requisição DELETE: ' + res.status);
    }
  
    return await res.json();
  }