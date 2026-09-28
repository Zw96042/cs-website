/*
 * UIL Computer Science 2022
 * State Packet Solution
 */

import java.util.Scanner;
import java.io.File;
import java.io.FileNotFoundException;

public class Michelle {

	public static void main(String[] args) throws FileNotFoundException {
		Scanner data = new Scanner(new File("michelle.dat"));
		int T = data.nextInt();
		data.nextLine();  // discard newline
		for (int t = 1; t <= T; t++) {
			System.out.printf("Test case #%d\n", t);
			String [] input = data.nextLine().split(" ");
			int [] binwidth = new int[input.length + 1];
			int [] bins = new int[input.length + 1];
			for (int i = 0; i < binwidth.length - 1; i++)
				binwidth[i] = Integer.parseInt(input[i]);
			binwidth[binwidth.length - 1] = 50;
			boolean notdone = true;
			int wordcount = 0;
			do {
				String line = data.nextLine();
				if (line.length() == 1 && line.charAt(0) == '#') notdone = false;
				else {
					String [] words = line.split(" ");
					for (int w = 0; w < words.length; w++) {
						int n = 0;
						while (binwidth[n] < words[w].length()) n++;
						bins[n]++;
						wordcount++;
					}
				}
			} while (notdone);
			float histpct = (float)bins[0] * 100 / wordcount;
			System.out.printf("01:%02d -> %-5.0f ", binwidth[0], histpct);
			String bar = "";
			for (int i = 1; i <= histpct + 0.5f; i++) bar += "x";
			System.out.println(bar);
			for (int n = 1; n < bins.length; n++) {
				histpct = (float)bins[n] * 100 / wordcount;
				System.out.printf("%02d:%02d -> %-5.0f ", binwidth[n-1]+1, binwidth[n], histpct); //bins[n]);
				bar = "";
				for (int i = 1; i <= histpct + 0.5f; i++) bar += "x";
				System.out.println(bar);
			}
			System.out.println("===============");
		}
		data.close();
	}
}
