// ==UserScript==
// @name         Google Job Filter
// @namespace    https://github.com/erik-io
// @version      0.2
// @description  Markiert und filtert Stellenangebote
// @author       erik-io
// @match        https://www.google.de/search*udm=8*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

console.log('--- GJF SCRIPT v0.2 --- ' + new Date().toLocaleTimeString() + ' ---');

// --- Konfiguration ---
const HIDDEN_COMPANIES_KEY = 'googleJobFilter_hiddenCompanies';

// --- Hilfsfunktionen ---
function getHiddenCompanies() {
    return JSON.parse(GM_getValue(HIDDEN_COMPANIES_KEY, '[]'));
}

function addCompanyToHiddenList(companyName) {
    const companyNameLower = companyName.toLowerCase().trim(); // Für Speicherung und Vergleich normalisieren
    let hiddenCompanies = getHiddenCompanies(); // Holt die aktuelle Liste

    if (hiddenCompanies.includes(companyNameLower)) {
        console.log(`[GJF] Firma "${companyName}" ist bereits auf der Liste.`);
        return false; // Firma ist bereits auf der Liste
    } else {
        hiddenCompanies.push(companyNameLower); // Zum Array hinzufügen
        GM_setValue(HIDDEN_COMPANIES_KEY, JSON.stringify(hiddenCompanies)); // Aktualisierte Liste speichern
        console.log(`[GJF] Firma "${companyName}" wurde zur Liste hinzugefügt.`);
        return true; // Firma wurde erfolgreich hinzugefügt
    }
}

function getPostAge(dateText) {
    // Wenn das Datum nicht gefunden wird, geben wir Infinity zurück
    if (dateText === 'Datum nicht gefunden' || !dateText) {
        return Infinity; // Oder eine andere große Zahl
    }

    dateText = dateText.toLowerCase(); // Um "Vor" und "vor" gleich zu behandeln

    const daysMatch = dateText.match(/vor\s+(\d+)\s+tag/); // Sucht nach "vor X Tag(en)"
    if (daysMatch) {
        // daysMatch[1] enthält die Zahl, die durch den regulären Ausdruck extrahiert wurde
        // parseInt(..., 10) wandelt diesen String in eine Ganzzahl im Dezimalsystem um (Radix 10).
        return parseInt(daysMatch[1], 10);
    }

    return Infinity; // Wenn kein passendes Datum gefunden wird, geben wir Infinity zurück
}

// Immediately Invoked Function Expression (IIFE)
(function () {
    'use strict';

    // --- CSS-Selektoren ---
    const jobSelector = '.EimVGf'; // Hauptcontainer für ein einzelnes Stellenangebot
    const companySelector = '.a3jPc'; // Element, das den Firmennamen enthält
    const dateSelector = '.Yf9oye[aria-label^="Gepostet:"]'; // Element, das das Veröffentlichungsdatum enthält
    const shareButtonSelector = '[aria-label="Teilen"] .niO4u'; // Element, das den Teilen-Button enthält

    let hiddenCompaniesList = getHiddenCompanies();
    console.log('[GJF] Aktuelle Liste der versteckten Unternehmen:', hiddenCompaniesList);

    const jobElements = document.querySelectorAll(jobSelector);

    if (jobElements.length > 0) {
        console.log(`[GJF] Es wurden ${jobElements.length} Stellenangebote mit dem "${jobSelector}"-Selektor gefunden!`);

        jobElements.forEach((jobElement, index) => {

            const dateElement = jobElement.querySelector(dateSelector); // querySelector für das Datum statt querySelectorAll
            const companyElement = jobElement.querySelector(companySelector); // querySelector für den Firmennamen statt querySelectorAll

            // Falls das Datum nicht gefunden wird, setzen wir den Text auf "Datum nicht gefunden"
            let dateText = 'Datum nicht gefunden';
            if (dateElement) {
                dateText = dateElement.innerText;
            }

            // Falls die Firma nicht gefunden wird, setzen wir den Text auf "Unternehmen nicht gefunden"
            let companyText = 'Unternehmen nicht gefunden';
            if (companyElement) {
                companyText = companyElement.innerText.trim();
            }

            // Stellenangebot X: Firma: "Unternehmen", Datum: "Datum"
            console.log(`[GJF] Stellenangebot ${index + 1}: Firma: "${companyText}", Datum: "${dateText}"`);

            // Überprüfen, ob die Firma auf der Liste der versteckten Firmen steht
            // Diese Prüfung erfolgt, bevor andere Aktionen für das Stellenangebot durchgeführt werden
            if (companyText !== 'Unternehmen nicht gefunden' && hiddenCompaniesList.includes(companyText.toLowerCase())) {
                console.log(`[GJF]   -> Jobangebot von "${companyText}" wird ausgeblendet (Firma ist auf der Blacklist).`);
                jobElement.style.display = 'none'; // Versteckt das Stellenangebot
                return; // Beendet die Verarbeitung dieses Stellenangebots
            }

            const postAge = getPostAge(dateText);

            if (postAge < 7) { // Jünger als 7 Tage
                jobElement.style.backgroundColor = 'rgba(255, 255, 0, 0.2)';
                jobElement.style.borderLeft = '5px solid gold';
                console.log(`[GJF]   -> Hervorgehoben! Alter: ${postAge} Tag(e)`);
            }

            if (companyText !== 'Unternehmen nicht gefunden') {
                const shareButton = jobElement.querySelector(shareButtonSelector);
                if (shareButton) {
                    console.log(`[GJF]   -> Job ${index + 1}: "Teilen"-Button für Firma "${companyText}" gefunden und Event-Listener wird hinzugefügt.`);

                    // --- NEU: Logo ändern vom ehemaligen "Teilen"-Button ---
                    const iconContainer = shareButton.querySelector('.kHtcsd > span');
                    if (iconContainer) {
                        // Quelle: Google Material Icons (Apache-2.0 Lizenz)
                        // https://fonts.google.com/icons?icon.category=Actions&selected=Material+Symbols+Outlined:visibility_off:FILL@0;wght@400;GRAD@0;opsz@20&icon.size=18&icon.color=%231f1f1f&icon.query=visi&icon.platform=web
                        const visibility_off = `<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#1f1f1f"><path d="m637-425-62-62q4-38-23-65.5T487-576l-62-62q13-5 27-7.5t28-2.5q70 0 119 49t49 119q0 14-2.5 28t-8.5 27Zm133 133-52-52q36-28 65.5-61.5T833-480q-49-101-144.5-158.5T480-696q-26 0-51 3t-49 10l-58-58q38-15 77.5-21t80.5-6q143 0 261.5 77.5T912-480q-22 57-58.5 103.5T770-292Zm-2 202L638-220q-38 14-77.5 21t-80.5 7q-143 0-261.5-77.5T48-480q22-57 58-104t84-85L90-769l51-51 678 679-51 51ZM241-617q-35 28-65 61.5T127-480q49 101 144.5 158.5T480-264q26 0 51-3.5t50-9.5l-45-45q-14 5-28 7.5t-28 2.5q-70 0-119-49t-49-119q0-14 3.5-28t6.5-28l-81-81Zm287 89Zm-96 96Z"/></svg>`
                        iconContainer.innerHTML = visibility_off;
                    }
                    // --- ENDE NEU ---

                    shareButton.addEventListener('click', function (event) {
                            event.preventDefault(); // Standard Aktion des Buttons verhindern
                            event.stopPropagation(); // Klick-Event nicht weitergeben

                            const confirmationMessage = `Möchtest du Stellenangebote von "${companyText}" auf Google Jobs verstecken?`;
                            if (window.confirm(confirmationMessage)) {
                                // Benutzer hat 'OK' gedrückt
                                if (addCompanyToHiddenList(companyText)) {
                                    // Firma wurde erfolgreich hinzugefügt
                                    console.log(`[GJF] Nutzer hat "${companyText}" zur Blacklist hinzugefügt.`);

                                    // Versteckt das Stellenangebot
                                    jobElement.style.display = 'none';

                                    // Aktualisieren der hiddenCompaniesList
                                    hiddenCompaniesList = getHiddenCompanies();
                                } else {
                                    // Firma war bereits auf der Liste
                                    console.log(`[GJF] "${companyText}" war bereits auf der Blacklist oder konnte nicht hinzugefügt werden.`)
                                    alert(`"${companyText}" ist bereits auf der Blacklist.`)
                                }
                            } else {
                                // Benutzer hat auf "Abbrechen" geklickt
                                console.log(`[GJF] Nutzer hat abgebrochen: "${companyText}" wird nicht versteckt.`)
                            }
                        }
                    )
                } else {
                    console.warn(`[GJF]   -> Job ${index + 1}: Firma "${companyText}" hat KEINEN "Teilen"-Button mit Selektor "${shareButtonSelector} gefunden!`);
                }
            }

        })
    } else {
        console.log(`[GJF] Keine Stellenangebote mit dem Selektor "${jobSelector}" auf dieser Seite gefunden.`);
    }
})();