/**
 * Sistema Solar desenvolvido por Jhordan para a disciplina de computação gráfica
 *
 * Ele foi trabalhado com WebGl, utilizando o framework BabylonJS, muito utilizado para desenvolvimento de jogos html.
 *
 *
 * Todas as texturas e materiais foram obtidos na comunidade o babylonjs na internet.
 *
 * BabylonJS: https://github.com/BabylonJS/Babylon.js
 *
 **/

// Obter o elemento html para redenrizar
var canvas = document.getElementById('renderCanvas');

// Obter a engine do Babylo para o canvas html5
var engine = new BABYLON.Engine(canvas, true);

// Lista de planetas e suas caracteristicas
var planetas = [
    {
        nome: "mercurio",
        tamanho: 4,
        textura: "images/mercurio_textura.jpg",
        x: 10,
        velocidade: 0.03,
        elemento: null
    }, {
        nome: "venus",
        tamanho: 4.5,
        textura: "images/venus_textura.jpg",
        x: 18,
        velocidade: 0.01,
        elemento: null
    }, {
        nome: "terra",
        tamanho: 5,
        textura: "images/terra_textura.jpg",
        x: 26,
        velocidade: 0.05,
        elemento: null
    }, {
        nome: "marte",
        tamanho: 4,
        textura: "images/marte_textura.jpg",
        x: 34,
        velocidade: 0.017,
        elemento: null
    }, {
        nome: "jupiter",
        tamanho: 7,
        textura: "images/jupiter_textura.jpg",
        x: 44,
        velocidade: 0.005,
        elemento: null
    }, {
        nome: "saturno",
        tamanho: 7,
        textura: "images/saturno_textura.jpg",
        x: 54,
        velocidade: 0.002,
        elemento: null
    }, {
        nome: "urano",
        tamanho: 7,
        textura: "images/urano_textura.jpg",
        x: 64,
        velocidade: 0.011,
        elemento: null
    }, {
        nome: "netuno",
        tamanho: 7,
        textura: "images/netuno_textura.jpg",
        x: 74,
        velocidade: 0.009,
        elemento: null
    }, {
        nome: "plutao",
        tamanho: 3,
        textura: "images/plutao_textura.jpg",
        x: 82,
        velocidade: 0.007,
        elemento: null
    }
];

// Criar ceu
var criarCeu = function (cenario) {

    // Criar um cubo para criar o cenario do Ceu (nome, tamanho, cenario)
    var ceu = BABYLON.Mesh.CreateBox('ceu', 1000, cenario);

    // Criar material e textura do ceu
    var materialCeu = new BABYLON.StandardMaterial('materialCeu', cenario);

    // Não redenrizar o que não esta mostrando
    materialCeu.backFaceCulling = false;

    // Mover ceu com a camera
    ceu.infiniteDistance = true;

    // Atribuir materialCeu a cubo do ceu
    ceu.material = materialCeu;

    // Retirar reflexo da caixa do ceu
    materialCeu.diffuseColor = new BABYLON.Color3(0, 0, 0);
    materialCeu.specularColor = new BABYLON.Color3(0, 0, 0);

    // Atribuir 6 textura para o cubo do ceu
    materialCeu.reflectionTexture = new BABYLON.CubeTexture('images/ceu_textura', cenario);
    materialCeu.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;

    return ceu;
};

//Criar o sol e todas as suas propriedades
var criarSol = function (cenario) {

    // criar esfera do sol (nome, raio, diametro, cenario)
    var sol = BABYLON.Mesh.CreateSphere('sol', 20, 10, cenario);

    // criar maetrial e textura do sol
    var materialSol = new BABYLON.StandardMaterial('materialSol', cenario);

    // Atribuir textura de uma imagem para o sol
    materialSol.emissiveTexture = new BABYLON.Texture('images/sol_textura.jpg', cenario);

    // Retirar reflexo do sol
    materialSol.diffuseColor = new BABYLON.Color3(0, 0, 0);
    materialSol.specularColor = new BABYLON.Color3(0, 0, 0);

    // Atribuir material e textura para o sol
    sol.material = materialSol;

    sol.position.x = 0;
    sol.position.y = 0;

    return sol;
};

//Criar planeta e todas as suas propriedades
var criarPlaneta = function (cenario, particularidades) {

    // criar esfera da mercurio (nome, raio, diametro, cenario)
    var planeta = BABYLON.Mesh.CreateSphere(particularidades.nome, 20, particularidades.tamanho, cenario);

    // criar material e textura do planeta
    var materialPlaneta = new BABYLON.StandardMaterial('material' + particularidades.nome, cenario);

    // Atribuir textura de uma imagem para o mercurio
    materialPlaneta.emissiveTexture = new BABYLON.Texture(particularidades.textura, cenario);

    // Retirar reflexo do mercurio
    materialPlaneta.diffuseColor = new BABYLON.Color3(0, 0, 0);
    materialPlaneta.specularColor = new BABYLON.Color3(0, 0, 0);

    // Atribuir material e textura para o mercurio
    planeta.material = materialPlaneta;

    planeta.position.y = 0;
    planeta.position.x = particularidades.x;

    planeta.orbita = {
        raio: planeta.position.x,
        velocidade: particularidades.velocidade,
        angulo: 0
    };

    return planeta;
};

//Criar cenario canvas
var criarCenario = function () {
    // Criar um cenario do babylon
    var cenario = new BABYLON.Scene(engine);

    // Configurar a camera do cenario para o x = -1.5, y = 1.5, z = -130
    var camera = new BABYLON.ArcRotateCamera('cameraPrincipal', -1.5, 1.5, -130, new BABYLON.Vector3(5, 0, 0), cenario);

    // Apontar a camera para o eixo de origem
    camera.setTarget(BABYLON.Vector3.Zero());

    // Atribuir movimento da camera para o canvas
    camera.attachControl(canvas);

    // Limpar cor do cenario para preto
    cenario.clearColor = new BABYLON.Color3(0, 0, 0);

    // criar o elemento ceu
    criarCeu(cenario);

    // Criar o elemento sol
    criarSol(cenario);

    // Criar planetas
    planetas.forEach(function (planeta) {
        planeta.elemento = criarPlaneta(cenario, planeta);
    });

    // Modo debug
    // cenario.debugLayer.show();

    // Evento do loop
    cenario.beforeRender = function() {
        planetas.forEach(function (planeta) {
            planeta.elemento.position.x = planeta.elemento.orbita.raio * Math.sin(planeta.elemento.orbita.angulo);
            planeta.elemento.position.z = planeta.elemento.orbita.raio * Math.cos(planeta.elemento.orbita.angulo);
            planeta.elemento.orbita.angulo += planeta.elemento.orbita.velocidade;
        });
    };

    // retornar cenario
    return cenario;
};

// inicializar aplicacao
var inicializar = function () {

    // obter cenario
    var cenario = criarCenario();

    //criar loop de renderização
    engine.runRenderLoop(function () {
        cenario.render();
    });

    // reajustar a tela ao alterar o tamanho do navegador
    window.addEventListener('resize', function () {
        engine.resize();
    });
};

// chamar o método de inicializar aplicacao
window.addEventListener('DOMContentLoaded', function () {
    inicializar();
});