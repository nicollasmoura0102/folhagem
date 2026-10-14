// ===== Tela de login: validação e feedback =====

const SENHA_DE_TESTE = "trama1234"; // só para a demonstração (não há back-end)

const formulario = document.querySelector("#formulario-login");
const campoEmail = document.querySelector("#email");
const campoSenha = document.querySelector("#senha");
const erroEmail = document.querySelector("#erro-email");
const erroSenha = document.querySelector("#erro-senha");
const botaoEntrar = document.querySelector("#botao-entrar");
const statusLogin = document.querySelector("#status-login");

function esperar(milissegundos) {
  return new Promise((resolver) => setTimeout(resolver, milissegundos));
}

function mostrarErro(campo, elementoErro, mensagem) {
  elementoErro.textContent = mensagem;
  elementoErro.hidden = mensagem === "";
  campo.setAttribute("aria-invalid", mensagem === "" ? "false" : "true");
}

function validarEmail() {
  let mensagem = "";
  if (campoEmail.validity.valueMissing) {
    mensagem = "Digite seu e-mail.";
  } else if (campoEmail.validity.typeMismatch) {
    mensagem = "Digite um e-mail válido, como nome@exemplo.com.";
  }
  mostrarErro(campoEmail, erroEmail, mensagem);
  return mensagem === "";
}

function validarSenha() {
  let mensagem = "";
  if (campoSenha.validity.valueMissing) {
    mensagem = "Digite sua senha.";
  } else if (campoSenha.validity.tooShort) {
    mensagem = "A senha precisa ter pelo menos 8 caracteres.";
  }
  mostrarErro(campoSenha, erroSenha, mensagem);
  return mensagem === "";
}

function mostrarStatus(texto, tipo) {
  statusLogin.textContent = texto;
  statusLogin.classList.toggle("formulario__status--sucesso", tipo === "sucesso");
  statusLogin.classList.toggle("formulario__status--erro", tipo === "erro");
}

function mostrarCarregando(estaCarregando) {
  botaoEntrar.disabled = estaCarregando;
  botaoEntrar.textContent = estaCarregando ? "Entrando..." : "Entrar";
  if (estaCarregando) {
    mostrarStatus("Verificando seus dados...", "");
  }
}

async function entrar(evento) {
  evento.preventDefault();

  const emailOk = validarEmail();
  const senhaOk = validarSenha();

  if (!emailOk || !senhaOk) {
    mostrarStatus("", "");
    (emailOk ? campoSenha : campoEmail).focus();
    return;
  }

  mostrarCarregando(true);
  await esperar(800); // simula a resposta de um servidor
  mostrarCarregando(false);

  if (campoSenha.value === SENHA_DE_TESTE) {
    mostrarStatus("Tudo certo! Levando você para a loja...", "sucesso");
    await esperar(1000);
    window.location.href = "index.html";
  } else {
    mostrarStatus("E-mail ou senha incorretos. Tente de novo.", "erro");
    campoSenha.focus();
  }
}

formulario.addEventListener("submit", entrar);
campoEmail.addEventListener("blur", validarEmail);
campoSenha.addEventListener("blur", validarSenha);
