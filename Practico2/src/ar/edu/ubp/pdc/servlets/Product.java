package ar.edu.ubp.pdc.servlets;

public class Product {
    private int id;
    private int quantity;
    private int price;

    public int getId() {
         return id;
    }

    public void setId(int id) {
        this.id = id;
    }
    public int getQuantity() {
        return quantity;
    }

   public void setQuantity(int quantity) {
       this.quantity = quantity;
    }
   public int getPrice() {
       return price;
    }

   public void setPrice(int price) {
      this.price = price;
    }
}