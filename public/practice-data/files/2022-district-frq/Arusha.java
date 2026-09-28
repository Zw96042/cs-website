import java.io.File;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Scanner;

public class Arusha {
	
	public static void main(String[] args) throws FileNotFoundException
	{
		Scanner file = new Scanner(new File("arusha.dat"));
		int T = file.nextInt();
		for(int z = 0;z<T;z++)
		{
			String s = file.next();
			char[] I = file.next().toCharArray();
			int l = 0;
			for(int i = 0;i<I.length;i++)
			{
				if(I[i] == 'L')
					l++;
				else
					l += s.length() - 1;
			}
			l %= s.length();
			System.out.println(s.substring(l)+s.substring(0,l));
		}
	}
	
}
