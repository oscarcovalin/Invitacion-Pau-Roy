// Set the wedding date (Year, Month (0-11), Day, Hour, Min, Sec)
// 11 de Julio de 2026, 16:00
const weddingDate = new Date(2026, 6, 11, 16, 0, 0).getTime();

// Update the countdown every 1 second
const countdownTimer = setInterval(function() {
    
    // Get today's date and time
    const now = new Date().getTime();
    
    // Find the distance between now and the count down date
    const distance = weddingDate - now;
    
    // Time calculations for days, hours, minutes and seconds
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    // Output the result in elements with id
    document.getElementById("days").innerHTML = days < 10 ? "0" + days : days;
    document.getElementById("hours").innerHTML = hours < 10 ? "0" + hours : hours;
    document.getElementById("minutes").innerHTML = minutes < 10 ? "0" + minutes : minutes;
    document.getElementById("seconds").innerHTML = seconds < 10 ? "0" + seconds : seconds;
    
    // If the count down is over, write some text 
    if (distance < 0) {
        clearInterval(countdownTimer);
        document.querySelector(".countdown-wrapper").innerHTML = "<h3>¡Hoy es el gran día!</h3>";
    }
}, 1000);


// Reveal elements on scroll
function reveal() {
    var reveals = document.querySelectorAll(".reveal");
    for (var i = 0; i < reveals.length; i++) {
        var windowHeight = window.innerHeight;
        var elementTop = reveals[i].getBoundingClientRect().top;
        var elementVisible = 100; // when to reveal the element
        
        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add("active");
        }
    }
}

window.addEventListener("scroll", reveal);
// Trigger once on load
reveal();

// Music Player Logic
document.addEventListener('DOMContentLoaded', function() {
    const musicBtn = document.getElementById('music-btn');
    const bgMusic = document.getElementById('bg-music');
    let isPlaying = false;

    function attemptPlay() {
        if (!isPlaying && bgMusic) {
            bgMusic.play().then(() => {
                isPlaying = true;
                if(musicBtn) musicBtn.classList.add('playing');
            }).catch(function(error) {
                console.log("Audio play failed, waiting for user interaction", error);
            });
        }
    }

    if (bgMusic) {
        // Intentar reproducir automáticamente (el navegador puede bloquearlo)
        attemptPlay();
        
        // Escuchar la primera interacción del usuario para desbloquear el audio
        document.body.addEventListener('click', attemptPlay, { once: true });
        document.body.addEventListener('touchstart', attemptPlay, { once: true });
        document.body.addEventListener('scroll', attemptPlay, { once: true });
    }

    if (musicBtn && bgMusic) {
        musicBtn.addEventListener('click', function(e) {
            e.stopPropagation(); // Evitar que el clic en el botón dispare el evento del body
            if (isPlaying) {
                bgMusic.pause();
                musicBtn.classList.remove('playing');
            } else {
                bgMusic.play().catch(function(error) {
                    console.log("Audio play failed", error);
                });
                musicBtn.classList.add('playing');
            }
            isPlaying = !isPlaying;
        });
    }
});

// URL parameters parsing for personalized invitation
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        guest: params.get('n') || params.get('invitado') || 'Familia Invitada',
        passes: parseInt(params.get('p') || params.get('pases')) || 6,
        table: params.get('m') || params.get('mesa') || '14'
    };
}

const invitationData = getUrlParams();

// Update ticket details
const ticketNameEl = document.getElementById('ticket-guest-name');
const ticketPassesEl = document.getElementById('ticket-passes');
const ticketTableEl = document.getElementById('ticket-table');
const ticketQrEl = document.getElementById('ticket-qr');

if (ticketNameEl) ticketNameEl.innerText = invitationData.guest;
if (ticketPassesEl) ticketPassesEl.innerText = invitationData.passes;
if (ticketTableEl) ticketTableEl.innerText = invitationData.table;

// Update QR Code to encode the current URL so scanning it opens this exact guest invitation
if (ticketQrEl) {
    const currentUrl = window.location.href;
    ticketQrEl.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(currentUrl)}`;
}

// Update RSVP guests dropdown based on passes count
const guestsSelect = document.getElementById('guests');
if (guestsSelect) {
    guestsSelect.innerHTML = '';
    for (let i = 1; i <= invitationData.passes; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.text = i + (i === 1 ? ' persona' : ' personas');
        guestsSelect.appendChild(option);
    }
}

// RSVP Form submission (WhatsApp redirection)
const rsvpForm = document.getElementById('rsvp-form');
if (rsvpForm) {
    rsvpForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const btn = this.querySelector('button');
        const name = document.getElementById('name').value;
        const attendance = document.getElementById('attendance').value;
        const guestsCount = document.getElementById('guests').value;
        const message = document.getElementById('message').value;
        
        // REEMPLAZA ESTE NÚMERO CON TU NÚMERO DE WHATSAPP REAL (incluye código de país, ej. 52155XXXXXXXX)
        const phoneNumber = "5215523109700"; 
        
        btn.innerText = 'Redirigiendo a WhatsApp...';
        btn.style.opacity = '0.7';
        
        let textMessage = "";
        if (attendance === 'yes') {
            textMessage = `¡Hola Paulina y Rodrigo! 👋\n\nConfirmo mi asistencia para su boda. 🥂✨\n\n*Nombre:* ${name}\n*Asistentes:* ${guestsCount} de ${invitationData.passes} autorizados.\n*Mesa:* ${invitationData.table}`;
        } else {
            textMessage = `¡Hola Paulina y Rodrigo! 👋\n\nLamento informar que no podré asistir a la boda. 😔\n\n*Nombre:* ${name}`;
        }
        
        if (message) {
            textMessage += `\n*Mensaje:* ${message}`;
        }
        
        const waUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(textMessage)}`;
        
        setTimeout(() => {
            window.open(waUrl, '_blank');
            this.innerHTML = `
                <div style="text-align: center; padding: 20px 0;">
                    <i class="fa-solid fa-circle-check" style="font-size: 3rem; color: #8C7B5D; margin-bottom: 15px;"></i>
                    <h3 style="color: #2F3E46; font-family: 'Playfair Display', serif;">¡Mensaje Generado!</h3>
                    <p>Te hemos redirigido a WhatsApp para enviar tu confirmación.</p>
                </div>
            `;
        }, 1000);
    });
}

// Simple Parallax effect for mobile (iOS Safari fix)
function initMobileParallax() {
    const parallaxElements = document.querySelectorAll('.parallax-section, .hero');
    
    // Solo aplicar en móviles (donde background-attachment: fixed da problemas en iOS)
    if (window.innerWidth <= 768) {
        window.addEventListener('scroll', function() {
            let scrolled = window.pageYOffset;
            
            parallaxElements.forEach(function(section) {
                let offset = section.offsetTop;
                let height = section.offsetHeight;
                
                // Si la sección está visible en pantalla
                if (scrolled + window.innerHeight > offset && scrolled < offset + height) {
                    let yPos = (scrolled - offset) * 0.25; // Velocidad de parallax más sutil para que no se salga de los bordes
                    
                    if(section.classList.contains('hero')) {
                         section.style.setProperty('background-position', `75% calc(25% + ${yPos}px)`, 'important');
                    } else {
                         section.style.setProperty('background-position', `center calc(50% + ${yPos}px)`, 'important');
                    }
                }
            });
        }, { passive: true });
    } else {
        // En desktop, limpiar estilos para usar el CSS nativo
        parallaxElements.forEach(function(section) {
            section.style.removeProperty('background-position');
        });
    }
}

// Inicializar en carga y re-evaluar en resize
window.addEventListener('resize', initMobileParallax);
initMobileParallax();
