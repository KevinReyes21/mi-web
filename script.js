let puntoActivo = null;

function getColor(tipo) {
  switch(tipo) {
    case "gnss": return "#00f0ff";          // cyan neón
    case "dron": return "#ff00ff";          // magenta
    case "gnss_dron": return "#9d00ff";     // violeta
    case "estacion_total": return "#00ff85"; // verde neón
    case "procesamiento": return "#ffae00"; // naranja brillante
    default: return "#ffffff";
  }
}

particlesJS("particles-js", {
    particles: {
        number: { value: 80 },
        color: { value: "#00ffff" },
        shape: { type: "circle" },
        opacity: { value: 0.5 },
        size: { value: 4 },
        move: {
            enable: true,
            speed: 1
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

// MAPA TRABAJOS DE CAMPO
var map = L.map('map').setView([23.5, -102], 5);

L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; OpenStreetMap &copy; CartoDB'
}).addTo(map);

fetch('data/trabajos.geojson')
  .then(res => res.json())
  .then(data => {

            L.geoJSON(data, {

        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
            radius: 6,
            fillColor: getColor(feature.properties.instrumento),
            color: "#000",
            weight: 1,
            fillOpacity: 0.9,
            className: 'glow-marker',
            });
        },

        onEachFeature: function (feature, layer) {

        layer.on({
            click: function (e) {

            let coords = e.latlng;
            let currentZoom = map.getZoom();

            let targetZoom = currentZoom < 13 ? 13 : currentZoom;

            map.flyTo(coords, targetZoom, {
            duration: 0.1
            });


            actualizarPanel(feature.properties);
            },

            mouseover: function (e) {
            let layer = e.target;

            layer.setStyle({
                radius: 10,
                weight: 3,
                fillOpacity: 1
            });
            },

            mouseout: function (e) {
            let layer = e.target;

            layer.setStyle({
                radius: 7,
                weight: 2,
                fillOpacity: 0.9
            });
            }
        });

        }

        }).addTo(map);

        

  });

function actualizarPanel(props) {

  let contenido = `
    <h3>${props.trabajo}</h3>
    <p><strong>Instrumento:</strong> ${props.instrumento}</p>
    <p>${props.descripcion}</p>
  `;

  // 👇 si hay reel, lo agrega
  if (props.reel) {
    contenido += `
    <a href="${props.reel}" target="_blank" style="color:#38bdf8;">
        Ver video en Instagram
    </a>
    `;
  } else {
    contenido += `
      <p style="opacity:0.6;">No hay video disponible</p>
    `;
  }

  document.getElementById("info-panel").innerHTML = contenido;
}
