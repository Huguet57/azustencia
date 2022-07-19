var socket = io();

// Dragging
let isDragging = false;
document.addEventListener('mousedown', () => isDragging = false);
document.addEventListener('mousemove', () => isDragging = true);

// Locking
let caixes = document.getElementsByClassName("caixa");
let pissarres = document.getElementsByClassName("pissarra");

Array.from(caixes).forEach(el => el.addEventListener('click', event => {
  if (!isDragging) socket.emit('lock', el.id);
}));

Array.from(pissarres).forEach(el => el.addEventListener('click', event => {
  let outside_box = event.target.classList.contains("pissarra") && !event.target.classList.contains("caixa");
  if (outside_box && !isDragging) socket.emit('unlock');
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
  else if (edit.keyEvent === "Backspace" && text.textContent !== "") text.textContent = text.textContent.slice(0, -1);
  else if (edit.keyEvent !== "Backspace") text.textContent += edit.keyEvent;
})