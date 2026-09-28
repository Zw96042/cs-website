/*
 * UIL Computer Science 2023
 * Region Packet Solution
 */

import java.io.*;
import java.util.*;

public class Cynthia {
	public static void main(String[] args) throws Exception {
		Scanner file = new Scanner(new File("cynthia.dat"));
		int times = file.nextInt();
		file.nextLine();
		while (times-- > 0) {
			int a = file.nextInt();
			int b = file.nextInt();
			int c = file.nextInt();
			double one = (double) (a + b) / 2 * c;
			double onf = (double) (a + c) / 2 * b;
			double ong = (double) (c + b) / 2 * a;
			double max = one;
			if (onf > max)
				max = onf;
			if (ong > max)
				max = ong;
			System.out.printf("%,.2f%n", max);
		}
	}
}
