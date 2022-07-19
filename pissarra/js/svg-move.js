var image = document.querySelector('.pissarra');
var content = document.querySelector('#pissarra-content');
var movable = document.querySelector('#movable-content');
var manager = new Hammer(image);

let angle_subtract = (a, b) => a-b>180 ? a-b-360 : (a-b<-180 ? a-b+360 : a-b);
let angle_sum = (a, b) => a+b>180 ? a+b-360 : (a+b<-180 ? a+b+360 : a+b);

manager.get('rotate').set({ enable: true });

const pz = panzoom(movable, {
    maxZoom: 4,
    minZoom: 0.5,
    initialZoom: 1
});

let rotation_start = 0;
let rotation_last = 0;
manager.on("rotatestart", (event) => rotation_start = event.rotation);
manager.on("rotatemove", (event) => {
    let angle_result = angle_sum(1.5*angle_subtract(event.rotation, rotation_start), rotation_last);
    content.style.transformOrigin = `${400}px ${300}px`; // 400 i 300 són la meitat de la width i height de la imatge SVG
    content.style.transform = `rotate(${Math.round(angle_result)}deg)`;
});
manager.on("rotateend", (event) => rotation_last = angle_sum(rotation_last, 1.5*angle_subtract(event.rotation, rotation_start)));