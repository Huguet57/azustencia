var socket = io();

// Dragging
let drag = false;
document.addEventListener('mousedown', () => drag = false);
document.addEventListener('mousemove', () => drag = true);

// Locking
let caixes = document.getElementsByClassName("caixa");
let pissarres = document.getElementsByClassName("pissarra");

Array.from(caixes).forEach(el => el.addEventListener('click', event => {
  if (!drag) socket.emit('lock', el.id);
}));

Array.from(pissarres).forEach(el => el.addEventListener('click', event => {
  let outside_box = event.target.classList.contains("pissarra") && !event.target.classList.contains("caixa");
  if (outside_box && !drag) socket.emit('unlock');
}));

socket.on('lock', ids_colors => {
  Object.entries(ids_colors).forEach(([id, color]) => {
    let caixa = document.getElementById(id).getElementsByTagName("rect")[0];
    if (color == 'none') caixa.style.fill = 'white';
    else caixa.style.fill = color;
  });
});

window.addEventListener("keydown", event => {
  socket.emit('keydown', event.key);
});

socket.on("editing", edit => {
  let text = document.getElementById(edit.id).getElementsByTagName("text")[0];
  if (edit.keyEvent.length > 1 && edit.keyEvent !== "Backspace") return false;
  else if (edit.keyEvent === "Backspace" && text.innerHTML !== "") text.innerHTML = text.innerHTML.slice(0, -1);
  else if (edit.keyEvent !== "Backspace") text.innerHTML += edit.keyEvent;
})