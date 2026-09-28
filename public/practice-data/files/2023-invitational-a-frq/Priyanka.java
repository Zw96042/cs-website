/*
 * UIL Computer Science 2023
 * Invitational A Packet Solution
 */

import java.io.*;
import java.lang.*;
import java.util.*;
import java.text.*;

public class Priyanka
  {
  
  public static String WordSort(String St)
  {
      ArrayList<String>Bob = new ArrayList<String>(); 
      for(int x=0; x<St.length();x++)
         Bob.add(St.substring(x,x+1));
      Collections.sort(Bob);
      String Bertha = "";
      for(int x=0; x<Bob.size();x++)
         Bertha+=Bob.get(x);
      return Bertha;             
  }
  
  
  public static String WordReverse(String St)
  {
      StringBuffer Temp = new StringBuffer(St);
      Temp.reverse();
      String Other = Temp.toString();
      return(Other);             
  }
  
  
  public static void main(String[]args) throws IOException
     {
      Scanner Sc = new Scanner(new File("priyanka.dat"));
      int N = Sc.nextInt();
      for (int i=1; i<=N; i++)
         {
            String Vowels = "";
            String Consonants = "";
            String Word = Sc.next();
            for(int x=0; x<Word.length();x++)
               if("AEIOU".contains(Word.substring(x,x+1)))
                  Vowels += Word.substring(x,x+1);
               else
                  Consonants += Word.substring(x,x+1);   
            if(Vowels.length()>1)
               Vowels = WordSort(Vowels);
            Vowels = WordReverse(Vowels);
            if(Consonants.length()>1)
               Consonants = WordSort(Consonants);
            String NewWord = Vowels + Consonants; 
            if(NewWord.equals(Word))
               System.out.print("WOO-HOO ");
            System.out.println(NewWord);
            
         }   
      
     
     }
}