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


    // 1. Il sito viene mostrato subito, dietro la busta
    mainContent.style.display = "flex";

    mainContent.style.animation = "comparsa 1.6s ease";

    window.scrollTo(0, 0);

    aggiornaScorri();


    // 2. Il sigillo si stacca, il lembo si apre e la busta sfuma
    wrapper.classList.add("open");


    // 3. A fine animazione la busta viene rimossa
    setTimeout(function () {
        wrapper.style.display = "none";
    }, 2300);

}


/* =========================================================
   MOSTRA PAGINA CONFERMA
========================================================= */

function mostraConferma() {

    document.querySelector(".invito").style.display = "none";

    document.querySelector(".conferma").style.display = "flex";

    window.scrollTo(0, 0);

    aggiornaScorri();

}


/* =========================================================
   TORNA ALL'INVITO
========================================================= */

function tornaInvito() {

    document.querySelector(".conferma").style.display = "none";

    // "" ripristina il display del CSS (flex)
    document.querySelector(".invito").style.display = "";

    // Si torna in fondo all'invito, da dove si era partiti
    document.querySelector(".conferma-presenza").scrollIntoView({ block: "center" });

    aggiornaScorri();

}


/* =========================================================
   INDICATORE "SCORRI VERSO IL BASSO"
   Visibile finché l'invito è aperto e non si è arrivati in fondo
========================================================= */

function scorriGiu() {

    window.scrollBy({ top: window.innerHeight * 0.8, behavior: "smooth" });

}

function aggiornaScorri() {

    let scorri = document.getElementById("scorri");

    let mainContent = document.getElementById("mainContent");

    let invito = document.querySelector(".invito");


    let invitoVisibile =
        mainContent.style.display !== "none" &&
        invito.style.display !== "none";

    let arrivatoInFondo =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 60;


    scorri.classList.toggle("visibile", invitoVisibile && !arrivatoInFondo);

}

window.addEventListener("scroll", aggiornaScorri, { passive: true });

window.addEventListener("resize", aggiornaScorri);


/* =========================================================
   COPIA IBAN
========================================================= */

function copiaIban() {

    let iban = document.getElementById("iban").innerText.trim();

    let btn = document.getElementById("btnCopia");


    function fatto() {

        btn.innerText = "Copiato!";

        setTimeout(function () {
            btn.innerText = "Copia IBAN";
        }, 2000);

    }


    if (navigator.clipboard && window.isSecureContext) {

        navigator.clipboard.writeText(iban).then(fatto);

        return;

    }


    // Alternativa per i browser che non permettono la copia diretta
    let campo = document.createElement("textarea");

    campo.value = iban;

    document.body.appendChild(campo);

    campo.select();

    document.execCommand("copy");

    document.body.removeChild(campo);

    fatto();

}


/* =========================================================
   CHIUDI POPUP
========================================================= */

function chiudiPopup() {

    document.getElementById("popupSuccesso").style.display = "none";

    tornaInvito();

}


/* =========================================================
   MESSAGGIO DI ERRORE
========================================================= */

function mostraMessaggio(testo) {

    document.getElementById("messaggio").innerText = testo;

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

    input.type = "text";

    input.className = "nomePersona";

    input.placeholder = "Nome e Cognome";

    div.appendChild(input);

    input.focus();

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

        mostraMessaggio("Scrivi il nome e cognome di almeno una persona.");

        persone[0].focus();

        return;

    }


    /* Controllo conferma presenza */

    if (!check) {

        mostraMessaggio("Spunta la casella «Confermo la mia presenza».");

        return;

    }


    /* Blocca il pulsante durante l'invio (evita doppi invii) */

    let btn = document.getElementById("btnConferma");

    mostraMessaggio("");

    btn.disabled = true;

    btn.innerHTML = "Invio in corso…";


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

        btn.disabled = false;

        btn.innerHTML = "Invia conferma";

        mostraMessaggio("Ops, qualcosa non ha funzionato. Controlla la connessione e riprova.");

    });

}