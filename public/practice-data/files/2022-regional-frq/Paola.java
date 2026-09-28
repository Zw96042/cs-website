import java.io.*;
import java.lang.*;
import java.util.*;
import java.text.*;

public class Paola
  {
  
 
   public static void main(String[]args) throws IOException
     {
      Scanner Sf = new Scanner(new File("paola.dat")); 
      int N, Rows, Spaces, Place;
      String St ="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      St = St + St + St + St + St + St + St + St;
      char Letter;
      
      N = Sf.nextInt();
      for(int x=1; x<=N; x++)
      {
         Letter = Sf.next().charAt(0);
         Rows = Sf.nextInt();
         Place = St.indexOf(""+Letter);
         Spaces = Rows-1;
            
         for (int R=1; R<=Rows;R++)
         {
            for (int S=1; S<=Spaces; S++)
               System.out.print(" ");
            Spaces--;
            for (int C =1; C<=R; C++)
               System.out.print(St.charAt(Place++));
             System.out.println();
         }    
        
      }    
  }
}
