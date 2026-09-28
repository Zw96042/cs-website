/*
 * UIL Computer Science 2024
 * Invitational B Packet Solution
 */

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.Queue;

public class Prateek {
	public static void main(String[] args) throws IOException {
		new Prateek().run();
	}

	public void run() throws IOException {
		BufferedReader file = new BufferedReader(new FileReader("prateek.dat"));
		PrintWriter out = new PrintWriter(System.out);

		int numTimes = Integer.parseInt(file.readLine());
		while(numTimes-->0) {
			int[] arr = Arrays.stream(file.readLine().split(" ")).map(str -> Integer.parseInt(str)).mapToInt(Integer::intValue).toArray();
			solve(out, arr);
		}

		file.close();
		out.close();
	}

	public void solve(PrintWriter out, int[] arr) {
		HashMap<Integer, ArrayList<Integer>> depthToSet = new HashMap<Integer, ArrayList<Integer>>();
		Queue<int[]> toSearch = new LinkedList<int[]>();
		toSearch.add(new int[] {0, arr.length-1, (arr.length-1)/2, 1});

		while(!toSearch.isEmpty()) {
			int[] state = toSearch.poll();
			int l = state[0], r = state[1], m = state[2], depth = state[3];

			ArrayList<Integer> set = depthToSet.containsKey(depth) ? depthToSet.get(depth) : new ArrayList<Integer>();
			set.add(arr[m]);
			depthToSet.put(depth, set);

			// Left Search
			if(l <= m-1) {
				toSearch.add(new int[] {l, m-1, (l + m - 1)/2, depth+1});
			}

			// Right Search
			if(m+1 <= r) {
				toSearch.add(new int[] {m+1, r, (m + 1 + r)/2, depth+1});
			}
		}
		
		out.printf("List: %s\n", Arrays.toString(arr).replaceAll("[\\[\\],]", ""));
		for(int i = 1; depthToSet.containsKey(i); i++) {
			out.printf("%d-iterations: %s\n", i, depthToSet.get(i).toString().replaceAll("[\\[\\],]", ""));
		}
		out.println();
	}
}
