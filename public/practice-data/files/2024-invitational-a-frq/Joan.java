/*
 * UIL Computer Science 2024
 * Invitational A Packet Solution
 */

import java.io.*;
import java.util.*;

public class Joan {

	public static void main(String[] args) throws FileNotFoundException {

		Scanner data = new Scanner(new File("joan.dat"));
		int words = 0, letters = 0;
		while (data.hasNext()) {
			String word = data.next();
			letters += word.length();
			words++;
		}
		System.out.printf("%d words with an average length of %1.0f letters\n", words, (float)letters/words);
	}
}
