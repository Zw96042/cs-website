/*
 * UIL Computer Science 2023
 * District Packet Solution
 */

import java.io.*;
import java.util.*;

public class Patrick {

	public static void main(String[] args) throws FileNotFoundException {
		
		Scanner data = new Scanner(new File("patrick.dat"));
		while (data.hasNext()) {
			String n = data.next();
			int pos = data.nextInt();
			while ( pos-- > 1) {
				StringBuilder nbr = new StringBuilder();
				int i = 0, end = n.length();
				while (i < end) {
					int count = 0;
					while (i + count < end && n.charAt(i) == n.charAt(i+count))
						count++;
					assert count <= 9;
					nbr.append(count);
					nbr.append(n.charAt(i));
					i += count;
				}
				n = nbr.toString();
			}
			System.out.println(n);	//(n.length()+":"+n);
		}
		data.close();
	}
}
