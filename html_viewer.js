(function() {
  var container = document.getElementById("htmlContainer");
  if (!container) {
    container = document.createElement("div");
    container.id = "htmlContainer";
    container.style.width = "100%";
    container.style.height = "100%";
    container.style.overflow = "auto";
    container.style.boxSizing = "border-box";
    document.body.appendChild(container);
  }

  function extrairString(data) {
    if (!data) return null;

    // 1. Caso os dados venham pré-formatados pelo DSCC transform
    if (data.tables && data.tables.DEFAULT && data.tables.DEFAULT.length > 0) {
      var row = data.tables.DEFAULT[0];
      if (row.htmlDimension && row.htmlDimension.length > 0) {
        return row.htmlDimension[0];
      }
      var keys = Object.keys(row);
      for (var i = 0; i < keys.length; i++) {
        var val = row[keys[i]];
        if (Array.isArray(val) && val.length > 0) return val[0];
        if (typeof val === "string") return val;
      }
    }

    if (
      data.dataResponse &&
      data.dataResponse.tables &&
      data.dataResponse.tables.length > 0 &&
      data.dataResponse.tables[0].rows &&
      data.dataResponse.tables[0].rows.length > 0
    ) {
      return data.dataResponse.tables[0].rows[0][0];
    }

    return null;
  }

  function desenhar(data) {
    try {
      var html = extrairString(data);

      // Se não houver HTML ou se a string for vazia, não exibe nada
      if (!html || typeof html !== "string" || html.trim() === "") {
        container.innerHTML = "";
        return;
      }

      container.innerHTML = html;
    } catch (err) {
      container.innerHTML = ""; 
    }
  }

  window.addEventListener("message", function(event) {
    if (!event.data) return;
    if (event.data.type === "RENDER" || event.data.dataResponse || event.data.tables) {
      desenhar(event.data);
    }
  });

  var compId = new URLSearchParams(window.location.search).get("dscId");
  window.parent.postMessage({ type: "vizReady", componentId: compId }, "*");
})();