let currentLanguage = 'es';
let currentSlide = 0;
let currentTestimonial = 0;
let cart = JSON.parse(localStorage.getItem('cart')) || [];


function toggleLanguage() {
    currentLanguage = currentLanguage === 'es' ? 'en' : 'es';
    updateLanguage();
    document.getElementById('lang-toggle').textContent = currentLanguage === 'es' ? '🇺🇸 EN' : '🇪🇸 ES';
}

function updateLanguage() {
    const elements = document.querySelectorAll('[data-es][data-en]');
    elements.forEach(element => {
        element.textContent = element.getAttribute(`data-${currentLanguage}`);
    });
}


function changeSlide(direction) {
    const slides = document.querySelectorAll('.slide');
    slides[currentSlide].classList.remove('active');
    
    currentSlide += direction;
    if (currentSlide >= slides.length) currentSlide = 0;
    if (currentSlide < 0) currentSlide = slides.length - 1;
    
    slides[currentSlide].classList.add('active');
}


setInterval(() => {
    if (document.querySelector('.carousel')) {
        changeSlide(1);
    }
}, 5000);


function rotateTestimonials() {
    const testimonials = document.querySelectorAll('.testimonial');
    if (testimonials.length === 0) return;
    
    testimonials[currentTestimonial].classList.remove('active');
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    testimonials[currentTestimonial].classList.add('active');
}

setInterval(rotateTestimonials, 4000);


function addToCart(id, name, price) {
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }
    updateCartCount();
    saveCart();
    Swal.fire({
        title: '¡Agregado!',
        text: `${name} agregado al carrito`,
        imageUrl: '../IMG/gif.gif',
        imageWidth: 100,
        imageHeight: 100,
        showConfirmButton: true,
        confirmButtonText: 'Ver Carrito',
        showCancelButton: true,
        cancelButtonText: 'Continuar Comprando',
        customClass: {
            confirmButton: 'swal-btn-primary',
            cancelButton: 'swal-btn-secondary'
        },
        buttonsStyling: false
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = 'carrito.html';
        }
    });
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartCount();
    saveCart();
    if (document.getElementById('cart-items')) {
        displayCartItems();
    }
}

function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = count;
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function displayCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    
    if (!cartItemsContainer) return;
    
    cartItemsContainer.innerHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div>
                <h4>${item.name}</h4>
                <p>₡${item.price.toLocaleString()} x ${item.quantity}</p>
            </div>
            <div>
                <span>₡${itemTotal.toLocaleString()}</span>
                <button onclick="removeFromCart('${item.id}')" style="margin-left: 1rem; background: #dc3545; color: white; border: none; padding: 0.5rem; border-radius: 3px; cursor: pointer;">Eliminar</button>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
    });
    
    if (cartTotalElement) {
        cartTotalElement.textContent = `Total: ₡${total.toLocaleString()}`;
    }
}


function openTab(tabName, element) {
    const tabContents = document.querySelectorAll('.tab-content');
    const tabButtons = document.querySelectorAll('.tab-button');
    
    tabContents.forEach(content => content.classList.remove('active'));
    tabButtons.forEach(button => button.classList.remove('active'));
    
    document.getElementById(tabName).classList.add('active');
    element.classList.add('active');
}


function animateCounter(element, target) {
    let current = 0;
    const increment = target / 100;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 20);
}


function openLightbox(src, type = 'image') {
    const lightbox = document.getElementById('lightbox');
    const lightboxContent = document.getElementById('lightbox-content');
    
    if (type === 'image') {
        lightboxContent.innerHTML = `<img src="${src}" alt="Imagen ampliada">`;
    } else if (type === 'video') {
        lightboxContent.innerHTML = `<video controls autoplay muted preload="metadata"><source src="${src}" type="video/mp4">Tu navegador no soporta videos HTML5.</video>`;
    }
    
    lightbox.classList.add('active');
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxContent = document.getElementById('lightbox-content');
    
    const video = lightboxContent.querySelector('video');
    if (video) {
        video.pause();
        video.currentTime = 0;
    }
    
    lightbox.classList.remove('active');
    lightboxContent.innerHTML = '';
}

function searchProducts() {
    const searchInput = document.getElementById('search-input');
    const productsContainer = document.getElementById('products-container');
    const loadMoreBtn = document.getElementById('load-more-btn');
    
    if (!searchInput || !productsContainer) return;
    
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    let filteredProducts;
    
    if (searchTerm === '') {
        displayedProducts = 0;
        displayProducts();
        return;
    }
    filteredProducts = allProducts.filter(product => 
        product.name.toLowerCase().includes(searchTerm) || 
        product.description.toLowerCase().includes(searchTerm)
    );
    
    productsContainer.innerHTML = '';
    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        productsContainer.appendChild(productCard);
    });
    
    loadMoreBtn.style.display = 'none';
    if (filteredProducts.length === 0) {
        productsContainer.innerHTML = '<p style="text-align: center; grid-column: 1/-1; padding: 2rem;">No se encontraron productos que coincidan con tu búsqueda.</p>';
    }
}
let allProducts = [];
let displayedProducts = 0;
const productsPerPage = 9;
function createProductCard(product) {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    productCard.innerHTML = `
        <img src="${product.image}" alt="${product.name}" onclick="openLightbox('${product.image}')" style="cursor: pointer;">
        <h3>${product.name}</h3>
        <div class="description">${product.description}</div>
        <div class="price">₡${product.price.toLocaleString()}</div>
        <button onclick="addToCart('${product.id}', '${product.name}', ${product.price})">Agregar al carrito</button>
    `;
    return productCard;
}

async function loadProducts() {
    try {
        const response = await fetch('../JSON/productos.json');
        allProducts = await response.json();
        displayProducts();
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

function displayProducts() {
    const productsContainer = document.getElementById('products-container');
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (!productsContainer) return;
    
    const filteredProducts = getFilteredProducts();
    const productsToShow = filteredProducts.slice(0, displayedProducts + productsPerPage);
    productsContainer.innerHTML = '';
    
    productsToShow.forEach(product => {
        const productCard = createProductCard(product);
        productsContainer.appendChild(productCard);
    });
    
    displayedProducts = productsToShow.length;
    
    if (displayedProducts < filteredProducts.length) {
        loadMoreBtn.style.display = 'block';
    } else {
        loadMoreBtn.style.display = 'none';
    }
}

function loadMoreProducts() {
    displayProducts();
}


let currentCategory = 'all';

let sliderPosition = 0;

function moveSlider(direction) {
    const track = document.getElementById('slider-track');
    if (!track) return;
    
    const slideWidth = 320;
    const totalSlides = track.children.length;
    const maxSlides = totalSlides - 3;
    
    sliderPosition += direction;
    
    if (sliderPosition < 0) sliderPosition = 0;
    if (sliderPosition > maxSlides) sliderPosition = maxSlides;
    
    const translateX = -sliderPosition * slideWidth;
    track.style.transform = `translateX(${translateX}px)`;
}

function filterByCategory(category, btn) {
    currentCategory = category;
    displayedProducts = 0;
    
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    document.getElementById('search-input').value = '';
    
    displayProducts();
}

function getFilteredProducts() {
    if (currentCategory === 'all') {
        return allProducts;
    }
    return allProducts.filter(product => product.category === currentCategory);
}

function mostrarSeleccion() {
    const combo = document.getElementById('simple-combo');
    const mensaje = document.getElementById('mensaje-simple');
    
    if (combo.value) {
        mensaje.innerHTML = 'Has seleccionado: ' + combo.options[combo.selectedIndex].text;
    } else {
        mensaje.innerHTML = '';
    }
}

function actualizarSubcategoria() {
    const categoria = document.getElementById('combo-category').value;
    const subcategoria = document.getElementById('combo-subcategory');
    

    subcategoria.innerHTML = '<option value="">Seleccione subcategoría</option>';
    

    if (categoria === 'plantas') {
        subcategoria.innerHTML += '<option value="tropicales">Tropicales</option>';
        subcategoria.innerHTML += '<option value="ornamentales">Ornamentales</option>';
        subcategoria.innerHTML += '<option value="medicinales">Medicinales</option>';
    } else if (categoria === 'herramientas') {
        subcategoria.innerHTML += '<option value="riego">Riego</option>';
        subcategoria.innerHTML += '<option value="poda">Poda</option>';
        subcategoria.innerHTML += '<option value="siembra">Siembra</option>';
    } else if (categoria === 'fertilizantes') {
        subcategoria.innerHTML += '<option value="organicos">Orgánicos</option>';
        subcategoria.innerHTML += '<option value="quimicos">Químicos</option>';
        subcategoria.innerHTML += '<option value="liquidos">Líquidos</option>';
    }
}


function abrirGuia() {
    const guia = document.getElementById('interactive-combo').value;
    
    if (guia === 'cuidados') {
        window.open('https://www.example.com/cuidados', '_blank');
    } else if (guia === 'enfermedades') {
        window.open('https://www.example.com/enfermedades', '_blank');
    } else if (guia === 'fertilizacion') {
        window.open('https://www.example.com/fertilizacion', '_blank');
    }
}



document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        animateCounter(counter, target);
    });
    
    if (document.getElementById('products-container')) {
        loadProducts();
    }
    
    if (document.getElementById('cart-items')) {
        displayCartItems();
    }
    

    
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }
});


document.addEventListener('DOMContentLoaded', function() {


    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('newsletter-email').value;
            
            console.log('Enviando newsletter con:', { correo: email });
            
            emailjs.send('service_wkc64y3', 'template_urulkzp', {
                correo: email
            }).then((response) => {
                console.log('Newsletter enviado exitosamente:', response);
                if (typeof Swal !== 'undefined') {
                    Swal.fire({
                        title: '¡Gracias por suscribirte!',
                        imageUrl: '../IMG/gif.gif',
                        imageWidth: 100,
                        imageHeight: 100,
                        timer: 2000,
                        showConfirmButton: false
                    });
                } else {
                    alert('¡Gracias por suscribirte!');
                }
                newsletterForm.reset();
            }).catch((error) => {
                console.error('Error al enviar newsletter:', error);
                alert('Error al suscribirse. Intenta nuevamente.');
            });
        });
    }


    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const message = document.getElementById('message').value;
            
            console.log('Enviando contacto con:', { name, email, phone, message });
            
            emailjs.send('service_wkc64y3', 'template_geaw92e', {
                name,
                email,
                phone,
                message,
                service_rating: "",
                products: "",
                recommend: "",
                comments: ""
            }).then((response) => {
                console.log('Contacto enviado exitosamente:', response);
                Swal.fire({
                    title: '¡Mensaje enviado!',
                    text: 'Te contactaremos pronto.',
                    imageUrl: '../IMG/gif.gif',
                    imageWidth: 100,
                    imageHeight: 100,
                    customClass: {
                        confirmButton: 'swal-btn-primary'
                    },
                    buttonsStyling: false
                });
                contactForm.reset();
            }).catch((error) => {
                console.error('Error al enviar contacto:', error);
                alert('Error al enviar mensaje. Intenta nuevamente.');
            });
        });
    }


    const surveyForm = document.getElementById('survey-form');
    if (surveyForm) {
        surveyForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const serviceRating = document.querySelector('input[name="service_rating"]:checked')?.value || "";
            const products = Array.from(document.querySelectorAll('input[name="products[]"]:checked')).map(cb => cb.value).join(', ');
            const recommend = document.querySelector('input[name="recommend"]:checked')?.value || "";
            const comments = document.getElementById('comments').value;
            
            emailjs.send('service_wkc64y3', 'template_geaw92e', {
                name,
                email,
                service_rating: serviceRating,
                products,
                recommend,
                comments,
                phone: "",
                message: ""
            }).then(() => {
                document.querySelector('.survey-section').style.display = 'none';
                document.getElementById('thank-you-section').style.display = 'block';
            }).catch((error) => {
                console.error('Error al enviar encuesta:', error);
                alert('Error al enviar encuesta. Intenta nuevamente.');
            });
        });
    }
});


(function () {
  if (window._petalo_patch_applied) return;
  window._petalo_patch_applied = true;

  function safeInitEmailJS() {
    try {
      if (window.emailjs && !window._petalo_emailjs_inited) {
        emailjs.init("C697doILWoQENFK6H");
        window._petalo_emailjs_inited = true;
        console.log("EmailJS inicializado (parche).");
      }
    } catch (e) {
      console.error("Error inicializando EmailJS:", e);
    }
  }

  setInterval(safeInitEmailJS, 500);
})();