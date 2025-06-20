document.addEventListener('DOMContentLoaded', () => {
  const btnAbrir = document.getElementById('abrir-carrinho');
  const btnFechar = document.getElementById('fechar-carrinho');
  const btnLimpar = document.getElementById('limpar-carrinho');
  const painelCarrinho = document.getElementById('carrinho');

  // Garante que o carrinho inicie fechado
  if (painelCarrinho) {
    painelCarrinho.hidden = true;
  }

  // Carrega os produtos
  fetch('produtos.json')
    .then(response => response.json())
    .then(produtos => {
      const container = document.querySelector('.produtos-grid');
      container.innerHTML = '';

      produtos.forEach(produto => {
        const article = document.createElement('article');
        article.classList.add('card');
        article.setAttribute('tabindex', '0');

        article.innerHTML = `
          <img src="${produto.imagem}" alt="Capa do álbum ${produto.album} da banda ${produto.banda}" />
          <h3>${produto.banda}</h3>
          <p>${produto.album}</p>
          <span>R$ ${produto.preco.toFixed(2).replace('.', ',')}</span>
          <button type="button" aria-label="Adicionar ${produto.album} ao carrinho">Adicionar ao carrinho</button>
        `;

        article.querySelector('button').addEventListener('click', () => {
          adicionarAoCarrinho(produto);
        });

        container.appendChild(article);
      });

      atualizarCarrinhoVisual();
    })
    .catch(error => console.error('Erro ao carregar produtos:', error));

  // Eventos dos botões do carrinho
  if (btnAbrir && painelCarrinho) {
    btnAbrir.addEventListener('click', () => {
      painelCarrinho.hidden = false;
      atualizarCarrinhoVisual();
    });
  }

  if (btnFechar && painelCarrinho) {
    btnFechar.addEventListener('click', () => {
      painelCarrinho.hidden = true;
    });
  }

  if (btnLimpar) {
    btnLimpar.addEventListener('click', () => {
      localStorage.removeItem('carrinho');
      atualizarCarrinhoVisual();
    });
  }
});

function adicionarAoCarrinho(produto) {
  const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  carrinho.push(produto);
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
  atualizarCarrinhoVisual();
  exibirMensagem(`${produto.album} foi adicionado ao carrinho!`);
}

function exibirMensagem(texto) {
  const mensagem = document.getElementById('mensagem-alerta');
  if (!mensagem) return;

  mensagem.textContent = `✅ ${texto}`;
  mensagem.hidden = false;
  mensagem.classList.add('mostrar');

  // Oculta a mensagem após 3 segundos
  setTimeout(() => {
    mensagem.classList.remove('mostrar');
    setTimeout(() => {
      mensagem.hidden = true;
    }, 500);
  }, 3000);
}


function atualizarCarrinhoVisual() {
  const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  const lista = document.getElementById('lista-carrinho');
  const total = document.getElementById('total-carrinho');
  if (!lista || !total) return;

  lista.innerHTML = '';
  let soma = 0;

  carrinho.forEach((item, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${item.banda} - ${item.album}</span>
      <span>R$ ${item.preco.toFixed(2).replace('.', ',')}</span>
      <button class="remover-item" data-index="${index}" aria-label="Remover ${item.album}">❌</button>
    `;
    soma += item.preco;
    lista.appendChild(li);
  });

  total.textContent = 'Total: R$ ' + soma.toFixed(2).replace('.', ',');

  // Adiciona os eventos de remoção
  document.querySelectorAll('.remover-item').forEach(botao => {
    botao.addEventListener('click', (e) => {
      const index = e.target.dataset.index;
      removerDoCarrinho(parseInt(index));
    });
  });
}

function removerDoCarrinho(index) {
  const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  if (index >= 0 && index < carrinho.length) {
    const removido = carrinho.splice(index, 1)[0]; // remove e guarda
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    atualizarCarrinhoVisual();
    exibirMensagem(`${removido.album} foi removido do carrinho.`);
  }
}

