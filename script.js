 const apiKey = 'OpUloC_wKZOzOVbg1tTgzg';//chave da api| TO-DO: colocar a chave da empresa GwJnNpEL9dnHevY0nLui


 const params = new URLSearchParams(window.location.search);//pega os parâmetros da URL
    const rawPts = params.get('pts');
    let pontos = [];

    if (rawPts) { //separando os pontos dos marcadores da URL
      pontos = rawPts.split(';').map(p => {
        const parts = p.split(',');
        const lat = parseFloat(parts[0]);
        const lng = parseFloat(parts[1]);
        const texto = decodeURIComponent(parts.slice(2).join(','));
        return { lat, lng, texto };
      }).filter(p => !isNaN(p.lat) && !isNaN(p.lng));
    }

    if (pontos.length === 0) { //se não houver pontos, coloca um padrão
      pontos = [{ lat: -23.5505, lng: -46.6333, texto: "Ponto padrão" }];
    }
    const platform = new H.service.Platform({
      'apikey': apiKey
  });
  

// Initialize the engine type:
const engineType = H.Map.EngineType['HARP'];

// Obtain the default map types from the platform object:
const defaultLayers = platform.createDefaultLayers({
    engineType: engineType
});

// Instantiate (and display) a map:
const map = new H.Map(
    document.getElementById("mapContainer"),
    defaultLayers.hybrid.day.raster, {
        engineType: engineType,
        zoom: 14,
        pixelRatio: 2,
        center: {
                lat: 45.5048,
                lng: -73.5870
            }
    });

map.addLayer(defaultLayers.hybrid.day.vector);

// MapEvents enables the event system.
// The behavior variable implements default interactions for pan/zoom (also on mobile touch environments).
const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

// Enable dynamic resizing of the map, based on the current size of the enclosing cntainer
window.addEventListener('resize', () => map.getViewPort().resize());

// Create the default UI:
const ui = H.ui.UI.createDefault(map, defaultLayers)

// Create an info bubble with the HTML content
const coords = { lat: 45.5048, lng: -73.5870 };
const infoBubble = new H.ui.InfoBubble(coords, {
    content: '<b>Mount Royal</b><br>A hill in Montreal with stunning city views'
});

ui.addBubble(infoBubble);
/*
    pontos.forEach((ponto, index) => {//para cada ponto, cria um marcador
      const html = `<div class="custom-label">${ponto.texto}</div>`;
      const domIcon = new H.map.DomIcon(html);
      const domMarker = new H.map.DomMarker({ lat: ponto.lat, lng: ponto.lng }, { icon: domIcon });

      // Guardamos a posição dentro do marcador
      domMarker.setData({ lat: ponto.lat, lng: ponto.lng, texto: ponto.texto });

      domMarker.addEventListener('tap', function (evt) {
        const { lat, lng, texto } = evt.target.getData();
        console.log(`Clicou em: ${texto}`);
        map.setCenter({ lat, lng }, true); // true = animado
        map.setZoom(14, true); // Zoom com animação
      });

      map.addObject(domMarker);
    });

    if (pontos.length > 1) {
      const bounds = pontos.reduce((bbox, p) => bbox.extend(p), new H.geo.Rect(pontos[0].lat, pontos[0].lng, pontos[0].lat, pontos[0].lng));
      map.getViewModel().setLookAtData({ bounds: bounds });
    }*/