document.addEventListener('DOMContentLoaded', function () {
    // Datos de ejemplo (en un caso real, estos vendrían de tu base de datos)
    const eventos = [
        {
            id: 1,
            nombre: "Feria Gastronómica Nacional",
            descripcion: "Exhibición de platos típicos de todas las regiones del país.",
            fecha: "2023-08-15",
            ubicacion: "Plaza Principal, La Paz",
            estado: "activo",
            tipo: "gastronomico",
            imagen: "img/eventos/gastronomia.jpg",
            rating: 8.7
        },
        {
            id: 2,
            nombre: "Simposio de Historia",
            descripcion: "Conferencias sobre los procesos independentistas en América Latina.",
            fecha: "2023-09-20",
            ubicacion: "Auditorio UMSA, La Paz",
            estado: "activo",
            tipo: "academico",
            imagen: "img/eventos/academico.jpg",
            rating: 9.2
        },
        {
            id: 3,
            nombre: "Festival Folklórico",
            descripcion: "Presentación de danzas tradicionales de todas las culturas del país.",
            fecha: "2023-10-05",
            ubicacion: "Estadio Hernando Siles, La Paz",
            estado: "activo",
            tipo: "cultural",
            imagen: "img/eventos/folklorico.jpg",
            rating: 9.5
        },
        {
            id: 4,
            nombre: "Torneo de Fútbol Bicentenario",
            descripcion: "Competencia deportiva entre selecciones departamentales.",
            fecha: "2023-11-10",
            ubicacion: "Estadio Olímpico, Sucre",
            estado: "activo",
            tipo: "deportivo",
            imagen: "img/eventos/futbol.jpg",
            rating: 8.9
        }
    ];

    // Función para renderizar eventos
    function renderEventos(eventosToRender) {
        const container = document.getElementById('eventos-container');
        container.innerHTML = '';

        eventosToRender.forEach(evento => {
            const eventoHTML = `
                <div class="evento-card" data-category="${evento.tipo}" data-id="${evento.id}">
                    <div class="evento-imagen">
                        <img src="${evento.imagen}" alt="${evento.nombre}">
                        <div class="evento-rating">${evento.rating}/10</div>
                    </div>
                    <div class="evento-info">
                        <h3>${evento.nombre}</h3>
                        <p class="evento-fecha">${formatFecha(evento.fecha)} - ${evento.ubicacion}</p>
                        <p class="evento-desc">${evento.descripcion}</p>
                    </div>
                    <button class="btn btn-primary btn-sm ver-detalles" data-id="${evento.id}">Ver detalles</button>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', eventoHTML);
        });

        // Agregar event listeners a los botones
        document.querySelectorAll('.ver-detalles').forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                const eventId = this.getAttribute('data-id');
                window.location.href = `detalle_evento.html?id=${eventId}`;
            });
        });
    }


    // Función para formatear fecha
    function formatFecha(fechaStr) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(fechaStr).toLocaleDateString('es-ES', options);
    }

    // Filtrado por categoría
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const category = this.dataset.category;
            if (category === 'all') {
                renderEventos(eventos);
            } else {
                const filtered = eventos.filter(e => e.tipo === category);
                renderEventos(filtered);
            }
        });
    });

    // Renderizar todos los eventos al cargar
    renderEventos(eventos);
});