/*
 * UIL Computer Science 2023
 * State Packet Solution
 */

import java.io.*;
import java.util.*;

public class Gabriel
  {
  
  public static void main(String[]args) throws IOException
     {
      Scanner Sc = new Scanner(new File("gabriel.dat"));
      int N = Sc.nextInt();
      Sc.nextLine();
    
      for(int i=1; i<=N; i++)
         {
            int T = Sc.nextInt();
            String St = Sc.nextLine().trim();
            St = St.replaceAll(" ","");
            if(T*T*T > St.length())
               System.out.println("NOT ENOUGH LETTERS");
            else
               {
                  int x=0;
                  for(int A=1; A<=T; A++)
                  {
                     for(int B=1; B<=T; B++)
                        {
                        for(int C=1; C<=T; C++)
                           System.out.print(St.charAt(x++));
                        System.out.print(" ");
                        }
                     System.out.println();
                        
                  }      
            
               
                 }
             }
         }
     }
     
