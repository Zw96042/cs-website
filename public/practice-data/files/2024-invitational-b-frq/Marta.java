/*
 * UIL Computer Science 2024
 * Invitational B Packet Solution
 */

import java.io.*;
import java.util.*;

public class Marta {

	public static void main(String[] args) throws FileNotFoundException {

		Scanner data = new Scanner(new File("marta.dat"));
		int T = data.nextInt();
		for (int t = 1; t <= T; t++) {
			int N = data.nextInt();
			int P = data.nextInt();
			int [] nbrs = new int[N];
			for (int i = 0; i < N; i++) nbrs[i] = data.nextInt();
			System.out.printf("Test case %d pass %d:", t, bubsort(nbrs, P));
			for (int i = 0; i < N; i++) System.out.print(" " + nbrs[i]);
			System.out.println();
		}
	}
	
	static int bubsort(int [] numbers, int p) {
		int pass = 0;
		int end = numbers.length - 1;
		boolean flag = true;
		while (flag) {
			flag = false;
			pass++;
			for (int i = 0; i < end; i++) {
				if (numbers[i] > numbers[i+1]) {
					int temp = numbers[i+1];
					numbers[i+1] = numbers[i];
					numbers[i] = temp;
					flag = true;
				}
			}
			if (pass == p) return pass;
			end--;
		}
		return pass;
	}
}
