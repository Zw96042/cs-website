/*
 * UIL Computer Science 2024
 * State Packet Solution
 */

import static java.lang.System.*;
import java.io.*;
import java.util.*;

public class Jason {

	public static void main(String[] args) throws FileNotFoundException {
		Scanner data = new Scanner(new File("jason.dat"));
		int sets = data.nextInt();
		for (int s = 1; s <= sets; s++) {
			int r1 = data.nextInt();
			int c1 = data.nextInt();
			int r2 = data.nextInt();
			int c2 = data.nextInt();
			int i, j, k, sum;
			
			if (c1 != r2) {
				out.println(s + ":MATRIX SIZES NOT COMPATIBLE");
				data.nextLine();  //newline after sizes
				for (i = 0; i < r1 + r2; i++)
					data.nextLine();  //discard whole row
			} else {
				out.printf("%d:%dx%d\n", s, r1, c2);
				int [][] ma = new int[r1][c1];
				int [][] mb = new int[r2][c2];
				for (i = 0; i < r1; i++)
					for (j = 0; j < c1; j++)
						ma[i][j] = data.nextInt(); 
				for (i = 0; i < r2; i++)
					for (j = 0; j < c2; j++)
						mb[i][j] = data.nextInt(); 
				for (i = 0; i < r1; i++) {
					for (j = 0; j < c2; j++) {
						sum = 0;
						for (k = 0; k < c1; k++)
							sum += ma[i][k] * mb[k][j];
						out.printf("%7d", sum);
					}
					out.println();
				}
			}
			out.println("^^^^^^^^^^^^^^^");
		}
		data.close();
	}
}
