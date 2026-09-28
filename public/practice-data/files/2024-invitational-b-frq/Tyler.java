/*
 * UIL Computer Science 2024
 * Invitational B Packet Solution
 */

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Arrays;
import java.util.StringTokenizer;

public class Tyler {
	public static void main(String[] args) throws IOException {
		new Tyler().run();
	}
	
	public void run() throws IOException {
		BufferedReader file = new BufferedReader(new FileReader("tyler.dat"));
		PrintWriter out = new PrintWriter(System.out);
		StringTokenizer st = new StringTokenizer(file.readLine());
		int n = Integer.parseInt(st.nextToken());
		int m = Integer.parseInt(st.nextToken());
		
		int[] multipliers = Arrays.stream(file.readLine().split(" ")).map(str -> Integer.parseInt(str)).mapToInt(Integer::intValue).toArray();
		int[] targets = Arrays.stream(file.readLine().split(" ")).map(str -> Integer.parseInt(str)).mapToInt(Integer::intValue).toArray();
		file.close();
		
		int max = Integer.MIN_VALUE;
		for(int t : targets) {
			max = t > max ? t : max;
		}
		
		boolean[] possible = new boolean[max+1];
		possible[1] = true;
		for(int i = 1; i <= max; i++) {
			if(!possible[i]) {
				continue;
			}
			
			for(int j = 0; j < n; j++) {
				int newTarget = i * multipliers[j];
				if(1 < newTarget && newTarget <= max) {
					possible[newTarget] = true;
				}
			}
		}
		
		for(int i = 0; i < m; i++) {
			out.printf("Target %d: %s\n", targets[i], possible[targets[i]] ? "YES" : "NO");
		}
		out.close();
	}
}
