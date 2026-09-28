import java.io.*;
import static java.lang.System.*;
import java.lang.*;
import java.util.*;
import java.math.*;
import java.text.*;
public class Liz {
	
	public void run() throws Exception{
		Scanner file = new Scanner(new File("liz.dat"));
		int times = file.nextInt();
		file.nextLine();
		while(times-- > 0) {
			String s = file.nextLine();
			int n = s.length();
	        int[] dp = new int[n];
	        for (int l = n - 2; l >= 0; l--) {
	            int prev = 0; 
	            for (int h = l + 1; h < n; h++) {
	                int temp = dp[h]; 
	                if (s.charAt(l) == s.charAt(h)) 
	                    dp[h] = prev; 
	                else
	                    dp[h] = Math.min(dp[h], dp[h - 1]) + 1; 
	                prev = temp; 
	            }
	        }
	        System.out.println(dp[n - 1]);
		}
	}
	
	public static void main(String[]args)throws Exception{
		new Liz().run();
	}
}
