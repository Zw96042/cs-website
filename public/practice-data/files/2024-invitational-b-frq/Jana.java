/*
 * UIL Computer Science 2024
 * Invitational B Packet Solution
 */

import java.io.*;
import java.util.*;

public class Jana {
	public static void main(String[]args)throws Exception{
		new Jana().run();
	}
	public void run()throws Exception{
		Scanner file=new Scanner(new File("jana.dat"));
		int times=file.nextInt();
		file.nextLine();
		while(times-->0) {
			int i = file.nextInt();
			file.nextLine();
			char[][] mat = new char[i][i];
			for(int y = 0; y < i; y ++)
				Arrays.fill(mat[y], ' ');
			int n = 0;
			while(n <= i / 2) {
				for(int y = n; y < i - n; y++)
					mat[y][n] = mat[n][y] = mat[y][i - n - 1] = mat[i - n - 1][y] = '#';
				n += 2;
			}
			for(char[] c:mat)
				System.out.println(c);
		}
	}
}
