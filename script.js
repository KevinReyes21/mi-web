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
L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles © Esri'
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

  // 👉 VIDEO (Cloudinary u otro mp4)
  if (props.video) {
    contenido += `
      <div class="video-container">
        <video controls muted autoplay loop playsinline>
          <source src="${props.video}" type="video/mp4">
        </video>
      </div>
    `;
  } else {
    contenido += `
      <p style="opacity:0.6;">No hay video disponible</p>
    `;
  }

  document.getElementById("info-panel").innerHTML = contenido;
}

var legend = L.control({ position: "bottomright" });

legend.onAdd = function (map) {
  var div = L.DomUtil.create("div", "info legend");

  div.innerHTML += "<h4>Instrumento</h4>";

  var tipos = [
    { nombre: "GNSS", color: getColor("gnss") },
    { nombre: "Dron", color: getColor("dron") },
    { nombre: "GNSS + Dron", color: getColor("gnss_dron") },
    { nombre: "Estación Total", color: getColor("estacion_total") },
    { nombre: "Procesamiento", color: getColor("procesamiento") }
  ];

  tipos.forEach(function (t) {
    div.innerHTML += `
      <div class="legend-item">
        <span style="background:${t.color}"></span>
        ${t.nombre}
      </div>
    `;
  });

  return div;
};

legend.addTo(map);