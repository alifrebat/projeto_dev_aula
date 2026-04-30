const productTableBody = document.getElementById("productTableBody");
const form = document.querySelector("form");
const productPlaceholder = document.querySelector(".produtoPalceholder");
const apiUrl = "http://10.231.32.35:8081/produtos";
let produtos = [];

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(form);

  const produto = new Produto({
    produto: formData.get("produto"),
    valorUnitario: Number(formData.get("valor")),
    unidade: formData.get("unidade"),
    tipoProduto: formData.get("tipo"),
  });

  const info = {
    nome: produto.produto,
    caracteristicas: formData.get("carac"),
    valorUnd: produto.valorUnitario,
    und: produto.unidade,
    tipo: produto.tipoProduto,
    qtd: produto.qtd,
  };

  const response = await fetch(apiUrl, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(info),
  });

  const data = await response.json();
  produto.id = data.id

  produto.calcularValorTotal();
  produto.calcularValorImposto();
  produto.calcularValorFinal();

  saveProduto(produto);

  form.reset();
});

function saveProduto(produto) {
  if (productTableBody.contains(productPlaceholder)) {
    productTableBody.removeChild(productPlaceholder);
  }
  produtos.push(produto);

  const tr = document.createElement("tr");
  const Produto = document.createElement("td");
  const ValorUnitario = document.createElement("td");
  const Unidade = document.createElement("td");
  const quantidadeTd = document.createElement("td");
  const quantidade = document.createElement("input");
  const ValorTotal = document.createElement("td");
  const ValorImposto = document.createElement("td");
  const ValorFinal = document.createElement("td");
  const Remover = document.createElement("td");

  Produto.innerHTML = produto.produto;
  ValorUnitario.innerHTML = numberToReal(produto.valorUnitario);
  Unidade.innerHTML = produto.unidade;
  quantidade.value = produto.qtd;

  Remover.innerHTML = "x";
  Remover.classList.add("td-remover");

  Remover.addEventListener("click", async () => {

    const response = await fetch(apiUrl+`/${produto.id}`, {
        method: "DELETE"
    })

    productTableBody.removeChild(tr);

    const index = produtos.indexOf(produto);
    if (index > -1) {
      produtos.splice(index, 1);
    }

    if (produtos.length === 0) {
      productTableBody.appendChild(productPlaceholder);
    }
  });

  quantidade.type = "number";
  quantidadeTd.appendChild(quantidade);

  produto.calcularValorTotal();
  formatarValor();

  quantidade.addEventListener("input", async () => {
      
      produto.qtd = Number(quantidade.value) || 0;
      
      produto.calcularValorTotal();
      produto.calcularValorImposto();
      produto.calcularValorFinal();
      
      const response = await fetch(apiUrl+`/${produto.id}`, {
        method: "PATCH",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({qtd: produto.qtd})
      })

      if(!response.ok){
        console.error(response)
      }

    formatarValor();
  });

  function formatarValor() {
    ValorTotal.innerHTML = numberToReal(produto.valorTotal);
    ValorImposto.innerHTML = numberToReal(produto.valorImposto);
    ValorFinal.innerHTML = numberToReal(produto.valorFinal);
  }

  tr.appendChild(Produto);
  tr.appendChild(ValorUnitario);
  tr.appendChild(Unidade);
  tr.appendChild(quantidadeTd);
  tr.appendChild(ValorTotal);
  tr.appendChild(ValorImposto);
  tr.appendChild(ValorFinal);
  tr.appendChild(Remover);

  productTableBody.appendChild(tr);
}

class Produto {
  id;
  produto;
  valorUnitario;
  unidade;
  tipoProduto;
  qtd;
  valorTotal;
  valorImposto;
  valorFinal;

  constructor({ produto, valorUnitario, unidade, tipoProduto }) {
    this.produto = produto;
    this.valorUnitario = valorUnitario;
    this.unidade = unidade;
    this.tipoProduto = tipoProduto;
    this.qtd = 1;
  }

  calcularValorTotal() {
    this.valorTotal = this.valorUnitario * this.qtd;
  }

  calcularValorImposto() {
    switch (this.tipoProduto) {
      case "1":
        this.valorImposto = 0;
        break;
      case "2":
        this.valorImposto = this.valorTotal * 0.08;
        break;
      case "3":
        this.valorImposto = this.valorTotal * 0.1;
        break;
      case "4":
        this.valorImposto = this.valorTotal * 0.12;
        break;
      case "5":
        this.valorImposto = this.valorTotal * 0.17;
        break;
    }
  }

  calcularValorFinal() {
    this.valorFinal = this.valorTotal + this.valorImposto;
  }
}

function numberToReal(numero) {
  return numero.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

async function loadProdutos() {
  const response = await fetch(apiUrl);
  const data = await response.json();

  data.forEach((e) => {

    const produto = new Produto({
        produto: e.nome,
        valorUnitario: e.valorUnd,
        unidade: e.und,
        tipoProduto: e.tipo
    });
    produto.qtd = e.qtd;
    produto.id = e.id;
    
    produto.calcularValorTotal();
    produto.calcularValorImposto();
    produto.calcularValorFinal();

    saveProduto(produto);
  });
}

loadProdutos();
