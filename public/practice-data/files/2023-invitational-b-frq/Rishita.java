/*
 * UIL Computer Science 2023
 * Invitational B Packet Solution
 */

import java.io.*;
import java.util.*;

public class Rishita {

	public static void main(String[] args) throws FileNotFoundException {
		Scanner data = new Scanner(new File("rishita.dat"));
		ArrayList<Course> list = new ArrayList<Course>();
		while (data.hasNext()) {
			String [] coursedata = data.nextLine().split(",");
			Course cdata = new Course(coursedata[0], coursedata[1], coursedata[2]);
			list.add(cdata);
		}
		list.sort(null);
		String prev_school = "";
		while (!list.isEmpty()) {
			Course dataitem = list.remove(0);
			if (dataitem.school.compareTo(prev_school) != 0)
				System.out.println(dataitem.school);
			prev_school = dataitem.school;
			System.out.printf("   %s   %s\n", dataitem.code, dataitem.title);
		}
		data.close();
	}
}

class Course implements Comparable<Course> {
	String title;
	String code;
	String school;
	
	public Course(String data_title, String data_code, String data_school) {
		title = data_title;
		code = data_code;
		school = data_school;
	}
	
	public int compareTo(Course c) {
		int check_school = this.school.compareTo(c.school);
		int check_code = this.code.compareTo(c.code);
		if (check_school == 0) return check_code;
		else return check_school;
	}
}
