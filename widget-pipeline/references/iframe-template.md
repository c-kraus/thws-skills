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
  function reportHeight() {
    var h = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    window.parent.postMessage({ iframeHeight: h }, '*');
  }
  window.addEventListener('load', reportHeight);
  if (window.ResizeObserver) {
    new ResizeObserver(reportHeight).observe(document.body);
  }
})();
</script>
```

- `load` feuert beim ersten Rendern
- `ResizeObserver` feuert erneut bei Zoom-Änderungen und wenn sich der Widget-Inhalt dynamisch verändert (z. B. durch Klicks)

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
          f.style.height = (e.data.iframeHeight + 16) + 'px';
        }
      } catch (err) {}
    });
  }
});
</script>
```
```

Der `+ 16px`-Puffer verhindert, dass ein horizontaler Scrollbalken erscheint und die Höhe erneut triggert.

## Warum `.widget`-Div?

Der Lua-Filter der THWS-Quarto-Vorlage wandelt `.widget`-Divs in enthaltene Boxen für die PDF-Ausgabe um. Bare `<iframe>`-Tags ohne Wrapper brechen das PDF-Rendering.

## Pfadkonvention

- Relativ zur .qmd-Datei: `widgets/kapitel-{nn}/widget-{name}.html`
- Kein absoluter Pfad, keine `../`-Traversierung
- Kapitel-Präfix aus Dateinamen ableiten: `kap-03-...qmd` → `kapitel-03`
