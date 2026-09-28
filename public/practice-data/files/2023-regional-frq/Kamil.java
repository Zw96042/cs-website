/*
 * UIL Computer Science 2023
 * Region Packet Solution
 */

import java.io.*;
import java.util.*;

public class Kamil {
	public static void main(String[] args) throws Exception {
		Scanner file = new Scanner(new File("kamil.dat"));
		int times = file.nextInt();
		file.nextLine();
		while (times-- > 0) {
			String[] s = file.nextLine().trim().split("\\s+");
			TreeMap<String, String> tm = new TreeMap<String, String>();
			for (String t : s)
				tm.put(new StringBuffer(t.toLowerCase()).reverse().toString(), t);
			String fin = "";
			for (String t : tm.keySet())
				fin += tm.get(t) + " ";
			System.out.println(fin.trim());
		}
	}
}
