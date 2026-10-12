// ===== Página inicial: banner, busca e produtos =====

const PREFIXO = "folhagem:";

// ---------- Dados (a tela é desenhada a partir deles) ----------
const banners = [
  { titulo: "Mais verde na sua casa", texto: "Até 30% de desconto em folhagens e vasos.", emojis: ["🌿", "🌵"], tema: 1 },
  { titulo: "Suculentas para a mesa de trabalho", texto: "Pouca água e muito charme.", emojis: ["🌵", "🪴"], tema: 2 },
  { titulo: "Vasos de cerâmica novos", texto: "Escolha o tamanho certo para sua planta.", emojis: ["🏺", "🪴"], tema: 3 },
  { titulo: "Kits de presente", texto: "Planta, vaso e cartão prontos para entregar.", emojis: ["🎁", "🌿"], tema: 1 },
  { titulo: "Cuidados com as plantas", texto: "Dicas simples de rega e luz.", emojis: ["💧", "☀️"], tema: 2 },
];

const produtos = [
  { id: 1, nome: "Jiboia", descricao: "Vaso de 15 cm, fácil de cuidar.", preco: 39.9, emoji: "🪴", favorito: false },
  { id: 2, nome: "Samambaia", descricao: "Ideal para cantos com sombra.", preco: 49.9, emoji: "🌿", favorito: false },
  { id: 3, nome: "Zamioculca", descricao: "Aguenta pouca luz e pouca água.", preco: 59.9, emoji: "🪴", favorito: false },
  { id: 4, nome: "Echeveria", descricao: "Suculenta em vaso de cerâmica.", preco: 24.9, emoji: "🌵", favorito: false },
  { id: 5, nome: "Costela-de-adão", descricao: "Folhas grandes, vaso de 21 cm.", preco: 89.9, emoji: "🍃", favorito: false },
];

// ---------- Estado ----------
let bannerAtual = 0;
let termoBusca = "";

// ---------- Elementos da página ----------
const hero = document.querySelector("#hero");
const heroTitulo = document.querySelector("#hero-titulo");
const heroTexto = document.querySelector("#hero-texto");
const heroMeio = document.querySelector("#hero-meio");
const heroDireita = document.querySelector("#hero-direita");
const bolinhas = document.querySelectorAll(".bolinha");
const listaProdutos = document.querySelector("#lista-produtos");
const statusVitrine = document.querySelector("#vitrine-status");
const modeloProduto = document.querySelector("#modelo-produto");
const campoBusca = document.querySelector("#busca");
const formBusca = document.querySelector("#form-busca");
const aviso = document.querySelector("#aviso");

// ---------- Favoritos salvos no navegador ----------
function carregarFavoritos() {
  try {
    const salvos = JSON.parse(localStorage.getItem(PREFIXO + "favoritos")) || [];
    produtos.forEach((produto) => {
      produto.favorito = salvos.includes(produto.id);
    });
  } catch (erro) {
    console.warn("Não foi possível ler os favoritos:", erro);
  }
}

function salvarFavoritos() {
  try {
    const ids = produtos.filter((p) => p.favorito).map((p) => p.id);
    localStorage.setItem(PREFIXO + "favoritos", JSON.stringify(ids));
  } catch (erro) {
    console.warn("Não foi possível salvar os favoritos:", erro);
  }
}

// ---------- Banner ----------
function renderBanner() {
  const banner = banners[bannerAtual];

  heroTitulo.textContent = banner.titulo;
  heroTexto.textContent = banner.texto;
  heroMeio.textContent = banner.emojis[0];
  heroDireita.textContent = banner.emojis[1];

  [1, 2, 3].forEach((numero) => {
    hero.classList.toggle("hero--tema-" + numero, numero === banner.tema);
  });

  bolinhas.forEach((bolinha, indice) => {
    if (indice === bannerAtual) {
      bolinha.setAttribute("aria-current", "true");
    } else {
      bolinha.removeAttribute("aria-current");
    }
  });
}

function mudarBanner(passo) {
  bannerAtual = (bannerAtual + passo + banners.length) % banners.length;
  renderBanner();
}

function irParaBanner(indice) {
  bannerAtual = indice;
  renderBanner();
}

// ---------- Produtos ----------
function formatarPreco(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function tirarAcentos(texto) {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function filtrarProdutos() {
  const busca = tirarAcentos(termoBusca);
  return produtos.filter((produto) => tirarAcentos(produto.nome).includes(busca));
}

function criarCartao(produto) {
  const cartao = modeloProduto.content.cloneNode(true);
  const botao = cartao.querySelector(".produto__favorito");

  cartao.querySelector(".produto__imagem").textContent = produto.emoji;
  cartao.querySelector(".produto__nome").textContent = produto.nome;
  cartao.querySelector(".produto__descricao").textContent = produto.descricao;
  cartao.querySelector(".produto__preco").textContent = formatarPreco(produto.preco);

  botao.dataset.id = produto.id;
  botao.setAttribute("aria-pressed", String(produto.favorito));
  botao.setAttribute(
    "aria-label",
    (produto.favorito ? "Remover dos favoritos: " : "Favoritar: ") + produto.nome
  );
  return cartao;
}

function renderProdutos() {
  const visiveis = filtrarProdutos();

  listaProdutos.replaceChildren(...visiveis.map(criarCartao));

  // Estado vazio
  statusVitrine.textContent =
    visiveis.length === 0 ? "Nenhuma planta encontrada para “" + termoBusca + "”. Tente outro nome." : "";
}

function alternarFavorito(id) {
  const produto = produtos.find((p) => p.id === id);
  produto.favorito = !produto.favorito;
  salvarFavoritos();
  renderProdutos();

  // O botão foi redesenhado: devolve o foco para quem usa teclado
  listaProdutos.querySelector('[data-id="' + id + '"]')?.focus();
  aviso.textContent = produto.nome + (produto.favorito ? " adicionada aos favoritos." : " removida dos favoritos.");
}

function rolarLista(direcao) {
  const reduzirMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  listaProdutos.scrollBy({
    left: direcao * listaProdutos.clientWidth * 0.8,
    behavior: reduzirMovimento ? "auto" : "smooth",
  });
}

// ---------- Eventos ----------
document.querySelector("#hero-anterior").addEventListener("click", () => mudarBanner(-1));
document.querySelector("#hero-proxima").addEventListener("click", () => mudarBanner(1));
bolinhas.forEach((bolinha) => {
  bolinha.addEventListener("click", () => irParaBanner(Number(bolinha.dataset.indice)));
});

document.querySelector("#lista-anterior").addEventListener("click", () => rolarLista(-1));
document.querySelector("#lista-proxima").addEventListener("click", () => rolarLista(1));

listaProdutos.addEventListener("click", (evento) => {
  const botao = evento.target.closest(".produto__favorito");
  if (botao) {
    alternarFavorito(Number(botao.dataset.id));
  }
});

formBusca.addEventListener("submit", (evento) => {
  evento.preventDefault();
  termoBusca = campoBusca.value.trim();
  renderProdutos();
});

campoBusca.addEventListener("input", () => {
  termoBusca = campoBusca.value.trim();
  renderProdutos();
});

// ---------- Início ----------
async function iniciar() {
  renderBanner();
  statusVitrine.textContent = "Carregando plantas..."; // estado de carregamento
  await new Promise((resolver) => setTimeout(resolver, 400));
  carregarFavoritos();
  renderProdutos();
}

iniciar();
