/*
 * UIL Computer Science 2023
 * Invitational A Packet Solution
 */

import java.io.*;
import java.lang.*;
import java.util.*;
import java.math.*;
public class Gael {
	public static void main(String[]args)throws Exception{
		Scanner file=new Scanner(new File("gael.dat"));
		int times=file.nextInt();
		file.nextLine();
		while(times-->0) {
			String s=file.nextLine().trim();
			char[][]mat=new char[s.length()][s.length()];
			for(int i=0;i<s.length();i++)
				Arrays.fill(mat[i], ' ');
			for(int i=0;i<s.length();i++) {
				int j=s.length()-i-1;
				mat[i][0]=mat[j+i][j]=mat[0][i]=mat[j][j+i]=s.charAt(i);
			}
			for(char[] c:mat) {
				System.out.println(c);
			}
		}
	}
}
