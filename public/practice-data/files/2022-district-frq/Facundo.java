import java.io.*;
import java.lang.*;
import java.util.*;
import java.text.*;

public class Facundo
  {
     	  
  	public static void main(String[]args) throws IOException
	  {
       int Numerator1 = 0, Denominator1 = 0, Whole1 = 0, Numerator2 = 0, Denominator2 = 0, Whole2 = 0;
       Scanner Sc = new Scanner(new File("facundo.dat"));
       int N = Sc.nextInt();
       Sc.nextLine();
       for(int x=1; x<=N; x++)
       {
         String Deck1 = "";
         String Deck2 = "";
         String Deck3 = "";
         
         String St = Sc.next();
         int Shuffles = Sc.nextInt();
         Sc.nextLine();
         Deck3=St;
         while(Shuffles > 0)
         {
         Deck3="";
         if(St.length()%2==0)
            {
               Deck1 = St.substring(0,St.length()/2);
               Deck2 = St.substring(St.length()/2);
            }
          else
            {
               Deck1 = St.substring(0,St.length()/2+1);
               Deck2 = St.substring(St.length()/2+1);
            }
           
           
           if (St.length()%2==0)
            {
               for(int i = Deck1.length()-1; i>=0; i--)
                  {
                     Deck3 = Deck1.charAt(i) + Deck3;
                     Deck3 = Deck2.charAt(i) + Deck3;
                  }
               
            }
            else
            {
               Deck3 += Deck1.charAt(Deck1.length()-1);
               for(int i = Deck1.length()-2; i>=0; i--)
                  {
                     Deck3 = Deck2.charAt(i) + Deck3;
                     Deck3 = Deck1.charAt(i) + Deck3;
                  }
               
            }
            Shuffles--;
            St = Deck3;
          }
         
            
            System.out.println(Deck3);
           
            
        
       }
       
               
       
       
    
	  }	  
}	
