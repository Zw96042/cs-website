/*
 * UIL Computer Science 2023
 * State Packet Solution
 */

import java.io.*;
import java.util.*;

public class Mohit {
	public static void main(String[]args)throws Exception{
		Scanner file=new Scanner(new File("mohit.dat"));
		int apps=file.nextInt(), jobs=file.nextInt();
		file.nextLine();
		ArrayList<Applicant>a=new ArrayList<Applicant>();
		while(apps-->0) {
			String[] next=file.nextLine().trim().split("; ");
			String name=next[0].substring(next[0].indexOf(": ")+2);
			String field = "None";
			int level = 0;
			TreeMap<String, Integer> tm = new TreeMap<String, Integer>();
			ArrayList<String>awards = new ArrayList<String>();
			if(!next[1].contains("None")) {
				String[] ed=next[1].split(" ");
				field=ed[3];
				level = lev(ed[1]);
			}
			if(!next[2].contains("None")) {
				String[] ski = next[2].split(", ");
				for(String s:ski) {
					String na = s.substring(0, s.indexOf(":"));
					int num = Integer.parseInt(s.split(":")[1].split(" ")[1]);
					tm.put(na,  num);
				}
			}
			if(!next[3].contains("None")) {
				String[] ski = next[3].split("[:,]+");
				for(int y=1;y<ski.length;y++)
					awards.add(ski[y].trim());
			}
			a.add(new Applicant(name, field, level, tm, awards));
		}
		while(jobs-->0) {
			String[] next=file.nextLine().trim().split("; ");
			String name=next[0].substring(next[0].indexOf(": ")+2);
			String field = "None";
			int level = 0;
			TreeMap<String, Integer> tm = new TreeMap<String, Integer>();
			ArrayList<String>awards = new ArrayList<String>();
			if(!next[1].contains("None")) {
				String[] ed=next[1].split(" ");
				field=ed[3];
				level = lev(ed[1]);
			}
			if(!next[2].contains("None")) {
				String[] ski = next[2].split(", ");
				for(String s:ski) {
					String na = s.substring(0, s.indexOf(":"));
					int num = Integer.parseInt(s.split("[: ]+")[1]);
					tm.put(na,  num);
				}
			}
			if(!next[3].contains("None")) {
				String[] ski = next[3].split("[:,]+");
				for(int y=0;y<ski.length;y++)
					awards.add(ski[y].trim());
			}
			Job j=new Job(name, field, level, tm ,awards);
			ArrayList<Applicant> qual = new ArrayList<Applicant>();
			for(Applicant app : a) {
				if(check(app, j)) {
					app.set_skill_score(j);
					qual.add(app);
				}
			}
			Collections.sort(qual);
			System.out.println(name+":");
			if(qual.size()==0)
				System.out.println("No Applicants meet Requirements.");
			else
				for(int y=1;y<=3 && y<=qual.size();y++)
					System.out.println(y+": "+qual.get(y-1).name);
			System.out.println();
		}
	}
	static boolean check(Applicant a, Job j) {
		boolean b=a.field.equals(j.field) || j.field.equals("None");
		b&= a.education>=j.education;
		for(String h:j.skills.keySet())
			b &= a.skills.containsKey(h) && a.skills.get(h) >= j.skills.get(h);
		for(String h:j.awards)
			b &= a.awards.contains(h);
		return b;
	}
	static int lev(String h) {
		if(h.equals("Bachelor's"))return 1;
		if(h.equals("Master's"))return 2;
		if(h.equals("PhD"))return 3;
		return 0;
	}
}
class Applicant implements Comparable<Applicant>{
	public int skill_score;
	String name, field;
	int education;
	TreeMap<String,Integer> skills;
	ArrayList<String> awards;
	public Applicant(String n, String e, int ed, TreeMap<String,Integer> skl, ArrayList<String> aws) {
		name=n;
		field=e;
		education=ed;
		skills=skl;
		awards=aws;
	}
	public int compareTo(Applicant a) {
		if(a.education!=education)return a.education-education;
		if(a.skill_score!=skill_score)return a.skill_score-skill_score;
		return name.compareTo(a.name);
	}
	public void set_skill_score(Job j) {
		int sum=0;
		for(String h:j.skills.keySet()) 
			sum+=skills.get(h) - j.skills.get(h);
		skill_score=sum;
	}
	public String toString() {
		String s=name +"\n";
		s+=education + " "+field+"\n";
		s+=skills+"\n";
		s+=awards+"\n";
		return s;
	}
}
class Job{
	String name;
	String field;
	int education;
	TreeMap<String, Integer>skills;
	ArrayList<String> awards;
	public Job(String n, String f, int e, TreeMap<String, Integer>sk, ArrayList<String> aws) {
		name=n;
		field=f;
		education=e;
		skills=sk;
		awards=aws;
	}
	public String toString() {
		String s=name +"\n";
		s+=education + " "+field+"\n";
		s+=skills+"\n";
		s+=awards+"\n";
		return s;
	}
}