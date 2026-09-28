/*
 * UIL Computer Science 2024
 * Invitational B Packet Solution
 */

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.StringTokenizer;

public class Ksenia {
	public static void main(String[] args) throws IOException {
		new Ksenia().run();
	}

	public void run() throws IOException {
		BufferedReader file = new BufferedReader(new FileReader("ksenia.dat"));
		PrintWriter out = new PrintWriter(System.out);
		int numTimes = Integer.parseInt(file.readLine());
		while(numTimes-->0) {
			StringTokenizer st = new StringTokenizer(file.readLine());
			long V = Integer.parseInt(st.nextToken());
			long E = Integer.parseInt(st.nextToken());

			// The edges themselves aren't actually important!!! 
			if(E != 0) {
				file.readLine();
			}

			int m = Integer.parseInt(file.readLine());

			// Perform m duplicates
			for(int i = 0; i < m; i++) {
				// Number of edges doubles and increased by V each time
				E = (2 * E) + V;
				// Number of vertices doubles each time
				V *= 2;
			}

			out.printf("%d %d\n", V, E);
		}

		file.close();
		out.close();
	}
}
