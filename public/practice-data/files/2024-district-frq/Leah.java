/*
 * UIL Computer Science 2024
 * District Packet Solution
 */

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;

public class Leah {
	public static void main(String[] args) throws IOException {
		new Leah().run();
	}

	public final int MAX_W = 8;

	public void run() throws IOException {
		BufferedReader file = new BufferedReader(new FileReader("leah.dat"));
		PrintWriter out = new PrintWriter(System.out);

		// Given that the Gray Code ordering overlaps with different widths,
		// simply produce the largest width required...
		ArrayList<Integer> grayCodes = new ArrayList<Integer>();
		grayCodesIterativeBitwise(grayCodes, MAX_W);

		int numTimes = Integer.parseInt(file.readLine());
		while(numTimes-->0) {
			int w = Integer.parseInt(file.readLine());
			// ..., then just output the relevant section for the current width
			int lastIndex = (int) Math.pow(2, w);
			out.println(grayCodes.subList(0, lastIndex).toString().replaceAll("[\\[\\],]", ""));
		}

		file.close();
		out.close();
	}

	public void grayCodesIterativeBitwise(ArrayList<Integer> grayCodes, int n) {
		for (int i = 0; i < (1 << n); i++) {
			// Note, it can be shown that the nth Gray Code is equivalent to (n XOR floor(n/2))
			grayCodes.add((i ^ (i >> 1)));
		}
	}
}
