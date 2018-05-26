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

jQuery(document).ready(function() {
	/*Es importante preguntar por Cookies en este punto?*/
    //Guardar LocalStorage los productos.
	//Con la lista de productos, el carrito  y el  jSessionId construir las cards.
	Sincronizar();
});


