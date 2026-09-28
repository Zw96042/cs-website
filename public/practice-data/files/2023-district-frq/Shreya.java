/*
 * UIL Computer Science 2023
 * District Packet Solution
 */

import java.io.*;
import java.util.*;

public class Shreya {
	
	public static void main(String[]args)throws Exception{
		Scanner file=new Scanner(new File("Shreya.dat"));
		int times=file.nextInt();
		file.nextLine();
		while(times-->0) {
			String[] cns = file.nextLine().trim().split(" ");
			int[] vals = new int[cns.length];
			for(int y=0;y<cns.length;y++)
				vals[y]=Integer.parseInt(cns[y]);
			int tar = file.nextInt();
			file.nextLine();
			boolean[] test = new boolean[tar+1];
			test[0]=true;
			for(int coin:vals)
				for(int y=tar;y>=0;y--)
					if(test[y] && y+coin <= tar)
						test[y+coin] = true;
			System.out.println(test[tar]?"Business as usual.":"Dine and Dash.");
		}
	}
}
