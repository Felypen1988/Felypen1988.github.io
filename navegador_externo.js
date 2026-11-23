// Quem abre o site pelo navegador de dentro do Instagram/Facebook/TikTok não consegue deitar a tela (esses apps
// só ficam em pé) e ficava preso no "Gire o celular". Aqui mostramos como abrir no navegador de verdade.
(function () {
  var ua = navigator.userAgent || "";
  var dentroApp = /Instagram|FBAN|FBAV|FB_IAB|FBIOS|FB4A|Messenger|musical_ly|Bytedance|TikTok|Line\//i.test(ua);
  var celular = /Android|iPhone|iPad|iPod/i.test(ua);
  if (!dentroApp || !celular) return;
  var android = /Android/i.test(ua);
  var site = "https://jogodominio.com.br/";
  var intent = "intent://jogodominio.com.br/#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=" +
    encodeURIComponent(site) + ";end";
  // iPhone: o Instagram bloqueia abrir o Safari por link (testado em 20/11/2026), então só o passo a passo com seta

  var css = "#externo{position:fixed;inset:0;z-index:100001;background:#06101f radial-gradient(circle at 50% 30%,#12305a 0,#06101f 70%);" +
    "color:#e8eef8;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;padding:28px 22px;" +
    "font:400 17px/1.4 system-ui,-apple-system,sans-serif;text-align:center;overflow:auto}" +
    "#externo img{width:min(78vw,340px);height:auto}" +
    "#externo h1{margin:4px 0 0;font-size:24px;line-height:1.25;color:#ffd77a}" +
    "#externo p{margin:0;color:#9fb0c8;max-width:340px}" +
    "#externo .bt{display:block;width:min(84vw,340px);box-sizing:border-box;padding:16px;border-radius:14px;font-weight:700;" +
    "font-family:inherit;font-size:18px;text-decoration:none;border:0;cursor:pointer}" +
    "#externo .ouro{background:linear-gradient(#ffd25a,#f0a62a);color:#2a1604;box-shadow:0 0 22px rgba(255,170,40,.45)}" +
    "#externo .vidro{background:rgba(90,200,255,.12);color:#bfe9ff;border:1px solid rgba(90,200,255,.45)}" +
    "#externo ol{margin:0;padding:16px 18px 16px 38px;text-align:left;background:rgba(255,255,255,.06);border-radius:14px;" +
    "width:min(84vw,340px);box-sizing:border-box;line-height:1.6}" +
    "#seta{position:fixed;top:6px;right:14px;z-index:100002;display:flex;flex-direction:column;align-items:flex-end;" +
    "color:#ffd77a;font:800 15px system-ui,sans-serif;pointer-events:none;animation:seta 1.1s ease-in-out infinite}" +
    "#seta span{font-size:44px;line-height:1}#seta.fora{display:none}" +
    "@keyframes seta{0%,100%{transform:translate(0,0)}50%{transform:translate(4px,-8px)}}" +
    "#externo.fora{display:none}#externo b{color:#ffd77a}#externo .ok{color:#7ee0a0;min-height:1.4em;font-size:15px}";

  var corpo = '<img src="/logo_horizontal_v2.png" alt="Domínio">' +
    '<h1 id="ext-tit">Abra no navegador para jogar</h1>' +
    '<p id="ext-txt">O navegador do Instagram não deixa a tela deitar, e o Domínio é jogado com o celular deitado.</p>';
  if (android) {
    corpo += '<a class="bt ouro" id="abrir-chrome" href="' + intent + '">Abrir no Chrome e jogar</a>' +
      '<a class="bt vidro" href="/android/">Baixar o app para Android</a>';
  } else {
    corpo += "<ol><li>Toque nos <b>•••</b> no canto de cima, à direita (a seta mostra)</li>" +
      "<li>Escolha <b>Abrir no navegador externo</b></li><li>Deite o celular e jogue!</li></ol>";
  }
  corpo += '<button class="bt vidro" id="copiar">Copiar o link do jogo</button><div class="ok" id="copiado"></div>' +
    '<button class="bt ' + (android ? "vidro" : "ouro") + '" id="criar-aqui">Entrar ou criar conta aqui</button>';

  function mostrar() {
    var s = document.createElement("style");
    s.textContent = css;
    document.head.appendChild(s);
    var d = document.createElement("div");
    d.id = "externo";
    d.innerHTML = corpo;
    document.body.appendChild(d);
    if (!android) {   // seta apontando para os ••• do navegador do Instagram
      var seta = document.createElement("div");
      seta.id = "seta";
      seta.innerHTML = "<span>⬈</span>toque nos •••";
      document.body.appendChild(seta);
    }
    // primeiro a pessoa entra (ou cria a conta) aqui mesmo; esta tela só aparece depois, para abrir no navegador
    if (window.DominioCadastro) {
      d.classList.add("fora");
      if (seta) seta.classList.add("fora");
      window.DominioCadastro.mostrar();
    }
    document.getElementById("copiar").onclick = function () {
      var aviso = document.getElementById("copiado");
      var feito = function () { aviso.textContent = "Link copiado! Cole no " + (android ? "Chrome" : "Safari") + "."; };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(site).then(feito, function () { aviso.textContent = site; });
      } else {
        aviso.textContent = site;
      }
    };
    // dá para criar a conta aqui mesmo, com o celular em pé (site/cadastro_celular.js); depois abre no navegador
    document.getElementById("criar-aqui").onclick = function () {
      if (!window.DominioCadastro) return;
      d.classList.add("fora");
      var st = document.getElementById("seta");
      if (st) st.classList.add("fora");
      window.DominioCadastro.mostrar();
    };
  }
  var temPasse = false;
  window.DominioExterno = {
    // o jogo manda o passe de entrada (banco 0015): ele vai no link e o Safari/Chrome já abre logado
    passe: function (c) {
      if (!/^[0-9a-f]{20,}$/.test(c)) return;
      try { history.replaceState(null, "", "/#passe=" + c); } catch (e) { /* nada */ }
      site = "https://jogodominio.com.br/#passe=" + c;
      intent = "intent://jogodominio.com.br/?passe=" + c + "#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=" +
        encodeURIComponent(site) + ";end";
      var bt = document.getElementById("abrir-chrome");
      if (bt) bt.href = intent;
      temPasse = true;
      var d = document.getElementById("externo");
      var t = document.getElementById("ext-txt");
      if (t && d && document.getElementById("criar-aqui").style.display === "none") {
        t.textContent = "Você já entra direto no navegador, sem digitar a senha de novo. Vale por 15 minutos.";
      }
    },
    depoisDaConta: function () {
      var d = document.getElementById("externo");
      if (!d) return;
      document.getElementById("ext-tit").textContent = "Pronto! Agora abra no navegador para jogar";
      document.getElementById("ext-txt").textContent = temPasse
        ? "Você já entra direto no navegador, sem digitar a senha de novo. Vale por 15 minutos."
        : "Sua conta está certa. No navegador, entre com o mesmo e-mail e senha e jogue com o celular deitado.";
      document.getElementById("criar-aqui").style.display = "none";
      d.classList.remove("fora");
      var st = document.getElementById("seta");
      if (st) st.classList.remove("fora");
    }
  };
  if (document.body) mostrar(); else document.addEventListener("DOMContentLoaded", mostrar);
  // Android: tenta abrir o Chrome sozinho, uma vez; se o app bloquear, a pessoa fica nesta tela com os botões
  if (android) try {
    if (!sessionStorage.getItem("tentou_externo")) {
      sessionStorage.setItem("tentou_externo", "1");
      setTimeout(function () { location.href = intent; }, 600);
    }
  } catch (e) { /* sem sessionStorage: só os botões */ }
})();
