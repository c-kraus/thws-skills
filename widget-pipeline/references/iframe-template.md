# Kanonische Widget-iframe-Syntax

Verwende ausschließlich diese Vorlage für Widget-Einbindungen in .qmd-Dateien:

```markdown
::: {.widget}
<iframe src="widgets/kapitel-{nn}/widget-{name}.html"
        width="100%" height="{height}px"
        frameborder="0" style="border:none;"
        title="{Zugänglicher Titel in Dokumentsprache}">
</iframe>
:::
```

## Pflichtattribute

| Attribut | Wert | Begründung |
|---|---|---|
| `width` | `"100%"` | Nie feste Pixel-Breite |
| `height` | `"400px"` / `"500px"` / `"600px"` | Initialwert — wird via postMessage dynamisch überschrieben (s. u.) |
| `frameborder` | `"0"` | HTML4-Kompatibilität |
| `style` | `"border:none;"` | CSS-Kompatibilität (ergänzt frameborder) |
| `title` | Beschreibender Text in Dokumentsprache | Pflicht für WCAG-Barrierefreiheit |

## Auto-Resize via postMessage

Widget-iframes haben feste Anfangshöhen, die auf unterschiedlichen Geräten und Zoom-Stufen nicht passen. Die Lösung: das Widget sendet seine tatsächliche Höhe an das Parent — das QMD hört zu und passt die iframe-Höhe dynamisch an.

### Sender (in jedem Widget-HTML, vor `</body>`)

Jedes Widget-HTML MUSS diesen Block direkt vor `</body>` enthalten:

```html
<script>
(function () {
  var lastH = 0;
  function reportHeight() {
    var h = document.body.scrollHeight;
    if (h === lastH) return;
    lastH = h;
    window.parent.postMessage({ iframeHeight: h }, '*');
  }
  window.addEventListener('load', function() { setTimeout(reportHeight, 100); });
  if (window.ResizeObserver) {
    new ResizeObserver(reportHeight).observe(document.body);
  }
  if (window.MutationObserver) {
    new MutationObserver(function() { setTimeout(reportHeight, 400); })
      .observe(document.body, { attributes: true, childList: true, subtree: true,
                                attributeFilter: ['class', 'style'] });
  }
})();
</script>
```

- `lastH`-Guard: verhindert Feedback-Schleife — nur gesendet, wenn sich die Höhe tatsächlich ändert
- `document.body.scrollHeight` statt `documentElement.scrollHeight`: `documentElement` reflektiert die vom Parent gesetzte iframe-Höhe und würde bei jedem Resize-Zyklus einen größeren Wert liefern → endlose Größenzunahme
- `load` + 100ms Delay: feuert nach dem ersten Render-Zyklus, wenn alle Elemente ihre finale Größe haben
- `ResizeObserver`: feuert bei Layout-Änderungen (Zoom, Fensterbreite)
- `MutationObserver` + 400ms Delay: feuert nach CSS-Transitionen (z.B. Expand/Collapse-Karten)

### Listener (einmalig im QMD, nach dem YAML-Frontmatter)

Das QMD braucht diesen `{=html}`-Block einmalig — direkt nach dem YAML-Frontmatter, vor dem ersten H2:

```markdown
```{=html}
<script>
window.addEventListener('message', function (e) {
  if (e.data && typeof e.data.iframeHeight === 'number') {
    var frames = document.querySelectorAll('iframe');
    frames.forEach(function (f) {
      try {
        if (f.contentWindow === e.source) {
          f.style.height = (e.data.iframeHeight + 2) + 'px';
        }
      } catch (err) {}
    });
  }
});
</script>
```
```

Der `+2px`-Puffer verhindert minimale Scrollbalken. Nicht mehr als +2 verwenden — größere Werte wurden früher von `documentElement.scrollHeight` re-gemessen und erzeugten endlose Größenzunahme (jetzt durch `lastH`-Guard im Sender verhindert).

## Warum `.widget`-Div?

Der Lua-Filter der THWS-Quarto-Vorlage wandelt `.widget`-Divs in enthaltene Boxen für die PDF-Ausgabe um. Bare `<iframe>`-Tags ohne Wrapper brechen das PDF-Rendering.

## Pfadkonvention

- Relativ zur .qmd-Datei: `widgets/kapitel-{nn}/widget-{name}.html`
- Kein absoluter Pfad, keine `../`-Traversierung
- Kapitel-Präfix aus Dateinamen ableiten: `kap-03-...qmd` → `kapitel-03`
