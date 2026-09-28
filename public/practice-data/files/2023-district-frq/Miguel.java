/*
 * UIL Computer Science 2023
 * District Packet Solution
 */

import java.io.*;
import java.util.*;

public class Miguel
  {
  
  public static ArrayList<Character>OldList = new ArrayList<Character>();
  public static ArrayList<Character>NewList = new ArrayList<Character>();

  
  public static String LettersGone(String St)
  {
   OldList.clear();
   String Word="";
   for (int x=0; x<St.length(); x++)
   {
     char Letter = St.charAt(x);
     if (Character.isLetter(Letter))
         OldList.add(Letter);
     if (Character.isUpperCase(Letter))
         Word+="A";
     else
         if (Character.isLowerCase(Letter))
            Word+="a";
         else
            Word+=""+Letter;
    }        
   return Word;
   } 
   
   
  public static String FixString(String St)
  {
      String Answer = "";
      int Count=0;
      for (int x=0; x<St.length(); x++)
         if (!Character.isLetter(St.charAt(x)))
            Answer += St.charAt(x);
         else
            if (Character.isUpperCase(St.charAt(x)))
               Answer += NewList.get(Count++);
            else
               Answer += Character.toLowerCase(NewList.get(Count++));      
  
      return Answer;
  
  }            
          
  
  public static void main(String[]args) throws IOException
     {
      Scanner Sc = new Scanner(new File("miguel.dat"));
      int N = Sc.nextInt();
      Sc.nextLine();
      for(int i=1; i<=N; i++)
         {
            String St = Sc.nextLine();
            String Thing = LettersGone(St);
            NewList.clear();
            for(Character Bob:OldList)
               NewList.add(Character.toUpperCase(Bob)); 
            Collections.sort(NewList);
            System.out.println(FixString(Thing));
            
            
         }               
     }
}