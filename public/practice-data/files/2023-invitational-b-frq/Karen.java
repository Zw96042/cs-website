/*
 * UIL Computer Science 2023
 * Invitational B Packet Solution
 */

import java.io.*;
import java.util.*;

public class Karen
  {
 
  public static void main(String[]args) throws IOException
     {
      Scanner Sc = new Scanner(new File("karen.dat"));
      int N = Sc.nextInt();
      for (int i=1; i<=N; i++)
         {
            int Number = Sc.nextInt();
            int Low  = (int)(Math.floor(Math.sqrt(Number)));
            int High = (int)(Math.ceil(Math.sqrt(Number)));
            Low = Low*Low;
            High = High*High;
            if (Math.abs(Number-Low)<Math.abs(Number-High))
               System.out.println(Low);
            else
               System.out.println(High);
         }   
     }
}