// Define la fecha de inicio (Año, Mes [0-11], Día, Hora, Minuto)
// Nota: Enero es 0, Diciembre es 11.
const fechaInicio1 = new Date('2025-08-19T16:00:00').getTime();
const fechaInicio2 = new Date('2025-10-15T20:15:00').getTime();
const fechaInicio3 = new Date('2025-11-06T18:30:00').getTime();

function actualizarContador1() {
  const ahora = new Date().getTime();
  const diferencia = ahora - fechaInicio1;

  // Cálculos matemáticos para convertir milisegundos
  const dias1 = Math.floor(diferencia / (1000 * 60 * 60 * 24));
  const horas1 = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutos1 = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
  const segundos1 = Math.floor((diferencia % (1000 * 60)) / 1000);

  // Inyectar los valores en el HTML
  document.getElementById('dias1').innerText = dias1;
  document.getElementById('horas1').innerText = horas1.toString().padStart(2, '0');
  document.getElementById('minutos1').innerText = minutos1.toString().padStart(2, '0');
  document.getElementById('segundos1').innerText = segundos1.toString().padStart(2, '0');
}

function actualizarContador2() {
  const ahora = new Date().getTime();
  const diferencia = ahora - fechaInicio2;

  // Cálculos matemáticos para convertir milisegundos
  const dias2 = Math.floor(diferencia / (1000 * 60 * 60 * 24));
  const horas2 = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutos2 = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
  const segundos2 = Math.floor((diferencia % (1000 * 60)) / 1000);

  // Inyectar los valores en el HTML
  document.getElementById('dias2').innerText = dias2;
  document.getElementById('horas2').innerText = horas2.toString().padStart(2, '0');
  document.getElementById('minutos2').innerText = minutos2.toString().padStart(2, '0');
  document.getElementById('segundos2').innerText = segundos2.toString().padStart(2, '0');
}

function actualizarContador3() {
  const ahora = new Date().getTime();
  const diferencia = ahora - fechaInicio3;

  // Cálculos matemáticos para convertir milisegundos
  const dias3 = Math.floor(diferencia / (1000 * 60 * 60 * 24));
  const horas3 = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutos3 = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
  const segundos3 = Math.floor((diferencia % (1000 * 60)) / 1000);

  // Inyectar los valores en el HTML
  document.getElementById('dias3').innerText = dias3;
  document.getElementById('horas3').innerText = horas3.toString().padStart(2, '0');
  document.getElementById('minutos3').innerText = minutos3.toString().padStart(2, '0');
  document.getElementById('segundos3').innerText = segundos3.toString().padStart(2, '0');
}

// Ejecutar la función cada segundo
setInterval(actualizarContador1, 1000);
setInterval(actualizarContador2, 1000);
setInterval(actualizarContador3, 1000);

// Ejecutar una vez al cargar para evitar el retraso de 1 segundo
actualizarContador1();
actualizarContador2();
actualizarContador3();