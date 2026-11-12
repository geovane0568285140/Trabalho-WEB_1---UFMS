// Configuracoes do jogo
const COLUNAS = 15;
const LINHAS = 11;
const LIMITE_INVENTARIO = 5;
const MAX_LIXOS = 12;
const INTERVALO = 2500;

// Tipos de lixo e a lixeira onde cada um deve ser colocado
const TIPOS_LIXO = [
  { simbolo: "📰", nome: "Jornal", tipo: "papel" },
  { simbolo: "📦", nome: "Caixa de papelão", tipo: "papel" },
  { simbolo: "📄", nome: "Folha de papel", tipo: "papel" },
  { simbolo: "🧴", nome: "Frasco plástico", tipo: "plastico" },
  { simbolo: "🥤", nome: "Copo plástico", tipo: "plastico" },
  { simbolo: "🛍️", nome: "Sacola plástica", tipo: "plastico" },
  { simbolo: "🥫", nome: "Lata", tipo: "metal" },
  { simbolo: "🍾", nome: "Garrafa de vidro", tipo: "vidro" },
  { simbolo: "🍷", nome: "Taça de vidro", tipo: "vidro" }
];

// Elementos do HTML usados pelo jogo
const quadrados = document.querySelectorAll("#mapa .celula");
const areaLixos = document.getElementById("lixos");
const elementoJogador = document.getElementById("jogador");
const areaInventario = document.getElementById("inventario");
const elementoPontos = document.getElementById("pontos");
const elementoQuantidade = document.getElementById("qtdInventario");
const elementoMensagem = document.getElementById("mensagem");

// Encontra as lixeiras e guarda suas posicoes no mapa
const lixeiras = [];

quadrados.forEach((quadrado, i) => {
  const elemento = quadrado.querySelector(".lixeira");

  if (elemento) {
    lixeiras.push({
      tipo: elemento.dataset.tipo,
      nome: elemento.dataset.nome,
      x: i % COLUNAS,
      y: Math.floor(i / COLUNAS),
      elemento: elemento
    });
  }
});

// Dados que mudam durante a partida
let jogador = { x: 0, y: 0 };
let inventario = [];
let lixosNoMapa = [];
let pontos = 0;
let selecionado = 0;
let temporizador;

// Verifica se uma posicao existe e nao e uma casa
function podeAndar(x, y) {
  if (x < 0 || y < 0 || x >= COLUNAS || y >= LINHAS) {
    return false;
  }

  const indice = y * COLUNAS + x;
  return !quadrados[indice].classList.contains("casa");
}

// Procura um lixo pela posicao
function buscarLixo(x, y) {
  return lixosNoMapa.find(lixo => lixo.x === x && lixo.y === y);
}

// Procura a lixeira que esta perto do jogador
function buscarLixeiraPerto() {
  return lixeiras.find(lixeira =>
    Math.abs(lixeira.x - jogador.x) <= 1 &&
    Math.abs(lixeira.y - jogador.y) <= 1
  );
}

// Mostra uma mensagem na tela
function mostrarMensagem(texto, tipo = "") {
  elementoMensagem.textContent = texto;
  elementoMensagem.className = tipo;
}

// Cria um lixo em uma posicao livre da rua ou calcada
function gerarLixo() {
  if (lixosNoMapa.length >= MAX_LIXOS) return;

  const lugaresLivres = [];

  quadrados.forEach((quadrado, i) => {
    const x = i % COLUNAS;
    const y = Math.floor(i / COLUNAS);
    const temLixeira = quadrado.querySelector(".lixeira");
    const temJogador = jogador.x === x && jogador.y === y;
    const temLixo = buscarLixo(x, y);

    const podeReceberLixo =
      (quadrado.classList.contains("rua") || quadrado.classList.contains("calcada")) &&
      !temLixeira && !temJogador && !temLixo;

    if (podeReceberLixo) {
      lugaresLivres.push({ x, y });
    }
  });

  // Evita erro caso nao exista mais nenhum lugar livre
  if (lugaresLivres.length === 0) return;

  const lugar = lugaresLivres[Math.floor(Math.random() * lugaresLivres.length)];
  const modelo = TIPOS_LIXO[Math.floor(Math.random() * TIPOS_LIXO.length)];

  lixosNoMapa.push({
    x: lugar.x,
    y: lugar.y,
    simbolo: modelo.simbolo,
    nome: modelo.nome,
    tipo: modelo.tipo
  });
}

// Pega o lixo que estiver na posicao do jogador
function pegarLixo() {
  const lixo = buscarLixo(jogador.x, jogador.y);

  if (!lixo) return;

  if (inventario.length >= LIMITE_INVENTARIO) {
    mostrarMensagem("Inventário cheio. Jogue algum item fora em uma lixeira.", "aviso");
    return;
  }

  inventario.push(lixo);
  lixosNoMapa.splice(lixosNoMapa.indexOf(lixo), 1);
  mostrarMensagem("Você pegou: " + lixo.nome + ".", "aviso");
}

// Move o jogador de acordo com a direcao recebida
function mover(dx, dy) {
  const novoX = jogador.x + dx;
  const novoY = jogador.y + dy;

  if (!podeAndar(novoX, novoY)) return;

  jogador.x = novoX;
  jogador.y = novoY;

  pegarLixo();
  atualizarTela();
}

// Joga o item selecionado na lixeira mais proxima
function jogarFora() {
  const item = inventario[selecionado];
  const lixeira = buscarLixeiraPerto();

  if (!item) {
    mostrarMensagem("Escolha um espaço do inventário que tenha um item.", "aviso");
    return;
  }

  if (!lixeira) {
    mostrarMensagem("Chegue perto de uma lixeira para jogar o item.", "aviso");
    return;
  }

  if (item.tipo === lixeira.tipo) {
    pontos++;
    mostrarMensagem("Correto! " + item.nome + " vai na lixeira de " + lixeira.nome + ". +1 ponto", "acerto");
  } else {
    pontos--;
    const lixeiraCorreta = lixeiras.find(lixeira => lixeira.tipo === item.tipo);
    mostrarMensagem("Errado! " + item.nome + " vai na lixeira de " + lixeiraCorreta.nome + ". -1 ponto", "erro");
  }

  inventario.splice(selecionado, 1);

  // Mantem a selecao dentro dos espacos que ainda existem
  if (selecionado >= inventario.length) {
    selecionado = Math.max(0, inventario.length - 1);
  }

  atualizarTela();
}

// Atualiza a posicao do jogador na tela
function desenharJogador() {
  elementoJogador.style.left = (jogador.x * 100 / COLUNAS) + "%";
  elementoJogador.style.top = (jogador.y * 100 / LINHAS) + "%";
}

// Desenha os lixos que estao no chao
function desenharLixos() {
  areaLixos.innerHTML = "";

  lixosNoMapa.forEach(lixo => {
    const elemento = document.createElement("div");
    elemento.className = "lixo";
    elemento.textContent = lixo.simbolo;
    elemento.style.left = (lixo.x * 100 / COLUNAS) + "%";
    elemento.style.top = (lixo.y * 100 / LINHAS) + "%";
    areaLixos.appendChild(elemento);
  });
}

// Destaca a lixeira que esta ao alcance do jogador
function destacarLixeiraPerto() {
  lixeiras.forEach(lixeira => lixeira.elemento.classList.remove("destaque"));

  const lixeira = buscarLixeiraPerto();
  if (lixeira) {
    lixeira.elemento.classList.add("destaque");
  }
}

// Desenha os espacos do inventario
function desenharInventario() {
  areaInventario.innerHTML = "";

  for (let i = 0; i < LIMITE_INVENTARIO; i++) {
    const espaco = document.createElement("div");
    espaco.className = "espaco";

    if (i === selecionado) {
      espaco.classList.add("selecionado");
    }

    const numero = document.createElement("span");
    numero.className = "numero";
    numero.textContent = i + 1;
    espaco.appendChild(numero);

    if (inventario[i]) {
      espaco.append(inventario[i].simbolo);
      espaco.title = inventario[i].nome;
    }

    espaco.addEventListener("click", () => {
      selecionado = i;
      atualizarTela();
    });

    areaInventario.appendChild(espaco);
  }
}

// Atualiza todas as informacoes visiveis do jogo
function atualizarTela() {
  elementoPontos.textContent = pontos;
  elementoQuantidade.textContent = inventario.length;

  desenharJogador();
  desenharLixos();
  destacarLixeiraPerto();
  desenharInventario();
}

// Controles do teclado
document.addEventListener("keydown", evento => {
  // Se a pessoa estiver digitando em um campo (formulario, nome), o jogo ignora
  if (evento.target.tagName === "INPUT" || evento.target.tagName === "TEXTAREA") return;

  const tecla = evento.key.toLowerCase();

  const movimentos = {
    arrowup: [0, -1],
    w: [0, -1],
    arrowdown: [0, 1],
    s: [0, 1],
    arrowleft: [-1, 0],
    a: [-1, 0],
    arrowright: [1, 0],
    d: [1, 0]
  };

  if (movimentos[tecla]) {
    mover(movimentos[tecla][0], movimentos[tecla][1]);
  } else if (tecla === "e" || tecla === " ") {
    jogarFora();
  } else if (tecla >= "1" && tecla <= "5") {
    selecionado = Number(tecla) - 1;
    atualizarTela();
  }

  if (tecla.startsWith("arrow") || tecla === " ") {
    evento.preventDefault();
  }
});

// Reinicia a partida
function iniciarJogo() {
  jogador = { x: 0, y: 0 };
  inventario = [];
  lixosNoMapa = [];
  pontos = 0;
  selecionado = 0;

  for (let i = 0; i < 5; i++) {
    gerarLixo();
  }

  clearInterval(temporizador);
  temporizador = setInterval(() => {
    gerarLixo();
    atualizarTela();
  }, INTERVALO);

  mostrarMensagem("Pegue os lixos e leve-os à lixeira da cor correta.");
  atualizarTela();
}

document.getElementById("btnReiniciar").addEventListener("click", iniciarJogo);

// Inicia o jogo ao abrir a pagina
iniciarJogo();
