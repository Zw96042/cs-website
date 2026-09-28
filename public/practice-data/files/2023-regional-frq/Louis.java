/*
 * UIL Computer Science 2023
 * Region Packet Solution
 */

import java.io.*;
import java.util.*;

public class Louis {

	public static void main(String[] args) throws FileNotFoundException {

		Scanner data = new Scanner(new File("louis.dat"));
		int T = data.nextInt();
		for (int t = 1; t <= T; t++) {
			double a = data.nextDouble();
			double b = data.nextDouble();
			double c = data.nextDouble();
			if (a == 0)
				System.out.println("Function is not quadratic");
			else { 
				double d = b * b - 4 * a * c;
				double x = -b / 2 / a;
				String minmax = (a > 0) ? "min" : "max";
				if (d < 0)
					System.out.printf("Function has no roots ");
				else if (d == 0)
					System.out.printf("Function has 1 root at %5.3f ", x);
				else {
					d = (double)Math.sqrt(d);
					double r1 = (-b - d) / 2 / a;
					double r2 = (-b + d) / 2 / a;
					if (r1 > r2) {
						double temp = r1;
						r1 = r2;
						r2 = temp;
					}
					System.out.printf("Function has 2 roots at %5.3f and %5.3f ", r1, r2);
				}
				System.out.printf("with %s of %5.3f at %5.3f\n", minmax, fx(a, b, c, x), x);
			}

		}
		data.close();
	}

	static double fx(double aa, double bb, double cc, double xx) {
		return aa * xx * xx + bb * xx + cc;
	}
}
