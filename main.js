const listaDePost = document.querySelector(".post-list");
const url = "http://localhost:3000/posts";
let output = "";
const adicionaPost = document.querySelector(".add-post-form");
const valorTitulo = document.getElementById("title-value");
const valorTexto = document.getElementById("body-value");
const botaoSubmit = document.querySelector(".btn");

const render = (post) => {
  post.forEach((post) => {
    output += `
            <div class="card mt-4 mb-4 col-md-6 bg-ligt">
                    <div class="card-body" data-id=${post.id}>
                      <h5 class="card-title">${post.title}</h5>
                      <p class="card-text">${post.body}</p>
                      <a href="#" class="card-link" id="editar">Editar</a>
                      <a href="#" class="card-link" id="deletar">Excluir</a>
                    </div>
            </div>
            `;
  });
  listaDePost.innerHTML = output;
};

//GET
fetch(url)
  .then((response) => response.json()) //resposta em json
  .then((data) => render(data));

listaDePost.addEventListener("click", (evento) => {
  evento.preventDefault();
  let deletarBotao = evento.target.id == "deletar";
  let editarBotao = evento.target.id == "editar";
  let id = evento.target.parentElement.dataset.id;

//DELETE
  if (deletarBotao) {
    fetch(`${url}/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then(() => location.reload());
  }

  if (editarBotao) {
    const parent = evento.target.parentElement;
    let tituloConteudo = parent.querySelector(".card-title").textContent;
    let textoConteudo = parent.querySelector(".card-text").textContent;

    valorTitulo.value = tituloConteudo;
    valorTexto.value = textoConteudo;
  }

  //UPDATE
  botaoSubmit.addEventListener('click', (evento) => {
    evento.preventDefault();
    fetch(`${url}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        title: valorTitulo.value,
        body: valorTexto.value,
      }),
    })
      .then((response) => response.json())
      .then(() => location.reload());
  });

});

//POST
adicionaPost.addEventListener("submit", (evento) => {
  evento.preventDefault();
  fetch(url, {
    method: "POST",
    body: JSON.stringify({
      title: valorTitulo.value,
      body: valorTexto.value,
      // userId: 1,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const dataArray = [];
      dataArray.push(data);
      render(dataArray);
    });
  //resetar o input
  valorTitulo.value = "";
  valorTexto.value = "";
});
