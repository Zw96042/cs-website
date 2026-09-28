/*
 * UIL Computer Science 2024
 * Invitational B Packet Solution
 */

import java.io.*;
import java.util.*;

public class Sofia {
	public static void main(String[]args)throws Exception{
		new Sofia().run();
	}
	public void run()throws Exception{
			Scanner file=new Scanner(new File("sofia.dat"));
			int f = file.nextInt(), n = file.nextInt();
			file.nextLine();
			ArrayList<String> cities = new ArrayList<String>(); 
			ArrayList<String[]> flights = new ArrayList<String[]>();
			for(int y = 0; y < f; y++) {
				String[] s = file.nextLine().trim().split("\\s+");
				if(!cities.contains(s[0]))cities.add(s[0]);
				if(!cities.contains(s[1]))cities.add(s[1]);
				flights.add(s);
			}
			Collections.sort(cities);
			int[][] mat = new int[cities.size()][cities.size()];
			for(String[] s: flights)
				mat[cities.indexOf(s[0])][cities.indexOf(s[1])] = 
				mat[cities.indexOf(s[1])][cities.indexOf(s[0])] = 
				Integer.parseInt(s[2]);
			while(n-- > 0) {
				int[] visit = new int[mat.length];
				Arrays.fill(visit, Integer.MAX_VALUE);
				Queue<Integer> qu = new LinkedList<Integer>();
				String[] str = file.nextLine().trim().split("\\s+");
				int cost = Integer.parseInt(str[2]);
				int st = cities.indexOf(str[0]);
				int end = cities.indexOf(str[1]);
				qu.add(st);qu.add(0);
				while(!qu.isEmpty()) {
					int ind = qu.poll();
					int cur = qu.poll();
					if(visit[ind] <= cur || cur > cost)
						continue;
					visit[ind] = cur;
					for(int y = 0; y < mat.length; y++)
						if(mat[y][ind] != 0) {
							qu.add(y);
							qu.add(cur + mat[y][ind]);
						}
				}
				if(visit[end] != Integer.MAX_VALUE)
					System.out.println(cities.get(end)+" is always a good idea.");
				else
					System.out.println("There's no place like home.");
			}
	}
}
