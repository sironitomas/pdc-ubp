jQuery(document).ready(function() {
	const products = {
		    "Pantalones": [
		            {
		                "name": "Levi's 505",
		                "talle": "30",
		                "precio": "1600",
		                "image":"http://www.ocnargentina.com/wp-content/uploads/2014/09/DSC5028-468x550.jpg"
		            },
		            {
		                "name": "Levi's 510",
		                "talle": "32",
		                "precio": "1900",
		                "image":"http://www.ocnargentina.com/wp-content/uploads/2014/09/DSC5028-468x550.jpg"
		            }
		        ],
		    "Remeras": [
		            {
		                "name": "Rusty",
		                "talle": "M",
		                "precio": "500",
		                "image":"http://www.ocnargentina.com/wp-content/uploads/2014/09/DSC5028-468x550.jpg"
		            },
		            {
		                "name": "Quicksilver",
		                "talle": "L",
		                "precio": "800",
		                "image":"http://www.ocnargentina.com/wp-content/uploads/2014/09/DSC5028-468x550.jpg"

		            }
		        ],
		    "Zapatillas": {}
		};

	 if (typeof(Storage) !== "undefined") {
		 if (localStorage.getItem('products') === null) { 
			 localStorage.setItem('products', JSON.stringify(products));
		 }
	 } else {
		   // Sorry! No Web Storage support..
	 } 
 });

function myFunction(p1, p2) {
    return p1 * p2;              // The function returns the product of p1 and p2
}