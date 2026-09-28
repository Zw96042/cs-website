/*
 * UIL Computer Science 2024
 * State Packet Solution
 */

import java.io.*;
import java.util.*;
public class Rufus {
	public static void main(String[]args)throws Exception{
		new Rufus().run();
	}
	public void run()throws Exception{
		Scanner file=new Scanner(new File("rufus.dat"));
		int s = file.nextInt(), q = file.nextInt();
		file.nextLine();
		while(q-- > 0) {
			String answer = file.nextLine().trim();
			double total = 0;
			for(int y = 0; y < s; y++) {
				String stud = file.nextLine().trim();
				int score = answer.length() - ed(stud.toLowerCase(), answer.toLowerCase());
				total += score;
			}
			total /= (double)s;
			System.out.printf("%s Quiz Average: %.2f%n", answer, total);
		}
	}

	public int ed(String str1, String str2) {
		int m = str1.length();
		int n = str2.length();
		int[] curr = new int[n + 1];
		for (int j = 0; j <= n; j++) 
			curr[j] = j;
		int previous;
		for (int i = 1; i <= m; i++) {
			previous = curr[0];
			curr[0] = i;
			for (int j = 1; j <= n; j++) {
				int temp = curr[j];
				if (str1.charAt(i - 1) == str2.charAt(j - 1)) 
					curr[j] = previous;
				else 
					curr[j] = 1 + Math.min(Math.min(previous, curr[j - 1]), curr[j]);
				previous = temp;
			}
		}
		return curr[n];
	}
}
