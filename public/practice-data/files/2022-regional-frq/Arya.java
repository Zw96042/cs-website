import java.io.*;
import java.lang.*;
import java.util.*;
import java.text.*;

public class Arya
  {
  
 
   public static void main(String[]args) throws IOException
     {
      Scanner Sf = new Scanner(new File("arya.dat")); 
      int Number, Guess, Low, High, N;
      
      N = Sf.nextInt();
      for(int x=1; x<=N; x++)
      {
         Low = 1;
         High = Sf.nextInt();
         Number = Sf.nextInt(); 
      
         do
         {
            Guess = (Low + High)/2;
            System.out.println(Low+"-"+Guess+"-"+High);
         
            if(Guess<Number)
               Low = Guess + 1;
            if(Guess> Number)
               High = Guess - 1;
         }
         while(Number != Guess); 
         System.out.println("GOT IT!!!");
     }    
}
}
