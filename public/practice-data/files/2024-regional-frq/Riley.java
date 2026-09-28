/*
 * UIL Computer Science 2024
 * Region Packet Solution
 */

import java.io.*;
import java.util.*;

public class Riley {

	public static void main(String[] args) throws FileNotFoundException {
		
		Scanner data = new Scanner(new File("riley.dat"));
		int T = data.nextInt();
		for (int t = 1; t <= T; t++) {
			int R = data.nextInt();
			int C = data.nextInt();
			int [][] grid = new int[R][C];
			for (int r = 0; r < R; r++) {
				for (int c = 0; c < C; c++)
					grid[r][c] = data.nextInt();
			}
			int top = 0, bottom = R-1, left = 0, right = C-1;
			while (top <= bottom && left <= right) {
				int r, c;
				float sum = 0;
				int count = 0;
				r = top;
				for (c = left; c <= right; c++) {
					sum += grid[r][c];
					count++;
				}
				top++;
				c = right;
				for (r = top; r <= bottom; r++) {
					sum += grid[r][c];
					count++;
				}
				right--;
				r = bottom;
				for (c = right; c >= left && bottom >= top; c--) {
					sum += grid[r][c];
					count++;
				}
				bottom--;
				c = left;
				for (r = bottom; r >= top && left <= right; r--) {
					sum += grid[r][c];
					count++;
				}
				left++;
				if (count > 0) System.out.printf("%4.2f ", sum / count);
			}
			System.out.println();
		}
		data.close();
	}
}
