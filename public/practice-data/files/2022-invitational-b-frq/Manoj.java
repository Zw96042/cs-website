import java.io.*;
import java.lang.*;
import java.util.*;
import java.text.*;

public class Manoj
  {
  	
  
  	  
  	public static void main(String[]args) throws IOException
	  {
	  	 Scanner Sf =  new Scanner(new File("manoj.dat"));
       
       int N = Sf.nextInt();
       int CFreeze = 0;
       int CBoil = 100;
       int CRange = CBoil - CFreeze;
       
       int FFreeze = 32;
       int FBoil = 212;
       int FRange = FBoil - FFreeze;
       
       for(int i=1; i<=N; i++)
       {
         int MFreeze = Sf.nextInt();
         int MBoil = Sf.nextInt();
         int Temp = Sf.nextInt();
         int MRange = MBoil - MFreeze;
         char Start = Sf.next().charAt(0);
         char Finish = Sf.next().charAt(0);
         int MTemp, CTemp, FTemp, Numerator, Denominator; 
         MTemp = -999;
         CTemp = -999;
         FTemp = -999;
         Numerator = 1;
         Denominator = 1; 
         
         // C to F
         if(Start=='C' && Finish=='F')
            {
               int GCF = 1;
               for(int x=1; x<=CRange; x++)
                  if(CRange%x == 0 && FRange%x == 0)
                     GCF = x;
               Numerator = FRange/GCF;
               Denominator = CRange/GCF;      
                     
               CTemp = Temp;
               FTemp = (CTemp-CFreeze) * Numerator/Denominator + FFreeze;
               System.out.println(CTemp + " degrees C = " + FTemp + " degrees F");  
            }
         
         // F to C
         if(Start=='F' && Finish=='C')
            {
               int GCF = 1;
               for(int x=1; x<=CRange; x++)
                  if(CRange%x == 0 && FRange%x == 0)
                     GCF = x;
               Numerator = CRange/GCF;
               Denominator = FRange/GCF;      
                     
               FTemp = Temp;
               CTemp = (FTemp-FFreeze) * Numerator/Denominator + CFreeze;
               System.out.println(FTemp + " degrees F = " + CTemp + " degrees C");
            }   
         
         // M to F
         if(Start=='M' && Finish=='F')
            {
               int GCF = 1;
               for(int x=1; x<=MRange; x++)
                  if(MRange%x == 0 && FRange%x == 0)
                     GCF = x;
               Numerator = FRange/GCF;
               Denominator = MRange/GCF;      
                     
               MTemp = Temp;
               FTemp = (MTemp-MFreeze) * Numerator/Denominator + FFreeze;
               System.out.println(MTemp + " degrees M = " + FTemp + " degrees F");  
            }
         // M to C
          if(Start=='M' && Finish=='C')
            {
               int GCF = 1;
               for(int x=1; x<=CRange; x++)
                  if(CRange%x == 0 && MRange%x == 0)
                     GCF = x;
               Numerator = CRange/GCF;
               Denominator = MRange/GCF;      
                     
               MTemp = Temp;
               CTemp = (MTemp-MFreeze) * Numerator/Denominator + CFreeze;
               System.out.println(MTemp + " degrees M = " + CTemp + " degrees C");
            }
         
         // F to M
         if(Start=='F' && Finish=='M')
            {
               int GCF = 1;
               for(int x=1; x<=MRange; x++)
                  if(MRange%x == 0 && FRange%x == 0)
                     GCF = x;
               Numerator = MRange/GCF;
               Denominator = FRange/GCF;      
                     
               FTemp = Temp;
               MTemp = (FTemp-FFreeze) * Numerator/Denominator + MFreeze;
               System.out.println(FTemp + " degrees F = " + MTemp + " degrees M");
             }  
         
         // C to M 
       if(Start=='C' && Finish=='M')
            {
               int GCF = 1;
               for(int x=1; x<=MRange; x++)
                  if(MRange%x == 0 && CRange%x == 0)
                     GCF = x;
               Numerator = MRange/GCF;
               Denominator = CRange/GCF;      
                     
               CTemp = Temp;
               MTemp = (CTemp-CFreeze) * Numerator/Denominator + MFreeze;
               System.out.println(CTemp + " degrees C = " + MTemp + " degrees M");
             }
       } 
     }	
     
  }

		  	

