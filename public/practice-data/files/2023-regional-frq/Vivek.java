/*
 * UIL Computer Science 2023
 * Region Packet Solution
 */

import java.io.*;
import java.util.*;

public class Vivek {
	public static void main(String[] args) throws Exception {
		new Vivek().run();
	}

	public void run() throws Exception {
		Scanner file = new Scanner(new File("vivek.dat"));
		int times = file.nextInt();
		file.nextLine();
		while (times-- > 0) {
			double x = file.nextDouble();
			double y = file.nextDouble();
			double z = file.nextDouble();
			long g = file.nextLong();
			file.nextLine();
			int m = file.nextInt(), made = 0;
			file.nextLine();
			for (int r = 1; r <= m; r++) {
				file.next();
				boolean mech = file.nextBoolean();
				double a = file.nextDouble();
				double b = file.nextDouble();
				double c = file.nextDouble();
				if (mech) {
					double dist = distance(x, y, z, a, b, c);
					if (dist <= g)
						made++;
				}
			}
			System.out.println(made > 0 ? "We made it Rick: " + made : "SS Madame de Pompadour");
		}
	}

	public double distance(double x, double y, double z, double a, double b, double c) {
		return Math.sqrt(Math.pow(x - a, 2) + Math.pow(y - b, 2) + Math.pow(z - c, 2));
	}
}
