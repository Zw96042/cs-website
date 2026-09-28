/*
 * UIL Computer Science 2023
 * Invitational A Packet Solution
 */

import java.io.*;
import java.util.*;

public class Sunny {

	public static void main(String[] args) throws FileNotFoundException {
		Scanner data = new Scanner(new File("sunny.dat"));
		ArrayList<String> courses = new ArrayList<String>();
		while (data.hasNext()) {
			String line = data.nextLine();
			courses.add(line.substring(10) + " (" + line.substring(0,9) + ")");
		}
		courses.sort(null);
		while (!courses.isEmpty())
			System.out.println(courses.remove(0));
	}
}
