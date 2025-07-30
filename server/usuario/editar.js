import { getUsuario, getAutenticado, postAutenticado } from '../js/utils/api.js';

const usuario = getUsuario();
if (!usuario) {
  alert('Sessão expirada. Faça login novamente.');
  window.location.href = '/login';
}

// Preenche os campos com os dados atuais
document.querySelector('#nome').value = usuario.nome_usuario || '';
document.querySelector('#apelido').value = usuario.apelido_usuario || '';
document.querySelector('#email').value = usuario.email_usuario || '';
document.querySelector('#telefone').value = usuario.telefone_usuario || '';

// Botão mostrar/ocultar senha
document.querySelector('#toggleSenha').addEventListener('click', () => {
  const senha = document.querySelector('#senha');
  senha.type = senha.type === 'password' ? 'text' : 'password';
});

// Máscara e validação dinâmica de telefone
const telefoneInput = document.querySelector('#telefone');

telefoneInput.addEventListener('input', function (e) {
  let valor = e.target.value.replace(/\D/g, '');

  if (valor.length > 11) valor = valor.slice(0, 11);

  if (valor.length <= 10) {
    valor = valor.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
  } else {
    valor = valor.replace(/^(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
  }

  e.target.value = valor;
});

// Bloqueia letras no campo telefone
telefoneInput.addEventListener('keypress', function (e) {
  const char = String.fromCharCode(e.which);
  if (!/[0-9]/.test(char)) {
    e.preventDefault();
  }
});

// Prevenir colar texto com letras no telefone
telefoneInput.addEventListener('paste', function (e) {
  const texto = (e.clipboardData || window.clipboardData).getData('text');
  if (/\D/.test(texto)) {
    e.preventDefault();
    alert('Cole apenas números no campo de telefone.');
  }
});

// Indicador de força da senha
const senhaInput = document.querySelector('#senha');
const forcaSenhaEl = document.querySelector('#forcaSenha');

senhaInput.addEventListener('input', () => {
  const senha = senhaInput.value;

  const tem10 = senha.length >= 10;
  const temNumero = /[0-9]/.test(senha);
  const temEspecial = /[^A-Za-z0-9]/.test(senha);

  const nivel = tem10 + temNumero + temEspecial;

  if (!senha) {
    forcaSenhaEl.textContent = 'Digite sua nova senha';
    forcaSenhaEl.className = 'form-text text-muted font-weight-bold';
  } else if (!tem10 || !temNumero || !temEspecial) {
    forcaSenhaEl.textContent = 'Senha fraca: mínimo 10 caracteres, 1 número e 1 caractere especial.';
    forcaSenhaEl.className = 'form-text text-danger font-weight-bold';
  } else if (nivel === 3 && senha.length >= 14) {
    forcaSenhaEl.textContent = 'Senha forte!';
    forcaSenhaEl.className = 'form-text text-success font-weight-bold';
  } else {
    forcaSenhaEl.textContent = 'Senha aceitável.';
    forcaSenhaEl.className = 'form-text text-warning font-weight-bold';
  }
});

// Preview da foto de perfil
document.querySelector('#fotoPerfil').addEventListener('change', function (e) {
  const file = e.target.files[0];
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = function (event) {
      document.querySelector('#previewFoto').src = event.target.result;
    };
    reader.readAsDataURL(file);
  }
});

// Envio do formulário
const form = document.querySelector('#formEditar');
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nome = document.querySelector('#nome').value.trim();
  const apelido = document.querySelector('#apelido').value.trim();
  let telefone = document.querySelector('#telefone').value;
  const senha = document.querySelector('#senha').value;
  const confirmaSenha = document.querySelector('#confirmaSenha').value;

  // Sanitiza telefone antes da validação
  telefone = telefone.replace(/\s+/g, '').replace(/[^0-9()-]/g, '');

  // Validação de telefone com regex
  const regexTel = /^\(\d{2}\)\d{4,5}-\d{4}$/;
  if (telefone && !regexTel.test(document.querySelector('#telefone').value)) {
    return alert('Telefone inválido. Use o formato (11) 12345-6789.');
  }

  if (!nome && !apelido && !telefone && !senha) {
    return alert('Preencha ao menos um campo para atualizar.');
  }

  if (senha) {
    const tem10 = senha.length >= 10;
    const temNumero = /[0-9]/.test(senha);
    const temEspecial = /[^A-Za-z0-9]/.test(senha);

    if (!tem10 || !temNumero || !temEspecial) {
      return alert('A senha deve ter no mínimo 10 caracteres, 1 número e 1 caractere especial.');
    }

    if (senha !== confirmaSenha) {
      return alert('As senhas não coincidem.');
    }
  }

  const dados = { nome, apelido, telefone };
  if (senha) dados.senha = senha;

  try {
    await postAutenticado('api/usuario/editar', dados);
    alert('Perfil atualizado com sucesso!');
    window.location.href = '/dashboard';
  } catch (err) {
    console.error(err);
    alert('Erro ao atualizar perfil.');
  }
});