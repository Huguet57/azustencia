var socket = io();

// Locking
let caixes = document.getElementsByClassName("caixa");
let pissarres = document.getElementsByClassName("pissarra");

Array.from(caixes).forEach(el => el.addEventListener('click', event => {
  socket.emit('lock', el.id);
}));

Array.from(pissarres).forEach(el => el.addEventListener('click', event => {
  let outside_box = event.target.classList.contains("pissarra") && !event.target.classList.contains("caixa");
  if (outside_box) socket.emit('unlock');
}));

socket.on('lock', ids_colors => {
  Object.entries(ids_colors).forEach(([id, color]) => {
    let caixa = document.getElementById(id);
    if (color == 'none') caixa.style.background = 'none';
    else caixa.style.backgroundColor = color;
  });
});

