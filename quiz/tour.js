const container = document.querySelector('#container');

const panorama = new PANOLENS.ImagePanorama('assets/panorama1.jpg');

const viewer = new PANOLENS.Viewer({
  container: container,
  output: 'console' 
});

viewer.add(panorama);

function crearZona(x, y, z, titulo, contenido) {
  const spot = new PANOLENS.Infospot(350, 'assets/icono.png');
  spot.position.set(x, y, z);
  panorama.add(spot);

  spot.addEventListener('click', () => {
    Swal.fire({
      title: titulo,
      html: contenido,
      width: 700,
      padding: '2rem',
      background: 'linear-gradient(135deg, #1a4d3a 0%, #2d5a47 100%)',
      color: '#ffffff',
      confirmButtonText: 'Cerrar',
      confirmButtonColor: '#4a7c59',
      buttonsStyling: true,
      customClass: {
        popup: 'camping-popup',
        title: 'camping-title',
        htmlContainer: 'camping-content',
        confirmButton: 'camping-button'
      },
      showClass: {
        popup: 'animate__animated animate__zoomIn animate__faster'
      },
      hideClass: {
        popup: 'animate__animated animate__zoomOut animate__faster'
      }
    });
  });
}

crearZona(5000, 0, 0, 'Descripción',
  '<p>Ir de camping es una excelente forma de desconectarte de la rutina y reconectar con la naturaleza. 🌲⛺ Un buen tip es preparar tu mochila por capas: lo más pesado (como comida o equipo de cocina) debe ir en el centro y cerca de tu espalda, mientras que lo liviano (ropa o saco de dormir) va arriba. Así distribuyes mejor el peso y evitas cansarte rápido en las caminatas.</p>');

crearZona(-4000, 500, -1000, 'Información adicional',
  '<p>Cuando acampes, lleva siempre una linterna extra y baterías de repuesto 🔦. Nunca sabes cuándo podrías necesitar iluminación adicional, especialmente si el clima cambia o si tienes que moverte de noche. La luz adecuada puede hacer la diferencia entre una noche tranquila y una llena de tropiezos.</p>');

crearZona(2000, -1000, -3000, 'Items para acampar!',
  '<p>La imagen muestra objetos esenciales para acampar: una mochila, tienda de campaña, saco de dormir, botas, brújula, linterna, hacha, cuerda, fósforos, binoculares, silla plegable, lámpara y una fogata. Todos son útiles para orientarse, descansar y disfrutar de la naturaleza al aire libre. 🏕️</p><img src="assets/camp1.jpg" style="max-width:100%;border-radius:8px;">');

crearZona(-2000, 2000, 4000, 'Documento',
  '<p>Haz clic para abrir el documento PDF o DOC.</p><a href="assets/camp2.pdf" target="_blank" style="color:#1e90ff;">Abrir archivo</a>');

crearZona(1000, -2000, 5000, 'Audio explicativo',
  '<audio controls preload="metadata"><source src="assets/camp3.mp3" type="audio/mpeg"><source src="assets/camp3.mp3" type="audio/mp3">Tu navegador no soporta este formato de audio.</audio>');

crearZona(-3000, 1000, 4000, 'Video 1',
  '<video controls width="100%"><source src="assets/camp4.mp4" type="video/mp4">Tu navegador no soporta video.</video>');

crearZona(3000, -1500, -2000, 'Video 2',
  '<video controls width="100%"><source src="assets/camp6.mp4" type="video/mp4">Tu navegador no soporta video.</video>');

crearZona(4500, 0, -2500, 'Yosemite',
  '<p>Visita el siguiente enlace:</p><a href="https://es.wikipedia.org/wiki/Bosque_nacional_de_los_Estados_Unidos" target="_blank">Yosemite</a>');

crearZona(-4500, 500, 2000, 'Sitio Web',
  '<p>Visita el siguiente enlace:</p><a href="https://camping.cr" target="_blank">Camping</a>');

crearZona(0, 2500, -4500, 'Mini game',
  `<p>Tour 360 creado por <b>Gabriela Gomez</b><br>Proyecto educativo de Programación Web 2025.</p>
  <br>
  <iframe 
    width="552" 
    height="167" 
    frameborder="0" 
    src="https://itch.io/embed/695785">
    <a href="https://bunmuen.itch.io/a-camping-adventure">a camping adventure by bun muen</a>
  </iframe>`);
