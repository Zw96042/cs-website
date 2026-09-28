/*
 * UIL Computer Science 2023
 * Region Packet Solution
 */

import java.io.*;
import java.util.*;

public class Fernando {

	public static void main(String[] args) throws IOException {
		Scanner Sc = new Scanner(new File("fernando.dat"));
		int N = Sc.nextInt();
		for (int i = 1; i <= N; i++) {
			int A = Sc.nextInt();
			int B = Sc.nextInt();
			int Count = 0;
			for (int x = 1; x <= A; x++)
				if (A % x == 0) {
					String BB = "" + B;
					String XX = "" + x;
					if (!XX.contains(BB)) {
						Count++;
						System.out.print(x + " ");
					}
				}
			if (Count == 0)
				System.out.print("NONE");
			System.out.println();
		}
	}
}
