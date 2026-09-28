import java.io.*;
import java.lang.*;
import java.util.*;
import java.text.*;

public class Carolyn
  {
  	
  
  	  
  	public static void main(String[]args) throws IOException
	  {
	  	 Scanner Sf =  new Scanner(new File("carolyn.dat"));
       
       int N = Sf.nextInt();
       for(int i=1; i<=N; i++)
       {
         String St = Sf.next();
         char Start = St.charAt(0);
         char Finish = St.charAt(1);
         if (Start<=Finish)
            {
              int goal = 0;   
              for (char ch = Start; ch<=Finish; ch++)
               {
                  goal++;
                  for(int x = 1; x<=goal; x++)
                     System.out.print(ch);
                  System.out.println();
               }
            }
         else
            {
               int goal = 0;   
               for (char ch = Start; ch>=Finish; ch--)
                {
                  goal++;
                  for(int x = 1; x<=goal; x++)
                     System.out.print(ch);
                  System.out.println();
               }
              Finish = St.charAt(1);
              Start = St.charAt(0);
            }
            
         
       }
       
   }
}	

		  	

