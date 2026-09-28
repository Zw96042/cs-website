/*
 * UIL Computer Science 2023
 * Invitational A Packet Solution
 */

import java.io.*;
import java.lang.*;
import java.util.*;
import java.text.*;

public class Damian
  {
  
  public static boolean IsIncreasing(String St)
  {
      boolean bob = true;
      for(int x=0; x<St.length()-1;x++)
         if(St.charAt(x)>=St.charAt(x+1))
            bob = false;
      return bob;       
  }
  
  
  
  public static void main(String[]args) throws IOException
     {
      Scanner Sc = new Scanner(new File("damian.dat"));
      int N = Sc.nextInt();
      for (int i=1; i<=N; i++)
         {
            int Number = Sc.nextInt();
            for(int x=1; x<=Number;x++)
               if(Number % x == 0 && IsIncreasing(""+x))
                  System.out.print(x + " ");
            System.out.println();
         }   
      
     
     }
}