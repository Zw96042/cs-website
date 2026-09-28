/*
 * UIL Computer Science 2022
 * State Packet Solution
 */

import java.io.*;
import java.util.*;

public class Charles
  {
  
 
   public static void main(String[]args) throws IOException
     {
      Scanner Sf = new Scanner(new File("charles.dat")); 
      
      int N = Sf.nextInt();
      for(int x=1; x<=N; x++)
      {
         String Answer="";
         
         int T = Sf.nextInt();
         int Sum = T;
         if (T==1)
            Answer = "1=1";
         else  
          { 
            for(int y = 1; y<T; y++)
               if(T%y==0)
               {
                  Answer+=y+"+";
                  Sum+=y;
               }   
           Answer+=T+"="+Sum;
          }
         System.out.println(Answer);      
      }    
  }
}
