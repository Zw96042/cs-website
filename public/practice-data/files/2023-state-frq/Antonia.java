/*
 * UIL Computer Science 2023
 * State Packet Solution
 */

import java.io.*;

public class Antonia
  {
  
  public static void main(String[]args) throws IOException
     {
      String St = "BRAVO UIL COMPSCI";
      for(int x=0; x<St.length(); x++)
         {
            if(St.charAt(x)!=' ')
               for (int y=1; y<=(int)(St.charAt(x)-64); y++)
                  System.out.print(St.charAt(x));
             
            System.out.println();   
     
         }
    }     
     
}