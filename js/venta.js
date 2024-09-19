document.addEventListener("DOMContentLoaded", function () {
    
    const DATA_URL = `json/venta.json`;

    // Realiza la solicitud a la URL generada dinámicamente
    fetch(DATA_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la carga de datos'); // Maneja errores si la carga del JSON falla
            }
            return response.json(); // Convierte la respuesta en un objeto JSON
        })
        .then(data => {
            // Almacenar los productos originales
            const productosOriginales = data.props;

            if (!Array.isArray(productosOriginales)) {
                throw new Error('El formato de los datos no es el esperado');
            }

            // Función para renderizar los productos en el HTML
            const renderizarProductos = (products) => {
                const container = document.querySelector('#products-grid');
                container.innerHTML = '';
                products.forEach(item => {
                    const productCard = document.createElement('div');
                    productCard.className = 'col-12 m-4';
                    productCard.innerHTML = `
                        <div id="articulos-autos" class="product-card">    
                            <div class="product-image">
                                <img src="${item.image}" alt="${item.direccion}">
                            </div>
                            <div>
                                <h3>${item.direccion}</h3>
                                <p>Barrio: ${item.barrio}</p>
                                <p>Tipo de propiedad: ${item.tipo}</p>
                                <p>Cantidad de Dormitorios: ${item.dormitorios}</p>
                                <p>Cantidad de Baños: ${item.baños}</p>
                                <p>Baño Social: ${item.bañoSocial}</p>
                                <p>Cochera: ${item.cochera}</p>
                                <p>Precio: ${item.moneda} ${item.precio}</p>
                            </div>
                        </div>
                    `;
                    container.appendChild(productCard);
                });
            };

            // Renderizado inicial de los productos sin filtros
            renderizarProductos(productosOriginales);

            // Función para aplicar filtros
            const aplicarFiltros = () => {
                const precioMin = parseFloat(document.getElementById('filtMin').value) || 0;
                const precioMax = parseFloat(document.getElementById('filtMax').value) || Infinity;

                const barriosSeleccionados = Array.from(document.querySelectorAll('input[id^=pocitos], input[id^=cordon], input[id^=laBlanqueada], input[id^=buceo], input[id^=malvin]'))
                    .filter(checkbox => checkbox.checked)
                    .map(checkbox => checkbox.value);

                const tiposSeleccionados = Array.from(document.querySelectorAll('input[id^=casa], input[id^=apartamento]'))
                    .filter(checkbox => checkbox.checked)
                    .map(checkbox => checkbox.value);

                const dormitoriosSeleccionados = Array.from(document.querySelectorAll('input[id^=monoambiente], input[id^=unDorm], input[id^=dosDorm], input[id^=tresDorm], input[id^=masDorm]'))
                    .filter(checkbox => checkbox.checked)
                    .map(checkbox => checkbox.value);

                const banosSeleccionados = Array.from(document.querySelectorAll('input[id^=unBaño], input[id^=dosBaños], input[id^=masBaños]'))
                    .filter(checkbox => checkbox.checked)
                    .map(checkbox => checkbox.value);

                const banoSocialSeleccionado = document.querySelector('input[name="banoSocial"]:checked')?.value || '';

                const garageSeleccionado = document.querySelector('input[name="cochera"]:checked')?.value || '';

                productosFiltrados = productosOriginales.filter(producto => {
                    return producto.cost >= precioMin && producto.cost <= precioMax &&
                        (barriosSeleccionados.length === 0 || barriosSeleccionados.includes(producto.barrio)) &&
                        (tiposSeleccionados.length === 0 || tiposSeleccionados.includes(producto.tipo)) &&
                        (dormitoriosSeleccionados.length === 0 || dormitoriosSeleccionados.includes(producto.dormitorios)) &&
                        (banosSeleccionados.length === 0 || banosSeleccionados.includes(producto.baños)) &&
                        (banoSocialSeleccionado === '' || banoSocialSeleccionado === producto.bañoSocial) &&
                        (garageSeleccionado === '' || garageSeleccionado === producto.cochera);
                });

                // Renderizar los productos filtrados
                renderizarProductos(productosFiltrados);
            };
            
            // Función para limpiar filtros
            const limpiarFiltros = () => {
                productosFiltrados = [...productosOriginales]; // Restaurar la lista completa de productos
                renderizarProductos(productosFiltrados);
                
                document.getElementById('filtMin').value = ''; // Limpiar los campos de filtro
                document.getElementById('filtMax').value = '';

                document.querySelectorAll('input[type=checkbox]').forEach(checkbox => checkbox.checked = false);
                document.querySelectorAll('input[type=radio]').forEach(radio => radio.checked = false);
            };

            // Funciones específicas para limpiar filtros
            const clearPriceFilters = () => {
                document.getElementById('filtMin').value = '';
                document.getElementById('filtMax').value = '';
            };

            const clearNeighborhoodFilters = () => {
                document.querySelectorAll('input[id^=pocitos], input[id^=cordon], input[id^=laBlanqueada], input[id^=buceo], input[id^=malvin]').forEach(checkbox => checkbox.checked = false);
            };

            const clearTypeFilters = () => {
                document.querySelectorAll('input[id^=casa], input[id^=apartamento]').forEach(checkbox => checkbox.checked = false);
            };

            const clearBedroomFilters = () => {
                document.querySelectorAll('input[id^=monoambiente], input[id^=unDorm], input[id^=dosDorm], input[id^=tresDorm], input[id^=masDorm]').forEach(checkbox => checkbox.checked = false);
            };

            const clearBathroomFilters = () => {
                document.querySelectorAll('input[id^=unBaño], input[id^=dosBaños], input[id^=masBaños]').forEach(checkbox => checkbox.checked = false);
            };

            const clearSocialBathroomFilters = () => {
                document.querySelectorAll('input[name="banoSocial"]').forEach(radio => radio.checked = false);
            };

            const clearGarageFilters = () => {
                document.querySelectorAll('input[name="cochera"]').forEach(radio => radio.checked = false);
            };

            document.getElementById('apply-filters').addEventListener('click', aplicarFiltros); // Botón de aplicar filtros
            document.getElementById('reset-filters').addEventListener('click', limpiarFiltros); // Botón de restablecer todos los filtros
            document.getElementById('clear-price-filters').addEventListener('click', clearPriceFilters); // Botón de borrar filtro de precio
            document.getElementById('clear-neighborhood-filters').addEventListener('click', clearNeighborhoodFilters); // Botón de borrar filtro de barrio
            document.getElementById('clear-type-filters').addEventListener('click', clearTypeFilters); // Botón de borrar filtro de tipo
            document.getElementById('clear-bedroom-filters').addEventListener('click', clearBedroomFilters); // Botón de borrar filtro de dormitorios
            document.getElementById('clear-bathroom-filters').addEventListener('click', clearBathroomFilters); // Botón de borrar filtro de baños
            document.getElementById('clear-social-bathroom-filters').addEventListener('click', clearSocialBathroomFilters); // Botón de borrar filtro de baño social
            document.getElementById('clear-garage-filters').addEventListener('click', clearGarageFilters); // Botón de borrar filtro de cochera
        })
        .catch(error => {
            console.error('Error al cargar los datos:', error); // Maneja errores en caso de que la carga de datos falle
        });
});
