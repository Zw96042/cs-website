/*
 * UIL Computer Science 2024
 * Invitational A Packet Solution
 */

import java.io.*;
import java.util.*;

public class Chuanli {
	public static void main(String[]args)throws Exception{
		new Chuanli().run();
	}
	public void run()throws Exception{
		Scanner file=new Scanner(new File("chuanli.dat"));
		int times=file.nextInt();
		file.nextLine();
		while(times-->0) {
			String[] s = file.nextLine().trim().split("\\s+");
			String fin = "";
			for(int y = s.length - 1; y >= 0; y--) {
				StringBuffer sb = new StringBuffer(s[y]);
				fin += sb.reverse().toString() + " ";
			}
			System.out.println(fin.trim());
		}
	}
}
