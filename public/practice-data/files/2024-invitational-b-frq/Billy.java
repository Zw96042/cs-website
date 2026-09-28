/*
 * UIL Computer Science 2024
 * Invitational B Packet Solution
 */

import java.io.*;
import java.util.*;

public class Billy
  {
    
  
  public static void main(String[]args) throws IOException
     {
      String[]Schools = new String[8];
      int[]Wins = new int[8];
      int[]Losses = new int[8];
      double[]Pct = new double[8];
      Scanner Sf = new Scanner(new File("billy.dat"));
      for(int x=0; x<8; x=x+1)
         {
            Sf.nextLine();
            int W = Sf.nextInt();
            int L = Sf.nextInt();
            Sf.nextLine();
            Pct[x] = 100.0*W/L;
         }
      Arrays.sort(Pct);
      double Best = Pct[7];
      
      Scanner Sc = new Scanner(new File("billy.dat"));
      
      for (int x=0; x<8; x=x+1)
      {
         Schools[x] = Sc.nextLine();
         Wins[x] = Sc.nextInt();
         Losses[x] = Sc.nextInt();
         Sc.nextLine();
         Pct[x] = 100.0*Wins[x]/Losses[x];
         if(Pct[x]==Best)
            System.out.println(Schools[x]);
      }
            
      
      }
     
     }               
     
   