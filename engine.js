

//-----------------------------FUNCIONES UTILES-----------------------------

//devuelve la posicion de un elemento HTML
function elementPosition(el){
    var rect = el.getBoundingClientRect();
    return {y: rect.top, x: rect.left}
}

//da el ángulo en radianes entre dos puntos
function pointAngle(x1, y1, x2, y2){
	return(Math.atan2(y2 - y1, x2 - x1));
}

//da la distancia entre dos puntos
function pointDistance(x1, y1, x2, y2){
	var a = x1 - x2
	var b = y1 - y2
	return Math.sqrt( a*a + b*b );
}

//grados a radianes
function degtorad(degrees){
  return degrees * Math.PI/180;
}

//radianes a grados
function radtodeg(radians){
  return radians * 180/Math.PI;
}

//mira si un punto esta dentro de un rectangulo
function pointInRectangle(x, y, i, j, w, h){
	return(x >= i && x < i+w && y >= j && y < j+h);
}

// ----------RATON LISTENERS-----------------------------------------------

class MouseControl{

	constructor(canvas){

		this.canvas = canvas;
		this.mouseX = 0;
		this.mouseY = 0;
		this.mouseUp = false;
		this.mouseDown = false;
		this.mouse = false;
	
		this.canvas.mouseControl = this;
		this.canvas.addEventListener('mousemove', function(e){
	        let mousePos = elementPosition(this);
			this.mouseControl.setMousePos(e.clientX-mousePos.x, e.clientY-mousePos.y);
	    });
		this.canvas.addEventListener('mousedown', function(e){
			this.mouseControl.setMouseDown(true);
			this.mouseControl.setMouse(true);
		});
		this.canvas.addEventListener('mouseup', function(e){
			this.mouseControl.setMouseUp(true);
			this.mouseControl.setMouse(false);
		});

	}

	setMousePos(x, y){
		this.mouseX = x;
		this.mouseY = y;
	}

	setMouseUp(bol){
		this.mouseUp = bol;
	}

	setMouseDown(bol){
		this.mouseDown = bol;
	}

	setMouse(bol){
		this.mouse = bol;
	}

	update(){
		this.mouseUp = false;
		this.mouseDown = false;
	}

	getMousePosX(){
		return this.mouseX;
	}

	getMousePosY(){
		return this.mouseY;
	}
	//levantar dedo raton
	isMouseUp(){
		return this.mouseUp;
	}
	//haces click
	isMouseDown(){
		return this.mouseDown;
	}
	//haces click, coge objeto continuamente
	isMouse(){
		return this.mouse;
	}

}

//--------------------------------------JUEGO----------------------------------------

class Game{

	constructor(canvas, spriteDir, spritesData){
		this.canvas = canvas;
		this.width = canvas.width;
		this.height = canvas.height;
		this.draw = this.canvas.getContext("2d");
		this.draw.imageSmoothingEnabled = false;
		this.mouse = new MouseControl(this.canvas);
		this.actualScene = null;

		//spriteSheet
		this.sprites = new Map();
		this.spritesData = spritesData;
		if(spriteDir){
			this.image = new Image();
			this.image.game = this;
			this.image.onload = function(){
				this.game.loadComplete();
			};
			this.image.src = spriteDir;
		}else{
			this.loop();
		}
	}

	loadComplete(){
		let bounds = this.spritesData.getAll();
		for(let i = 0; i < bounds.length; i++){
			let newSprite = document.createElement("canvas");
			newSprite.width = bounds[i].w;
			newSprite.height = bounds[i].h;
			newSprite.getContext("2d").drawImage(this.image, bounds[i].x, bounds[i].y, bounds[i].w, bounds[i].h, 0, 0, bounds[i].w, bounds[i].h);
			this.sprites.set(bounds[i].name, newSprite);
		}
		this.loop();
	}

	loop(){
		
		if(this.actualScene != null){
			this.actualScene.update();
		}

		this.mouse.update();

		let game = this;
		requestAnimationFrame(function(){
			game.loop();
		});
	}

	setScene(scene){
		scene.setUp(this.mouse, this.draw, this, this.sprites);
		this.actualScene = scene;
	}

}

//---------------------------SPRITES---------------------------------------------------

class SpritesData{

	constructor(){
		this.spritesBounds = [];
	}

	define(x, y, w, h, name){
		this.spritesBounds.push({x : x, y : y, w : w, h : h, name : name});
	}

	getAll(){
		return this.spritesBounds;
	}

}

let spriteData = new SpritesData();
spriteData.define(208, 265, 341-208, 320-265, "inicio");
for(let i = 0; i<13; i++){
	spriteData.define(16+(i*32)+(i*16), 0, 32, 48, "corazones"+(i+1));
	spriteData.define(16+(i*32)+(i*16), 64, 32, 48, "picas"+(i+1));
	spriteData.define(16+(i*32)+(i*16), 128, 32, 48, "rombos"+(i+1));
	spriteData.define(16+(i*32)+(i*16), 192, 32, 48, "treboles"+(i+1));
}

spriteData.define(16, 256, 32, 48, "flip1");
spriteData.define(64, 256, 32, 48, "flip2");
spriteData.define(112, 256, 16, 16, "vidaEntera");
spriteData.define(112, 272, 16, 16, "mediaVida");
spriteData.define(112, 288, 16, 16, "sinVida");

//---------------------------OBJETOS JUEGO-----------------------------------------------------

class GameObject{

	constructor(){
		this.delete = false;
	}

	setUp(mouse, draw, scene, game, sprites){
		this.mouse = mouse;
		this.draw = draw;
		this.game = game;
		this.scene = scene;
		this.sprites = sprites;
	}

	update(){

	}

	render(){

	}

	onDestroy(){

	}

	destroy(){
		this.delete = true;
	}

	isDeleted(){
		return this.delete;
	}

}

class Carta extends GameObject{
	
	constructor(tipo, num){
		super(0);
		/*this.cartaCogida=false;
		this.x = 5;
		this.y = 5;*/
		this.tipo =tipo;
		this.num = num;
		this.lado = false; //False si está boca abajo la carta
		this.width = 32*5;
	}
	
	getTipo(){
		return this.tipo;
	}

	getNum(){
		return this.num;
	}

	getColor(){
		if(this.tipo == "corazones" || this.tipo == "rombos"){
			return 1;
		}
		if(this.tipo == "picas" || this.tipo == "treboles"){
			return 2;
		}
	}

	update(){
		/*if(pointInRectangle(this.mouse.getMousePosX(), this.mouse.getMousePosY(), this.x, this.y, 30*4, 62*4) && this.mouse.isMouseDown()){
			this.cartaCogida=true;
		}
		if(this.cartaCogida){
			this.x = this.mouse.getMousePosX();
			this.y = this.mouse.getMousePosY();
		}
		if(this.mouse.isMouseUp()){
			this.cartaCogida=false;
		}*/

		/*if(this.mouse.isMouseDown() && pointInRectangle(this.mouse.getMousePosX(), this.mouse.getMousePosY(), 470-(this.width/2), 100, this.width, 48*5)){
			this.flip();
		}*/
		if(!this.lado){
			if (this.width > -32*5){
				this.width -= (2*5);
			}
		} else {
			if (this.width < 32*5){
				this.width += (2*5);
			}
		}
		
	}
	
	render(){

		if(this.width > 0){	
			this.draw.drawImage(this.sprites.get("flip2"), /*this.x, this.y*/  470-(this.width/2), 100, this.width, 48*5);
		} else {
			this.draw.drawImage(this.sprites.get(this.tipo + this.num), /*this.x, this.y*/  470-(this.width/2), 100, this.width, 48*5);
		}

	}

	flip(){
		if(this.lado == false){
			this.lado = true;
		} else {
			this.lado = false;
		}
		
	}
	
}

class SprtInicio extends GameObject{
	constructor(){
		super(0);
	}
	render(){
		this.draw.drawImage(this.sprites.get("inicio"), 150, 80, 132*5, 54*5);
	}
}

class Vidas extends GameObject{
	constructor(vidas){
		super(0);
		this.vidas = vidas;
	}

	render(){
		switch(this.vidas){
			case 0 :
				for(let i=0; i<5; i++){
					this.draw.drawImage(this.sprites.get("sinVida"), (950 - 5 *75) + i*75, 20, 16*5, 16*5);
				}
				break;
			case 1 : 
				for(let i=0; i< 4; i++){
					this.draw.drawImage(this.sprites.get("sinVida"), (950 - 4*75) + i*75, 20, 16*5, 16*5);
				}
				this.draw.drawImage(this.sprites.get("mediaVida"), 575, 20, 16*5, 16*5);
				break;
			case 2 :
				for(let i=0; i< 4; i++){
					this.draw.drawImage(this.sprites.get("sinVida"), (950 - 4*75) + i*75, 20, 16*5, 16*5);
				}
				this.draw.drawImage(this.sprites.get("vidaEntera"), 575, 20, 16*5, 16*5);
				break;
			case 3 : 
				for(let i=0; i< 3; i++){
					this.draw.drawImage(this.sprites.get("sinVida"), (950 - 3*75) + i*75, 20, 16*5, 16*5);
				}
				this.draw.drawImage(this.sprites.get("vidaEntera"), 575, 20, 16*5, 16*5);
				this.draw.drawImage(this.sprites.get("mediaVida"), 650, 20, 16*5, 16*5);
				break;
			case 4 :
				for(let i=0; i< 3; i++){
					this.draw.drawImage(this.sprites.get("sinVida"), (950 - 3*75) + i*75, 20, 16*5, 16*5);
				}
				this.draw.drawImage(this.sprites.get("vidaEntera"), 575, 20, 16*5, 16*5);
				this.draw.drawImage(this.sprites.get("vidaEntera"), 650, 20, 16*5, 16*5);
				break;
			case 5 : 
				for(let i=0; i< 2; i++){
					this.draw.drawImage(this.sprites.get("sinVida"), (950 - 2*75) + i*75, 20, 16*5, 16*5);
					this.draw.drawImage(this.sprites.get("vidaEntera"), 575 + i*75, 20, 16*5, 16*5);
				}
				this.draw.drawImage(this.sprites.get("mediaVida"), 725, 20, 16*5, 16*5);
				break;
			case 6 :
				for(let i=0; i< 3; i++){
					this.draw.drawImage(this.sprites.get("vidaEntera"), 575 + i*75, 20, 16*5, 16*5);
				}
				this.draw.drawImage(this.sprites.get("sinVida"), 800, 20, 16*5, 16*5);
				this.draw.drawImage(this.sprites.get("sinVida"), 875, 20, 16*5, 16*5);
				break;
			case 7 : 
				for(let i=0; i< 3; i++){
					this.draw.drawImage(this.sprites.get("vidaEntera"), 575 + i*75, 20, 16*5, 16*5);
				}
				this.draw.drawImage(this.sprites.get("mediaVida"), 800, 20, 16*5, 16*5);
				this.draw.drawImage(this.sprites.get("sinVida"), 875, 20, 16*5, 16*5);
				break;
			case 8 :
				for(let i=0; i<4; i++){
					this.draw.drawImage(this.sprites.get("vidaEntera"), 575 + i*75, 20, 16*5, 16*5);
				}
				this.draw.drawImage(this.sprites.get("sinVida"), 875, 20, 16*5, 16*5);
				break;
			case 9 : 
				for(let i=0; i < 4; i++){
					this.draw.drawImage(this.sprites.get("vidaEntera"), 575 + i*75, 20, 16*5, 16*5);
				}
				this.draw.drawImage(this.sprites.get("mediaVida"), 875, 20, 16*5, 16*5);
				break;
			case 10 :
				for(let i=0; i< 5; i++){
					this.draw.drawImage(this.sprites.get("vidaEntera"), 575 + i*75, 20, 16*5, 16*5);
				}
				break;
		}
	}
}


class Boton extends GameObject{
	constructor(x, y, width, height, texto){
		super(1);
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.texto = texto;
		this.click = false;
	}
	update(){
		if(this.mouse.isMouse() && pointInRectangle(this.mouse.getMousePosX(), this.mouse.getMousePosY(), this.x, this.y, this.width, this.height)){
			this.click = true;
		} else {
			this.click = false;
		}
		if(this.mouse.isMouseUp() && pointInRectangle(this.mouse.getMousePosX(), this.mouse.getMousePosY(), this.x, this.y, this.width, this.height)){
			this.onclick();
		}

	}

	render(){
		if(this.click){
			this.draw.fillStyle = "red";
		} else {
			this.draw.fillStyle = "#04193a";
		}
		
		this.draw.fillRect(this.x, this.y, this.width, this.height);
		this.draw.fillStyle = "#ffffc4";
		this.draw.font = "20px Comic Sans";
		this.draw.textAlign = "center";
		this.draw.fillText(this.texto, this.x+this.width/2, (this.y+this.height/2)+5);

	}

	onclick(){}

}

class BotonSelect extends Boton{
	constructor(x, y, width, height, texto, id){
		super(x, y, width, height, texto);
		this.id = id;
		this.arrayBotones = null;
	}
	update(){
		if(this.mouse.isMouse() && pointInRectangle(this.mouse.getMousePosX(), this.mouse.getMousePosY(), this.x, this.y, this.width, this.height)){
			this.arrayBotones.setAllFalse();
			this.click = true;
		}
	}
	setArrayBotones(arrayBotones){
		this.arrayBotones = arrayBotones;
	}
}

class ArrayBotones extends GameObject{
	constructor(){
		super(0);
		this.arrayBotones = [];
	}

	addBoton(boton){
		boton.setArrayBotones(this);
		this.arrayBotones.push(boton);
	}
	update(){

	}
	setAllFalse(){
		for(let i=0; i<this.arrayBotones.length; i++){
			this.arrayBotones[i].click = false;
		}
	}
	getId(){
		for(let i=0; i<this.arrayBotones.length; i++){
			if(this.arrayBotones[i].click){
				return this.arrayBotones[i].id;
			}
		}
		return -1;
	}
}

class Texto extends GameObject{
	constructor(x, y, width, height, texto){
		super(0);
		this.x =x;
		this.y = y;
		this.height = height;
		this.width = width;
		this.texto = texto;
	}
	render(){
		this.draw.fillStyle = "#ffffc4";
		this.draw.fillRect(this.x, this.y, this.width, this.height);
		this.draw.fillStyle = "#04193a";
		this.draw.font = "25px Comic Sans";
		this.draw.textAlign = "center";
		this.draw.fillText(this.texto, this.x+this.width/2, (this.y+this.height/2)+5);
	}
}

//----------------------ESCENAS-----------------------------------------------------------------

class GameScene{

	constructor(){
		this.canAddObject = false;
		this.addList = [];
	}

	setUp(mouse, draw, game, sprites){
		this.mouse = mouse;
		this.draw = draw;
		this.game = game;
		this.objetos = [];
		this.canAddObject = true;
		this.sprites = sprites;
		for(let i = 0; i < this.addList.length; i++){
			this.addObject(this.addList[i]);
		}
	}

	addObject(obj){
		if(this.canAddObject){
			obj.setUp(this.mouse, this.draw, this, this.game, this.sprites);
			this.objetos.push(obj);
		}else{
			this.addList.push(obj);
		}
	}

	update(){
		this.draw.clearRect(0, 0, this.game.width, this.game.height);
		let i=0;
		while(i<this.objetos.length){
			this.objetos[i].update();
			this.objetos[i].render();
			if(this.objetos[i].isDeleted()){
				this.objetos.splice(i, 1);
			} else {
				i++;
			}
		}
	}

}

class Pista extends Boton{
	constructor(x, y, width, height, texto){
		super(x, y, width, height, texto);

	}
	onclick(){
		this.scene.darPista();
		this.destroy();
	}
}


class Inicio extends GameScene{
	constructor(){
		super();
		this.addObject(new Texto((960/2)-125, 40, 259, 30, "ADIVINA LA CARTA Y GANA!"));
		this.addObject(new SprtInicio());
		this.addObject(new Texto((960/2)-125, 365, 259, 30, "Introduce el dinero que quieres apostar:"));
		this.texto = document.createElement("input");
		this.texto.setAttribute("type", "number");
		this.texto.style.position = "absolute";
		this.addObject(new CambiaEscenaJuego((960/2)-125, 470, 250, 30, "Empezar", this.texto));
		
	}

	setUp(mouse, draw, game, sprites){
		super.setUp(mouse, draw, game, sprites);
		this.texto.style.left = (elementPosition(this.game.canvas).x + (960/2)-150) + "px";
		this.texto.style.top = (elementPosition(this.game.canvas).y + 410) + "px";
		this.texto.style.width = 300 + "px";
		this.texto.style.height = 30 + "px";
		document.body.appendChild(this.texto);
	}
}

function generateBaraja(){
	let baraja = [];
	for(let i=0; i<13; i++){
		baraja.push(new Carta("corazones", i+1));
		baraja.push(new Carta("rombos", i+1));
		baraja.push(new Carta("picas", i+1));
		baraja.push(new Carta("treboles", i+1));
	}
	return baraja;
}

class JuegoActivo extends GameScene{
	constructor(carta, vidas, baraja, intentos, dinero, aciertoSimbolo, aciertoColor, usaPista){
		super();
		//this.sacaCarta();
		this.carta = carta;
		this.vidas = vidas;
		this.baraja = baraja;
		this.intentos = intentos;
		this.dinero = dinero;
		this.aciertoColor = aciertoColor;
		this.aciertoSimbolo = aciertoSimbolo;
		this.usaPista = usaPista;
		this.addObject(this.carta);

		if(this.usaPista == 1){
			this.pista = new Pista(830, 540, 100, 30, "Pista");
			this.addObject(this.pista);
		}
			
		console.log(">>Dinero introducido: "+this.dinero);
		//
		this.mayor = 0;
		this.menor = 0;
		this.igual = 0;
		this.rojo = 0;
		this.negro = 0;

		for(let i=0; i<this.baraja.length; i++){
			if(carta.getNum() < this.baraja[i].getNum()){
				this.mayor++;
			} else if (carta.getNum() > this.baraja[i].getNum()){
				this.menor++
			} else {
				this.igual++;
			}
			if(this.baraja[i].getColor() == 1){
				this.rojo++;
			} else{
				this.negro++;
			}
		}
		
			
		//

		this.addObject(new Vidas(this.vidas));

		this.addObject(new Texto(50, 20, 100, 30, "Ronda:  " + this.intentos));

		this.addObject(new Texto(275, 330, 100, 30, "Simbolo:"));
		this.arrayBotones = new ArrayBotones();
		let boton = new BotonSelect(200, 360, 250, 30, "Mayor", 1);
		this.arrayBotones.addBoton(boton);
		this.addObject(boton);
		boton = new BotonSelect(200, 410, 250, 30, "Menor", 2);
		this.addObject(boton);
		this.arrayBotones.addBoton(boton);
		boton = new BotonSelect(200, 460, 250, 30, "Igual", 3);
		this.addObject(boton);
		this.arrayBotones.addBoton(boton);

		this.addObject(new Texto(575, 330, 100, 30, "Color:"));
		this.arrayBotones2 = new ArrayBotones();
		boton = new BotonSelect(500, 380, 250, 30, "Rojo", 1);
		this.addObject(boton);
		this.arrayBotones2.addBoton(boton);
		boton = new BotonSelect(500, 430, 250, 30, "Negro", 2);
		this.addObject(boton);
		this.arrayBotones2.addBoton(boton);

		this.continua = new CambiaEscenaContinua(350, 500, 250, 30, "Siguiente", carta, this.vidas, this.arrayBotones, this.arrayBotones2, this.baraja, this.intentos, this.dinero, this.aciertoSimbolo, this.aciertoColor, this.usaPista);
		this.addObject(this.continua);
		
		this.addObject(new CambiaEscenaInicio(30,540, 100, 30, "Volver"));
		
	}

	darPista(){
		this.continua.usaPista = 0;
		console.log(">>Probabilidad de que sea mayor:" + (this.mayor/(this.baraja.length+1))*100 + 
			"\n Probabilidad de que sea menor:" + (this.menor/(this.baraja.length+1))*100 + 
			"\n Probabilidad de que sea igual:" + (this.igual/(this.baraja.length+1))*100 +
			"\n Probabilidad de que sea rojo:" + (this.rojo/(this.baraja.length+1))*100 +
			"\n Probabilidad de que sea negro:" + (this.negro/(this.baraja.length+1))*100);
	}
}

class Final extends GameScene{
	constructor(carta, vidas, dinero, aciertoSimbolo, aciertoColor){
		super();
		this.carta = carta;
		this.vidas = vidas;
		this.dinero = dinero;
		this.aciertoSimbolo = aciertoSimbolo;
		this.aciertoColor = aciertoColor;
		this.addObject(new Vidas(this.vidas));
		this.addObject(this.carta);
		this.addObject(new Texto((960/2)-125, 350, 250, 30, "RESULTADOS"));

		let porcAciertosColor = (this.aciertoColor/5)*100;
		let porcAciertosSimbol = (this.aciertoSimbolo/5)*100;

		if(this.vidas ==10){
			this.addObject(new Texto( 100, 380, 250, 30, "Enhorabuena! Has ganado: " + this.dinero*3 + " euros."));
		} else if (this.vidas >= 8){
			this.addObject(new Texto( 100, 380, 250, 30, "Enhorabuena! Has ganado: " + this.dinero*2 + " euros."));
		}  else if (this.vidas >= 6){
			this.addObject(new Texto( 100, 380, 250, 30, "Recuperas tu dinero: " + this.dinero + " euros."));
		} else {
			this.addObject(new Texto( 100, 380, 250, 30, "Lo sentimos! Has perdido: " + this.dinero + " euros."));
		}

		this.addObject(new Texto( 180, 410, 250, 30, "Porcentaje de aciertos color: " + porcAciertosColor + " . Has fallado: " + (5-this.aciertoColor) + " veces."));
		this.addObject(new Texto( 195, 440, 250, 30, "Porcentaje de aciertos simbolo: " + porcAciertosSimbol+ " . Has fallado: " + (5-this.aciertoSimbolo) + " veces.")); 
		this.addObject(new CambiaEscenaInicio(30,540, 100, 30, "Volver"));
	}
}


//--------------------------------CAMBIA ESCENA------------------------------------------------------------------

class CambiaEscenaInicio extends Boton {
	constructor(x, y, width, height, texto){
		super(x, y, width, height, texto);
	}
	onclick(){
		this.game.setScene(new Inicio());

	}
}
class CambiaEscenaJuego extends Boton {
	constructor(x, y, width, height, texto, input){
		super(x, y, width, height, texto);
		this.input = input;
		//inicializacion de los parametros
		this.vidas = 10;
		this.intentos = 5;
		this.aciertoSimbolo = 0; 
		this.aciertoColor =0;
		this.usaPista = 1;
	}
	onclick(){
		let dinero = this.input.value;
		if(dinero && dinero <= 500000 && dinero>0){
			document.body.removeChild(this.input);
			this.baraja = generateBaraja();
			let carta = this.baraja.splice(Math.floor(Math.random()*this.baraja.length),1)[0];
			this.game.setScene(new JuegoActivo(carta, this.vidas, this.baraja, this.intentos, dinero, this.aciertoSimbolo, this.aciertoColor, this.usaPista));
		} else {
			alert("Para participar hay que pagar! \n Solo puede apostar un maximo de 500.000 euros.");
		}
	}
}
class CambiaEscenaContinua extends Boton {
	constructor(x, y, width, height, texto, cartaAnt, vidas, arrayBotones, arrayBotones2, baraja, intentos, dinero, aciertoSimbolo, aciertoColor, usaPista){
		super(x, y, width, height, texto);
		this.cartaAnt = cartaAnt;
		this.baraja = baraja;
		this.vidas = vidas;
		this.arrayBotones = arrayBotones;
		this.arrayBotones2 = arrayBotones2;
		this.intentos = intentos;
		this.dinero = dinero;
		this.carta = this.baraja.splice(Math.floor(Math.random()*this.baraja.length),1)[0];
		this.num = this.cartaAnt.getNum();
		this.tipo2 = this.carta.getColor();
		this.num2 = this.carta.getNum();
		this.aciertoColor = aciertoColor;
		this.aciertoSimbolo = aciertoSimbolo;
		this.usaPista = usaPista;
		//console.log(this.carta); //Esta línea sirve para que aparezca la carta que va a salir
	}
	onclick(){
		this.simboloSelec = this.arrayBotones.getId();
		this.colorSelec = this.arrayBotones2.getId();
		//console.log(this.vidas);
		//console.log(this.intentos);
		if(this.colorSelec == this.tipo2){
			this.aciertoColor++;
		}
		if((this.simboloSelec == 1 && this.num2 > this.num) || (this.simboloSelec == 2 && this.num2 < this.num) || (this.simboloSelec == 3 && this.num == this.num2)){
			this.aciertoSimbolo++;
		}
		let simboloEscogido = "";
		let colorEscogido = "";
		switch(this.simboloSelec){
			case 1: simboloEscogido = "Mayor"; break;
			case 2: simboloEscogido = "Menor"; break;
			case 3: simboloEscogido = "Igual"; break;
		}
		switch(this.colorSelec){
			case 1: colorEscogido = "Rojo"; break;
			case 2: colorEscogido = "Negro"; break;
		}
		console.log(">>Carta que ha salido anteriormente: " +  
			"\n Tipo: " + this.cartaAnt.getTipo() +
			"\n Numero: " + this.cartaAnt.getNum() +
			"\n Simbolo que has seleccionado: " + simboloEscogido +
			"\n Color que has seleccionado: " + colorEscogido);
		if(this.intentos > 1){
			if(this.arrayBotones.getId()!=-1 && this.arrayBotones2.getId() != -1){
				this.intentos--;
				if(this.colorSelec != this.tipo2){
					this.vidas--;
				}
				if((this.simboloSelec == 1 && this.num2 <= this.num) || (this.simboloSelec == 2 && this.num2 >= this.num) || (this.simboloSelec == 3 && this.num != this.num2)){
					this.vidas--;
				}
				this.game.setScene(new JuegoActivo(this.carta, this.vidas, this.baraja, this.intentos, this.dinero, this.aciertoSimbolo, this.aciertoColor, this.usaPista));
			}
		} else {
			if(this.colorSelec != this.tipo2){
				this.vidas--;
			}
			if((this.simboloSelec == 1 && this.num2 <= this.num) || (this.simboloSelec == 2 && this.num2 >= this.num) || (this.simboloSelec == 3 && this.num != this.num2)){
				this.vidas--;
			}
			this.game.setScene(new Final(this.carta, this.vidas, this.dinero, this.aciertoSimbolo, this.aciertoColor));
		}
		
		

	}
}



//-----------------------------------COMIENZO JUEGO---------------------------------
let canvas = document.getElementById("canvas");
let game = new Game(canvas, "sprites.png", spriteData);

game.setScene(new Inicio());





















