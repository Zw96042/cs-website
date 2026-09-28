import java.io.*;
import java.util.*;
import java.util.regex.*;

public class Tomek {
    public static void main(String[] args) throws IOException {
        (new Tomek()).run();
    }

    public void run() throws IOException {
        Scanner scan = new Scanner(new File("tomek.dat"));
        int T = scan.nextInt();

        assert 1 <= T && T <= 20;

        for (int testId = 1; testId <= T; testId++) {
            List<Integer> ans = solve(scan);
            System.out.printf("Case #%d: %d%n", testId, ans.size());
            for (int i = 0; i < ans.size(); i++) {
                if (i > 0) {
                    System.out.print(" ");
                }
                System.out.print(ans.get(i));
            }
            if (ans.isEmpty()) {
                System.out.print("NONE");
            }
            System.out.println();
        }
    }

    public List<Integer> solve(Scanner scan) throws IOException {
        int r = scan.nextInt();
        int c = scan.nextInt();

        assert 3 <= r && r <= 100;
        assert 3 <= c && c <= 100;

        char[][] grid = new char[r][];
        for (int i = 0; i < r; i++) {
            grid[i] = scan.next().toCharArray();

            // Check validity
            for (int j = 0; j < c; j++) {
                assert grid[i][j] == '.' || grid[i][j] == 'W';
            }
        }

        // DFS from the borders
        boolean[][] vis = new boolean[r][c];

        for (int i = 0; i < r; i++) {
            if (grid[i][0] == '.' && !vis[i][0]) {
                dfs(grid, vis, i, 0);
            }

            if (grid[i][c - 1] == '.' && !vis[i][c - 1]) {
                dfs(grid, vis, i, c - 1);
            }
        }

        for (int j = 0; j < c; j++) {
            if (grid[0][j] == '.' && !vis[0][j]) {
                dfs(grid, vis, 0, j);
            }

            if (grid[r - 1][j] == '.' && !vis[r - 1][j]) {
                dfs(grid, vis, r - 1, j);
            }
        }

        boolean didFindLake = false;
        List<Integer> islands = new ArrayList<>();
        for (int i = 1; i + 1 < r; i++) {
            for (int j = 1; j + 1 < c; j++) {
                if (grid[i][j] == 'W') {
                    if (!vis[i][j]) {
                        assert !didFindLake;
                        didFindLake = true;
                        dfs(grid, vis, i, j);
                    } else {
                        assert didFindLake;
                    }
                } else {
                    if (!vis[i][j]) {
                        islands.add(dfs(grid, vis, i, j));
                    }
                }
            }
        }

        Collections.sort(islands);
        Collections.reverse(islands);

        return islands;
    }

    boolean inBounds(char[][] grid, int i, int j) {
        return !(i < 0 || i >= grid.length || j < 0 || j >= grid[i].length);
    }

    static final int[] dr = {1, 0, -1, 0};
    static final int[] dc = {0, -1, 0, 1};
    int dfs(char[][] grid, boolean[][] vis, int i, int j) {
        assert inBounds(grid, i, j);
        if (vis[i][j]) {
            return 0;
        }

        vis[i][j] = true;
        int ans = 1;
        for (int d = 0; d < 4; d++) {
            int ni = i + dr[d];
            int nj = j + dc[d];
            if (inBounds(grid, ni, nj) && grid[ni][nj] == grid[i][j]) {
                ans += dfs(grid, vis, ni, nj);
            }
        }

        return ans;
    }
}
