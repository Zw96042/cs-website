/*
 * UIL Computer Science 2024
 * District Packet Solution
 */

import java.io.*;
import java.util.*;

public class Caroline
  {
    
  
  public static void main(String[]args) throws IOException
     {
      
      Scanner Sf = new Scanner(new File("caroline.dat"));
      int T = Sf.nextInt();
      for(int i=1; i<=T; i=i+1)
         {
            ArrayList<Integer>Numbers = new ArrayList<Integer>();
            for(int x=1; x<=10; x++)
               Numbers.add(Sf.nextInt());
            int Odd = 0;
            int Even = 0;
            for(int Bob:Numbers)
               if(Bob%2==1)
                  Odd+=Bob;
               else
                  Even+=Bob;
            if(Odd>Even)
               System.out.println("Odds win by " + (Odd-Even) + " point(s)");
            if(Even>Odd)
               System.out.println("Evens win by " + (Even-Odd) + " point(s)");
            if(Even==Odd)
               System.out.println("It's a tie!!! ");                   
            
            }
         }
      }
     
     
   