import java.io.*;
import java.lang.*;
import java.util.*;
import java.text.*;

public class Diane
  {
     	  
  	public static void main(String[]args) throws IOException
	  {
       int Numerator1 = 0, Denominator1 = 0, Whole1 = 0, Numerator2 = 0, Denominator2 = 0, Whole2 = 0;
       Scanner Sc = new Scanner(new File("diane.dat"));
       int N = Sc.nextInt();
       Sc.nextLine();
       for(int x = 1; x<=N; x++)
       {
         String St = Sc.nextLine();
         String[] List = St.split("and");
         List[0] = List[0].trim();
         if (!List[0].contains(" ") && !List[0].contains("/"))
         {
            Numerator1 = Integer.parseInt(List[0]);
            Denominator1 = 1;
         }
         if (!List[0].contains(" ") && List[0].contains("/"))
         {
            String[]Fract = List[0].split("/");
            Numerator1 = Integer.parseInt(Fract[0]);
            Denominator1 = Integer.parseInt(Fract[1]);
         }
         if (List[0].contains(" ") && List[0].contains("/"))
         {
            String[]Mixed = List[0].split("[/ ]");
            Whole1 = Integer.parseInt(Mixed[0]);
            Numerator1 = Integer.parseInt(Mixed[1]);
            Denominator1 = Integer.parseInt(Mixed[2]);
            if (Whole1 > 0)
               Numerator1 = Numerator1 + Whole1 * Denominator1;
            else   
               Numerator1 = -Numerator1 + Whole1 * Denominator1;
         }
         
         
         List[1] = List[1].trim();
         if (!List[1].contains(" ") && !List[1].contains("/"))
         {
            Numerator2 = Integer.parseInt(List[1]);
            Denominator2 = 1;
         }
         if (!List[1].contains(" ") && List[1].contains("/"))
         {
            String[]Fract = List[1].split("/");
            Numerator2 = Integer.parseInt(Fract[0]);
            Denominator2 = Integer.parseInt(Fract[1]);
         }
         if (List[1].contains(" ") && List[1].contains("/"))
         {
            String[]Mixed = List[1].split("[/ ]");
            Whole2 = Integer.parseInt(Mixed[0]);
            Numerator2 = Integer.parseInt(Mixed[1]);
            Denominator2 = Integer.parseInt(Mixed[2]);
            if (Whole2 > 0)
               Numerator2 = Numerator2 + Whole2 * Denominator2;
            else   
               Numerator2 = -Numerator2 + Whole2 * Denominator2;
         }  
         

         
         int LCM = 1;
         for(int i=Denominator1*Denominator2; i>=Denominator1; i--)
            if(i % Denominator1 == 0 && i % Denominator2 == 0)
              LCM = i;
              
         int Mult1 = LCM/Denominator1;
         int Mult2 = LCM/Denominator2;
         
         Numerator1 = Numerator1 * Mult1;  
         Numerator2 = Numerator2 * Mult2;  
         
         Denominator1 = Denominator1 * Mult1;  
         Denominator2 = Denominator2 * Mult2;  

         //System.out.println(Numerator1 + " " + Denominator1);
         //System.out.println(Numerator2 + " " + Denominator2);
         
         int Numerator3 = Numerator1 + Numerator2;
         int Denominator3 = Denominator2;
         
         int LastGCF = 1;
         for(int k=1; k<= Numerator3; k++)
            if(Numerator3 % k == 0 && Denominator3 % k == 0)
               LastGCF = k;
         int Numerator4 = Numerator3 / LastGCF;
         int Denominator4 = Denominator3 / LastGCF;
         
         if (Numerator4 == 0)
            System.out.println(0);
         else if (Denominator4 == 1)
            System.out.println(Numerator4);
         else if (Math.abs(Numerator4) < Denominator4)
                 System.out.println(Math.abs(Numerator4)+"/"+Denominator4);
              else
                 System.out.println(Numerator4/Denominator4 +" " + Math.abs(Numerator4)%Denominator4+"/"+Denominator4);
      
            
            
            
         
         
         
        
                       
               
       }
       
    
	  }	  
}	
