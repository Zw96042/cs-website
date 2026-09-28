/*
 * UIL Computer Science 2023
 * District Packet Solution
 */

import java.io.*;
import java.util.*;

public class George {
	
	public static void main(String[]args)throws Exception{
		Scanner file=new Scanner(new File("george.dat"));
		int times=file.nextInt();
		file.nextLine();
		while(times-->0) {
			double a = file.nextInt();
			double b = file.nextInt();
			double c = file.nextInt();
			double d = a * b;
			if (c-d < 1e-6)
				System.out.println("Never tell me the odds.");
			else
				System.out.println("I've got a bad feeling about this.");
		}
	}
}
