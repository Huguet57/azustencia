var socket = io();

let caixes = document.getElementsByClassName("caixa");
console.log(caixes)

Array.from(caixes).forEach(el => el.addEventListener('click', event => {
  socket.emit('lock', el.id);
}));

socket.on('lock', ids_colors => {
  Object.entries(ids_colors).forEach(([id, color]) => {
    let caixa = document.getElementById(id);
    caixa.style.backgroundColor = color;
  });
});