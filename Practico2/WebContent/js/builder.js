function GuardarEnElLocalStorage(data){
	const jsonData = jQuery.parseJSON(data);
	sessionStorage.setItem('jSessionId', jsonData["url"].split(";")[1]);
	sessionStorage.setItem('carrito', JSON.stringify(jsonData["carrito"]));
}

function Sincronizar() {
	$.ajax({
    	url: ("jSessionId"  in sessionStorage) ? "./CarritoServlet" + ";" + sessionStorage.getItem('jSessionId') : "./CarritoServlet",
        type: "get",
        datatype:"text",
    	error:function(hr){
    		console.log(hr.responseText)
   	},
    	success:function(data){
    		GuardarEnElLocalStorage(data);
    	}
    });
}

function Eliminar(productId) {
	$.ajax({
    	url: "./CarritoServlet" + ";" + sessionStorage.getItem('jSessionId'),
        type: "post",
        datatype:"text",
    	data:$.param({DelProductId: productId}),
    	error:function(hr){
    		console.log(hr.responseText);
    	},
    	success:function(data){
    		GuardarEnElLocalStorage(data);		
    	}
    }); 
}

function Agregar(pid, pquant, pprice){
    $.ajax({
       	url: "./CarritoServlet" + ";" + sessionStorage.getItem('jSessionId'),
        type: "post",
        datatype:"text",
    	data:$.param({productId: pid, productQuantity: pquant, productPrice: pprice}),
    	error:function(hr){
    		console.log(hr.responseText);
    	},
    	success:function(data){
    		GuardarEnElLocalStorage(data);

    	}
    });  	 
}

const products = {
	    "data": [
	        {
	            "name": "Nike Air Max",
	            "descripcion": "La nueva Zapatilla Gonew Tracker II te permite tener un agarre único que garantiza tu seguridad, transpirabilidad e impermeabilidad en todo momento y una pisada cómoda para pisar con firmeza.",
	            "id": 1,
	            "precio": 2000,
	            "categoria": "Zapatillas",
	            "subcategoria": "deportivas",
	            "imagen": "https://s7d2.scene7.com/is/image/dkscdn/17NIKMRNSWFTGRYBLRNN_Grey_White_is"
	        },
	        {
	            "name": "Nike Epic React",
	            "descripcion": "Los chicos modernos buscan un look urbano, skater y cómodo para recorrer la ciudad con el estilo que la tabla les da. Te presentamos las Zapatillas Nike Delta Force Vulc, que te destacarán siempre.",
	            "id": 2,
	            "precio": 2200,
	            "categoria": "Zapatillas",
	            "subcategoria": "Clasicas",
	            "imagen": "https://images-na.ssl-images-amazon.com/images/I/61cbAQatNlL._UL1500_.jpg"
	        },
	        {
	            "name": "Salomon Mission",
	            "descripcion": "Para complementar tu vestimenta casual, te presentamos las Zapatillas Nike Court Borough Low. Un calzado que brinda la comodidad ideal para todos los días.",
	            "id": 3,
	            "precio": 2400,
	            "categoria": "Zapatillas",
	            "subcategoria": "trekking",
	            "imagen": "https://cdn.mec.ca/medias/sys_master/high-res/high-res/8882295078942/5048056-SRF20.jpg"
	        },
	        {
	            "name": "Reloj Casio F-200W",
	            "descripcion": "Te presentamos el nuevo Reloj Casio F-200W. Con él podrás tener en tu muñeca un reloj que posee las funciones que buscas. Cuenta con iluminación led y un diseño moderno y elegante.",
	            "id": 4,
	            "precio": 5000,
	            "categoria": "Relojes",
	            "subcategoria": "Casual",
	            "imagen": "https://static.netshoes.com.ar/produtos/reloj-casio-aw-49h/55/112-0069-055/112-0069-055_zoom1.jpg?resize=1200:*"
	        },
	        {
	            "name": "Reloj Casio LQ-139AMV",
	            "descripcion": "Para las mujeres que se manejan en un ambiente agitado, llega el Reloj Casio LQ-139AMV que por su peso es ideal para mujeres y su resistencia lo hace apto para estar expuesto a diferentes escenarios.",
	            "id": 5,
	            "precio": 3000,
	            "categoria": "Relojes",
	            "subcategoria": "Casual",
	            "imagen": "https://static.netshoes.com.ar/produtos/reloj-casio-lq-139amv/18/112-0084-118/112-0084-118_zoom1.jpg?resize=1200:*"
	        }
	    ]
	}

function build_banner() {
	var products = JSON.parse(localStorage.getItem('products'));
	var banner_html = '';
	items = products['data']
	categories = [];
	for (var i = 0; i < items.length; i++) {
		var cat = items[i]['categoria'];
		if (!categories.includes(cat)) {
			categories.push(cat)
		}
	}
	
	for (var i = 0; i < categories.length; i++) {
	      banner_html += '<a class="nav-item nav-link active" href="#" onclick="build_cards(\''+ categories[i] +'\')">'+ categories[i] +'<span class="sr-only">(current)</span></a>'
	}

	$(".navbar-nav").html(banner_html);
}

function build_cards(categoria) {
	if (categoria == '') {
		categoria = 'Zapatillas';
	}
	var products = JSON.parse(localStorage.getItem('products'));
	var cards_html = '';
	cards_html += '<div class="card-columns">';
	items = products['data']
	for (var i = 0; i < items.length; i++) {
		if (items[i]['categoria'] == categoria){
			cards_html +=  '<div class="card">\
							<img class="card-img-top" src="' + items[i]['imagen'] +'" alt="Producto">\
							<div class="card-body">\
							<h2 class="card-title">' + '$' + items[i]['precio'] + '</h2>\
							<h5 class="card-title">' + items[i]['name'] + '</h5>\
							<p class="card-text">'+ items[i]['descripcion'] +'</p>\
							<form>\
							<input name="productQuantity" id="cantidad" type="number" value="0">\
							<a href="#" class="btn btn-primary">Agregar</a>\
							<a href="#" class="btn btn-danger">Eliminar</a>\
							<input id="" name="hDelProductId" type="hidden" value="">\
							<input id="" name="productId" type="hidden" value="'+ items[i]['id'] +'">\
							</form>\
							</div>\
							</div>'		
		}
	}
	
	cards_html += '</div>';
	
	$("#allcards").html(cards_html);

}

jQuery(document).ready(function() {
	/*Es importante preguntar por Cookies en este punto?*/
    //Guardar LocalStorage los productos.
	//Con la lista de productos, el carrito  y el  jSessionId construir las cards.
	Sincronizar();
	console.log("deberia haber sincronizado");
	
	 if (typeof(Storage) !== "undefined") {
		 localStorage.clear();
		 if (localStorage.getItem('products') === null) { 
			 localStorage.setItem('products', JSON.stringify(products));
		 }
		 build_banner();
		 build_cards('');
	 } else {
		   // Sorry! No Web Storage support..
	 } 
});


