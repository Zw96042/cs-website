import java.io.File;
import java.io.FileNotFoundException;
import java.util.LinkedList;
import java.util.Queue;
import java.util.Scanner;

public class Rhea {
	
	public static void main(String[] args) throws FileNotFoundException
	{
		new Rhea().run();
	}
	
	char[][] chars;
	int[][] d = new int[][] {{0,1,0,-1},{1,0,-1,0}};
	
	public void run() throws FileNotFoundException
	{
		Scanner file = new Scanner(new File("rhea.dat"));
		int T = file.nextInt();
		for(int zz = 0;zz<T;zz++)
		{
			int R = file.nextInt();
			int C = file.nextInt();file.nextLine();
			chars = new char[R][C];
			for(int i = 0;i<chars.length;i++)
			{
				chars[i] = file.nextLine().toCharArray();
			}
			int[] S = find('*');
			int[] E = find('#');
			chars[S[0]][S[1]] = 'R';
			chars[E[0]][E[1]] = 'V';
			boolean[][] vis = new boolean[R][C];
			Queue<Integer> que = new LinkedList<Integer>();
			que.add(S[0]);
			que.add(S[1]);
			while(!que.isEmpty())
			{
				int r = que.poll();
				int c = que.poll();
				vis[r][c] = true;
				for(int i = 0;i<4;i++)
				{
					int rr = r+d[0][i];
					int cc = c+d[1][i];
					if(trans(r,c,rr,cc) && !vis[rr][cc])
					{
						vis[rr][cc] = true;
						que.add(rr);
						que.add(cc);
					}
				}
			}
			boolean possible = vis[E[0]][E[1]];
			System.out.println(possible?"yes":("no"));
		}
	}
	
	public boolean trans(int r1, int c1, int r2, int c2)
	{
		if(!valid(r1,c1) || !valid(r2, c2))
			return false;
		char color1 = chars[r1][c1];
		char color2 = chars[r2][c2];
		String index = "ROYGBIV";
		return color1 == color2 || index.indexOf(color1) + 1 == index.indexOf(color2); 
	}
	
	public boolean valid(int r, int c) {
		return Math.min(r, c) >= 0 && r < chars.length && c < chars[r].length;
	}
	
	public int[] find(char ch)
	{
		for(int i = 0;i<chars.length;i++)
		{
			for(int j = 0;j<chars[i].length;j++)
			{
				if(chars[i][j] == ch)
				{
					return new int[] {i,j};
				}
			}
		}
		return null;
	}
	
/*
1
5 5
VVVV*
VVGYO
GOBRR
OVIOO
#RBBB
 */
	
}
