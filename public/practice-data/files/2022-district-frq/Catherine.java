import java.io.*;
import java.lang.*;
import java.util.*;
import java.text.*;

public class Catherine
  {
  	   
      
   
  
     	  
  	public static void main(String[]args) throws IOException
	  {
       
       Scanner Sc = new Scanner(new File("catherine.dat"));
       int N = Sc.nextInt();
       for(int x = 1; x<=N; x++)
       {
         String Answer = ""; 
         String Word = Sc.next();
         String Guess = Sc.next();
         for (int y = 0; y<Word.length(); y++)
            if(Word.charAt(y) == Guess.charAt(y))
               Answer += Character.toUpperCase(Word.charAt(y));
            else if (Word.contains(""+Guess.charAt(y)))
                    Answer += Guess.charAt(y);
                 else
                    Answer += "*";
         System.out.println(Answer);              
               
       }
       
    
	  }	  
}	
