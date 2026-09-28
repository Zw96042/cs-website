/*
 * UIL Computer Science 2024
 * Invitational A Packet Solution
 */

import java.io.*;
import java.util.*;

public class Patryk {

	public static void main(String[] args) throws FileNotFoundException {

		Scanner data = new Scanner(new File("patryk_student.dat"));
		int N = data.nextInt();
		String [] sortnbrs = new String[N];
		for (int n = 0; n < N; n++) {
			String nbr = data.next();
			sortnbrs[n] = nbr.substring(4,5) + nbr.substring(3,4) + nbr.substring(2,3) + nbr.substring(1,2) + nbr.substring(0,1) + " " + nbr;
			//System.out.println(sortnbrs[n]);
		}
		Arrays.sort(sortnbrs);
		for (int n = 0; n < N; n++) {
			System.out.println(sortnbrs[n].substring(6));
		}
	}
}
