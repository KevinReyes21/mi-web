// 🔥 CREAR MAPA
var map = L.map('map', {
    zoomControl: false
}).setView([20.97, -89.62], 13);

var capaManzanas;
var capaInundacion;
let datosManzanas;

L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles © Esri'
}).addTo(map);  

function estiloManzanas(feature) {

    const afectacion = (feature.properties.afectacion_inundacion || "").toLowerCase();

    let color = "#ccc"; // default

    if (afectacion === "si") {
        color = "#ef4444";
    } else if (afectacion === "no") {
        color = "#22c55e";
    }

    return {
        color: "#333",
        weight: 0.8,
        fillColor: color,
        fillOpacity: 0.6
    };
}

function estiloInundacion() {
    return {
        color: "blue",
        fillColor: "blue",
        fillOpacity: 0.5,
        weight: 1
    };
}

// 📥 CARGAR MANZANAS
fetch('data/manzanas.geojson')
.then(res => res.json())
.then(data => {
    datosManzanas = data; // 🔥 guardar original
    capaManzanas = L.geoJSON(data, {
        style: estiloManzanas,
        onEachFeature: popupManzana
    }).addTo(map);
});

// 📥 CARGAR INUNDACIÓN
fetch('data/inundacion.geojson')
.then(res => res.json())
.then(data => {
    capaInundacion = L.geoJSON(data, {
        style: estiloInundacion
    }).addTo(map);
});

document.getElementById("chkManzanas").onchange = function(e) {
    if (e.target.checked) {
        map.addLayer(capaManzanas);
    } else {
        map.removeLayer(capaManzanas);
    }
};

document.getElementById("chkInundacion").onchange = function(e) {
    if (e.target.checked) {
        map.addLayer(capaInundacion);
    } else {
        map.removeLayer(capaInundacion);
    }
};

var menuBtn = document.getElementById("menu-btn");
var sidebar = document.getElementById("sidebar");
var closeBtn = document.getElementById("close-btn");

// ABRIR
menuBtn.onclick = function() {
    sidebar.classList.add("abierto");
    menuBtn.style.display = "none";
};

// CERRAR
closeBtn.onclick = function() {
    sidebar.classList.remove("abierto");
    menuBtn.style.display = "block";
};


function popupManzana(feature, layer) {
    if (feature.properties) {
            layer.bindPopup(`
                <div class="popup-card">
                    <h3>Manzana</h3>

                    <div class="popup-item">
                        <span>Clave</span>
                        <b>${feature.properties.CVE_MZA || 'N/A'}</b>
                    </div>

                    <div class="popup-item">
                        <span>Tipo</span>
                        <b>${feature.properties.TIPOMZA || 'N/A'}</b>
                    </div>

                    <div class="popup-item">
                        <span>Afectación</span>
                        <b class="afectacion ${ (feature.properties.afectacion_inundacion || '').toLowerCase() }">
                            ${feature.properties.afectacion_inundacion || 'N/A'}
                        </b>
                    </div>
                </div>
            `);

        layer.on({
            mouseover: function(e) {
                e.target.setStyle({
                    weight: 2,
                    color: "#00ffff"
                });
            },
            mouseout: function(e) {
                capaManzanas.resetStyle(e.target);
            }
        });
    }
}


function aplicarFiltros() {

    const tipo = document.getElementById("filtroTipo").value;
    const afectacion = document.getElementById("filtroAfectacion").value;

    // limpiar capa
    map.removeLayer(capaManzanas);

    // filtrar datos
    const filtrados = {
        type: "FeatureCollection",
        features: datosManzanas.features.filter(f => {

            const cumpleTipo =
                tipo === "todos" || f.properties.AMBITO === tipo;

            const cumpleAfectacion =
                afectacion === "todos" ||
                f.properties.afectacion_inundacion === afectacion;

            return cumpleTipo && cumpleAfectacion;
        })
    };

    // volver a dibujar
    capaManzanas = L.geoJSON(filtrados, {
        style: estiloManzanas,
        onEachFeature: popupManzana
    }).addTo(map);
}

document.getElementById("filtroTipo").addEventListener("change", aplicarFiltros);
document.getElementById("filtroAfectacion").addEventListener("change", aplicarFiltros);


const modal = document.getElementById("modal-aviso");
const btn = document.getElementById("btn-entendido");

btn.addEventListener("click", () => {
    modal.style.display = "none";
});