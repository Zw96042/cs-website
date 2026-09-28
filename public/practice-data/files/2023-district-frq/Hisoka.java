/*
 * UIL Computer Science 2023
 * District Packet Solution
 */

import java.io.*;
import java.util.*;

public class Hisoka {

	public static void main(String[] args) throws FileNotFoundException {
		
		Scanner data = new Scanner(new File("hisoka.dat"));
		int T = data.nextInt();
		for (int t = 1; t <= T; t++) {
			double p = data.nextDouble();
			double r = data.nextDouble() / 1200.0;
			int n = data.nextInt() * 12;
			double v = p * (Math.pow(1 + r, n) - 1) / r;
			double totpayments = p * n;
			double profit = v - totpayments;
			System.out.printf("%4.2f %4.2f %4.2f\n", totpayments, profit, v);
		}
		data.close();
	}
}
