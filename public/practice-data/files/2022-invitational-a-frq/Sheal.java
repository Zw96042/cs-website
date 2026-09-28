import java.io.File;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.Scanner;

public class Sheal {
	
	public static void main(String[] args) throws FileNotFoundException
	{
		int[] fib = new int[21];
		fib[0] = fib[1] = 1;
		for(int i = 2;i<fib.length;i++)
			fib[i] = fib[i-1] + fib[i-2];
		Scanner file = new Scanner(new File("sheal.dat"));
		int T = file.nextInt();
		for(int casenum = 0;casenum<T;casenum++)
		{
			char[] options = file.next().toCharArray();
			int K = file.nextInt();
			HashSet<String> strs = new HashSet<String>();
			bruteForce(options, new boolean[options.length], "", strs);
			ArrayList<String> sorted = new ArrayList<String>();
			sorted.addAll(strs);
			Collections.sort(sorted);
			System.out.println(sorted.get(K));
		}
	}
	
	public static void bruteForce(char[] options, boolean[] used, String current, HashSet<String> strs)
	{
		strs.add(current);
		for(int i = 0;i<options.length;i++)
		{
			if(!used[i])
			{
				used[i] = true;
				bruteForce(options, used, current+options[i], strs);
				used[i] = false;
			}
		}
	}
	
}
