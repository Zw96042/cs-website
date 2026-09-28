/*
 * UIL Computer Science 2023
 * District Packet Solution
 */

import java.io.*;
import java.util.*;

public class Liza {

	public static void main(String[]args)throws Exception{
		Scanner file=new Scanner(new File("liza.dat"));
		int times=file.nextInt();
		file.nextLine();
		while(times-->0) {
			String title = file.nextLine().trim();
			int stud = file.nextInt();
			file.nextLine();
			ArrayList<Student> a=new ArrayList<Student>();
			while(stud-->0) 
				a.add(new Student(file.nextLine().trim()));
			Collections.sort(a);
			System.out.println(title);
			double mean = mean(a);
			double median = median(a);
			System.out.println(a.remove(0));
			System.out.println(a.remove(0));
			System.out.println(a.remove(0));
			System.out.printf("MEAN SCORE: %.2f%n",mean);
			System.out.printf("MEDIAN SCORE: %.1f%n",median);
			if(times!=0)System.out.println();
		}
	}
	
	static double mean(ArrayList<Student> s) {
		double tot=0;
		for(Student st:s) 
			tot+=st.score;
		tot/=s.size();
		return tot;
	}
	
	static double median(ArrayList<Student> s) {
		if(s.size()%2==0) 
			return ((double)(s.get(s.size()/2).score)+s.get(s.size()/2-1).score)/2;
		else 
			return (double)s.get(s.size()/2).score;
	}
}
class Student implements Comparable<Student>{
	int score;
	String fname, lname;
	public Student(String k) {
		String[] temp = k.split(",");
		fname = temp[1];
		lname = temp[0];
		score = Integer.parseInt(temp[2]);
	}
	public int compareTo(Student s) {
		if(score !=s.score)return s.score-score;
		if(!lname.equals(s.lname))return lname.compareTo(s.lname);
		return fname.compareTo(s.fname);
	}
	public String toString() {
		return fname+" "+lname+": "+score;
	}
}
