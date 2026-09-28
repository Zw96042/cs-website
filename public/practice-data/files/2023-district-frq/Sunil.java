/*
 * UIL Computer Science 2023
 * District Packet Solution
 */

import java.io.*;
import java.util.*;

public class Sunil {

	public static void main(String[] args) throws FileNotFoundException {
		
		Scanner data = new Scanner(new File("sunil.dat"));
		int T = data.nextInt();
		for (int t = 1; t <= T; t++) {
			int R = data.nextInt();
			int C = data.nextInt();
			int [][] grid = new int[R][C];
			float [] row_avg = new float[R];
			float [] col_avg = new float[C];
			float sum = 0;
			for (int r = 0; r < R; r++) {
				for (int c = 0; c < C; c++) {
					grid[r][c] = data.nextInt();
					row_avg[r] += grid[r][c];
					col_avg[c] += grid[r][c];
				}
				//row_avg[r] /= C;
				sum += row_avg[r];
				System.out.printf("%8.2f", row_avg[r] / C);
			}
			System.out.println();
			for (int c = 0; c < C; c++) {
				//col_avg[c] /= R;
				System.out.printf("%8.2f", col_avg[c] / R);
			}
			System.out.printf("\n%8.2f\n", sum / (R * C));
			System.out.println("=========================");
		}
		data.close();
	}
}
