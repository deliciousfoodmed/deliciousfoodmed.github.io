document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            // 200px de margen para detectar bien la sección al bajar
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
                link.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    // 1. Función que pone el logo (Fallback)
    const ponerLogo = (img) => {
        img.src = 'img/logo.jpg'; 
        img.style.objectFit = 'contain';
        img.style.padding = '20px';
        img.style.backgroundColor = '#fff';
        img.onerror = null; // Evita bucles infinitos
    };

    // 2. Seleccionamos todas las imágenes
    const images = document.querySelectorAll('img');

    images.forEach(img => {
        // Caso A: El error ocurre en el futuro (mientras navegas)
        img.onerror = () => ponerLogo(img);

        // Caso B: El error YA ocurrió antes de cargar el script (¡Este es tu problema!)
        // Si la imagen "completó" su carga pero no tiene ancho natural, está rota.
        if (img.complete && img.naturalHeight === 0) {
            ponerLogo(img);
        }
    });
});

/* --- LÓGICA DEL MODAL DE PRODUCTO --- */
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('product-modal');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalPrice = document.getElementById('modal-price');
    const modalWs = document.getElementById('modal-whatsapp');
    const closeModalBtn = document.querySelector('.close-modal');

    // Seleccionar todas las tarjetas de producto
    const cards = document.querySelectorAll('.product-card');

    cards.forEach(card => {
        // Hacemos que el cursor sea una mano para indicar click
        card.style.cursor = 'pointer';

        card.addEventListener('click', () => {
            // 1. Extraer datos de la tarjeta clickeada
            // Usamos optional chaining (?) por si algún elemento no existe
            const imgSrc = card.querySelector('img')?.src || 'img/logo.jpg';
            const title = card.querySelector('h3')?.textContent || 'Producto';
            const desc = card.querySelector('.desc')?.textContent || '';
            const price = card.querySelector('.price')?.textContent || '';

            // 2. Llenar el modal con los datos
            modalImg.src = imgSrc;
            modalTitle.textContent = title;
            modalDesc.textContent = desc;
            modalPrice.textContent = price;

            // 3. Crear enlace de WhatsApp personalizado
            const mensaje = `Hola, me gustaría pedir: ${title}`;
            // Reemplaza el número '573027569197' con el tuyo si es diferente
            modalWs.href = `https://wa.me/573027569197?text=${encodeURIComponent(mensaje)}`;

            // 4. Mostrar el modal
            modal.classList.add('active');
        });
    });

    // Función para cerrar modal
    const cerrarModal = () => {
        modal.classList.remove('active');
    };

    // Cerrar con la X
    closeModalBtn.addEventListener('click', cerrarModal);

    // Cerrar si tocan fuera de la tarjeta (el fondo oscuro)
    modal.addEventListener('click', (e) => {
        if (e.target === modal) cerrarModal();
    });
});