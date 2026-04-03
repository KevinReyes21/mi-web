particlesJS("particles-js", {
    particles: {
        number: { value: 80 },
        color: { value: "#00ffff" },
        shape: { type: "circle" },
        opacity: { value: 0.5 },
        size: { value: 4 },
        move: {
            enable: true,
            speed: 2
        }
    },
    interactivity: {
        events: {
            onhover: {
                enable: true,
                mode: "repulse"
            }
        }
    }
});
console.log("particles cargando...");