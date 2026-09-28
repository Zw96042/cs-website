/*
 * UIL Computer Science 2023
 * District Packet Solution
 */

import java.io.*;
import java.util.*;

public class Janice {
	
	public static void main(String[]args)throws Exception{
		Scanner file=new Scanner(new File("janice.dat"));
		int times=file.nextInt();
		file.nextLine();
		while(times-->0) {
			String orig = file.nextLine();
			String coded = file.nextLine();
			String mess = file.nextLine();
			char a = orig.charAt(0);
			char b = coded.charAt(0);
			int shift = b-a;
			if(shift<0) shift+=26;
			String fin = "";
			for(char c:mess.toCharArray()) {
				int v = (c-'A'-shift)%26;
				if(v<0)v+=26;
				char n =(char)('A' + v);
				if(c==' ')n=' ';
				fin += n;
			}
			System.out.println(fin);
		}
	}
}
