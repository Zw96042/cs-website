/*
 * UIL Computer Science 2024
 * Region Packet Solution
 */

import java.io.*;
import java.util.*;

public class Harmony {

	public static void main(String[] args) throws FileNotFoundException {
		Scanner data = new Scanner(new File("harmony.dat"));
		String letters = data.nextLine();
		String specials = data.nextLine();
		ArrayList<String> passwords = new ArrayList<String>();
		for (int i = 1; i <= 10; i++) {
			String [] words = data.nextLine().split(",");
			for (int j = 0; j < 10; j++)
				passwords.add(words[j]);
		}
		while (data.hasNext()) {
			String pw = data.next();
			String rating = "UNACCEPTABLE";
			int score = 0;
			if (pw.length() >= 8 && passwords.indexOf(pw) == -1) {
				int count = pw.length();
				int cats = 0;
				int bonus = 0;
				int penalty = 0;
				boolean lcase = false;
				boolean ucase = false;
				boolean digit = false;
				boolean spec = false;
				char prevcat = '?';   // U (upper), L (lower), D (digit), or S (special)
				char prevchar = ' ';  // never found in a password
				for (int i = 0; i < count; i++) {
					char c = pw.charAt(i);
					if (Character.isLowerCase(c)) {
						if (!lcase) { lcase = true; cats++; }
						score += letters.indexOf(Character.toUpperCase(pw.charAt(i))) < 13 ? 1: 3;
						bonus += i > 0 && prevcat != 'L' ? 3 : 0;
						prevcat = 'L';
					} else if (Character.isUpperCase(c)) {
						if (!ucase) { ucase = true; cats++; }
						score += letters.indexOf(pw.charAt(i)) < 13 ? 1: 3;
						bonus += i > 0 && prevcat != 'U' ? 3 : 0;
						prevcat = 'U';
					} else if (Character.isDigit(c)) {
						if (!digit) { digit = true; cats++; }
						score += 3;
						bonus += i > 0 && prevcat != 'D' ? 3 : 0;
						prevcat = 'D';
					} else if (specials.indexOf(pw.charAt(i)) != -1) {  // must be non-alphanumeric
						if (!spec) { spec = true; cats++; }
						score += 5;
						bonus += i > 0 && prevcat != 'S' ? 3 : 0;
						prevcat = 'S';
					} else { // illegal char encountered
						System.out.println("ILLEGAL CHAR encountered in data!!");
					}
					if (c == prevchar) penalty += 2;
					prevchar = c;
				}
				if (cats < 3) {
					score = bonus = penalty = 0;
				}
				else {
					if (cats == 4) bonus += 5;
					if (count > 10) bonus += (count - 10) * 3;
				}
//				System.out.println(" -> " + pw + "=" + score + "+" + bonus + "-" + penalty);
				score += bonus;
				score -= penalty;
				if (score <= 0) rating = "UNACCEPTABLE";
				else if (score <= 20) rating = "WEAK";
				else if (score <= 35) rating = "FAIR";
				else if (score <= 50) rating = "GOOD";
				else rating = "STRONG";
			}
			System.out.println(pw + ":" + score + ":" + rating);
		}
		data.close();
	}
}
