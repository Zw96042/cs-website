import java.io.*;
import java.util.*;
import java.util.regex.*;

public class Prateek2 {
    public static void main(String[] args) throws IOException {
        (new Prateek2()).run();
    }

    public void run() throws IOException {
        Scanner scan = new Scanner(new File("prateek.dat"));
        int T = scan.nextInt();

        assert 1 <= T && T <= 30;

        for (int testId = 1; testId <= T; testId++) {
            int ans = solve(scan);
            System.out.printf("Case #%d: %d%n", testId, ans);
        }
    }

    public int solve(Scanner scan) throws IOException {
        int n = scan.nextInt();
        int a = scan.nextInt();
        int b = scan.nextInt();
        int d = scan.nextInt();

        assert 1 <= n && n <= 100;
        assert 0 <= a && a <= 1000;
        assert 0 <= b && b <= 1000;
        assert 0 <= d && d <= 1000;

        String[] words = new String[n];
        int[][] dist = new int[n][n];
        for (int i = 0; i < n; i++) {
            words[i] = scan.next();
            assert Pattern.matches("^[a-z]{1,20}$", words[i]);
        }
        {
            Set<String> wordSet = new HashSet<>();
            for (String word : words) {
                wordSet.add(word);
            }

            System.err.printf("%d unique words", wordSet.size());
        }

        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                dist[i][j] = Math.min(b + d * levenDist(words[i], words[j]), a);
            }
        }

        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                assert dist[i][j] == dist[j][i];
            }

            assert dist[i][i] == Math.min(b, a);
        }

        int[] curDist = Arrays.copyOf(dist[0], n);
        boolean[] used = new boolean[n];
        used[0] = true;

        int ans = a;
        // Prim's algorithm, O(n^2) version
        for (int iter = 0; iter < n - 1; iter++) {
            // find the minimum cost to an unvisited node
            int closest = -1;
            for (int u = 0; u < n; u++) {
                if (!used[u] && (closest == -1 || curDist[u] < curDist[closest])) {
                    closest = u;
                }
            }

            assert closest != -1;
            used[closest] = true;

            ans += curDist[closest];
            for (int u = 0; u < n; u++) {
                curDist[u] = Math.min(curDist[u], dist[closest][u]);
            }
        }

        return ans;
    }

    public int levenDist(String a, String b) {
        int n = a.length();
        int m = b.length();

        // dp[i][j] = min cost to make first i chars of a match first j chars of b
        int[][] dp = new int[n + 1][m + 1];
        for (int[] row : dp) {
            Arrays.fill(row, Integer.MAX_VALUE);
        }

        dp[0][0] = 0;
        for (int i = 0; i <= n; i++) {
            for (int j = 0; j <= m; j++) {
                if (i < n && j < m) {
                    int cost = a.charAt(i) == b.charAt(j) ? 0 : 1;
                    dp[i + 1][j + 1] = Math.min(dp[i + 1][j + 1], cost + dp[i][j]);
                }

                if (i < n) {
                    dp[i + 1][j] = Math.min(dp[i + 1][j], 1 + dp[i][j]);
                }
                if (j < m) {
                    dp[i][j + 1] = Math.min(dp[i][j + 1], 1 + dp[i][j]);
                }
            }
        }

        return dp[n][m];
    }
}
