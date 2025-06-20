document.addEventListener('DOMContentLoaded', () => {
  fetch('produtos.json')
    .then(response => response.json())
    .then(produtos => {
      const container = document.querySelector('.produtos-grid');
      container.innerHTML = '';
      produtos.forEach(produto => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
          <img src="${produto.imagem}" alt="${produto.banda} - ${produto.album}" />
          <h3>${produto.banda}</h3>
          <p>${produto.album}</p>
          <span>R$ ${produto.preco.toFixed(2).replace('.', ',')}</span>
          <button>Adicionar ao carrinho</button>
        `;
        container.appendChild(card);
      });
    })
    .catch(error => console.error('Erro ao carregar produtos:', error));
});

