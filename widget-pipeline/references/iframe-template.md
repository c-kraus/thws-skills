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
| `height` | `"400px"` / `"500px"` / `"600px"` | 400: einfache Widgets; 500: Charts; 600: komplexe Interaktionen |
| `frameborder` | `"0"` | HTML4-Kompatibilität |
| `style` | `"border:none;"` | CSS-Kompatibilität (ergänzt frameborder) |
| `title` | Beschreibender Text in Dokumentsprache | Pflicht für WCAG-Barrierefreiheit |

## Warum `.widget`-Div?

Der Lua-Filter der THWS-Quarto-Vorlage wandelt `.widget`-Divs in enthaltene Boxen für die PDF-Ausgabe um. Bare `<iframe>`-Tags ohne Wrapper brechen das PDF-Rendering.

## Pfadkonvention

- Relativ zur .qmd-Datei: `widgets/kapitel-{nn}/widget-{name}.html`
- Kein absoluter Pfad, keine `../`-Traversierung
- Kapitel-Präfix aus Dateinamen ableiten: `kap-03-...qmd` → `kapitel-03`
