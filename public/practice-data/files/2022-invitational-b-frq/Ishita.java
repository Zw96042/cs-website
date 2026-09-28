import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;

public class Ishita {
	
	public static void main(String[] args) throws FileNotFoundException
	{
		new Ishita().run();
	}
	
	public void run() throws FileNotFoundException
	{
		Scanner file = new Scanner(new File("ishita.dat"));
		int T = file.nextInt();
	loop:
		for(int zz = 0;zz<T;zz++)
		{
			char[] chars = file.next().toCharArray();
			int ans = 0;
			int ct = 0;
			for(char ch: chars)
			{
				if(ch == ')')
				{
					ct--;
					if(ct < 0)
					{
						System.out.println(0);
						continue loop;
					}else if(ct == 0)
					{
						ans++;
					}
				}else {
					ct++;
				}
			}
			if(ct != 0)
			{
				System.out.println(0);
				continue loop;
			}
			System.out.println((1 << ans - 1) - 1);
		}
	}
	
}
