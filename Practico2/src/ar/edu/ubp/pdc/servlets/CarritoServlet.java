package ar.edu.ubp.pdc.servlets;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

@WebServlet("/CarritoServlet")
public class CarritoServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    public CarritoServlet() {
        super();
    }
    
	private static String toString(List<Product> cart) {
		/**********************************************************
		 *Metodo (rustico) para transformar tu carrito en un Array JSON.* 
		 **********************************************************/
		String accum = "[";
		for(int i=0; i<cart.size() ;i++) {
			String aux="";
			if (i < cart.size()-1) {
				aux="{\"id\":" + cart.get(i).getId() +"," + 
					 "\"cantidad\":" + cart.get(i).getQuantity() +","+ 
					 "\"precio\":" + cart.get(i).getPrice() +
					 "},";/* Si no es el ultimo pongo coma*/
				accum = accum + aux;
			}
			else {
				aux="{\"id\":" + cart.get(i).getId() +"," + 
					 "\"cantidad\":" + cart.get(i).getQuantity() +","+
					 "\"precio\":" + cart.get(i).getPrice() +
					 "}";/* Si es el ultimo  no pongo coma*/
				accum = accum + aux;
				}
		}
		accum = accum + "]";
		return accum;
	}

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException{
		 
		    response.setContentType("text/html;charset=ISO-8859-1");
	        PrintWriter out = response.getWriter();
	        String strCarrito;
	        try {
	        	
	        	HttpSession session = request.getSession(true);
	        	String strurl = "\"" + response.encodeURL(request.getContextPath() + request.getServletPath()) + "\"";
	        		        	
	        	if(session.getAttribute("carrito")!= null) {
	        		
					List<Product> carrito = (List<Product>)session.getAttribute("carrito");
					strCarrito =  toString(carrito) ;
	        	
	        	}else {
	        		strCarrito = "[]";

	        	}
	        	out.println("{\"url\":" + strurl +"," + "\"carrito\":" + strCarrito +"}");
	        }   
	        finally {//posible error
	                 out.close();
	             }
	}
	
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {//Borramos el producto al carrito.

		 
		PrintWriter out = response.getWriter();
		HttpSession session = request.getSession(true);
		
		if(request.getParameter("DelProductId") != null && request.getParameter("DelProductId") != "") 
		{
		    int idProductoASerEliminado = Integer.parseInt(request.getParameter("DelProductId"));
			List<Product> carrito = (List<Product>)session.getAttribute("carrito");
			List<Product> nuevoCarrito = carrito.stream()
												.filter(p -> p.getId()!= idProductoASerEliminado)
												.collect(Collectors.toList());
			session.setAttribute("carrito", nuevoCarrito);
		}
		else
		{
			if(request.getParameter("productId") != null && request.getParameter("productId") != "" &&
			   request.getParameter("productQuantity") != null && request.getParameter("productQuantity") != "" &&
			   request.getParameter("productPrice") != null && request.getParameter("productPrice") != "") 
			{
				
				Product product = new Product();
				product.setId(Integer.parseInt(request.getParameter("productId")));
			    product.setQuantity(Integer.parseInt(request.getParameter("productQuantity")));
			    product.setPrice(Integer.parseInt(request.getParameter("productPrice")));
                
			    if(session.getAttribute("carrito")== null) 
			    {//Si no existe el carrito en la session lo creamos y le agregamos un producto.
           
                	List<Product> carrito = new ArrayList<Product>();
     		    	carrito.add(product);
     		    	session.setAttribute("carrito", carrito);
                }
                else 
                {
                	List<Product> carrito = (List<Product>)session.getAttribute("carrito");
                	carrito.add(product);
     		    	session.setAttribute("carrito",carrito);
                	
                }
		    	
			}
		}
		doGet(request,response);
	  }
    
    }
