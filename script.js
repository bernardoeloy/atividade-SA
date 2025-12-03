function onCadastro(event) {
  event.preventDefault();

  const nome = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const senha = document.getElementById("password").value;
  const senha2 = document.getElementById("password2").value;

  if (senha !== senha2) {
    alert("As senhas não coincidem!");
    return;
  }

  const usuario = { nome, email, senha };

  localStorage.setItem("usuarioCadastrado", JSON.stringify(usuario));

  localStorage.setItem("usuarioLogado", JSON.stringify({
    nome: usuario.nome,
    email: usuario.email,
    tipo: "usuario"
  }));

  alert("Conta criada com sucesso!");
  window.location.href = "index.html";
}
function onLogin(event) {
  event.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const senha = document.getElementById("loginPassword").value;

  if (email === "admin@admin.com" && senha === "admin123") {
    localStorage.setItem("usuarioLogado", JSON.stringify({
      nome: "Administrador",
      email: email,
      tipo: "admin"
    }));
    window.location.href = "pokemons.html";
    return;
  }

  const usuarioSalvo = JSON.parse(localStorage.getItem("usuarioCadastrado"));

  if (usuarioSalvo && email === usuarioSalvo.email && senha === usuarioSalvo.senha) {
    localStorage.setItem("usuarioLogado", JSON.stringify({
      nome: usuarioSalvo.nome,
      email: usuarioSalvo.email,
      tipo: "usuario"
    }));
    window.location.href = "index.html";
  } else {
    alert("Email ou senha incorretos!");
  }
}
  document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("usuarioLogado"));
  const nav = document.querySelector(".topbar nav");

  if (user) {
    nav.innerHTML = `
      <span>Olá, ${user.nome}</span>
      ${user.tipo === "admin" ? '<a href="pokemons.html">Pokémons</a>' : ""}
      <a href="#" id="logoutBtn" class="btn-outline">Sair</a>
    `;

    document.getElementById("logoutBtn").addEventListener("click", () => {
      localStorage.removeItem("usuarioLogado");
      window.location.reload();
    });
  }
});
async function buscarPokemon(event) {
  event.preventDefault();

  const nome = document.getElementById("q").value.trim().toLowerCase();
  const resultado = document.getElementById("resultadoPokemon");

  if (!nome) {
    resultado.innerHTML = "<p>Digite o nome de um Pokémon.</p>";
    return;
  }

  try {
    const resposta = await fetch(`https://pokeapi.co/api/v2/pokemon/${nome}`);
    if (!resposta.ok) throw new Error("Pokémon não encontrado");

    const dados = await resposta.json();

    resultado.innerHTML = `
      <div class="pokemon-card" style="margin-top:20px">
        <img src="${dados.sprites.front_default}" alt="${dados.name}">
        <h3>${dados.name.toUpperCase()}</h3>
        <p>Altura: ${dados.height}</p>
        <p>Peso: ${dados.weight}</p>
        <p>Tipo: ${dados.types.map(t => t.type.name).join(", ")}</p>
      </div>
    `;
  } catch (error) {
    resultado.innerHTML = "<p>Pokémon não encontrado </p>";
  }
}