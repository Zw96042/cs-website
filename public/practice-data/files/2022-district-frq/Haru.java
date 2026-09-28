import java.io.File;
import java.io.FileNotFoundException;
import java.util.HashSet;
import java.util.Scanner;

public class Haru {
	
	static String key = "UDLR";
	static int[][] d = new int[][] {{0,0,-1,1},{1,-1,0,0}};
	
	public static void main(String[] args) throws FileNotFoundException
	{
		Scanner file = new Scanner(new File("haru.dat"));
		int T = file.nextInt();
	loop:
		for(int z = 0;z<T;z++)
		{
			int N = file.nextInt();
			int X1 = file.nextInt();
			int Y1 = file.nextInt();
			char[] instr1 = file.next().toCharArray();
			int X2 = file.nextInt();
			int Y2 = file.nextInt();
			char[] instr2 = file.next().toCharArray();
			HashSet<String> spikes = new HashSet<String>();
			for(int i = 0;i<N;i++)
			{
				String current1 = X1 + " " + Y1;
				String current2 = X2 + " " + Y2;
				spikes.add(current1);
				spikes.add(current2);
				int dir1 = key.indexOf(instr1[i]);
				int nX1 = X1 + d[0][dir1];
				int nY1 = Y1 + d[1][dir1];
				int dir2 = key.indexOf(instr2[i]);
				int nX2 = X2 + d[0][dir2];
				int nY2 = Y2 + d[1][dir2];
				if(nX1 == X2 && nY1 == Y2 && nX2 == X1 && nY2 == Y1)
				{
					System.out.println("HEAD ON");
					continue loop;
				}
				if(nX1 == nX2 && nY1 == nY2)
				{
					System.out.println("HEAD ON");
					continue loop;
				}
				String next1 = nX1 + " " + nY1;
				String next2 = nX2 + " " + nY2;
				boolean p1crash = false;
				boolean p2crash = false;
				if(spikes.contains(next1) || bad(nX1) || bad(nY1))
				{
					p1crash = true;
				}
				if(spikes.contains(next2) || bad(nX2) || bad(nY2))
				{
					p2crash = true;
				}
				if(p1crash && p2crash)
				{
					System.out.println("DOUBLE SPIKE");
					continue loop;
				}else if(p1crash)
				{
					System.out.println("P2 WIN");
					continue loop;
				}else if(p2crash)
				{
					System.out.println("P1 WIN");
					continue loop;
				}
				X1 = nX1;
				Y1 = nY1;
				X2 = nX2;
				Y2 = nY2;
			}
			System.out.println("DRAW");
		}
	}
	
	public static boolean bad(int x)
	{
		return x < 0 || x > 100;
	}
	
}
