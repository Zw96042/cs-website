import java.util.Scanner;
import java.io.File;
import java.io.FileNotFoundException;

public class Juana {

	public static void main(String[] args) throws FileNotFoundException {
		Scanner data = new Scanner(new File("juana.dat"));
		int T = data.nextInt();
		for (int t = 1; t <= T; t++) {
			int R = data.nextInt();
			int C = data.nextInt();
			int [][] table = new int[R+1][C+1];
			for (int r = 1; r <= R; r++)
				for (int c = 1; c <= C; c++)
					table[r][c] = data.nextInt();
			int rpos = data.nextInt();
			int cpos = data.nextInt();
			int cols = data.nextInt();
			int rows = data.nextInt();
			System.out.printf("Test case #%d:", t);
			if (rpos + rows - 1 > R || cpos + cols - 1 > C)
				System.out.println(" Unable to extract requested size!");
			else {
				System.out.println();
				for (int r = rpos; r < rpos + rows; r++) {
					for (int c = cpos; c < cpos + cols; c++)
						System.out.printf("%5d", table[r][c]);
					System.out.println();
				}
			}
			System.out.println("--------------------");
		}
		data.close();
	}
}
