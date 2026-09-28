/*
 * UIL Computer Science 2024
 * State Packet Solution
 */

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.io.PrintWriter;

public class Ben {
	public static void main(String[] args) throws IOException {
		new Ben().run();
	}

	public final String PIDGEON = "pidgeon";
	public final int MOD = 1_000_000_007;

	public void run() throws IOException {
		BufferedReader file = new BufferedReader(new FileReader("ben.dat"));
		PrintWriter out = new PrintWriter(System.out);

		int numTimes = Integer.parseInt(file.readLine());
		while(numTimes-->0) {
			String line = file.readLine();
			out.println(numWays(line, PIDGEON));
		}

		file.close();
		out.close();
	}

	public int numWays(String str, String target) {
		int m = str.length(), n = target.length();
		int[] dp = new int[n];

		for(int i = 0; i < m; i++) {
			for(int j = n - 1; j >= 0; j--) {
				if(str.charAt(i) == target.charAt(j)) {
					dp[j] += (j == 0 ? 1 : dp[j - 1]) % MOD;
					dp[j] %= MOD;
				}
			}
		}

		return dp[n-1] % MOD;
	}
}
