import java.io.*;
import static java.lang.System.*;
import java.lang.*;
import java.util.*;
import java.math.*;
import java.text.*;
public class Julia {
	
	public void run() throws Exception{
		Scanner file = new Scanner(new File("julia.dat"));
		int times = file.nextInt();
		file.nextLine();
		while(times-- > 0) {
			ArrayList<ArrayList<Integer>> a;
			a = new ArrayList<>();
			int m = file.nextInt(), c = file.nextInt();
			for(int i = 0; i < m; i++)
				a.add(new ArrayList<Integer>());
			while(c-- > 0) {
				int s = file.nextInt(), e = file.nextInt();
				file.nextLine();
				a.get(s).add(e);
			}
			boolean cycle = isCyclic(a);
			if(cycle)System.out.println("Lizn't that interesting.");
			else System.out.println("Juliain't gonna beat me.");
		}
	}
	
	boolean isCyclic(ArrayList<ArrayList<Integer>> adj){
        int V = adj.size();
        int[] inDegree = new int[V]; 
        Queue<Integer> q = new LinkedList<>(); 
        int visited = 0;           
        for (int u = 0; u < V; ++u)
            for (int v : adj.get(u))
                inDegree[v]++;
        for (int u = 0; u < V; ++u)
            if (inDegree[u] == 0)
                q.add(u);
        while (!q.isEmpty()){
            int u = q.poll();
            visited++;
            for (int v : adj.get(u)){
                inDegree[v]--;
                if (inDegree[v] == 0)
                    q.add(v);
            }
        }
        return visited != V;
    }
	
	public static void main(String[]args)throws Exception{
		new Julia().run();
	}
}
