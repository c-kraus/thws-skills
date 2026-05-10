# QMD Quality Gate

Scan every interactive element and fix violations **before saving** the .qmd file. These element types are most frequently malformed in ways that silently break the Moodle Lua filter.

---

## Flip-Card Checklist

Check every `::: {.flip-card}` block:

| Regel | Korrekt | Falsch (korrigieren) |
|---|---|---|
| Heading-Ebene | `#### Begriff` (H4) | `### Begriff` oder `**Begriff**` |
| Leerzeile nach Heading | Keine — Body beginnt direkt in der nächsten Zeile | Leerzeile zwischen `####` und Body |
| Body-Länge | Ein prägnanter Definitionsabsatz | Mehrere Absätze, Headings oder Listen |

```
✓ KORREKT:
::: {.flip-card}
#### Moral Hazard
Risiko, dass der Agent nach Vertragsschluss Risiken eingeht, die der Prinzipal nicht beobachten kann.
:::

✗ FALSCH (Leerzeile bricht den Filter):
::: {.flip-card}
#### Moral Hazard

Risiko, dass der Agent...
:::
```

---

## Drag-Exercise Checklist

Check every `::: {.drag-exercise}` block:

| Regel | Korrekt | Falsch (korrigieren) |
|---|---|---|
| Kein Heading innen | Nur Fließtext | Jedes `####` oder `###` innen |
| Format | 1–2 Fließsätze | Bullet-Listen, Tabellen oder mehrzeilige Blöcke |
| Ausfüllbare Terme | Markiert mit `*kursiv*` | Unmarkiert oder nur `**fett**` |

```
✓ KORREKT:
::: {.drag-exercise}
Der Erfüllungsbetrag ist der Betrag, der zur *Erfüllung der Verpflichtung* voraussichtlich *aufgewendet* werden muss.
:::

✗ FALSCH (Heading innen, Listenformat):
::: {.drag-exercise}
#### Lückentext
- Der *Erfüllungsbetrag* ist...
- Das *Vorsichtsprinzip* ist...
:::
```

---

## Quick-Check Checklist

Check every `::: {.quick-check}` block:

| Regel | Korrekt | Falsch (korrigieren) |
|---|---|---|
| Leerzeile nach Frage | Pflicht — Leerzeile zwischen Fragetext und erster `- Option` | Keine Leerzeile: Frage und Liste kleben zusammen |
| Antwortformat | Bullet-Liste `- Option` | Nummerierte Liste, Fließtext |
| Korrekte Antwort | Genau eine Option in `**fett**` | Keine, oder mehrere fett |
| Kein Heading innen | Nur Fragetext, dann Liste | `####` oder `###` innen |

```
✓ KORREKT:
::: {.quick-check}
Welche Aussage ist korrekt?

- Falsche Option A.
- **Richtige Option — in fett.**
- Falsche Option C.
:::

✗ FALSCH (fehlende Leerzeile bricht Frage-Erkennung im Filter):
::: {.quick-check}
Welche Aussage ist korrekt?
- Falsche Option A.
- **Richtige Option.**
:::
```

---

Alle Verstöße inline beheben, bevor die Datei gespeichert wird. Bei Unsicherheit über ein Element: Syntaxregeln im `quarto-lecture` Skill nachlesen.
