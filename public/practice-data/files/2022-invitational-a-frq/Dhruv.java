import java.io.*;
import java.lang.*;
import java.util.*;
import java.text.*;

public class Dhruv
  {
  	
  
  	  
  	public static void main(String[]args) throws IOException
	  {
	  	 Scanner Sf =  new Scanner(new File("dhruv.dat"));
       String[]Stations = new String[8];
       String[]NewStations = new String[8];
       for(int x=0;x<8;x++)
         Stations[x] = Sf.nextLine().trim();
       
       int N = Sf.nextInt();
       for(int i=1; i<=N; i++)
       {
         int Best = -1;
         int Closeness = 2000;
         int Selection = Sf.nextInt();
         if(Selection < 535 || Selection >1605)
            System.out.println("BAD INPUT");
         else
         {
            for(int x=0;x<8;x++)
               {
                  String[]Temp = Stations[x].split(" ");
                  int Trial = Math.abs(Selection - Integer.parseInt(Temp[1]));
                  if(Trial==Closeness)
                     if(Integer.parseInt(Temp[1])>Integer.parseInt(Stations[Best].substring(5)))
                     {
                        Closeness = Trial;
                        Best = x;
                     }
                  if (Trial<Closeness)
                     {
                        Closeness = Trial;
                        Best = x;
                     }
                                 
               }
         System.out.println(Stations[Best].substring(0,4));
         }
       }
       
	

		  	
	  }	  
}	
