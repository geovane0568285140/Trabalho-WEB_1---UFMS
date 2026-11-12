// Arquivo: site.js
// Funcao: formulario de contato da secao "Sobre".
// Nao existe servidor, entao a mensagem nao e enviada de verdade:
// apenas mostramos um aviso de agradecimento na tela.

const formulario = document.getElementById("formContato");

formulario.addEventListener("submit", function (evento) {
  evento.preventDefault(); // impede a pagina de recarregar

  const nome = document.getElementById("contatoNome").value;

  document.getElementById("respostaContato").textContent =
    "Obrigado, " + nome + "! Recebemos sua mensagem.";

  formulario.reset(); // limpa os campos
});
