// Cadastro e login no celular (navegador). Dentro do jogo o teclado do celular cobria quase tudo e o jogo encolhia;
// aqui os campos são do próprio site: grandes, com preencher e-mail e salvar senha do celular, e funcionam com o
// celular em pé (até dentro do Instagram). Deitado e com pouca altura, mostra um campo por vez, grande, com PRÓXIMO.
// O jogo (tela_entrada.gd) abre este formulário e recebe os dados; a conta é criada pelo jogo, como antes.
(function () {
  var ultimo = null;   // e-mail/senha do último envio, para o celular oferecer salvar quando der certo
  var cb = null, pendente = null, modo = "entrar", passo = 0, enviando = false, termosTxt = "", contato = "";
  var raiz = null, el = {};
  var PASSOS = { criar: ["apelido", "email", "senha", "confirmar"], entrar: ["email", "senha"] };
  var NOMES = { apelido: "Apelido", email: "E-mail", senha: "Senha", confirmar: "Confirmar senha" };

  var CSS = [
    "#cad{position:fixed;inset:0;z-index:100000;display:none;color:#e8eef8;font:400 16px/1.35 system-ui,-apple-system,'Segoe UI',sans-serif;",
    "background:linear-gradient(rgba(4,10,22,.6),rgba(4,10,22,.9)),url('/imagens/fundo_entrada_v1.jpg') center/cover #06101f}",
    "#cad.on{display:block}",
    "#cad *{box-sizing:border-box}",
    "#cad .rolo{position:absolute;inset:0;overflow-y:auto;-webkit-overflow-scrolling:touch;display:flex;flex-direction:column;align-items:center;",
    "gap:14px;padding:max(24px,env(safe-area-inset-top)) 18px 24px}",
    "#cad .logo{width:min(74vw,300px);height:auto;margin-top:8px}",
    "#cad .cartao{width:100%;max-width:420px;background:rgba(10,24,48,.8);border:1.5px solid rgba(90,200,255,.55);border-radius:18px;",
    "padding:16px;box-shadow:0 0 24px rgba(60,170,255,.25);display:flex;flex-direction:column;gap:12px}",
    "#cad .abas{display:flex;background:rgba(0,0,0,.35);border-radius:12px;padding:4px}",
    "#cad .abas button{flex:1;padding:11px;border:0;border-radius:9px;background:none;font:700 17px system-ui,sans-serif;color:#9fb0c8}",
    "#cad .abas button.on{background:linear-gradient(#1d5fa0,#164a80);color:#fff;box-shadow:inset 0 0 0 1px rgba(120,210,255,.6)}",
    "#cad .tit{display:none;font-size:15px;color:#9fd6ff;font-weight:600}#cad .tit b{color:#fff}",
    "#cad .corpo{display:flex;flex-direction:column;gap:12px}",
    "#cad .campos{display:flex;flex-direction:column;gap:12px;flex:1;min-width:0}",
    "#cad .grupo{display:flex;flex-direction:column;gap:5px}",
    "#cad label.rot{font-size:14px;color:#9fd6ff;font-weight:600}",
    "#cad input.cx{height:52px;width:100%;border-radius:12px;background:rgba(2,8,20,.78);border:1.5px solid rgba(90,200,255,.35);",
    "padding:0 14px;font:400 18px system-ui,sans-serif;color:#fff;outline:none}",
    "#cad input.cx:focus{border-color:#5ad0ff;box-shadow:0 0 0 3px rgba(90,208,255,.25)}",
    "#cad input.cx::placeholder{color:#5f7189}",
    "#cad .termos{display:flex;gap:10px;align-items:center;font-size:14px;color:#c9d4e4}",
    "#cad .grupo.termos{flex-direction:row;cursor:pointer}",
    "#cad .termos input{-webkit-appearance:none;appearance:none;width:26px;height:26px;flex:none;margin:0;border-radius:7px;",
    "border:2px solid #f0a62a;background:rgba(2,8,20,.8);display:flex;align-items:center;justify-content:center}",
    "#cad .termos input:checked{background:#f0a62a}",
    "#cad .termos input:checked::after{content:'✓';color:#2a1604;font:900 17px/1 system-ui,sans-serif}",
    "#cad a{color:#ffd77a;font-weight:600}",
    "#cad .ok{height:56px;border:0;border-radius:14px;background:linear-gradient(#ffd25a,#f0a62a);color:#2a1604;font:800 19px system-ui,sans-serif;",
    "letter-spacing:1px;box-shadow:0 0 22px rgba(255,170,40,.45);cursor:pointer;flex:none}",
    "#cad .ok:disabled{opacity:.6}",
    "#cad .msg{min-height:0;font-size:15px;color:#ff8a7a;font-weight:600}#cad .msg:empty{display:none}",
    "#cad .msg.bom{color:#7ee0a0}#cad .msg.aviso{color:#ffd77a}",
    "#cad .rodape,#cad .ajuda{font-size:14px;color:#9fb0c8;text-align:center}",
    "#cad .dica{font-size:14px;color:#9fb0c8;text-align:center;margin-top:auto;padding-top:8px}",
    "#cad .modal{position:absolute;inset:0;background:rgba(0,0,0,.75);display:none;align-items:center;justify-content:center;padding:16px}",
    "#cad .modal.on{display:flex}",
    "#cad .janela{background:#0a1830;border:1.5px solid rgba(90,200,255,.55);border-radius:16px;max-width:560px;width:100%;max-height:100%;",
    "display:flex;flex-direction:column;padding:14px;gap:12px}",
    "#cad .texto{overflow-y:auto;white-space:pre-wrap;font-size:15px;color:#dfe7f2;flex:1}",
    "#cad .botoes{display:flex;gap:10px}#cad .botoes button{flex:1;height:50px;border-radius:12px;font:700 16px system-ui,sans-serif;border:0}",
    "#cad .vidro{background:rgba(90,200,255,.14);color:#bfe9ff;border:1px solid rgba(90,200,255,.45)!important}",
    // deitado e baixo (teclado aberto): um campo por vez, grande, com o botão ao lado
    "#cad.compacto .rolo{justify-content:flex-start;padding:10px 22px;gap:8px}",
    "#cad.compacto .logo,#cad.compacto .dica,#cad.compacto .abas,#cad.compacto label.rot{display:none}",
    "#cad.compacto .cartao{max-width:none;background:none;border:0;box-shadow:none;padding:0;gap:8px}",
    "#cad.compacto .tit{display:block}",
    "#cad.compacto .corpo{flex-direction:row;align-items:flex-start;gap:14px}",
    "#cad.compacto .grupo.fora{display:none}",
    "#cad.compacto input.cx{height:56px;font-size:20px}",
    "#cad.compacto .ok{width:170px;height:56px;font-size:17px}",
    "#cad.compacto .rodape{text-align:left}#cad.compacto .ajuda{display:none}"
  ].join("");

  function h(html) { var d = document.createElement("div"); d.innerHTML = html; return d.firstElementChild; }

  function montar() {
    if (raiz) return;
    var s = document.createElement("style");
    s.textContent = CSS;
    document.head.appendChild(s);
    raiz = h('<div id="cad"><div class="rolo">' +
      '<img class="logo" src="/logo_horizontal_v2.png" alt="Domínio">' +
      '<div class="cartao">' +
      '<div class="abas"><button type="button" data-m="entrar">Entrar</button><button type="button" data-m="criar">Criar conta</button></div>' +
      '<div class="tit"></div>' +
      '<form class="corpo" id="cad-form" action="#" method="post" autocomplete="on" novalidate><div class="campos">' +
      '<div class="grupo" data-c="apelido"><label class="rot" for="cad-apelido">Apelido no jogo</label>' +
      '<input class="cx" id="cad-apelido" name="apelido" placeholder="3 a 16 letras" autocomplete="nickname" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="next" maxlength="16"></div>' +
      '<div class="grupo" data-c="email"><label class="rot" for="cad-email">E-mail</label>' +
      '<input class="cx" id="cad-email" name="email" type="email" inputmode="email" placeholder="seu@email.com" autocomplete="username" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="next"></div>' +
      '<div class="grupo" data-c="senha"><label class="rot" for="cad-senha">Senha</label>' +
      '<input class="cx" id="cad-senha" name="password" type="password" placeholder="mínimo 6 letras ou números" enterkeyhint="next"></div>' +
      '<div class="grupo" data-c="confirmar"><label class="rot" for="cad-confirmar">Confirmar senha</label>' +
      '<input class="cx" id="cad-confirmar" name="confirm-password" type="password" placeholder="digite a senha de novo" autocomplete="new-password" enterkeyhint="done"></div>' +
      '<label class="grupo termos" data-c="termos"><input type="checkbox" id="cad-aceite"><span>Li e aceito os <a href="#" id="cad-ver">Termos de Uso e as Regras da Comunidade</a></span></label>' +
      '<label class="grupo termos" data-c="lembrar"><input type="checkbox" id="cad-lembrar" checked><span>Lembrar meus dados neste celular</span></label>' +
      '<div class="msg"></div>' +
      '</div><button type="submit" class="ok"></button></form>' +
      '<div class="rodape"></div>' +
      '<div class="ajuda">Problemas para entrar? <a id="cad-contato" href="mailto:contato@jogodominio.com.br">contato@jogodominio.com.br</a></div>' +
      '</div>' +
      '<div class="dica">📱 Depois de entrar, deite o celular para jogar</div>' +
      '</div>' +
      '<div class="modal"><div class="janela"><div class="texto"></div><div class="botoes">' +
      '<button type="button" class="vidro" id="cad-fechar">Fechar</button><button type="button" class="ok" id="cad-aceito">Li e aceito</button>' +
      '</div></div></div></div>');
    document.body.appendChild(raiz);
    ["apelido", "email", "senha", "confirmar"].forEach(function (c) { el[c] = raiz.querySelector("#cad-" + c); });
    el.aceite = raiz.querySelector("#cad-aceite");
    el.ok = raiz.querySelector(".corpo > .ok");
    el.lembrar = raiz.querySelector("#cad-lembrar");
    // e-mail lembrado da última vez (a senha fica com o gerenciador de senhas do celular, nunca aqui)
    try {
      var salvo = localStorage.getItem("dominio_email");
      if (salvo) el.email.value = salvo;
      if (localStorage.getItem("dominio_lembrar") === "0") el.lembrar.checked = false;
    } catch (e) { /* sem localStorage */ }
    el.msg = raiz.querySelector(".msg");
    el.tit = raiz.querySelector(".tit");
    el.rodape = raiz.querySelector(".rodape");
    el.modal = raiz.querySelector(".modal");
    raiz.querySelectorAll(".abas button").forEach(function (b) {
      b.onclick = function () { trocar(b.getAttribute("data-m")); };
    });
    raiz.querySelector("#cad-form").addEventListener("submit", function (e) { e.preventDefault(); acao(); });
    ["apelido", "email", "senha", "confirmar"].forEach(function (c) {
      el[c].addEventListener("keydown", function (e) {
        if (e.key === "Enter") { e.preventDefault(); proximoCampo(c); }
      });
    });
    raiz.querySelector("#cad-ver").onclick = function (e) {
      e.preventDefault();
      raiz.querySelector(".texto").textContent = termosTxt || "Carregando os termos...";
      el.modal.classList.add("on");
    };
    raiz.querySelector("#cad-fechar").onclick = function () { el.modal.classList.remove("on"); };
    raiz.querySelector("#cad-aceito").onclick = function () {
      el.aceite.checked = true; el.modal.classList.remove("on"); mensagem("");
    };
    var mq = window.matchMedia("(orientation: landscape) and (max-height: 500px)");
    var ajustar = function () { raiz.classList.toggle("compacto", mq.matches); atualizar(); };
    if (mq.addEventListener) mq.addEventListener("change", ajustar); else mq.addListener(ajustar);
    ajustar();
  }

  function compacto() { return raiz && raiz.classList.contains("compacto"); }

  function mensagem(t, tipo) {
    el.msg.textContent = t || "";
    el.msg.className = "msg" + (tipo ? " " + tipo : "");
  }

  function trocar(m) {
    modo = m === "entrar" ? "entrar" : "criar";
    passo = 0;
    mensagem("");
    atualizar();
  }

  function atualizar() {
    if (!raiz) return;
    raiz.querySelectorAll(".abas button").forEach(function (b) {
      b.classList.toggle("on", b.getAttribute("data-m") === modo);
    });
    el.senha.setAttribute("autocomplete", modo === "criar" ? "new-password" : "current-password");
    var lista = PASSOS[modo], ult = passo >= lista.length - 1;
    raiz.querySelectorAll(".grupo").forEach(function (g) {
      var c = g.getAttribute("data-c");
      var existe = modo === "criar" || (c !== "apelido" && c !== "confirmar" && c !== "termos");
      g.style.display = existe ? "" : "none";
      var atual = c === lista[passo] || (c === "termos" && modo === "criar" && ult) || (c === "lembrar" && ult);
      g.classList.toggle("fora", !atual);
    });
    el.senha.setAttribute("enterkeyhint", modo === "entrar" ? "done" : "next");
    var final = modo === "criar" ? "CRIAR CONTA" : "ENTRAR";
    el.ok.textContent = enviando ? "AGUARDE..." : (compacto() && !ult ? "PRÓXIMO" : final);
    el.tit.innerHTML = (modo === "criar" ? "Criar conta" : "Entrar") + " · passo " + (passo + 1) + " de " + lista.length +
      ": <b>" + NOMES[lista[passo]] + "</b>" + (passo > 0 ? ' &nbsp;<a href="#" class="volta">‹ voltar</a>' : "");
    var volta = el.tit.querySelector(".volta");
    if (volta) volta.onclick = function (e) { e.preventDefault(); passo--; mensagem(""); atualizar(); focar(lista[passo]); };
    el.rodape.innerHTML = modo === "criar"
      ? 'Já tem conta? <a href="#" data-m="entrar">Entrar</a>'
      : 'Ainda não tem conta? <a href="#" data-m="criar">Criar conta</a>';
    el.rodape.querySelector("a").onclick = function (e) { e.preventDefault(); trocar(this.getAttribute("data-m")); };
  }

  // confere só o básico de cada campo (o jogo confere tudo de novo ao criar a conta)
  function checar(c) {
    var v = el[c] ? el[c].value : "";
    if (c === "apelido" && v.trim().length < 3) return "O apelido precisa ter de 3 a 16 letras.";
    if (c === "email" && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.trim())) return "Digite um e-mail válido.";
    if (c === "senha" && v.length < 6) return "A senha precisa ter pelo menos 6 letras ou números.";
    if (c === "confirmar" && v !== el.senha.value) return "As senhas não são iguais. Digite a mesma senha nos dois campos.";
    return "";
  }

  function focar(c) { try { el[c].focus(); } catch (e) { /* nada */ } }

  function proximoCampo(c) {
    var lista = PASSOS[modo], i = lista.indexOf(c);
    if (compacto()) { acao(); return; }
    if (i >= 0 && i < lista.length - 1) focar(lista[i + 1]); else acao();
  }

  function acao() {
    if (enviando) return;
    var lista = PASSOS[modo];
    if (compacto() && passo < lista.length - 1) {
      var e1 = checar(lista[passo]);
      if (e1) { mensagem(e1); focar(lista[passo]); return; }
      mensagem("");
      passo++;
      atualizar();
      focar(lista[passo]);
      return;
    }
    for (var i = 0; i < lista.length; i++) {
      var e2 = checar(lista[i]);
      if (e2) { mensagem(e2); passo = i; atualizar(); focar(lista[i]); return; }
    }
    if (modo === "criar" && !el.aceite.checked) {
      mensagem("Para continuar, aceite os Termos de Uso e as Regras da Comunidade.");
      return;
    }
    ultimo = { email: el.email.value.trim(), senha: el.senha.value, apelido: el.apelido.value.trim() };
    var dados = JSON.stringify({ modo: modo, apelido: el.apelido.value.trim(), email: el.email.value.trim(),
      senha: el.senha.value, confirmar: el.confirmar.value, aceite: el.aceite.checked });
    enviando = true;
    el.ok.disabled = true;
    atualizar();
    try { document.activeElement && document.activeElement.blur(); } catch (e) { /* nada */ }
    if (cb) { mensagem("Conectando...", "aviso"); cb(dados); }
    else { pendente = dados; mensagem("Carregando o jogo, só um instante...", "aviso"); }
  }

  // deu certo: lembra o e-mail aqui e pede ao celular para salvar a senha no gerenciador de senhas dele
  function guardarDados(d) {
    var lembrar = !el.lembrar || el.lembrar.checked;
    try {
      localStorage.setItem("dominio_lembrar", lembrar ? "1" : "0");
      if (lembrar) localStorage.setItem("dominio_email", d.email); else localStorage.removeItem("dominio_email");
    } catch (e) { /* sem localStorage */ }
    if (lembrar && window.PasswordCredential && navigator.credentials && navigator.credentials.store) {
      try {
        navigator.credentials.store(new PasswordCredential({ id: d.email, password: d.senha, name: d.apelido || d.email }))
          .catch(function () { /* a pessoa recusou ou o navegador não deixou */ });
      } catch (e) { /* nada */ }
    }
  }

  window.DominioCadastro = {
    // chamado pelo jogo quando a tela de entrada abre
    abrir: function (m, termos, aviso, email_contato, callback) {
      montar();
      cb = callback;
      termosTxt = termos || "";
      contato = email_contato || "";
      var a = raiz.querySelector("#cad-contato");
      a.textContent = contato;
      a.href = "mailto:" + contato + "?subject=" + encodeURIComponent("Problema para entrar");
      // abre sempre em "Entrar" (pedido em 20/11/2026); "Criar conta" fica na aba ao lado e no link de baixo
      // se o formulário já estava aberto (Instagram: abre antes do jogo carregar), não mexe no que a pessoa escolheu
      var jaAberto = raiz.classList.contains("on");
      if (!pendente && !jaAberto) { trocar(m === "criar" ? "criar" : "entrar"); }
      if (!pendente && aviso) mensagem(aviso, "aviso");
      raiz.classList.add("on");
      if (pendente) { var d = pendente; pendente = null; mensagem("Conectando...", "aviso"); cb(d); }
    },
    // aberto antes do jogo carregar (ex.: botão "Criar minha conta aqui" no Instagram)
    mostrar: function () { montar(); raiz.classList.add("on"); atualizar(); },
    // resposta do jogo: "" = deu certo (o jogo segue e chama fechar), senão a mensagem para mostrar
    resultado: function (msg) {
      enviando = false;
      el.ok.disabled = false;
      atualizar();
      if (msg) mensagem(msg, /^Conta criada/.test(msg) ? "bom" : "");
    },
    fechar: function () {
      if (enviando && ultimo) guardarDados(ultimo);
      ultimo = null;
      enviando = false;
      if (raiz) { raiz.classList.remove("on"); el.ok.disabled = false; }
      if (window.DominioExterno) window.DominioExterno.depoisDaConta();
    },
    aberto: function () { return !!(raiz && raiz.classList.contains("on")); }
  };
})();
