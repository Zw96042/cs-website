import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Scanner;

import static java.lang.System.out;

public class Logan {
    public static void main(String[] args) throws IOException {
        Scanner input = new Scanner(new File("logan.dat"));
        // PrintWriter out = new PrintWriter(new File("logan.out"));
        int t = input.nextInt();

        for (int tc = 1; tc <= t; tc++) {
            int r = input.nextInt();
            int c = input.nextInt();
            int d = input.nextInt();
            int[][] grid = new int[r][c];
            int smelliest = Integer.MIN_VALUE;

            for (int i = 0; i < r; i++) {
                for (int j = 0; j < c; j++) {
                    grid[i][j] = input.nextInt();
                    smelliest = Math.max(smelliest, grid[i][j]);
                }
            }

            ArrayList<String> spots = new ArrayList<String>();
            for (int i = 0; i < r; i++) {
                for (int j = 0; j < c; j++) {
                    if (grid[i][j] == smelliest) {
                        spots.add("(" + (i + 1) + "," + (j + 1) + ")");
                    }
                }
            }

            out.println("--- Hazard Map Case " + tc + " ---");
            out.println("Grid:");
            for (int i = 0; i < r; i++) {
                for (int j = 0; j < c; j++) {
                    out.printf("%3d", grid[i][j]);
                }
                out.println();
            }
            out.println();

            out.println("Smelliest value: " + smelliest);
            out.print("Location(s)  : ");
            for (int i = 0; i < spots.size(); i++) {
                if (i > 0) out.print(" ");
                out.print(spots.get(i));
            }
            out.println();
            out.println();

            out.println("Danger map:");
            for (int i = 0; i < r; i++) {
                for (int j = 0; j < c; j++) {
                    if (j > 0) out.print(" ");
                    out.print(grid[i][j] >= d ? "X" : ".");
                }
                out.println();
            }
            out.println();
        }

        input.close();
       // out.close();
    }
}
