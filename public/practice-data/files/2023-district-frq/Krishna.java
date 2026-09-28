/*
 * UIL Computer Science 2023
 * District Packet Solution
 */

import java.io.*;
import java.util.*;

public class Krishna
  {
  
  
  public static int Triangular(int Number)
  {
   int Sum = 0;
   for (int x=1; x<=Number; x++)
      Sum+=x;
   return Sum;   
  } 
  
  public static void main(String[]args) throws IOException
     {
      Scanner Sc = new Scanner(new File("krishna.dat"));
      int N = Sc.nextInt();
      for(int i=1; i<=N; i++)
         {
            int A = Sc.nextInt();
            int B = Sc.nextInt();
            int Total=0;
            for(int x=A; x<=B; x++)
               Total+=Triangular(x);
            System.out.println(Total);
         }               
     }
}