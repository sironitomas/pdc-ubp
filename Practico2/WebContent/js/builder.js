function GuardarEnElSessionStorage(data){
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
    		GuardarEnElSessionStorage(data);
    	}
    });
}

function ActualizarCantidades(arrayProductos,arrayProductosDelCarrito){
	var l = [];
	for(var i = 0; i < arrayProductos.length; i++) {
		var l2 = [];
		l2 = arrayProductosDelCarrito.filter(pdc => pdc.id == arrayProductos[i].id)
		if (l2.length == 0){/* no lo encontro */
			l.push( {
				 "name":arrayProductos[i].name,
				 "descripcion":arrayProductos[i].descripcion,
				 "id":arrayProductos[i].id,
				 "precio":arrayProductos[i].precio,
				 "categoria":arrayProductos[i].categoria,
				 "subcategoria":arrayProductos[i].subcategoria,
				 "imagen":arrayProductos[i].imagen,
				 "cantidad":0
				});		
			
		}
		 else{ /*lo encontro*/
			l.push( {
					 "name":arrayProductos[i].name,
					 "descripcion":arrayProductos[i].descripcion,
					 "id":arrayProductos[i].id,
					 "precio":arrayProductos[i].precio,
					 "categoria":arrayProductos[i].categoria,
					 "subcategoria":arrayProductos[i].subcategoria,
					 "imagen":arrayProductos[i].imagen,
					 "cantidad":l2[0].cantidad
					});	 
			 }
		};
		return l;
}

function buildBanner() {
	var products = JSON.parse(localStorage.getItem('productos'));
	var banner_html = '';
	items = products['data']
	categories = [];
	for (var i = 0; i < items.length; i++) {
		var cat = items[i]['categoria'];
		if (!categories.includes(cat)) {
			categories.push(cat);
		}
	}
	
	for (var i = 0; i < categories.length; i++) {
	      banner_html += '<a class="nav-item nav-link active" href="#" onclick="buildCards(\''+ categories[i] +'\')">'+ categories[i] +'<span class="sr-only">(current)</span></a>'
	}

	$(".navbar-nav").html(banner_html);
}

function buildCards(categoria){
		
	 const ObjProductos = JSON.parse(localStorage.getItem('productos'));
	 const arrayProductos = ObjProductos['data'];
	 var arr = [];
	 if (JSON.parse(sessionStorage.getItem('carrito')) ==null || JSON.parse(sessionStorage.getItem('carrito'))['data']==null){
		  arr = arrayProductos;
	 } 
	 else {
		 const ObjProductosDelCarrito = JSON.parse(sessionStorage.getItem('carrito'));	
		 const arrayProductosDelCarrito = ObjProductosDelCarrito['data'];
		  arr = ActualizarCantidades(arrayProductos,arrayProductosDelCarrito);
	 }
	  if (categoria == '') {
		 categoria = 'Zapatillas';
	  }
	 var cards_html = '';
	 cards_html += '<div class="card-columns">';
	 for (var i = 0; i < arr.length; i++) {
		if (arr[i]['categoria'] == categoria){
			if(arr[i]["cantidad"] == 0){	
				 cards_html +="<div class=\"principal\"> " +
				 		            "<div class=\"card\"> "+
				 					"<img class=\"card-img-top\" src=\""+ arr[i]['imagen']  +"\" alt=\"Card image cap\">"+
				 					"<div class=\"card-body\">"+
				 						"<h3 class=\"card-title\">"+ arr[i]['name'] +"</h3>"+
				 						"<p class=\"card-text\">" + arr[i]['descripcion'] + "</p>"+
				 						"<h3 class=\"card-text\">$" + arr[i]['precio'] + "</h3>"+
				 						"<form action=\"javascript:void(null)\" >"+
				 							"<input type=\"hidden\" name=\"productPrice\" value =\""+ arr[i]['precio'] + "\"></input>"+
				 							"<input type=\"hidden\" name=\"productId\" value =\""+ arr[i]['id'] + "\"></input>"+
				 							"<input name=\"productQuantity\" type=\"number\" style=\"width: 50px;\" min=\"1\" max=\"18\" value=\"1\" right-margin=\"5\" ></input>" +
				 							"<button class=\"btn btn-primary agregar\">Agregar al Carrito</button>"+
				 						"</form>"+
				 			   		"</div>"+
				 				"</div>"+
				 			  "</div>";
				}
			else {	
				cards_html +="<div class=\"principal\">" +
							       "<div class=\"card\"> "+
		    	                   "<img class=\"card-img-top\" src=\"" +  arr[i]['imagen']  +"\" alt=\"Card image cap\">"+
		    	                   "<div class=\"card-body\">"+
		    	                     "<h3 class=\"card-title\">"+  arr[i]['name'] +"</h3>"+
		    	                     "<p class=\"card-text\">" +  arr[i]['descripcion'] + "</p>"+
		    	                     "<h3 class=\"card-text\">$" +  arr[i]['precio'] + "</h3>"+
		    	                     "<form action=\"javascript:void(null)\" >"+
		    	                     	"<input type=\"hidden\" name=\"productPrice\" value =\""+  arr[i]['precio'] + "\"></input>"+
		    	                     	"<input type=\"hidden\" name=\"productId\" value =\""+  arr[i]['id'] + "\"></input>"+
		    	                     	"<input type=\"hidden\" name=\"productQuantity\" value =\""+  arr[i]["cantidad"] + "\"></input>"+
		    	                     	"<label class=\"card-text\"><h5>Cantidad => "+ arr[i]["cantidad"] +"</h5></label>"+
		    	                     	"<button class=\"btn btn-danger eliminar\">Eliminar del Carrito</button>"+
		    	                     "</form>" +
		    	                   "</div>"+
		    	                  "</div>" +
		    	              "</div>";
					
				}
			
			}
		}
		cards_html += '</div>';
		
		$("#allcards").html(cards_html);

}

function construirCardComprada(id,quantity){
	var ObjProductos = JSON.parse(localStorage.getItem('productos'));
    var arrayProductos = ObjProductos['data'];
    var arrayWithThisProduct = arrayProductos.filter(p => p.id == id);
    var thisProduct = arrayWithThisProduct[0];
    return "<div class=\"card\"> "+
    "<img class=\"card-img-top\" src=\"" +  thisProduct['imagen']  +"\" alt=\"Card image cap\">"+
    "<div class=\"card-body\">"+
      "<h5 class=\"card-title\">"+  thisProduct['name'] +"</h5>"+
      "<p class=\"card-text\">" +  thisProduct['descripcion'] + "</p>"+
      "<p class=\"card-text\">$" +  thisProduct ['precio'] + "</p>"+
      "<form action=\"javascript:void(null)\" >"+
      	"<input type=\"hidden\" name=\"productPrice\" value =\""+  thisProduct['precio'] + "\"></input>"+
      	"<input type=\"hidden\" name=\"productId\" value =\""+  thisProduct['id'] + "\"></input>"+
      	"<input type=\"hidden\" name=\"productQuantity\" value =\""+  quantity + "\"></input>"+
      	"<label class=\"card-text\"><h5>Cantidad => "+ quantity +"</h5></label>"+
      	"<button class=\"btn btn-danger eliminar\">Eliminar</button>"+
      "</form>" +
    "</div>"+
 "</div>";
    
	}

function construirCardNueva (id){
	var ObjProductos = JSON.parse(localStorage.getItem('productos'));
    var arrayProductos = ObjProductos['data'];
    var arrayWithThisProduct = arrayProductos.filter(p => p.id == id);
    var thisProduct = arrayWithThisProduct[0]; 
    
    return "<div class=\"card\"> "+
		"<img class=\"card-img-top\" src=\""+ thisProduct['imagen']  +"\" alt=\"Card image cap\">"+
		"<div class=\"card-body\">"+
			"<h5 class=\"card-title\">"+ thisProduct['name'] +"</h5>"+
			"<p class=\"card-text\">" + thisProduct['descripcion'] + "</p>"+
			"<p class=\"card-text\">$" + thisProduct['precio'] + "</p>"+
			"<form action=\"javascript:void(null)\" >"+
				"<input type=\"hidden\" name=\"productPrice\" value =\""+ thisProduct['precio'] + "\"></input>"+
				"<input type=\"hidden\" name=\"productId\" value =\""+ thisProduct['id'] + "\"></input>"+
				"<input name=\"productQuantity\" type=\"number\" style=\"width: 50px;\" min=\"1\" max=\"18\" value=\"1\" ></input>" +
				"<button class=\"btn btn-primary agregar\">Agregar</button>"+
			"</form>"+
		    "</div>"+
		"</div>";
}

jQuery(document).ready(function() {	
	const productos =
	{
		    "data": [
		        {
		            "name": "Nike Air Max",
		            "descripcion": "La nueva Zapatilla Gonew Tracker II te permite tener un agarre único que garantiza tu seguridad, transpirabilidad e impermeabilidad en todo momento y una pisada cómoda para pisar con firmeza.",
		            "id": 1,
		            "precio": 2000,
		            "categoria": "Zapatillas",
		            "subcategoria": "deportivas",
		            "imagen": "https://s7d2.scene7.com/is/image/dkscdn/17NIKMRNSWFTGRYBLRNN_Grey_White_is",
		            "cantidad": 0
		        },
		        {
		            "name": "Nike Epic React",
		            "descripcion": "Los chicos modernos buscan un look urbano, skater y cómodo para recorrer la ciudad con el estilo que la tabla les da. Te presentamos las Zapatillas Nike Delta Force Vulc, que te destacarán siempre.",
		            "id": 2,
		            "precio": 2200,
		            "categoria": "Zapatillas",
		            "subcategoria": "Clasicas",
		            "imagen": "https://images-na.ssl-images-amazon.com/images/I/61cbAQatNlL._UL1500_.jpg",
		            "cantidad": 0
		        },
		        {
		            "name": "Salomon Mission",
		            "descripcion": "Para complementar tu vestimenta casual, te presentamos las Zapatillas Nike Court Borough Low. Un calzado que brinda la comodidad ideal para todos los días.",
		            "id": 3,
		            "precio": 2400,
		            "categoria": "Zapatillas",
		            "subcategoria": "trekking",
		            "imagen": "https://cdn.mec.ca/medias/sys_master/high-res/high-res/8882295078942/5048056-SRF20.jpg",
		            "cantidad": 0
		        },
		        {
		            "name": "Reloj Casio F-200W",
		            "descripcion": "Te presentamos el nuevo Reloj Casio F-200W. Con él podrás tener en tu muñeca un reloj que posee las funciones que buscas. Cuenta con iluminación led y un diseño moderno y elegante.",
		            "id": 4,
		            "precio": 5000,
		            "categoria": "Relojes",
		            "subcategoria": "Casual",
		            "imagen": "https://static.netshoes.com.ar/produtos/reloj-casio-aw-49h/55/112-0069-055/112-0069-055_zoom1.jpg?resize=1200:*",
		            "cantidad": 0
		        },
		        {
		            "name": "Reloj Casio LQ-139AMV",
		            "descripcion": "Para las mujeres que se manejan en un ambiente agitado, llega el Reloj Casio LQ-139AMV que por su peso es ideal para mujeres y su resistencia lo hace apto para estar expuesto a diferentes escenarios.",
		            "id": 5,
		            "precio": 3000,
		            "categoria": "Relojes",
		            "subcategoria": "Casual",
		            "imagen": "https://static.netshoes.com.ar/produtos/reloj-casio-lq-139amv/18/112-0084-118/112-0084-118_zoom1.jpg?resize=1200:*",
		            "cantidad": 0
		        },
		        {
		            "name": "Reloj Prototype LTH-238",
		            "descripcion": "El Reloj Prototype LTH-238 es un clásico y sobrio accesorio para que tengas un sello distintivo a la hora de vestir cualquier prenda ya que su diseño combinará con todos los estilos.",
		            "id": 6,
		            "precio": 2750,
		            "categoria": "Relojes",
		            "subcategoria": "Casual",
		            "imagen": "https://static.netshoes.com.ar/produtos/reloj-prototype-lth-238/42/468-0008-042/468-0008-042_zoom1.jpg?resize=1200:*",
		            "cantidad": 0
		        },
		        {
		            "name": "Reloj Mistral GAW-279",
		            "descripcion": "Disfrutá de un accesorio de calidad y con estilo elegante y sofisticado, ideal para combinar con tu vestimenta para lucirte en todos lados, con el Reloj Mistral GAW-279.",
		            "id": 7,
		            "precio": 3600,
		            "categoria": "Relojes",
		            "subcategoria": "Casual",
		            "imagen": "https://static.netshoes.com.ar/produtos/reloj-mistral-gaw-279/05/469-0015-005/469-0015-005_zoom1.jpg?resize=1200:*",
		            "cantidad": 0
		        },
		        {
		            "name": "Reloj Prototype CHR",
		            "descripcion": "Porque sabemos que sos una persona que le gusta verse bien y cuidar hasta el último detalle de su look, te presentamos el Reloj Prototype CHR-9780 que con su estilo formal te destacará en todo momento",
		            "id": 8,
		            "precio": 4000,
		            "categoria": "Relojes",
		            "subcategoria": "Casual",
		            "imagen": "https://static.netshoes.com.ar/produtos/reloj-prototype-chr-9780/07/468-0003-007/468-0003-007_zoom1.jpg?resize=1200:*",
		            "cantidad": 0
		        },
		        {
		            "name": "Gorra Nike Legacy 91 Tech II",
		            "descripcion": "La nueva Gorra Nike Legacy 91 Tech II tiene una banda elástica acolchada permite un ajuste cómodo, añadiendo tecnología y confección que evita el deslumbramiento.",
		            "id": 9,
		            "precio": 600,
		            "categoria": "Gorras",
		            "subcategoria": "Ciudad",
		            "imagen": "https://static.netshoes.com.ar/produtos/gorra-nike-legacy-91-tech-ii/19/001-4798-819/001-4798-819_zoom1.jpg?resize=1200:*",
		            "cantidad": 0
		        },
		        {
		            "name": "Gorra Nike Areo Bill",
		            "descripcion": "Es casi imprescindible para el golfista practicar su deporte favorito con la Gorra Nike Areo Bill. Con tecnología DriFit que ayuda a mantenerse seco y Aerobill que la hace ligera y transpirable.",
		            "id": 10,
		            "precio": 390,
		            "categoria": "Gorras",
		            "subcategoria": "Golf",
		            "imagen": "https://static.netshoes.com.ar/produtos/gorra-nike-areo-bill/05/001-3860-005/001-3860-005_zoom1.jpg?resize=1200:*",
		            "cantidad": 0
		        },
		        {
		            "name": "Gorra Borna Travel Often",
		            "descripcion": "Para los días de sol y también para llevar tu estilo a todos lados, la nueva Gorra Borna Travel Often que es regulable a varias medidas, va a estar acorde a tu personalidad.",
		            "id": 11,
		            "precio": 700,
		            "categoria": "Gorras",
		            "subcategoria": "Ciudad",
		            "imagen": "https://static.netshoes.com.ar/produtos/gorra-borna-travel-often/02/280-0035-002/280-0035-002_zoom1.jpg?resize=1200:*",
		            "cantidad": 0
		        },
		        {
		            "name": "Gorra Borna Circular",
		            "descripcion": "Para los días de sol y también para llevar tu estilo a todos lados, la nueva Gorra Borna Circular que es regulable a varias medidas, va a estar acorde a tu personalidad.",
		            "id": 12,
		            "precio": 650,
		            "categoria": "Gorras",
		            "subcategoria": "Ciudad",
		            "imagen": "https://static.netshoes.com.ar/produtos/gorra-borna-circular/06/280-0034-506/280-0034-506_zoom1.jpg?resize=1200:*",
		            "cantidad": 0
		        },
		        {
		            "name": "Gorra Nike Aerobill",
		            "descripcion": "Cuando salgas a correr, asegurate de contar con accesorios de la mejor calidad y que te garanticen la mayor comodidad para hacer del running una experiencia única, como la Gorra Nike Aerobill.",
		            "id": 13,
		            "precio": 550,
		            "categoria": "Gorras",
		            "subcategoria": "Ciudad",
		            "imagen": "https://static.netshoes.com.ar/produtos/gorra-nike-aerobill/05/001-3483-005/001-3483-005_zoom1.jpg?resize=1200:*",
		            "cantidad": 0
		        },
		        {
		            "name": "Gorra DC Madglads",
		            "descripcion": "La Gorra DC Madglads complementará tu estilo casual, gracias a su logotipo y modelo trucker, protegiendote del sol de verano otorgandote frescura.",
		            "id": 14,
		            "precio": 400,
		            "categoria": "Gorras",
		            "subcategoria": "Casual",
		            "imagen": "https://static.netshoes.com.ar/produtos/gorra-dc-madglads/02/114-0529-002/114-0529-002_zoom1.jpg?resize=1200:*",
		            "cantidad": 0
		        }
		    ]
		}

	 if (typeof(Storage) !== "undefined") {
		 localStorage.clear();
		 if (localStorage.getItem('productos') === null) { 
			 localStorage.setItem('productos', JSON.stringify(productos));
		 }
	 }
	
	 Sincronizar();
	 buildBanner();
	 buildCards("");
	 
	 $("#allcards").on("click",".agregar", function() {
	    	const price = $(this).closest("form").find("input[name=productPrice]").val();
	    	const id = $(this).closest("form").find("input[name=productId]").val();
	    	const quantity = $(this).closest("form").find("input[name=productQuantity]").val();
	    	var card = $(this).closest(".principal");
	    	card.hide();
	    	card.empty();
	        $.ajax({
	           	url: "./CarritoServlet" + ";" + sessionStorage.getItem('jSessionId'),
	            type: "post",
	            datatype:"text",
	        	data:$.param({productId: id, productQuantity: quantity, productPrice: price}),
	        	error:function(hr){
	        		console.log(hr.responseText);
	        	},
	        	success:function(data){
	        		GuardarEnElSessionStorage(data);
	        		card.html(construirCardComprada(id,quantity));
	        		card.show();
	        	}
		    });
       });
	 
	 $("#allcards").on("click",".eliminar", function() {
	    	const id = $(this).closest("form").find("input[name=productId]").val();
	    	var card = $(this).closest(".principal");
	    	card.hide();
	    	card.empty();
	        $.ajax({
	           	url: "./CarritoServlet" + ";" + sessionStorage.getItem('jSessionId'),
	            type: "post",
	            datatype:"text",
	            data:$.param({DelProductId: id}),
	        	error:function(hr){
	        		console.log(hr.responseText);
	        	},
	        	success:function(data){
	        		GuardarEnElSessionStorage(data);
	        		card.html(construirCardNueva(id));
	        		card.show();
	        		
	        	}
		    });
      });
  });
  
