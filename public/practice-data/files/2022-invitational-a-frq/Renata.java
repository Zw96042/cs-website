import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;

public class Renata {

	public static void main(String[] args) throws FileNotFoundException {
		Scanner data = new Scanner(new File("renata.dat"));
		int T = data.nextInt();
		for (int t = 1; t <= T; t++) {
			int N = data.nextInt();
			int [][] grid = new int[N+1][N+1];
			grid[0][0] = 0;
			for (int r = 1; r <= N; r++)
				for (int c = 1; c <= N; c++)
					grid[r][c] = data.nextInt();
			int shots = data.nextInt();
			int score = 0;
			for (int s = 1; s <= shots; s++)
				score += grid[data.nextInt()][data.nextInt()];
			System.out.printf("%d: %d\n", t, score);
		}
	}
}
