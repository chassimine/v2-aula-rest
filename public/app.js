document.addEventListener('DOMContentLoaded', () => {
    const tshirtForm = document.getElementById('tshirt-form');
    const tshirtList = document.getElementById('tshirt-list');
    
    // Carregar camisetas ao iniciar
    fetchTshirts();
    
    // Adicionar nova camiseta
    tshirtForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const newTshirt = {
        name: document.getElementById('name').value,
        price: parseFloat(document.getElementById('price').value),
        size: document.getElementById('size').value || 'M',
        color: document.getElementById('color').value || 'Preto'
      };
      
      try {
        const response = await fetch('/tshirt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newTshirt)
        });
        
        if (response.ok) {
          tshirtForm.reset();
          fetchTshirts();
        } else {
          const error = await response.json();
          alert(`Erro: ${error.error}`);
        }
      } catch (err) {
        console.error('Erro:', err);
        alert('Erro ao adicionar camiseta');
      }
    });
    
    // Buscar camisetas da API
    async function fetchTshirts() {
      try {
        const response = await fetch('/tshirt');
        const tshirts = await response.json();
        renderTshirts(tshirts);
      } catch (err) {
        console.error('Erro ao buscar camisetas:', err);
      }
    }
    
    // Renderizar lista de camisetas
    function renderTshirts(tshirts) {
      tshirtList.innerHTML = '';
      
      tshirts.forEach(tshirt => {
        const li = document.createElement('li');
        li.className = 'tshirt-item';
        li.innerHTML = `
          <div>
            <strong>${tshirt.name}</strong> - R$${tshirt.price.toFixed(2)}
            <div>Tamanho: ${tshirt.size || 'M'}, Cor: ${tshirt.color || 'Preto'}</div>
          </div>
          <button class="delete-btn" data-id="${tshirt.id}">Excluir</button>
        `;
        tshirtList.appendChild(li);
      });
      
      // Adicionar event listeners aos botões de exclusão
      document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', async () => {
          const id = button.getAttribute('data-id');
          try {
            const response = await fetch(`/tshirt/${id}`, { method: 'DELETE' });
            if (response.ok) {
              fetchTshirts();
            } else {
              const error = await response.json();
              alert(`Erro: ${error.error}`);
            }
          } catch (err) {
            console.error('Erro ao excluir:', err);
            alert('Erro ao excluir camiseta');
          }
        });
      });
    }
  });