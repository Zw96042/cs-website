/*
 * UIL Computer Science 2023
 * Invitational B Packet Solution
 */

import java.io.*;
import java.util.*;

public class Mario
  {
  
  public static String WordReverse(String St)
  {
      StringBuffer Temp = new StringBuffer(St);
      Temp.reverse();
      String Other = Temp.toString();
      return(Other);             
  }
  
  public static void main(String[]args) throws IOException
     {
      Scanner Sc = new Scanner(new File("mario.dat"));
      int N = Sc.nextInt();
      for (int i=1; i<=N; i++)
         {
            int Number = Sc.nextInt();
            String Word = Sc.next();
            if (Word.length()<Number)
               System.out.println("error");
            else if (Word.length()<Number*2)
                  System.out.println(WordReverse(Word));
                 else 
                 {
                     String Part1 = WordReverse(Word.substring(0,Number));
                     String Part2 = Word.substring(Number,Word.length()-Number);
                     String Part3 = WordReverse(Word.substring(Word.length()-Number));
                     System.out.println(Part3+Part2+Part1);             
                 }
         }   
     }
}