document.addEventListener('DOMContentLoaded', () => {
    
    // --- 0. FIX PARA IPHONE (Habilita el efecto de toque) ---
    // Esta línea es OBLIGATORIA para que el CSS :active funcione en iOS
    document.body.addEventListener('touchstart', function() {}, {passive: true}); 

    // --- 1. PRE-CARGAR IMÁGENES ---
    const preloadImages = () => {
        const images = document.querySelectorAll('.product-card img');
        images.forEach(img => {
            const preloader = new Image();
            preloader.src = img.src;
        });
    };
    preloadImages(); 

    // --- 2. LÓGICA DE NAVEGACIÓN (SCROLL SPY) ---
    const navLinks = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('section');
    const navScrollContainer = document.querySelector('.nav-scroll');
    let lastId = '';

    const onScroll = () => {
        let current = '';
        const scrollPosition = window.scrollY + 180;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        if (current !== lastId) {
            lastId = current;
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                    const containerWidth = navScrollContainer.offsetWidth;
                    const linkLeft = link.offsetLeft;
                    const linkWidth = link.offsetWidth;
                    const scrollTarget = linkLeft - (containerWidth / 2) + (linkWidth / 2);
                    navScrollContainer.scrollTo({ left: scrollTarget, behavior: 'smooth' });
                }
            });
        }
    };
    window.addEventListener('scroll', onScroll);

    // --- 3. MANEJO DE IMÁGENES ROTAS ---
    const ponerLogo = (img) => {
        img.src = 'img/logo.jpg'; 
        img.style.objectFit = 'contain';
        img.style.padding = '8px';
        img.style.backgroundColor = '#fff';
        img.onerror = null;
    };
    document.querySelectorAll('img').forEach(img => {
        img.onerror = () => ponerLogo(img);
        if (img.complete && img.naturalHeight === 0) ponerLogo(img);
    });

    // --- 4. MODAL DE PRODUCTO ---
    const modal = document.getElementById('product-modal');
    if (modal) {
        const clickableItems = document.querySelectorAll('.product-card, .pizza-card, .drink-item, .flavor-tag, .mini-card, .reference-card');
        
        clickableItems.forEach(item => {
            item.style.cursor = 'pointer';

            item.addEventListener('click', (e) => {
                if(e.target.closest('button') || e.target.closest('a')) return;

                const modalImg = document.getElementById('modal-img');
                const modalIcon = document.getElementById('modal-icon');
                const modalTitle = document.getElementById('modal-title');
                const modalDesc = document.getElementById('modal-desc');

                // Limpiar imagen anterior (Pantalla blanca momentánea)
                if (modalImg) modalImg.src = ''; 

                // Lógica visual (Foto vs Ícono)
                // MODIFICADO: Ahora incluye 'flavor-tag' en la condición
                if (item.classList.contains('drink-item') || item.classList.contains('flavor-tag')) {
                    
                    // Ocultamos la etiqueta de imagen normal
                    if(modalImg) modalImg.style.display = 'none';
                    
                    // Mostramos el contenedor del ícono gigante
                    if(modalIcon) {
                        modalIcon.style.display = 'flex';
                        
                        // Buscamos si el elemento ya tiene un ícono adentro (ej. Cervezas o Milo con su estrella)
                        const existingIcon = item.querySelector('i');
                        
                        if (existingIcon) {
                             // Si tiene ícono, usamos ese mismo
                             modalIcon.className = existingIcon.className;
                        } else {
                             // Si NO tiene ícono (ej. Mora, Mango), usamos un vaso de jugo genérico
                             // Puedes cambiar 'fas fa-glass-whiskey' por otro que te guste de FontAwesome
                             modalIcon.className = 'fas fa-glass-whiskey'; 
                        }
                    }
                } else {
                    // Lógica para Hamburguesas, Pizzas, etc. (Se mantiene igual)
                    if(modalIcon) modalIcon.style.display = 'none';
                    if(modalImg) {
                        modalImg.style.display = 'block';
                        const imgInCard = item.querySelector('img');
                        modalImg.src = imgInCard ? imgInCard.src : 'img/logo.jpg';
                    }
                }

                let title = item.getAttribute('data-title') || item.querySelector('h3')?.textContent || item.innerText.split('\n')[0].trim();
                let desc = item.getAttribute('data-desc') || item.querySelector('.desc')?.textContent || '';
                
                if(modalTitle) modalTitle.textContent = title;
                if(modalDesc) modalDesc.textContent = desc;

                let opciones = [];
                const PHONE_NUMBER = '573027569197'; 

                if (item.classList.contains('pizza-card')) {
                    const pPersonal = item.getAttribute('data-p-personal');
                    const pGrande = item.getAttribute('data-p-grande');
                    const pFamiliar = item.getAttribute('data-p-familiar');
                    if(pPersonal) opciones.push({ label: 'Personal', price: pPersonal });
                    if(pGrande)   opciones.push({ label: 'Grande', price: pGrande });
                    if(pFamiliar) opciones.push({ label: 'Familiar', price: pFamiliar });
                }
                else if (item.hasAttribute('data-label-1')) {
                    for (let i = 1; i <= 3; i++) {
                        let label = item.getAttribute(`data-label-${i}`);
                        let price = item.getAttribute(`data-price-${i}`);
                        if (label && price) opciones.push({ label: label, price: price });
                    }
                }

                const multiOptionsContainer = document.getElementById('modal-multi-options');
                const optionsWrapper = document.getElementById('options-container');
                const standardFooter = document.getElementById('modal-standard-footer');
                const modalPrice = document.getElementById('modal-price');
                const modalWs = document.getElementById('modal-whatsapp');

                if (opciones.length > 0) {
                    standardFooter.style.display = 'none';
                    multiOptionsContainer.style.display = 'block';
                    optionsWrapper.innerHTML = '';
                    opciones.forEach(opt => {
                        const btn = document.createElement('a');
                        btn.className = 'size-btn';
                        btn.href = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(`Hola, quiero pedir: ${title} - Opción: ${opt.label} (${opt.price})`)}`;
                        btn.target = '_blank';
                        btn.innerHTML = `${opt.label} <span class="btn-price">${opt.price}</span>`;
                        optionsWrapper.appendChild(btn);
                    });
                } else {
                    multiOptionsContainer.style.display = 'none';
                    standardFooter.style.display = 'flex';
                    let price = item.getAttribute('data-price') || item.querySelector('.price')?.textContent || 'Consultar';
                    if(modalPrice) modalPrice.textContent = price;
                    let mensaje = `Hola, me gustaría pedir: ${title}`;
                    if(modalWs) modalWs.href = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(mensaje)}`;
                }

                modal.classList.add('active');
            });
        });

        const closeModalBtn = document.querySelector('.close-modal');
        const cerrarModal = () => modal.classList.remove('active');
        if(closeModalBtn) closeModalBtn.addEventListener('click', cerrarModal);
        modal.addEventListener('click', (e) => { if (e.target === modal) cerrarModal(); });
    }
});