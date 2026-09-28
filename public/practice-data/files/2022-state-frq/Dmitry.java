/*
 * UIL Computer Science 2022
 * State Packet Solution
 */

import java.io.*;
import java.util.*;

public class Dmitry
  {
  
 
   public static void main(String[]args) throws IOException
     {
      Scanner Sf = new Scanner(new File("dmitry.dat")); 
      
      int N = Sf.nextInt();
      Sf.nextLine();
      for(int x=1; x<=N; x++)
          {
            String St = Sf.nextLine();
            Scanner Sc = new Scanner(St);
            ArrayList<Integer>List = new ArrayList<Integer>();
            while(Sc.hasNext())
               List.add(Sc.nextInt());
            Collections.sort(List);
            for(int y=0; y<List.size();y++)
               {
                  for(int z=1; z<=List.get(y); z++)
                     System.out.print("X");
                  System.out.println();
               }          
               
          }    
      }
  }
