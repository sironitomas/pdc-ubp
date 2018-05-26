package ar.edu.ubp.pdc.listeners;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.SessionTrackingMode;
import javax.servlet.annotation.WebListener;
import java.util.EnumSet;

@WebListener
public class CarritoServletContextListener implements ServletContextListener {

    public CarritoServletContextListener() { }

	
    public void contextInitialized(ServletContextEvent sce) {
        sce.getServletContext().setSessionTrackingModes(EnumSet.of(SessionTrackingMode.URL));
   }

	
    public void contextDestroyed(ServletContextEvent sce) { }
	
}
