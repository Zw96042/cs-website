import java.io.File;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Scanner;

public class Diego {
	
	public static void main(String[] args) throws FileNotFoundException
	{
		Scanner file = new Scanner(new File("diego.dat"));
		int T = file.nextInt();
		for(int z = 0;z<T;z++)
		{
			int N = file.nextInt();
			int M = file.nextInt();
			ArrayList<char[]> list = new ArrayList<>();
			generate(new char[N], 0, list);
			boolean[] bad = new boolean[list.size()];
			for(int i = 0;i<M;i++)
			{
				char[] guess = file.next().toCharArray();
				int present = file.nextInt();
				int correct = file.nextInt();
				for(int j = 0;j<list.size();j++)
				{
					char[] code = list.get(j);
					int p = present(guess, code);
					int c = correct(guess, code);
					if(present != p || correct != c) {
						bad[j] = true;
					}
				}
			}
			int good = 0;
			for(boolean b: bad)
			{
				if(!b)
					good++;
			}
			System.out.println(good);
		}
	}
	
	public static void genData(int N)
	{
		for(int i = 0;i<N;i++)
		{
			int digits = (int)(Math.random() * 6 + 1);
			ArrayList<char[]> codes = new ArrayList<char[]>();
			generate(new char[digits], 0, codes);
			char[] code = codes.get((int)(Math.random() * codes.size()));
			int observations = (int)(Math.random() * 10 + 1);
			System.out.println(digits+" "+observations);
			for(int j = 0;j<observations;j++)
			{
				char[] obs = codes.get((int)(Math.random() * codes.size()));
				System.out.println(new String(obs)+" "+present(obs, code)+" "+correct(obs, code));
			}
		}
	}
	
	public static void generate(char[] current, int index, ArrayList<char[]> list)
	{
		if(index == current.length)
		{
			list.add(current.clone());
			return;
		}
		for(int i = 0;i<10;i++)
		{
			current[index] = (char)('0' + i);
			generate(current, index + 1, list);
		}
	}
	
	public static int correct(char[] guess, char[] code)
	{
		int ans = 0;
		for(int i = 0;i<guess.length;i++)
			if(guess[i] == code[i])
				ans++;
		return ans;
	}
	
	public static int present(char[] guess, char[] code)
	{
		int[] c1 = count(guess);
		int[] c2 = count(code);
		int ans = 0;
		for(int i = 0;i< 10;i++)
			ans += Math.min(c1[i], c2[i]);
		return ans;
	}
	
	public static int[] count(char[] chars)
	{
		int[] ct = new int[10];
		for(int i = 0;i<chars.length;i++)
			ct[chars[i]-'0']++;
		return ct;
	}
	
}
