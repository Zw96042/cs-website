/*
 * UIL Computer Science 2023
 * District Packet Solution
 */

import java.io.*;
import java.util.*;

public class Christine
  {
  
  
   
  
  public static void main(String[]args) throws IOException
     {
      Scanner Sc = new Scanner(new File("christine.dat"));
      int A = Sc.nextInt();
      int B = Sc.nextInt();
      int C = Sc.nextInt();
      int D = Sc.nextInt();
      int E = Sc.nextInt();
      int F = Sc.nextInt();
      if (A<=B)
         for(int x=A; x<=B; x++)
            System.out.print(x+" ");
      else         
         for(int x=A; x>=B; x--)
            System.out.print(x+" "); 
      System.out.println();
      
      if (B<=C)
         for(int x=B; x<=C; x++)
            System.out.print(x+" ");
      else         
         for(int x=B; x>=C; x--)
            System.out.print(x+" "); 
      System.out.println();
      
       if (C<=D)
         for(int x=C; x<=D; x++)
            System.out.print(x+" ");
      else         
         for(int x=C; x>=D; x--)
            System.out.print(x+" "); 
      System.out.println();
      
      if (D<=E)
         for(int x=D; x<=E; x++)
            System.out.print(x+" ");
      else         
         for(int x=D; x>=E; x--)
            System.out.print(x+" "); 
      System.out.println();
      
       if (E<=F)
         for(int x=E; x<=F; x++)
            System.out.print(x+" ");
      else         
         for(int x=E; x>=F; x--)
            System.out.print(x+" "); 
      System.out.println();
      
               
     }
}