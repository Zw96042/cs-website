import java.io.*;
import java.lang.*;
import java.util.*;
import java.text.*;

public class Harry
  {
  	
  
  	  
  	public static void main(String[]args) throws IOException
	  {
	  	 Scanner Sf =  new Scanner(new File("harry.dat"));
       
       int N = Sf.nextInt();
       for(int i=1; i<=N; i++)
       {
         String One = Sf.next();
         String Two = Sf.next();
         String Answer = "";
         for(int x=0; x<One.length(); x++)
            if(!Two.contains(One.substring(x,x+1)))
               Answer+=One.substring(x,x+1);
         if(Answer.length()==0)
            Answer = "ALL LETTERS ARE GONE";      
         System.out.println(Answer);
       
       } 
     }	
     
  }

		  	

