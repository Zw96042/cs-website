import java.awt.Point;
import java.io.File;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedList;
import java.util.Queue;
import java.util.Scanner;

public class Shirley {

	final static int threshold = 250;
	final static int [] rdiff = {-1, 0, +1, 0};
	final static int [] cdiff = {0, +1, 0, -1};
	static ArrayList<Cluster> clusters = new ArrayList<Cluster>();
	static Queue<Point> neighbors = new LinkedList<Point>();
	static int [] counts = {0, 0, 0, 0};

	public static void main(String[] args) throws FileNotFoundException {
		Scanner data = new Scanner(new File("shirley.dat"));
		int S = data.nextInt();
		for (int s = 1; s <= S; s++) {
			int R = data.nextInt();
			int C = data.nextInt();
			System.out.printf("Case #%d:\n", s);
			int [][] grid = new int[R+2][C+2];
			Arrays.fill(grid[0], 0);
			Arrays.fill(grid[R+1], 0);
			for (int r = 1; r <= R; r++) {
				Arrays.fill(grid[r], 0);
				for (int c = 1; c <= C; c++)
					grid[r][c] = data.nextInt();
			}
			clusters.clear();  // fresh for new test case
			for (int r = 1; r <= R; r++) {
				for (int c = 1; c <= C; c++) {
					if (grid[r][c] >= threshold) {
						neighbors.clear();  // start new cluster
						clusters.add(0,new Cluster(grid[r][c]));
						neighbors.add(new Point(r,c));
						grid[r][c] = 0;
						while (!neighbors.isEmpty())
							checkNeighbors(grid, neighbors.remove());
					}
				}
			}
			clusters.sort(null);
			int n = 0;
			while (clusters.size() > 0 && clusters.get(0).plots > 1 && ++n <= 3) {
				Cluster c = clusters.remove(0);
				System.out.printf("%d %3.1f\n", c.trees, (float)(c.plots * 100)/(R * C));
			}
			while (++n <= 3) System.out.println("NONE");
			System.out.println("^^^^^^^^^^^^");
		}
		data.close();
	}

	static void checkNeighbors(int [][] g, Point p) {
		for (int i = 0; i < 4; i++) {
			int r = p.x + rdiff[i];
			int c = p.y + cdiff[i];
			if (g[r][c] >= threshold) {
				neighbors.add(new Point(r,c));
				clusters.get(0).add(g[r][c]);
				g[r][c] = 0;
				counts[i]++;
			}
		}
	}

}

class Cluster implements Comparable<Cluster> {
	int trees;
	int plots;
	
	Cluster(int t) {
		trees = t;
		plots = 1;
	}
	
	public void add(int t) {
		trees += t;
		plots++;
	}

	public int compareTo(Cluster c) {
		return c.trees - trees;
	}
}
