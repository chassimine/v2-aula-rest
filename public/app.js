document.addEventListener('DOMContentLoaded', () => {
    const tshirtForm = document.getElementById('tshirt-form');
    const tshirtList = document.getElementById('tshirt-list');
    const searchForm = document.getElementById('search-form');
    const tshirtDetails = document.getElementById('tshirt-details');
    
    fetchTshirts();

    searchForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const id = document.getElementById('search-id').value;
      
      if (!id) {
        alert('Por favor, insira um ID válido');
        return;
      }
    
      try {
        const response = await fetch(`/tshirt/${id}`);
        
        if (response.status === 404) {
          tshirtDetails.innerHTML = '<p>Camiseta não encontrada</p>';
          tshirtDetails.style.display = 'block';
          return;
        }
        
        if (!response.ok) {
          throw new Error('Erro ao buscar camiseta');
        }
        
        const tshirt = await response.json();
        renderTshirtDetails(tshirt);
        
      } catch (err) {
        console.error('Erro:', err);
        tshirtDetails.innerHTML = '<p>Erro ao buscar camiseta</p>';
        tshirtDetails.style.display = 'block';
      }
    });
    
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
    
    async function fetchTshirts() {
      try {
        const response = await fetch('/tshirt');
        const tshirts = await response.json();
        renderTshirts(tshirts);
      } catch (err) {
        console.error('Erro ao buscar camisetas:', err);
      }
    }

    function renderTshirtDetails(tshirt) {
      tshirtDetails.innerHTML = `
        <h3>${tshirt.name}</h3>
        <p><strong>ID:</strong> ${tshirt.id}</p>
        <p><strong>Preço:</strong> R$${tshirt.price.toFixed(2)}</p>
        <p><strong>Tamanho:</strong> ${tshirt.size || 'Não informado'}</p>
        <p><strong>Cor:</strong> ${tshirt.color || 'Não informada'}</p>
      `;
      tshirtDetails.style.display = 'block';
    }
    
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