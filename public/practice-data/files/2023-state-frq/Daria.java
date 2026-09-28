/*
 * UIL Computer Science 2023
 * State Packet Solution
 */

import java.io.*;
import java.util.*;

public class Daria {
	public static void main(String[]args)throws Exception{
		Scanner file=new Scanner(new File("daria.dat"));
		int times=file.nextInt();
		file.nextLine();
		for(int sss=1;sss<=times;sss++) {
			//if(sss == 8)System.out.println(file.nextLine());
			int a=file.nextInt(), b=file.nextInt();
			file.nextLine();
			String key=file.nextLine().trim();
			double total=0;
			ArrayList<Double>med=new ArrayList<Double>();
			for(int y=0;y<a;y++) {
				String v=file.nextLine().trim();
				//System.out.println(v);
				double g=grade(key, v, b);
				med.add(g);
				total+=g;
			}
			System.out.println("Assignment #"+sss+":");
			System.out.printf("Mean Score: %.2f%n",total/a);
			System.out.printf("Median Score: %.1f%n", m(med));
			if(times!=sss)System.out.println();
		}
	}
	
	public static double grade(String key, String ans, int b) {
		double h=0;
		for(int y=0;y<b;y++) 
			if(key.charAt(y)==ans.charAt(y))h+=1;
		return 100 * h / b;
	}
	
	public static double m(ArrayList<Double>med) {
		Collections.sort(med);
		if(med.size()%2==0)
			return (med.get(med.size()/2-1)+med.get(med.size()/2))/2;
		return med.get(med.size()/2);
	}
}
