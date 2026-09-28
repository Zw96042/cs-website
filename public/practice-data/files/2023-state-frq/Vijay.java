/*
 * UIL Computer Science 2023
 * State Packet Solution
 */

import java.io.*;
import java.util.*;

public class Vijay {
	char[][][]mat;
	int[][][][]smat;
	int[][]v=new int[3][6];
	public static void main(String[]args)throws Exception{
		new Vijay().run();
	}
	public void run() throws Exception{
		Scanner file=new Scanner(new File("vijay.dat"));
		int times=file.nextInt();
		v[0]= new int[]{1,-1,0,0,0,0};
		v[1]= new int[]{0,0,-1,1,0,0};
		v[2]= new int[]{0,0,0,0,-1,1};
		file.nextLine();
		while(times-->0) {
			int h=file.nextInt(), rr=file.nextInt(), cc=file.nextInt(), o=file.nextInt(), s=file.nextInt();
			file.nextLine();
			int sr=-1, sc=-1, sh=-1, objcnt=0;
			ArrayList<Integer>a=new ArrayList<Integer>();
			mat=new char[h][rr][cc];
			smat=new int[1<<o][h][rr][cc];
			for(int hhh=0;hhh<h;hhh++) {
				for(int r=0;r<rr;r++) {
					mat[hhh][r]=file.nextLine().trim().toCharArray();
					for(int c=0;c<cc;c++)
						if(mat[hhh][r][c]=='S') {
							sr=r;sc=c;sh=hhh;
						}
						else if (mat[hhh][r][c]=='E') {
							a.add(hhh);a.add(r);a.add(c);
						}
						else if (mat[hhh][r][c]=='O')
							mat[hhh][r][c]=(char)(objcnt++);
					for(int y=0;y<smat.length;y++)
						Arrays.fill(smat[y][hhh][r], Integer.MAX_VALUE);
				}
			}
			solve(sh, sr, sc, 0, 0);
			/*for(char[][]m:mat)
				for(char[]r:m)
					System.out.println(r);//*/
			/*for(int[][][]l:smat) {
				for(int[][]m:l)
					for(int[]n:m) {
						String rer="";
						for(int r:n)
							rer+=r+" ";
						System.out.println(rer.trim());
					}
				System.out.println("!@#$%^&%$#@!@#$%^&*&^%$#!@#$%^&*&^%$#@!@#$%^&*(*&^%$#@#$%^&");
			}//*/
			int min=Integer.MAX_VALUE;
			while(a.size()>=3) 
				min=Math.min(min, smat[smat.length-1][a.remove(0)][a.remove(0)][a.remove(0)]);
			System.out.println(min>s?"None shall pass.":"# of steps achieved: "+min);
		}
	}
	public void solve(int h, int r, int c, int o, int s) {
		//System.out.println(3);
		if(h<0 || h>=mat.length || o<0 || o>=smat.length || r<0 || r>=mat[h].length 
				|| c<0 || c>=mat[h][r].length || mat[h][r][c]=='#' || smat[o][h][r][c]<=s)return;
		smat[o][h][r][c]=s;
		if(mat[h][r][c]<12) o|= 1 << mat[h][r][c];
		smat[o][h][r][c]=s++;
		for(int y=0;y<6;y++)
			solve(h+v[0][y], r+v[1][y], c+v[2][y], o, s);
	}
}
