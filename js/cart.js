console.log("teste")
// Recupera o carrinho do localStorage ou começa vazio
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Atualiza o número de itens no badge do carrinho
function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  document.getElementById('cart-count').textContent = count;
}

// Mostra os produtos no modal do carrinho
function renderCart() {
  const tbody = document.getElementById('cart-items');
  tbody.innerHTML = ''; // Limpa a tabela
  let total = 0;

  cart.forEach(item => {
    total += item.price * item.qty;
    tbody.innerHTML += `
      <tr>
        <td>${item.name}</td>
        <td>${item.qty}</td>
        <td>R$ ${(item.price * item.qty).toFixed(2)}</td>
        <td>
          <button class="btn btn-sm btn-outline-danger remove-item" data-id="${item.id}">
            &times;
          </button>
        </td>
      </tr>`;
  });

  document.getElementById('cart-total').textContent = total.toFixed(2);
}

// Salva o carrinho no localStorage e atualiza tela
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  renderCart();
}

// Evento: Adicionar item ao carrinho
document.querySelectorAll('.add-to-cart').forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();

    const id = btn.dataset.id;
    const name = btn.dataset.name;
    const price = parseFloat(btn.dataset.price);

    const existing = cart.find(item => item.id === id);
    if (existing) {
      existing.qty++;
    } else {
      cart.push({ id, name, price, qty: 1 });
    }

    saveCart();
  });
});

// Evento: Remover item do carrinho
document.getElementById('cart-items').addEventListener('click', e => {
  if (e.target.classList.contains('remove-item')) {
    const id = e.target.dataset.id;
    cart = cart.filter(item => item.id !== id);
    saveCart();
  }
});

// Evento: Clique no botão do carrinho para abrir o modal
document.getElementById('cart-button').addEventListener('click', () => {
  renderCart();
  const modal = new bootstrap.Modal(document.getElementById('cartModal'));
  modal.show();
});

// Evento: Finalizar compra (vai para outra página)
document.getElementById('finish-button').addEventListener('click', () => {
  window.location.href = 'carrinhocopy.html';
});

document.querySelector('.btn-close').addEventListener('click', () => {
  document.querySelector('.modal-backdrop')?.remove(); // Remove o backdrop
});
// Inicia o badge e modal com dados salvos
updateCartCount();

document.getElementById('cartModal').addEventListener('hidden.bs.modal', () => {
  document.body.classList.remove('modal-open'); // Remove a classe que pode causar o fundo preto
  document.querySelector('.modal-backdrop')?.remove(); // Remove o backdrop do modal

  // Redireciona o foco para o botão do carrinho
  document.getElementById('cart-button').focus();
});