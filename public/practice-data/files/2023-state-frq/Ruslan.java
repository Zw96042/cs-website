/*
 * UIL Computer Science 2023
 * State Packet Solution
 */

import java.io.*;
import java.util.*;

public class Ruslan {
	boolean[][]con;
	int V;
	public static void main(String[]args)throws Exception{
		new Ruslan().run();
	}
	public void run()throws Exception{
		Scanner file=new Scanner(new File("ruslan.dat"));
		int times=file.nextInt();
		file.nextLine();
		while(times-->0) {
			String next=file.nextLine().trim();
			ArrayList<String>names=new ArrayList<String>();
			ArrayList<String>cons=new ArrayList<String>();
			while(!next.equals("=====")) {
				cons.add(next);
				String[] n=next.split(" ");
				if(!names.contains(n[0]))names.add(n[0]);
				if(!names.contains(n[1]))names.add(n[1]);
				next=file.nextLine().trim();
			}
			V=names.size();
			con=new boolean[names.size()][names.size()];
			int orig=names.indexOf("You");
			int ruslan=names.indexOf("Ruslan");
			for(String h:cons) {
				String[] n=h.split(" ");
				con[names.indexOf(n[0])][names.indexOf(n[1])]=con[names.indexOf(n[1])][names.indexOf(n[0])]=true;
			}
			System.out.println(pc(orig,ruslan));
		}
	}
	public int pc(int a, int d) {
		int p = 0;
		p=paths(a, d, new boolean[V]);
		return p;
	}
	public int paths(int curr, int end, boolean[] visit) {
		if(visit[curr])return 0;
		if(curr == end)return 1;
		visit[curr]=true;
		int tot=0;
		for(int y=0;y<V;y++) {
			if(con[curr][y])
				tot+=paths(y,end,visit);
		}
		visit[curr]=false;
		return tot;
	}
}
