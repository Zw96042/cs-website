/*
 * UIL Computer Science 2024
 * District Packet Solution
 */

import java.io.*;
import java.util.*;

public class Bodhi {

	public static void main(String[] args) throws FileNotFoundException {

		Scanner data = new Scanner(new File("bodhi.dat"));
		int T = data.nextInt();
		for (int t = 1; t <= T; t++) {
			double pv = data.nextDouble();
			double apr = data.nextDouble();
			int ppy = data.nextInt();
			int n = data.nextInt();
			double rate = apr / ppy / 100.0;
			double fv = pv * Math.pow(1.0 + rate, n);
			System.out.printf("$%4.2f $%4.2f\n", fv, fv - pv);
		}
	}
}
