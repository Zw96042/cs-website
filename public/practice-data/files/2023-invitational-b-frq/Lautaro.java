/*
 * UIL Computer Science 2023
 * Invitational B Packet Solution
 */

import java.io.*;
import java.util.*;

public class Lautaro {
	public static void main(String[]args)throws Exception{
		Scanner file=new Scanner(new File("lautaro.dat"));
		int times=file.nextInt();
		file.nextLine();
		while(times-->0) {
			String pn = file.nextLine().trim();
			if(pn.matches("\\([0-9]{3}\\) [0-9]{3}-[0-9]{4}"))
				System.out.println("Valid Phone Number.");
			else
				System.out.println("No Calls for You.");
		}
	}
}
