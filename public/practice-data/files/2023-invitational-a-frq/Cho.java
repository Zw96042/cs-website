/*
 * UIL Computer Science 2023
 * Invitational A Packet Solution
 */

import java.io.*;
import java.lang.*;
import java.util.*;
import java.math.*;
public class Cho {
	public static void main(String[]args)throws Exception{
		Scanner file=new Scanner(new File("cho.dat"));
		int times=file.nextInt();
		file.nextLine();
		while(times-->0) {
			String j=file.nextLine().trim();
			TreeMap<Character,Integer>tm=new TreeMap<Character,Integer>();
			for(char c:j.toCharArray()) {
				if(!Character.isAlphabetic(c))continue;
				if(tm.containsKey(c))
					tm.put(c, tm.get(c)+1);
				else
					tm.put(c,  1);
			}
			char win='0';
			int most=0;
			for(char c:tm.keySet()) {
				if(tm.get(c) > most) {
					most=tm.get(c);
					win=c;
				}
			}
			System.out.println(win);
		}
	}
}

