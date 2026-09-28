/*
 * UIL Computer Science 2024
 * State Packet Solution
 */

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Arrays;
import java.util.StringTokenizer;

public class Max {
	public static void main(String[] args) throws IOException {
		new Max().run();
	}

	public void run() throws IOException {
		BufferedReader file = new BufferedReader(new FileReader("max.dat"));
		PrintWriter out = new PrintWriter(System.out);

		int numTimes = Integer.parseInt(file.readLine());
		while(numTimes-->0) {
			StringTokenizer st = new StringTokenizer(file.readLine());
			int m = Integer.parseInt(st.nextToken());
			int T = Integer.parseInt(st.nextToken());
			int[] t = Arrays.asList(file.readLine().split(" ")).stream().map(str -> Integer.parseInt(str)).mapToInt(Integer::intValue).toArray();
			double[] v = Arrays.asList(file.readLine().split(" ")).stream().map(str -> Double.parseDouble(str)).mapToDouble(Double::doubleValue).toArray();

			double[] dp = new double[T+1];

			for(int i = 0; i <= T; i++) {
				for(int j = 0; j < m; j++) {
					if(t[j] <= i) {
						dp[i] = Math.max(dp[i], dp[i-t[j]] + v[j]);
					} 
				}
			}

			out.println(dp[T] == 0 ? "Should have picked better games..." : String.format("%.2f", dp[T]));
		}

		file.close();
		out.close();
	}
}
