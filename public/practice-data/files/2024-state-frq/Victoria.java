/*
 * UIL Computer Science 2024
 * State Packet Solution
 */

import static java.lang.System.*;
import java.io.*;
import java.util.*;

public class Victoria {

	public static void main(String[] args) throws FileNotFoundException {
		Scanner data = new Scanner(new File("victoria.dat"));
		while (data.hasNext()) {
			String pp = data.nextLine();
			HashSet<String> words = new HashSet<String>();
			int score = 0;
			String rating = null;
			String [] templist = pp.split(" ");
			ArrayList<String> list = new ArrayList<String>();
			// clear list of empty strings
			for (int i = 0; i < templist.length; i++)
				if (templist[i].length() > 0) list.add(templist[i]);
			for (String s: list)
				if (s.length() >= 4)
					words.add(s);
			if (words.size() >= 4 && pp.length() >= 20) {
				score = 100;
				int count = list.size() - 4;
				score += count * 10;
				int speccount = 0, digitcount = 0, alluppercount = 0;
				int lettercount = 0, uppercount = 0, lowercount = 0;
				for (String w: list) {
					if (checkSpecials(w)) speccount++;
					if (checkDigits(w)) digitcount++;
					if (checkAllUpper(w)) alluppercount++;
					if (checkLetter(w)) lettercount++;
					if (checkUpper(w)) uppercount++;
					if (checkLower(w)) lowercount++;
				}
				score += speccount * 5;
				score += digitcount * 5;
				if (alluppercount * 2 >= list.size()) alluppercount = 0;
				score += alluppercount * 10;
				if (lettercount >= 2 && (uppercount == 0 || lowercount == 0))
					score -= 10;
				count = checkMatches(list);
				score -= count * 20;
				count = checkPrefix(list);
				score -= count * 10;
				count = checkSuffix(list);
				score -= count * 10;
			}
			if (score >= 150) rating = "Excellent";
			else if (score >= 125) rating = "Strong";
			else if (score >= 100) rating = "Adequate";
			else if (score >= 75) rating = "Weak";
			else if (score >= 50) rating = "Poor";
			else rating = "Unacceptable";
			out.println(score + ":" + rating);
		}
		data.close();
	}
	
	static boolean checkSpecials(String word) {
		boolean flag = false;
		for (int i = 0; i < word.length() && !flag; i++)
			flag = !Character.isLetter(word.charAt(i)) && !Character.isDigit(word.charAt(i));
		return flag;
	}
	
	static boolean checkDigits(String word) {
		boolean flag = false;
		for (int i = 0; i < word.length() && !flag; i++)
			flag = Character.isDigit(word.charAt(i));
		return flag;
	}

	static boolean checkAllUpper(String word) {
		int lettercount = 0, uppercount = 0;
		for (int i = 0; i < word.length(); i++) {
			if (Character.isLetter(word.charAt(i))) lettercount++;
			if (Character.isUpperCase(word.charAt(i))) uppercount++;
		}
		return (uppercount > 0 && uppercount == lettercount);
	}

	static boolean checkLetter(String word) {
		boolean flag = false;
		for (int i = 0; i < word.length() && !flag; i++)
			flag = Character.isLetter(word.charAt(i));
		return flag;
	}

	static boolean checkUpper(String word) {
		boolean flag = false;
		for (int i = 0; i < word.length() && !flag; i++)
			flag = Character.isUpperCase(word.charAt(i));
		return flag;
	}

	static boolean checkLower(String word) {
		boolean flag = false;
		for (int i = 0; i < word.length() && !flag; i++)
			flag = Character.isLowerCase(word.charAt(i));
		return flag;
	}

	static int checkMatches(ArrayList<String> list) {
		int count = 0;
		for (int i = 0; i < list.size() - 1; i++) {
			for (int j = i+1; j < list.size(); j++) {
				if (list.get(i).compareTo(list.get(j)) == 0) count++;
			}
		}
		return count;
	}
	
	static int checkPrefix(ArrayList<String> list) {
		int count = 0;
		for (int i = 0; i < list.size(); i++)
			for (int j = 0; j < list.size(); j++)
				if (list.get(i).length() >= 3 
					&& list.get(j).length() != list.get(i).length()
					&& list.get(j).indexOf(list.get(i)) == 0) count++;
		return count;
	}

	static int checkSuffix(ArrayList<String> list) {
		int count = 0;
		for (int i = 0; i < list.size(); i++)
			for (int j = 0; j < list.size(); j++)
				if (list.get(i).length() >= 3 
						&& list.get(j).length() != list.get(i).length()
						&& list.get(j).lastIndexOf(list.get(i)) != -1 
						&& list.get(j).lastIndexOf(list.get(i)) == list.get(j).length() - list.get(i).length())	
					count++;
		return count;
	}
}
