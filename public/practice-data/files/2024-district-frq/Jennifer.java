/*
 * UIL Computer Science 2024
 * District Packet Solution
 */

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.StringTokenizer;

public class Jennifer {
	public static void main(String[] args) throws IOException {
		new Jennifer().run();
	}

	public void run() throws IOException {
		BufferedReader file = new BufferedReader(new FileReader("jennifer.dat"));
		PrintWriter out = new PrintWriter(System.out);

		int numTimes = Integer.parseInt(file.readLine());
		while(numTimes-->0) {
			StringTokenizer st = new StringTokenizer(file.readLine());
			int d = Integer.parseInt(st.nextToken());
			int n = Integer.parseInt(st.nextToken());
			int gcd = gcd(n, d);
			n /= gcd;
			d /= gcd;
			n -= d;
			out.printf("%d %d\n", n, d);
		}
		
		file.close();
		out.close();
	}

	public int gcd(int a, int b) {
		if(b == 0) {
			return a;
		}
		return gcd(b, a % b);
	}
}
