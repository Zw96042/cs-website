/*
 * UIL Computer Science 2023
 * Invitational B Packet Solution
 */

import java.io.*;
import java.util.*;

public class Jacob {

	public static void main(String[] args) throws FileNotFoundException {
		
		Scanner data = new Scanner(new File("jacob.dat"));
		int T = data.nextInt();
		for (int t = 1; t <= T; t++) {
			int terms = data.nextInt();
			double pi = 3;
			double sign = 1;
			for (long i = 1; i <= terms; i++) {
				long f = 2 * i;
				pi += sign * 4.0 / (f * (f + 1) * (f + 2));
				sign = -sign;
			}
			System.out.printf("%15.13f\n", pi);
		}
		data.close();
	}
}
