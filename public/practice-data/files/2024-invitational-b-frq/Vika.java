/*
 * UIL Computer Science 2024
 * Invitational B Packet Solution
 */

import java.io.*;
import java.util.*;

public class Vika {
	public static void main(String[]args)throws Exception{
		new Vika().run();
	}
	
	public int lcs(String text1, String text2) {
        int n = text1.length();
        int m = text2.length();
        int[] prev = new int[m + 1];
        int[] cur = new int[m + 1];
        for (int idx1 = 1; idx1 < n + 1; idx1++) {
            for (int idx2 = 1; idx2 < m + 1; idx2++) {
                if (text1.charAt(idx1 - 1) == text2.charAt(idx2 - 1))
                    cur[idx2] = 1 + prev[idx2 - 1];
                else
                    cur[idx2] = Math.max(cur[idx2 - 1], prev[idx2]);
            }
            prev = Arrays.copyOf(cur, m + 1);
        }
        return cur[m];
    }
    
	public void run()throws Exception{
		Scanner file=new Scanner(new File("vika.dat"));
		int times=file.nextInt();
		file.nextLine();
		while(times-->0) {
			String a = file.next();
			String b = file.next();
			file.nextLine();
			int lcs = lcs(a, b);
			System.out.println(lcs);
		}
	}
}
