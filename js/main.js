/* Lavaut'Home — interactions du site (aucune dépendance) */
(function () {
  "use strict";

  /* ---------- Configuration ---------- */
  var PRICES = {            // grille officielle (lavauthome.com/nos-services)
    citadine:   [50, 65, 80],
    berline:    [60, 75, 90],
    suv:        [70, 85, 100],
    utilitaire: [80, 110, 140]
  };
  var EXT = 30;             // option extérieur
  var CALENDLY = "https://calendly.com/lavauthome/2";
  var NAMES = { citadine: "Citadine", berline: "Berline", suv: "SUV", utilitaire: "Utilitaire" };
  var LEVELS = ["Niveau 1", "Niveau 2", "Niveau 3"];

  // Codes postaux français desservis — à ajuster avec Lavaut'Home
  var ZONE = {
    "54400": "Longwy", "54350": "Mont-Saint-Martin", "54440": "Herserange", "54430": "Réhon",
    "54810": "Longlaville", "54190": "Villerupt", "57390": "Audun-le-Tiche", "54590": "Hussigny-Godbrange",
    "54920": "Villers-la-Montagne", "54720": "Lexy / Cutry", "54135": "Mexy", "54260": "Longuyon",
    "54870": "Cons-la-Grandville", "54880": "Thil"
  };

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var val = function (form, name) { var el = form.querySelector('[name="' + name + '"]:checked'); return el ? el.value : null; };
  var price = function (veh, lvl, ext) { return PRICES[veh][+lvl] + (ext ? EXT : 0); };

  /* ---------- Menu mobile ---------- */
  var burger = $(".burger"), nav = $("#nav");
  function closeNav() { nav.classList.remove("is-open"); burger.setAttribute("aria-expanded", "false"); burger.setAttribute("aria-label", "Ouvrir le menu"); }
  if (burger) {
    burger.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", open);
      burger.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
    });
    $$("a", nav).forEach(function (a) { a.addEventListener("click", closeNav); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeNav(); });
  }

  /* ---------- Formulaire de réservation (déclaré tôt, utilisé par le prix rapide) ---------- */
  var book = $("#book");
  function setRadio(form, name, value) {
    var el = form && form.querySelector('[name="' + name + '"][value="' + value + '"]');
    if (el) el.checked = true;
  }

  /* ---------- Prix rapide ---------- */
  var quick = $("#quick");
  if (quick) {
    var updateQuick = function () { $("#q-total").textContent = price(val(quick, "q-veh"), val(quick, "q-lvl"), $("#q-ext").checked); };
    quick.addEventListener("change", updateQuick);
    quick.addEventListener("submit", function (e) { e.preventDefault(); });
    $("#q-go").addEventListener("click", function () {
      setRadio(book, "vehicule", val(quick, "q-veh"));
      setRadio(book, "niveau", val(quick, "q-lvl"));
      $("#b-ext").checked = $("#q-ext").checked;
      updateRecap();
    });
    updateQuick();
  }

  /* ---------- Tableau des tarifs ---------- */
  var tExt = $("#t-ext");
  if (tExt) {
    tExt.addEventListener("change", function () {
      $$("#prices td[data-p]").forEach(function (td) {
        td.firstChild.nodeValue = +td.getAttribute("data-p") + (tExt.checked ? EXT : 0);
      });
    });
  }

  /* ---------- Vérification de zone ---------- */
  var checker = $("#checker");
  if (checker) {
    checker.addEventListener("submit", function (e) {
      e.preventDefault();
      var raw = $("#cp").value.trim().toUpperCase().replace(/^L-?/, "L"), out = $("#cp-out");
      var cp = raw.replace(/\D/g, "");
      out.className = "checker__out";
      if (/^L?\d{4}$/.test(raw) && raw[0] === "L") {
        out.textContent = "Luxembourg : on se déplace, appelez-nous pour caler le créneau."; out.classList.add("ok");
      } else if (cp.length === 4) {
        out.textContent = "Belgique ou Luxembourg : on se déplace, appelez-nous pour caler le créneau."; out.classList.add("ok");
      } else if (cp.length === 5 && ZONE[cp]) {
        out.textContent = "Oui, on intervient à " + ZONE[cp] + "."; out.classList.add("ok");
      } else if (cp.length === 5) {
        out.textContent = "Hors zone habituelle. Appelez le 06 68 83 67 73, on regarde au cas par cas."; out.classList.add("ko");
      } else {
        out.textContent = "Entrez un code postal (5 chiffres en France, 4 en Belgique ou au Luxembourg)."; out.classList.add("ko");
      }
    });
  }

  /* ---------- Consentement (Calendly dépose des cookies) ---------- */
  function getConsent() { try { var m = document.cookie.match(/(?:^|; )lh_consent=([^;]+)/); return m ? m[1] : null; } catch (e) { return null; } }
  function setConsent(v) { try { document.cookie = "lh_consent=" + v + "; max-age=" + 60 * 60 * 24 * 180 + "; path=/; SameSite=Lax"; } catch (e) {} }

  /* ---------- Réservation en 3 étapes ---------- */
  var step = 0;

  function updateRecap() {
    if (!book) return;
    var v = val(book, "vehicule"), l = val(book, "niveau"), e = $("#b-ext").checked, lieu = val(book, "lieu");
    var p = price(v, l, e);
    $("#r-veh").textContent = NAMES[v];
    $("#r-lvl").textContent = LEVELS[+l];
    $("#r-ext").textContent = e ? "Oui (+30 €)" : "Non";
    $("#r-lieu").textContent = lieu;
    $("#r-total").textContent = p;
    $("#b-prix").value = p + " € TTC";
    $("#addr-field").hidden = lieu !== "À domicile";
  }

  function showErr(id, show) { var el = $("#" + id); if (el) el.hidden = !show; return !show; }

  function validate(n) {
    if (n !== 1) return true;
    var domicile = val(book, "lieu") === "À domicile";
    return [
      showErr("e-nom", $("#b-nom").value.trim().length < 2),
      showErr("e-prenom", $("#b-prenom").value.trim().length < 2),
      showErr("e-tel", $("#b-tel").value.replace(/\D/g, "").length < 9),
      showErr("e-mail", !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test($("#b-mail").value.trim())),
      showErr("e-addr", domicile && $("#b-addr").value.trim().length < 6)
    ].every(Boolean);
  }

  function go(n) {
    $$(".pane", book).forEach(function (p) { p.classList.toggle("is-on", +p.getAttribute("data-pane") === n); });
    $$(".book__steps li", book).forEach(function (li, i) {
      li.classList.toggle("is-on", i === n);
      li.classList.toggle("is-done", i < n);
    });
    step = n;
    var pane = $('.pane[data-pane="' + n + '"]', book);
    var first = n === 2 ? pane : $("input:not([type=radio]):not([type=checkbox]):not([type=hidden]), textarea", pane) || $("input", pane);
    if (first) first.focus({ preventScroll: true });
    var top = book.getBoundingClientRect().top + window.scrollY - 100;
    if (window.scrollY > top) window.scrollTo({ top: top, behavior: "smooth" });
  }

  function summary() {
    var v = val(book, "vehicule"), l = val(book, "niveau"), e = $("#b-ext").checked;
    return [
      NAMES[v] + " · " + LEVELS[+l] + (e ? " + extérieur" : ""),
      price(v, l, e) + " € TTC",
      val(book, "lieu") + (val(book, "lieu") === "À domicile" ? " : " + $("#b-addr").value.trim() : ""),
      "Tél. " + $("#b-tel").value.trim(),
      $("#b-msg").value.trim()
    ].filter(Boolean).join(" | ");
  }

  function calendlyUrl() {
    var params = new URLSearchParams({
      hide_gdpr_banner: "1",
      embed_type: "Inline",
      embed_domain: location.hostname || "lavauthome.com",
      name: ($("#b-prenom").value + " " + $("#b-nom").value).trim(),
      email: $("#b-mail").value.trim(),
      a1: summary()   // pré-remplit la 1re question Calendly si elle existe
    });
    return CALENDLY + "?" + params.toString();
  }

  function mountCalendly() {
    var box = $("#cal"), url = calendlyUrl();
    $("#cal-link").href = url.replace("embed_type=Inline&", "");
    box.innerHTML = "";
    if (getConsent() === "yes") {
      var f = document.createElement("iframe");
      f.src = url; f.title = "Choisir un créneau de nettoyage (Calendly)"; f.loading = "lazy";
      box.appendChild(f);
    } else {
      var d = document.createElement("div");
      d.className = "cal__fallback";
      d.innerHTML = '<p>Le calendrier est fourni par Calendly, qui utilise des cookies. Acceptez-les pour l\'afficher ici, ou ouvrez-le dans un nouvel onglet.</p>';
      var a = document.createElement("button");
      a.type = "button"; a.className = "btn btn--blue"; a.textContent = "Afficher le calendrier";
      a.addEventListener("click", function () { setConsent("yes"); hideBanner(); mountCalendly(); });
      d.appendChild(a);
      box.appendChild(d);
    }
  }

  function sendToNetlify(form) {
    var data = new FormData(form);
    data.set("niveau", LEVELS[+val(form, "niveau")]);
    data.set("exterieur", $("#b-ext").checked ? "oui" : "non");
    return fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(data).toString()
    }).catch(function () { /* hors Netlify (test local) : on continue quand même */ });
  }

  if (book) {
    book.addEventListener("input", updateRecap);
    book.addEventListener("change", updateRecap);
    $$("[data-next]", book).forEach(function (b) { b.addEventListener("click", function () { if (validate(step)) go(step + 1); }); });
    $$("[data-prev]", book).forEach(function (b) { b.addEventListener("click", function () { go(step - 1); }); });

    book.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validate(1)) return;
      updateRecap();
      sendToNetlify(book);
      mountCalendly();
      go(2);
    });

    updateRecap();
  }

  // « Demander un devis » : présélectionne l'objet du formulaire de contact
  $$("[data-pro]").forEach(function (a) {
    a.addEventListener("click", function () { var s = $("#c-objet"); if (s) s.selectedIndex = 1; });
  });

  /* ---------- Barre d'action mobile ---------- */
  var mbar = $("#mbar"), hero = $(".hero");
  if (mbar && hero && "IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      mbar.classList.toggle("is-on", !entries[0].isIntersecting);
    }, { threshold: 0 }).observe(hero);
  }

  /* ---------- Bandeau cookies ---------- */
  var banner = $("#cookie");
  function hideBanner() { if (banner) banner.hidden = true; }
  if (banner) {
    if (!getConsent()) banner.hidden = false;
    $$("[data-consent]", banner).forEach(function (b) {
      b.addEventListener("click", function () {
        setConsent(b.getAttribute("data-consent")); hideBanner();
        if (step === 2) mountCalendly();
      });
    });
    $$("[data-cookies]").forEach(function (a) { a.addEventListener("click", function (e) { e.preventDefault(); banner.hidden = false; }); });
  }

  var y = $("#year"); if (y) y.textContent = new Date().getFullYear();
})();
