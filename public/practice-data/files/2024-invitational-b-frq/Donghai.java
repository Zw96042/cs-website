/*
 * UIL Computer Science 2024
 * Invitational B Packet Solution
 */

import java.io.*;
import java.util.*;

public class Donghai {

	public static void main(String[] args) throws FileNotFoundException {

		Scanner data = new Scanner(new File("donghai.dat"));
		int N = data.nextInt();
		data.nextLine();  // dispose of newline
		for (int n = 1; n <= N; n++) {
			String p = data.nextLine().toUpperCase();
			int [] counts = new int[26];
			for (int i = 0; i < p.length(); i++) {
				char c = p.charAt(i);
				if (Character.isLetter(c)) counts[c - 'A']++;
			}
			for (int i = 0; i < 26; i++)
				if (counts[i] > 0)
					System.out.println((char)('A' + i) + ":" + counts[i]);
			System.out.println("==========");
		}
	}
}
