/*
 * UIL Computer Science 2023
 * Invitational B Packet Solution
 */

import java.io.*;
import java.util.*;

public class Tushar {

	public static void main(String[] args) throws FileNotFoundException {
		Scanner data = new Scanner(new File("tushar.dat"));
		int N = data.nextInt();
		for (int n = 1; n <= N; n++) {
			int R = data.nextInt();
			int C = data.nextInt();
			int [][] grid = new int[R][C];
			for (int r = 0; r < R; r++) {
				for (int c = 0; c < C; c++)
					grid[r][c] = data.nextInt();
			}
			int sum, count;
			for (int c = 0; c < C; c++) {
				sum = 0;
				count = 0;
				for (int r = 0; r < R && r + c < C ; r++) {
					sum += grid[r][r+c];
					count++;
				}
				System.out.printf("%4.2f ", (float)sum/count);
			}
			for (int r = 1; r < R; r++) {
				sum = 0;
				count = 0;
				for (int c = 0; c < C && r + c < R; c++) {
					sum += grid[r+c][c];
					count++;
				}
				System.out.printf("%4.2f ", (float)sum/count);
			}
			System.out.println();
		}
		data.close();
	}
}
