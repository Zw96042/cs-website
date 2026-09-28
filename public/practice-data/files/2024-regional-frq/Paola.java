/*
 * UIL Computer Science 2024
 * Region Packet Solution
 */

import java.io.*;
import java.util.*;

public class Paola {
	public static void main(String[]args)throws Exception{
		new Paola().run();
	}

	ArrayList<ArrayList<Integer>> mat;

	public void run()throws Exception{
		Scanner file=new Scanner(new File("paola.dat"));
		int times=file.nextInt();
		file.nextLine();
		while(times-->0) {
			int rr = file.nextInt(), cc = file.nextInt(), n = file.nextInt();
			//System.out.println(rr+" "+cc+" "+n);
			file.nextLine();
			mat = new ArrayList<ArrayList<Integer>>();
			for(int r = 0; r < rr; r++) {
				ArrayList<Integer> a = new ArrayList<Integer>();
				for(int c = 0; c < cc; c++)
					a.add(file.nextInt());
				mat.add(a);
				file.nextLine();
			}
			while(n-- > 0) {
				String com = file.next();
				//System.out.println(com);
				switch(com) {
				case "DELCOL":dc(file.nextInt());file.nextLine();break;
				case "DELROW":dr(file.nextInt());file.nextLine();break;
				case "GETCOL":gc(file.nextInt());file.nextLine();break;
				case "GETROW":gr(file.nextInt());file.nextLine();break;
				case "ROTROW":rr(file.nextInt(), file.nextInt());file.nextLine();break;
				case "ROTCOL":rc(file.nextInt(), file.nextInt());file.nextLine();break;
				case "ADDROW":ar(file.nextInt(), file.nextLine());break;
				case "ADDCOL":ac(file.nextInt(), file.nextLine());break;
				case "SETVAL":sv(file.nextInt(), file.nextInt(), file.nextInt());file.nextLine();break;
				}
				//print();
			}
			print();
			if(times != 0)
				System.out.println("----------");
		}
	}

	public void print() {
		for(int r = 0; r < mat.size(); r++) {
			String f = "";
			for(int c = 0; c < mat.get(r).size(); c++)
				f += mat.get(r).get(c) + " ";
			System.out.println(f.trim());
		}
		//System.out.println("----------");
	}

	public void dr(int i) {
		if(i < 0 || i >= mat.size()) {
			System.out.println("INDEX OUT OF BOUNDS.");
			return;
		}
		mat.remove(i);
	}

	public void dc(int i) {
		if(i < 0 || i >= mat.get(0).size()) {
			System.out.println("INDEX OUT OF BOUNDS.");
			return;
		}
		for(int r = 0; r < mat.size(); r++)
			mat.get(r).remove(i);
	}

	public void gr(int i) {
		if(i < 0 || i >= mat.size()) {
			System.out.println("INDEX OUT OF BOUNDS.");
			return;
		}
		System.out.println(mat.get(i));
	}

	public void gc(int i) {
		if(i < 0 || i >= mat.get(0).size()) {
			System.out.println("INDEX OUT OF BOUNDS.");
			return;
		}
		ArrayList<Integer> a = new ArrayList<Integer>();
		for(int r = 0; r < mat.size(); r++)
			a.add(mat.get(r).get(i));
		System.out.println(a);
	}

	public void rr(int i, int n) {
		if(i < 0 || i >= mat.size()) {
			System.out.println("INDEX OUT OF BOUNDS.");
			return;
		}
		Collections.rotate(mat.get(i), n);
	}

	public void rc(int i, int n) {
		if(i < 0 || i >= mat.get(0).size()) {
			System.out.println("INDEX OUT OF BOUNDS.");
			return;
		}
		ArrayList<Integer> a = new ArrayList<Integer>();
		for(int r = 0; r < mat.size(); r++)
			a.add(mat.get(r).get(i));
		Collections.rotate(a, n);
		for(int r = 0; r < mat.size(); r++)
			mat.get(r).set(i, a.get(r));
	}

	public void sv(int i, int j, int n) {
		if(i < 0 || i >= mat.size() || j < 0 || j >= mat.get(i).size()) {
			System.out.println("INDEX OUT OF BOUNDS.");
			return;
		}
		mat.get(i).set(j, n);
	}

	public void ar(int i, String row) {
		if(i < 0 || i >= mat.size()) {
			System.out.println("INDEX OUT OF BOUNDS.");
			String[] r = row.trim().replaceAll("[\\[\\],]","").split("\\s+");
			ArrayList<Integer> a = new ArrayList<Integer>();
			for(String s:r)
				a.add(Integer.parseInt(s));
			if(a.size() != mat.get(0).size()) 
				System.out.println("ROW" + row + " OF INVALID LENGTH");
			return;
		}
		String[] r = row.trim().replaceAll("[\\[\\],]","").split("\\s+");
		ArrayList<Integer> a = new ArrayList<Integer>();
		for(String s:r)
			a.add(Integer.parseInt(s));
		if(a.size() != mat.get(0).size()) 
			System.out.println("ROW" + row + " OF INVALID LENGTH");
		else
			mat.add(i, a);
	}

	public void ac(int i, String col) {
		if(i < 0 || i >= mat.get(0).size()) {
			System.out.println("INDEX OUT OF BOUNDS.");
			String[] c = col.trim().replaceAll("[\\[\\],]","").split("\\s+");
			ArrayList<Integer> a = new ArrayList<Integer>();
			for(String s:c)
				a.add(Integer.parseInt(s));
			if(a.size() != mat.size()) 
				System.out.println("COLUMN" + col + " OF INVALID LENGTH");
			return;
		}
		String[] c = col.trim().replaceAll("[\\[\\],]","").split("\\s+");
		ArrayList<Integer> a = new ArrayList<Integer>();
		for(String s:c)
			a.add(Integer.parseInt(s));
		if(a.size() != mat.size()) 
			System.out.println("COLUMN" + col + " OF INVALID LENGTH");
		else
			for(int r = 0; r < mat.size(); r++)
				mat.get(r).add(i, a.get(r));
	}
}
