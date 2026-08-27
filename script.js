/* =========================================================
   EMAILJS
========================================================= */

(function () {

    emailjs.init("y-If0J2_7f_TfC57X");

})();


/* =========================================================
   VARIABILI
========================================================= */

let giaConfermato = false;


/* =========================================================
   APRI BUSTA INVITO
========================================================= */

function apriBusta() {

    let wrapper = document.getElementById("envelopeWrapper");

    let mainContent = document.getElementById("mainContent");


    if (!wrapper || wrapper.classList.contains("open")) {
        return;
    }


    // 1. Avvia l'animazione della busta (si apre il flap e fuoriesce l'invito)
    wrapper.classList.add("open");


    // 2. Dopo l'animazione della lettera, sfuma la busta e mostra il sito
    setTimeout(function () {

        wrapper.classList.add("fade-out");

        mainContent.style.display = "flex";

        mainContent.style.animation = "comparsa 1s ease";


        // Rimuove completamente il wrapper dopo il fade-out
        setTimeout(function () {
            wrapper.style.display = "none";
        }, 800);

    }, 1200);

}


/* =========================================================
   MOSTRA PAGINA CONFERMA
========================================================= */

function mostraConferma() {

    document.querySelector(".invito").style.display = "none";

    if (document.querySelector(".countdown-page")) {
        document.querySelector(".countdown-page").style.display = "none";
    }

    document.querySelector(".conferma").style.display = "block";

}


/* =========================================================
   TORNA ALL'INVITO
========================================================= */

function tornaInvito() {

    document.querySelector(".conferma").style.display = "none";

    document.querySelector(".invito").style.display = "block";

    if (document.querySelector(".countdown-page")) {
        document.querySelector(".countdown-page").style.display = "block";
    }

}


/* =========================================================
   LOGICA COUNTDOWN (2 SETTEMBRE 2027)
========================================================= */

const dataMatrimonio = new Date("2027-09-02T00:00:00").getTime();

function aggiornaCountdown() {

    const ora = new Date().getTime();

    const differenza = dataMatrimonio - ora;


    if (differenza <= 0) {

        document.getElementById("cd-giorni").innerText = "00";

        document.getElementById("cd-ore").innerText = "00";

        document.getElementById("cd-minuti").innerText = "00";

        document.getElementById("cd-secondi").innerText = "00";

        return;

    }


    const giorni = Math.floor(differenza / (1000 * 60 * 60 * 24));

    const ore = Math.floor((differenza % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    const minuti = Math.floor((differenza % (1000 * 60 * 60)) / (1000 * 60));

    const secondi = Math.floor((differenza % (1000 * 60)) / 1000);


    if (document.getElementById("cd-giorni")) {

        document.getElementById("cd-giorni").innerText = giorni < 10 ? "0" + giorni : giorni;

        document.getElementById("cd-ore").innerText = ore < 10 ? "0" + ore : ore;

        document.getElementById("cd-minuti").innerText = minuti < 10 ? "0" + minuti : minuti;

        document.getElementById("cd-secondi").innerText = secondi < 10 ? "0" + secondi : secondi;

    }

}


// Avvia countdown ogni secondo
setInterval(aggiornaCountdown, 1000);

// Esegui subito al caricamento
aggiornaCountdown();


/* =========================================================
   AGGIUNGI PERSONA
========================================================= */

function aggiungiPersona() {

    if (giaConfermato) {
        return;
    }

    let div = document.getElementById("persone");

    let input = document.createElement("input");

    input.className = "nomePersona";

    input.placeholder = "Nome e Cognome";

    div.appendChild(input);

}


/* =========================================================
   CONFERMA PRESENZA
========================================================= */

function conferma() {

    if (giaConfermato) {
        return;
    }


    /* Recupero tutte le persone */

    let persone = document.querySelectorAll(".nomePersona");

    let lista = [];


    persone.forEach(function (p) {

        if (p.value.trim() !== "") {

            lista.push(p.value.trim());

        }

    });


    /* Recupero checkbox */

    let check = document.getElementById("presenza").checked;


    /* Controllo persone */

    if (lista.length === 0) {

        alert("Inserisci almeno una persona");

        return;

    }


    /* Controllo conferma presenza */

    if (!check) {

        alert("Conferma la presenza");

        return;

    }


    /* =====================================================
       PARAMETRI EMAILJS
    ===================================================== */

    let parametri = {

        invitati: lista.join(", "),

        presenza: "Confermata"

    };


    /* =====================================================
       INVIO EMAIL
    ===================================================== */

    emailjs.send(

        "service_6lc8nro",

        "template_62yim46",

        parametri

    )

    .then(function () {

        /* Conferma inviata */

        giaConfermato = true;


        /* Disabilita pulsanti */

        document.getElementById("btnConferma").disabled = true;

        document.querySelector(".aggiungi").disabled = true;


        /* Cambia testo pulsante */

        document.getElementById("btnConferma").innerHTML =
            "Conferma inviata ✓";


        /* Mostra popup */

        document.getElementById("popupSuccesso").style.display = "flex";

    })

    .catch(function (error) {

        console.log(error);

        alert("Errore invio mail");

    });

}