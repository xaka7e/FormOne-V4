# FORMONE

Deutschsprachiger Shop-Prototyp mit einer scrollgesteuerten Startszene. (Немецкоязычный прототип магазина с первой сценой, управляемой прокруткой.)

## Wo ändere ich was? (Где что менять?)

| Datei / Bereich (Файл / блок)                    | Aufgabe (Назначение)                                                                                                                                             |
| ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `index.html`                                     | Seitenaufbau, Navigation, SVG-Szenen und feste Texte. (Структура страницы, навигация, SVG-сцены и постоянные тексты.)                                            |
| `index.html` → `gym-wall-art`, `gym-wall-slogan` | Graffiti an der Seitenwand und die graue Tafel davor. (Граффити на боковой стене и серая табличка поверх него.)                                                |
| `styles.css`                                     | Farben, Schrift, Abstände und Bildschirmgrößen. Die mobilen Regeln stehen am Ende. (Цвета, шрифты, отступы и размеры экрана. Мобильные стили находятся в конце.) |
| `animation.js` → `featuredProducts`              | Produktnamen, Beschreibungen, Eigenschaften, Bilder und Alternativtexte. (Названия, описания, характеристики, изображения и альтернативные тексты товаров.)      |
| `animation.js` → `jar`, `leg`, `arm`, `load`     | Zeichnung der Dosen, Athleten und Trageposen. (Отрисовка банок, атлетов и поз с грузом.)                                                                         |
| `animation.js` → `renderMobile`                  | Schritte des Athleten, Produktwechsel, Pulvermenge, Wasser und Aufhellung der Mischung. (Шаги атлета, смена товаров, количество порошка, вода и осветление смеси.) |
| `animation.js` → `mobileProductStops`             | Zeitpunkte der mobilen Produktwechsel: früher erster Wechsel, unabhängig von den Zubereitungsphasen. (Моменты смены мобильных товаров: ранний первый переход, независимо от этапов приготовления.) |
| `animation.js` → `renderDesktop`                 | Laufbewegung, Fahne und vier Produktabschnitte. (Ходьба, флаг и четыре товарных этапа.)                                                                          |
| `animation.js` → `render`, `update`              | Umrechnung der Scrollposition in den Animationsfortschritt. (Преобразование прокрутки в прогресс анимации.)                                                      |
| `assets/`                                        | Originalverpackungen und Hintergründe der Produktkarten. (Оригинальные упаковки и фоны карточек товаров.)                                                        |
| `robots.txt`, `vercel.json`                      | Schutz vor Suchmaschinenindexierung während der Prototypphase. (Запрет индексации поисковиками на этапе прототипа.)                                              |

## Text und Kommentare (Текст и комментарии)

Die Oberfläche ist auf Deutsch. Originale Markennamen und die Beschriftung der Produktfotos bleiben erhalten. (Интерфейс на немецком. Оригинальные названия брендов и надписи на фотографиях упаковок сохраняются.)

Kommentare stehen zuerst auf Deutsch, gefolgt von der russischen Erklärung in Klammern. Sie beschreiben den Zweck eines Abschnitts und wichtige Zusammenhänge. (Комментарии сначала на немецком, затем русское пояснение в скобках. Они объясняют назначение блока и важные связи.)

Die ersten Produktangaben stehen auch in `index.html`, damit sie vor dem Laden der Animation sichtbar sind. Bei Textänderungen beide Stellen abgleichen. (Данные первого товара также находятся в `index.html`, чтобы отображаться до загрузки анимации. При изменении текста нужно сверять оба места.)

## Darstellung prüfen (Проверка отображения)

Nach Änderungen die Desktop- und Mobilansicht öffnen, alle Animationsschritte vorwärts und rückwärts prüfen und über das Menü zum Sortiment springen. Besonders auf lange deutsche Wörter und kleine Bildschirme achten. (После изменений проверить компьютерную и мобильную версии, все этапы вперёд и назад, переход к каталогу через меню. Особое внимание — длинным немецким словам и маленьким экранам.)

`node tests/mobile-story.cjs http://localhost:4173/` prüft mit Playwright die Produktwechsel, Schritte und das Aufhellen nach der Wasserzugabe. Playwright und ein Chromium-Browser müssen verfügbar sein; bei externen Installationen helfen `PLAYWRIGHT_PATH` und `CHROME_PATH`. (Команда проверяет через Playwright смену товаров, шаги и осветление после добавления воды. Нужны Playwright и браузер Chromium; для внешних установок можно задать `PLAYWRIGHT_PATH` и `CHROME_PATH`.)

Die Demo enthält noch keine Bestellfunktion. Die bestehenden `noindex`-Angaben bleiben bis zum bewussten Start der vollständigen Website erhalten. (В демоверсии пока нет оформления заказа. Текущий запрет индексации сохраняется до осознанного запуска полного сайта.)
