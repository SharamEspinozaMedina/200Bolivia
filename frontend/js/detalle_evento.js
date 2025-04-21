document.addEventListener('DOMContentLoaded', function () {
    // Obtener ID del evento de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('id');

    // Simulación de datos (en producción sería una llamada AJAX)
    const evento = {
        id: eventId,
        nombre: "Feria Gastronómica Nacional",
        descripcion: "Exhibición de platos típicos de todas las regiones del país. Un evento para disfrutar de la diversidad culinaria boliviana con chefs invitados y demostraciones en vivo.",
        fecha: "2023-08-15",
        ubicacion: "Plaza Principal, La Paz",
        estado: "activo",
        tipo: "gastronomico",
        imagen: "img/eventos/gastronomia.jpg",
        rating: 8.7,
        organizador: {
            nombre: "Ministerio de Culturas",
            avatar: "img/organizadores/ministerio.jpg",
            contacto: "info@culturas.gob.bo"
        },
        participantes: [
            { nombre: "Chef María Fernández", rol: "Jurado", avatar: "img/participantes/chef1.jpg" },
            { nombre: "Chef Carlos Méndez", rol: "Expositor", avatar: "img/participantes/chef2.jpg" },
            { nombre: "Sommelier Laura Ríos", rol: "Catadora", avatar: "img/participantes/sommelier.jpg" }
        ],
        colaboradores: [
            { nombre: "Coca-Cola", rol: "Patrocinador", logo: "img/colaboradores/cocacola.png" },
            { nombre: "La Razón", rol: "Media Partner", logo: "img/colaboradores/larazon.png" }
        ],
        cronograma: [
            { hora: "09:00", actividad: "Inauguración" },
            { hora: "10:00", actividad: "Demostración cocina andina" },
            { hora: "12:00", actividad: "Degustación pública" },
            { hora: "15:00", actividad: "Concurso de platos típicos" }
        ],
        recursos: [
            { nombre: "Mesas", cantidad: 50 },
            { nombre: "Sillas", cantidad: 200 },
            { nombre: "Equipo de sonido", cantidad: 3 }
        ]
    };

    renderEventoDetalle(evento);
});

function renderEventoDetalle(evento) {
    const container = document.getElementById('evento-detalle');

    const participantesHTML = evento.participantes.map(p => `
        <div class="participante-card">
            <img src="${p.avatar}" alt="${p.nombre}" class="participante-img">
            <h5>${p.nombre}</h5>
            <p class="text-muted">${p.rol}</p>
        </div>
    `).join('');

    const colaboradoresHTML = evento.colaboradores.map(c => `
        <div class="colaborador-card">
            <img src="${c.logo}" alt="${c.nombre}" class="colaborador-img">
            <h5>${c.nombre}</h5>
            <p class="text-muted">${c.rol}</p>
        </div>
    `).join('');

    const cronogramaHTML = evento.cronograma.map(c => `
        <div class="cronograma-item">
            <strong>${c.hora}</strong>: ${c.actividad}
        </div>
    `).join('');

    const recursosHTML = evento.recursos.map(r => `
        <li class="list-group-item d-flex justify-content-between align-items-center">
            ${r.nombre}
            <span class="badge bg-primary rounded-pill">${r.cantidad}</span>
        </li>
    `).join('');

    const eventoHTML = `
        <div class="evento-header">
            <img src="${evento.imagen}" alt="${evento.nombre}">
            <div class="evento-header-content">
                <h1 class="evento-title">${evento.nombre}</h1>
                <div class="evento-meta">
                    <span class="evento-meta-item">
                        <i class="bi bi-calendar"></i> ${formatFecha(evento.fecha)}
                    </span>
                    <span class="evento-meta-item">
                        <i class="bi bi-geo-alt"></i> ${evento.ubicacion}
                    </span>
                    <span class="evento-meta-item">
                        <i class="bi bi-star-fill"></i> ${evento.rating}/10
                    </span>
                </div>
            </div>
        </div>
        
        <div class="evento-body">
            <div class="evento-main">
                <div class="evento-section">
                    <h2 class="evento-section-title">Descripción</h2>
                    <p class="evento-descripcion">${evento.descripcion}</p>
                </div>
                
                <div class="evento-section">
                    <h2 class="evento-section-title">Participantes</h2>
                    <div class="participantes-grid">
                        ${participantesHTML}
                    </div>
                </div>
                
                <div class="evento-section">
                    <h2 class="evento-section-title">Colaboradores</h2>
                    <div class="colaboradores-grid">
                        ${colaboradoresHTML}
                    </div>
                </div>
            </div>
            
            <div class="evento-sidebar">
                <div class="evento-section">
                    <h2 class="evento-section-title">Organizador</h2>
                    <div class="organizador-card">
                        <img src="${evento.organizador.avatar}" alt="${evento.organizador.nombre}" class="organizador-img">
                        <div>
                            <h5>${evento.organizador.nombre}</h5>
                            <p class="text-muted">${evento.organizador.contacto}</p>
                        </div>
                    </div>
                </div>
                
                <div class="evento-section">
                    <h2 class="evento-section-title">Cronograma</h2>
                    ${cronogramaHTML}
                </div>
                
                <div class="evento-section">
                    <h2 class="evento-section-title">Recursos</h2>
                    <ul class="list-group">
                        ${recursosHTML}
                    </ul>
                </div>
            </div>
        </div>
    `;

    container.innerHTML = eventoHTML;
}

function formatFecha(fechaStr) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(fechaStr).toLocaleDateString('es-ES', options);
}