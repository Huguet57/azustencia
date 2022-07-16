// Turn all 'g's to caixes
var rects = document.getElementsByTagName("rect");
Array.from(rects).forEach((rect, i) => {
    let box = rect.parentElement;
    box.classList.add("caixa");
    box.id = "caixa-" + i.toString();
});

var element = document.querySelector('#pissarra-content')
panzoom(element, {
    maxZoom: 1,
    minZoom: 0.1,
    initialZoom: 1
});