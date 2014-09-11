#criticalmass.in-widgets

Diese kleinen Widgets kannst du dir auf deinem Blog oder deiner Webseite einbinden, um deine Besucher auf die nächste Critical Mass in deiner Nähe aufmerksam zu machen.

##Beispiel

Im Ordner examples findest du Beispiele zur Anwendung.

##Parameter für das Karten-Widget

Du musst mindestens die folgenden Parameter mitliefern:

* `width`: Breite der Karte.
* `height`: Höhe der Karte.
* `citySlug`: Bezeichnung der Stadt.

Optional sind die folgenden Parameter:

* `zoomLevel`: Ausgangswert für den Zoom-Level. Möglich sind Werte zwischen 1 und 18, Standard ist 13.
* `zoomControl`: Versteckt bei `false` die beiden Buttons zur Steuerung des Zoom-Levels, Standard ist `true`.
* `mapCenterLatitude`: Breitengrad des Mittelpunktes der Karte
* `mapCenterLongitude`: Längengrad des Mittelpunktes der Karte
* `showPopup`: Zeige zusätzliche Informationen zur Tour an, ohne dass der Benutzer auf den Marker klicken muss.

Bedenke, dass die Anwendung von `showPopup` mit der manuellen Eingabe eines Kartenmittelpunktes über `mapCenterLatitude` und `mapCenterLongitude` kolldiieren kann. Wenn `showPopup` eingeschaltet ist, wird Leaflet die Karte soweit verschieben, dass das Popup-Fenster komplett auf die Karte passt.