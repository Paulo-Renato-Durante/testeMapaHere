 const apiKey = 'GwJnNpEL9dnHevY0nLui';//chave da api| TO-DO: colocar a chave da empresa


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

    const platform = new H.service.Platform({ apikey: apiKey });//instancia a plataforma
    const defaultLayers = platform.createDefaultLayers();//instancia os layers padrão

    const map = new H.Map(//instancia o mapa
      document.getElementById('mapContainer'),
      defaultLayers.vector.normal.map,
      {
        center: { lat: pontos[0].lat, lng: pontos[0].lng },
        zoom: 10,
        pixelRatio: window.devicePixelRatio || 1
      }
    );
    // Adiciona os controles de zoom e a barra de escala
    const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
    const ui = H.ui.UI.createDefault(map, defaultLayers);
    
    
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
    }