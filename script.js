(function () {
  'use strict';

  var COSTO_ENVIO = 2.5;

  var RESTAURANTES = [
    {
      id: 'r1',
      nombre: "McDonald's",
      categoria: 'hamburguesas',
      img: './assets/rest-r1.svg',
      tiempo: '25 min',
      descripcion: 'Combos clasicos, pedidos rapidos y sucursal ideal para empezar el reto.',
      detalle: 'Centro, 1.2 km',
      rating: '4.9'
    },
    {
      id: 'r2',
      nombre: 'KFC',
      categoria: 'pollo',
      img: './assets/rest-r2.svg',
      tiempo: '30 min',
      descripcion: 'Buckets, combos y pollo crujiente para pedidos familiares y rapidos.',
      detalle: 'Zona Norte, 2.5 km',
      rating: '4.8'
    },
    {
      id: 'r3',
      nombre: 'Burger King',
      categoria: 'hamburguesas',
      img: './assets/rest-r3.svg',
      tiempo: '20 min',
      descripcion: 'Hamburguesas a la parrilla con tiempos cortos y combos listos para compartir.',
      detalle: 'Avenida Principal, 0.8 km',
      rating: '4.7'
    },
    {
      id: 'r4',
      nombre: 'Subway',
      categoria: 'sandwiches',
      img: './assets/rest-r4.svg',
      tiempo: '28 min',
      descripcion: 'Sandwiches frescos, postres y armado al momento para completar el pedido multisucursal.',
      detalle: 'Downtown, 1.5 km',
      rating: '4.9'
    }
  ];

  var MENU = {
    r1: [
      {
        id: 'm1',
        nombre: 'Cuarto de Libra Combo',
        precio: 11.9,
        img: './assets/dish-m1.svg',
        descripcion: 'Hamburguesa con queso, papas medianas y refresco para dos personas.',
        etiqueta: 'Pedido del reto'
      },
      {
        id: 'm2',
        nombre: 'McNuggets 10 piezas',
        precio: 8.4,
        img: './assets/dish-m2.svg',
        descripcion: 'Nuggets crujientes con dos salsas y papas para compartir.',
        etiqueta: 'Combo rapido'
      }
    ],
    r2: [
      {
        id: 'm3',
        nombre: 'Bucket clasico',
        precio: 13.5,
        img: './assets/dish-m3.svg',
        descripcion: 'Pollo crujiente con biscuit y complemento para comida familiar.',
        etiqueta: 'Para compartir'
      },
      {
        id: 'm4',
        nombre: 'Combo tenders',
        precio: 9.9,
        img: './assets/dish-m4.svg',
        descripcion: 'Tenders con puré, biscuit y bebida de tamaño regular.',
        etiqueta: 'Mas pedido'
      }
    ],
    r3: [
      {
        id: 'm5',
        nombre: 'Whopper Combo',
        precio: 10.8,
        img: './assets/dish-m5.svg',
        descripcion: 'Hamburguesa a la parrilla con papas y bebida de tamaño mediano.',
        etiqueta: 'Best seller'
      },
      {
        id: 'm6',
        nombre: 'King Jr Combo',
        precio: 7.2,
        img: './assets/dish-m6.svg',
        descripcion: 'Hamburguesa junior con papas chicas y refresco para una comida ligera.',
        etiqueta: 'Opcion ligera'
      }
    ],
    r4: [
      {
        id: 'm7',
        nombre: 'Galleta doble chocolate',
        precio: 2.4,
        img: './assets/dish-m7.svg',
        descripcion: 'Galleta recien horneada, suave al centro y perfecta para cerrar el pedido.',
        etiqueta: 'Pedido del reto'
      },
      {
        id: 'm8',
        nombre: 'Sub de pavo 15 cm',
        precio: 6.9,
        img: './assets/dish-m8.svg',
        descripcion: 'Sandwich fresco con vegetales y aderezo suave para una opcion rapida.',
        etiqueta: 'Fresh daily'
      }
    ]
  };

  var restauranteActual = null;
  var pedido = [];

  var elFiltro = document.getElementById('filtro-cat');
  var elListaRest = document.getElementById('lista-restaurantes');
  var elListaPlatos = document.getElementById('lista-platos');
  var elListaCarrito = document.getElementById('lista-carrito');
  var elListaResumen = document.getElementById('lista-resumen');
  var elMenuVacio = document.getElementById('menu-vacio');
  var elCarritoVacio = document.getElementById('carrito-vacio');
  var elResumenVacio = document.getElementById('resumen-vacio');
  var elTituloRest = document.getElementById('titulo-restaurante');
  var elDescRest = document.getElementById('descripcion-restaurante');
  var elHeroRest = document.getElementById('hero-restaurante');
  var elHeroResumen = document.getElementById('hero-resumen');
  var elCartBadge = document.getElementById('cart-badge');
  var elCartTotal = document.getElementById('cart-total');
  var elSubtotal = document.getElementById('subtotal-delivery');
  var elEnvio = document.getElementById('envio-delivery');
  var elTotal = document.getElementById('total-delivery');
  var elMsgConfirm = document.getElementById('msg-confirm');
  var elConfirmRest = document.getElementById('confirm-restaurante');
  var elConfirmTotal = document.getElementById('confirm-total');
  var elBranchSummary = document.getElementById('checkout-branch-summary');
  var elCheckoutForm = document.getElementById('checkout-form');
  var elPanelMenu = document.getElementById('step-menu');
  var elPanelCheckout = document.getElementById('step-checkout');
  var elPanelConfirm = document.getElementById('step-confirmacion');

  function escapeHtml(valor) {
    var tmp = document.createElement('div');
    tmp.textContent = valor;
    return tmp.innerHTML;
  }

  function formatEuros(valor) {
    return Number(valor).toFixed(2).replace('.', ',') + ' €';
  }

  function obtenerRestaurante(id) {
    for (var i = 0; i < RESTAURANTES.length; i++) {
      if (RESTAURANTES[i].id === id) return RESTAURANTES[i];
    }
    return null;
  }

  function obtenerLinea(idPlato) {
    for (var i = 0; i < pedido.length; i++) {
      if (pedido[i].idPlato === idPlato) return pedido[i];
    }
    return null;
  }

  function sucursalesActivas() {
    var ids = [];
    for (var i = 0; i < pedido.length; i++) {
      if (ids.indexOf(pedido[i].restauranteId) === -1) {
        ids.push(pedido[i].restauranteId);
      }
    }
    return ids;
  }

  function totalArticulos() {
    var total = 0;
    for (var i = 0; i < pedido.length; i++) {
      total += pedido[i].cantidad;
    }
    return total;
  }

  function subtotalPedido() {
    var subtotal = 0;
    for (var i = 0; i < pedido.length; i++) {
      subtotal += pedido[i].precioUnit * pedido[i].cantidad;
    }
    return subtotal;
  }

  function totalConEnvio() {
    if (pedido.length === 0) return 0;
    return subtotalPedido() + totalEnvio();
  }

  function totalEnvio() {
    return sucursalesActivas().length * COSTO_ENVIO;
  }

  function descripcionSucursales() {
    var ids = sucursalesActivas();
    if (ids.length === 0) return 'Sin sucursales activas';

    var nombres = [];
    for (var i = 0; i < ids.length; i++) {
      var restaurante = obtenerRestaurante(ids[i]);
      if (restaurante) nombres.push(restaurante.nombre);
    }

    return nombres.join(' + ');
  }

  function actualizarIndicadores(stepActivo) {
    var indicadores = document.querySelectorAll('[data-step-indicator]');
    for (var i = 0; i < indicadores.length; i++) {
      var indicador = indicadores[i];
      var paso = Number(indicador.getAttribute('data-step-indicator'));
      indicador.classList.toggle('active', paso === stepActivo);
    }
  }

  function mostrarPanel(panel) {
    var panels = [elPanelMenu, elPanelCheckout, elPanelConfirm];
    for (var i = 0; i < panels.length; i++) {
      var actual = panels[i];
      var activo = actual === panel;
      actual.classList.toggle('active', activo);
      actual.hidden = !activo;
    }

    if (panel === elPanelMenu) {
      actualizarIndicadores(pedido.length > 0 ? 2 : 1);
    } else if (panel === elPanelCheckout) {
      actualizarIndicadores(3);
    } else {
      actualizarIndicadores(4);
    }
  }

  function renderRestaurantes() {
    var categoria = elFiltro.value;
    elListaRest.innerHTML = '';

    for (var i = 0; i < RESTAURANTES.length; i++) {
      var restaurante = RESTAURANTES[i];
      if (categoria !== 'todas' && restaurante.categoria !== categoria) continue;

      var li = document.createElement('li');
      var boton = document.createElement('button');
      boton.type = 'button';
      boton.className = 'restaurant-card' + (restaurante.id === restauranteActual ? ' is-selected' : '');
      boton.setAttribute('data-rest', restaurante.id);
      boton.innerHTML =
        '<span class="restaurant-card__media"><img src="' +
        restaurante.img +
        '" alt="" loading="lazy"></span>' +
        '<span class="restaurant-card__body">' +
        '<strong>' +
        escapeHtml(restaurante.nombre) +
        '</strong>' +
        '<span>' +
        escapeHtml(restaurante.descripcion) +
        '</span>' +
        '<span class="restaurant-card__detail">' +
        escapeHtml(restaurante.detalle) +
        ' · ' +
        escapeHtml(restaurante.rating) +
        '/5</span>' +
        '<span class="restaurant-card__meta">' +
        '<span class="pill">' +
        escapeHtml(restaurante.categoria) +
        '</span>' +
        '<span>' +
        escapeHtml(restaurante.tiempo) +
        '</span>' +
        '</span>' +
        '</span>';
      li.appendChild(boton);
      elListaRest.appendChild(li);
    }
  }

  function renderMenu() {
    var restaurante = obtenerRestaurante(restauranteActual);
    var productos = restaurante ? MENU[restaurante.id] || [] : [];
    elListaPlatos.innerHTML = '';

    if (!restaurante) {
      elTituloRest.textContent = 'Selecciona un restaurante';
      elDescRest.textContent = 'Al elegir un local apareceran sus productos disponibles.';
      elMenuVacio.hidden = false;
      return;
    }

    elTituloRest.textContent = restaurante.nombre;
    elDescRest.textContent = restaurante.descripcion + ' Tiempo estimado: ' + restaurante.tiempo + '.';
    elMenuVacio.hidden = productos.length > 0;

    for (var i = 0; i < productos.length; i++) {
      var producto = productos[i];
      var li = document.createElement('li');
      li.className = 'product-card';
      li.innerHTML =
        '<img src="' +
        producto.img +
        '" alt="" loading="lazy">' +
        '<div>' +
        '<p class="product-card__tagline">' +
        escapeHtml(producto.etiqueta || 'Selección destacada') +
        '</p>' +
        '<strong class="product-card__title">' +
        escapeHtml(producto.nombre) +
        '</strong>' +
        '<p class="product-card__desc">' +
        escapeHtml(producto.descripcion) +
        '</p>' +
        '</div>' +
        '<div class="product-card__footer">' +
        '<span class="price">' +
        formatEuros(producto.precio) +
        '</span>' +
        '<button type="button" class="btn btn-primary btn-small" data-add-plato="' +
        producto.id +
        '">Agregar</button>' +
        '</div>';
      elListaPlatos.appendChild(li);
    }
  }

  function renderCarrito() {
    elListaCarrito.innerHTML = '';
    elListaResumen.innerHTML = '';

    var hayPedido = pedido.length > 0;
    elCarritoVacio.hidden = hayPedido;
    elResumenVacio.hidden = hayPedido;
    elCartBadge.textContent = String(totalArticulos());
    elCartTotal.textContent = formatEuros(subtotalPedido());
    elSubtotal.textContent = formatEuros(subtotalPedido());
    elEnvio.textContent = formatEuros(totalEnvio());
    elTotal.textContent = formatEuros(totalConEnvio());
    elBranchSummary.textContent =
      hayPedido
        ? 'Sucursales activas: ' + descripcionSucursales() + '. Se agregan ' + sucursalesActivas().length + ' envios al total.'
        : 'El total final suma un envio por cada sucursal activa en tu carrito.';

    for (var i = 0; i < pedido.length; i++) {
      var linea = pedido[i];
      var itemCarrito = document.createElement('li');
      itemCarrito.className = 'cart-item';
      itemCarrito.innerHTML =
        '<img class="cart-item__thumb" src="' +
        linea.img +
        '" alt="">' +
        '<div class="cart-item__body">' +
        '<strong>' +
        escapeHtml(linea.nombre) +
        '</strong>' +
        '<span>' +
        formatEuros(linea.precioUnit) +
        '</span>' +
        '<span class="branch-chip">' +
        escapeHtml(linea.restauranteNombre) +
        '</span>' +
        '<div class="qty-controls">' +
        '<button type="button" class="btn qty-btn" data-action="restar" data-id="' +
        linea.idPlato +
        '">-</button>' +
        '<span>' +
        linea.cantidad +
        '</span>' +
        '<button type="button" class="btn qty-btn" data-action="sumar" data-id="' +
        linea.idPlato +
        '">+</button>' +
        '</div>' +
        '</div>' +
        '<span class="cart-item__price">' +
        formatEuros(linea.precioUnit * linea.cantidad) +
        '</span>';
      elListaCarrito.appendChild(itemCarrito);

      var itemResumen = document.createElement('li');
      itemResumen.className = 'resumen-line';
      itemResumen.innerHTML =
        '<img class="resumen-thumb" src="' +
        linea.img +
        '" alt="">' +
        '<span class="resumen-nombre"><strong>' +
        escapeHtml(linea.nombre) +
        '</strong>' +
        escapeHtml(linea.restauranteNombre) +
        ' · Cantidad: ' +
        linea.cantidad +
        '</span>' +
        '<span class="resumen-precio">' +
        formatEuros(linea.precioUnit * linea.cantidad) +
        '</span>';
      elListaResumen.appendChild(itemResumen);
    }

    if (restauranteActual) {
      var restaurante = obtenerRestaurante(restauranteActual);
      elHeroRest.textContent = restaurante ? restaurante.nombre : 'Selecciona un restaurante';
      elHeroResumen.textContent =
        hayPedido
          ? totalArticulos() + ' productos agregados. Total parcial: ' + formatEuros(subtotalPedido()) + '.'
          : 'Explora el menu y agrega productos al carrito.';
    } else {
      elHeroRest.textContent = 'Selecciona un restaurante';
      elHeroResumen.textContent = 'Explora el menu y agrega productos al carrito.';
    }
  }

  function seleccionarRestaurante(idRestaurante) {
    restauranteActual = idRestaurante;
    renderRestaurantes();
    renderMenu();
    renderCarrito();
    mostrarPanel(elPanelMenu);
  }

  function agregarProducto(idPlato) {
    if (!restauranteActual) return;

    var productos = MENU[restauranteActual] || [];
    var producto = null;
    for (var i = 0; i < productos.length; i++) {
      if (productos[i].id === idPlato) {
        producto = productos[i];
        break;
      }
    }
    if (!producto) return;

    var linea = obtenerLinea(idPlato);
    if (linea) {
      linea.cantidad += 1;
    } else {
      pedido.push({
        idPlato: producto.id,
        nombre: producto.nombre,
        precioUnit: producto.precio,
        cantidad: 1,
        img: producto.img,
        restauranteId: restauranteActual,
        restauranteNombre: obtenerRestaurante(restauranteActual).nombre
      });
    }

    renderCarrito();
    actualizarIndicadores(2);
  }

  function cambiarCantidad(idPlato, accion) {
    var linea = obtenerLinea(idPlato);
    if (!linea) return;

    if (accion === 'sumar') {
      linea.cantidad += 1;
    }

    if (accion === 'restar') {
      linea.cantidad -= 1;
      if (linea.cantidad <= 0) {
        for (var i = 0; i < pedido.length; i++) {
          if (pedido[i].idPlato === idPlato) {
            pedido.splice(i, 1);
            break;
          }
        }
      }
    }

    renderCarrito();
  }

  function vaciarPedido() {
    pedido = [];
    renderCarrito();
    if (elPanelCheckout.classList.contains('active')) {
      mostrarPanel(elPanelMenu);
    } else {
      actualizarIndicadores(1);
    }
  }

  function irACheckout() {
    if (pedido.length === 0) {
      alert('Agrega al menos un producto antes de continuar.');
      return;
    }
    renderCarrito();
    mostrarPanel(elPanelCheckout);
  }

  function enviarPedido(event) {
    event.preventDefault();

    if (pedido.length === 0) {
      alert('Tu carrito esta vacio.');
      return;
    }

    var datos = new FormData(elCheckoutForm);
    var nombre = datos.get('nombre');
    var direccion = datos.get('direccion');
    var telefono = datos.get('telefono');
    var pago = datos.get('pago');
    var tarjeta = String(datos.get('tarjeta') || '').replace(/\s+/g, '');
    var vencimiento = datos.get('vencimiento');
    var cvv = datos.get('cvv');

    if (!nombre || !direccion || !telefono || !pago || !tarjeta || !vencimiento || !cvv) {
      alert('Completa todos los datos requeridos para enviar el pedido.');
      return;
    }

    if (!/^\d{16}$/.test(tarjeta)) {
      alert('Ingresa una tarjeta valida de 16 digitos.');
      return;
    }

    if (!/^\d{2}\/\d{2}$/.test(String(vencimiento))) {
      alert('Ingresa el vencimiento en formato MM/AA.');
      return;
    }

    if (!/^\d{3,4}$/.test(String(cvv))) {
      alert('Ingresa un CVV valido.');
      return;
    }

    var total = totalConEnvio();
    var notas = datos.get('notas');

    elMsgConfirm.textContent =
      nombre +
      ', tu pedido fue enviado a ' +
      direccion +
      '. El local lo preparara y te contactara si necesita confirmar detalles.';
    elConfirmRest.textContent =
      'Sucursales: ' +
      descripcionSucursales() +
      ' | Pago: ' +
      pago +
      ' | Telefono: ' +
      telefono;
    elConfirmTotal.textContent =
      'Total final: ' +
      formatEuros(total) +
      ' | Envio total: ' +
      formatEuros(totalEnvio()) +
      (notas ? ' | Indicaciones: ' + notas : '');

    pedido = [];
    elCheckoutForm.reset();
    renderCarrito();
    mostrarPanel(elPanelConfirm);
  }

  function nuevoPedido() {
    pedido = [];
    restauranteActual = null;
    elCheckoutForm.reset();
    renderRestaurantes();
    renderMenu();
    renderCarrito();
    mostrarPanel(elPanelMenu);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  elFiltro.addEventListener('change', renderRestaurantes);

  elListaRest.addEventListener('click', function (event) {
    var boton = event.target.closest('[data-rest]');
    if (!boton) return;
    seleccionarRestaurante(boton.getAttribute('data-rest'));
  });

  elListaPlatos.addEventListener('click', function (event) {
    var boton = event.target.closest('[data-add-plato]');
    if (!boton) return;
    agregarProducto(boton.getAttribute('data-add-plato'));
  });

  elListaCarrito.addEventListener('click', function (event) {
    var boton = event.target.closest('[data-action]');
    if (!boton) return;
    cambiarCantidad(boton.getAttribute('data-id'), boton.getAttribute('data-action'));
  });

  document.getElementById('btn-ir-carrito').addEventListener('click', function () {
    document.getElementById('cart-panel').scrollIntoView({ behavior: 'smooth', block: 'start' });
    actualizarIndicadores(2);
  });

  document.getElementById('btn-seguir-comprando').addEventListener('click', function () {
    mostrarPanel(elPanelMenu);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  document.getElementById('btn-ir-checkout').addEventListener('click', irACheckout);
  document.getElementById('btn-volver-menu').addEventListener('click', function () {
    mostrarPanel(elPanelMenu);
    actualizarIndicadores(2);
  });
  document.getElementById('btn-vaciar').addEventListener('click', vaciarPedido);
  document.getElementById('btn-nuevo').addEventListener('click', nuevoPedido);
  elCheckoutForm.addEventListener('submit', enviarPedido);

  document.getElementById('input-tarjeta').addEventListener('input', function (event) {
    var limpio = event.target.value.replace(/\D/g, '').slice(0, 16);
    event.target.value = limpio.replace(/(.{4})/g, '$1 ').trim();
  });

  document.getElementById('input-vencimiento').addEventListener('input', function (event) {
    var limpio = event.target.value.replace(/\D/g, '').slice(0, 4);
    if (limpio.length > 2) {
      limpio = limpio.slice(0, 2) + '/' + limpio.slice(2);
    }
    event.target.value = limpio;
  });

  document.getElementById('input-cvv').addEventListener('input', function (event) {
    event.target.value = event.target.value.replace(/\D/g, '').slice(0, 4);
  });

  renderRestaurantes();
  renderMenu();
  renderCarrito();
  mostrarPanel(elPanelMenu);
})();
