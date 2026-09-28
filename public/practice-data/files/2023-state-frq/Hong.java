/*
 * UIL Computer Science 2023
 * State Packet Solution
 */

import java.io.*;
import java.util.*;

public class Hong {

	public static void main(String[] args) throws FileNotFoundException {

		Scanner data = new Scanner(new File("hong.dat"));
		while (data.hasNext()) {
			int nbr = data.nextInt();
			StringBuilder roman = new StringBuilder();
			System.out.printf("%d -> ", nbr);
			while (nbr >= 1000) {
				roman.append("M");
				nbr -= 1000;
			}
			if (nbr >= 900) {
				roman.append("CM");
				nbr -= 900;
			}
			else if (nbr >= 500) {
				roman.append("D");
				nbr -= 500;
			}
			else if (nbr >= 400) {
				roman.append("CD");
				nbr -= 400;
			}
			while (nbr >= 100) {
				roman.append("C");
				nbr -= 100;
			}
			if (nbr >= 90) {
				roman.append("XC");
				nbr -= 90;
			}
			else if (nbr >= 50) {
				roman.append("L");
				nbr -= 50;
			}
			else if (nbr >= 40) {
				roman.append("XL");
				nbr -= 40;
			}
			while (nbr >= 10) {
				roman.append("X");
				nbr -= 10;
			}
			if (nbr >= 9) {
				roman.append("IX");
				nbr -= 9;
			}
			else if (nbr >= 5) {
				roman.append("V");
				nbr -= 5;
			}
			else if (nbr >= 4) {
				roman.append("IV");
				nbr -= 4;
			}
			while (nbr >= 1) {
				roman.append("I");
				nbr -= 1;
			}
			System.out.println(roman);
		}
		data.close();
	}
}