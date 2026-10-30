/**
 * Greenspace E-mobility — hoja de cálculo de cuestionarios
 *
 * Qué hace: recibe las respuestas de un cuestionario desde gs-emobility.com y
 * crea una hoja de cálculo en el Drive de Greenspace, con una pestaña por
 * bloque (respuestas, los dos anexos y los documentos).
 *
 * Cómo se instala (5 minutos, una sola vez):
 *
 *   1. Entrar a https://script.google.com con la cuenta info@gs-emobility.com
 *      y crear un proyecto nuevo.
 *   2. Borrar el contenido de Code.gs y pegar este archivo completo.
 *   3. Crear una carpeta en Drive para los cuestionarios, abrirla y copiar el
 *      ID de la URL (la parte después de /folders/). Pegarlo abajo en CARPETA.
 *      Si se deja vacío, la hoja queda en la raíz del Drive.
 *   4. Implementar ▸ Nueva implementación ▸ tipo "Aplicación web",
 *      Ejecutar como: "Yo (info@gs-emobility.com)",
 *      Quién tiene acceso: "Cualquier persona".
 *      Google pedirá autorizar el acceso a Drive: es el propio script.
 *   5. Copiar la URL que termina en /exec y guardarla en Vercel como la
 *      variable de entorno GOOGLE_SHEETS_WEBHOOK_URL. Luego volver a desplegar.
 *
 * La URL es larga y aleatoria y es la única llave: no conviene publicarla.
 * Lo único que puede hacer quien la tenga es crear una hoja en esa carpeta.
 */

var CARPETA = ''; // ID de la carpeta de Drive, o '' para la raíz

function doPost(e) {
  try {
    var d = JSON.parse(e.postData.contents);
    var nombre = d.nombre || 'Cuestionario Greenspace';
    var pestanas = d.pestanas || [];
    if (!pestanas.length) throw new Error('sin pestañas');

    var ss = SpreadsheetApp.create(nombre);

    for (var i = 0; i < pestanas.length; i++) {
      var p = pestanas[i];
      var hoja = i === 0 ? ss.getSheets()[0] : ss.insertSheet();
      hoja.setName(String(p.titulo || ('Hoja ' + (i + 1))).substring(0, 95));

      var filas = p.filas || [];
      if (!filas.length) continue;

      // setValues exige una matriz rectangular: se rellena con cadenas vacías.
      var ancho = 1;
      for (var f = 0; f < filas.length; f++) ancho = Math.max(ancho, (filas[f] || []).length);
      var matriz = [];
      for (var f2 = 0; f2 < filas.length; f2++) {
        var fila = (filas[f2] || []).slice();
        while (fila.length < ancho) fila.push('');
        matriz.push(fila);
      }

      hoja.getRange(1, 1, matriz.length, ancho).setValues(matriz);
      hoja.setFrozenRows(1);
      for (var c = 1; c <= ancho; c++) {
        hoja.autoResizeColumn(c);
        if (hoja.getColumnWidth(c) > 420) hoja.setColumnWidth(c, 420);
      }
      hoja.getRange(1, 1, matriz.length, ancho).setVerticalAlignment('top').setWrap(true);
    }

    if (CARPETA) {
      var archivo = DriveApp.getFileById(ss.getId());
      DriveApp.getFolderById(CARPETA).addFile(archivo);
      DriveApp.getRootFolder().removeFile(archivo);
    }

    return salida({ url: ss.getUrl() });
  } catch (err) {
    return salida({ error: String(err) });
  }
}

function salida(objeto) {
  return ContentService
    .createTextOutput(JSON.stringify(objeto))
    .setMimeType(ContentService.MimeType.JSON);
}
