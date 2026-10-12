const SECRET_PIN = "112022"; 
const ANNIVERSARY_DATE = new Date("2022-11-06T00:00:00");

let currentPin = "";
const dots = document.querySelectorAll('.pin-dot');
const lockScreen = document.getElementById('view-lock');
const errorMsg = document.getElementById('error-msg');

function updateDots() {
    dots.forEach((dot, index) => {
        if (index < currentPin.length) {
            dot.classList.add('filled');
        } else {
            dot.classList.remove('filled');
        }
    });
}

function addPin(num) {
    if (currentPin.length < 6) {
        currentPin += num;
        updateDots();
        errorMsg.style.opacity = '0';
        
        if (currentPin.length === 6) {
            setTimeout(checkPin, 300); 
        }
    }
}

function clearPin() {
    currentPin = "";
    updateDots();
    errorMsg.style.opacity = '0';
}

function deletePin() {
    currentPin = currentPin.slice(0, -1);
    updateDots();
    errorMsg.style.opacity = '0';
}

function checkPin() {
    if (currentPin === SECRET_PIN) {
        showView('view-dash');
        startCounter();
    } else {
        lockScreen.classList.remove('shake');
        void lockScreen.offsetWidth; 
        lockScreen.classList.add('shake');
        errorMsg.style.opacity = '1';
        setTimeout(clearPin, 600); 
    }
}

function showView(viewId) {
    const views = document.querySelectorAll('.view-container');
    views.forEach(view => {
        view.classList.remove('active');
    });
    document.getElementById(viewId).classList.add('active');
    
    if(viewId === 'view-gallery') {
        updateGallery(); 
    } else if (viewId === 'view-letter') {
        iniciarEscritura(); 
    } else if (viewId === 'view-dash') {
        clearTimeout(typingTimeout); 
    }
}

let counterInterval;

function startCounter() {
    if (counterInterval) clearInterval(counterInterval);
    calculateTime(); 
    counterInterval = setInterval(calculateTime, 1000); 
}

function calculateTime() {
    const now = new Date();
    let diff = now - ANNIVERSARY_DATE;

    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;
    const month = day * 30.416; 
    const year = day * 365.25; 

    const years = Math.floor(diff / year);
    diff -= years * year;

    const months = Math.floor(diff / month);
    diff -= months * month;

    const days = Math.floor(diff / day);
    diff -= days * day;

    const hours = Math.floor(diff / hour);
    diff -= hours * hour;

    const mins = Math.floor(diff / minute);
    diff -= mins * minute;

    const secs = Math.floor(diff / second);

    document.getElementById('t-years').innerText = years;
    document.getElementById('t-months').innerText = months;
    document.getElementById('t-days').innerText = days;
    document.getElementById('t-hours').innerText = hours;
    document.getElementById('t-mins').innerText = mins;
    document.getElementById('t-secs').innerText = secs;
}

const galleryItems = document.querySelectorAll('.gallery-item');
let currentIndex = Math.floor(galleryItems.length / 2); 

function updateGallery() {
    galleryItems.forEach((item, index) => {
        item.className = 'gallery-item'; 
        
        if (index === currentIndex) {
            item.classList.add('active');
        } else if (index === currentIndex - 1) {
            item.classList.add('prev');
        } else if (index === currentIndex + 1) {
            item.classList.add('next');
        } else {
            item.classList.add('hidden');
        }
    });
}

function moveGallery(direction) {
    currentIndex += direction;
    if (currentIndex < 0) currentIndex = 0;
    if (currentIndex >= galleryItems.length) currentIndex = galleryItems.length - 1;
    updateGallery();
}

updateGallery();

const contenedorFotos = document.querySelector('.gallery-wrapper');
let posicionInicialX = 0;
let estaArrastrando = false;

contenedorFotos.addEventListener('touchstart', (e) => {
    posicionInicialX = e.touches[0].clientX;
    estaArrastrando = true;
});

contenedorFotos.addEventListener('touchmove', (e) => {
    if (!estaArrastrando) return;
    let posicionActualX = e.touches[0].clientX;
    let diferencia = posicionActualX - posicionInicialX;

    if (diferencia < -50) {
        moveGallery(1); 
        estaArrastrando = false; 
    } else if (diferencia > 50) {
        moveGallery(-1); 
        estaArrastrando = false;
    }
});

contenedorFotos.addEventListener('touchend', () => { estaArrastrando = false; });

contenedorFotos.addEventListener('mousedown', (e) => {
    posicionInicialX = e.clientX;
    estaArrastrando = true;
});

contenedorFotos.addEventListener('mousemove', (e) => {
    if (!estaArrastrando) return;
    let posicionActualX = e.clientX;
    let diferencia = posicionActualX - posicionInicialX;

    if (diferencia < -50) {
        moveGallery(1); 
        estaArrastrando = false;
    } else if (diferencia > 50) {
        moveGallery(-1); 
        estaArrastrando = false;
    }
});

contenedorFotos.addEventListener('mouseup', () => { estaArrastrando = false; });
contenedorFotos.addEventListener('mouseleave', () => { estaArrastrando = false; });

let typingTimeout;

const lineasCarta = [
    "Amor de mi Vida,",
    "Gracias por ser el refugio de mi vida, por cada instante, cada risa y hasta por los silencios que hemos compartido.",
    "Eres el núcleo de mi universo. Con vos he aprendido lo que realmente significa amar sin medidas y sin miedos.",
    "Hoy cumplimos un año mas juntos, pero sé que nos queda toda una vida por delante para seguir construyendo esta hermosa historia.",
    "Te amo infinitamente Romina."
];

function iniciarEscritura() {
    const contenedor = document.getElementById('contenido-carta');
    contenedor.innerHTML = ""; 
    clearTimeout(typingTimeout); 
    
    let lineaActual = 0;
    let charActual = 0;
    let p = document.createElement('p');
    p.className = "mb-4";
    contenedor.appendChild(p);

    function escribirCaracter() {
        if (lineaActual < lineasCarta.length) {
            if (charActual < lineasCarta[lineaActual].length) {
                p.innerHTML += lineasCarta[lineaActual].charAt(charActual);
                charActual++;
                typingTimeout = setTimeout(escribirCaracter, 40); 
            } else {
                lineaActual++;
                charActual = 0;
                
                if (lineaActual < lineasCarta.length) {
                    p = document.createElement('p');
                    if (lineaActual === lineasCarta.length - 1) {
                        p.className = "text-right mt-6 font-title text-pink-400";
                    } else {
                        p.className = "mb-4";
                    }
                    contenedor.appendChild(p);
                    typingTimeout = setTimeout(escribirCaracter, 600); 
                }
            }
        }
    } // <- Esta llave cierra la función de escribirCaracter
    typingTimeout = setTimeout(escribirCaracter, 500);
} // <- ¡ESTA LLAVE FALTA AQUÍ! Cierra iniciarEscritura()

/* --- Lógica para las Notas de las Fotos --- */

// Escribe aquí la nota personalizada para cada foto (en el mismo orden en el que están en el HTML)
const notasFotos = [
    "Mi vida mia, este dia fue maravilloso, me senti inmensamente feliz.", // Nota para foto 1
    "Nuestra primera foto juntos y el dia que te propuse ser mi novia. Gracias por apoyarme siempre en todo.", // Nota para foto 2
    "31 de diciembre del 2024, pasando nuestro año nuevo juntos.", // Nota para foto 3
    "Acompañandote en unos de tus logros, recibiendote de lo que mas te gusta hacer.", // Nota para foto 4
    "Celebrando mi cumpleaños al lado del amor de mi vida, Te Amo Mi Romina." // Nota para foto 5
];

function abrirNotaFoto() {
    const modal = document.getElementById('photo-modal');
    const textoModal = document.getElementById('photo-modal-text');
    
    // Inyectar el texto correspondiente a la foto actual
    textoModal.innerHTML = `<p class="mb-2">${notasFotos[currentIndex]}</p>`;
    
    // Quitar el hidden para que exista en la pantalla
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    
    // Pequeño retraso para que la animación de opacidad (fade-in) se vea suave
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        modal.classList.add('opacity-100');
    }, 10);
}

function cerrarNotaFoto() {
    const modal = document.getElementById('photo-modal');
    
    // Animación de opacidad (fade-out)
    modal.classList.remove('opacity-100');
    modal.classList.add('opacity-0');
    
    // Esperar a que termine la animación para ocultarlo completamente
    setTimeout(() => {
        modal.classList.remove('flex');
        modal.classList.add('hidden');
    }, 300);
}
// (Asegúrate de borrar la última llave } que tenías al final de todo)