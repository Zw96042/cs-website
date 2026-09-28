import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileReader;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;

public class Verso {
    public static void main(String[] args) throws IOException {
        new Verso().run();
    }

    private void run() throws IOException {
        BufferedReader file = new BufferedReader(new FileReader("verso.dat"));
        PrintWriter out = new PrintWriter(new BufferedWriter(new OutputStreamWriter(System.out)));

        solve(file, out);

        file.close();
        out.close();
    }

    public void solve(BufferedReader file, PrintWriter out) throws IOException {
        int T = Integer.parseInt(file.readLine());
        while (T-- > 0) {
            String s = file.readLine().trim();
            out.println(minPartitionCost(s));
        }
    }

    private int minPartitionCost(String s) {
        int n = s.length();

        // Precompute palindromes: isPal[i][j] = true if s[i..j] is a palindrome
        boolean[][] isPal = new boolean[n][n];
        // Single characters are palindromes
        for (int i = 0; i < n; i++) {
            isPal[i][i] = true;
        }
        // Check all substrings of length 2 and more
        for (int len = 2; len <= n; len++) {
            for (int i = 0; i <= n - len; i++) {
                int j = i + len - 1;
                if (len == 2) {
                    isPal[i][j] = (s.charAt(i) == s.charAt(j));
                } else {
                    isPal[i][j] = (s.charAt(i) == s.charAt(j)) && isPal[i + 1][j - 1];
                }
            }
        }

        // dp[i] = minimum cost to partition s[0..i-1]
        int[] dp = new int[n + 1];
        dp[0] = 0;

        // For each position, try all possible last palindromes
        for (int i = 1; i <= n; i++) {
            dp[i] = Integer.MAX_VALUE;

            // Try all possible starting positions for the last palindrome
            for (int j = 0; j < i; j++) {
                // Check if s[j..i-1] is a palindrome
                if (isPal[j][i - 1]) {
                    // Cost to partition up to j, plus cost of split at j
                    int cost = dp[j] + (j > 0 ? j : 0);
                    dp[i] = Math.min(dp[i], cost);
                }
            }
        }

        return dp[n];
    }
}
