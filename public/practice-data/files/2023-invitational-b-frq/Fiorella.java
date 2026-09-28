/*
 * UIL Computer Science 2023
 * Invitational B Packet Solution
 */

import java.io.*;
import java.util.*;

public class Fiorella {
	public static void main(String[]args)throws Exception{
		Scanner file=new Scanner(new File("fiorella.dat"));
		int times=file.nextInt();
		file.nextLine();
		while(times-->0) {
			int w=file.nextInt();
			int x=file.nextInt();
			int y=file.nextInt();
			int z=file.nextInt();
			int G=file.nextInt();
			G -= z;
			G /= w;
			G /= y;
			int ans = (int)(Math.log(G)/Math.log(x));
			System.out.println(ans);
		}
	}
}
