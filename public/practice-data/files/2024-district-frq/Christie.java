/*
 * UIL Computer Science 2024
 * District Packet Solution
 */

import java.io.*;
import java.util.*;

public class Christie
  {
    
  
  public static void main(String[]args) throws IOException
     {
      
      Scanner Sf = new Scanner(new File("christie.dat"));
      int T = Sf.nextInt();
      for(int i=1; i<=T; i=i+1)
         {
            int A=Sf.nextInt();
            int B=Sf.nextInt();
            int Count =0;
            for(int x=A; x<=B; x++)
               {
                  String St = ""+x;
                  int Sum = 0;
                  for(int y=0; y<St.length();y++)
                     {
                        String Sub = St.substring(y,y+1);
                        int Digit = Integer.parseInt(Sub);
                        Sum+=Digit*Digit;
                     }
                  boolean cool=false;
                  for(int q=1; q<=1000000;q++)   
                     if (q*q==Sum)
                        cool = true;     
                        
                  if(cool)
                     {
                        System.out.print(x+" ");  
                        Count++;
                     }   
                }
              if(Count==0)
               System.out.println("NONE");
              else
               System.out.println("");  
            }
         }
      }
     
     
   