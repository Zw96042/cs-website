/*
 * UIL Computer Science 2023
 * State Packet Solution
 */

import java.io.*;
import java.util.*;

public class Chongan
  {
  
  public static void main(String[]args) throws IOException
     {
      Scanner Sc = new Scanner(new File("chongan.dat"));
      int N = Sc.nextInt();
      Sc.nextLine();
    
      for(int i=1; i<=N; i++)
         {
            int Champ = -1;
            String Winner = "";
            for (int x=1; x<=6; x++)
            {   
               String St = Sc.next();
               int Num = Sc.nextInt();
               
               if (Num > Champ)
                 {
                  Champ = Num;
                  Winner = St;
                 }
                 }
               Sc.nextLine();                 
            System.out.println(Winner);   
     
         }
         
     
    }
    
    }
