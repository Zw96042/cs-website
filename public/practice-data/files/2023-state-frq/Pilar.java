/*
 * UIL Computer Science 2023
 * State Packet Solution
 */

import static java.lang.System.*;
import java.io.*;
import java.util.*;

public class Pilar {

	public static void main(String[] args) throws FileNotFoundException {
		Scanner data = new Scanner(new File("pilar.dat"));
		data.useDelimiter("[\\r\\n,: ]+");
		int T = data.nextInt();
		for (int t = 1; t <= T; t++) {
			int lb1 = data.nextInt();
			int ub1 = data.nextInt();
			int lb2 = data.nextInt();
			int ub2 = data.nextInt();
			int lb3 = data.nextInt();
			int ub3 = data.nextInt();
			double [][][] d3 = new double[ub1-lb1+1][ub2-lb2+1][ub3-lb3+1];
			for (int d = lb1; d <= ub1; d++)
				for (int r = lb2; r <= ub2; r++)
					for (int c = lb3; c <= ub3; c++)
						d3[d-lb1][r-lb2][c-lb3] = data.nextDouble();
			int N = data.nextInt();
			for (int n = 1; n <= N; n++) {
				int l1 = data.nextInt();
				int u1 = data.nextInt();
				int l2 = data.nextInt();
				int u2 = data.nextInt();
				int l3 = data.nextInt();
				int u3 = data.nextInt();
				int count = (u1-l1+1)*(u2-l2+1)*(u3-l3+1);
				double sum = 0.0f;
				for (int d = l1; d <= u1; d++)
					for (int r = l2; r <= u2; r++)
						for (int c = l3; c <= u3; c++)
							sum += d3[d-lb1][r-lb2][c-lb3];
				out.printf("%d:%4.2f\n", count, sum);
			}
			out.println("====================");
		}
		data.close();
	}
}
