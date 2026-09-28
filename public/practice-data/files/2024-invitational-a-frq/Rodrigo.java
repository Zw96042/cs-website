/*
 * UIL Computer Science 2024
 * Invitational A Packet Solution
 */

import java.io.*;
import java.util.*;

public class Rodrigo {
	public static void main(String[]args)throws Exception{
		new Rodrigo().run();
	}
	public void run()throws Exception{
		Scanner file=new Scanner(new File("rodrigo.dat"));
		int c = file.nextInt(), f = file.nextInt();
		int price = file.nextInt();
		file.nextLine();
		ArrayList<City> dests = new ArrayList<City>();
		ArrayList<String> cities = new ArrayList<String>();
		int[][] connect = new int[c+1][c+1];
		int[] visit = new int[c+1];
		Arrays.fill(visit, Integer.MAX_VALUE);
		Queue<Integer> qu = new LinkedList<Integer>();
		for(int y = 0; y < c; y++) {
			String n = file.next();
			cities.add(n);
			double t = file.nextDouble();
			double p = file.nextDouble();
			int a = file.nextInt();
			double cr = file.nextDouble();
			file.nextLine();
			dests.add(new City(n, p, cr, t, a));
		}
		Collections.sort(cities);
		cities.add(0, "Dallas");
		for(int y = 0; y < f; y++) {
			String a = file.next();
			String b = file.next();
			int p = file.nextInt();
			int ai = cities.indexOf(a), 
					bi = cities.indexOf(b);
			connect[ai][bi] = connect[bi][ai] = p;
		}
		qu.add(0);qu.add(0);
		while(!qu.isEmpty()) {
			int cpr = qu.poll();
			int ind = qu.poll();
			if(cpr > price || visit[ind] <= cpr)
				continue;
			visit[ind] = cpr;
			for(int k = 0; k < c+1; k++) {
				if(connect[ind][k] != 0) {
					qu.add(cpr + connect[ind][k]);
					qu.add(k);
				}
			}
			//System.out.println(qu);
		}
		//System.out.println(Arrays.toString(visit));
		//System.out.println(cities);
		//System.out.println(Arrays.deepToString(connect));
		for(int y = 1; y < c + 1; y++) {
			if(visit[y] > price)
				rem(dests, cities.get(y));
		}
		Collections.sort(dests);
		int num = 0;
		while(num++ < dests.size()) 
			System.out.println((num)+": "+dests.get(num-1));
	}
	public void rem(ArrayList<City> c, String h) {
		for(int y = 0; y < c.size(); y++)
			if(c.get(y).name.equals(h)) {
				c.remove(y);
				y--;
			}
	}
}
class City implements Comparable<City>{
	String name;
	double price, crtg, trtg;
	int att;

	public City(String n, double p, double c, double t, int a) {
		name = n;
		price = p;
		crtg = c;
		trtg = t;
		att = a;
	}

	public int compareTo(City c) {
		if(c.att != att) return c.att - att;
		if(c.crtg != crtg) return comp(c.crtg, crtg);
		if(c.price != price) return comp(price, c.price);
		if(c.trtg != trtg) return comp(c.trtg, trtg);
		return name.compareTo(c.name);
	}

	public int comp(double a, double b) {
		if(Math.abs(a-b) <= 1e-6) return 0;
		else if(a > b) return 1;
		else return -1;
	}

	public String toString() {
		return name;
	}
}
