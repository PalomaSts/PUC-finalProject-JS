var registro = new Object();

function Registro(titulo,conteudo,tags, tagsout, id){
    this.Titulo=titulo;
    this.Conteudo=conteudo;
    this.Tags=tags;   
    this.Tagsout=tagsout;   
    this.Id=id;
}

function limparCampos() {
    window.document.querySelector("#form-titulo").value = null;
    window.document.querySelector("#form-conteudo").value = null;
    window.document.querySelector("#form-tags").value = null;
}

function replaceSpecialChars(str)
{
    str = str.replace(/[ÀÁÂÃÄÅ]/,"A");
    str = str.replace(/[àáâãäå]/,"a");
    str = str.replace(/[ÈÉÊË]/,"E");
    str = str.replace(/[Ç]/,"C");
    str = str.replace(/[ç]/,"c");

    return str.replace(/[^a-z0-9]/gi,''); 
}

function salvar() {
    let titulo = document.getElementById("form-titulo").value;
    let conteudo = document.getElementById("form-conteudo").value;
    let tagsOut = document.getElementById("form-tags").value;

    let tagsIn = replaceSpecialChars(tagsOut);

    registro.titulo=titulo;
    registro.conteudo=conteudo;
    registro.tags=tagsIn;
    registro.tagsout=tagsOut;

    arr = JSON.parse(localStorage.getItem('noticias')) || [];
    registro.id = arr.length+1;
    arr.push(new Registro(registro.titulo,registro.conteudo,registro.tags,registro.tagsout,registro.id));

    let string = JSON.stringify(arr);
    localStorage.setItem("noticias", string);

    limparCampos();
    alert('A notícia foi salva!');
}

function passaValor(valor)
{
    window.location = "detalhes.html?id="+valor;
}

function passaValorTag(valor)
{
    window.location = "home.html?tag="+valor;
}

function queryString(parameter) {  
    if(!location.search){
        carregar();
        return;
    }
    var loc = location.search.substring(1, location.search.length);  
    var param_value = false;   
    var params = loc.split("&");   
    for (i=0; i<params.length;i++) {   
        param_name = params[i].substring(0,params[i].indexOf('='));   
        if (param_name == parameter) {                                          
            param_value = params[i].substring(params[i].indexOf('=')+1);
        }   
    }   
    var pathArray = location.pathname.split('/');
    if (param_value) {  
        if(isNaN(param_value)){
            filtro(param_value);
        }else{
            detalhes(param_value); 
        }
    }   
    else {   
        if(pathArray[2]=='home.html'){
            carregar();
        }else{
            return undefined; 
        }
    }   
}

function carregar(){
    let noticias = JSON.parse(localStorage.getItem("noticias"));

    if (noticias != null){


        let tamanho = noticias.length;
        for(let j = 0; j < tamanho; j++){
            reload(noticias[j].Titulo,noticias[j].Conteudo,noticias[j].Id);
            loadListaCategorias(noticias[j].Tagsout, noticias[j].Tags);
        }
    }else{
        let containerAviso = document.createElement("div");
        containerAviso.setAttribute("class", "container-avisoNoNoticias");
        let aviso = document.createElement("h2");
        aviso.setAttribute("id", "avisoNoNoticias");
        aviso = document.createTextNode('Desculpe, não há notícias no momento');
        containerAviso.appendChild(aviso);
        document.getElementById("noticias").appendChild(containerAviso);
    }

    
}

function reload(titulo, conteudo, id){
    let title = titulo.substr(0,50);
    let text = conteudo.substr(0,150);

    let card = document.createElement("div");
    card.setAttribute("class","card noticia");
    card.setAttribute("id","noticia");

    let imagem = document.createElement("img");
    imagem.setAttribute("class","card-img-top");
    imagem.setAttribute("id","card-img");
    imagem.src = "img/exemplo.jpg";

    let cardBody = document.createElement("div");
    cardBody.setAttribute("class","card-body");
    cardBody.setAttribute("id","card-body");

    let cardTitulo = document.createElement("h5");
    cardTitulo.setAttribute("class","card-title");
    cardTitulo.setAttribute("id","card-title");
    let notTitulo = document.createTextNode(`${title}`);
    cardTitulo.appendChild(notTitulo);

    let cardConteudo = document.createElement("p");
    cardConteudo.setAttribute("class","card-text");
    cardConteudo.setAttribute("id","card-text");
    let notConteudo = document.createTextNode(`${text}...`);
    cardConteudo.appendChild(notConteudo);

    let botaoCard = document.createElement("button");
    botaoCard.setAttribute("class","btn btn-primary");
    botaoCard.setAttribute("id","botaoVerMais");
    botaoCard.addEventListener("click", function(){passaValor(id)});

    let botaoTexto = document.createTextNode('Ver mais');
    botaoCard.appendChild(botaoTexto);

    cardBody.appendChild(cardTitulo);
    cardBody.appendChild(cardConteudo);
    cardBody.append(botaoCard);
    card.appendChild(imagem);
    card.appendChild(cardBody);
    document.getElementById("noticias").appendChild(card);

}

function filtro(tagN) {
    let noticias = JSON.parse(localStorage.getItem("noticias"));
    let tamanho = noticias.length;
    
    for(let j = 0; j < tamanho; j++){
        loadListaCategorias(noticias[j].Tagsout, noticias[j].Tags);
        if (noticias[j].Tags == tagN) {
            reload(noticias[j].Titulo,noticias[j].Conteudo,noticias[j].Id);
        }
    }
}

function loadListaCategorias(tagout, tagin){
    let ancoraLista = document.createElement("a");
    ancoraLista.setAttribute("href",`javascript:passaValorTag('${tagin}')`);

    let lista = document.createElement("li");
    let itemLista = document.createTextNode(`${tagout}`);

    ancoraLista.appendChild(lista);
    lista.appendChild(itemLista);

    document.getElementById("listaCategorias").appendChild(ancoraLista);
}

function apagar() {
    var resultado = confirm("Tem certeza que deseja excluir todas as notícias?");
        if (resultado == true) {
            localStorage.clear("noticias");
            alert("Todas as notícias foram excluidas!");    
        }
        else{
            alert("Você desistiu de excluir todas as notícias!");
        }
}



function detalhes(ident){ 
    let noticias = JSON.parse(localStorage.getItem("noticias"));
    let tituloV;
    let conteudoV;
    let tamanho = noticias.length;

    for(let j = 0; j < tamanho; j++){
        loadListaCategorias(noticias[j].Tagsout, noticias[j].Tags);
        if (noticias[j].Id == ident) {
            tituloV = noticias[j].Titulo;
            conteudoV = noticias[j].Conteudo;
        }
    }

    let tituloNoticia = document.createTextNode(`${tituloV}`);
    let textoNoticia = document.createTextNode(`${conteudoV}`);
    let tituloGNoticia = document.createTextNode(`${tituloV}`);

    document.getElementById("detalhes-titulo-principal").appendChild(tituloGNoticia);
    document.getElementById("card-title-detalhes").appendChild(tituloNoticia);
    document.getElementById("card-text-detalhes").appendChild(textoNoticia);
}