import java.io.File;
import java.io.FileNotFoundException;
import java.util.Arrays;
import java.util.Scanner;

public class Pamela {

	public static void main(String[] args) throws FileNotFoundException {
		Scanner data = new Scanner(new File("pamela.dat"));
		int T = data.nextInt();
		for (int t = 1; t <= T; t++) {
			int R = data.nextInt();
			int C = data.nextInt();
			int [][] matrix = new int[R][C];
			System.out.printf("Case: %d\n", t);
			int r, c;
			for (r = 0; r < R; r++)
				for (c = 0; c < C; c++)
					matrix[r][c] = data.nextInt();
			int [] rowsums = new int[R];
			int [] rowmins = new int[R];
			int [] colsums = new int[C];
			int [] colmaxs = new int[C];
			Arrays.fill(rowmins, Integer.MAX_VALUE);
			Arrays.fill(colmaxs, Integer.MIN_VALUE);
			for (r = 0; r < R; r++)
				for (c = 0; c < C; c++) {
					int d = matrix[r][c];
					rowsums[r] += d;
					colsums[c] += d;
					if (d < rowmins[r]) rowmins[r] = d;
					if (d > colmaxs[c]) colmaxs[c] = d;
				}
			int min = Integer.MAX_VALUE;
			int max = Integer.MIN_VALUE;
			System.out.print("Row Sums:");
			for (r = 0; r < R; r++) System.out.printf("%7d", rowsums[r]);
			System.out.printf("\nRow Mins:");
			for (r = 0; r < R; r++) {
				System.out.printf("%7d", rowmins[r]);
				if (rowmins[r] < min) min = rowmins[r];
			}
			System.out.printf("\nCol Sums:");
			for (c = 0; c < C; c++) System.out.printf("%7d", colsums[c]);
			System.out.printf("\nCol Maxs:");
			for (c = 0; c < C; c++) {
				System.out.printf("%7d", colmaxs[c]);
				if (colmaxs[c] > max) max = colmaxs[c];
			}
			System.out.printf("\nMin Mins:%7d\n", min);
			System.out.printf("Max Maxs:%7d\n", max);
			System.out.println("====================");
		}
		data.close();
	}
}
