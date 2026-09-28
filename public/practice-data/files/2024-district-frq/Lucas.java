/*
 * UIL Computer Science 2024
 * District Packet Solution
 */

import java.io.*;
import java.util.*;

public class Lucas
  {
    
  
  public static void main(String[]args) throws IOException
     {
      
      Scanner Sf = new Scanner(new File("lucas.dat"));
      int T = Sf.nextInt();
        Sf.nextLine();
      for(int i=1; i<=T; i=i+1)
         {
            int Average = 0;
            String St=Sf.nextLine();
            Scanner SS=new Scanner(St);
            ArrayList<Integer>Times = new ArrayList<Integer>();
            while(SS.hasNext())
               Times.add(SS.nextInt());
            //System.out.print(Times+" ");   
            if(Times.size()==1)
               Average=Times.get(0);
            if(Times.size()==2)
               Average=(Times.get(0)+Times.get(1))/2;
            if(Times.size()>2)
               {
                 Collections.sort(Times);
                 int C = 0;
                 for(int x=1; x<Times.size()-1;x++)
                    C += Times.get(x);
                 Average = C/(Times.size()-2);
               }           
             //System.out.print(Average+" ");
             int Minute = Average/60;
             int Second = Average%60;
             if(Second>9)
               System.out.println(Minute+":"+Second);
             else
               System.out.println(Minute+":0"+Second);  
            
            }
         }
      }
     
     
   