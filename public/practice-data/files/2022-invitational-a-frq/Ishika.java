import java.io.*;
import java.lang.*;
import java.util.*;
import java.text.*;

public class Ishika
  {
  	
  
  	  
  	public static void main(String[]args) throws IOException
	  {
	  	 Scanner Sf =  new Scanner(new File("ishika.dat"));
       
       int N = Sf.nextInt();
       for(int i=1; i<=N; i++)
       {
         int NumPieces = Sf.nextInt();
         int[]Planks = new int[NumPieces];
         for(int x=0; x<NumPieces;x++)
            Planks[x] = Sf.nextInt();
         int Best = Integer.MAX_VALUE; 
         for(int x=0; x<NumPieces-1;x++)
            for(int y=x+1; y<NumPieces;y++)
               {
                  int Possible = Planks[x]+Planks[y];
                  if(Possible>=20 && Possible < Best)
                     Best = Possible;
               }
         if(Best == Integer.MAX_VALUE)
            System.out.println("NOT POSSIBLE");
         else
            System.out.println(Best);
        
         }
       }
       
	

		  	
	  }	  

