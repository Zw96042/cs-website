/*
 * UIL Computer Science 2024
 * State Packet Solution
 */

import java.io.*;
import java.util.*;

public class Dilbert {

	public static void main(String[] args) throws FileNotFoundException {
		Scanner data = new Scanner(new File("dilbert.dat"));
		int t = 0;
		while (data.hasNext()) {
			long n = data.nextLong();
			StringBuilder bits = new StringBuilder(Long.toBinaryString(n));
			bits.reverse();
			while (bits.charAt(0) == '0') bits.deleteCharAt(0);
			System.out.printf("Test Case: %d: %d %s\n", ++t, Long.parseLong(bits.toString(),2), bits);
		}
		data.close();
	}
}
