/* main.js OPTIMIZADO */
document.addEventListener('DOMContentLoaded', () => {
    // --- 1. LÓGICA DE NAVEGACIÓN (SCROLL SPY) ---
    const navLinks = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('section');
    const navScrollContainer = document.querySelector('.nav-scroll');
    
    let lastId = ''; // Variable para recordar la última sección activa

    window.addEventListener('scroll', () => {
        let current = '';
        
        // Detectar en qué sección estamos
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // Ajustamos el margen de detección (150px antes de llegar)
            if (scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        // Solo hacemos cambios si la sección ha cambiado (ESTO MEJORA EL RENDIMIENTO)
        if (current !== lastId) {
            lastId = current;

            navLinks.forEach(link => {
                link.classList.remove('active');
                // Buscamos el link que corresponde a la sección actual
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                    
                    // Mover el menú horizontalmente de forma suave
                    // Usamos un cálculo simple en lugar de scrollIntoView para evitar saltos
                    const linkRect = link.getBoundingClientRect();
                    const containerRect = navScrollContainer.getBoundingClientRect();
                    
                    // Si el link está fuera de vista, lo movemos
                    if (linkRect.left < containerRect.left || linkRect.right > containerRect.right) {
                        link.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                    }
                }
            });
        }
    });

    // --- 2. MANEJO DE IMÁGENES ROTAS (LOGO FALLBACK) ---
    const ponerLogo = (img) => {
        img.src = 'img/logo.jpg'; 
        img.style.objectFit = 'contain';
        img.style.padding = '20px';
        img.style.backgroundColor = '#fff';
        img.onerror = null;
    };

    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.onerror = () => ponerLogo(img);
        if (img.complete && img.naturalHeight === 0) {
            ponerLogo(img);
        }
    });

    // --- 3. MODAL DE PRODUCTO ---
    const modal = document.getElementById('product-modal');
    // Solo ejecutamos esto si el modal existe en el HTML
    if (modal) {
        const modalImg = document.getElementById('modal-img');
        const modalTitle = document.getElementById('modal-title');
        const modalDesc = document.getElementById('modal-desc');
        const modalPrice = document.getElementById('modal-price');
        const modalWs = document.getElementById('modal-whatsapp');
        const closeModalBtn = document.querySelector('.close-modal');
        const cards = document.querySelectorAll('.product-card');

        cards.forEach(card => {
            card.style.cursor = 'pointer';
            card.addEventListener('click', (e) => {
                // Evitamos abrir si tocan un botón dentro de la tarjeta
                if(e.target.closest('button') || e.target.closest('a')) return;

                const imgSrc = card.querySelector('img')?.src || 'img/logo.jpg';
                const title = card.querySelector('h3')?.textContent || 'Producto';
                const desc = card.querySelector('.desc')?.textContent || '';
                const price = card.querySelector('.price')?.textContent || '';

                if(modalImg) modalImg.src = imgSrc;
                if(modalTitle) modalTitle.textContent = title;
                if(modalDesc) modalDesc.textContent = desc;
                if(modalPrice) modalPrice.textContent = price;

                const mensaje = `Hola, me gustaría pedir: ${title}`;
                if(modalWs) modalWs.href = `https://wa.me/573027569197?text=${encodeURIComponent(mensaje)}`;

                modal.classList.add('active');
            });
        });

        const cerrarModal = () => modal.classList.remove('active');
        if(closeModalBtn) closeModalBtn.addEventListener('click', cerrarModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) cerrarModal();
        });
    }
});