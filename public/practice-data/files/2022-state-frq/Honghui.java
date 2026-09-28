/*
 * UIL Computer Science 2022
 * State Packet Solution
 */

import java.io.*;
import java.util.*;

public class Honghui {
    public static void main(String[] args) throws IOException {
        (new Honghui()).run();
    }

    public void run() throws IOException {
        Scanner scan = new Scanner(new File("honghui.dat"));
        int T = scan.nextInt();

        assert 1 <= T && T <= 50;

        for (int testId = 1; testId <= T; testId++) {
            int ans = solve(scan);
            System.out.printf("Case #%d: %d%n", testId, ans);
        }
    }

    public int solve(Scanner scan) throws IOException {
        int n = scan.nextInt();
        assert 1 <= n && n <= 400;

        String s = scan.next();
        int[] colors = new int[n];
        for (int i = 0; i < n; i++) {
            colors[i] = scan.nextInt();
        }

        int[] efforts = new int[n];
        for (int i = 0; i < n; i++) {
            efforts[i] = scan.nextInt();
        }

        // min cost to service [l, r)
        int[][] dp = new int[n + 1][n + 1];
        for (int[] row : dp) {
            Arrays.fill(row, Integer.MAX_VALUE);
        }

        for (int i = 0; i <= n; ++i) {
            dp[i][i] = 0;
        }

        for (int windowSize = 1; windowSize <= n; windowSize++) {
            for (int start = 0; start + windowSize <= n; start++) {
                int end = start + windowSize;
                dp[start][end] = efforts[start] + dp[start + 1][end];

                for (int k = start + 1; k < end; k++) {
                    if (s.charAt(start) == '(' && s.charAt(k) == ')' && colors[start] == colors[k]) {
                        dp[start][end] = Math.min(dp[start][end], dp[start + 1][k] + dp[k + 1][end]);
                    }
                }
            }
        }

        return dp[0][n];
    }
}
