/*
 * UIL Computer Science 2023
 * Invitational B Packet Solution
 */

import java.io.*;
import java.util.*;

public class Petra
  {
  
  public static int NumberReverse(int Num)
  {
      String St = "" + Num;
      StringBuffer Temp = new StringBuffer(St);
      Temp.reverse();
      String Other = Temp.toString();
      int Result = Integer.parseInt(Other);
      return(Result);             
  }
  
  public static void main(String[]args) throws IOException
     {
      Scanner Sc = new Scanner(new File("petra.dat"));
      int N = Sc.nextInt();
      for (int i=1; i<=N; i++)
         {
            int One = Sc.nextInt();
            int Two = NumberReverse(One);
            int GCF = 0;   
            for(int x=1; x<=One; x++)
               if(One%x==0 && Two%x==0)
                  GCF = x;
            System.out.println(GCF);
         }   
     }
}