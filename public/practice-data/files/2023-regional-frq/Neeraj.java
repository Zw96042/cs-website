/*
 * UIL Computer Science 2023
 * Region Packet Solution
 */

import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;

public class Neeraj {
	public static class Rational {
		int numerator;
		int denominator;

		public Rational(int n, int d) {
			numerator = n;
			denominator = d;
		}

		public void reduce() {
			int myGCD = gcd(numerator, denominator);

			if (denominator < 0)
				myGCD = myGCD * -1;

			numerator = numerator / myGCD;
			denominator = denominator / myGCD;
		}

		public String toString() {
			return "" + numerator + "/" + denominator;
		}
	}

	public static int gcd(int u, int v) {
		if (u == 0 && v == 0)
			return 0;

		if (v == 0)
			return Math.abs(u);

		if (u == 0)
			return Math.abs(v);

		int divisor = Math.min(Math.abs(v), Math.abs(u));

		while ((u % divisor) != 0 || (v % divisor) != 0)
			divisor--;

		return divisor;
	}

	public static void main(String args[]) throws FileNotFoundException {
		Scanner s;
		if (args.length == 0)
			s = new Scanner(new File("neeraj.dat"));
		else
			s = new Scanner(new File(args[0]));

		int N = s.nextInt();
		s.nextLine();

		for (int n = 1; n <= N; n++) {
			String line = s.nextLine();

			String decimalOnly = line.substring(line.indexOf('.'));

			double numerator = Double.parseDouble(decimalOnly);
			double denominator = 1;

			int count = decimalOnly.length() - 1;// account for decimal place

			numerator *= Math.pow(10, count);
			denominator *= Math.pow(10, count);

			Rational r = new Rational((int) numerator, (int) denominator);
			r.reduce();

			System.out.println(line + " is equal to " + r.toString());
		}
	}
}