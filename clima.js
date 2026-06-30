const inputCiudad = document.getElementById('ciudad');
const btnClima = document.getElementById('btnClima');
const estado = document.getElementById('estado');
const resultado = document.getElementById('resultado');

btnClima.addEventListener('click', consultarClima);
inputCiudad.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    consultarClima();
  }
});

async function consultarClima() {
  const ciudad = inputCiudad.value.trim();

  resultado.classList.add('oculto');
  estado.classList.remove('error');

  if (!ciudad) {
    estado.textContent = 'Por favor ingresá una ciudad.';
    return;
  }

  estado.textContent = 'Consultando...';

  try {
    const urlGeo = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(ciudad)}&count=1`;
    const respGeo = await fetch(urlGeo);

    if (!respGeo.ok) {
      mostrarError('Error al consultar la ubicación de la ciudad.');
      return;
    }

    const dataGeo = await respGeo.json();

    if (!dataGeo.results || dataGeo.results.length === 0) {
      estado.textContent = 'Ciudad no encontrada';
      return;
    }

    const { latitude, longitude, name } = dataGeo.results[0];

    const urlClima = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
    const respClima = await fetch(urlClima);

    if (!respClima.ok) {
      mostrarError('Error al consultar el clima.');
      return;
    }

    const dataClima = await respClima.json();

    if (!dataClima.current_weather) {
      mostrarError('No se pudo obtener el clima actual.');
      return;
    }

    document.getElementById('resCiudad').textContent = name;
    document.getElementById('resTemp').textContent = dataClima.current_weather.temperature;
    document.getElementById('resViento').textContent = dataClima.current_weather.windspeed;
    document.getElementById('resCodigo').textContent = dataClima.current_weather.weathercode;

    estado.textContent = '';
    resultado.classList.remove('oculto');

  } catch (error) {
    mostrarError('Ocurrió un error de red. Verificá tu conexión.');
  }
}

function mostrarError(mensaje) {
  estado.textContent = mensaje;
  estado.classList.add('error');
}
