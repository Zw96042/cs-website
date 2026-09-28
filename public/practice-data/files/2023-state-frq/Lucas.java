/*
 * UIL Computer Science 2023
 * State Packet Solution
 */

import java.io.*;
import java.util.*;

public class Lucas
  {
  
  public static void main(String[]args) throws IOException
     {
      Scanner Sc = new Scanner(new File("lucas.dat"));
      int N = Sc.nextInt();
      Sc.nextLine();
    
      for(int i=1; i<=N; i++)
         {
            String St = Sc.nextLine();
            int[]LetterCount = new int[(int)'z'+1];
            
            for(int x=0; x<LetterCount.length; x++)
               LetterCount[x]=0;
               
            for(int x=0; x<St.length(); x++)
               LetterCount[(int)St.charAt(x)]++;
               
            int Total = 0;
            for (int x=(int)'a';x<=(int)'z';x++)
               Total += (x-96)*(LetterCount[x])*(LetterCount[x]);
               
            System.out.println(Total);   
     
         }
    }     
     
}