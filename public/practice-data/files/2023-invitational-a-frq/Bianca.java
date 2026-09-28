/*
 * UIL Computer Science 2023
 * Invitational A Packet Solution
 */

import java.io.*;
import java.lang.*;
import java.util.*;
import java.math.*;
public class Bianca {
	public static void main(String[]args)throws Exception{
		Scanner file=new Scanner(new File("bianca.dat"));
		int times=file.nextInt();
		file.nextLine();
		while(times-->0) {
			double a = file.nextInt();
			double b = file.nextInt();
			double c = Math.sqrt(a*a + b*b);
			System.out.printf("%.2f%n",c);
		}
	}
}
