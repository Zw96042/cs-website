/*
 * UIL Computer Science 2023
 * Region Packet Solution
 */

import java.io.*;
import java.util.*;

public class Javier {

	public static void main(String[] args) throws IOException {
		Scanner Sc = new Scanner(new File("javier.dat"));
		int N = Sc.nextInt();
		for (int i = 1; i <= N; i++) {
			int Space = 0;
			int Base1 = Sc.nextInt();
			int Base2 = Sc.nextInt();
			String Thing = Sc.next();
			String Side = Sc.next();
			if (Side.equals("L")) {
				if (Base1 < Base2)
					for (int x = Base1; x <= Base2; x++) {
						for (int y = 1; y <= x; y++)
							System.out.print(Thing);
						System.out.println("");
					}
				else
					for (int x = Base1; x >= Base2; x--) {
						for (int y = 1; y <= x; y++)
							System.out.print(Thing);
						System.out.println("");
					}
			} else {
				if (Base1 < Base2) {
					Space = Base2 - Base1;
					for (int x = Base1; x <= Base2; x++) {
						for (int z = 1; z <= Space; z++)
							System.out.print(" ");
						Space--;
						for (int y = 1; y <= x; y++)
							System.out.print(Thing);
						System.out.println("");
					}
				} else {
					for (int x = Base1; x >= Base2; x--) {
						for (int z = 1; z <= Space; z++)
							System.out.print(" ");
						Space++;
						for (int y = 1; y <= x; y++)
							System.out.print(Thing);
						System.out.println("");
					}
				}
			}
		}
	}
}
